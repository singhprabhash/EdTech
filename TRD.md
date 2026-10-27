# EdTech Publications --- Technical Requirements Document (TRD)

**Status:** Draft; finalize stack-specific decisions after repository
inspection\
**Companion:** `PRD.md`

## 1. Technical objectives

Deliver a secure, maintainable, accessible, SEO-friendly publishing
website that preserves the approved EdTech design system and converts
static screen designs into reliable behavior.

**Architecture rule: inspect before replacing.** Do not assume a
framework or database from screenshots. Retain existing choices unless
there is a documented reason to change them.

## 2. Codex execution protocol

1.  Read `AGENTS.md`, package scripts/lockfiles, README, routes, assets,
    tests, environment examples, CI and deployment config.
2.  Inspect `git status`; preserve uncommitted user work.
3.  Inventory routes/components and compare app to PRD/approved
    HTML/content.
4.  Run baseline lint/typecheck/tests/build; record existing failures.
5.  Report blockers, missing credentials, content conflicts and risks.
6.  Create/update a small-step implementation plan before structural
    work.
7.  Implement vertical slices; run targeted tests after each slice and
    full checks before completion.
8.  Never claim tests, deployment, email, uploads or external
    integrations succeeded unless actually verified.
9.  Each milestone report: changed files, delivered behavior, exact
    checks/results, risks, next milestone.

## 3. Repository discovery and stack decision

Identify framework/runtime/version, package manager, routing/rendering,
APIs, DB/migrations, content source, storage, email, assets/tokens, auth
if any, CI/CD, hosting, logs and monitoring. Do not add frameworks,
ORMs, state managers, databases, queues, CMS, or microservices without
evidence and a written rationale.

## 4. Logical architecture

Adapt to existing stack; these are boundaries, not separate deployment
services:

``` text
Browser
└── Public web app
    ├── Shared layout / tokens / accessible UI
    ├── Public routes: home, catalogue, subject, book, editorial, forms, legal
    ├── Domain: catalogue search/filter, content validation, form rules
    ├── Data access: structured content or database, submission persistence
    └── Adapters: email provider, private object storage, observability
```

UI must not own DB queries, secrets, or side effects. Hide external
providers behind adapters. Validate at trust boundaries. Keep one
canonical source of truth.

## 5. Logical data model

### Book

Stable ID, unique slug, title, optional subtitle, ordered authors,
approved description, subject references, edition-specific ISBNs,
publication date/year, edition, language, formats, cover asset,
structured TOC, optional sample asset, optional verified DOI,
publication status, SEO fields and timestamps/versioning.

### Book format/edition

Stable ID, book reference, format, ISBN for that edition, approved price
and explicit currency, availability/order method only if supported by
operations. Do not combine format-specific ISBNs into one unstructured
field.

### Subject

Stable ID, unique slug, name, optional description/parent. Subject
membership explicit, not inferred from title at runtime.

### Proposal

ID, idempotency key, timestamp, validated fields, consent text/version
and timestamp, state, attachment metadata (random object key, sanitized
filename, detected type, size, checksum, scan state), notification
state/retry metadata, retention/deletion fields.

### Contact submission

ID, timestamp, validated name/email/phone/topic/message,
persistence/delivery state, anti-abuse metadata. Store only what is
needed.

### Integrity

Unique IDs/slugs; schema validation; valid references; verify ISBN
syntax/checksum when supplied but don't treat it as proof of authentic
publication; no draft publication; repeatable import with rejected-row
report. Never fabricate records to reach a catalogue count.

## 6. Content source strategy

Choose after inspection: - Version-controlled typed structured content
for small catalogues/low update frequency; or - Database-backed content
if multiple editors, frequent updates or staff interface are required.

Hide source behind repository/data-access functions. Add a validation
command for required fields, unique slugs/IDs, ISBN format, valid
references, missing assets/alt text, draft-state errors, broken internal
links, `href="#"`, TODOs and lorem ipsum in production routes.

## 7. Routes and API contracts

