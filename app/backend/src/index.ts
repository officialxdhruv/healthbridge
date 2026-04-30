import express from 'express'
import cors from 'cors'
import { env } from '@/src/env'
import connectCloudinary from '@/config/cloudinary'
import adminRouter from '@/routes/adminRoute'
import doctorRouter from '@/routes/doctorRoute'
import userRouter from '@/routes/userRoute'
import connectDB from '@/config/mongodb'

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
app.use('/testing', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    throw new Error('Oops! Something went wrong.');
  } catch (error) {
    next(error)
  }
  res.status(200).json({ message: 'API is working' });
});


app.listen(PORT, () => {
  console.log(`Server started on PORT:${PORT}`);
  connectDB();
  connectCloudinary();
})