# Milestone 1 — Audit and development foundation

Date: 27 October 2026 (Asia/Kolkata). Scope: the current kickoff's Milestone 1,
not the older root plan's shared-shell milestone. This is a development foundation,
not a production-ready public website.

## Starting state and baseline

This directory contained root AGENTS/PRD/TRD/design/phase documents, an earlier
audit/working plan, four HTML files under `design/`, duplicated HTML exports and
four screenshots under `stitch_edtech_publications_academic_portal/`.

`git status --short --branch` returned **128**, not a Git repository. No branch,
remote, history or Git working-tree status was available. No Git initialization,
commit, push or deployment was performed. A pre-edit SHA-256 snapshot covered all
30 existing files. Only AGENTS and the working plan were deliberately updated;
all other 28 original files were preserved byte-for-byte.

No `package.json`, lockfile, framework, tests, env, deployment or CI existed.
Baseline lint/typecheck/unit/E2E/content/build/dependency checks were therefore
**unavailable**, not passing and not pre-existing application failures.
Refreshed source checks found four groups of three identical HTML files, 183 hash
anchors, 31 images without alt text, and **8/8 inline scripts passing `node --check`**.
Syntax does not prove interactions work. The earlier audit retains detailed source
risks; this milestone does not claim to fix those archived references.

## Delivered behavior and architecture

A single Next.js App Router development app with strict TypeScript, React and
build-time Tailwind; native 404 recovery, English document language, skip link,
visible focus and honest unfinished-site copy. Search indexing/crawling is disabled.
Only `/`, `/robots.txt` and native not-found behavior exist. There is no public
catalogue, navigation shell, form, provider integration or homepage recreation.

Node 24.22.0/npm 11, exact dependency pins and npm lockfile; ESLint Next/TypeScript
rules, Prettier, Vitest/Testing Library, Playwright and a narrowly scoped production
source content guard. CI runs locked install/checks/browser tests/dependency audit.
The template has not executed remotely. No external credentials are required.

Decision 0001 records presentation/domain/application/infrastructure boundaries,
stack alternatives, deferred dependencies, Webpack selection after restricted
Turbopack port errors, and the ESLint peer constraint. PostgreSQL/Prisma, form
libraries, storage and mail are deferred to real features and approved operations.

## Files created or changed

Created:

- App: `src/app/layout.tsx`, `page.tsx`, `not-found.tsx`, `robots.ts`, `globals.css`.
- Tooling: `package.json`, `package-lock.json`, `.nvmrc`, `.gitignore`, `.env.example`,
  `.prettierignore`, `.prettierrc.json`, `tsconfig.json`, `next-env.d.ts`,
  `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`,
  `playwright.config.ts`, `.github/workflows/ci.yml`.
- Checks: `scripts/check-content.mjs`, `tests/setup.ts`,
  `tests/unit/foundation.test.tsx`, `tests/unit/content-guard.test.mjs`,
  `tests/e2e/foundation.spec.ts`.
- Docs: `README.md`, `docs/FOUNDATION_PLAN.md`, `docs/SETUP.md`, `docs/ROUTE_MAP.md`,
  `docs/decisions/0001-application-foundation.md`, this report.

Changed `AGENTS.md` to point to actual root specifications and commands;
changed `docs/IMPLEMENTATION_PLAN.md` to record kickoff authority and current stack.
The root plan remains the original phase outline. Generated `.next`, `node_modules`
and browser artifacts are ignored, not source deliverables.

## Verification record

All application commands use Node 24.22.0/npm 11.19.1.

