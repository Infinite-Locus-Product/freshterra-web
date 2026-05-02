# FreshTerra Web

Responsive web frontend for FreshTerra (marketing + catalog browsing). The
mobile apps (React Native) own all transactional features — see [CLAUDE.md](CLAUDE.md)
for the full Phase 1 scope.

## Prerequisites

- **Node 20 LTS** — pinned via `.nvmrc`. Use `nvm use` from this directory.
- **pnpm 10** — `corepack enable && corepack prepare pnpm@10.16.0 --activate`.

## Setup

```bash
nvm use
pnpm install
cp .env.example .env.local   # fill in real values
pnpm dev                     # http://localhost:3000
```

## Common commands

```bash
pnpm dev          # Next dev server
pnpm build        # production build
pnpm start        # serve production build

pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm test         # vitest run
pnpm test:watch   # vitest watch
pnpm e2e          # playwright test

pnpm codegen      # graphql-codegen (Saleor types)
pnpm format       # prettier --write
```

## Project layout

See [CLAUDE.md §3](CLAUDE.md). High-level:

- `src/app/` — Next.js App Router (`(marketing)`, `(shop)`, `api/`)
- `src/features/` — business domains, one folder per PRD
- `src/components/` — shared presentational components
- `src/lib/clients/` — third-party wrappers (the only place vendor SDKs are imported)
- `src/lib/analytics/tracker.ts` — unified analytics facade
- `src/lib/config/env.ts` — zod-validated env

## Working agreements

[CLAUDE.md §10](CLAUDE.md). The short version:

1. Read CLAUDE.md and the relevant PRD before generating code.
2. Stay inside Phase 1 scope (no cart/checkout/auth on web).
3. Never bypass `lib/clients/` or `lib/analytics/tracker.ts`.
4. Never hardcode `store_id`, API keys, or pixel sizes.
5. Run `pnpm typecheck && pnpm lint && pnpm test` before declaring done.

## CI

GitHub Actions runs typecheck, lint, test, and build on every PR — see
[.github/workflows/ci.yml](.github/workflows/ci.yml).
