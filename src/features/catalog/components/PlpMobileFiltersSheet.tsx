"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

import {
  plpMobileFiltersSheetApplyButtonClass,
  plpMobileFiltersSheetBackdropClass,
  plpMobileFiltersSheetBodyClass,
  plpMobileFiltersSheetCategoriesClass,
  plpMobileFiltersSheetCategoryActiveClass,
  plpMobileFiltersSheetCategoryButtonClass,
  plpMobileFiltersSheetCheckboxBoxClass,
  plpMobileFiltersSheetChipClass,
  plpMobileFiltersSheetChipsRowClass,
  plpMobileFiltersSheetClearButtonClass,
  plpMobileFiltersSheetFooterButtonClass,
  plpMobileFiltersSheetFooterClass,
  plpMobileFiltersSheetHandleClass,
  plpMobileFiltersSheetOptionLabelClass,
  plpMobileFiltersSheetOptionsClass,
  plpMobileFiltersSheetOptionsListClass,
  plpMobileFiltersSheetPanelClass,
  plpMobileFiltersSheetSearchInputClass,
  plpMobileFiltersSheetSearchWrapClass,
  plpMobileFiltersSheetTitleClass,
} from "@/components/category/category-plp-filters-sheet";
import { categoryPlpFilterCheckboxInputClass } from "@/components/category/category-plp-page";

import type { FilterSelections, PlpFilterGroup } from "./PlpFilters";

type PlpMobileFiltersSheetProps = {
  open: boolean;
  groups: PlpFilterGroup[];
  selections: FilterSelections;
  onClose: () => void;
  onApply: (next: FilterSelections) => void;
};

type DraftChip = { group: string; value: string; label: string };

function buildChips(
  draft: FilterSelections,
  groups: PlpFilterGroup[],
): DraftChip[] {
  const chips: DraftChip[] = [];
  for (const [groupKey, values] of Object.entries(draft)) {
    const group = groups.find((item) => item.key === groupKey);
    for (const value of values) {
      chips.push({
        group: groupKey,
        value,
        label:
          group?.options.find((option) => option.value === value)?.label ??
          value,
      });
    }
  }
  return chips;
}

export function PlpMobileFiltersSheet({
  open,
  groups,
  selections,
  onClose,
  onApply,
}: Readonly<PlpMobileFiltersSheetProps>) {
  const [draft, setDraft] = useState<FilterSelections>(selections);
  const [activeGroupKey, setActiveGroupKey] = useState(groups[0]?.key ?? "");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    setDraft(selections);
    setQuery("");
    setActiveGroupKey(groups[0]?.key ?? "");
  }, [open, selections, groups]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!groups.some((group) => group.key === activeGroupKey)) {
      setActiveGroupKey(groups[0]?.key ?? "");
    }
  }, [activeGroupKey, groups]);

  const activeGroup = groups.find((group) => group.key === activeGroupKey);
  const chips = useMemo(() => buildChips(draft, groups), [draft, groups]);

  const visibleOptions = useMemo(() => {
    if (!activeGroup) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return activeGroup.options;
    return activeGroup.options.filter((option) =>
      option.label.toLowerCase().includes(normalized),
    );
  }, [activeGroup, query]);

  if (!open || groups.length === 0) return null;

  function toggle(groupKey: string, value: string) {
    setDraft((current) => {
      const selected = current[groupKey] ?? [];
      const nextValues = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      const next: FilterSelections = { ...current, [groupKey]: nextValues };
      if (nextValues.length === 0) delete next[groupKey];
      return next;
    });
  }

  function removeChip(chip: DraftChip) {
    setDraft((current) => {
      const selected = current[chip.group] ?? [];
      const nextValues = selected.filter((value) => value !== chip.value);
      const next: FilterSelections = { ...current, [chip.group]: nextValues };
      if (nextValues.length === 0) delete next[chip.group];
      return next;
    });
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
      <button
        type="button"
        aria-label="Close filters"
        className={plpMobileFiltersSheetBackdropClass}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={plpMobileFiltersSheetPanelClass}
      >
        <div className={plpMobileFiltersSheetHandleClass} aria-hidden />

        <h2 className={plpMobileFiltersSheetTitleClass}>Filters</h2>

        <div className={plpMobileFiltersSheetSearchWrapClass}>
          <label className="relative block">
            <span className="sr-only">Search across the filters</span>
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search across the filters..."
              className={plpMobileFiltersSheetSearchInputClass}
            />
          </label>
        </div>

        {chips.length > 0 ? (
          <div className={plpMobileFiltersSheetChipsRowClass}>
            {chips.map((chip) => (
              <button
                key={`${chip.group}:${chip.value}`}
                type="button"
                onClick={() => removeChip(chip)}
                className={plpMobileFiltersSheetChipClass}
              >
                <span aria-hidden>✕</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div className={plpMobileFiltersSheetBodyClass}>
          <div className={plpMobileFiltersSheetCategoriesClass}>
            {groups.map((group) => {
              const isActive = group.key === activeGroupKey;
              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => {
                    setActiveGroupKey(group.key);
                    setQuery("");
                  }}
                  className={cn(
                    plpMobileFiltersSheetCategoryButtonClass,
                    isActive && plpMobileFiltersSheetCategoryActiveClass,
                  )}
                >
                  {group.label}
                </button>
              );
            })}
          </div>

          <div className={plpMobileFiltersSheetOptionsClass}>
            <div
              role="group"
              aria-label={activeGroup?.label}
              className={plpMobileFiltersSheetOptionsListClass}
            >
              {visibleOptions.map((option) => {
                const checked = (draft[activeGroupKey] ?? []).includes(
                  option.value,
                );
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(activeGroupKey, option.value)}
                      className={categoryPlpFilterCheckboxInputClass}
                    />
                    <span
                      className={plpMobileFiltersSheetCheckboxBoxClass}
                      aria-hidden
                    >
                      {checked ? <CheckboxCheck /> : null}
                    </span>
                    <span className={plpMobileFiltersSheetOptionLabelClass}>
                      {option.label}
                      {typeof option.count === "number"
                        ? ` (${option.count})`
                        : ""}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className={plpMobileFiltersSheetFooterClass}>
          <button
            type="button"
            className={cn(
              plpMobileFiltersSheetFooterButtonClass,
              plpMobileFiltersSheetClearButtonClass,
            )}
            onClick={() => setDraft({})}
          >
            Clear All
          </button>
          <button
            type="button"
            className={cn(
              plpMobileFiltersSheetFooterButtonClass,
              plpMobileFiltersSheetApplyButtonClass,
            )}
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckboxCheck() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3"
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

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={18}
      height={18}
      aria-hidden
      className="text-text-tertiary pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13.5 13.5 17 17" />
    </svg>
  );
}

export default PlpMobileFiltersSheet;
