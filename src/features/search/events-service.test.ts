import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { logSearchEvent, trackSearchEvent } from "./events-service";

import type { SearchEventInput } from "./types";

const baseEvent: SearchEventInput = {
  sessionId: "sess_01HX9",
  q: "tomato",
  event: "click",
  productId: "prd_01HX9",
  position: 3,
  at: "2026-05-24T10:30:00Z",
};

function acceptedResponse(): Response {
  return new Response(
    JSON.stringify({ success: true, data: { accepted: true }, error: null }),
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

/** Returns the parsed JSON body fetch was last called with. */
function lastBody(fetchSpy: ReturnType<typeof vi.fn>): Record<string, unknown> {
  const [, init] = fetchSpy.mock.calls.at(-1) as unknown as [
    string,
    RequestInit,
  ];
  return JSON.parse(init.body as string);
}

describe("logSearchEvent", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("POSTs the event as JSON and returns accepted", async () => {
    const fetchSpy = vi.fn(async () => acceptedResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const accepted = await logSearchEvent(baseEvent);
    expect(accepted).toBe(true);

    const [url, init] = fetchSpy.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toContain("/api/v1/search/events");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "content-type": "application/json" });
    expect(lastBody(fetchSpy)).toMatchObject({
      sessionId: "sess_01HX9",
      q: "tomato",
      event: "click",
      productId: "prd_01HX9",
      position: 3,
      at: "2026-05-24T10:30:00Z",
    });
  });

  it("attaches the JWT when present", async () => {
    window.localStorage.setItem("ft_access_token", "jwt-xyz");
    const fetchSpy = vi.fn(async () => acceptedResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await logSearchEvent(baseEvent);

    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(init.headers).toMatchObject({ authorization: "Bearer jwt-xyz" });
  });

  it("defaults `at` to an ISO timestamp when omitted", async () => {
    const fetchSpy = vi.fn(async () => acceptedResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const { at: _omit, ...withoutAt } = baseEvent;
    await logSearchEvent(withoutAt);

    const at = lastBody(fetchSpy).at as string;
    expect(at).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
  });

  it("trims keyword_journey to the last 6 entries (oldest→newest)", async () => {
    const fetchSpy = vi.fn(async () => acceptedResponse());
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const journey = Array.from({ length: 9 }, (_, i) => ({
      keyword: `k${i}`,
      ts: "2026-05-24T10:30:00Z",
    }));
    await logSearchEvent({ ...baseEvent, keyword_journey: journey });

    const sent = lastBody(fetchSpy).keyword_journey as { keyword: string }[];
    expect(sent).toHaveLength(6);
    expect(sent.map((e) => e.keyword)).toEqual([
      "k3",
      "k4",
      "k5",
      "k6",
      "k7",
      "k8",
    ]);
  });

  it("rejects an invalid body before calling out", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(
      logSearchEvent({ ...baseEvent, sessionId: "" }),
    ).rejects.toBeInstanceOf(Error);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("preserves the KEYWORD_JOURNEY_TOO_LONG server code on a 400", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(400, "KEYWORD_JOURNEY_TOO_LONG"),
    ) as unknown as typeof fetch;

    await expect(logSearchEvent(baseEvent)).rejects.toMatchObject({
      code: "VALIDATION_FAILED",
      serverCode: "KEYWORD_JOURNEY_TOO_LONG",
    });
  });

  it("propagates a typed RATE_LIMITED error on 429", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(429, null),
    ) as unknown as typeof fetch;

    await expect(logSearchEvent(baseEvent)).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
  });
});

describe("trackSearchEvent", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("resolves true on success", async () => {
    globalThis.fetch = vi.fn(async () =>
      acceptedResponse(),
    ) as unknown as typeof fetch;

    await expect(trackSearchEvent(baseEvent)).resolves.toBe(true);
  });

  it("swallows errors and resolves false (never throws)", async () => {
    globalThis.fetch = vi.fn(async () =>
      errorResponse(502, null),
    ) as unknown as typeof fetch;

    await expect(trackSearchEvent(baseEvent)).resolves.toBe(false);
  });

  it("swallows client-side validation errors too", async () => {
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(
      trackSearchEvent({ ...baseEvent, sessionId: "" }),
    ).resolves.toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
