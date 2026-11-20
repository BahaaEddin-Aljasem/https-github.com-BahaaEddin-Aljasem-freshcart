import { describe, expect, it } from "vitest";
import type { CartSnapshot } from "@/features/cart/api/cart.api";
import type { OrderAddress } from "@/features/orders/types";
import { placeLocalOrder, readLocalOrders, type LocalOrderStorage } from "./local-order-storage";

class MemoryStorage implements LocalOrderStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const cart: CartSnapshot = {
  items: [{
    id: "product-1",
    title: "Fresh Product",
    imageUrl: "/product.jpg",
    price: 250,
    quantity: 2,
  }],
  totalPrice: 500,
};

const address: OrderAddress = {
  fullName: "Test User",
  phone: "+4915799912345",
  country: "DE",
  city: "Hannover",
  address: "1 Main Street",
  notes: "Leave at the front desk",
};

describe("local order storage", () => {
  it("saves a complete order and keeps each account's history isolated", () => {
    const storage = new MemoryStorage();

    const order = placeLocalOrder(storage, "user-1", cart, address);

    expect(order).toMatchObject({
      items: cart.items,
      subtotal: 500,
      shipping: 0,
      total: 500,
      address: {
        ...address,
        city: "Hannover, Germany",
      },
      payment: "cash",
      status: "Saved locally",
    });
    expect(readLocalOrders(storage, "user-1")).toEqual([order]);
    expect(readLocalOrders(storage, "user-2")).toEqual([]);
  });

  it("rejects empty carts and reports corrupted saved orders", () => {
    const storage = new MemoryStorage();

    expect(() => placeLocalOrder(storage, "user-1", { items: [], totalPrice: 0 }, address))
      .toThrow("Your cart is empty.");

    storage.setItem("freshcart:orders:v1:user-1", "{");
    expect(() => readLocalOrders(storage, "user-1"))
      .toThrow("Your saved order data could not be read.");
  });
});
