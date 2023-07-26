import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'
type filterTypes<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKeys: filterTypes<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
