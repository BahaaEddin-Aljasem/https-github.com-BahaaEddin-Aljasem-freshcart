import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import { LiveSearchInput } from "@/components/shared/SearchBar/LiveSearchInput";
import { PAGE_SIZE } from "@/config/constants";
import { CatalogSidebar } from "@/features/products/components/CatalogSidebar";
import { CatalogToolbar } from "@/features/products/components/CatalogToolbar";
import { ProductList } from "@/features/products/components/ProductList";
import { getCategories, getProducts, isSortKey } from "@/services/catalog.service";
import { first, toNumber, toPositiveInt, type SearchParams } from "@/utils/url";

export const metadata: Metadata = { title: "Shop" };
export const revalidate = 600;

function allValues(value: string | string[] | undefined): string[] {
  return (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const selectedCategories = [...new Set(allValues(sp.category))];
  const selectedBrands = [...new Set(allValues(sp.brand))];
  const sortRaw = first(sp.sort);
  const sort = isSortKey(sortRaw) ? sortRaw : "relevance";
  const view = first(sp.view) === "list" ? "list" : "grid";
  const minPriceRaw = first(sp.minPrice);
  const maxPriceRaw = first(sp.maxPrice);
  const minPrice = toNumber(minPriceRaw);
  const maxPrice = toNumber(maxPriceRaw);
  const page = toPositiveInt(first(sp.page), 1);

  const [result, categories] = await Promise.all([
    getProducts({
      q,
      categories: selectedCategories,
      brands: selectedBrands,
      sort,
      minPrice,
      maxPrice,
      page,
      pageSize: PAGE_SIZE,
    }),
    getCategories(),
  ]);
  const filterProps = {
    selectedCategories,
    selectedBrands,
    q,
    sort,
    view,
    minPrice: minPriceRaw,
    maxPrice: maxPriceRaw,
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: q ? "Search Results" : "Shop" },
      ]} />
      <div className="mx-auto max-w-page px-4 pb-8">
        <h1 className="sr-only">{q ? `Search results for ${q}` : "Shop"}</h1>
        <form action="/products" method="get" className="flex max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 focus-within:border-brand">
          {selectedCategories.map((category) => <input key={category} type="hidden" name="category" value={category} />)}
          {selectedBrands.map((brand) => <input key={brand} type="hidden" name="brand" value={brand} />)}
          {minPriceRaw && <input type="hidden" name="minPrice" value={minPriceRaw} />}
          {maxPriceRaw && <input type="hidden" name="maxPrice" value={maxPriceRaw} />}
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="view" value={view} />
          <Search className="size-4 shrink-0 text-slate-400" aria-hidden />
          <LiveSearchInput
            id="catalog-search"
            ariaLabel="Search products"
            defaultValue={q}
            placeholder="Search for products..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            preservedParams={{
              category: selectedCategories,
              brand: selectedBrands,
              minPrice: minPriceRaw,
              maxPrice: maxPriceRaw,
              sort,
              view,
            }}
          />
          <button type="submit" className="text-xs font-medium text-brand">Search</button>
        </form>

        <div className="mt-6 grid items-start gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
          <CatalogSidebar
            categories={categories}
            brands={result.brands}
            {...filterProps}
          />
          <section aria-label="Products" className="min-w-0">
            <CatalogToolbar total={result.total} {...filterProps} />
            {result.items.length > 0 ? (
              <ProductList products={result.items} compact layout={view} />
            ) : (
              <EmptyState
                title="No products found"
                description="Try different filters or clear your search."
                action={{ label: "Clear filters", href: "/products" }}
              />
            )}
            <Pagination
              basePath="/products"
              page={result.page}
              totalPages={result.totalPages}
              query={{
                q,
                category: selectedCategories,
                brand: selectedBrands,
                sort,
                minPrice: minPriceRaw,
                maxPrice: maxPriceRaw,
                view,
              }}
            />
          </section>
        </div>
      </div>
    </>
  );
}
