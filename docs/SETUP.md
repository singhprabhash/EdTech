# Development and environment

## Runtime and package ownership

Use `.nvmrc` (Node 24.22.0) and npm 11. Versions are pinned in `package.json` and
resolved transitively by `package-lock.json`; use `npm ci` for reproducible installs.
The audit host default Node 25 is not the selected runtime. Use `nvm use` first.

- `npm run dev`: local development on port 3000.
- `npm run build` / `npm start`: production artifact and local server.
- `npm run lint`: ESLint CLI, including Next/TypeScript rules; zero warnings.
- `npm run typecheck`: generate framework route types, then strict `tsc --noEmit`.
- `npm test`: Vitest/Testing Library and content guard fixtures.
- `npm run content:check`: scoped source guard across `src/` for dead `href="#"` and lorem ipsum.
  It is **not** a rendered link checker or content-approval system.
- `npm run format:check`: Prettier for maintained code/docs. Historical reference
  files are excluded to preserve the handoff.
- `npm run check`: all the above plus production build.
- `npm run test:e2e`: production-server Chromium tests at six PRD widths, 404,
  mobile keyboard navigation, retired storefront 404s, route links, local fonts, no-index
  policy, text scaling and browser errors. Build/install browser first.
- `npm audit --audit-level=high`: network-dependent dependency advisory check.

## Environment variables and external setup

No credentials are required to view the public local preview. `.env.example`
documents server services and release flags. Never put secrets in `NEXT_PUBLIC_*`,
source, logs or client code. See `AEETDS_GUIDE_OPERATIONS.md` for the chosen Node24 /
private SQLite, authenticated SMTP, Turnstile, scanner, worker and backup setup.
Missing settings fail closed. Google Forms provide current conference participation.

For production sitemap/canonical URLs set the verified HTTPS `AEETDS_SITE_URL` and
explicit `AEETDS_PUBLIC_RELEASE=true`. The preview sitemap stays empty without both.
Google verification is configured in root metadata with the user-supplied token.
Analytics is not configured: that token is not a GA4 measurement ID.

## CI and deployment

`.github/workflows/ci.yml` uses the declared Node/npm runtime, locked installation,
all local checks, Chromium installation/tests, and dependency audit. Workflow
permissions are read-only. Actual workflow execution requires a GitHub repository.

No hosting account or deployment is configured. No production URL, canonical
origin, sitemap, mail delivery, upload, backup or restore has been verified.
Do not deploy as a completed publishing website. See TRD release gates.

## Primary design compilation

Python 3.12+ (standard library only) is required for `npm run reference:compile`
and `npm run reference:check`. The full check includes stale-output verification
and compiler security/regression tests. See `READY_DESIGN_WORKFLOW.md`.

## AEETDS server services

Use Node 24 from `.nvmrc`. See `.env.example` and
[Developer Guide operations](AEETDS_GUIDE_OPERATIONS.md) for private persistent
storage, authenticated SMTP, Turnstile, scanner and Secretary credentials.
`npm run storage:init`, `npm run submissions:retry`, `npm run backup:create` and
`npm run backup:restore -- <snapshot> <new-directory>` are operator commands.
No production environment or scheduled worker is installed by local development.
