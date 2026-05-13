import type { NextConfig } from "next";

// Mirrors src/lib/config/site.ts. Inlined here because next.config.ts is
// loaded by Next's bootstrap before tsconfig path aliases (`@/...`) resolve
// reliably. Keep the two in sync if PROD_HOST changes.
function isProdHost(): boolean {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  let host = "";
  try {
    host = new URL(appUrl).hostname;
  } catch {
    return false;
  }
  return host === "freshterra.in" || host === "www.freshterra.in";
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "**.saleor.cloud" },
      { protocol: "https", hostname: "**.freshterra.in" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  typedRoutes: true,
  async headers() {
    if (isProdHost()) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
