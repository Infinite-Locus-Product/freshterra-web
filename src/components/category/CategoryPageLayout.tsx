import Image from "next/image";
import Link from "next/link";

import {
  exploreCatalogBannerImageClass,
  exploreCatalogBannerOuterClass,
  exploreCatalogBannerShellClass,
} from "@/components/category/category-explore-catalog-banner";
import { Body } from "@/components/ui/Body";
import { Container } from "@/components/ui/Container";
import { BrandTagline } from "@/components/ui/BrandTagline";
import { HeaderDownloadAppButton } from "@/components/ui/HeaderDownloadAppButton";
import { HeaderLocationBadge } from "@/components/ui/HeaderLocationBadge";
import { HeaderSearchBar } from "@/components/ui/HeaderSearchBar";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";
import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import {
  homeCategoriesCircleClass,
} from "@/components/homepage/home-categories";

import {
  HEADER_EDGE_PADDING_CLASS,
  HEADER_TO_HERO_GAP_CLASS,
} from "@/components/layout/header-chrome";

import type { CategoryPageDraftContent } from "@/features/cms-content/category-page";
import { dummyImages } from "@/lib/dummy-images";

type CategoryPageLayoutProps = {
  content: CategoryPageDraftContent;
};

type CategorySectionItem = CategoryPageDraftContent["sections"][number]["items"][number];

export function CategoryPageLayout({
  content,
}: Readonly<CategoryPageLayoutProps>) {
  return (
    <main className="bg-white text-text-primary">
      <CategoryHeaderHeroSection content={content} />
      <CategorySections content={content} />
      <MarketingFooter />
    </main>
  );
}

function CategoryHeaderHeroSection({ content }: Readonly<CategoryPageLayoutProps>) {
  return (
    <section className="bg-linear-to-b from-header-tint to-white pb-0 pt-6 md:pt-8">
      <div className={`mx-auto w-full max-w-[1440px] ${HEADER_EDGE_PADDING_CLASS}`}>
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <Logo tone="light" variant="header" priority linkToHome />
              <BrandTagline as="h1" />
            </div>

            <HeaderSearchBar />

            <HeaderLocationBadge>{content.nav.locationLabel}</HeaderLocationBadge>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Primary"
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {content.nav.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium tracking-wide uppercase hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <HeaderDownloadAppButton href="/notify">
              {content.hero.ctaLabel}
            </HeaderDownloadAppButton>
          </div>
        </header>
      </div>

      <div className={`${exploreCatalogBannerShellClass} ${HEADER_TO_HERO_GAP_CLASS}`}>
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
      <Container size="full" className="max-w-[1440px] space-y-10 md:space-y-15">
        {content.sections.map((section) => (
          <section key={section.title} aria-labelledby={toId(section.title)}>
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <Heading
                  level={2}
                  variant="h2"
                  className="text-[32px] leading-tight md:text-[36px]"
                  id={toId(section.title)}
                >
                  {section.title}
                </Heading>
                <p className={`font-handsome ${section.subtitleColor} mt-1 text-[30px] leading-[26px] font-bold tracking-normal not-italic`}>
                  {section.subtitle}
                </p>
              </div>
              <Link
                href={`/c/${toSlug(section.title)}`}
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

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {section.items.map((item: CategorySectionItem) => {
                const imageSrc = "imageSrc" in item ? item.imageSrc : undefined;

                if (imageSrc) {
                  return (
                    <HomeCategoryTile
                      key={item.name}
                      name={item.name}
                      imageSrc={imageSrc}
                      labelClassName="text-[20px] text-black font-medium"
                    />
                  );
                }

                return (
                  <article
                    key={item.name}
                    className="flex flex-col items-center gap-3 rounded-md p-2 text-center"
                  >
                    <div className={homeCategoriesCircleClass} aria-hidden />
                    <Body size="sm" className="text-[20px] text-black font-medium">
                      {item.name}
                    </Body>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </Container>
    </section>
  );
}

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function toId(value: string): string {
  return `category-section-${toSlug(value)}`;
}
