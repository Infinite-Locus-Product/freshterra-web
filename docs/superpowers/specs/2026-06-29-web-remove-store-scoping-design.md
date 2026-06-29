# Remove Web Store-Scoping; Fully Server-Render PDP & PLP — Design

**Date:** 2026-06-29
**Status:** Approved (design); pending implementation plan
**Goal:** Since the web UI renders only store-neutral catalog content, remove the
`ft_store_id`/`polygonId` wiring from the PDP and PLP rendering path, render both
fully on the server, and make PLP ISR-cacheable. This eliminates the redundant
client refetch (and the "double loader") introduced for per-store price/stock
that the web never displays.

Follows the branch `fixes/product-testing` work
(`2026-06-28-plp-pdp-rendering-alignment`), partly reversing its PDP client
overlay (Tasks 3, 10) while keeping its server-rendering + seeding + JSON-LD.

---

## 1. Premise (verified)

The web renders only store-neutral catalog fields:

- `PdpView` reads: `id`, `name`, `images`, `story`, `productInformations`,
  `tagPills`, `variants` (`name`/`sku`/`weightG`). **No price, mrp, stock, or
  cart.**
- `ProductCard` reads: `images`, `name`, `regulatory`, `tagPills`. Same.
- Confirmed with the user: the catalog **set/availability is store-neutral**
  (the full catalog shows regardless of store); the app owns availability and
  checkout.

Therefore `ft_store_id` (the `polygonId`, set only via a `?store=` deeplink in
`middleware.ts`; serviceability resolver is a 501 stub) affects nothing the web
displays. The store-neutral ISR shell + client price/stock overlay built in the
prior branch is solving a non-problem for the current UI, and its client refetch
is the cause of the second ("skeleton") loader.

---

## 2. Approach

Remove store-scoping from the **rendering path** while leaving the `polygonId`
**param** intact on the service layer for a future price feature.

### 2.1 PDP — `/product/[slug]`

- The server page renders `PdpView` **directly**:
  - `loadProduct(slug)` stays (ISR via `export const revalidate`, `next.tags`,
    `cache()` dedupe with `generateMetadata`).
  - Build breadcrumbs server-side (Home → category → product), pass
    `product`, `related={product.similarProducts}`, `relatedLoading={false}`,
    `breadcrumbs`.
  - Keep the `Product` + `BreadcrumbList` JSON-LD (Task 9).
  - On a hard `NOT_FOUND` from `loadProduct`, call `notFound()` →
    **real HTTP 404** (also resolves the prior "200 on invalid slug" finding).
    Other errors still degrade (render nothing / error boundary).
- **Delete `ProductDetailView` and `useProduct`** (and their test files) — dead
  code once the overlay is gone; they existed only to read the cookie and
  re-fetch a store overlay that changes nothing displayed. `PdpView` stays a
  `"use client"` component for variant selector + gallery; it receives props.
- Net: spinner → content. No client refetch, **no skeleton phase** on PDP.

### 2.2 PLP — `/c/[slug]` & `/collection/[slug]`

- Pages **stop reading the `ft_store_id` cookie**. Server-fetch the first batch
  **store-neutral** (`getCategoryProducts(slug)` / `getCollectionProducts(slug)`
  with no `polygonId`), best-effort (try/catch → null), and seed the client view
  via `initialData`/`initialKey` (kept from Tasks 4–7).
- With no cookie/`cookies()` read remaining, add `export const revalidate` so
  the routes flip from dynamic (`ƒ`) to **ISR/static** — cacheable across all
  visitors (valid because content is store-neutral).
- `CategoryPlpView` / `CollectionPlpView`: remove the `polygonId` prop; call the
  product hooks without `polygonId`.
- `useCollectionProducts`: change the store-gate from
  `active = enabled && Boolean(slug && polygonId)` to
  `active = enabled && Boolean(slug)` so it fetches without a store.
  `useCategoryProducts` already gates on `slug` only — unchanged there.
- Client still handles filters / sort / infinite-scroll (store-neutral fetches
  via the `/bff` proxy). Net: server-rendered list seeded into HTML, **no
  initial client fetch, no skeleton**.

### 2.3 Service layer — intentionally unchanged

