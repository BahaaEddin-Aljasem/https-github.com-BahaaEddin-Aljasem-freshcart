"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { PhoneNumberField } from "@/components/ui/PhoneNumberField";
import { useRegister } from "../hooks/useAuthMutations";

export function RegisterForm() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const { mutate, isPending } = useRegister();
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const password = watch("password", "");
  const strengthChecks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = strengthChecks.filter(Boolean).length;
  const strengthLabel = strength < 2 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong";
  const strengthColor = strength < 2 ? "bg-red-400" : strength === 2 ? "bg-amber-400" : "bg-emerald-500";

  return (
    <form
      onSubmit={handleSubmit((values) => {
        if (!acceptedTerms) {
          setTermsError("Please agree to the Terms of Service and Privacy Policy.");
          return;
        }
        setTermsError("");
        mutate(values);
      })}
      className="space-y-3"
      noValidate
    >
      <TextField label="Name*" labelClassName="text-xs font-normal" className="h-8 rounded-md px-2.5 py-1.5 text-xs" placeholder="Ali" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <TextField label="Email*" labelClassName="text-xs font-normal" className="h-8 rounded-md px-2.5 py-1.5 text-xs" type="email" placeholder="ali@example.com" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <TextField
        label="Password*"
        labelClassName="text-xs font-normal"
        className="h-8 rounded-md px-2.5 py-1.5 text-xs"
        type="password"
        placeholder="Create a strong password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <div className="-mt-1 space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full transition-all ${strengthColor}`} style={{ width: `${strength * 25}%` }} />
          </div>
          <span className="text-[10px] text-slate-600">{strengthLabel}</span>
        </div>
        <p className="text-[10px] text-slate-500">Must be at least 8 characters with numbers and symbols.</p>
      </div>
      <TextField
        label="Confirm Password*"
        labelClassName="text-xs font-normal"
        className="h-8 rounded-md px-2.5 py-1.5 text-xs"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.rePassword?.message}
        {...register("rePassword")}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <PhoneNumberField
            label="Phone Number"
            required
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            name={field.name}
            error={errors.phone?.message}
          />
        )}
      />

      <div className="space-y-1 pt-1">
        <label className="flex items-start gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => {
              setAcceptedTerms(event.target.checked);
              if (event.target.checked) setTermsError("");
            }}
            className="mt-0.5 size-3.5 accent-(--color-brand)"
          />
          <span>
            I agree to the <span className="text-brand">Terms of Service</span> and <span className="text-brand">Privacy Policy</span> *
          </span>
        </label>
        {termsError && <p role="alert" className="text-xs text-red-600">{termsError}</p>}
      </div>

      <Button type="submit" loading={isPending} className="h-10 text-xs">
        <UserPlus className="size-3.5" aria-hidden />
        Create My Account
      </Button>
    </form>
  );
}
