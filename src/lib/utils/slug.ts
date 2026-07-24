/**
 * Converts a human-readable label into a URL-safe slug.
 *
 * Used to derive category PLP routes (`/category/<slug>`) from display names
 * when the CMS payload doesn't carry an explicit slug. Lowercases, replaces
 * any run of non-alphanumerics with a single hyphen, and trims edge hyphens.
 *
 * @example slugify("Dairy, Bread & Eggs") // "dairy-bread-eggs"
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Converts a URL slug back into a display label.
 *
 * @example slugToTitle("fresh-fruits") // "Fresh Fruits"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
