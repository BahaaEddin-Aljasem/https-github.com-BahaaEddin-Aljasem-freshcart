"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import { Spinner } from "@/components/shared/Loading/Spinner";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useLocalOrders, useRemoteOrders } from "@/features/orders/hooks/useOrders";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice } from "@/utils/format";

export function OrderDetails({ id, justPlaced }: { id: string; justPlaced: boolean }) {
  const hydrated = useHydrated();
  const { data: session, isLoading: sessionLoading } = useSession();
  const localOnly = session?.localOnly === true;
  const remoteOrdersQuery = useRemoteOrders(hasCommerceSession(session), session?.user?.name);
  const localOrdersQuery = useLocalOrders(session?.user?._id, localOnly);
  const ordersQuery = localOnly ? localOrdersQuery : remoteOrdersQuery;
  const order = ordersQuery.data?.find((item) => item.id === id);

  if (!hydrated || sessionLoading || ordersQuery.isLoading) return <Spinner label="Loading order" />;
  if (ordersQuery.isError) {
    return <ErrorState message="We couldn't load this order." onRetry={() => void ordersQuery.refetch()} />;
  }
  if (!order) return <EmptyState title="Order not found" action={{ label: "Back to orders", href: "/profile/orders" }} />;
  const savedLocally = order.status === "Saved locally";

  return (
    <div className="space-y-6">
      {savedLocally && (
        <div role="status" className="flex items-center gap-3 rounded-xl bg-slate-100 p-4 text-slate-700">
          <CheckCircle2 className="size-6 shrink-0" aria-hidden />
          <p className="text-sm font-medium">This order is saved in this browser only and has not been sent to the store.</p>
        </div>
      )}
      {justPlaced && !savedLocally && (
        <div role="status" className="flex items-center gap-3 rounded-xl bg-brand-soft p-4 text-brand">
          <CheckCircle2 className="size-6 shrink-0" aria-hidden />
          <p className="text-sm font-medium">Order placed successfully. Thank you for shopping with FreshCart!</p>
        </div>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">Order {order.id}</h1>
        <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleString("en-GB")} · {order.status}</p>
      </div>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {order.items.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-3 p-3 text-sm">
            <Link href={`/products/${i.id}`} className="line-clamp-2 hover:text-brand">{i.title} × {i.quantity}</Link>
            <span className="shrink-0 font-medium">{formatPrice(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-line p-4 text-sm">
          <h2 className="mb-2 font-bold">Shipping to</h2>
          <p>{order.address.fullName}</p>
          <p className="text-muted">{order.address.address}, {order.address.city}</p>
          <p className="text-muted">{order.address.phone}</p>
          {order.address.notes && <p className="mt-2 text-muted">Delivery note: {order.address.notes}</p>}
        </section>
        <section className="space-y-1 rounded-xl border border-line p-4 text-sm">
          <h2 className="mb-2 font-bold">Payment</h2>
          <p className="text-muted">Cash on delivery</p>
          <p className="flex justify-between"><span className="text-muted">Subtotal</span>{formatPrice(order.subtotal)}</p>
          <p className="flex justify-between"><span className="text-muted">Shipping</span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</p>
          <p className="flex justify-between border-t border-line pt-2 font-bold"><span>Total</span><span className="text-brand">{formatPrice(order.total)}</span></p>
        </section>
      </div>
      <Link href="/profile/orders" className="inline-block text-sm text-brand hover:underline">← All orders</Link>
    </div>
  );
}
