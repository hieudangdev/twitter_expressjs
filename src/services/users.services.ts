import { ObjectId } from 'mongodb'
import { UserVerifyStatus, tokenType } from '~/constants/enum'
import { RegisterReqbody, updateMeReqBody } from '~/models/request/user.request'
import RefreshTokenSchemas from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import hashPassword from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import databaseService from './database.services'
import { config } from 'dotenv'
import { update } from 'lodash'
import { USERS_MESSAGES } from '~/constants/message'
import { VerifyEmailReqbody } from './../models/request/user.request'
import { error } from 'console'
import { ErrorWithStatus } from '~/models/Errors'
import HTTPSTATUS from '~/constants/httpStatus'
import FollowerSchemas from './../models/schemas/Follower.schemas'
import Follower from './../models/schemas/Follower.schemas'

config()
class UsersServices {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: tokenType.AccessToken
      },
      secretKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN
      }
    })
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: tokenType.EmailVerifyToken
      },
      secretKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN
      }
    })
  }
  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        verify,
        token_type: tokenType.RefreshToken
      },
      secretKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN
      }
    })
  }
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async register(payload: RegisterReqbody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    console.log('email_verify_token', email_verify_token)
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `@${user_id.toString()}`,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    databaseService.refreshToken.insertOne(new RefreshTokenSchemas({ user_id: new ObjectId(user_id), token: refresh_token }))
    return {
      access_token,
      refresh_token,
      email_verify_token
    }
  }
  // check Email
  async checkEmailExits(email: string) {
    const isExits = await databaseService.users.findOne({ email })
    return Boolean(isExits)
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify
    })
    databaseService.refreshToken.insertOne(new RefreshTokenSchemas({ user_id: new ObjectId(user_id), token: refresh_token }))
    return {
      access_token,
      refresh_token
    }
  }
  async logout(refresh_token: string) {
    const result = await databaseService.refreshToken.deleteMany({ token: refresh_token })
    return result
  }
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({
        user_id: user_id.toString(),
        verify: UserVerifyStatus.Unverified
      }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])

    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }
  async resendVerifiedEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    console.log('resend Email Verified', email_verify_token)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    }
  }
  async signforgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: tokenType.ForgotPasswordToken,
        verify
      },
      secretKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FOTGOT_PASSWORD_TOKEN_EXPIRE_IN
      }
    })
  }
  async resetpassword(user_id: string, password: string) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password),
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: false,
          email_verify_token: false,
          forgot_password_token: false
        }
      }
    )
    return user
  }
  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgot_password_token = await this.signforgotPassword({ user_id, verify })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    console.log('forgot_password_token', forgot_password_token)
    // gui email kem duong link den nguoi dung {URL: 'https://twitter.com/forgot-password?token=token}
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }
  async updateMe(user_id: string, payload: updateMeReqBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...(_payload as updateMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: false,
          email_verify_token: false,
          forgot_password_token: false
        }
      }
    )

    return user.value
  }
  async follow(user_id: string, followed_user_id: string) {
    const isfollowed = await databaseService.follower.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (isfollowed === null) {
      await databaseService.follower.insertOne(
        new Follower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
      return {
        message: USERS_MESSAGES.FOLLOW_SUCCESS
      }
    }
    return {
      message: USERS_MESSAGES.FOLLOWED
    }
  }
  async getProfile(username: string) {
    const user = await databaseService.users.findOne(
      { username },
      {
        projection: {
          password: false,
          email_verify_token: false,
          forgot_password_token: false,
          updated_at: false
        }
      }
    )
    if (user === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTPSTATUS.NOT_FOUND
      })
    }
    return user
  }
}

const userServices = new UsersServices()
export default userServices
