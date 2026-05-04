import { Router } from "express";
import {
  appointmentCancel,
  appointmentComplete,
  appointmentsDoctor,
  changeAvailability,
  doctorDashboard,
  doctorList,
  doctorProfile,
  updateDoctorProfile,
} from "./doctor.controller";

const doctorRouter = Router();

doctorRouter.post("/cancel-appointment", appointmentCancel);
doctorRouter.get("/appointments", appointmentsDoctor);
doctorRouter.post("/change-availability", changeAvailability);
doctorRouter.post("/complete-appointment", appointmentComplete);
doctorRouter.get("/dashboard", doctorDashboard);
doctorRouter.get("/profile", doctorProfile);
doctorRouter.post("/update-profile", updateDoctorProfile);

export default doctorRouter;
