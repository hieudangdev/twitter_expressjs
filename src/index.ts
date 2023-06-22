import express, { Router } from 'express'
import usersRouter from './routes/users.routes'
import bodyParser from 'body-parser'
import databaseService from './services/database.services'
const app = express()
const PORT = 3000

//add middleware
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//add router
app.use('/users', usersRouter)

//connect mongodb
databaseService.connect()
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
