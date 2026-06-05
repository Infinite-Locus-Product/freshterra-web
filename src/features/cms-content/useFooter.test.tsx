import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { getFooter } from "./footer-content-service";
import { useFooter } from "./useFooter";

import type { FooterContent } from "./footer-content-types";

// `vi.mock` is hoisted above the imports, so the service is mocked before use.
vi.mock("./footer-content-service", () => ({
  getFooter: vi.fn(),
}));

const mockGet = vi.mocked(getFooter);

const FOOTER: FooterContent = {
  groups: [{ title: "Company", links: [{ label: "About", url: "/about" }] }],
  social: [{ platform: "instagram", url: "https://instagram.com/freshterra" }],
  legal: [{ label: "Privacy", url: "/privacy" }],
};

describe("useFooter", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches footer on mount", async () => {
    mockGet.mockResolvedValue(FOOTER);
    const { result } = renderHook(() => useFooter());

    await waitFor(() => expect(result.current.footer?.groups).toHaveLength(1));
    expect(result.current.error).toBeNull();
  });

  it("does not fetch when disabled", async () => {
    renderHook(() => useFooter({ enabled: false }));
    await new Promise((r) => setTimeout(r, 0));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("surfaces a typed error and clears footer on failure", async () => {
    mockGet.mockRejectedValue(
      new FreshTerraApiError("cms down", "UPSTREAM_UNAVAILABLE", 502),
    );
    const { result } = renderHook(() => useFooter());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.code).toBe("UPSTREAM_UNAVAILABLE");
    expect(result.current.footer).toBeNull();
  });

  it("reload re-fetches on demand", async () => {
    mockGet.mockResolvedValue(FOOTER);
    const { result } = renderHook(() => useFooter());

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    act(() => result.current.reload());
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(2));
  });
});
