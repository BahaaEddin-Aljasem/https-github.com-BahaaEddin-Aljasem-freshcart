import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { WishlistView } from "@/features/wishlist/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <div className="mx-auto max-w-page px-4 pb-8">
        <WishlistView />
      </div>
    </>
  );
}