`polygonId` remains an optional, now-unused param on `getProduct`,
`getCategoryProducts`, `getCollectionProducts`. This preserves the future path:
when prices return, add a small client `<ProductPrice>` island that reads the
cookie and calls the existing service for **price only** — page stays static,
no whole-product refetch, no dynamic route.

The `next` cache-option passthrough (prior Task 1) stays. PLP pages may now pass
`next.tags`/`revalidate` for on-demand revalidation if desired; not required.

---

## 3. Components & Boundaries

| File                                                         | Change                                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `src/app/(shop)/product/[slug]/page.tsx`                     | Render `PdpView` directly; build breadcrumbs; `notFound()` on missing product; keep JSON-LD + ISR |
| `src/features/catalog/components/ProductDetailView.tsx`      | **Delete**                                                                                        |
| `src/features/catalog/components/ProductDetailView.test.tsx` | **Delete**                                                                                        |
| `src/features/catalog/useProduct.ts`                         | **Delete** (no remaining consumer)                                                                |
| `src/features/catalog/useProduct.test.tsx`                   | **Delete**                                                                                        |
| `src/app/(shop)/c/[slug]/page.tsx`                           | Drop cookie read; store-neutral fetch; add `revalidate` (ISR); drop `polygonId` prop              |
| `src/app/(shop)/collection/[slug]/page.tsx`                  | Drop cookie read; store-neutral fetch; add `revalidate` (ISR); drop `polygonId` prop              |
| `src/features/catalog/components/CategoryPlpView.tsx`        | Remove `polygonId` prop; call hooks without it                                                    |
| `src/features/catalog/components/CollectionPlpView.tsx`      | Remove `polygonId` prop; call hook without it                                                     |
| `src/features/catalog/useCollectionProducts.ts`              | Un-gate: `active = enabled && Boolean(slug)`                                                      |
| `src/features/catalog/components/PdpView.tsx`                | No change (already prop-driven)                                                                   |
| service files                                                | No change (keep optional `polygonId`)                                                             |

`STORE_COOKIE`/`ft_store_id` references in `c/[slug]/page.tsx`,
`collection/[slug]/page.tsx`, `ProductDetailView.tsx` are removed. `middleware.ts`
still sets the cookie (harmless; future price island / app handoff may use it) —
left untouched.

---

## 4. Testing

- **PDP:** page-level — given a product, `PdpView` content + JSON-LD render
  server-side; given `NOT_FOUND`, the page calls `notFound()`. Add/keep a
  `PdpView` prop-rendering unit test if not already covered. Remove
  `ProductDetailView`/`useProduct` tests.
- **PLP:** `useCollectionProducts` fetches with `slug` only (no `polygonId`)
  and still seeds from `initialData`; `useCategoryProducts` seeding unchanged.
  Build confirms `/c/[slug]` and `/collection/[slug]` are ISR (`●`/Revalidate),
  not `ƒ`.
- **Regression:** full suite shows no new failures vs the pre-existing baseline
  (24 failing, env-config). PDP and both PLP routes build cleanly.

---

## 5. Risks & Notes

1. **PLP becoming ISR** means one shared cached HTML per slug. Valid because
   content is store-neutral. If product master content ever becomes store-
   scoped on web, this assumption breaks (same caveat as PDP).
2. **Staging `CATEGORY_NOT_FOUND`**: server `getCategoryProducts` still can't use
   the client-only Saleor fallback, so a 404 leaves the seed null and the client
   fetches (with the Saleor fallback) as today — unchanged behavior.
3. **Deleting `useProduct`/`ProductDetailView`** removes the only current
   consumer of `useProduct`. `getProduct` (service) stays. No other surface
   imports them (verified).
4. **`notFound()` on PDP** changes invalid-slug responses from 200 (empty shell)
   to 404 — intended improvement.

---

## 6. Out of Scope

- Removing the `polygonId` param from the service layer (kept intentionally).
- Changing `middleware.ts` cookie handling.
- Building the future price feature / `<ProductPrice>` island (tracked separately).
- Search SRP, store locator, any non-catalog surface.
- Cart/checkout/auth (out of Phase 1 web scope).
