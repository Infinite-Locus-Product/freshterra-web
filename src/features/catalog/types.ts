export type ProductSummary = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly packSize: string;
  /** Price in paise (1 INR = 100 paise) for integer-safe math. */
  readonly priceInPaise: number;
  readonly badge?: string;
  readonly imageToneIndex?: number;
  /** Sidebar filter checkbox tags (brand, dietary, health). */
  readonly filterTags?: readonly string[];
  /** Category chip tags (bestsellers, organic, seasonal, etc.). */
  readonly chipTags?: readonly string[];
  /** Visible pill labels on the product card (e.g. Organic, Fresh). */
  readonly displayTags?: readonly string[];
  readonly isVegetarian?: boolean;
};

export type PlpFilterOption = {
  readonly id: string;
  readonly label: string;
};

export type PlpFilterGroup = {
  readonly id: string;
  readonly label: string;
  readonly options: readonly PlpFilterOption[];
};

export type PlpBreadcrumbItem = {
  readonly label: string;
  readonly href?: string;
};

export type PlpCategoryChip = {
  readonly id: string;
  readonly label: string;
};

export type PlpHeroContent = {
  readonly headline: string;
  readonly subheadline: string;
  readonly mobileSubheadline?: string;
};

export type PlpNavContent = {
  readonly locationLabel: string;
  readonly links: readonly { readonly label: string; readonly href: string }[];
};

export type SortOptionId = "relevance" | "price-asc" | "price-desc";

export type PlpPageContent = {
  readonly slug: string;
  readonly title: string;
  readonly breadcrumbCurrent: string;
  readonly breadcrumbs: readonly PlpBreadcrumbItem[];
  readonly hero: PlpHeroContent;
  readonly categoryChips: readonly PlpCategoryChip[];
  readonly products: readonly ProductSummary[];
  readonly filterGroups: readonly PlpFilterGroup[];
  readonly nav: PlpNavContent;
  readonly heroCtaLabel: string;
  readonly pageSize?: number;
};
