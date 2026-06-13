import type { FaqContent, FaqItem, FaqPageContent } from "./faq-types";
import { faqPageLinkSchema } from "./faq-types";
import type { z } from "zod";

type FaqPageLink = z.infer<typeof faqPageLinkSchema>;

const POLICY_TITLE_TO_HREF: Record<string, string> = {
  "Privacy Policy": "/privacy-policy",
  "Terms & Conditions": "/terms",
  "Refund & Return Policy": "/refund-return",
};

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

function resolvePageHref(
  slug: string | null | undefined,
  fallbackTitle: string,
): string {
  if (typeof slug === "string" && slug.trim().length > 0) {
    const trimmed = slug.trim();
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }
  return POLICY_TITLE_TO_HREF[fallbackTitle] ?? "/";
}

function resolveCtaHref(slug: string | null | undefined): string {
  if (typeof slug === "string" && slug.trim().length > 0) {
    const trimmed = slug.trim();
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }
  return "/contact";
}

function mapFaqItem(raw: UnknownRecord): FaqItem | null {
  const question = readString(raw, "question");
  if (!question) return null;

  const answerRaw = raw.answer;
  const answer =
    typeof answerRaw === "string" ? answerRaw.replace(/\u2028/g, "\n").trim() : "";

  return {
    question,
    answer,
    defaultOpen: raw.is_expanded_by_default === true,
  };
}

function mapPageLink(raw: FaqPageLink): { label: string; href: string } | null {
  const record = raw as UnknownRecord;
  const label = readString(record, "page_title", "title", "label");
  if (!label) return null;

  const slug =
    typeof record.page_slug === "string" ? record.page_slug : null;

  return {
    label,
    href: resolvePageHref(slug, label),
  };
}

function sortByOrder<T extends UnknownRecord>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      ((a.sort_order as number | undefined) ?? 0) -
      ((b.sort_order as number | undefined) ?? 0),
  );
}

/** Returns true when the mapped FAQ page has enough content to render. */
export function hasFaqContent(content: FaqPageContent): boolean {
  return Boolean(
    content.hero.title ||
      content.items.length > 0 ||
      content.supportCta.title ||
      content.legalPolicies.links.length > 0,
  );
}

/**
 * Maps the Strapi `faq` single type into the FAQ page layout model.
 */
export function mapFaqContent(input: FaqContent): FaqPageContent {
  const faqSection = isRecord(input.faq) ? input.faq : {};
  const heroTitle = readString(faqSection, "title") || "FAQs";

  const items = sortByOrder(
    (faqSection.faq_question as UnknownRecord[] | undefined) ?? [],
  )
    .map(mapFaqItem)
    .filter((item): item is FaqItem => item !== null);

  const supportTitle = readString(
    input as UnknownRecord,
    "have_question_title",
  );
  const supportDescription = readString(
    input as UnknownRecord,
    "have_question_subtitile",
    "have_question_subtitle",
  );
  const ctaLabel = readString(input as UnknownRecord, "cta");
  const ctaHref = resolveCtaHref(input.cta_slug);

  const pagesTitle = readString(input as UnknownRecord, "pages_title");
  const links = sortByOrder(
    (input.pages ?? [])
      .map((page) => faqPageLinkSchema.safeParse(page))
      .filter((parsed) => parsed.success)
      .map((parsed) => mapPageLink(parsed.data))
      .filter((link): link is NonNullable<typeof link> => link !== null),
  );

  return {
    breadcrumbLabel: heroTitle,
    hero: { title: heroTitle },
    items,
    supportCta: {
      title: supportTitle || "Still Have Questions?",
      description:
        supportDescription ||
        "Can't find what you're looking for? Get in touch with our team",
      buttonLabel: ctaLabel || "Contact Us",
      buttonHref: ctaHref,
    },
    legalPolicies: {
      title: pagesTitle || "Legal & Policies",
      links,
    },
  };
}
