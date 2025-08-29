import express from 'express'
import { GetUsers } from './Controllers/userController.js'
const app = express()
const Port = 4000
app.use(express.json())
app.get('/users', GetUsers)

app.listen(Port, ()=>{
    console.log("The server is runining...")
})