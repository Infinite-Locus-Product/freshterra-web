# PLP/PDP Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop `apiFetch` from error-logging expected 404s, and make the Category PLP's displayed grid use the server-seeded first batch (removing the skeleton flash and the canceled+refetched product request).

**Architecture:** Add an opt-in `expectedErrorCodes` to `apiFetch` so control-flow 404s (CMS probe, PDP not-found, PLP best-effort seeds) don't `console.error`. Separately, seed the Category PLP's _displayed_ controller (`ctrl`), with a filters-aware guard and a sort-aligned server seed, so the default category view renders server data with zero client product fetches.

**Tech Stack:** Next.js 15 App Router (RSC/ISR), TypeScript strict, Vitest + Testing Library, Playwright (network verification), the FreshTerra BFF client.

## Global Constraints

- TypeScript `strict` — no `any`; no `as unknown as X` without a justifying comment.
- **Commit hygiene (critical):** the working tree holds the user's uncommitted badge work (`PdpView.tsx`, `pdp-page.ts`). Every commit MUST `git add` explicit file paths — NEVER `git add -u` / `git add .` / `git add -A`.
- `expectedErrorCodes` is opt-in: only named call sites suppress logging; a 404 elsewhere still logs.
- `apiFetch` applies `next` server-side only — unchanged.
- Do NOT remove `polygonId` params from services; do NOT modify `middleware.ts`.
- `DEFAULT_CATEGORY_SORT` value is `"price_asc"`; `DEFAULT_COLLECTION_SORT` is `"relevance"` (left as-is).
- Pre-existing repo state: `pnpm typecheck` and the full suite fail on unrelated `cms-content/*`,`careers/*`,`contact/*` + env-config (`Invalid URL`) cases (24 baseline failures). Verify only NO NEW failures/errors in touched files; commit with `--no-verify` when the hook blocks on pre-existing errors (repo pattern, commit d7194ed).
- All three routes must remain ISR (`●`) after changes.

---

## File Structure

| File                                                       | Responsibility     | Change                                                                          |
| ---------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------- |
| `src/lib/clients/freshterra-api.ts`                        | BFF client         | add `expectedErrorCodes?` to options; gate `logError` via a `maybeLog` helper   |
| `src/lib/clients/freshterra-api.test.ts`                   | client tests       | add expected-code suppression tests                                             |
| `src/features/cms-content/content-entry-service.ts`        | CMS entry fetch    | add `expectedErrorCodes?`; forward                                              |
| `src/features/cms-content/web-category-content-service.ts` | category CMS probe | pass `expectedErrorCodes: ['NOT_FOUND']`                                        |
| `src/features/catalog/product-service.ts`                  | product fetch      | add `expectedErrorCodes?` to `GetProductRequestOptions`; forward                |
| `src/features/catalog/category-service.ts`                 | category fetch     | add `expectedErrorCodes?`; forward; **export `DEFAULT_CATEGORY_SORT`**          |
| `src/features/catalog/collection-service.ts`               | collection fetch   | add `expectedErrorCodes?`; forward                                              |
| `src/app/(shop)/product/[slug]/page.tsx`                   | PDP                | `loadProduct` passes `expectedErrorCodes: ['NOT_FOUND']`                        |
| `src/app/(shop)/collection/[slug]/page.tsx`                | collection PLP     | seed + metadata fetches pass `expectedErrorCodes: ['NOT_FOUND']`                |
| `src/app/(shop)/c/[slug]/page.tsx`                         | category PLP       | seed passes `sort: DEFAULT_CATEGORY_SORT` + `expectedErrorCodes: ['NOT_FOUND']` |
| `src/features/catalog/components/CategoryPlpView.tsx`      | category view      | import shared sort; seed `ctrl` with filters-aware `initialKey`                 |

Tasks: **A1 apiFetch+CMS (1)** → **A2 services+page opt-ins (2)** → **B category grid seed (3)** → **regression+verify (4)**.

---

## Task 1: `apiFetch` `expectedErrorCodes` + CMS probe opt-in

**Files:**

- Modify: `src/lib/clients/freshterra-api.ts`
- Modify: `src/lib/clients/freshterra-api.test.ts`
- Modify: `src/features/cms-content/content-entry-service.ts`
- Modify: `src/features/cms-content/web-category-content-service.ts`

