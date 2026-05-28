import Link from "next/link";

import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

import type { CategoryPageDraftContent } from "@/features/cms-content/category-page";

type CategoryPageLayoutProps = {
  content: CategoryPageDraftContent;
};

export function CategoryPageLayout({
  content,
}: Readonly<CategoryPageLayoutProps>) {
  return (
    <main className="bg-white text-text-primary">
      <CategoryHeader content={content} />
      <CategoryHero content={content} />
      <CategorySections content={content} />
      <MarketingFooter />
    </main>
  );
}

function CategoryHeader({ content }: Readonly<CategoryPageLayoutProps>) {
  return (
    <section className="bg-linear-to-b from-header-tint to-white pb-6 pt-6 md:pt-8">
      <Container size="full" className="max-w-[1440px]">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <Logo tone="light" width={140} height={48} priority linkToHome />
              <Heading level={1} variant="h2" className="text-[28px] md:text-[40px]">
                Fresh. Wholesome. Gourmet.
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
      </Container>
    </section>
  );
}

function CategoryHero({ content }: Readonly<CategoryPageLayoutProps>) {
  return (
    <section className="bg-white">
      <Container size="full" className="max-w-[1440px]">
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
      <Container size="full" className="max-w-[1440px] space-y-10 md:space-y-14">
        {content.sections.map((section) => (
          <section key={section.title} aria-labelledby={toId(section.title)}>
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <Heading
                  level={2}
                  variant="h2"
                  className="text-[32px] leading-tight md:text-[40px]"
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
                className="text-brand-500 text-sm font-bold md:text-base"
              >
                {section.ctaLabel}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {section.items.map((item) => (
                <article
                  key={item}
                  className="flex flex-col items-center gap-3 rounded-md p-2 text-center"
                >
                  <div className="from-brand-100/80 to-cream-50 size-[84px] rounded-full bg-linear-to-b md:size-[110px]" />
                  <Body size="sm" className="font-medium">
                    {item}
                  </Body>
                </article>
              ))}
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
