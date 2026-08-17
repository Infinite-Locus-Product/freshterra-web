import { describe, expect, it } from "vitest";

import { hasNewsPageContent, mapNewsPageContent } from "./news-page-mapper";

import type { NewsContent } from "./news-page-types";

const apiEntry: NewsContent = {
  page_heading: "News & Media",
  listing: [
    {
      id: 5,
      heading: "Major Dailies",
      news_paper: [
        {
          id: 25,
          news_title: "Financial Express",
          redirection: "https://www.financialexpress.com/",
          image_mweb: "https://cdn.example.com/fe-mweb.png",
          image_web: null,
          sort_order: "2",
        },
        {
          id: 24,
          news_title: "The Economic Times",
          redirection: "https://economictimes.indiatimes.com/?from=mdr",
          image_mweb: null,
          image_web: "https://cdn.example.com/et-web.png",
          sort_order: "1",
        },
      ],
      __component: "component.news-listing",
    },
    {
      id: 4,
      title: "Other Publications",
      publication: [
        {
          id: 29,
          logo: "https://cdn.example.com/indiaretail.png",
          redirection: null,
          sort_order: "2",
        },
        {
          id: 28,
          logo: "https://cdn.example.com/bwretail.png",
          redirection: "/stores",
          sort_order: "1",
        },
      ],
      __component: "component.publication-logo",
    },
  ],
};

describe("mapNewsPageContent", () => {
  it("maps the page heading into the hero and breadcrumb", () => {
    const content = mapNewsPageContent(apiEntry);
    expect(content.hero.title).toBe("News & Media");
    expect(content.breadcrumbLabel).toBe("News & Media");
  });

  it("falls back to a default heading when the CMS omits one", () => {
    const content = mapNewsPageContent({ ...apiEntry, page_heading: null });
    expect(content.hero.title).toBe("News & Media");
  });

  it("keeps dynamic-zone order and sorts items by numeric-string sort_order", () => {
    const content = mapNewsPageContent(apiEntry);

    expect(content.sections.map((section) => section.kind)).toEqual([
      "newspapers",
      "publications",
    ]);

    const [newspapers, publications] = content.sections;
    expect(newspapers?.kind === "newspapers" ? newspapers.heading : "").toBe(
      "Major Dailies",
    );
    expect(
      newspapers?.kind === "newspapers"
        ? newspapers.items.map((item) => item.title)
        : [],
    ).toEqual(["The Economic Times", "Financial Express"]);

    expect(
      publications?.kind === "publications" ? publications.heading : "",
    ).toBe("Other Publications");
    expect(
      publications?.kind === "publications"
        ? publications.items.map((item) => item.logoSrc)
        : [],
    ).toEqual([
      "https://cdn.example.com/bwretail.png",
      "https://cdn.example.com/indiaretail.png",
    ]);
    expect(
      publications?.kind === "publications" ? publications.items[0]?.href : "",
    ).toBe("/stores");
    expect(
      publications?.kind === "publications" ? publications.items[1]?.href : "",
    ).toBeNull();
  });

  it("cross-fills web and mWeb clippings when one is missing", () => {
    const [newspapers] = mapNewsPageContent(apiEntry).sections;
    if (newspapers?.kind !== "newspapers")
      throw new Error("expected clippings");

    const [et, fe] = newspapers.items;
    expect(et?.imageSrc).toBe("https://cdn.example.com/et-web.png");
    expect(et?.imageSrcMobile).toBe("https://cdn.example.com/et-web.png");
    expect(fe?.imageSrc).toBe("https://cdn.example.com/fe-mweb.png");
    expect(fe?.imageSrcMobile).toBe("https://cdn.example.com/fe-mweb.png");
  });

  it("drops items without media and blocks that end up empty", () => {
    const content = mapNewsPageContent({
      listing: [
        {
          heading: "Major Dailies",
          news_paper: [{ news_title: "No Image Daily", sort_order: "1" }],
          __component: "component.news-listing",
        },
        {
          title: "Other Publications",
          publication: [{ logo: null, sort_order: "1" }],
          __component: "component.publication-logo",
        },
      ],
    });

    expect(content.sections).toEqual([]);
    expect(hasNewsPageContent(content)).toBe(false);
  });

  it("ignores unknown dynamic-zone components", () => {
    const content = mapNewsPageContent({
      listing: [{ __component: "component.future-block" }],
    });
    expect(content.sections).toEqual([]);
  });

  it("reports renderable content when a block has items", () => {
    expect(hasNewsPageContent(mapNewsPageContent(apiEntry))).toBe(true);
  });
});
