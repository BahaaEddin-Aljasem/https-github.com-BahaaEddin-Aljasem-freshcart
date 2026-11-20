"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LiveSearchInputProps {
  id: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  action?: string;
  preservedParams?: Record<string, string | string[] | undefined>;
}

export function LiveSearchInput({
  id,
  name = "q",
  defaultValue = "",
  placeholder,
  ariaLabel,
  className,
  action = "/products",
  preservedParams = {},
}: LiveSearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const getSearchUrl = (searchValue: string) => {
    const params = new URLSearchParams();
    const query = searchValue.trim();
    if (query) params.set(name, query);

    for (const [key, paramValue] of Object.entries(preservedParams)) {
      if (key === name || paramValue === undefined || paramValue === "") continue;
      const values = Array.isArray(paramValue) ? paramValue : [paramValue];
      values.filter(Boolean).forEach((item) => params.append(key, item));
    }

    const queryString = params.toString();
    return queryString ? `${action}?${queryString}` : action;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      router.replace(getSearchUrl(nextValue));
    }, 300);
  };

  return (
    <input
      id={id}
      name={name}
      type="search"
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={handleChange}
      className={cn(className)}
    />
  );
}
