"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toApiError } from "@/lib/axios";
import type { LoginInput, RegisterInput } from "@/schemas/auth";
import { authApi } from "../api/auth.api";
import { useAuthContext } from "../context/AuthContext";

const onLocalError = (error: unknown) =>
  toast.error(error instanceof Error ? error.message : "Local authentication failed. Please try again.");
const onRemoteError = (error: unknown) => toast.error(toApiError(error).message);

export function hasCommerceSession(session?: { authenticated: boolean; localOnly?: boolean }) {
  return session?.authenticated === true && session.localOnly !== true;
}

export function useSession() {
  const { session, isReady } = useAuthContext();
  return { data: session, isPending: !isReady, isLoading: !isReady };
}

export function useLogin(next = "/") {
  const { login } = useAuthContext();
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async () => {
      await Promise.all([
        qc.removeQueries({ queryKey: ["cart"] }),
        qc.removeQueries({ queryKey: ["wishlist"] }),
        qc.removeQueries({ queryKey: ["orders"] }),
      ]);
      toast.success("Welcome back!");
      router.push(next);
    },
    onError: onLocalError,
  });
}

export function useRegister() {
  const { register: registerLocally } = useAuthContext();
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => registerLocally(input),
    onSuccess: async () => {
      await Promise.all([
        qc.removeQueries({ queryKey: ["cart"] }),
        qc.removeQueries({ queryKey: ["wishlist"] }),
        qc.removeQueries({ queryKey: ["orders"] }),
      ]);
      toast.success("Account created");
      router.push("/");
    },
    onError: onLocalError,
  });
}

export function useLogout() {
  const { logout } = useAuthContext();
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await Promise.all([
        qc.removeQueries({ queryKey: ["cart"] }),
        qc.removeQueries({ queryKey: ["wishlist"] }),
        qc.removeQueries({ queryKey: ["orders"] }),
      ]);
      toast.success("Signed out");
      router.push("/");
    },
    onError: onLocalError,
  });
}

export const useForgotPassword = () =>
  useMutation({ mutationFn: authApi.forgotPassword, onError: onRemoteError });
export const useVerifyResetCode = () =>
  useMutation({ mutationFn: authApi.verifyResetCode, onError: onRemoteError });
export const useResetPassword = () =>
  useMutation({ mutationFn: authApi.resetPassword, onError: onRemoteError });
