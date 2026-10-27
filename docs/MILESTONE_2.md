# Shared shell and homepage implementation

Date: 27 October 2026. This implements the authorized next slice after Milestone 1.
**Status: functional shell and hero narrative/search delivered; visual completion
is pending the actual circular seal and approval of the reference book artwork.**
The full homepage, catalogue and submission milestones are not complete.

## Delivered

- White masthead and navy utility strip, desktop navigation and mobile non-modal
  disclosure. Expanded/current state, keyboard navigation, Escape/focus return,
  selection closing and responsive desktop transition.
- Populated dark navy footer with site navigation and handoff email/telephone.
- Newsreader/Manrope hosted locally with SIL Open Font License files; no external
  font requests, font-service dependency or package dependency added.
- Reference hero headline, editorial typography, navy/white CTA styles and labelled
  GET search; button/Enter share `/books?q=…` behavior.
- Minimal Books, Publish With Us and Contact destinations so every exposed internal
  navigation link resolves. No unsupported statistics, accreditation, sample ISBNs,
  pricing or book records. Books retains a bounded/escaped query and explains that
  verified records are not yet available. This is not implemented catalogue search.
- No-index/crawl protection remains. No proposals/uploads/emails/payments or external
  delivery are claimed. Publishing email is a real `mailto:` contact, not a form.
- Source guard now scans `src/` so extracted components are also checked.

## Design/asset decisions and limits

Preserved navy `#011633`, blue `#1F58C4`, cool pale-blue/white, Newsreader and Manrope.
Chose restrained 4px controls/8px panels from reference geometry. Typography-only
brand identity is temporary: inspecting the exact logo URL in the supplied HTML
returned a rectangular wordmark, not the required circular seal. It is not used as
a substitute. No seal was generated. No book artwork is rendered while asset
confirmation remains pending; the hero therefore lacks the reference's right-hand
book composition. This limitation is visible in the desktop preview and prevents
claiming final visual equivalence.

Four navigation links cover implemented pages. Services, subjects, about, chapters,
legal and submission links remain absent until real pages/content are available.
Footer privacy/legal policy links have not been invented. Contact details come from
the handoff/PRD; business ownership and reachability have not been independently tested.

Fonts: Fontsource variable Manrope/Newsreader distribution 5.3.0, Latin normal WOFF2,
with bundled licenses and provenance in `public/fonts/README.md`. No lockfile or
application dependency changes. Non-Latin subsets remain a later content requirement.

## Files

Created `src/config/site.ts`; `src/components/{brand,site-header,site-footer,
catalogue-search,home-hero}.tsx`; `src/app/{books,contact,publish-with-us}/page.tsx`;
`public/fonts/` WOFF2/license/provenance assets; `tests/unit/shared-shell.test.tsx`;
`docs/SHARED_SHELL_PLAN.md` and this report.

Updated app layout/page/base styles, production source guard, foundation unit/E2E
checks, README, AGENTS, setup, route map and working implementation plan. Original
HTML, screenshots, design docs and PRD/TRD are preserved. No Git metadata exists;
no commit, branch, worktree, push or deployment was created.

## Verification

- Baseline `NEXT_TELEMETRY_DISABLED=1 npm run check`: passed; 6 tests and build.
- Added shell tests before components; observed missing-import failure.
- Unit run after implementation: 3 suites / 11 tests passed.
- First full gate: lint/types/11 unit/source guard/format/Webpack build passed;
  routes `/`, `/books`, `/contact`, `/publish-with-us`, `/robots.txt`, native 404.
- Initial browser run: 12 passed / 1 failed; failure was a test locator using the
  old accessible name after the menu correctly changed from Open to Close.
  Corrected the test to identify the stable controlled menu button.
- Fresh desktop (1440px) and mobile (390px) screenshots reviewed: fonts loaded,
  navy footer populated and no horizontal overflow. Remaining missing composition
  is explicitly documented above. Screenshots: `/tmp/edtech-shell-1440.png` and
  `/tmp/edtech-shell-390.png`; generated previews are not production assets.
- Reviewer requested 200% text scaling at tablet/desktop breakpoints. The expanded
  test exposed overflow at 320px; computed bounds isolated the long heading, plus
  the masthead CTA at 1024px. Fixed intrinsic hero sizing, allowed CTA/masthead
  wrapping and allowed long heading words to wrap. Regression first failed, then
  computed bounds passed at 320, 390, 640, 768, 1024, 1280 and 1440px.
- Independent read-only review found no important content/routing/keyboard issues;
  its text-scaling coverage gap was addressed and the stale plan checklist updated.
- Final `NEXT_TELEMETRY_DISABLED=1 npm run check`: **exit 0**; lint, strict
  TypeScript, **11/11 unit tests**, source guard, formatting and production build passed.
- Final `npm run test:e2e`: **exit 0, 14/14 tests passed**, including the expanded
  200% root text-size regression at all seven breakpoints.
- `npm audit --audit-level=high`: **exit 0, zero vulnerabilities**.
- Preservation SHA-256 check: all **28 protected original reference/specification
  and dependency manifest/lock files unchanged**.
- Local production preview started on `http://127.0.0.1:3002` after verification;
  no external deployment. Inherited terminal color-variable warnings were emitted
  by browser worker processes, not browser console/page errors.

Browser coverage includes each new supporting route at all six required normal
widths, root text size 200% across seven breakpoints, Escape/focus/menu closing,
Enter/button parity, 200-character query limit, escaped markup, native 404, local
font availability, crawl protection and all exposed internal destinations. This is
not a full screen-reader, WCAG conformance, Lighthouse or cross-browser audit.

## Next

Finish visual identity/composition once the circular seal and artwork authority
are available. Then define a validated canonical book/subject source and import
owner-approved edition-level records before implementing real catalogue search,
filters, subject/detail pages or business metadata. Keep staged development unindexed.
