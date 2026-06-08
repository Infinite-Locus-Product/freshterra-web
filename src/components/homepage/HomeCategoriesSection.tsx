"use client";

import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";

import {
  homeCategoriesCircleClass,
  homeCategoriesCtaLabelClass,
  homeCategoriesCtaLinkClass,
  homeCategoriesGridClass,
  homeCategoriesHeaderRowClass,
  homeCategoriesSectionClass,
  homeCategoriesSubtitleClass,
  homeCategoriesTitleClass,
  homeCategoriesViewAllTileClass,
} from "@/components/homepage/home-categories";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { PageShell } from "@/components/layout/PageShell";

import { useHomeCategories } from "@/features/catalog/useHomeCategories";
import type { HomePageDraftContent } from "@/features/cms-content/homepage";

type HomeCategoriesSectionProps = Readonly<{
  /** Section labels (title/subtitle/cta) — Saleor supplies the tiles. */
  fallback: HomePageDraftContent["categories"];
}>;

/**
 * Tile imagery by Saleor slug. Saleor categories carry no `backgroundImage`
 * yet, so these local assets stand in until CMS/Saleor media is wired.
 */
const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  "fruits-vegetables": dummyImages.categories.fruitsVegetables,
  "dairy-breads-eggs": dummyImages.categories.dairyBreadEggs,
  "snacks-and-munchies": dummyImages.categories.snacks,
};

function tileImage(slug: string, imageUrl?: string): string | undefined {
  return imageUrl?.trim() || CATEGORY_IMAGE_BY_SLUG[slug];
}

function CategoriesChevronIcon() {
  return (
    <svg
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M0.145817 0.147077C0.340731 -0.0485327 0.657313 -0.0490966 0.852923 0.145817L6.33741 5.6108C6.55312 5.82574 6.55312 6.17505 6.33741 6.39L0.852923 11.855C0.657313 12.0499 0.340731 12.0493 0.145817 11.8537C-0.0490966 11.6581 -0.0485327 11.3415 0.147077 11.1466L5.31166 6.0004L0.147077 0.854183C-0.0485327 0.659268 -0.0490966 0.342687 0.145817 0.147077Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Homepage category rail — all top-level categories configured in Saleor
 * (`GET /api/catalog/categories`), plus a trailing "View All" tile on desktop.
 */
export function HomeCategoriesSection({
  fallback,
}: HomeCategoriesSectionProps) {
  const { categories, loading } = useHomeCategories();

  const { title, subtitle, ctaLabel } = fallback;

  return (
    <section className={homeCategoriesSectionClass}>
      <PageShell>
        <div className={homeCategoriesHeaderRowClass}>
          <div>
            <h2 className={homeCategoriesTitleClass}>{title}</h2>
            <p className={homeCategoriesSubtitleClass}>{subtitle}</p>
          </div>
          <Link
            href="/c/explore-catalog"
            aria-label={ctaLabel}
            className={homeCategoriesCtaLinkClass}
          >
            <span className={homeCategoriesCtaLabelClass}>{ctaLabel}</span>
            <CategoriesChevronIcon />
          </Link>
        </div>

        {loading && categories.length === 0 ? (
          <div className={homeCategoriesGridClass} aria-busy aria-label="Loading categories">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`home-cat-skeleton-${i}`}
                className="flex w-[78.4px] flex-col items-center gap-3 p-0 md:w-auto md:p-2"
              >
                <div
                  className={`${homeCategoriesCircleClass} animate-pulse bg-gray-100`}
                />
                <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <div className={homeCategoriesGridClass}>
            {categories.map((category) => (
              <HomeCategoryTile
                key={category.id}
                name={category.name}
                imageSrc={tileImage(category.slug, category.imageUrl)}
                href={`/category/${category.slug}`}
              />
            ))}
            <HomeCategoryTile
              name="View All"
              imageSrc={dummyImages.categories.viewAll}
              className={homeCategoriesViewAllTileClass}
              href="/c/explore-catalog"
            />
          </div>
        )}
      </PageShell>
    </section>
  );
}
