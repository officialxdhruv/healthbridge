import { Router } from "express";
import authAdmin from "@/middlewares/authAdmin";
import authDoctor from "@/middlewares/authDoctor";
import authUser from "@/middlewares/authUser";
import { loginAdmin } from "./admin/admin.controller";
import adminRouter from "./admin/admin.route";
import { doctorList, loginDoctor } from "./doctor/doctor.controller";
import doctorRouter from "./doctor/doctor.route";
import { loginUser, registerUser } from "./user/user.controller";
import userRouter from "./user/user.route";

const v1 = Router();

// admin
v1.post("/admin/login", loginAdmin);
v1.use("/admin", authAdmin, adminRouter);

// doctor
v1.post("/doctor/login", loginDoctor);
v1.get("/doctor/list", doctorList);
v1.use("/doctor", authDoctor, doctorRouter);

// user
v1.post("/user/register", registerUser);
v1.post("/user/login", loginUser);
v1.use("/user", authUser, userRouter);

export default v1;
