import { z } from "zod";

import {
  FreshTerraApiError,
  apiFetch,
  type ApiFetchNextOptions,
} from "@/lib/clients/freshterra-api";

import {
  categoryProductsDataSchema,
  type CategoryProductsData,
  type CategorySort,
} from "./types";

/** Defaults + bounds mirror the standard PLP contract. */
export const DEFAULT_CATEGORY_PAGE = 1;
export const DEFAULT_CATEGORY_PAGE_SIZE = 20;
export const MAX_CATEGORY_PAGE_SIZE = 100;
export const DEFAULT_CATEGORY_LOCALE = "en-IN";

const CATEGORIES_PATH = "/api/v1/categories";

const slugSchema = z.string().trim().min(1, "Category slug is required.");

export interface CategoryProductsParams {
  /** Optional serviceability polygon — scopes pricing/stock. */
  polygonId?: string;
  /** 1-based page number. */
  page?: number;
  /** Items per batch (clamped to [1, 100]). */
  pageSize?: number;
  /** Result ordering (includes `newest` for category PLP). */
  sort?: CategorySort;
  /** Facet filters as a structured object — JSON-encoded into `filters`. */
  filters?: Record<string, unknown>;
  /** BCP-47 locale; defaults to `en-IN`. */
  locale?: string;
}

export interface CategoryProductsRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
  /** Next.js cache options — applied server-side only (ISR tags/revalidate). */
  next?: ApiFetchNextOptions;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Fetches a page of products in a category (PLP — paginated, faceted).
 *
 * BFF only: `GET /api/v1/categories/:slug/products`.
 */
export async function getCategoryProducts(
  slug: string,
  params: CategoryProductsParams = {},
  options: CategoryProductsRequestOptions = {},
): Promise<CategoryProductsData> {
  const categorySlug = slugSchema.parse(slug);
  const page = Math.max(
    DEFAULT_CATEGORY_PAGE,
    params.page ?? DEFAULT_CATEGORY_PAGE,
  );
  const pageSize = clamp(
    params.pageSize ?? DEFAULT_CATEGORY_PAGE_SIZE,
    1,
    MAX_CATEGORY_PAGE_SIZE,
  );

  try {
    return await apiFetch(
      `${CATEGORIES_PATH}/${encodeURIComponent(categorySlug)}/products`,
      {
        method: "GET",
        searchParams: {
          polygonId: params.polygonId,
          page,
          pageSize,
          sort: params.sort,
          filters: params.filters ? JSON.stringify(params.filters) : undefined,
          locale: params.locale ?? DEFAULT_CATEGORY_LOCALE,
        },
        signal: options.signal,
        token: options.token,
        next: options.next,
        schema: categoryProductsDataSchema,
      },
    );
  } catch (error) {
    // Staging's BFF catalog isn't fully synced with Saleor, so many valid
    // categories 404 (`CATEGORY_NOT_FOUND`). Fall back to the Saleor-backed
    // PLP route, which resolves the category by slug or Saleor global id.
    if (
      error instanceof FreshTerraApiError &&
      error.code === "NOT_FOUND" &&
      typeof window !== "undefined"
    ) {
      return getCategoryProductsFromSaleorRoute(categorySlug, {
        page,
        pageSize,
        signal: options.signal,
      });
    }
    throw error;
  }
}

const SALEOR_PLP_PATH = "/api/catalog/categories";

const saleorPlpEnvelopeSchema = z.object({
  success: z.boolean(),
  data: categoryProductsDataSchema.nullable(),
  error: z
    .object({ code: z.string(), message: z.string().optional() })
    .nullable()
    .optional(),
});

/**
 * Fetches the Saleor-backed PLP via the same-origin Next route
 * `GET /api/catalog/categories/:slug/products` (browser-only — the route runs
 * the Saleor client server-side to keep the app token off the client).
 */
async function getCategoryProductsFromSaleorRoute(
  slugOrId: string,
  params: { page: number; pageSize: number; signal?: AbortSignal },
): Promise<CategoryProductsData> {
  const search = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  const response = await fetch(
    `${SALEOR_PLP_PATH}/${encodeURIComponent(slugOrId)}/products?${search}`,
    {
      method: "GET",
      headers: { accept: "application/json" },
      signal: params.signal,
    },
  );

  if (!response.ok) {
    throw new FreshTerraApiError(
      "Category not found",
      response.status === 404 ? "NOT_FOUND" : "UPSTREAM_UNAVAILABLE",
      response.status,
    );
  }

  const parsed = saleorPlpEnvelopeSchema.safeParse(await response.json());
  if (!parsed.success || !parsed.data.success || !parsed.data.data) {
    throw new FreshTerraApiError("Category not found", "NOT_FOUND", 404);
  }

  return parsed.data.data;
}
