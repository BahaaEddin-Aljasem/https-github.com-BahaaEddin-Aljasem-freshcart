"use client";

import Link from "next/link";
import { Heart, IdCard, LogOut, ShoppingCart, UserRound, type LucideIcon } from "lucide-react";
import { hasCommerceSession, useLogout, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useHydrated } from "@/hooks/useHydrated";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useRemoteCart } from "@/features/cart/hooks/useCart";
import { useRemoteWishlist } from "@/features/wishlist/hooks/useWishlist";

const iconClass = "relative grid size-8 place-items-center rounded-full transition-colors hover:bg-brand-soft hover:text-brand sm:size-10";

function IconLink({ href, label, Icon, count = 0 }: { href: string; label: string; Icon: LucideIcon; count?: number }) {
  return (
    <Link href={href} aria-label={count > 0 ? `${label} (${count})` : label} className={iconClass}>
      <Icon className="size-4 sm:size-5" />
      {count > 0 && (
        <span aria-hidden className="absolute -right-0.5 -top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{count}</span>
      )}
    </Link>
  );
}

export function HeaderActions() {
  const hydrated = useHydrated();
  const localCartCount = useCartStore((s) => s.items.length);
  const localWishCount = useWishlistStore((s) => s.items.length);
  const { data: session, isPending: sessionPending } = useSession();
  const commerceSession = hasCommerceSession(session);
  const remoteCart = useRemoteCart(commerceSession);
  const remoteWishlist = useRemoteWishlist(commerceSession);
  const cartCount = commerceSession && remoteCart.data
    ? remoteCart.data.items.length
    : localCartCount;
  const wishCount = commerceSession && remoteWishlist.data ? remoteWishlist.data.length : localWishCount;
  const logout = useLogout();

  return (
    <div className="flex items-center gap-1">
      <IconLink href="/wishlist" label="Wishlist" Icon={Heart} count={hydrated ? wishCount : 0} />
      <IconLink href="/cart" label="Cart" Icon={ShoppingCart} count={hydrated ? cartCount : 0} />
      {session?.authenticated ? (
        <div className="hidden items-center gap-1 md:flex">
          <IconLink href="/profile" label="My Account" Icon={UserRound} />
          <button
            type="button"
            aria-label="Sign out"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className={`${iconClass} disabled:opacity-50`}
          >
            <LogOut className="size-4 sm:size-5" />
          </button>
        </div>
      ) : sessionPending ? null : (
        <span className="hidden md:block"><IconLink href="/login" label="Sign in" Icon={IdCard} /></span>
      )}
    </div>
  );
}
