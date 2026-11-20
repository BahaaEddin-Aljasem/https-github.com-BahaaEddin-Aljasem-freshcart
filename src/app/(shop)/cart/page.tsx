import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { CartView } from "@/features/cart/components/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-[1060px]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <div className="px-4 pb-8">
          <CartView />
        </div>
      </div>
    </div>
  );
}
