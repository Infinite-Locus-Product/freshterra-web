import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useWebCategoryPage } from "./useWebCategoryPage";

vi.mock("./web-category-page-service", () => ({
  getWebCategoryPage: vi.fn(),
}));

const { getWebCategoryPage } = await import("./web-category-page-service");
const mockGet = vi.mocked(getWebCategoryPage);

describe("useWebCategoryPage", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches web-category-page on mount", async () => {
    mockGet.mockResolvedValue({
      sections: [],
    });

    const { result } = renderHook(() => useWebCategoryPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result.current.page).toEqual({ sections: [] });
    expect(result.current.error).toBeNull();
  });

  it("sets notFound when the BFF returns 404", async () => {
    const { FreshTerraApiError } = await import("@/lib/clients/freshterra-api");
    mockGet.mockRejectedValue(
      new FreshTerraApiError("content not found", "NOT_FOUND", 404),
    );

    const { result } = renderHook(() => useWebCategoryPage());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.notFound).toBe(true);
    expect(result.current.page).toBeNull();
  });
});
