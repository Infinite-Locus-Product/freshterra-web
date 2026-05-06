import type { LeadInput } from "./schema";

/**
 * Lead destination is environment-configurable. Order of preference:
 *   1. LEAD_FRESHTERRA_API_URL (+ LEAD_FRESHTERRA_API_KEY) — internal services
 *   2. LEAD_WEBHOOK_URL — Make / Zapier / Resend / etc.
 *   3. console.info fallback (default for staging and local dev)
 *
 * The adapter never throws — it always returns a structured result so the
 * route handler can decide what HTTP code to send back.
 */

export type AdapterResult =
  | { ok: true; destination: "freshterra" | "webhook" | "console" }
  | { ok: false; destination: "freshterra" | "webhook"; error: string };

export async function sendLead(payload: LeadInput): Promise<AdapterResult> {
  const apiUrl = process.env.LEAD_FRESHTERRA_API_URL;
  const apiKey = process.env.LEAD_FRESHTERRA_API_KEY;
  if (apiUrl && apiKey) {
    return postJson(apiUrl, payload, "freshterra", {
      authorization: `Bearer ${apiKey}`,
    });
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    return postJson(webhookUrl, payload, "webhook");
  }

  // Console fallback — fine for the first deploy. Replace before going to scale.
  console.info("[leads] new submission (console fallback)", {
    email: payload.email,
    phone: payload.phone,
    consent: payload.consent,
    timestamp: new Date().toISOString(),
  });
  return { ok: true, destination: "console" };
}

async function postJson(
  url: string,
  payload: LeadInput,
  destination: "freshterra" | "webhook",
  extraHeaders: Record<string, string> = {},
): Promise<AdapterResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...extraHeaders },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return {
        ok: false,
        destination,
        error: `Upstream returned ${res.status}`,
      };
    }
    return { ok: true, destination };
  } catch (err) {
    return {
      ok: false,
      destination,
      error: err instanceof Error ? err.message : "Unknown fetch error",
    };
  }
}
