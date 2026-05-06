import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

type ContainerOwnProps<T extends ElementType> = {
  as?: T;
  size?: ContainerSize;
  className?: string;
  children?: ReactNode;
};

type ContainerProps<T extends ElementType> = ContainerOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerOwnProps<T>>;

const sizeClass: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  full: "",
};

export function Container<T extends ElementType = "div">({
  as,
  size = "lg",
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn("mx-auto w-full px-6 md:px-8", sizeClass[size], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
