import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FreshTerraApiError } from "@/lib/clients/freshterra-api";

import { fetchFaqContentSafe, getFaqContent } from "./faq-service";

const apiEntry = {
  have_question_title: "Still Have Questions?",
  have_question_subtitile: "Need help?",
  cta: "Contact Us",
  pages_title: "Legal & Policies",
  faq: {
    title: "FAQs",
    faq_question: [
      {
        question: "How do I place an order?",
        answer: "Browse and checkout.",
        is_expanded_by_default: true,
      },
    ],
  },
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

describe("getFaqContent", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests GET /api/v1/content/single/faq with populate params", async () => {
    const fetchSpy = vi.fn(async () => entryResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getFaqContent();
    expect(data.faq?.title).toBe("FAQs");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/bff/api/v1/content/single/faq");
    expect(url.searchParams.get("locale")).toBe("en-IN");
    expect(url.searchParams.get("populate[faq][populate]")).toBe("*");
    expect(url.searchParams.get("populate[pages]")).toBe("*");
  });
});

describe("fetchFaqContentSafe", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns mapped FAQ content on success", async () => {
    globalThis.fetch = vi.fn(async () => entryResponse()) as unknown as typeof fetch;

    const content = await fetchFaqContentSafe();
    expect(content?.hero.title).toBe("FAQs");
    expect(content?.items[0]?.question).toBe("How do I place an order?");
  });

  it("returns null on NOT_FOUND", async () => {
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

    expect(await fetchFaqContentSafe()).toBeNull();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
