import {
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "onImage" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children" | "disabled"
> & { disabled?: boolean };

const baseClass = cn(
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-bold uppercase tracking-wide",
  "transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-60",
);

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-beige-100 hover:bg-brand-600 active:bg-brand-600",
  onImage:
    "bg-white-soft text-brand-500 hover:bg-beige-100 active:bg-beige-100 shadow-sm",
  ghost: "bg-transparent text-brand-500 hover:bg-brand-500/10",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm leading-5",
  md: "px-5 py-3 text-base leading-6",
  lg: "px-6 py-4 text-lg leading-6 min-w-[172px]",
};

export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  loading = false,
  asChild = false,
  disabled,
  className,
  children,
  type,
  ...rest
}: ButtonProps) {
  const composedClass = cn(
    baseClass,
    variantClass[variant],
    sizeClass[size],
    fullWidth && "w-full",
    className,
  );

  if (asChild) {
    const child = Children.only(children) as ReactElement<{
      className?: string;
    }>;
    if (!isValidElement(child)) {
      throw new Error("Button asChild requires a single child element.");
    }
    return cloneElement(child, {
      className: cn(composedClass, child.props.className),
    });
  }

  return (
    <button
      type={type ?? "button"}
      className={composedClass}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
