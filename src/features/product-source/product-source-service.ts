import { z } from "zod";

import {
  apiFetch,
  FreshTerraApiError,
} from "@/lib/clients/freshterra-api";

/**
 * "Know Your Product" batch-code traceability lookup.
 *
 * `POST /api/v1/batch-code-lookup` with `{ batch_code }`. The FreshTerra BFF
 * envelope (`{ success, data, error }`) is unwrapped by `apiFetch`; the inner
 * `data` carries its own `{ ok, data }` wrapper which we validate here.
 */
const BATCH_CODE_LOOKUP_PATH = "/api/v1/batch-code-lookup";

/** Raw BE payload (the unwrapped envelope `data`), validated on arrival. */
const batchLookupResponseSchema = z.object({
  ok: z.boolean(),
  data: z
    .object({
      manufacturer_name: z.string(),
      registered_address: z.string().optional().nullable(),
      fssai_licence_number: z.string().optional().nullable(),
    })
    .nullable()
    .optional(),
});

/** Normalized shape consumed by the UI (camelCase, nulls collapsed). */
export type ManufacturedBy = {
  name: string;
  address?: string;
  phone?: string;
  fssaiLicense?: string;
};

export type ProductSource = {
  batchCode: string;
  manufacturedBy?: ManufacturedBy;
};

export interface FetchProductSourceOptions {
  signal?: AbortSignal;
}

/**
 * Looks up product traceability details for a batch code via
 * `POST /api/v1/batch-code-lookup`. Public endpoint — no auth token.
 *
 * Throws a {@link FreshTerraApiError}; callers should treat `NOT_FOUND` as
 * "no such batch". A `{ ok: false }` or missing inner payload is normalized to
 * a `NOT_FOUND` error.
 */
export async function fetchProductSource(
  batchCode: string,
  options: FetchProductSourceOptions = {},
): Promise<ProductSource> {
  const code = batchCode.trim();
  const raw = await apiFetch(BATCH_CODE_LOOKUP_PATH, {
    method: "POST",
    body: { batch_code: code },
    token: null,
    signal: options.signal,
    schema: batchLookupResponseSchema,
    expectedErrorCodes: ["NOT_FOUND"],
  });

  const m = raw.ok ? raw.data : null;
  if (!m) {
    throw new FreshTerraApiError(
      "No product found for batch code",
      "NOT_FOUND",
    );
  }

  return {
    batchCode: code,
    manufacturedBy: {
      name: m.manufacturer_name,
      address: m.registered_address ?? undefined,
      fssaiLicense: m.fssai_licence_number ?? undefined,
    },
  };
}
