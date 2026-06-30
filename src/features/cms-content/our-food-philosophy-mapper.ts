import type {
  FoodPhilosophyCertificationItem,
  FoodPhilosophyPageContent,
  FoodPhilosophyPartnershipItem,
  FoodPhilosophyPartnershipTheme,
  FoodPhilosophySustainabilityItem,
  OurFoodPhilosophyContent,
} from "./our-food-philosophy-types";
import type { z } from "zod";
import {
  ourFoodPhilosophyFarmerBannerSchema,
  ourFoodPhilosophyRelatedBannerSchema,
  ourFoodPhilosophySourceSchema,
  ourFoodPhilosophyTrustMarkerSchema,
} from "./our-food-philosophy-types";

type OurFoodPhilosophySource = z.infer<typeof ourFoodPhilosophySourceSchema>;
type OurFoodPhilosophyTrustMarker = z.infer<
  typeof ourFoodPhilosophyTrustMarkerSchema
>;
type OurFoodPhilosophyFarmerBanner = z.infer<
  typeof ourFoodPhilosophyFarmerBannerSchema
>;
type OurFoodPhilosophyRelatedBanner = z.infer<
  typeof ourFoodPhilosophyRelatedBannerSchema
>;

type UnknownRecord = Record<string, unknown>;

const PARTNERSHIP_THEMES: readonly FoodPhilosophyPartnershipTheme[] = [
  "amber",
  "olive",
  "sky",
];

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
    .filter(Boolean);
}

function isActive(record: UnknownRecord): boolean {
  const value = record.is_active ?? record.isActive;
  if (value === false || value === "false") return false;
  return true;
}

function sortByOrder<T extends { sort_order?: number; order?: number }>(
  items: readonly T[],
  orderKey: "sort_order" | "order",
): T[] {
  return [...items].sort(
    (a, b) => (a[orderKey] ?? 0) - (b[orderKey] ?? 0),
  );
}

function mapSourceSection(
  raw: OurFoodPhilosophySource,
): Pick<NonNullable<FoodPhilosophyPageContent["sourcing"]>, "title" | "subtitle" | "paragraphs"> | null {
  const record = raw as UnknownRecord;
  if (!isActive(record)) return null;

  const title = readString(record, "title");
  const subtitle = readString(record, "tagline", "subtitle");
  const description = readString(record, "description");
  const paragraphs = description ? splitParagraphs(description) : [];

  if (!title && !subtitle && paragraphs.length === 0) return null;

  return {
    ...(title ? { title } : {}),
    ...(subtitle ? { subtitle } : {}),
    paragraphs,
  };
}

function mapTrustMarker(
  raw: OurFoodPhilosophyTrustMarker,
): FoodPhilosophyCertificationItem | null {
  const record = raw as UnknownRecord;
  if (!isActive(record)) return null;

  const label = readString(record, "title", "label", "name");
  const imageSrc = readMediaUrl(record, "icon", "image", "imageUrl");
  if (!label || !imageSrc) return null;

  return { label, imageSrc };
}

function mapFarmerBanner(
  raw: OurFoodPhilosophyFarmerBanner,
  index: number,
): FoodPhilosophyPartnershipItem | null {
  const record = raw as UnknownRecord;
  if (!isActive(record)) return null;

  const imageSrc = readMediaUrl(record, "image", "image_web", "imageWeb");
  const imageSrcMobile =
    readMediaUrl(record, "image_mweb", "image_mobile") || imageSrc;
  if (!imageSrc && !imageSrcMobile) return null;

  const quote = readString(record, "quote", "testimonial");
  const name = readString(record, "name", "farmer_name");
  const location = readString(record, "location", "farmer_location");

  return {
    imageSrc: imageSrc || imageSrcMobile,
    ...(imageSrcMobile ? { imageSrcMobile } : {}),
    ...(quote ? { quote } : {}),
    ...(name ? { name } : {}),
    ...(location ? { location } : {}),
    theme: PARTNERSHIP_THEMES[index % PARTNERSHIP_THEMES.length] ?? "amber",
  };
}

