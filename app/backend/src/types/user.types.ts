import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().transform((val) => {
        try {
            return JSON.parse(val)
        } catch {
            throw new Error("Address must be valid JSON")
        }
    }).pipe(z.object({
        line1: z.string(),
        line2: z.string().optional(),
    })),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;