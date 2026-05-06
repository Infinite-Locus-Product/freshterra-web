import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type InputProps = {
  label: string;
  error?: string;
  helper?: string;
  className?: string;
  /** Background color of the surface the input sits on — used to "punch through" the floating label across the border. Defaults to white. */
  labelBgClass?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

/**
 * Floating-label input matching Figma's Material-style design.
 * The label sits on top of the rounded outline with a small surface-colored
 * background so the border passes through cleanly.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helper, id, className, labelBgClass = "bg-white", ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const describedById = error
    ? `${inputId}-error`
    : helper
      ? `${inputId}-helper`
      : undefined;

  return (
    <div className={cn("relative w-full", className)}>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedById}
        className={cn(
          "peer border-input-border text-input-text w-full rounded-full border bg-transparent px-5 py-4 text-base",
          "placeholder:text-input-label",
          "focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none",
          error && "border-red-600 focus:border-red-600 focus:ring-red-600",
        )}
        {...rest}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "text-input-label pointer-events-none absolute -top-2 left-4 px-1 text-xs leading-none",
          labelBgClass,
        )}
      >
        {label}
      </label>
      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-2 px-2 text-sm text-red-600"
        >
          {error}
        </p>
      ) : helper ? (
        <p
          id={`${inputId}-helper`}
          className="text-input-label mt-2 px-2 text-sm"
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
});
