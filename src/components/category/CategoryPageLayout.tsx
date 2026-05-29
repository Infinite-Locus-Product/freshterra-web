import Link from "next/link";

import {
  CategoryItemCard,
  chunkItems,
} from "@/components/catalog/CategoryItemCard";
import { HorizontalScrollRail } from "@/components/catalog/HorizontalScrollRail";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Body } from "@/components/ui/Body";
import { Container } from "@/components/ui/Container";
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
      <CategoryHeader content={content} />
      <CategoryHero content={content} />
      <CategorySections content={content} />
      <MarketingFooter />
    </main>
  );
}

function CategoryHeader({ content }: Readonly<CategoryPageLayoutProps>) {
  return (
    <MarketingHeader
      locationLabel={content.nav.locationLabel}
      links={content.nav.links}
      ctaLabel={content.hero.ctaLabel}
    />
  );
}

function CategoryHero({ content }: Readonly<CategoryPageLayoutProps>) {
  return (
    <section className="bg-white">
      <Container size="full" className="max-w-[1440px] max-lg:px-4">
        <div className="from-brand-600 to-brand-500 relative overflow-hidden rounded-[12px] bg-linear-to-r px-6 py-12 md:px-10 md:py-16">
          <div className="max-w-xl">
            <p className="text-beige-100 font-display text-4xl leading-tight italic md:text-6xl">
              {content.hero.headline}
            </p>
          </div>
          <div
            aria-hidden
            className="bg-brand-100/20 absolute -right-10 -bottom-12 size-56 rounded-full md:size-72"
          />
          <div
            aria-hidden
            className="bg-brand-100/15 absolute right-24 -bottom-20 size-44 rounded-full md:size-56"
          />
        </div>
      </Container>
    </section>
  );
}

function CategorySections({ content }: Readonly<CategoryPageLayoutProps>) {
  return (
    <section className="bg-white py-8 md:py-12">
      <Container
        size="full"
        className="max-w-[1440px] space-y-10 max-lg:px-4 md:space-y-14"
      >
        {content.sections.map((section) => {
          const sectionItems = section.items as readonly CategorySectionItem[];

          return (
            <section key={section.title} aria-labelledby={toId(section.title)}>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div>
                  <Heading
                    level={2}
                    variant="h2"
                    className="text-[32px] leading-tight max-lg:text-xl max-lg:leading-[1.3] max-lg:font-semibold md:text-[40px]"
                    id={toId(section.title)}
                  >
                    {section.title}
                  </Heading>
                  <p className="text-brand-500 font-display mt-1 text-xl italic md:text-2xl">
                    {section.subtitle}
                  </p>
                </div>
                <Link
                  href={`/c/${toSlug(section.title)}`}
                  className="text-brand-500 inline-flex size-6 shrink-0 items-center justify-center rounded-full lg:hidden"
                  aria-label={section.ctaLabel}
                >
                  <ChevronRightIcon />
                </Link>
                <Link
                  href={`/c/${toSlug(section.title)}`}
                  className="text-brand-500 hidden text-sm font-bold md:text-base lg:inline"
                >
                  {section.ctaLabel}
                </Link>
              </div>

              <div className="flex flex-col gap-4 lg:hidden">
                {chunkItems(sectionItems, 4).map((row, rowIndex) => (
                  <HorizontalScrollRail
                    key={`${section.title}-${row.map((item) => item.name).join("-")}`}
                    ariaLabel={`${section.title} row ${rowIndex + 1}`}
                  >
                    {row.map((item, itemIndex) => (
                      <CategoryItemCard
                        key={item.name}
                        name={item.name}
                        toneIndex={rowIndex * 4 + itemIndex}
                      />
                    ))}
                  </HorizontalScrollRail>
                ))}
              </div>

              <div className="hidden grid-cols-2 gap-4 sm:grid-cols-4 lg:grid lg:grid-cols-8">
                {sectionItems.map((item) => (
                  <article
                    key={item.name}
                    className="flex flex-col items-center gap-3 rounded-md p-2 text-center"
                  >
                    <div className="from-brand-100/80 to-cream-50 size-[84px] rounded-full bg-linear-to-b md:size-[110px]" />
                    <Body size="sm" className="font-medium">
                      {item.name}
                    </Body>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </Container>
    </section>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function toId(value: string): string {
  return `category-section-${toSlug(value)}`;
}
