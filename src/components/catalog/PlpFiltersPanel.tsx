"use client";

import { cn } from "@/lib/utils/cn";

import { Checkbox } from "@/components/ui/Checkbox";

import type { PlpFilterGroup } from "@/features/catalog/types";

type PlpFiltersPanelProps = {
  groups: readonly PlpFilterGroup[];
  activeFilters: ReadonlySet<string>;
  onToggleFilter: (optionId: string) => void;
  onClearFilters: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export function PlpFiltersPanel({
  groups,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  mobileOpen,
  onMobileOpenChange,
}: Readonly<PlpFiltersPanelProps>) {
  const panelBody = (
    <FilterGroups
      groups={groups}
      activeFilters={activeFilters}
      onToggleFilter={onToggleFilter}
    />
  );

  return (
    <>
      {/* Desktop sidebar — Figma PLP web frame */}
      <aside
        aria-label="Product filters"
        className="hidden w-[220px] shrink-0 lg:block xl:w-[240px]"
      >
        <div className="border-gray-divider sticky top-4 rounded-[12px] border bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-text-primary flex items-center gap-1.5 text-base font-semibold">
              <FunnelIcon />
              Filters
            </h2>
            {activeFilters.size > 0 ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-brand-500 text-xs font-bold uppercase"
              >
                Clear
              </button>
            ) : null}
          </div>
          {panelBody}
        </div>
      </aside>

      {/* mWeb bottom sheet — Figma PLP mWeb frame */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/40"
            onClick={() => onMobileOpenChange(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[16px] bg-white px-4 pt-4 pb-8"
          >
            <div className="bg-gray-divider mx-auto mb-4 h-1 w-10 rounded-full" />
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-text-primary text-lg font-semibold">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => onMobileOpenChange(false)}
                className="text-brand-500 text-sm font-bold"
              >
                Done
              </button>
            </div>
            {panelBody}
            {activeFilters.size > 0 ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="text-brand-500 mt-4 w-full text-center text-sm font-bold"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

type FilterGroupsProps = {
  groups: readonly PlpFilterGroup[];
  activeFilters: ReadonlySet<string>;
  onToggleFilter: (optionId: string) => void;
};

function FilterGroups({
  groups,
  activeFilters,
  onToggleFilter,
}: Readonly<FilterGroupsProps>) {
  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <fieldset key={group.id} className="border-0 p-0">
          <legend className="text-text-primary mb-2 text-sm font-semibold">
            {group.label}
          </legend>
          <ul className="flex flex-col gap-2">
            {group.options.map((option) => {
              const checked = activeFilters.has(option.id);
              const inputId = `plp-filter-${group.id}-${option.id}`;

              return (
                <li key={option.id}>
                  <Checkbox
                    id={inputId}
                    label={
                      <span
                        className={cn(
                          "text-sm",
                          checked ? "text-text-primary" : "text-text-secondary",
                        )}
                      >
                        {option.label}
                      </span>
                    }
                    checked={checked}
                    onChange={() => onToggleFilter(option.id)}
                    className="w-auto"
                  />
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}

function FunnelIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H20M7 12H17M10 18H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
