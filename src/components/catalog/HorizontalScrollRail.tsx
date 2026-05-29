import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type HorizontalScrollRailProps = {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function HorizontalScrollRail({
  children,
  className,
  ariaLabel,
}: HorizontalScrollRailProps) {
  return (
    <div
      className={cn(
        "flex [scrollbar-width:none] gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
