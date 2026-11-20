import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, ShieldCheck, Star, Truck, Users } from "lucide-react";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";
import { GroceryCartIllustration } from "@/features/auth/components/GroceryCartIllustration";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="mx-auto grid max-w-[900px] items-center gap-8 px-3 py-12 md:min-h-[640px] md:grid-cols-2 md:gap-8 md:px-4 md:py-8 lg:py-10">
      <section className="mx-auto hidden w-full max-w-[430px] md:block">
        <GroceryCartIllustration />
        <h2 className="mt-3 text-center text-xl font-bold leading-tight text-slate-800 sm:text-2xl">
          FreshCart - Your One-Stop Shop for Fresh Products
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm leading-5 text-slate-600">
          Join thousands of happy customers who trust FreshCart for their daily grocery needs
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
          <li className="inline-flex items-center gap-1.5"><Truck className="size-3.5 text-brand" aria-hidden />Free Delivery</li>
          <li className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-brand" aria-hidden />Secure Payment</li>
          <li className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5 text-brand" aria-hidden />24/7 Support</li>
        </ul>
      </section>

      <section className="w-full rounded-xl border border-slate-100 bg-white px-9 py-6 shadow-lg sm:px-7">
        <div className="text-center">
          <p aria-label="FreshCart" className="text-xl font-bold tracking-tight">
            <span className="text-brand">Fresh</span><span className="text-slate-800">Cart</span>
          </p>
          <h1 className="mt-2 text-lg font-bold text-slate-800">Welcome Back!</h1>
          <p className="mt-1 text-xs text-slate-600">Sign in to continue your fresh shopping experience</p>
        </div>

        <SocialAuthButtons layout="stacked" showContinueLabel />

        <div className="my-4 flex items-center gap-3 text-[10px] font-medium uppercase text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />
          or continue with email
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <div className="mt-4 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          New to FreshCart? <Link href="/register" className="font-medium text-brand hover:underline">Create an account</Link>
        </div>

        <ul aria-label="FreshCart account benefits" className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] text-slate-500">
          <li className="inline-flex items-center gap-1"><ShieldCheck className="size-3" aria-hidden />SSL Secured</li>
          <li className="inline-flex items-center gap-1"><Users className="size-3" aria-hidden />50K+ Users</li>
          <li className="inline-flex items-center gap-1"><Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />4.9 Rating</li>
        </ul>
      </section>
    </div>
  );
}
