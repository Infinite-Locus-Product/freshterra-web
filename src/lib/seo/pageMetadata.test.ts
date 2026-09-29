import { describe, expect, it } from "vitest";

import {
  buildPageMetadata,
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_IMAGE,
  isAbsoluteHttpsUrl,
  resolveCanonical,
  siteTitle,
} from "./pageMetadata";

describe("siteTitle", () => {
  it("appends the brand suffix", () => {
    expect(siteTitle("About FreshTerra")).toBe("About FreshTerra | FreshTerra");
  });

  it("keeps an already-suffixed title unchanged", () => {
    expect(siteTitle("Contact Us | FreshTerra")).toBe(
      "Contact Us | FreshTerra",
    );
  });

  it("does not double the suffix when casing or spacing differ", () => {
    expect(siteTitle("Contact Us | freshterra")).toBe(
      "Contact Us | freshterra",
    );
    expect(siteTitle("Contact Us |FreshTerra ")).toBe("Contact Us |FreshTerra");
    expect(siteTitle("Contact Us | Fresh Terra")).toBe(
      "Contact Us | Fresh Terra",
    );
  });

  it("still appends when FreshTerra is not the trailing suffix", () => {
    expect(siteTitle("FreshTerra Gurugram")).toBe(
      "FreshTerra Gurugram | FreshTerra",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(siteTitle("  FAQs  ")).toBe("FAQs | FreshTerra");
  });
});

describe("isAbsoluteHttpsUrl / resolveCanonical", () => {
  it.each([
    ["https://freshterra.in/product/almond-butter", true],
    ["  https://freshterra.in/about  ", true],
    ["http://freshterra.in/about", false],
    ["/about", false],
    ["freshterra.in/about", false],
    ["", false],
    ["   ", false],
    [null, false],
    [undefined, false],
    ["not a url", false],
  ])("isAbsoluteHttpsUrl(%j) → %s", (value, expected) => {
    expect(isAbsoluteHttpsUrl(value)).toBe(expected);
  });

  it("returns an absolute https canonical exactly as entered", () => {
    expect(
      resolveCanonical(" https://freshterra.in/product/almond-butter ", "/x"),
    ).toBe("https://freshterra.in/product/almond-butter");
  });

  it("falls back to the page path otherwise", () => {
    expect(resolveCanonical("http://freshterra.in/about", "/about")).toBe(
      "/about",
    );
    expect(resolveCanonical(null, "/about")).toBe("/about");
    expect(resolveCanonical("about", "/about")).toBe("/about");
  });
});

describe("buildPageMetadata", () => {
  const base = {
    path: "/about",
    fallbackTitle: "About FreshTerra | FreshTerra",
    fallbackDescription: "Fallback description.",
  };

  it("uses the fallbacks, the page path and the site images without seo", () => {
    const meta = buildPageMetadata(base);

    expect(meta.title).toEqual({ absolute: "About FreshTerra | FreshTerra" });
    expect(meta.description).toBe("Fallback description.");
    expect(meta.alternates?.canonical).toBe("/about");
    expect(meta.openGraph).toMatchObject({
      type: "website",
      siteName: "FreshTerra",
      locale: "en_IN",
      url: "/about",
      title: "About FreshTerra | FreshTerra",
      description: "Fallback description.",
      images: [DEFAULT_OG_IMAGE],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "About FreshTerra | FreshTerra",
      description: "Fallback description.",
      images: [DEFAULT_TWITTER_IMAGE],
    });
  });

  it("renders marketing values verbatim, with an absolute title", () => {
    const meta = buildPageMetadata({
      ...base,
      seo: {
        title: "Crunchy Almond Butter, Stone-Ground | FreshTerra",
        description: "Stone-ground crunchy almond butter with no added sugar.",
        canonicalUrl: "https://freshterra.in/product/almond-butter-crunchy",
        ogImage: "https://cdn/almond.jpg",
      },
    });

    expect(meta.title).toEqual({
      absolute: "Crunchy Almond Butter, Stone-Ground | FreshTerra",
    });
    expect(meta.description).toBe(
      "Stone-ground crunchy almond butter with no added sugar.",
    );
    expect(meta.alternates?.canonical).toBe(
      "https://freshterra.in/product/almond-butter-crunchy",
    );
    expect(meta.openGraph).toMatchObject({
      url: "https://freshterra.in/product/almond-butter-crunchy",
      title: "Crunchy Almond Butter, Stone-Ground | FreshTerra",
      images: ["https://cdn/almond.jpg"],
    });
    expect(meta.twitter).toMatchObject({
      title: "Crunchy Almond Butter, Stone-Ground | FreshTerra",
      images: ["https://cdn/almond.jpg"],
    });
  });

  it("treats blank or null seo fields as unset", () => {
    const meta = buildPageMetadata({
      ...base,
      seo: { title: "  ", description: null, canonicalUrl: "", ogImage: null },
    });

    expect(meta.title).toEqual({ absolute: "About FreshTerra | FreshTerra" });
    expect(meta.description).toBe("Fallback description.");
    expect(meta.alternates?.canonical).toBe("/about");
  });

  it("prefers seo.ogImage, then the page image, then the site default", () => {
    const withSeo = buildPageMetadata({
      ...base,
      seo: { ogImage: "https://cdn/seo.png" },
      fallbackImage: "/logo.svg",
    });
    expect(withSeo.openGraph).toMatchObject({
      images: ["https://cdn/seo.png"],
    });

    const withPage = buildPageMetadata({ ...base, fallbackImage: "/logo.svg" });
    expect(withPage.openGraph).toMatchObject({ images: ["/logo.svg"] });
    expect(withPage.twitter).toMatchObject({ images: ["/logo.svg"] });

    const withNone = buildPageMetadata({ ...base, fallbackImage: "  " });
    expect(withNone.openGraph).toMatchObject({ images: [DEFAULT_OG_IMAGE] });
  });

  it("ignores a canonical that is not an absolute https URL", () => {
    const meta = buildPageMetadata({
      ...base,
      seo: { canonicalUrl: "http://freshterra.in/about" },
    });

    expect(meta.alternates?.canonical).toBe("/about");
    expect(meta.openGraph).toMatchObject({ url: "/about" });
  });
});
