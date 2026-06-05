import { z } from "zod";

/**
 * Types + zod schema for the active banner carousel.
 *
 * Endpoint: GET /api/v1/content/banners?polygonId=&channel=&locale=
 * Response: { success, data: [Banner], error }   (flat array — not paginated)
 *
 * Banners are sourced from Strapi behind the BFF; the FE just consumes the
 * resolved array.
 */
export const bannerSchema = z.object({
  id: z.string(),
  image: z.string(),
  /** Optional click-through target (deeplink / route). */
  ctaUrl: z.string().optional(),
  /** 1-based display order (lower = first). */
  rank: z.number().optional(),
  /** ISO expiry; banner should stop showing after this instant. */
  validTo: z.string().nullable().optional(),
});
export type Banner = z.infer<typeof bannerSchema>;

export const bannersSchema = z.array(bannerSchema);
export type Banners = z.infer<typeof bannersSchema>;
