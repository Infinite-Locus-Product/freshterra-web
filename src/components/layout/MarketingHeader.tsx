import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { HEADER_EDGE_PADDING_CLASS } from "@/components/layout/header-chrome";
import { PAGE_SHELL_INNER_CLASS } from "@/components/layout/layout-classes";
import { BrandTagline } from "@/components/ui/BrandTagline";
import { HeaderDownloadAppButton } from "@/components/ui/HeaderDownloadAppButton";
import { HeaderLocationBadge } from "@/components/ui/HeaderLocationBadge";
import { Logo } from "@/components/ui/Logo";

import { SearchBox } from "@/features/search/components/SearchBox";

export type MarketingNavLink = Readonly<{
  label: string;
  href: string;
}>;

const DEFAULT_NAV_LINKS: readonly MarketingNavLink[] = [
  { label: "Explore Catalog", href: "/c/explore-catalog" },
  { label: "Our Philosophy", href: "/food-philosophy" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Our Stores", href: "/stores" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
] as const;

export type MarketingHeaderProps = Readonly<{
  tagline?: ReactNode;
  taglineAs?: "p" | "h1";
  locationLabel?: string;
  navLinks?: readonly MarketingNavLink[];
  downloadHref?: string;
  downloadLabel?: string;
  /** When true, omits outer gradient shell (parent section provides it). */
  embedded?: boolean;
  className?: string;
}>;

export function MarketingHeader({
  tagline,
  taglineAs = "p",
  locationLabel = "Fresh Market Gurugram",
  navLinks = DEFAULT_NAV_LINKS,
  downloadHref = "/notify",
  downloadLabel = "Download the App",
  embedded = false,
  className,
}: MarketingHeaderProps) {
  const inner = (
    <div className={`${PAGE_SHELL_INNER_CLASS} flex flex-col gap-6 md:gap-10`}>
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
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-text-primary text-sm leading-4 font-medium tracking-wide uppercase hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <HeaderDownloadAppButton href={downloadHref}>
          {downloadLabel}
        </HeaderDownloadAppButton>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <header role="banner" className={cn(className)}>
        <div className={HEADER_EDGE_PADDING_CLASS}>{inner}</div>
      </header>
    );
  }

  return (
    <header
      role="banner"
      className={cn(
        "from-header-tint text-text-primary bg-linear-to-b to-white pt-6 pb-6 md:pt-8 md:pb-6",
        HEADER_EDGE_PADDING_CLASS,
        className,
      )}
    >
      {inner}
    </header>
  );
}
