import axios, { AxiosError } from "axios";
import { env } from "@/config/env";

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
});

export interface ApiError {
  message: string;
  status?: number;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message ?? error.message,
      status: error.response?.status,
    };
  }
  if (error instanceof Error) return { message: error.message };
  return { message: "Unexpected error" };
}

/** Same-origin client for our own Next.js route handlers (BFF). */
export const localApi = axios.create({ baseURL: "", timeout: 15_000 });

export const SESSION_INVALIDATED_EVENT = "freshcart:session-invalidated";

localApi.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      typeof window !== "undefined" &&
      error instanceof AxiosError &&
      error.response?.status === 401 &&
      error.config?.url?.startsWith("/api/store/")
    ) {
      window.dispatchEvent(new Event(SESSION_INVALIDATED_EVENT));
    }
    return Promise.reject(error);
  },
);
