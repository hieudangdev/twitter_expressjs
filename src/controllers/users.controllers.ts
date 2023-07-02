import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
import { RegisterReqbody } from '~/models/request/user.request'
import User from '~/models/schemas/User.schemas'
import userServices from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
   const user = req.user as User
   const user_id = user._id as ObjectId
   const result = await userServices.login(user_id.toString())
   res.json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      result
   })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
   const result = await userServices.register(req.body)
   res.json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      result
   })
}

export const getUsersController = async (req: Request, res: Response) => {
   const result = await userServices.getUsers()
   res.json(result)
}

export const logoutController = async (req: Request, res: Response) => {
   const { refresh_token } = req.body
   await userServices.logout(refresh_token)
   res.json({
      message: USERS_MESSAGES.LOGOUT_SUCCESS
   })
}
