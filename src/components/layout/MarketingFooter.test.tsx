import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { env } from "@/lib/config/env";

import type { FooterContent } from "@/features/cms-content/footer-content-types";

import { FOOTER_COPYRIGHT_LINE } from "./footer-legal-links";
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
  legal: [],
};

describe("MarketingFooterView", () => {
  it("renders a contentinfo role", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the hardcoded copyright line", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    expect(screen.getByText(FOOTER_COPYRIGHT_LINE)).toBeInTheDocument();
  });

  it("renders label-only footer items when deeplink is missing", () => {
    render(
      <MarketingFooterView
        content={{
          groups: [
            {
              title: "About FreshTerra",
              links: [{ label: "About Us" }, { label: "FAQs", url: "/faq" }],
            },
          ],
          social: [],
          legal: [],
        }}
      />,
    );

    expect(screen.getByText("About Us").tagName).toBe("SPAN");
    expect(screen.getByRole("link", { name: /faqs/i })).toHaveAttribute(
      "href",
      "/faq",
    );
  });

  it("renders hardcoded Privacy Policy, Terms, and Refund & Return links", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    expect(screen.getAllByRole("link", { name: /privacy policy/i })[0]).toHaveAttribute(
      "href",
      "/privacy-policy",
    );
    expect(screen.getAllByRole("link", { name: /terms & conditions/i })[0]).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(screen.getAllByRole("link", { name: /refund & return/i })[0]).toHaveAttribute(
      "href",
      "/refund-return",
    );
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

  it("points both store badges at the app download URL", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    for (const name of [/download on the app store/i, /get it on google play/i]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute(
        "href",
        env.NEXT_PUBLIC_APP_DOWNLOAD_URL,
      );
    }
  });

  it("renders hardcoded Follow Us social links", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    expect(
      screen.getByRole("link", { name: /freshterra on instagram/i }),
    ).toHaveAttribute("href", "https://www.instagram.com/freshterra_in/");
    expect(
      screen.getByRole("link", { name: /freshterra on linkedin/i }),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/freshterra/about",
    );
  });

  it("uses Manrope 18px/24px bold column title typography", () => {
    render(<MarketingFooterView content={sampleFooter} />);
    const shopTitle = screen.getByRole("heading", { name: /shop/i });
    expect(shopTitle.className).toContain("text-[1.125rem]");
    expect(shopTitle.className).toContain("leading-6");
    expect(shopTitle.className).toContain("font-bold");
  });

  it("treats the Figma 1440×374 main band height as a floor at lg, not a cap", () => {
    const { container } = render(<MarketingFooterView content={sampleFooter} />);
    const mainBand = container.querySelector(".lg\\:min-h-\\[23\\.375rem\\]");
    expect(mainBand).toBeInTheDocument();
    // A hard height here clipped the second grid row on narrow desktops.
    expect(mainBand?.className).not.toContain("lg:h-[23.375rem]");
    expect(mainBand?.querySelector(".max-w-content")).toBeInTheDocument();
  });

  it("scopes the decorative banner art to the main band, not the legal strip", () => {
    const { container } = render(<MarketingFooterView content={sampleFooter} />);
    const mainBand = container.querySelector(".lg\\:min-h-\\[23\\.375rem\\]");
    expect(mainBand?.querySelector(".object-cover")).toBeInTheDocument();
    const footer = container.querySelector("footer");
    const legalStrip = footer?.querySelector(".border-t");
    expect(legalStrip?.querySelector(".object-cover")).toBeNull();
  });
});
