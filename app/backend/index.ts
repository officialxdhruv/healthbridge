import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.ts"
import connectCloudinary from "./config/cloudinary.ts"
import adminRouter from "./routes/adminRoute.ts"

const app = express()
const port = process.env.PORT || 4000
connectDB();
connectCloudinary();

app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor
app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port,()=>console.log("Server Started",port))