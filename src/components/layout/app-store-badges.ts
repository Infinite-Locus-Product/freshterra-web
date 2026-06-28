/**
 * App Store / Google Play badge assets (shared by footer + PDP).
 * - `iconSrc` + `topLine`/`brandLine`: glyph-only icon used by the PDP pill style.
 * - `badgeSrc` (+ `badgeWidth`/`badgeHeight`): full store badge (logo + label baked
 *   in) used by the footer CTA. Dimensions match Figma.
 */
export const APP_STORE_BADGES = [
  {
    topLine: "Download on the",
    brandLine: "App Store",
    hrefKey: "appStore" as const,
    iconSrc: "/image-11305.svg",
    badgeSrc: "/images/app-store.svg",
    badgeWidth: 129,
    badgeHeight: 44,
  },
  {
    topLine: "Get it on",
    brandLine: "Google Play",
    hrefKey: "playStore" as const,
    iconSrc: "/image-11306.svg",
    badgeSrc: "/images/play-store.svg",
    badgeWidth: 146,
    badgeHeight: 44,
  },
] as const;

export const APP_STORE_BADGE_BY_STORE = {
  apple: APP_STORE_BADGES[0],
  google: APP_STORE_BADGES[1],
} as const;
