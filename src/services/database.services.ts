import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import Follower from '~/models/schemas/Follower.schemas'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'

// config dotenv
config()

const USERNAME = process.env.DB_USERNAME
const PASSWORD = process.env.DB_PASSWORD
const DBNAME = process.env.DB_NAME

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@twittersin.tiydb8p.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(DBNAME)
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
  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }
  get follower(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWER_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()

export default databaseService
