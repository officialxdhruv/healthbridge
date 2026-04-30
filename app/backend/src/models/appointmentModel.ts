import mongoose, { model, type HydratedDocument, type InferSchemaType } from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true
    },
    slotDateTime: { type: Date, required: true },   // combined date + time
    // snapshots of user/doctor data at booking time
    userData: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        image: { type: String },
    },
    docData: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        speciality: { type: String },
        image: { type: String },
    },
    amount: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
}, { timestamps: true })   // adds createdAt and updatedAt automatically

export const Appointment = model("appointment", appointmentSchema);
export type IAppointment = HydratedDocument<InferSchemaType<typeof appointmentSchema>>;