import type { PolicyBlock, PolicyDocument, PolicySlug, PolicySpan } from "./types";

import type { PolicyCmsContent } from "./policy-cms-types";

const SECTION_HEADING_PATTERN = /\*\*#\s*(\d+)\.\s*([^*]+)\*\*/g;
const ALT_SECTION_HEADING_PATTERN = /#\s*\*\*(\d+)\.\s*([^*]+)\*\*/g;
const LAST_UPDATED_PATTERN = /\n\nLast Updated:\s*([^\n]+)\s*$/i;
const EMAIL_PATTERN = /([\w.+-]+@[\w.-]+\.\w+)/;

type MapPolicyDescriptionOptions = {
  slug: PolicySlug;
  defaultTitle: string;
};

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

function normalizePolicyDescription(description: string): string {
  return description.replace(
    ALT_SECTION_HEADING_PATTERN,
    "**# $1. $2**",
  );
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

function parseSpans(text: string): PolicySpan[] {
  if (!text.includes("**")) {
    return text ? [{ text }] : [];
  }

  const spans: PolicySpan[] = [];
  const parts = text.split("**");

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (!part) continue;
    spans.push({
      text: part,
      ...(index % 2 === 1 ? { bold: true } : {}),
    });
  }

  return spans;
}

function normalizeBulletLine(line: string): string {
  return line.replace(/^•\t?/, "").trim();
}

function isBulletLine(line: string): boolean {
  return line.trim().startsWith("•");
}

function parseBlocks(body: string): PolicyBlock[] {
  const blocks: PolicyBlock[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    blocks.push({
      type: "list",
      items: bulletBuffer.map((line) =>
        parseSpans(normalizeBulletLine(line)),
      ),
    });
    bulletBuffer = [];
  };

  for (const chunk of body.split(/\n\n+/).map((part) => part.trim()).filter(Boolean)) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);

    for (const line of lines) {
      if (isBulletLine(line)) {
        bulletBuffer.push(line);
        continue;
      }

      flushBullets();
      blocks.push({
        type: "paragraph",
        spans: parseSpans(line),
      });
    }

    flushBullets();
  }

  return blocks;
}

function splitIntroAndSections(body: string): {
  intro?: PolicyDocument["intro"];
  sections: PolicyDocument["sections"];
} {
  const matches = [...body.matchAll(SECTION_HEADING_PATTERN)];
  if (matches.length === 0) {
    const blocks = parseBlocks(body);
    return {
      ...(blocks.length > 0 ? { intro: { blocks } } : {}),
      sections: [],
    };
  }

  const introText = body.slice(0, matches[0]?.index ?? 0).trim();
  const sections: PolicyDocument["sections"] = [];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    if (!match) continue;

    const sectionStart = (match.index ?? 0) + match[0].length;
    const sectionEnd = matches[index + 1]?.index ?? body.length;
    const sectionBody = body.slice(sectionStart, sectionEnd).trim();
    const sectionNumber = match[1] ?? String(index + 1);
    const sectionTitle = match[2]?.trim() ?? "";

    sections.push({
      id: `section-${sectionNumber}`,
      heading: `${sectionNumber}. ${sectionTitle}`,
      blocks: parseBlocks(sectionBody),
    });
  }

  const introBlocks = introText ? parseBlocks(introText) : [];

  return {
    ...(introBlocks.length > 0 ? { intro: { blocks: introBlocks } } : {}),
    sections,
  };
}

/**
 * Maps a Strapi policy single type (`title` + markdown-style `description`)
 * into the shared {@link PolicyDocument} view model.
 */
export function mapPolicyDescriptionContent(
  input: PolicyCmsContent,
  options: MapPolicyDescriptionOptions,
): PolicyDocument | null {
  const description = input.description?.trim() ?? "";
  if (!description) return null;

  const normalized = normalizePolicyDescription(description);
  const { body, lastUpdatedLabel } = stripLastUpdatedFooter(normalized);
  const { intro, sections } = splitIntroAndSections(body);

  const title = input.title?.trim() || options.defaultTitle;
  const lastUpdated =
    (lastUpdatedLabel ? parseUsDateLabel(lastUpdatedLabel) : "") ||
    input.updatedAt?.slice(0, 10) ||
    input.publishedAt?.slice(0, 10) ||
    "";

  const emailMatch = EMAIL_PATTERN.exec(normalized);

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
