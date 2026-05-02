import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "**.saleor.cloud" },
      { protocol: "https", hostname: "**.freshterra.in" },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
