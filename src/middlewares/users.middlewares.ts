import { Response, Request, NextFunction } from 'express'
import { checkSchema } from 'express-validator'

export const loginValidater = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  console.log(req.body)
  res.json({
    email,
    password
  })
  next()
}

export const RegisterValidator = checkSchema({
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
    notEmpty: true
  },
  password: {
    notEmpty: true,
    isString: true,
    isStrongPassword: {
      options: { minLength: 6 },
      errorMessage: 'password must be in 6 to 20'
    }
  },
  confirm_password: {
    notEmpty: true,
    isString: true,
    isStrongPassword: {
      options: { minLength: 6 },
      errorMessage: 'password must be in 6 to 20'
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
