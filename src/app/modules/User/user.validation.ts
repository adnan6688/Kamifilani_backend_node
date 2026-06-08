
import {  z } from "zod";

export const userZodSchema = z.object({
    name: z.string().min(2, "Minimum 2 characters required").max(25),

    email: z.string().email("Invalid email format"),

    password: z
        .string()
        .min(8, "Minimum 8 characters required")
        .max(15, "Maximum 15 characters allowed")
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)/,
            "Password must contain at least one letter and one number"
        ),
    birth_date: z.coerce
        .date()
        .refine((date) => date <= new Date(), {
            message: "Birth date cannot be in the future",
        })
});

