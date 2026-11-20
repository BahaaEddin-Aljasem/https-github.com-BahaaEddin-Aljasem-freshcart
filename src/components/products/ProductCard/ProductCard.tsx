import Link from "next/link";
import type { ReactNode } from "react";
import { discountPercent, formatPrice } from "@/utils/format";
import { ProductImage } from "./ProductImage";
import { RatingStars } from "../RatingStars/RatingStars";
import { cn } from "@/lib/utils";

/** UI view-model. API responses are mapped into this shape by the feature layer. */
export interface ProductCardData {
  id: string;
  title: string;
  imageUrl: string;
  categoryId?: string;
  categoryName?: string;
  quantity?: number;
  ratingAverage: number;
  ratingCount: number;
  price: number;
  /** Price before discount, when the product is on sale. */
  originalPrice?: number;
}

interface ProductCardProps {
  product: ProductCardData;
  /** Slot for interactive controls (wishlist / add to cart) wired by the feature layer. */
  actions?: ReactNode;
  imageActions?: ReactNode;
  priority?: boolean;
  compact?: boolean;
  layout?: "grid" | "list";
}

export function ProductCard({ product, actions, imageActions, priority, compact = false, layout = "grid" }: ProductCardProps) {
  const { id, title, imageUrl, categoryName, ratingAverage, ratingCount, price, originalPrice } = product;
  const off = discountPercent(price, originalPrice);
  const isList = layout === "list";

  return (
    <article className={cn(
      "group relative flex h-full overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md",
      isList ? "flex-row" : "flex-col",
    )}>
      <div className={cn(
        "relative overflow-hidden bg-white",
        isList ? "aspect-square w-28 shrink-0 sm:w-40" : "aspect-[1.08] w-full",
      )}>
        <Link href={`/products/${id}`} prefetch={false} className="absolute inset-0 block overflow-hidden" aria-label={title}>
          <ProductImage src={imageUrl} alt={title} priority={priority} className={cn("object-contain", compact ? "p-2.5 sm:p-3" : "p-4 sm:p-5")} />
        </Link>
        {off > 0 && (
          <span className={cn("absolute left-2 top-2 rounded-md bg-red-500 font-medium text-white", compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-sm sm:px-3 sm:text-base")}>-{off}%</span>
        )}
        {imageActions && <div className="absolute right-2 top-2 z-10">{imageActions}</div>}
      </div>
      <div className={cn(
        "flex min-w-0 flex-1 flex-col",
        compact ? "gap-1 px-2.5 pb-2.5 pt-1 sm:gap-1.5 sm:px-3 sm:pb-3" : "gap-1.5 px-3 pb-3 pt-1 sm:gap-2 sm:px-5 sm:pb-5",
      )}>
        {categoryName && <p className={cn("truncate text-slate-500", compact ? "text-[10px]" : "text-sm sm:text-base")}>{categoryName}</p>}
        <h3 className={cn(
          "line-clamp-2 font-normal leading-snug text-slate-700",
          compact ? "min-h-[2.6em] text-xs sm:text-sm" : "min-h-[2.8em] text-base sm:text-xl",
        )}>
          <Link href={`/products/${id}`} prefetch={false} className="hover:text-brand">{title}</Link>
        </h3>
        <RatingStars average={ratingAverage} count={ratingCount} size={compact ? "detail" : "card"} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className={cn("font-bold text-brand", compact ? "text-sm" : "text-lg sm:text-2xl")}>{formatPrice(price)}</span>
            {off > 0 && originalPrice && <span className={cn("text-slate-500 line-through", compact ? "text-[10px]" : "text-sm sm:text-lg")}>{formatPrice(originalPrice)}</span>}
          </p>
          {actions}
        </div>
      </div>
    </article>
  );
}
