import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getContentEntry } from "./content-entry-service";
import { useContentEntry } from "./useContentEntry";

import type { ContentEntry } from "./content-entry-types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./content-entry-service", () => ({
  getContentEntry: vi.fn(),
}));

const mockGet = vi.mocked(getContentEntry);

const ENTRY: ContentEntry = {
  slug: "farm-to-door",
  title: "Farm to Door",
  locale: "en-IN",
};

describe("useContentEntry", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches on mount when contentType + slug are present", async () => {
    mockGet.mockResolvedValue(ENTRY);
    const { result } = renderHook(() =>
      useContentEntry({ contentType: "blog", slug: "farm-to-door" }),
    );

    await waitFor(() => expect(result.current.entry?.title).toBe("Farm to Door"));
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(
      "blog",
      "farm-to-door",
      { locale: undefined },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch when contentType or slug is missing", async () => {
    renderHook(() => useContentEntry({ slug: "farm-to-door" }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("does not fetch when disabled", async () => {
    renderHook(() =>
      useContentEntry({ contentType: "blog", slug: "x", enabled: false }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("flags notFound on a 404", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );
    const { result } = renderHook(() =>
      useContentEntry({ contentType: "blog", slug: "missing" }),
    );

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.notFound).toBe(true);
    expect(result.current.entry).toBeNull();
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(ENTRY);
    const { result } = renderHook(() =>
      useContentEntry({ contentType: "blog", slug: "x" }),
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
