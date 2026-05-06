import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const validBody = () => ({
  email: "user@example.com",
  consent: true,
});

function makeRequest(body: unknown, ip = "1.2.3.4") {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.LEAD_WEBHOOK_URL;
    delete process.env.LEAD_FRESHTERRA_API_URL;
    delete process.env.LEAD_FRESHTERRA_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 200 with { ok: true } for a valid payload (console fallback)", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validBody(), "10.0.0.1"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it("returns 400 for an invalid email", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ email: "bad", consent: true }, "10.0.0.2"),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when honeypot is filled", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest(
        { email: "user@example.com", consent: true, _hp: "i am a bot" },
        "10.0.0.3",
      ),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when consent is not granted", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ email: "user@example.com", consent: false }, "10.0.0.4"),
    );
    expect(res.status).toBe(400);
  });

  it("rate-limits a single IP after the threshold is exceeded", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const { POST } = await import("./route");
    const ip = "10.0.0.99";
    let last: Response | undefined;
    for (let i = 0; i < 8; i++) {
      last = await POST(makeRequest(validBody(), ip));
    }
    expect(last?.status).toBe(429);
  });

  it("returns 502 when the adapter reports failure", async () => {
    process.env.LEAD_WEBHOOK_URL = "https://hooks.example.com/leads";
    globalThis.fetch = vi.fn(
      async () => new Response("oops", { status: 500 }),
    ) as unknown as typeof fetch;
    const { POST } = await import("./route");
    const res = await POST(makeRequest(validBody(), "10.0.0.42"));
    expect(res.status).toBe(502);
  });

  it("returns 400 when body is malformed JSON", async () => {
    const { POST } = await import("./route");
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "5.5.5.5",
      },
      body: "{not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