Example public routes, adapted to existing conventions: `/`, `/books`,
`/books/[slug]`, `/subjects/[slug]`, `/about`, `/publish-with-us`,
`/services`, `/book-chapters`, `/contact`, `/order-and-payment`,
`/privacy`, `/terms`, `/shipping-and-returns`.

API responsibilities: - Catalogue read/search/filter: SSR or read-only
endpoint according to stack. - `POST /api/proposals`: validate,
idempotency, persist submission and attachment metadata,
trigger/reliably queue notifications, return accepted ID/status. -
`POST /api/contact`: validate, persist/deliver, rate-limit. - Health
endpoint/framework equivalent: minimal status only, no
secrets/infrastructure details.

Use framework-native route handlers/server actions if established; do
not create a separate API server without need. Consistent errors; 4xx
for invalid input, 5xx for unexpected failures; no stack traces to
clients; request-size limits before parsing; never claim email delivery
when only the submission was accepted.

## 8. Search and filtering

Normalize whitespace and document case/diacritic behavior. Search title,
subtitle, authors, ISBN and subject. Normalize hyphens/spaces for ISBN
matching. Combine filter dimensions with AND; define OR semantics within
multi-select dimensions. Deterministic sorting with tie-breakers. Share
query/filter/sort via URL parameters where practical. Use one filtering
implementation across rendering modes. Test whitespace, partial title,
author, ISBN punctuation, combined filters, invalid filters, sort
stability, pagination and zero results. A small catalogue does not
justify a dedicated search service without measurement.

## 9. Upload and email workflow

### Upload security

-   Source blueprint states `.doc`, `.docx`, `.pdf`, up to 20 MB;
    confirm whether limit is per file or total request.
-   Validate extension, MIME, signature and size; never trust client
    headers.
-   Reject unexpected archives/types.
-   Random storage keys; never use original filename as path.
-   Private storage outside public web root; least-privilege access.
-   If malware scanning exists, quarantine until passed. If not,
    document residual risk and decide whether production uploads must be
    blocked until scanning is configured.
-   Sanitize filenames; prevent path traversal/header injection.
-   Set limits/timeouts at proxy/runtime and application.
-   Define retention, deletion and access audit policy.

### Reliable workflow

1.  Validate request and abuse controls.
2.  Store attachment privately/quarantined and compute
    metadata/checksum.
3.  Persist submission durably.
4.  Record notification work in durable outbox/queue if supported;
    otherwise persist retryable delivery state.
5.  Return success only after durable acceptance.
6.  Notify `edtechpublications@gmail.com` and acknowledge author.
7.  Track delivery, retry transient failures, alert on persistent
    failures.
8.  Prevent retries from creating duplicate proposals or notification
    storms.

Use existing email provider; if none exists, provider choice is a
deployment prerequisite. Configure SPF/DKIM/DMARC as appropriate. Do not
hardcode SMTP credentials.

## 10. Security and privacy

Secrets only in environment/managed secret store; commit `.env.example`
placeholders only. Validate required environment variables. Use HTTPS,
secure headers, suitable CSP, CSRF protection where relevant,
server-side validation, parameterized data access, least privilege, rate
limits, spam controls, safe output encoding, and dependency scanning.
Redact emails, phone numbers, message bodies, files, tokens and secrets
from logs. Define retention, deletion, access control and privacy notice
with publisher. Test oversized/spoofed uploads, traversal names, invalid
email, script injection, duplicate posts and rate limits.

## 11. Frontend standards

Semantic landmarks, one main `h1`, correct heading order, labels,
accessible links and focus indicators. Keyboard-operable
menu/tabs/dialogs/filters/forms. Announce status/errors and restore
focus after overlays. Respect reduced motion. Reserve image dimensions;
optimize responsive covers; lazy-load below-fold images but avoid
delaying key hero content. Fix actual overflow rather than hiding it
globally. Test 320, 390, 768, 1024, 1280, 1440 px. Shared
header/footer/card/search/filter/form components; no duplicated
metadata.

## 12. Design tokens/assets

