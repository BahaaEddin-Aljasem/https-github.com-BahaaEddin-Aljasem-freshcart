import type { ProductCardData } from "@/components/products/ProductCard/ProductCard";
import { localApi } from "@/lib/axios";
import { mapProduct } from "@/features/products/product.model";
import type { ApiProduct } from "@/features/products/product.model";

interface WishlistResponse {
  data?: ApiProduct[];
}

export const wishlistApi = {
  async get(): Promise<ProductCardData[]> {
    const response = await localApi.get<WishlistResponse>("/api/store/wishlist");
    if (!Array.isArray(response.data.data)) throw new Error("Unexpected response from the wishlist API.");
    return response.data.data.map(mapProduct);
  },
  add: (productId: string) => localApi.post("/api/store/wishlist", { productId }),
  remove: (productId: string) => localApi.delete(`/api/store/wishlist/${productId}`),
};

export async function mergeGuestWishlist(items: ProductCardData[]): Promise<ProductCardData[]> {
  const remote = await wishlistApi.get();
  const existing = new Set(remote.map((product) => product.id));
  for (const product of items) {
    if (existing.has(product.id)) continue;
    await wishlistApi.add(product.id);
  }
  return wishlistApi.get();
}
