"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import {
  forgotPasswordSchema, verifyCodeSchema, resetPasswordSchema,
  type ForgotPasswordInput, type VerifyCodeInput, type ResetPasswordInput,
} from "@/schemas/auth";
import { Button } from "@/components/ui/Button";
import { OtpInput } from "@/components/ui/OtpInput";
import { useForgotPassword, useResetPassword, useVerifyResetCode } from "../hooks/useAuthMutations";
import { AuthStepIndicator } from "./AuthStepIndicator";

type Step = "email" | "code" | "reset";

const STEP_INDEX: Record<Step, number> = { email: 0, code: 1, reset: 2 };
const STEP_COPY: Record<Step, { title: string; subtitle: string }> = {
  email: { title: "Forgot Password?", subtitle: "No worries, we'll send you a reset code" },
  code: { title: "Check Your Email", subtitle: "" },
  reset: { title: "Create New Password", subtitle: "Your new password must be different from previous passwords" },
};

export function ForgotPasswordFlow({ onStepChange }: { onStepChange?: (step: Step) => void }) {
  const router = useRouter();
  const [step, setStepState] = useState<Step>("email");
  const setStep = (next: Step) => {
    setStepState(next);
    onStepChange?.(next);
  };
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const forgot = useForgotPassword();
  const verify = useVerifyResetCode();
  const reset = useResetPassword();

  const emailForm = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });
  const codeForm = useForm<VerifyCodeInput>({ resolver: zodResolver(verifyCodeSchema), defaultValues: { resetCode: "" } });
  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    values: { email, newPassword: "", confirmPassword: "" },
  });

  const copy = STEP_COPY[step];

  return (
    <section className="w-full rounded-xl border border-slate-100 bg-white px-9 py-6 shadow-lg sm:px-7">
      <p aria-label="FreshCart" className="text-center text-xl font-bold tracking-tight">
        <span className="text-brand">Fresh</span><span className="text-slate-800">Cart</span>
      </p>
      <h1 className="mt-4 text-center text-xl font-bold text-slate-800">{copy.title}</h1>
      <p className="mt-1 text-center text-sm text-slate-600">
        {step === "code" ? <>Enter the 6-digit code sent to <span className="font-medium text-slate-800">{email}</span></> : copy.subtitle}
      </p>

      <AuthStepIndicator current={STEP_INDEX[step]} />

      {step === "email" && (
        <form
          noValidate
          className="space-y-4"
          onSubmit={emailForm.handleSubmit((v) =>
            forgot.mutate(v, { onSuccess: () => { setEmail(v.email); setStep("code"); toast.success("Code sent to your email"); } }),
          )}
        >
          <div className="space-y-1.5">
            <label htmlFor="forgot-email" className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                aria-invalid={!!emailForm.formState.errors.email}
                className="w-full rounded-lg border border-line py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                {...emailForm.register("email")}
              />
            </div>
            {emailForm.formState.errors.email && (
              <p role="alert" className="text-xs text-red-600">{emailForm.formState.errors.email.message}</p>
            )}
          </div>
          <Button type="submit" loading={forgot.isPending}>
            <SendHorizonal className="size-4" aria-hidden />
            Send Reset Code
          </Button>
          <div className="border-t border-slate-100 pt-4 text-center text-sm text-muted">
            Remember your password? <button type="button" onClick={() => router.push("/login")} className="font-medium text-brand hover:underline">Sign In</button>
          </div>
        </form>
      )}

      {step === "code" && (
        <form
          noValidate
          className="space-y-4"
          onSubmit={codeForm.handleSubmit((v) => verify.mutate(v, { onSuccess: () => setStep("reset") }))}
        >
          <div className="space-y-2">
            <label className="block text-center text-sm font-medium">Verification Code</label>
            <Controller
              control={codeForm.control}
              name="resetCode"
              render={({ field }) => (
                <OtpInput value={field.value} onChange={field.onChange} error={!!codeForm.formState.errors.resetCode} />
              )}
            />
            {codeForm.formState.errors.resetCode && (
              <p role="alert" className="text-center text-xs text-red-600">{codeForm.formState.errors.resetCode.message}</p>
            )}
          </div>
          <p className="text-center text-sm text-muted">
            Didn&apos;t receive the code?{" "}
            <button type="button" onClick={() => forgot.mutate({ email }, { onSuccess: () => toast.success("Code resent to your email") })} className="font-medium text-brand hover:underline">
              Resend Code
            </button>
          </p>
          <Button type="submit" loading={verify.isPending}>Verify Code</Button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="flex w-full items-center justify-center gap-1.5 text-sm text-muted hover:text-brand"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Change email address
          </button>
        </form>
      )}

      {step === "reset" && (
        <form
          noValidate
          className="space-y-4"
          onSubmit={resetForm.handleSubmit((v) =>
            reset.mutate(v, { onSuccess: () => { toast.success("Password updated. Please sign in."); router.push("/login"); } }),
          )}
        >
          <div className="space-y-1.5">
            <label htmlFor="reset-new-password" className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="reset-new-password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter new password"
                aria-invalid={!!resetForm.formState.errors.newPassword}
                className="w-full rounded-lg border border-line py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                {...resetForm.register("newPassword")}
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              </button>
            </div>
            {resetForm.formState.errors.newPassword && (
              <p role="alert" className="text-xs text-red-600">{resetForm.formState.errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reset-confirm-password" className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm new password"
                aria-invalid={!!resetForm.formState.errors.confirmPassword}
                className="w-full rounded-lg border border-line py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                {...resetForm.register("confirmPassword")}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              </button>
            </div>
            {resetForm.formState.errors.confirmPassword && (
              <p role="alert" className="text-xs text-red-600">{resetForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" loading={reset.isPending}>Reset Password</Button>
        </form>
      )}
    </section>
  );
}
