import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { LeadInput } from "./schema";

const validLead: LeadInput = {
  email: "user@example.com",
  phone: "+919876543210",
  consent: true,
};

describe("sendLead", () => {
  const originalFetch = globalThis.fetch;
  const originalWebhook = process.env.LEAD_WEBHOOK_URL;
  const originalApiUrl = process.env.LEAD_FRESHTERRA_API_URL;
  const originalApiKey = process.env.LEAD_FRESHTERRA_API_KEY;

  beforeEach(() => {
    vi.resetModules();
    delete process.env.LEAD_WEBHOOK_URL;
    delete process.env.LEAD_FRESHTERRA_API_URL;
    delete process.env.LEAD_FRESHTERRA_API_KEY;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalWebhook !== undefined)
      process.env.LEAD_WEBHOOK_URL = originalWebhook;
    if (originalApiUrl !== undefined)
      process.env.LEAD_FRESHTERRA_API_URL = originalApiUrl;
    if (originalApiKey !== undefined)
      process.env.LEAD_FRESHTERRA_API_KEY = originalApiKey;
    vi.restoreAllMocks();
  });

  it("falls back to console logging when no destination is configured", async () => {
    const logSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => undefined);
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const { sendLead } = await import("./adapter");
    const result = await sendLead(validLead);

    expect(result).toEqual({ ok: true, destination: "console" });
    expect(logSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("posts to LEAD_WEBHOOK_URL when set and returns ok on 2xx", async () => {
    process.env.LEAD_WEBHOOK_URL = "https://hooks.example.com/leads";
    const fetchSpy = vi.fn(async () => new Response("{}", { status: 200 }));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const { sendLead } = await import("./adapter");
    const result = await sendLead(validLead);

    expect(result).toEqual({ ok: true, destination: "webhook" });
    expect(fetchSpy).toHaveBeenCalledOnce();
    const call = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = call;
    expect(url).toBe("https://hooks.example.com/leads");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      "content-type": "application/json",
    });
  });

  it("returns ok=false when the webhook responds with non-2xx", async () => {
    process.env.LEAD_WEBHOOK_URL = "https://hooks.example.com/leads";
    globalThis.fetch = vi.fn(
      async () => new Response("server error", { status: 500 }),
    ) as unknown as typeof fetch;

    const { sendLead } = await import("./adapter");
    const result = await sendLead(validLead);

    expect(result.ok).toBe(false);
  });

  it("posts to LEAD_FRESHTERRA_API_URL with bearer auth when both vars are set", async () => {
    process.env.LEAD_FRESHTERRA_API_URL = "https://api.freshterra.in/v1/leads";
    process.env.LEAD_FRESHTERRA_API_KEY = "secret-key";
    const fetchSpy = vi.fn(async () => new Response("{}", { status: 201 }));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const { sendLead } = await import("./adapter");
    const result = await sendLead(validLead);

    expect(result).toEqual({ ok: true, destination: "freshterra" });
    const call = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const [, init] = call;
    expect(init.headers).toMatchObject({
      authorization: "Bearer secret-key",
    });
  });

  it("returns ok=false when fetch throws", async () => {
    process.env.LEAD_WEBHOOK_URL = "https://hooks.example.com/leads";
    globalThis.fetch = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;

    const { sendLead } = await import("./adapter");
    const result = await sendLead(validLead);

    expect(result.ok).toBe(false);
  });
});
