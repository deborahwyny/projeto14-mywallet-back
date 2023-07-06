import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"



dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)

try {
    mongoClient.connect()
    console.log("MongoDB conectado!")
} catch (err) {
    console.log(err.message)
}

export const db = mongoClient.db()
