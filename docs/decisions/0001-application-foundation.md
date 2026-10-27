# 0001 — Application foundation

Date: 2026-10-27. Status: adopted for the authorized kickoff Milestone 1.

## Context and authority

The directory has specifications and four unique static HTML screens, not an
application: no Git metadata, manifest, lockfile, server, tests or deployment.
The current kickoff explicitly authorizes bootstrapping an unusable/empty app
with the target stack and making reversible engineering decisions. This
supersedes the earlier audit's stop-for-review instructions for foundation only.
No Git initialization, remote creation or deployment is included.

## Decision and alternatives

Use one Next.js App Router application, React, strict TypeScript, build-time
Tailwind, npm with an exact dependency manifest and committed lockfile, and Node
24 LTS (`.nvmrc`). Next supports server-rendered catalogue routes and later native
submission handlers in one deployable unit. There is no functioning stack to
replace. Runtime/library compatibility is verified against registry metadata;
the Next/React versions must satisfy their peer requirements.

Keeping HTML-only would avoid dependencies but requires a routing, build and
server solution for the documented product. A custom React/Vite server would
require additional SSR/routing integration. The explicitly requested Next stack
is the smallest supported choice for this handoff.

ESLint (Next rules), TypeScript, Prettier, Vitest/Testing Library and Playwright
establish independent checks. GitHub Actions provides the requested CI template;
it is not evidence of a connected GitHub repository or a successful remote run.

Defer Prisma/PostgreSQL/Supabase, Zod/React Hook Form, Resend and private storage
until their features and operational requirements exist. Do not create migrations,
accounts, CMS, payments or providers. Catalogue authority/source remains open.

## Boundaries

- `src/app`: framework routes and presentation composition; no direct database calls.
- `src/components` (when needed): reusable accessible presentation.
- `src/domain` (when needed): pure catalogue/submission rules, no framework I/O.
- `src/application` (when needed): validated use cases and orchestration.
- `src/infrastructure` (when needed): content repositories, persistence, mail/storage adapters.
- `src/config`: application configuration; no secrets in client configuration.
- `tests/unit`, `tests/e2e`: behavioral and production-server smoke checks.

Create modules when used rather than empty abstractions. Root `PRD.md` and
`TRD.md` remain authoritative; `docs/IMPLEMENTATION_PLAN.md` is the working plan.
The kickoff's milestone numbering governs this delivery; older plans differ.

## Consequences and deferred gates

Only a clearly labelled development entry page and 404 are exposed. Keep it
unindexed until approved public content exists. No approved homepage, shared
shell, seal, catalogue or submission workflow is claimed in this milestone.
Do not serve the raw design exports as production assets.

Preserve all HTML/screenshots and the current design docs. Navy `#011633`, blue
`#1F58C4` and pale-blue surfaces follow explicit user instructions/PRD/TRD;
contradictory older palette prose is not adopted. Newsreader/Manrope and the real
seal must be integrated and visually reviewed in the shared-shell milestone.

Hosting remains unselected; Vercel-compatible Next build is the default artifact.
Production needs approved content/assets/legal terms and operations decisions.

## Verified compatibility adjustments

The Turbopack build failed twice in this restricted environment while PostCSS
attempted an internal port bind (`Operation not permitted`). Next's supported
`--webpack` build then succeeded with the same source and dependencies. Use
Webpack for dev/build consistently until a deliberate, verified bundler change.
No architecture or framework replacement is involved.

ESLint 10 satisfied Next's direct peer range but `npm ls eslint --all` exposed
incompatible bundled import/React/accessibility plugin peer ranges. Pin ESLint
9.39.5 to keep the complete dependency tree valid. npm marks it deprecated;
track a move to ESLint 10 when all bundled peers support it. Do not bypass peers.
Vitest 4.1.10 had two moderate advisory chains; 4.1.12 resolves them.
