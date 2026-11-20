import { beforeEach, describe, expect, it, vi } from "vitest";
import { localApi } from "@/lib/axios";
import { cartApi, mergeGuestCart } from "./cart.api";

const get = vi.spyOn(localApi, "get");
const post = vi.spyOn(localApi, "post");
const put = vi.spyOn(localApi, "put");

beforeEach(() => {
  get.mockReset();
  post.mockReset();
  put.mockReset();
});

describe("cart API", () => {
  it("maps API cart line and product fields", async () => {
    get.mockResolvedValueOnce({
      data: {
        data: {
          _id: "cart-1",
          totalCartPrice: 100,
          products: [{
            count: 2,
            price: 50,
            product: {
              _id: "product-1",
              title: "Product",
              imageCover: "product.jpg",
              price: 75,
              quantity: 5,
              priceAfterDiscount: 50,
            },
          }],
        },
      },
    } as never);

    await expect(cartApi.get()).resolves.toMatchObject({
      id: "cart-1",
      totalPrice: 100,
      items: [{ id: "product-1", title: "Product", price: 50, quantity: 2, stock: 5 }],
    });
  });

  it("merges guest quantities idempotently with the API cart", async () => {
    get
      .mockResolvedValueOnce({
        data: {
          data: {
            _id: "cart-1",
            totalCartPrice: 100,
            products: [{
              count: 2,
              price: 50,
              product: { _id: "product-1", title: "Product", imageCover: "product.jpg", price: 50, quantity: 5 },
            }],
          },
        },
      } as never)
      .mockResolvedValueOnce({
        data: {
          data: {
            _id: "cart-1",
            totalCartPrice: 100,
            products: [{
              count: 2,
              price: 50,
              product: { _id: "product-1", title: "Product", imageCover: "product.jpg", price: 50, quantity: 5 },
            }],
          },
        },
      } as never);

    const result = await mergeGuestCart([{
      id: "product-1",
      title: "Product",
      imageUrl: "product.jpg",
      price: 50,
      quantity: 2,
      stock: 5,
    }]);

    expect(put).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
    expect(result.items[0].quantity).toBe(2);
  });
});
