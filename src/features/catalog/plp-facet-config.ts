/** BFF facets hidden from PLP filters (FRES-2399). */
export const HIDDEN_PLP_FACET_KEYS: ReadonlySet<string> = new Set([
  "bestseller",
  "exclusive",
  "qty",
]);

/** `Object.entries(facets)` minus the hidden filter groups, order preserved. */
export function visiblePlpFacetEntries<T>(
  facets: Record<string, T>,
): [string, T][] {
  return Object.entries(facets).filter(
    ([key]) => !HIDDEN_PLP_FACET_KEYS.has(key.trim().toLowerCase()),
  );
}
