export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ecommerce.routemisr.com",
} as const;

export const AUTH_COOKIE = "fc_token";
export const USER_COOKIE = "fc_user";
