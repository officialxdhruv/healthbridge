import express, { Router } from "express";
import adminRouter from "./adminRoute";
import doctorRouter from "./doctorRoute";
import userRouter from "./userRoute";


const v1: Router = express.Router();

v1.use("/admin", adminRouter);
v1.use("/doctor", doctorRouter);
v1.use("/user", userRouter);

export default v1;