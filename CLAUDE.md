# FreshTerra Web — CLAUDE.md

> Context file for Claude Code. Read this in full before generating, modifying,
> or scaffolding any code in this repository.

---

## 1. Project Overview

**FreshTerra Web** is the responsive web (desktop + tablet + mWeb) frontend for
the FreshTerra ecommerce platform. The mobile apps (iOS + Android) are built
separately in React Native and own all transactional features.

**Phase 1 scope (this repo):**

- Marketing & brand pages (Home, About, Food Philosophy, Careers, Contact)
- Catalog browsing — PLP, PDP, search, category, collection
- Store locator with Google Maps directions
- Location detection + serviceability check (drives store scoping)
- Policy pages (Privacy, T&C, Refund & Return)
- Deeplink redirect to the mobile app when installed
- "Download App" CTAs across pages

**Explicitly OUT of Phase 1 web scope** (do NOT scaffold these):

- ❌ Cart, checkout, payment (app only)
- ❌ User authentication / login / signup (app only)
- ❌ Account section, addresses, order history (app only)
- ❌ Wishlist (app only)
- ❌ Notifications (app only)
- ❌ Loyalty / referral / rewards (future phase)
- ❌ Multi-language (Phase 1 is English only)

If a request would create any of the above on web, **stop and confirm with the
user** before proceeding.

---

## 2. Tech Stack

| Layer             | Choice                                                  | Notes                                          |
| ----------------- | ------------------------------------------------------- | ---------------------------------------------- |
| Framework         | **Next.js 15** (App Router)                             | RSC + streaming + Metadata API                 |
| Language          | **TypeScript**                                          | `strict: true`, no implicit any                |
| Runtime           | **Node 20 LTS**                                         | pinned via `.nvmrc`                            |
| Package mgr       | **pnpm**                                                | workspace-ready                                |
| UI                | **Tailwind CSS v4** + **shadcn/ui** (selective)         | custom design tokens                           |
| Forms             | **react-hook-form** + **zod**                           | unified validation                             |
| Server data       | RSC + `fetch` with `next: { tags }`                     | leverage cache tags                            |
| Client data       | **TanStack Query**                                      | only where RSC isn't viable (search, location) |
| GraphQL           | **graphql-request** + **graphql-codegen**               | typed Saleor queries                           |
| Schema validation | **zod**                                                 | env, API responses, forms                      |
| Testing           | **Vitest** + **Testing Library** + **Playwright**       | unit + e2e                                     |
| Lint/format       | **ESLint** + **Prettier** + **Husky** + **lint-staged** | pre-commit                                     |
| Commit            | **Commitlint** (Conventional Commits)                   | enforced                                       |
| CI                | **GitHub Actions**                                      | typecheck, lint, test, build, Lighthouse       |

**Do not introduce** Redux, MobX, Zustand, Recoil, styled-components, emotion,
MUI, Chakra, NextAuth, or any other state/UI/auth library without confirming
first. The stack is intentionally narrow.

---

## 3. Folder Structure

