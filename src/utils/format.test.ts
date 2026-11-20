import { describe, expect, it } from "vitest";
import { discountPercent, formatPrice } from "./format";

describe("format", () => {
  it("formats prices with thousands separators", () => {
    expect(formatPrice(19199)).toBe("19,199 EGP");
  });
  it("computes discount percentage", () => {
    expect(discountPercent(349, 499)).toBe(30);
    expect(discountPercent(379, 744)).toBe(49);
  });
  it("returns 0 when there is no real discount", () => {
    expect(discountPercent(100)).toBe(0);
    expect(discountPercent(100, 100)).toBe(0);
    expect(discountPercent(120, 100)).toBe(0);
  });
});
