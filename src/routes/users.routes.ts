import { Router } from 'express'
import { loginValidater } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginValidater, (req, res) => {
  res.send('success!')
})

export default usersRouter
