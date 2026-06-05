import Image from "next/image";
import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";
import { slugify } from "@/lib/utils/slug";

import {
  exploreCatalogBannerImageClass,
  exploreCatalogBannerOuterClass,
  exploreCatalogBannerShellClass,
} from "@/components/category/category-explore-catalog-banner";
import { homeCategoriesCircleClass } from "@/components/homepage/home-categories";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { HEADER_TO_HERO_GAP_CLASS } from "@/components/layout/header-chrome";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { PageShell } from "@/components/layout/PageShell";
import { Body } from "@/components/ui/Body";
import { Heading } from "@/components/ui/Heading";

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
        className={`${exploreCatalogBannerShellClass} ${HEADER_TO_HERO_GAP_CLASS}`}
      >
        <div className={exploreCatalogBannerOuterClass}>
          <Image
            src={dummyImages.exploreCatalogBanner.src}
            alt={content.hero.headline}
            fill
            priority
            className={exploreCatalogBannerImageClass}
            sizes="(max-width: 1440px) 100vw, 1440px"
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
                <Heading
                  level={2}
                  variant="h2"
                  className="text-[2rem] leading-tight md:text-[2.25rem]"
                  id={toId(section.title)}
                >
                  {section.title}
                </Heading>
                <p
                  className={`font-handsome ${section.subtitleColor} mt-1 text-[1.875rem] leading-[1.625rem] font-bold tracking-normal not-italic`}
                >
                  {section.subtitle}
                </p>
              </div>
              <Link
                href={`/category/${slugify(section.title)}`}
                className="text-brand-500 inline-flex items-center gap-2 text-sm font-bold md:text-base"
              >
                {section.ctaLabel}
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

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {section.items.map((item: CategorySectionItem) => {
                const imageSrc = "imageSrc" in item ? item.imageSrc : undefined;

                if (imageSrc) {
                  // "View All" tile opens the whole section's PLP; the rest
                  // open their own sub-category PLP.
                  const tileHref =
                    item.name.toLowerCase() === "view all"
                      ? `/category/${slugify(section.title)}`
                      : `/category/${slugify(item.name)}`;
                  return (
                    <HomeCategoryTile
                      key={item.name}
                      name={item.name}
                      imageSrc={imageSrc}
                      href={tileHref}
                      labelClassName="text-[1.25rem] font-medium text-black"
                    />
                  );
                }

                return (
                  <article
                    key={item.name}
                    className="flex flex-col items-center gap-3 rounded-md p-2 text-center"
                  >
                    <div className={homeCategoriesCircleClass} aria-hidden />
                    <Body
                      size="sm"
                      className="text-[1.25rem] font-medium text-black"
                    >
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
