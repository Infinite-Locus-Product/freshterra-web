"use client";

import Link from "next/link";

import {
  homeCategoriesCircleClass,
  homeCategoriesSubtitleClass,
  homeCategoriesTitleClass,
} from "@/components/homepage/home-categories";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { PageShell } from "@/components/layout/PageShell";

import { useCategoriesContent } from "@/features/cms-content/useCategoriesContent";

import type { HomePageDraftContent } from "@/features/cms-content/homepage";

type HomeCategoriesSectionProps = Readonly<{
  /** Fallback section labels when the BFF entry has no title/subtitle/cta. */
  fallback: HomePageDraftContent["categories"];
}>;

function categoryHref(slug: string, name: string): string {
  const normalized = slug.trim().toLowerCase();
  const label = name.trim().toLowerCase();
  if (normalized === "view-all" || label === "view all") {
    return "/c/explore-catalog";
  }
  return `/category/${slug}`;
}

function categoryImage(
  item: { image?: string; imageUrl?: string },
): string | undefined {
  const src = item.imageUrl?.trim() || item.image?.trim();
  return src && src.length > 0 ? src : undefined;
}

/**
 * Homepage category rail — tiles from BFF `GET /content/single/categories`
 * (Saleor slugs mapped in Strapi). No local dummy category list.
 */
export function HomeCategoriesSection({ fallback }: HomeCategoriesSectionProps) {
  const { entry, loading, error } = useCategoriesContent();
  const categories = entry?.categories ?? [];

  const title = entry?.title?.trim() || fallback.title;
  const subtitle = entry?.subtitle?.trim() || fallback.subtitle;
  const ctaLabel = entry?.ctaLabel?.trim() || fallback.ctaLabel;

  if (!loading && categories.length === 0 && error) {
    return null;
  }

  return (
    <section className="bg-white pt-8 pb-0 md:pt-12">
      <PageShell>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className={homeCategoriesTitleClass}>{title}</h2>
            <p
              className={homeCategoriesSubtitleClass}
              style={{ letterSpacing: "0px" }}
            >
              {subtitle}
            </p>
          </div>
          <Link
            href="/c/explore-catalog"
            className="text-brand-500 inline-flex items-center gap-1.5 text-sm font-bold md:text-base"
          >
            {ctaLabel}
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
          </Link>
        </div>

        {loading && categories.length === 0 ? (
          <div
            className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
            aria-busy
            aria-label="Loading categories"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`home-cat-skeleton-${i}`}
                className="flex flex-col items-center gap-3 p-2"
              >
                <div
                  className={`${homeCategoriesCircleClass} animate-pulse bg-gray-100`}
                />
                <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {categories.map((item) => (
              <HomeCategoryTile
                key={item.slug}
                name={item.name}
                imageSrc={categoryImage(item)}
                labelClassName="font-medium text-[20px]"
                href={categoryHref(item.slug, item.name)}
              />
            ))}
          </div>
        ) : null}
      </PageShell>
    </section>
  );
}
