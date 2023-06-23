import User from '~/models/schemas/User.schemas'
import databaseService from './database.services'
import { RegisterReqbody } from '~/models/request/user.request'
import hashPassword from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { tokenType } from '~/constants/enum'

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

  async register(payload: RegisterReqbody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
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

  getUsers() {
    const result = databaseService.users.find({}).toArray()
    return result
  }
}

const userServices = new UsersServices()
export default userServices
