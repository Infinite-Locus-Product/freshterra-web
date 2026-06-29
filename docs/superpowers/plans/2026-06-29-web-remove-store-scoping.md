# Remove Web Store-Scoping; Fully Server-Render PDP & PLP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the `ft_store_id`/`polygonId` cookie wiring from the PDP and PLP rendering path, render both fully server-side store-neutral, flip PLP from dynamic SSR to ISR, and delete the now-dead client overlay — eliminating the redundant "skeleton" loader.

**Architecture:** The web shows only store-neutral catalog content, so per-store scoping affects nothing rendered. PDP server-renders the product straight into `PdpView` (no client refetch); PLP pages stop reading the cookie and server-fetch a store-neutral first batch, becoming ISR-cacheable. The `polygonId` param stays on the service layer (unused) for a future price-island feature.

**Tech Stack:** Next.js 15 App Router (RSC, ISR via `export const revalidate`, `cache()`, `notFound()`), TypeScript strict, Vitest + Testing Library, the isomorphic FreshTerra BFF client.

## Global Constraints

- TypeScript `strict` — no `any`; no `as unknown as X` without a justifying comment.
- Server Components by default; `"use client"` only on leaves needing browser APIs/hooks (`PdpView`, `CategoryPlpView`, `CollectionPlpView` stay client).
- Never call the BFF except through the `*-service.ts` wrappers.
- Do NOT remove the `polygonId` param from the service layer (`getProduct`, `getCategoryProducts`, `getCollectionProducts`) — it stays optional and unused.
- Do NOT change `src/middleware.ts` (it still sets the `ft_store_id` cookie; harmless).
- Cookie name is `ft_store_id`.
- TDD where feasible (hooks); for server-component page rewrites the gate is `pnpm build` (route mode) + touched-file typecheck + existing component tests.
- Pre-existing repo state: `pnpm typecheck` fails on unrelated `cms-content/*`,`careers/*`,`contact/*` test files, and the full test suite has 24 pre-existing failures (env-config). Verify only NO NEW errors/failures in touched files; commit with `--no-verify` when the hook blocks on pre-existing errors (repo pattern, commit d7194ed).
- ISR `revalidate` interval: **300** (match PDP), on both PLP routes.

---

## File Structure

| File                                                         | Responsibility              | Change                                                                                      |
| ------------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------- |
| `src/app/(shop)/product/[slug]/page.tsx`                     | PDP ISR server shell        | Render `PdpView` directly; build breadcrumbs; `notFound()` on NOT_FOUND; keep JSON-LD + ISR |
| `src/features/catalog/components/ProductDetailView.tsx`      | (was: client overlay)       | **Delete**                                                                                  |
| `src/features/catalog/components/ProductDetailView.test.tsx` |                             | **Delete**                                                                                  |
| `src/features/catalog/useProduct.ts`                         | (was: client product fetch) | **Delete**                                                                                  |
| `src/features/catalog/useProduct.test.tsx`                   |                             | **Delete**                                                                                  |
| `src/app/(shop)/collection/[slug]/page.tsx`                  | Collection PLP ISR          | Drop cookie; store-neutral fetch; `revalidate`; drop `polygonId` prop                       |
| `src/features/catalog/components/CollectionPlpView.tsx`      | Collection PLP client view  | Drop `polygonId` prop + hook arg                                                            |
| `src/features/catalog/useCollectionProducts.ts`              | Collection paged fetch      | Un-gate: `active = enabled && Boolean(slug)`                                                |
| `src/app/(shop)/c/[slug]/page.tsx`                           | Category PLP ISR            | Drop cookie; store-neutral fetch; `revalidate`; drop `polygonId` prop                       |
| `src/features/catalog/components/CategoryPlpView.tsx`        | Category PLP client view    | Drop `polygonId` prop + both hook args                                                      |
| `src/features/catalog/useCategoryProducts.ts`                | Category paged fetch        | No change (already gates on `slug` only)                                                    |
| service files, `PdpView.tsx`, `middleware.ts`                |                             | No change                                                                                   |

