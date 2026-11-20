import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { OrderDetails } from "@/features/orders/components/OrderDetails";
import { first, type SearchParams } from "@/utils/url";

export const metadata: Metadata = { title: "Order Details" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<SearchParams> };

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const justPlaced = first((await searchParams).placed) === "1";
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Orders", href: "/profile/orders" }, { label: id }]} />
      <div className="mx-auto max-w-3xl px-4 pb-8">
        <OrderDetails id={id} justPlaced={justPlaced} />
      </div>
    </>
  );
}
