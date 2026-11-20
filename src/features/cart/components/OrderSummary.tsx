import type { ReactNode } from "react";
import { LockKeyhole, Truck } from "lucide-react";
import { formatPrice } from "@/utils/format";
import type { CartTotals } from "../utils";

export function OrderSummary({ totals, children }: { totals: CartTotals; children?: ReactNode }) {
  return (
    <aside aria-label="Order summary" className="h-fit overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="bg-brand px-5 py-3.5 text-white">
        <h2 className="flex items-center gap-2 text-sm font-bold"><LockKeyhole className="size-4" aria-hidden />Order Summary</h2>
        <p className="mt-1 text-[10px] text-white/85">{totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} in your cart</p>
      </header>
      <div className="space-y-4 p-4 sm:p-5">
        <div className={`flex items-center gap-3 rounded-lg p-3 ${totals.shipping === 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-brand"><Truck className="size-4" aria-hidden /></span>
          <div>
            <p className="text-xs font-semibold">{totals.shipping === 0 ? "Free Shipping!" : "Free Shipping"}</p>
            <p className="text-[10px]">{totals.shipping === 0 ? "You qualify for free delivery" : "On orders over 500 EGP"}</p>
          </div>
        </div>
        <dl className="space-y-2.5 text-xs">
          <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd className={totals.shipping === 0 ? "text-brand" : "text-slate-500"}>{totals.shipping === 0 ? "FREE" : "Calculated at checkout"}</dd></div>
          <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-sm font-bold">
            <dt>Total</dt><dd className="text-slate-800">{formatPrice(totals.total)}</dd>
          </div>
        </dl>
        {totals.shipping === null && <p className="text-[10px] leading-4 text-slate-500">Final delivery charges are calculated when your order is placed.</p>}
        {children}
        <p className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <span className="inline-flex items-center gap-1"><LockKeyhole className="size-3 text-brand" aria-hidden />Secure Payment</span>
          <span aria-hidden className="h-3 border-l border-slate-200" />
          <span className="inline-flex items-center gap-1"><Truck className="size-3 text-blue-500" aria-hidden />Fast Delivery</span>
        </p>
      </div>
    </aside>
  );
}
