import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 text-xl font-bold leading-none text-slate-800 sm:text-[26px]" aria-label="FreshCart home">
      <ShoppingCart className="size-5 text-green-500 sm:size-7" aria-hidden />
      FreshCart
    </Link>
  );
}
