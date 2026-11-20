import type { ReactNode } from "react";
import { ProductCard, type ProductCardData } from "../ProductCard/ProductCard";

interface ProductGridProps {
  products: ProductCardData[];
  renderActions?: (product: ProductCardData) => ReactNode;
  renderImageActions?: (product: ProductCardData) => ReactNode;
  className?: string;
  itemClassName?: string;
  compact?: boolean;
  layout?: "grid" | "list";
}

export function ProductGrid({ products, renderActions, renderImageActions, className, itemClassName, compact, layout }: ProductGridProps) {
  return (
    <ul className={className ?? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}>
      {products.map((p) => (
        <li key={p.id} className={itemClassName}>
          <ProductCard
            product={p}
            imageActions={renderImageActions?.(p)}
            actions={renderActions?.(p)}
            compact={compact}
            layout={layout}
          />
        </li>
      ))}
    </ul>
  );
}
