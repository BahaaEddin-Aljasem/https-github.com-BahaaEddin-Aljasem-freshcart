import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs/Breadcrumbs";
import { ProductDetails } from "@/features/products/components/ProductDetails";
import { ProductInfoTabs } from "@/features/products/components/ProductInfoTabs";
import { ProductList } from "@/features/products/components/ProductList";
import type { Product } from "@/services/catalog.service";
import { getProduct, getRelatedProducts } from "@/services/catalog.service";

type Props = { params: Promise<{ id: string }> };
export const revalidate = 300;

async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelatedProducts(product);
  return related.length > 0 ? <ProductList products={related} variant="carousel" /> : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id);
  return { title: product?.title ?? "Product not found" };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).id);
  if (!product) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.categoryName ?? "Category", href: `/categories/${product.categoryId}` },
          { label: product.title },
        ]}
      />
      <div className="mx-auto max-w-page space-y-8 px-4 pb-8">
        <ProductDetails product={product} />
        <ProductInfoTabs product={product} />
        <Suspense fallback={<div aria-label="Loading related products" aria-busy="true" className="min-h-72 animate-pulse rounded-xl bg-slate-50" />}>
          <RelatedProducts product={product} />
        </Suspense>
      </div>
    </>
  );
}
