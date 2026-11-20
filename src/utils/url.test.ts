import { describe, expect, it } from "vitest";
import { buildQuery, first, toNumber, toPositiveInt } from "./url";

describe("url helpers", () => {
  it("takes the first value of repeated params", () => {
    expect(first(["a", "b"])).toBe("a");
    expect(first(undefined)).toBeUndefined();
  });
  it("parses positive ints with fallback", () => {
    expect(toPositiveInt("3", 1)).toBe(3);
    expect(toPositiveInt("0", 1)).toBe(1);
    expect(toPositiveInt("abc", 1)).toBe(1);
    expect(toPositiveInt("-4", 1)).toBe(1);
  });
  it("parses non-negative numbers", () => {
    expect(toNumber("150")).toBe(150);
    expect(toNumber("-1")).toBeUndefined();
    expect(toNumber("x")).toBeUndefined();
    expect(toNumber("")).toBeUndefined();
  });
  it("builds a query string and skips empty values", () => {
    expect(buildQuery({ q: "shawl", page: 2, sort: undefined, category: "" })).toBe("?q=shawl&page=2");
    expect(buildQuery({})).toBe("");
    expect(buildQuery({ category: ["one", "two"], brand: ["Acme"] })).toBe("?category=one&category=two&brand=Acme");
  });
});
