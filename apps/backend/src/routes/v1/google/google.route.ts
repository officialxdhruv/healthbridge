import { Router } from "express";
import authUser from "@/middlewares/authUser";
import {
  connectGoogle,
  getGoogleStatus,
  googleCallback,
} from "./google.controller";

const google = Router();
// The route names must match what you put in Google Console
google.get("/google", authUser, connectGoogle);
google.get("/google/callback", authUser, googleCallback);
google.get("/google/status", authUser, getGoogleStatus);

export default google;
