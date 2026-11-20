import { Lock, Mail, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Mail, label: "Email Verification" },
  { icon: ShieldCheck, label: "Secure Reset" },
  { icon: Lock, label: "Encrypted" },
];

export function ResetPasswordIllustration({ activeDot }: { activeDot: 0 | 1 | 2 }) {
  return (
    <section className="mx-auto hidden w-full max-w-[430px] md:block">
      <div className="relative flex aspect-[1.6] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-soft to-emerald-50">
        <span className="absolute left-10 top-8 size-16 rounded-full bg-white/50" aria-hidden />
        <span className="absolute right-14 top-16 size-10 rounded-full bg-white/50" aria-hidden />
        <span className="absolute bottom-10 right-20 size-20 rounded-full bg-white/40" aria-hidden />
        <span className="absolute bottom-14 left-16 size-8 rounded-full bg-white/40" aria-hidden />

        <div className="relative flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-md">
            <Mail className="size-6 text-brand" aria-hidden />
          </div>
          <div className="flex size-20 items-center justify-center rounded-2xl bg-brand shadow-lg">
            <Lock className="size-9 text-white" aria-hidden />
          </div>
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-md">
            <ShieldCheck className="size-6 text-brand" aria-hidden />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2" aria-hidden>
        {[0, 1, 2].map((dot) => (
          <span key={dot} className={cn("size-2 rounded-full transition", dot === activeDot ? "bg-brand" : "bg-brand/25")} />
        ))}
      </div>

      <h2 className="mt-3 text-center text-xl font-bold leading-tight text-slate-800 sm:text-2xl">Reset Your Password</h2>
      <p className="mx-auto mt-3 max-w-md text-center text-sm leading-5 text-slate-600">
        Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back into your account in no time.
      </p>

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
        {FEATURES.map(({ icon: Icon, label }) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <Icon className="size-3.5 text-brand" aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