Active approved HTML theme: navy `#011633`, blue `#1F58C4`,
background/surface `#F9F9FF`, white `#FFFFFF`, low surface `#F0F3FF`,
surface `#E6EEFF`, high `#DEE9FF`, highest `#D8E3F9`, on-surface
`#111C2C`, muted `#44474E`, outline `#75777E`, outline-variant
`#C5C6CE`. Newsreader headings/editorial; Manrope UI/body/metadata.
Centralize actual tokens after inspection. Use real approved circular
seal logo. If older assets show another palette, don't blend themes;
record decision/ask.

## 13. SEO

Unique titles/descriptions, canonical URLs, sitemap from published
routes/books, robots policy, social metadata, valid
Organization/Book/BreadcrumbList structured data, meaningful alt text,
optimized images, redirects and correct 404s. Never expose
drafts/private submissions or unverified metadata in sitemap/schema.

## 14. Testing strategy

-   **Unit:** schemas, search normalization, filter combinations, ISBN
    helper, forms, upload checks, slug/canonical helpers, email template
    escaping.
-   **Integration:** catalogue reads/filters, missing/draft book
    behavior, proposal persistence/idempotency, storage failure cleanup,
    notification retry, contact rate limits, API contracts.
-   **E2E:** navigation/mobile drawer, hero search, catalogue
    filter/reset, book detail/tabs, proposal
    validation/upload/success/failure, contact, footer/legal routes,
    responsive smoke tests/no console errors.
-   **Accessibility:** automated checks plus keyboard-only and manual
    screen-reader spot checks.
-   **Visual regression:** representative routes/viewports.
-   **Merge gate:** existing equivalents of lint, typecheck,
    unit/integration/e2e, content validation, production build,
    dependency/security audit, route/link validation. Never create
    scripts that fake success.

## 15. CI/CD and environment

Use existing CI. Install from lockfile; validate content, lint,
typecheck, test, build. Separate staging/production.
Environment-specific secrets and least privilege. Review destructive
migrations; prefer backward-compatible migrations. Run post-deploy smoke
tests; document rollback and release identity. No server secrets in
client bundles.

## 16. Operations

Structured logs with severity, timestamp, route/operation and request
ID; redact PII/secrets. Track proposal/contact accepted/failed and
pending notification counts without payloads. Make repeated
email/storage failures visible and retryable. Health checks reveal no
sensitive details. Document log access, retries, backup/restore and
incident owner.

## 17. Performance

Measure baseline. Use SSR/SSG for SEO-critical pages as stack allows.
Avoid unnecessary client JS; optimize covers/logo, dimensions,
responsive sizes and below-fold loading. Cache public reads safely,
never private form responses/submissions. Avoid unnecessary external
scripts. Target Lighthouse Performance ≥90 on representative routes
under repeatable conditions; record actual scores. Monitor Core Web
Vitals when sufficient field data exists.

## 18. Release checklist

-   [ ] Catalogue metadata, prices, DOI, author claims and assets
    verified.
-   [ ] Approved logo, cover/sample assets, agreement and legal copy
    available.
-   [ ] Required secrets validated; mail delivery tested.
-   [ ] Upload storage/private access/retention/malware decision
    confirmed.
-   [ ] Migrations and backups reviewed where applicable.
-   [ ] Lint, typecheck, tests, content validation, build and security
    checks pass.
-   [ ] All routes tested at mobile/tablet/desktop widths.
-   [ ] SEO, sitemap, robots, canonical and schema verified.
-   [ ] Accessibility and keyboard navigation reviewed.
-   [ ] No dead links, broken assets, console errors or accidental draft
    exposure.
-   [ ] Staging smoke tests and rollback path confirmed.

## 19. Decisions to document

Create `docs/decisions/NNNN-title.md` for framework/migration, content
source vs database/CMS, email provider/retry, file storage/malware,
hosting/CI, analytics/consent, order/payment scope, content approval,
retention/backup, and RPO/RTO. Each record includes context, options,
decision, consequences and date. Do not guess consequential decisions.
