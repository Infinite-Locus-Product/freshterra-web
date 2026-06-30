import { mapPolicyDescriptionContent } from "./policy-description-mapper";

import type { PrivacyPolicyContent } from "./privacy-policy-types";
import type { PolicyDocument } from "./types";

/** Maps the Strapi `privacy-policy` single type into {@link PolicyDocument}. */
export function mapPrivacyPolicyContent(
  input: PrivacyPolicyContent,
): PolicyDocument | null {
  return mapPolicyDescriptionContent(input, {
    slug: "privacy",
    defaultTitle: "Privacy Policy",
  });
}
