import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getTrendingTerms } from "./trending-service";
import { useTrendingTerms } from "./useTrendingTerms";

import type { TrendingTerm } from "./types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./trending-service", () => ({
  getTrendingTerms: vi.fn(),
}));

const mockGet = vi.mocked(getTrendingTerms);

const TERMS: TrendingTerm[] = [
  { term: "mango", rank: 1 },
  { term: "onion", rank: 2 },
];

describe("useTrendingTerms", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches terms on mount", async () => {
    mockGet.mockResolvedValue(TERMS);
    const { result } = renderHook(() => useTrendingTerms());

    await waitFor(() => expect(result.current.terms).toEqual(TERMS));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(
      { polygonId: undefined, limit: undefined },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch when disabled", async () => {
    mockGet.mockResolvedValue(TERMS);
    const { result } = renderHook(() => useTrendingTerms({ enabled: false }));

    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
    expect(result.current.terms).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("re-fetches when polygonId changes", async () => {
    mockGet.mockResolvedValue(TERMS);
    const { rerender } = renderHook(
      ({ p }: { p?: string }) => useTrendingTerms({ polygonId: p }),
      { initialProps: { p: "poly_1" } },
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));

    rerender({ p: "poly_2" });

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
    expect(mockGet).toHaveBeenLastCalledWith(
      expect.objectContaining({ polygonId: "poly_2" }),
      expect.anything(),
    );
  });

  it("surfaces a typed error and clears terms on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("circuit open", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() => useTrendingTerms());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.terms).toEqual([]);
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(TERMS);
    const { result } = renderHook(() => useTrendingTerms());

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));

    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
