import { Response, Request, NextFunction } from 'express'

export const loginValidater = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      error: 'Missing username and password'
    })
  }
  next()
}
