import { EmptyState } from "@/components/shared/EmptyState/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-4">
      <EmptyState title="Page not found" description="The page you are looking for does not exist or has moved." action={{ label: "Back to home", href: "/" }} />
    </div>
  );
}
