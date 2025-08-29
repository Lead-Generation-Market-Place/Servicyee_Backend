import express from 'express'
const app = express()
const Port = 4000
app.use(express.json())
app.get('/users',(req, res)=>{
    res.json(`Hello world`)
})

app.listen(Port, ()=>{
    console.log("The server is runining...")
})