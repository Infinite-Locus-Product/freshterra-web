import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { mapTermsConditionContent } from "./terms-condition-mapper";
import { getSingleContent } from "./single-content-service";

import {
  termsConditionContentSchema,
  type TermsConditionContent,
} from "./terms-condition-types";

import type { PolicyDocument } from "./types";
import type { ContentEntryParams } from "./content-entry-service";

export const TERMS_CONDITION_CONTENT_TYPE = "terms-condition";

/**
 * Fetches the Terms & Conditions single type from
 * `GET /api/v1/content/single/terms-condition?locale=`.
 */
export async function getTermsConditionContent(
  params: ContentEntryParams = {},
): Promise<TermsConditionContent> {
  return getSingleContent<TermsConditionContent>(
    TERMS_CONDITION_CONTENT_TYPE,
    params,
    { schema: termsConditionContentSchema },
  );
}

/**
 * Server-side fetch — returns a {@link PolicyDocument} or null when unavailable.
 */
export async function fetchTermsConditionDocumentSafe(
  params: ContentEntryParams = {},
): Promise<PolicyDocument | null> {
  try {
    const entry = await getTermsConditionContent(params);
    return mapTermsConditionContent(entry);
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[terms-condition] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
