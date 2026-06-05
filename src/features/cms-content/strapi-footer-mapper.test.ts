import { describe, expect, it } from "vitest";

import {
  mapStrapiFooterToContent,
  normalizeFooterHref,
  parseStrapiFooterResponse,
} from "./strapi-footer-mapper";

const strapiV4Payload = {
  data: [
    {
      id: 1,
      attributes: {
        slug: "footer-en",
        legalLine:
          "© 2026 FreshTerra Foods Pvt. Ltd. All rights reserved. CIN: U12345MH2026PTC00000.",
        socialLinks: [
          {
            platform: "instagram",
            url: "https://instagram.com/elixiirfoods",
            iconKey: "instagram",
          },
          {
            platform: "facebook",
            url: "https://facebook.com/elixiirfoods",
            iconKey: "facebook",
          },
        ],
        columns: [
          {
            id: 1,
            heading: "Shop",
            links: [
              {
                id: 10,
                label: "Fresh Produce",
                target: "/categories/fresh-produce",
              },
            ],
          },
          {
            id: 2,
            heading: "Legal",
            links: [
              { id: 20, label: "Privacy Policy", target: "/pages/privacy" },
              { id: 21, label: "Terms & Conditions", target: "/pages/terms" },
            ],
          },
        ],
      },
    },
  ],
};

describe("normalizeFooterHref", () => {
  it("maps Strapi /pages/* paths to app routes", () => {
    expect(normalizeFooterHref("/pages/privacy")).toBe("/privacy-policy");
    expect(normalizeFooterHref("/pages/terms")).toBe("/terms");
    expect(normalizeFooterHref("/pages/refund")).toBe("/refund-return");
  });

  it("preserves absolute URLs", () => {
    expect(normalizeFooterHref("https://freshterra.in/careers")).toBe(
      "https://freshterra.in/careers",
    );
  });
});

describe("parseStrapiFooterResponse", () => {
  it("parses Strapi v4 footer payload", () => {
    const entry = parseStrapiFooterResponse(strapiV4Payload);
    expect(entry?.slug).toBe("footer-en");
    expect(entry?.columns).toHaveLength(2);
    expect(entry?.socialLinks).toHaveLength(2);
    expect(entry?.legalLine).toContain("FreshTerra");
  });
});

describe("mapStrapiFooterToContent", () => {
  it("maps columns to groups and lifts Legal links to the legal bar", () => {
    const entry = parseStrapiFooterResponse(strapiV4Payload);
    expect(entry).not.toBeNull();
    const content = mapStrapiFooterToContent(entry!);

    expect(content.groups).toHaveLength(1);
    expect(content.groups[0]?.title).toBe("Shop");
    expect(content.groups[0]?.links[0]?.url).toBe("/categories/fresh-produce");
    expect(content.legal).toHaveLength(2);
    expect(content.legal[0]?.url).toBe("/privacy-policy");
    expect(content.social[0]?.platform).toBe("instagram");
    expect(content.social[0]?.iconKey).toBe("instagram");
    expect(content.copyrightLine).toContain("FreshTerra Foods");
    expect(content.copyrightLine).toContain("CIN:");
  });

  it("still parses legacy socialLinks stored as plain URL strings", () => {
    const entry = parseStrapiFooterResponse({
      data: {
        slug: "footer-en",
        socialLinks: ["https://youtube.com/@elixiirfoods"],
        columns: [],
      },
    });
    expect(entry?.socialLinks[0]?.platform).toBe("youtube");
    expect(entry?.socialLinks[0]?.url).toContain("youtube");
  });
});
