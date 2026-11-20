"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { toApiError } from "@/lib/axios";
import { MAX_QUANTITY } from "@/config/constants";
import { clampCartQuantity } from "@/store/cart.store";
import { cartApi } from "../api/cart.api";

export const CART_QUERY_KEY = ["cart"] as const;

export function useRemoteCart(enabled: boolean) {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.get,
    enabled,
    staleTime: 30_000,
  });
}

async function addToRemoteCart({ product, quantity }: { product: ProductCardData; quantity: number }) {
  const current = await cartApi.get();
  const existing = current.items.find((item) => item.id === product.id);
  const stock = product.quantity ?? existing?.stock ?? MAX_QUANTITY;
  const next = clampCartQuantity((existing?.quantity ?? 0) + quantity, stock);
  if (existing) {
    if (next !== existing.quantity) await cartApi.updateQuantity(product.id, next);
  } else {
    await cartApi.addProduct(product.id);
    if (next > 1) await cartApi.updateQuantity(product.id, next);
  }
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToRemoteCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Added to cart");
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}

export function useCartMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
  const onError = (error: unknown) => toast.error(toApiError(error).message);
  const setQuantity = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateQuantity(productId, quantity),
    onSuccess: refresh,
    onError,
  });

  const remove = useMutation({
    mutationFn: cartApi.remove,
    onSuccess: refresh,
    onError,
  });

  const clear = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: refresh,
    onError,
  });

  return { setQuantity, remove, clear };
}
