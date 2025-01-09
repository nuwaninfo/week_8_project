import express, { Express } from "express"
import path from "path"
import router from "./src/routes/index"
import dotenv from "dotenv"
import mongoose, { Connection } from "mongoose"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 3001

const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))

app.use(express.json())

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use("/", router)

app.use(express.static(path.join(__dirname, "../public")))
