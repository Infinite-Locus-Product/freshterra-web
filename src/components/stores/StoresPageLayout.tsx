import Image from "next/image";
import Link from "next/link";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { SECTION_TITLE_CLASS } from "@/components/layout/layout-classes";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

import type { StoresPageDraftContent } from "@/features/cms-content/stores";

type StoresPageLayoutProps = {
  content: StoresPageDraftContent;
};

export function StoresPageLayout({ content }: Readonly<StoresPageLayoutProps>) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${content.store.title}, ${content.store.addressLine1}, ${content.store.addressLine2}`,
  )}`;

  return (
    <main className="bg-white text-text-primary">
      <MarketingHeader />

      <section className="py-8 md:py-10">
        <PageShell>
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
            <div className="relative min-h-[260px] overflow-hidden rounded-[10px] md:min-h-[460px]">
              <Image
                src="/store.png"
                alt={`${content.store.title} store interior`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute right-4 bottom-4 flex gap-1.5" aria-hidden>
                <span className="bg-white h-1.5 w-1.5 rounded-full" />
                <span className="bg-white/60 h-1.5 w-1.5 rounded-full" />
                <span className="bg-white/60 h-1.5 w-1.5 rounded-full" />
              </div>
            </div>
            <StoreInfoCard content={content} mapsUrl={mapsUrl} />
          </div>

          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${content.store.title} in Google Maps`}
              className="focus-visible:ring-brand-500 relative min-h-[220px] overflow-hidden rounded-[10px] focus:outline-none focus-visible:ring-2 md:min-h-[340px]"
            >
              <Image
                src="/map-store.png"
                alt={`Map showing ${content.store.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </a>
            <div className="relative min-h-[220px] overflow-hidden rounded-[10px] md:min-h-[340px]">
              <Image
                src="/store.png"
                alt={`${content.store.title} store interior`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <section>
            <h2 className={`mb-4 ${SECTION_TITLE_CLASS} leading-tight`}>
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
        </PageShell>
      </section>

      <MarketingFooter />
    </main>
  );
}

function StoreInfoCard({
  content,
  mapsUrl,
}: Readonly<StoresPageLayoutProps & { mapsUrl: string }>) {
  return (
    <article className="border-gray-200 rounded-[10px] border bg-white p-5 md:p-6">
      <h2 className={`mb-5 ${SECTION_TITLE_CLASS} leading-tight`}>
        Store information
      </h2>

      <div className="space-y-5">
        <div>
          <h3 className="text-base font-bold">Address</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[1rem] leading-6 tracking-normal">
            {content.store.addressLine1}
          </Body>
          <Body size="md" className="text-text-secondary text-[16px] leading-6 tracking-normal">
            {content.store.addressLine2}
          </Body>
        </div>

        <div>
          <h3 className="text-base font-bold">Opening Hours</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[1rem] leading-6 tracking-normal">
            {content.store.openingHoursWeekdays}
          </Body>
          <Body size="md" className="text-text-secondary text-[16px] leading-6 tracking-normal">
            {content.store.openingHoursWeekends}
          </Body>
        </div>

        <div>
          <h3 className="text-base font-bold">Phone</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[1rem] leading-6 tracking-normal">
            {content.store.phone}
          </Body>
        </div>

        <div>
          <h3 className="text-base font-bold">Email</h3>
          <Body size="md" className="text-text-secondary mt-1 text-[1rem] leading-6 tracking-normal">
            {content.store.email}
          </Body>
        </div>
      </div>

      <Button asChild className="mt-6 normal-case tracking-normal">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          {content.store.ctaLabel}
        </a>
      </Button>
    </article>
  );
}
