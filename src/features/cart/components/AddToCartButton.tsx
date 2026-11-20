"use client";

import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useAddCartItem } from "@/features/cart/hooks/useCart";

interface AddToCartButtonProps {
  product: ProductCardData;
  quantity?: number;
  className?: string;
  compact?: boolean;
}

export function AddToCartButton({ product, quantity = 1, className, compact = false }: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);
  const { data: session } = useSession();
  const commerceSession = hasCommerceSession(session);
  const remoteCart = useAddCartItem();
  return (
    <Button
      type="button"
      className={cn("py-2", className)}
      disabled={product.quantity === 0}
      aria-label={compact ? product.quantity === 0 ? `${product.title} is out of stock` : `Add ${product.title} to cart` : undefined}
      loading={commerceSession ? remoteCart.isPending : false}
      onClick={() => {
        if (commerceSession) {
          remoteCart.mutate({ product, quantity });
        } else {
          add(product, quantity);
          toast.success("Added to cart");
        }
      }}
    >
      {compact
        ? <Plus className="size-4" aria-hidden />
        : <><ShoppingCart className="size-4" aria-hidden /> {product.quantity === 0 ? "Out of stock" : "Add to Cart"}</>}
    </Button>
  );
}
