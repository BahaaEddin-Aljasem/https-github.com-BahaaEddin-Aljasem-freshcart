import { describe, expect, it } from "vitest";
import {
  getCountryName,
  isCountryCode,
  isValidInternationalPhoneNumber,
  normalizePhoneNumber,
  PHONE_COUNTRIES,
} from "./phone";

describe("international phone utilities", () => {
  it("normalizes national numbers using the selected country", () => {
    expect(normalizePhoneNumber("01012345678", "EG")).toBe("+201012345678");
    expect(normalizePhoneNumber("+14155552671", "EG")).toBe("+14155552671");
  });

  it("validates numbers internationally and exposes country calling codes", () => {
    expect(isValidInternationalPhoneNumber("+201012345678")).toBe(true);
    expect(isValidInternationalPhoneNumber("+14155552671")).toBe(true);
    expect(isValidInternationalPhoneNumber("+12345")).toBe(false);
    expect(isCountryCode("EG")).toBe(true);
    expect(isCountryCode("XX")).toBe(false);
    expect(PHONE_COUNTRIES.find(({ code }) => code === "US")?.callingCode).toBe("1");
    expect(getCountryName("EG")).toBe("Egypt");
  });
});
