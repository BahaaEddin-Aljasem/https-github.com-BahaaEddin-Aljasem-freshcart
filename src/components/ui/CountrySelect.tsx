"use client";

import { forwardRef } from "react";
import { PHONE_COUNTRIES } from "@/lib/phone";

interface CountrySelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  className?: string;
}

export const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  function CountrySelect(
    { id, name, value, onChange, onBlur, label = "Country", className },
    ref,
  ) {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          autoComplete="country"
          className={`h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15 ${className ?? ""}`}
        >
          {PHONE_COUNTRIES.map(({ code, name: countryName }) => (
            <option key={code} value={code}>{countryName}</option>
          ))}
        </select>
      </label>
    );
  },
);

CountrySelect.displayName = "CountrySelect";
