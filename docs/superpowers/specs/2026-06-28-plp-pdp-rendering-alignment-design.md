# PLP & PDP Rendering Alignment — Design

**Date:** 2026-06-28
**Status:** Approved (design); pending implementation plan
**Goal:** Align the Category PLP, Collection PLP, and PDP routes with the
rendering strategy mandated in `CLAUDE.md` §4 — **PDP = ISR + `revalidateTag`**,
**Category PLP = SSR + edge cache** — while respecting the store-scoping model
that drives per-store pricing and stock.

---

## 1. Problem

Today all three surfaces are effectively **client-rendered**. The route files
are thin Server Components that render a `"use client"` view which fetches its
own data on mount:

| Route          | File                                        | Content view                         | Data fetch                                          |
| -------------- | ------------------------------------------- | ------------------------------------ | --------------------------------------------------- |
| Category PLP   | `src/app/(shop)/c/[slug]/page.tsx`          | `CategoryPlpView` (`"use client"`)   | `useCategoryProducts`, `useWebCategoryPlp` (client) |
| Collection PLP | `src/app/(shop)/collection/[slug]/page.tsx` | `CollectionPlpView` (`"use client"`) | `useCollectionProducts` (client)                    |
| PDP            | `src/app/(shop)/product/[slug]/page.tsx`    | `ProductDetailView` (`"use client"`) | `useProduct` (client)                               |

Consequences:

- The product/category content is **not in the server-rendered HTML** — users
  and crawlers first receive a skeleton.
- PDP fetches the product **twice**: once server-side in `generateMetadata`,
  again client-side in `useProduct`.
- This diverges from `CLAUDE.md` §4.

### The store-scoping tension

PDP and PLP responses are **store-scoped** via the `ft_store_id` cookie
(polygonId), which drives pricing and stock. Reading a cookie in a Next.js page
marks it **dynamic**, which disables ISR. So "ISR with correct per-store prices
baked into the HTML" is impossible — a store-neutral cached shell is required,
with per-store values applied client-side.

This is confirmed by the data contract: `productPriceSchema` carries a `source`
field that is `sku_price_default` when no polygon is supplied
(`src/features/catalog/types.ts`). The API therefore returns sane store-neutral
data when `polygonId` is omitted — exactly what an ISR shell needs.

---

## 2. Approach (decided)

**Shared pattern:** server fetches the initial data → passes it as an
`initialData` / `initialProduct` prop → the existing client hook **seeds** its
state from that prop (so first paint uses server content, no skeleton), then
re-fetches client-side only for store-specific deltas or subsequent pages.

The presentational views (`PdpView`, `PlpView`) already accept their data as
props, so no presentational rewrite is needed — only the fetching wrappers and
their hooks change.

### 2.1 PDP — ISR + `revalidateTag('product:{slug}')`

- `src/app/(shop)/product/[slug]/page.tsx`:
  - Add `export const revalidate = <N>` (value TBD with team; see Open
    Questions).
  - Server-fetch `getProduct(slug)` **without** a polygon, passing
    `next: { tags: ['product:{slug}'], revalidate: <N> }`.
  - **Remove the page-level `cookies()` read** — this is what keeps the route
    statically renderable / ISR-eligible.
  - Wrap the fetch in React `cache()` so `generateMetadata` and the page body
    share a single request (kills the double fetch).
  - Pass the neutral product to `ProductDetailView` as `initialProduct`. SEO
    content and JSON-LD now ship in the HTML.
- `ProductDetailView` (stays `"use client"`):
  - Accept `initialProduct`.
  - Read `polygonId` from the `ft_store_id` cookie **client-side**.
  - Call `useProduct({ id, polygonId, initialData: initialProduct })`. With a
    store set, the client overlays store-specific price/stock onto the neutral
    shell; otherwise the default (`sku_price_default`) price stands.
- Revalidation: the existing `/api/revalidate` webhook already calls
  `revalidateTag`. We adopt the `product:{slug}` tag convention so price/stock
  master changes bust the cached shell.

**Accepted trade-off:** when a store is selected, price/stock may briefly show
the default value, then update to the store value once the client island
resolves. This is the standard ISR ecommerce pattern and was approved.

### 2.2 Category PLP — SSR + edge cache

- `src/app/(shop)/c/[slug]/page.tsx` and
  `src/app/(shop)/collection/[slug]/page.tsx`:
  - These are per-request and store-scoped, so reading the cookie server-side is
    correct — SSR is already dynamic.
  - Server-fetch the **first batch** of products (with the cookie `polygonId`)
    plus category metadata, and pass it to `CategoryPlpView` /
    `CollectionPlpView` as `initialData`.
  - The existing CMS-landing branch (`getWebCategoryContent`) and the
    explore-catalog branch are unchanged.
