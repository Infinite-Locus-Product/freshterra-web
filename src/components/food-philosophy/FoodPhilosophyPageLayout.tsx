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
    <section className="bg-white py-8 md:py-10">
      <Container size="full" className="max-w-[1440px]">
        <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">Our Food Philosophy</span>
        </div>

        <Heading level={2} variant="h2" className="mb-6">
          {content.hero.title}
        </Heading>

        <div className="from-brand-600/95 to-brand-500/85 relative mb-10 overflow-hidden rounded-[10px] bg-linear-to-r px-6 py-12 md:px-10 md:py-16">
          <div className="bg-brand-100/15 absolute -right-8 -bottom-10 size-56 rounded-full md:size-72" />
          <p className="text-beige-100 font-display relative z-10 text-4xl italic md:text-6xl">
            FreshTerra
          </p>
        </div>

        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          <article>
            <h3 className="font-display text-[28px] font-semibold">
              {content.sourcing.title}
            </h3>
            <p className="text-brand-500 font-display mt-1 text-2xl italic md:text-3xl">
              {content.sourcing.subtitle}
            </p>
            <div className="mt-5 space-y-4">
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

          <article>
            <h3 className="font-display text-[28px] font-semibold">
              {content.certifications.title}
            </h3>
            <p className="text-brand-500 font-display mt-1 text-2xl italic md:text-3xl">
              {content.certifications.subtitle}
            </p>
            <Body
              size="md"
              className="mt-5 text-[18px] leading-7 tracking-normal"
            >
              {content.certifications.description}
            </Body>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {content.certifications.items.map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div className="from-brand-100 to-cream-50 size-20 rounded-full bg-linear-to-b md:size-24" />
                  <p className="text-sm font-bold">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <section className="mb-12">
          <h3 className="font-display text-[28px] font-semibold">
            {content.partnerships.title}
          </h3>
          <p className="text-brand-500 font-display mt-1 text-2xl italic md:text-3xl">
            {content.partnerships.subtitle}
          </p>

          <div className="mt-6 space-y-4">
            {content.partnerships.quotes.map((partner) => (
              <article
                key={partner.name}
                className={[
                  "grid gap-6 rounded-[10px] p-6 md:grid-cols-[1fr_1fr] md:gap-10 md:p-8",
                  partner.theme === "amber" && "bg-[#fdf6ea]",
                  partner.theme === "olive" && "bg-[#e9f0e2]",
                  partner.theme === "sky" && "bg-[#deeef4]",
                ].join(" ")}
              >
                <div className="from-text-primary/20 to-text-primary/40 min-h-[220px] rounded-[10px] bg-linear-to-tr md:min-h-[320px]" />
                <div className="flex flex-col justify-between gap-6">
                  <p
                    className={[
                      "font-display text-[28px] leading-tight italic md:text-[36px]",
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
          <p className="text-brand-500 font-display mt-1 text-2xl italic md:text-3xl">
            {content.sustainability.subtitle}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {content.sustainability.items.map((item) => (
              <article
                key={item}
                className="from-text-primary/45 to-text-primary/70 text-beige-100 flex min-h-[220px] items-end rounded-[10px] bg-linear-to-t p-5"
              >
                <p className="font-sans text-2xl leading-tight font-semibold">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </section>
  );
}
