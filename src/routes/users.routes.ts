import { Router } from 'express'
import { getUsersController, loginController, registerController } from '~/controllers/users.controllers'
import { RegisterValidator } from '~/middlewares/users.middlewares'
import { validate } from '~/utils/validation'
const usersRouter = Router()

usersRouter.post('/login', loginController)
usersRouter.post('/register', validate(RegisterValidator), registerController)
usersRouter.get('/', getUsersController)

export default usersRouter
