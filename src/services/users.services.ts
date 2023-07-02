import { ObjectId } from 'mongodb'
import { tokenType } from '~/constants/enum'
import { RegisterReqbody } from '~/models/request/user.request'
import RefreshTokenSchemas from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import hashPassword from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import databaseService from './database.services'

class UsersServices {
   private signAccessToken(user_id: string) {
      return signToken({
         payload: {
            user_id,
            token_type: tokenType.AccessToken
         }
      })
   }
   private signRefreshToken(user_id: string) {
      return signToken({
         payload: {
            user_id,
            token_type: tokenType.RefreshToken
         }
      })
   }
   private signAccessAndRefreshToken(user_id: string) {
      return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
   }

   async register(payload: RegisterReqbody) {
      const result = await databaseService.users.insertOne(
         new User({
            ...payload,
            date_of_birth: new Date(payload.date_of_birth),
            password: hashPassword(payload.password)
         })
      )

      const user_id = result.insertedId.toString()
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
      databaseService.refreshToken.insertOne(
         new RefreshTokenSchemas({ user_id: new ObjectId(user_id), token: refresh_token })
      )
      return {
         access_token,
         refresh_token
      }
   }
   // check Email
   async checkEmailExits(email: string) {
      const isExits = await databaseService.users.findOne({ email })
      return Boolean(isExits)
   }

   async login(user_id: string) {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
      databaseService.refreshToken.insertOne(
         new RefreshTokenSchemas({ user_id: new ObjectId(user_id), token: refresh_token })
      )
      return {
         access_token,
         refresh_token
      }
   }
   async logout(refresh_token: string) {
      const result = await databaseService.refreshToken.deleteOne({ token: refresh_token })
      return result
   }
   getUsers() {
      const result = databaseService.users.find({}).toArray()
      return result
   }
}

const userServices = new UsersServices()
export default userServices
