"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  homeHeroBannerDotActiveClass,
  homeHeroBannerDotInactiveClass,
} from "@/components/homepage/home-hero-banner";
import {
  homeStoreAddressRichTextClass,
  homeStoreCtaPillClass,
  homeStoreCtaRowClass,
  homeStoreDetailsClass,
  homeStoreDotsClass,
  homeStoreMediaFrameClass,
  homeStoreMediaImageClass,
  homeStoreNameAddressGroupClass,
  homeStoreNameClass,
  homeStoreSlideClass,
  homeStoreTrackClass,
} from "@/components/homepage/home-store";
import { Button } from "@/components/ui/Button";

import type { HomeStoreItem } from "@/features/cms-content/web-homepage-types";

import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";

const SLIDE_SELECTOR = "[data-store-slide]";
/** Store auto-swipe interval (FRES-2399). Not CMS-driven, unlike the hero's. */
const STORE_AUTOPLAY_INTERVAL_MS = 4000;
const IMAGE_SIZES =
  "(max-width: 768px) 361px, (max-width: 1360px) 100vw, 1360px";

/** "Visit Our Stores" carousel; details below follow the store in view. */
export function HomeStoreCarousel({
  stores,
}: Readonly<{ stores: readonly HomeStoreItem[] }>) {
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

  return (
    <div {...autoplayPauseHandlers}>
      <div className={homeStoreMediaFrameClass}>
        <div
          ref={trackRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Our stores"
          className={homeStoreTrackClass}
        >
          {stores.map((store, index) => (
            <StoreSlide
              key={store.key}
              store={store}
              label={`Store ${index + 1} of ${stores.length}`}
            />
          ))}
        </div>

        {stores.length > 1 ? (
          <div className={homeStoreDotsClass}>
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

      {/* Announces the newly shown store's address to screen readers. */}
      <div aria-live="polite" className={homeStoreDetailsClass}>
        <StoreDetails store={active} />
      </div>
    </div>
  );
}

function StoreSlide({
  store,
  label,
}: Readonly<{ store: HomeStoreItem; label: string }>) {
  const alt = store.name ? `${store.name} store interior` : "";
  const mobile = store.mediaImageMobile ?? store.mediaImage;

  return (
    <div
      data-store-slide
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      className={homeStoreSlideClass}
    >
      {mobile ? (
        <Image
          src={mobile}
          alt={alt}
          fill
          // Few slides: load all so a swipe never shows a blank frame.
          loading="eager"
          className={cn(homeStoreMediaImageClass, "md:hidden")}
          sizes={IMAGE_SIZES}
        />
      ) : null}
      {store.mediaImage ? (
        <Image
          src={store.mediaImage}
          alt={alt}
          fill
          // Few slides: load all so a swipe never shows a blank frame.
          loading="eager"
          className={cn(homeStoreMediaImageClass, "hidden md:block")}
          sizes={IMAGE_SIZES}
        />
      ) : null}
    </div>
  );
}

function StoreDetails({ store }: Readonly<{ store: HomeStoreItem }>) {
  const { primaryCtaHref, secondaryCtaHref } = store;

  return (
    <>
      <div className={homeStoreNameAddressGroupClass}>
        {store.addressHtml?.trim() ? (
          <div
            className={homeStoreAddressRichTextClass}
            dangerouslySetInnerHTML={{ __html: store.addressHtml }}
          />
        ) : store.name.trim() ? (
          <h3 className={homeStoreNameClass}>{store.name}</h3>
        ) : null}
      </div>
      <div className={homeStoreCtaRowClass}>
        {store.primaryCtaLabel.trim() && primaryCtaHref ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            caps={false}
            className={homeStoreCtaPillClass}
          >
            <Link href={primaryCtaHref}>{store.primaryCtaLabel}</Link>
          </Button>
        ) : null}
        {store.secondaryCtaLabel.trim() && secondaryCtaHref ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            caps={false}
            className={homeStoreCtaPillClass}
          >
            {/^https?:\/\//i.test(secondaryCtaHref) ? (
              <a
                href={secondaryCtaHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {store.secondaryCtaLabel}
              </a>
            ) : (
              <Link href={secondaryCtaHref}>{store.secondaryCtaLabel}</Link>
            )}
          </Button>
        ) : null}
      </div>
    </>
  );
}
