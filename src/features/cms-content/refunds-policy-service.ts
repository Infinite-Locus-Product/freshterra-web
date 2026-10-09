import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { mapRefundsPolicyContent } from "./refunds-policy-mapper";
import {
  refundsPolicyContentSchema,
  type RefundsPolicyContent,
} from "./refunds-policy-types";
import { getSingleContent } from "./single-content-service";


import type { ContentEntryParams } from "./content-entry-service";
import type { PolicyDocument } from "./types";

export const REFUNDS_POLICY_CONTENT_TYPE = "refunds-policy";

/**
 * Fetches the Refunds & Returns Policy single type from
 * `GET /api/v1/content/single/refunds-policy?locale=`.
 */
export async function getRefundsPolicyContent(
  params: ContentEntryParams = {},
): Promise<RefundsPolicyContent> {
  return getSingleContent<RefundsPolicyContent>(
    REFUNDS_POLICY_CONTENT_TYPE,
    params,
    { schema: refundsPolicyContentSchema },
  );
}

/**
 * Server-side fetch — returns a {@link PolicyDocument} or null when unavailable.
 */
export async function fetchRefundsPolicyDocumentSafe(
  params: ContentEntryParams = {},
): Promise<PolicyDocument | null> {
  try {
    const entry = await getRefundsPolicyContent(params);
    return mapRefundsPolicyContent(entry);
  } catch (error) {
    if (error instanceof FreshTerraApiError && error.code === "NOT_FOUND") {
      return null;
    }
    console.warn(
      "[refunds-policy] fetch failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
