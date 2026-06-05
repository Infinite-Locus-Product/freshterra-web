import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getAutocompleteSuggestions } from "./autocomplete-service";
import { useAutocompleteSearch } from "./useAutocompleteSearch";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./autocomplete-service", () => ({
  getAutocompleteSuggestions: vi.fn(),
}));

const mockGet = vi.mocked(getAutocompleteSuggestions);

describe("useAutocompleteSearch", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debounces, then fetches and exposes suggestions", async () => {
    mockGet.mockResolvedValue([{ term: "tomato", type: "query" }]);
    const { result } = renderHook(() => useAutocompleteSearch());

    act(() => result.current.search("tom"));

    // loading flips on immediately, but the request hasn't fired yet (debounce).
    expect(result.current.loading).toBe(true);
    expect(mockGet).not.toHaveBeenCalled();

    await waitFor(() =>
      expect(result.current.suggestions).toEqual([
        { term: "tomato", type: "query" },
      ]),
    );
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      "tom",
      undefined,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("does not fetch for an empty / whitespace query", async () => {
    const { result } = renderHook(() => useAutocompleteSearch());

    act(() => result.current.search("   "));

    await new Promise((r) => setTimeout(r, 350));
    expect(mockGet).not.toHaveBeenCalled();
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("clears suggestions when the query is emptied", async () => {
    mockGet.mockResolvedValue([{ term: "tomato", type: "query" }]);
    const { result } = renderHook(() => useAutocompleteSearch());

    act(() => result.current.search("tom"));
    await waitFor(() => expect(result.current.suggestions).toHaveLength(1));

    act(() => result.current.search(""));
    await waitFor(() => expect(result.current.suggestions).toEqual([]));
  });

  it("only fetches the latest query when typing quickly", async () => {
    mockGet.mockResolvedValue([{ term: "tomato", type: "query" }]);
    const { result } = renderHook(() => useAutocompleteSearch());

    act(() => result.current.search("t"));
    act(() => result.current.search("to"));
    act(() => result.current.search("tom"));

    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("tom", undefined, expect.anything());
  });

  it("surfaces a typed error and clears suggestions on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("rate limited", "RATE_LIMITED", 429),
    );
    const { result } = renderHook(() => useAutocompleteSearch());

    act(() => result.current.search("tom"));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("RATE_LIMITED");
    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("forwards a custom limit to the service", async () => {
    mockGet.mockResolvedValue([]);
    const { result } = renderHook(() => useAutocompleteSearch(5));

    act(() => result.current.search("tom"));

    await waitFor(() => expect(mockGet).toHaveBeenCalled());
    expect(mockGet).toHaveBeenCalledWith("tom", 5, expect.anything());
  });
});
