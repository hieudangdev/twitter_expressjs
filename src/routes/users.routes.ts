import { Router } from 'express'
import { getUsersController, loginController, registerController } from '~/controllers/users.controllers'
import { RegisterValidator } from '~/middlewares/users.middlewares'
import { handleError } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/login', loginController)
usersRouter.post('/register', RegisterValidator, handleError(registerController))
usersRouter.get('/', getUsersController)

export default usersRouter
