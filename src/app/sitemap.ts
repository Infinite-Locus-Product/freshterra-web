import type { MetadataRoute } from "next";

import { env } from "@/lib/config/env";

/**
 * Stub sitemap. Wire Saleor (products + categories) and Strapi (CMS pages)
 * once those clients are implemented. CLAUDE.md §6 (SEO).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly" },
    {
      url: `${base}/food-philosophy`,
      lastModified,
      changeFrequency: "monthly",
    },
    { url: `${base}/careers`, lastModified, changeFrequency: "weekly" },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly" },
    { url: `${base}/stores`, lastModified, changeFrequency: "weekly" },
    {
      url: `${base}/privacy-policy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
