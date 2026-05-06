/**
 * Shape of a policy/legal document. Designed to round-trip cleanly with
 * Strapi rich-text output (paragraphs + lists with optional bold spans).
 *
 * Authority: docs/CMS_INTEGRATION.md describes the Strapi content type that
 * maps to this shape.
 */

export type PolicySpan = { text: string; bold?: boolean };

export type PolicyBlock =
  | { type: "paragraph"; spans: PolicySpan[] }
  | { type: "list"; items: PolicySpan[][] };

export type PolicySection = {
  /** Optional anchor for deep-linking later. */
  id?: string;
  /** Omit on the intro section. */
  heading?: string;
  blocks: PolicyBlock[];
};

export type PolicySlug = "privacy" | "terms" | "refund-return";

export type PolicyDocument = {
  slug: PolicySlug;
  title: string;
  breadcrumbLabel: string;
  /** Lead-in section above the numbered sections. */
  intro?: PolicySection;
  sections: PolicySection[];
  /** ISO date string. Formatted at render time. */
  lastUpdated: string;
  contactEmail?: string;
};
