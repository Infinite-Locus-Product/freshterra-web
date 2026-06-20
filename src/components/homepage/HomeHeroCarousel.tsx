"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import {
  homeHeroBannerDotActiveClass,
  homeHeroBannerDotInactiveClass,
  homeHeroBannerDotsClass,
  homeHeroBannerHeadingClass,
  homeHeroBannerHeadingWrapClass,
  homeHeroBannerImageClass,
  homeHeroBannerOuterClass,
  homeHeroBannerShellClass,
  homeHeroBannerSlideFrameClass,
  homeHeroBannerTrackClass,
} from "@/components/homepage/home-hero-banner";

import type { HomeHeroSlide } from "@/features/cms-content/web-homepage-types";

type HomeHeroCarouselProps = Readonly<{
  slides: readonly HomeHeroSlide[];
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

export function HomeHeroCarousel({ slides, className }: HomeHeroCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || slides.length === 0) return;

    const slideNodes = track.querySelectorAll<HTMLElement>(SLIDE_SELECTOR);
    if (slideNodes.length === 0) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slideNodes.forEach((node, index) => {
      const slideCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(slideCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, [slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => syncActiveIndexFromScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    syncActiveIndexFromScroll();

    return () => track.removeEventListener("scroll", onScroll);
  }, [syncActiveIndexFromScroll]);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelectorAll<HTMLElement>(SLIDE_SELECTOR)[index];
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2,
      behavior: "smooth",
    });
  };

  if (slides.length === 0) return null;

  return (
    <div className={cn(homeHeroBannerShellClass, className)}>
      <div className={homeHeroBannerOuterClass}>
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
                  src={slide.imageMobile}
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

            const heading = slide.heading ?? slide.imageAlt;

            return (
              <div
                key={`${slide.id}-${index}`}
                data-hero-banner-slide
                className={homeHeroBannerSlideFrameClass}
              >
                {slide.href ? (
                  <HeroBannerLink href={slide.href} ariaLabel={slide.imageAlt}>
                    {imageBlock}
                  </HeroBannerLink>
                ) : (
                  imageBlock
                )}
                {heading ? (
                  <div className={homeHeroBannerHeadingWrapClass}>
                    <p className={homeHeroBannerHeadingClass}>{heading}</p>
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
