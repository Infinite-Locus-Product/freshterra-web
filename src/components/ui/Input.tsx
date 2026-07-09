import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type InputProps = {
  label: string;
  error?: string;
  helper?: string;
  className?: string;
  /** Background color of the surface the input sits on — used to "punch through" the floating label across the border. Defaults to white. */
  labelBgClass?: string;
  /** When provided, renders a clear (✕) button on the right while the field has a value. */
  onClear?: () => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

/**
 * Floating-label input matching Figma's Material-style design.
 * The label sits on top of the rounded outline with a small surface-colored
 * background so the border passes through cleanly.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helper,
    id,
    className,
    labelBgClass = "bg-white",
    onClear,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const describedById = error
    ? `${inputId}-error`
    : helper
      ? `${inputId}-helper`
      : undefined;

  const showClear =
    !!onClear &&
    typeof rest.value === "string" &&
    rest.value.length > 0 &&
    !rest.disabled;

  return (
    <div className={cn("relative w-full", className)}>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedById}
        className={cn(
          "peer border-input-border text-input-text w-full rounded-full border bg-transparent px-4 py-[14px] text-sm md:h-[60.33px] md:py-0 md:text-base",
          "placeholder:text-input-label",
          "focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:outline-none",
          error && "border-red-600 focus:border-red-600 focus:ring-red-600",
          showClear && "pr-12",
        )}
        {...rest}
      />
      {showClear ? (
        <button
          type="button"
          aria-label={`Clear ${label}`}
          onClick={onClear}
          className="text-input-text hover:text-text-primary absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 focus-visible:ring-brand-500 focus-visible:ring-2 focus-visible:outline-none"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
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
