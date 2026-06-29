# PLP/PDP Polish: Quiet Handled-404 Logging + Seed Category Grid — Design

**Date:** 2026-06-29
**Status:** Approved (design); pending implementation plan
**Goal:** Two scoped fixes surfaced while QA-ing the store-neutral PLP/PDP work:
(A) stop `apiFetch` from logging _expected_ 404s at error level, and (B) make
the Category PLP's **displayed** product grid use the server-seeded first batch
(today the seed feeds a facets-only controller, so the visible grid still
client-fetches — causing a skeleton flash and a canceled+refetched request).

Builds on `fixes/product-testing` (the rendering-alignment + remove-store-scoping
work). Net principle for these surfaces: **server provides page-1 + facets
(store-neutral, ISR-cached); the client fetches only on user interaction.**

---

## Part A — `apiFetch`: skip error-logging for _expected_ error codes (#2)

### Problem

`apiFetch` calls `logError` (`console.error`) on every failed BFF response —
including 404s that callers treat as normal control flow — _before_ throwing.
Now that catalog fetches run server-side, Next's dev overlay surfaces these.
The dominant case: `getWebCategoryContent(slug)` → `GET /api/v1/content/webs/:slug`
returns 404 for any plain PLP category (it's a probe; the page falls back to the
PLP). Confirmed 404 on staging; it is caught and the PLP renders — but the red
`console.error` already fired. PDP `getProduct` (→ `notFound()`) and the PLP
best-effort seeds have the same shape.

### Design

- Add `expectedErrorCodes?: ApiErrorCode[]` to `ApiFetchOptions` in
  `src/lib/clients/freshterra-api.ts`. At each `logError` call site, skip the
  log when the resolved error `code` is included in `expectedErrorCodes`. The
  error is **still thrown** — only the logging is suppressed.
- Thread the option through `getContentEntry` (`ContentEntryRequestOptions`,
  already forwards `signal`/`token`/`schema`/`next`).
- Callers that treat a 404 as control flow pass `expectedErrorCodes: ['NOT_FOUND']`:
  - `getWebCategoryContent` (the probe — primary offender).
  - PDP `loadProduct` → `getProduct(...)` (404 → `notFound()`).
  - The PLP best-effort seed calls (`getCategoryProducts`/`getCollectionProducts`
    in the page bodies) — 404/degrade to a null seed.
- To pass it from the catalog services, add `expectedErrorCodes?: ApiErrorCode[]`
  to their request-options interfaces (`GetProductRequestOptions`,
  `CategoryProductsRequestOptions`, `CollectionProductsRequestOptions`) and
  forward to `apiFetch`, mirroring the existing `next` passthrough.

### Result

Expected 404s no longer emit `console.error`; genuinely unexpected failures
(5xx, parse, network, and _unexpected_ 404s at call sites that did not opt in)
still log with full structured context.

---

## Part B — Category PLP: seed the displayed grid + align seed sort (#3)

### Problem

`CategoryPlpView` runs two `useCategoryProducts` controllers:

- `baseCtrl` — fetches **unfiltered** to provide the stable facet/tag set for the
  filter tabs. It is seeded (`initialData`/`initialKey={slug}`).
- `ctrl` — fetches the **filtered** list and is what renders the grid
  (`items={ctrl.items}`). It is **not** seeded.

So the visible grid always client-fetches on mount (skeleton flash), ignoring the
server seed. Worse, `ctrl`'s `filters` resolve in two stages (`activeTab` starts
`"all"` → `filters=undefined` → fetch; then the active tab/tag resolves →
`filters` change → the in-flight request is **aborted** ("canceled") and
re-fired). Additionally, the page seeds with `getCategoryProducts(slug)` (BFF
default sort) while the controllers declare `sort: "price_asc"`
(`DEFAULT_CATEGORY_SORT`), so seeded data would be sorted inconsistently with the
grid's claim.

### Design

1. **Share the sort constant.** Move `DEFAULT_CATEGORY_SORT = "price_asc"` out of
   `CategoryPlpView.tsx` into a server-safe module (`category-service.ts`).
   Import it in both the page and the view.
2. **Align the seed sort.** The category page server-fetches the seed with that
   sort: `getCategoryProducts(slug, { sort: DEFAULT_CATEGORY_SORT })` (plus the
   `expectedErrorCodes: ['NOT_FOUND']` from Part A). Seeded data now matches the
   grid's declared sort.
3. **Seed the displayed controller `ctrl`.** Pass `initialData={initialProducts}`
   and a filters-aware guard:
   `initialKey={!filters && productSlug === slug ? slug : undefined}`.

### Why the guard is sufficient

