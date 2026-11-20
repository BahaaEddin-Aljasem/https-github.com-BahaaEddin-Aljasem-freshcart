import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { SORT_OPTIONS, type Category } from "@/services/catalog.service";

interface ProductFiltersProps {
  categories: Category[];
  values: { q?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string };
}

/** Plain GET form: filters live in the URL and work without client JavaScript. */
export function ProductFilters({ categories, values }: ProductFiltersProps) {
  return (
    <form action="/products" method="get" className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="lg:col-span-2">
        <TextField label="Search" name="q" type="search" defaultValue={values.q} placeholder="Search products…" />
      </div>
      <SelectField label="Category" name="category" defaultValue={values.category ?? ""} options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
      <SelectField label="Sort by" name="sort" defaultValue={values.sort ?? "newest"} options={SORT_OPTIONS} />
      <TextField label="Min price" name="minPrice" type="number" min={0} inputMode="numeric" defaultValue={values.minPrice} />
      <TextField label="Max price" name="maxPrice" type="number" min={0} inputMode="numeric" defaultValue={values.maxPrice} />
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-6">
        <Button type="submit" className="w-auto px-6">Apply filters</Button>
        <Link href="/products" className="text-sm text-muted hover:text-brand">Clear all</Link>
      </div>
    </form>
  );
}
