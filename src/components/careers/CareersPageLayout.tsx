import Image from "next/image";
import Link from "next/link";

import {
  careersHeroBodyClass,
  careersHeroCopyClass,
  careersHeroImageClass,
  careersHeroImageMediaClass,
  careersHeroParagraphsClass,
  careersHeroSectionClass,
  careersHeroSubtitleClass,
  careersPageTitleClass,
} from "@/components/careers/careers-page";
import { PageShell } from "@/components/layout/PageShell";

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
      <PageShell>
        <div className="text-text-secondary mb-4 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">Careers</span>
        </div>

        <h1 className={careersPageTitleClass}>{content.hero.title}</h1>

        <section className={careersHeroSectionClass}>
          <div className={careersHeroCopyClass}>
            <h2 className={careersHeroSubtitleClass}>{content.hero.subtitle}</h2>
            <div className={careersHeroParagraphsClass}>
              {content.hero.paragraphs.map((paragraph) => (
                <p key={paragraph} className={careersHeroBodyClass}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className={careersHeroImageClass}>
            <Image
              src={content.hero.bannerSrc}
              alt={content.hero.bannerAlt}
              fill
              priority
              className={careersHeroImageMediaClass}
              sizes="(max-width: 1024px) 361px, 50vw"
            />
          </div>
        </section>

        <CareerOpenings openings={content.openings} />
      </PageShell>
    </section>
  );
}
