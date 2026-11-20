import Link from "next/link";
import { Camera, CreditCard, Mail, MapPin, Phone, Play, ShoppingCart } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Electronics" },
      { label: "Men's Fashion" },
      { label: "Women's Fashion" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/profile" },
      { label: "Order History", href: "/profile/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "mailto:support@freshcart.com" },
      { label: "Help Center" },
      { label: "Shipping Info" },
      { label: "Returns & Refunds" },
      { label: "Track Order", href: "/profile/orders" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
      { label: "Cookie Policy" },
    ],
  },
] as const;

const socialLinks = [
  { label: "Facebook", mark: <span className="font-serif text-base font-bold">f</span> },
  { label: "Twitter", mark: <span className="text-sm font-bold">t</span> },
  { label: "Instagram", mark: <Camera className="size-4" aria-hidden /> },
  { label: "YouTube", mark: <Play className="size-3.5 fill-current" aria-hidden /> },
];

export function Footer() {
  return (
    <footer className="bg-[#101827] text-white">
      <div className="mx-auto grid max-w-page gap-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-[2.3fr_repeat(4,1fr)] lg:gap-10">
        <div>
          <Link href="/" aria-label="FreshCart home" className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-xl font-bold leading-none text-slate-700">
            <ShoppingCart className="size-6 text-green-500" aria-hidden />
            FreshCart
          </Link>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
            FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
          </p>

          <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-green-500" aria-hidden />
              <a href="tel:+18001234567" className="transition-colors hover:text-white">+1 (800) 123-4567</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-green-500" aria-hidden />
              <a href="mailto:support@freshcart.com" className="transition-colors hover:text-white">support@freshcart.com</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-green-500" aria-hidden />
              <span>123 Commerce Street, New York, NY 10001</span>
            </li>
          </ul>

          <ul aria-label="Social media" className="mt-4 flex gap-2.5">
            {socialLinks.map(({ label, mark }) => (
              <li key={label}>
                <span aria-label={label} className="grid size-8 place-items-center rounded-full bg-slate-800 text-slate-400">
                  {mark}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {columns.map(({ title, links }) => (
          <div key={title}>
            <h2 className="text-sm font-semibold">{title}</h2>
            <ul className="mt-3 space-y-3 text-xs text-slate-400">
              {links.map(({ label, ...link }) => (
                <li key={label}>
                  {"href" in link ? (
                    <Link
                      href={link.href}
                      prefetch={!link.href.startsWith("/profile")}
                      className="transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <ul aria-label="Accepted payment methods" className="flex items-center gap-3">
            {["Visa", "Mastercard", "PayPal"].map((method) => (
              <li key={method} className="inline-flex items-center gap-1.5">
                <CreditCard className="size-3.5" aria-hidden />
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
