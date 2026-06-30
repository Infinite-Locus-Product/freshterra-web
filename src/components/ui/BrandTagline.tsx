import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** Figma header tagline box — Playfair Display SemiBold 28 / 100% lh. */
export const BRAND_TAGLINE_WIDTH = 371;
export const BRAND_TAGLINE_HEIGHT = 28;

const brandTaglineClass =
  "font-display text-black box-border w-max max-w-full shrink-0 align-middle font-semibold tracking-[0] whitespace-nowrap text-[clamp(0.875rem,1.5vw+0.25rem,1.75rem)]/none lg:text-[1.75rem]/none";

type BrandTaglineProps = Readonly<{
  children?: ReactNode;
  className?: string;
  as?: "p" | "h1";
}>;

export function BrandTagline({
  children = "Fresh. Wholesome. Gourmet.",
  className,
  as: Tag = "p",
}: BrandTaglineProps) {
  return <Tag className={cn(brandTaglineClass, className)}>{children}</Tag>;
}
