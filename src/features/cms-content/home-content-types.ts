import { z } from "zod";

/**
 * Types + zod schemas for the CMS-driven home layout (P1-5).
 *
 * Endpoint: GET /api/v1/content/home?polygon_id=&store_id=&locale=&channel=
 * Response: { success, data: { modules, version, publishedAt }, error }
 *
 * The layout is an ordered array of typed module descriptors. `type` is kept as
 * a string (not a strict enum) so a brand-new CMS module type never collapses
 * the whole page — unknown types are simply skipped by the renderer.
 */

/** Known module types the renderer can handle. */
export const HOME_MODULE_TYPES = [
  "hero_carousel",
  "shop_by_category",
  "fresh_product_rail",
  "story_led_collection",
  "cuisine_discovery",
  "health_discovery",
  "promo_banner",
  "store_experience",
  "new_arrivals",
  "personalised_rail",
] as const;
export type HomeModuleType = (typeof HOME_MODULE_TYPES)[number];

/**
 * `data_ref` is either inline (items embedded) or a pre-substituted endpoint
 * URL the FE follows to populate the module.
 */
export const homeInlineDataRefSchema = z.object({
  type: z.literal("inline"),
  items: z.array(z.unknown()).default([]),
});

export const homeEndpointDataRefSchema = z.object({
  type: z.literal("endpoint"),
  url: z.string(),
});

export const homeDataRefSchema = z.discriminatedUnion("type", [
  homeInlineDataRefSchema,
  homeEndpointDataRefSchema,
]);
export type HomeDataRef = z.infer<typeof homeDataRefSchema>;

export const homeModuleSchema = z.object({
  id: z.string(),
  /** One of HOME_MODULE_TYPES (kept loose for forward-compatibility). */
  type: z.string(),
  order: z.number(),
  /** Per-type config (varies by module); read what each module needs. */
  config: z.record(z.string(), z.unknown()).default({}),
  data_ref: homeDataRefSchema,
});
export type HomeModule = z.infer<typeof homeModuleSchema>;

export const homeContentDataSchema = z.object({
  modules: z.array(homeModuleSchema),
  version: z.string(),
  publishedAt: z.string(),
});
export type HomeContentData = z.infer<typeof homeContentDataSchema>;

/* -------------------------------------------------------------------------- *
 * Convenience schemas for common inline payloads — modules can parse their own
 * `data_ref.items` with these when rendering.
 * -------------------------------------------------------------------------- */

/** hero_carousel / promo_banner inline item. */
export const heroBannerItemSchema = z.object({
  id: z.string(),
  image: z.string(),
  deeplink: z.string().optional(),
  alt: z.string().optional(),
});
export type HeroBannerItem = z.infer<typeof heroBannerItemSchema>;

/** Returns true when a module's type is one the renderer knows about. */
export function isKnownHomeModule(
  type: string,
): type is HomeModuleType {
  return (HOME_MODULE_TYPES as readonly string[]).includes(type);
}
