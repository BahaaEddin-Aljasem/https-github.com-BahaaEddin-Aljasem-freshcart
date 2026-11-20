import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/services/catalog.service";

export async function DealsSection() {
  const { items } = await getProducts({ q: "shawl", pageSize: 5, sort: "rating" });
  const shawls = items.filter((product) => product.imageUrl).slice(0, 2);
  if (shawls.length !== 2) return null;

  const promotions = [
    {
      label: "🔥 Deal of the Day",
      title: "Fresh Organic Fruits",
      description: "Get up to 40% off on selected organic fruits",
      offer: "40% OFF",
      coupon: "ORGANIC40",
      action: "Shop Now",
    },
    {
      label: "✨ New Arrivals",
      title: "Exotic Vegetables",
      description: "Discover our latest collection of premium vegetables",
      offer: "25% OFF",
      coupon: "FRESH25",
      action: "Explore Now",
    },
  ];

  return (
    <section aria-label="Featured women's shawls" className="mx-auto max-w-page px-4 py-4">
      <div className="grid gap-5 md:grid-cols-2">
        {shawls.map((product, index) => {
          const isFirst = index === 0;
          const promotion = promotions[index];
          if (!promotion) return null;

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={`group relative flex min-h-[290px] items-center overflow-hidden rounded-2xl p-5 text-white shadow-sm transition hover:shadow-lg sm:p-7 ${
                isFirst
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
                  : "bg-gradient-to-br from-orange-400 to-rose-500"
              }`}
            >
              <span aria-hidden className="pointer-events-none absolute -right-10 -top-16 size-40 rounded-full bg-white/10 sm:size-48" />
              <span aria-hidden className="pointer-events-none absolute -bottom-12 -left-8 size-24 rounded-full bg-white/10" />

              <div className="relative z-10 flex w-full items-center gap-2 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-medium sm:text-xs">
                    {promotion.label}
                  </span>
                  <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-tight sm:text-2xl">
                    {promotion.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/90 sm:text-sm">
                    {promotion.description}
                  </p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-2xl font-extrabold sm:text-3xl">{promotion.offer}</span>
                    <span className="text-xs text-white/80">
                      Use code: <strong className="font-bold text-white">{promotion.coupon}</strong>
                    </span>
                  </p>
                  <span className={`mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold transition sm:text-sm ${
                    index === 0 ? "text-emerald-600 hover:bg-emerald-50" : "text-orange-600 hover:bg-orange-50"
                  }`}>
                    {promotion.action}
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </div>
                <span className="relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 p-3 shadow-lg shadow-black/10 sm:size-32 sm:p-4 lg:size-40">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 639px) 112px, (max-width: 1023px) 128px, 160px"
                    className="rounded-full object-contain p-3 sm:p-4"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
