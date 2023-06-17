import express, { Router } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
const PORT = 3000

//connect mongodb
databaseService.connect()
//add middleware
app.use(express.json())

//add router
app.use('/api', usersRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
