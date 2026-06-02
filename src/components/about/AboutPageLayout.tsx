import Image from "next/image";
import Link from "next/link";

import { Body } from "@/components/ui/Body";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

import type { AboutPageDraftContent } from "@/features/cms-content/about";

type AboutPageLayoutProps = {
  content: AboutPageDraftContent;
};

export function AboutPageLayout({ content }: Readonly<AboutPageLayoutProps>) {
  return (
    <section className="text-text-primary bg-white py-8 md:py-10">
      <Container size="full" className="max-w-[1440px]">
        <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">About FreshTerra</span>
        </div>

        <Heading level={1} variant="h2" className="mb-8 md:mb-10">
          {content.hero.title}
        </Heading>

        <section className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-10">
          <div className="relative aspect-[775/456] w-full max-w-[775px] overflow-hidden rounded-[10px]">
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
            <h2 className="font-display text-[28px] font-semibold">
              {content.story.title}
            </h2>
            <p className="text-brand-500 font-handsome mt-1 text-[30px] leading-[26px] font-bold tracking-[0px]">
              {content.story.subtitle}
            </p>
            <div className="mt-5 space-y-4">
              {content.story.paragraphs.map((paragraph) => (
                <Body
                  key={paragraph}
                  size="md"
                  className="text-[18px] leading-7 tracking-normal"
                >
                  {paragraph}
                </Body>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-10 md:mt-12" aria-label="Our Mission">
          <div className="relative aspect-[1024/235] w-full overflow-hidden rounded-[10px]">
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
          className="mt-10 md:mt-12"
          aria-labelledby="about-core-values-heading"
        >
          <h2
            id="about-core-values-heading"
            className="font-display text-[28px] font-semibold"
          >
            {content.coreValues.title}
          </h2>
          <p className="text-brand-500 font-handsome mt-1 text-[30px] leading-[26px] font-bold tracking-[0px]">
            {content.coreValues.subtitle}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            {content.coreValues.items.map((item) => (
              <article
                key={item.label}
                aria-label={item.label}
                tabIndex={0}
                className="group focus-visible:ring-brand-500 text-beige-100 relative flex aspect-[628/780] w-full flex-col justify-end overflow-hidden rounded-[10px] p-5 focus:outline-none focus-visible:ring-2"
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
          className="mt-12 md:mt-16"
          aria-labelledby="about-stories-heading"
        >
          <h2
            id="about-stories-heading"
            className="font-display text-[28px] font-semibold"
          >
            {content.customerStories.title}
          </h2>
          <p className="text-brand-500 font-handsome mt-1 text-[30px] leading-[26px] font-bold tracking-[0px]">
            {content.customerStories.subtitle}
          </p>

          <div className="mt-6 md:relative md:left-1/2 md:w-screen md:-translate-x-1/2 md:overflow-hidden">
            <div
              className="flex snap-x gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-[330px_minmax(520px,776px)_330px] md:justify-center md:overflow-visible md:pb-0"
              aria-label="Customer stories"
            >
              {content.customerStories.items.map((story) => (
                <article
                  key={story.name}
                  className="relative h-[360px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-[10px] md:h-[455px] md:w-full"
                >
                  <Image
                    src={story.imageSrc}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 82vw, (max-width: 1440px) 54vw, 760px"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-8">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl leading-tight">
                        {story.name}
                      </h3>
                      <p className="mt-1 text-sm text-white/90">
                        {story.ageLabel}
                      </p>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/95 md:text-base">
                        {`"${story.quote}"`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="onImage"
                      className="size-12 shrink-0 rounded-full border border-white/40 p-0 text-lg"
                      aria-label={`Play testimonial from ${story.name}`}
                    >
                      <span aria-hidden>▶</span>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </section>
  );
}
