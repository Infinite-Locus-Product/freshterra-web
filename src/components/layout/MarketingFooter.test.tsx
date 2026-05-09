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
    expect(screen.getByText(/freshterra/i)).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
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

  it("locks the copyright line to Figma's 252 × 17 mWeb spec and reverts on desktop", () => {
    render(<MarketingFooter />);
    const copy = screen.getByText(/all rights reserved/i);
    expect(copy.className).toContain("w-[252px]");
    expect(copy.className).toContain("leading-[17px]");
    expect(copy.className).toContain("text-sm");
    expect(copy.className).toContain("md:w-auto");
    expect(copy.className).toContain("md:leading-[1.5]");
  });
});
