/**
 * Food philosophy placeholder content.
 *
 * This shape is intentionally CMS-friendly so Strapi integration only
 * replaces data fetching and mapping, not layout composition.
 */
export const foodPhilosophyDraftContent = {
  hero: {
    title: "Our Food Philosophy",
    ctaLabel: "Download the App",
  },
  nav: {
    locationLabel: "Fresh Market Gurugram",
    links: [
      { label: "Explore Catalog", href: "/c/explore-catalog", active: false },
      { label: "Our Philosophy", href: "/food-philosophy", active: true },
      { label: "About Us", href: "/about", active: false },
      { label: "Careers", href: "/careers", active: false },
      { label: "Our Stores", href: "/stores", active: false },
      { label: "Contact Us", href: "/contact", active: false },
      { label: "FAQ", href: "/contact", active: false },
    ],
  },
  sourcing: {
    title: "How We Source",
    subtitle: "From soil to soul",
    paragraphs: [
      "We work directly with local farmers and producers, cutting out middlemen to ensure the freshest possible products reach your table. Our farm-to-table approach guarantees quality and supports local communities.",
      "Every product in our stores is carefully selected based on strict quality criteria. We prioritize organic, sustainable, and ethically sourced ingredients.",
      "Our gourmet selection includes artisanal products from small-batch producers who share our commitment to excellence and sustainability.",
    ],
  },
  certifications: {
    title: "Quality Standards & Certifications",
    subtitle: "Feel the freshness",
    description:
      "We maintain the highest quality standards across our entire supply chain. Every product undergoes rigorous quality checks before reaching our stores.",
    items: ["Organic Certified", "FSSAI Approved", "ISO 22000", "Fair Trade"],
  },
  partnerships: {
    title: "Farmer & Producer Partnerships",
    subtitle: "A word from our partners",
    quotes: [
      {
        quote:
          "FreshTerra values the care behind every harvest. Their focus on freshness and fair partnerships helps farmers like us grow with pride.",
        name: "Rajesh Kumar",
        location: "Jalandhar, Punjab",
        theme: "amber",
      },
      {
        quote:
          "FreshTerra supports farmers who believe in natural, wholesome produce. It is a partnership built on quality, trust, and sustainability.",
        name: "Kamla Devi",
        location: "Manglaur, UP",
        theme: "olive",
      },
      {
        quote:
          "FreshTerra's commitment to freshness and quality inspires us to deliver our best harvests season after season.",
        name: "Manish Singh",
        location: "Manglaur, UP",
        theme: "sky",
      },
    ],
  },
  sustainability: {
    title: "Sustainability Commitments",
    subtitle: "Rooted in responsibility",
    items: [
      "Eco-Friendly Packaging",
      "Zero Waste Goal",
      "Local Sourcing",
      "Energy Efficiency",
    ],
  },
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

export type FoodPhilosophyDraftContent = typeof foodPhilosophyDraftContent;
