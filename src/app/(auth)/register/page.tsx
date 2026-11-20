import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Star, Truck } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="mx-auto grid min-h-[68vh] max-w-[864px] items-start gap-8 px-4 py-8 md:grid-cols-2 md:gap-8 lg:py-10">
      <section className="space-y-6 pt-1 md:pt-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Welcome to <span className="text-brand">FreshCart</span>
          </h1>
          <p className="mt-1 max-w-md text-sm leading-5 text-slate-700">
            Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.
          </p>
        </div>

        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-brand"><Star className="size-4 fill-current" aria-hidden /></span>
            <span>
              <span className="block text-sm font-semibold text-slate-800">Premium Quality</span>
              <span className="block text-xs leading-5 text-slate-600">Premium quality products sourced from trusted suppliers.</span>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-brand"><Truck className="size-4" aria-hidden /></span>
            <span>
              <span className="block text-sm font-semibold text-slate-800">Fast Delivery</span>
              <span className="block text-xs leading-5 text-slate-600">Same-day delivery available in most areas.</span>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-brand"><ShieldCheck className="size-4 fill-current" aria-hidden /></span>
            <span>
              <span className="block text-sm font-semibold text-slate-800">Secure Shopping</span>
              <span className="block text-xs leading-5 text-slate-600">Your data and payments are completely secure.</span>
            </span>
          </li>
        </ul>

        <figure className="rounded-lg border border-line bg-white p-3 shadow-sm">
          <figcaption className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-brand">SJ</span>
            <span>
              <span className="block text-xs font-medium text-slate-800">Sarah Johnson</span>
              <span className="flex text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3.5 fill-current" aria-hidden />)}
              </span>
            </span>
          </figcaption>
          <blockquote className="mt-2 text-xs italic leading-5 text-slate-600">
            “FreshCart has transformed my shopping experience. The quality of the products is outstanding, and the delivery is always on time. Highly recommend!”
          </blockquote>
        </figure>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md sm:p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Create Your Account</h2>
          <p className="mt-1 text-xs text-slate-600">Start your fresh journey with us today</p>
        </div>

        <SocialAuthButtons />

        <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <RegisterForm />

        <div className="mt-4 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          Already have an account? <Link href="/login" className="font-medium text-brand hover:underline">Sign In</Link>
        </div>
      </section>
    </div>
  );
}
