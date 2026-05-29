import type { ProductSummary, SortOptionId } from "./types";

export const ALL_CATEGORY_CHIP_ID = "all" as const;

export function sortProducts(
  products: readonly ProductSummary[],
  sortBy: SortOptionId,
): ProductSummary[] {
  const copy = [...products];

  switch (sortBy) {
    case "price-asc":
      return copy.sort((a, b) => a.priceInPaise - b.priceInPaise);
    case "price-desc":
      return copy.sort((a, b) => b.priceInPaise - a.priceInPaise);
    case "relevance":
    default:
      return copy;
  }
}

export function filterProducts(
  products: readonly ProductSummary[],
  activeFilterIds: ReadonlySet<string>,
  activeCategoryChipId: string = ALL_CATEGORY_CHIP_ID,
): ProductSummary[] {
  let result = [...products];

  if (activeCategoryChipId !== ALL_CATEGORY_CHIP_ID) {
    result = result.filter((product) =>
      (product.chipTags ?? []).includes(activeCategoryChipId),
    );
  }

  if (activeFilterIds.size === 0) {
    return result;
  }

  return result.filter((product) => {
    const tags = product.filterTags ?? [];
    return [...activeFilterIds].every((filterId) => tags.includes(filterId));
  });
}

export function paginateProducts<T>(
  products: readonly T[],
  page: number,
  pageSize: number,
): { items: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: products.slice(start, start + pageSize),
    totalPages,
  };
}

export function resolveFilterLabel(
  filterGroups: readonly {
    options: readonly { id: string; label: string }[];
  }[],
  filterId: string,
): string {
  for (const group of filterGroups) {
    const match = group.options.find((option) => option.id === filterId);
    if (match) {
      return match.label;
    }
  }
  return filterId;
}
