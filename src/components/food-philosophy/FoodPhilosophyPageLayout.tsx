import Image from "next/image";
import Link from "next/link";

import { Body } from "@/components/ui/Body";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

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
      <Container size="full" className="max-w-[1440px]">
        <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm leading-[17px]">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">Our Food Philosophy</span>
        </div>

        <Heading
          level={2}
          variant="h2"
          className="mb-6 tracking-normal md:h-13.5 md:w-85.75 md:text-[36px] md:leading-[150%]"
        >
          {content.hero.title}
        </Heading>

        <div className="relative mx-auto mb-10 aspect-2720/916 overflow-hidden rounded-[10px] md:aspect-auto md:h-114.5 md:w-340">
          <Image
            src={content.hero.imageSrc}
            alt={content.hero.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
        </div>

        <div className="mb-12 grid gap-8 lg:grid-cols-[656px_640px] lg:justify-between">
          <article className="flex flex-col gap-6 lg:h-[345px] lg:w-[656px]">
            <div>
              <h3 className="font-display text-[28px] font-semibold">
                {content.sourcing.title}
              </h3>
              <p className="text-brand-500 font-handsome mt-1 text-[30px] leading-[26px] font-bold tracking-[0px]">
                {content.sourcing.subtitle}
              </p>
            </div>
            <div className="space-y-4">
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
          </article>

          <article className="flex flex-col lg:h-[345px] lg:w-[640px] lg:justify-between">
            <div>
              <h3 className="font-display text-[28px] font-semibold">
                {content.certifications.title}
              </h3>
              <p className="text-brand-500 font-handsome mt-1 text-[30px] leading-[26px] font-bold tracking-[0px]">
                {content.certifications.subtitle}
              </p>
              <Body
                size="md"
                className="mt-5 text-[18px] leading-7 tracking-normal lg:h-20.25 lg:w-160"
              >
                {content.certifications.description}
              </Body>
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
          <h3 className="font-display text-[28px] font-semibold lg:ml-2">
            {content.partnerships.title}
          </h3>
          <p className="text-brand-500 font-handsome mt-1 text-[30px] leading-[26px] font-bold tracking-[0px] lg:ml-2">
            {content.partnerships.subtitle}
          </p>

          <div className="mt-6 space-y-4">
            {content.partnerships.quotes.map((partner) => (
              <article
                key={partner.name}
                className={[
                  "grid gap-6 rounded-[10px] p-6 md:grid-cols-[1fr_1fr] md:gap-12 md:p-8 lg:mx-auto lg:h-127.5 lg:w-340 lg:grid-cols-[813px_1fr]",
                  partner.theme === "amber" && "bg-[#fdf6ea]",
                  partner.theme === "olive" && "bg-[#e9f0e2]",
                  partner.theme === "sky" && "bg-[#deeef4]",
                ].join(" ")}
              >
                <div className="relative min-h-[220px] overflow-hidden rounded-[10px] md:min-h-[320px] lg:h-109 lg:min-h-0 lg:w-203.25">
                  {"imageSrc" in partner && partner.imageSrc ? (
                    <Image
                      src={partner.imageSrc}
                      alt={`${partner.name}, ${partner.location}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div
                      className="from-text-primary/20 to-text-primary/40 size-full min-h-[220px] bg-linear-to-tr md:min-h-[320px]"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="flex flex-col justify-between gap-6">
                  <p
                    className={[
                      "font-handsome align-middle text-[40px] leading-[40px] font-bold tracking-[0px]",
                      partner.theme === "amber" && "text-[#7f581b]",
                      partner.theme === "olive" && "text-[#5a6b43]",
                      partner.theme === "sky" && "text-[#153e5a]",
                    ].join(" ")}
                  >
                    {`"${partner.quote}"`}
                  </p>
                  <div>
                    <h4 className="font-display text-[28px] font-semibold">
                      {partner.name}
                    </h4>
                    <p
                      className={[
                        "text-base",
                        partner.theme === "amber" && "text-[#7f581b]",
                        partner.theme === "olive" && "text-[#5a6b43]",
                        partner.theme === "sky" && "text-[#153e5a]",
                      ].join(" ")}
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
          <h3 className="font-display text-[28px] font-semibold">
            {content.sustainability.title}
          </h3>
          <p className="text-brand-500 font-handsome mt-2 text-[30px] leading-[26px] font-bold tracking-[0px]">
            {content.sustainability.subtitle}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="group focus-visible:ring-brand-500 text-beige-100 relative flex aspect-[629/780] min-h-[220px] flex-col justify-end overflow-hidden rounded-[10px] p-5 focus:outline-none focus-visible:ring-2 lg:aspect-auto lg:h-97.5 lg:min-h-0 lg:w-78.625"
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt=""
                      aria-hidden
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                  ) : null}

                  {/* Base scrim keeps the label legible; deepens on hover/focus. */}
                  <div
                    aria-hidden
                    className="from-text-primary/80 via-text-primary/20 absolute inset-0 bg-linear-to-t to-transparent transition-colors duration-300 group-hover:from-text-primary group-hover:via-text-primary/55 group-focus-visible:from-text-primary group-focus-visible:via-text-primary/55"
                  />

                  <div className="relative z-10">
                    <p className="font-sans text-2xl leading-tight font-semibold">
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
      </Container>
    </section>
  );
}
