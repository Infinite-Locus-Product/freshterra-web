import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { mapContactWebGetInTouch } from "./contact-web-mapper";
import { getSingleContent } from "./single-content-service";

import {
  contactWebContentSchema,
  type ContactGetInTouchItem,
  type ContactWebContent,
} from "./contact-web-types";

import type { ContentEntryParams } from "./content-entry-service";

export const CONTACT_WEB_CONTENT_TYPE = "contact-web";

/**
 * Fetches the contact-web single type from
 * `GET /api/v1/content/single/contact-web?locale=`.
 */
export async function getContactWebContent(
  params: ContentEntryParams = {},
): Promise<ContactWebContent> {
  return getSingleContent<ContactWebContent>(
    CONTACT_WEB_CONTENT_TYPE,
    params,
    { schema: contactWebContentSchema },
  );
}

/**
 * Server-side fetch — returns mapped Get In Touch rows or an empty list.
 */
export async function fetchContactGetInTouchSafe(
  params: ContentEntryParams = {},
): Promise<ContactGetInTouchItem[]> {
  try {
    const entry = await getContactWebContent(params);
    return mapContactWebGetInTouch(entry);
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return [];
    }
    console.warn(
      "[contact-web] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}
