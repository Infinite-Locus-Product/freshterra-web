import { afterEach, describe, expect, it } from "vitest";

import {
  addRecentSearch,
  clearRecentSearches,
  normalizeSearchTerm,
  readRecentSearches,
  removeRecentSearch,
} from "./recent-searches";

describe("recent-searches", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("normalizes whitespace and rejects empty terms", () => {
    expect(normalizeSearchTerm("  mango  ")).toBe("mango");
    expect(normalizeSearchTerm("   ")).toBeNull();
  });

  it("stores searches newest-first with dedupe", () => {
    addRecentSearch("mango");
    addRecentSearch("onion");
    addRecentSearch("mango");

    expect(readRecentSearches()).toEqual(["mango", "onion"]);
  });

  it("caps the list at three entries", () => {
    for (let i = 1; i <= 5; i += 1) {
      addRecentSearch(`term-${i}`);
    }

    expect(readRecentSearches()).toHaveLength(3);
    expect(readRecentSearches()[0]).toBe("term-5");
  });

  it("removes a single recent search", () => {
    addRecentSearch("mango");
    addRecentSearch("onion");
    removeRecentSearch("mango");

    expect(readRecentSearches()).toEqual(["onion"]);
  });

  it("clears all recent searches", () => {
    addRecentSearch("mango");
    clearRecentSearches();
    expect(readRecentSearches()).toEqual([]);
  });
});
