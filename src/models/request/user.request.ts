import { JwtPayload } from 'jsonwebtoken'
import { tokenType } from '~/constants/enum'

export interface RegisterReqbody {
  name: string
  email: string
  date_of_birth: string
  password: string
  confirm_password: string
}
export interface getProfileReqParam {
  username: string
}
export interface followProReqBody {
  followed_user_id: string
}
export interface LoginReqBody {
  email: string
  password: string
}
export interface LogoutReqbody {
  refresh_token: string
}
export interface FotgotpasswordsReqBody {
  email: string
}
export interface verifyForgotpasswordReqBody {
  forgot_password_token: string
}
export interface resetpasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}
export interface VerifyEmailReqbody {
  email_verify_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: tokenType
}
export interface updateMeReqBody {
  name?: string
  username?: string
  bio?: string
  date_of_birth?: string
  location?: string
  avatar?: string
  cover_photo?: string
  website?: string
}
