import {
  homeHeroBannerHeaderGapClass,
  homeHeroHeaderSectionClass,
  homeHeroHeaderShellClass,
  homeHeroHeaderFadeClass,
} from "@/components/homepage/home-hero-banner";
import { HomeCategoriesSection } from "@/components/homepage/HomeCategoriesSection";
import { HomeHeroCarousel } from "@/components/homepage/HomeHeroCarousel";
import { HomeSourcingSection } from "@/components/homepage/HomeSourcingSection";
import { HomeStoreSection } from "@/components/homepage/HomeStoreSection";
import { HomeTestimonialsSection } from "@/components/homepage/HomeTestimonialsSection";
import { AppDownloadBanner } from "@/components/layout/AppDownloadBanner";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import type { HomePageContent } from "@/features/cms-content/web-homepage-types";

type HomepageLayoutProps = {
  content: HomePageContent;
};

export function HomepageLayout({ content }: Readonly<HomepageLayoutProps>) {
  return (
    // `-clip`, not `-hidden`: hidden would break the sticky header.
    <main className="text-text-primary overflow-x-clip bg-white">
      <HeroHeaderSection content={content} />
      <HomeCategoriesSection categories={content.categories} />
      <HomeSourcingSection content={content.sourcing} />
      <HomeStoreSection
        title={content.storeSection.title}
        stores={content.storeSection.stores}
      />
      <HomeTestimonialsSection content={content.testimonials} />
      <MarketingFooter />
    </main>
  );
}

function HeroHeaderSection({ content }: Readonly<HomepageLayoutProps>) {
  const hasCmsHero = content.heroSlides.length > 0;
  const tagline = content.hero.eyebrow.trim() || undefined;
  const locationLabel = content.nav.locationLabel.trim() || undefined;
  const navLinks =
    content.nav.links.length > 0 ? content.nav.links : undefined;

  // Header sits outside the hero section so it stays stuck page-wide.
  return (
    <>
      <div className="lg:hidden">
        <AppDownloadBanner fullBleed />
      </div>
      <div data-site-header className={homeHeroHeaderShellClass}>
        <MarketingHeader
          embedded
          bannerFullBleed
          className="relative z-10 bg-transparent"
          tagline={tagline}
          taglineAs="h1"
          locationLabel={locationLabel}
          navLinks={navLinks}
        />
        <div aria-hidden className={homeHeroHeaderFadeClass} />
      </div>

      <section className={homeHeroHeaderSectionClass}>
        {hasCmsHero ? (
          <HomeHeroCarousel
            slides={content.heroSlides}
            autoplayIntervalMs={content.heroAutoplayIntervalMs}
            className={homeHeroBannerHeaderGapClass}
          />
        ) : null}
      </section>
    </>
  );
}
