import { Router } from "express";
import upload from "@/middlewares/multer";
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancel,
  appointmentsAdmin,
} from "@/routes/v1/admin/admin.controller";
import { changeAvailability } from "@/routes/v1/doctor/doctor.controller";

const adminRouter = Router();

adminRouter.post("/add-doctor", upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", allDoctors);
adminRouter.post("/change-availability", changeAvailability);
adminRouter.get("/appointments", appointmentsAdmin);
adminRouter.post("/cancel-appointment", appointmentCancel);
adminRouter.get("/dashboard", adminDashboard);

export default adminRouter;
