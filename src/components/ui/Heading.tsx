import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "policyTitle"
  | "policySection"
  | "policySubSection";
type HeadingAlign = "left" | "center" | "right";

type HeadingProps = {
  level?: HeadingLevel;
  variant?: HeadingVariant;
  align?: HeadingAlign;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"h2">, "className" | "children">;

const variantClass: Record<HeadingVariant, string> = {
  display:
    "font-display font-medium leading-[1.25] text-[1.75rem] md:text-[3.684rem] md:leading-[1.2]",
  h1: "font-display font-medium leading-tight text-3xl md:text-5xl",
  h2: "font-display font-medium leading-tight text-2xl md:text-4xl",
  h3: "font-sans font-bold leading-tight text-xl md:text-2xl",
  /** Policy/legal page H1 — Playfair, 28px mobile / 36px desktop. Always dark on light bg. */
  policyTitle:
    "font-display font-medium leading-none text-[1.75rem] text-text-primary md:text-[2.25rem] md:leading-[1.5]",
  /** Numbered section heading inside the policy card — Manrope Bold, 20px mobile / 28px desktop. Always dark on light card. */
  policySection:
    "font-sans font-bold leading-[1.3] text-[1.25rem] text-text-primary md:text-[1.75rem] md:leading-[1.2]",
  /** Sub-heading inside a policy section (markdown `###`/`####`) — sits between section heading and body copy. */
  policySubSection:
    "font-sans font-semibold leading-[1.3] text-[1rem] text-text-primary md:text-[1.125rem]",
};

const alignClass: Record<HeadingAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Heading({
  level = 2,
  variant = "h2",
  align = "left",
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(variantClass[variant], alignClass[align], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
