import type { ReactNode } from "react";

import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils/cn";

import { AppDownloadBanner } from "@/components/layout/AppDownloadBanner";
import {
  HEADER_EDGE_PADDING_CLASS,
  marketingHeaderNavClass,
  marketingHeaderNavLinkLabelClass,
} from "@/components/layout/header-chrome";
import { PAGE_SHELL_INNER_CLASS } from "@/components/layout/layout-classes";
import { MarketingNavLinkLabel } from "@/components/layout/MarketingNavLinkLabel";
import { MobileMarketingHeader } from "@/components/layout/MobileMarketingHeader";
import { SiteHeaderHeightSync } from "@/components/layout/SiteHeaderHeightSync";
import { BrandTagline } from "@/components/ui/BrandTagline";
import { HeaderDownloadAppButton } from "@/components/ui/HeaderDownloadAppButton";
import { HeaderLocationBadge } from "@/components/ui/HeaderLocationBadge";
import { Logo } from "@/components/ui/Logo";

import { fetchWebNavLinksSafe } from "@/features/cms-content/web-footer-service";
import { SearchBox } from "@/features/search/components/SearchBox";

import { DEFAULT_NAV_LINKS, type MarketingNavLink } from "./nav-links";

export { DEFAULT_NAV_LINKS, type MarketingNavLink } from "./nav-links";

const NAV_LINK_CLASS = marketingHeaderNavLinkLabelClass;

export type MarketingHeaderProps = Readonly<{
  tagline?: ReactNode;
  taglineAs?: "p" | "h1";
  locationLabel?: string;
  navLinks?: readonly MarketingNavLink[];
  downloadHref?: string;
  downloadLabel?: string;
  /** Parent provides the shell, stickiness and mWeb app strip. */
  embedded?: boolean;
  /** Homepage mWeb — app download strip spans full viewport width. */
  bannerFullBleed?: boolean;
  /** Category hub mWeb — search bar sits flush above hero banner. */
  mwebFlushBelowSearch?: boolean;
  className?: string;
}>;

/** Site header; nav from Strapi `web-footer.navbar`, else built-in links. */
export async function MarketingHeader(props: MarketingHeaderProps) {
  const navLinks =
    props.navLinks ??
    (await fetchWebNavLinksSafe().then((links) =>
      links.length > 0 ? links : undefined,
    ));
  return <MarketingHeaderView {...props} navLinks={navLinks} />;
}

export function MarketingHeaderView({
  tagline,
  taglineAs = "p",
  locationLabel = "FreshTerra Gurugram",
  navLinks = DEFAULT_NAV_LINKS,
  downloadHref = env.NEXT_PUBLIC_APP_DOWNLOAD_URL,
  downloadLabel = "Download the App",
  embedded = false,
  bannerFullBleed = false,
  mwebFlushBelowSearch = false,
  className,
}: MarketingHeaderProps) {
  const desktopInner = (
    <div className={`${PAGE_SHELL_INNER_CLASS} hidden flex-col gap-6 lg:flex md:gap-10`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <Logo tone="light" variant="header" priority linkToHome />
          {tagline !== undefined ? (
            <BrandTagline as={taglineAs}>{tagline}</BrandTagline>
          ) : (
            <BrandTagline />
          )}
        </div>

        <SearchBox />

        <HeaderLocationBadge>{locationLabel}</HeaderLocationBadge>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Primary" className={marketingHeaderNavClass}>
          {navLinks.map((link) => (
            <MarketingNavLinkLabel
              key={link.label}
              label={link.label}
              href={link.href}
              labelClassName={NAV_LINK_CLASS}
            />
          ))}
        </nav>

        <HeaderDownloadAppButton href={downloadHref}>
          {downloadLabel}
        </HeaderDownloadAppButton>
      </div>
    </div>
  );

  const mobileInner = (
    <div className="lg:hidden">
      <MobileMarketingHeader
        locationLabel={locationLabel}
        navLinks={navLinks}
        bannerFullBleed={bannerFullBleed}
        flushBelowSearch={mwebFlushBelowSearch}
      />
    </div>
  );

  if (embedded) {
    return (
      <header role="banner" className={cn(className)}>
        <SiteHeaderHeightSync />
        {mobileInner}
        <div className={HEADER_EDGE_PADDING_CLASS}>{desktopInner}</div>
      </header>
    );
  }

  return (
    <>
      {/* mWeb app strip scrolls away; only the header below it sticks. */}
      <div className="lg:hidden">
        <AppDownloadBanner
          openAppHref={downloadHref}
          fullBleed={bannerFullBleed}
        />
      </div>
      <header
        role="banner"
        data-site-header
        className={cn(
          "text-text-primary sticky top-0 z-40 bg-white lg:from-header-tint lg:bg-linear-to-b lg:to-white lg:pt-6 lg:pb-6 md:lg:pt-8 md:lg:pb-6",
          className,
        )}
      >
        <SiteHeaderHeightSync />
        {mobileInner}
        <div className={HEADER_EDGE_PADDING_CLASS}>{desktopInner}</div>
      </header>
    </>
  );
}
