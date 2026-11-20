import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  labelClassName?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className, labelClassName, id, ...props }, ref) => {
    const auto = useId();
    const inputId = id ?? auto;
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className={cn("text-sm font-medium", labelClassName)}>{label}</label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20",
            error && "border-red-500",
            className,
          )}
          {...props}
        />
        {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);
TextField.displayName = "TextField";
