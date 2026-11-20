"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import { Spinner } from "@/components/shared/Loading/Spinner";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useLocalOrders, useRemoteOrders } from "@/features/orders/hooks/useOrders";
import { useHydrated } from "@/hooks/useHydrated";
import { OrderCard } from "./OrderCard";

export function OrdersList() {
  const hydrated = useHydrated();
  const { data: session, isLoading: sessionLoading } = useSession();
  const localOnly = session?.localOnly === true;
  const remoteOrdersQuery = useRemoteOrders(hasCommerceSession(session), session?.user?.name);
  const localOrdersQuery = useLocalOrders(session?.user?._id, localOnly);
  const ordersQuery = localOnly ? localOrdersQuery : remoteOrdersQuery;
  const orders = ordersQuery.data ?? [];

  if (!hydrated || sessionLoading || ordersQuery.isLoading) return <Spinner label="Loading orders" />;
  if (ordersQuery.isError) {
    return <ErrorState message="We couldn't load your orders." onRetry={() => void ordersQuery.refetch()} />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-md shadow-green-500/20">
            <ShoppingBag className="size-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-slate-900">My Orders</h1>
            <p className="mt-1 text-xs text-slate-500">
              Track and manage your {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
          </div>
        </div>
        <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:underline">
          <ShoppingBag className="size-3.5" aria-hidden />
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders you place will appear here." action={{ label: "Start shopping", href: "/products" }} />
      ) : (
        <ul className="space-y-3">
          {orders.map((order, index) => (
            <OrderCard key={order.id} order={order} defaultExpanded={index === 0} />
          ))}
        </ul>
      )}
    </div>
  );
}
