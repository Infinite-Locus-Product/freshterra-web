import { describe, expect, it } from "vitest";

import { CMS_SEO_POPULATE, cmsSeoSchema, readCmsSeo } from "./cms-seo";

describe("readCmsSeo", () => {
  it("returns null when the entry carries no seo component", () => {
    expect(readCmsSeo({})).toBeNull();
    expect(readCmsSeo({ seo: null })).toBeNull();
    expect(readCmsSeo({ seo: undefined })).toBeNull();
  });

  it("returns null for non-object entries and malformed components", () => {
    expect(readCmsSeo(null)).toBeNull();
    expect(readCmsSeo(undefined)).toBeNull();
    expect(readCmsSeo("seo")).toBeNull();
    expect(readCmsSeo([])).toBeNull();
    expect(readCmsSeo({ seo: "junk" })).toBeNull();
    expect(readCmsSeo({ seo: { metaTitle: 42 } })).toBeNull();
  });

  it("returns null when every field is blank", () => {
    expect(
      readCmsSeo({
        seo: { metaTitle: "  ", metaDescription: null, canonicalUrl: "" },
      }),
    ).toBeNull();
  });

  it("maps and trims the Strapi fields", () => {
    expect(
      readCmsSeo({
        heading: "Contact",
        seo: {
          id: 7,
          metaTitle: " Contact FreshTerra | FreshTerra ",
          metaDescription: " Reach our support team. ",
          canonicalUrl: "https://freshterra.in/contact",
          canonicalPattern: "/contact",
          ogImageUrl: "https://cms/og.png",
        },
      }),
    ).toEqual({
      title: "Contact FreshTerra | FreshTerra",
      description: "Reach our support team.",
      canonicalUrl: "https://freshterra.in/contact",
      ogImage: "https://cms/og.png",
    });
  });

  it("omits fields that are not set", () => {
    expect(readCmsSeo({ seo: { metaTitle: "Only a title" } })).toEqual({
      title: "Only a title",
    });
  });

  it("accepts snake_case aliases", () => {
    expect(
      readCmsSeo({
        seo: {
          meta_title: "Snake",
          meta_description: "Case",
          og_image_url: "x",
        },
      }),
    ).toEqual({ title: "Snake", description: "Case", ogImage: "x" });
  });
});

describe("cmsSeoSchema", () => {
  it("accepts nulls and unknown extra keys", () => {
    const parsed = cmsSeoSchema.safeParse({
      metaTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      canonicalPattern: null,
      ogImageUrl: null,
      someFutureField: { nested: true },
    });
    expect(parsed.success).toBe(true);
  });
});

describe("CMS_SEO_POPULATE", () => {
  it("asks Strapi for the seo component", () => {
    expect(CMS_SEO_POPULATE).toEqual({ "populate[seo]": "*" });
  });
});
