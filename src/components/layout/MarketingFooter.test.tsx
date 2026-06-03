import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingFooter } from "./MarketingFooter";

describe("MarketingFooter", () => {
  it("renders a contentinfo role", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the copyright line", () => {
    render(<MarketingFooter />);
    expect(
      screen.getByText(/© 2026 FreshTerra\. All rights reserved\./i),
    ).toBeInTheDocument();
  });

  it("renders Privacy Policy and Terms links pointing to canonical URLs", () => {
    render(<MarketingFooter />);
    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toHaveAttribute("href", "/privacy-policy");
    expect(
      screen.getByRole("link", { name: /terms & conditions/i }),
    ).toHaveAttribute("href", "/terms");
  });

  it("renders Privacy Policy before Terms & Conditions (inverse of notify-footer order)", () => {
    render(<MarketingFooter />);
    const links = screen
      .getAllByRole("link")
      .filter(
        (a) =>
          /privacy policy/i.test(a.textContent ?? "") ||
          /terms & conditions/i.test(a.textContent ?? ""),
      );
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(/privacy policy/i);
    expect(links[1]).toHaveTextContent(/terms & conditions/i);
  });

  it("locks the copyright line to Figma's 252 × 17 mWeb spec and reverts on desktop", () => {
    render(<MarketingFooter />);
    const copy = screen.getByText(/all rights reserved/i);
    expect(copy.className).toContain("max-lg:w-[252px]");
    expect(copy.className).toContain("max-lg:leading-[17px]");
    expect(copy.className).toContain("text-sm");
    expect(copy.className).toContain("md:leading-[1.5]");
  });
});
