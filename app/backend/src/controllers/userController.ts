import validator from 'validator'
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary'
// import razorpay from 'razorpay';
import { User } from '@/models/userModel';
import { env } from '@/env';
import type express from "express";
import { Doctor } from '@/models/doctorModel';
import { Appointment } from '@/models/appointmentModel';
import { compare, genSalt, hash } from 'bcrypt-ts';



// API to register user
export const registerUser = async (req: express.Request, res: express.Response) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new User(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error: any) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
export const loginUser = async (req: express.Request, res: express.Response) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error: any) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
export const getProfile = async (req: express.Request, res: express.Response) => {

    try {
        const { userId } = req.body
        const userData = await User.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error: any) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
export const updateProfile = async (req: express.Request, res: express.Response) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await User.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await User.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error: any) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
export const bookAppointment = async (req: express.Request, res: express.Response) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await Doctor.findById(docId).select("-password")

        if (docData && !docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await User.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new Appointment(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await Doctor.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error: any) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
export const cancelAppointment = async (req: express.Request, res: express.Response) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await Appointment.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await Doctor.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await Doctor.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error: any) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
export const listAppointment = async (req: express.Request, res: express.Response) => {
    try {

        const { userId } = req.body
        const appointments = await Appointment.find({ userId })

        res.json({ success: true, appointments })

    } catch (error: any) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// const razorpayInstance = new razorpay({
//     key_id: env.RAZORPAY_KEY_ID,
//     key_secret: env.RAZORPAY_KEY_SECRET
// })

// API to make payment of appointment using razorpay
// export const paymentRazorpay = async (req: express.Request, res: express.Response) => {
//     try {

//         const { appointmentId } = req.body
//         const appointmentData = await Appointment.findById(appointmentId)

//         if (!appointmentData || appointmentData.cancelled) {
//             return res.json({ success: false, message: 'Appointment Cancelled or not found' })
//         }

//         // creating options for razorpay payment
//         const options = {
//             amount: appointmentData.amount * 100,
//             currency: env.CURRENCY,
//             receipt: appointmentId,
//         }

//         // creation of an order
//         const order = await razorpayInstance.orders.create(options)

//         res.json({ success: true, order })

//     } catch (error: any) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// API to verify payment of razorpay
// export const verifyRazorpay = async (req: express.Request, res: express.Response) => {
//     try {
//         const { razorpay_order_id } = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

//         if (orderInfo.status === 'paid') {
//             await Appointment.findByIdAndUpdate(orderInfo.receipt, { payment: true })
//             res.json({ success: true, message: "Payment Successful" })
//         }
//         else {
//             res.json({ success: false, message: 'Payment Failed' })
//         }
//     } catch (error: any) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