- **Default tab** (no filters, `productSlug === slug`): `ctrl` seeds → grid shows
  server data immediately (no skeleton); the mount fetch is skipped (Task 6's
  `skipNextFetchRef`), so there is **no in-flight request to cancel** when the
  active tab resolves → the canceled+refetch disappears. Combined with the
  already-seeded `baseCtrl`, the default view makes **zero client product
  fetches** (only the separate CMS-tab fetch remains).
- **L4-tab redirect** (`productSlug !== slug`) **or an active filter**:
  `initialKey` is `undefined` → no seed → `ctrl` fetches normally, exactly as
  today. The seed (fetched for the route `slug`, unfiltered) never masks a
  filtered/redirected view.

`baseCtrl` is unchanged — it intentionally fetches unfiltered to keep the tab set
stable, and is already seeded.

### Result

Default category PLP load: server-rendered grid, no skeleton, no canceled
request, zero client product fetches. Filtering/tab-switching still fetches on
interaction (correct).

---

## Components & Boundaries

| File                                                       | Change                                                                                                     |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/lib/clients/freshterra-api.ts`                        | add `expectedErrorCodes?: ApiErrorCode[]` to `ApiFetchOptions`; guard each `logError` call                 |
| `src/features/cms-content/content-entry-service.ts`        | add `expectedErrorCodes?` to options; forward to `apiFetch`                                                |
| `src/features/cms-content/web-category-content-service.ts` | pass `expectedErrorCodes: ['NOT_FOUND']` to `getContentEntry`                                              |
| `src/features/catalog/product-service.ts`                  | add `expectedErrorCodes?` to `GetProductRequestOptions`; forward                                           |
| `src/features/catalog/category-service.ts`                 | add `expectedErrorCodes?` to `CategoryProductsRequestOptions`; forward; **export `DEFAULT_CATEGORY_SORT`** |
| `src/features/catalog/collection-service.ts`               | add `expectedErrorCodes?` to `CollectionProductsRequestOptions`; forward                                   |
| `src/app/(shop)/product/[slug]/page.tsx`                   | `loadProduct` passes `expectedErrorCodes: ['NOT_FOUND']`                                                   |
| `src/app/(shop)/c/[slug]/page.tsx`                         | seed fetch passes `sort: DEFAULT_CATEGORY_SORT` + `expectedErrorCodes: ['NOT_FOUND']`                      |
| `src/app/(shop)/collection/[slug]/page.tsx`                | seed fetch passes `expectedErrorCodes: ['NOT_FOUND']`                                                      |
| `src/features/catalog/components/CategoryPlpView.tsx`      | import shared `DEFAULT_CATEGORY_SORT`; seed `ctrl` with filters-aware `initialKey`                         |

No change to `useCategoryProducts`/`useCollectionProducts` (the seeding mechanics
from prior tasks already support `initialData`/`initialKey`). No change to
`middleware.ts`. `polygonId` service params remain (unused).

---

## Testing

- **Part A:** unit test in `freshterra-api.test.ts` — stub `console.error`; on a
  non-2xx response, assert `console.error` is **not** called when the resolved
  code is in `expectedErrorCodes`, **is** called when it is not, and the
  `FreshTerraApiError` is thrown in both cases.
- **Part B:** the view is integration-heavy; the gates are:
  - `pnpm build` → `/c/[slug]` remains `●` (ISR).
  - A Playwright network capture of a default category PLP load (client-side
    nav): **0 `…/products?…` requests and no `(canceled)` request**, grid
    content present without a skeleton. (Contrast: today shows a canceled +
    refetched `products` call.)
  - Filtering still issues a `products?…filters=…` request.
- **Regression:** full suite shows no new failures vs the pre-existing baseline
  (24 failing, env-config); `/product/[slug]`, `/c/[slug]`, `/collection/[slug]`
  all build `●`.

---

## Risks & Notes

1. **Seed sort coupling:** the page's seed sort must equal the controllers'
   `DEFAULT_CATEGORY_SORT`; sharing the constant prevents drift. (Collection uses
   `DEFAULT_COLLECTION_SORT = "relevance"`, which matches the BFF default, so its
   single-controller seed is already consistent — left as-is.)
2. **`expectedErrorCodes` is opt-in:** only the named call sites suppress 404
   logging; everywhere else a 404 still logs. This is deliberate — it keeps
   genuinely unexpected 404s visible.
3. **Commit hygiene:** the working tree holds the user's uncommitted badge work
   (`PdpView.tsx`, `pdp-page.ts`); every commit in this work MUST stage explicit
   file paths (never `git add -u`/`git add .`) so that work is not swept in.

---

## Out of Scope

- Consolidating `baseCtrl`/`ctrl` into one controller (they serve distinct
  roles: stable unfiltered facets vs filtered list).
- The CMS-tab fetch (`useWebCategoryPlp`).
- Changing the `price_asc` default sort itself.
- Refactoring `getWebCategoryContent` to return "no content" as an empty result
  instead of a thrown 404 (a deeper-correct change; the opt-in suppression is
  sufficient now).
