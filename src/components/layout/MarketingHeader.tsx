import Link from "next/link";

import { BrandTagline } from "@/components/ui/BrandTagline";
import { HeaderDownloadAppButton } from "@/components/ui/HeaderDownloadAppButton";
import { HeaderLocationBadge } from "@/components/ui/HeaderLocationBadge";
import { HeaderSearchBar } from "@/components/ui/HeaderSearchBar";
import { Logo } from "@/components/ui/Logo";

import {
  HEADER_EDGE_PADDING_CLASS,
} from "@/components/layout/header-chrome";

const MARKETING_NAV_LINKS = [
  { label: "Explore Catalog", href: "/c/explore-catalog" },
  { label: "Our Philosophy", href: "/food-philosophy" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Our Stores", href: "/stores" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
] as const;

export function MarketingHeader() {
  return (
    <header
      role="banner"
      className={`from-header-tint text-text-primary bg-linear-to-b to-white pt-6 pb-6 md:pt-8 md:pb-6 ${HEADER_EDGE_PADDING_CLASS}`}
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <Logo tone="light" variant="header" priority linkToHome />
            <BrandTagline />
          </div>

          <HeaderSearchBar />

          <HeaderLocationBadge>Fresh Market Gurugram</HeaderLocationBadge>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav
            aria-label="Primary"
            className="flex items-center gap-5 overflow-x-auto whitespace-nowrap"
          >
            {MARKETING_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-text-primary text-sm font-medium tracking-wide uppercase hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <HeaderDownloadAppButton href="/notify">Download the App</HeaderDownloadAppButton>
        </div>
      </div>
    </header>
  );
}
