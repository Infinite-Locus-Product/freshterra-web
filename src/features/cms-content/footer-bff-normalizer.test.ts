import { describe, expect, it } from "vitest";

import { normalizeFooterBffPayload } from "./footer-bff-normalizer";

describe("normalizeFooterBffPayload", () => {
  it("normalizes the documented BFF shape", () => {
    const content = normalizeFooterBffPayload({
      groups: [
        {
          title: "Shop",
          links: [{ label: "Fresh Produce", url: "/categories/fresh-produce" }],
        },
      ],
      social: [
        {
          platform: "instagram",
          url: "https://instagram.com/elixiirfoods",
          iconKey: "instagram",
        },
      ],
      legal: [{ label: "Privacy Policy", url: "/privacy-policy" }],
      copyrightLine: "© 2026 FreshTerra Foods Pvt. Ltd.",
    });

    expect(content.groups[0]?.title).toBe("Shop");
    expect(content.social[0]?.iconKey).toBe("instagram");
    expect(content.copyrightLine).toContain("FreshTerra Foods");
  });

  it("normalizes Strapi-shaped passthrough from the BFF", () => {
    const content = normalizeFooterBffPayload({
      slug: "footer-en",
      legalLine:
        "© 2026 FreshTerra Foods Pvt. Ltd. All rights reserved. CIN: U12345MH2026PTC00000.",
      socialLinks: [
        {
          platform: "linkedin",
          url: "https://linkedin.com/company/elixiirfoods",
          iconKey: "linkedin",
        },
      ],
      columns: [
        {
          heading: "Legal",
          links: [
            { label: "Privacy Policy", target: "/pages/privacy" },
            { label: "Terms & Conditions", target: "/pages/terms" },
          ],
        },
      ],
    });

    expect(content.groups).toHaveLength(0);
    expect(content.legal).toHaveLength(2);
    expect(content.legal[0]?.url).toBe("/privacy-policy");
    expect(content.social[0]?.platform).toBe("linkedin");
    expect(content.copyrightLine).toContain("CIN:");
  });
});
