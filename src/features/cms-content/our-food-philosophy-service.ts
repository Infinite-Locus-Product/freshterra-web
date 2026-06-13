import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import {
  hasFoodPhilosophyContent,
  mapOurFoodPhilosophyContent,
} from "./our-food-philosophy-mapper";
import { getSingleContent } from "./single-content-service";

import {
  ourFoodPhilosophyContentSchema,
  type FoodPhilosophyPageContent,
  type OurFoodPhilosophyContent,
} from "./our-food-philosophy-types";

import type { ContentEntryParams } from "./content-entry-service";

export const OUR_FOOD_PHILOSOPHY_CONTENT_TYPE = "our-food-philosophy";

/**
 * Fetches the Food Philosophy single type from
 * `GET /api/v1/content/single/our-food-philosophy?locale=`.
 */
export async function getOurFoodPhilosophyContent(
  params: ContentEntryParams = {},
): Promise<OurFoodPhilosophyContent> {
  return getSingleContent<OurFoodPhilosophyContent>(
    OUR_FOOD_PHILOSOPHY_CONTENT_TYPE,
    params,
    { schema: ourFoodPhilosophyContentSchema },
  );
}

/**
 * Server-side fetch — returns mapped CMS content or null when unavailable.
 */
export async function fetchOurFoodPhilosophyContentSafe(
  params: ContentEntryParams = {},
): Promise<FoodPhilosophyPageContent | null> {
  try {
    const entry = await getOurFoodPhilosophyContent(params);
    const content = mapOurFoodPhilosophyContent(entry);
    return hasFoodPhilosophyContent(content) ? content : null;
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[our-food-philosophy] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
