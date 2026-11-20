import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <div className="min-h-[50vh] bg-slate-50">
        <div className="mx-auto max-w-[1060px]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
          <div className="px-4 pb-8">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
