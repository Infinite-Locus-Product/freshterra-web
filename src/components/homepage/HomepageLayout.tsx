import Link from "next/link";

import {
  CategoryItemCard,
  chunkItems,
} from "@/components/catalog/CategoryItemCard";
import { HorizontalScrollRail } from "@/components/catalog/HorizontalScrollRail";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

import type { HomePageDraftContent } from "@/features/cms-content/homepage";

type HomepageLayoutProps = {
  content: HomePageDraftContent;
};

export function HomepageLayout({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <main className="text-text-primary bg-white">
      <HeroHeaderSection content={content} />
      <CategoriesSection content={content} />
      <SourcingSection content={content} />
      <TestimonialsSection content={content} />
      <StoreSection content={content} />
      <MarketingFooter />
    </main>
  );
}

function HeroHeaderSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="lg:from-header-tint bg-white pb-8 max-lg:pb-8 lg:bg-linear-to-b lg:to-white lg:pt-8 lg:pb-10">
      <MarketingHeader
        eyebrow={content.hero.eyebrow}
        locationLabel={content.nav.locationLabel}
        links={content.nav.links}
        ctaLabel={content.hero.ctaLabel}
      />

      {/* mWeb hero — Figma 901:6686 */}
      <div className="mt-3 px-4 lg:hidden">
        <div className="from-brand-100 to-brand-100/40 relative h-[265px] overflow-hidden rounded-[10px] bg-linear-to-b">
          <p className="text-brand-900 font-display absolute top-[11px] left-1/2 z-10 w-[min(336px,90%)] -translate-x-1/2 text-center text-[36px] leading-[30px] italic">
            {content.hero.headline}
          </p>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(238,251,239,0.9)] via-[rgba(238,251,239,0.45)] to-transparent"
          />
          <div
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2"
            aria-hidden
          >
            {[0, 1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={`size-2 rounded-full ${dot === 0 ? "bg-brand-500" : "bg-white-soft"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop hero */}
      <Container size="full" className="hidden max-w-[1440px] lg:block">
        <div className="from-brand-100 to-brand-100/40 mt-8 rounded-[20px] bg-linear-to-b p-6 md:mt-10 md:p-12">
          <div className="bg-brand-300/15 border-brand-100 rounded-[16px] border p-6 md:p-10">
            <p className="text-brand-500 font-display text-3xl leading-tight italic md:text-5xl">
              {content.hero.headline}
            </p>
            <div className="mt-6 flex items-center gap-2" aria-hidden>
              {[0, 1, 2, 3, 4].map((dot) => (
                <span
                  key={dot}
                  className={`size-2 rounded-full ${dot === 0 ? "bg-brand-500" : "bg-white-soft"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CategoriesSection({ content }: Readonly<HomepageLayoutProps>) {
  const categoryRows = chunkItems(content.categories.items, 4);

  return (
    <section className="bg-white py-[18px] lg:py-12">
      <Container size="full" className="max-w-[1440px] max-lg:px-4">
        <div className="mb-3.5 flex items-center justify-between gap-4 lg:mb-6 lg:items-end">
          <div>
            <Heading
              level={2}
              variant="h2"
              className="max-lg:text-xl max-lg:leading-[1.3] max-lg:font-semibold"
            >
              {content.categories.title}
            </Heading>
            <p className="text-brand-500 font-display mt-1 text-xl italic md:text-2xl">
              {content.categories.subtitle}
            </p>
          </div>
          <Link
            href="/c/explore-catalog"
            className="text-brand-500 inline-flex size-6 shrink-0 items-center justify-center rounded-full lg:hidden"
            aria-label={content.categories.ctaLabel}
          >
            <ChevronRightIcon />
          </Link>
          <Link
            href="/c/explore-catalog"
            className="text-brand-500 hidden text-sm font-bold md:text-base lg:inline"
          >
            {content.categories.ctaLabel}
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:hidden">
          {categoryRows.map((row, rowIndex) => (
            <HorizontalScrollRail
              key={row.map((item) => item.name).join("-")}
              ariaLabel={`${content.categories.title} row ${rowIndex + 1}`}
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

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 xl:grid-cols-8">
          {content.categories.items.map((item) => (
            <article
              key={item.name}
              className="flex flex-col items-center gap-3 rounded-md p-2 text-center"
            >
              <div className="from-brand-100 to-cream-50 size-[84px] rounded-full bg-linear-to-b md:size-[110px]" />
              <Body size="sm" className="font-medium">
                {item.name}
              </Body>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function SourcingSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-brand-100/40 py-10 md:py-14">
      <Container size="full" className="max-w-[1440px] max-lg:px-4">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col gap-4">
            <Heading level={2} variant="h2" className="text-brand-500">
              {content.sourcing.title}
            </Heading>
            {content.sourcing.paragraphs.map((paragraph) => (
              <Body key={paragraph} size="md" className="text-text-primary/90">
                {paragraph}
              </Body>
            ))}
            <Link
              href="/food-philosophy"
              className="text-brand-500 mt-2 font-bold"
            >
              {content.sourcing.ctaLabel}
            </Link>
          </div>
          <div className="from-brand-300/25 to-brand-600/35 min-h-[240px] rounded-2xl bg-linear-to-tr p-6 md:min-h-[340px]">
            <div className="flex h-full items-start justify-end">
              <p className="text-cream-50 font-display max-w-[260px] text-right text-2xl italic md:text-4xl">
                Fresh, Wholesome & Gourmet
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TestimonialsSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-white py-10 md:py-14">
      <Container size="full" className="max-w-[1440px] max-lg:px-4">
        <Heading level={2} variant="h2">
          {content.testimonials.title}
        </Heading>
        <p className="text-brand-500 font-display mt-1 text-xl italic md:text-2xl">
          {content.testimonials.subtitle}
        </p>

        <div className="mt-6 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0 xl:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {content.testimonials.items.map((item) => (
            <article
              key={item.name}
              className="from-brand-600/85 to-brand-500/75 text-white-soft flex min-h-[300px] min-w-[85%] shrink-0 snap-start flex-col justify-end rounded-2xl bg-linear-to-b p-5 max-lg:min-w-[85%] lg:min-w-0"
            >
              <h3 className="font-display text-2xl">{item.name}</h3>
              <p className="text-white-soft/90 mt-1 text-sm">{item.ageLabel}</p>
              <p className="mt-3 text-sm leading-6">{`"${item.quote}"`}</p>
              <Button
                variant="onImage"
                size="sm"
                className="mt-4 w-fit border border-white/30"
                aria-label={`Play testimonial from ${item.name}`}
              >
                Play
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StoreSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-white py-10 md:py-14">
      <Container size="full" className="max-w-[1440px] max-lg:px-4">
        <Heading level={2} variant="h2" className="mb-6">
          {content.store.title}
        </Heading>

        <div className="from-text-primary/15 to-text-primary/35 min-h-[260px] rounded-2xl bg-linear-to-tr md:min-h-[420px]" />

        <div className="mt-6 max-w-xl">
          <h3 className="font-sans text-xl font-bold">{content.store.name}</h3>
          <Body size="md" className="text-text-secondary mt-2">
            {content.store.addressLine1}
          </Body>
          <Body size="md" className="text-text-secondary">
            {content.store.addressLine2}
          </Body>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              variant="ghost"
              size="md"
              className="border-brand-500 border"
            >
              <Link href="/stores">{content.store.primaryCtaLabel}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="md"
              className="border-brand-500 border"
            >
              <Link href="/stores">{content.store.secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
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
