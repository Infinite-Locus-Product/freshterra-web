import { isCmsActive } from "./cms-boolean";
import { normalizeCmsDeeplink } from "./cms-href";
import { normalizeFooterHref } from "./strapi-footer-mapper";

import type { FooterContent, FooterLink } from "./footer-content-types";
import type { WebFooterContent } from "./web-footer-types";

type WebFooterColumn = NonNullable<WebFooterContent["footer"]>[number];
type WebFooterLabel = NonNullable<WebFooterColumn["footer_label"]>[number];

const HEAD_OFFICE_HEADING = /^head\s*office$/i;

function resolveFooterDeeplink(
  deeplink: string | null | undefined,
): string | undefined {
  return (
    normalizeCmsDeeplink(deeplink) ??
    (deeplink?.trim() ? normalizeFooterHref(deeplink) : undefined)
  );
}

function splitOfficeLines(label: string | null | undefined): string[] {
  if (!label?.trim()) return [];
  return label
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function mapFooterLabelItem(label: WebFooterLabel): FooterLink | null {
  if (!isCmsActive(label.is_active)) return null;

  const text = label.label?.trim();
  if (!text || text.includes("\n")) return null;

  const url = resolveFooterDeeplink(label.deeplink);
  return url ? { label: text, url } : { label: text };
}

function mapFooterColumn(
  column: WebFooterColumn,
): { group?: FooterContent["groups"][number]; office?: FooterContent["office"] } {
  if (!isCmsActive(column.is_active)) return {};

  const heading = column.heading?.trim() ?? "";
  if (!heading) return {};

  const labels = [...(column.footer_label ?? [])].sort(
    (a, b) => (a.position ?? 999) - (b.position ?? 999),
  );

  if (HEAD_OFFICE_HEADING.test(heading)) {
    const lines = labels.flatMap((item) => splitOfficeLines(item.label));
    if (lines.length === 0) return {};
    return { office: { title: heading, lines } };
  }

  const links = labels
    .map(mapFooterLabelItem)
    .filter((link): link is FooterLink => link !== null);

  if (links.length === 0) return {};
  return { group: { title: heading, links } };
}

/** Maps `web-footer` CMS payload into the shared footer view model. */
export function mapWebFooterContent(input: WebFooterContent): FooterContent {
  const groups: FooterContent["groups"] = [];
  let office: FooterContent["office"];

  const columns = [...(input.footer ?? [])].sort(
    (a, b) => (a.position ?? 999) - (b.position ?? 999),
  );

  for (const column of columns) {
    const mapped = mapFooterColumn(column);
    if (mapped.group) groups.push(mapped.group);
    if (mapped.office) office = mapped.office;
  }

  return {
    groups,
    ...(office ? { office } : {}),
    social: [],
    legal: [],
  };
}

export const EMPTY_FOOTER_CONTENT: FooterContent = {
  groups: [],
  social: [],
  legal: [],
};
