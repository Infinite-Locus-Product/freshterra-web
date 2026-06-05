import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getAutocompleteSuggestions } from "./autocomplete-service";

function autocompleteResponse(suggestions: unknown[]): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: { suggestions },
      error: null,
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

describe("getAutocompleteSuggestions", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns the suggestions array on success", async () => {
    const suggestions = [
      { term: "tomato", type: "query" },
      { term: "Heirloom Tomatoes", type: "product", productId: "prd_01HX9" },
    ];
    globalThis.fetch = vi.fn(async () =>
      autocompleteResponse(suggestions),
    ) as unknown as typeof fetch;

    const result = await getAutocompleteSuggestions("tom");
    expect(result).toEqual(suggestions);
  });

  it("calls the autocomplete endpoint with q and default limit", async () => {
    const fetchSpy = vi.fn(async () => autocompleteResponse([]));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getAutocompleteSuggestions("tomato");

    const [url] = fetchSpy.mock.calls[0] as unknown as [string];
    expect(url).toContain("/api/v1/search/autocomplete");
    expect(url).toContain("q=tomato");
    expect(url).toContain("limit=8");
  });

  it("forwards a custom limit", async () => {
    const fetchSpy = vi.fn(async () => autocompleteResponse([]));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getAutocompleteSuggestions("tomato", 3);

    const [url] = fetchSpy.mock.calls[0] as unknown as [string];
    expect(url).toContain("limit=3");
  });

  it("trims the query and rejects an empty one before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getAutocompleteSuggestions("   ")).rejects.toBeInstanceOf(
      Error,
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("propagates a typed RATE_LIMITED error", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ success: false, data: null, error: null }),
          { status: 429, headers: { "content-type": "application/json" } },
        ),
    ) as unknown as typeof fetch;

    await expect(getAutocompleteSuggestions("tom")).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
  });

  it("passes the abort signal through to fetch", async () => {
    const fetchSpy = vi.fn(async () => autocompleteResponse([]));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;
    const controller = new AbortController();

    await getAutocompleteSuggestions("tom", 8, { signal: controller.signal });

    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.signal).toBe(controller.signal);
  });
});
