"use client";

import { toast } from "sonner";

export function SocialAuthButtons({
  layout = "grid",
  showContinueLabel = false,
}: {
  layout?: "grid" | "stacked";
  showContinueLabel?: boolean;
}) {
  return (
    <div className={`mt-5 grid gap-2 ${layout === "stacked" ? "grid-cols-1" : "grid-cols-2"}`}>
      <button
        type="button"
        onClick={() => toast.info("Google sign-in is not configured yet.")}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        <span aria-hidden className="font-bold text-red-500">G</span> {showContinueLabel ? "Continue with Google" : "Google"}
      </button>
      <button
        type="button"
        onClick={() => toast.info("Facebook sign-in is not configured yet.")}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        <span aria-hidden className="grid size-3.5 place-items-center rounded-full bg-blue-600 text-[10px] font-bold text-white">f</span> {showContinueLabel ? "Continue with Facebook" : "Facebook"}
      </button>
    </div>
  );
}
