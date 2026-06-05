import { dummyImages } from "@/lib/dummy-images";

/**
 * Homepage placeholder content until Strapi is connected.
 *
 * Keep this shape aligned with the future CMS response so the page can switch
 * from local constants to server data with minimal refactors.
 */
export const homePageDraftContent = {
  hero: {
    headline: "From our shelves to your family table",
    eyebrow: "Fresh. Wholesome. Gourmet.",
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
      { label: "FAQ", href: "/faq" },
    ],
  },
  /** Section copy fallbacks when the BFF categories entry omits title/subtitle. */
  categories: {
    title: "Categories",
    subtitle: "Explore our entire selection",
    ctaLabel: "View All",
  },
  sourcing: {
    title: "How We Source",
    paragraphs: [
      "We work directly with local farmers and producers, cutting out middlemen to ensure the freshest possible products reach your table.",
      "Every product in our stores is carefully selected based on strict quality criteria. We prioritize organic, sustainable, and ethically sourced ingredients.",
      "Our sourcing model focuses on quality, transparency, and seasonal availability so your kitchen gets food you can trust.",
    ],
    ctaLabel: "Read more",
  },
  testimonials: {
    title: "Stories from Our Valued Customers",
    subtitle: "Bringing freshness to your table",
    items: [
      {
        name: "Mankirat Singh",
        ageLabel: "42 Years",
        imageSrc: dummyImages.testimonials.mankiratSingh,
        quote:
          "I love Freshterra because I know I'm serving safe, fresh food to my children every day.",
      },
      {
        name: "Anita Sharma",
        ageLabel: "36 Years",
        imageSrc: dummyImages.testimonials.anitaSharma,
        quote:
          "The produce quality is excellent and the experience feels thoughtfully curated every single time.",
      },
      {
        name: "Rohan Mehta",
        ageLabel: "29 Years",
        imageSrc: dummyImages.testimonials.rohanMehta,
        quote:
          "I can finally buy clean, trustworthy pantry staples from one place near home.",
      },
    ],
  },
  store: {
    title: "Visit Our First Store",
    name: "FreshTerra Gurugram",
    addressLine1: "Golf Course Road, Sector 5",
    addressLine2: "Gurgaon, Haryana - 122011",
    primaryCtaLabel: "View Store",
    secondaryCtaLabel: "Locate Us",
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

export type HomePageDraftContent = typeof homePageDraftContent;
