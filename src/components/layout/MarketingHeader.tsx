import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

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
      className="from-header-tint text-text-primary bg-linear-to-b to-white px-6 pt-6 pb-6 md:px-10 md:pt-8 md:pb-6"
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <Logo
              tone="light"
              width={140}
              height={48}
              priority
              linkToHome
              className="h-8 w-[93px] md:h-12 md:w-[140px]"
            />
            <p className="font-display text-text-primary text-[28px] leading-none md:text-[40px]">
              Fresh. Wholesome. Gourmet.
            </p>
          </div>

          <label
            className="border-gray-200 bg-white-soft flex h-12 w-full items-center gap-3 rounded-full border px-4 lg:max-w-[566px]"
            aria-label="Search products"
          >
            <span aria-hidden className="text-text-secondary text-lg">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search for fresh produce, groceries, and more..."
              className="placeholder:text-text-tertiary h-full w-full bg-transparent text-sm outline-none md:text-base"
              readOnly
            />
          </label>

          <div className="bg-header-tint border-brand-100 text-brand-500 inline-flex h-12 items-center justify-center rounded-full border px-4 text-sm font-medium">
            Fresh Market Gurugram
          </div>
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

          <Button asChild size="md" className="w-full md:w-auto">
            <Link href="/notify">Download the App</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
