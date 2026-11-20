"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toApiError } from "@/lib/axios";
import { useSession } from "@/features/auth/hooks/useAuthMutations";
import { mergeGuestCart } from "@/features/cart/api/cart.api";
import { mergeGuestWishlist } from "@/features/wishlist/api/wishlist.api";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

export function GuestStoreSync() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const guestCart = useCartStore((state) => state.items);
  const guestWishlist = useWishlistStore((state) => state.items);
  const syncing = useRef(false);
  const syncedUser = useRef<string | undefined>(undefined);

  useEffect(() => {
    const userId = session?.user?._id ?? session?.user?.email;
    if (!session?.authenticated || session.localOnly || !userId) {
      syncedUser.current = undefined;
      return;
    }
    if (syncing.current || syncedUser.current === userId) return;

    const cartSnapshot = guestCart;
    const wishlistSnapshot = guestWishlist;
    if (cartSnapshot.length === 0 && wishlistSnapshot.length === 0) {
      syncedUser.current = userId;
      return;
    }

    syncing.current = true;
    syncedUser.current = userId;

    void (async () => {
      let failed = false;
      let sessionExpired = false;
      const reportSyncError = (store: "cart" | "wishlist", error: unknown) => {
        const apiError = toApiError(error);
        if (apiError.status === 401) {
          sessionExpired = true;
          toast.info("Your session expired. Unsynced items remain on this device; sign in again to sync them.");
          return;
        }
        toast.error(`Could not sync your ${store}: ${apiError.message}`);
      };

      if (cartSnapshot.length > 0) {
        try {
          await mergeGuestCart(cartSnapshot);
          if (JSON.stringify(useCartStore.getState().items) === JSON.stringify(cartSnapshot)) {
            useCartStore.getState().clear();
          } else {
            failed = true;
          }
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
        } catch (error) {
          failed = true;
          reportSyncError("cart", error);
        }
      }

      if (wishlistSnapshot.length > 0 && !sessionExpired) {
        try {
          await mergeGuestWishlist(wishlistSnapshot);
          if (JSON.stringify(useWishlistStore.getState().items) === JSON.stringify(wishlistSnapshot)) {
            useWishlistStore.getState().clear();
          } else {
            failed = true;
          }
          await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        } catch (error) {
          failed = true;
          reportSyncError("wishlist", error);
        }
      }

      if (failed) syncedUser.current = undefined;
      syncing.current = false;
    })();
  }, [guestCart, guestWishlist, queryClient, session]);

  return null;
}
