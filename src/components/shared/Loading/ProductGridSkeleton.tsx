export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul aria-busy="true" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="animate-pulse rounded-xl border border-line p-3">
          <div className="aspect-square rounded-lg bg-gray-100" />
          <div className="mt-3 h-3 w-1/3 rounded bg-gray-100" />
          <div className="mt-2 h-4 w-full rounded bg-gray-100" />
          <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
        </li>
      ))}
    </ul>
  );
}
