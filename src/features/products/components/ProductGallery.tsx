"use client";

import { useState } from "react";
import { ProductImage } from "@/components/products/ProductCard/ProductImage";

export function ProductGallery({ title, images }: { title: string; images: string[] }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="relative mx-auto aspect-[0.82] w-full max-w-[420px] overflow-hidden rounded-xl border border-line bg-slate-50">
        <ProductImage key={selectedImage} src={selectedImage} alt={title} priority className="object-contain p-4" />
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto pb-1">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            aria-label={`Show product image ${index + 1}`}
            aria-pressed={selectedImage === image}
            onClick={() => setSelectedImage(image)}
            className={`relative size-14 shrink-0 overflow-hidden rounded-lg border bg-white sm:size-16 ${
              selectedImage === image ? "border-brand ring-2 ring-brand/20" : "border-line"
            }`}
          >
            <ProductImage src={image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
