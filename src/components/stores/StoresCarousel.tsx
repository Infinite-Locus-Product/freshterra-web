"use client";

import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";


import {
  homeHeroBannerDotActiveClass,
  homeHeroBannerDotInactiveClass,
} from "@/components/homepage/home-hero-banner";
import {
  storesCarouselDotsClass,
  storesCarouselSlideClass,
  storesCarouselTrackClass,
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
  storesMapBannerClass,
  storesMapBannerShellClass,
  storesMapSectionClass,
  storesPageHeroImageSizes,
  storesPageMapImageSizes,
  storesSecondaryImageClass,
} from "@/components/stores/stores-page";
import { StoresResponsiveImage } from "@/components/stores/StoresResponsiveImage";
import { Button } from "@/components/ui/Button";

import type {
  StorePageInformationRow,
  StorePageStore,
} from "@/features/cms-content/store-page-web-types";

import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";


const SLIDE_SELECTOR = "[data-store-slide]";
/** Same cadence as the homepage store carousel (FRES-2399). */
const STORE_AUTOPLAY_INTERVAL_MS = 4000;

/** Our Stores carousel; info, directions and images follow the store. */
export function StoresCarousel({
  stores,
}: Readonly<{ stores: readonly StorePageStore[] }>) {
  const { trackRef, activeIndex, scrollToSlide } = useSnapCarousel(
    SLIDE_SELECTOR,
    stores.length,
  );
  const autoplayPauseHandlers = useCarouselAutoplay({
    slideCount: stores.length,
    intervalMs: STORE_AUTOPLAY_INTERVAL_MS,
    activeIndex,
    scrollToSlide,
  });
  const active = stores[activeIndex] ?? stores[0];
  if (!active) return null;
  const showStoreName = stores.length > 1 && Boolean(active.name);

  return (
    <div {...autoplayPauseHandlers}>
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className={storesHeroImageShellClass}>
          <div className={storesHeroImageClass}>
            <div
              ref={trackRef}
              role="group"
              aria-roledescription="carousel"
              aria-label="Our stores"
              className={storesCarouselTrackClass}
            >
              {stores.map((store, index) => (
                <div
                  key={store.key}
                  data-store-slide
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Store ${index + 1} of ${stores.length}`}
                  className={storesCarouselSlideClass}
                >
                  <StoresResponsiveImage
                    image={store.primaryHeroImage}
                    sizes={storesPageHeroImageSizes}
                    className="object-cover"
                    priority={index === 0}
                    eager
                  />
                </div>
              ))}
            </div>

            {stores.length > 1 ? (
              <div className={storesCarouselDotsClass}>
                {stores.map((store, index) => (
                  <button
                    key={`${store.key}-dot`}
                    type="button"
                    aria-label={`Show store ${index + 1} of ${stores.length}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => scrollToSlide(index)}
                    className={
                      index === activeIndex
                        ? homeHeroBannerDotActiveClass
                        : homeHeroBannerDotInactiveClass
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <article aria-live="polite" className={storesInfoCardClass}>
          {showStoreName ? (
            <h2 className={storesInfoTitleClass}>{active.name}</h2>
          ) : null}
          <StoreInfoCardBody store={active} />
        </article>
      </div>

      <div className={storesMapSectionClass}>
        <div className={storesMapBannerShellClass}>
          <DirectionsLink
            href={active.directionsUrl}
            aria-label={`Open directions to ${active.name || "the store"}`}
            className={storesMapBannerClass}
          >
            <Image
              src="/map-store.png"
              alt={`Map showing ${active.name || "the store"}`}
              fill
              sizes={storesPageMapImageSizes}
              className="object-cover"
            />
          </DirectionsLink>
        </div>
        {active.secondaryHeroImage ? (
          <div className={storesSecondaryImageClass}>
            <StoresResponsiveImage
              image={active.secondaryHeroImage}
              sizes={storesPageMapImageSizes}
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StoreInfoCardBody({ store }: Readonly<{ store: StorePageStore }>) {
  return (
    <>
      {store.information.length > 0 ? (
        <div className="space-y-5">
          {store.information.map((row) => (
            <StoreInfoRow key={row.heading} row={row} />
          ))}
        </div>
      ) : null}

      {store.directionsLabel && store.directionsUrl ? (
        <div className={storesDirectionsButtonShellClass}>
          <Button
            asChild
            caps={false}
            size="md"
            className={storesDirectionsButtonClass}
          >
            <DirectionsLink
              href={store.directionsUrl}
              className="inline-flex h-full w-full items-center justify-center lg:w-auto"
            >
              {store.directionsLabel}
            </DirectionsLink>
          </Button>
        </div>
      ) : null}
    </>
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
  if (/^https?:\/\//i.test(href)) {
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
