import jwt from "jsonwebtoken";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import { Doctor } from "@/models/doctorModel";
import express from "express";
import { Appointment } from "@/models/appointmentModel";
import { User } from "@/models/userModel";
import { env } from "@/src/env";
import { genSalt, hash } from "bcrypt-ts";

// API for admin login
const loginAdmin = async (req: express.Request, res: express.Response) => {
    try {

        const { email, password } = req.body

        if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        };

        const newDoctor = new Doctor(doctorData);
        await newDoctor.save();

        res.status(200).json({ success: true, message: "Doctor Added" });

    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// API for appointment cancellation
const appointmentCancel = async (req: express.Request, res: express.Response) => {
    try {

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

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allDoctors = async (req: express.Request, res: express.Response) => {
    try {

        const doctors = await Doctor.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req: express.Request, res: express.Response) => {
    try {

        const appointments = await Appointment.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for admin panel
const adminDashboard = async (req: express.Request, res: express.Response) => {
    try {

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

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }