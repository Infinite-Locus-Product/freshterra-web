export type NavLink = {
  readonly label: string;
  readonly href: string;
};

export const MARKETING_NAV_LINKS = [
  { label: "Explore Catalog", href: "/c/explore-catalog" },
  { label: "Our Philosophy", href: "/food-philosophy" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Our Stores", href: "/stores" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
] as const satisfies readonly NavLink[];

export type MarketingNavLink = (typeof MARKETING_NAV_LINKS)[number];
