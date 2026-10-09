/** `/categories` view model from `category_grid` (app-only fields skipped). */

export type CategoryGridTile = Readonly<{
  key: string;
  label: string;
  imageSrc?: string;
  href?: string;
}>;

export type CategoryGridSection = Readonly<{
  key: string;
  title: string;
  subtitle: string;
  /** Validated `#rgb` / `#rrggbb` from CMS; unset → design default. */
  titleColor?: string;
  subtitleColor?: string;
  /** Validated slug-like id for in-page links (`/categories#pantry`). */
  anchorId?: string;
  /** Present only when CMS enables View All and gives it a target. */
  viewAllHref?: string;
  tiles: readonly CategoryGridTile[];
}>;

export type CategoryGridHero = Readonly<{
  title: string;
  imageWeb: string;
  imageMweb: string;
}>;

export type WebCategoryGridPage = Readonly<{
  /** False for legacy `l2_category` (staging) → `ExploreCatalogView`. */
  hasCategoryGrid: boolean;
  hero?: CategoryGridHero;
  sections: readonly CategoryGridSection[];
  /** Raw Strapi `seo` component, read with `readCmsSeo`. */
  seo?: unknown;
}>;
