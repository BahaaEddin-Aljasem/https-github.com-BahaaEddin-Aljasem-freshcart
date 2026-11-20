"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { toApiError } from "@/lib/axios";
import { wishlistApi } from "../api/wishlist.api";

export const WISHLIST_QUERY_KEY = ["wishlist"] as const;

export function useRemoteWishlist(enabled: boolean) {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: wishlistApi.get,
    enabled,
    staleTime: 30_000,
  });
}

export function useWishlistMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });

  const toggle = useMutation({
    mutationFn: async (product: ProductCardData) => {
      const current = await wishlistApi.get();
      const exists = current.some((item) => item.id === product.id);
      if (exists) await wishlistApi.remove(product.id);
      else await wishlistApi.add(product.id);
      return !exists;
    },
    onSuccess: async (added) => {
      await refresh();
      toast.success(added ? "Added to wishlist" : "Removed from wishlist");
    },
    onError: (error) => toast.error(toApiError(error).message),
  });

  return { toggle };
}
