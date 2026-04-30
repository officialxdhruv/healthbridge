import { Doctor } from "@/models/doctorModel";
import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Appointment } from "@/models/appointmentModel";
import { env } from "@/env";
import { EntityNotFoundError, ForbiddenError, UnauthorizedError, ValidationError } from "@/errors";
import { loginDoctorSchema } from "@/types/doctor.types";
import z from "zod";

export async function loginDoctor(req: Request, res: Response) {
  const result = loginDoctorSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? "Validation failed");
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

  const token = jwt.sign(
    { id: doctor._id, role: "doctor" },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ success: true, token });
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

  const result = z.object({
    appointmentId: z.string().min(1, "Appointment ID is required"),
  }).safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? "Validation failed");
  }

  const { appointmentId } = result.data;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new EntityNotFoundError("Appointment not found");
  }

  if (appointment.docId.toString() !== docId) {
    throw new ForbiddenError("You are not authorized to cancel this appointment");
  }

  await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

  res.json({ success: true, message: "Appointment cancelled successfully" });
}

export async function appointmentComplete(req: Request, res: Response) {
  const docId = req.user.id;
  const { appointmentId } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment || appointment.docId.toString() !== docId) {
    return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
  }

  await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });
  res.json({ success: true, message: "Appointment Completed" });
};

// Get all doctors (for frontend list)
export async function doctorList(req: Request, res: Response) {
  const doctors = await Doctor.find({}).select("-password -email");
  res.json({ success: true, doctors });
};

// Toggle doctor's availability
export async function changeAvailability(req: Request, res: Response) {

  const { docId } = req.body;

  if (!docId) {
    return res.status(400).json({ success: false, message: "Doctor ID missing" });
  }

  const doctor = await Doctor.findById(docId);

  if (!doctor) {
    return res.status(404).json({ success: false, message: "Doctor not found" });
  }

  doctor.available = !doctor.available;
  await doctor.save();

  res.json({ success: true, message: "Availability changed successfully" });

};


// Get doctor's profile
export async function doctorProfile(req: Request, res: Response) {
  const docId = req.user.id;
  const profile = await Doctor.findById(docId).select("-password");
  res.json({ success: true, profileData: profile });
};

// Update doctor's profile
export async function updateDoctorProfile(req: Request, res: Response) {

  const docId = req.user.id;
  const { fees, address, available, about } = req.body; // ✅ include `about`

  await Doctor.findByIdAndUpdate(docId, {
    fees,
    address,
    available,
    about, // ✅ update `about`
  });

  res.json({ success: true, message: "Profile Updated" });

};


// Get dashboard data
export async function doctorDashboard(req: Request, res: Response) {
  const docId = req.user.id;
  const appointments = await Appointment.find({ docId });

  let earnings = 0;
  const patientSet = new Set();

  appointments.forEach((a) => {
    if (a.isCompleted || a.payment) earnings += a.amount;
    patientSet.add(a.userId.toString());
  });

  const dashData = {
    earnings,
    appointments: appointments.length,
    patients: patientSet.size,
    latestAppointments: appointments.reverse().slice(0, 5),
  };

  res.json({ success: true, dashData });

};
