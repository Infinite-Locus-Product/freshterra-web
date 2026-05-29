"use client";

type PlpActiveFilterTagsProps = {
  activeFilterIds: readonly string[];
  filterLabels: Readonly<Record<string, string>>;
  onRemoveFilter: (filterId: string) => void;
};

export function PlpActiveFilterTags({
  activeFilterIds,
  filterLabels,
  onRemoveFilter,
}: Readonly<PlpActiveFilterTagsProps>) {
  if (activeFilterIds.length === 0) {
    return null;
  }

  return (
    <ul
      className="flex flex-wrap items-center gap-2"
      aria-label="Active filters"
    >
      {activeFilterIds.map((filterId) => (
        <li key={filterId}>
          <button
            type="button"
            onClick={() => onRemoveFilter(filterId)}
            className="border-gray-divider text-text-secondary hover:border-brand-300 inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs font-medium transition-colors"
            aria-label={`Remove ${filterLabels[filterId] ?? filterId} filter`}
          >
            <span>{filterLabels[filterId] ?? filterId}</span>
            <span aria-hidden className="text-text-secondary/80">
              ×
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
