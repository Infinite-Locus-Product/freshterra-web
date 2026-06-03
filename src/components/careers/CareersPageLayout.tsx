import Image from "next/image";
import Link from "next/link";

import { Body } from "@/components/ui/Body";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

import type { CareersPageDraftContent } from "@/features/cms-content/careers";

import { CareerOpenings } from "./CareerOpenings";

type CareersPageLayoutProps = {
  content: CareersPageDraftContent;
};

export function CareersPageLayout({
  content,
}: Readonly<CareersPageLayoutProps>) {
  return (
    <section className="text-text-primary bg-white py-8 md:py-10">
      <Container size="full" className="max-w-[1440px]">
        <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">Careers</span>
        </div>

        <Heading
          level={1}
          variant="h2"
          className="mb-6 tracking-normal md:text-[36px] md:leading-[150%]"
        >
          {content.hero.title}
        </Heading>

        <section className="mb-14 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-[18.5px]">
          <div>
            <h2 className="mb-4 font-sans text-[32px] leading-tight font-bold tracking-normal md:text-[20px] md:leading-[130%]">
              {content.hero.subtitle}
            </h2>
            <div className="space-y-5">
              {content.hero.paragraphs.map((paragraph) => (
                <Body
                  key={paragraph}
                  size="md"
                  className="text-[18px] leading-7 tracking-normal"
                >
                  {paragraph}
                </Body>
              ))}
            </div>
          </div>

          <div className="relative aspect-[667.923/457] min-h-75 overflow-hidden rounded-sm md:aspect-auto md:h-114.25 md:w-[667.9px]">
            <Image
              src={content.hero.bannerSrc}
              alt={content.hero.bannerAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </section>

        <CareerOpenings openings={content.openings} />
      </Container>
    </section>
  );
}
