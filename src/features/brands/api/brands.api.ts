import { unstable_cache } from "next/cache";
import { api } from "@/lib/axios";
import { env } from "@/config/env";
import { ENDPOINTS } from "@/services/api/endpoints";
import { mapBrand } from "@/features/brands/types/brand.model";
import type { ApiBrand, Brand } from "@/features/brands/types/brand.model";

const PAGE_LIMIT = 50;

interface ApiResponse<T> {
  data: T;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
  };
}

/** The API caps page size at 50, so brands beyond that require extra pages. */
export const getBrands = unstable_cache(
  async (): Promise<Brand[]> => {
    const firstPage = await api.get<ApiResponse<ApiBrand[]>>(ENDPOINTS.brands, {
      params: { page: 1, limit: PAGE_LIMIT },
    });
    const numberOfPages = firstPage.data.metadata?.numberOfPages ?? 1;
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, numberOfPages - 1) }, (_, index) =>
        api.get<ApiResponse<ApiBrand[]>>(ENDPOINTS.brands, {
          params: { page: index + 2, limit: PAGE_LIMIT },
        }),
      ),
    );
    return [firstPage, ...rest].flatMap((response) => response.data.data.map(mapBrand));
  },
  ["catalog-brands", env.apiBaseUrl],
  { revalidate: 600 },
);