function mapRelatedBanner(
  raw: OurFoodPhilosophyRelatedBanner,
): FoodPhilosophySustainabilityItem | null {
  const record = raw as UnknownRecord;
  if (!isActive(record)) return null;

  const imageSrc = readMediaUrl(record, "image", "image_web", "imageWeb");
  const imageSrcMobile =
    readMediaUrl(record, "iamge_mweb", "image_mweb", "image_mobile") ||
    imageSrc;
  if (!imageSrc && !imageSrcMobile) return null;

  const label = readString(record, "label", "title", "name");
  const description = readString(record, "description", "subtitle");

  return {
    label,
    ...(description ? { description } : {}),
    imageSrc: imageSrc || imageSrcMobile,
    ...(imageSrcMobile ? { imageSrcMobile } : {}),
  };
}

/**
 * Maps `our-food-philosophy` CMS payload into the Food Philosophy layout model.
 */
export function mapOurFoodPhilosophyContent(
  input: OurFoodPhilosophyContent,
): FoodPhilosophyPageContent {
  const result: FoodPhilosophyPageContent = {};

  const heading = input.heading?.trim() ?? "";
  const heroBanner = input.hero_banner?.trim() ?? "";
  const heroBannerMobile = input.hero_banner_mweb?.trim() || heroBanner;

  if (heading || heroBanner || heroBannerMobile) {
    result.hero = {
      ...(heading ? { title: heading } : {}),
      ...(heroBanner ? { imageSrc: heroBanner } : {}),
      ...(heroBannerMobile ? { imageSrcMobile: heroBannerMobile } : {}),
      imageAlt: heading || "Our Food Philosophy",
    };
  }

  const philosophySections = sortByOrder(
    input.source_philosophy ?? [],
    "sort_order",
  )
    .map(mapSourceSection)
    .filter((section): section is NonNullable<typeof section> => section !== null);

  if (philosophySections[0]) {
    result.sourcing = philosophySections[0];
  }

  const certificationCopy = philosophySections[1];
  const trustItems = sortByOrder(input.trustmarker ?? [], "order")
    .map(mapTrustMarker)
    .filter((item): item is FoodPhilosophyCertificationItem => item !== null);

  if (certificationCopy || trustItems.length > 0) {
    result.certifications = {
      ...(certificationCopy?.title ? { title: certificationCopy.title } : {}),
      ...(certificationCopy?.subtitle
        ? { subtitle: certificationCopy.subtitle }
        : {}),
      paragraphs: certificationCopy?.paragraphs ?? [],
      items: trustItems,
    };
  }

  const farmerItems = sortByOrder(input.farmer_banners ?? [], "sort_order")
    .map(mapFarmerBanner)
    .filter((item): item is FoodPhilosophyPartnershipItem => item !== null);

  const farmerTitle = input.farmer_section_heading?.trim() ?? "";
  const farmerSubtitle = input.farmer_section_tagline?.trim() ?? "";

  if (farmerTitle || farmerSubtitle || farmerItems.length > 0) {
    result.partnerships = {
      ...(farmerTitle ? { title: farmerTitle } : {}),
      ...(farmerSubtitle ? { subtitle: farmerSubtitle } : {}),
      items: farmerItems,
    };
  }

  const sustainabilityItems = sortByOrder(input.related_banners ?? [], "sort_order")
    .map(mapRelatedBanner)
    .filter((item): item is FoodPhilosophySustainabilityItem => item !== null);

  const sustainabilityTitle = input.sustainability_section_heading?.trim() ?? "";
  const sustainabilitySubtitle =
    input.sustainability_section_tagline?.trim() ?? "";

  if (sustainabilityTitle || sustainabilitySubtitle || sustainabilityItems.length > 0) {
    result.sustainability = {
      ...(sustainabilityTitle ? { title: sustainabilityTitle } : {}),
      ...(sustainabilitySubtitle ? { subtitle: sustainabilitySubtitle } : {}),
      items: sustainabilityItems,
    };
  }

  return result;
}

export function hasFoodPhilosophyContent(
  content: FoodPhilosophyPageContent,
): boolean {
  return Boolean(
    content.hero?.title ||
      content.hero?.imageSrc ||
      content.hero?.imageSrcMobile ||
      content.sourcing ||
      (content.certifications &&
        (content.certifications.title ||
          content.certifications.paragraphs.length > 0 ||
          content.certifications.items.length > 0)) ||
      (content.partnerships && content.partnerships.items.length > 0) ||
      (content.sustainability && content.sustainability.items.length > 0),
  );
}
