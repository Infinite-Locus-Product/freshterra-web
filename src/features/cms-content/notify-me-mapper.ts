import type { SeoOverrides } from "@/lib/seo/pageMetadata";

import type { LeadCaptureFormContent } from "@/components/coming-soon/LeadCaptureForm";
import type { PolicyLink } from "@/components/coming-soon/PolicyLinks";

import { readCmsString } from "./cms-readers";
import { readCmsSeo } from "./cms-seo";

import type { NotifyMeContent } from "./notify-me-types";

export type HeadlineWordColor = "olive" | "terracotta" | "brand";

export type HeadlinePhrase = Readonly<{
  text: string;
  color: HeadlineWordColor;
}>;

export type NotifyLogo = Readonly<{
  src: string;
  width: number;
  height: number;
  alt: string;
}>;

/**
 * View model for `/notify`, built only from the `notify-me` single type —
 * there is no built-in copy. A blank Strapi field renders nothing.
 */
export type NotifyPageContent = Readonly<{
  /** Lines (desktop line breaks), each holding colour-coded phrases. */
  headlineLines: ReadonlyArray<ReadonlyArray<HeadlinePhrase>>;
  subheadline: string;
  bannerImage: string | null;
  /** First `logo` entry — the wordmark on the light desktop sidebar. */
  logo: NotifyLogo | null;
  /** Logo over the mobile photo: the second `logo` entry, else the first. */
  mobileLogo: NotifyLogo | null;
  form: LeadCaptureFormContent;
  policyLinks: readonly PolicyLink[];
  seo: SeoOverrides | null;
}>;

/** Headline colours by phrase position, matching the Figma brand treatment. */
const HEADLINE_COLORS: readonly HeadlineWordColor[] = [
  "olive",
  "terracotta",
  "brand",
];

/** Strapi editors type `/n` for a line break; accept `\n` (literal or real) too. */
const LINE_BREAK = /\s*(?:\/n|\\n|\r?\n)\s*/;

/** A phrase ends at sentence punctuation: "Wholesome. Gourmet." → 2 phrases. */
const PHRASE_BREAK = /(?<=[.!?])\s+/;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readPositiveNumber(record: UnknownRecord, key: string): number {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 0;
}

/** Media entries from a list, a single object, or Strapi v4 `{ data }`. */
function mediaList(value: unknown): UnknownRecord[] {
  if (Array.isArray(value)) return value.flatMap(mediaList);
  if (!isRecord(value)) return [];
  if ("data" in value) return mediaList(value.data);
  return [isRecord(value.attributes) ? value.attributes : value];
}

function readMediaUrl(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  const [media] = mediaList(value);
  return (media && readCmsString(media, "url")) || null;
}

function toLogo(media: UnknownRecord | undefined): NotifyLogo | null {
  if (!media) return null;
  const src = readCmsString(media, "url");
  const width = readPositiveNumber(media, "width");
  const height = readPositiveNumber(media, "height");
  // next/image needs intrinsic dimensions to keep the aspect ratio.
  if (!src || !width || !height) return null;
  return {
    src,
    width,
    height,
    alt: readCmsString(media, "alternativeText", "caption", "name"),
  };
}

/**
 * `/n` sets where lines break; each phrase keeps its own colour regardless of
 * the line it sits on, cycling olive → terracotta → brand.
 */
function readHeadlineLines(raw: string): NotifyPageContent["headlineLines"] {
  let phraseIndex = 0;
  return raw
    .split(LINE_BREAK)
    .map((line) =>
      line
        .split(PHRASE_BREAK)
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({
          text,
          color: HEADLINE_COLORS[phraseIndex++ % HEADLINE_COLORS.length]!,
        })),
    )
    .filter((line) => line.length > 0);
}

/** Site path or absolute URL; a bare `terms` becomes `/terms`. */
function normalizeHref(raw: string): string {
  if (!raw) return "";
  return /^(?:https?:\/\/|\/)/i.test(raw) ? raw : `/${raw}`;
}

/** Each link renders only when Strapi has both its label and its URL. */
function readPolicyLinks(record: UnknownRecord): PolicyLink[] {
  const pairs: Array<[labelKey: string, hrefKey: string]> = [
    ["terms_and_condition", "terms_and_condition_link"],
    ["privacy_policy", "privacy_policy_link"],
  ];
  return pairs.flatMap(([labelKey, hrefKey]) => {
    const label = readCmsString(record, labelKey);
    const href = normalizeHref(readCmsString(record, hrefKey));
    return label && href ? [{ label, href }] : [];
  });
}

/** Maps the raw `notify-me` entry to the page view model, field for field. */
export function mapNotifyMeContent(entry: NotifyMeContent): NotifyPageContent {
  const record: UnknownRecord = isRecord(entry) ? entry : {};
  const text = (key: string) => readCmsString(record, key);
  const optionalText = (key: string) => text(key) || undefined;
  const logos = mediaList(record.logo);

  return {
    headlineLines: readHeadlineLines(text("heading_one")),
    subheadline: text("sub_heading"),
    bannerImage: readMediaUrl(record.banner_image),
    logo: toLogo(logos[0]),
    mobileLogo: toLogo(logos[1] ?? logos[0]),
    form: {
      phoneLabel: text("phone_text"),
      phonePlaceholder: optionalText("phone_placeholder"),
      emailLabel: text("email_text"),
      emailPlaceholder: optionalText("email_text_placeholder"),
      consent: text("agree_text"),
      cta: text("get_notified_cta"),
    },
    policyLinks: readPolicyLinks(record),
    // `seo` is a repeatable component on this type (`[]` when empty), so
    // read its first entry; a single component object works too.
    seo: readCmsSeo({
      seo: Array.isArray(record.seo) ? record.seo[0] : record.seo,
    }),
  };
}

/** Plain-text headline, e.g. "Fresh. Wholesome. Gourmet." (alt text, title). */
export function headlineText(content: NotifyPageContent): string {
  return content.headlineLines
    .flat()
    .map((phrase) => phrase.text)
    .join(" ");
}
