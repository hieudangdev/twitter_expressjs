import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

const uri = `mongodb+srv://${username}:${password}@clusterhongkong.drtw9hg.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.log(err)
    } finally {
      // Ensures that the this.client will close when you finish/error
      await this.client.close()
    }
  }
}

const databaseService = new DatabaseService()

export default databaseService
