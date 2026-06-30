import { policyCmsContentSchema, type PolicyCmsContent } from "./policy-cms-types";

/**
 * CMS single type — `GET /api/v1/content/single/terms-condition`.
 * Body copy is a single `description` field with markdown-style headings.
 */
export const termsConditionContentSchema = policyCmsContentSchema;

export type TermsConditionContent = PolicyCmsContent;
