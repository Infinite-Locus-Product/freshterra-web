/** App Store / Google Play badge assets (shared by footer + PDP). */
export const APP_STORE_BADGES = [
  {
    topLine: "Download on the",
    brandLine: "App Store",
    hrefKey: "appStore" as const,
    iconSrc: "/image-11305.svg",
  },
  {
    topLine: "Get it on",
    brandLine: "Google Play",
    hrefKey: "playStore" as const,
    iconSrc: "/image-11306.svg",
  },
] as const;

export const APP_STORE_BADGE_BY_STORE = {
  apple: APP_STORE_BADGES[0],
  google: APP_STORE_BADGES[1],
} as const;
