import { ObjectId } from 'mongodb'

interface followType {
  _id?: ObjectId
  user_id: ObjectId
  created_at?: Date
  followed_user_id: ObjectId
}
export default class Follower {
  _id?: ObjectId
  user_id: ObjectId
  created_at: Date
  followed_user_id: ObjectId
  constructor({ _id, user_id, created_at, followed_user_id }: followType) {
    this._id = _id
    this.created_at = created_at || new Date()
    this.followed_user_id = followed_user_id
    this.user_id = user_id
  }
}