```
freshterra-web/
├── .github/workflows/         # CI pipelines
├── .vscode/                   # editor settings
├── public/                    # static assets, favicons, robots.txt
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (marketing)/       # brand, food philosophy, careers, contact, policies
│   │   │   ├── about/
│   │   │   ├── food-philosophy/
│   │   │   ├── careers/
│   │   │   ├── contact/
│   │   │   ├── privacy-policy/
│   │   │   ├── terms/
│   │   │   └── refund-return/
│   │   ├── (shop)/            # catalog & discovery surfaces
│   │   │   ├── page.tsx              # homepage
│   │   │   ├── c/[slug]/             # category (PLP)
│   │   │   ├── collection/[slug]/    # curated collection (PLP)
│   │   │   ├── p/[slug]/             # product detail (PDP)
│   │   │   ├── search/               # search results page
│   │   │   └── stores/
│   │   │       ├── page.tsx          # store list
│   │   │       └── [slug]/           # individual store
│   │   ├── api/               # BFF routes (server-only)
│   │   │   ├── revalidate/    # webhook target for Strapi/Saleor
│   │   │   ├── places/        # Google Places proxy (keeps key server-side)
│   │   │   ├── serviceability/# pincode → store_id resolver
│   │   │   └── health/
│   │   ├── layout.tsx         # root layout (providers, fonts, analytics)
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── sitemap.ts         # dynamic sitemap
│   │
│   ├── features/              # business domains — one folder per PRD
│   │   ├── catalog/           # PLP, PDP, product card, filters, sort
│   │   ├── search/            # Wizzy autocomplete, SRP, recent searches
│   │   ├── location/          # 5-stage detection flow, store selector
│   │   ├── store-locator/     # store list + individual store pages
│   │   ├── cms-content/       # homepage rails, hero carousel, brand pages
│   │   ├── deeplink/          # mobile redirect logic, smart banners
│   │   └── analytics/         # unified tracker, event types
│   │
│   ├── components/            # shared, presentational, no business logic
│   │   ├── ui/                # primitives (Button, Modal, Input, etc.)
│   │   ├── layout/            # Header, Footer, MegaMenu, MobileNav
│   │   ├── seo/               # JsonLd helpers, meta builders
│   │   └── analytics/         # GoogleTagManager (script + noscript loader)
│   │
│   ├── lib/
│   │   ├── clients/           # one file per third-party — never import vendor SDKs elsewhere
│   │   │   ├── saleor.ts
│   │   │   ├── erpnext.ts
│   │   │   ├── strapi.ts
│   │   │   ├── wizzy.ts
│   │   │   ├── imagekit.ts
│   │   │   └── google-maps.ts
│   │   ├── analytics/
│   │   │   ├── ga4.ts
│   │   │   ├── clevertap.ts
│   │   │   └── tracker.ts     # unified facade — call this, not the SDKs
│   │   ├── config/
│   │   │   ├── env.ts         # zod-validated env at boot
│   │   │   └── flags.ts       # feature flags
│   │   ├── seo/               # metadata builders, structured data
│   │   └── utils/             # generic helpers (no business logic)
│   │
│   ├── hooks/                 # cross-feature hooks (useStore, useLocation)
│   ├── styles/                # globals.css, tailwind config extensions
│   ├── types/                 # global TS types, Saleor codegen output
│   └── middleware.ts          # store cookie, deeplink redirect, locale
│
├── tests/
│   ├── e2e/                   # Playwright specs
│   └── fixtures/
├── codegen.ts                 # graphql-codegen config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── .env.example
├── .nvmrc
├── package.json
└── README.md
```

**Path aliases** (configure in `tsconfig.json`):

```json
{
  "@/*": ["./src/*"],
  "@/features/*": ["./src/features/*"],
  "@/components/*": ["./src/components/*"],
  "@/lib/*": ["./src/lib/*"],
  "@/hooks/*": ["./src/hooks/*"]
}
```

---

## 4. Rendering Strategy

| Route                    | Mode                                  | Reason                                         |
| ------------------------ | ------------------------------------- | ---------------------------------------------- |
| Brand / policy / careers | SSG + on-demand revalidate            | Strapi-backed, low change rate                 |
| Homepage                 | ISR (60s)                             | Mix of CMS rails + Saleor catalog              |
| Category PLP             | SSR + edge cache                      | Filters per request, store-scoped              |
| PDP                      | ISR + `revalidateTag('product:{id}')` | Saleor webhook busts on price/stock change     |
| Search SRP               | Client-rendered                       | Wizzy is real-time                             |
| Store list / store page  | SSG                                   | One page per store, regenerated on data change |

---

## 5. Integration Layer

**Rule:** No file outside `src/lib/clients/` may import a vendor SDK directly.
Always go through the wrapper.

### 5.1 Saleor (catalog, products, categories)

