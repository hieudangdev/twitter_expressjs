import { Request } from 'express'
import User from './models/schemas/User.schemas'
import { tokenPayload } from './models/request/user.request'
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: tokenPayload
    decoded_refresh_token?: tokenPayload
    decoded__forgot_password_token?: tokenPayload
    decoded_email_verify_token?: tokenPayload
  }
}
