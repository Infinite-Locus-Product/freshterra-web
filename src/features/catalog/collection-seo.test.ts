import { describe, expect, it } from "vitest";

import {
  collectionPageMetadata,
  collectionSeoFromMeta,
} from "./collection-seo";

const EDITORJS_DESCRIPTION = JSON.stringify({
  time: 1794992631840,
  blocks: [
    {
      id: "a",
      type: "paragraph",
      data: { text: "Navratri <b>fasting</b> SKUs" },
    },
    { id: "b", type: "paragraph", data: { text: "Kuttu, sabudana and more." } },
  ],
  version: "2.30.7",
});

/** Shape of the live BFF block for `/collections/navratri-specials/products`. */
const SEO_META = {
  title: "Navratri Specials — FreshTerra",
  description: EDITORJS_DESCRIPTION,
  canonicalUrl: "https://freshterra.in/c/navratri-specials",
};

describe("collectionSeoFromMeta", () => {
  it("normalises the Saleor title suffix and flattens the rich-text description", () => {
    expect(collectionSeoFromMeta(SEO_META)).toEqual({
      title: "Navratri Specials | FreshTerra",
      description: "Navratri fasting SKUs Kuttu, sabudana and more.",
    });
  });

  it("drops the BFF canonical (it points at the category route)", () => {
    expect(collectionSeoFromMeta(SEO_META)).not.toHaveProperty("canonicalUrl");
  });

  it("keeps a plain-string description and ogImage", () => {
    expect(
      collectionSeoFromMeta({
        title: "Summer Picks | FreshTerra",
        description: "  Cool treats for hot days.  ",
        ogImage: "https://cdn/summer-og.jpg",
      }),
    ).toEqual({
      title: "Summer Picks | FreshTerra",
      description: "Cool treats for hot days.",
      ogImage: "https://cdn/summer-og.jpg",
    });
  });

  it("lets Saleor SEO_TITLE metadata win over the seoMeta title only", () => {
    expect(
      collectionSeoFromMeta(SEO_META, {
        SEO_TITLE: "Navratri",
        SEO_DESCRIPTION: "Not mapped on web.",
        brand: "FreshTerra",
      }),
    ).toEqual({
      title: "Navratri | FreshTerra",
      description: "Navratri fasting SKUs Kuttu, sabudana and more.",
    });
  });

  it("uses metadata alone when the BFF sends no seoMeta block", () => {
    expect(collectionSeoFromMeta(undefined, { SEO_TITLE: "Navratri" })).toEqual(
      { title: "Navratri | FreshTerra" },
    );
  });

  it("ignores a blank SEO_TITLE and falls back to seoMeta", () => {
    expect(collectionSeoFromMeta(SEO_META, { SEO_TITLE: "  " })).toEqual({
      title: "Navratri Specials | FreshTerra",
      description: "Navratri fasting SKUs Kuttu, sabudana and more.",
    });
  });

  it("returns null for a missing or all-blank block", () => {
    expect(collectionSeoFromMeta(undefined)).toBeNull();
    expect(collectionSeoFromMeta(null)).toBeNull();
    expect(
      collectionSeoFromMeta({ title: " ", description: null, ogImage: "" }),
    ).toBeNull();
  });
});

describe("collectionPageMetadata", () => {
  it("uses Saleor seoMeta for title + description and the page path as canonical", () => {
    const meta = collectionPageMetadata({
      slug: "navratri-specials",
      name: "Navratri Specials",
      seoMeta: SEO_META,
    });

    expect(meta.title).toEqual({ absolute: "Navratri Specials | FreshTerra" });
    expect(meta.description).toBe(
      "Navratri fasting SKUs Kuttu, sabudana and more.",
    );
    expect(meta.alternates?.canonical).toBe("/collection/navratri-specials");
    expect(meta.openGraph).toMatchObject({
      title: "Navratri Specials | FreshTerra",
      url: "/collection/navratri-specials",
    });
  });

  it("prefers Saleor metadata over the generated seoMeta title", () => {
    const meta = collectionPageMetadata({
      slug: "navratri-specials",
      name: "Navratri Specials",
      seoMeta: SEO_META,
      metadata: { SEO_TITLE: "Navratri" },
    });

    expect(meta.title).toEqual({ absolute: "Navratri | FreshTerra" });
    expect(meta.description).toBe(
      "Navratri fasting SKUs Kuttu, sabudana and more.",
    );
  });

  it("fills blank Saleor fields from Strapi, then from the collection name", () => {
    const meta = collectionPageMetadata({
      slug: "summer",
      name: "Summer",
      seoMeta: { title: "Summer — FreshTerra", description: null },
      cmsSeo: {
        description: "Marketing copy from Strapi.",
        canonicalUrl: "https://freshterra.in/collection/summer-sale",
      },
    });

    expect(meta.title).toEqual({ absolute: "Summer | FreshTerra" });
    expect(meta.description).toBe("Marketing copy from Strapi.");
    expect(meta.alternates?.canonical).toBe(
      "https://freshterra.in/collection/summer-sale",
    );
  });

  it("derives everything from the name when neither source has values", () => {
    const meta = collectionPageMetadata({ slug: "summer", name: "Summer" });

    expect(meta.title).toEqual({ absolute: "Summer | FreshTerra" });
    expect(meta.description).toBe("Browse Summer on FreshTerra.");
    expect(meta.alternates?.canonical).toBe("/collection/summer");
  });
});
