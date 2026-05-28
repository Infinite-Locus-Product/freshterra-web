import Link from "next/link";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

import type { HomePageDraftContent } from "@/features/cms-content/homepage";

type HomepageLayoutProps = {
  content: HomePageDraftContent;
};

export function HomepageLayout({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <main className="bg-white text-text-primary">
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
    <section className="bg-linear-to-b from-header-tint to-white pb-8 pt-6 md:pb-10 md:pt-8">
      <Container size="full" className="max-w-[1440px]">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3">
              <Logo tone="light" width={140} height={48} priority linkToHome />
              <Heading level={1} variant="h2" className="text-[28px] md:text-[40px]">
                {content.hero.eyebrow}
              </Heading>
            </div>

            <label
              className="border-gray-200 bg-white-soft flex h-12 w-full items-center gap-3 rounded-full border px-4 lg:max-w-[566px]"
              aria-label="Search products"
            >
              <span aria-hidden className="text-text-secondary text-lg">
                🔍
              </span>
              <input
                type="search"
                placeholder="Search for fresh produce, groceries, and more..."
                className="placeholder:text-text-tertiary h-full w-full bg-transparent text-sm outline-none md:text-base"
                readOnly
              />
            </label>

            <div className="bg-header-tint border-brand-100 text-brand-500 inline-flex h-12 items-center justify-center rounded-full border px-4 text-sm font-medium">
              {content.nav.locationLabel}
            </div>
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

            <Button asChild size="md" className="w-full md:w-auto">
              <Link href="/notify">{content.hero.ctaLabel}</Link>
            </Button>
          </div>
        </header>

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
  return (
    <section className="bg-white py-8 md:py-12">
      <Container size="full" className="max-w-[1440px]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <Heading level={2} variant="h2">
              {content.categories.title}
            </Heading>
            <p className="text-brand-500 font-display mt-1 text-xl italic md:text-2xl">
              {content.categories.subtitle}
            </p>
          </div>
          <Link
            href="/c/explore-catalog"
            className="text-brand-500 text-sm font-bold md:text-base"
          >
            {content.categories.ctaLabel}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
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
      <Container size="full" className="max-w-[1440px]">
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
            <Link href="/food-philosophy" className="text-brand-500 mt-2 font-bold">
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
      <Container size="full" className="max-w-[1440px]">
        <Heading level={2} variant="h2">
          {content.testimonials.title}
        </Heading>
        <p className="text-brand-500 font-display mt-1 text-xl italic md:text-2xl">
          {content.testimonials.subtitle}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {content.testimonials.items.map((item) => (
            <article
              key={item.name}
              className="from-brand-600/85 to-brand-500/75 text-white-soft flex min-h-[300px] flex-col justify-end rounded-2xl bg-linear-to-b p-5"
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
      <Container size="full" className="max-w-[1440px]">
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
            <Button asChild variant="ghost" size="md" className="border-brand-500 border">
              <Link href="/stores">{content.store.primaryCtaLabel}</Link>
            </Button>
            <Button asChild variant="ghost" size="md" className="border-brand-500 border">
              <Link href="/stores">{content.store.secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

