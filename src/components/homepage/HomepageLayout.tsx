import Image from "next/image";

import { dummyImages } from "@/lib/dummy-images";

import {
  homeHeroBannerDotActiveClass,
  homeHeroBannerDotInactiveClass,
  homeHeroBannerDotsClass,
  homeHeroBannerHeadingClass,
  homeHeroBannerHeaderGapClass,
  homeHeroBannerHeadingWrapClass,
  homeHeroBannerImageClass,
  homeHeroBannerOuterClass,
  homeHeroBannerShellClass,
  homeHeroHeaderSectionClass,
  homeHeroHeaderShellClass,
  homeHeroHeaderFadeClass,
} from "@/components/homepage/home-hero-banner";
import { HomeCategoriesSection } from "@/components/homepage/HomeCategoriesSection";
import { HomeHeroCarousel } from "@/components/homepage/HomeHeroCarousel";
import { HomeSourcingSection } from "@/components/homepage/HomeSourcingSection";
import { HomeStoreSection } from "@/components/homepage/HomeStoreSection";
import { HomeTestimonialsSection } from "@/components/homepage/HomeTestimonialsSection";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import type { HomePageContent } from "@/features/cms-content/web-homepage-types";

type HomepageLayoutProps = {
  content: HomePageContent;
};

export function HomepageLayout({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <main className="text-text-primary overflow-x-hidden bg-white">
      <HeroHeaderSection content={content} />
      <HomeCategoriesSection categories={content.categories} />
      <HomeSourcingSection content={content.sourcing} />
      <HomeTestimonialsSection content={content.testimonials} />
      <HomeStoreSection content={content.store} title={content.store.title} />
      <MarketingFooter />
    </main>
  );
}

function HeroHeaderSection({ content }: Readonly<HomepageLayoutProps>) {
  const hasCmsHero = content.heroSlides.length > 0;

  return (
    <section className={homeHeroHeaderSectionClass}>
      <div className={homeHeroHeaderShellClass}>
        <MarketingHeader
          embedded
          bannerFullBleed
          className="relative z-10 bg-transparent"
          tagline={content.hero.eyebrow}
          taglineAs="h1"
          locationLabel={content.nav.locationLabel}
          navLinks={content.nav.links}
          downloadLabel={content.hero.ctaLabel}
        />
        <div aria-hidden className={homeHeroHeaderFadeClass} />
      </div>

      {hasCmsHero ? (
        <HomeHeroCarousel
          slides={content.heroSlides}
          className={homeHeroBannerHeaderGapClass}
        />
      ) : (
        <div
          className={`${homeHeroBannerShellClass} ${homeHeroBannerHeaderGapClass}`}
        >
          <div className={homeHeroBannerOuterClass}>
            <Image
              src={dummyImages.homeHeroBanner.src}
              alt={content.hero.headline}
              fill
              priority
              className={homeHeroBannerImageClass}
              sizes="100vw"
            />
            {content.hero.headline ? (
              <div className={homeHeroBannerHeadingWrapClass}>
                <p className={homeHeroBannerHeadingClass}>
                  {content.hero.headline}
                </p>
              </div>
            ) : null}
            <div className={homeHeroBannerDotsClass} aria-hidden>
              {[0, 1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className={
                    dot === 0
                      ? homeHeroBannerDotActiveClass
                      : homeHeroBannerDotInactiveClass
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
