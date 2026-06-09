"use client";

import { useEffect, useRef, useState } from "react";

import { categoryPlpToolbarButtonClass, categoryPlpToolbarLabelClass } from "@/components/category/category-plp-page";
import { cn } from "@/lib/utils/cn";

export type SortOption<T extends string = string> = {
  value: T;
  label: string;
};

type PlpSortMenuProps<T extends string> = {
  value: T;
  options: SortOption<T>[];
  onChange: (next: T) => void;
  /** mWeb PLP toolbar: label-only “Sort By” trigger in the split bar. */
  variant?: "default" | "plp-toolbar";
};

export function PlpSortMenu<T extends string>({
  value,
  options,
  onChange,
  variant = "default",
}: PlpSortMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const triggerClass =
    variant === "plp-toolbar"
      ? cn(categoryPlpToolbarButtonClass, categoryPlpToolbarLabelClass, "w-full gap-2")
      : "text-text-primary flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm";

  return (
    <div
      ref={rootRef}
      className={cn("relative shrink-0", variant === "plp-toolbar" && "w-full")}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={triggerClass}
      >
        {variant === "plp-toolbar" ? (
          <>
            <span>Sort By</span>
            <Chevron open={open} />
          </>
        ) : (
          <>
            <span>
              Sort: <span className="font-medium">{current?.label}</span>
            </span>
            <Chevron open={open} />
          </>
        )}
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Sort products"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                  option.value === value
                    ? "text-brand-600 font-semibold"
                    : "text-text-primary",
                )}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={12}
      height={12}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform", open && "rotate-180")}
    >
      <path d="M2.5 4.5L6 8l3.5-3.5" />
    </svg>
  );
}

export default PlpSortMenu;
