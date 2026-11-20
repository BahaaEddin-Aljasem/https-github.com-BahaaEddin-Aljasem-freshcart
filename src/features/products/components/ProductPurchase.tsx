"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Zap } from "lucide-react";
import { toast } from "sonner";
import { MAX_QUANTITY } from "@/config/constants";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useAddCartItem } from "@/features/cart/hooks/useCart";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/utils/format";
import type { Product } from "@/services/catalog.service";

export function ProductPurchase({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = Math.min(MAX_QUANTITY, product.quantity);
  const router = useRouter();
  const add = useCartStore((state) => state.add);
  const { data: session } = useSession();
  const commerceSession = hasCommerceSession(session);
  const remoteCart = useAddCartItem();

  if (maxQuantity === 0) {
    return <p className="mt-6 font-semibold text-red-600">Currently out of stock</p>;
  }

  const buyNow = () => {
    if (commerceSession) {
      remoteCart.mutate({ product, quantity }, { onSuccess: () => router.push("/checkout") });
      return;
    }

    add(product, quantity);
    router.push("/checkout");
  };

  const shareProduct = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url: window.location.href });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error(error instanceof Error ? error.message : "Unable to share this product");
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1.5 text-xs font-medium text-slate-600">Quantity</p>
          <QuantitySelector value={quantity} onChange={setQuantity} max={maxQuantity} />
        </div>
        <p className="pb-2 text-xs text-muted">{product.quantity.toLocaleString("en-US")} available</p>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
        <span className="text-sm text-slate-600">Total Price:</span>
        <span className="text-lg font-bold text-brand">{formatPrice(product.price * quantity)}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <AddToCartButton product={product} quantity={quantity} className="min-h-11 w-full justify-center rounded-lg px-3 py-3" />
        <button
          type="button"
          onClick={buyNow}
          disabled={remoteCart.isPending}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Zap className="size-4" aria-hidden />
          Buy Now
        </button>
      </div>
      <div className="flex gap-2">
        <WishlistButton product={product} showLabel className="min-h-10 flex-1 justify-center" />
        <button
          type="button"
          onClick={shareProduct}
          aria-label="Share product"
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-slate-600 transition-colors hover:border-brand hover:text-brand"
        >
          <Share2 className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
