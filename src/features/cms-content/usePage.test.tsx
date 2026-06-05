import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getPage } from "./page-content-service";
import { usePage } from "./usePage";

import type { PageContent } from "./page-content-types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./page-content-service", () => ({
  getPage: vi.fn(),
}));

const mockGet = vi.mocked(getPage);

const PAGE: PageContent = {
  slug: "about",
  title: "About FreshTerra",
  locale: "en-IN",
  blocks: [{ type: "richText", html: "<p>Hi</p>" }],
  publishedAt: "2026-05-20T11:00:00Z",
};

describe("usePage", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches the page on mount", async () => {
    mockGet.mockResolvedValue(PAGE);
    const { result } = renderHook(() =>
      usePage({ slug: "about", locale: "en-IN" }),
    );

    await waitFor(() => expect(result.current.page?.title).toBe(
      "About FreshTerra",
    ));
    expect(mockGet).toHaveBeenCalledWith(
      "about",
      { locale: "en-IN" },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch without a slug", async () => {
    renderHook(() => usePage({}));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("flags notFound on a 404", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("missing", "NOT_FOUND", 404),
    );
    const { result } = renderHook(() => usePage({ slug: "nope" }));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.notFound).toBe(true);
    expect(result.current.page).toBeNull();
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(PAGE);
    const { result } = renderHook(() => usePage({ slug: "about" }));

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
