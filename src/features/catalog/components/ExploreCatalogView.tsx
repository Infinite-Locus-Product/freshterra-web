"use client";

import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";
import { cn } from "@/lib/utils/cn";

import {
  exploreCatalogBannerHeaderGapClass,
  exploreCatalogBannerImageClass,
  exploreCatalogBannerOuterClass,
  exploreCatalogBannerShellClass,
} from "@/components/category/category-explore-catalog-banner";
import {
  categorySectionCtaLabelClass,
  categorySectionCtaLinkClass,
  categorySectionSubtitleClass,
  categorySectionTitleClass,
} from "@/components/category/category-section-header";
import { homeCategoriesGridClass } from "@/components/homepage/home-categories";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

import { useWebCategoryPage } from "@/features/cms-content/useWebCategoryPage";
import {
  buildExploreCatalogSections,
  collectUnresolvedCategoryIds,
} from "@/features/cms-content/web-category-page-mapper";
import type { ExploreCatalogSection } from "@/features/cms-content/web-category-page-types";

import { useCategoryMetadataMap } from "../useCategoryMetadataMap";

/**
 * Explore-catalog hub — loads `GET /api/v1/content/single/web-category-page`
 * on mount (via `/bff` in the browser). Renders `l2_category`, `l3_tiles`, hero.
 */
export function ExploreCatalogView() {
  const { page, loading, error, notFound, reload } = useWebCategoryPage();

  // CMS sends only Saleor ids — resolve every L2 heading id AND each l3_tile's
  // own `saleor_l3_category_id` (a curated pick, not always an L2 child) to
  // real names/slugs via Saleor before mapping to view sections.
  const categoryIds = useMemo(
    () => collectUnresolvedCategoryIds(page),
    [page],
  );
  const { lookup, loading: lookupLoading } = useCategoryMetadataMap({
    ids: categoryIds,
    enabled: categoryIds.length > 0,
  });

  const sections = useMemo(
    () =>
      page ? buildExploreCatalogSections(page, { categoryLookup: lookup }) : [],
    [page, lookup],
  );

  const heroImage =
    page?.hero?.imageWeb?.trim() ||
    page?.hero?.imageMweb?.trim() ||
    dummyImages.exploreCatalogBanner.src;
  const heroTitle =
    page?.hero?.title?.trim() || "Five Star Quality @ WOW Prices";

  if (notFound) {
    return (
      <Centered
        title="Page not found"
        body="The explore-catalog content is not published yet."
        action={
          <Button caps={false} onClick={reload}>
            Try Again
          </Button>
        }
      />
    );
  }

  if (error && !page) {
    return (
      <Centered
        title="Something went wrong"
        body="We couldn’t load categories right now. Please try again."
        action={
          <Button caps={false} onClick={reload}>
            Try Again
          </Button>
        }
      />
    );
  }

  if ((loading && !page) || (lookupLoading && sections.length === 0)) {
    return <ExploreCatalogSkeleton />;
  }

  if (sections.length === 0) {
    return (
      <Centered
        title="No categories yet"
        body="Categories will appear here once the BFF returns populated l2_category and l3_tiles from web-category-page."
      />
    );
  }

  return (
    <>
      <section className="from-header-tint bg-linear-to-b to-white pt-0 pb-0">
        <div
          className={`${exploreCatalogBannerShellClass} ${exploreCatalogBannerHeaderGapClass}`}
        >
          <div className={exploreCatalogBannerOuterClass}>
            <Image
              src={heroImage}
              alt={heroTitle}
              fill
              priority
              className={exploreCatalogBannerImageClass}
              sizes="(max-width: 1024px) 393px, (max-width: 1440px) 100vw, 1440px"
            />
          </div>
        </div>
      </section>

      <section className="bg-white pt-10 pb-8 md:pt-15 md:pb-12">
        <PageShell className="space-y-10 md:space-y-15">
          {sections.map((section) => (
            <ExploreCatalogSectionBlock key={section.key} section={section} />
          ))}
        </PageShell>
      </section>
    </>
  );
}

function ExploreCatalogSkeleton() {
  return (
    <PageShell className="py-16">
      <div className="mb-10 h-[422px] max-w-[1440px] animate-pulse rounded-2xl bg-gray-100" />
      <div className="space-y-10">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={`explore-skeleton-${i}`} className="space-y-5">
            <div className="h-10 w-64 animate-pulse rounded bg-gray-100" />
            <div className={homeCategoriesGridClass}>
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={`explore-tile-skeleton-${i}-${j}`}
                  className="flex w-[74.94px] flex-col items-center gap-3 p-0 md:w-auto md:p-2"
                  >
                  <div className="h-[74px] w-[74.94px] animate-pulse rounded-[100px] bg-gray-100 md:size-[140px] md:rounded-full" />
                  <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function ExploreCatalogSectionBlock({
  section,
}: Readonly<{ section: ExploreCatalogSection }>) {
  const sectionId = `explore-section-${section.slug}`;

  return (
    <section aria-labelledby={sectionId}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2 className={categorySectionTitleClass} id={sectionId}>
            {section.title}
          </h2>
          {section.tagline ? (
            <p className={cn(categorySectionSubtitleClass, section.subtitleColor)}>
              {section.tagline}
            </p>
          ) : null}
        </div>
        <Link
          href={`/category/${section.slug}`}
          aria-label={section.ctaLabel}
          className={categorySectionCtaLinkClass}
        >
          <span className={categorySectionCtaLabelClass}>{section.ctaLabel}</span>
          <Image
            src="/Shape.svg"
            alt=""
            width={7}
            height={12}
            className="h-[12px] w-[6.5px]"
            aria-hidden
          />
        </Link>
      </div>

      <div className={homeCategoriesGridClass}>
        {section.tiles.map((tile) => (
          <HomeCategoryTile
            key={tile.key}
            name={tile.name}
            imageSrc={tile.imageSrc}
            href={tile.href}
          />
        ))}
      </div>
    </section>
  );
}

function Centered({
  title,
  body,
  action,
}: Readonly<{
  title: string;
  body: string;
  action?: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <Heading level={1} variant="h2" align="center">
        {title}
      </Heading>
      <p className="text-text-secondary mt-3 max-w-sm text-sm leading-relaxed">
        {body}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default ExploreCatalogView;
