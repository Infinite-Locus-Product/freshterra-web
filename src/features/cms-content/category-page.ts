import { dummyImages } from "@/lib/dummy-images";

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
      ctaLabel: "View All",
      items: [
        { name: "Fruits", imageSrc: dummyImages.exploreCatalogFruitsVegetables.fruits },
        {
          name: "Vegetables",
          imageSrc: dummyImages.exploreCatalogFruitsVegetables.vegetables,
        },
        { name: "Exotic", imageSrc: dummyImages.exploreCatalogFruitsVegetables.exotic },
        { name: "Herbs", imageSrc: dummyImages.exploreCatalogFruitsVegetables.herbs },
        {
          name: "Seasonings",
          imageSrc: dummyImages.exploreCatalogFruitsVegetables.seasonings,
        },
        { name: "Pre-Cut", imageSrc: dummyImages.exploreCatalogFruitsVegetables.preCut },
        {
          name: "Ready-to-Cook",
          imageSrc: dummyImages.exploreCatalogFruitsVegetables.readyToCook,
        },
        { name: "View All", imageSrc: dummyImages.exploreCatalogFruitsVegetables.viewAll },
      ],
    },
    {
      title: "Dairy, Bread & Eggs",
      subtitle: "Start your day strong",
      ctaLabel: "View All",
      items: [
        { name: "Milk", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.milk },
        { name: "Cereal", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.cereal },
        { name: "Bread", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.bread },
        { name: "Eggs", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.eggs },
        { name: "Butter", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.butter },
        { name: "Cheese", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.cheese },
        { name: "Yoghurt", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.yoghurt },
        { name: "View All", imageSrc: dummyImages.exploreCatalogDairyBreadEggs.viewAll },
      ],
    },
    {
      title: "Snacks & Munchies",
      subtitle: "Elevate your tea time",
      ctaLabel: "View All",
      items: [
        { name: "Chips", imageSrc: dummyImages.exploreCatalogSnacksMunchies.chips },
        { name: "Namkeen", imageSrc: dummyImages.exploreCatalogSnacksMunchies.namkeen },
        { name: "Biscuits", imageSrc: dummyImages.exploreCatalogSnacksMunchies.biscuits },
        { name: "Noodles", imageSrc: dummyImages.exploreCatalogSnacksMunchies.noodles },
        { name: "Pasta", imageSrc: dummyImages.exploreCatalogSnacksMunchies.pasta },
        { name: "Popcorn", imageSrc: dummyImages.exploreCatalogSnacksMunchies.popcorn },
        {
          name: "Chocolates",
          imageSrc: dummyImages.exploreCatalogSnacksMunchies.chocolates,
        },
        { name: "View All", imageSrc: dummyImages.exploreCatalogSnacksMunchies.viewAll },
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
