import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import { PAGE_SIZE } from "@/config/constants";
import { ProductList } from "@/features/products/components/ProductList";
import { getCategories, getCategory, getProducts } from "@/services/catalog.service";
import { first, toPositiveInt, type SearchParams } from "@/utils/url";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<SearchParams> };
export const revalidate = 600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const category = await getCategory((await params).id);
  return { title: category?.name ?? "Category not found" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const page = toPositiveInt(first(sp.page), 1);
  const category = await getCategory(id);
  if (!category) notFound();
  const result = await getProducts({ category: id, page, pageSize: PAGE_SIZE });

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]} />
      <div className="mx-auto max-w-page space-y-6 px-4 pb-8">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        {result.items.length > 0 ? (
          <ProductList products={result.items} />
        ) : (
          <EmptyState title="No products in this category yet" action={{ label: "Browse all products", href: "/products" }} />
        )}
        <Pagination basePath={`/categories/${id}`} page={result.page} totalPages={result.totalPages} />
      </div>
    </>
  );
}
