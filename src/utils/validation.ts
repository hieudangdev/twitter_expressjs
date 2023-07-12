import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTPSTATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    // check error from express-validations
    const error = validationResult(req)
    const errorObj = error.mapped()
    // next neu ko co loi
    if (error.isEmpty()) {
      return next()
    }

    const entityError = new EntityError({ errors: {} })
    // handle error with status code
    for (const key in errorObj) {
      const { msg } = errorObj[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTPSTATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      // error with validation custom
      entityError.errors[key] = errorObj[key]
    }
    next(entityError)
  }
}
