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
  // Same-origin proxy for browser → backend calls. The BFF sends no CORS
  // headers, so client-side requests go to `/bff/*` and Next forwards them to
  // the backend server-side (no CORS). Server-side (RSC) calls hit the backend
  // directly — see buildUrl() in lib/clients/freshterra-api.ts.
  async rewrites() {
    const apiOrigin =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.stage.freshterra.in";
    return [{ source: "/bff/:path*", destination: `${apiOrigin}/:path*` }];
  },
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
