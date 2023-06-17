import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { loginValidater } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginValidater, loginController)

export default usersRouter
