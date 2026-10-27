# Shared shell and homepage hero

Date: 2026-10-27. Authority: user approved starting the next implementation slice.
Scope: responsive shared header/footer, homepage hero and the minimal real
navigation/search destinations they require. Preserve the Next foundation and
original handoff. No Git metadata exists; work in place with file-hash preservation.

## Design and decisions

Follow the reference's editorial split hero, navy utility bar, white masthead,
pale-blue surfaces, Newsreader headings and Manrope UI. Use the exact supplied
seal and artwork only when approved and retrievable; never synthesize a seal or
publish unverified catalogue/ISBN/price/accreditation claims. Asset clarification
is pending while independent shell work proceeds. Use restrained 4/8px corners.

A full menu linking to unimplemented pages would create dead navigation. Instead,
expose Home, Books, Publish With Us and Contact with implemented honest landing
pages. `/books` accepts the hero search query but has an explicit empty catalogue
until approved records exist; no invented results or counts. Publishing/contact
pages offer the documented email/phone, with no submission-success fiction.
Keep no-index until release readiness. No online form, upload or provider added.

## Files and verification

- [x] Baseline `npm run check`; preserve original designs/specifications.
- [x] Add canonical site/navigation configuration, local font assets and license/provenance.
- [x] Add `src/components/site-header.tsx`: accessible desktop navigation and mobile
      disclosure, Escape/link-close, return focus and expanded/current state.
- [x] Add shared `site-footer.tsx`, `brand.tsx`, `catalogue-search.tsx` and `home-hero.tsx`.
- [x] Update root layout, tokens/base styles and homepage; add books/publishing/contact routes.
- [x] Add failing unit tests for navigation/menu/hero-search/empty states before implementation.
- [x] Expand browser tests for all exposed links, mobile keyboard behavior, GET search,
      six widths, no overflow, 200% text scaling, footer and no browser errors.
- [x] Scope the content guard across app/components so extracted UI cannot bypass it.
- [x] Run all checks/build/browser tests; inspect fresh desktop/mobile screenshots.
- [x] Update README, route map, working plan and milestone report with exact results/limits.

Missing verified catalogue records block public book content, not shell mechanics.
Shared shell is not a completed catalogue or submission milestone.

## Pending visual completion

- [ ] Obtain the actual approved circular seal and finish brand imagery.
- [ ] Confirm book-artwork authority and add the reference hero composition.

All checked implementation items cover the delivered text/search shell, not
final visual equivalence. See `MILESTONE_2.md` for final observed checks.
