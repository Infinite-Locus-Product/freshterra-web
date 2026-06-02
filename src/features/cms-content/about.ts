/**
 * About page placeholder content until Strapi is integrated.
 */
export const aboutPageDraftContent = {
  hero: {
    title: "About FreshTerra",
    subtitle: "Fresh. Wholesome. Gourmet.",
    tagline: "Built for families who care about what goes on their table.",
  },
  story: {
    title: "Our Story",
    subtitle: "Where quality meets trust",
    paragraphs: [
      "FreshTerra started with a simple idea: make premium-quality groceries honest, accessible, and rooted in local communities.",
      "We partner with farmers, ethical producers, and trusted brands to bring fresh essentials and gourmet favorites under one roof.",
      "Every decision we make balances taste, nutrition, and transparency so every household can shop with confidence.",
    ],
  },
  mission: {
    title: "What Drives Us",
    items: [
      {
        title: "Freshness First",
        description:
          "From produce to pantry, we prioritize freshness windows and disciplined quality checks at every step.",
      },
      {
        title: "Honest Sourcing",
        description:
          "We work with responsible suppliers and local partners who meet our standards for safety and sustainability.",
      },
      {
        title: "Customer Delight",
        description:
          "We design every store and digital touchpoint to make daily grocery shopping simpler, faster, and more joyful.",
      },
    ],
  },
  milestones: {
    title: "Our Journey",
    events: [
      {
        year: "2024",
        text: "FreshTerra concept and sourcing network established.",
      },
      {
        year: "2025",
        text: "Pilot operations launched with curated category assortment.",
      },
      { year: "2026", text: "First flagship store opened in Gurugram." },
    ],
  },
  team: {
    title: "Leadership",
    subtitle: "People behind FreshTerra",
    members: [
      { name: "Aarav Mehta", role: "Co-Founder & CEO" },
      { name: "Ritika Sharma", role: "Co-Founder & COO" },
      { name: "Dev Khanna", role: "Head of Sourcing" },
    ],
  },
} as const;

export type AboutPageDraftContent = typeof aboutPageDraftContent;
