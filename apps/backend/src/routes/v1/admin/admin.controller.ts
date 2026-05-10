import { genSalt, hash } from "bcrypt-ts";
import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { EntityNotFoundError, ValidationError } from "@/errors";
import { Appointment } from "@/models/appointmentModel";
import { Doctor } from "@/models/doctorModel";
import { User } from "@/models/userModel";
import { loginSchema } from "@/types/admin.types";
import { addDoctorSchema, appointmentIdSchema } from "@/types/doctor.types";

export function loginAdmin(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }

  const { email, password } = result.data;

  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    throw new ValidationError("Invalid email or password");
  }

  const token = jwt.sign({ email, role: "admin" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("admin-token", token, {
    httpOnly: true, // JS can't access it — XSS safe
    secure: env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ success: true });
}

export function logoutAdmin(_req: Request, res: Response) {
  res.clearCookie("admin-token");
  res.json({ success: true, message: "Logged out successfully" });
}

export async function addDoctor(req: Request, res: Response) {
  const imageFile = req.file;

  if (!imageFile) {
    throw new ValidationError("Doctor image is required");
  }

  const result = addDoctorSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }

  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
  } = result.data;

  const existingUser = await Doctor.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email already in use");
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    resource_type: "image",
  });

  const newDoctor = new Doctor({
    name,
    email,
    image: imageUpload.secure_url,
    password: hashedPassword,
    speciality,
    degree,
    experience,
    about,
    fees,
    address,
  });

  await newDoctor.save();

  res.status(201).json({ success: true, message: "Doctor added successfully" });
}

export async function appointmentCancel(req: Request, res: Response) {
  const result = appointmentIdSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  const appointment = await Appointment.findById(result.data.appointmentId);
  if (!appointment) throw new EntityNotFoundError("Appointment not found");
  if (appointment.cancelled)
    throw new ValidationError("Appointment already cancelled");

  await Appointment.findByIdAndUpdate(result.data.appointmentId, {
    cancelled: true,
  });

  // release doctor slot
  const doctor = await Doctor.findById(appointment.docId);
  if (doctor) {
    const slotsBooked = doctor.slotsBooked;
    slotsBooked.set(
      appointment.slotDate,
      (slotsBooked.get(appointment.slotDate) ?? []).filter(
        (s) => s !== appointment.slotTime,
      ),
    );
    await Doctor.findByIdAndUpdate(appointment.docId, { slotsBooked });
  }

  res.json({ success: true, message: "Appointment cancelled successfully" });
}

export async function allDoctors(_req: Request, res: Response) {
  const doctors = await Doctor.find({}).select("-password");
  res.json({ success: true, doctors });
}

export async function appointmentsAdmin(_req: Request, res: Response) {
  const appointments = await Appointment.find({});
  res.json({ success: true, appointments });
}

export async function adminDashboard(_req: Request, res: Response) {
  const [doctors, users, appointments] = await Promise.all([
    Doctor.find({}).select("_id"), // only fetch what you need
    User.find({}).select("_id"),
    Appointment.find({}),
  ]);

  res.json({
    success: true,
    dashData: {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    },
  });
}
