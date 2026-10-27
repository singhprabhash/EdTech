# EdTech Publications Repository Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for approved implementation, task by task. Subagent-driven work requires an explicitly authorized execution choice. The current kickoff authorizes Task 1 foundation; later tasks remain pending.

**Goal:** Convert the supplied four-screen static handoff into the production website defined by the PRD, with verified content and reliable submissions.

**Architecture:** Preserve the reference files as inputs. After stack review, use one web application with shared UI, a catalogue domain/data boundary, and isolated persistence/mail/private-storage adapters. Do not create separate services, a CMS, search engine, queue or payment integration by default.

**Tech stack:** Foundation now selects Next.js App Router, React, strict TypeScript, Tailwind, npm/lockfile and Node 24 LTS. See `decisions/0001-application-foundation.md`, `FOUNDATION_PLAN.md` and `MILESTONE_1.md` for current scope and verification. Hosting and data providers remain unselected. The original starting point was plain HTML and inline JavaScript with unpinned Tailwind CDN.

**Spec:** `../PRD.md`, `../TRD.md`, `../AGENTS.md`. Evidence: `REPOSITORY_AUDIT.md` in this directory. Root `../IMPLEMENTATION_PLAN.md` is the original generic milestone checklist; this repository-specific plan supersedes it without changing the original handoff.

## Global constraints

- The earlier audit was read-only. The current kickoff authorizes reversible foundation work; it does not authorize unverified business content or provider decisions.
- Preserve original files and any future uncommitted changes. This directory currently has no Git metadata; do not assume a clean branch or existing indexed routes.
- No stack replacement or major dependency/infrastructure additions without evidence and written rationale. The kickoff authorizes initial scaffolding; decision 0001 records rationale.
- Use navy `#011633`, blue `#1F58C4`, cool pale-blue/white surfaces, Newsreader headings, Manrope UI and the approved circular seal. Populate the dark navy footer required by AGENTS. Reconcile design prose/radii conflicts visibly.
- Never invent titles, authors, ISBNs, DOI, prices, availability, counts, policies, awards or business claims. A checksum pass is not authenticity verification.
- One validated content source. Edition/format-specific ISBNs and approved currency/prices must remain distinct. No draft data in public routes/schema/sitemap.
- No fake success, `href="#"`, dead controls, client secrets or PII logging. No online payments unless explicitly approved.
- Proposal description max 300 words; `.doc`, `.docx`, `.pdf`, up to 20 MB per source, with per-file vs request limit still requiring confirmation. Durable acceptance precedes success; mail failures remain retryable and observable.
- Acceptance widths: 320, 390, 768, 1024, 1280, 1440 px; WCAG 2.2 AA target; Lighthouse Performance ≥90 under a documented profile. These are targets, not current results.

## Review focus

1. Same title with different author/ISBN/format across screens: reject unapproved conflicting imports; never merge editions by title alone (Task 2).
2. URL state with ISBN punctuation, blank/invalid filters and tied sorts: normalize consistently and return stable results/counts (Task 4).
3. Narrow/zoomed pages with long DOI/ORCID/translated metadata and sticky headers: retain navigation, readable content and focus without overlap or unintended overflow (Tasks 3–4, 8).
4. Network/storage/mail failure and repeated submission: acceptance must not be lost, duplicated or falsely reported; private attachments cannot leak (Tasks 6–7).
5. Missing optional content, unavailable covers/samples and clipboard failure: omit or present honest recoverable states without fake metadata/download/copy success (Tasks 2, 4–5).

## Audit milestone — completed with stated limits

- [x] Read root AGENTS/PRD/TRD/plan and both design documents; record missing `docs/` inputs.
- [x] Inventory entire supplied tree and inspect Git status; record absence of application/Git/configuration.
- [x] Map twelve HTML files to four unique screens and proposed required routes.
- [x] Review all four screenshots and source interactions, navigation, content, accessibility and responsive risks.
- [x] Run available audit checks: inline JavaScript syntax, duplicate grouping, HTML inventory, ISBN checksum and token contrast.
- [x] Record existing quality gates as unavailable; do not claim tests/build/browser QA passed.
- [x] Create `docs/REPOSITORY_AUDIT.md` and this dependency-aware plan.
- [x] Current kickoff supplies authority to execute Task 1. Later product tasks remain unstarted.

