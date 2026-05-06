import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils/cn";

type CheckboxProps = {
  label: ReactNode;
  error?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, error, id, className, ...rest }, ref) {
    const reactId = useId();
    const inputId = id ?? `cb-${reactId}`;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className={cn("w-full", className)}>
        <label
          htmlFor={inputId}
          className="text-input-text inline-flex cursor-pointer items-center gap-3 text-base"
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={errorId}
            className={cn(
              "border-brand-500 size-5 shrink-0 cursor-pointer appearance-none rounded-full border",
              "checked:bg-brand-500 checked:bg-[radial-gradient(circle,white_30%,transparent_31%)]",
              "focus-visible:ring-brand-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              error && "border-red-600",
            )}
            {...rest}
          />
          <span className="leading-tight">{label}</span>
        </label>
        {error ? (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
