import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getSingleContent } from "./single-content-service";
import { useSingleContent } from "./useSingleContent";

import type { ContentEntry } from "./content-entry-types";

vi.mock("./single-content-service", () => ({
  getSingleContent: vi.fn(),
}));

const mockGet = vi.mocked(getSingleContent);

const ENTRY: ContentEntry = {
  title: "Categories",
  locale: "en-IN",
};

describe("useSingleContent", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches on mount when contentType is present", async () => {
    mockGet.mockResolvedValue(ENTRY);
    const { result } = renderHook(() =>
      useSingleContent({ contentType: "categories" }),
    );

    await waitFor(() =>
      expect(result.current.content?.title).toBe("Categories"),
    );
    expect(result.current.error).toBeNull();
    expect(mockGet).toHaveBeenCalledWith(
      "categories",
      { locale: undefined },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch when contentType is missing", async () => {
    renderHook(() => useSingleContent({}));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("does not fetch when disabled", async () => {
    renderHook(() =>
      useSingleContent({ contentType: "categories", enabled: false }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("flags notFound on a 404", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );
    const { result } = renderHook(() =>
      useSingleContent({ contentType: "categories" }),
    );

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.notFound).toBe(true);
    expect(result.current.content).toBeNull();
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(ENTRY);
    const { result } = renderHook(() =>
      useSingleContent({ contentType: "categories" }),
    );
    await waitFor(() => expect(result.current.content).not.toBeNull());

    mockGet.mockClear();
    await act(async () => {
      result.current.reload();
    });
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
