import { z } from "zod";

export const addDoctorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),  // z.email() → z.string().email()
    password: z.string().min(8, "Password must be at least 8 characters"),
    speciality: z.string().min(1, "Speciality is required"),
    degree: z.string().min(1, "Degree is required"),
    experience: z.string().min(1, "Experience is required"),
    about: z.string().min(1, "About is required"),
    fees: z.coerce.number().min(1, "Fees is required"),
    address: z.string().transform((val) => {
        try { return JSON.parse(val) }
        catch { throw new Error("Address must be valid JSON") }
    }).pipe(z.object({
        line1: z.string().min(1, "Address line1 is required"),
        line2: z.string().optional(),
    })),
})

export const loginDoctorSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const appointmentIdSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
});

export const updateDoctorSchema = z.object({
    fees: z.coerce.number().min(0, "Fees must be a positive number"),
    address: z.object({
        line1: z.string(),
        line2: z.string().optional(),
    }),
    available: z.boolean(),
    about: z.string().min(1, "About is required"),
})