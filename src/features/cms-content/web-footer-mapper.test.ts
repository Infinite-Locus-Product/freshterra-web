import { describe, expect, it } from "vitest";

import { mapWebFooterContent } from "./web-footer-mapper";

const stagingPayload = {
  footer: [
    {
      id: 10,
      heading: "About FreshTerra",
      footer_label: [
        { id: 39, label: "About Us", deeplink: null },
        { id: 40, label: "Our Story", deeplink: null },
        { id: 41, label: "Carrers", deeplink: null },
        { id: 42, label: "Contact Us", deeplink: null },
        { id: 43, label: "FAQs", deeplink: null },
      ],
    },
    {
      id: 11,
      heading: "Quick Links",
      footer_label: [
        { id: 44, label: "Fresh Fruits", deeplink: null },
        { id: 45, label: "Vegetables", deeplink: null },
        { id: 46, label: "Dairy & Eggs", deeplink: null },
        { id: 47, label: "Organic Range", deeplink: null },
        { id: 48, label: "Explore Catalog", deeplink: null },
      ],
    },
    {
      id: 12,
      heading: "Head Office",
      footer_label: [
        {
          id: 49,
          label:
            "Elixiir Foods Private Limited\nWeWork Eldeco Centre, Block A, Shivalik Colony\n",
          deeplink: null,
        },
        { id: 50, label: "Malviya Nagar, New Delhi\n110017", deeplink: null },
      ],
    },
  ],
} as const;

describe("mapWebFooterContent", () => {
  it("shows footer labels without deeplink as plain text items", () => {
    const content = mapWebFooterContent({
      footer: [
        {
          heading: "About FreshTerra",
          footer_label: [
            { label: "About Us", deeplink: "/about" },
            { label: "Our Story", deeplink: null },
          ],
        },
      ],
    });

    expect(content.groups[0]?.links).toEqual([
      { label: "About Us", url: "/about" },
      { label: "Our Story" },
    ]);
  });

  it("maps staging web-footer columns and head office lines", () => {
    const content = mapWebFooterContent(stagingPayload);

    expect(content.groups).toHaveLength(2);
    expect(content.groups[0]?.title).toBe("About FreshTerra");
    expect(content.groups[0]?.links).toEqual([
      { label: "About Us" },
      { label: "Our Story" },
      { label: "Carrers" },
      { label: "Contact Us" },
      { label: "FAQs" },
    ]);
    expect(content.groups[1]?.links[4]).toEqual({
      label: "Explore Catalog",
    });
    expect(content.office).toEqual({
      title: "Head Office",
      lines: [
        "Elixiir Foods Private Limited",
        "WeWork Eldeco Centre, Block A, Shivalik Colony",
        "Malviya Nagar, New Delhi",
        "110017",
      ],
    });
  });

  it("uses CMS deeplink as the link href", () => {
    const content = mapWebFooterContent({
      footer: [
        {
          heading: "Quick Links",
          footer_label: [
            { label: "Explore Catalog", deeplink: "/c/explore-catalog" },
          ],
        },
      ],
    });

    expect(content.groups[0]?.links[0]).toEqual({
      label: "Explore Catalog",
      url: "/c/explore-catalog",
    });
  });

  it("ignores CMS legal and copyright fields (legal strip is hardcoded in the UI)", () => {
    const content = mapWebFooterContent({
      footer: [],
      legal: [{ label: "Privacy Policy", deeplink: "/privacy-policy" }],
      copyright_line: "© 2026 FreshTerra. All rights reserved.",
    });

    expect(content.social).toEqual([]);
    expect(content.legal).toEqual([]);
    expect(content.copyrightLine).toBeUndefined();
  });
});
