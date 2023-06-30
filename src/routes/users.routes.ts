import { Router } from 'express'
import { getUsersController, loginController, registerController } from '~/controllers/users.controllers'
import { RegisterValidator, loginValidater } from '~/middlewares/users.middlewares'
import { WrapErrorController } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/login', loginValidater, WrapErrorController(loginController))
usersRouter.post('/register', RegisterValidator, WrapErrorController(registerController))
usersRouter.get('/', getUsersController)

export default usersRouter
