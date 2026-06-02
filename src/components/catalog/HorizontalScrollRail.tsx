import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type HorizontalScrollRailProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/**
 * Horizontal scroll strip scoped to the parent width. The outer shell uses
 * overflow-hidden so wide flex children cannot expand the page on mobile.
 */
export function HorizontalScrollRail({
  children,
  className,
  ariaLabel,
}: HorizontalScrollRailProps) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden">
      <div
        className={cn(
          "flex w-full min-w-0 [scrollbar-width:none] gap-4 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}
