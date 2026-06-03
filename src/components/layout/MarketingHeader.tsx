import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

import { MARKETING_NAV_LINKS, type NavLink } from "./marketing-nav";
import { MarketingMobileNav } from "./MarketingMobileNav";
import { MobileAppBanner } from "./MobileAppBanner";

type MarketingHeaderProps = {
  eyebrow?: string;
  locationLabel?: string;
  links?: readonly NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
};

function SearchField({
  className,
  placeholder = "Search for fresh produce, groceries, and more...",
}: {
  className?: string;
  placeholder?: string;
}) {
  return (
    <label
      className={`bg-white-soft flex h-12 w-full items-center gap-3 rounded-full border-[1.5px] border-gray-50 px-3 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] ${className ?? ""}`}
      aria-label="Search products"
    >
      <SearchIcon />
      <input
        type="search"
        placeholder={placeholder}
        className="placeholder:text-text-tertiary h-full w-full bg-transparent text-sm outline-none md:text-base"
        readOnly
      />
    </label>
  );
}

function StoreLocationBadge({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "inline-flex h-8 max-w-[178px] shrink-0 items-center justify-center gap-1 rounded-full border border-[#d1e9d1] bg-[#f1faf1] px-3 text-xs font-medium text-[#4c864c]"
          : "bg-header-tint border-brand-100 text-brand-500 inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap"
      }
    >
      <StoreIcon compact={compact} />
      <span className={compact ? "truncate" : undefined}>{label}</span>
    </div>
  );
}

export function MarketingHeader({
  eyebrow = "Fresh. Wholesome. Gourmet.",
  locationLabel = "Fresh Market Gurugram",
  links = MARKETING_NAV_LINKS,
  ctaLabel = "Download the App",
  ctaHref = "/notify",
}: MarketingHeaderProps = {}) {
  return (
    <header
      role="banner"
      className="from-header-tint text-text-primary w-full max-w-full overflow-x-clip bg-linear-to-b to-white"
    >
      <MobileAppBanner ctaHref={ctaHref} />

      {/* mWeb */}
      <div className="flex flex-col gap-3 bg-linear-to-t from-[#fafbfb] from-[47%] to-[#edfced] pb-4 lg:hidden">
        <div className="flex items-center justify-between px-4 pt-5">
          <div className="flex items-center gap-3">
            <MarketingMobileNav links={links} />
            <Logo
              tone="light"
              width={58}
              height={20}
              priority
              linkToHome
              className="h-5 w-[58px]"
            />
          </div>
          <StoreLocationBadge compact label={locationLabel} />
        </div>
        <div className="px-4">
          <SearchField placeholder="Search groceries..." />
        </div>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-[1360px] flex-col gap-6 px-6 pt-6 pb-6 md:px-10 md:pt-8 md:pb-6 lg:flex">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <Logo
              tone="light"
              width={140}
              height={48}
              priority
              linkToHome
              className="h-12 w-[140px]"
            />
            <p className="font-display text-text-primary text-[40px] leading-none">
              {eyebrow}
            </p>
          </div>

          <SearchField className="lg:max-w-[566px]" />

          <StoreLocationBadge label={locationLabel} />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav
            aria-label="Primary"
            className="flex min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap"
          >
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-text-primary text-sm leading-4 font-medium tracking-wide uppercase hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button asChild size="md" className="w-full md:w-auto">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="text-text-secondary shrink-0"
    >
      <path
        d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StoreIcon({ compact }: { compact?: boolean }) {
  const size = compact ? 16 : 24;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M4 10L5.5 4H18.5L20 10M4 10H20M4 10V19C4 19.5523 4.44772 20 5 20H9V14H15V20H19C19.5523 20 20 19.5523 20 19V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
