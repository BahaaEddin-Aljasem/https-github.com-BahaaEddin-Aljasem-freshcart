import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";
import type { Category } from "@/services/catalog.service";
import { CATEGORY_ICONS } from "../category-icons";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((c) => {
        const Icon = CATEGORY_ICONS[c.id] ?? Tag;
        return (
          <li key={c.id}>
            <Link href={`/categories/${c.id}`} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-line px-2 py-3 text-center transition hover:border-brand hover:shadow-sm">
              <span className="relative grid size-12 place-items-center overflow-hidden rounded-full bg-brand-soft text-brand">
                {c.imageUrl
                  ? <Image src={c.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                  : <Icon className="size-5" aria-hidden />}
              </span>
              <span className="text-xs font-medium sm:text-sm">{c.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
