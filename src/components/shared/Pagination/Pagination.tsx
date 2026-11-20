import Link from "next/link";
import { buildQuery, type QueryValue } from "@/utils/url";

interface PaginationProps {
  basePath: string;
  page: number;
  totalPages: number;
  query?: Record<string, QueryValue>;
}

export function Pagination({ basePath, page, totalPages, query = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hrefForPage = (target: number) =>
    `${basePath}${buildQuery({ ...query, page: target === 1 ? undefined : target })}`;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4 py-6">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} rel="prev" className="rounded-lg border border-line px-4 py-2 text-sm hover:border-brand hover:text-brand">
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className="rounded-lg border border-line px-4 py-2 text-sm text-slate-400">
          Previous
        </span>
      )}
      <span aria-current="page" className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefForPage(page + 1)} rel="next" className="rounded-lg border border-line px-4 py-2 text-sm hover:border-brand hover:text-brand">
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className="rounded-lg border border-line px-4 py-2 text-sm text-slate-400">
          Next
        </span>
      )}
    </nav>
  );
}