- GraphQL over `graphql-request`. App token in env.
- Run `pnpm codegen` to generate typed queries from `src/features/**/*.graphql`.
- Every query that returns products **must** accept `storeId` and pass it to
  Saleor channel scoping. Never call without a store.

### 5.2 ERPNext (return eligibility flags, master data fallback)

- REST wrapper. Read-only on web in Phase 1.
- Use only when Saleor doesn't expose the needed field.

### 5.3 Strapi (CMS content)

- Two fetchers: `strapiServer` (with draft token, for preview) and
  `strapiPublic` (cached, published only).
- Always tag fetches: `next: { tags: ['cms:home', 'cms:hero'] }` so the
  `/api/revalidate` webhook can bust precisely.
- Strapi manages: hero carousel, banners, homepage section names, search
  rotating placeholders (8–10 grocery-specific), brand page content.

### 5.4 Wizzy (search) — **CRITICAL**

Per the Wizzy Implementation PRD:

- **Two credential sets**: staging and production. Wired via env, never
  hardcoded. Validate one staging call before any production work.
- **Every API call must include `store_id`**. The wrapper injects it from
  server-side store context — callers never pass it manually.
- **Payload schema is exact**. Deviations cause silent analytics failures.
  Validate every request body with zod before sending.
- Implement all four APIs: Autocomplete (chars ≥ 3), Search (20 per batch,
  infinite scroll), Filter, Events.
- Events API powers all search analytics. Wire the full chain:
  `search_start` → `search_submitted` → `results_served` → `product_clicked`
  → `atc_search` → `purchase_search`.

### 5.5 ImageKit (media)

- URL builder only — no SDK. Wire as a custom `next/image` loader so
  `<Image>` automatically applies `tr:w-{width},h-{height},q-auto,f-auto`.
- Image dimensions are prescribed in the Standards & Content Requirement
  List PRD. Build typed `<Img variant="pdp-hero" />` wrappers that enforce
  the spec sizes.

### 5.6 Google Maps (location, store locator)

- Lazy-load the JS API only on routes that need it (location flow, store
  locator, individual store pages). Never load on homepage or PLP.
- Geocoding + Places Autocomplete go through `/api/places/*` server routes
  to keep the key off the client. Apply quota guards.
- Restrict to India (`components=country:in`) per Location PRD.
- Browser key (Maps JS) must be referrer-restricted in GCP console.

### 5.7 Analytics (GTM + GA4 + CleverTap + Wizzy Events)

- **GTM is loaded once** at the root layout via
  `src/components/analytics/GoogleTagManager.tsx`. Container ID
  `GTM-KDR6N28Q` is shared across environments; the TEST GTM environment is
  targeted by setting `NEXT_PUBLIC_GTM_AUTH` + `NEXT_PUBLIC_GTM_PREVIEW`
  (see §7). GA4 measurement IDs live INSIDE GTM, not in this repo.
- **Never** call `gtag(...)`, `dataLayer.push(...)`,
  `clevertap.event.push(...)`, or Wizzy events directly from a component
  or feature.
- Always go through `lib/analytics/tracker.ts` which fans out to all sinks
  (GTM is added as a `gtm` sink alongside ga4/clevertap when the event
  spec lands).
- Event names + params are typed via a discriminated union in
  `features/analytics/events.ts`. TS will block unknown events.

---

## 6. Coding Conventions

### General

- TypeScript strict. No `any`, no `as unknown as X` escape hatches without a
  comment explaining why.
- Server components by default. Mark `'use client'` only when necessary
  (event handlers, browser APIs, hooks).
- Co-locate component-specific types, styles, and tests with the component.
- One default export per file for components; named exports for utilities.

### Naming

- Components: `PascalCase.tsx`
- Hooks: `useThing.ts`
- Utilities: `camelCase.ts`
- Constants: `SCREAMING_SNAKE_CASE`
- Folders: `kebab-case`
- Test files: `*.test.ts(x)` (unit), `*.spec.ts` (e2e)

### Imports

Order (enforced via ESLint):

