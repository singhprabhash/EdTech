# Implementation Plan --- EdTech Publications

This is a phased plan, not permission to rewrite the repository
wholesale. Update after repository reconnaissance.

## Milestone 0 --- Repository audit

-   [ ] Read instructions and inspect Git status.
-   [ ] Inventory routes, components, content/assets, APIs, tests,
    environment, hosting and CI.
-   [ ] Run baseline lint/typecheck/test/build and record existing
    failures.
-   [ ] Map supplied HTML/content blueprint to routes.
-   [ ] Mark metadata, prices, ISBNs, DOIs, assets, policies and claims
    verified/unverified.
-   [ ] Create `docs/REPOSITORY_AUDIT.md` and open-decision list. **Exit
    gate:** no stack/infrastructure migration proposed without evidence.

## Milestone 1 --- Shared foundation

-   [ ] Confirm tokens, fonts and approved seal logo.
-   [ ] Build/reuse shared header, responsive drawer, breadcrumbs,
    footer, buttons, inputs, cards and alerts.
-   [ ] Fix broken internal links and responsive overflow.
-   [ ] Establish CI checks consistent with current stack. **Exit
    gate:** shared shell works at 320, 390, 768, 1024, 1280, 1440 px;
    keyboard and footer verified.

## Milestone 2 --- Catalogue and public content

-   [ ] Choose canonical content source and add validation/import
    checks.
-   [ ] Implement homepage hero search, catalogue search/filter/sort/URL
    state.
-   [ ] Implement subject pages and data-driven book details.
-   [ ] Derive related books from verified relations.
-   [ ] Implement remaining informational pages.
-   [ ] Add SEO, canonical URLs, sitemap, robots and valid structured
    data. **Exit gate:** tests pass, all published routes resolve, no
    invented data.

## Milestone 3 --- Proposal/contact workflows

-   [ ] Confirm persistence, mail provider, file storage, retention and
    anti-abuse.
-   [ ] Implement server validation and durable persistence.
-   [ ] Implement safe attachment handling and private storage.
-   [ ] Implement notification retry/delivery state and contact rate
    limits.
-   [ ] Add privacy copy and operational signals. **Exit gate:**
    integration tests cover invalid input, duplicates, upload rejection,
    storage/persistence failure, mail failure and success.

## Milestone 4 --- Production hardening

-   [ ] Accessibility/keyboard audit.
-   [ ] Responsive visual regression and cross-browser smoke tests.
-   [ ] Performance baseline and targeted optimization.
-   [ ] Security/dependency checks and secret review.
-   [ ] Backup/restore and rollback documentation where applicable.
-   [ ] Staging deployment, smoke tests and release checklist. **Exit
    gate:** PRD acceptance criteria and TRD release checklist pass;
    residual risks documented.

## Per-change workflow

1.  State intended behavior and affected files.
2.  Implement the smallest vertical slice.
3.  Add/update tests.
4.  Run targeted tests, then relevant quality gates.
5.  Inspect responsive/accessibility behavior for UI changes.
6.  Update docs/plan.
7.  Report exact verification and unresolved issues.
