import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getBanners } from "./banners-service";
import { useBanners } from "./useBanners";

import type { Banner } from "./banners-types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./banners-service", () => ({
  getBanners: vi.fn(),
}));

const mockGet = vi.mocked(getBanners);

const BANNERS: Banner[] = [
  { id: "ban_1", image: "https://cdn/1.jpg", ctaUrl: "/c/seasonal", rank: 1 },
];

describe("useBanners", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches banners on mount", async () => {
    mockGet.mockResolvedValue(BANNERS);
    const { result } = renderHook(() => useBanners({ polygonId: "poly_1" }));

    await waitFor(() => expect(result.current.banners).toHaveLength(1));
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(
      { polygonId: "poly_1", channel: undefined, locale: undefined },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch when disabled", async () => {
    renderHook(() => useBanners({ enabled: false }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("re-fetches when channel changes", async () => {
    mockGet.mockResolvedValue(BANNERS);
    const initialProps: { channel: "web" | "mobile" } = { channel: "web" };
    const { rerender } = renderHook(
      ({ channel }: { channel: "web" | "mobile" }) => useBanners({ channel }),
      { initialProps },
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    rerender({ channel: "mobile" });
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });

  it("surfaces a typed error and clears banners on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("cms down", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() => useBanners());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.banners).toEqual([]);
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(BANNERS);
    const { result } = renderHook(() => useBanners());

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
