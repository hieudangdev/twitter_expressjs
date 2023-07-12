import { Router } from 'express'
import {
  VerifyEmailController,
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import {
  RegisterValidator,
  accessTokenValidator,
  forgotPasswordValidator,
  loginValidater,
  refreshTokenValidation,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyEmailValidator,
  verifyForgotPasswordValidator
} from '~/middlewares/users.middlewares'
import { WrapErrorController } from '~/utils/handlers'
const usersRouter = Router()

/**
 * Path:/me,
 * Method: GET
 * description: get my profile
 */
usersRouter.get('/me', accessTokenValidator, WrapErrorController(getMeController))

/**
 * Path:/me,
 * Method: PATCH
 * description: update my profile
 * Body: UsersChema
 * headers: { Authorization: 'Bearer <access_token>' }
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  WrapErrorController(updateMeController)
)

/**
 * Path:/login,
 * Method: POST
 * Body: {email: string, password: string}
 * description: login a user
 */
usersRouter.post('/login', loginValidater, WrapErrorController(loginController))
/**
 * Path:/register,
 * Method: POST
 * Body: {name:string, email:string,dayofbirth:string}
 * description: register a user
 */
usersRouter.post('/register', RegisterValidator, WrapErrorController(registerController))
/**
 * Path:/logout,
 * Method: POST
 * headers: { Authorization: 'Bearer <access_token>' }
 * Body: {refresh_token:string}
 * description: logout a user
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidation, WrapErrorController(logoutController))
/**
 * Path:/verify-email,
 * Method: POST
 * body: {email_verify_token: string}
 * description:verify email
 */
usersRouter.post('/verify-email', verifyEmailValidator, WrapErrorController(VerifyEmailController))

/**
 * Path:/resend-verify-email,
 * Method: POST
 * body: {authorization: Bearer access_token}
 * description:resend verify email
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, WrapErrorController(resendEmailVerifyController))
/**
 * Path:/forgot-password,
 * Method: POST
 * body: {email: string}
 * description:forgot password
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, WrapErrorController(forgotPasswordController))
/**
 * Path:/verify-forgot-password,
 * Method: POST
 * body: {forgot_password_token: string}
 * description:verify forgot password
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  WrapErrorController(verifyForgotPasswordController)
)
/**
 * Path:/reset-password,
 * Method: POST
 * body: {forgot_password_token: string,password:string,comfirm_password:string}
 * description:reset password
 */
usersRouter.post('/reset-password', resetPasswordValidator, WrapErrorController(resetPasswordController))

export default usersRouter
