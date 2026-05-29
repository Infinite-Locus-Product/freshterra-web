import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export type BreadcrumbAncestor = {
  label: string;
  href: string;
};

type BreadcrumbProps = {
  current: string;
  homeLabel?: string;
  ancestors?: readonly BreadcrumbAncestor[];
  className?: string;
};

export function Breadcrumb({
  current,
  homeLabel = "Home",
  ancestors = [],
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-2 font-sans text-sm leading-[1.2] tracking-[0.2px]",
        className,
      )}
    >
      <Link
        href="/"
        className="text-text-secondary transition-opacity hover:opacity-80 focus-visible:underline focus-visible:outline-none"
      >
        {homeLabel}
      </Link>

      {ancestors.map((ancestor) => (
        <span key={ancestor.href} className="flex items-center gap-2">
          <span aria-hidden="true" className="text-text-secondary">
            ›
          </span>
          <Link
            href={ancestor.href}
            className="text-text-secondary transition-opacity hover:opacity-80 focus-visible:underline focus-visible:outline-none"
          >
            {ancestor.label}
          </Link>
        </span>
      ))}

      <span aria-hidden="true" className="text-text-secondary">
        ›
      </span>
      <span aria-current="page" className="text-text-primary">
        {current}
      </span>
    </nav>
  );
}
