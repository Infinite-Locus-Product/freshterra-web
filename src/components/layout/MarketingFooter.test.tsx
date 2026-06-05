import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { FooterContent } from "@/features/cms-content/footer-content-types";

import { MarketingFooterView } from "./MarketingFooterView";

const sampleFooter: FooterContent = {
  groups: [
    {
      title: "Shop",
      links: [{ label: "Explore Catalog", url: "/c/explore-catalog" }],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Careers", url: "/careers" },
      ],
    },
  ],
  social: [
    { platform: "instagram", url: "https://instagram.com/elixiirfoods" },
  ],
  legal: [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms & Conditions", url: "/terms" },
  ],
  copyrightLine:
    "© 2026 FreshTerra Foods Pvt. Ltd. All rights reserved. CIN: U12345MH2026PTC00000.",
};

describe("MarketingFooterView", () => {
  it("renders a contentinfo role", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the copyright line from CMS content", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    expect(
      screen.getByText(/© 2026 FreshTerra Foods Pvt\. Ltd\./i),
    ).toBeInTheDocument();
  });

  it("omits copyright when CMS does not provide legalLine", () => {
    render(
      <MarketingFooterView
        content={{ ...sampleFooter, copyrightLine: undefined }}
      />,
    );
    expect(
      screen.queryByText(/© 2026 FreshTerra Foods/i),
    ).not.toBeInTheDocument();
  });

  it("renders Privacy Policy and Terms links pointing to canonical URLs", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toHaveAttribute("href", "/privacy-policy");
    expect(
      screen.getByRole("link", { name: /terms & conditions/i }),
    ).toHaveAttribute("href", "/terms");
  });

  it("renders Strapi column headings as link groups", () => {
    render(
      <MarketingFooterView
        content={{
          groups: [
            {
              title: "Shop",
              links: [{ label: "Beverages", url: "/categories/beverages" }],
            },
          ],
          social: [],
          legal: [],
        }}
      />,
    );
    expect(screen.getByRole("heading", { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /beverages/i })).toHaveAttribute(
      "href",
      "/categories/beverages",
    );
  });

  it("uses Manrope 18px/24px bold column title typography", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    const shopTitle = screen.getByRole("heading", { name: /shop/i });
    expect(shopTitle.className).toContain("text-[1.125rem]");
    expect(shopTitle.className).toContain("leading-6");
    expect(shopTitle.className).toContain("font-bold");
  });

  it("applies Figma 1440×374 main band height at lg", () => {
    const { container } = render(<MarketingFooterView content={sampleFooter} />);
    const mainBand = container.querySelector(".lg\\:h-\\[23\\.375rem\\]");
    expect(mainBand).toBeInTheDocument();
    expect(mainBand?.querySelector(".max-w-content")).toBeInTheDocument();
  });

  it("scopes the decorative banner art to the main band, not the legal strip", () => {
    const { container } = render(<MarketingFooterView content={sampleFooter} />);
    const mainBand = container.querySelector(".lg\\:h-\\[23\\.375rem\\]");
    expect(mainBand?.querySelector(".object-cover")).toBeInTheDocument();
    const footer = container.querySelector("footer");
    const legalStrip = footer?.querySelector(".border-t");
    expect(legalStrip?.querySelector(".object-cover")).toBeNull();
  });
});
