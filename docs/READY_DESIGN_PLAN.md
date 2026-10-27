# Ready-design implementation

Date: 2026-10-27. User instruction: use the new `ready_design/` folder as
primary reference and reproduce its design and pages. It supersedes earlier
visual references and the prior minimal shell. Keep source originals intact.

## Approach

Preserve the exact supplied layout classes, typography scales, sections and
artwork as real server-rendered React elements. Compile reference markup into a
sanitized typed presentation tree, stripping scripts/event handlers and resolving
real navigation/assets. A small client enhancement layer owns search/filter/sort,
view modes, accessible navigation/tabs/citation dialogs and honest clipboard status.
Do not execute source scripts or load Tailwind's runtime CDN. This keeps the large
editorial layouts faithful without maintaining a second hand-edited HTML copy.
The original reference folder is the content/presentation input; generated trees
and preview catalogue indexes are reproducible build artifacts committed as inputs
for Next, with a stale-output check.

Four supplied views map to `/`, `/books`, `/subjects/horticulture-pomology`, and
`/books/frontier-agronomy-for-climate-smart-digital-and-natural-farming-systems`.
Other supplied catalogue records have generic detail pages using only their own
source metadata; no agronomy biography/DOI reused for unrelated books. Old `.html`
URLs redirect to actual application routes. Existing enquiry pages remain live.
No database/provider/payment/deployment changes.

## Content boundaries

User authorizes the new supplied design/copy/artwork as preview inputs. These are
not independently verified publication facts. Keep the app unindexed, never
publish structured Book/Offer claims, and record conflicting ISBN/title/author/counts
in a content report. Do not invent missing book records to achieve literal totals.
Actual interactive result counts derive from available cards. Missing download
assets produce honest request/contact actions, not fake download success.

## Files/tasks

- [ ] Read/map all four inputs, take hashes and run baseline checks.
- [ ] `scripts/compile-ready-design.py`, `src/content/ready-pages.json` and
      `src/content/ready-catalogue.json`: reproducible sanitized layout and source metadata.
- [ ] `public/reference-assets/`: exact local linked images/icons, verified signatures,
      URL mapping and provenance. Keep original reference files unmodified.
- [ ] `src/components/ready-document.tsx`, `ready-interactions.tsx`: SSR tree rendering
      with scoped client behavior. Shared chrome from current primary homepage reference.
- [ ] `src/domain/catalogue.ts` and unit tests: deterministic query/filter/sort/URL rules.
- [ ] App pages/routes/layout and CSS: exact theme classes, local fonts/icons and view maps.
- [ ] Remove superseded minimal hero/chrome components from active rendering, preserve
      useful enquiry pages. Add anchor/alias navigation only to real destinations.
- [ ] Unit/compiler/security checks plus browser journeys through all four pages,
      query/filter/reset/view mode, details/tabs/citations, mobile nav and all six widths.
- [ ] Render reference and implementation screenshots at desktop/mobile, compare
      layout geometry and fix material discrepancies; record unavoidable content changes.
- [ ] Full quality gates, original-file preservation, docs/routes/report and refresh preview.
