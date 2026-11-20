"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { PHONE_COUNTRIES, normalizePhoneNumber } from "@/lib/phone";

interface PhoneNumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  defaultCountry?: CountryCode;
}

function getDisplayValue(value: string, defaultCountry: CountryCode) {
  const parsed = value
    ? parsePhoneNumberFromString(value, defaultCountry)
    : undefined;
  return {
    country: parsed?.country ?? defaultCountry,
    nationalNumber: parsed?.formatNational() ?? value,
  };
}

export const PhoneNumberField = forwardRef<HTMLInputElement, PhoneNumberFieldProps>(
  function PhoneNumberField(
    {
      label,
      value,
      onChange,
      onBlur,
      error,
      name,
      autoComplete = "tel-national",
      required = false,
      defaultCountry = "EG",
    },
    ref,
  ) {
    const id = useId();
    const errorId = `${id}-error`;
    const initial = getDisplayValue(value, defaultCountry);
    const [country, setCountry] = useState<CountryCode>(initial.country);
    const [nationalNumber, setNationalNumber] = useState(initial.nationalNumber);
    const lastValue = useRef(value);

    useEffect(() => {
      if (value === lastValue.current) return;
      const next = getDisplayValue(value, defaultCountry);
      setCountry(next.country);
      setNationalNumber(next.nationalNumber);
      lastValue.current = value;
    }, [defaultCountry, value]);

    useEffect(() => {
      if (!value) setCountry(defaultCountry);
    }, [defaultCountry, value]);

    const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextNumber = event.target.value;
      setNationalNumber(nextNumber);
      const normalized = normalizePhoneNumber(nextNumber, country);
      lastValue.current = normalized;
      onChange(normalized);
    };

    const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const nextCountry = PHONE_COUNTRIES.find(({ code }) => code === event.target.value)?.code;
      if (!nextCountry) return;
      setCountry(nextCountry);
      const normalized = normalizePhoneNumber(nationalNumber, nextCountry);
      lastValue.current = normalized;
      onChange(normalized);
    };

    return (
      <div className="space-y-1.5">
        <label htmlFor={`${id}-number`} className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500" aria-hidden>*</span>}
        </label>
        <div className={`flex min-w-0 overflow-hidden rounded-lg border bg-white transition focus-within:ring-2 focus-within:ring-brand/15 ${
          error ? "border-red-500 focus-within:border-red-500" : "border-slate-200 focus-within:border-brand"
        }`}>
          <select
            aria-label={`${label} country calling code`}
            value={country}
            onChange={handleCountryChange}
            className="w-[46%] max-w-48 shrink-0 border-r border-slate-200 bg-slate-50 px-2 text-xs text-slate-700 outline-none"
          >
            {PHONE_COUNTRIES.map(({ code, name, callingCode }) => (
              <option key={code} value={code}>{name} (+{callingCode})</option>
            ))}
          </select>
          <input
            ref={ref}
            id={`${id}-number`}
            name={name}
            type="tel"
            inputMode="tel"
            autoComplete={autoComplete}
            required={required}
            value={nationalNumber}
            onChange={handleNumberChange}
            onBlur={onBlur}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            placeholder="Phone number"
            className="h-9 min-w-0 flex-1 bg-white px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
        {error && <p id={errorId} role="alert" className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

PhoneNumberField.displayName = "PhoneNumberField";