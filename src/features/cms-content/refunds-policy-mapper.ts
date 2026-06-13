import { mapPolicyDescriptionContent } from "./policy-description-mapper";

import type { RefundsPolicyContent } from "./refunds-policy-types";
import type { PolicyDocument } from "./types";

/** Maps the Strapi `refunds-policy` single type into {@link PolicyDocument}. */
export function mapRefundsPolicyContent(
  input: RefundsPolicyContent,
): PolicyDocument | null {
  return mapPolicyDescriptionContent(input, {
    slug: "refund-return",
    defaultTitle: "Refund & Return Policy",
  });
}
