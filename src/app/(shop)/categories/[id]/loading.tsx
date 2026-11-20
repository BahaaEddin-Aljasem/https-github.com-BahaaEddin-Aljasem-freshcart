import { ProductGridSkeleton } from "@/components/shared/Loading/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-page space-y-6 px-4 py-8">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
