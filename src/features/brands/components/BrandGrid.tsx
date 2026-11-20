import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import type { Brand } from "@/features/brands/types/brand.model";

export function BrandGrid({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) {
    return <EmptyState title="No brands found" description="Check back soon." />;
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {brands.map((b) => (
        <li key={b.id}>
          <Link
            href={`/products?q=${encodeURIComponent(b.name)}`}
            prefetch={false}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-xl border border-line bg-white p-4 text-center transition hover:border-brand hover:shadow-sm"
          >
            <span className="relative h-12 w-full">
              {b.imageUrl
                ? <Image src={b.imageUrl} alt="" fill sizes="120px" className="object-contain" />
                : <Tag className="mx-auto size-6 text-muted" aria-hidden />}
            </span>
            <span className="text-xs font-medium text-muted sm:text-sm">{b.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
