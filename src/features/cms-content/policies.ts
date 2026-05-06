import { policiesContent } from "@/lib/mock-data/policies";

import type { PolicyDocument, PolicySlug } from "./types";

/**
 * Single source of truth for fetching a policy document.
 *
 * Phase 1 — returns hardcoded TS constants (this file).
 * Phase 2 — swap to Strapi (see docs/CMS_INTEGRATION.md). Pages call this
 * function regardless; they never need to know the underlying source.
 */
export async function getPolicyDocument(
  slug: PolicySlug,
): Promise<PolicyDocument | null> {
  // PHASE 1 — hardcoded constants. Replace this block when Strapi is ready.
  return policiesContent[slug] ?? null;

  // PHASE 2 (uncomment + delete the line above when the Strapi `policies`
  // collection is published):
  //
  //   import { strapiPublic } from "@/lib/clients/strapi";
  //   import { mapStrapiPolicyToDocument } from "./policies-strapi-adapter";
  //
  //   try {
  //     const data = await strapiPublic.fetch(`/policies/${slug}`, {
  //       tags: [`cms:policy:${slug}`],
  //       revalidate: 3600,
  //     });
  //     return data ? mapStrapiPolicyToDocument(data) : null;
  //   } catch {
  //     return null;
  //   }
}

export type { PolicyDocument, PolicySlug } from "./types";
