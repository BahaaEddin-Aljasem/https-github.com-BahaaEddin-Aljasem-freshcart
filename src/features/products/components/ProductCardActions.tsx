"use client";

import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";

export function ProductCardActions({ product }: { product: ProductCardData }) {
  return (
    <AddToCartButton
      product={product}
      compact
      className="size-9 shrink-0 rounded-full p-0 shadow-sm"
    />
  );
}
