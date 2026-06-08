import Image from "next/image";
import Link from "next/link";

import {
  aboutHeroBannerDesktopClass,
  aboutHeroBannerImageClass,
  aboutHeroBannerOuterClass,
  aboutHeroBannerShellClass,
  aboutPageTitleClass,
  aboutStoryBodyClass,
  aboutStoryParagraphsClass,
  aboutMissionBannerDesktopClass,
  aboutMissionBannerImageClass,
  aboutMissionBodyClass,
  aboutMissionCardClass,
  aboutMissionSectionClass,
  aboutCoreValuesCardClass,
  aboutCoreValuesCardImageClass,
  aboutCoreValuesCardLabelClass,
  aboutCoreValuesCardLabelWrapClass,
  aboutCoreValuesGridClass,
  aboutCoreValuesSubtitleClass,
  aboutCoreValuesTitleClass,
  aboutMissionTitleClass,
  aboutStorySubtitleClass,
  aboutStoryTitleClass,
} from "@/components/about/about-page";
import { HomeTestimonialsCarousel } from "@/components/homepage/HomeTestimonialsCarousel";
import {
  homeTestimonialsSubtitleClass,
  homeTestimonialsTitleClass,
} from "@/components/homepage/home-testimonials";
import { PageShell } from "@/components/layout/PageShell";

import type { AboutPageDraftContent } from "@/features/cms-content/about";

type AboutPageLayoutProps = {
  content: AboutPageDraftContent;
};

export function AboutPageLayout({ content }: Readonly<AboutPageLayoutProps>) {
  return (
    <section className="text-text-primary bg-white pt-8 pb-0 md:pt-10">
      <PageShell>
        <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">About FreshTerra</span>
        </div>

        <h1 className={aboutPageTitleClass}>{content.hero.title}</h1>
      </PageShell>

      <div className={aboutHeroBannerShellClass}>
        <div className={aboutHeroBannerOuterClass}>
          <Image
            src={content.hero.bannerSrc}
            alt={content.hero.bannerAlt}
            fill
            priority
            className={aboutHeroBannerImageClass}
            sizes="(max-width: 1024px) 393px, 775px"
          />
        </div>
      </div>

      <PageShell>
        <section className="grid min-w-0 gap-8 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-10">
          <div className={aboutHeroBannerDesktopClass}>
            <Image
              src={content.hero.bannerSrc}
              alt={content.hero.bannerAlt}
              fill
              priority
              className={aboutHeroBannerImageClass}
              sizes="(max-width: 775px) 100vw, 775px"
            />
          </div>

          <article>
            <h2 className={aboutStoryTitleClass}>{content.story.title}</h2>
            <p className={aboutStorySubtitleClass}>{content.story.subtitle}</p>
            <div className={aboutStoryParagraphsClass}>
              {content.story.paragraphs.map((paragraph) => (
                <p key={paragraph} className={aboutStoryBodyClass}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </section>

        <section className={aboutMissionSectionClass} aria-label="Our Mission">
          <div className={aboutMissionCardClass}>
            <h2 className={aboutMissionTitleClass}>{content.mission.title}</h2>
            <p className={aboutMissionBodyClass}>{content.mission.description}</p>
          </div>
          <div className={aboutMissionBannerDesktopClass}>
            <Image
              src={content.missionBanner.src}
              alt={content.missionBanner.alt}
              fill
              className={aboutMissionBannerImageClass}
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>
        </section>

        <section
          className="mt-18"
          aria-labelledby="about-core-values-heading"
        >
          <h2
            id="about-core-values-heading"
            className={aboutCoreValuesTitleClass}
          >
            {content.coreValues.title}
          </h2>
          <p className={aboutCoreValuesSubtitleClass}>
            {content.coreValues.subtitle}
          </p>

          <div className={aboutCoreValuesGridClass}>
            {content.coreValues.items.map((item) => (
              <article
                key={item.label}
                aria-label={item.label}
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

                {/* Base scrim keeps the label legible; deepens on hover/focus. */}
                <div
                  aria-hidden
                  className="from-text-primary/80 via-text-primary/20 absolute inset-0 bg-linear-to-t to-transparent transition-colors duration-300 group-hover:from-text-primary group-hover:via-text-primary/55 group-focus-visible:from-text-primary group-focus-visible:via-text-primary/55"
                />

                <div className={aboutCoreValuesCardLabelWrapClass}>
                  <p className={aboutCoreValuesCardLabelClass}>{item.label}</p>
                  <p className="text-beige-100/90 mt-0 max-h-0 overflow-hidden text-sm leading-6 opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:max-h-48 group-hover:opacity-100 group-focus-visible:mt-3 group-focus-visible:max-h-48 group-focus-visible:opacity-100">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-18"
          aria-labelledby="about-stories-heading"
        >
          <h2
            id="about-stories-heading"
            className={homeTestimonialsTitleClass}
          >
            {content.customerStories.title}
          </h2>
          <p className={homeTestimonialsSubtitleClass}>
            {content.customerStories.subtitle}
          </p>

          {/* Full-bleed so the carousel can center cards across the viewport,
              matching the homepage testimonials behavior. */}
          <div className="relative left-1/2 w-screen -translate-x-1/2">
            <HomeTestimonialsCarousel items={content.customerStories.items} />
          </div>
        </section>
      </PageShell>
    </section>
  );
}
