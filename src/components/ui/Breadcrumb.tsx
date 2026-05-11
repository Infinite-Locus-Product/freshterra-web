import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type BreadcrumbProps = {
  current: string;
  homeLabel?: string;
  className?: string;
};

export function Breadcrumb({
  current,
  homeLabel = "Home",
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-2 font-sans text-sm leading-[1.2] tracking-[0.2px]",
        className,
      )}
    >
      <Link
        href="/"
        className="text-text-secondary transition-opacity hover:opacity-80 focus-visible:underline focus-visible:outline-none"
      >
        {homeLabel}
      </Link>
      <span aria-hidden="true" className="text-text-secondary">
        ›
      </span>
      <span aria-current="page" className="text-text-primary">
        {current}
      </span>
    </nav>
  );
}
