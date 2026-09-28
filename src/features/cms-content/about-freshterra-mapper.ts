import {
  aboutFreshterraCoreImageSchema,
  aboutFreshterraStorySchema,
} from "./about-freshterra-types";
import { readCmsString } from "./cms-readers";
import { readCmsSeo } from "./cms-seo";

import type {
  AboutCoreValueItem,
  AboutFreshterraContent,
  AboutPageContent,
  AboutStoryItem,
} from "./about-freshterra-types";
import type { z } from "zod";

type AboutFreshterraCoreImage = z.infer<typeof aboutFreshterraCoreImageSchema>;
type AboutFreshterraStory = z.infer<typeof aboutFreshterraStorySchema>;

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

    const data = value.data;
    if (!isRecord(data)) continue;

    const fromData = readCmsString(data, "url", "src");
    if (fromData) return fromData;

    const attributes = data.attributes;
    if (isRecord(attributes)) {
      const fromAttrs = readCmsString(attributes, "url", "src");
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

function mapCoreValue(
  raw: AboutFreshterraCoreImage,
): AboutCoreValueItem | null {
  const record = raw as UnknownRecord;
  if (!isActive(record)) return null;

  const imageSrc = readMediaUrl(
    record,
    "imageMobile",
    "image_mobile",
    "iamge_mweb",
    "image_mweb",
    "image",
    "imageUrl",
    "image_src",
    "imageWeb",
  );
  if (!imageSrc) return null;

  return {
    label: readCmsString(record, "label", "title", "name"),
    description: readCmsString(record, "description", "subtitle"),
    imageSrc,
  };
}

function mapStory(raw: AboutFreshterraStory): AboutStoryItem | null {
  const record = raw as UnknownRecord;
  if (!isActive(record)) return null;

  const name = readCmsString(record, "customer_name", "name");
  const quote = readCmsString(record, "quote", "testimonial", "description");
  const imageSrc = readMediaUrl(
    record,
    "thumbnail_image_mweb",
    "thumbnail",
    "image",
    "imageUrl",
    "image_src",
    "imageMobile",
  );
  if (!name || !quote || !imageSrc) return null;

  const ageLabel =
    readCmsString(record, "customer_title", "ageLabel", "age") ||
    (typeof record.age === "number" ? `${record.age} Years` : "");

  return { name, ageLabel, quote, imageSrc };
}

function hasStoryContent(
  story: NonNullable<AboutPageContent["story"]>,
): boolean {
  return Boolean(story.title || story.subtitle || story.paragraphs.length > 0);
}

function hasMissionContent(
  mission: NonNullable<AboutPageContent["mission"]>,
): boolean {
  return Boolean(mission.title || mission.description);
}

/**
 * Maps the about-freshterra single type into the About page layout model.
 * Only CMS fields are included — missing sections are omitted entirely.
 */
export function mapAboutFreshterraContent(
  input: AboutFreshterraContent,
): AboutPageContent {
  const result: AboutPageContent = {};
  const heroRecord = isRecord(input.herosection) ? input.herosection : {};

  const bannerSrc = readMediaUrl(
    heroRecord,
    "heroimage",
    "hero_image",
    "image",
  );
  const bannerSrcMobile =
    readMediaUrl(heroRecord, "hero_image_mweb", "heroImageMweb") || bannerSrc;
  const heroTitle = readCmsString(heroRecord, "title");
  const storySubtitle = readCmsString(heroRecord, "subtitile", "subtitle");

  if (heroTitle || bannerSrc || bannerSrcMobile) {
    result.hero = {
      ...(heroTitle ? { title: heroTitle } : {}),
      ...(storySubtitle ? { bannerAlt: storySubtitle } : {}),
      ...(bannerSrc ? { bannerSrc } : {}),
      ...(bannerSrcMobile ? { bannerSrcMobile } : {}),
    };
  }

  const storyTitle = readCmsString(heroRecord, "short_title", "story_title");
  const description = readCmsString(heroRecord, "description");
  const storyParagraphs = description ? splitParagraphs(description) : [];

  if (storyTitle || storySubtitle || storyParagraphs.length > 0) {
    const story: NonNullable<AboutPageContent["story"]> = {
      paragraphs: storyParagraphs,
    };
    if (storyTitle) story.title = storyTitle;
    if (storySubtitle) story.subtitle = storySubtitle;
    if (hasStoryContent(story)) result.story = story;
  }

  const missionTitle = input.mission_title?.trim() ?? "";
  const missionDescription = input.mission_subtitle?.trim() ?? "";
  if (missionTitle || missionDescription) {
    const mission: NonNullable<AboutPageContent["mission"]> = {};
    if (missionTitle) mission.title = missionTitle;
    if (missionDescription) mission.description = missionDescription;
    if (hasMissionContent(mission)) result.mission = mission;
  }

  const coreImages = [...(input.core_images ?? [])]
    .sort(
      (a, b) =>
        (((a as UnknownRecord).sort_order as number | undefined) ?? 0) -
        (((b as UnknownRecord).sort_order as number | undefined) ?? 0),
    )
    .map(mapCoreValue)
    .filter((item): item is AboutCoreValueItem => item !== null);
  if (coreImages.length > 0) {
    const valuesHeading =
      typeof input.values_heading === "string"
        ? input.values_heading.trim()
        : "";
    const valuesSubtitle =
      typeof input.values_subtitle === "string"
        ? input.values_subtitle.trim()
        : "";
    result.coreValues = {
      items: coreImages,
      ...(valuesHeading ? { title: valuesHeading } : {}),
      ...(valuesSubtitle ? { subtitle: valuesSubtitle } : {}),
    };
  }

  const stories = [...(input.stories ?? [])]
    .sort(
      (a, b) =>
        (((a as UnknownRecord).position as number | undefined) ?? 0) -
        (((b as UnknownRecord).position as number | undefined) ?? 0),
    )
    .map(mapStory)
    .filter((item): item is AboutStoryItem => item !== null);
  if (stories.length > 0) {
    const storiesTitle = input.story_section_tagline?.trim() ?? "";
    const storiesSubtitle = input.story_section_title?.trim() ?? "";
    result.customerStories = {
      items: stories,
      ...(storiesTitle ? { title: storiesTitle } : {}),
      ...(storiesSubtitle ? { subtitle: storiesSubtitle } : {}),
    };
  }

  const seo = readCmsSeo(input);
  if (seo) result.seo = seo;

  return result;
}
