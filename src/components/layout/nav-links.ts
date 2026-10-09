export type MarketingNavLink = Readonly<{
  label: string;
  href: string;
}>;

/** Fallback nav when Strapi has none. Client-safe (no server imports). */
export const DEFAULT_NAV_LINKS: readonly MarketingNavLink[] = [
  { label: "Explore Products", href: "/categories" },
  { label: "Our Philosophy", href: "/food-philosophy" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Our Stores", href: "/stores" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
] as const;
