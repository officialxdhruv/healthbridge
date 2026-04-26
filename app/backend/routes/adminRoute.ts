import express from 'express'
import { addDoctor } from '../controllers/adminController.ts'
import upload from '../middlewares/multer.ts'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',upload.single('image'),addDoctor)

export default adminRouter