import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  MOBILE_APP_DOWNLOAD_BANNER_HEIGHT,
  MOBILE_APP_DOWNLOAD_BANNER_WIDTH,
  MOBILE_HEADER_LOCATION_BADGE_HEIGHT,
  MOBILE_HEADER_LOCATION_BADGE_WIDTH,
  MOBILE_HEADER_MENU_LOGO_GAP,
  MOBILE_NAV_DRAWER_INSET,
  MOBILE_NAV_DRAWER_LINK_GAP,
  mobileAppDownloadBannerClass,
  mobileAppDownloadBannerFullBleedClass,
  mobileHeaderLocationBadgeClass,
  mobileHeaderMenuLogoGroupClass,
  mobileHeaderTopRowClass,
  mobileNavDrawerLinksClass,
  mobileNavDrawerPanelClass,
} from "./mobile-header-chrome";
import { DEFAULT_NAV_LINKS } from "./MarketingHeader";
import { MobileNavDrawer } from "./MobileNavDrawer";

describe("mobile-header-chrome", () => {
  it("locks the app download banner to the Figma 393 × 64 frame", () => {
    expect(MOBILE_APP_DOWNLOAD_BANNER_WIDTH).toBe(393);
    expect(MOBILE_APP_DOWNLOAD_BANNER_HEIGHT).toBe(64);
    expect(mobileAppDownloadBannerClass).toContain("h-16");
    expect(mobileAppDownloadBannerClass).toContain("w-full");
  });

  it("supports a full-bleed homepage strip without page side padding", () => {
    expect(mobileAppDownloadBannerFullBleedClass).toContain("w-screen");
    expect(mobileAppDownloadBannerFullBleedClass).toContain("px-0");
  });

  it("uses a floating drawer card with Figma insets", () => {
    expect(MOBILE_NAV_DRAWER_INSET).toBe(24);
    expect(mobileNavDrawerPanelClass).toContain("top-6");
    expect(mobileNavDrawerPanelClass).toContain("left-6");
    expect(mobileNavDrawerPanelClass).toContain("right-6");
  });

  it("uses exact 12px spacing between hamburger and logo", () => {
    expect(mobileHeaderTopRowClass).toContain("justify-between");
    expect(MOBILE_HEADER_MENU_LOGO_GAP).toBe(12);
    expect(mobileHeaderMenuLogoGroupClass).toContain("gap-[12px]");
  });

  it("uses 15.5px gaps between links and after the last link", () => {
    expect(MOBILE_NAV_DRAWER_LINK_GAP).toBe(15.5);
    expect(mobileNavDrawerLinksClass).toContain("gap-[15.5px]");
    expect(mobileNavDrawerLinksClass).toContain("pb-[15.5px]");
  });

  it("locks the location pill to the Figma 178 × 32 frame", () => {
    expect(MOBILE_HEADER_LOCATION_BADGE_WIDTH).toBe(178);
    expect(MOBILE_HEADER_LOCATION_BADGE_HEIGHT).toBe(32);
    expect(mobileHeaderLocationBadgeClass).toContain("w-[11.125rem]");
    expect(mobileHeaderLocationBadgeClass).toContain("h-8");
  });
});

describe("MobileNavDrawer", () => {
  it("renders nav links when open", () => {
    render(
      <MobileNavDrawer
        open
        onClose={() => undefined}
        navLinks={DEFAULT_NAV_LINKS}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /primary/i })).toHaveTextContent(
      /explore products/i,
    );
    expect(
      screen.queryByRole("link", { name: /explore products/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <MobileNavDrawer
        open
        onClose={onClose}
        navLinks={DEFAULT_NAV_LINKS}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /close navigation menu/i }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
