import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/services/catalog.service";
import { buildQuery } from "@/utils/url";

interface CatalogSidebarProps {
  categories: Category[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  q?: string;
  sort: string;
  view: string;
  minPrice?: string;
  maxPrice?: string;
}

export function CatalogSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  q,
  sort,
  view,
  minPrice,
  maxPrice,
}: CatalogSidebarProps) {
  const queryForPrice = (price: number) => buildQuery({
    q,
    category: selectedCategories,
    brand: selectedBrands,
    sort,
    minPrice,
    maxPrice: price,
    view,
  });

  return (
    <aside className="self-start rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <form action="/products" method="get" className="space-y-5">
        <input type="hidden" name="sort" value={sort} />
        <input type="hidden" name="view" value={view} />
        {q && <input type="hidden" name="q" value={q} />}

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-900">Categories</legend>
          <div className="max-h-52 space-y-2 overflow-y-auto">
            {categories.map((category) => (
              <label key={category.id} className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  name="category"
                  value={category.id}
                  defaultChecked={selectedCategories.includes(category.id)}
                  className="size-3.5 rounded border-slate-300 accent-brand"
                />
                <span className="truncate">{category.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-t border-slate-100 pt-4">
          <legend className="mb-3 text-sm font-semibold text-slate-900">Price Range</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1 text-[11px] text-slate-500">
              Min (EGP)
              <input
                type="number"
                name="minPrice"
                min="0"
                defaultValue={minPrice}
                placeholder="0"
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-brand"
              />
            </label>
            <label className="space-y-1 text-[11px] text-slate-500">
              Max (EGP)
              <input
                type="number"
                name="maxPrice"
                min="0"
                defaultValue={maxPrice}
                placeholder="No limit"
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-brand"
              />
            </label>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[500, 1000, 5000, 10000].map((price) => (
              <Link
                key={price}
                href={`/products${queryForPrice(price)}`}
                className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600 transition hover:bg-brand-soft hover:text-brand"
              >
                Under {price >= 1000 ? `${price / 1000}K` : price}
              </Link>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-t border-slate-100 pt-4">
          <legend className="mb-3 text-sm font-semibold text-slate-900">Brands</legend>
          {brands.length > 0 ? (
            <div className="max-h-44 space-y-2 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    name="brand"
                    value={brand}
                    defaultChecked={selectedBrands.includes(brand)}
                    className="size-3.5 rounded border-slate-300 accent-brand"
                  />
                  <span className="truncate">{brand}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No brands available.</p>
          )}
        </fieldset>

        <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
          <Button type="submit" className="w-auto px-4 py-2 text-xs">Apply filters</Button>
          <Link href="/products" className="text-xs text-slate-500 hover:text-brand">Clear all</Link>
        </div>
      </form>
    </aside>
  );
}
