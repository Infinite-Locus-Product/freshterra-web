import Image from "next/image";
import Link from "next/link";

import {
  foodPhilosophyHeroBannerImageClass,
  foodPhilosophyHeroBannerOuterClass,
  foodPhilosophyHeroBannerShellClass,
  foodPhilosophyPageBreadcrumbClass,
  foodPhilosophyPageSectionClass,
  foodPhilosophyPageTitleClass,
  foodPhilosophyCertificationItemClass,
  foodPhilosophyCertificationItemLabelClass,
  foodPhilosophyCertificationsBodyClass,
  foodPhilosophyCertificationsParagraphsClass,
  foodPhilosophyCertificationsSubtitleClass,
  foodPhilosophyCertificationsTitleClass,
  foodPhilosophyContentSectionsClass,
  foodPhilosophyPartnershipCardCompositeImageClass,
  foodPhilosophyPartnershipCardCompositeImageMobileClass,
  foodPhilosophyPartnershipCardCompositeImageWebClass,
  foodPhilosophyPartnershipCardShellClass,
  foodPhilosophyPartnershipsStackClass,
  foodPhilosophyPartnershipsSubtitleClass,
  foodPhilosophyPartnershipsTitleClass,
  foodPhilosophySourcingArticleClass,
  foodPhilosophySourcingBodyClass,
  foodPhilosophySourcingParagraphsClass,
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

import type { FoodPhilosophyPageContent } from "@/features/cms-content/our-food-philosophy-types";

type FoodPhilosophyPageLayoutProps = {
  content: FoodPhilosophyPageContent;
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
  const heroImage = content.hero?.imageSrc ?? content.hero?.imageSrcMobile;
  const heroImageMobile =
    content.hero?.imageSrcMobile ?? content.hero?.imageSrc;
  const showSourcing = Boolean(
    content.sourcing?.title ||
      content.sourcing?.subtitle ||
      (content.sourcing?.paragraphs.length ?? 0) > 0,
  );
  const showCertifications = Boolean(
    content.certifications?.title ||
      content.certifications?.subtitle ||
      (content.certifications?.paragraphs.length ?? 0) > 0 ||
      (content.certifications?.items.length ?? 0) > 0,
  );
  const showPartnerships = Boolean(
    content.partnerships?.title ||
      content.partnerships?.subtitle ||
      (content.partnerships?.items.length ?? 0) > 0,
  );
  const showSustainability = Boolean(
    content.sustainability?.title ||
      content.sustainability?.subtitle ||
      (content.sustainability?.items.length ?? 0) > 0,
  );

  return (
    <section className={foodPhilosophyPageSectionClass}>
      <PageShell>
        <nav aria-label="Breadcrumb" className={foodPhilosophyPageBreadcrumbClass}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-text-primary">Our Food Philosophy</span>
        </nav>

        {content.hero?.title ? (
          <h1 className={foodPhilosophyPageTitleClass}>{content.hero.title}</h1>
        ) : null}
      </PageShell>

      {heroImage ? (
        <div className={foodPhilosophyHeroBannerShellClass}>
          <div className={foodPhilosophyHeroBannerOuterClass}>
            <picture>
              {heroImageMobile && heroImageMobile !== heroImage ? (
                <source media="(max-width: 768px)" srcSet={heroImageMobile} />
              ) : null}
              <img
                src={heroImage}
                alt={content.hero?.imageAlt ?? "Our Food Philosophy"}
                className={`${foodPhilosophyHeroBannerImageClass} size-full`}
              />
            </picture>
          </div>
        </div>
      ) : null}

      <PageShell>
        {(showSourcing || showCertifications || showPartnerships || showSustainability) ? (
          <div className={foodPhilosophyContentSectionsClass}>
            {showSourcing || showCertifications ? (
              <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,41rem)_minmax(0,40rem)] lg:justify-between">
                {showSourcing ? (
                  <article className={foodPhilosophySourcingArticleClass}>
                <div>
                  {content.sourcing?.title ? (
                    <h2 className={foodPhilosophySourcingTitleClass}>
                      {content.sourcing.title}
                    </h2>
                  ) : null}
                  {content.sourcing?.subtitle ? (
                    <p className={foodPhilosophySourcingSubtitleClass}>
                      {content.sourcing.subtitle}
                    </p>
                  ) : null}
                </div>
                {content.sourcing?.paragraphs.length ? (
                  <div className={foodPhilosophySourcingParagraphsClass}>
                    {content.sourcing.paragraphs.map((paragraph) => (
                      <p key={paragraph} className={foodPhilosophySourcingBodyClass}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}

            {showCertifications ? (
              <article
                className={
                  showSourcing
                    ? "flex min-w-0 flex-col lg:justify-between"
                    : "flex min-w-0 flex-col"
                }
              >
                <div>
                  {content.certifications?.title ? (
                    <h2 className={foodPhilosophyCertificationsTitleClass}>
                      {content.certifications.title}
                    </h2>
                  ) : null}
                  {content.certifications?.subtitle ? (
                    <p className={foodPhilosophyCertificationsSubtitleClass}>
                      {content.certifications.subtitle}
                    </p>
                  ) : null}
                  {content.certifications?.paragraphs.length ? (
                    <div className={foodPhilosophyCertificationsParagraphsClass}>
                      {content.certifications.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className={foodPhilosophyCertificationsBodyClass}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
                {content.certifications?.items.length ? (
                  <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {content.certifications.items.map((item) => (
                      <div
                        key={item.label}
                        className={foodPhilosophyCertificationItemClass}
                      >
                        <div className="relative size-20 md:size-24">
                          <Image
                            src={item.imageSrc}
                            alt={item.label}
                            fill
                            className="object-contain"
                            sizes="96px"
                          />
                        </div>
                        <p className={foodPhilosophyCertificationItemLabelClass}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ) : null}
              </div>
            ) : null}

            {showPartnerships ? (
              <section>
            {content.partnerships?.title ? (
              <h2 className={foodPhilosophyPartnershipsTitleClass}>
                {content.partnerships.title}
              </h2>
            ) : null}
            {content.partnerships?.subtitle ? (
              <p className={foodPhilosophyPartnershipsSubtitleClass}>
                {content.partnerships.subtitle}
              </p>
            ) : null}

            <div className={foodPhilosophyPartnershipsStackClass}>
              {content.partnerships!.items.map((partner, index) => {
                const imageSrc = partner.imageSrc || partner.imageSrcMobile;
                const imageSrcMobile =
                  partner.imageSrcMobile ?? partner.imageSrc;
                const useSplitAssets = Boolean(
                  imageSrc &&
                    imageSrcMobile &&
                    imageSrcMobile !== imageSrc,
                );

                const imageAlt =
                  partner.name
                    ? `${partner.name}${partner.location ? `, ${partner.location}` : ""}`
                    : "Farmer partnership";

                return (
                  <article
                    key={`${imageSrc}-${index}`}
                    style={{
                      top: `calc(var(--stack-top) + ${index} * var(--stack-peek))`,
                      zIndex: index + 1,
                    }}
                    className={foodPhilosophyPartnershipCardShellClass}
                  >
                    {useSplitAssets ? (
                      <>
                        <img
                          src={imageSrcMobile}
                          alt={imageAlt}
                          className={
                            foodPhilosophyPartnershipCardCompositeImageMobileClass
                          }
                        />
                        <img
                          src={imageSrc}
                          alt={imageAlt}
                          className={
                            foodPhilosophyPartnershipCardCompositeImageWebClass
                          }
                        />
                      </>
                    ) : imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={imageAlt}
                        className={foodPhilosophyPartnershipCardCompositeImageClass}
                      />
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
            ) : null}

            {showSustainability ? (
              <section>
            {content.sustainability?.title ? (
              <h2 className={foodPhilosophySustainabilityTitleClass}>
                {content.sustainability.title}
              </h2>
            ) : null}
            {content.sustainability?.subtitle ? (
              <p className={foodPhilosophySustainabilitySubtitleClass}>
                {content.sustainability.subtitle}
              </p>
            ) : null}

            <div className={foodPhilosophySustainabilityGridClass}>
              {content.sustainability!.items.map((item, index) => {
                const imageSrc = item.imageSrc || item.imageSrcMobile;
                const imageSrcMobile = item.imageSrcMobile ?? item.imageSrc;

                return (
                <article
                  key={`${imageSrc}-${index}`}
                  aria-label={item.label || "Sustainability commitment"}
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  tabIndex={0}
                  className={foodPhilosophySustainabilityCardClass}
                >
                  {imageSrc ? (
                    <picture className="absolute inset-0">
                      {imageSrcMobile && imageSrcMobile !== imageSrc ? (
                        <source
                          media="(max-width: 768px)"
                          srcSet={imageSrcMobile}
                        />
                      ) : null}
                      <img
                        src={imageSrc}
                        alt=""
                        aria-hidden
                        className={`${foodPhilosophySustainabilityCardImageClass} size-full`}
                      />
                    </picture>
                  ) : null}

                  <div
                    aria-hidden
                    className="from-text-primary/80 via-text-primary/20 absolute inset-0 bg-linear-to-t to-transparent transition-colors duration-300 group-hover:from-text-primary group-hover:via-text-primary/55 group-focus-visible:from-text-primary group-focus-visible:via-text-primary/55"
                  />

                  {item.label || item.description ? (
                    <div className={foodPhilosophySustainabilityCardLabelWrapClass}>
                      {item.label ? (
                        <p className={foodPhilosophySustainabilityCardLabelClass}>
                          {item.label}
                        </p>
                      ) : null}
                      {item.description ? (
                        <p className="text-beige-100/90 mt-0 max-h-0 overflow-hidden text-sm leading-6 opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:max-h-48 group-hover:opacity-100 group-focus-visible:mt-3 group-focus-visible:max-h-48 group-focus-visible:opacity-100">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
              })}
            </div>
          </section>
            ) : null}
          </div>
        ) : null}
      </PageShell>
    </section>
  );
}
