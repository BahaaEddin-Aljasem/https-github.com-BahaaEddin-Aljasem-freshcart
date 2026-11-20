import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { NAV_LINKS } from "./nav-links";

export function MainNavigation() {
  return (
    <nav aria-label="Main" className="hidden xl:block">
      <ul className="flex items-center gap-6 text-sm font-medium">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex items-center gap-1 transition-colors hover:text-brand">
              {l.label}
              {l.label === "Categories" && <ChevronDown className="size-3.5" aria-hidden />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
