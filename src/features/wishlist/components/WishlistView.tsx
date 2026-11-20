"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import { Spinner } from "@/components/shared/Loading/Spinner";
import { ProductImage } from "@/components/products/ProductCard/ProductImage";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useRemoteWishlist, useWishlistMutations } from "@/features/wishlist/hooks/useWishlist";
import { useHydrated } from "@/hooks/useHydrated";
import { formatPrice } from "@/utils/format";
import { useWishlistStore } from "@/store/wishlist.store";

export function WishlistView() {
  const hydrated = useHydrated();
  const localItems = useWishlistStore((s) => s.items);
  const { data: session } = useSession();
  const commerceSession = hasCommerceSession(session);
  const remoteWishlist = useRemoteWishlist(commerceSession);
  const remoteMutations = useWishlistMutations();
  const items = commerceSession && (remoteWishlist.data?.length ?? 0) > 0
    ? remoteWishlist.data ?? []
    : localItems;

  if (!hydrated) return <Spinner label="Loading wishlist" />;
  if (commerceSession && remoteWishlist.isLoading && localItems.length === 0) return <Spinner label="Loading wishlist" />;
  if (commerceSession && remoteWishlist.isError && localItems.length === 0) {
    return <ErrorState message="We couldn't load your wishlist." onRetry={() => void remoteWishlist.refetch()} />;
  }

  const showingRemote = commerceSession && (remoteWishlist.data?.length ?? 0) > 0;
  const removeItem = (id: string) => {
    if (showingRemote) {
      const product = items.find((item) => item.id === id);
      if (product) remoteMutations.toggle.mutate(product);
      return;
    }
    useWishlistStore.getState().remove(id);
  };

  return (
    <>
      <header className="mb-5 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
          <Heart className="size-5 fill-current" aria-hidden />
        </span>
        <div>
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">My Wishlist</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <EmptyState title="Your wishlist is empty" description="Tap the heart on any product to save it here." action={{ label: "Explore products", href: "/products" }} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th scope="col" className="px-3 py-3 font-medium">Product</th>
                  <th scope="col" className="px-3 py-3 font-medium">Price</th>
                  <th scope="col" className="px-3 py-3 font-medium">Status</th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Link href={`/products/${item.id}`} className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                          <ProductImage src={item.imageUrl} alt={item.title} className="object-contain p-1" />
                        </Link>
                        <div className="min-w-0">
                          <Link href={`/products/${item.id}`} className="line-clamp-2 font-medium text-slate-800 hover:text-brand">
                            {item.title}
                          </Link>
                          {item.categoryName && (
                            <p className="mt-0.5 truncate text-[10px] text-slate-400">{item.categoryName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-slate-800">
                      {formatPrice(item.price)}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="ml-1.5 text-[10px] font-normal text-slate-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium ${
                        item.quantity === 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          item.quantity === 0 ? "bg-red-500" : "bg-emerald-500"
                        }`} aria-hidden />
                        {item.quantity === 0 ? "Out of Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        <AddToCartButton
                          product={item}
                          className="w-auto min-h-7 rounded-md px-2.5 py-1 text-[10px]"
                        />
                        <button
                          type="button"
                          aria-label={`Remove ${item.title} from wishlist`}
                          disabled={remoteMutations.toggle.isPending}
                          onClick={() => removeItem(item.id)}
                          className="grid size-8 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-400 transition hover:border-red-200 hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link href="/products" className="mt-4 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand">
            <ArrowLeft className="size-3" aria-hidden />
            Continue Shopping
          </Link>
        </>
      )}
    </>
  );
}
