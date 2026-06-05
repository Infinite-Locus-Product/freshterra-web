import type { FooterContent, FooterSocial } from "./footer-content-types";
import {
  strapiFooterColumnSchema,
  strapiFooterEntrySchema,
  strapiFooterLinkSchema,
  strapiSocialLinkSchema,
  type StrapiFooterEntry,
  type StrapiSocialLink,
} from "./strapi-footer-types";

export const DEFAULT_STRAPI_FOOTER_SLUG = "footer-en";

const PAGE_PATH_ALIASES: Record<string, string> = {
  privacy: "/privacy-policy",
  terms: "/terms",
  refund: "/refund-return",
  "refund-return": "/refund-return",
  faq: "/faq",
  about: "/about",
};

/**
 * Maps Strapi `/pages/*` targets and absolute URLs to in-app routes.
 */
export function normalizeFooterHref(target: string): string {
  const trimmed = target.trim();
  if (!trimmed) return "/";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (path.startsWith("/pages/")) {
    const slug = path.slice("/pages/".length).replace(/\/$/, "");
    return PAGE_PATH_ALIASES[slug] ?? `/${slug}`;
  }
  return path;
}

function platformFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("instagram")) return "instagram";
    if (host.includes("facebook")) return "facebook";
    if (host.includes("youtube")) return "youtube";
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("twitter") || host === "x.com") return "x";
  } catch {
    /* relative or invalid URL */
  }
  return "social";
}

const SOCIAL_SHORT: Record<string, string> = {
  instagram: "IG",
  facebook: "f",
  youtube: "▶",
  linkedin: "in",
  x: "X",
  social: "•",
};

export function socialShortLabel(platform: string): string {
  return SOCIAL_SHORT[platform] ?? platform.slice(0, 2).toUpperCase();
}

export function mapStrapiFooterToContent(entry: StrapiFooterEntry): FooterContent {
  const groups = entry.columns.map((column) => ({
    title: column.heading,
    links: column.links.map((link) => ({
      label: link.label,
      url: normalizeFooterHref(link.target),
    })),
  }));

  const legalIndex = groups.findIndex((g) => /legal/i.test(g.title));
  const legal =
    legalIndex >= 0
      ? groups[legalIndex].links
      : groups
          .flatMap((g) => g.links)
          .filter((link) =>
            /privacy|terms|refund|policy/i.test(link.label),
          );

  const social: FooterSocial[] = entry.socialLinks
    .map((item) => ({
      platform: item.platform.trim().toLowerCase() || platformFromUrl(item.url),
      url: item.url.trim(),
      iconKey: item.iconKey?.trim() || undefined,
    }))
    .filter((item) => Boolean(item.url));

  const legalLine = entry.legalLine?.trim();

  return {
    groups: groups.filter((_, index) => index !== legalIndex),
    social,
    legal,
    copyrightLine: legalLine && legalLine.length > 0 ? legalLine : undefined,
  };
}

function unwrapStrapiAttributes<T extends Record<string, unknown>>(
  node: unknown,
): T | null {
  if (!node || typeof node !== "object") return null;
  const record = node as Record<string, unknown>;
  if ("attributes" in record && record.attributes && typeof record.attributes === "object") {
    return record.attributes as T;
  }
  return record as T;
}

function parseLinkComponent(raw: unknown) {
  const attrs = unwrapStrapiAttributes<Record<string, unknown>>(raw);
  if (!attrs) return null;
  const parsed = strapiFooterLinkSchema.safeParse({
    id: raw && typeof raw === "object" && "id" in raw ? (raw as { id: unknown }).id : undefined,
    label: attrs.label,
    target: attrs.target,
  });
  return parsed.success ? parsed.data : null;
}

function parseColumnComponent(raw: unknown) {
  const attrs = unwrapStrapiAttributes<Record<string, unknown>>(raw);
  if (!attrs || typeof attrs.heading !== "string") return null;

  const linksRaw = attrs.links;
  const linkList = Array.isArray(linksRaw)
    ? linksRaw
    : linksRaw &&
        typeof linksRaw === "object" &&
        "data" in linksRaw &&
        Array.isArray((linksRaw as { data: unknown[] }).data)
      ? (linksRaw as { data: unknown[] }).data
      : [];

  const links = linkList
    .map(parseLinkComponent)
    .filter((link): link is NonNullable<typeof link> => link !== null);

  return strapiFooterColumnSchema.parse({
    id: raw && typeof raw === "object" && "id" in raw ? (raw as { id: unknown }).id : undefined,
    heading: attrs.heading,
    links,
  });
}

function parseSocialLinkComponent(raw: unknown): StrapiSocialLink | null {
  if (typeof raw === "string" && raw.trim()) {
    return strapiSocialLinkSchema.parse({
      platform: platformFromUrl(raw),
      url: raw.trim(),
      iconKey: platformFromUrl(raw),
    });
  }

  const attrs = unwrapStrapiAttributes<Record<string, unknown>>(raw);
  if (!attrs) return null;

  const url =
    typeof attrs.url === "string"
      ? attrs.url
      : typeof (raw as { url?: string }).url === "string"
        ? (raw as { url: string }).url
        : null;
  if (!url?.trim()) return null;

  const platform =
    typeof attrs.platform === "string" && attrs.platform.trim()
      ? attrs.platform.trim()
      : platformFromUrl(url);

  const iconKey =
    typeof attrs.iconKey === "string" && attrs.iconKey.trim()
      ? attrs.iconKey.trim()
      : platform;

  const parsed = strapiSocialLinkSchema.safeParse({
    id:
      raw && typeof raw === "object" && "id" in raw
        ? (raw as { id: unknown }).id
        : undefined,
    platform,
    url: url.trim(),
    iconKey,
  });

  return parsed.success ? parsed.data : null;
}

function parseSocialLinks(raw: unknown): StrapiSocialLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(parseSocialLinkComponent)
    .filter((item): item is StrapiSocialLink => item !== null);
}

/**
 * Parses Strapi REST `footers` collection responses (v4 + v5 shapes).
 */
export function parseStrapiFooterResponse(payload: unknown): StrapiFooterEntry | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const data = root.data;

  const entry = Array.isArray(data) ? data[0] : data;
  if (!entry) return null;

  const attrs = unwrapStrapiAttributes<Record<string, unknown>>(entry);
  if (!attrs || typeof attrs.slug !== "string") return null;

  const columnsRaw = attrs.columns;
  const columnsList = Array.isArray(columnsRaw)
    ? columnsRaw
    : columnsRaw &&
        typeof columnsRaw === "object" &&
        "data" in columnsRaw &&
        Array.isArray((columnsRaw as { data: unknown[] }).data)
      ? (columnsRaw as { data: unknown[] }).data
      : [];

  const columns = columnsList
    .map(parseColumnComponent)
    .filter((col): col is NonNullable<typeof col> => col !== null);

  const parsed = strapiFooterEntrySchema.safeParse({
    slug: attrs.slug,
    columns,
    socialLinks: parseSocialLinks(attrs.socialLinks),
    legalLine: typeof attrs.legalLine === "string" ? attrs.legalLine : undefined,
  });

  return parsed.success ? parsed.data : null;
}
