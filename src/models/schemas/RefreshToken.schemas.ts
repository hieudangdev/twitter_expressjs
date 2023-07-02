import { ObjectId } from 'mongodb'

interface refreshTokenType {
   _id?: ObjectId
   token: string
   created_at?: Date
   user_id: ObjectId
}

export default class RefreshTokenSchemas {
   _id?: ObjectId
   token: string
   created_at: Date
   user_id: ObjectId
   constructor({ _id, token, created_at, user_id }: refreshTokenType) {
      this._id = _id
      this.token = token
      this.created_at = created_at || new Date()
      this.user_id = user_id
   }
}
