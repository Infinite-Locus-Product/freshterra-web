import { describe, expect, it } from "vitest";

import {
  categoryPageMetadata,
  exploreCatalogMetadata,
} from "./category-page-seo";
import { webCategoryContentSchema } from "./web-category-content-service";
import { webCategoryPlpContentSchema } from "./web-category-plp-service";

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

describe("categoryPageMetadata", () => {
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
    expect(meta.alternates?.canonical).toBe("/c/dairy");
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
    expect(meta.alternates?.canonical).toBe("/c/basmati-rice");
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
    expect(meta.alternates?.canonical).toBe("/c/cold-pressed-oils");
  });
});

describe("exploreCatalogMetadata", () => {
  it("falls back to the static copy without seo", () => {
    const meta = exploreCatalogMetadata(null);

    expect(meta.title).toEqual({ absolute: "Explore Catalog | FreshTerra" });
    expect(meta.description).toBe(
      "Browse FreshTerra categories and discover products.",
    );
    expect(meta.alternates?.canonical).toBe("/c/explore-catalog");
  });

  it("renders the web-category-page seo when set", () => {
    const meta = exploreCatalogMetadata({
      title: "Explore the Catalog | FreshTerra",
      canonicalUrl: "https://freshterra.in/c/explore-catalog",
    });

    expect(meta.title).toEqual({
      absolute: "Explore the Catalog | FreshTerra",
    });
    expect(meta.alternates?.canonical).toBe(
      "https://freshterra.in/c/explore-catalog",
    );
  });
});
