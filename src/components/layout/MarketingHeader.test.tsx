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

  it("uses fluid page padding on the banner shell", () => {
    render(<MarketingHeader />);
    const banner = screen.getByRole("banner");
    expect(banner.className).toContain("px-page");
  });

  it("wraps primary nav links instead of horizontal scroll", () => {
    render(<MarketingHeader />);
    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(nav.className).toContain("flex-wrap");
    expect(nav.className).not.toContain("overflow-x-auto");
  });
});
