import { compare, genSalt, hash } from "bcrypt-ts";
import { v2 as cloudinary } from "cloudinary";
import { addMinutes, format, parse } from "date-fns";
import type { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import oauth2Client from "@/config/google";
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
    sameSite: "lax", // CSRF protection
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
    sameSite: "lax", // CSRF protection
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

// export async function bookAppointment(req: Request, res: Response) {
//   const result = bookAppointmentSchema.safeParse(req.body);
//   if (!result.success)
//     throw new ValidationError(
//       result.error.issues[0]?.message ?? "Validation failed",
//     );

//   const { docId, slotDate, slotTime } = result.data;
//   const userId = req.user?.id;

//   const [doctor, user] = await Promise.all([
//     Doctor.findById(docId),
//     User.findById(userId),
//   ]);

//   if (!doctor) throw new EntityNotFoundError("Doctor not found");
//   if (!user) throw new EntityNotFoundError("User not found");
//   if (!doctor.available) throw new ValidationError("Doctor not available");

//   const slotsBooked = doctor.slotsBooked;
//   const slotList = slotsBooked.get(slotDate) ?? [];

//   if (slotList.includes(slotTime)) {
//     throw new ValidationError("Slot not available");
//   }

//   slotsBooked.set(slotDate, [...slotList, slotTime]);
//   await Doctor.findByIdAndUpdate(docId, { slotsBooked });

//   const { slotsBooked: _, ...docData } = doctor.toObject();

//   const newAppointment = new Appointment({
//     userId,
//     docId,
//     userData: user.toObject(),
//     docData,
//     amount: doctor.fees,
//     slotTime,
//     slotDate,
//   });

//   await newAppointment.save();
//   res
//     .status(201)
//     .json({ success: true, message: "Appointment booked successfully" });
// }

export async function bookAppointment(req: Request, res: Response) {
  // Validate request body
  const result = bookAppointmentSchema.safeParse(req.body);
  if (!result.success)
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );

  const { docId, slotDate, slotTime } = result.data;
  const userId = req.user?.id;

  // Fetch doctor and user in parallel
  const [doctor, user] = await Promise.all([
    Doctor.findById(docId),
    User.findById(userId),
  ]);

  if (!doctor) throw new EntityNotFoundError("Doctor not found");
  if (!user) throw new EntityNotFoundError("User not found");
  if (!doctor.available) throw new ValidationError("Doctor not available");

  // 1. Check slot availability
  const slotsBooked = doctor.slotsBooked;
  const slotList = slotsBooked.get(slotDate) ?? [];
  if (slotList.includes(slotTime))
    throw new ValidationError("Slot not available");

  // 2. Create Google Calendar event with Meet link (if user has linked Google account)
  let meetLink = "";
  let googleEventId = "";

  if (user.googleTokens?.access_token) {
    try {
      const tokens = user.toObject().googleTokens;
      oauth2Client.setCredentials(
        tokens as {
          access_token?: string;
          refresh_token?: string;
          scope?: string;
          token_type?: string;
          expiry_date?: number;
        },
      );

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      // Parse "yyyy-MM-dd hh:mm aa" (e.g. "2026-05-17 10:00 AM") into a Date
      // new Date(0) is used as a fixed reference to avoid server timezone affecting the parse
      const startDate = parse(
        `${slotDate} ${slotTime}`,
        "yyyy-MM-dd hh:mm aa",
        new Date(0),
      );

      if (Number.isNaN(startDate.getTime()))
        throw new ValidationError("Invalid date/time format");

      const endDate = addMinutes(startDate, 30);

      // Append +05:30 offset so Google Calendar displays time in IST
      const toIST = (date: Date) =>
        `${format(date, "yyyy-MM-dd'T'HH:mm:ss")}+05:30`;

      const googleRes = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        requestBody: {
          summary: `Appointment with Dr. ${doctor.name}`,
          description: "Healthcare session booked via HealthBridge",
          start: { dateTime: toIST(startDate), timeZone: "Asia/Kolkata" },
          end: { dateTime: toIST(endDate), timeZone: "Asia/Kolkata" },
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        },
      });

      meetLink = googleRes.data.hangoutLink ?? "";
      googleEventId = googleRes.data.id ?? "";
    } catch (err) {
      // Non-fatal: appointment still gets booked without a Meet link
      console.error("Google Meet creation failed:", err);
    }
  }

  // 3. Mark slot as booked on the doctor's record
  slotsBooked.set(slotDate, [...slotList, slotTime]);
  await Doctor.findByIdAndUpdate(docId, { slotsBooked });

  // 4. Save appointment (excluding doctor's slotsBooked from snapshot)
  const { slotsBooked: _, ...docData } = doctor.toObject();

  await new Appointment({
    userId,
    docId,
    userData: user.toObject(),
    docData,
    amount: doctor.fees,
    slotDate,
    slotTime,
    meetLink,
    googleEventId,
  }).save();

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    meetLink: meetLink || "No Google account linked",
  });
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

  if (appointment.googleEventId) {
    try {
      const user = await User.findById(req.user.id);
      if (user?.googleTokens?.access_token) {
        oauth2Client.setCredentials(
          user.googleTokens as {
            access_token?: string;
            refresh_token?: string;
            scope?: string;
            token_type?: string;
            expiry_date?: number;
          },
        );
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        await calendar.events.delete({
          calendarId: "primary",
          eventId: appointment.googleEventId,
        });
        console.log("Google Event Deleted Successfully");
      }
    } catch (err) {
      console.error("Failed to delete Google event:", err);
    }
  }

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

  res.json({
    success: true,
    message: "Appointment cancelled and calendar event removed",
  });
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
