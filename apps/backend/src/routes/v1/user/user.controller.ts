import { compare, genSalt, hash } from "bcrypt-ts";
import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { razorpay } from "@/config/razorpay";
import { env } from "@/env";
import {
  EntityNotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from "@/errors";
import { Appointment } from "@/models/appointmentModel";
import { Doctor } from "@/models/doctorModel";
import { User } from "@/models/userModel";
import { appointmentIdSchema } from "@/types/doctor.types";
import {
  bookAppointmentSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "@/types/user.types";

export async function registerUser(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body);
  console.log(result);

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }

  const { name, email, password } = result.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email already in use");
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const newUser = new User({ name, email, password: hashedPassword });
  const user = await newUser.save();

  const token = jwt.sign({ id: user._id, role: "user" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("user-token", token, {
    httpOnly: true, // JS can't access it — XSS safe
    secure: env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({ success: true });
}

export async function loginUser(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email }).select("+password"); // password is select:false

  if (!user) {
    throw new EntityNotFoundError("User does not exist");
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, role: "user" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("user-token", token, {
    httpOnly: true, // JS can't access it — XSS safe
    secure: env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ success: true });
}

export function logoutUser(_req: Request, res: Response) {
  res.clearCookie("user-token");
  res.json({ success: true, message: "Logged out successfully" });
}

export async function getProfile(req: Request, res: Response) {
  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new EntityNotFoundError("User not found");
  }

  res.json({ success: true, user });
}

export async function updateProfile(req: Request, res: Response) {
  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }

  const { name, phone, address, dob, gender } = result.data;

  await User.findByIdAndUpdate(req.user?.id, {
    name,
    phone,
    address,
    dob,
    gender,
  });

  if (req.file) {
    const imageUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
    });
    await User.findByIdAndUpdate(req.user?.id, {
      image: imageUpload.secure_url,
    });
  }

  res.json({ success: true, message: "Profile updated successfully" });
}

export async function bookAppointment(req: Request, res: Response) {
  const result = bookAppointmentSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  const { docId, slotDate, slotTime } = result.data;
  const userId = req.user?.id;

  const [doctor, user] = await Promise.all([
    Doctor.findById(docId),
    User.findById(userId),
  ]);

  if (!doctor) throw new EntityNotFoundError("Doctor not found");
  if (!user) throw new EntityNotFoundError("User not found");
  if (!doctor.available) throw new ValidationError("Doctor not available");

  const slotsBooked = doctor.slotsBooked;
  const slotList = slotsBooked.get(slotDate) ?? [];

  if (slotList.includes(slotTime)) {
    throw new ValidationError("Slot not available");
  }

  slotsBooked.set(slotDate, [...slotList, slotTime]);
  await Doctor.findByIdAndUpdate(docId, { slotsBooked });

  const { slotsBooked: _, ...docData } = doctor.toObject();

  const newAppointment = new Appointment({
    userId,
    docId,
    userData: user.toObject(),
    docData,
    amount: doctor.fees,
    slotTime,
    slotDate,
  });

  await newAppointment.save();
  res
    .status(201)
    .json({ success: true, message: "Appointment booked successfully" });
}

export async function cancelAppointment(req: Request, res: Response) {
  const result = appointmentIdSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  const appointment = await Appointment.findById(result.data.appointmentId);
  if (!appointment) throw new EntityNotFoundError("Appointment not found");
  if (appointment.userId.toString() !== req.user?.id)
    throw new ForbiddenError("Not authorized");
  if (appointment.cancelled)
    throw new ValidationError("Appointment already cancelled");

  await Appointment.findByIdAndUpdate(result.data.appointmentId, {
    cancelled: true,
  });

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

export async function listAppointment(req: Request, res: Response) {
  const appointments = await Appointment.find({ userId: req.user?.id });
  res.json({ success: true, appointments });
}

export async function payAppointment(req: Request, res: Response) {
  const result = appointmentIdSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  const appointment = await Appointment.findById(result.data.appointmentId);
  if (!appointment) throw new EntityNotFoundError("Appointment not found");
  if (appointment.userId.toString() !== req.user?.id)
    throw new ForbiddenError("Not authorized");
  if (appointment.cancelled)
    throw new ValidationError("Appointment is cancelled");
  if (appointment.payment)
    throw new ValidationError("Appointment already paid");

  await Appointment.findByIdAndUpdate(result.data.appointmentId, {
    payment: true,
  });

  res.json({ success: true, message: "Payment successful" });
}

export async function createRazorpayOrder(req: Request, res: Response) {
  const result = appointmentIdSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  const appointment = await Appointment.findById(result.data.appointmentId);
  if (!appointment) throw new EntityNotFoundError("Appointment not found");
  if (appointment.cancelled)
    throw new ValidationError("Appointment is cancelled");
  if (appointment.userId.toString() !== req.user?.id)
    throw new ForbiddenError("Not authorized");

  const order = await razorpay.orders.create({
    amount: appointment.amount * 100,
    currency: "INR",
    receipt: result.data.appointmentId,
  });

  res.json({ success: true, order });
}

export async function verifyRazorpayPayment(req: Request, res: Response) {
  const { razorpay_order_id } = req.body;

  if (!razorpay_order_id) throw new ValidationError("Order ID is required");

  const orderInfo = await razorpay.orders.fetch(razorpay_order_id);

  if (orderInfo.status !== "paid") {
    throw new ValidationError("Payment failed");
  }

  await Appointment.findByIdAndUpdate(orderInfo.receipt, { payment: true });
  res.json({ success: true, message: "Payment successful" });
}
