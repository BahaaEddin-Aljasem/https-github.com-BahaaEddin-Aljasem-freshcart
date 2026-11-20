import type { Metadata } from "next";
import { ForgotPasswordScreen } from "@/features/auth/components/ForgotPasswordScreen";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