- Client controllers (`useCategoryProducts`, `useCollectionProducts`,
  `useWebCategoryPlp`) seed from the initial batch and continue fetching
  subsequent pages, filters, sort, and L4 tabs **client-side** — interactivity
  is unchanged.

### 2.3 Enabling plumbing

1. **Service passthrough:** add an optional `next?: { tags?: string[];
revalidate?: number | false }` field to the request options of `getProduct`
   (and the category/collection product services as needed), forwarded to
   `apiFetch`. `apiFetch` already applies `next` server-side only
   (`typeof window === "undefined"`), so client calls are unaffected.
2. **Hook seeding:** add an `initialData` option to `useProduct`,
   `useCategoryProducts`, and `useCollectionProducts`. When present:
   - seed state with it (first render shows real content),
   - suppress the skeleton/loading state while initial data exists,
   - still re-fetch to overlay store-scoped values / load further pages.

---

## 3. Components & Boundaries

| Unit                                                  | Responsibility                        | Change                                                                                              |
| ----------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `product/[slug]/page.tsx`                             | ISR server shell + metadata + JSON-LD | fetch neutral product w/ tags+revalidate; drop cookie read; `cache()` dedupe; pass `initialProduct` |
| `ProductDetailView.tsx`                               | Client price/stock overlay            | accept `initialProduct`; read cookie client-side; seed `useProduct`                                 |
| `useProduct.ts`                                       | Client product fetch                  | add `initialData` seeding                                                                           |
| `c/[slug]/page.tsx`, `collection/[slug]/page.tsx`     | SSR PLP shell                         | server-fetch first batch + metadata; pass `initialData`                                             |
| `CategoryPlpView.tsx`, `CollectionPlpView.tsx`        | Client PLP interactivity              | accept + seed `initialData`                                                                         |
| `useCategoryProducts.ts`, `useCollectionProducts.ts`  | Client paged fetch                    | add `initialData` seeding                                                                           |
| `product-service.ts` (+ category/collection services) | Isomorphic data fetch                 | add `next` passthrough                                                                              |

No changes to `apiFetch` (already supports `next`) or `/api/revalidate`
(already calls `revalidateTag`).

---

## 4. Testing

Follows the repo's TDD workflow (`CLAUDE.md` §9).

- **Plumbing:** unit-test that `getProduct` forwards `next` options to
  `apiFetch`; that the hooks render initial content from `initialData` without a
  loading state and still re-fetch for deltas.
- **PDP:** server page renders product content + JSON-LD in HTML
  (no skeleton) given a fetched product; `ProductDetailView` overlays
  store price when a `polygonId` cookie is present; `generateMetadata` and page
  share one fetch (no double call). Error/empty states preserved.
- **PLP:** server page seeds the first product batch; client controller renders
  initial batch without a fetch on mount and loads page 2 client-side; filter
  and sort interactions still work; empty-category state preserved.

---

## 5. Risks & Verification

1. **`ft_store_id` must be client-readable** for the PDP price island. If
   middleware sets it `httpOnly`, the client can't read it. Mitigation: flip the
   cookie to non-`httpOnly` (it is a store id, not a secret) or expose it via a
   small header/endpoint. **Verify `middleware.ts` cookie flags during
   implementation.**
2. **PLP "edge cache"** is constrained by the per-store cookie — true shared
   edge caching is not possible per-store. Treat as a deploy-level cache-header
   concern (short `s-maxage` / `Vary`); document rather than force a specific
   value here.
3. **ISR vs intent:** PDP becomes genuinely ISR-cacheable only because the shell
   is store-neutral. If product master content (not price/stock) ever becomes
   store-scoped, this assumption breaks and PDP would fall back to SSR.

---

## 6. Open Questions (resolve during planning, not blocking)

- ISR `revalidate` interval for PDP (e.g. 60s vs longer, given webhook tag
  busting handles freshness).
- Whether the related-products rail should also be seeded server-side or remain
  a client fetch (currently `product.similarProducts` ships inline with the
  product, so likely already covered).

---

## 7. Out of Scope

- Search SRP (client-rendered by design — `CLAUDE.md` §4).
- Store list / individual store pages.
- Any change to the FreshTerra BFF / API contract.
- Cart/checkout/auth (out of Phase 1 web scope entirely).
