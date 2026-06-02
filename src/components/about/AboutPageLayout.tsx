import Link from "next/link";

import { Body } from "@/components/ui/Body";
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

        <Heading level={1} variant="h2" className="mb-2">
          {content.hero.title}
        </Heading>
        <p className="text-brand-500 font-display text-2xl italic md:text-3xl">
          {content.hero.subtitle}
        </p>
        <Body
          size="md"
          className="mt-3 max-w-3xl text-[18px] leading-7 tracking-normal"
        >
          {content.hero.tagline}
        </Body>

        <div className="from-brand-600/95 to-brand-500/85 relative mt-8 overflow-hidden rounded-[10px] px-6 py-12 md:px-10 md:py-16">
          <div
            aria-hidden
            className="bg-brand-100/15 absolute -right-8 -bottom-10 size-56 rounded-full md:size-72"
          />
          <p className="text-beige-100 font-display relative z-10 text-4xl italic md:text-6xl">
            FreshTerra
          </p>
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <article>
            <h2 className="font-display text-[28px] font-semibold">
              {content.story.title}
            </h2>
            <p className="text-brand-500 font-display mt-1 text-2xl italic md:text-3xl">
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

          <article>
            <h2 className="font-display text-[28px] font-semibold">
              {content.mission.title}
            </h2>
            <div className="mt-5 space-y-4">
              {content.mission.items.map((item) => (
                <div
                  key={item.title}
                  className="bg-brand-100/40 rounded-[10px] p-5"
                >
                  <h3 className="text-[20px] font-bold">{item.title}</h3>
                  <Body
                    size="md"
                    className="mt-2 text-[18px] leading-7 tracking-normal"
                  >
                    {item.description}
                  </Body>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-[28px] font-semibold">
            {content.milestones.title}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {content.milestones.events.map((event) => (
              <article
                key={event.year}
                className="border-brand-100 rounded-[10px] border p-5"
              >
                <p className="text-brand-500 text-2xl font-bold">
                  {event.year}
                </p>
                <Body
                  size="md"
                  className="mt-2 text-[18px] leading-7 tracking-normal"
                >
                  {event.text}
                </Body>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-[28px] font-semibold">
            {content.team.title}
          </h2>
          <p className="text-brand-500 font-display mt-1 text-2xl italic md:text-3xl">
            {content.team.subtitle}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {content.team.members.map((member) => (
              <article
                key={member.name}
                className="from-text-primary/45 to-text-primary/70 text-beige-100 rounded-[10px] bg-linear-to-t p-5"
              >
                <div
                  className="mb-4 size-16 rounded-full bg-white/20"
                  aria-hidden
                />
                <h3 className="font-display text-3xl">{member.name}</h3>
                <p className="mt-1 text-base">{member.role}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </section>
  );
}
