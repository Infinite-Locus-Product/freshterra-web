import Image from "next/image";
import Link from "next/link";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { PageShell } from "@/components/layout/PageShell";
import {
  storesCategoryCardClass,
  storesCategoryCardLabelClass,
  storesDirectionsButtonClass,
  storesDirectionsButtonShellClass,
  storesHeroImageClass,
  storesHeroImageShellClass,
  storesInfoCardClass,
  storesInfoFieldLabelClass,
  storesInfoFieldValueClass,
  storesInfoRowClass,
  storesInfoRowIconClass,
  storesInStoreCategoriesGridClass,
  storesInStoreCategoriesTitleClass,
  storesMapBannerClass,
  storesMapBannerShellClass,
  storesMapSectionClass,
  storesPageSectionClass,
  storesPageShellClass,
  storesPageTitleClass,
  storesSecondaryImageClass,
  storesPageHeroImageSizes,
  storesPageMapImageSizes,
} from "@/components/stores/stores-page";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

import type {
  StorePageCategoryTile,
  StorePageInformationRow,
  StorePageResponsiveImage,
  StoresPageContent,
} from "@/features/cms-content/store-page-web-types";

type StoresPageLayoutProps = {
  content: StoresPageContent;
};

export function StoresPageLayout({ content }: Readonly<StoresPageLayoutProps>) {
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
            <span className="text-text-primary">{content.title}</span>
          </div>

          <Heading level={1} variant="h2" className={storesPageTitleClass}>
            {content.title}
          </Heading>

          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            <div className={storesHeroImageShellClass}>
              <div className={storesHeroImageClass}>
                <StoresResponsiveImage
                  image={content.primaryHeroImage}
                  sizes={storesPageHeroImageSizes}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <StoreInfoCard content={content} />
          </div>

          <div className={storesMapSectionClass}>
            <div className={storesMapBannerShellClass}>
              <DirectionsMapBanner content={content} />
            </div>
            <div className={storesSecondaryImageClass}>
              <StoresResponsiveImage
                image={content.secondaryHeroImage}
                sizes={storesPageMapImageSizes}
                className="object-cover"
              />
            </div>
          </div>

          {content.categories.length > 0 ? (
            <section>
              {content.categorySectionTitle ? (
                <h2 className={storesInStoreCategoriesTitleClass}>
                  {content.categorySectionTitle}
                </h2>
              ) : null}
              <div className={storesInStoreCategoriesGridClass}>
                {content.categories.map((category) => (
                  <StoreCategoryTile key={category.label} category={category} />
                ))}
              </div>
            </section>
          ) : null}
        </PageShell>
      </section>

      <MarketingFooter />
    </main>
  );
}

function StoreInfoCard({ content }: Readonly<{ content: StoresPageContent }>) {
  return (
    <article className={storesInfoCardClass}>
      {content.information.length > 0 ? (
        <div className="space-y-5">
          {content.information.map((row) => (
            <StoreInfoRow key={row.heading} row={row} />
          ))}
        </div>
      ) : null}

      {content.directionsLabel && content.directionsUrl ? (
        <div className={storesDirectionsButtonShellClass}>
          <Button
            asChild
            caps={false}
            size="md"
            className={storesDirectionsButtonClass}
          >
            <DirectionsLink
              href={content.directionsUrl}
              className="inline-flex h-full w-full items-center justify-center lg:w-auto"
            >
              {content.directionsLabel}
            </DirectionsLink>
          </Button>
        </div>
      ) : null}
    </article>
  );
}

function DirectionsMapBanner({
  content,
}: Readonly<{ content: StoresPageContent }>) {
  const image = (
    <Image
      src="/map-store.png"
      alt={`Map showing ${content.title}`}
      fill
      sizes={storesPageMapImageSizes}
      className="object-cover"
    />
  );

  return (
    <DirectionsLink
      href={content.directionsUrl}
      aria-label={`Open directions to ${content.title}`}
      className={storesMapBannerClass}
    >
      {image}
    </DirectionsLink>
  );
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function DirectionsLink({
  href,
  children,
  className,
  "aria-label": ariaLabel,
}: Readonly<{
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}>) {
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

function StoreInfoRow({ row }: Readonly<{ row: StorePageInformationRow }>) {
  return (
    <div className={storesInfoRowClass}>
      <div className={storesInfoRowIconClass}>
        {row.iconSrc ? (
          <Image
            src={row.iconSrc}
            alt=""
            width={20}
            height={20}
            className="size-5 object-contain"
            aria-hidden
          />
        ) : null}
      </div>
      <div className="min-w-0">
        <h3 className={storesInfoFieldLabelClass}>{row.heading}</h3>
        <div className="mt-1 space-y-0.5">
          {row.lines.map((line) => (
            <p key={line} className={storesInfoFieldValueClass}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoreCategoryTile({
  category,
}: Readonly<{ category: StorePageCategoryTile }>) {
  const card = (
    <article className={storesCategoryCardClass}>
      <div className="absolute inset-0 -z-10">
        <StoresResponsiveImage
          image={{
            imageWeb: category.imageWeb,
            imageMobile: category.imageMobile,
            imageAlt: "",
          }}
          sizes="(max-width: 1023px) 50vw, 16vw"
          className="object-cover"
        />
      </div>
      <p className={storesCategoryCardLabelClass}>
        {category.label}
      </p>
    </article>
  );

  if (!category.href) return card;

  return (
    <Link href={category.href} className="block w-full">
      {card}
    </Link>
  );
}

function StoresResponsiveImage({
  image,
  sizes,
  className,
  priority,
}: Readonly<{
  image: StorePageResponsiveImage;
  sizes: string;
  className?: string;
  priority?: boolean;
}>) {
  return (
    <>
      <Image
        src={image.imageMobile}
        alt={image.imageAlt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(className, "lg:hidden")}
      />
      <Image
        src={image.imageWeb}
        alt={image.imageAlt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(className, "hidden lg:block")}
      />
    </>
  );
}
