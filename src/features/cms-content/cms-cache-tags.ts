/** Next.js cache tags for `GET /api/v1/content/single/web-homepage`. */
export const CMS_WEB_HOMEPAGE_TAGS = ["cms:web-homepage", "cms:home"] as const;

/** ISR fallback when the Strapi revalidate webhook does not fire. */
export const CMS_WEB_HOMEPAGE_REVALIDATE_SECONDS = 600;

/** Next.js cache tags for `GET /api/v1/content/single/web-footer`. */
export const CMS_WEB_FOOTER_TAGS = ["cms:web-footer", "cms:footer"] as const;

export const CMS_WEB_FOOTER_REVALIDATE_SECONDS = 600;

export function isHomepageCmsCacheTag(tag: string): boolean {
  return (CMS_WEB_HOMEPAGE_TAGS as readonly string[]).includes(tag);
}

export function isFooterCmsCacheTag(tag: string): boolean {
  return (CMS_WEB_FOOTER_TAGS as readonly string[]).includes(tag);
}

/** Next.js cache tags for `GET /api/v1/content/single/news-page`. */
export const CMS_NEWS_PAGE_TAGS = ["cms:news-page", "cms:news"] as const;

export const CMS_NEWS_PAGE_REVALIDATE_SECONDS = 600;

export function isNewsPageCmsCacheTag(tag: string): boolean {
  return (CMS_NEWS_PAGE_TAGS as readonly string[]).includes(tag);
}

/** Next.js cache tags for `GET /api/v1/content/store-page-webs/:slug`. */
export const CMS_STORE_PAGE_WEB_TAGS = [
  "cms:store-page-web",
  "cms:stores",
] as const;

export const CMS_STORE_PAGE_WEB_REVALIDATE_SECONDS = 600;

export function isStorePageWebCmsCacheTag(tag: string): boolean {
  return (CMS_STORE_PAGE_WEB_TAGS as readonly string[]).includes(tag);
}