**Interfaces:**

- Consumes: `ApiErrorCode` (exported type), `FreshTerraApiError`.
- Produces: `ApiFetchOptions.expectedErrorCodes?: ApiErrorCode[]`; `ContentEntryRequestOptions.expectedErrorCodes?: ApiErrorCode[]`. When set, `apiFetch` skips `console.error` for a thrown error whose `code` ∈ the list (still throws).

- [ ] **Step 1: Write the failing tests**

In `src/lib/clients/freshterra-api.test.ts` (reuses the existing `errorResponse(status, code)` helper and `global.fetch` stub):

```ts
it("suppresses console.error for an expected error code (still throws)", async () => {
  const fetchMock = vi.fn().mockResolvedValue(errorResponse(404, "NOT_FOUND"));
  vi.stubGlobal("fetch", fetchMock);
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  await expect(
    apiFetch("/api/v1/products/missing", { expectedErrorCodes: ["NOT_FOUND"] }),
  ).rejects.toMatchObject({ code: "NOT_FOUND" });
  expect(spy).not.toHaveBeenCalled();

  spy.mockRestore();
});

it("still logs an unexpected error code not in expectedErrorCodes", async () => {
  const fetchMock = vi.fn().mockResolvedValue(errorResponse(500, null));
  vi.stubGlobal("fetch", fetchMock);
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  await expect(
    apiFetch("/api/v1/products/x", { expectedErrorCodes: ["NOT_FOUND"] }),
  ).rejects.toBeInstanceOf(FreshTerraApiError);
  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockRestore();
});

it("logs a 404 when expectedErrorCodes is not provided", async () => {
  const fetchMock = vi.fn().mockResolvedValue(errorResponse(404, "NOT_FOUND"));
  vi.stubGlobal("fetch", fetchMock);
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  await expect(apiFetch("/api/v1/products/missing")).rejects.toMatchObject({
    code: "NOT_FOUND",
  });
  expect(spy).toHaveBeenCalledTimes(1);

  spy.mockRestore();
});
```

Confirm `FreshTerraApiError` is imported in the test file (add to the existing import if missing). If `errorResponse` does not exist verbatim, mirror the file's existing helper for building a non-2xx envelope response.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/lib/clients/freshterra-api.test.ts -t "expected error code"`
Expected: FAIL — `expectedErrorCodes` not yet honored, so `console.error` is called in the first test.

- [ ] **Step 3: Add the option and gate logging**

In `ApiFetchOptions<T>` add:

```ts
  /**
   * Error codes the caller treats as control flow (e.g. `NOT_FOUND` for a
   * probe-and-fallback or `notFound()`). A thrown error whose code is listed
   * here is NOT logged via console.error — it is still thrown.
   */
  expectedErrorCodes?: ApiErrorCode[];
```

In `apiFetch`, destructure it and add a local gate after `logContext` is defined:

```ts
const {
  method = "GET",
  searchParams,
  body,
  signal,
  schema,
  next,
  allowNullData,
  expectedErrorCodes,
} = options;
```

```ts
const logContext = { url, method };
const maybeLog = (
  apiError: FreshTerraApiError,
  ctx: Record<string, unknown>,
) => {
  if (expectedErrorCodes?.includes(apiError.code)) return;
  logError(apiError, ctx);
};
```

Replace all five `logError(apiError, ...)` call sites inside `apiFetch` with `maybeLog(apiError, ...)` (the network-error site, the `!res.ok` site, the malformed-envelope site, the unsuccessful-payload site, and the schema-validation site that passes `{ ...logContext, issues: parsed.error.issues }`). Leave the standalone `logError` function definition as-is.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/lib/clients/freshterra-api.test.ts`
Expected: PASS (new tests + existing ones). Output pristine.

- [ ] **Step 5: Thread `expectedErrorCodes` through `getContentEntry`**

In `src/features/cms-content/content-entry-service.ts`, add to `ContentEntryRequestOptions<T>`:

```ts
  /** Error codes treated as control flow — skips console.error (see apiFetch). */
  expectedErrorCodes?: ApiErrorCode[];
