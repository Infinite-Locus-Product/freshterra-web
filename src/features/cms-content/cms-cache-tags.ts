/** Next.js cache tags for `GET /api/v1/content/single/web-homepage`. */
export const CMS_WEB_HOMEPAGE_TAGS = ["cms:web-homepage", "cms:home"] as const;

/** ISR fallback when the Strapi revalidate webhook does not fire. */
export const CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS = 600;

export function isHomepageCmsCacheTag(tag: string): boolean {
  return (CMS_WEB_HOMEPAGE_TAGS as readonly string[]).includes(tag);
}
