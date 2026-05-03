import mongoose, { model, type HydratedDocument, type InferSchemaType } from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    slotDate: { type: String, required: true },   // revert back to separate fields
    slotTime: { type: String, required: true },
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
}, { timestamps: true })

export const Appointment = model("appointment", appointmentSchema);
export type IAppointment = HydratedDocument<InferSchemaType<typeof appointmentSchema>>;