```

Import the type: `import { apiFetch, type ApiFetchNextOptions, type ApiErrorCode } from "@/lib/clients/freshterra-api";` (extend the existing import). In the `apiFetch(...)` call inside `getContentEntry`, add `expectedErrorCodes: options.expectedErrorCodes,` alongside `next: options.next`.

- [ ] **Step 6: Opt in from the category CMS probe**

In `src/features/cms-content/web-category-content-service.ts`, update the `getContentEntry` call:

```ts
return getContentEntry<WebCategoryContent>(
  "webs",
  slug,
  {},
  {
    schema: webCategoryContentSchema,
    expectedErrorCodes: ["NOT_FOUND"],
  },
);
```

- [ ] **Step 7: Typecheck touched scope + commit**

Run: `pnpm typecheck 2>&1 | grep -E "freshterra-api|content-entry-service|web-category-content-service" || echo "no new errors in touched files"`
Expected: `no new errors in touched files`.

```bash
git add src/lib/clients/freshterra-api.ts src/lib/clients/freshterra-api.test.ts \
        src/features/cms-content/content-entry-service.ts \
        src/features/cms-content/web-category-content-service.ts
git commit --no-verify -m "feat(api): expectedErrorCodes to suppress logging of handled 404s"
```

---

## Task 2: Catalog services passthrough + PDP/PLP page opt-ins

**Files:**

- Modify: `src/features/catalog/product-service.ts`, `category-service.ts`, `collection-service.ts`
- Modify: `src/app/(shop)/product/[slug]/page.tsx`, `src/app/(shop)/collection/[slug]/page.tsx`, `src/app/(shop)/c/[slug]/page.tsx`
- Test: `src/features/catalog/product-service.test.ts`

**Interfaces:**

- Consumes: `apiFetch` `expectedErrorCodes` (Task 1), `ApiErrorCode`.
- Produces: `GetProductRequestOptions`, `CategoryProductsRequestOptions`, `CollectionProductsRequestOptions` each gain `expectedErrorCodes?: ApiErrorCode[]`, forwarded to `apiFetch`.

- [ ] **Step 1: Write the failing test (product service forwards the option)**

Add to `src/features/catalog/product-service.test.ts` (mirrors the existing `next`-passthrough test; stubs `window` undefined is not needed here — assert the option reaches `fetch` indirectly by spying on console.error):

```ts
it("does not log a 404 when expectedErrorCodes includes NOT_FOUND", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(errorResponse(404, "PRODUCT_NOT_FOUND"));
  vi.stubGlobal("fetch", fetchMock);
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});

  await expect(
    getProduct("prd_x", {}, { expectedErrorCodes: ["NOT_FOUND"] }),
  ).rejects.toMatchObject({ code: "NOT_FOUND" });
  expect(spy).not.toHaveBeenCalled();

  spy.mockRestore();
});
```

(Use the file's existing `errorResponse` helper; the BFF maps a 404 to code `NOT_FOUND` with serverCode `PRODUCT_NOT_FOUND`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/features/catalog/product-service.test.ts -t "expectedErrorCodes"`
Expected: FAIL — option not forwarded yet, so `console.error` fires.

- [ ] **Step 3: Add `expectedErrorCodes` to the three services**

In each service, import `type ApiErrorCode` from `@/lib/clients/freshterra-api` (extend the existing import), add to the request-options interface:

```ts
  /** Error codes treated as control flow — skips console.error (see apiFetch). */
  expectedErrorCodes?: ApiErrorCode[];
```

and add `expectedErrorCodes: options.expectedErrorCodes,` to the `apiFetch(...)` call (alongside `next: options.next`):

- `product-service.ts` → `getProduct` (and it is fine to leave `getProductBySku`/`getRelatedProducts` unchanged — not used by these opt-in sites).
- `category-service.ts` → the `apiFetch` inside `getCategoryProducts`'s `try` (NOT the client-only Saleor fallback).
- `collection-service.ts` → `getCollectionProducts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/features/catalog/product-service.test.ts`
Expected: PASS.

- [ ] **Step 5: Opt in from the PDP page**

In `src/app/(shop)/product/[slug]/page.tsx`, update `loadProduct`:

