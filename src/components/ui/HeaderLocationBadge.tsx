import Image from "next/image";
import Link from "next/link";

import type { Route } from "next";

import { cn } from "@/lib/utils/cn";

import { HEADER_LOCATION_MAX_CLASS } from "@/components/layout/layout-classes";

/** Figma header store / market pill. */
export const HEADER_LOCATION_BADGE_WIDTH = 250;
export const HEADER_LOCATION_BADGE_HEIGHT = 48;

export const DEFAULT_HEADER_LOCATION_HREF = "/stores" as const satisfies Route;

const headerLocationBadgeClass =
  `bg-header-tint border-brand-100 inline-flex h-12 shrink-0 items-center justify-center gap-0.5 rounded-full border px-4 text-center font-sans text-base font-medium leading-5 tracking-normal text-[#4C864C] focus-visible:ring-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${HEADER_LOCATION_MAX_CLASS}`;

type HeaderLocationBadgeProps = Readonly<{
  children: string;
  className?: string;
  href?: Route;
}>;

export function HeaderLocationBadge({
  children,
  className,
  href = DEFAULT_HEADER_LOCATION_HREF,
}: HeaderLocationBadgeProps) {
  return (
    <Link href={href} className={cn(headerLocationBadgeClass, className)}>
      <Image
        src="/header-location.svg"
        alt=""
        aria-hidden
        width={24}
        height={24}
        className="size-6 shrink-0"
      />
      <span className="truncate">{children}</span>
    </Link>
  );
}
