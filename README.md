# EdTech Publications

The publishing website is in development. The responsive header/footer, homepage
narrative/search and book/publishing/contact entry pages are implemented. The
application is **not production ready**: verified catalogue records, the approved
circular seal/hero artwork, full public content and submissions remain outstanding.
Original HTML/screenshots remain reference material only.

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

`design/` holds four unique HTML references; `stitch_edtech_publications_academic_portal/`
contains duplicated exports and screenshots. Neither directory is served by Next.
Their literal metadata and claims are unverified; do not import them as approved
catalogue data. Root DESIGN prose contains palette/radius conflicts; explicit
PRD/TRD/user navy/blue requirements govern foundation colors. Newsreader and Manrope are now locally hosted with their font licenses; the
approved seal and book artwork remain pending. Navigation exposes only implemented
destinations, and catalogue search returns an honest empty state until records exist.

The development site metadata and robots policy prevent indexing. Review/remove that
policy only when approved public content is ready. CI is a GitHub Actions
configuration, not a connected repository or completed remote run. This folder
arrived without Git metadata; no repository/remote/deployment is created here.
