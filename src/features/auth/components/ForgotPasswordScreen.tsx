"use client";

import { useState } from "react";
import { ForgotPasswordFlow } from "./ForgotPasswordFlow";
import { ResetPasswordIllustration } from "./ResetPasswordIllustration";

type Step = "email" | "code" | "reset";
const STEP_DOT: Record<Step, 0 | 1 | 2> = { email: 0, code: 1, reset: 2 };

export function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>("email");

  return (
    <div className="mx-auto grid max-w-[900px] items-center gap-8 px-3 py-12 md:min-h-[640px] md:grid-cols-2 md:gap-8 md:px-4 md:py-8 lg:py-10">
      <ResetPasswordIllustration activeDot={STEP_DOT[step]} />
      <ForgotPasswordFlow onStepChange={setStep} />
    </div>
  );
}
