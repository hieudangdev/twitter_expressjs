import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schemas'

// config dotenv
config()

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME

const uri = `mongodb+srv://${username}:${password}@clusterhongkong.drtw9hg.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
   private client: MongoClient
   private db: Db
   constructor() {
      this.client = new MongoClient(uri)
      this.db = this.client.db(dbName)
   }

   async connect() {
      try {
         // Send a ping to confirm a successful connection
         await this.db.command({ ping: 1 })
         console.log('connected to MongoDB!')
      } catch (err) {
         console.log('Error:', err)
         throw err
      }
   }

   get users(): Collection<User> {
      return this.db.collection(process.env.DB_USERS_COLLECTION as string)
   }
}

const databaseService = new DatabaseService()

export default databaseService
