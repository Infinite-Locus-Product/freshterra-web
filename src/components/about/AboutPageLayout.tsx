import Image from "next/image";
import Link from "next/link";

import { HomeTestimonialsCarousel } from "@/components/homepage/HomeTestimonialsCarousel";
import { Body } from "@/components/ui/Body";
import {
  BODY_MD_CLASS,
  SECTION_SUBTITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/components/layout/layout-classes";
import { PageShell } from "@/components/layout/PageShell";
import { Heading } from "@/components/ui/Heading";

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

        <Heading
          level={1}
          variant="h2"
          className="mb-[1.40625rem] max-w-[18rem] opacity-100"
        >
          {content.hero.title}
        </Heading>

        <section className="grid min-w-0 gap-8 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-10">
          <div className="relative aspect-[775/456] w-full max-w-[48.4375rem] overflow-hidden rounded-[0.625rem]">
            <Image
              src={content.hero.bannerSrc}
              alt={content.hero.bannerAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 775px) 100vw, 775px"
            />
          </div>

          <article>
            <h2 className={SECTION_TITLE_CLASS}>{content.story.title}</h2>
            <p className={SECTION_SUBTITLE_CLASS}>{content.story.subtitle}</p>
            <div className="mt-6 space-y-4">
              {content.story.paragraphs.map((paragraph) => (
                <Body key={paragraph} size="md" className={BODY_MD_CLASS}>
                  {paragraph}
                </Body>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 md:mt-12" aria-label="Our Mission">
          <div className="relative aspect-[1360/313] w-full overflow-hidden rounded-[0.625rem]">
            <Image
              src={content.missionBanner.src}
              alt={content.missionBanner.alt}
              fill
              className="object-cover object-center"
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
            className={SECTION_TITLE_CLASS}
          >
            {content.coreValues.title}
          </h2>
          <p className={SECTION_SUBTITLE_CLASS}>
            {content.coreValues.subtitle}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {content.coreValues.items.map((item) => (
              <article
                key={item.label}
                aria-label={item.label}
                // Decorative card is intentionally focusable so keyboard users
                // get the focus-visible ring and hover/focus image effect.
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                className="group focus-visible:ring-brand-500 text-beige-100 relative flex h-97.5 w-78.5 flex-col justify-end overflow-hidden rounded-sm p-5 focus:outline-none focus-visible:ring-2"
              >
                <Image
                  src={item.imageSrc}
                  alt=""
                  aria-hidden
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Base scrim keeps the label legible; deepens on hover/focus. */}
                <div
                  aria-hidden
                  className="from-text-primary/80 via-text-primary/20 absolute inset-0 bg-linear-to-t to-transparent transition-colors duration-300 group-hover:from-text-primary group-hover:via-text-primary/55 group-focus-visible:from-text-primary group-focus-visible:via-text-primary/55"
                />

                <div className="relative z-10">
                  <p className="font-sans text-2xl leading-tight font-semibold">
                    {item.label}
                  </p>
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
            className={SECTION_TITLE_CLASS}
          >
            {content.customerStories.title}
          </h2>
          <p className={SECTION_SUBTITLE_CLASS}>
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
