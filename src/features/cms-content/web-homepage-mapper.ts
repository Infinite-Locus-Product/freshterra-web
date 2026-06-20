import {
  homePageDraftContent,
  type HomePageDraftContent,
} from "@/features/cms-content/homepage";

import type {
  HomeHeroSlide,
  HomePageContent,
  WebHomepageContent,
} from "./web-homepage-types";
import type { z } from "zod";
import {
  webHomepageHeroSchema,
  webHomepageSourceSchema,
  webHomepageStoreSchema,
  webHomepageStorySchema,
} from "./web-homepage-types";

type WebHomepageHero = z.infer<typeof webHomepageHeroSchema>;
type WebHomepageSource = z.infer<typeof webHomepageSourceSchema>;
type WebHomepageStory = z.infer<typeof webHomepageStorySchema>;
type WebHomepageStore = z.infer<typeof webHomepageStoreSchema>;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(record: UnknownRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function readMediaUrl(record: UnknownRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (!isRecord(value)) continue;

    const direct = readString(value, "url", "src", "href");
    if (direct) return direct;

    const data = value.data;
    if (!isRecord(data)) continue;

    const fromData = readString(data, "url", "src");
    if (fromData) return fromData;

    const attributes = data.attributes;
    if (isRecord(attributes)) {
      const fromAttrs = readString(attributes, "url", "src");
      if (fromAttrs) return fromAttrs;
    }
  }
  return "";
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !/^read more$/i.test(part));
}

function normalizeHref(slug: string | null | undefined): string | undefined {
  if (!slug?.trim()) return undefined;
  const trimmed = slug.trim();
  if (trimmed.startsWith("/")) return trimmed;
  return `/c/${encodeURIComponent(trimmed)}`;
}

/** Resolves CMS deeplink strings — absolute URLs, site paths, or category slugs. */
function normalizeDeeplink(value: string | null | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.includes("/")) return `/${trimmed.replace(/^\/+/, "")}`;
  return normalizeHref(trimmed);
}

function readDeeplink(record: UnknownRecord): string {
  const raw = record.deeplink;
  if (typeof raw === "string") return readString(record, "deeplink");
  if (isRecord(raw)) {
    return readString(raw, "link", "url", "href", "slug", "deeplink");
  }
  return "";
}

function mapHeroSlide(raw: WebHomepageHero, index: number): HomeHeroSlide | null {
  const record = raw as UnknownRecord;
  const imageWeb = readMediaUrl(record, "image");
  const imageMobile =
    readMediaUrl(record, "iamge_mweb", "image_mweb", "imageMobile") || imageWeb;
  if (!imageWeb && !imageMobile) return null;

  const heading = readString(record, "heading");
  const deeplink = readDeeplink(record);
  const ctaSlug = readString(record, "cta_slug");
  const collectionId = readString(record, "saleor_collection_id");
  const href =
    normalizeDeeplink(deeplink) ||
    normalizeHref(ctaSlug) ||
    (collectionId ? `/collection/${encodeURIComponent(collectionId)}` : undefined);

  const id =
    readString(record, "id") ||
    `hero-${readNumber(record, "position") || index + 1}`;

  return {
    id,
    imageWeb: imageWeb || imageMobile,
    imageMobile: imageMobile || imageWeb,
    imageAlt: heading || "FreshTerra promotion",
    ...(heading ? { heading } : {}),
    ...(href ? { href } : {}),
  };
}

function readNumber(record: UnknownRecord, ...keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return 0;
}

function mapStory(
  raw: WebHomepageStory,
  index: number,
  fallback: HomePageDraftContent["testimonials"]["items"][number],
): HomePageContent["testimonials"]["items"][number] | null {
  const record = raw as UnknownRecord;
  const name = readString(record, "customer_name", "name");
  const quote = readString(record, "quote");
  const imageSrc =
    readMediaUrl(record, "thumbnail_image_mweb", "thumbnail", "image") ||
    fallback.imageSrc;
  if (!name || !quote) return null;

  return {
    name,
    ageLabel: readString(record, "customer_title", "ageLabel") || fallback.ageLabel,
    quote,
    imageSrc,
  };
}

