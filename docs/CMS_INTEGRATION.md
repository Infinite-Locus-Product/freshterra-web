# CMS Integration — Policy Pages (Strapi)

> Status: **Phase 1 (mock content)**. The fetcher reads from hardcoded TypeScript constants.
> When Strapi is ready, follow this doc to swap to live content.

This page documents the contract between FreshTerra Web and the Strapi CMS for policy/legal documents (`/privacy-policy`, `/terms`, eventually `/refund-return`). The same pattern extends to other CMS-backed surfaces (homepage rails, brand pages, etc.) — those will get their own sibling docs.

---

## 1. Data model

The page layer consumes `PolicyDocument` from [`src/features/cms-content/types.ts`](../src/features/cms-content/types.ts):

```ts
type PolicySpan = { text: string; bold?: boolean };

type PolicyBlock =
  | { type: "paragraph"; spans: PolicySpan[] }
  | { type: "list"; items: PolicySpan[][] };

type PolicySection = {
  id?: string; // optional anchor for deep links
  heading?: string; // omit on the intro
  blocks: PolicyBlock[];
};

type PolicySlug = "privacy" | "terms" | "refund-return";

type PolicyDocument = {
  slug: PolicySlug;
  title: string;
  breadcrumbLabel: string;
  intro?: PolicySection;
  sections: PolicySection[];
  lastUpdated: string; // ISO date
  contactEmail?: string;
};
```

Pages call **only** `getPolicyDocument(slug)` from [`src/features/cms-content/policies.ts`](../src/features/cms-content/policies.ts) — they never know whether the source is mock or Strapi.

---

## 2. Where mock content lives now

[`src/lib/mock-data/policies.ts`](../src/lib/mock-data/policies.ts) — full Privacy Policy and Terms content seeded from Figma.

`refund-return` is intentionally absent (no Figma content yet). The page falls back to `<ComingSoon />` until content arrives.

---

## 3. Strapi content type to create

Create a single-instance-per-slug collection named **`policies`**:

| Field             | Type                                     | Required | Notes                                                        |
| ----------------- | ---------------------------------------- | -------- | ------------------------------------------------------------ |
| `slug`            | UID                                      | yes      | One of `privacy`, `terms`, `refund-return`. Used in the URL. |
| `title`           | Text                                     | yes      | E.g. "Privacy Policy"                                        |
| `breadcrumbLabel` | Text                                     | yes      | Often identical to `title`                                   |
| `intro`           | Component (`policy.section`, single)     | no       | Lead paragraph(s)                                            |
| `sections`        | Component (`policy.section`, repeatable) | yes      | Numbered sections                                            |
| `lastUpdated`     | Date                                     | yes      | Surfaces in the page footer line                             |
| `contactEmail`    | Email                                    | no       | Used in the contact section copy                             |

The reusable `policy.section` component:

| Field      | Type                                             | Required |
| ---------- | ------------------------------------------------ | -------- |
| `anchorId` | Text                                             | no       |
| `heading`  | Text                                             | no       |
| `blocks`   | Dynamic Zone (`policy.paragraph`, `policy.list`) | yes      |

Where:

- `policy.paragraph` — `spans: Component (policy.span, repeatable)`
- `policy.list` — `items: Component (policy.list-item, repeatable)`, where each item has `spans: Component (policy.span, repeatable)`
- `policy.span` — `{ text: Text, bold: Boolean }`

---

## 4. The swap — when Strapi is ready

Edit one file: [`src/features/cms-content/policies.ts`](../src/features/cms-content/policies.ts).

```diff
+ import { strapiPublic } from "@/lib/clients/strapi";
+ import { mapStrapiPolicyToDocument } from "./policies-strapi-adapter";
- import { policiesContent } from "@/lib/mock-data/policies";

  export async function getPolicyDocument(
    slug: PolicySlug,
  ): Promise<PolicyDocument | null> {
-   return policiesContent[slug] ?? null;
+   try {
+     const data = await strapiPublic.fetch(`/policies/${slug}`, {
+       tags: [`cms:policy:${slug}`],
+       revalidate: 3600,
+     });
+     return data ? mapStrapiPolicyToDocument(data) : null;
+   } catch {
+     return null;
+   }
  }
```

Then create `src/features/cms-content/policies-strapi-adapter.ts` exporting:

```ts
export function mapStrapiPolicyToDocument(raw: unknown): PolicyDocument | null;
```

The adapter is the only place that knows about Strapi's wire format. Validate the shape with `zod` before returning — pages must never see a partial document.

Delete `src/lib/mock-data/policies.ts` once the swap is verified in production.

---

## 5. Cache tags & revalidation

Every Strapi fetch is tagged: `cms:policy:{slug}`.

When content changes in Strapi, the CMS posts to the existing webhook at [`/api/revalidate`](../src/app/api/revalidate/route.ts):

```bash
curl -X POST https://freshterra.in/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $STRAPI_REVALIDATE_SECRET" \
  -d '{"tags":["cms:policy:privacy"]}'
```

The handler iterates the tag list and calls `revalidateTag()`. Next.js then re-fetches the page on its next visit (and pushes a fresh static render to the edge cache).

**Belt-and-braces**: the fetcher also passes `revalidate: 3600` so even if the webhook fails the page self-refreshes hourly.

---

## 6. Adding a new policy page

1. Add the new slug to `PolicySlug` in `src/features/cms-content/types.ts`.
2. Add the entry to mock content (`src/lib/mock-data/policies.ts`) **or** create the entry in Strapi.
3. Create `src/app/(marketing)/{slug}/page.tsx` from this template:

```tsx
import type { Metadata } from "next";

import { PolicyPage } from "@/components/policy/PolicyPage";
import { ComingSoon } from "@/components/ui/coming-soon";
import { getPolicyDocument } from "@/features/cms-content/policies";

export const metadata: Metadata = {
  title: "<Page Title>",
  description: "<Description>",
  alternates: { canonical: "/<slug>" },
};

export default async function Page() {
  const doc = await getPolicyDocument("<slug>");
  if (!doc) return <ComingSoon title="<Page Title>" />;
  return <PolicyPage document={doc} />;
}
```

4. Append the URL to `src/app/sitemap.ts`.
5. If the link should appear in the footer, add it to `comingSoonContent.policyLinks` in `src/lib/MockData.ts` (the canonical link list used by both `MarketingFooter` and the Coming Soon page).

---

## 7. Auth & environment

The Strapi client lives at [`src/lib/clients/strapi.ts`](../src/lib/clients/strapi.ts) and exposes:

- `strapiPublic.fetch(path, opts)` — uses `STRAPI_API_TOKEN`. Returns published content only. **Use this in pages.**
- `strapiServer.fetch(path, opts)` — uses `STRAPI_PREVIEW_TOKEN`. Returns drafts. Reserved for future preview routes.

Required env vars (already in [`.env.example`](../.env.example) and validated in [`src/lib/config/env.ts`](../src/lib/config/env.ts)):

```bash
STRAPI_API_URL=
STRAPI_API_TOKEN=
STRAPI_PREVIEW_TOKEN=
STRAPI_REVALIDATE_SECRET=
```

`STRAPI_REVALIDATE_SECRET` must match the secret configured in the Strapi webhook for the `/api/revalidate` POST to succeed.
