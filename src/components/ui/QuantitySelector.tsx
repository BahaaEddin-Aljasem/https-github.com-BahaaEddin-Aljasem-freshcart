"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "@/config/constants";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  max?: number;
  compact?: boolean;
}

export function QuantitySelector({ value, onChange, label = "Quantity", max = MAX_QUANTITY, compact = false }: QuantitySelectorProps) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-lg border border-line">
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)} className={compact ? "grid size-7 place-items-center bg-slate-50 hover:text-brand disabled:opacity-40" : "grid size-9 place-items-center hover:text-brand disabled:opacity-40"}>
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className={`text-center font-medium ${compact ? "w-6 text-xs" : "w-8 text-sm"}`}>{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className={compact ? "grid size-7 place-items-center bg-brand text-white hover:bg-brand-dark disabled:opacity-40" : "grid size-9 place-items-center hover:text-brand disabled:opacity-40"}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}