## File responsibility map

Existing references remain unchanged: `design/{homepage,catalog,specific_category,book_detail}.html`, all `stitch_edtech_publications_academic_portal/` exports and screenshots, root PRD/TRD/AGENTS/design documents.

The table below retains the future delivery map from the original audit. Foundation artifacts now exist as listed in `FOUNDATION_PLAN.md` and `ROUTE_MAP.md`; future feature paths/contracts are refined before each slice. Content/provider paths remain proposals, not created resources.

| Proposed path/area | Responsibility | First task |
| --- | --- | --- |
| `docs/decisions/0001-application-foundation.md` | Existing-app discovery outcome, runtime/framework/package manager/host rationale, options, costs and approval | 1 |
| `docs/ROUTE_MAP.md`, `docs/SETUP.md` | Route-to-actual-file map, redirects if needed, exact setup/check commands | 1, expanded in 4–5 |
| `docs/decisions/0002-content-source.md`, `docs/CONTENT_WORKFLOW.md` | Canonical source strategy, schema, owner approval, imports and rejected records | 2 |
| `content/books.json`, `content/subjects.json`, `content/site.json` | Proposed file-backed source if approved; not a requirement to use JSON if existing app is supplied | 2 |
| `schemas/book.schema.json`, `schemas/subject.schema.json` | Proposed source validation contract; validator choice follows stack review | 2 |
| Application shared layout/styles/components | Tokens, header, mobile drawer, footer, breadcrumbs, fields, book cards, alerts; actual paths entered in route map before edits | 3 |
| Application catalogue domain/data modules and corresponding tests | `listPublishedBooks`, `getPublishedBookBySlug`, normalized search/filter/sort/pagination; UI must not duplicate rules | 2, 4 |
| Framework-native route files and matching route tests | Routes listed in Tasks 4–5; actual file paths locked after Task 1 | 4–5 |
| `public/assets/`, `public/downloads/` (or framework equivalents) | Approved seal, optimized covers and versioned downloadable assets | 2–5 |
| `docs/decisions/0003-submission-operations.md`, `docs/SUBMISSION_OPERATIONS.md` | Persistence, mail, storage, abuse controls, retention, access, consent, retries and failure handling | 6–7 |
| Framework-native server endpoints/domain/adapters and tests | Contact/proposal acceptance; private-storage/mail boundaries | 6–7 |
| `.env.example`, framework env validation | Placeholder names only for approved providers; no secrets | 6–7 |
| CI config for approved repository host; `docs/DEPLOYMENT.md` | Locked install/checks, staging/release/rollback, backup/restore and incident ownership | 1, 8 |

No database migration, provider configuration or infrastructure resource is authorized merely by appearing in this map.

## Dependency graph

`Review → Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 8`

`Task 1 + approved privacy/operations decisions → Task 6 → Task 7 → Task 8`

Content/asset collection and operational decisions can proceed independently of each other after review. Tasks 6–7 also consume the shell/forms from Task 3 and approved copy from Task 5. Public catalogue work need not wait for a mail-provider decision. Production launch does wait for every applicable release gate.

## Task 1 — Establish reproducible tooling (kickoff Milestone 1)

**Authority:** The current kickoff explicitly authorizes bootstrap when no usable
application exists. This directory had none; an app elsewhere has not been ruled
out. No existing stack was replaced and no Git repository initialized.

**Files and checks:** `FOUNDATION_PLAN.md`, `ROUTE_MAP.md`, `SETUP.md`, decision 0001
and `MILESTONE_1.md` contain the exact paths, module boundaries and verification.

