# AEETDS agricultural conferences and Society website

The public project focuses on agricultural conferences, scientific exchange and
Society activities. The retired publisher storefront is no longer part of the site.

Current pages include Home, About/vision/governance/partners, conferences and their
archives, training, membership, awards, conference publications/journals, submission
guidelines, registration/payment details, downloads, Contact/FAQ and Policies.
`/admin` manages Society content and private applications when configured.

`/books`, book details, `/subjects`, subject details and `/publish-with-us`, together
with their old catalogue/category/detail HTML aliases, return actual AEETDS 404s.
There is no book-buying, checkout or publisher-manuscript storefront workflow.
Original exports in `ready_design/` and historical reference artifacts are preserved;
they are not live routes or approved product copy.

## Start and verify

Use Node **24.22.0** from `.nvmrc`, npm 11 and the checked-in lockfile:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open <http://localhost:3000>. See [setup](docs/SETUP.md) and `.env.example` before
configuring services. The public conference registration/abstract actions use the
Society-supplied Google Forms. Private local submission services fail closed when
unconfigured; local development does not install a production service.

```sh
npm run check
npx playwright install chromium
npm run test:e2e -- --workers=1
npm audit --audit-level=high
```

`check` covers lint, route types, unit/integration tests, reference/compiler and
production-content checks, formatting and build. Chromium runs against a separate
local production server on port 3100; build first. Linux browser setup can use
`npx playwright install --with-deps chromium`.

## Content, design and architecture

- `src/app`: active Next routes; `src/components/aeetds`: shared Society UI.
- `src/content/aeetds*`: canonical conference, membership, journal, contact and
  payment content. Public Secretary overrides pass through `src/server/content.mjs`.
- `src/domain`, `src/services`, `src/server`: validation, form transport and private
  SQLite/authenticated SMTP/storage/admin adapters.
- `src/config/brand-theme.json`: official green/gold semantic identity; local
  Newsreader/Manrope and the actual Society seal remain in use.
- `npm run reference:compile` generates theme and archived reference artifacts.
  Never hand-edit `src/app/ready-theme.css` or `src/content/ready-*.json`.
- `npm run brand:icons` regenerates browser icons from the actual seal.

[Reference workflow](docs/READY_DESIGN_WORKFLOW.md), [route map](docs/ROUTE_MAP.md),
[working plan](docs/IMPLEMENTATION_PLAN.md) and [operations](docs/AEETDS_GUIDE_OPERATIONS.md)
describe the current application. Initial PRD/TRD book-commerce sections, foundation
plans and milestone reports are historical and superseded by the conference scope.

## Search, verification and release

The supplied Google site-verification token is inherited through root metadata.
It is Search Console verification, not a Google Analytics measurement ID; no
Analytics script is configured or fabricated.

The sitemap contains only the current public Society routes; event detail URLs
come from canonical conference data. Set `AEETDS_SITE_URL` to the verified owned
HTTPS origin and `AEETDS_PUBLIC_RELEASE=true` to publish the sitemap/indexing policy.
Without those settings the local preview remains no-index and its sitemap is empty.
Google ownership verification/account actions and sitemap submission require the
actual deployed site and account; none are claimed by local code changes.

See [SEO and release](docs/AEETDS_SEO.md) for the exact boundary. Hosting, TLS,
production credentials, monitoring and dependency-advisory remediation remain
separate operations; no production deployment is implied by passing local checks.
