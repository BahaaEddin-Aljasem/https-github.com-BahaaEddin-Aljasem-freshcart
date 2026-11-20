import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveSearchInput } from "./LiveSearchInput";

interface SearchBarProps {
  id: string;
  className?: string;
  placeholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onSubmit?: () => void;
}

export function SearchBar({
  id,
  className,
  placeholder = "Search for products, brands and more...",
  inputClassName,
  buttonClassName,
  onSubmit,
}: SearchBarProps) {
  return (
    <form role="search" action="/products" method="get" onSubmit={onSubmit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">Search products</label>
      <LiveSearchInput
        id={id}
        defaultValue=""
        placeholder={placeholder}
        className={cn("w-full rounded-full border border-line bg-slate-50 py-2.5 pl-5 pr-12 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20", inputClassName)}
      />
      <button
        type="submit"
        aria-label="Search"
        className={cn("absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-green-600 text-white hover:bg-brand-dark", buttonClassName)}
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}
