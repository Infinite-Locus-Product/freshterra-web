import { cn } from "@/lib/utils/cn";

/** Figma header store / market pill. */
export const HEADER_LOCATION_BADGE_WIDTH = 250;
export const HEADER_LOCATION_BADGE_HEIGHT = 48;

const headerLocationBadgeClass =
  "bg-header-tint border-brand-100 text-brand-500 inline-flex h-12 w-full shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium lg:w-[250px]";

type HeaderLocationBadgeProps = Readonly<{
  children: string;
  className?: string;
}>;

export function HeaderLocationBadge({ children, className }: HeaderLocationBadgeProps) {
  return <div className={cn(headerLocationBadgeClass, className)}>{children}</div>;
}
