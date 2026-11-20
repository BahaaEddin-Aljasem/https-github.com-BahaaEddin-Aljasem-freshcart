"use client";

import Link from "next/link";
import { Eye, RefreshCw } from "lucide-react";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";

const iconButtonClass = "grid place-items-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition hover:text-brand";

export function ProductCardImageActions({ product, compact = false }: { product: ProductCardData; compact?: boolean }) {
  const similarProductsHref = product.categoryId
    ? `/categories/${product.categoryId}`
    : "/products";
  const buttonClass = `${iconButtonClass} ${compact ? "size-6" : "size-10 sm:size-11"}`;

  return (
    <div className="flex flex-col gap-2">
      <WishlistButton
        product={product}
        className={`${buttonClass} border-0`}
      />
      <Link
        href={similarProductsHref}
        prefetch={false}
        aria-label={`Browse more ${product.categoryName ?? "similar"} products`}
        title="Browse similar products"
        className={buttonClass}
      >
        <RefreshCw className={compact ? "size-3.5" : "size-5"} aria-hidden />
      </Link>
      <Link
        href={`/products/${product.id}`}
        prefetch={false}
        aria-label={`View ${product.title}`}
        title="View product"
        className={buttonClass}
      >
        <Eye className={compact ? "size-3.5" : "size-5"} aria-hidden />
      </Link>
    </div>
  );
}
