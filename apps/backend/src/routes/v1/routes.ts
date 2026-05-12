import { Router } from "express";
import authAdmin from "@/middlewares/authAdmin";
import authDoctor from "@/middlewares/authDoctor";
import authUser from "@/middlewares/authUser";
import { loginAdmin, logoutAdmin } from "./admin/admin.controller";
import adminRouter from "./admin/admin.route";
import {
  doctorList,
  loginDoctor,
  logoutDoctor,
} from "./doctor/doctor.controller";
import doctorRouter from "./doctor/doctor.route";
import { loginUser, logoutUser, registerUser } from "./user/user.controller";
import userRouter from "./user/user.route";
import google from "./google/google.route";

const v1 = Router();

// admin
v1.post("/admin/login", loginAdmin);
v1.post("/admin/logout", logoutAdmin);
v1.use("/admin", authAdmin, adminRouter);

// doctor
v1.post("/doctor/login", loginDoctor);
v1.post("/doctor/logout", logoutDoctor);
v1.get("/doctor/list", doctorList);
v1.use("/doctor", authDoctor, doctorRouter);

// user
v1.post("/user/register", registerUser);
v1.post("/user/login", loginUser);
v1.post("/user/logout", logoutUser);
v1.use("/user", authUser, userRouter);


// google
v1.use("/auth", authUser, google)

export default v1;
