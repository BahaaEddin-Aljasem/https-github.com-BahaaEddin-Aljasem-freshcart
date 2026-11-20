import Link from "next/link";
import type { Category } from "@/services/catalog.service";
import { CategoryGrid } from "@/features/categories/components/CategoryGrid";

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section aria-labelledby="cat-title" className="mx-auto max-w-page px-4 py-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 id="cat-title" className="border-l-4 border-brand pl-3 text-xl font-bold">Shop By Category</h2>
        <Link href="/categories" className="text-sm font-medium text-brand hover:underline">View All Categories</Link>
      </div>
      <CategoryGrid categories={categories} />
    </section>
  );
}