- [x] Record discovery, missing application/Git and unavailable baseline gates.
- [x] Keep root PRD/TRD authoritative and correct AGENTS paths without duplicating specs.
- [x] Document stack alternatives and choose the authorized Next/React/TypeScript/npm foundation.
- [x] Pin compatible runtime/dependencies and create minimal development routes.
- [x] Establish lint, strict types, behavioral unit tests, scoped source guard,
  formatting, production build, Chromium smoke and GitHub Actions checks.
- [x] Prove rejection with a deliberately invalid source fixture, then remove it.
- [x] Complete clean locked install and final verification record (see milestone report).

**Exit:** reproducible development foundation only. Approved public shell/content,
providers and production release remain later tasks. The kickoff milestone numbering
differs from the original generic phase outline.

## Task 2 — Approve content and implement its validation boundary

**Depends on:** Task 1 plus content-owner and asset approval. **Produces:** one publication-safe catalogue/site source and read boundary consumed by Tasks 3–5.

**Files:** proposed content/schema paths above or approved equivalents; content decision/workflow; catalogue repository/validation modules; content-validator tests; approved asset manifest.

- [ ] Obtain edition-level approved records and provenance, subject memberships, descriptions/TOC, prices/currency/order method and cover rights. Resolve every conflict enumerated in the audit; no seed records copied as approved from HTML.
- [ ] Approve typed-file versus database source based on catalogue size, editor workflow and update frequency. Prefer the simplest validated source; CMS/database requires evidence.
- [ ] Define stable IDs/slugs, ordered authors, explicit subjects and language; formats carry distinct ISBN/price/currency. Keep DOI/sample optional and verified. Define a publication state that excludes drafts.
- [ ] First write failing validator tests for duplicate IDs/slugs, invalid ISBN checksum, unresolved subject refs, missing required assets/alt, duplicate edition ISBN, draft leakage and conflicting imports. Include one valid-checksum but unapproved fixture that remains unpublished.
- [ ] Implement validation plus an import rejected-row report; document staff update/approval workflow. Never repair checksum digits to make a record appear valid.
- [ ] Define/read-test `listPublishedBooks` and `getPublishedBookBySlug`: missing or draft slugs return absence, not fallback sample data. Final types/signatures belong in the stack-specific task refinement.
- [ ] Validate approved logo/covers; document any missing optional sample/portrait and approved fallback. Counts derive only from published records.

**Exit:** content validation passes on approved records; unresolved records stay excluded; no invented catalogue totals. Missing authoritative catalogue blocks publishing book content, not schema development with clearly synthetic test-only fixtures.

## Task 3 — Shared accessible shell and responsive foundation

**Current kickoff implementation:** Header/footer, local fonts, hero text/search and
minimal supporting routes now exist. See `SHARED_SHELL_PLAN.md`, `ROUTE_MAP.md` and
`MILESTONE_2.md`. Actual seal and hero book artwork remain pending; this task is not
fully complete. Catalogue records and all other feature gates remain unchanged.

**Depends on:** Tasks 1–2 (approved identity/content); can begin layout primitives after token/asset decisions.

**Files:** actual framework layout/styles/shared components in route map; navigation/footer config from canonical site content; keyboard/responsive shell tests.

- [ ] Lock token/radius decision against root design prose conflicts; apply approved core colours/fonts and actual circular seal; use populated navy footer per AGENTS.
- [ ] Write failing navigation tests: all destinations resolve, mobile menu exposes expanded state, keyboard/Escape work, focus enters/restores correctly, footer remains populated.
- [ ] Implement shared header, utility strip, responsive drawer, footer, breadcrumbs, buttons, inputs, alerts and cards. Remove unsupported account decoration. Avoid copying inline configurations across routes.
- [ ] Add labels/focus styles/skip link and semantic headings. Replace fixed-offset assumptions with layout that accommodates wrapping; use intrinsic image sizing and meaningful alt.
- [ ] Run shell tests, accessibility checks and browser layout checks at all six required widths and 200% zoom, with long labels and keyboard-only navigation. Record actual screenshots and console results.

**Exit:** functioning shell with no disappearing navigation, unintended overflow, placeholder links or stale footer destinations. Destination pages can only enter published navigation when implemented/approved.

