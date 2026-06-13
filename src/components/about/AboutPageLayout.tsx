import Image from "next/image";
import Link from "next/link";

import {
  aboutHeroBannerDesktopClass,
  aboutHeroBannerImageClass,
  aboutHeroBannerOuterClass,
  aboutHeroBannerShellClass,
  aboutPageBreadcrumbClass,
  aboutPageTitleClass,
  aboutStoryBodyClass,
  aboutStoryParagraphsClass,
  ABOUT_MISSION_BG_IMAGE_WEB,
  aboutMissionBgImageClass,
  aboutMissionBodyClass,
  aboutMissionCardClass,
  aboutMissionCardContentClass,
  aboutMissionSectionClass,
  aboutMissionSectionInsetClass,
  aboutCoreValuesCardClass,
  aboutCoreValuesCardImageClass,
  aboutCoreValuesCardLabelClass,
  aboutCoreValuesCardLabelWrapClass,
  aboutCoreValuesGridClass,
  aboutCoreValuesSectionClass,
  aboutCoreValuesSubtitleClass,
  aboutCoreValuesTitleClass,
  aboutMissionTitleClass,
  aboutStorySubtitleClass,
  aboutStoryTitleClass,
} from "@/components/about/about-page";
import { HomeTestimonialsCarousel } from "@/components/homepage/HomeTestimonialsCarousel";
import {
  homeTestimonialsStoriesSectionClass,
  homeTestimonialsSubtitleClass,
  homeTestimonialsTitleClass,
} from "@/components/homepage/home-testimonials";
import { PageShell } from "@/components/layout/PageShell";

import type { AboutPageContent } from "@/features/cms-content/about-freshterra-types";

type AboutPageLayoutProps = {
  content: AboutPageContent;
};

