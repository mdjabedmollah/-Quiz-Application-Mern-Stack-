import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectionDb } from './config/db.js'
const app=express()
const port=4000

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Db
connectionDb()
// Routes
app.get('/',(req,res)=>{
    res.send("Api working")
})
app.listen(port,()=>{
    console.log(`sever is runing on http://localhost:${port}`)
})