import Link from "next/link";

import { comingSoonContent } from "@/lib/MockData";

export function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      className="border-brand-100 bg-brand-600 flex min-h-20 items-center border-t px-4 py-4 md:px-10 md:py-0"
    >
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-white-soft font-sans text-sm leading-[1.5]">
          © {year} FreshTerra. All rights reserved.
        </p>
        <nav aria-label="Legal" className="flex items-center gap-4 md:gap-6">
          {comingSoonContent.policyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white-soft/80 font-sans text-base leading-5 font-bold transition-opacity hover:opacity-100 focus-visible:underline focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
