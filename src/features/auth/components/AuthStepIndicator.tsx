"use client";

import { Check, KeyRound, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [Mail, KeyRound, Lock];

export function AuthStepIndicator({ current }: { current: number }) {
  return (
    <div className="my-6 flex items-center justify-center" aria-hidden>
      {STEPS.map((Icon, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <div key={index} className="flex items-center">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full transition",
                done || active ? "bg-brand text-white" : "bg-slate-100 text-slate-400",
              )}
            >
              {done ? <Check className="size-4" /> : <Icon className="size-4" />}
            </span>
            {index < STEPS.length - 1 && <span className={cn("h-0.5 w-14 sm:w-20", done ? "bg-brand" : "bg-slate-200")} />}
          </div>
        );
      })}
    </div>
  );
}
