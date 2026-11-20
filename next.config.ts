import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_DIST_DIR || process.env.NODE_ENV === "development"
    ? { distDir: process.env.NEXT_DIST_DIR || ".next-freshcart-dev" }
    : {}),
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
  devIndicators: false,
  images: {
    minimumCacheTTL: 86_400,
    remotePatterns: [{ protocol: "https", hostname: "ecommerce.routemisr.com" }],
  },
};

export default nextConfig;
