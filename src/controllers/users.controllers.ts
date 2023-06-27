import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqbody } from '~/models/request/user.request'
import userServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
   res.json({
      message: 'login controller'
   })
}

export const registerController = (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
   const result = userServices.register(req.body)
   res.json({
      message: 'register success',
      result
   })
}

export const getUsersController = async (req: Request, res: Response) => {
   const result = await userServices.getUsers()
   res.json(result)
}
