import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Order } from "@/features/orders/types";
import { OrderCard } from "./OrderCard";

vi.mock("@/components/products/ProductCard/ProductImage", () => ({ ProductImage: () => null }));

const order: Order = {
  id: "order-1",
  createdAt: "2026-02-02T12:00:00Z",
  items: [
    { id: "product-1", title: "Woman Shawl", imageUrl: "", price: 149, quantity: 2 },
    { id: "product-2", title: "Another Shawl", imageUrl: "", price: 50, quantity: 1 },
  ],
  subtotal: 348,
  shipping: 0,
  total: 348,
  address: { fullName: "", phone: "01012345678", city: "Sadat City", address: "Abo Bakr" },
  payment: "card",
  status: "Processing",
};

describe("OrderCard", () => {
  it("shows quantities, payment and expanded order details", () => {
    const html = renderToStaticMarkup(createElement(OrderCard, { order, defaultExpanded: true }));
    expect(html).toContain("3 items");
    expect(html).toContain("+1");
    expect(html).toContain("Card payment");
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain("Woman Shawl");
    expect(html).toContain("Sadat City");
    expect(html).toContain("Free");
  });

  it("hides details by default and does not invent a payment method", () => {
    const html = renderToStaticMarkup(createElement(OrderCard, { order: { ...order, payment: undefined } }));
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("hidden");
    expect(html).not.toContain("Cash on delivery");
    expect(html).not.toContain("Card payment");
  });
});
