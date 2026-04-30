import mongoose, { model, type HydratedDocument, type InferSchemaType } from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },  // never return password in queries
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String },
        state: { type: String },
    },
    // map of slotDate -> array of booked slot times e.g. { "2024-01-01": ["10:00", "11:00"] }
    slotsBooked: { 
        type: Map, 
        of: [String],
        default: {} 
    },
}, { timestamps: true })

export const Doctor = model("doctor", doctorSchema);
export type DoctorSchema = InferSchemaType<typeof doctorSchema>;
export type IDoctor = HydratedDocument<InferSchemaType<typeof doctorSchema>>;