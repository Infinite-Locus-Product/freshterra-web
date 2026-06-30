import { z } from "zod";

import {
  apiFetch,
  type ApiErrorCode,
  type ApiFetchNextOptions,
} from "@/lib/clients/freshterra-api";

import {
  productDetailSchema,
  relatedProductsSchema,
  type ProductDetail,
  type RelatedProducts,
} from "./types";

const PRODUCTS_PATH = "/api/v1/products";

/** Defaults + bounds for the related (cross-sell) rail. */
export const DEFAULT_RELATED_LIMIT = 10;
export const MAX_RELATED_LIMIT = 20;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** `id` is a Saleor product ULID or slug — required, non-empty. */
const idSchema = z.string().trim().min(1, "Product id is required.");

/**
 * Saleor global IDs end with `==`. Next.js route params and browser navigation
 * may arrive partially encoded (`%3D%3D`). Decode before a single
 * `encodeURIComponent` so we never double-encode (`%253D%253D` → 404).
 */
function decodePathSegment(segment: string): string {
  let current = segment;
  try {
    let decoded = decodeURIComponent(current);
    while (decoded !== current) {
      current = decoded;
      decoded = decodeURIComponent(current);
    }
  } catch {
    // Leave malformed escape sequences untouched.
  }
  return current;
}

function productDetailPath(id: string): string {
  return `${PRODUCTS_PATH}/${encodeURIComponent(decodePathSegment(id))}`;
}

/** `sku` is a SKU code (e.g. FT-TOMATO-500G) — required, non-empty. */
const skuSchema = z.string().trim().min(1, "Product SKU is required.");

export interface GetProductParams {
  /** Optional serviceability polygon. Absent → `sku_price_default` pricing. */
  polygonId?: string;
}

export interface GetProductRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
  /** Next.js cache options — applied server-side only (ISR tags/revalidate). */
  next?: ApiFetchNextOptions;
  /** Error codes treated as control flow — skips console.error (see apiFetch). */
  expectedErrorCodes?: ApiErrorCode[];
}

/**
 * Fetches product detail for the PDP (product + pricing + live inventory).
 *
 * - Validates `id` (required) before calling out.
 * - Forwards an optional `polygonId` (drives polygon pricing + stock).
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns the product, or throws a `FreshTerraApiError`
 *   (`AUTH_TOKEN_INVALID` | `NOT_FOUND` | `RATE_LIMITED` |
 *   `UPSTREAM_UNAVAILABLE` | `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 *   For a missing product, `err.code` is `NOT_FOUND` and `err.serverCode` is
 *   `"PRODUCT_NOT_FOUND"`.
 */
export async function getProduct(
  id: string,
  params: GetProductParams = {},
  options: GetProductRequestOptions = {},
): Promise<ProductDetail> {
  const productId = idSchema.parse(id);

  return apiFetch(productDetailPath(productId), {
    method: "GET",
    searchParams: { polygonId: params.polygonId },
    signal: options.signal,
    token: options.token,
    next: options.next,
    expectedErrorCodes: options.expectedErrorCodes,
    schema: productDetailSchema,
  });
}

/**
 * Fetches product detail by SKU code (PDP entry from a SKU/barcode).
 *
 * Identical contract to {@link getProduct} but keyed on `sku`:
 * - Validates `sku` (required) before calling out.
 * - Forwards an optional `polygonId` (drives polygon pricing + stock).
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns the product, or throws a `FreshTerraApiError`
 *   (`AUTH_TOKEN_INVALID` | `NOT_FOUND` | `RATE_LIMITED` |
 *   `UPSTREAM_UNAVAILABLE` | `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 *   For a missing product, `err.code` is `NOT_FOUND` and `err.serverCode` is
 *   `"PRODUCT_NOT_FOUND"`.
 */
export async function getProductBySku(
  sku: string,
  params: GetProductParams = {},
  options: GetProductRequestOptions = {},
): Promise<ProductDetail> {
  const code = skuSchema.parse(sku);

  return apiFetch(`${PRODUCTS_PATH}/by-sku/${encodeURIComponent(code)}`, {
    method: "GET",
    searchParams: { polygonId: params.polygonId },
    signal: options.signal,
    token: options.token,
    schema: productDetailSchema,
  });
}

export interface GetRelatedProductsParams extends GetProductParams {
  /** Number of cross-sell items (clamped to [1, 20]). */
  limit?: number;
}

/**
 * Fetches related (cross-sell) products for an anchor product — category + tag
 * overlap, returned as a flat, limit-capped array.
 *
 * - Validates `id` (required) before calling out.
 * - Clamps `limit` to [1, 20] (default 10); forwards optional `polygonId`.
 * - Attaches a JWT automatically when available (anon browse allowed).
 * - Returns the products array, or throws a `FreshTerraApiError`
 *   (`AUTH_TOKEN_INVALID` | `NOT_FOUND` [anchor missing] | `RATE_LIMITED` |
 *   `UPSTREAM_UNAVAILABLE` | `NETWORK_ERROR` | `PARSE_ERROR` | `ABORTED`).
 */
export async function getRelatedProducts(
  id: string,
  params: GetRelatedProductsParams = {},
  options: GetProductRequestOptions = {},
): Promise<RelatedProducts> {
  const productId = idSchema.parse(id);
  const limit = clamp(
    params.limit ?? DEFAULT_RELATED_LIMIT,
    1,
    MAX_RELATED_LIMIT,
  );

  return apiFetch(`${productDetailPath(productId)}/related`, {
    method: "GET",
    searchParams: { polygonId: params.polygonId, limit },
    signal: options.signal,
    token: options.token,
    schema: relatedProductsSchema,
  });
}
