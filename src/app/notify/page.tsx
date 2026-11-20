import { cache } from "react";

import type { Metadata } from "next";

import Image from "next/image";
import { notFound } from "next/navigation";

import { buildPageMetadata, siteTitle } from "@/lib/seo/pageMetadata";

import { LeadCaptureForm } from "@/components/coming-soon/LeadCaptureForm";
import { PolicyLinks } from "@/components/coming-soon/PolicyLinks";
import { Heading } from "@/components/ui/Heading";

import {
  headlineText,
  type NotifyLogo,
} from "@/features/cms-content/notify-me-mapper";
import { fetchNotifyPageContent } from "@/features/cms-content/notify-me-service";

/** Uncached so Strapi publishes show immediately (FRES-2399). */
export const dynamic = "force-dynamic";

/** Deduped so generateMetadata + the page body share one BFF request. */
const loadNotifyPage = cache(() => fetchNotifyPageContent());

/**
 * Metadata comes from Strapi only: the `seo` component, else the page's own
 * heading and sub heading.
 */
export async function generateMetadata(): Promise<Metadata> {
  const content = await loadNotifyPage();
  if (!content) notFound();

  const heading = headlineText(content);
  return buildPageMetadata({
    path: "/notify",
    fallbackTitle: heading ? siteTitle(heading) : "",
    fallbackDescription: content.subheadline,
    seo: content.seo,
  });
}

const wordColorClass = {
  olive: "text-accent-olive",
  terracotta: "text-accent-terracotta",
  brand: "text-brand-500",
} as const;

function CmsLogo({
  logo,
  sizes,
  className,
}: Readonly<{ logo: NotifyLogo; sizes: string; className: string }>) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      priority
      sizes={sizes}
      className={className}
    />
  );
}

/**
 * `/notify` lead-capture page. Every piece of copy, the banner, the logos and
 * the policy links come from the Strapi `notify-me` single type; a blank field
 * renders nothing, and an unpublished entry is a 404.
 */
export default async function NotifyPage() {
  const content = await loadNotifyPage();
  if (!content) notFound();
  const headline = headlineText(content);

  return (
    <main className="bg-cream-50 min-h-screen md:grid md:grid-cols-[505px_1fr]">
      {/* Mobile: hero image at top with logo overlay (Figma 122:830 — visible 388h) */}
      <div className="relative h-[388px] w-full overflow-hidden md:hidden">
        {content.bannerImage ? (
          <Image
            src={content.bannerImage}
            alt=""
            priority
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
        {content.mobileLogo ? (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <CmsLogo
              logo={content.mobileLogo}
              sizes="185px"
              className="h-16 w-[185px] object-contain"
            />
          </div>
        ) : null}
      </div>

      {/* Sidebar (desktop) / form section (mobile) */}
      <aside className="bg-cream-50 md:bg-gray-6 relative md:order-1 md:min-h-screen">
        <div className="mx-auto flex min-h-[calc(100svh-388px)] flex-col gap-6 px-9 py-9 md:min-h-screen md:max-w-none md:gap-0 md:px-20 md:pt-[60px] md:pb-[60px]">
          {/* Logo (desktop only — mobile shows it over the image).
              Figma spec: 209 × 72 at top 60, left 80 (left/top come from
              the parent's md:px-20 + md:pt-[60px] above).
              Wrapper is `md:flex` (not `md:block`) so the inline <img>
              doesn't add ~4–5px of line-height baseline descent below
              the logo, which would inflate the heading's 94px gap. */}
          {content.logo ? (
            <div className="hidden md:flex">
              <CmsLogo
                logo={content.logo}
                sizes="209px"
                className="h-[72px] w-[209px] object-contain object-left"
              />
            </div>
          ) : null}

          <Heading
            level={1}
            variant="display"
            className="font-display mx-auto h-[70px] w-[345px] text-[28px] leading-[1.25] md:mx-0 md:mt-[94px] md:h-auto md:w-auto md:text-[40px] md:leading-[48px]"
            align="center"
          >
            <span className="md:block md:text-left">
              {content.headlineLines.map((line, lineIndex) => (
                // Mobile: one centred run; desktop: one line per `/n`.
                <span
                  key={lineIndex}
                  className={lineIndex > 0 ? "md:block" : undefined}
                >
                  {lineIndex > 0 ? " " : ""}
                  {line.map((phrase, phraseIndex) => (
                    <span
                      key={phraseIndex}
                      className={wordColorClass[phrase.color]}
                    >
                      {phraseIndex > 0 ? " " : ""}
                      {phrase.text}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </Heading>

          {content.subheadline ? (
            <p className="text-input-text text-center font-sans text-sm font-medium md:mt-9 md:text-left md:text-lg md:leading-snug md:font-normal">
              {content.subheadline}
            </p>
          ) : null}

          <LeadCaptureForm
            content={content.form}
            surfaceClass="bg-cream-50 md:bg-gray-6"
            className="md:mt-6"
          />

          {content.policyLinks.length > 0 ? (
            <div className="mt-auto flex justify-center md:justify-start">
              <PolicyLinks
                links={content.policyLinks}
                tone="muted"
                size="sm"
                className="md:text-base"
              />
            </div>
          ) : null}
        </div>
      </aside>

      {/* Desktop: hero food image on the right */}
      <div className="relative hidden md:order-2 md:block md:min-h-screen">
        {content.bannerImage ? (
          <Image
            src={content.bannerImage}
            alt={headline}
            priority
            fill
            sizes="(min-width: 768px) 65vw, 0vw"
            className="object-cover"
          />
        ) : null}
      </div>
    </main>
  );
}
