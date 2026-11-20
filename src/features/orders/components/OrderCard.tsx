"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Banknote, Bookmark, CalendarDays, CheckCircle2, ChevronDown, ChevronUp, Clock3, CreditCard, MapPin, Package, Phone, ReceiptText, ShoppingBag } from "lucide-react";
import { ProductImage } from "@/components/products/ProductCard/ProductImage";
import type { Order } from "@/features/orders/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format";

export function OrderCard({ order, defaultExpanded = false }: { order: Order; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const detailsId = useId();
  const firstItem = order.items[0];
  const extraCount = Math.max(0, order.items.length - 1);
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
  const date = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const delivered = order.status === "Delivered";
  const savedLocally = order.status === "Saved locally";

  return (
    <li className={cn("overflow-hidden rounded-xl border bg-white shadow-sm", expanded ? "border-green-200" : "border-slate-200")}>
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
            {firstItem && <ProductImage src={firstItem.imageUrl} alt={firstItem.title} className="object-contain p-2" />}
          </div>
          {extraCount > 0 && (
            <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              +{extraCount}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold", delivered ? "bg-green-100 text-green-700" : savedLocally ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-700")}>
            {delivered ? <CheckCircle2 className="size-3" aria-hidden /> : savedLocally ? <Bookmark className="size-3" aria-hidden /> : <Clock3 className="size-3" aria-hidden />}
            {order.status}
          </span>
          <p className="mt-1.5 break-all text-sm font-bold text-slate-900">
            <span className="mr-1.5 text-slate-400">#</span>
            <Link href={`/profile/orders/${encodeURIComponent(order.id)}`} prefetch={false} className="hover:text-brand">{order.id}</Link>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><CalendarDays className="size-3 text-slate-400" aria-hidden />{date}</span>
            <span aria-hidden className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1"><ShoppingBag className="size-3 text-slate-400" aria-hidden />{itemCount} {itemCount === 1 ? "item" : "items"}</span>
            {order.address.city && (
              <>
                <span aria-hidden className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3 text-slate-400" aria-hidden />{order.address.city}</span>
              </>
            )}
          </div>
          <p className="mt-3 font-bold text-slate-900">
            {order.total.toLocaleString("en-US")} <span className="text-[10px] font-normal text-slate-400">EGP</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-4">
          {order.payment ? (
            <span title={order.payment === "card" ? "Card payment" : "Cash on delivery"} aria-label={order.payment === "card" ? "Card payment" : "Cash on delivery"} className={cn("grid size-8 place-items-center rounded-lg", order.payment === "card" ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500")}>
              {order.payment === "card" ? <CreditCard className="size-4" aria-hidden /> : <Banknote className="size-4" aria-hidden />}
            </span>
          ) : <span />}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className={cn("inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition", expanded ? "bg-green-600 text-white shadow-md shadow-green-600/20 hover:bg-green-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}
          >
            {expanded ? "Hide" : "Details"}
            {expanded ? <ChevronUp className="size-3.5" aria-hidden /> : <ChevronDown className="size-3.5" aria-hidden />}
          </button>
        </div>
      </div>

      <div id={detailsId} hidden={!expanded} className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">
        <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-900">
          <span className="grid size-5 place-items-center rounded bg-green-100 text-green-600"><Package className="size-3" aria-hidden /></span>
          Order Items
        </h2>
        <ul className="mb-4 space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                <ProductImage src={item.imageUrl} alt="" className="object-contain p-1.5" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${encodeURIComponent(item.id)}`} className="line-clamp-2 text-sm text-slate-900 hover:text-brand">{item.title}</Link>
                <p className="mt-1 text-xs text-slate-500">{item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <p className="shrink-0 text-right text-sm font-bold text-slate-900">
                {(item.price * item.quantity).toLocaleString("en-US")}
                <span className="block text-[10px] font-normal text-slate-400">EGP</span>
              </p>
            </li>
          ))}
        </ul>

        <div className="grid gap-3 sm:grid-cols-2">
          <section className="rounded-lg border border-slate-100 bg-white p-3 text-xs">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
              <span className="grid size-5 place-items-center rounded bg-green-100 text-blue-600"><MapPin className="size-3" aria-hidden /></span>
              Delivery Address
            </h2>
            <p className="font-medium text-slate-900">{order.address.city || "—"}</p>
            {order.address.address && <p className="mt-2 text-slate-500">{order.address.address}</p>}
            {order.address.phone && <p className="mt-3 flex items-center gap-1.5 text-slate-500"><Phone className="size-3 text-slate-400" aria-hidden />{order.address.phone}</p>}
            {order.address.notes && <p className="mt-2 text-slate-500">Delivery note: {order.address.notes}</p>}
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-100/80 p-3 text-xs">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
              <span className="grid size-5 place-items-center rounded bg-amber-500 text-white"><ReceiptText className="size-3" aria-hidden /></span>
              Order Summary
            </h2>
            <p className="flex justify-between gap-3 text-slate-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></p>
            <p className="mt-2 flex justify-between gap-3 text-slate-600"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></p>
            <p className="mt-3 flex justify-between gap-3 border-t border-amber-200 pt-2 font-bold text-slate-900"><span>Total</span><span>{formatPrice(order.total)}</span></p>
          </section>
        </div>
      </div>
    </li>
  );
}
