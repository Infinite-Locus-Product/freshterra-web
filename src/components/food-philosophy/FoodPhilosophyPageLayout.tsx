import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  foodPhilosophyHeroBannerImageClass,
  foodPhilosophyHeroBannerOuterClass,
  foodPhilosophyHeroBannerShellClass,
  foodPhilosophyPageTitleClass,
  foodPhilosophyCertificationsBodyClass,
  foodPhilosophyCertificationsSubtitleClass,
  foodPhilosophyCertificationsTitleClass,
  foodPhilosophyPartnershipCardClass,
  foodPhilosophyPartnershipCardMediaClass,
  foodPhilosophyPartnershipCardCopyClass,
  foodPhilosophyPartnershipCardMediaImageClass,
  foodPhilosophyPartnershipLocationClass,
  foodPhilosophyPartnershipNameClass,
  foodPhilosophyPartnershipQuoteClass,
  foodPhilosophyPartnershipThemeTextClass,
  foodPhilosophyPartnershipsStackClass,
  foodPhilosophyPartnershipsSubtitleClass,
  foodPhilosophyPartnershipsTitleClass,
  foodPhilosophySourcingBodyClass,
  foodPhilosophySourcingSubtitleClass,
  foodPhilosophySourcingTitleClass,
  foodPhilosophySustainabilityCardClass,
  foodPhilosophySustainabilityCardImageClass,
  foodPhilosophySustainabilityCardLabelClass,
  foodPhilosophySustainabilityCardLabelWrapClass,
  foodPhilosophySustainabilityGridClass,
  foodPhilosophySustainabilitySubtitleClass,
  foodPhilosophySustainabilityTitleClass,
} from "@/components/food-philosophy/food-philosophy-page";
import { PageShell } from "@/components/layout/PageShell";

import type { FoodPhilosophyDraftContent } from "@/features/cms-content/food-philosophy";

type FoodPhilosophyPageLayoutProps = {
  content: FoodPhilosophyDraftContent;
};

export function FoodPhilosophyPageLayout({
  content,
}: Readonly<FoodPhilosophyPageLayoutProps>) {
  return (
    <section className="text-text-primary bg-white">
      <PhilosophyBody content={content} />
    </section>
  );
}

