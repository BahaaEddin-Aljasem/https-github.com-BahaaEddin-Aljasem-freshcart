import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { OrdersList } from "@/features/orders/components/OrdersList";

export const metadata: Metadata = { title: "My Orders" };

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-265">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Orders" }]} />
      <div className="px-4 pb-10">
        <OrdersList />
      </div>
    </div>
  );
}
