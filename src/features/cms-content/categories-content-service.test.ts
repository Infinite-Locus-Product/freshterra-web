import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getCategoriesContent } from "./categories-content-service";

function categoriesResponse(data: unknown): Response {
  return new Response(
    JSON.stringify({ success: true, data, error: null }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

function resolveFetchUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [input] = fetchSpy.mock.calls.at(-1) as unknown as [unknown];
  const href = resolveFetchUrl(input);
  return href.startsWith("http")
    ? new URL(href)
    : new URL(href, "https://api.freshterra.in");
}

describe("getCategoriesContent", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetches GET /api/v1/content/single/categories", async () => {
    const fetchSpy = vi.fn(async () =>
      categoriesResponse({
        categories: [
          { name: "Chocolates", slug: "chocolates" },
          { name: "Snacks and Munchies", slug: "snacks-and-munchies" },
        ],
      }),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getCategoriesContent();
    expect(data.categories).toHaveLength(2);
    expect(data.categories[0]?.slug).toBe("chocolates");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/content/single/categories");
    expect(url.searchParams.get("locale")).toBe("en-IN");
  });
});
