import { ProductGrid } from "@/components/products/ProductGrid/ProductGrid";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { ProductCardActions } from "./ProductCardActions";
import { ProductCardImageActions } from "./ProductCardImageActions";
import { RelatedProductsCarousel } from "./RelatedProductsCarousel";

/** The single place where the shared grid is combined with cart/wishlist actions. */
export function ProductList({
  products,
  variant = "grid",
  compact = false,
  layout = "grid",
}: {
  products: ProductCardData[];
  variant?: "grid" | "carousel";
  compact?: boolean;
  layout?: "grid" | "list";
}) {
  const cardProducts = products.map(({
    id,
    title,
    imageUrl,
    categoryId,
    categoryName,
    quantity,
    ratingAverage,
    ratingCount,
    price,
    originalPrice,
  }) => ({
    id,
    title,
    imageUrl,
    categoryId,
    categoryName,
    quantity,
    ratingAverage,
    ratingCount,
    price,
    originalPrice,
  }));
  const itemLayout = variant === "carousel" ? "grid" : layout;
  const productGrid = (
    <ProductGrid
      products={cardProducts}
      renderImageActions={(product) => <ProductCardImageActions product={product} compact={compact} />}
      renderActions={(product) => <ProductCardActions product={product} />}
      className={variant === "carousel"
        ? "flex touch-pan-y"
        : layout === "list"
          ? "grid grid-cols-1 gap-3"
          : compact
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            : undefined}
      itemClassName={variant === "carousel" ? "min-w-0 shrink-0 grow-0 basis-full px-2 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4" : undefined}
      compact={compact}
      layout={itemLayout}
    />
  );

  return variant === "carousel"
    ? <RelatedProductsCarousel>{productGrid}</RelatedProductsCarousel>
    : productGrid;
}
