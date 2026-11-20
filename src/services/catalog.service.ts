import { unstable_cache } from "next/cache";
import { PAGE_SIZE } from "@/config/constants";
import { api } from "@/lib/axios";
import { env } from "@/config/env";
import { ENDPOINTS } from "@/services/api/endpoints";
import { AxiosError } from "axios";
import { mapCategory, mapProduct } from "@/features/products/product.model";
import type { ApiCategory, ApiProduct, Category, Product } from "@/features/products/product.model";

export { mapProduct };
export type { Category, Product };

export type SortKey = "relevance" | "newest" | "price-asc" | "price-desc" | "rating";

export interface ProductQuery {
  q?: string;
  category?: string;
  categories?: string[];
  brands?: string[];
  sort?: SortKey;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  discountedOnly?: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  brands: string[];
}

interface ApiResponse<T> {
  data: T;
  results?: number;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
  };
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export function isSortKey(v: string | undefined): v is SortKey {
  return SORT_OPTIONS.some((o) => o.value === v);
}

function apiSortFor(key: SortKey): string {
  switch (key) {
    case "price-asc":
      return "price";
    case "price-desc":
      return "-price";
    case "rating":
      return "-ratingsAverage";
    case "newest":
    case "relevance":
      return "-createdAt";
  }
}

const fetchAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const firstPage = await api.get<ApiResponse<ApiProduct[]>>(ENDPOINTS.products, {
      params: { page: 1, limit: 50, sort: "-createdAt" },
    });
    const numberOfPages = firstPage.data.metadata?.numberOfPages ?? 1;
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, numberOfPages - 1) }, (_, index) =>
        api.get<ApiResponse<ApiProduct[]>>(ENDPOINTS.products, {
          params: { page: index + 2, limit: 50, sort: "-createdAt" },
        }),
      ),
    );
    return [firstPage, ...rest].flatMap((response) => response.data.data.map(mapProduct));
  },
  ["catalog-products", env.apiBaseUrl],
  { revalidate: 300 },
);

const fetchCategoryProducts = unstable_cache(
  async (category: string) => {
  const fetchPage = (currentPage: number) =>
    api.get<ApiResponse<ApiProduct[]>>(ENDPOINTS.products, {
      params: {
        category,
        page: currentPage,
        limit: 50,
        sort: apiSortFor("newest"),
      },
    });

  const firstResponse = await fetchPage(1);
  const apiPages = Math.max(1, firstResponse.data.metadata?.numberOfPages ?? 1);
  const remainingPages = await Promise.all(
    Array.from({ length: apiPages - 1 }, (_, index) => fetchPage(index + 2)),
  );
  const products = [firstResponse, ...remainingPages].flatMap((response) =>
    response.data.data.map(mapProduct),
  );
    return { products, total: firstResponse.data.results ?? products.length };
  },
  ["catalog-category-products", env.apiBaseUrl],
  { revalidate: 300 },
);

function sortProducts(products: Product[], sort: SortKey) {
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  if (sort === "rating") products.sort((a, b) => b.ratingAverage - a.ratingAverage);
  if (sort === "newest") products.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

async function getCategoryProducts(
  category: string,
  page: number,
  pageSize: number,
  sort: SortKey,
): Promise<Paginated<Product>> {
  const catalog = await fetchCategoryProducts(category);
  const products = [...catalog.products];
  sortProducts(products, sort);
  const total = catalog.total;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  return {
    items: products.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    page: currentPage,
    totalPages,
    total,
    brands: [...new Set(products.flatMap((product) => product.brandName ? [product.brandName] : []))]
      .sort((a, b) => a.localeCompare(b)),
  };
}

export async function getProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
  const {
    q,
    category,
    categories,
    brands,
    sort = "newest",
    minPrice,
    maxPrice,
    page = 1,
    pageSize = PAGE_SIZE,
    discountedOnly = false,
  } = query;
  const needle = q?.trim().toLocaleLowerCase();
  const singleCategory = category ?? (categories?.length === 1 ? categories[0] : undefined);

  if (
    singleCategory &&
    !needle &&
    !brands?.length &&
    minPrice === undefined &&
    maxPrice === undefined &&
    !discountedOnly
  ) {
    return getCategoryProducts(singleCategory, page, pageSize, sort);
  }

  const products = await fetchAllProducts();
  const filtered = products.filter((product) =>
    (!needle || `${product.title} ${product.description} ${product.brandName ?? ""}`.toLocaleLowerCase().includes(needle)) &&
    (categories?.length
      ? categories.includes(product.categoryId)
      : !category || product.categoryId === category) &&
    (!brands?.length || (product.brandName !== undefined && brands.includes(product.brandName))) &&
    (minPrice === undefined || product.price >= minPrice) &&
    (maxPrice === undefined || product.price <= maxPrice) &&
    (!discountedOnly || product.originalPrice !== undefined),
  );

  sortProducts(filtered, sort);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return {
    items: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    page: currentPage,
    totalPages,
    total,
    brands: [...new Set(products.flatMap((product) => product.brandName ? [product.brandName] : []))]
      .sort((a, b) => a.localeCompare(b)),
  };
}

export const getProduct = unstable_cache(
  async (id: string): Promise<Product | undefined> => {
    try {
      const response = await api.get<ApiResponse<ApiProduct>>(`${ENDPOINTS.products}/${encodeURIComponent(id)}`);
      return mapProduct(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) return undefined;
      throw error;
    }
  },
  ["catalog-product", env.apiBaseUrl],
  { revalidate: 300 },
);

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const result = await getProducts({
    category: product.categoryId,
    pageSize: Math.max(limit + 1, PAGE_SIZE),
    sort: "rating",
  });
  return result.items.filter((item) => item.id !== product.id).slice(0, limit);
}

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<ApiCategory[]>>(ENDPOINTS.categories, {
      params: { limit: 40 },
    });
    return response.data.data.map(mapCategory);
  },
  ["catalog-categories", env.apiBaseUrl],
  { revalidate: 600 },
);

export const getCategory = unstable_cache(
  async (id: string): Promise<Category | undefined> => {
    try {
      const response = await api.get<ApiResponse<ApiCategory>>(
        `${ENDPOINTS.categories}/${encodeURIComponent(id)}`,
      );
      return mapCategory(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) return undefined;
      throw error;
    }
  },
  ["catalog-category", env.apiBaseUrl],
  { revalidate: 600 },
);
