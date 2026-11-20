import { AxiosError } from "axios";
import { localApi } from "@/lib/axios";
import { clampCartQuantity, type CartItem } from "@/store/cart.store";
import { mapProduct } from "@/features/products/product.model";
import type { ApiProduct } from "@/features/products/product.model";
import { MAX_QUANTITY } from "@/config/constants";

interface ApiCartLine {
  count: number;
  price: number;
  product: ApiProduct;
}

interface ApiCart {
  _id?: string;
  products?: ApiCartLine[];
  cartItems?: ApiCartLine[];
  totalCartPrice?: number;
}

interface CartResponse {
  data?: ApiCart | null;
}

export interface CartSnapshot {
  id?: string;
  items: CartItem[];
  totalPrice: number;
}

function mapCart(response: CartResponse): CartSnapshot {
  if (!("data" in response)) throw new Error("Unexpected response from the cart API.");
  const cart = response.data;
  const lines = cart?.products ?? cart?.cartItems ?? [];
  const items = lines.map((line) => {
    const product = mapProduct(line.product);
    return {
      id: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      categoryName: product.categoryName,
      price: line.price || product.price,
      quantity: clampCartQuantity(line.count ?? 1, product.quantity),
      stock: product.quantity,
    };
  });

  return {
    id: cart?._id,
    items,
    totalPrice: cart?.totalCartPrice ?? items.reduce((total, item) => total + item.price * item.quantity, 0),
  };
}

export const cartApi = {
  async get(): Promise<CartSnapshot> {
    try {
      const response = await localApi.get<CartResponse>("/api/store/cart");
      return mapCart(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return { items: [], totalPrice: 0 };
      }
      throw error;
    }
  },
  addProduct: (productId: string) => localApi.post("/api/store/cart", { productId }),
  updateQuantity: (productId: string, count: number) =>
    localApi.put(`/api/store/cart/${productId}`, { count }),
  remove: (productId: string) => localApi.delete(`/api/store/cart/${productId}`),
  clear: () => localApi.delete("/api/store/cart"),
};

export async function mergeGuestCart(guestItems: CartItem[]): Promise<CartSnapshot> {
  let remote = await cartApi.get();
  for (const guestItem of guestItems) {
    const existing = remote.items.find((item) => item.id === guestItem.id);
    const desiredQuantity = clampCartQuantity(
      Math.max(guestItem.quantity, existing?.quantity ?? 0),
      guestItem.stock ?? MAX_QUANTITY,
    );
    if (existing) {
      if (desiredQuantity !== existing.quantity) {
        await cartApi.updateQuantity(guestItem.id, desiredQuantity);
      }
    } else {
      await cartApi.addProduct(guestItem.id);
      if (desiredQuantity > 1) await cartApi.updateQuantity(guestItem.id, desiredQuantity);
    }
  }
  remote = await cartApi.get();
  return remote;
}

