import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getWebCategoryPage } from "./web-category-page-service";

function pageResponse(data: unknown): Response {
  return new Response(JSON.stringify({ success: true, data, error: null }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
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

describe("getWebCategoryPage", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/web-category-page", async () => {
    const fetchSpy = vi.fn(async () =>
      pageResponse({
        category_hero_section: {
          title: "Five Star Quality @ WOW Prices",
          is_active: true,
        },
        l2_category: [
          {
            saleor_l2_category_id: "Q2F0ZWdvcnk6Mw==",
            tagline: "Fresh from the farm",
            position: 1,
            is_active: true,
            l3_tiles: [
              {
                saleor_l3_category_id: "Q2F0ZWdvcnk6NA==",
                image_url_web: "https://cms-stg.freshterra.in/uploads/fruits.png",
                position: 1,
                is_active: true,
              },
            ],
          },
        ],
      }),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const page = await getWebCategoryPage();
    expect(page.hero?.title).toBe("Five Star Quality @ WOW Prices");
    expect(page.sections[0]?.tagline).toBe("Fresh from the farm");
    expect(page.sections[0]?.tiles[0]?.imageWeb).toContain("/uploads/fruits.png");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/content/single/web-category-page");
    expect(url.search).toBe("");
  });

  it("reads nested Strapi media objects on l3_tiles.image_url_web", async () => {
    const fetchSpy = vi.fn(async () =>
      pageResponse({
        l2_category: [
          {
            saleor_l2_category_id: "Q2F0ZWdvcnk6Mw==",
            tagline: "Fresh from the farm",
            position: 1,
            is_active: true,
            l3_tiles: [
              {
                saleor_l3_category_id: "Q2F0ZWdvcnk6NA==",
                image_url_web: {
                  url: "https://cms-stg.freshterra.in/uploads/fruits-nested.png",
                },
                position: 1,
                is_active: true,
              },
            ],
          },
        ],
      }),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const page = await getWebCategoryPage();
    expect(page.sections[0]?.tiles[0]?.imageWeb).toBe(
      "https://cms-stg.freshterra.in/uploads/fruits-nested.png",
    );
  });
});
