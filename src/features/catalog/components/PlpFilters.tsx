"use client";

import { cn } from "@/lib/utils/cn";

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
};

export function PlpFilters({ groups, selections, onChange }: PlpFiltersProps) {
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-text-primary flex items-center gap-2 font-semibold">
          <FilterIcon />
          Filters
        </span>
        <button
          type="button"
          onClick={() => onChange({})}
          disabled={!hasAny}
          className="text-brand-500 text-sm underline underline-offset-2 disabled:opacity-40"
        >
          Clear
        </button>
      </div>

      <div className="space-y-5">
        {resolvedGroups.map((group) => (
          <fieldset
            key={group.key}
            className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0"
          >
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
                    className="text-text-secondary flex cursor-pointer items-center gap-2.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(group.key, option.value)}
                      className={cn(
                        "text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300",
                      )}
                    />
                    <span className="flex-1">{option.label}</span>
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

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
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
