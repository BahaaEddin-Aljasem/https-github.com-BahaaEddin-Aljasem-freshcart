import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";

interface WishlistState {
  items: ProductCardData[];
  toggle: (product: ProductCardData) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      /** Returns true when the product was added, false when removed. */
      toggle: (product) => {
        const exists = get().items.some((i) => i.id === product.id);
        set((s) => ({ items: exists ? s.items.filter((i) => i.id !== product.id) : [...s.items, product] }));
        return !exists;
      },
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "freshcart-wishlist" },
  ),
);
