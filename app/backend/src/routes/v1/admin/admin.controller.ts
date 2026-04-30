import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { Doctor } from "@/models/doctorModel";
import { Appointment } from "@/models/appointmentModel";
import { User } from "@/models/userModel";
import { env } from "@/env";
import { genSalt, hash } from "bcrypt-ts";
import { ValidationError } from "@/errors";
import { Request, Response } from "express";
import { addDoctorSchema } from "@/types/doctor.types";
import { loginSchema } from "@/types/admin.types";


export function loginAdmin(req: Request, res: Response) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error.issues[0]?.message ?? "Validation failed");
    }

    const { email, password } = result.data;

    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
        throw new ValidationError("Invalid email or password");
    }

    const token = jwt.sign(
        { email, role: "admin" },
        env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ success: true, token });
}

export async function addDoctor(req: Request, res: Response) {
    const imageFile = req.file;

    if (!imageFile) {
        throw new ValidationError("Doctor image is required");
    }

    const result = addDoctorSchema.safeParse(req.body);

    if (!result.success) {
        throw new ValidationError(result.error.issues[0]?.message ?? "Validation failed");
    }

    const { name, email, password, speciality, degree, experience, about, fees, address } = result.data;

    const existingUser = await Doctor.findOne({ email });
    if (existingUser) {
        throw new ValidationError("Email already in use");
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

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
};

export async function appointmentCancel(req: Request, res: Response) {

    const { appointmentId } = req.body
    const appointmentData = await Appointment.findById(appointmentId)


    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true })

    // releasing doctor slot 
    const { docId, slotDate, slotTime } = appointmentData

    const doctorData = await Doctor.findById(docId)

    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await Doctor.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment Cancelled' })

}

export async function allDoctors(req: Request, res: Response) {
    const doctors = await Doctor.find({}).select('-password')
    res.json({ success: true, doctors })
}

// API to get all appointments list
export async function appointmentsAdmin(req: Request, res: Response) {
    const appointments = await Appointment.find({})
    res.json({ success: true, appointments })
}

// API to get dashboard data for admin panel
export async function adminDashboard(req: Request, res: Response) {
    const doctors = await Doctor.find({})
    const users = await User.find({})
    const appointments = await Appointment.find({})

    const dashData = {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })
}

