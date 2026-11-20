import type { CartItem } from "@/store/cart.store";

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  shipping: number | null;
  total: number;
}

export function getCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const shipping = subtotal >= 500 ? 0 : null;
  return {
    itemCount: items.length,
    subtotal,
    shipping,
    total: subtotal + (shipping ?? 0),
  };
}
