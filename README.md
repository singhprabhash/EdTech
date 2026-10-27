# EdTech Publications

The current design implementation uses **`ready_design/` as the primary reference**.
Home, catalogue, Horticulture category and Frontier Agronomy detail are implemented,
with the exact supplied local images, circular seal, local fonts and interactive
navigation/search/filter/sort/tabs/citations. Other supplied records have metadata
only detail pages. Original reference files remain unchanged.

This is an **unindexed design preview**, not publication approval. Supplied ISBNs,
prices, credentials, accreditation and business copy have unresolved conflicts and
are not independently verified. Submission storage/mail and real download documents
are not configured. See [current implementation report](docs/READY_DESIGN_REPORT.md).

## Start and verify

Use Node **24.22.0** (see `.nvmrc`) and npm 11:

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open <http://localhost:3000>. No credentials or `.env` file are required for this
milestone. See [environment setup](docs/SETUP.md) before configuring integrations.

```sh
npm run check
npx playwright install chromium
npm run test:e2e
npm audit --audit-level=high
```

`check` runs lint, framework route generation/strict typecheck, unit tests,
production-source content checks, formatting and build. Browser tests start a
separate production server on port 3100; build first. Each check is also an
individual npm script. Browser dependencies are required on Linux:
`npx playwright install --with-deps chromium`.

## Updating the primary designs

Edit `ready_design/{index,catalog,catagory,book_detail}.html`, then run:

```sh
npm run reference:compile
npm run reference:check
```

The compiler generates inert presentation trees, a supplied-record index and theme
CSS. Never hand-edit `src/content/ready-*.json` or `src/app/ready-theme.css`.
[Reference workflow](docs/READY_DESIGN_WORKFLOW.md) explains asset import, sanitization,
source conflicts and verification. No source scripts are executed in the app.
Python 3.12+ is required for compilation/checking; no Python packages are needed.

## Sources and architecture

- [PRD](PRD.md) defines behavior; [TRD](TRD.md) defines engineering constraints.
- [AGENTS.md](AGENTS.md) contains repository instructions.
- [Working implementation plan](docs/IMPLEMENTATION_PLAN.md) governs future
  delivery; [foundation plan](docs/FOUNDATION_PLAN.md) records this kickoff slice.
- [Foundation decision](docs/decisions/0001-application-foundation.md) records
  stack rationale, boundaries, deferred dependencies and documentation authority.
- [Route map](docs/ROUTE_MAP.md) distinguishes implemented routes from references.
- [Original audit](docs/REPOSITORY_AUDIT.md) records pre-application findings;
  [Milestone 1 report](docs/MILESTONE_1.md) records the initial foundation.
- [Shared shell report](docs/MILESTONE_2.md) records the current UI implementation
  and asset limitations; [shell plan](docs/SHARED_SHELL_PLAN.md) tracks this slice.

`src/app` owns routes/layout; future pure rules belong in `src/domain`, use cases
in `src/application`, and external data/mail/private-storage access in
`src/infrastructure`. Create these modules only when used. UI must not query a
provider or own book metadata. No business content source is approved yet.

## Preservation and release limits

`ready_design/` holds the current four primary HTML references. The older `design/`
and Stitch directories were removed during this implementation session outside
these edits; their earlier state is recorded in the historical audit. Supplied metadata and claims remain
unverified and must not be treated as approved production catalogue data. Root DESIGN prose contains palette/radius conflicts; explicit
PRD/TRD/user navy/blue requirements govern foundation colors. Newsreader, Manrope and Material Symbols are local. The new reference supplied the
circular seal and artwork. Catalogue search operates over its supplied preview cards;
no invented records fill the difference between visible cards and source totals.

The preview site metadata and robots policy prevent indexing. Review/remove that
policy only when approved public content is ready. CI is a GitHub Actions
configuration, not a connected repository or completed remote run. This folder
arrived without Git metadata; no repository/remote/deployment is created here.
