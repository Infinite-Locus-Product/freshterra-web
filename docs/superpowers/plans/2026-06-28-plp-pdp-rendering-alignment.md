# PLP & PDP Rendering Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make PDP render as an ISR-cached, store-neutral server shell with a client price/stock overlay, and make Category/Collection PLP server-render their first product batch (SSR), per `CLAUDE.md` §4.

**Architecture:** The presentational views (`PdpView`, `PlpView`) already take data as props; only the fetching wrappers and their hooks change. Each route fetches initial data server-side and passes it as an `initialData`/`initialProduct` prop; the existing client hook seeds its state from that prop (no skeleton, content in HTML) and re-fetches client-side only for store-specific deltas (PDP) or further pages/filters (PLP). PDP drops its page-level cookie read so it stays ISR-eligible; PLP pages keep reading the cookie (they are already dynamic SSR).

**Tech Stack:** Next.js 15 App Router (RSC, `cache()`, fetch `next: { tags, revalidate }`), TypeScript strict, Vitest + Testing Library, the isomorphic FreshTerra BFF client (`apiFetch`).

## Global Constraints

- TypeScript `strict: true` — no `any`, no `as unknown as X` without a justifying comment.
- Server Components by default; `"use client"` only on leaves that need browser APIs/hooks.
- Never call the BFF except through `apiFetch` / the existing `*-service.ts` wrappers (`CLAUDE.md` §5).
- Never hardcode `store_id`/`polygonId`, keys, or pixel sizes — they come from env/context/cookie.
- Store cookie name is `ft_store_id` (defined as `STORE_COOKIE` in `src/middleware.ts`); it is **not** `httpOnly`, so it is client-readable.
- TDD: write the failing test first, then the minimal code (`CLAUDE.md` §9). Frequent commits.
- Run `pnpm test <path>` for unit tests; `pnpm typecheck` before declaring a task done.
- `apiFetch` only applies `next: { tags, revalidate }` when `typeof window === "undefined"` — server calls only. Client calls ignore it.

---

## File Structure

| File                                                    | Responsibility                     | Change                                                               |
| ------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| `src/features/catalog/product-service.ts`               | Isomorphic product fetch           | add `next` passthrough to `getProduct`                               |
| `src/features/catalog/category-service.ts`              | Isomorphic category PLP fetch      | add `next` passthrough to `getCategoryProducts`                      |
| `src/features/catalog/collection-service.ts`            | Isomorphic collection PLP fetch    | add `next` passthrough to `getCollectionProducts`                    |
| `src/features/catalog/useProduct.ts`                    | Client PDP fetch                   | add `initialData` seeding                                            |
| `src/features/catalog/useCategoryProducts.ts`           | Client category paged fetch        | add `initialData` seeding                                            |
| `src/features/catalog/useCollectionProducts.ts`         | Client collection paged fetch      | add `initialData` seeding                                            |
| `src/features/catalog/components/ProductDetailView.tsx` | PDP client wrapper / price overlay | accept `initialProduct`; read cookie client-side                     |
| `src/features/catalog/components/CategoryPlpView.tsx`   | Category PLP client wrapper        | accept + seed `initialProducts`                                      |
| `src/features/catalog/components/CollectionPlpView.tsx` | Collection PLP client wrapper      | accept + seed `initialProducts`                                      |
| `src/app/(shop)/product/[slug]/page.tsx`                | PDP ISR server shell               | neutral fetch + tags/revalidate + `cache()` dedupe; drop cookie read |
| `src/app/(shop)/c/[slug]/page.tsx`                      | Category PLP SSR shell             | server-fetch first batch; pass `initialProducts`                     |
| `src/app/(shop)/collection/[slug]/page.tsx`             | Collection PLP SSR shell           | server-fetch first batch; pass `initialProducts`                     |

Tasks are grouped: **plumbing (1)** → **PDP (2–3)** → **Collection PLP (4–5)** → **Category PLP (6–7)**. PDP, Collection, and Category groups are independently shippable.

---

## Task 1: Add `next` cache-option passthrough to the catalog services

**Files:**

- Modify: `src/features/catalog/product-service.ts` (`GetProductRequestOptions`, `getProduct`)
- Modify: `src/features/catalog/category-service.ts` (`CategoryProductsRequestOptions`, `getCategoryProducts`)
- Modify: `src/features/catalog/collection-service.ts` (`CollectionProductsRequestOptions`, `getCollectionProducts`)
- Test: `src/features/catalog/product-service.test.ts`

**Interfaces:**

- Consumes: `ApiFetchNextOptions` from `@/lib/clients/freshterra-api` (`{ tags?: string[]; revalidate?: number | false }`).
- Produces: each request-options interface gains `next?: ApiFetchNextOptions`, forwarded to `apiFetch`.

- [ ] **Step 1: Write the failing test**

Add to `src/features/catalog/product-service.test.ts`. The existing suite stubs `global.fetch`; assert the `next` option reaches `fetch` server-side. At the top of the file confirm `vi.stubGlobal`/`global.fetch = vi.fn()` is already used; reuse that mock. Add:

```ts
it("forwards next cache options to the underlying fetch (server-side)", async () => {
  const fetchMock = vi.fn().mockResolvedValue(productResponse());
  vi.stubGlobal("fetch", fetchMock);

  await getProduct(
    "prd_01HX9",
    {},
    { next: { tags: ["product:prd_01HX9"], revalidate: 120 } },
  );

  const init = fetchMock.mock.calls[0][1] as RequestInit & {
    next?: { tags?: string[]; revalidate?: number | false };
  };
  expect(init.next).toEqual({ tags: ["product:prd_01HX9"], revalidate: 120 });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/features/catalog/product-service.test.ts -t "forwards next cache"`
