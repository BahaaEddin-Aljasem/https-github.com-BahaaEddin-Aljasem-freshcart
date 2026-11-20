import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { SORT_OPTIONS } from "@/services/catalog.service";
import { buildQuery } from "@/utils/url";

interface CatalogToolbarProps {
  total: number;
  selectedCategories: string[];
  selectedBrands: string[];
  q?: string;
  sort: string;
  view: string;
  minPrice?: string;
  maxPrice?: string;
}

export function CatalogToolbar({
  total,
  selectedCategories,
  selectedBrands,
  q,
  sort,
  view,
  minPrice,
  maxPrice,
}: CatalogToolbarProps) {
  const sharedQuery = {
    q,
    category: selectedCategories,
    brand: selectedBrands,
    minPrice,
    maxPrice,
    sort,
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-slate-500">
        <span className="font-semibold text-slate-800">{total}</span> products
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-md border border-slate-200" aria-label="Product layout">
          <Link
            href={`/products${buildQuery({ ...sharedQuery, view: "grid" })}`}
            aria-label="Grid view"
            aria-current={view === "grid" ? "page" : undefined}
            className={`grid size-8 place-items-center ${view === "grid" ? "bg-brand text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <LayoutGrid className="size-4" aria-hidden />
          </Link>
          <Link
            href={`/products${buildQuery({ ...sharedQuery, view: "list" })}`}
            aria-label="List view"
            aria-current={view === "list" ? "page" : undefined}
            className={`grid size-8 place-items-center ${view === "list" ? "bg-brand text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <List className="size-4" aria-hidden />
          </Link>
        </div>
        <form action="/products" method="get" className="flex items-center gap-2">
          {q && <input type="hidden" name="q" value={q} />}
          {selectedCategories.map((category) => <input key={category} type="hidden" name="category" value={category} />)}
          {selectedBrands.map((brand) => <input key={brand} type="hidden" name="brand" value={brand} />)}
          {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
          {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
          <input type="hidden" name="view" value={view} />
          <label htmlFor="catalog-sort" className="text-xs text-slate-500">Sort by:</label>
          <select
            id="catalog-sort"
            name="sort"
            defaultValue={sort}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-brand"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button type="submit" className="rounded-md bg-brand px-3 py-2 text-xs font-medium text-white hover:bg-brand/90">
            Apply
          </button>
        </form>
      </div>
    </div>
  );
}
