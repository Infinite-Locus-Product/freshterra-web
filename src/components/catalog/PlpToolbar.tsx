"use client";

import { cn } from "@/lib/utils/cn";

import type { SortOptionId } from "@/features/catalog/types";

import { PlpActiveFilterTags } from "./PlpActiveFilterTags";

const SORT_OPTIONS: { id: SortOptionId; label: string }[] = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

type PlpToolbarProps = {
  productCount: number;
  sortBy: SortOptionId;
  onSortChange: (sortBy: SortOptionId) => void;
  activeFilterCount: number;
  activeFilterIds: readonly string[];
  filterLabels: Readonly<Record<string, string>>;
  onRemoveFilter: (filterId: string) => void;
  onOpenFilters: () => void;
};

export function PlpToolbar({
  productCount,
  sortBy,
  onSortChange,
  activeFilterCount,
  activeFilterIds,
  filterLabels,
  onRemoveFilter,
  onOpenFilters,
}: Readonly<PlpToolbarProps>) {
  const countLabel = `Showing ${productCount} product${productCount === 1 ? "" : "s"}`;
  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.id === sortBy)?.label ?? "Relevance";

  return (
    <div className="flex flex-col gap-3">
      {/* mWeb sticky filter/sort bar */}
      <div className="border-gray-divider flex items-stretch border-y py-3 lg:hidden">
        <button
          type="button"
          onClick={onOpenFilters}
          className="border-gray-divider text-text-primary flex flex-1 items-center justify-center gap-1.5 border-r text-sm font-semibold"
        >
          <SlidersIcon />
          Filters
          {activeFilterCount > 0 ? (
            <span className="bg-brand-500 text-beige-100 flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
        <div className="relative flex flex-1 items-center justify-center">
          <label
            htmlFor="plp-sort-mobile"
            className="text-text-primary flex items-center gap-1 text-sm font-semibold"
          >
            Sort By
            <ChevronDownIcon />
          </label>
          <select
            id="plp-sort-mobile"
            value={sortBy}
            onChange={(event) =>
              onSortChange(event.target.value as SortOptionId)
            }
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Sort products on mobile"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-text-secondary text-xs lg:hidden">{countLabel}</p>

      {/* Desktop toolbar row */}
      <div className="hidden flex-col gap-3 lg:flex">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <PlpActiveFilterTags
              activeFilterIds={activeFilterIds}
              filterLabels={filterLabels}
              onRemoveFilter={onRemoveFilter}
            />
            <p className="text-text-secondary shrink-0 text-sm">{countLabel}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-text-secondary text-sm">Sort:</span>
            <div className="relative">
              <select
                id="plp-sort-desktop"
                value={sortBy}
                onChange={(event) =>
                  onSortChange(event.target.value as SortOptionId)
                }
                aria-label="Sort products on desktop"
                className={cn(
                  "border-gray-divider text-text-primary appearance-none rounded-full border bg-white",
                  "min-w-[148px] py-2.5 pr-11 pl-5 text-sm font-medium",
                  "focus-visible:ring-brand-500 focus-visible:ring-2 focus-visible:outline-none",
                )}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="text-text-primary pointer-events-none absolute top-1/2 right-4 -translate-y-1/2" />
            </div>
            <span className="sr-only">Current sort: {activeSortLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M2 14H6M10 8H14M18 16H22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
