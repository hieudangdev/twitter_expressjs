import { Response, Request } from 'express'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import userServices from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'login controller'
  })
}

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await userServices.register({ email, password })
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