function PhilosophyBody({ content }: Readonly<FoodPhilosophyPageLayoutProps>) {
  return (
    <section className="bg-white pt-8 pb-8 md:pt-10 md:pb-29.25">
      <PageShell>
        <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm leading-[17px]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">Our Food Philosophy</span>
        </div>

        <h1 className={foodPhilosophyPageTitleClass}>{content.hero.title}</h1>
      </PageShell>

      <div className={foodPhilosophyHeroBannerShellClass}>
        <div className={foodPhilosophyHeroBannerOuterClass}>
          <Image
            src={content.hero.imageSrc}
            alt={content.hero.imageAlt}
            fill
            priority
            className={foodPhilosophyHeroBannerImageClass}
            sizes="(max-width: 768px) 393px, (max-width: 1440px) 100vw, 1440px"
          />
        </div>
      </div>

      <PageShell>

        <div className="mb-12 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,41rem)_minmax(0,40rem)] lg:justify-between">
          <article className="flex min-w-0 flex-col gap-6">
            <div>
              <h2 className={foodPhilosophySourcingTitleClass}>
                {content.sourcing.title}
              </h2>
              <p className={foodPhilosophySourcingSubtitleClass}>
                {content.sourcing.subtitle}
              </p>
            </div>
            <div className="space-y-4">
              {content.sourcing.paragraphs.map((paragraph) => (
                <p key={paragraph} className={foodPhilosophySourcingBodyClass}>
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <article className="flex min-w-0 flex-col lg:justify-between">
            <div>
              <h2 className={foodPhilosophyCertificationsTitleClass}>
                {content.certifications.title}
              </h2>
              <p className={foodPhilosophyCertificationsSubtitleClass}>
                {content.certifications.subtitle}
              </p>
              <p className={foodPhilosophyCertificationsBodyClass}>
                {content.certifications.description}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {content.certifications.items.map((item) => {
                const label = item.label;
                const imageSrc = "imageSrc" in item ? item.imageSrc : undefined;

                return (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-3 text-center md:h-36.25 md:w-30"
                  >
                    <div className="relative size-20 md:size-24">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={label}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      ) : (
                        <div
                          className="from-brand-100 to-cream-50 size-full rounded-full bg-linear-to-b"
                          aria-hidden
                        />
                      )}
                    </div>
                    <p className="text-sm font-bold md:h-5.25 md:w-29.25">{label}</p>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <section className="mb-12">
          <h2 className={foodPhilosophyPartnershipsTitleClass}>
            {content.partnerships.title}
          </h2>
          <p className={foodPhilosophyPartnershipsSubtitleClass}>
            {content.partnerships.subtitle}
          </p>

          {/*
            Sticky card stack: each card pins via `position: sticky` at an
            incrementally larger `top`, so as the user scrolls the next card
            climbs up and overlaps the previous one (which stays pinned, never
            fades or scales). Newer cards sit above older ones via z-index.
            `--stack-top` / `--stack-peek` are tuned per breakpoint so the
            pinned cards stay in view on shorter mobile/tablet viewports.
          */}
          <div className={foodPhilosophyPartnershipsStackClass}>
            {content.partnerships.quotes.map((partner, index) => (
              <article
                key={partner.name}
                style={{
                  top: `calc(var(--stack-top) + ${index} * var(--stack-peek))`,
                  zIndex: index + 1,
                }}
                className={cn(
                  foodPhilosophyPartnershipCardClass,
                  partner.theme === "amber" && "bg-[#fdf6ea]",
                  partner.theme === "olive" && "bg-[#e9f0e2]",
                  partner.theme === "sky" && "bg-[#deeef4]",
                )}
              >
                <div className={foodPhilosophyPartnershipCardMediaClass}>
                  {"imageSrc" in partner && partner.imageSrc ? (
                    <Image
                      src={partner.imageSrc}
                      alt={`${partner.name}, ${partner.location}`}
                      fill
                      className={foodPhilosophyPartnershipCardMediaImageClass}
                      sizes="(max-width: 768px) 328px, 50vw"
                    />
                  ) : (
                    <div
                      className="from-text-primary/20 to-text-primary/40 size-full min-h-0 bg-linear-to-tr md:min-h-[320px]"
                      aria-hidden
                    />
                  )}
                </div>
                <div className={foodPhilosophyPartnershipCardCopyClass}>
                  <p
                    className={cn(
                      foodPhilosophyPartnershipQuoteClass,
                      foodPhilosophyPartnershipThemeTextClass[partner.theme],
                    )}
                  >
                    {`"${partner.quote}"`}
                  </p>
                  <div>
                    <h3 className={foodPhilosophyPartnershipNameClass}>
                      {partner.name}
                    </h3>
                    <p
                      className={cn(
                        foodPhilosophyPartnershipLocationClass,
                        foodPhilosophyPartnershipThemeTextClass[partner.theme],
                      )}
                    >
                      {partner.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className={foodPhilosophySustainabilityTitleClass}>
            {content.sustainability.title}
          </h2>
          <p className={foodPhilosophySustainabilitySubtitleClass}>
            {content.sustainability.subtitle}
          </p>

          <div className={foodPhilosophySustainabilityGridClass}>
            {content.sustainability.items.map((item) => {
              const label = item.label;
              const imageSrc = "imageSrc" in item ? item.imageSrc : undefined;
              const description =
                "description" in item ? item.description : undefined;

              return (
                <article
                  key={label}
                  aria-label={label}
                  // Card is intentionally focusable so keyboard users can
                  // reveal the description shown on hover/focus.
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex={0}
                  className={foodPhilosophySustainabilityCardClass}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt=""
                      aria-hidden
                      fill
                      className={foodPhilosophySustainabilityCardImageClass}
                      sizes="(max-width: 768px) 172px, (max-width: 1280px) 50vw, 25vw"
                    />
                  ) : null}

                  {/* Base scrim keeps the label legible; deepens on hover/focus. */}
                  <div
                    aria-hidden
                    className="from-text-primary/80 via-text-primary/20 absolute inset-0 bg-linear-to-t to-transparent transition-colors duration-300 group-hover:from-text-primary group-hover:via-text-primary/55 group-focus-visible:from-text-primary group-focus-visible:via-text-primary/55"
                  />

                  <div className={foodPhilosophySustainabilityCardLabelWrapClass}>
                    <p className={foodPhilosophySustainabilityCardLabelClass}>
                      {label}
                    </p>
                    {description ? (
                      <p className="text-beige-100/90 mt-0 max-h-0 overflow-hidden text-sm leading-6 opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:max-h-48 group-hover:opacity-100 group-focus-visible:mt-3 group-focus-visible:max-h-48 group-focus-visible:opacity-100">
                        {description}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </PageShell>
    </section>
  );
}
