import { describe, expect, it, vi } from "vitest";
import { localApi } from "@/lib/axios";
import { mapOrder, ordersApi } from "./orders.api";

describe("orders API mapping", () => {
  it("maps server totals, shipping address, and delivery status", () => {
    const order = mapOrder({
      _id: "order-1",
      createdAt: "2026-11-18T12:00:00.000Z",
      totalOrderPrice: 230,
      isDelivered: true,
      paymentMethodType: "card",
      shippingAddress: { details: "1 Main Street", phone: "01012345678", city: "Cairo" },
      cartItems: [{
        count: 2,
        price: 100,
        product: { _id: "product-1", title: "Product", imageCover: "product.jpg", price: 100 },
      }],
    }, "Sam Shopper");

    expect(order).toMatchObject({
      id: "order-1",
      subtotal: 200,
      shipping: 30,
      total: 230,
      address: {
        fullName: "Sam Shopper",
        address: "1 Main Street",
        phone: "01012345678",
        city: "Cairo",
      },
      status: "Delivered",
      payment: "card",
    });
  });

  it("does not claim a payment method when the API does not provide one", () => {
    const order = mapOrder({ _id: "order-2", createdAt: "2026-11-18", totalOrderPrice: 0 });
    expect(order.payment).toBeUndefined();
  });

  it("includes the selected country in the shipping address sent to the API", async () => {
    const post = vi.spyOn(localApi, "post").mockResolvedValueOnce({
      data: {
        data: {
          _id: "order-3",
          createdAt: "2026-11-20",
          totalOrderPrice: 0,
        },
      },
    } as never);

    try {
      await ordersApi.placeOrder(
        { id: "cart-1", items: [], totalPrice: 0 },
        {
          fullName: "Sam Shopper",
          phone: "+14155552671",
          country: "US",
          city: "San Francisco",
          address: "1 Market Street",
        },
      );

      expect(post).toHaveBeenCalledWith("/api/store/orders/cart-1", {
        shippingAddress: {
          details: "Sam Shopper, 1 Market Street",
          phone: "+14155552671",
          city: "San Francisco, United States of America",
        },
      });
    } finally {
      post.mockRestore();
    }
  });
});
