import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus, tokenType } from '~/constants/enum'
import HTTPSTATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import {
  FotgotpasswordsReqBody,
  LoginReqBody,
  LogoutReqbody,
  RegisterReqbody,
  TokenPayload,
  VerifyEmailReqbody,
  resetpasswordReqBody,
  updateMeReqBody,
  verifyForgotpasswordReqBody
} from '~/models/request/user.request'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import userServices from '~/services/users.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userServices.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userServices.getMe(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result
  })
}
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
  const result = await userServices.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqbody>, res: Response) => {
  const { refresh_token } = req.body
  await userServices.logout(refresh_token)
  return res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}
export const VerifyEmailController = async (req: Request<ParamsDictionary, any, VerifyEmailReqbody>, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  if (user.email_verify_token === '') {
    return res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }
  const result = await userServices.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTPSTATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userServices.resendVerifiedEmail(user_id)
  return res.json(result)
}
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, FotgotpasswordsReqBody>,
  res: Response
) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userServices.forgotPassword({ user_id: user_id.toString(), verify: user.verify })
  return res.json(result)
}
export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, verifyForgotpasswordReqBody>,
  res: Response
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, resetpasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded__forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await userServices.resetpassword(user_id, password)
  return res.json(result)
}
export const updateMeController = async (req: Request<ParamsDictionary, any, updateMeReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  const result = await userServices.updateMe(user_id, body)

  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}
