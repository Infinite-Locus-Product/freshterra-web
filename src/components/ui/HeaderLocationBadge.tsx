import Image from "next/image";

import { cn } from "@/lib/utils/cn";

import { HEADER_LOCATION_MAX_CLASS } from "@/components/layout/layout-classes";

/** Figma header store / market pill. */
export const HEADER_LOCATION_BADGE_WIDTH = 250;
export const HEADER_LOCATION_BADGE_HEIGHT = 48;

const headerLocationBadgeClass =
  `bg-header-tint border-brand-100 inline-flex h-12 shrink-0 items-center justify-center gap-0.5 rounded-full border px-4 text-center font-sans text-base font-medium leading-5 tracking-normal text-[#4C864C] ${HEADER_LOCATION_MAX_CLASS}`;

type HeaderLocationBadgeProps = Readonly<{
  children: string;
  className?: string;
}>;

export function HeaderLocationBadge({ children, className }: HeaderLocationBadgeProps) {
  return (
    <div className={cn(headerLocationBadgeClass, className)}>
      <Image
        src="/Icon.svg"
        alt=""
        aria-hidden
        width={24}
        height={24}
        className="size-6 shrink-0"
      />
      {children}
    </div>
  );
}
