import Image from "next/image";
import Link from "next/link";

import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import {
  storesDirectionsButtonClass,
  storesDirectionsButtonShellClass,
  storesHeroImageClass,
  storesHeroImageShellClass,
  storesInfoCardClass,
  storesInfoFieldLabelClass,
  storesInfoFieldValueClass,
  storesInfoRowClass,
  storesInfoRowIconClass,
  storesInfoTitleClass,
  storesCategoryCardClass,
  storesCategoryCardLabelClass,
  storesInStoreCategoriesGridClass,
  storesInStoreCategoriesTitleClass,
  storesMapBannerClass,
  storesMapBannerShellClass,
  storesMapSectionClass,
  storesPageSectionClass,
  storesPageShellClass,
  storesPageTitleClass,
  storesSecondaryImageClass,
} from "@/components/stores/stores-page";
import { Button } from "@/components/ui/Button";
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

      <section className={storesPageSectionClass}>
        <PageShell pad={false} className={storesPageShellClass}>
          <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span aria-hidden>›</span>
            <span className="text-text-primary">{content.breadcrumbLabel}</span>
          </div>

          <Heading level={1} variant="h2" className={storesPageTitleClass}>
            {content.store.title}
          </Heading>

          <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className={storesHeroImageShellClass}>
              <div className={storesHeroImageClass}>
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
            </div>
            <StoreInfoCard content={content} mapsUrl={mapsUrl} />
          </div>

          <div className={storesMapSectionClass}>
            <div className={storesMapBannerShellClass}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${content.store.title} in Google Maps`}
                className={storesMapBannerClass}
              >
                <Image
                  src="/map-store.png"
                  alt={`Map showing ${content.store.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </a>
            </div>
            <div className={storesSecondaryImageClass}>
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
            <h2 className={storesInStoreCategoriesTitleClass}>In-Store Categories</h2>
            <div className={storesInStoreCategoriesGridClass}>
              {content.inStoreCategories.map((category) => (
                <article key={category} className={storesCategoryCardClass}>
                  <p className={storesCategoryCardLabelClass}>{category}</p>
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
    <article className={storesInfoCardClass}>
      <h2 className={storesInfoTitleClass}>Store information</h2>

      <div className="space-y-5">
        <StoreInfoRow
          icon={<LocationIcon />}
          title="Address"
          lines={[content.store.addressLine1, content.store.addressLine2]}
        />
        <StoreInfoRow
          icon={<ClockIcon />}
          title="Opening Hours"
          lines={[content.store.openingHoursWeekdays, content.store.openingHoursWeekends]}
        />
        <StoreInfoRow
          icon={<PhoneIcon />}
          title="Phone"
          lines={[content.store.phone]}
        />
        <StoreInfoRow icon={<MailIcon />} title="Email" lines={[content.store.email]} />
      </div>

      <div className={storesDirectionsButtonShellClass}>
        <Button asChild fullWidth className={storesDirectionsButtonClass}>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            {content.store.ctaLabel}
          </a>
        </Button>
      </div>
    </article>
  );
}

function StoreInfoRow({
  icon,
  title,
  lines,
}: Readonly<{
  icon: ReactNode;
  title: string;
  lines: readonly string[];
}>) {
  return (
    <div className={storesInfoRowClass}>
      <div className={storesInfoRowIconClass}>{icon}</div>
      <div className="min-w-0">
        <h3 className={storesInfoFieldLabelClass}>{title}</h3>
        <div className="mt-1 space-y-0.5">
          {lines.map((line) => (
            <p key={line} className={storesInfoFieldValueClass}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M12 13.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 22s7-6.05 7-12a7 7 0 1 0-14 0c0 5.95 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M4.5 7.5h15v9h-15v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m5.25 8.25 6.4 5.12a.75.75 0 0 0 .9 0l6.2-5.12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M7 3.75h3l1 4-2 1c1 2.5 3 4.5 5.25 5.25l1-2 4 1v3c0 1.1-.9 2-2 2C10.6 19 5 13.4 5 6.75c0-1.1.9-2 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
