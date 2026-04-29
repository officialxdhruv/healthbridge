import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import { env } from '@/env'

// app config
const app = express()
const PORT = env.PORT || 3000

// connectCloudinary()

// middlewares
app.use(express.json())
app.use(
  cors({
    origin: env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)


app.listen(PORT, () => {
  console.log(`Server started on PORT:${PORT}`);
  connectDB();
})