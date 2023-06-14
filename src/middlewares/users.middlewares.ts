import { Response, Request, NextFunction } from 'express'

export const loginValidater = (res: Response, req: Request, next: NextFunction) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      error: 'Missing username and password'
    })
  }
  next()
}