## Task 4 — Catalogue vertical slice and SEO

**Depends on:** Tasks 2–3. **Files:** domain/data read modules and tests; actual framework routes for `/`, `/books`, `/subjects/[slug]`, `/books/[slug]`; reusable search/filter/card/tab/dialog components; sitemap/robots/SEO files.

- [ ] Write failing domain tests for whitespace/case/diacritic policy, title/subtitle/author/subject search, ISBN punctuation, AND across dimensions, OR within multiselects, invalid filters, deterministic ties, pagination and zero results. Define URL parameters once and test back/forward/shared links.
- [ ] Implement one query model and filtering implementation; compute counts/facets/pages from published content. Only expose supported filters and approved sort orders; omit “Most Cited” without verified citation data.
- [ ] Implement hero Enter/Search parity, catalogue filters/reset/sort/pagination, subject content search and all detail links. Grid/list view must match its label and accessible state.
- [ ] Build detail pages from the same records; related books use explicit subject relations. Tabs/dialogs require keyboard roles/state/focus handling. Citation text must derive from verified metadata; await clipboard success and display failure honestly.
- [ ] Real sample assets download; absent ones are omitted or honestly disabled. Never retain the sample-download toast. Missing/draft slugs receive correct 404 behavior; test no-results/empty/error/missing-cover states.
- [ ] Add unique titles/descriptions/canonical/social metadata, sitemap/robots and validated Organization/Book/BreadcrumbList where facts are approved. No drafts or private content in schema/sitemap; no invented offers or DOI.
- [ ] Run unit/integration/content/build/route checks and E2E search/filter/detail flows; test URL state, missing assets, keyboard and all required widths with console monitoring.

**Exit:** an independently testable discovery-to-detail journey using only verified content, with working navigation and honest states.

## Task 5 — Informational pages, legal downloads and ordering

**Depends on:** Task 3, approved editorial/legal/business content; link catalogue order actions after Task 4.

**Files:** native routes `/about`, `/publish-with-us`, `/services`, `/book-chapters`, `/contact`, `/order-and-payment`, `/privacy`, `/terms`, `/shipping-and-returns`; approved proposal route shell; optional subjects index per decision; downloads; route map and link tests.

- [ ] Obtain signed-off publisher story, process, services, FAQs, contacts, ordering/tax/availability terms, policies, agreement and guidelines. Do not turn screen claims into policies.
- [ ] Resolve subjects-index and proposal URL decisions; obtain existing indexed routes/redirects if a live site exists.
- [ ] Write route/link/download tests, including absent-document behavior and content approval checks.
- [ ] Implement approved content and stable downloads; wire real enquiry/email/phone pathways and book-context quote links. No checkout or online payments.
- [ ] Validate footer/legal destinations, document version/ownership, canonical URLs and 404 behavior; run relevant accessibility/responsive/build checks.

**Exit:** every exposed informational/legal/download/order link has approved content and a real destination. Do not expose a proposal form as functional before Task 7.

## Task 6 — Reliable contact acceptance

**Depends on:** Tasks 1, 3 and approved Task 5 privacy/contact copy; approved persistence/mail/anti-abuse decisions.

**Files:** submission decision/operations docs, framework-native `/api/contact` equivalent, shared submission domain, persistence/mail adapters, client form, env schema/example, integration/E2E tests.

- [ ] Approve durable acceptance/delivery contract, topic list (Books, Publishing, Chapters, Order), limits, retention/access, sender identity/provider, retries, anti-abuse and CSRF approach. No separate service/queue unless justified.
- [ ] Write failing tests for invalid/oversized input, injection, rate limiting, persistence and mail failure, safe errors, redacted logs and accepted response. Do not log full messages by default.
- [ ] Implement server-side validation/abuse controls, reliable persistence/delivery state, escaped mail templates and failure visibility. UI announces accepted status only after the server contract is satisfied.
- [ ] Add labelled client fields, validation summary, pending/error/retry states; document environment validation and operations.
- [ ] Run integration/E2E checks with controlled failure adapters and test real configured mail separately in staging. Record acceptance and mail delivery as different outcomes.

