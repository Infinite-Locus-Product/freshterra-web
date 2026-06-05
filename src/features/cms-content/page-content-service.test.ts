import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPage } from "./page-content-service";

function pageResponse(data: unknown): Response {
  return new Response(JSON.stringify({ success: true, data, error: null }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function errorResponse(status: number, code: string | null): Response {
  return new Response(
    JSON.stringify({
      success: false,
      data: null,
      error: code ? { code } : null,
    }),
    { status, headers: { "content-type": "application/json" } },
  );
}

function lastUrl(fetchSpy: ReturnType<typeof vi.fn>): URL {
  const [url] = fetchSpy.mock.calls.at(-1) as unknown as [string];
  return new URL(url);
}

const aboutPage = {
  slug: "about",
  title: "About FreshTerra",
  locale: "en-IN",
  blocks: [{ type: "richText", html: "<p>Farm-to-door in 35 minutes.</p>" }],
  publishedAt: "2026-05-20T11:00:00Z",
};

describe("getPage", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetches a page and parses blocks + default locale", async () => {
    const fetchSpy = vi.fn(async () => pageResponse(aboutPage));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getPage("about");
    expect(data.title).toBe("About FreshTerra");
    expect(data.blocks[0]?.type).toBe("richText");
    expect(data.blocks[0]?.html).toContain("Farm-to-door");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/content/pages/about");
    expect(url.searchParams.get("locale")).toBe("en-IN");
  });

  it("keeps slashes for nested slugs (encoding each segment)", async () => {
    const fetchSpy = vi.fn(async () =>
      pageResponse({ ...aboutPage, slug: "policies/refund" }),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getPage("policies/refund", { locale: "hi-IN" });

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/content/pages/policies/refund");
    expect(url.searchParams.get("locale")).toBe("hi-IN");
  });

  it("strips leading/trailing slashes from the slug", async () => {
    const fetchSpy = vi.fn(async () => pageResponse(aboutPage));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getPage("/blog/farm-story/");
    expect(lastUrl(fetchSpy).pathname).toBe(
      "/api/v1/content/pages/blog/farm-story",
    );
  });

  it("preserves unknown block fields/types", async () => {
    const fetchSpy = vi.fn(async () =>
      pageResponse({
        ...aboutPage,
        blocks: [
          { type: "hero", image: "https://cdn/x.jpg", caption: "Hi" },
          { type: "richText", html: "<p>ok</p>" },
        ],
      }),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getPage("about");
    expect(data.blocks[0]?.type).toBe("hero");
    expect((data.blocks[0] as Record<string, unknown>).image).toBe(
      "https://cdn/x.jpg",
    );
  });

  it("rejects an empty slug before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(getPage("  ")).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("maps 403 → FORBIDDEN and 404 → NOT_FOUND", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(403, "FORBIDDEN"),
    ) as unknown as typeof fetch;
    await expect(getPage("about")).rejects.toMatchObject({ code: "FORBIDDEN" });

    globalThis.fetch = vi.fn(async () =>
      errorResponse(404, "NOT_FOUND"),
    ) as unknown as typeof fetch;
    await expect(getPage("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;
    await expect(getPage("about")).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });
});
