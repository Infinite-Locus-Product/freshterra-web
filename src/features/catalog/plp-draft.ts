import { PLP_DRAFT_PAGE_COUNT, PLP_PAGE_SIZE } from "./plp-constants";

import type { PlpPageContent, ProductSummary } from "./types";

function expandProducts(
  base: readonly ProductSummary[],
  targetCount: number,
): ProductSummary[] {
  if (base.length === 0) {
    throw new Error("expandProducts requires at least one base product");
  }

  return Array.from({ length: targetCount }, (_, index) => {
    const source = base[index % base.length];
    if (!source) {
      throw new Error("expandProducts source product missing");
    }

    if (index < base.length) {
      return { ...source };
    }

    const suffix = index + 1;
    return {
      ...source,
      id: `${source.id}-x${suffix}`,
      slug: `${source.slug}-${suffix}`,
      name: `${source.name} ${suffix}`,
      imageToneIndex: index % 4,
    };
  });
}

const SHARED_NAV = {
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
} as const;

const SHARED_CATEGORY_CHIPS = [
  { id: "all", label: "All" },
  { id: "bestsellers", label: "Bestsellers" },
  { id: "organic", label: "Organic" },
  { id: "seasonal", label: "Seasonal" },
  { id: "leafy-greens", label: "Leafy Greens" },
  { id: "root", label: "Root" },
] as const;

const VEGETABLES_FILTER_GROUPS = [
  {
    id: "brand",
    label: "Brand",
    options: [
      { id: "brand-a", label: "Brand A" },
      { id: "brand-b", label: "Brand B" },
      { id: "brand-c", label: "Brand C" },
    ],
  },
  {
    id: "dietary",
    label: "Dietary",
    options: [
      { id: "organic", label: "Organic" },
      { id: "vegan", label: "Vegan" },
      { id: "gluten-free", label: "Gluten-free" },
    ],
  },
  {
    id: "health",
    label: "Health Tags",
    options: [
      { id: "high-protein", label: "High protein" },
      { id: "low-carb", label: "Low carb" },
      { id: "sugar-free", label: "Sugar free" },
    ],
  },
] as const;

export const CATEGORY_HUB_SLUG = "explore-catalog" as const;

