import Link from "next/link";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

import type { StoresPageDraftContent } from "@/features/cms-content/stores";

type StoresPageLayoutProps = {
  content: StoresPageDraftContent;
};

export function StoresPageLayout({ content }: Readonly<StoresPageLayoutProps>) {
  return (
    <main className="bg-white text-text-primary">
      <MarketingHeader />

      <section className="py-8 md:py-10">
        <Container size="full" className="max-w-[1440px]">
          <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span aria-hidden>›</span>
            <span className="text-text-primary">{content.breadcrumbLabel}</span>
          </div>

          <Heading level={1} variant="h2" className="mb-6">
            {content.store.title}
          </Heading>

          <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="from-text-primary/20 to-text-primary/45 min-h-[260px] rounded-[10px] bg-linear-to-tr md:min-h-[460px]" />
            <StoreInfoCard content={content} />
          </div>

          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="from-brand-100/50 to-brand-300/30 min-h-[220px] rounded-[10px] bg-linear-to-tr md:min-h-[340px]" />
            <div className="from-text-primary/20 to-text-primary/45 min-h-[220px] rounded-[10px] bg-linear-to-tr md:min-h-[340px]" />
          </div>

          <section>
            <h2 className="mb-4 text-[28px] font-semibold leading-tight">
              In-Store Categories
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {content.inStoreCategories.map((category) => (
                <article
                  key={category}
                  className="from-text-primary/45 to-text-primary/70 text-beige-100 flex min-h-[120px] items-end rounded-[10px] bg-linear-to-t p-3"
                >
                  <p className="text-sm leading-tight font-semibold">{category}</p>
                </article>
              ))}
            </div>
          </section>
        </Container>
      </section>

      <MarketingFooter />
    </main>
  );
}

function StoreInfoCard({ content }: Readonly<StoresPageLayoutProps>) {
  return (
    <article className="border-gray-200 rounded-[10px] border bg-white p-5 md:p-6">
      <h2 className="mb-5 text-[28px] leading-tight font-semibold">Store information</h2>

      <div className="space-y-5">
        <div>
          <h3 className="text-base font-bold">Address</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[16px] leading-6 tracking-normal">
            {content.store.addressLine1}
          </Body>
          <Body size="md" className="text-text-secondary text-[16px] leading-6 tracking-normal">
            {content.store.addressLine2}
          </Body>
        </div>

        <div>
          <h3 className="text-base font-bold">Opening Hours</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[16px] leading-6 tracking-normal">
            {content.store.openingHoursWeekdays}
          </Body>
          <Body size="md" className="text-text-secondary text-[16px] leading-6 tracking-normal">
            {content.store.openingHoursWeekends}
          </Body>
        </div>

        <div>
          <h3 className="text-base font-bold">Phone</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[16px] leading-6 tracking-normal">
            {content.store.phone}
          </Body>
        </div>

        <div>
          <h3 className="text-base font-bold">Email</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[16px] leading-6 tracking-normal">
            {content.store.email}
          </Body>
        </div>
      </div>

      <Button asChild className="mt-6 normal-case tracking-normal">
        <Link href="/stores">{content.store.ctaLabel}</Link>
      </Button>
    </article>
  );
}
