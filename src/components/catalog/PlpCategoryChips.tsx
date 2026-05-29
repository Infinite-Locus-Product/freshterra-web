"use client";

import { cn } from "@/lib/utils/cn";

import type { PlpCategoryChip } from "@/features/catalog/types";

import { HorizontalScrollRail } from "./HorizontalScrollRail";

type PlpCategoryChipsProps = {
  chips: readonly PlpCategoryChip[];
  activeChipId: string;
  onChipChange: (chipId: string) => void;
};

export function PlpCategoryChips({
  chips,
  activeChipId,
  onChipChange,
}: Readonly<PlpCategoryChipsProps>) {
  return (
    <HorizontalScrollRail ariaLabel="Category filters" className="gap-2">
      {chips.map((chip) => {
        const isActive = chip.id === activeChipId;

        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChipChange(chip.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm leading-none font-medium whitespace-nowrap transition-colors",
              "focus-visible:ring-brand-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              isActive
                ? "border-brand-500 bg-brand-500 text-beige-100"
                : "border-gray-divider text-text-primary hover:border-brand-300 bg-white",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </HorizontalScrollRail>
  );
}
