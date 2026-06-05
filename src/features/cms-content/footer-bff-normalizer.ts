import {
  mapStrapiFooterToContent,
  normalizeFooterHref,
  parseStrapiFooterResponse,
} from "./strapi-footer-mapper";

import type { FooterContent, FooterLink, FooterSocial } from "./footer-content-types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseLink(raw: unknown): FooterLink | null {
  if (!isRecord(raw)) return null;
  const label = typeof raw.label === "string" ? raw.label : null;
  const url =
    typeof raw.url === "string"
      ? raw.url
      : typeof raw.target === "string"
        ? raw.target
        : typeof raw.href === "string"
          ? raw.href
          : null;
  if (!label || !url) return null;
  return { label, url: normalizeFooterHref(url) };
}

function parseSocial(raw: unknown): FooterSocial | null {
  if (!isRecord(raw)) return null;
  const url = typeof raw.url === "string" ? raw.url.trim() : "";
  if (!url) return null;
  const platform =
    typeof raw.platform === "string" && raw.platform.trim()
      ? raw.platform.trim().toLowerCase()
      : "social";
  const iconKey =
    typeof raw.iconKey === "string" && raw.iconKey.trim()
      ? raw.iconKey.trim()
      : undefined;
  return { platform, url, iconKey };
}

function parseGroup(raw: unknown): { title: string; links: FooterLink[] } | null {
  if (!isRecord(raw)) return null;
  const title =
    typeof raw.title === "string"
      ? raw.title
      : typeof raw.heading === "string"
        ? raw.heading
        : null;
  if (!title) return null;
  const linksRaw = raw.links;
  const links = Array.isArray(linksRaw)
    ? linksRaw.map(parseLink).filter((l): l is FooterLink => l !== null)
    : [];
  return { title, links };
}

function isStrapiShapedFooter(record: UnknownRecord): boolean {
  return "columns" in record || "socialLinks" in record;
}

/**
 * Normalizes the FreshTerra BFF `GET /api/v1/content/pages/footer` payload.
 * Supports the documented `{ groups, social, legal, copyrightLine }` shape and
 * a Strapi-shaped passthrough `{ columns, socialLinks, legalLine }` from the BE.
 */
export function normalizeFooterBffPayload(input: unknown): FooterContent {
  if (!isRecord(input)) {
    throw new Error("Invalid footer payload");
  }

  if (isStrapiShapedFooter(input)) {
    const entry = parseStrapiFooterResponse({ data: input });
    if (entry) return mapStrapiFooterToContent(entry);
  }

  const groupsRaw = input.groups ?? input.columns;
  const groups = Array.isArray(groupsRaw)
    ? groupsRaw
        .map(parseGroup)
        .filter((g): g is NonNullable<typeof g> => g !== null)
    : [];

  const socialRaw = input.social ?? input.socialLinks;
  const social = Array.isArray(socialRaw)
    ? socialRaw
        .map(parseSocial)
        .filter((s): s is FooterSocial => s !== null)
    : [];

  const legal = Array.isArray(input.legal)
    ? input.legal
        .map(parseLink)
        .filter((l): l is FooterLink => l !== null)
    : [];

  const copyrightLine =
    typeof input.copyrightLine === "string"
      ? input.copyrightLine.trim()
      : typeof input.legalLine === "string"
        ? input.legalLine.trim()
        : undefined;

  return {
    groups,
    social,
    legal,
    copyrightLine: copyrightLine || undefined,
  };
}
