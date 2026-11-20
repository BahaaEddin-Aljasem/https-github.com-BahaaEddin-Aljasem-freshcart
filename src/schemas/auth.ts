import { z } from "zod";
import { isValidInternationalPhoneNumber } from "@/lib/phone";

const email = z.string().trim().email("Enter a valid email");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(true),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters").max(30),
    email,
    phone: z.string().refine(isValidInternationalPhoneNumber, "Enter a valid international phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must include at least one symbol"),
    rePassword: z.string(),
  })
  .refine((d) => d.password === d.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(30),
  email,
  phone: z.string().refine(
    (value) => value.trim() === "" || isValidInternationalPhoneNumber(value),
    "Enter a valid international phone number",
  ),
});

export const forgotPasswordSchema = z.object({ email });
export const verifyCodeSchema = z.object({
  resetCode: z.string().trim().min(4, "Enter the code sent to your email"),
});
export const resetPasswordSchema = z
  .object({
    email,
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
