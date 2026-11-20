"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  { title: "Fresh Products Delivered to your Door", text: "Get 20% off your first order.", primary: { label: "Shop Now", href: "/products" }, secondary: { label: "View Deals", href: "/products" } },
  { title: "Find something you'll love", text: "Search the catalog and discover products that match your style.", primary: { label: "Explore Products", href: "/products" }, secondary: { label: "Save Favorites", href: "/wishlist" } },
  { title: "Discover current offers", text: "Explore discounted products and top-rated picks from the catalog.", primary: { label: "Shop Offers", href: "/products" }, secondary: { label: "Top Rated", href: "/products?sort=rating" } },
] as const;

export function HeroSection({ images }: { images: string[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => { embla.off("select", onSelect); };
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    const timer = window.setTimeout(() => embla.scrollNext(), 3000);
    return () => window.clearTimeout(timer);
  }, [embla, index]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <section aria-roledescription="carousel" aria-label="Featured offers" className="relative mx-auto h-70 w-[calc(100%-2rem)] max-w-[1860px] overflow-hidden rounded-2xl shadow-lg lg:h-96.25 lg:w-[calc(100%-60px)]">
      <div ref={emblaRef} className="relative z-10 h-full overflow-hidden">
        <div className="flex h-full">
          {SLIDES.map((s, i) => (
            <div
              key={s.title}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              className="relative h-full min-w-0 shrink-0 grow-0 basis-full overflow-hidden text-white"
              style={{
                backgroundImage: "linear-gradient(90deg, #0ca66a 0%, #10b981 42%, #ecfdf5 100%)",
              }}
            >
              {images.length > 0 && (
                <>
                  <div className="absolute inset-y-0 right-0 w-1/2">
                    <Image
                      src={images[i % images.length]}
                      alt=""
                      fill
                      priority={i === 0}
                      sizes="(max-width: 640px) 50vw, 45vw"
                      className="object-contain p-0 sm:p-2 lg:p-4"
                      style={{ mixBlendMode: "darken" }}
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(12, 166, 106, 1) 0%, rgba(12, 166, 106, .96) 40%, rgba(12, 166, 106, .52) 57%, rgba(12, 166, 106, 0) 74%)",
                    }}
                  />
                </>
              )}
              <div className="relative z-10 mx-auto flex h-full max-w-360 flex-col justify-center gap-3 px-6 2xl:px-0">
                {i === 0
                  ? <h1 className="max-w-md text-3xl font-bold leading-tight md:text-[32px]">{s.title}</h1>
                  : <h2 className="max-w-md text-3xl font-bold leading-tight md:text-[32px]">{s.title}</h2>}
                <p className="max-w-xl text-sm text-white/90 md:text-base">{s.text}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link href={s.primary.href} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand-soft">{s.primary.label}</Link>
                  <Link href={s.secondary.href} className="rounded-lg border border-white/80 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">{s.secondary.label}</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button type="button" onClick={prev} aria-label="Previous slide" className="absolute left-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-green-600 shadow md:grid"><ChevronLeft className="size-6" /></button>
      <button type="button" onClick={next} aria-label="Next slide" className="absolute right-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-green-600 shadow md:grid"><ChevronRight className="size-6" /></button>
      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button key={s.title} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === index} onClick={() => embla?.scrollTo(i)} className={cn("h-3 rounded-full transition-all", i === index ? "w-8 bg-white" : "w-3 bg-white/50")} />
        ))}
      </div>
    </section>
  );
}
