import {
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { getName, registerLocale } from "i18n-iso-countries";
import englishCountryNames from "i18n-iso-countries/langs/en.json";

registerLocale(englishCountryNames);

export const PHONE_COUNTRIES = getCountries()
  .map((code) => ({
    code,
    name: getName(code, "en") ?? code,
    callingCode: getCountryCallingCode(code),
  }))
  .sort((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);

export function normalizePhoneNumber(value: string, defaultCountry: CountryCode): string {
  const input = value.trim();
  if (!input) return "";
  const parsed = input.startsWith("+")
    ? parsePhoneNumberFromString(input)
    : parsePhoneNumberFromString(input, defaultCountry);
  return parsed?.number ?? input;
}

export function isValidInternationalPhoneNumber(value: string): boolean {
  return isValidPhoneNumber(value);
}

export function isCountryCode(value: string): value is CountryCode {
  return isSupportedCountry(value);
}

export function getCountryName(code?: string): string {
  if (!code) return "";
  return getName(code, "en") ?? code;
}