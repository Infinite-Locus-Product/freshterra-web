import { z } from "zod";

const cmsString = z.string().nullable().optional();

/**
 * CMS single type — `GET /api/v1/content/single/notify-me` (the `/notify`
 * lead-capture page). Every field is optional: the page falls back to its
 * built-in copy per field, so a partially filled entry never breaks it.
 */
export const notifyMeContentSchema = z
  .object({
    /** Plain URL today; a Strapi media object is tolerated too. */
    banner_image: z.unknown().optional(),
    /** Lines separated by `/n` (as entered in Strapi) or a real newline. */
    heading_one: cmsString,
    sub_heading: cmsString,
    phone_text: cmsString,
    phone_placeholder: cmsString,
    email_text: cmsString,
    email_text_placeholder: cmsString,
    agree_text: cmsString,
    get_notified_cta: cmsString,
    terms_and_condition: cmsString,
    terms_and_condition_link: cmsString,
    privacy_policy: cmsString,
    privacy_policy_link: cmsString,
    /** Strapi media — a list (multiple media field) or a single object. */
    logo: z.unknown().optional(),
    /** Shared `seo` component — repeatable on this type (`[]` when empty). */
    seo: z.unknown().optional(),
  })
  .catchall(z.unknown());

export type NotifyMeContent = z.infer<typeof notifyMeContentSchema>;