Expected: FAIL — `init.next` is `undefined` (option not yet forwarded).

- [ ] **Step 3: Implement the passthrough in all three services**

In `product-service.ts`, add the import and extend the options:

```ts
import {
  apiFetch,
  type ApiFetchNextOptions,
} from "@/lib/clients/freshterra-api";
```

```ts
export interface GetProductRequestOptions {
  /** Abort signal — pass to cancel an in-flight request. */
  signal?: AbortSignal;
  /** Bearer token override (see `apiFetch`). Auto-read when omitted. */
  token?: string | null;
  /** Next.js cache options — applied server-side only (ISR tags/revalidate). */
  next?: ApiFetchNextOptions;
}
```

In `getProduct`'s `apiFetch` call, add `next: options.next,` alongside `signal`/`token`:

```ts
return apiFetch(productDetailPath(productId), {
  method: "GET",
  searchParams: { polygonId: params.polygonId },
  signal: options.signal,
  token: options.token,
  next: options.next,
  schema: productDetailSchema,
});
```

Apply the identical change to `category-service.ts` (`CategoryProductsRequestOptions` + the `apiFetch` call inside `getCategoryProducts`'s `try`) and `collection-service.ts` (`CollectionProductsRequestOptions` + the `apiFetch` call in `getCollectionProducts`). Import `ApiFetchNextOptions` in each. Do **not** thread `next` into `getCategoryProductsFromSaleorRoute` — that path is client-only.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/features/catalog/product-service.test.ts -t "forwards next cache"`
Expected: PASS.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/catalog/product-service.ts src/features/catalog/category-service.ts src/features/catalog/collection-service.ts src/features/catalog/product-service.test.ts
git commit -m "feat(catalog): forward next cache options through product/category/collection services"
```

---

## Task 2: Seed `useProduct` from server-provided `initialData`

**Files:**

- Modify: `src/features/catalog/useProduct.ts` (`UseProductArgs`, `useProduct`)
- Test: `src/features/catalog/useProduct.test.tsx`

**Interfaces:**

- Consumes: `getProduct` (mocked in tests), `ProductDetail`.
- Produces: `UseProductArgs` gains `initialData?: ProductDetail | null`. When present: `product` is non-null on first render, `loading` is `false` while initial data exists, and the hook still re-fetches with `polygonId` to overlay store values.

- [ ] **Step 1: Write the failing tests**

Add to `src/features/catalog/useProduct.test.tsx` (the file already mocks `./product-service` and defines `PRODUCT`):

```ts
it("renders initialData immediately without a loading state", async () => {
  mockGet.mockResolvedValue(PRODUCT);
  const { result } = renderHook(() =>
    useProduct({ id: "prd_01HX9", initialData: PRODUCT }),
  );
  // Synchronously seeded — no skeleton.
  expect(result.current.product).toEqual(PRODUCT);
  expect(result.current.loading).toBe(false);
});

it("overlays store data by re-fetching when a polygonId is given", async () => {
  const storeProduct: ProductDetail = {
    ...PRODUCT,
    price: { list: 7900, mrp: 9900, currency: "INR", source: "polygon" },
  };
  mockGet.mockResolvedValue(storeProduct);
  const { result } = renderHook(() =>
    useProduct({ id: "prd_01HX9", polygonId: "poly_1", initialData: PRODUCT }),
  );
  expect(result.current.product).toEqual(PRODUCT); // seeded first
  await waitFor(() => expect(result.current.product?.price.list).toBe(7900));
  expect(mockGet).toHaveBeenCalledWith(
    "prd_01HX9",
    { polygonId: "poly_1" },
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/features/catalog/useProduct.test.tsx -t "initialData"`
Expected: FAIL — first test fails because `product` is `null` on first render (state initializes to `null`).

- [ ] **Step 3: Implement `initialData` seeding**

In `UseProductArgs` add:

```ts
  /** Server-fetched product to render before the client (re)fetches. */
  initialData?: ProductDetail | null;
```

Destructure it and seed the initial state:

```ts
const { id, polygonId, enabled = true, initialData = null } = args;

const [product, setProduct] = useState<ProductDetail | null>(initialData);
```

Leave `loading` initialized to `false` (it already is) — with `initialData` seeded, the consumer's `loading && !product` skeleton guard is already satisfied. The existing mount `useEffect` still calls `fetchProduct()`, which overlays store data. No other change is needed: when `polygonId` is absent the re-fetch simply re-confirms the neutral product.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/features/catalog/useProduct.test.tsx`
Expected: PASS (all tests, including the existing ones).

- [ ] **Step 5: Commit**

```bash
git add src/features/catalog/useProduct.ts src/features/catalog/useProduct.test.tsx
git commit -m "feat(catalog): seed useProduct from server initialData"
```

---

## Task 3: Make PDP an ISR server shell with a client price/stock overlay

**Files:**

- Modify: `src/app/(shop)/product/[slug]/page.tsx`
- Modify: `src/features/catalog/components/ProductDetailView.tsx`
- Test: `src/features/catalog/components/ProductDetailView.test.tsx` (exists)

**Interfaces:**

- Consumes: `getProduct` (Task 1 `next` option), `useProduct` (Task 2 `initialData`), `ProductDetail`.
- Produces: `ProductDetailView` gains required `initialProduct?: ProductDetail | null` prop and reads `polygonId` from the cookie client-side (no longer a prop). The page exports `revalidate` and fetches the product store-neutral with `next: { tags: ['product:{slug}'], revalidate }`, deduped via `cache()`.

- [ ] **Step 1: Write the failing test for the view**

In `src/features/catalog/components/ProductDetailView.test.tsx`, add a test that the view renders `initialProduct` immediately (no skeleton) even before any client fetch resolves. Mirror the existing mocking in that file (it mocks `../useProduct` or `../product-service` — match whichever it already uses). Example assuming `useProduct` is mocked:

```ts
it("renders initialProduct content immediately", () => {
  mockUseProduct.mockReturnValue({
    product: PRODUCT,
    loading: false,
    error: null,
    notFound: false,
    reload: vi.fn(),
  });
  render(<ProductDetailView idOrSlug="heirloom-tomatoes-500g" initialProduct={PRODUCT} />);
  expect(screen.getByText(PRODUCT.name)).toBeInTheDocument();
});
```

If the existing test file instead renders against a real `useProduct` with a mocked `getProduct`, add `initialProduct={PRODUCT}` to that render and assert the name shows without awaiting.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/features/catalog/components/ProductDetailView.test.tsx -t "initialProduct"`
Expected: FAIL — `initialProduct` is not yet a prop (TS error / unused), name not rendered if `useProduct` returns null.

- [ ] **Step 3: Update `ProductDetailView` to take `initialProduct` and read the cookie client-side**

Add a tiny cookie reader and wire it in. Replace the props type and the `useProduct` call:

```tsx
type ProductDetailViewProps = {
  /** Product ULID or slug (from the /product/[slug] route). */
  idOrSlug: string;
  /** Store-neutral product fetched on the server (ISR shell). */
  initialProduct?: ProductDetail | null;
};

const STORE_COOKIE = "ft_store_id";

function readStoreCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${STORE_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(STORE_COOKIE.length + 1)) : undefined;
}

export function ProductDetailView({
  idOrSlug,
  initialProduct = null,
}: ProductDetailViewProps) {
  const [polygonId, setPolygonId] = useState<string | undefined>(undefined);
  useEffect(() => {
    setPolygonId(readStoreCookie());
  }, []);

  const { product, loading, error, notFound, reload } = useProduct({
    id: idOrSlug,
    polygonId,
    initialData: initialProduct,
  });
```

Add `import { useEffect, useState } from "react";` and `import type { ProductDetail } from "../types";` at the top. The remaining render logic is unchanged — the `loading && !product` guard now stays false because `initialProduct` seeds `product`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/features/catalog/components/ProductDetailView.test.tsx`
Expected: PASS.

- [ ] **Step 5: Convert the PDP page to ISR with a deduped neutral fetch**

Rewrite `src/app/(shop)/product/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";

import { cache } from "react";

import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingHeader } from "@/components/layout/MarketingHeader";

import { ProductDetailView } from "@/features/catalog/components/ProductDetailView";
import { getProduct } from "@/features/catalog/product-service";

type Params = Promise<{ slug: string }>;

/** ISR window; webhook tag-busting (`product:{slug}`) handles freshness. */
export const revalidate = 300;

/**
 * Store-neutral product fetch (no polygonId) so the rendered HTML is cacheable
 * across visitors. Per-store price/stock is overlaid client-side in
 * ProductDetailView. Deduped via `cache()` so generateMetadata + the page body
 * share one request.
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
  let initialProduct = null;
  try {
    initialProduct = await loadProduct(slug);
  } catch {
    // Fall through — the client island will fetch and surface not-found/error.
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <ProductDetailView idOrSlug={slug} initialProduct={initialProduct} />
      </main>
      <MarketingFooter />
    </div>
  );
}
```

This removes the `cookies()` import and read (keeping the route ISR-eligible) and drops the `polygonId` prop.

- [ ] **Step 6: Verify build treats the route as static/ISR**

Run: `pnpm build`
Expected: build succeeds; in the route summary `/product/[slug]` is listed as ISR/`Revalidate` (not `ƒ (Dynamic)`). If it shows Dynamic, confirm no remaining `cookies()`/`headers()` usage in the page or its synchronous server imports.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(shop)/product/[slug]/page.tsx" src/features/catalog/components/ProductDetailView.tsx src/features/catalog/components/ProductDetailView.test.tsx
git commit -m "feat(pdp): ISR server shell with client price/stock overlay"
```

---

## Task 4: Seed `useCollectionProducts` from server-provided `initialData`

**Files:**

- Modify: `src/features/catalog/useCollectionProducts.ts`
- Test: `src/features/catalog/useCollectionProducts.test.tsx` (exists)

**Interfaces:**

- Consumes: `getCollectionProducts` (mocked), `CollectionProductsData` (shape: `{ items, page, pageSize, total, facets, collection? }`).
- Produces: `UseCollectionProductsArgs` gains `initialData?: CollectionProductsData | null` and `initialKey?: string`. When `initialData` is present and `initialKey === slug`, the hook seeds items/total/facets/collection/page and **skips** the page-1 fetch on first mount; it still re-fetches when `slug`/`polygonId`/`sort`/`filters` change.

- [ ] **Step 1: Write the failing test**

Add to `src/features/catalog/useCollectionProducts.test.tsx` (match its existing mock of `./collection-service`):

```ts
it("seeds from initialData and skips the first fetch when the key matches", async () => {
  const seed = {
    items: [
      {
        id: "p1",
        name: "Apple",
        slug: "apple",
        price: { list: 100, mrp: 100, currency: "INR", source: "polygon" },
      },
    ],
    page: 1,
    pageSize: 20,
    total: 1,
    facets: {},
    collection: { name: "Fruits", slug: "fruits" },
  } as unknown as CollectionProductsData;

  const { result } = renderHook(() =>
    useCollectionProducts({
      slug: "fruits",
      polygonId: "poly_1",
      initialData: seed,
      initialKey: "fruits",
    }),
  );

  expect(result.current.items).toHaveLength(1);
  expect(result.current.total).toBe(1);
  // No network call on mount because the seed matches.
  expect(mockGetCollection).not.toHaveBeenCalled();
});
```

Import `CollectionProductsData` from `./types` in the test if not already.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/features/catalog/useCollectionProducts.test.tsx -t "seeds from initialData"`
Expected: FAIL — `items` empty on mount and `mockGetCollection` called once.

- [ ] **Step 3: Implement seeding**

Extend `UseCollectionProductsArgs`:

```ts
  /** Server-fetched first batch to seed before client fetches. */
  initialData?: CollectionProductsData | null;
  /** Slug the initialData was fetched for; seed only applies when it matches. */
  initialKey?: string;
```

Import the type: `import type { CollectionProductsData } from "./types";` (add to the existing type import).

Seed state from `initialData` when the key matches, and gate the mount fetch. Compute a `seeded` flag and use a ref so the seed is consumed once:

```ts
const {
  slug,
  polygonId,
  sort,
  pageSize,
  enabled = true,
  initialData = null,
  initialKey,
} = args;

const seedMatches = Boolean(initialData && initialKey && initialKey === slug);

const [items, setItems] = useState<PlpProduct[]>(
  seedMatches ? initialData!.items : [],
);
const [collection, setCollection] = useState<ProductCollection | null>(
  seedMatches ? (initialData!.collection ?? null) : null,
);
const [facets, setFacets] = useState<CollectionFacets>(
  seedMatches ? initialData!.facets : EMPTY_FACETS,
);
const [total, setTotal] = useState(seedMatches ? initialData!.total : 0);
const [page, setPage] = useState(seedMatches ? initialData!.page : 1);
```

Use the exact state-type names already declared in the file (e.g. `ProductCollection`, `CollectionFacets`, `EMPTY_FACETS`) — read the top of the file and match them; do not invent new names. Initialize `pageRef.current` to the seeded page where it is declared:

```ts
const pageRef = useRef(seedMatches ? initialData!.page : 1);
```

Add a ref that lets the mount effect skip exactly one fetch when seeded:

```ts
const skipNextFetchRef = useRef(seedMatches);
```

In the mount `useEffect`, consume the skip flag before fetching:

```ts
useEffect(() => {
  if (!active) {
    abortRef.current?.abort();
    resetState();
    return;
  }
  if (skipNextFetchRef.current) {
    skipNextFetchRef.current = false;
    return;
  }
  void fetchPage(1, false);
}, [
  active,
  slug,
  polygonId,
  sort,
  pageSize,
  filtersKey,
  fetchPage,
  resetState,
]);
```

Leave `resetState` as-is; it runs on subsequent arg changes when `active` toggles. The seed only suppresses the very first fetch.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/features/catalog/useCollectionProducts.test.tsx`
Expected: PASS (all tests).

- [ ] **Step 5: Typecheck + commit**

Run: `pnpm typecheck`

```bash
git add src/features/catalog/useCollectionProducts.ts src/features/catalog/useCollectionProducts.test.tsx
git commit -m "feat(catalog): seed useCollectionProducts from server initialData"
```

---

## Task 5: Server-render the Collection PLP first batch

**Files:**

- Modify: `src/app/(shop)/collection/[slug]/page.tsx`
- Modify: `src/features/catalog/components/CollectionPlpView.tsx`

**Interfaces:**

- Consumes: `getCollectionProducts` (Task 1), `useCollectionProducts` (Task 4 `initialData`/`initialKey`), `CollectionProductsData`.
- Produces: `CollectionPlpView` gains `initialProducts?: CollectionProductsData | null` and forwards it as `initialData`/`initialKey={slug}` to the hook.

- [ ] **Step 1: Add `initialProducts` to `CollectionPlpView`**

Update the props and hook call (the view is `"use client"` and already destructures `slug`, `polygonId`):

```tsx
type CollectionPlpViewProps = {
  slug: string;
  polygonId?: string;
  initialProducts?: CollectionProductsData | null;
};

export function CollectionPlpView({
  slug,
  polygonId,
  initialProducts = null,
}: CollectionPlpViewProps) {
  // ...existing state...
  const ctrl = useCollectionProducts({
    slug,
    polygonId,
    initialData: initialProducts,
    initialKey: slug,
    // ...any existing sort/filters args unchanged...
  });
```

Add `import type { CollectionProductsData } from "../types";`.

- [ ] **Step 2: Server-fetch the first batch in the page and pass it down**

In `src/app/(shop)/collection/[slug]/page.tsx`, the page already reads the cookie. Fetch the first batch best-effort and pass it. Replace the page component body:

```tsx
export default async function CollectionProductsPage({
  params,
}: Readonly<{ params: Params }>) {
  const { slug } = await params;
  const polygonId = (await cookies()).get(STORE_COOKIE)?.value;

  let initialProducts = null;
  if (polygonId) {
    try {
      initialProducts = await getCollectionProducts(slug, { polygonId });
    } catch {
      // Best-effort seed — client hook will fetch on mount if this fails.
    }
  }

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <MarketingHeader />
      <main className="text-text-primary w-full min-w-0 flex-1 overflow-x-clip">
        <CollectionPlpView
          slug={slug}
          polygonId={polygonId}
          initialProducts={initialProducts}
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
```

`getCollectionProducts` is already imported. The fetch is gated on `polygonId` because the collection hook is store-gated (`active = Boolean(slug && polygonId)`), so an unseeded no-store page behaves exactly as today.

- [ ] **Step 3: Verify build + typecheck**

Run: `pnpm typecheck && pnpm build`
Expected: success; `/collection/[slug]` remains dynamic (`ƒ`) — it reads the cookie, which is the intended SSR behavior.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(shop)/collection/[slug]/page.tsx" src/features/catalog/components/CollectionPlpView.tsx
git commit -m "feat(plp): server-render collection first batch (SSR seed)"
```

---

## Task 6: Seed `useCategoryProducts` from server-provided `initialData`

**Files:**

- Modify: `src/features/catalog/useCategoryProducts.ts`
- Test: `src/features/catalog/useCategoryProducts.test.tsx` (exists)

**Interfaces:**

- Consumes: `getCategoryProducts` (mocked), `CategoryProductsData` (shape: `{ items, page, pageSize, total, facets, category? }`).
- Produces: `UseCategoryProductsArgs` gains `initialData?: CategoryProductsData | null` and `initialKey?: string`. Seeds and skips the first mount fetch only when `initialKey === slug` (the effective `productSlug`), matching the seeded sort (`DEFAULT_CATEGORY_SORT`) and no filters.

- [ ] **Step 1: Write the failing test**

Add to `src/features/catalog/useCategoryProducts.test.tsx` (match the existing `./category-service` mock; the mock fn is referenced below as `mockGetCategory` — use the file's actual name):

```ts
it("seeds from initialData and skips the first fetch when the key matches", async () => {
  const seed = {
    items: [
      {
        id: "p1",
        name: "Apple",
        slug: "apple",
        price: { list: 100, mrp: 100, currency: "INR", source: "polygon" },
      },
    ],
    page: 1,
    pageSize: 20,
    total: 1,
    facets: {},
    category: { name: "Fruits", slug: "fruits" },
  } as unknown as CategoryProductsData;

  const { result } = renderHook(() =>
    useCategoryProducts({
      slug: "fruits",
      polygonId: "poly_1",
      initialData: seed,
      initialKey: "fruits",
    }),
  );

  expect(result.current.items).toHaveLength(1);
  expect(result.current.total).toBe(1);
  expect(mockGetCategory).not.toHaveBeenCalled();
});
```

Import `CategoryProductsData` from `./types` in the test.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/features/catalog/useCategoryProducts.test.tsx -t "seeds from initialData"`
Expected: FAIL — items empty on mount; service called once.

- [ ] **Step 3: Implement seeding (mirror Task 4)**

Extend `UseCategoryProductsArgs`:

```ts
  /** Server-fetched first batch to seed before client fetches. */
  initialData?: CategoryProductsData | null;
  /** Effective productSlug the initialData was fetched for. */
  initialKey?: string;
```

Add `import type { CategoryProductsData } from "./types";` to the existing type import.

In the hook body, compute the seed and initialize state (use the file's existing state-type names — `ProductCategory`, `CategoryFacets`, `EMPTY_FACETS`):

```ts
const {
  slug,
  polygonId,
  sort,
  pageSize,
  locale,
  enabled = true,
  initialData = null,
  initialKey,
} = args;

const seedMatches = Boolean(initialData && initialKey && initialKey === slug);

const [items, setItems] = useState<PlpProduct[]>(
  seedMatches ? initialData!.items : [],
);
const [category, setCategory] = useState<ProductCategory | null>(
  seedMatches ? (initialData!.category ?? null) : null,
);
const [facets, setFacets] = useState<CategoryFacets>(
  seedMatches ? initialData!.facets : EMPTY_FACETS,
);
const [total, setTotal] = useState(seedMatches ? initialData!.total : 0);
const [page, setPage] = useState(seedMatches ? initialData!.page : 1);
```

Initialize `pageRef` and add the skip ref:

```ts
const pageRef = useRef(seedMatches ? initialData!.page : 1);
const skipNextFetchRef = useRef(seedMatches);
```

Gate the mount effect (keep the existing dependency array):

```ts
useEffect(() => {
  if (!active) {
    abortRef.current?.abort();
    resetState();
    return;
  }
  if (skipNextFetchRef.current) {
    skipNextFetchRef.current = false;
    return;
  }
  void fetchPage(1, false);
}, [
  active,
  slug,
  polygonId,
  sort,
  pageSize,
  locale,
  filtersKey,
  fetchPage,
  resetState,
]);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/features/catalog/useCategoryProducts.test.tsx`
Expected: PASS (all tests).

- [ ] **Step 5: Typecheck + commit**

Run: `pnpm typecheck`

```bash
git add src/features/catalog/useCategoryProducts.ts src/features/catalog/useCategoryProducts.test.tsx
git commit -m "feat(catalog): seed useCategoryProducts from server initialData"
```

---

## Task 7: Server-render the Category PLP first batch

**Files:**

- Modify: `src/app/(shop)/c/[slug]/page.tsx`
- Modify: `src/features/catalog/components/CategoryPlpView.tsx`

**Interfaces:**

- Consumes: `getCategoryProducts` (Task 1), `useCategoryProducts` (Task 6), `CategoryProductsData`, `DEFAULT_CATEGORY_SORT`.
- Produces: `CategoryPlpView` gains `initialProducts?: CategoryProductsData | null`, forwarded to `baseCtrl`/`ctrl` as `initialData` with `initialKey={slug}`.

> **Caveat (read before coding):** `CategoryPlpView` derives an effective `productSlug` from L4 tabs fetched client-side via `useWebCategoryPlp`. The server seed is fetched for the **route `slug`**, so it only applies on the default path where `productSlug === slug` (no L4-tab redirect). The `initialKey === slug` guard in Task 6 makes a mismatched seed a no-op — the client simply fetches as today. This is intended: the seed is a fast-path for the common case, not a correctness dependency.

- [ ] **Step 1: Add `initialProducts` to `CategoryPlpView`**

Update props and pass the seed to the hook that fetches the route slug's products. In the current code two controllers exist (`baseCtrl` for facets/tabs and `ctrl` for the resolved tag). Seed only the controller whose `slug` equals the route `slug` on first render — that is `baseCtrl` (`useCategoryProducts({ slug: productSlug, ... })`). Pass `initialData`/`initialKey` there:

```tsx
type CategoryPlpViewProps = {
  slug: string;
  polygonId?: string;
  initialProducts?: CategoryProductsData | null;
};

export function CategoryPlpView({
  slug,
  polygonId,
  initialProducts = null,
}: Readonly<CategoryPlpViewProps>) {
  // ...existing logic that computes productSlug...

  const baseCtrl = useCategoryProducts({
    slug: productSlug,
    polygonId,
    sort: DEFAULT_CATEGORY_SORT,
    filters: undefined,
    initialData: initialProducts,
    initialKey: slug,
  });
```

Add `import type { CategoryProductsData } from "../types";`. The `initialKey={slug}` guard means the seed is consumed only when `productSlug === slug` (default tab), per the caveat.

- [ ] **Step 2: Server-fetch the first batch in the page**

In `src/app/(shop)/c/[slug]/page.tsx`, the page already reads the cookie and computes `slug`. Only seed the plain PLP branch (not the `EXPLORE_CATALOG_SLUG` or `webCategory` landing branches). Fetch best-effort and pass it. Add the import:

```tsx
import { getCategoryProducts } from "@/features/catalog/category-service";
```

In `CategoryHubPage`, after `polygonId`/`webCategory` are resolved, before building `contentNode`:

```tsx
let initialProducts = null;
if (slug !== EXPLORE_CATALOG_SLUG && !webCategory) {
  try {
    initialProducts = await getCategoryProducts(slug, { polygonId });
  } catch {
    // Best-effort; staging BFF may 404 (CATEGORY_NOT_FOUND). The client
    // hook falls back to the Saleor PLP route as today.
  }
}
```

Then pass it into the PLP branch:

```tsx
  } else {
    contentNode = (
      <CategoryPlpView
        slug={slug}
        polygonId={polygonId}
        initialProducts={initialProducts}
      />
    );
  }
```

Note: the server `getCategoryProducts` will **not** use the Saleor fallback (that branch is client-only: `typeof window !== "undefined"`), so on staging a `CATEGORY_NOT_FOUND` simply leaves `initialProducts` null and the client seeds nothing — identical to today's behavior.

- [ ] **Step 3: Verify build + typecheck**

Run: `pnpm typecheck && pnpm build`
Expected: success; `/c/[slug]` remains dynamic (`ƒ`) — intended SSR.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(shop)/c/[slug]/page.tsx" src/features/catalog/components/CategoryPlpView.tsx
git commit -m "feat(plp): server-render category first batch (SSR seed)"
```

---

## Task 8: Full regression + documentation note

**Files:**

- Modify: `CLAUDE.md` (§4 note) — optional, only if the team wants the store-neutral ISR nuance recorded.

- [ ] **Step 1: Run the full unit suite**

Run: `pnpm test`
Expected: all green.

- [ ] **Step 2: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 3: Build and confirm route modes**

Run: `pnpm build`
Expected: `/product/[slug]` → ISR (Revalidate 300s); `/c/[slug]` and `/collection/[slug]` → dynamic (`ƒ`, SSR). Record the route table in the PR description.

- [ ] **Step 4: Manual smoke (per `CLAUDE.md` §9 mobile + desktop)**

Run: `pnpm dev`, then:

- PDP: view source / disable JS → product name, description, JSON-LD present in HTML; with a `ft_store_id` cookie set (`?store=<id>`), price/stock update after hydration.
- Category & Collection PLP: first product batch present in server HTML (with a store set); infinite scroll, filters, sort still work.

- [ ] **Step 5 (optional): Record the ISR nuance in `CLAUDE.md` §4**

If desired, append a one-line note under the PDP row: "ISR shell is store-neutral; per-store price/stock is overlaid client-side from the `ft_store_id` cookie." Commit separately:

```bash
git add CLAUDE.md
git commit -m "docs: note store-neutral ISR shell for PDP in CLAUDE.md §4"
```

---

## Task 9: PDP structured data — `Product` + `BreadcrumbList` JSON-LD (server-rendered)

> Added post-final-review. CLAUDE.md §6 mandates `Product` + `BreadcrumbList` structured data on PDP; now that the product is fetched server-side (Task 3), the JSON-LD can ship in the ISR HTML. Reuses the existing `JsonLd` component and the builder pattern in `src/lib/seo/jsonLd.ts`.

**Files:**

- Modify: `src/lib/seo/jsonLd.ts` (add `productJsonLd`, `breadcrumbListJsonLd`)
- Create: `src/lib/seo/jsonLd.test.ts`
- Modify: `src/app/(shop)/product/[slug]/page.tsx` (render JSON-LD from `initialProduct`)

**Interfaces:**

- Consumes: `ProductDetail` (`src/features/catalog/types.ts`), `env.NEXT_PUBLIC_APP_URL`, the existing `JsonLd` component (`src/components/seo/JsonLd.tsx`), `getProduct`/`loadProduct` (Task 3).
- Produces: `productJsonLd({ baseUrl, product }: { baseUrl: string; product: ProductDetail }): JsonLdObject` and `breadcrumbListJsonLd({ baseUrl, items }: { baseUrl: string; items: { name: string; path: string }[] }): JsonLdObject`.

Money note: price values are integer **minor units** (8900 = ₹89.00) — divide by 100 and `.toFixed(2)` for schema.org `price`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/seo/jsonLd.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { breadcrumbListJsonLd, productJsonLd } from "./jsonLd";

import type { ProductDetail } from "@/features/catalog/types";

const PRODUCT: ProductDetail = {
  id: "prd_01HX9",
  sku: "FT-TOMATO-500G",
  name: "Heirloom Tomatoes 500g",
  slug: "heirloom-tomatoes-500g",
  images: [{ url: "https://cdn/tom.jpg", alt: "tomato" }],
  variants: [],
  price: {
    list: 8900,
    mrp: 9900,
    currency: "INR",
    source: "sku_price_default",
  },
  category: { id: "cat_1", slug: "vegetables", name: "Vegetables" },
  metafields: { brand: "FreshTerra Farms" },
  tags: [],
  tagPills: [],
  inStock: true,
  similarProducts: [],
};

describe("productJsonLd", () => {
  it("builds a Product schema with offer in major currency units", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in",
      product: PRODUCT,
    });
    expect(ld["@type"]).toBe("Product");
    expect(ld.name).toBe("Heirloom Tomatoes 500g");
    expect(ld.sku).toBe("FT-TOMATO-500G");
    expect(ld.image).toEqual(["https://cdn/tom.jpg"]);
    expect(ld.brand).toEqual({ "@type": "Brand", name: "FreshTerra Farms" });
    const offers = ld.offers as Record<string, unknown>;
    expect(offers.price).toBe("89.00");
    expect(offers.priceCurrency).toBe("INR");
    expect(offers.availability).toBe("https://schema.org/InStock");
    expect(offers.url).toBe(
      "https://freshterra.in/product/heirloom-tomatoes-500g",
    );
  });

  it("marks out-of-stock products", () => {
    const ld = productJsonLd({
      baseUrl: "https://freshterra.in",
      product: { ...PRODUCT, inStock: false },
    });
    const offers = ld.offers as Record<string, unknown>;
    expect(offers.availability).toBe("https://schema.org/OutOfStock");
  });
});

describe("breadcrumbListJsonLd", () => {
  it("builds positioned absolute-URL breadcrumb items", () => {
    const ld = breadcrumbListJsonLd({
      baseUrl: "https://freshterra.in",
      items: [
        { name: "Home", path: "/" },
        { name: "Vegetables", path: "/category/vegetables" },
        {
          name: "Heirloom Tomatoes 500g",
          path: "/product/heirloom-tomatoes-500g",
        },
      ],
    });
    expect(ld["@type"]).toBe("BreadcrumbList");
    const el = ld.itemListElement as Array<Record<string, unknown>>;
    expect(el).toHaveLength(3);
    expect(el[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://freshterra.in/",
    });
    expect(el[2].position).toBe(3);
    expect(el[2].item).toBe(
      "https://freshterra.in/product/heirloom-tomatoes-500g",
    );
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/lib/seo/jsonLd.test.ts`
Expected: FAIL — `productJsonLd`/`breadcrumbListJsonLd` not exported.

- [ ] **Step 3: Implement the builders**

Append to `src/lib/seo/jsonLd.ts`:

```ts
import type { ProductDetail } from "@/features/catalog/types";

/** Minor units (8900) → major-unit string ("89.00") for schema.org price. */
function toMajorUnits(minor: number): string {
  return (minor / 100).toFixed(2);
}

export function productJsonLd({
  baseUrl,
  product,
}: {
  baseUrl: string;
  product: ProductDetail;
}): JsonLdObject {
  const description =
    product.story?.trim() ||
    product.metafields?.productDetails?.trim() ||
    `${product.name} on FreshTerra.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description,
    image: product.images.map((img) => img.url),
    ...(product.metafields?.brand
      ? { brand: { "@type": "Brand", name: product.metafields.brand } }
      : {}),
    offers: {
      "@type": "Offer",
      price: toMajorUnits(product.price.list),
      priceCurrency: product.price.currency,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/product/${product.slug}`,
    },
  };
}

export function breadcrumbListJsonLd({
  baseUrl,
  items,
}: {
  baseUrl: string;
  items: { name: string; path: string }[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}
```

(`product.metafields?.productDetails` is referenced in the existing PDP `generateMetadata` description fallback — mirror it. If `metafields` is not on `ProductDetail`, drop that clause to match the type.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/lib/seo/jsonLd.test.ts`
Expected: PASS.

- [ ] **Step 5: Render JSON-LD in the PDP page**

In `src/app/(shop)/product/[slug]/page.tsx`, add imports:

```tsx
import { env } from "@/lib/config/env";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd, productJsonLd } from "@/lib/seo/jsonLd";
```

In `ProductPage`, after `initialProduct` is resolved, render JSON-LD only when the product loaded (build the breadcrumb to mirror the on-page breadcrumb: Home → category → product):

```tsx
const baseUrl = env.NEXT_PUBLIC_APP_URL;
const structuredData =
  initialProduct == null
    ? null
    : [
        productJsonLd({ baseUrl, product: initialProduct }),
        breadcrumbListJsonLd({
          baseUrl,
          items: [
            { name: "Home", path: "/" },
            ...(initialProduct.category
              ? [
                  {
                    name: initialProduct.category.name,
                    path: `/category/${initialProduct.category.slug}`,
                  },
                ]
              : []),
            { name: initialProduct.name, path: `/product/${slug}` },
          ],
        }),
      ];
```

Render the blocks inside the returned tree (e.g. just before `<MarketingHeader />`):

```tsx
{
  structuredData?.map((data, i) => <JsonLd key={i} data={data} />);
}
```

- [ ] **Step 6: Verify build + JSON-LD presence**

Run: `pnpm build`
Expected: build succeeds; `/product/[slug]` remains ISR (`●`/Revalidate), not `ƒ`.
Then confirm the focused tests pass: `pnpm test src/lib/seo/jsonLd.test.ts`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/seo/jsonLd.ts src/lib/seo/jsonLd.test.ts "src/app/(shop)/product/[slug]/page.tsx"
git commit -m "feat(pdp): add Product + BreadcrumbList JSON-LD to ISR shell"
```

---

## Task 10: Skip the redundant store-neutral PDP mount fetch

> Added post-final-review. Today `useProduct` always fetches on mount; with a seeded `initialData` and no store cookie, this re-fetches the identical store-neutral product the server already provided. Skip the mount fetch while `initialData` is present **and** `polygonId` is falsy; still fetch once a real `polygonId` resolves (the store overlay) or when there is no `initialData` (existing non-seeded callers must be unaffected).

**Files:**

- Modify: `src/features/catalog/useProduct.ts`
- Modify: `src/features/catalog/useProduct.test.tsx`

**Interfaces:**

- Consumes: existing `useProduct` (`initialData` from Task 2, `polygonId`, `id`, `enabled`).
- Produces: no signature change — only mount-fetch gating behavior changes.

- [ ] **Step 1: Write the failing tests**

Add to `src/features/catalog/useProduct.test.tsx`:

```ts
it("does NOT fetch on mount when seeded and no polygonId is set", async () => {
  mockGet.mockResolvedValue(PRODUCT);
  renderHook(() => useProduct({ id: "prd_01HX9", initialData: PRODUCT }));
  // Give effects a tick to flush.
  await act(async () => {
    await Promise.resolve();
  });
  expect(mockGet).not.toHaveBeenCalled();
});

it("fetches on mount when seeded AND a polygonId is set (store overlay)", async () => {
  mockGet.mockResolvedValue(PRODUCT);
  renderHook(() =>
    useProduct({ id: "prd_01HX9", polygonId: "poly_1", initialData: PRODUCT }),
  );
  await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
});

it("still fetches on mount when NOT seeded (no initialData)", async () => {
  mockGet.mockResolvedValue(PRODUCT);
  renderHook(() => useProduct({ id: "prd_01HX9" }));
  await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/features/catalog/useProduct.test.tsx -t "does NOT fetch on mount when seeded"`
Expected: FAIL — currently `mockGet` is called once on mount even when seeded with no polygonId.

- [ ] **Step 3: Gate the mount fetch**

In `useProduct.ts`, the `active` computation currently is `const active = enabled && Boolean(id);`. Tighten it so a seeded hook with no store does not fetch on mount, while non-seeded hooks and store overlays still do:

```ts
const hasSeed = initialData != null;
// With a seed and no store yet, the server-provided neutral product is
// authoritative — skip the redundant mount fetch. Fetch only to overlay a
// store (polygonId present) or when there is no seed to fall back on.
const active = enabled && Boolean(id) && (!hasSeed || Boolean(polygonId));
```

Leave the rest of the hook (the mount effect, abort handling, `reload`) unchanged. `reload()` still calls `fetchProduct()` directly, so an explicit reload is unaffected. When `polygonId` later changes from `undefined` to a real value, `active` flips true and the effect fetches the overlay.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/features/catalog/useProduct.test.tsx`
Expected: PASS (all tests, including the Task 2 seeding tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/catalog/useProduct.ts src/features/catalog/useProduct.test.tsx
git commit -m "perf(pdp): skip redundant store-neutral mount fetch when seeded"
```

---

## Self-Review Notes

- **Spec coverage:** §2.1 PDP → Tasks 2–3; §2.2 PLP → Tasks 4–7; §2.3 plumbing → Tasks 1, 2, 4, 6. §5 risk #1 (cookie readability) resolved — `ft_store_id` is not `httpOnly` (verified in `middleware.ts`); the PDP island reads it via `document.cookie`. §5 risk #2 (edge cache) left as a deploy concern, surfaced in Task 8. §6 open question (revalidate interval) resolved to 300s in Task 3 (adjust if the team prefers).
- **Type consistency:** `initialData` (hooks) ↔ `initialProduct`/`initialProducts` (views/pages) used consistently; `initialKey` is the slug guard for both PLP hooks; `next?: ApiFetchNextOptions` added uniformly across the three services.
- **No-fallback caveat:** server-side `getCategoryProducts` cannot use the client-only Saleor fallback — documented in Tasks 1 and 7 so a seed miss degrades to today's client fetch.
