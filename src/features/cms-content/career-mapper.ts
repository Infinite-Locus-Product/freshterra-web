import { readCmsString } from "./cms-readers";
import { readCmsSeo } from "./cms-seo";

import type {
  CareerContent,
  CareerDepartmentGroup,
  CareerJob,
  CareersPageContent,
} from "./career-types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readMediaUrl(record: UnknownRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (!isRecord(value)) continue;

    const direct = readCmsString(value, "url", "src", "href");
    if (direct) return direct;
  }
  return "";
}

function splitParagraphs(text: string): string[] {
  return text
    .replace(/\u2028/g, "\n")
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isActive(record: UnknownRecord): boolean {
  const value = record.is_active ?? record.isActive;
  if (value === false || value === "false") return false;
  return true;
}

function sortByOrder(items: UnknownRecord[]): UnknownRecord[] {
  return [...items].sort(
    (a, b) =>
      ((a.sort_order as number | undefined) ?? 0) -
      ((b.sort_order as number | undefined) ?? 0),
  );
}

function mapJob(raw: UnknownRecord): CareerJob | null {
  if (!isActive(raw)) return null;

  const title = readCmsString(raw, "job_title", "title");
  const description = readCmsString(
    raw,
    "job_subtitle",
    "description",
    "subtitle",
  );
  const applyCtaLabel = readCmsString(raw, "apply_cta", "cta") || "Apply Now";

  if (!title) return null;

  return {
    title,
    description,
    applyCtaLabel,
  };
}

function mapDepartment(raw: UnknownRecord): CareerDepartmentGroup | null {
  if (!isActive(raw)) return null;

  const title = readCmsString(raw, "department_title", "title");
  if (!title) return null;

  const careersRaw = Array.isArray(raw.careers) ? raw.careers : [];
  const jobs = sortByOrder(careersRaw as UnknownRecord[])
    .map((item) => mapJob(item))
    .filter((job): job is CareerJob => job !== null);

  if (jobs.length === 0) return null;

  return { title, jobs };
}

/** Returns true when the mapped careers page has renderable content. */
export function hasCareerContent(content: CareersPageContent): boolean {
  return Boolean(
    content.hero.title ||
    content.hero.subtitle ||
    content.hero.paragraphs.length > 0 ||
    content.hero.bannerSrc ||
    content.openings.groups.length > 0,
  );
}

/** Maps the `career` single type into the Careers page layout model. */
export function mapCareerContent(input: CareerContent): CareersPageContent {
  const heroRecord = isRecord(input.career_hero) ? input.career_hero : {};

  const title = readCmsString(heroRecord, "title") || "Careers at FreshTerra";
  const subtitle = readCmsString(heroRecord, "subtitile", "subtitle");
  const bannerSrc = readMediaUrl(
    heroRecord,
    "heroimage",
    "hero_image",
    "image",
  );
  const bannerSrcMobile =
    readMediaUrl(heroRecord, "hero_image_mweb", "heroImageMweb") || bannerSrc;
  const description = readCmsString(heroRecord, "description");
  const paragraphs = description ? splitParagraphs(description) : [];
  const bannerAlt =
    readCmsString(heroRecord, "short_title", "subtitile", "subtitle") || title;

  const departmentsRaw = Array.isArray(input.department)
    ? input.department
    : [];
  const groups = sortByOrder(departmentsRaw as UnknownRecord[])
    .map((item) => mapDepartment(item))
    .filter((group): group is CareerDepartmentGroup => group !== null);

  const openingsTitle =
    typeof input.position_title === "string" && input.position_title.trim()
      ? input.position_title.trim()
      : "Open Positions";

  const seo = readCmsSeo(input);

  return {
    hero: {
      title,
      subtitle,
      paragraphs,
      bannerSrc,
      ...(bannerSrcMobile ? { bannerSrcMobile } : {}),
      bannerAlt,
    },
    openings: {
      title: openingsTitle,
      groups,
    },
    ...(seo ? { seo } : {}),
  };
}
