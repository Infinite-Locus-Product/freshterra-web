import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  fetchNewsPageContentSafe,
  getNewsPageContent,
} from "./news-page-service";

const apiEntry = {
  page_heading: "News & Media",
  listing: [
    {
      id: 5,
      heading: "Major Dailies",
      news_paper: [
        {
          id: 24,
          news_title: "The Economic Times",
          redirection: "https://economictimes.indiatimes.com/?from=mdr",
          image_mweb: null,
          image_web: "https://cdn.example.com/et-web.png",
          sort_order: "1",
        },
      ],
      __component: "component.news-listing",
    },
  ],
};

function entryResponse(data: unknown = apiEntry): Response {
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
    : new URL(href, "https://api.stage.freshterra.in");
}

describe("getNewsPageContent", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/news-page with the default locale", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getNewsPageContent();
    expect(data.page_heading).toBe("News & Media");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/content/single/news-page");
    expect(url.searchParams.get("locale")).toBe("en-IN");
  });
});

describe("fetchNewsPageContentSafe", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns mapped content on success", async () => {
    globalThis.fetch = vi.fn(async () =>
      entryResponse(),
    ) as unknown as typeof fetch;

    const content = await fetchNewsPageContentSafe();
    expect(content?.hero.title).toBe("News & Media");
    const [section] = content?.sections ?? [];
    expect(section?.kind).toBe("newspapers");
    expect(section?.kind === "newspapers" ? section.items[0]?.title : "").toBe(
      "The Economic Times",
    );
  });

  it("returns null on NOT_FOUND without warning", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            success: false,
            data: null,
            error: { code: "NOT_FOUND" },
          }),
          { status: 404, headers: { "content-type": "application/json" } },
        ),
    ) as unknown as typeof fetch;

    expect(await fetchNewsPageContentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns null when the entry has no renderable blocks", async () => {
    globalThis.fetch = vi.fn(async () =>
      entryResponse({ page_heading: "News & Media", listing: [] }),
    ) as unknown as typeof fetch;

    expect(await fetchNewsPageContentSafe()).toBeNull();
  });
});
