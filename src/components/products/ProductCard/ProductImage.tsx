"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? "/images/placeholder.svg" : src}
      alt={alt}
      fill
      priority={priority}
      sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
      className={cn("object-cover transition-transform duration-300 group-hover:scale-105", className)}
      onError={() => setFailed(true)}
    />
  );
}
