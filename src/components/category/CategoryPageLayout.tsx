import Image from "next/image";
import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";
import { cn } from "@/lib/utils/cn";
import { slugify } from "@/lib/utils/slug";

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
import {
  homeCategoriesTileLabelClass,
  homeCategoriesViewAllTileClass,
} from "@/components/homepage/home-categories";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { PageShell } from "@/components/layout/PageShell";
import { Body } from "@/components/ui/Body";

import type { CategoryPageDraftContent } from "@/features/cms-content/category-page";

type CategoryPageLayoutProps = {
  content: CategoryPageDraftContent;
};

type CategorySectionItem =
  CategoryPageDraftContent["sections"][number]["items"][number];

export function CategoryPageLayout({
  content,
}: Readonly<CategoryPageLayoutProps>) {
  return (
    <main className="text-text-primary bg-white">
      <CategoryHeaderHeroSection content={content} />
      <CategorySections content={content} />
      <MarketingFooter />
    </main>
  );
}

function CategoryHeaderHeroSection({
  content,
}: Readonly<CategoryPageLayoutProps>) {
  return (
    <section className="from-header-tint bg-linear-to-b to-white pt-6 pb-0 md:pt-8">
      <MarketingHeader
        embedded
        taglineAs="h1"
        locationLabel={content.nav.locationLabel}
        navLinks={content.nav.links}
        downloadLabel={content.hero.ctaLabel}
      />

      <div
        className={`${exploreCatalogBannerShellClass} ${exploreCatalogBannerHeaderGapClass}`}
      >
        <div className={exploreCatalogBannerOuterClass}>
          <Image
            src={dummyImages.exploreCatalogBanner.src}
            alt={content.hero.headline}
            fill
            priority
            className={exploreCatalogBannerImageClass}
            sizes="(max-width: 1024px) 393px, (max-width: 1440px) 100vw, 1440px"
          />
        </div>
      </div>
    </section>
  );
}

function CategorySections({ content }: Readonly<CategoryPageLayoutProps>) {
  return (
    <section className="bg-white pt-21 pb-8 md:pb-12">
      <PageShell className="space-y-10 md:space-y-15">
        {content.sections.map((section) => (
          <section key={section.title} aria-labelledby={toId(section.title)}>
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <h2
                  className={categorySectionTitleClass}
                  id={toId(section.title)}
                >
                  {section.title}
                </h2>
                <p
                  className={cn(
                    categorySectionSubtitleClass,
                    section.subtitleColor,
                  )}
                >
                  {section.subtitle}
                </p>
              </div>
              <Link
                href={`/category/${slugify(section.title)}`}
                aria-label={section.ctaLabel}
                className={categorySectionCtaLinkClass}
              >
                <span className={categorySectionCtaLabelClass}>
                  {section.ctaLabel}
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
            </div>

            <div className={categoryPageGridClass}>
              {section.items.map((item: CategorySectionItem) => {
                const imageSrc = "imageSrc" in item ? item.imageSrc : undefined;
                const isViewAllTile = item.name.toLowerCase() === "view all";
                const viewAllTileClass = isViewAllTile
                  ? homeCategoriesViewAllTileClass
                  : undefined;

                if (imageSrc) {
                  // "View All" tile opens the whole section's PLP; the rest
                  // open their own sub-category PLP.
                  const tileHref = isViewAllTile
                    ? `/category/${slugify(section.title)}`
                    : `/category/${slugify(item.name)}`;
                  return (
                    <HomeCategoryTile
                      key={item.name}
                      name={item.name}
                      imageSrc={imageSrc}
                      href={tileHref}
                      circleClassName={categoryPageCircleClass}
                      imageSizes="(max-width: 768px) 79px, 140px"
                      tileClassName={categoryPageTileClass}
                      className={viewAllTileClass}
                    />
                  );
                }

                return (
                  <article
                    key={item.name}
                    className={cn(categoryPageTileClass, viewAllTileClass)}
                  >
                    <div className={categoryPageCircleClass} aria-hidden />
                    <Body size="sm" className={homeCategoriesTileLabelClass}>
                      {item.name}
                    </Body>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </PageShell>
    </section>
  );
}

function toId(value: string): string {
  return `category-section-${slugify(value)}`;
}
