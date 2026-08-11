import type { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

import {
  newsClippingGridClass,
  newsClippingImageClass,
  newsClippingImageWrapClass,
  newsClippingItemClass,
  newsClippingLinkClass,
  newsClippingTitleClass,
  newsPageBreadcrumbClass,
  newsPageCardClass,
  newsPageSectionClass,
  newsPageSectionStackClass,
  newsSectionHeadingClass,
  publicationGridClass,
  publicationLogoImageClass,
  publicationLogoLinkClass,
} from "@/components/news/news-page";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";

import type {
  NewsPageContent,
  NewsPaperItem,
  NewsPaperSection,
  PublicationLogoItem,
  PublicationSection,
} from "@/features/cms-content/news-page-types";

type NewsPageLayoutProps = {
  content: NewsPageContent;
};

const CLIPPING_SIZES =
  "(max-width: 767px) 45vw, (max-width: 1023px) 30vw, 260px";
const LOGO_SIZES = "(max-width: 767px) 120px, 240px";

export function NewsPageLayout({ content }: Readonly<NewsPageLayoutProps>) {
  return (
    <div className={newsPageSectionClass}>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6">
        <Breadcrumb
          current={content.breadcrumbLabel}
          className={newsPageBreadcrumbClass}
        />

        <Heading level={1} variant="policyTitle">
          {content.hero.title}
        </Heading>

        <article className={newsPageCardClass}>
          <div className={newsPageSectionStackClass}>
            {content.sections.map((section) =>
              section.kind === "newspapers" ? (
                <NewsPaperBlock key={section.key} section={section} />
              ) : (
                <PublicationBlock key={section.key} section={section} />
              ),
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

function NewsPaperBlock({ section }: Readonly<{ section: NewsPaperSection }>) {
  return (
    <section>
      {section.heading ? (
        <h2 className={newsSectionHeadingClass}>{section.heading}</h2>
      ) : null}
      <ul className={newsClippingGridClass}>
        {section.items.map((item) => (
          <li key={item.key}>
            <NewsClipping item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function NewsClipping({ item }: Readonly<{ item: NewsPaperItem }>) {
  // The caption below the clipping carries the name, so the image itself is
  // decorative. Without a caption it becomes the only label available.
  const alt = item.title ? "" : "FreshTerra press coverage";

  const body = (
    <>
      <div className={newsClippingImageWrapClass}>
        <ResponsiveMedia
          src={item.imageSrc}
          srcMobile={item.imageSrcMobile}
          alt={alt}
          sizes={CLIPPING_SIZES}
          className={newsClippingImageClass}
        />
      </div>
      {item.title ? (
        <span className={newsClippingTitleClass}>{item.title}</span>
      ) : null}
    </>
  );

  return (
    <ExternalOrInternalLink
      href={item.href}
      className={cn(newsClippingItemClass, item.href && newsClippingLinkClass)}
      fallbackAs="figure"
    >
      {body}
    </ExternalOrInternalLink>
  );
}

function PublicationBlock({
  section,
}: Readonly<{ section: PublicationSection }>) {
  return (
    <section>
      {section.heading ? (
        <h2 className={newsSectionHeadingClass}>{section.heading}</h2>
      ) : null}
      <ul className={publicationGridClass}>
        {section.items.map((item) => (
          <li key={item.key}>
            <PublicationLogo item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function PublicationLogo({ item }: Readonly<{ item: PublicationLogoItem }>) {
  // The CMS `publication` component carries no name field, so the logo is
  // decorative and the link (when present) gets a generic accessible name.
  // `width`/`height` are 0 because the CMS exposes no intrinsic dimensions and
  // the design needs each logo at its own width — 0/0 keeps `next/image` from
  // stamping a wrong aspect ratio, so CSS sizes it from the real asset.
  const logo = (
    <Image
      src={item.logoSrc}
      alt=""
      width={0}
      height={0}
      sizes={LOGO_SIZES}
      className={publicationLogoImageClass}
    />
  );

  if (!item.href) return logo;

  return (
    <ExternalOrInternalLink
      href={item.href}
      className={publicationLogoLinkClass}
      ariaLabel="Read the coverage"
    >
      {logo}
    </ExternalOrInternalLink>
  );
}

type ExternalOrInternalLinkProps = {
  href: string | null;
  className?: string;
  ariaLabel?: string;
  /** Element rendered when there is no href. */
  fallbackAs?: "div" | "figure";
  children: ReactNode;
};

/**
 * CMS `redirection` values are publication websites (absolute URLs) but may
 * also be site paths. Both navigate in the same tab so the browser Back button
 * returns to this page; site paths go through `next/link`.
 */
function ExternalOrInternalLink({
  href,
  className,
  ariaLabel,
  fallbackAs = "div",
  children,
}: Readonly<ExternalOrInternalLinkProps>) {
  if (!href) {
    const Fallback = fallbackAs;
    return <Fallback className={className}>{children}</Fallback>;
  }

  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

type ResponsiveMediaProps = {
  src: string;
  srcMobile: string;
  alt: string;
  sizes: string;
  className?: string;
};

/** Renders one `<Image>` when both breakpoints share an asset, two otherwise. */
function ResponsiveMedia({
  src,
  srcMobile,
  alt,
  sizes,
  className,
}: Readonly<ResponsiveMediaProps>) {
  if (src === srcMobile) {
    return (
      <Image src={src} alt={alt} fill sizes={sizes} className={className} />
    );
  }

  return (
    <>
      <Image
        src={srcMobile}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(className, "md:hidden")}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(className, "hidden md:block")}
      />
    </>
  );
}
