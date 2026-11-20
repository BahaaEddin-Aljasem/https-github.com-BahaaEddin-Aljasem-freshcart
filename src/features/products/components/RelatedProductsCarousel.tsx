"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function RelatedProductsCarousel({ children }: { children: ReactNode }) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", slidesToScroll: 1 });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!embla) return;

    const updateControls = () => {
      setCanScrollPrev(embla.canScrollPrev());
      setCanScrollNext(embla.canScrollNext());
    };

    updateControls();
    embla.on("select", updateControls);
    embla.on("reInit", updateControls);
    return () => {
      embla.off("select", updateControls);
      embla.off("reInit", updateControls);
    };
  }, [embla]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <section aria-labelledby="related-title" aria-roledescription="carousel" aria-label="You May Also Like">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="related-title" className="flex items-center gap-3 text-xl font-bold text-ink sm:text-2xl">
          <span aria-hidden className="h-8 w-1 shrink-0 rounded-full bg-brand" />
          <span>You May Also <span className="text-brand">Like</span></span>
        </h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous products"
            className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70 sm:size-10"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next products"
            className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70 sm:size-10"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <div ref={emblaRef} className="overflow-hidden">
        {children}
      </div>
    </section>
  );
}
