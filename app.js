import express from 'express'
import mongoose from 'mongoose'
import {ConnectDB} from './config/db.js'
import router from './routes/userRoute.js'
const app = express()
const Port = process.env.PORT || 4000
ConnectDB();
app.use(express.json())
// users router 
app.use('/api/users', router);




app.listen(Port, ()=>{
    console.log("The server is running...")
})