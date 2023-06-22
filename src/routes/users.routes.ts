import { Router } from 'express'
import { getUsersController, loginController, registerController } from '~/controllers/users.controllers'
import { loginValidater } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginController)
usersRouter.post('/register', registerController)
usersRouter.get('/', getUsersController)

export default usersRouter
