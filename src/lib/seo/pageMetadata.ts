import type { Metadata } from "next";

export const SITE_NAME = "FreshTerra";
const SITE_TITLE_SUFFIX = ` | ${SITE_NAME}`;

/**
 * Root `src/app/opengraph-image.png` / `twitter-image.png`, served by Next.
 * A page-level `openGraph` block replaces the layout's, and file-based images
 * only attach at their own segment — so every page must name an image or the
 * site artwork disappears from its social cards.
 */
export const DEFAULT_OG_IMAGE = "/opengraph-image.png";
export const DEFAULT_TWITTER_IMAGE = "/twitter-image.png";

/**
 * Marketing-editable SEO values — the PDP BFF `seoMeta` block or the Strapi
 * `seo` component, normalised to one shape. A blank or nullish field falls back
 * per field.
 */
export type SeoOverrides = {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
};

export type PageMetadataInput = {
  /**
   * The page's own path (`/about`). Canonical + og:url fallback; a relative
   * path is resolved against `metadataBase` from the root layout.
   */
  path: string;
  /** Complete fallback `<title>`, e.g. `siteTitle("About FreshTerra")`. */
  fallbackTitle: string;
  fallbackDescription: string;
  seo?: SeoOverrides | null;
  /** og:image when `seo.ogImage` is blank — page artwork, first product image. */
  fallbackImage?: string | null;
};

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * `{Page Name} | FreshTerra`. Idempotent, so a title that already carries the
 * suffix (today's "Contact Us | FreshTerra") is returned unchanged.
 */
export function siteTitle(pageName: string): string {
  const name = pageName.trim();
  return name.endsWith(SITE_TITLE_SUFFIX)
    ? name
    : `${name}${SITE_TITLE_SUFFIX}`;
}

/** True only for an absolute `https://` URL that `new URL()` accepts. */
export function isAbsoluteHttpsUrl(
  value: string | null | undefined,
): value is string {
  const candidate = clean(value);
  if (!candidate) return false;
  try {
    return new URL(candidate).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * A marketing canonical is honoured only when it is an absolute https URL
 * (returned exactly as entered); anything else yields the page's own path.
 */
export function resolveCanonical(
  candidate: string | null | undefined,
  fallbackPath: string,
): string {
  return isAbsoluteHttpsUrl(candidate) ? candidate.trim() : fallbackPath;
}

/**
 * Builds the full `generateMetadata` payload for a public route: absolute
 * title (never run through the root `%s | FreshTerra` template), description,
 * canonical, and Open Graph + Twitter cards that mirror them.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const title = clean(input.seo?.title) ?? input.fallbackTitle.trim();
  const description =
    clean(input.seo?.description) ?? input.fallbackDescription.trim();
  const canonical = resolveCanonical(input.seo?.canonicalUrl, input.path);
  const image = clean(input.seo?.ogImage) ?? clean(input.fallbackImage);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: canonical,
      title,
      description,
      images: [image ?? DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? DEFAULT_TWITTER_IMAGE],
    },
  };
}
