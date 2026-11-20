import Link from "next/link";
import type { Product } from "@/features/products/product.model";
import { ProductList } from "@/features/products/components/ProductList";

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="feat-title" className="mx-auto max-w-page px-4 py-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 id="feat-title" className="border-l-4 border-brand pl-3 text-xl font-bold">Featured Products</h2>
        <Link href="/products" className="text-sm font-medium text-brand hover:underline">View all products</Link>
      </div>
      <ProductList products={products} />
    </section>
  );
}
