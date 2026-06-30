import { richTextToHtml, richTextToPlainText } from "./cms-rich-text";
import { isCmsActive } from "./cms-boolean";
import { resolveL2CategoryViewAllHref } from "./homepage-l2-category-tiles";
import {
  buildGoogleMapsSearchUrl,
  normalizeCmsDeeplink,
  normalizeCmsSlugHref,
  normalizeStoreHref,
} from "./cms-href";

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

const EMPTY_SOURCING: HomePageContent["sourcing"] = {
  title: "",
  subtitle: "",
  mediaOverlay: "",
  paragraphs: [],
  ctaLabel: "",
};

const EMPTY_STORE: HomePageContent["store"] = {
  title: "",
  name: "",
  primaryCtaLabel: "",
  secondaryCtaLabel: "",
};

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
  return normalizeCmsSlugHref(slug);
}

function normalizeDeeplink(value: string | null | undefined): string | undefined {
  return normalizeCmsDeeplink(value);
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
    imageAlt: heading,
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
): HomePageContent["testimonials"]["items"][number] | null {
  const record = raw as UnknownRecord;
  const name = readString(record, "customer_name", "name");
  const quote = readString(record, "quote");
  const imageSrc = readMediaUrl(record, "thumbnail_image_mweb", "thumbnail", "image");
  if (!name || !quote) return null;

  return {
    name,
    ageLabel: readString(record, "customer_title", "ageLabel"),
    quote,
    imageSrc,
  };
}

function resolveViewStoreHref(
  record: UnknownRecord,
  hasPrimaryLabel: boolean,
): string | undefined {
  const slug = readString(record, "view_store_slug", "store_slug");
  const fromSlug = normalizeStoreHref(slug);
  if (fromSlug) return fromSlug;

  const deeplink = normalizeCmsDeeplink(
    readString(record, "view_store_deeplink", "view_store_url"),
  );
  if (deeplink) return deeplink;

  return hasPrimaryLabel ? "/stores" : undefined;
}

function resolveLocateUsHref(
  record: UnknownRecord,
  address: string,
  hasSecondaryLabel: boolean,
): string | undefined {
  const slug = readString(record, "locate_us_slug");
  const fromSlug =
    normalizeStoreHref(slug) ?? normalizeCmsDeeplink(slug);
  if (fromSlug) return fromSlug;

  const explicit = normalizeCmsDeeplink(
    readString(record, "locate_us_url", "locate_us_deeplink"),
  );
  if (explicit) return explicit;

  if (!hasSecondaryLabel) return undefined;

  const mapsQuery = address.replace(/\n+/g, ", ").trim();
  return buildGoogleMapsSearchUrl(mapsQuery);
}

function mapStore(
  raw: WebHomepageStore,
  sectionTitle: string,
): HomePageContent["store"] {
  const record = raw as UnknownRecord;
  const addressRaw = record.store_address;
  const addressHtml = richTextToHtml(addressRaw);
  const addressPlain = richTextToPlainText(addressRaw) ?? "";
  const primaryCtaLabel = readString(record, "view_store_cta");
  const secondaryCtaLabel = readString(record, "locate_us_cta");

  const bannerEntry = Array.isArray(record.banner)
    ? (record.banner[0] as UnknownRecord | undefined)
    : undefined;
  const imageSource =
    bannerEntry && isRecord(bannerEntry) ? bannerEntry : record;

  const mediaImage = readMediaUrl(imageSource, "store_image");
  const mediaImageMobile =
    readMediaUrl(imageSource, "store_image_mweb") || mediaImage;
  const primaryCtaHref = resolveViewStoreHref(record, Boolean(primaryCtaLabel));
  const secondaryCtaHref = resolveLocateUsHref(
    record,
    addressPlain,
    Boolean(secondaryCtaLabel),
  );

  return {
    title: sectionTitle,
    name: readString(record, "store_name"),
    ...(addressHtml ? { addressHtml } : {}),
    primaryCtaLabel,
    secondaryCtaLabel,
    ...(primaryCtaHref ? { primaryCtaHref } : {}),
    ...(secondaryCtaHref ? { secondaryCtaHref } : {}),
    ...(mediaImage ? { mediaImage } : {}),
    ...(mediaImageMobile ? { mediaImageMobile } : {}),
  };
}

