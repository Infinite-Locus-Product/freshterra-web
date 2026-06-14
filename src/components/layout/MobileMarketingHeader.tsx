"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

import { AppDownloadBanner } from "@/components/layout/AppDownloadBanner";
import { HEADER_EDGE_PADDING_CLASS } from "@/components/layout/header-chrome";
import { PAGE_SHELL_INNER_CLASS } from "@/components/layout/layout-classes";
import type { MarketingNavLink } from "@/components/layout/MarketingHeader";
import { DEFAULT_NAV_LINKS } from "@/components/layout/MarketingHeader";
import {
  mobileHeaderLocationBadgeClass,
  mobileHeaderLogoClass,
  MOBILE_HEADER_LOGO_HEIGHT,
  MOBILE_HEADER_LOGO_WIDTH,
  mobileHeaderMenuLogoGroupClass,
  mobileHeaderMenuButtonClass,
  mobileHeaderShellClass,
  mobileHeaderTopRowClass,
} from "@/components/layout/mobile-header-chrome";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { HeaderLocationBadge } from "@/components/ui/HeaderLocationBadge";
import { Logo } from "@/components/ui/Logo";

import { SearchBox } from "@/features/search/components/SearchBox";

const MOBILE_SEARCH_PLACEHOLDER = "Search groceries...";

type MobileMarketingHeaderProps = Readonly<{
  locationLabel?: string;
  navLinks?: readonly MarketingNavLink[];
  downloadHref?: string;
  bannerFullBleed?: boolean;
  className?: string;
}>;

export function MobileMarketingHeader({
  locationLabel = "Fresh Market Gurugram",
  navLinks = DEFAULT_NAV_LINKS,
  downloadHref = "/open",
  bannerFullBleed = false,
  className,
}: MobileMarketingHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppDownloadBanner openAppHref={downloadHref} fullBleed={bannerFullBleed} />

      <div
        className={cn(
          mobileHeaderShellClass,
          bannerFullBleed && "bg-transparent",
          bannerFullBleed && "pb-0",
          HEADER_EDGE_PADDING_CLASS,
          className,
        )}
      >
        <div className={PAGE_SHELL_INNER_CLASS}>
          <div className={mobileHeaderTopRowClass}>
            <div className={mobileHeaderMenuLogoGroupClass}>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={drawerOpen}
                aria-controls="mobile-primary-nav"
                className={mobileHeaderMenuButtonClass}
              >
                <MenuIcon />
              </button>
              <Logo
                tone="light"
                variant="header"
                width={MOBILE_HEADER_LOGO_WIDTH}
                height={MOBILE_HEADER_LOGO_HEIGHT}
                priority
                linkToHome
                className={mobileHeaderLogoClass}
              />
            </div>

            <HeaderLocationBadge className={mobileHeaderLocationBadgeClass}>
              {locationLabel}
            </HeaderLocationBadge>
          </div>
        </div>

        <div className={PAGE_SHELL_INNER_CLASS}>
          <SearchBox placeholder={MOBILE_SEARCH_PLACEHOLDER} />
        </div>
      </div>

      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navLinks={navLinks}
      />
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
