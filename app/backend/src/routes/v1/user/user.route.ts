import upload from "@/middlewares/multer";
import { Router } from "express";
import {
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  payAppointment,
} from "./user.controller";

const userRouter = Router();

userRouter.get("/get-profile", getProfile);
userRouter.post("/update-profile", upload.single("image"), updateProfile);
userRouter.post("/book-appointment", bookAppointment);
userRouter.get("/appointments", listAppointment);
userRouter.post("/cancel-appointment", cancelAppointment);
userRouter.post("/pay-appointment", payAppointment);

export default userRouter;
