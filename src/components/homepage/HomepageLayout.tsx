import Image from "next/image";
import Link from "next/link";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BrandTagline } from "@/components/ui/BrandTagline";
import { HeaderDownloadAppButton } from "@/components/ui/HeaderDownloadAppButton";
import { HeaderLocationBadge } from "@/components/ui/HeaderLocationBadge";
import { HeaderSearchBar } from "@/components/ui/HeaderSearchBar";
import { Heading } from "@/components/ui/Heading";
import { Logo } from "@/components/ui/Logo";

import {
  HEADER_EDGE_PADDING_CLASS,
  HEADER_TO_HERO_GAP_CLASS,
} from "@/components/layout/header-chrome";

import { HomeCategoryTile } from "@/components/homepage/HomeCategoryTile";
import {
  homeCategoriesSubtitleClass,
  homeCategoriesTitleClass,
} from "@/components/homepage/home-categories";
import {
  homeHeroBannerDotActiveClass,
  homeHeroBannerDotInactiveClass,
  homeHeroBannerDotsClass,
  homeHeroBannerImageClass,
  homeHeroBannerOuterClass,
} from "@/components/homepage/home-hero-banner";
import { dummyImages } from "@/lib/dummy-images";
import {
  homeSourcingArtClass,
  homeSourcingBodyCopyClass,
  homeSourcingBodyParagraphsClass,
  homeSourcingBodyRowClass,
  homeSourcingMediaClass,
  homeSourcingMediaColumnClass,
  homeSourcingMediaImageClass,
  homeSourcingSectionFrameClass,
  homeSourcingTitleClass,
} from "@/components/homepage/home-sourcing";
import { HomeTestimonialCard } from "@/components/homepage/HomeTestimonialCard";
import {
  homeStoreAddressClass,
  homeStoreCtaPillClass,
  homeStoreCtaRowClass,
  homeStoreDetailsClass,
  homeStoreMediaFrameClass,
  homeStoreMediaImageClass,
  homeStoreNameClass,
} from "@/components/homepage/home-store";
import { homeTestimonialsGridClass } from "@/components/homepage/home-testimonials";

import type { HomePageDraftContent } from "@/features/cms-content/homepage";

type HomepageLayoutProps = {
  content: HomePageDraftContent;
};

export function HomepageLayout({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <main className="text-text-primary bg-white">
      <HeroHeaderSection content={content} />
      <CategoriesSection content={content} />
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
      <div
        className={`mx-auto w-full max-w-[1440px] ${HEADER_EDGE_PADDING_CLASS}`}
      >
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3">
              <Logo tone="light" variant="header" priority linkToHome />
              <BrandTagline as="h1">{content.hero.eyebrow}</BrandTagline>
            </div>

            <HeaderSearchBar />

            <HeaderLocationBadge>
              {content.nav.locationLabel}
            </HeaderLocationBadge>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav
              aria-label="Primary"
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {content.nav.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium tracking-wide uppercase hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <HeaderDownloadAppButton href="/notify">
              {content.hero.ctaLabel}
            </HeaderDownloadAppButton>
          </div>
        </header>
      </div>

      <div
        className={`mx-auto w-full max-w-[1440px] px-6 lg:px-0 ${HEADER_TO_HERO_GAP_CLASS}`}
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

function CategoriesSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-white py-8 md:py-12">
      <Container size="full" className="max-w-[1440px]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className={homeCategoriesTitleClass}>
              {content.categories.title}
            </h2>
            <p
              className={homeCategoriesSubtitleClass}
              style={{ letterSpacing: "0px" }}
            >
              {content.categories.subtitle}
            </p>
          </div>
          <Link
            href="/c/explore-catalog"
            className="text-brand-500 text-sm font-bold md:text-base"
          >
            {content.categories.ctaLabel}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {content.categories.items.map((item) => (
            <HomeCategoryTile
              key={item.name}
              name={item.name}
              imageSrc={item.imageSrc}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function SourcingSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-white py-8 md:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-0">
        <div className={`${homeSourcingSectionFrameClass} lg:p-0`}>
          <Image
            src={dummyImages.botanicalLineArt.src}
            alt=""
            aria-hidden
            width={dummyImages.botanicalLineArt.width}
            height={dummyImages.botanicalLineArt.height}
            className={`${homeSourcingArtClass} -bottom-10 -left-10 w-[320px] lg:w-[460px]`}
          />
          <Image
            src={dummyImages.botanicalLineArt.src}
            alt=""
            aria-hidden
            width={dummyImages.botanicalLineArt.width}
            height={dummyImages.botanicalLineArt.height}
            className={`${homeSourcingArtClass} -top-10 -right-10 w-[320px] -scale-x-100 lg:w-[460px]`}
          />
          <div className={`${homeSourcingTitleClass} relative z-10`}>
            <Heading level={2} variant="h2" className="text-brand-500">
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
      </div>
    </section>
  );
}

function TestimonialsSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-white py-10 md:py-14">
      <Container size="full" className="max-w-[1440px]">
        <Heading level={2} variant="h2">
          {content.testimonials.title}
        </Heading>
        <p className="text-brand-500 font-handsome mt-1 text-[30px] leading-[26px] font-bold tracking-[0px]">
          {content.testimonials.subtitle}
        </p>
      </Container>

      <div className={homeTestimonialsGridClass} aria-label="Customer stories">
        {content.testimonials.items.map((item) => (
          <HomeTestimonialCard
            key={item.name}
            name={item.name}
            ageLabel={item.ageLabel}
            quote={item.quote}
            imageSrc={item.imageSrc}
          />
        ))}
      </div>
    </section>
  );
}

function StoreSection({ content }: Readonly<HomepageLayoutProps>) {
  return (
    <section className="bg-white py-10 md:py-14">
      <Container size="full" className="max-w-[1440px]">
        <Heading level={2} variant="h2" className="mb-6">
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
      </Container>
    </section>
  );
}
