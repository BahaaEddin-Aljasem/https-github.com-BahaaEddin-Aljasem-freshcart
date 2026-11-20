"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { Button } from "@/components/ui/Button";
import { useLogin } from "../hooks/useAuthMutations";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const next = safeNext(useSearchParams().get("next"));
  const { mutate, isPending } = useLogin(next);
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof loginSchema>, unknown, LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-3" noValidate>
      <div className="space-y-1">
        <label htmlFor="login-email" className="text-xs font-medium text-slate-700">Email Address</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={`h-9 w-full rounded-lg border bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 ${errors.email ? "border-red-500" : "border-line"}`}
            placeholder="Enter your email"
            {...register("email")}
          />
        </div>
        {errors.email && <p id="login-email-error" role="alert" className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs font-medium text-slate-700">Password</label>
          <Link href="/forgot-password" className="text-[11px] font-medium text-brand hover:underline">Forgot Password?</Link>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className={`h-9 w-full rounded-lg border bg-white pl-9 pr-10 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 ${errors.password ? "border-red-500" : "border-line"}`}
            placeholder="Enter your password"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </div>
        {errors.password && <p id="login-password-error" role="alert" className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 py-0.5 text-[11px] text-slate-600">
        <input type="checkbox" className="size-3.5 accent-brand" {...register("rememberMe")} />
        Keep me signed in
      </label>

      <Button type="submit" loading={isPending} className="h-9 rounded-lg text-xs">Sign In</Button>
    </form>
  );
}
