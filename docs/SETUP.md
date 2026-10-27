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
  It is **not** a catalogue validator, rendered link checker or content-approval system.
- `npm run format:check`: Prettier for maintained code/docs. Historical reference
  files are excluded to preserve the handoff.
- `npm run check`: all the above plus production build.
- `npm run test:e2e`: production-server Chromium tests at six PRD widths, 404,
  mobile keyboard navigation, hero GET search, route links, local fonts, no-index
  policy, text scaling and browser errors. Build/install browser first.
- `npm audit --audit-level=high`: network-dependent dependency advisory check.

## Environment variables and external setup

No application environment variables are required or read in Milestone 1.
`.env.example` documents this without provider keys. Do not put provider secrets
in `NEXT_PUBLIC_*`, source files, logs or browser code. `.env*` is ignored except
the example. Do not commit real credentials.

Before submissions, decide hosting and durable database/store, private storage,
request/file limits (20 MB per-file versus total unresolved), malware handling,
rate limits, consent/retention/deletion/access, verified sender domain and mail
retry/notification operations. Add exact env names and server-only validation when
adapters are implemented; missing required config must fail safely. No migrations,
storage buckets or email setup exist yet.

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
