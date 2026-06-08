import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppDownloadBanner } from "./AppDownloadBanner";
import { MarketingHeader } from "./MarketingHeader";

describe("AppDownloadBanner", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the two-line download message and Open App link", () => {
    render(<AppDownloadBanner />);
    expect(
      screen.getByText("Download the app for better"),
    ).toBeInTheDocument();
    expect(screen.getByText("experience")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open app/i })).toHaveAttribute(
      "href",
      "/open",
    );
  });

  it("hides after dismiss and stays hidden for the session", () => {
    render(<AppDownloadBanner />);
    fireEvent.click(
      screen.getByRole("button", { name: /dismiss app download banner/i }),
    );
    expect(
      screen.queryByText("Download the app for better"),
    ).not.toBeInTheDocument();

    render(<AppDownloadBanner />);
    expect(screen.queryByText("experience")).not.toBeInTheDocument();
  });
});

describe("MarketingHeader", () => {
  it("renders a banner role", () => {
    render(<MarketingHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("the FreshTerra logo links home", () => {
    render(<MarketingHeader />);
    expect(
      screen.getAllByRole("link", { name: /freshterra home/i })[0],
    ).toHaveAttribute("href", "/");
  });

  it("uses fluid page padding on the desktop banner shell", () => {
    render(<MarketingHeader />);
    const banner = screen.getByRole("banner");
    expect(banner.innerHTML).toContain("px-page");
  });

  it("wraps primary nav links on desktop instead of horizontal scroll", () => {
    render(<MarketingHeader />);
    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(nav.className).toContain("flex-wrap");
    expect(nav.className).not.toContain("overflow-x-auto");
  });

  it("exposes a mobile hamburger menu trigger wired to the drawer", () => {
    render(<MarketingHeader />);
    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });
    expect(menuButton).toHaveAttribute("aria-controls", "mobile-primary-nav");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
