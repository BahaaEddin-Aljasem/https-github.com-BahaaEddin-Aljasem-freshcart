"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import { Spinner } from "@/components/shared/Loading/Spinner";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useHydrated } from "@/hooks/useHydrated";
import { useRemoteCart, useCartMutations } from "@/features/cart/hooks/useCart";
import { useCartStore } from "@/store/cart.store";
import { getCartTotals } from "../utils";
import { CartItemRow } from "./CartItemRow";
import { OrderSummary } from "./OrderSummary";

function CartHeading({ itemCount }: { itemCount: number }) {
  return (
    <header className="mb-5 flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand text-white">
        <ShoppingCart className="size-5" aria-hidden />
      </span>
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Shopping Cart</h1>
        <p className="mt-0.5 text-xs text-slate-500">
          You have <span className="font-semibold text-brand">{itemCount} items</span> in your cart
        </p>
      </div>
    </header>
  );
}

export function CartView() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { data: session } = useSession();
  const commerceSession = hasCommerceSession(session);
  const remoteCart = useRemoteCart(commerceSession);
  const remoteMutations = useCartMutations();
  const remoteItems = remoteCart.data?.items ?? [];
  const showingRemote = commerceSession && remoteItems.length > 0;
  const displayedItems = showingRemote ? remoteItems : items;

  if (!hydrated) return <Spinner label="Loading cart" />;
  if (commerceSession && remoteCart.isLoading && items.length === 0) return <Spinner label="Loading cart" />;
  if (commerceSession && remoteCart.isError && items.length === 0) {
    return <ErrorState message="We couldn't load your cart." onRetry={() => void remoteCart.refetch()} />;
  }
  if (displayedItems.length === 0) {
    return (
      <>
        <CartHeading itemCount={0} />
        <EmptyState title="Your cart is empty" description="Browse the shop and add something you like." action={{ label: "Start shopping", href: "/products" }} />
      </>
    );
  }

  const removeItem = (id: string) => {
    if (showingRemote) remoteMutations.remove.mutate(id);
    else useCartStore.getState().remove(id);
  };
  const updateQuantity = (id: string, quantity: number) => {
    if (showingRemote) remoteMutations.setQuantity.mutate({ productId: id, quantity });
    else useCartStore.getState().setQuantity(id, quantity);
  };
  const clearItems = () => {
    if (showingRemote) {
      remoteMutations.clear.mutate(undefined, { onSuccess: clear });
    } else {
      clear();
    }
  };

  return (
    <div>
      <CartHeading itemCount={displayedItems.length} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem]">
        <div className="space-y-3">
          <ul className="space-y-3">{displayedItems.map((i) => <CartItemRow key={i.id} item={i} onRemove={removeItem} onQuantityChange={updateQuantity} />)}</ul>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs sm:text-sm">
            <Link href="/products" className="inline-flex items-center gap-1 text-brand hover:text-brand-dark">
              <ArrowLeft className="size-3.5" aria-hidden />Continue Shopping
            </Link>
            <button type="button" onClick={clearItems} className="text-slate-400 hover:text-red-600">Clear all items</button>
          </div>
        </div>
        <OrderSummary totals={getCartTotals(displayedItems)}>
          <Link href="/checkout" prefetch={false} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-dark">
            <LockKeyhole className="size-4" aria-hidden />Secure Checkout
          </Link>
          <Link href="/products" className="block text-center text-xs text-brand hover:text-brand-dark">Continue Shopping</Link>
        </OrderSummary>
      </div>
    </div>
  );
}