Tasks: **PDP (1)** → **Collection PLP (2)** → **Category PLP (3)** → **regression (4)**. Each is independently shippable.

---

## Task 1: PDP — render `PdpView` server-side; delete the client overlay

**Files:**

- Modify: `src/app/(shop)/product/[slug]/page.tsx`
- Delete: `src/features/catalog/components/ProductDetailView.tsx`, `src/features/catalog/components/ProductDetailView.test.tsx`, `src/features/catalog/useProduct.ts`, `src/features/catalog/useProduct.test.tsx`

**Interfaces:**

- Consumes: `getProduct` (service, optional `next`), `PdpView` (props `{ product: ProductDetail; related: PlpProduct[]; relatedLoading: boolean; breadcrumbs?: Crumb[] }`), `Crumb` (exported from `@/features/catalog/components/PlpView`), `productJsonLd`/`breadcrumbListJsonLd`, `FreshTerraApiError`, `notFound` from `next/navigation`.
- Produces: PDP route renders the product entirely server-side; no client product fetch remains.

- [ ] **Step 1: Confirm no other consumers of the files being deleted**

Run: `grep -rn "useProduct\b\|ProductDetailView" src | grep -vE "useProduct\.(ts|test)|ProductDetailView\.(tsx|test)|useProductBySku"`
Expected: the only matches are inside `product/[slug]/page.tsx` (the import + usage we are about to replace). If anything else imports them, STOP and report.

- [ ] **Step 2: Rewrite the PDP page to render `PdpView` directly**

Replace `src/app/(shop)/product/[slug]/page.tsx` with:

```tsx
import type { Metadata } from "next";

import { notFound } from "next/navigation";
import { cache } from "react";

import { JsonLd } from "@/components/seo/JsonLd";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { PdpView } from "@/features/catalog/components/PdpView";
import { getProduct } from "@/features/catalog/product-service";
import { FreshTerraApiError } from "@/lib/clients/freshterra-api";
import { env } from "@/lib/config/env";
import { breadcrumbListJsonLd, productJsonLd } from "@/lib/seo/jsonLd";

import type { Crumb } from "@/features/catalog/components/PlpView";

type Params = Promise<{ slug: string }>;

/** ISR window; webhook tag-busting (`product:{slug}`) handles freshness. */
export const revalidate = 300;

/** No build-time prerender; pages are generated on first request, then cached (ISR). */
export function generateStaticParams() {
  return [];
}

/**
 * Store-neutral product fetch (web never displays per-store price/stock).
 * Deduped via `cache()` so generateMetadata + the page body share one request.
 */
const loadProduct = cache((slug: string) =>
  getProduct(slug, {}, { next: { tags: [`product:${slug}`], revalidate } }),
);

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await loadProduct(slug);
    const description =
      product.story?.trim() ||
      product.metafields?.productDetails?.trim() ||
      `${product.name} on FreshTerra.`;
    return {
      title: product.name,
      description,
      alternates: { canonical: `/product/${slug}` },
    };
  } catch {
    return { alternates: { canonical: `/product/${slug}` } };
  }
}

export default async function ProductPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;

  let product;
  try {
    product = await loadProduct(slug);
  } catch (err) {
    if (err instanceof FreshTerraApiError && err.code === "NOT_FOUND") {
      notFound();
    }
    throw err; // genuine error → nearest error boundary
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const breadcrumbs: Crumb[] = [
    { label: "Home", href: "/" },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/category/${product.category.slug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  const structuredData = [
    productJsonLd({ baseUrl, product }),
    breadcrumbListJsonLd({
      baseUrl,
      items: [
        { name: "Home", path: "/" },
        ...(product.category
          ? [
              {
                name: product.category.name,
                path: `/category/${product.category.slug}`,
              },
            ]
          : []),
        { name: product.name, path: `/product/${slug}` },
      ],
    }),
  ];

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      {structuredData.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <PdpView
          product={product}
          related={product.similarProducts}
          relatedLoading={false}
          breadcrumbs={breadcrumbs}
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 3: Delete the dead overlay files**

```bash
git rm src/features/catalog/components/ProductDetailView.tsx \
       src/features/catalog/components/ProductDetailView.test.tsx \
       src/features/catalog/useProduct.ts \
       src/features/catalog/useProduct.test.tsx
