import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/services/catalog.service";
import { discountPercent, formatPrice } from "@/utils/format";
import { ProductPurchase } from "./ProductPurchase";
import { ProductGallery } from "./ProductGallery";
import { RatingStars } from "@/components/products/RatingStars/RatingStars";

export function ProductDetails({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.originalPrice);
  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.35fr)]">
      <ProductGallery title={product.title} images={product.images} />
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-2">
          {product.categoryName && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">{product.categoryName}</span>}
          {product.brandName && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{product.brandName}</span>}
        </div>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-ink md:text-3xl">{product.title}</h1>
        <div className="mt-2">
          <RatingStars average={product.ratingAverage} count={product.ratingCount} size="detail" />
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-bold text-ink sm:text-3xl">{formatPrice(product.price)}</span>
          {off > 0 && product.originalPrice && (
            <>
              <span className="text-base text-muted line-through">{formatPrice(product.originalPrice)}</span>
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">-{off}%</span>
            </>
          )}
        </div>
        <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${product.quantity > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          <span aria-hidden className={`size-1.5 rounded-full ${product.quantity > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
        </p>
        {product.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{product.description}</p>}
        <ProductPurchase product={product} />
        <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
          <li className="flex items-center gap-2 text-xs">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Truck className="size-4" aria-hidden /></span>
            <span><span className="block font-medium text-ink">Free Delivery</span><span className="text-[10px] text-muted">Orders over 500 EGP</span></span>
          </li>
          <li className="flex items-center gap-2 text-xs">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><RotateCcw className="size-4" aria-hidden /></span>
            <span><span className="block font-medium text-ink">14-Day Return</span><span className="text-[10px] text-muted">Easy returns</span></span>
          </li>
          <li className="flex items-center gap-2 text-xs">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><ShieldCheck className="size-4" aria-hidden /></span>
            <span><span className="block font-medium text-ink">Secure Payment</span><span className="text-[10px] text-muted">Cash on delivery</span></span>
          </li>
        </ul>
      </div>
    </div>
  );
}