```ts
const loadProduct = cache((slug: string) =>
  getProduct(
    slug,
    {},
    {
      next: { tags: [`product:${slug}`], revalidate },
      expectedErrorCodes: ["NOT_FOUND"],
    },
  ),
);
```

- [ ] **Step 6: Opt in from the collection page**

In `src/app/(shop)/collection/[slug]/page.tsx`, add `expectedErrorCodes: ["NOT_FOUND"]` as the third arg to BOTH `getCollectionProducts` calls:

- metadata: `getCollectionProducts(slug, { pageSize: 1 }, { expectedErrorCodes: ["NOT_FOUND"] })`
- body seed: `getCollectionProducts(slug, {}, { expectedErrorCodes: ["NOT_FOUND"] })`

- [ ] **Step 7: Opt in from the category page (seed fetch)**

In `src/app/(shop)/c/[slug]/page.tsx`, update the seed fetch (sort is added in Task 3; for now just the option):

```ts
initialProducts = await getCategoryProducts(
  slug,
  {},
  {
    expectedErrorCodes: ["NOT_FOUND"],
  },
);
```

- [ ] **Step 8: Build + typecheck + commit**

Run: `pnpm build 2>&1 | grep -E "product/\[slug\]|/c/\[slug\]|collection/\[slug\]"`
Expected: all three still `●`.
Run: `pnpm typecheck 2>&1 | grep -E "product-service|category-service|collection-service|product/\[slug\]|c/\[slug\]|collection/\[slug\]" || echo "no new errors in touched files"`
Expected: `no new errors in touched files`.

```bash
git add src/features/catalog/product-service.ts src/features/catalog/category-service.ts \
        src/features/catalog/collection-service.ts src/features/catalog/product-service.test.ts \
        "src/app/(shop)/product/[slug]/page.tsx" "src/app/(shop)/collection/[slug]/page.tsx" \
        "src/app/(shop)/c/[slug]/page.tsx"
git commit --no-verify -m "feat(catalog): opt PDP/PLP fetches into expectedErrorCodes for handled 404s"
```

---

## Task 3: Seed the Category PLP's displayed grid + align seed sort

**Files:**

- Modify: `src/features/catalog/category-service.ts` (export `DEFAULT_CATEGORY_SORT`)
- Modify: `src/features/catalog/components/CategoryPlpView.tsx`
- Modify: `src/app/(shop)/c/[slug]/page.tsx`

**Interfaces:**

- Consumes: `useCategoryProducts` `initialData`/`initialKey` (existing), `getCategoryProducts` (Task 2 option).
- Produces: `DEFAULT_CATEGORY_SORT` exported from `category-service.ts`; the category page seed uses that sort; `CategoryPlpView`'s `ctrl` is seeded on the default view.

- [ ] **Step 1: Export the shared sort constant**

In `src/features/catalog/category-service.ts`, add near the other exported defaults (e.g. below `DEFAULT_CATEGORY_PAGE_SIZE`):

```ts
/** Default PLP sort; shared by the server seed fetch and the client controllers. */
export const DEFAULT_CATEGORY_SORT = "price_asc" as const;
```

- [ ] **Step 2: Use the shared constant in `CategoryPlpView`**

In `src/features/catalog/components/CategoryPlpView.tsx`, remove the local
`const DEFAULT_CATEGORY_SORT = "price_asc" as const;` (line ~25) and import it:

```ts
import {
  DEFAULT_CATEGORY_SORT,
  // ...keep any existing imports from this module...
} from "@/features/catalog/category-service";
```

