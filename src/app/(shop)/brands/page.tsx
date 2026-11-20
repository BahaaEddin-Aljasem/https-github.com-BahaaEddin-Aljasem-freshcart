import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Tag } from "lucide-react";
import { BrandGrid } from "@/features/brands/components/BrandGrid";
import { getBrands } from "@/features/brands/api/brands.api";

export const metadata: Metadata = { title: "Brands" };
export const revalidate = 600;

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <div className="bg-linear-to-r from-purple-700 via-purple-600 to-fuchsia-500 px-4 py-6 text-white">
        <div className="mx-auto max-w-page">
          <nav aria-label="Breadcrumb" className="text-xs text-white/70">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              <li className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden />
                <span aria-current="page" className="text-white">Brands</span>
              </li>
            </ol>
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Tag className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">Top Brands</h1>
              <p className="text-sm text-white/80">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-page px-4 py-6">
        <BrandGrid brands={brands} />
      </div>
    </>
  );
}
