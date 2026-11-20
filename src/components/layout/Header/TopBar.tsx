"use client";

import Link from "next/link";
import { Gift, LogOut, Mail, Phone, Truck, UserRound } from "lucide-react";
import { useLogout, useSession } from "@/features/auth/hooks/useAuthMutations";

export function TopBar() {
  const { data: session, isPending: sessionPending } = useSession();
  const logout = useLogout();

  return (
    <div className="hidden h-9 border-b border-slate-200 bg-white text-[13px] text-slate-500 md:block">
      <div className="mx-auto flex h-full max-w-[1060px] items-center justify-between px-4 2xl:px-0">
        <div className="flex items-center gap-7">
          <span className="inline-flex items-center gap-2">
            <Truck className="size-4 text-green-600" aria-hidden />
            Free Shipping on Orders 500 EGP
          </span>
          <span className="inline-flex items-center gap-2">
            <Gift className="size-4 text-green-600" aria-hidden />
            New Arrivals Daily
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:+18001234567" className="inline-flex items-center gap-2 transition-colors hover:text-brand">
            <Phone className="size-3.5" aria-hidden />
            +1 (800) 123-4567
          </a>
          <a href="mailto:support@freshcart.com" className="inline-flex items-center gap-2 transition-colors hover:text-brand">
            <Mail className="size-3.5" aria-hidden />
            support@freshcart.com
          </a>
          <span aria-hidden className="h-5 border-l border-slate-200" />
          {session?.authenticated ? (
            <>
              <Link href="/profile" prefetch={false} className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-brand">
                <UserRound className="size-3.5" aria-hidden />
                {session.user?.name ?? "Account"}
              </Link>
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="inline-flex items-center gap-2 transition-colors hover:text-brand"
              >
                <LogOut className="size-3.5" aria-hidden />
                Sign Out
              </button>
            </>
          ) : sessionPending ? (
            <span aria-label="Loading account" className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 transition-colors hover:text-brand">
                <UserRound className="size-3.5" aria-hidden />
                Sign In
              </Link>
              <Link href="/register" className="transition-colors hover:text-brand">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
