import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  exploreCatalogBannerHeaderGapClass,
  exploreCatalogBannerImageClass,
  exploreCatalogBannerOuterClass,
  exploreCatalogBannerShellClass,
} from "@/components/category/category-explore-catalog-banner";
import {
  categoryPageCircleClass,
  categoryPageGridClass,
  categoryPageTileClass,
} from "@/components/category/category-page-tiles";
import {
  categorySectionCtaLabelClass,
  categorySectionCtaLinkClass,
  categorySectionSubtitleClass,
  categorySectionTitleClass,
} from "@/components/category/category-section-header";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import type {
  CategoryGridHero,
  CategoryGridSection,
  WebCategoryGridPage,
} from "@/features/cms-content/web-category-grid-types";

const HERO_FALLBACK_ALT = "FreshTerra categories";
const VIEW_ALL_LABEL = "View All";

/** `/categories` from Strapi `web-category-page.category_grid`. */
export function CategoryGridView({
  page,
}: Readonly<{ page: WebCategoryGridPage }>) {
  return (
    <>
      {page.hero ? <CategoryGridHeroBanner hero={page.hero} /> : null}

      {page.sections.length > 0 ? (
        <section className="bg-white pt-10 pb-8 md:pt-15 md:pb-12">
          <PageShell className="space-y-10 md:space-y-15">
            {page.sections.map((section) => (
              <CategoryGridSectionBlock key={section.key} section={section} />
            ))}
          </PageShell>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <Heading level={2} variant="h2" align="center">
            No categories yet
          </Heading>
          <p className="text-text-secondary mt-3 max-w-sm text-sm leading-relaxed">
            Categories will appear here once they’re published.
          </p>
        </div>
      )}
    </>
  );
}

function CategoryGridHeroBanner({ hero }: Readonly<{ hero: CategoryGridHero }>) {
  const alt = hero.title || HERO_FALLBACK_ALT;
  return (
    <section className="from-header-tint bg-linear-to-b to-white pt-0 pb-0">
      <div
        className={cn(
          exploreCatalogBannerShellClass,
          exploreCatalogBannerHeaderGapClass,
        )}
      >
        <div className={exploreCatalogBannerOuterClass}>
          <Image
            src={hero.imageMweb}
            alt={alt}
            fill
            priority
            className={cn(exploreCatalogBannerImageClass, "lg:hidden")}
            sizes="100vw"
          />
          <Image
            src={hero.imageWeb}
            alt={alt}
            fill
            priority
            className={cn(exploreCatalogBannerImageClass, "hidden lg:block")}
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>
      </div>
    </section>
  );
}

function CategoryGridSectionBlock({
  section,
}: Readonly<{ section: CategoryGridSection }>) {
  const headingId = `category-grid-${section.key}`;

  return (
    <section id={section.anchorId} aria-labelledby={headingId}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <h2
            id={headingId}
            className={categorySectionTitleClass}
            style={section.titleColor ? { color: section.titleColor } : undefined}
          >
            {section.title}
          </h2>
          {section.subtitle ? (
            <p
              className={cn(
                categorySectionSubtitleClass,
                !section.subtitleColor && "text-brand-500",
              )}
              style={
                section.subtitleColor
                  ? { color: section.subtitleColor }
                  : undefined
              }
            >
              {section.subtitle}
            </p>
          ) : null}
        </div>
        {section.viewAllHref ? (
          <Link
            href={section.viewAllHref}
            aria-label={`${VIEW_ALL_LABEL} ${section.title}`}
            className={categorySectionCtaLinkClass}
          >
            <span className={categorySectionCtaLabelClass}>
              {VIEW_ALL_LABEL}
            </span>
            <Image
              src="/Shape.svg"
              alt=""
              width={7}
              height={12}
              className="h-[12px] w-[6.5px]"
              aria-hidden
            />
          </Link>
        ) : null}
      </div>

      {section.tiles.length > 0 ? (
        <div className={categoryPageGridClass}>
          {section.tiles.map((tile) => (
            <HomeCategoryTile
              key={tile.key}
              name={tile.label}
              imageSrc={tile.imageSrc}
              href={tile.href}
              circleClassName={categoryPageCircleClass}
              imageSizes="(max-width: 768px) 79px, 140px"
              tileClassName={categoryPageTileClass}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