| Check                                                             | Actual result                                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Initial test run before implementation                            | 2 suites failed on absent app/guard imports, as expected                                                           |
| `npm test` after implementation                                   | 2 suites, 6 tests passed                                                                                           |
| Deliberate invalid app fixture + `node scripts/check-content.mjs` | Exit 1; reported dead hash link and placeholder copy; fixture removed                                              |
| `npm run typecheck`                                               | Route generation and strict TypeScript passed                                                                      |
| `npm run lint`                                                    | Initial anonymous PostCSS export warning fixed; subsequent run passed with zero warnings                           |
| `npm ls eslint --all`                                             | ESLint 10 exposed invalid plugin peers; pinned 9.39.5 tree exits 0                                                 |
| Initial `next build` (Turbopack)                                  | Failed twice: internal PostCSS port bind denied in this environment                                                |
| `npx next build --webpack`                                        | Passed; generated `/`, `/_not-found`, `/robots.txt`                                                                |
| `npx playwright install chromium`                                 | Installed matching Chromium/headless shell and FFmpeg                                                              |
| `npm run test:e2e`                                                | 8/8 passed against production server at six PRD widths; 404, robots, keyboard, overflow and browser errors checked |
| Initial `npm audit --json`                                        | 2 moderate Vitest advisory chains; patched to 4.1.12; subsequent install audit: zero vulnerabilities               |
| Clean locked install and final full gates                         | See final verification below                                                                                       |

### Final verification

- `npm ci`: exit 0, 466 packages added; install audit found zero vulnerabilities.
- `NEXT_TELEMETRY_DISABLED=1 npm run check`: exit 0. ESLint zero warnings,
  framework type generation/strict TypeScript, 6/6 unit tests, source guard,
  Prettier and Webpack production build all passed.
- `npm run test:e2e` after clean install and rebuild: exit 0, **8/8 passed**.
- `npm audit --audit-level=high`: exit 0, **zero vulnerabilities**.
- `npm ls --depth=0` and `npm ls eslint --all`: exit 0; no invalid peers.
- Original-file SHA-256 comparison: only intended AGENTS/working-plan edits;
  remaining **28/28 original files unchanged**.

Initial registry reads failed in the restricted network; registry installation,
advisory checks and Chromium download subsequently succeeded with appropriate
execution permissions. Browser/server checks also required local process/port
permissions. The supported Webpack build passed within the restricted shell.
Installer warnings remain for deprecated ESLint 9 and package lifecycle scripts
not explicitly covered by npm's allowScripts policy (`fsevents`, `unrs-resolver`).
No required check failed because of those warnings. Playwright emitted inherited
NO_COLOR/FORCE_COLOR process warnings; no browser console/page errors were found.

Independent read-only code review found no important or critical issues. One
minor stale audit-stop instruction in the working plan was corrected. The reviewer
did not independently rerun tests; the command results above are the implementing
agent's observed runs.

## Remaining risks, configuration and deviations

- Approved seal, covers, local Newsreader/Manrope assets, authoritative book/subject
  metadata, claims, policies, agreements and ordering copy are still needed.
  The supplied book metadata conflicts and some ISBNs fail checksums; none was published.
- The minimal development entry uses system typography. Approved fonts, populated
  navy footer, responsive navigation and real hero belong to the next shared-shell
  milestone; no visual equivalence or full accessibility compliance is claimed here.
- ESLint 9.39.5 is deprecated upstream but satisfies all current bundled plugin
  peers. Track upgrade when Next's React/import/accessibility dependencies support
  ESLint 10; no peer bypass or forced audit fix was used.
- Source guard checks only static source hash links and lorem ipsum in app JSX/HTML.
  It does not validate catalogue authenticity, all link targets or full content safety.
- No database, migrations, private storage, mail, sender DNS, abuse protection,
  submission consent/retention/access policy, hosting or backup configuration.
  The 20 MB per-file versus request limit remains unresolved. These block their
  dependent features/release, not local foundation work.
- No GitHub CI run, deployment, email delivery, upload, screen-reader audit,
  Lighthouse score, Firefox/Safari run or live business-contact verification.
- No PRD/TRD product requirement was waived. Implementation remains deliberately
  incomplete; original palette prose conflicts and milestone numbering are recorded.

## Next small task

Build only the shared responsive header/footer and homepage hero from the actual
reference, with Newsreader/Manrope and an approved local seal. Resolve palette/radii
conflicts explicitly; only expose implemented destinations. Verify keyboard/mobile
navigation and compare at desktop/mobile widths before beginning catalogue work.
Obtain authoritative catalogue records in parallel with that next milestone.