1. React / Next
2. External packages
3. `@/lib/*`
4. `@/components/*`
5. `@/features/*`
6. Relative imports
7. Types (with `import type`)

### Server vs Client

- Data fetching → RSC. Use `fetch` with `next: { tags, revalidate }`.
- Interactive UI → Client component, but keep it as a leaf. Pass server-fetched
  data down as props, don't refetch in the client.
- Mutations → Server Actions for any (rare in Phase 1).

### Error handling

- Each route group has an `error.tsx` boundary.
- Third-party client wrappers throw typed errors (`SaleorError`, `WizzyError`)
  that include status + request id. Never leak raw vendor responses.

### Accessibility

- Semantic HTML first; ARIA only when semantics don't cover it.
- All interactive elements keyboard-reachable; focus rings preserved.
- `eslint-plugin-jsx-a11y` runs on lint.
- Color contrast ≥ WCAG AA.

### SEO (mandatory for PDP, PLP, brand pages)

- `generateMetadata` on every public route.
- Structured data via `lib/seo/jsonLd.ts`:
  - PDP → `Product` + `BreadcrumbList`
  - Store page → `LocalBusiness`
  - Brand pages → `Organization`
- Dynamic sitemap from `app/sitemap.ts` querying Saleor + Strapi.

---

## 7. Environment & Configuration

`.env.example` (commit this; never commit real values):

```bash
# Saleor
NEXT_PUBLIC_SALEOR_API_URL=
SALEOR_APP_TOKEN=

# ERPNext
ERPNEXT_API_URL=
ERPNEXT_API_KEY=
ERPNEXT_API_SECRET=

# Strapi
STRAPI_API_URL=
STRAPI_API_TOKEN=
STRAPI_PREVIEW_TOKEN=
STRAPI_REVALIDATE_SECRET=

# Wizzy (per-environment)
WIZZY_API_URL=
WIZZY_API_KEY=
WIZZY_PROJECT_ID=

# Google Maps
GOOGLE_MAPS_SERVER_KEY=        # for /api/places, server-only
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=  # referrer-restricted

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_CLEVERTAP_ACCOUNT_ID=

# Google Tag Manager — single container, env-switched via auth/preview.
# Leave AUTH+PREVIEW unset in production; set both for the TEST GTM env.
NEXT_PUBLIC_GTM_ID=GTM-KDR6N28Q
NEXT_PUBLIC_GTM_AUTH=                 # PROD: blank | TEST: LFqR_9j4YF5nxuaI5ylU2A
NEXT_PUBLIC_GTM_PREVIEW=              # PROD: blank | TEST: env-5

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_STORE_URL=
NEXT_PUBLIC_PLAY_STORE_URL=
```

Validate at boot with `lib/config/env.ts` (zod). Fail fast on missing values.

---

## 8. Commands

```bash
# Development
pnpm dev                # start dev server
pnpm build              # production build
pnpm start              # serve production build
pnpm codegen            # graphql-codegen (run after Saleor schema changes)

# Quality
pnpm typecheck          # tsc --noEmit
pnpm lint               # eslint
pnpm lint:fix           # eslint --fix
pnpm format             # prettier --write
pnpm test               # vitest
pnpm test:watch         # vitest --watch
pnpm e2e                # playwright test
pnpm e2e:ui             # playwright test --ui

# Pre-commit (runs automatically via husky)
# - lint-staged → eslint + prettier on staged files
# - typecheck on changed scope
# - commitlint on commit message
```

---

## 9. TDD Workflow

For any new feature:

1. **Read the relevant PRD** in the project knowledge before writing code.
2. **Write the test first** — Vitest for logic, Playwright for flows.
3. Implement the minimum to pass.
4. Refactor with tests green.
5. Wire analytics events as the **last** step (after UI works).

Don't ship a feature without:

- ✅ At least one happy-path test
- ✅ At least one error / empty-state test
- ✅ Analytics events wired through `tracker.ts`
- ✅ Loading + error UI states
- ✅ Mobile + desktop checked

