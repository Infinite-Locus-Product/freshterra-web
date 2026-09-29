import { describe, expect, it } from "vitest";

import { productPageMetadata } from "./product-seo";

import type { ProductDetail } from "./types";

const PRODUCT: ProductDetail = {
  id: "prd_almond",
  sku: "FT-ALMOND-250G",
  name: "Almond Butter Crunchy",
  slug: "almond-butter-crunchy",
  images: [{ url: "https://cdn/almond-1.jpg", alt: "Almond butter" }],
  variants: [],
  price: { list: 39900, mrp: 44900, currency: "INR" },
  story: "Stone-ground from Californian almonds.",
  metafields: { healthBenefits: [], productDetails: "From metadata" },
  tags: [],
  tagPills: [],
  inStock: true,
  similarProducts: [],
};

const SEO_META = {
  title: "Crunchy Almond Butter, Stone-Ground | FreshTerra",
  description: "Stone-ground crunchy almond butter with no added sugar.",
  canonicalUrl: "https://freshterra.in/product/almond-butter-crunchy",
  ogImage: "https://cdn/almond-og.jpg",
};

describe("productPageMetadata", () => {
  it("renders the BFF seoMeta block as-is with an absolute title", () => {
    const meta = productPageMetadata({
      product: { ...PRODUCT, seoMeta: SEO_META },
      slug: "almond-butter-crunchy",
    });

    expect(meta.title).toEqual({ absolute: SEO_META.title });
    expect(meta.description).toBe(SEO_META.description);
    expect(meta.alternates?.canonical).toBe(SEO_META.canonicalUrl);
    expect(meta.openGraph).toMatchObject({
      title: SEO_META.title,
      description: SEO_META.description,
      url: SEO_META.canonicalUrl,
      images: [SEO_META.ogImage],
    });
    expect(meta.twitter).toMatchObject({
      title: SEO_META.title,
      description: SEO_META.description,
      images: [SEO_META.ogImage],
    });
  });

  it("falls back to the first product image when ogImage is null", () => {
    const meta = productPageMetadata({
      product: { ...PRODUCT, seoMeta: { ...SEO_META, ogImage: null } },
      slug: "almond-butter-crunchy",
    });

    expect(meta.openGraph).toMatchObject({
      images: ["https://cdn/almond-1.jpg"],
    });
  });

  it("keeps today's behaviour when the BFF sends no seoMeta", () => {
    const meta = productPageMetadata({
      product: PRODUCT,
      slug: "almond-butter-crunchy",
    });

    expect(meta.title).toEqual({
      absolute: "Almond Butter Crunchy | FreshTerra",
    });
    expect(meta.description).toBe("Stone-ground from Californian almonds.");
    expect(meta.alternates?.canonical).toBe("/product/almond-butter-crunchy");
    expect(meta.openGraph).toMatchObject({
      url: "/product/almond-butter-crunchy",
      images: ["https://cdn/almond-1.jpg"],
    });
  });

  it("walks the legacy description chain without a story", () => {
    const noStory = { ...PRODUCT, story: undefined };
    expect(
      productPageMetadata({ product: noStory, slug: "x" }).description,
    ).toBe("From metadata");

    const bare = { ...noStory, metafields: { healthBenefits: [] } };
    expect(productPageMetadata({ product: bare, slug: "x" }).description).toBe(
      "Almond Butter Crunchy on FreshTerra.",
    );
  });

  it("canonicalises a legacy Saleor-id URL to the product slug", () => {
    const meta = productPageMetadata({
      product: PRODUCT,
      slug: "UHJvZHVjdDoxMjM=",
    });

    expect(meta.alternates?.canonical).toBe("/product/almond-butter-crunchy");
    expect(meta.openGraph).toMatchObject({
      url: "/product/almond-butter-crunchy",
    });
  });

  it("ignores a non-https canonical from the block", () => {
    const meta = productPageMetadata({
      product: {
        ...PRODUCT,
        seoMeta: {
          ...SEO_META,
          canonicalUrl: "/product/almond-butter-crunchy",
        },
      },
      slug: "almond-butter-crunchy",
    });

    expect(meta.alternates?.canonical).toBe("/product/almond-butter-crunchy");
  });
});
