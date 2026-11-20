import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(callback: T) => callback,
}));

import { api } from "@/lib/axios";
import { ENDPOINTS } from "@/services/api/endpoints";
import { getCategories, getProduct, getProducts, mapProduct } from "./catalog.service";

const request = vi.spyOn(api, "get");

function apiProduct(
  id: string,
  title: string,
  price: number,
  category = "category-1",
  extra: Record<string, unknown> = {},
) {
  return {
    _id: id,
    title,
    imageCover: `${id}.jpg`,
    price,
    category: { _id: category, name: category === "category-1" ? "Category One" : "Category Two", image: "category.jpg" },
    ...extra,
  };
}

beforeEach(() => {
  request.mockReset();
});

describe("catalog service", () => {
  it("maps live product fields and only uses valid discounted prices", () => {
    const product = mapProduct({
      _id: "product-1",
      title: "Test product",
      description: "Details",
      imageCover: "cover.jpg",
      images: ["front.jpg", "back.jpg"],
      category: { _id: "category-1", name: "Category", image: "category.jpg" },
      subcategory: [{ _id: "subcategory-1", name: "Clothing" }],
      brand: { name: "Brand" },
      quantity: 3,
      sold: 7,
      ratingsAverage: 4.5,
      ratingsQuantity: 8,
      price: 100,
      priceAfterDiscount: 75,
    });

    expect(product).toMatchObject({
      id: "product-1",
      imageUrl: "cover.jpg",
      images: ["front.jpg", "back.jpg"],
      categoryId: "category-1",
      categoryName: "Category",
      subcategoryName: "Clothing",
      brandName: "Brand",
      quantity: 3,
      sold: 7,
      ratingAverage: 4.5,
      ratingCount: 8,
      price: 75,
      originalPrice: 100,
    });
    expect(mapProduct({
      _id: "product-2",
      title: "No discount",
      imageCover: "cover.jpg",
      price: 100,
      priceAfterDiscount: 0,
    })).toMatchObject({ price: 100, originalPrice: undefined });
    expect(mapProduct({
      _id: "product-3",
      title: "Invalid sold count",
      imageCover: "cover.jpg",
      price: 100,
      sold: Number.MAX_VALUE,
    }).sold).toBeUndefined();
  });

  it("searches live products case-insensitively and applies category, price, sort, and page filters", async () => {
    request.mockResolvedValueOnce({
      data: {
        results: 3,
        metadata: { currentPage: 1, numberOfPages: 1 },
        data: [
          apiProduct("p1", "Cotton Shirt", 80),
          apiProduct("p2", "T-shirt", 50),
          apiProduct("p3", "Shirt", 20, "category-2"),
        ],
      },
    } as never);

    const result = await getProducts({
      q: "SHIRT",
      category: "category-1",
      minPrice: 30,
      maxPrice: 100,
      sort: "price-desc",
      page: 2,
      pageSize: 1,
    });

    expect(request).toHaveBeenCalledWith(ENDPOINTS.products, {
      params: { page: 1, limit: 50, sort: "-createdAt" },
    });
    expect(result).toMatchObject({ page: 2, totalPages: 2, total: 2 });
    expect(result.items.map((item) => item.title)).toEqual(["T-shirt"]);
  });

  it("returns matching products for a one-character search", async () => {
    request.mockResolvedValueOnce({
      data: {
        metadata: { currentPage: 1, numberOfPages: 1 },
        data: [
          apiProduct("p1", "Women Dress", 80),
          apiProduct("p2", "Leather Shoes", 50),
        ],
      },
    } as never);

    const result = await getProducts({ q: "w" });

    expect(result.items.map((item) => item.title)).toEqual(["Women Dress"]);
  });

  it("sorts products and filters current API discounts", async () => {
    request.mockResolvedValueOnce({
      data: {
        results: 3,
        metadata: { currentPage: 1, numberOfPages: 1 },
        data: [
          apiProduct("p1", "First", 100, "category-1", { priceAfterDiscount: 75 }),
          apiProduct("p2", "Second", 50),
          apiProduct("p3", "Third", 200, "category-1", { priceAfterDiscount: 150 }),
        ],
      },
    } as never);

    const result = await getProducts({ discountedOnly: true, sort: "price-asc", pageSize: 10 });
    expect(result.items.map((item) => item.id)).toEqual(["p1", "p3"]);
    expect(result.items.map((item) => item.price)).toEqual([75, 150]);
  });

  it("uses paginated category API results when no local-only filters are required", async () => {
    request.mockResolvedValueOnce({
      data: {
        results: 11,
        metadata: { currentPage: 1, numberOfPages: 1 },
        data: Array.from({ length: 11 }, (_, index) =>
          apiProduct(`p${index + 1}`, `Category product ${index + 1}`, 100 - index),
        ),
      },
    } as never);

    const result = await getProducts({
      category: "category-1",
      page: 1,
      pageSize: 4,
      sort: "price-asc",
    });

    expect(request).toHaveBeenCalledWith(ENDPOINTS.products, {
      params: { category: "category-1", page: 1, limit: 50, sort: "-createdAt" },
    });
    expect(request).toHaveBeenCalledOnce();
    expect(result).toMatchObject({
      page: 1,
      totalPages: 3,
      total: 11,
      brands: [],
    });
    expect(result.items.map((item) => item.price)).toEqual([90, 91, 92, 93]);
  });

  it("keeps local catalog filtering when a category is combined with search", async () => {
    request.mockResolvedValueOnce({
      data: {
        metadata: { currentPage: 1, numberOfPages: 1 },
        data: [apiProduct("p1", "Searched category product", 50)],
      },
    } as never);

    const result = await getProducts({ category: "category-1", q: "searched" });

    expect(request).toHaveBeenCalledWith(ENDPOINTS.products, {
      params: { page: 1, limit: 50, sort: "-createdAt" },
    });
    expect(result.items.map((item) => item.title)).toEqual(["Searched category product"]);
  });

  it("filters by multiple categories and brands", async () => {
    request.mockResolvedValueOnce({
      data: {
        metadata: { currentPage: 1, numberOfPages: 1 },
        data: [
          apiProduct("p1", "First", 100, "category-1", { brand: { name: "Brand One" } }),
          apiProduct("p2", "Second", 50, "category-2", { brand: { name: "Brand Two" } }),
          apiProduct("p3", "Third", 75, "category-2", { brand: { name: "Brand One" } }),
        ],
      },
    } as never);

    const result = await getProducts({
      categories: ["category-1", "category-2"],
      brands: ["Brand One"],
      sort: "relevance",
    });

    expect(result.items.map((item) => item.id)).toEqual(["p1", "p3"]);
  });

  it("fetches product detail and category data from the API", async () => {
    request
      .mockResolvedValueOnce({
        data: { data: apiProduct("p1", "Product", 10) },
      } as never)
      .mockResolvedValueOnce({
        data: {
          data: [{ _id: "c1", name: "Category", image: "category.jpg" }],
        },
      } as never);

    expect((await getProduct("p1"))?.title).toBe("Product");
    expect(await getCategories()).toEqual([{ id: "c1", name: "Category", imageUrl: "category.jpg" }]);
  });
});