---

## 10. Working Agreements for Claude Code

When a user asks Claude Code to build something in this repo:

1. **Always read this file first.** Then read the relevant PRD from project
   knowledge before generating code.
2. **Stay inside Phase 1 scope.** If asked to build cart/checkout/auth on web,
   stop and confirm.
3. **Never bypass `lib/clients/`.** No `fetch('https://api.saleor...')` outside
   the wrapper. No `gtag(...)` outside `tracker.ts`.
4. **Never hardcode `store_id`, API keys, or pixel sizes.** All come from env,
   context, or the standards spec.
5. **Match existing patterns** before inventing new ones. If a similar feature
   exists, follow its structure.
6. **Run typecheck + lint + relevant tests** before declaring a task done.
7. **If a PRD field is marked "Tech Pending" or "Client Pending"** in the
   project knowledge, surface that to the user instead of guessing.

---

## 11. Initial Setup — Bootstrap Prompt

To scaffold this repo from scratch, paste the following into a fresh Claude
Code session at the empty repo root:

```
Read CLAUDE.md in full, then bootstrap the FreshTerra Web Next.js project
exactly as specified. Execute in this order:

1. Initialize:
   - pnpm init, set Node 20 in .nvmrc, set "type": "module"
   - Install Next.js 15, React 19, TypeScript 5, Tailwind v4
   - Install: graphql-request, graphql, zod, react-hook-form, @hookform/resolvers,
     @tanstack/react-query, clsx, tailwind-merge
   - Dev deps: @graphql-codegen/cli + plugins, vitest, @testing-library/react,
     @testing-library/jest-dom, @playwright/test, eslint, eslint-config-next,
     eslint-plugin-jsx-a11y, prettier, prettier-plugin-tailwindcss, husky,
     lint-staged, @commitlint/cli, @commitlint/config-conventional

2. Create the full folder tree from CLAUDE.md section 3 with .gitkeep files
   in empty leaf directories.

3. Configure:
   - tsconfig.json with strict mode + path aliases (section 3)
   - next.config.ts (typed, with image domains for ImageKit)
   - tailwind.config.ts with shadcn/ui-compatible setup
   - eslint.config.mjs (flat config, with jsx-a11y + import order)
   - .prettierrc with prettier-plugin-tailwindcss
   - vitest.config.ts (jsdom env)
   - playwright.config.ts (chromium + webkit)
   - codegen.ts (Saleor schema → src/types/saleor.ts)
   - commitlint.config.js (Conventional Commits)
   - .lintstagedrc + husky pre-commit + commit-msg hooks

4. Create .env.example exactly as in section 7. Create lib/config/env.ts
   with a zod schema validating every variable.

5. Create stub client wrappers in lib/clients/ for: saleor, erpnext, strapi,
   wizzy, imagekit, google-maps. Each exports a typed client object with
   placeholder methods + JSDoc explaining what it does. No real API calls yet.

6. Create lib/analytics/tracker.ts with a typed event union and a track()
   facade. Stubs for ga4, clevertap, wizzy event sinks.

7. Create app/layout.tsx with QueryClientProvider, fonts, and analytics init.
   Create the route group folders (marketing), (shop), api with placeholder
   page.tsx files returning a "Coming soon" component.

8. Create middleware.ts that reads/writes the store_id cookie and handles
   the deeplink redirect for mobile devices.

9. Add npm scripts from section 8 to package.json.

10. Create .github/workflows/ci.yml: typecheck, lint, test, build on PR.

11. Create README.md with: project overview, prerequisites, setup steps,
    common commands, and a link back to CLAUDE.md.

12. Run: pnpm install, pnpm typecheck, pnpm lint, pnpm build to verify
    everything compiles and the empty app boots.

After bootstrap, output a summary of what was created and any decisions
that need user input (e.g., which Strapi content types, exact Saleor schema
URL, design token values from the design system).

Do NOT scaffold any of the OUT-OF-SCOPE features listed in section 1.
```

---
