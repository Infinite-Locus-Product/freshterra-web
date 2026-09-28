/**
 * Shared tolerant readers for raw Strapi/BFF records. CMS payloads carry the
 * same field under several aliases (camelCase, snake_case, misspellings), so
 * readers take a list of keys and return the first non-blank value.
 */

/** First non-blank string among `keys`, trimmed; `""` when none is set. */
export function readCmsString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

/** `basmati-rice` → `Basmati Rice`. */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
