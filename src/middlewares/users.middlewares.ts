import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import userServices from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidater = (req: Request, res: Response, next: NextFunction) => {
   const { email, password } = req.body
   console.log(req.body)
   res.json({
      email,
      password
   })
   next()
}

export const RegisterValidator = validate(
   checkSchema({
      name: {
         notEmpty: true,
         isString: true,
         trim: true,
         isLength: {
            options: { min: 1, max: 100 },
            errorMessage: 'name must 1 to 100'
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
                  throw new Error('email has already been')
               }
               return true
            }
         }
      },
      password: {
         notEmpty: true,
         isString: true,
         isStrongPassword: {
            options: { minLength: 6 }
         }
      },
      confirm_password: {
         notEmpty: true,
         isString: true,
         custom: {
            options: (value, { req }) => {
               if (value !== req.body.password) {
                  throw new Error('password confirmation does not match password')
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
         }
      }
   })
)