function mapSource(raw: WebHomepageSource): HomePageContent["sourcing"] {
  const record = raw as UnknownRecord;
  const description = readString(record, "description");
  const paragraphs = description ? splitParagraphs(description) : [];

  const backgroundImage = readMediaUrl(record, "background_image");
  const backgroundImageMobile =
    readMediaUrl(record, "background_image_mweb") || backgroundImage;
  const mediaImage = readMediaUrl(record, "editorial_image");
  const mediaImageMobile =
    readMediaUrl(record, "editorial_image_mweb") || mediaImage;
  const readMoreHref = normalizeHref(readString(record, "read_more_slug"));

  return {
    title: readString(record, "section_heading"),
    subtitle: "",
    mediaOverlay: "",
    paragraphs,
    ctaLabel: readString(record, "read_more_label"),
    ...(readMoreHref ? { readMoreHref } : {}),
    ...(backgroundImage ? { backgroundImage } : {}),
    ...(backgroundImageMobile ? { backgroundImageMobile } : {}),
    ...(mediaImage ? { mediaImage } : {}),
    ...(mediaImageMobile ? { mediaImageMobile } : {}),
  };
}

/** Maps `web-homepage` CMS payload into the homepage view model (CMS fields only). */
export function mapWebHomepageContent(input: WebHomepageContent): HomePageContent {
  const heroSlides = (input.web_herosection ?? [])
    .filter((slide) => isCmsActive(slide.is_active))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(mapHeroSlide)
    .filter((slide): slide is HomeHeroSlide => slide !== null);

  const stories = (input.stories ?? [])
    .filter((story) => isCmsActive(story.is_active))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(mapStory)
    .filter(
      (item): item is HomePageContent["testimonials"]["items"][number] =>
        item !== null,
    );

  const storeEntry = [...(input.our_store ?? [])].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  )[0];

  const l2 = input.l2_category;
  const l2SectionActive = Boolean(l2 && isCmsActive(l2.is_active));
  const categoriesViewAllHref = l2SectionActive
    ? resolveL2CategoryViewAllHref(l2)
    : undefined;
  const categoriesCtaLabel = l2SectionActive
    ? l2?.view_all_cta?.trim() ?? ""
    : "";

  const storeSectionTitle = input.store_section_heading?.trim() ?? "";

  return {
    hero: {
      headline: heroSlides[0]?.heading ?? "",
      eyebrow: "",
      ctaLabel: "",
    },
    heroSlides,
    nav: { locationLabel: "", links: [] },
    categories: l2SectionActive
      ? {
          title: l2?.title?.trim() ?? "",
          subtitle: l2?.tagline?.trim() ?? "",
          ctaLabel: categoriesCtaLabel,
          items: [],
          ...(categoriesViewAllHref ? { viewAllHref: categoriesViewAllHref } : {}),
        }
      : {
          title: "",
          subtitle: "",
          ctaLabel: "",
          items: [],
        },
    sourcing:
      input.source && isCmsActive(input.source.is_active)
        ? mapSource(input.source)
        : EMPTY_SOURCING,
    testimonials: {
      title: input.stories_section_tagline?.trim() ?? "",
      subtitle: input.stories_section_title?.trim() ?? "",
      items: stories,
    },
    store: storeEntry
      ? mapStore(storeEntry, storeSectionTitle)
      : storeSectionTitle
        ? { ...EMPTY_STORE, title: storeSectionTitle }
        : EMPTY_STORE,
    footer: {
      aboutLinks: [],
      quickLinks: [],
      officeLines: [],
      appBadges: [],
    },
  };
}
