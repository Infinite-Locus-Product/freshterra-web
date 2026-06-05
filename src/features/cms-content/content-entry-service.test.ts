import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { getContentEntry } from "./content-entry-service";

const entry = {
  slug: "farm-to-door",
  title: "Farm to Door in 35 minutes",
  locale: "en-IN",
  publishedAt: "2026-05-20T11:00:00Z",
  excerpt: "How we deliver fresh.",
  author: "FreshTerra",
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

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [url] = fetchSpy.mock.calls.at(-1) as unknown as [string];
  return new URL(url);
}

describe("getContentEntry", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests /content/:contentType/:slug with default locale", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getContentEntry("blog", "farm-to-door");
    expect(data.title).toBe("Farm to Door in 35 minutes");
    // Unknown keys are preserved by the permissive base schema.
    expect(data.excerpt).toBe("How we deliver fresh.");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/content/blog/farm-to-door");
    expect(url.searchParams.get("locale")).toBe("en-IN");
  });

  it("forwards a custom locale", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getContentEntry("faq", "returns", { locale: "hi-IN" });
    expect(lastUrl(fetchSpy).searchParams.get("locale")).toBe("hi-IN");
  });

  it("encodes nested slugs segment-by-segment, preserving slashes", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getContentEntry("blog", "guides/farm to door");
    expect(lastUrl(fetchSpy).pathname).toBe(
      "/api/v1/content/blog/guides/farm%20to%20door",
    );
  });

  it("validates against a caller-supplied strict schema", async () => {
    globalThis.fetch = vi.fn(async () =>
      entryResponse({ slug: "x", title: "T", views: 42 }),
    ) as unknown as typeof fetch;

    const schema = z.object({ slug: z.string(), title: z.string(), views: z.number() });
    const data = await getContentEntry("blog", "x", {}, { schema });
    expect(data.views).toBe(42);
  });

  it("rejects an empty content type before calling out", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getContentEntry("  ", "slug")).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps 404 → NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "NOT_FOUND"),
    ) as unknown as typeof fetch;
    await expect(getContentEntry("blog", "missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;
    await expect(getContentEntry("blog", "x")).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });
});
