import Link from "next/link";

import {
  careersHeroBodyClass,
  careersHeroCopyClass,
  careersHeroImageClass,
  careersHeroImageMediaClass,
  careersHeroParagraphsClass,
  careersHeroSectionClass,
  careersBreadcrumbClass,
  careersHeroSubtitleClass,
  careersPageSectionClass,
  careersPageTitleClass,
} from "@/components/careers/careers-page";
import { PageShell } from "@/components/layout/PageShell";

import type { CareersPageContent } from "@/features/cms-content/career-types";

import { CareerOpenings } from "./CareerOpenings";

type CareersPageLayoutProps = {
  content: CareersPageContent;
};

export function CareersPageLayout({
  content,
}: Readonly<CareersPageLayoutProps>) {
  const heroImage = content.hero.bannerSrc || content.hero.bannerSrcMobile;
  const heroImageMobile = content.hero.bannerSrcMobile ?? content.hero.bannerSrc;

  return (
    <section className={careersPageSectionClass}>
      <PageShell>
        <div className={careersBreadcrumbClass}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">Careers</span>
        </div>

        <h1 className={careersPageTitleClass}>{content.hero.title}</h1>

        <section className={careersHeroSectionClass}>
          <div className={careersHeroCopyClass}>
            {content.hero.subtitle ? (
              <h2 className={careersHeroSubtitleClass}>{content.hero.subtitle}</h2>
            ) : null}
            {content.hero.paragraphs.length > 0 ? (
              <div className={careersHeroParagraphsClass}>
                {content.hero.paragraphs.map((paragraph) => (
                  <p key={paragraph} className={careersHeroBodyClass}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
          </div>

          {heroImage ? (
            <div className={careersHeroImageClass}>
              <picture className="absolute inset-0">
                {heroImageMobile && heroImageMobile !== heroImage ? (
                  <source media="(max-width: 1024px)" srcSet={heroImageMobile} />
                ) : null}
                <img
                  src={heroImage}
                  alt={content.hero.bannerAlt}
                  className={`${careersHeroImageMediaClass} size-full`}
                />
              </picture>
            </div>
          ) : null}
        </section>

        <CareerOpenings openings={content.openings} />
      </PageShell>
    </section>
  );
}
