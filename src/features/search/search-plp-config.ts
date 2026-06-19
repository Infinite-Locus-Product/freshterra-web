import type { PlpFilterGroup } from "@/features/catalog/components/PlpFilters";
import type { SortOption } from "@/features/catalog/components/PlpSortMenu";

import type { SearchSort } from "./types";

export const SEARCH_SORT_OPTIONS: SortOption<SearchSort>[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

/**
 * Placeholder facet groups until the SRP API drives filters from `data.facets`.
 * Shape matches category PLP filter groups for shared `PlpFilters` UI.
 */
export const SEARCH_FILTER_GROUPS: PlpFilterGroup[] = [
  {
    key: "brand",
    label: "Brand",
    options: [
      { value: "brand-a", label: "Brand A" },
      { value: "brand-b", label: "Brand B" },
      { value: "brand-c", label: "Brand C" },
    ],
  },
  {
    key: "dietary",
    label: "Dietary",
    options: [
      { value: "organic", label: "Organic" },
      { value: "vegan", label: "Vegan" },
      { value: "gluten-free", label: "Gluten-free" },
    ],
  },
  {
    key: "healthTags",
    label: "Health Tags",
    options: [
      { value: "high-protein", label: "High Protein" },
      { value: "low-carb", label: "Low Carb" },
      { value: "sugar-free", label: "Sugar-free" },
    ],
  },
];