(If the file does not already import from `category-service`, add the import in the correct group per the repo's import order.)

- [ ] **Step 3: Seed the displayed `ctrl` controller**

In `CategoryPlpView`, update the `ctrl` call (the one at ~line 228 that uses `filters`) to seed on the default view. It must receive the same `initialProducts` prop the view already accepts:

```tsx
const ctrl = useCategoryProducts({
  slug: productSlug,
  sort: DEFAULT_CATEGORY_SORT,
  filters,
  initialData: initialProducts,
  initialKey: !filters && productSlug === slug ? slug : undefined,
});
```

Leave `baseCtrl` unchanged (it stays seeded with `initialKey: slug` for facets). Do not change any tab/CMS/`productSlug` logic.

- [ ] **Step 4: Align the category page seed sort**

In `src/app/(shop)/c/[slug]/page.tsx`, import the shared sort and pass it to the seed fetch (keeping the `expectedErrorCodes` from Task 2):

```ts
import {
  getCategoryProducts,
  DEFAULT_CATEGORY_SORT,
} from "@/features/catalog/category-service";
```

```ts
initialProducts = await getCategoryProducts(
  slug,
  { sort: DEFAULT_CATEGORY_SORT },
  { expectedErrorCodes: ["NOT_FOUND"] },
);
```

- [ ] **Step 5: Build + typecheck**

Run: `pnpm build 2>&1 | grep -E "/c/\[slug\]"`
Expected: `● /c/[slug]` (ISR).
Run: `pnpm typecheck 2>&1 | grep -E "category-service|CategoryPlpView|c/\[slug\]/page" || echo "no new errors in touched files"`
Expected: `no new errors in touched files`.

- [ ] **Step 6: Commit**

```bash
git add src/features/catalog/category-service.ts \
        src/features/catalog/components/CategoryPlpView.tsx \
        "src/app/(shop)/c/[slug]/page.tsx"
git commit --no-verify -m "perf(plp): seed category grid from server batch; align seed sort"
```

---

## Task 4: Regression + live network verification

- [ ] **Step 1: Full unit suite — no new failures**

Run: `pnpm test 2>&1 | grep -E "Test Files|Tests "`
Expected: failures ≤ the pre-existing baseline (the new apiFetch + product-service tests pass; no new failing files beyond the known `cms-content/*`,`careers/*`,`contact/*`,`freshterra-api`\* set — note `freshterra-api.test.ts` should now have MORE passing tests).

- [ ] **Step 2: Build — all three routes ISR**

Run: `pnpm build 2>&1 | grep -E "product/\[slug\]|/c/\[slug\]|collection/\[slug\]"`
Expected: `● /product/[slug]`, `● /c/[slug]`, `● /collection/[slug]`.

- [ ] **Step 3: Live network capture — default category PLP makes no product fetch / no canceled request**

With the dev server running (port 3000), capture a client-side navigation to a category PLP and assert the product-fetch behavior. Use a Playwright script (chromium via `@playwright/test`, run with `NODE_PATH="$(pwd)/node_modules"`). It must:

- start at `/`, clear cookies, then click a category link (e.g. `/c/herbs-seasoning`);
- record all requests whose URL contains `/products?` and their final status;
- assert: **0** requests to `…/products?…` are issued on the default load (seeded), and **none** is `(canceled)`.
  Then, as a control, click a filter/tab and assert a `products?…filters=…` request IS issued.
  Report the captured request list. (If the BFF is unreachable so the seed is null, note that the assertion can't be verified and fall back to confirming the build route mode only.)

- [ ] **Step 4: Confirm no `git add -u` was used + working tree still holds the badge work**

Run: `git status --short | grep -E "PdpView|pdp-page"`
Expected: both files still show as modified (` M`) — the user's uncommitted badge work is intact and was not swept into any task commit.

---

## Self-Review Notes

- **Spec coverage:** Part A → Task 1 (apiFetch + CMS probe) + Task 2 (services + PDP/PLP opt-ins); Part B → Task 3 (shared sort + seed `ctrl` + aligned seed sort). Testing → Task 1 unit tests, Task 4 Playwright capture + regression. Risk #3 (commit hygiene) → Global Constraints + Task 4 Step 4.
- **Type consistency:** `expectedErrorCodes?: ApiErrorCode[]` is identical across `ApiFetchOptions`, `ContentEntryRequestOptions`, and the three service option interfaces; all forward via the same `expectedErrorCodes: options.expectedErrorCodes` shape. `DEFAULT_CATEGORY_SORT` is defined once (category-service) and imported by the view + page. The `ctrl` seed uses `initialData`/`initialKey` — the exact names `useCategoryProducts` already accepts.
- **No placeholders:** every code step shows the actual code; the Playwright assertion describes exact request-matching criteria.
