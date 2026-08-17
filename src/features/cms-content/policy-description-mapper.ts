import type { PolicyCmsContent } from "./policy-cms-types";
import type {
  PolicyBlock,
  PolicyDocument,
  PolicySection,
  PolicySlug,
  PolicySpan,
} from "./types";

const LAST_UPDATED_PATTERN = /\n\nLast Updated:\s*([^\n]+)\s*$/i;
const EMAIL_PATTERN = /([\w.+-]+@[\w.-]+\.\w+)/;

/**
 * Legacy CMS heading — hashes live *inside* the bold markers: `**# 1. Title**`.
 * Still used by the Terms and Refunds single types.
 */
const LEGACY_HEADING_PATTERN = /^\*\*(#{1,6})\s*(.+?)\*\*$/;

/** Standard markdown ATX heading: `## 1. Title`. Used by Privacy. */
const ATX_HEADING_PATTERN = /^(#{1,6})\s+(.+)$/;

/** `•`, `-` or `*` followed by whitespace (the `•\t…` legacy form included). */
const BULLET_PATTERN = /^([•*]|-)\s+/;

/** Horizontal rules (`---`, `***`) must not be mistaken for bullets. */
const THEMATIC_BREAK_PATTERN = /^([-*_])\1{2,}$/;

type MapPolicyDescriptionOptions = {
  slug: PolicySlug;
  defaultTitle: string;
};

type ParsedHeading = { level: number; text: string };

function parseUsDateLabel(label: string): string {
  const parsed = new Date(label.trim());
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return label.trim();
}

function stripLastUpdatedFooter(text: string): {
  body: string;
  lastUpdatedLabel?: string;
} {
  const match = LAST_UPDATED_PATTERN.exec(text);
  if (!match?.index) {
    return { body: text.trim() };
  }

  return {
    body: text.slice(0, match.index).trim(),
    lastUpdatedLabel: match[1]?.trim(),
  };
}

/** `**Title**` → `Title`. Heading text carries its emphasis structurally. */
function stripWrappingBold(text: string): string {
  const match = /^\*\*(.+)\*\*$/.exec(text.trim());
  return match?.[1]?.trim() ?? text.trim();
}

/**
 * Recognises both authoring styles:
 *   - `**# 1. Title**`  (legacy — Terms / Refunds)
 *   - `## 1. Title`     (standard markdown — Privacy)
 */
function parseHeadingLine(line: string): ParsedHeading | null {
  const trimmed = line.trim();

  const legacy = LEGACY_HEADING_PATTERN.exec(trimmed);
  if (legacy?.[1] && legacy[2]) {
    return { level: legacy[1].length, text: legacy[2].trim() };
  }

  const atx = ATX_HEADING_PATTERN.exec(trimmed);
  if (atx?.[1] && atx[2]) {
    // `# **1. Title**` — the old alternate form — lands here too.
    return { level: atx[1].length, text: stripWrappingBold(atx[2]) };
  }

  return null;
}

/**
 * Splits `**bold**` runs out of a line.
 *
 * Regex-scans rather than splitting on `**`, so an unbalanced marker is left
 * as literal text instead of flipping every following span to bold.
 */
function parseSpans(text: string): PolicySpan[] {
  const spans: PolicySpan[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      spans.push({ text: text.slice(cursor, match.index) });
    }
    if (match[1]) spans.push({ text: match[1], bold: true });
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) spans.push({ text: text.slice(cursor) });

  return spans.filter((span) => span.text.length > 0);
}

function isBulletLine(line: string): boolean {
  const trimmed = line.trim();
  if (THEMATIC_BREAK_PATTERN.test(trimmed)) return false;
  return BULLET_PATTERN.test(trimmed) || trimmed.startsWith("•");
}

function normalizeBulletLine(line: string): string {
  return line.trim().replace(/^•\t?/, "").replace(BULLET_PATTERN, "").trim();
}

/** `1. Information We Collect` → `section-1`; otherwise a slug of the title. */
function sectionId(headingText: string, fallbackIndex: number): string {
  const numbered = /^(\d+)[.)]/.exec(headingText.trim());
  if (numbered?.[1]) return `section-${numbered[1]}`;

  const slug = headingText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `section-${slug}` : `section-${fallbackIndex}`;
}

/**
 * Single linear pass over the description.
 *
 * Levels 1–2 open a new {@link PolicySection}; 3 and deeper become a heading
 * block inside the current section. Content before the first heading is the
 * intro.
 */
function splitIntroAndSections(body: string): {
  intro?: PolicyDocument["intro"];
  sections: PolicyDocument["sections"];
} {
  const introBlocks: PolicyBlock[] = [];
  const sections: PolicySection[] = [];
  let current: PolicySection | null = null;
  let bulletBuffer: string[] = [];

  const targetBlocks = (): PolicyBlock[] => current?.blocks ?? introBlocks;

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    targetBlocks().push({
      type: "list",
      items: bulletBuffer.map((line) => parseSpans(normalizeBulletLine(line))),
    });
    bulletBuffer = [];
  };

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();

    // A blank line terminates the current list.
    if (!line) {
      flushBullets();
      continue;
    }

    const heading = parseHeadingLine(line);
    if (heading) {
      flushBullets();

      if (heading.level <= 2) {
        current = {
          id: sectionId(heading.text, sections.length + 1),
          heading: heading.text,
          blocks: [],
        };
        sections.push(current);
      } else {
        targetBlocks().push({
          type: "heading",
          level: heading.level >= 4 ? 4 : 3,
          spans: parseSpans(heading.text),
        });
      }
      continue;
    }

    if (isBulletLine(line)) {
      bulletBuffer.push(line);
      continue;
    }

    flushBullets();
    targetBlocks().push({ type: "paragraph", spans: parseSpans(line) });
  }

  flushBullets();

  return {
    ...(introBlocks.length > 0 ? { intro: { blocks: introBlocks } } : {}),
    sections,
  };
}

/**
 * Maps a Strapi policy single type (`title` + markdown `description`) into the
 * shared {@link PolicyDocument} view model.
 *
 * Handles both authoring styles the CMS currently contains — standard markdown
 * (`##` headings, `-` bullets) and the legacy `**# n. Title**` + `•` form.
 */
export function mapPolicyDescriptionContent(
  input: PolicyCmsContent,
  options: MapPolicyDescriptionOptions,
): PolicyDocument | null {
  const description = input.description?.trim() ?? "";
  if (!description) return null;

  const { body, lastUpdatedLabel } = stripLastUpdatedFooter(description);
  const { intro, sections } = splitIntroAndSections(body);

  const title = input.title?.trim() || options.defaultTitle;
  const lastUpdated =
    (lastUpdatedLabel ? parseUsDateLabel(lastUpdatedLabel) : "") ||
    input.updatedAt?.slice(0, 10) ||
    input.publishedAt?.slice(0, 10) ||
    "";

  const emailMatch = EMAIL_PATTERN.exec(description);

  return {
    slug: options.slug,
    title,
    breadcrumbLabel: title,
    lastUpdated,
    ...(emailMatch?.[1] ? { contactEmail: emailMatch[1] } : {}),
    ...(intro ? { intro } : {}),
    sections,
  };
}
