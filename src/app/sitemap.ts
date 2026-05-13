import type { MetadataRoute } from "next";

import { env } from "@/lib/config/env";
import { isIndexable } from "@/lib/config/site";

/**
 * Stub sitemap. Wire Saleor (products + categories) and Strapi (CMS pages)
 * once those clients are implemented. CLAUDE.md §6 (SEO).
 *
 * Non-prod environments return an empty sitemap so we don't advertise URLs
 * we've also marked noindex via robots.ts + metadata.robots.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];

  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/privacy-policy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
