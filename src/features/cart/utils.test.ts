import { describe, expect, it } from "vitest";
import { getCartTotals } from "./utils";
import { clampCartQuantity, type CartItem } from "@/store/cart.store";

const item = (price: number, quantity: number): CartItem => ({ id: String(price), title: "x", imageUrl: "", price, quantity });

describe("getCartTotals", () => {
  it("returns zero subtotal and leaves shipping to the API for an empty cart", () => {
    expect(getCartTotals([])).toMatchObject({ itemCount: 0, subtotal: 0, shipping: null, total: 0 });
  });
  it("does not invent shipping charges before the API calculates them", () => {
    const t = getCartTotals([item(149, 2)]);
    expect(t).toMatchObject({ itemCount: 1, subtotal: 298, shipping: null, total: 298 });
  });
  it("applies the published free-shipping threshold to the subtotal", () => {
    expect(getCartTotals([item(250, 2)]).shipping).toBe(0);
  });
  it("does not allow cart quantities above the available stock", () => {
    expect(clampCartQuantity(5, 3)).toBe(3);
    expect(clampCartQuantity(9, 3)).toBe(3);
    expect(clampCartQuantity(12, 20)).toBe(10);
  });
});
