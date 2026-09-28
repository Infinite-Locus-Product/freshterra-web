import { z } from "zod";

import type { SeoOverrides } from "@/lib/seo/pageMetadata";

import { readCmsString } from "./cms-readers";

const seoString = z.string().nullish();

/**
 * Strapi shared component `ftshared.seo`, attached to the 15 web content types
 * and passed through by the BFF as `entry.seo` (null until marketing fills it
 * in). Limits: metaTitle 70, metaDescription 300, canonicalUrl 255.
 */
export const cmsSeoSchema = z
  .object({
    metaTitle: seoString,
    metaDescription: seoString,
    canonicalUrl: seoString,
    /** Older fields — `ogImageUrl` feeds og:image; `canonicalPattern` is unused. */
    canonicalPattern: seoString,
    ogImageUrl: seoString,
  })
  .catchall(z.unknown());

export type CmsSeo = z.infer<typeof cmsSeoSchema>;

/**
 * Services that send an explicit `populate[...]` must list `seo` too — Strapi
 * then omits every component that is not named.
 */
export const CMS_SEO_POPULATE = { "populate[seo]": "*" } as const;

/**
 * Reads the `seo` component off a raw CMS entry. Never throws: a missing, null
 * or malformed component yields `null`, as does one whose fields are all blank.
 * snake_case aliases are tolerated like the folder's other CMS readers.
 */
export function readCmsSeo(entry: unknown): SeoOverrides | null {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;

  const parsed = cmsSeoSchema.safeParse((entry as { seo?: unknown }).seo);
  if (!parsed.success) return null;

  const record: Record<string, unknown> = parsed.data;
  const title = readCmsString(record, "metaTitle", "meta_title") || undefined;
  const description =
    readCmsString(record, "metaDescription", "meta_description") || undefined;
  const canonicalUrl =
    readCmsString(record, "canonicalUrl", "canonical_url") || undefined;
  const ogImage =
    readCmsString(record, "ogImageUrl", "og_image_url") || undefined;

  if (!title && !description && !canonicalUrl && !ogImage) return null;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonicalUrl ? { canonicalUrl } : {}),
    ...(ogImage ? { ogImage } : {}),
  };
}
