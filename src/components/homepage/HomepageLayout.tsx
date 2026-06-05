import Image from "next/image";
import Link from "next/link";

import { dummyImages } from "@/lib/dummy-images";

import { HomeCategoriesSection } from "@/components/homepage/HomeCategoriesSection";
import {
  homeHeroBannerDotActiveClass,
  homeHeroBannerDotInactiveClass,
  homeHeroBannerDotsClass,
  homeHeroBannerImageClass,
  homeHeroBannerOuterClass,
} from "@/components/homepage/home-hero-banner";
import {
  homeSourcingBgImageClass,
  homeSourcingBodyCopyClass,
  homeSourcingBodyParagraphsClass,
  homeSourcingBodyRowClass,
  homeSourcingMediaClass,
  homeSourcingMediaColumnClass,
  homeSourcingMediaImageClass,
  homeSourcingSectionFrameClass,
  homeSourcingTitleClass,
} from "@/components/homepage/home-sourcing";
import {
  homeStoreAddressClass,
  homeStoreCtaPillClass,
  homeStoreCtaRowClass,
  homeStoreDetailsClass,
  homeStoreMediaFrameClass,
  homeStoreMediaImageClass,
  homeStoreNameClass,
} from "@/components/homepage/home-store";
import { HomeTestimonialsCarousel } from "@/components/homepage/HomeTestimonialsCarousel";
import { HEADER_TO_HERO_GAP_CLASS } from "@/components/layout/header-chrome";
import { PAGE_SHELL_INNER_CLASS } from "@/components/layout/layout-classes";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { PageShell } from "@/components/layout/PageShell";
import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

import type { HomePageDraftContent } from "@/features/cms-content/homepage";
import { SearchBox } from "@/features/search/components/SearchBox";

type HomepageLayoutProps = {
  content: HomePageDraftContent;
};

export function HomepageLayout({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <main className="text-text-primary bg-white">
      <HeroHeaderSection content={content} />
      <HomeCategoriesSection fallback={content.categories} />
      <SourcingSection content={content} />
      <TestimonialsSection content={content} />
      <StoreSection content={content} />
      <MarketingFooter />
    </main>
  );
}

function HeroHeaderSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="from-header-tint bg-linear-to-b to-white pt-6 pb-8 md:pt-8 md:pb-10">
      {/* Homepage-only: white gradient fading to #FFFFFF behind the bottom of the navbar. */}
      <div className="relative">
        <MarketingHeader
          embedded
          className="relative z-10"
          tagline={content.hero.eyebrow}
          taglineAs="h1"
          locationLabel={content.nav.locationLabel}
          navLinks={content.nav.links}
          downloadLabel={content.hero.ctaLabel}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-8 bg-linear-to-b from-transparent to-white"
        />
      </div>

      <div
        className={`${PAGE_SHELL_INNER_CLASS} px-page ${HEADER_TO_HERO_GAP_CLASS}`}
      >
        <div className={homeHeroBannerOuterClass}>
          <Image
            src={dummyImages.homeHeroBanner.src}
            alt={content.hero.headline}
            fill
            priority
            className={homeHeroBannerImageClass}
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
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
    </section>
  );
}

function SourcingSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    // Top padding 96px to the categories section above.
    <section className="bg-white pt-24 pb-8 md:pb-10">
      <PageShell>
        <div className={homeSourcingSectionFrameClass}>
          <Image
            src="/home-sourcing-bg.png"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className={`${homeSourcingBgImageClass} z-0`}
            priority={false}
          />
          <div className={`${homeSourcingTitleClass} relative z-10`}>
            <Heading level={2} variant="h2" className="text-[#445133]">
              {content.sourcing.title}
            </Heading>
          </div>
          <div className={`${homeSourcingBodyRowClass} relative z-10`}>
            <div className={homeSourcingBodyCopyClass}>
              <div className={homeSourcingBodyParagraphsClass}>
                {content.sourcing.paragraphs.map((paragraph) => (
                  <Body
                    key={paragraph}
                    size="md"
                    className="text-[18px] leading-7 tracking-normal"
                  >
                    {paragraph}
                  </Body>
                ))}
              </div>
              <Link
                href="/food-philosophy"
                className="text-brand-500 mt-6 font-bold"
              >
                {content.sourcing.ctaLabel}
              </Link>
            </div>
            <div className={homeSourcingMediaColumnClass}>
              <div className={homeSourcingMediaClass}>
                <Image
                  src={dummyImages.homeSourcingMedia.src}
                  alt="Fresh, wholesome and gourmet produce from our sourcing partners"
                  fill
                  className={homeSourcingMediaImageClass}
                  sizes="(max-width: 1024px) 100vw, 628px"
                />
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </section>
  );
}

function TestimonialsSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-white pt-10 pb-0 md:pt-14">
      <PageShell>
        <Heading level={2} variant="h2" className="text-[#101828]">
          {content.testimonials.title}
        </Heading>
        <p className="text-brand-500 font-handsome mt-1 text-[1.875rem] leading-[1.625rem] font-bold tracking-[0px]">
          {content.testimonials.subtitle}
        </p>
      </PageShell>

      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <HomeTestimonialsCarousel items={content.testimonials.items} />
      </div>
    </section>
  );
}

function StoreSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    // Top padding 76px to the testimonials section above.
    // Bottom padding (49.16px) + footer mt-8 (32px) = 81.16px gap to the footer.
    <section className="bg-white pt-19 pb-[49.16px]">
      <PageShell>
        <Heading level={2} variant="h2" className="mb-[34.84px] text-[#101828]">
          {content.store.title}
        </Heading>

        <div className={homeStoreMediaFrameClass}>
          <Image
            src={dummyImages.homeStoreMedia.src}
            alt={`${content.store.name} store interior`}
            fill
            className={homeStoreMediaImageClass}
            sizes="(max-width: 1360px) 100vw, 1360px"
          />
        </div>

        <div className={homeStoreDetailsClass}>
          <h3 className={homeStoreNameClass}>{content.store.name}</h3>
          <div className={homeStoreAddressClass}>
            <p>{content.store.addressLine1}</p>
            <p>{content.store.addressLine2}</p>
          </div>
          <div className={homeStoreCtaRowClass}>
            <Button
              asChild
              variant="ghost"
              caps={false}
              className={homeStoreCtaPillClass}
            >
              <Link href="/stores">{content.store.primaryCtaLabel}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              caps={false}
              className={homeStoreCtaPillClass}
            >
              <Link href="/stores">{content.store.secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    </section>
  );
}
