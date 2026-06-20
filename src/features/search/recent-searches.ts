/** Max recent searches shown in the search dropdown (newest first). */
export const MAX_RECENT_SEARCHES = 3;

const STORAGE_KEY = "ft_recent_searches";
export const RECENT_SEARCHES_UPDATED_EVENT = "ft-recent-searches-updated";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Trims and collapses whitespace; returns null when empty. */
export function normalizeSearchTerm(term: string): string | null {
  const normalized = term.trim().replace(/\s+/g, " ");
  return normalized.length > 0 ? normalized : null;
}

/** Reads persisted recent searches (newest first). */
export function readRecentSearches(): string[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const terms: string[] = [];
    for (const entry of parsed) {
      if (typeof entry !== "string") continue;
      const normalized = normalizeSearchTerm(entry);
      if (!normalized) continue;
      if (terms.some((t) => t.toLowerCase() === normalized.toLowerCase())) {
        continue;
      }
      terms.push(normalized);
      if (terms.length >= MAX_RECENT_SEARCHES) break;
    }
    return terms;
  } catch {
    return [];
  }
}

function writeRecentSearches(terms: string[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
  window.dispatchEvent(new CustomEvent(RECENT_SEARCHES_UPDATED_EVENT));
}

/**
 * Adds a search term to the rolling recent list (deduped, newest first).
 * Returns the updated list.
 */
export function addRecentSearch(term: string): string[] {
  const normalized = normalizeSearchTerm(term);
  if (!normalized) return readRecentSearches();

  const next = [
    normalized,
    ...readRecentSearches().filter(
      (existing) => existing.toLowerCase() !== normalized.toLowerCase(),
    ),
  ].slice(0, MAX_RECENT_SEARCHES);

  writeRecentSearches(next);
  return next;
}

/** Removes one term from recent searches. */
export function removeRecentSearch(term: string): string[] {
  const normalized = normalizeSearchTerm(term);
  if (!normalized) return readRecentSearches();

  const next = readRecentSearches().filter(
    (existing) => existing.toLowerCase() !== normalized.toLowerCase(),
  );
  writeRecentSearches(next);
  return next;
}

/** Clears all persisted recent searches. */
export function clearRecentSearches(): void {
  writeRecentSearches([]);
}
