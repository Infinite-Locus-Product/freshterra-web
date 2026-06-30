import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { getSingleContent } from "./single-content-service";

const entry = {
  title: "Categories",
  subtitle: "Explore our entire selection",
  categories: [
    { name: "Chocolates", slug: "chocolates" },
    { name: "Snacks and Munchies", slug: "snacks-and-munchies" },
  ],
};

function entryResponse(data: unknown = entry): Response {
  return new Response(JSON.stringify({ success: true, data, error: null }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function errorResponse(status: number, code: string | null): Response {
  return new Response(
    JSON.stringify({ success: false, data: null, error: code ? { code } : null }),
    { status, headers: { "content-type": "application/json" } },
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

describe("getSingleContent", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/:contentType with default locale", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getSingleContent("categories");
    expect(data.title).toBe("Categories");
    expect(
      (data as { categories: unknown[] }).categories,
    ).toHaveLength(2);

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/content/single/categories");
    expect(url.searchParams.get("locale")).toBe("en-IN");
  });

  it("forwards a custom locale", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getSingleContent("categories", { locale: "hi-IN" });
    expect(lastUrl(fetchSpy).searchParams.get("locale")).toBe("hi-IN");
  });

  it("validates against a caller-supplied strict schema", async () => {
    globalThis.fetch = vi.fn(async () =>
      entryResponse({ title: "T", categories: [] }),
    ) as unknown as typeof fetch;

    const schema = z.object({
      title: z.string(),
      categories: z.array(z.object({ name: z.string(), slug: z.string() })),
    });
    const data = await getSingleContent("categories", {}, { schema });
    expect(data.categories).toEqual([]);
  });

  it("rejects an empty content type before calling out", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getSingleContent("  ")).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps 404 → NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "NOT_FOUND"),
    ) as unknown as typeof fetch;
    await expect(getSingleContent("categories")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
