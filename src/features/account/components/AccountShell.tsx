import Link from "next/link";
import { ChevronRight, MapPin, Settings, UserRound } from "lucide-react";

type AccountSection = "addresses" | "settings";

export function AccountShell({
  activeSection,
  children,
}: {
  activeSection: AccountSection;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[65vh] bg-slate-50">
      <section className="bg-linear-to-r from-brand to-emerald-500 text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-5">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-white/80">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="size-3" aria-hidden />
            <span aria-current="page" className="text-white">My Account</span>
          </nav>
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20">
              <UserRound className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-bold leading-tight">My Account</h1>
              <p className="mt-1 text-xs text-white/85">Manage your addresses and account settings.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] items-start gap-5 px-4 py-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <h2 className="px-2 py-2 text-xs font-bold text-slate-800">My Account</h2>
          <nav aria-label="Account navigation" className="space-y-1">
            <Link
              href="/profile/addresses"
              aria-current={activeSection === "addresses" ? "page" : undefined}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition ${
                activeSection === "addresses"
                  ? "bg-emerald-50 font-medium text-brand"
                  : "text-slate-600 hover:bg-slate-50 hover:text-brand"
              }`}
            >
              <MapPin className="size-4" aria-hidden />
              My Addresses
              <ChevronRight className="ml-auto size-3.5" aria-hidden />
            </Link>
            <Link
              href="/profile"
              aria-current={activeSection === "settings" ? "page" : undefined}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition ${
                activeSection === "settings"
                  ? "bg-emerald-50 font-medium text-brand"
                  : "text-slate-600 hover:bg-slate-50 hover:text-brand"
              }`}
            >
              <Settings className="size-4" aria-hidden />
              Settings
              <ChevronRight className="ml-auto size-3.5" aria-hidden />
            </Link>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
