export default function Loading() {
  return (
    <div className="mx-auto grid max-w-page animate-pulse gap-8 px-4 py-8 md:grid-cols-2">
      <div className="aspect-square rounded-2xl bg-gray-100" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-gray-100" />
        <div className="h-8 w-3/4 rounded bg-gray-100" />
        <div className="h-8 w-1/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}
