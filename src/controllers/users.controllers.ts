import { Response, Request } from 'express'
import { RegisterReqbody } from '~/models/request/user.request'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import userServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'login controller'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqbody>, res: Response) => {
  try {
    const result = await userServices.register(req.body)
    res.json({
      message: 'register success',
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}

export const getUsersController = async (req: Request, res: Response) => {
  const result = await userServices.getUsers()
  res.json(result)
}
