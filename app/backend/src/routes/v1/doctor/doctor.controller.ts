import { Doctor } from "@/models/doctorModel";
import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Appointment } from "@/models/appointmentModel";
import { env } from "@/env";
import {
  EntityNotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from "@/errors";
import {
  appointmentIdSchema,
  loginDoctorSchema,
  updateDoctorSchema,
} from "@/types/doctor.types";
import z from "zod";

export async function loginDoctor(req: Request, res: Response) {
  const result = loginDoctorSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }

  const { email, password } = result.data;

  const doctor = await Doctor.findOne({ email }).select("+password");

  if (!doctor) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isMatch = await compare(password, doctor.password);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = jwt.sign({ id: doctor._id, role: "doctor" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("doctor-token", token, {
    httpOnly: true, // JS can't access it — XSS safe
    secure: env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ success: true });
}

export async function appointmentsDoctor(req: Request, res: Response) {
  const docId = req.user!.id;

  const appointments = await Appointment.find({ docId });

  if (!appointments.length) {
    throw new EntityNotFoundError("No appointments found");
  }

  res.json({ success: true, appointments });
}

export async function appointmentCancel(req: Request, res: Response) {
  const docId = req.user!.id;

  const result = z
    .object({
      appointmentId: z.string().min(1, "Appointment ID is required"),
    })
    .safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }

  const { appointmentId } = result.data;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new EntityNotFoundError("Appointment not found");
  }

  if (appointment.docId.toString() !== docId) {
    throw new ForbiddenError(
      "You are not authorized to cancel this appointment",
    );
  }

  await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

  res.json({ success: true, message: "Appointment cancelled successfully" });
}

export async function appointmentComplete(req: Request, res: Response) {
  const result = appointmentIdSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  const appointment = await Appointment.findById(result.data.appointmentId);
  if (!appointment) throw new EntityNotFoundError("Appointment not found");
  if (appointment.docId.toString() !== req.user!.id)
    throw new ForbiddenError("Not authorized");

  await Appointment.findByIdAndUpdate(result.data.appointmentId, {
    isCompleted: true,
  });
  res.json({ success: true, message: "Appointment completed successfully" });
}

export async function doctorList(_req: Request, res: Response) {
  const doctors = await Doctor.find({}).select("-password -email");
  res.json({ success: true, doctors });
}

export async function changeAvailability(req: Request, res: Response) {
  const doctor = await Doctor.findById(req.user!.id);
  if (!doctor) throw new EntityNotFoundError("Doctor not found");

  doctor.available = !doctor.available;
  await doctor.save();

  res.json({ success: true, message: "Availability updated successfully" });
}

export async function doctorProfile(req: Request, res: Response) {
  const doctor = await Doctor.findById(req.user!.id).select("-password");
  if (!doctor) throw new EntityNotFoundError("Doctor not found");

  res.json({ success: true, doctor });
}

export async function updateDoctorProfile(req: Request, res: Response) {
  const result = updateDoctorSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  await Doctor.findByIdAndUpdate(req.user!.id, result.data);
  res.json({ success: true, message: "Profile updated successfully" });
}

export async function doctorDashboard(req: Request, res: Response) {
  const appointments = await Appointment.find({ docId: req.user!.id });

  let earnings = 0;
  const patientSet = new Set<string>();

  appointments.forEach((a) => {
    if (a.isCompleted || a.payment) earnings += a.amount;
    patientSet.add(a.userId.toString());
  });

  res.json({
    success: true,
    dashData: {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: [...appointments].reverse().slice(0, 5),
    },
  });
}
