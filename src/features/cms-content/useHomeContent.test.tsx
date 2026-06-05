import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getHomeContent } from "./home-content-service";
import { useHomeContent } from "./useHomeContent";

import type { HomeContentData } from "./home-content-types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./home-content-service", () => ({
  getHomeContent: vi.fn(),
}));

const mockGet = vi.mocked(getHomeContent);

const DATA: HomeContentData = {
  modules: [
    {
      id: "mod_hero_001",
      type: "hero_carousel",
      order: 1,
      config: {},
      data_ref: { type: "inline", items: [] },
    },
  ],
  version: "v1",
  publishedAt: "2026-05-20T11:00:00Z",
};

const ready = { polygonId: "poly_1", storeId: "blr" };

describe("useHomeContent", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches when polygon + store are present", async () => {
    mockGet.mockResolvedValue(DATA);
    const { result } = renderHook(() => useHomeContent(ready));

    await waitFor(() => expect(result.current.modules).toHaveLength(1));
    expect(result.current.version).toBe("v1");
    expect(result.current.publishedAt).toBe("2026-05-20T11:00:00Z");
    expect(mockGet).toHaveBeenCalledWith(
      expect.objectContaining({ polygonId: "poly_1", storeId: "blr" }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("stays idle until both polygon and store are known", async () => {
    const { rerender } = renderHook(
      (args: { polygonId?: string; storeId?: string }) =>
        useHomeContent(args),
      { initialProps: { polygonId: "poly_1" } as {
          polygonId?: string;
          storeId?: string;
        } },
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();

    mockGet.mockResolvedValue(DATA);
    rerender({ polygonId: "poly_1", storeId: "blr" });
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
  });

  it("does not fetch when disabled", async () => {
    renderHook(() => useHomeContent({ ...ready, enabled: false }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("surfaces a typed error and clears state on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("cms down", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() => useHomeContent(ready));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.modules).toEqual([]);
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(DATA);
    const { result } = renderHook(() => useHomeContent(ready));

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
