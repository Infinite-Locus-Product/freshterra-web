import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { mapNotifyMeContent, type NotifyPageContent } from "./notify-me-mapper";
import { notifyMeContentSchema, type NotifyMeContent } from "./notify-me-types";
import { getSingleContent } from "./single-content-service";

import type { ContentEntryParams } from "./content-entry-service";

export const NOTIFY_ME_CONTENT_TYPE = "notify-me";

/** `GET /api/v1/content/single/notify-me?locale=`. Throws on failure. */
export async function getNotifyMeContent(
  params: ContentEntryParams = {},
): Promise<NotifyMeContent> {
  return getSingleContent<NotifyMeContent>(NOTIFY_ME_CONTENT_TYPE, params, {
    schema: notifyMeContentSchema,
    expectedErrorCodes: ["NOT_FOUND"],
  });
}

/**
 * Server-side fetch for `/notify`. The page has no built-in copy, so:
 * - `null` when the entry is not published (the page renders a 404);
 * - any other failure is rethrown to the route's error boundary.
 */
export async function fetchNotifyPageContent(
  params: ContentEntryParams = {},
): Promise<NotifyPageContent | null> {
  try {
    return mapNotifyMeContent(await getNotifyMeContent(params));
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    throw error;
  }
}
