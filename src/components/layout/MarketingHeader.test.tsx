import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MARKETING_NAV_LINKS } from "./marketing-nav";
import { MarketingHeader } from "./MarketingHeader";

describe("MarketingHeader", () => {
  it("renders a banner role", () => {
    render(<MarketingHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the mWeb app promo banner above the header chrome", () => {
    render(<MarketingHeader />);
    expect(
      screen.getByText("Download the app for better experience"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open App" })).toHaveAttribute(
      "href",
      "/notify",
    );
  });

  it("the FreshTerra logo links home", () => {
    render(<MarketingHeader />);
    const homeLinks = screen.getAllByRole("link", { name: /freshterra home/i });
    expect(homeLinks.length).toBeGreaterThan(0);
    for (const link of homeLinks) {
      expect(link).toHaveAttribute("href", "/");
    }
  });

  it("locks the desktop bottom padding to 24px (Figma T&C / Privacy Policy frame)", () => {
    render(<MarketingHeader />);
    const desktopChrome = screen
      .getByRole("banner")
      .querySelector(".lg\\:flex");
    expect(desktopChrome?.className).toContain("md:pt-8");
    expect(desktopChrome?.className).toContain("md:pb-6");
  });

  it("exposes a mobile menu control that opens the nav drawer", async () => {
    const user = userEvent.setup();
    render(<MarketingHeader />);

    const openButton = screen.getByRole("button", { name: "Open menu" });
    expect(openButton).toHaveAttribute("aria-expanded", "false");

    await user.click(openButton);

    const dialog = screen.getByRole("dialog", { name: "Site navigation" });
    expect(dialog).toBeInTheDocument();
    expect(openButton).toHaveAttribute("aria-expanded", "true");

    const menu = within(dialog);

    for (const link of MARKETING_NAV_LINKS) {
      expect(menu.getByRole("link", { name: link.label })).toHaveAttribute(
        "href",
        link.href,
      );
    }
  });

  it("closes the nav drawer when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<MarketingHeader />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      screen.getByRole("dialog", { name: "Site navigation" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("dialog", { name: "Site navigation" }),
    ).not.toBeInTheDocument();
  });
});
