"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Headset, Heart, LogOut, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar/SearchBar";
import { Logo } from "./Logo";
import { useLogout, useSession } from "@/features/auth/hooks/useAuthMutations";
import { useRemoteCart } from "@/features/cart/hooks/useCart";
import { useRemoteWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useHydrated } from "@/hooks/useHydrated";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { NAV_LINKS } from "./nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const { data: session, isPending: sessionPending } = useSession();
  const authenticated = session?.authenticated === true;
  const localCartCount = useCartStore((state) => state.items.length);
  const localWishlistCount = useWishlistStore((state) => state.items.length);
  const remoteCart = useRemoteCart(authenticated);
  const remoteWishlist = useRemoteWishlist(authenticated);
  const logout = useLogout();
  const cartCount = authenticated && remoteCart.data
    ? remoteCart.data.items.length
    : localCartCount;
  const wishlistCount = authenticated && remoteWishlist.data
    ? remoteWishlist.data.length
    : localWishlistCount;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((value) => !value)}
        className="grid size-8 place-items-center rounded-full bg-brand text-white hover:bg-brand-dark sm:size-10 sm:bg-transparent sm:text-slate-700 sm:hover:bg-brand-soft"
      >
        {open ? <X className="size-4 sm:size-5" aria-hidden /> : <Menu className="size-4 sm:size-5" aria-hidden />}
      </button>
      {open && (
        <div id="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-0 z-[60] bg-white xl:hidden">
          <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto px-4 pb-4">
            <SearchBar
              id="mobile-menu-search"
              placeholder="Search products..."
              onSubmit={close}
              className="mt-3"
              inputClassName="rounded-xl bg-white py-2.5 pl-3 pr-10"
              buttonClassName="right-1 top-1/2 size-7 rounded-lg"
            />

            <nav aria-label="Mobile primary" className="mt-3 border-b border-slate-100 pb-3">
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} onClick={close} className="block rounded-lg px-3 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Shopping shortcuts" className="border-b border-slate-100 py-3">
              <ul className="space-y-1">
                <li>
                  <Link href="/wishlist" onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <span className="grid size-9 place-items-center rounded-full bg-rose-50 text-rose-500"><Heart className="size-4" aria-hidden /></span>
                    <span className="flex-1">Wishlist</span>
                    {hydrated && wishlistCount > 0 && <span className="grid min-w-6 place-items-center rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white">{wishlistCount}</span>}
                  </Link>
                </li>
                <li>
                  <Link href="/cart" onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <span className="grid size-9 place-items-center rounded-full bg-emerald-50 text-brand"><ShoppingCart className="size-4" aria-hidden /></span>
                    <span className="flex-1">Cart</span>
                    {hydrated && cartCount > 0 && <span className="grid min-w-6 place-items-center rounded-full bg-brand px-2 py-1 text-xs font-semibold text-white">{cartCount}</span>}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="py-3">
              {authenticated ? (
                <div className="space-y-1">
                  <Link href="/profile" prefetch={false} onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                    <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500"><UserRound className="size-4" aria-hidden /></span>
                    {session?.user?.name ?? "My Account"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      logout.mutate();
                    }}
                    disabled={logout.isPending}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-rose-50"><LogOut className="size-4" aria-hidden /></span>
                    Sign Out
                  </button>
                </div>
              ) : sessionPending ? (
                <div aria-label="Loading account" className="h-10 animate-pulse rounded-lg bg-slate-50" />
              ) : (
                <div className="space-y-1">
                  <Link href="/login" onClick={close} className="block rounded-lg px-3 py-3 text-sm text-slate-700 hover:bg-slate-50">Sign In</Link>
                  <Link href="/register" onClick={close} className="block rounded-lg px-3 py-3 text-sm text-slate-700 hover:bg-slate-50">Sign Up</Link>
                </div>
              )}
            </div>

            <a href="mailto:support@freshcart.com" onClick={close} className="mt-auto flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <span className="grid size-9 place-items-center rounded-full bg-emerald-100 text-brand"><Headset className="size-4" aria-hidden /></span>
              <span className="text-xs">
                <span className="block font-semibold text-slate-700">Need Help?</span>
                <span className="text-brand">Contact Support</span>
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
