import type { PlpProduct, ProductCategory } from "./types";

/** Resolves the display name for a category/collection PLP from API data only. */
export function resolveListingTitle(
  slug: string,
  options: {
    category?: ProductCategory | null;
    items: readonly PlpProduct[];
  },
): string {
  if (options.category?.name?.trim()) {
    return options.category.name.trim();
  }

  const matched = options.items.find(
    (product) => product.category?.slug === slug && product.category.name,
  )?.category;
  if (matched?.name?.trim()) {
    return matched.name.trim();
  }

  const first = options.items[0]?.category;
  if (first?.name?.trim()) {
    return first.name.trim();
  }

  return "";
}
