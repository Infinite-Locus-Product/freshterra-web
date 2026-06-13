import { policyCmsContentSchema, type PolicyCmsContent } from "./policy-cms-types";

/**
 * CMS single type — `GET /api/v1/content/single/refunds-policy`.
 * Body copy is a single `description` field with markdown-style headings.
 */
export const refundsPolicyContentSchema = policyCmsContentSchema;

export type RefundsPolicyContent = PolicyCmsContent;
