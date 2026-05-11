import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketingHeader } from "./MarketingHeader";

describe("MarketingHeader", () => {
  it("renders a banner role", () => {
    render(<MarketingHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("the FreshTerra logo links home", () => {
    render(<MarketingHeader />);
    expect(
      screen.getByRole("link", { name: /freshterra home/i }),
    ).toHaveAttribute("href", "/");
  });

  it("centers the logo on mWeb and left-aligns it on desktop", () => {
    render(<MarketingHeader />);
    const banner = screen.getByRole("banner");
    expect(banner.className).toContain("text-center");
    expect(banner.className).toContain("md:text-left");
  });

  it("locks the desktop bottom padding to 24px (Figma T&C / Privacy Policy frame)", () => {
    render(<MarketingHeader />);
    const banner = screen.getByRole("banner");
    expect(banner.className).toContain("md:pt-8");
    expect(banner.className).toContain("md:pb-6");
    expect(banner.className).not.toContain("md:py-8");
    expect(banner.className).toContain("py-6");
  });
});
