"use client";

import { ErrorState } from "@/components/shared/ErrorState/ErrorState";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-page px-4 py-16">
      <ErrorState message="Something went wrong while loading this page." onRetry={reset} />
    </div>
  );
}