function mapStore(
  raw: WebHomepageStore,
  fallback: HomePageDraftContent["store"],
): HomePageContent["store"] {
  const record = raw as UnknownRecord;
  const address = readString(record, "store_address");
  const addressLines = address
    ? splitParagraphs(address.replace(/\n/g, "\n"))
    : [fallback.addressLine1, fallback.addressLine2];

  const bannerEntry = Array.isArray(record.banner)
    ? (record.banner[0] as UnknownRecord | undefined)
    : undefined;
  const imageSource =
    bannerEntry && isRecord(bannerEntry) ? bannerEntry : record;

  const mediaImage = readMediaUrl(imageSource, "store_image");
  const mediaImageMobile =
    readMediaUrl(imageSource, "store_image_mweb") || mediaImage;

  return {
    title: fallback.title,
    name: readString(record, "store_name") || fallback.name,
    addressLine1: addressLines[0] ?? fallback.addressLine1,
    addressLine2: addressLines[1] ?? fallback.addressLine2,
    primaryCtaLabel:
      readString(record, "view_store_cta") || fallback.primaryCtaLabel,
    secondaryCtaLabel:
      readString(record, "locate_us_cta") || fallback.secondaryCtaLabel,
    primaryCtaHref:
      normalizeHref(readString(record, "view_store_slug")) || "/stores",
    ...(readString(record, "locate_us_url")
      ? { secondaryCtaHref: readString(record, "locate_us_url") }
      : {}),
    ...(mediaImage ? { mediaImage } : {}),
    ...(mediaImageMobile ? { mediaImageMobile } : {}),
  };
}

function mapSource(
  raw: WebHomepageSource,
  fallback: HomePageDraftContent["sourcing"],
): HomePageContent["sourcing"] {
  const record = raw as UnknownRecord;
  const description = readString(record, "description");
  const paragraphs = description
    ? splitParagraphs(description)
    : [...fallback.paragraphs];

  const backgroundImage = readMediaUrl(record, "background_image");
  const backgroundImageMobile =
    readMediaUrl(record, "background_image_mweb") || backgroundImage;
  const mediaImage = readMediaUrl(record, "editorial_image");
  const mediaImageMobile =
    readMediaUrl(record, "editorial_image_mweb") || mediaImage;

  return {
    title: readString(record, "section_heading") || fallback.title,
    subtitle: fallback.subtitle,
    mediaOverlay: fallback.mediaOverlay,
    paragraphs,
    ctaLabel: readString(record, "read_more_label") || fallback.ctaLabel,
    readMoreHref: normalizeHref(readString(record, "read_more_slug")),
    ...(backgroundImage ? { backgroundImage } : {}),
    ...(backgroundImageMobile ? { backgroundImageMobile } : {}),
    ...(mediaImage ? { mediaImage } : {}),
    ...(mediaImageMobile ? { mediaImageMobile } : {}),
  };
}

/** Maps `web-homepage` CMS payload into the homepage view model. */
export function mapWebHomepageContent(
  input: WebHomepageContent,
  fallback: HomePageDraftContent = homePageDraftContent,
): HomePageContent {
  const heroSlides = (input.web_herosection ?? [])
    .filter((slide) => slide.is_active !== false)
    .sort(
      (a, b) =>
        (a.position ?? 0) - (b.position ?? 0),
    )
    .map(mapHeroSlide)
    .filter((slide): slide is HomeHeroSlide => slide !== null);

  const stories = (input.stories ?? [])
    .filter((story) => story.is_active !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((story, index) =>
      mapStory(
        story,
        index,
        fallback.testimonials.items[index] ?? fallback.testimonials.items[0]!,
      ),
    )
    .filter(
      (item): item is HomePageContent["testimonials"]["items"][number] =>
        item !== null,
    );

  const storeEntry = [...(input.our_store ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  )[0];

  const l2 = input.l2_category;
  const categoriesViewAllHref = l2?.slug
    ? normalizeHref(l2.slug) ?? (l2.slug.startsWith("/") ? l2.slug : undefined)
    : undefined;

  const firstHeroHeading = heroSlides[0]?.heading ?? heroSlides[0]?.imageAlt;

  return {
    hero: {
      headline: firstHeroHeading || fallback.hero.headline,
      eyebrow: fallback.hero.eyebrow,
      ctaLabel: fallback.hero.ctaLabel,
    },
    heroSlides,
    nav: { ...fallback.nav, links: [...fallback.nav.links] },
    categories: {
      title: l2?.title?.trim() || fallback.categories.title,
      subtitle: l2?.tagline?.trim() || fallback.categories.subtitle,
      ctaLabel: fallback.categories.ctaLabel,
      items: [],
      ...(categoriesViewAllHref ? { viewAllHref: categoriesViewAllHref } : {}),
    },
    sourcing: input.source
      ? mapSource(input.source, fallback.sourcing)
      : { ...fallback.sourcing, paragraphs: [...fallback.sourcing.paragraphs] },
    testimonials: {
      title:
        input.stories_section_tagline?.trim() || fallback.testimonials.title,
      subtitle:
        input.stories_section_title?.trim() || fallback.testimonials.subtitle,
      items: stories,
    },
    store: storeEntry
      ? {
          ...mapStore(storeEntry, fallback.store),
          title:
            input.store_section_heading?.trim() || fallback.store.title,
        }
      : {
          ...fallback.store,
          title:
            input.store_section_heading?.trim() || fallback.store.title,
        },
    footer: {
      aboutLinks: [...fallback.footer.aboutLinks],
      quickLinks: [...fallback.footer.quickLinks],
      officeLines: [...fallback.footer.officeLines],
      appBadges: [...fallback.footer.appBadges],
    },
  };
}
