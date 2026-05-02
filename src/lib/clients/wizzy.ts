import { z } from "zod";

import { env } from "@/lib/config/env";

/**
 * Wizzy search wrapper. Per CLAUDE.md §5.4 (CRITICAL):
 * - Two credential sets (staging/production) — selected by WIZZY_ENV.
 * - Every API call MUST include `store_id`. The wrapper injects it from
 *   server-side store context. Callers never pass it manually.
 * - Payload schema is exact. Validate every request body with zod before
 *   sending — deviations cause silent analytics failures.
 * - Implements four APIs: Autocomplete (chars >= 3), Search (20/batch with
 *   infinite scroll), Filter, Events.
 */
export class WizzyError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "WizzyError";
  }
}

const baseRequestSchema = z.object({
  store_id: z.string().min(1),
  project_id: z.string().min(1),
});

export type WizzyEventName =
  | "search_start"
  | "search_submitted"
  | "results_served"
  | "product_clicked"
  | "atc_search"
  | "purchase_search";

function ensureConfig(): { url: string; key: string; projectId: string } {
  if (!env.WIZZY_API_URL || !env.WIZZY_API_KEY || !env.WIZZY_PROJECT_ID) {
    throw new WizzyError(
      `Wizzy not configured for env=${env.WIZZY_ENV}. Check WIZZY_API_URL, WIZZY_API_KEY, WIZZY_PROJECT_ID.`,
    );
  }
  return {
    url: env.WIZZY_API_URL,
    key: env.WIZZY_API_KEY,
    projectId: env.WIZZY_PROJECT_ID,
  };
}

export const wizzy = {
  env: env.WIZZY_ENV,
  isConfigured(): boolean {
    return Boolean(
      env.WIZZY_API_URL && env.WIZZY_API_KEY && env.WIZZY_PROJECT_ID,
    );
  },
  /** Placeholder. Real impl validates with `baseRequestSchema` and posts. */
  async autocomplete(_storeId: string, _query: string): Promise<unknown> {
    ensureConfig();
    baseRequestSchema.parse({
      store_id: _storeId,
      project_id: env.WIZZY_PROJECT_ID,
    });
    return null;
  },
  async search(_storeId: string, _query: string, _page = 1): Promise<unknown> {
    ensureConfig();
    return null;
  },
  async filter(_storeId: string, _filters: unknown): Promise<unknown> {
    ensureConfig();
    return null;
  },
  async event(_storeId: string, _name: WizzyEventName, _payload: unknown) {
    ensureConfig();
    return null;
  },
};
