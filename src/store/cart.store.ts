import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_QUANTITY } from "@/config/constants";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";

export interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  categoryName?: string;
  price: number;
  quantity: number;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  add: (product: ProductCardData, quantity?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const clampCartQuantity = (n: number, stock = MAX_QUANTITY) =>
  Math.min(MAX_QUANTITY, stock, Math.max(1, Math.floor(n)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (p, quantity = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === p.id);
          if (existing) {
            return { items: s.items.map((i) => (i.id === p.id ? { ...i, quantity: clampCartQuantity(i.quantity + quantity, i.stock) } : i)) };
          }
          return {
            items: [
              ...s.items,
              {
                id: p.id,
                title: p.title,
                imageUrl: p.imageUrl,
                categoryName: p.categoryName,
                price: p.price,
                quantity: clampCartQuantity(quantity, p.quantity),
                stock: p.quantity,
              },
            ],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: clampCartQuantity(quantity, i.stock) } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "freshcart-cart" },
  ),
);
