# Primary ready-design implementation report

27 October 2026. Primary user reference: `ready_design/` (four HTML files).
Scope: reproduce the supplied four pages as functional application views, with
local assets, real navigation and working reference interactions.

## Delivered views and behavior

- Complete homepage: circular seal/header, layered hero covers, search/direct
  filters, statistics, subject grid, featured cards, editorial/about sections,
  publishing stages/services/author CTA and populated navy footer.
- Catalogue: all ten supplied cards, composed URL-backed search/facets, deterministic
  sorting, grid/list, reset/no-results, computed counters and correct book links.
- Horticulture category: six supplied cards, query/year/format/category filters,
  accurate repeatable counters and native citation dialogs.
- Frontier Agronomy detail: full supplied cover/specifications/pricing/overview,
  keyboard tabs for contents/author/adoption, citation dialog, honest clipboard
  feedback, related cards and correct breadcrumb destinations.
- All other supplied card/related records have metadata-only detail destinations;
  no Frontier biography/DOI is reused for another title. Subjects redirect to the
  supplied Horticulture page. Old `.html` filenames redirect to application routes.
- Existing publishing/contact pages retain honest enquiry behavior with new chrome.
  No proposal persistence, actual email delivery or file download is fabricated.

The supplied homepage header is reused across views for consistent real navigation
and the actual green circular seal. Page footers remain from their respective
primary references. The original files are not served as screenshots or raw HTML.
React escapes text and renders inert semantic elements compiled from the originals;
source scripts, inline handlers, runtime Tailwind CDN and external asset requests
are not part of the application. See `READY_DESIGN_WORKFLOW.md`.

## Files and decisions

Created scripts `compile-ready-design.py` and `fetch-reference-assets.py`; generated
`src/content/ready-{pages,catalogue}.json` and `src/app/ready-theme.css`; local exact
image/icon assets with manifest/provenance; domain catalogue rules; reference React
renderer and scoped interaction component; subject/dynamic-book routes; compiler,
domain and updated UI/browser tests; workflow/content-review/plan/report docs.

Changed app layout/home/catalogue/enquiry/404 pages, global reference styles,
redirect config, npm verification scripts, CI Python prerequisite, ignore configs,
README, AGENTS/setup/route/working-plan documentation. Removed the superseded minimal
brand/header/footer/hero/search components. No major dependency, provider or stack
replacement; existing Next/React/TypeScript/Tailwind build retained. Python standard
library supplies the deterministic compiler, with no new Python package.

Source HTML is the authoritative presentation/content input. Generated outputs are
checked for staleness in CI; do not hand-edit them. The record index distinguishes
conflicting supplied editions and related-only cards. All business copy remains
unverified design input. Keep the app unindexed and see `READY_CONTENT_REVIEW.md`.

## Visual verification

Rendered the original four supplied HTMLs with their original Tailwind styling
runtime in a separate browser document, using the same locally hosted fonts/images,
then compared against React at 1440px and 390px. Captured screenshots for all views.
Desktop headline x/y/width matched on home/catalogue/category; detail was within two
pixels before minor line-height tuning. Corrected v3/v4 heading line-height precedence.
Mobile header offset is measured to avoid source fixed-offset overlap. Exact source
layout classes, typography, surfaces, image composition and all sections are retained.

Intentional differences: raw logo URL is rendered as the actual seal; shared primary
header across views; live interactive totals from supplied records; nonexistent pages
are disabled; unavailable downloads become Request actions; unsupplied legal policies
are unavailable text; clipboard success waits for the actual browser operation.
These correctness changes prevent promising nonexistent data or actions.

The reference source includes horizontal scrollers and clipped decorative shapes;
those are retained. Actual page overflow is checked, not hidden globally. Source
catalogue language facets and institutional controls required wrapping at 320/768px.

## Checks and review

Baseline: lint/types/11 tests/content passed; formatting failed only on the newly
supplied originals. Those were excluded instead of reformatted.

- Domain tests observed expected failures before implementation; domain suite passed.
- Compiler sanitization tests first failed on absent compiler, then passed. Added
  regressions caught bad subject/related links before their mapping fix.
- Independent review found missing out-of-main category modal, wrong link mappings
  and a pagination marker removed during update. All were addressed with compiler,
  unit and browser regression coverage. Six compiler tests and 36 unit tests passed.
- Full quality gate passed before final responsive corrections; optimized build passed.
- Initial production E2E: 11/14 passed; two catalogue overflow failures corrected;
  third was an incorrect alphabetical-order expectation, corrected to Agricultural
  Entomology before AMMA. Final responsive/browser results are recorded below.

### Final observed results

Pending final gates and preservation check.

## Preservation observation

All four current `ready_design/` files match the pre-edit SHA-256 snapshot. The
older `design/` and Stitch directories disappeared during this session outside the
implementation edits. They were not restored or modified; no application code
depends on them. Historical audit reports retain their original time-specific facts.

## Remaining production prerequisites

Owner-approved catalogue identities/ISBNs/DOIs/prices/availability, author credentials,
accreditation/statistics/discount claims, ordering/legal/retention policies and actual
download documents remain unresolved supplied content. No external deployment, CI
run, upload, mail delivery, Lighthouse score or full screen-reader conformance is
claimed. Provider/submission/security hardening remain later milestones. Preserve
no-index metadata and disallow robots until release gates are satisfied.
