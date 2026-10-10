/** Category PLP / L2 landing route. `/c/{slug}` 308s here via next.config.ts. */
export const CATEGORY_ROUTE_PREFIX = "/category";

/** Explore-catalog hub (Strapi `web-category-page.page_slug`). */
export const CATEGORIES_PATH = "/categories";

/** `/category/{slug}[?query]` — use for every internal category link. */
export function categoryPageHref(
  slug: string,
  query?: URLSearchParams | string,
): string {
  const path = `${CATEGORY_ROUTE_PREFIX}/${encodeURIComponent(slug.trim())}`;
  const search = query?.toString() ?? "";
  return search ? `${path}?${search}` : path;
}
