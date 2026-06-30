import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { mapPrivacyPolicyContent } from "./privacy-policy-mapper";
import { getSingleContent } from "./single-content-service";

import {
  privacyPolicyContentSchema,
  type PrivacyPolicyContent,
} from "./privacy-policy-types";

import type { PolicyDocument } from "./types";
import type { ContentEntryParams } from "./content-entry-service";

export const PRIVACY_POLICY_CONTENT_TYPE = "privacy-policy";

/**
 * Fetches the Privacy Policy single type from
 * `GET /api/v1/content/single/privacy-policy?locale=`.
 */
export async function getPrivacyPolicyContent(
  params: ContentEntryParams = {},
): Promise<PrivacyPolicyContent> {
  return getSingleContent<PrivacyPolicyContent>(
    PRIVACY_POLICY_CONTENT_TYPE,
    params,
    { schema: privacyPolicyContentSchema },
  );
}

/**
 * Server-side fetch — returns a {@link PolicyDocument} or null when unavailable.
 */
export async function fetchPrivacyPolicyDocumentSafe(
  params: ContentEntryParams = {},
): Promise<PolicyDocument | null> {
  try {
    const entry = await getPrivacyPolicyContent(params);
    return mapPrivacyPolicyContent(entry);
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[privacy-policy] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
