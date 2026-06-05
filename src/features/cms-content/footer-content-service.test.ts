import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getFooter } from "./footer-content-service";

const footer = {
  groups: [
    { title: "Company", links: [{ label: "About", url: "/about" }] },
  ],
  social: [
    {
      platform: "instagram",
      url: "https://instagram.com/elixiirfoods",
      iconKey: "instagram",
    },
  ],
  legal: [{ label: "Privacy", url: "/privacy-policy" }],
  copyrightLine: "© 2026 FreshTerra Foods Pvt. Ltd.",
};

function footerResponse(data: unknown = footer): Response {
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

describe("getFooter", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetches footer content with default locale", async () => {
    const fetchSpy = vi.fn(async () => footerResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getFooter();
    expect(data.groups[0]?.title).toBe("Company");
    expect(data.groups[0]?.links[0]?.url).toBe("/about");
    expect(data.social[0]?.platform).toBe("instagram");
    expect(data.legal[0]?.label).toBe("Privacy");
    expect(data.copyrightLine).toContain("FreshTerra Foods");
    expect(data.social[0]?.iconKey).toBe("instagram");

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/content/pages/footer");
    expect(url.searchParams.get("locale")).toBe("en-IN");
  });

  it("forwards a custom locale", async () => {
    const fetchSpy = vi.fn(async () => footerResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getFooter({ locale: "hi-IN" });
    expect(lastUrl(fetchSpy).searchParams.get("locale")).toBe("hi-IN");
  });

  it("normalizes Strapi-shaped BFF payloads (columns, socialLinks, legalLine)", async () => {
    globalThis.fetch = vi.fn(async () =>
      footerResponse({
        slug: "footer-en",
        legalLine: "© 2026 FreshTerra Foods Pvt. Ltd.",
        socialLinks: [
          {
            platform: "facebook",
            url: "https://facebook.com/elixiirfoods",
            iconKey: "facebook",
          },
        ],
        columns: [
          {
            heading: "Shop",
            links: [{ label: "Beverages", target: "/categories/beverages" }],
          },
        ],
      }),
    ) as unknown as typeof fetch;

    const data = await getFooter();
    expect(data.groups[0]?.title).toBe("Shop");
    expect(data.social[0]?.platform).toBe("facebook");
    expect(data.copyrightLine).toContain("FreshTerra Foods");
  });

  it("defaults missing arrays to empty", async () => {
    globalThis.fetch = vi.fn(async () =>
      footerResponse({ groups: [{ title: "Company" }] }),
    ) as unknown as typeof fetch;

    const data = await getFooter();
    expect(data.groups[0]?.links).toEqual([]);
    expect(data.social).toEqual([]);
    expect(data.legal).toEqual([]);
  });

  it("maps 403 → FORBIDDEN", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(403, "FORBIDDEN"),
    ) as unknown as typeof fetch;
    await expect(getFooter()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("propagates a typed UPSTREAM_UNAVAILABLE error on 502", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;
    await expect(getFooter()).rejects.toMatchObject({
      code: "UPSTREAM_UNAVAILABLE",
    });
  });
});
