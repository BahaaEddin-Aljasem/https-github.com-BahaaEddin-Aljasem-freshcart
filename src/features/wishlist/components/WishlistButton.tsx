"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist.store";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useRemoteWishlist, useWishlistMutations } from "@/features/wishlist/hooks/useWishlist";

interface WishlistButtonProps {
  product: ProductCardData;
  showLabel?: boolean;
  className?: string;
}

export function WishlistButton({ product, showLabel = false, className }: WishlistButtonProps) {
  const hydrated = useHydrated();
  const localInList = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const { data: session } = useSession();
  const commerceSession = hasCommerceSession(session);
  const remoteWishlist = useRemoteWishlist(commerceSession);
  const remoteMutations = useWishlistMutations();
  const inList = commerceSession
    ? (remoteWishlist.data?.some((item) => item.id === product.id) ?? localInList)
    : localInList;
  const active = hydrated && inList;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      disabled={commerceSession && remoteMutations.toggle.isPending}
      onClick={() => {
        if (commerceSession) remoteMutations.toggle.mutate(product);
        else toast.success(toggle(product) ? "Added to wishlist" : "Removed from wishlist");
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium transition hover:border-brand hover:text-brand",
        showLabel ? "px-4 py-2.5" : "size-10 shrink-0",
        className,
      )}
    >
      <Heart className={cn("size-4", active && "fill-red-500 text-red-500")} aria-hidden />
      {showLabel && (active ? "In wishlist" : "Add to wishlist")}
    </button>
  );
}
