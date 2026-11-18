import { describe, expect, it } from "vitest";

import {
  categoryPageMetadata,
  exploreCatalogMetadata,
} from "./category-page-seo";
import { webCategoryContentSchema } from "./web-category-content-service";
import { webCategoryPlpContentSchema } from "./web-category-plp-service";

import type { WebCategoryGridPage } from "./web-category-grid-types";

const riceConfig = webCategoryPlpContentSchema.parse({
  slug: "rice-2",
  label: "Rice & Grains",
  l4_tab: [
    { l4_category_slug: "basmati-rice", label: "Basmati" },
    { l4_category_slug: "brown-rice", label: "Brown Rice" },
  ],
  seo: {
    metaTitle: "Buy Rice Online | FreshTerra",
    canonicalUrl: "https://freshterra.in/c/rice-2",
  },
});

/** Mapped `web-category-page` grid (shape of `mapWebCategoryGridPage`). */
const gridPage: WebCategoryGridPage = {
  hasCategoryGrid: true,
  sections: [
    {
      key: "1496",
      title: "Vegetables & Fruits",
      subtitle: "Fresh from the farm",
      seo: {
        metaTitle: "Fresh Vegetables & Fruits Online | FreshTerra",
        metaDescription: "Farm-fresh produce delivered daily.",
      },
      tiles: [
        {
          key: "14654",
          label: "Fruits",
          slug: "fruits",
          href: "/category/fruits",
          seo: { metaDescription: "Seasonal fruits delivered fresh." },
        },
        {
          key: "14655",
          label: "Leafy & Microgreens",
          href: "/category/leafy-microgreens",
        },
      ],
    },
    {
      key: "1497",
      title: "Pantry Staples",
      subtitle: "",
      viewAllHref: "/category/staples",
      seo: { canonicalUrl: "https://freshterra.in/category/staples" },
      tiles: [],
    },
  ],
};

