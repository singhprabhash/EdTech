# Primary reference workflow

The user designated `ready_design/` as the primary design and page reference on
27 October 2026. The earlier `design/` and Stitch exports were historical inputs and are no longer
present at the final repository check.
Do not reformat or edit supplied originals incidentally.

## Architecture and generation

`scripts/compile-ready-design.py` uses Python's standard-library HTML parser to
extract the four main layouts, the homepage's shared header, the appropriate
page footers and out-of-main citation overlays. It preserves source class names
and content, strips scripts/event handlers/unsafe tags and URLs, resolves local
assets and real destinations, then emits:

- `src/content/ready-pages.json`: inert presentation nodes and source SHA-256 values.
- `src/content/ready-catalogue.json`: source-derived card/related-record metadata,
  with separate slugs for conflicting same-title editions.
- `src/app/ready-theme.css`: reference tokens for the existing local Tailwind build.

`ReadyTree` renders those nodes using React elements and escaped text. It never
uses raw HTML injection or evaluates the reference scripts. `ReadyInteractions`
progressively enhances one scoped document; only it owns widget DOM changes.
The pure catalogue module owns normalization, facets and deterministic sorting.
Server query rendering and client filtering consume that module. Presentation
JSON remains server-only; only the current page's markup and record descriptors
are sent to the browser. No HTML screenshot is used as the page.

Run `npm run reference:compile` after deliberate reference edits. CI's
`npm run reference:check` rejects stale output and runs compiler regression tests.
Python 3.12+ is an explicit CI prerequisite; no third-party parser is installed.
Generated trees/theme and original HTML are excluded from formatting to preserve
reproducibility. All maintained TypeScript remains formatted and linted.

## Assets

`public/reference-assets/manifest.json` maps each original image URL to its local
file. `provenance.json` records HTTP status, signature, source paths and hashes.
The exact 25 images and official Material Symbols variable font are local.
`scripts/fetch-reference-assets.py` can refresh them with network access; inspect
its diff/provenance before regenerating. Do not invent a replacement image if a
source becomes unavailable. Fontsource Manrope/Newsreader licenses are retained.

The new homepage/catalogue include a raw seal URL as text inside its frame; the
compiler correctly turns that reference into the actual image. The same primary
header is used across views to provide a consistent working menu and actual seal.
Page-specific footers and complete main content remain from their supplied views.

## Content and action boundaries

This preview renders user-supplied copy, not independently verified facts. The
19 card-derived records comprise 10 catalogue, six subject and three related
records. They are not 19 verified publisher titles. Same-title conflicting editions
remain separate rather than silently merging authors/ISBNs/prices. The detailed
Frontier specimen and catalogue copy also conflict; publication reconciliation is
still mandatory. See `READY_CONTENT_REVIEW.md`.

Do not create a Book/Offer schema, public sitemap or production release from this
preview until the owner approves canonical facts. Keep no-index/crawl protection.
Reference totals/claims are supplied display copy; interactive counts always use
actual available records. Extra referenced pagination is disabled rather than
inventing missing titles.

Downloads without supplied files are labelled request actions using the documented
email address. No fake download or proposal success toast exists. Unsupplied legal
policies are plain unavailable text. Publishing CTAs lead to the real enquiry page;
no online persistence or email delivery is claimed. Citation feedback appears only
after clipboard success; failure offers manual copy. Native dialogs provide focus
containment/Escape and restore the invoking control.