export function AboutPageLayout({ content }: Readonly<AboutPageLayoutProps>) {
  const heroBannerMobile =
    content.hero?.bannerSrcMobile ?? content.hero?.bannerSrc;
  const showMobileHero = Boolean(heroBannerMobile);
  const showDesktopHero = Boolean(content.hero?.bannerSrc);
  const showStory = Boolean(
    content.story?.title ||
      content.story?.subtitle ||
      (content.story?.paragraphs.length ?? 0) > 0,
  );
  const showMissionCard = Boolean(
    content.mission?.title || content.mission?.description,
  );
  const showCoreValues = (content.coreValues?.items.length ?? 0) > 0;
  const showCustomerStories = (content.customerStories?.items.length ?? 0) > 0;

  return (
    <section className="text-text-primary bg-white pt-8 pb-0 md:pt-10">
      <PageShell>
        <nav aria-label="Breadcrumb" className={aboutPageBreadcrumbClass}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">About FreshTerra</span>
        </nav>

        {content.hero?.title ? (
          <h1 className={aboutPageTitleClass}>{content.hero.title}</h1>
        ) : null}
      </PageShell>

      {showMobileHero ? (
        <div className={aboutHeroBannerShellClass}>
          <div className={aboutHeroBannerOuterClass}>
            <Image
              src={heroBannerMobile!}
              alt={content.hero?.bannerAlt ?? content.hero?.title ?? "About FreshTerra"}
              fill
              priority
              className={aboutHeroBannerImageClass}
              sizes="(max-width: 1024px) 393px, 775px"
            />
          </div>
        </div>
      ) : null}

      <PageShell>
        {showDesktopHero || showStory ? (
          <section className="grid min-w-0 gap-8 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-10">
            {showDesktopHero ? (
              <div className={aboutHeroBannerDesktopClass}>
                <Image
                  src={content.hero!.bannerSrc!}
                  alt={
                    content.hero?.bannerAlt ??
                    content.hero?.title ??
                    "About FreshTerra"
                  }
                  fill
                  priority
                  className={aboutHeroBannerImageClass}
                  sizes="(max-width: 775px) 100vw, 775px"
                />
              </div>
            ) : null}

            {showStory ? (
              <article>
                {content.story?.title ? (
                  <h2 className={aboutStoryTitleClass}>{content.story.title}</h2>
                ) : null}
                {content.story?.subtitle ? (
                  <p className={aboutStorySubtitleClass}>
                    {content.story.subtitle}
                  </p>
                ) : null}
                {content.story?.paragraphs.length ? (
                  <div className={aboutStoryParagraphsClass}>
                    {content.story.paragraphs.map((paragraph) => (
                      <p key={paragraph} className={aboutStoryBodyClass}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}
          </section>
        ) : null}

        {showMissionCard ? (
          <section className={aboutMissionSectionClass} aria-label="Our Mission">
            <div className={aboutMissionSectionInsetClass}>
              <div className={aboutMissionCardClass}>
                <Image
                  src={ABOUT_MISSION_BG_IMAGE_WEB}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 768px) 100vw, 1360px"
                  className={`${aboutMissionBgImageClass} z-0 hidden md:block`}
                />
                <div className={aboutMissionCardContentClass}>
                  {content.mission?.title ? (
                    <h2 className={aboutMissionTitleClass}>
                      {content.mission.title}
                    </h2>
                  ) : null}
                  {content.mission?.description ? (
                    <p className={aboutMissionBodyClass}>
                      {content.mission.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {showCoreValues ? (
          <section
            className={aboutCoreValuesSectionClass}
            aria-labelledby="about-core-values-heading"
          >
            {content.coreValues?.title ? (
              <h2
                id="about-core-values-heading"
                className={aboutCoreValuesTitleClass}
              >
                {content.coreValues.title}
              </h2>
            ) : null}
            {content.coreValues?.subtitle ? (
              <p className={aboutCoreValuesSubtitleClass}>
                {content.coreValues.subtitle}
              </p>
            ) : null}

            <div className={aboutCoreValuesGridClass}>
              {content.coreValues!.items.map((item) => (
                <article
                  key={item.imageSrc}
                  aria-label={item.label || "Core value"}
                  // Decorative card is intentionally focusable so keyboard users
                  // get the focus-visible ring and hover/focus image effect.
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex={0}
                  className={aboutCoreValuesCardClass}
                >
                  <Image
                    src={item.imageSrc}
                    alt=""
                    aria-hidden
                    fill
                    className={aboutCoreValuesCardImageClass}
                    sizes="(max-width: 768px) 172px, (max-width: 1024px) 33vw, 25vw"
                  />

                  <div
                    aria-hidden
                    className="from-text-primary/80 via-text-primary/20 absolute inset-0 bg-linear-to-t to-transparent transition-colors duration-300 group-hover:from-text-primary group-hover:via-text-primary/55 group-focus-visible:from-text-primary group-focus-visible:via-text-primary/55"
                  />

                  <div className={aboutCoreValuesCardLabelWrapClass}>
                    {item.label ? (
                      <p className={aboutCoreValuesCardLabelClass}>{item.label}</p>
                    ) : null}
                    {item.description ? (
                      <p className="text-beige-100/90 mt-0 max-h-0 overflow-hidden text-sm leading-6 opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:max-h-48 group-hover:opacity-100 group-focus-visible:mt-3 group-focus-visible:max-h-48 group-focus-visible:opacity-100">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {showCustomerStories ? (
          <section
            className={homeTestimonialsStoriesSectionClass}
            aria-labelledby="about-stories-heading"
          >
            {content.customerStories?.title ? (
              <h2
                id="about-stories-heading"
                className={homeTestimonialsTitleClass}
              >
                {content.customerStories.title}
              </h2>
            ) : null}
            {content.customerStories?.subtitle ? (
              <p className={homeTestimonialsSubtitleClass}>
                {content.customerStories.subtitle}
              </p>
            ) : null}

            <div className="relative left-1/2 w-screen -translate-x-1/2">
              <HomeTestimonialsCarousel items={content.customerStories!.items} />
            </div>
          </section>
        ) : null}
      </PageShell>
    </section>
  );
}