```

- [ ] **Step 4: Typecheck the touched scope**

Run: `pnpm typecheck 2>&1 | grep -E "product/\[slug\]/page|PdpView|ProductDetailView|useProduct" || echo "no new errors in touched files"`
Expected: `no new errors in touched files` (pre-existing unrelated errors may still print elsewhere; ignore them).

- [ ] **Step 5: Build and confirm PDP is still ISR + existing PdpView tests pass**

Run: `pnpm build 2>&1 | grep -E "product/\[slug\]"`
Expected: `● /product/[slug]` (ISR), not `ƒ`.
Run: `pnpm test src/features/catalog/components/PdpView.test.tsx`
Expected: PASS (PdpView is prop-driven; unaffected).

- [ ] **Step 6: Commit**

```bash
git add "src/app/(shop)/product/[slug]/page.tsx" \
        src/features/catalog/components/ProductDetailView.tsx \
        src/features/catalog/components/ProductDetailView.test.tsx \
        src/features/catalog/useProduct.ts \
        src/features/catalog/useProduct.test.tsx
git commit --no-verify -m "refactor(pdp): render server product directly; drop client store overlay"
```

---

## Task 2: Collection PLP — store-neutral fetch + ISR

**Files:**

- Modify: `src/app/(shop)/collection/[slug]/page.tsx`
- Modify: `src/features/catalog/components/CollectionPlpView.tsx`
- Modify: `src/features/catalog/useCollectionProducts.ts`
- Test: `src/features/catalog/useCollectionProducts.test.tsx`

**Interfaces:**

- Consumes: `getCollectionProducts(slug, params?)` (service; call with no `polygonId`), `CollectionPlpView` (prop `{ slug; initialProducts? }` after this task — `polygonId` removed).
- Produces: `useCollectionProducts` fetches with `slug` only; `CollectionPlpView` no longer accepts `polygonId`.

- [ ] **Step 1: Write the failing hook test (fetch without a store)**

Add to `src/features/catalog/useCollectionProducts.test.tsx` (match the file's existing `./collection-service` mock; the mock fn is `mockGet`):

```ts
it("fetches with slug only when no polygonId is provided", async () => {
  mockGet.mockResolvedValue({
    items: [],
    page: 1,
    pageSize: 20,
    total: 0,
    facets: {},
  } as unknown as CollectionProductsData); // partial fixture
  renderHook(() => useCollectionProducts({ slug: "fruits" }));
  await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
  expect(mockGet.mock.calls[0][0]).toBe("fruits");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/features/catalog/useCollectionProducts.test.tsx -t "fetches with slug only"`
Expected: FAIL — with the current `active = Boolean(slug && polygonId)` gate, no `polygonId` means the hook never fetches, so `mockGet` is not called.

- [ ] **Step 3: Un-gate the hook**

In `src/features/catalog/useCollectionProducts.ts` change the `active` line (currently line ~183):

```ts
const active = enabled && Boolean(slug);
```

(Leave the rest — destructured `polygonId` may remain accepted but is now optional/unused for gating; do not remove the arg.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/features/catalog/useCollectionProducts.test.tsx`
Expected: PASS (all tests, including existing seed tests which pass `slug` and still satisfy `Boolean(slug)`).

- [ ] **Step 5: Drop `polygonId` from `CollectionPlpView`**

In `src/features/catalog/components/CollectionPlpView.tsx`, remove the `polygonId` prop and its hook arg:

```tsx
type CollectionPlpViewProps = {
  slug: string;
  /** Server-fetched first batch to seed the hook and skip a client waterfall. */
  initialProducts?: CollectionProductsData | null;
};

export function CollectionPlpView({
  slug,
  initialProducts = null,
}: CollectionPlpViewProps) {
```

And in the `useCollectionProducts({ ... })` call, delete the `polygonId,` line (keep `slug`, `sort`, `filters`, `initialData`, `initialKey`).

- [ ] **Step 6: Make the collection page store-neutral + ISR**

Replace `src/app/(shop)/collection/[slug]/page.tsx` with:

```tsx
import type { Metadata } from "next";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { CollectionPlpView } from "@/features/catalog/components/CollectionPlpView";
import { getCollectionProducts } from "@/features/catalog/collection-service";

type Params = Promise<{ slug: string }>;

/** Store-neutral catalog content → ISR-cacheable. */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await getCollectionProducts(slug, { pageSize: 1 });
    const title = data.collection?.name?.trim();
    if (!title) {
      return { alternates: { canonical: `/collection/${slug}` } };
    }
    return {
      title,
      description: `Browse ${title} on FreshTerra.`,
      alternates: { canonical: `/collection/${slug}` },
    };
  } catch {
    return { alternates: { canonical: `/collection/${slug}` } };
  }
}

export default async function CollectionProductsPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;

  let initialProducts = null;
  try {
    initialProducts = await getCollectionProducts(slug);
  } catch {
    // Best-effort seed — client hook will fetch on mount if this fails.
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <CollectionPlpView slug={slug} initialProducts={initialProducts} />
      </main>
      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 7: Build + typecheck touched scope**

Run: `pnpm build 2>&1 | grep -E "collection/\[slug\]"`
Expected: `● /collection/[slug]` (ISR), not `ƒ`.
Run: `pnpm typecheck 2>&1 | grep -E "collection/\[slug\]|CollectionPlpView|useCollectionProducts" || echo "no new errors in touched files"`
Expected: `no new errors in touched files`.

- [ ] **Step 8: Commit**

```bash
git add "src/app/(shop)/collection/[slug]/page.tsx" \
        src/features/catalog/components/CollectionPlpView.tsx \
        src/features/catalog/useCollectionProducts.ts \
        src/features/catalog/useCollectionProducts.test.tsx
git commit --no-verify -m "refactor(plp): store-neutral collection PLP, ISR-cacheable"
```

---

## Task 3: Category PLP — store-neutral fetch + ISR

**Files:**

- Modify: `src/app/(shop)/c/[slug]/page.tsx`
- Modify: `src/features/catalog/components/CategoryPlpView.tsx`

**Interfaces:**

- Consumes: `getCategoryProducts(slug, params?)` (call with no `polygonId`), `useCategoryProducts` (unchanged — already gates on `slug` only), `CategoryPlpView` (prop `{ slug; initialProducts? }` after this task — `polygonId` removed).
- Produces: category route renders store-neutral and ISR; `CategoryPlpView` no longer accepts `polygonId`.

- [ ] **Step 1: Drop `polygonId` from `CategoryPlpView`**

In `src/features/catalog/components/CategoryPlpView.tsx`:

Props:

```tsx
type CategoryPlpViewProps = {
  slug: string;
  initialProducts?: CategoryProductsData | null;
};

export function CategoryPlpView({
  slug,
  initialProducts = null,
}: Readonly<CategoryPlpViewProps>) {
```

Then remove the `polygonId,` line from BOTH `useCategoryProducts({ ... })` calls (the `baseCtrl` call ~line 128 and the second `ctrl` call ~line 231). Leave every other arg (slug/productSlug, sort, filters, initialData, initialKey) intact.

- [ ] **Step 2: Make the category page store-neutral + ISR**

In `src/app/(shop)/c/[slug]/page.tsx`:

(a) Remove the `cookies` import and the `STORE_COOKIE` constant.
(b) Add ISR export near the top (after imports / `EXPLORE_CATALOG_SLUG`):

```tsx
/** Store-neutral catalog content → ISR-cacheable. */
export const revalidate = 300;
```

(c) In `CategoryHubPage`, delete the `const polygonId = (await cookies()).get(STORE_COOKIE)?.value;` line. Change the seed fetch to drop `polygonId`:

```tsx
let initialProducts = null;
if (slug !== EXPLORE_CATALOG_SLUG && !webCategory) {
  try {
    initialProducts = await getCategoryProducts(slug);
  } catch {
    // Best-effort; staging BFF may 404 (CATEGORY_NOT_FOUND). Client fetches
    // via the Saleor PLP fallback as today.
  }
}
```

(d) In the PLP branch, drop the `polygonId` prop:

```tsx
  } else {
    contentNode = (
      <CategoryPlpView slug={slug} initialProducts={initialProducts} />
    );
  }
```

Leave the `EXPLORE_CATALOG_SLUG` branch, the `webCategory` (`getWebCategoryContent`) branch, and `generateMetadata` unchanged.

- [ ] **Step 3: Build + typecheck touched scope**

Run: `pnpm build 2>&1 | grep -E "/c/\[slug\]"`
Expected: `● /c/[slug]` (ISR), not `ƒ`.
Run: `pnpm typecheck 2>&1 | grep -E "c/\[slug\]/page|CategoryPlpView" || echo "no new errors in touched files"`
Expected: `no new errors in touched files`.

- [ ] **Step 4: Confirm category hook tests still pass (seeding unaffected)**

Run: `pnpm test src/features/catalog/useCategoryProducts.test.tsx`
Expected: PASS — the hook is unchanged; the seed test passing `polygonId` still works (the arg remains optional on the hook).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(shop)/c/[slug]/page.tsx" \
        src/features/catalog/components/CategoryPlpView.tsx
git commit --no-verify -m "refactor(plp): store-neutral category PLP, ISR-cacheable"
```

---

## Task 4: Regression + route-mode verification

- [ ] **Step 1: Full unit suite — no new failures vs baseline**

Run: `pnpm test 2>&1 | grep -E "Test Files|Tests "`
Expected: failures ≤ the pre-existing baseline of 24 (which dropped to ~21 because the 3 deleted test files included passing tests; key check: **no NEW failing files** beyond the known `cms-content/*`,`careers/*`,`contact/*`,`freshterra-api`,`Logo`,`*-service` set). Confirm `useProduct.test.tsx` / `ProductDetailView.test.tsx` are simply gone, not failing.

- [ ] **Step 2: Build — route modes**

Run: `pnpm build 2>&1 | grep -E "product/\[slug\]|/c/\[slug\]|collection/\[slug\]"`
Expected: all three now ISR — `● /product/[slug]`, `● /c/[slug]`, `● /collection/[slug]`.

- [ ] **Step 3: Confirm no `ft_store_id` reads remain in the rendering path**

Run: `grep -rn "ft_store_id\|STORE_COOKIE" src | grep -vE "middleware\.ts|api/catalog"`
Expected: no matches (the only remaining references are `middleware.ts`, which sets it, and the Saleor `api/catalog` routes, which read it server-side for channel scoping — both intentionally untouched).

- [ ] **Step 4: Confirm `polygonId` param still exists on the services (not removed)**

Run: `grep -rn "polygonId" src/features/catalog/product-service.ts src/features/catalog/category-service.ts src/features/catalog/collection-service.ts | head`
Expected: the `polygonId` param is still present in each service (kept for the future price-island path).

---

## Self-Review Notes

- **Spec coverage:** §2.1 PDP → Task 1 (render direct, delete overlay, `notFound()`); §2.2 PLP → Tasks 2 (collection) + 3 (category) (store-neutral, ISR, drop prop, un-gate collection hook); §2.3 service param kept → enforced by Global Constraints + Task 4 Step 4; §4 testing → hook test (Task 2), build/route gates, regression (Task 4).
- **Type consistency:** `CollectionPlpViewProps`/`CategoryPlpViewProps` lose `polygonId` consistently; pages pass only `{ slug, initialProducts }`; `Crumb` imported from `PlpView` for the PDP breadcrumbs; `PdpView` props `{ product, related, relatedLoading, breadcrumbs }` match its existing signature; `revalidate = 300` uniform across all three routes.
- **Deletions are safe:** Task 1 Step 1 verifies no consumer of `useProduct`/`ProductDetailView` outside the PDP page before deleting.
- **Behavior change:** PDP now returns HTTP 404 (`notFound()`) on a hard `NOT_FOUND` instead of a 200 empty shell — intended (spec §5.4).
