import { fetchPrivacyPolicyDocumentSafe } from "./privacy-policy-service";
import { fetchRefundsPolicyDocumentSafe } from "./refunds-policy-service";
import { fetchTermsConditionDocumentSafe } from "./terms-condition-service";

import type { PolicyDocument, PolicySlug } from "./types";

/**
 * Fetches a policy/legal document by slug from Strapi single types.
 */
export async function getPolicyDocument(
  slug: PolicySlug,
): Promise<PolicyDocument | null> {
  if (slug === "privacy") {
    return fetchPrivacyPolicyDocumentSafe();
  }

  if (slug === "refund-return") {
    return fetchRefundsPolicyDocumentSafe();
  }

  if (slug === "terms") {
    return fetchTermsConditionDocumentSafe();
  }

  return null;
}

export type { PolicyDocument, PolicySlug } from "./types";
