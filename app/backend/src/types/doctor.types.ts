import { z } from "zod";

export const addDoctorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    speciality: z.string().min(1, "Speciality is required"),
    degree: z.string().min(1, "Degree is required"),
    experience: z.string().min(1, "Experience is required"),
    about: z.string().min(1, "About is required"),
    fees: z.coerce.number().min(1, "Fees is required"),
    address: z.string().transform((val) => {
        try {
            return JSON.parse(val);
        } catch {
            throw new Error("Address must be valid JSON");
        }
    }).pipe(z.object({
        line1: z.string().min(1, "Address line1 is required"),
        line2: z.string().optional(),
        city: z.string().min(1, "City is required"),   // add this
        state: z.string().optional(),
    })),
});

export const loginDoctorSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});