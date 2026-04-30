import { Doctor } from "@/models/doctorModel";
import { compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import express from "express";
import { Appointment } from "@/models/appointmentModel";
import { env } from "@/env";
import { UnauthorizedError } from "@/errors";

// Doctor login
export async function loginDoctor(req: express.Request, res: express.Response) {
  const { email, password } = req.body;
  const user = await Doctor.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET);
  res.json({ success: true, token });
};

// Get doctor's appointments
export async function appointmentsDoctor(req: express.Request, res: express.Response) {
  const docId = req.user.id;
  const appointments = await Appointment.find({ docId });
  res.json({ success: true, appointments });

};

// Cancel appointment
export async function appointmentCancel(req: express.Request, res: express.Response) {

  const docId = req.user.id;
  const { appointmentId } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment || appointment.docId.toString() !== docId) {
    return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
  }

  await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });
  res.json({ success: true, message: "Appointment Cancelled" });

};

// Complete appointment
export async function appointmentComplete(req: express.Request, res: express.Response) {
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
export async function doctorList(req: express.Request, res: express.Response) {
  const doctors = await Doctor.find({}).select("-password -email");
  res.json({ success: true, doctors });
};

// Toggle doctor's availability
export async function changeAvailability(req: express.Request, res: express.Response) {

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
export async function doctorProfile(req: express.Request, res: express.Response) {
  const docId = req.user.id;
  const profile = await Doctor.findById(docId).select("-password");
  res.json({ success: true, profileData: profile });
};

// Update doctor's profile
export async function updateDoctorProfile(req: express.Request, res: express.Response) {

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
export async function doctorDashboard(req: express.Request, res: express.Response) {
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
