"use client";

import Link from "next/link";
import { Check, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/products/ProductCard/ProductImage";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { formatPrice } from "@/utils/format";
import { useCartStore, type CartItem } from "@/store/cart.store";

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  return (
    <li className="grid min-h-46 grid-cols-[80px_minmax(0,1fr)] gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:min-h-37.5 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-4 sm:p-4 lg:min-h-35 lg:grid-cols-[88px_minmax(0,1fr)] lg:p-3">
      <div className="flex flex-col items-center gap-2">
        <Link href={`/products/${item.id}`} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-slate-50 sm:size-24 lg:size-22" aria-label={item.title}>
          <ProductImage src={item.imageUrl} alt={item.title} className="object-contain p-2" />
        </Link>
        {item.stock !== undefined && item.stock > 0 && (
          <span className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-medium text-white">
            <Check className="size-2.5" aria-hidden />In Stock
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col">
        <Link href={`/products/${item.id}`} className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 hover:text-brand">{item.title}</Link>
        {item.categoryName && <span className="mt-1 w-fit max-w-full truncate rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] text-brand">{item.categoryName}</span>}
        <p className="mt-1 text-sm font-semibold text-brand">
          {formatPrice(item.price)} <span className="text-[10px] font-normal text-slate-400">per unit</span>
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-2 pt-15 sm:pt-3">
          <QuantitySelector compact value={item.quantity} onChange={(q) => onQuantityChange ? onQuantityChange(item.id, q) : setQuantity(item.id, q)} label={`Quantity for ${item.title}`} max={item.stock} />
          <div className="flex items-end gap-2">
            <div className="text-right leading-tight">
              <span className="block text-[9px] text-slate-400">Total</span>
              <p className="text-sm font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</p>
            </div>
            <button type="button" aria-label={`Remove ${item.title}`} onClick={() => onRemove ? onRemove(item.id) : remove(item.id)} className="grid size-8 shrink-0 place-items-center rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100">
              <Trash2 className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
