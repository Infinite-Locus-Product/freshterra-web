import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getHomeContent } from "./home-content-service";

const heroModule = {
  id: "mod_hero_001",
  type: "hero_carousel",
  order: 1,
  config: { auto_scroll: true, interval_seconds: 6 },
  data_ref: {
    type: "inline",
    items: [
      {
        id: "ban_01",
        image: "https://cdn/diwali.jpg",
        deeplink: "/c/diwali",
        alt: "Diwali Sale",
      },
    ],
  },
};

const personalModule = {
  id: "mod_personal_005",
  type: "personalised_rail",
  order: 5,
  config: { max_items: 12, title: "Picked for you" },
  data_ref: {
    type: "endpoint",
    url: "/api/v1/products/recommended?bucket=trending&polygon_id=poly_1",
  },
};

function homeResponse(modules: unknown[] = [heroModule, personalModule]): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: { modules, version: "v1", publishedAt: "2026-05-20T11:00:00Z" },
      error: null,
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
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

describe("getHomeContent", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("sends required params + defaults and parses both data_ref kinds", async () => {
    const fetchSpy = vi.fn(async () => homeResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getHomeContent({
      polygonId: "poly_1",
      storeId: "blr-channel",
    });

    expect(data.version).toBe("v1");
    expect(data.modules).toHaveLength(2);
    const inline = data.modules[0];
    expect(inline.type).toBe("hero_carousel");
    expect(inline.data_ref.type).toBe("inline");
    const endpoint = data.modules[1];
    expect(endpoint.data_ref.type).toBe("endpoint");
    if (endpoint.data_ref.type === "endpoint") {
      expect(endpoint.data_ref.url).toContain("/recommended");
    }

    const url = lastUrl(fetchSpy);
    expect(url.pathname).toBe("/api/v1/content/home");
    expect(url.searchParams.get("polygon_id")).toBe("poly_1");
    expect(url.searchParams.get("store_id")).toBe("blr-channel");
    expect(url.searchParams.get("locale")).toBe("en-IN");
    expect(url.searchParams.get("channel")).toBe("web");
  });

  it("forwards a custom locale + channel", async () => {
    const fetchSpy = vi.fn(async () => homeResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await getHomeContent({
      polygonId: "poly_1",
      storeId: "blr",
      locale: "hi-IN",
      channel: "mobile",
    });

    const url = lastUrl(fetchSpy);
    expect(url.searchParams.get("locale")).toBe("hi-IN");
    expect(url.searchParams.get("channel")).toBe("mobile");
  });

  it("sorts modules by `order`", async () => {
    const fetchSpy = vi.fn(async () =>
      homeResponse([
        { ...personalModule, order: 5 },
        { ...heroModule, order: 1 },
      ]),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getHomeContent({ polygonId: "p", storeId: "s" });
    expect(data.modules.map((m) => m.order)).toEqual([1, 5]);
  });

  it("keeps unknown module types instead of failing the parse", async () => {
    const fetchSpy = vi.fn(async () =>
      homeResponse([
        { ...heroModule },
        {
          id: "mod_future",
          type: "brand_new_widget",
          order: 2,
          config: {},
          data_ref: { type: "inline", items: [] },
        },
      ]),
    );
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const data = await getHomeContent({ polygonId: "p", storeId: "s" });
    expect(data.modules.map((m) => m.type)).toContain("brand_new_widget");
  });

  it("rejects a missing polygon_id or store_id before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(
      getHomeContent({ polygonId: "", storeId: "s" }),
    ).rejects.toBeInstanceOf(Error);
    await expect(
      getHomeContent({ polygonId: "p", storeId: "  " }),
    ).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("propagates typed errors (429)", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(429, null),
    ) as unknown as typeof fetch;

    await expect(
      getHomeContent({ polygonId: "p", storeId: "s" }),
    ).rejects.toMatchObject({ code: "RATE_LIMITED" });
  });
});
