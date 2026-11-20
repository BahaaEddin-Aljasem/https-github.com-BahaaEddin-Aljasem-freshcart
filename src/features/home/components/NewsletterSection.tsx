import { Apple, ArrowRight, Leaf, Mail, Play, Smartphone, Sparkles, Tag, Truck } from "lucide-react";

const PERKS = [
  { label: "Fresh Picks Weekly", Icon: Leaf },
  { label: "Free Delivery Codes", Icon: Truck },
  { label: "Members-Only Deals", Icon: Tag },
];

export function NewsletterSection() {
  return (
    <section aria-label="Newsletter and mobile app" className="px-4 pb-8 pt-10">
      <div className="mx-auto grid max-w-page gap-6 rounded-[28px] border border-emerald-100 bg-[linear-gradient(115deg,#f8fafc_0%,#ffffff_55%,#fff1f2_100%)] p-6 shadow-[0_18px_48px_rgba(16,185,129,0.08)] md:grid-cols-[1.65fr_1fr] md:gap-6 md:p-10">
        <div className="flex flex-col justify-center md:border-r md:border-emerald-100 md:pr-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
              <Mail className="size-4" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">Newsletter</p>
              <p className="mt-0.5 text-[10px] text-slate-400">50,000+ subscribers</p>
            </div>
          </div>

          <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Get the Freshest Updates <span className="text-emerald-600">Delivered Free</span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Weekly recipes, seasonal offers &amp; exclusive member perks.
          </p>

          <ul className="mt-3 flex flex-wrap gap-2">
            {PERKS.map(({ label, Icon }) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 text-[11px] text-slate-600 shadow-sm sm:text-xs">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon className="size-3" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div role="group" aria-label="Newsletter sign-up" className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-600">
              Subscribe
              <ArrowRight className="size-3.5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 sm:text-xs">
            <Sparkles className="size-3.5 text-amber-400" aria-hidden />
            Unsubscribe anytime. No spam, ever.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-inner md:p-6">
          <span aria-hidden className="pointer-events-none absolute -right-4 -top-8 size-28 rounded-full bg-emerald-500/15 blur-2xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-400">
              <Smartphone className="size-3" aria-hidden />
              Mobile App
            </span>
            <h3 className="mt-3 text-base font-bold sm:text-lg">Shop Faster on Our App</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400 sm:text-sm">
              Get app-exclusive deals &amp; 15% off your first order.
            </p>

            <div className="mt-3 grid gap-2">
              <div className="flex h-11 items-center gap-2 rounded-lg border border-white/5 bg-white/10 px-3">
                <Apple className="size-4 fill-current" aria-hidden />
                <span className="leading-tight">
                  <span className="block text-[9px] uppercase text-slate-400">Download on</span>
                  <span className="block text-xs font-semibold">App Store</span>
                </span>
              </div>
              <div className="flex h-11 items-center gap-2 rounded-lg border border-white/5 bg-white/10 px-3">
                <Play className="size-4 fill-current" aria-hidden />
                <span className="leading-tight">
                  <span className="block text-[9px] uppercase text-slate-400">Get it on</span>
                  <span className="block text-xs font-semibold">Google Play</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="tracking-tight text-amber-400" aria-label="5 out of 5 stars">★★★★★</span>
              <span className="text-slate-400">4.9 · 100K+ downloads</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
