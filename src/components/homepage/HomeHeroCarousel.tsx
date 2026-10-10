"use client";

import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  homeHeroBannerDotActiveClass,
  homeHeroBannerDotInactiveClass,
  homeHeroBannerDotsClass,
  homeHeroBannerHeadingClass,
  homeHeroBannerHeadingWrapClass,
  homeHeroBannerImageClass,
  homeHeroBannerMwebArtAspectClass,
  homeHeroBannerOuterClass,
  homeHeroBannerShellClass,
  homeHeroBannerSlideFrameClass,
  homeHeroBannerTrackClass,
  homeHeroBannerWebArtAspectClass,
} from "@/components/homepage/home-hero-banner";

import type { HomeHeroSlide } from "@/features/cms-content/web-homepage-types";

import { useCarouselAutoplay } from "@/hooks/useCarouselAutoplay";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";


type HomeHeroCarouselProps = Readonly<{
  slides: readonly HomeHeroSlide[];
  /** Strapi auto-swipe interval; unset → no auto-swipe (no default). */
  autoplayIntervalMs?: number;
  className?: string;
}>;

const SLIDE_SELECTOR = "[data-hero-banner-slide]";

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function HeroBannerLink({
  href,
  ariaLabel,
  children,
}: Readonly<{
  href: string;
  ariaLabel: string;
  children: ReactNode;
}>) {
  const className = "absolute inset-0 block";
  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
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

export function HomeHeroCarousel({
  slides,
  autoplayIntervalMs,
  className,
}: HomeHeroCarouselProps) {
  const { trackRef, activeIndex, scrollToSlide } = useSnapCarousel(
    SLIDE_SELECTOR,
    slides.length,
  );
  // Auto-advance on the Strapi interval (no default) — web and mWeb alike.
  const autoplayPauseHandlers = useCarouselAutoplay({
    slideCount: slides.length,
    intervalMs: autoplayIntervalMs,
    activeIndex,
    scrollToSlide,
  });

  if (slides.length === 0) return null;

  // Shared frame height: use mWeb art only if every slide has it.
  const useMobileArt = slides.every((slide) => slide.hasMobileArt);

  return (
    <div className={cn(homeHeroBannerShellClass, className)}>
      <div
        className={homeHeroBannerOuterClass}
        {...autoplayPauseHandlers}
      >
        <div
          ref={trackRef}
          className={homeHeroBannerTrackClass}
          aria-roledescription="carousel"
          aria-label="Homepage promotions"
        >
          {slides.map((slide, index) => {
            const imageBlock = (
              <>
                <Image
                  src={useMobileArt ? slide.imageMobile : slide.imageWeb}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  className={cn(homeHeroBannerImageClass, "md:hidden")}
                  sizes="100vw"
                />
                <Image
                  src={slide.imageWeb}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  className={cn(homeHeroBannerImageClass, "hidden md:block")}
                  sizes="100vw"
                />
              </>
            );

            return (
              <div
                key={`${slide.id}-${index}`}
                data-hero-banner-slide
                className={cn(
                  homeHeroBannerSlideFrameClass,
                  useMobileArt
                    ? homeHeroBannerMwebArtAspectClass
                    : homeHeroBannerWebArtAspectClass,
                )}
              >
                {slide.href ? (
                  <HeroBannerLink href={slide.href} ariaLabel={slide.imageAlt}>
                    {imageBlock}
                  </HeroBannerLink>
                ) : (
                  imageBlock
                )}
                {slide.heading ? (
                  <div className={homeHeroBannerHeadingWrapClass}>
                    <p className={homeHeroBannerHeadingClass}>
                      {slide.heading}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {slides.length > 1 ? (
          <div className={cn(homeHeroBannerDotsClass, "pointer-events-auto")}>
            {slides.map((item, index) => (
              <button
                key={`${item.id}-dot-${index}`}
                type="button"
                aria-label={`Show banner ${index + 1} of ${slides.length}`}
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
  );
}
