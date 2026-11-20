"use client";

import type { ReactNode } from "react";
import { LockKeyhole, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { ProductImage } from "@/components/products/ProductCard/ProductImage";
import { formatPrice } from "@/utils/format";
import type { CartItem } from "@/store/cart.store";
import type { CartTotals } from "@/features/cart/utils";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totals: CartTotals;
  children: ReactNode;
}

export function CheckoutOrderSummary({ items, totals, children }: CheckoutOrderSummaryProps) {
  return (
    <aside aria-label="Order summary" className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
      <header className="bg-gradient-to-r from-brand to-green-700 px-4 py-3.5 text-white">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <LockKeyhole className="size-4" aria-hidden />
          Order Summary
        </h2>
        <p className="mt-1 text-[10px] text-white/85">
          {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="space-y-4 p-3 sm:p-4">
        <ul aria-label="Products in your order" className="max-h-44 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <li key={item.id} className="flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 p-2">
              <span className="relative size-10 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-white">
                <ProductImage src={item.imageUrl} alt={item.title} className="object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block line-clamp-1 text-[11px] font-medium text-slate-800">{item.title}</span>
                <span className="block text-[10px] text-slate-500">
                  {item.quantity} × {formatPrice(item.price)}
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-bold text-slate-800">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="space-y-2.5 border-t border-slate-100 pt-3 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Subtotal</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="flex items-center gap-1.5 text-slate-500">
              <Truck className="size-3.5" aria-hidden />
              Shipping
            </dt>
            <dd className={totals.shipping === 0 ? "font-semibold text-brand" : "text-slate-500"}>
              {totals.shipping === 0 ? "FREE" : "Calculated at checkout"}
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-slate-100 pt-3 text-sm font-bold">
            <dt>Total</dt>
            <dd className="text-lg text-brand">{formatPrice(totals.total)}</dd>
          </div>
        </dl>

        {children}

        <ul aria-label="Order benefits" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
          <li className="inline-flex items-center gap-1"><ShieldCheck className="size-3 text-emerald-500" aria-hidden />Secure</li>
          <li className="inline-flex items-center gap-1"><Truck className="size-3 text-blue-500" aria-hidden />Fast Delivery</li>
          <li className="inline-flex items-center gap-1"><RotateCcw className="size-3 text-orange-500" aria-hidden />Easy Returns</li>
        </ul>
      </div>
    </aside>
  );
}
