import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, Tag } from "lucide-react";
import { getCategories } from "@/services/catalog.service";
import { CATEGORY_ICONS } from "@/features/categories/category-icons";

export const metadata: Metadata = { title: "Categories" };
export const revalidate = 600;

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="min-h-[80vh] bg-slate-50">
      <header className="bg-linear-to-br from-green-600 via-green-500 to-green-400 text-white">
        <div className="mx-auto max-w-page px-4 py-10 sm:py-12">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs">
            <Link href="/" className="text-white/85 hover:underline">Home</Link>
            <span aria-hidden>/</span><span aria-current="page">Categories</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-xl bg-white/20 shadow-sm">
              <Layers className="size-7" aria-hidden />
            </span>
            <div>
              <h1 className="text-3xl font-bold">All Categories</h1>
              <p className="mt-1 text-sm">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-page px-4 pt-8 pb-24">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ id, name, imageUrl }) => {
            const Icon = CATEGORY_ICONS[id] ?? Tag;
            return (
              <li key={id}>
                <Link href={`/categories/${id}`} className="group flex h-full flex-col items-center rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg focus-visible:border-green-400 sm:p-5">
                  <span className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-lg bg-slate-50">
                    {imageUrl
                      ? <Image src={imageUrl} alt="" fill sizes="(min-width: 1024px) 210px, (min-width: 640px) 30vw, 45vw" className="object-cover" />
                      : <Icon className="size-8 text-brand" aria-hidden />}
                  </span>
                  <span className="mt-3 text-sm font-bold group-hover:text-brand group-focus-visible:text-brand">{name}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                    View Subcategories <ArrowRight className="size-3" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
