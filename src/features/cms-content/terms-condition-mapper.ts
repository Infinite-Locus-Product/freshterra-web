import { mapPolicyDescriptionContent } from "./policy-description-mapper";

import type { TermsConditionContent } from "./terms-condition-types";
import type { PolicyDocument } from "./types";

/** Maps the Strapi `terms-condition` single type into {@link PolicyDocument}. */
export function mapTermsConditionContent(
  input: TermsConditionContent,
): PolicyDocument | null {
  return mapPolicyDescriptionContent(input, {
    slug: "terms",
    defaultTitle: "Terms & Conditions",
  });
}
