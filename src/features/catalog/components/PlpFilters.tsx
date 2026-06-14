"use client";

import { cn } from "@/lib/utils/cn";

import {
  categoryPlpClearTextClass,
  categoryPlpFiltersGroupsClass,
  categoryPlpFiltersPanelGroupClass,
  categoryPlpFiltersPanelShellClass,
  categoryPlpFiltersSidebarGroupClass,
  categoryPlpFiltersSidebarShellClass,
  categoryPlpFiltersTitleClass,
  categoryPlpFilterCheckboxBoxClass,
  categoryPlpFilterCheckboxCheckClass,
  categoryPlpFilterCheckboxInputClass,
  categoryPlpFilterOptionLabelClass,
  categoryPlpFilterOptionRowClass,
} from "@/components/category/category-plp-page";

export type PlpFilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type PlpFilterGroup = {
  key: string;
  label: string;
  options: PlpFilterOption[];
};

/** Selected facet values keyed by group, e.g. `{ tags: ["organic"] }`. */
export type FilterSelections = Record<string, string[]>;

type PlpFiltersProps = {
  groups?: PlpFilterGroup[];
  selections: FilterSelections;
  onChange: (next: FilterSelections) => void;
  /** Web sidebar: borderless with dividers between groups. mWeb panel: bordered card. */
  variant?: "panel" | "sidebar";
};

export function PlpFilters({
  groups,
  selections,
  onChange,
  variant = "panel",
}: Readonly<PlpFiltersProps>) {
  const resolvedGroups = groups ?? [];
  const hasAny = Object.values(selections).some((vals) => vals.length > 0);

  if (resolvedGroups.length === 0) {
    return null;
  }

  function toggle(group: string, value: string) {
    const current = selections[group] ?? [];
    const nextValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const next: FilterSelections = { ...selections, [group]: nextValues };
    if (nextValues.length === 0) delete next[group];
    onChange(next);
  }

  const shellClass =
    variant === "sidebar"
      ? categoryPlpFiltersSidebarShellClass
      : categoryPlpFiltersPanelShellClass;
  const groupClass =
    variant === "sidebar"
      ? categoryPlpFiltersSidebarGroupClass
      : categoryPlpFiltersPanelGroupClass;

  return (
    <div className={shellClass}>
      <div className="mb-4 flex items-center justify-between">
        <span className={categoryPlpFiltersTitleClass}>
          <FilterIcon />
          Filters
        </span>
        <button
          type="button"
          onClick={() => onChange({})}
          disabled={!hasAny}
          className={cn(categoryPlpClearTextClass, "disabled:opacity-40")}
        >
          Clear
        </button>
      </div>

      <div className={categoryPlpFiltersGroupsClass}>
        {resolvedGroups.map((group) => (
          <fieldset key={group.key} className={groupClass}>
            <legend className="text-text-primary mb-2 text-sm font-semibold">
              {group.label}
            </legend>
            <div className="space-y-2.5">
              {group.options.map((option) => {
                const checked = (selections[group.key] ?? []).includes(
                  option.value,
                );
                return (
                  <label
                    key={option.value}
                    className={categoryPlpFilterOptionRowClass}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(group.key, option.value)}
                      className={categoryPlpFilterCheckboxInputClass}
                    />
                    <span
                      className={categoryPlpFilterCheckboxBoxClass}
                      aria-hidden
                    >
                      {checked ? <FilterCheckboxCheck /> : null}
                    </span>
                    <span className={categoryPlpFilterOptionLabelClass}>
                      {option.label}
                    </span>
                    {typeof option.count === "number" ? (
                      <span className="text-text-tertiary text-xs">
                        {option.count}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function FilterCheckboxCheck() {
  return (
    <svg
      viewBox="0 0 12 12"
      className={categoryPlpFilterCheckboxCheckClass}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 6 5 8.5 9.5 3.5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={18}
      height={18}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4h12M4 8h8M6.5 12h3" />
    </svg>
  );
}

export default PlpFilters;
