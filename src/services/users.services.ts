import User from '~/models/schemas/User.schemas'
import databaseService from './database.services'

class UsersServices {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return result
  }

  getUsers() {
    const result = databaseService.users.find({}).toArray()
    return result
  }
}

const userServices = new UsersServices()
export default userServices