**Exit:** contact messages cannot silently disappear or falsely succeed; staff can observe and retry failed delivery without exposing private payloads.

## Task 7 — Secure proposal and attachment acceptance

**Depends on:** Task 6 shared submission boundaries, Task 5 approved consent/agreement, approved upload/retention/malware/storage decisions.

**Files:** proposal page and `/api/proposals` equivalent; proposal rules, private-upload/persistence/mail adapters, integration/security/E2E tests; extend submission operations/env docs.

- [ ] Confirm 20 MB per-file vs total request, attachment count, proxy/runtime limits, allowed signatures, scanning/quarantine policy, staff access, cleanup and retention. Block production uploads if that is the approved malware decision.
- [ ] Write failing tests for required approved fields, 300-word description, consent version, invalid email, oversized/type-spoofed files, traversal names, archive attacks, storage/persistence failure, duplicate posts, rate limits and mail failure.
- [ ] Implement client/server validation for author name, designation/institution, email, mobile, proposed title, subject, book type, target readers/course, language, manuscript status, description, consent and approved optional attachments.
- [ ] Enforce request limits before parsing; inspect extension/MIME/signature; random private keys, sanitized metadata/checksum/scan state; never publish attachment URLs or original upload paths.
- [ ] Persist submission and idempotency/notification state durably before accepted success. Test rollback/orphan cleanup/reconciliation when object storage and persistence do not share a transaction.
- [ ] Notify `edtechpublications@gmail.com` and acknowledge author after acceptance through approved provider. Persist retries and alert persistent failures; duplicate requests must not create proposal or notification storms.
- [ ] Verify accessible pending/validation/error/accepted states and private access in integration/E2E/staging; document safe retries, deletion and support handling.

**Exit:** upload, durable acceptance and mail failure paths proven; no success inferred from a frontend toast or a queued notification.

## Task 8 — Release hardening and operations

**Depends on:** all preceding applicable slices and content/operations approval.

**Files:** CI checks, browser/a11y/visual/performance/security tests, public metadata/assets, `docs/DEPLOYMENT.md`, operations/release checklist and remaining targeted fixes.

- [ ] Run exact configured lint/typecheck/unit/integration/E2E/content/link/build/dependency/security gates; report each outcome and unresolved failures.
- [ ] Browser-check representative home/catalogue/subject/detail/contact/proposal/legal routes at 320, 390, 768, 1024, 1280, 1440 px, 200% zoom and agreed browser matrix. Review keyboard/screen-reader behavior, contrast, errors, dialogs and reduced motion.
- [ ] Measure Lighthouse with documented device/network/build profile; optimize observed bottlenecks, fonts/covers/cache/JS. Record actual scores; field CWV requires real traffic.
- [ ] Verify secure headers/CSP/HTTPS, upload/private access, secret separation, PII redaction and request limits. Test backup/restore and define RPO/RTO/incident owner for persistent submissions.
- [ ] Document staging/production env ownership, release identity, smoke tests and rollback; verify staging deployment, real email and upload access with approved test data. Production release remains a separate concrete review step.

**Exit:** PRD acceptance and TRD release checklist evidenced; approved content/assets, working interactions, operational recovery and no unresolved launch blockers. Never mark a skipped check as passing.

## Per-task completion record

For each approved task, record actual changed files, delivered behavior, exact commands/results, browser evidence where applicable, residual risks and next dependency. Write regression tests before implementing the corresponding behavior, demonstrate the failure, then rerun to prove the fix. Keep changes small and independently reviewable; preserve source references and user work.

## Remaining inputs after the foundation

Task 1 is complete under the current kickoff. Identify the catalogue/content owner and obtain approved seal/covers and content; resolve remaining radius/URL choices before dependent public pages. Confirm privacy, ordering and submission infrastructure decisions before those features. If an existing application or live indexed routes are later supplied, inspect and reconcile them before migration. No provider purchase or product-policy decision has been made. See `MILESTONE_1.md` for exact results and the next shared-shell slice.
