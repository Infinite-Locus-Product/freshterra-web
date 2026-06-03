/**
 * Category page placeholder content.
 *
 * Replace this with Strapi data fetchers once CMS schemas are finalized.
 */
export const categoryPageDraftContent = {
  slug: "explore-catalog",
  hero: {
    headline: "Five Star Quality @ WOW Prices",
    ctaLabel: "Download the App",
  },
  nav: {
    locationLabel: "Fresh Market Gurugram",
    links: [
      { label: "Explore Catalog", href: "/c/explore-catalog" },
      { label: "Our Philosophy", href: "/food-philosophy" },
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Our Stores", href: "/stores" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/contact" },
    ],
  },
  sections: [
    {
      title: "Fruits & Vegetables",
      subtitle: "Fresh from the farm",
      subtitleColor: "text-brand-500",
      ctaLabel: "View All",
      items: [
        "Fruits",
        "Vegetables",
        "Exotic",
        "Herbs",
        "Seasonings",
        "Pre-Cut",
        "Ready-to-Cook",
        "View All",
      ],
    },
    {
      title: "Dairy, Bread & Eggs",
      subtitle: "Start your day strong",
      subtitleColor: "text-brown-700",
      ctaLabel: "View All",
      items: [
        "Milk",
        "Cereal",
        "Bread",
        "Eggs",
        "Butter",
        "Cheese",
        "Yoghurt",
        "View All",
      ],
    },
    {
      title: "Snacks & Munchies",
      subtitle: "Elevate your tea time",
      subtitleColor: "text-amber-700",
      ctaLabel: "View All",
      items: [
        "Chips",
        "Namkeen",
        "Biscuits",
        "Noodles",
        "Pasta",
        "Popcorn",
        "Chocolates",
        "View All",
      ],
    },
  ],
  footer: {
    aboutLinks: ["About Us", "Our Story", "Careers", "Contact Us", "FAQs"],
    quickLinks: [
      "Fresh Fruits",
      "Vegetables",
      "Dairy & Eggs",
      "Organic Range",
      "Explore Catalog",
    ],
    officeLines: [
      "Elixiir Foods Private Limited",
      "WeWork Eldeco Centre, Block A, Shivalik Colony",
      "Malviya Nagar, New Delhi",
      "110017",
    ],
    appBadges: ["App Store", "Google Play"],
  },
} as const;

export type CategoryPageDraftContent = typeof categoryPageDraftContent;
