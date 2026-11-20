"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toApiError } from "@/lib/axios";
import type { CartSnapshot } from "@/features/cart/api/cart.api";
import type { OrderAddress } from "@/features/orders/types";
import { ordersApi } from "../api/orders.api";
import { placeLocalOrder, readLocalOrders } from "../local-order-storage";

export const ORDERS_QUERY_KEY = ["orders"] as const;
export const LOCAL_ORDERS_QUERY_KEY = ["local-orders"] as const;

export function useRemoteOrders(enabled: boolean, userName?: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, userName],
    queryFn: () => ordersApi.list(userName),
    enabled,
    staleTime: 30_000,
  });
}

export function useLocalOrders(userId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: [...LOCAL_ORDERS_QUERY_KEY, userId],
    queryFn: () => {
      if (!userId) throw new Error("The signed-in account could not be identified.");
      return readLocalOrders(window.localStorage, userId);
    },
    enabled,
    staleTime: 30_000,
  });
}

export function usePlaceOrder(userName?: string, localUserId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cart, address }: { cart: CartSnapshot; address: OrderAddress }) => {
      if (localUserId) return placeLocalOrder(window.localStorage, localUserId, cart, address);
      return ordersApi.placeOrder(cart, address, userName);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: LOCAL_ORDERS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["cart"], refetchType: "none" }),
      ]);
      toast.success(localUserId ? "Order saved locally; the store is not connected." : "Order placed successfully");
    },
    onError: (error) => toast.error(toApiError(error).message),
  });
}
