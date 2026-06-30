import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import {
  MAX_W_CONTENT_CLASS,
  PAGE_SHELL_CLASS,
  PAGE_SHELL_NARROW_CLASS,
  PX_PAGE_CLASS,
} from "@/components/layout/layout-classes";

type PageShellMax = "content" | "narrow";

type PageShellOwnProps<T extends ElementType> = {
  as?: T;
  max?: PageShellMax;
  /** When false, horizontal padding comes from a parent (e.g. nested hero). */
  pad?: boolean;
  className?: string;
  children?: ReactNode;
};

type PageShellProps<T extends ElementType> = PageShellOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PageShellOwnProps<T>>;

const maxClass: Record<PageShellMax, string> = {
  content: MAX_W_CONTENT_CLASS,
  narrow: "max-w-content-narrow",
};

export function PageShell<T extends ElementType = "div">({
  as,
  max = "content",
  pad = true,
  className,
  children,
  ...rest
}: PageShellProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        maxClass[max],
        pad && PX_PAGE_CLASS,
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export { PAGE_SHELL_CLASS, PAGE_SHELL_NARROW_CLASS };
