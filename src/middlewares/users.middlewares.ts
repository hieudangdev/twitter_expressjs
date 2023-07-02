import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTPSTATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import userServices from '~/services/users.services'
import hashPassword from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const loginValidater = validate(
   checkSchema(
      {
         email: {
            isEmail: true,
            trim: true,
            custom: {
               options: async (email, { req }) => {
                  const user = await databaseService.users.findOne({
                     email,
                     password: hashPassword(req.body.password)
                  })
                  if (user === null) {
                     throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
                  }
                  req.user = user
                  return true
               }
            }
         },
         password: {
            notEmpty: {
               errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
            },
            isString: {
               errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
            },
            isLength: {
               options: {
                  min: 6,
                  max: 50
               },
               errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
            },
            isStrongPassword: {
               options: {
                  minLength: 6,
                  minLowercase: 1,
                  minUppercase: 1,
                  minNumbers: 1,
                  minSymbols: 1
               },
               errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
            }
         }
      },
      ['body']
   )
)

export const RegisterValidator = validate(
   checkSchema(
      {
         name: {
            notEmpty: {
               errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
            },
            isString: {
               errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
            },
            trim: true,
            isLength: {
               options: {
                  min: 1,
                  max: 100
               },
               errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
            }
         },
         email: {
            isEmail: true,
            trim: true,
            notEmpty: true,
            custom: {
               options: async (value) => {
                  const isExitsEmail = await userServices.checkEmailExits(value)
                  if (isExitsEmail) {
                     throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
                  }
                  return true
               }
            }
         },
         password: {
            notEmpty: {
               errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
            },
            isString: {
               errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
            },
            isLength: {
               options: {
                  min: 6,
                  max: 50
               },
               errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
            },
            isStrongPassword: {
               options: {
                  minLength: 6,
                  minLowercase: 1,
                  minUppercase: 1,
                  minNumbers: 1,
                  minSymbols: 1
               },
               errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
            }
         },
         confirm_password: {
            notEmpty: {
               errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
            },
            isString: {
               errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
            },
            isLength: {
               options: {
                  min: 6,
                  max: 50
               },
               errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
            },
            isStrongPassword: {
               options: {
                  minLength: 6,
                  minLowercase: 1,
                  minUppercase: 1,
                  minNumbers: 1,
                  minSymbols: 1
               },
               errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
            },
            custom: {
               options: (value, { req }) => {
                  if (value !== req.body.password) {
                     throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
                  }
                  return true
               }
            }
         },
         date_of_birth: {
            notEmpty: true,
            isISO8601: {
               options: {
                  strict: true,
                  strictSeparator: true
               }
            },
            errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
         }
      },
      ['body']
   )
)

export const accessTokenValidator = validate(
   checkSchema(
      {
         Authorization: {
            notEmpty: {
               errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
            },
            custom: {
               options: async (value: string, { req }) => {
                  const access_token = value.split(' ')[1]
                  if (!access_token) {
                     throw new ErrorWithStatus({
                        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                        status: HTTPSTATUS.UNAUTHORIZED
                     })
                  }
                  const decoded_authorization = await verifyToken({
                     token: access_token
                  })
                  req.decoded_authorization = decoded_authorization
                  return true
               }
            }
         }
      },
      ['headers']
   )
)

export const refreshTokenValidation = validate(
   checkSchema(
      {
         refresh_token: {
            notEmpty: {
               errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
            },
            custom: {
               options: async (value: string, { req }) => {
                  try {
                     const [decoded_refresh_token, refresh_token] = await Promise.all([
                        verifyToken({ token: value }),
                        databaseService.refreshToken.findOne({ token: value })
                     ])
                     if (refresh_token === null) {
                        throw new ErrorWithStatus({
                           message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                           status: HTTPSTATUS.UNAUTHORIZED
                        })
                     }

                     req.decoded_refresh_token = decoded_refresh_token
                  } catch (error) {
                     if (error instanceof JsonWebTokenError) {
                        throw new ErrorWithStatus({
                           message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                           status: HTTPSTATUS.UNAUTHORIZED
                        })
                     }
                     throw error
                  }
                  return true
               }
            }
         }
      },
      ['body']
   )
)
