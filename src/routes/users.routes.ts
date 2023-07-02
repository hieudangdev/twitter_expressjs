import { Router } from 'express'
import {
   getUsersController,
   loginController,
   logoutController,
   registerController
} from '~/controllers/users.controllers'
import {
   RegisterValidator,
   accessTokenValidator,
   loginValidater,
   refreshTokenValidation
} from '~/middlewares/users.middlewares'
import { WrapErrorController } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/login', loginValidater, WrapErrorController(loginController))
usersRouter.post('/register', RegisterValidator, WrapErrorController(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidation, WrapErrorController(logoutController))
usersRouter.get('/', getUsersController)

export default usersRouter
