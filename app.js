import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const URL = process.env.Mongoose_URL
const ConnectDB=async()=>{
    try{
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connected to MongoDB Successfully")

    } catch(error){
        console.log("Error while connecting to MongoDB", error)
            process.exit(1); // Exit app if DB connection fails

    }
}
ConnectDB();

import { GetUsers } from './Controllers/userController.js'

const app = express()
const Port = process.env.PORT || 4000
app.use(express.json())
app.get('/users', GetUsers)

app.listen(Port, ()=>{
    console.log("The server is running...")
})