const VEGETABLES_BASE_PRODUCTS: ProductSummary[] = [
  {
    id: "v1",
    slug: "organic-tomatoes",
    name: "Organic Tomatoes",
    packSize: "250g (3 Options)",
    priceInPaise: 3500,
    imageToneIndex: 0,
    filterTags: ["brand-a", "organic", "high-protein"],
    chipTags: ["organic", "bestsellers"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "v2",
    slug: "avocado",
    name: "Avocado",
    packSize: "500g (2-3 units)",
    priceInPaise: 12900,
    imageToneIndex: 1,
    filterTags: ["brand-b", "vegan", "low-carb"],
    chipTags: ["bestsellers"],
    displayTags: ["Fresh"],
  },
  {
    id: "v3",
    slug: "organic-potatoes",
    name: "Organic Potatoes",
    packSize: "1 kg",
    priceInPaise: 4900,
    imageToneIndex: 2,
    filterTags: ["brand-a", "organic", "vegan"],
    chipTags: ["organic", "root"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "v4",
    slug: "fresh-carrots",
    name: "Fresh Carrots",
    packSize: "250g (5 Options)",
    priceInPaise: 3900,
    imageToneIndex: 3,
    filterTags: ["brand-c", "vegan", "low-carb"],
    chipTags: ["root", "seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "v5",
    slug: "baby-spinach",
    name: "Baby Spinach",
    packSize: "200g",
    priceInPaise: 4500,
    imageToneIndex: 0,
    filterTags: ["brand-a", "organic", "vegan", "high-protein"],
    chipTags: ["organic", "leafy-greens"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "v6",
    slug: "broccoli",
    name: "Broccoli",
    packSize: "250g",
    priceInPaise: 5900,
    imageToneIndex: 1,
    filterTags: ["brand-b", "vegan", "high-protein"],
    chipTags: ["bestsellers", "leafy-greens"],
    displayTags: ["Fresh"],
  },
  {
    id: "v7",
    slug: "sweet-potatoes",
    name: "Sweet Potatoes",
    packSize: "500g",
    priceInPaise: 3900,
    imageToneIndex: 2,
    filterTags: ["brand-c", "vegan", "sugar-free"],
    chipTags: ["root", "seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "v8",
    slug: "green-peas",
    name: "Green Peas",
    packSize: "500g",
    priceInPaise: 2900,
    imageToneIndex: 3,
    filterTags: ["brand-a", "vegan", "high-protein"],
    chipTags: ["seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "v9",
    slug: "red-bell-pepper",
    name: "Red Bell Pepper",
    packSize: "2 pcs",
    priceInPaise: 6900,
    imageToneIndex: 0,
    filterTags: ["brand-b", "vegan", "low-carb"],
    chipTags: ["bestsellers"],
    displayTags: ["Fresh"],
  },
  {
    id: "v10",
    slug: "organic-cucumber",
    name: "Organic Cucumber",
    packSize: "500g",
    priceInPaise: 3200,
    imageToneIndex: 1,
    filterTags: ["brand-a", "organic", "vegan"],
    chipTags: ["organic"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "v11",
    slug: "cauliflower",
    name: "Cauliflower",
    packSize: "1 pc",
    priceInPaise: 5500,
    imageToneIndex: 2,
    filterTags: ["brand-c", "vegan", "low-carb"],
    chipTags: ["seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "v12",
    slug: "fresh-beetroot",
    name: "Fresh Beetroot",
    packSize: "500g",
    priceInPaise: 4200,
    imageToneIndex: 3,
    filterTags: ["brand-b", "vegan", "sugar-free"],
    chipTags: ["root"],
    displayTags: ["Fresh"],
  },
  {
    id: "v13",
    slug: "lettuce",
    name: "Lettuce",
    packSize: "1 head",
    priceInPaise: 4800,
    imageToneIndex: 0,
    filterTags: ["brand-a", "organic", "vegan"],
    chipTags: ["leafy-greens", "organic"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "v14",
    slug: "zucchini",
    name: "Zucchini",
    packSize: "500g",
    priceInPaise: 5200,
    imageToneIndex: 1,
    filterTags: ["brand-c", "vegan", "low-carb"],
    chipTags: ["seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "v15",
    slug: "fresh-lemon",
    name: "Fresh Lemon",
    packSize: "250g",
    priceInPaise: 2500,
    imageToneIndex: 2,
    filterTags: ["brand-b", "vegan", "sugar-free"],
    chipTags: ["bestsellers"],
    displayTags: ["Fresh"],
  },
  {
    id: "v16",
    slug: "kale",
    name: "Kale",
    packSize: "200g",
    priceInPaise: 6500,
    imageToneIndex: 3,
    filterTags: ["brand-a", "organic", "high-protein"],
    chipTags: ["leafy-greens", "organic"],
    displayTags: ["Organic", "Fresh"],
  },
];

const FRUITS_VEG_BASE_PRODUCTS: ProductSummary[] = [
  {
    id: "p1",
    slug: "fresh-bananas",
    name: "Fresh Bananas",
    packSize: "500 g",
    priceInPaise: 4900,
    imageToneIndex: 0,
    filterTags: ["fruit", "seasonal"],
    chipTags: ["bestsellers", "seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "p2",
    slug: "organic-tomatoes",
    name: "Organic Tomatoes",
    packSize: "250 g (3 Options)",
    priceInPaise: 3500,
    imageToneIndex: 1,
    filterTags: ["vegetable", "organic"],
    chipTags: ["organic", "bestsellers"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "p3",
    slug: "green-apples",
    name: "Green Apples",
    packSize: "4 pcs",
    priceInPaise: 12900,
    imageToneIndex: 2,
    filterTags: ["fruit"],
    chipTags: ["seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "p4",
    slug: "baby-spinach",
    name: "Baby Spinach",
    packSize: "200 g",
    priceInPaise: 4500,
    imageToneIndex: 3,
    filterTags: ["vegetable", "organic"],
    chipTags: ["organic"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "p5",
    slug: "sweet-potatoes",
    name: "Sweet Potatoes",
    packSize: "500 g",
    priceInPaise: 3900,
    imageToneIndex: 0,
    filterTags: ["vegetable", "seasonal"],
    chipTags: ["seasonal"],
    displayTags: ["Fresh"],
  },
  {
    id: "p6",
    slug: "fresh-mangoes",
    name: "Fresh Mangoes",
    packSize: "1 kg",
    priceInPaise: 18900,
    imageToneIndex: 1,
    filterTags: ["fruit", "seasonal"],
    chipTags: ["seasonal", "bestsellers"],
    displayTags: ["Fresh"],
  },
  {
    id: "p7",
    slug: "broccoli",
    name: "Broccoli",
    packSize: "250 g",
    priceInPaise: 5900,
    imageToneIndex: 2,
    filterTags: ["vegetable"],
    chipTags: ["bestsellers"],
    displayTags: ["Fresh"],
  },
  {
    id: "p8",
    slug: "red-grapes",
    name: "Red Grapes",
    packSize: "500 g",
    priceInPaise: 14900,
    imageToneIndex: 3,
    filterTags: ["fruit"],
    chipTags: ["bestsellers"],
    displayTags: ["Fresh"],
  },
  {
    id: "p9",
    slug: "fresh-carrots",
    name: "Fresh Carrots",
    packSize: "250g (5 Options)",
    priceInPaise: 3900,
    imageToneIndex: 0,
    filterTags: ["vegetable", "organic"],
    chipTags: ["organic", "seasonal"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "p10",
    slug: "avocado",
    name: "Avocado",
    packSize: "500 g (2-3 units)",
    priceInPaise: 12900,
    imageToneIndex: 1,
    filterTags: ["fruit"],
    chipTags: ["bestsellers"],
    displayTags: ["Fresh"],
  },
  {
    id: "p11",
    slug: "organic-potatoes",
    name: "Organic Potatoes",
    packSize: "1 kg",
    priceInPaise: 4900,
    imageToneIndex: 2,
    filterTags: ["vegetable", "organic"],
    chipTags: ["organic"],
    displayTags: ["Organic", "Fresh"],
  },
  {
    id: "p12",
    slug: "fresh-oranges",
    name: "Fresh Oranges",
    packSize: "1 kg",
    priceInPaise: 8900,
    imageToneIndex: 3,
    filterTags: ["fruit", "seasonal"],
    chipTags: ["seasonal"],
    displayTags: ["Fresh"],
  },
];

export const plpPagesBySlug: Record<string, PlpPageContent> = {
  vegetables: {
    slug: "vegetables",
    title: "Vegetables",
    breadcrumbCurrent: "All items",
    heroCtaLabel: "Download the App",
    breadcrumbs: [{ label: "Vegetables", href: "/c/vegetables" }],
    hero: {
      headline: "Organic Picks",
      subheadline: "Wholesome produce, grown with care",
      mobileSubheadline: "All natural, no pesticides, just fresh from farm",
    },
    categoryChips: SHARED_CATEGORY_CHIPS,
    nav: SHARED_NAV,
    pageSize: PLP_PAGE_SIZE,
    filterGroups: VEGETABLES_FILTER_GROUPS,
    products: expandProducts(
      VEGETABLES_BASE_PRODUCTS,
      PLP_PAGE_SIZE * PLP_DRAFT_PAGE_COUNT,
    ),
  },
  "fruits-vegetables": {
    slug: "fruits-vegetables",
    title: "Fruits & Vegetables",
    breadcrumbCurrent: "All items",
    heroCtaLabel: "Download the App",
    breadcrumbs: [{ label: "Explore Catalog", href: "/c/explore-catalog" }],
    hero: {
      headline: "Farm Fresh",
      subheadline: "Seasonal fruits and vegetables, picked daily",
      mobileSubheadline: "Fresh from the farm to your table",
    },
    categoryChips: [
      { id: "all", label: "All" },
      { id: "bestsellers", label: "Bestsellers" },
      { id: "organic", label: "Organic" },
      { id: "seasonal", label: "Seasonal" },
    ],
    nav: SHARED_NAV,
    pageSize: PLP_PAGE_SIZE,
    filterGroups: [
      {
        id: "dietary",
        label: "Dietary",
        options: [
          { id: "organic", label: "Organic" },
          { id: "seasonal", label: "Seasonal" },
        ],
      },
      {
        id: "type",
        label: "Type",
        options: [
          { id: "fruit", label: "Fruits" },
          { id: "vegetable", label: "Vegetables" },
        ],
      },
    ],
    products: expandProducts(
      FRUITS_VEG_BASE_PRODUCTS,
      PLP_PAGE_SIZE * PLP_DRAFT_PAGE_COUNT,
    ),
  },
};

export function getPlpPageBySlug(slug: string): PlpPageContent | null {
  return plpPagesBySlug[slug] ?? null;
}

export function listPlpSlugs(): string[] {
  return Object.keys(plpPagesBySlug);
}
