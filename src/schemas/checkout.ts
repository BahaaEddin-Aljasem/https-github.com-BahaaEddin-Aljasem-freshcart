import { z } from "zod";
import { isCountryCode, isValidInternationalPhoneNumber } from "@/lib/phone";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(3, "Enter your full name"),
  phone: z.string().refine(isValidInternationalPhoneNumber, "Enter a valid international phone number"),
  country: z.string().refine((value): boolean => isCountryCode(value), "Choose a valid country"),
  city: z.string().trim().min(2, "Enter your city"),
  address: z.string().trim().min(5, "Enter your full address").max(240, "Address is too long"),
  notes: z.string().trim().max(200).optional(),
  payment: z.enum(["cash", "card"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
