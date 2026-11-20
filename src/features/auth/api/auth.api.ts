import { api } from "@/lib/axios";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyCodeInput,
} from "@/schemas/auth";
import type { AuthResponse, MessageResponse } from "../types";

export const authApi = {
  forgotPassword: (input: ForgotPasswordInput) =>
    api.post<MessageResponse>(ENDPOINTS.auth.forgotPasswords, input).then((r) => r.data),
  verifyResetCode: (input: VerifyCodeInput) =>
    api.post<MessageResponse>(ENDPOINTS.auth.verifyResetCode, input).then((r) => r.data),
  resetPassword: ({ email, newPassword }: ResetPasswordInput) =>
    api.put<AuthResponse>(ENDPOINTS.auth.resetPassword, { email, newPassword }).then((r) => r.data),
};
