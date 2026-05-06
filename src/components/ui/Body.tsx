import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type BodySize = "sm" | "md";

type BodyOwnProps<T extends ElementType> = {
  as?: T;
  size?: BodySize;
  className?: string;
  children?: ReactNode;
};

type BodyProps<T extends ElementType> = BodyOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BodyOwnProps<T>>;

const sizeClass: Record<BodySize, string> = {
  /** Manrope 14px, line-height 1.2, tracking 0.2px — Figma "Body 3" */
  sm: "text-sm leading-[1.2] tracking-[0.2px]",
  /** Manrope 16px — Figma "Body 2" */
  md: "text-base leading-[1.3] tracking-[0.2px]",
};

export function Body<T extends ElementType = "p">({
  as,
  size = "sm",
  className,
  children,
  ...rest
}: BodyProps<T>) {
  const Component = (as ?? "p") as ElementType;
  return (
    <Component
      className={cn("text-text-primary font-sans", sizeClass[size], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
