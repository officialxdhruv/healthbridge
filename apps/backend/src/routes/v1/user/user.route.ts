import { Router } from "express";
import upload from "@/middlewares/multer";
import {
  bookAppointment,
  cancelAppointment,
  createRazorpayOrder,
  getProfile,
  listAppointment,
  payAppointment,
  updateProfile,
  verifyRazorpayPayment,
} from "./user.controller";

const userRouter = Router();


userRouter.get("/get-profile", getProfile);
userRouter.post("/update-profile", upload.single("image"), updateProfile);
userRouter.post("/book-appointment", bookAppointment);
userRouter.get("/appointments", listAppointment);
userRouter.post("/cancel-appointment", cancelAppointment);
userRouter.post("/pay-appointment", payAppointment);
userRouter.post("/create-razorpay-order", createRazorpayOrder)
userRouter.post("/verify-razorpay-payment", verifyRazorpayPayment)

export default userRouter;