describe("categoryPageMetadata", () => {
  it("uses a grid tile's (tagged category) seo and label for its slug", () => {
    const meta = categoryPageMetadata({
      slug: "fruits",
      webCategory: null,
      plpContext: null,
      gridPage,
    });

    expect(meta.title).toEqual({ absolute: "Fruits | FreshTerra" });
    expect(meta.description).toBe("Seasonal fruits delivered fresh.");
    expect(meta.alternates?.canonical).toBe("/category/fruits");
  });

  it("matches a grid tile by its deeplink when it has no slug", () => {
    const meta = categoryPageMetadata({
      slug: "leafy-microgreens",
      webCategory: null,
      plpContext: null,
      gridPage,
    });

    expect(meta.title).toEqual({
      absolute: "Leafy & Microgreens | FreshTerra",
    });
    expect(meta.description).toBe("Browse Leafy & Microgreens on FreshTerra.");
  });

  it("uses a grid section's (tagged category page) seo via its slugified title", () => {
    const meta = categoryPageMetadata({
      slug: "vegetables-fruits",
      webCategory: null,
      plpContext: null,
      gridPage,
    });

    expect(meta.title).toEqual({
      absolute: "Fresh Vegetables & Fruits Online | FreshTerra",
    });
    expect(meta.description).toBe("Farm-fresh produce delivered daily.");
    expect(meta.alternates?.canonical).toBe("/category/vegetables-fruits");
  });

  it("matches a grid section by its View All deeplink", () => {
    const meta = categoryPageMetadata({
      slug: "staples",
      webCategory: null,
      plpContext: null,
      gridPage,
    });

    expect(meta.title).toEqual({ absolute: "Pantry Staples | FreshTerra" });
    expect(meta.alternates?.canonical).toBe(
      "https://freshterra.in/category/staples",
    );
  });

  it("prefers the web entry / PLP config seo over the grid", () => {
    const meta = categoryPageMetadata({
      slug: "fruits",
      webCategory: webCategoryContentSchema.parse({
        label: "Fruits",
        seo: { metaDescription: "From the web entry." },
      }),
      plpContext: null,
      gridPage,
    });

    expect(meta.description).toBe("From the web entry.");
  });

  it("ignores the grid for slugs it does not list", () => {
    const meta = categoryPageMetadata({
      slug: "cold-pressed-oils",
      webCategory: null,
      plpContext: null,
      gridPage,
    });

    expect(meta.title).toEqual({ absolute: "Cold Pressed Oils | FreshTerra" });
  });

  it("uses the web (L2) entry's seo, label and hero", () => {
    const webCategory = webCategoryContentSchema.parse({
      label: "Dairy",
      slug: "dairy",
      category_hero_section: {
        title: "Dairy & Eggs",
        subtitle: "Farm-fresh every morning.",
        image_web: "https://cms/dairy-hero.png",
      },
      seo: { metaDescription: "Milk, curd, paneer and more." },
    });

    const meta = categoryPageMetadata({
      slug: "dairy",
      webCategory,
      plpContext: null,
    });

    expect(meta.title).toEqual({ absolute: "Dairy | FreshTerra" });
    expect(meta.description).toBe("Milk, curd, paneer and more.");
    expect(meta.alternates?.canonical).toBe("/category/dairy");
    expect(meta.openGraph).toMatchObject({
      images: ["https://cms/dairy-hero.png"],
    });
  });

  it("applies the PLP config's seo on its own page", () => {
    const meta = categoryPageMetadata({
      slug: "rice-2",
      webCategory: null,
      plpContext: { config: riceConfig, parentSlug: "rice-2" },
    });

    expect(meta.title).toEqual({ absolute: "Buy Rice Online | FreshTerra" });
    expect(meta.alternates?.canonical).toBe("https://freshterra.in/c/rice-2");
    expect(meta.description).toBe("Browse Rice & Grains on FreshTerra.");
  });

  it("gives an L4 child its tab label and its own canonical, not the parent's seo", () => {
    const meta = categoryPageMetadata({
      slug: "basmati-rice",
      webCategory: null,
      plpContext: { config: riceConfig, parentSlug: "rice-2" },
    });

    expect(meta.title).toEqual({ absolute: "Basmati | FreshTerra" });
    expect(meta.alternates?.canonical).toBe("/category/basmati-rice");
    expect(meta.description).toBe("Browse Basmati on FreshTerra.");
  });

  it("matches the PLP config's own page despite CMS slug casing", () => {
    const meta = categoryPageMetadata({
      slug: "rice-2",
      webCategory: null,
      plpContext: { config: riceConfig, parentSlug: " Rice-2 " },
    });

    expect(meta.alternates?.canonical).toBe("https://freshterra.in/c/rice-2");
  });

  it("title-cases the slug when there is no CMS content", () => {
    const meta = categoryPageMetadata({
      slug: "cold-pressed-oils",
      webCategory: null,
      plpContext: null,
    });

    expect(meta.title).toEqual({ absolute: "Cold Pressed Oils | FreshTerra" });
    expect(meta.description).toBe("Browse Cold Pressed Oils on FreshTerra.");
    expect(meta.alternates?.canonical).toBe("/category/cold-pressed-oils");
  });
});

describe("exploreCatalogMetadata", () => {
  it("falls back to the static copy without seo", () => {
    const meta = exploreCatalogMetadata(null);

    expect(meta.title).toEqual({ absolute: "Explore Catalog | FreshTerra" });
    expect(meta.description).toBe(
      "Browse FreshTerra categories and discover products.",
    );
    expect(meta.alternates?.canonical).toBe("/categories");
  });

  it("renders the web-category-page seo when set", () => {
    const meta = exploreCatalogMetadata({
      title: "Explore the Catalog | FreshTerra",
      canonicalUrl: "https://freshterra.in/categories",
    });

    expect(meta.title).toEqual({
      absolute: "Explore the Catalog | FreshTerra",
    });
    expect(meta.alternates?.canonical).toBe("https://freshterra.in/categories");
  });
});
