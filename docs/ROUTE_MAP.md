# Current routes and primary designs

`references/aeetds/home.html` is the user-designated homepage visual reference
as of 7 November 2026. `ready_design/` remains the reference for existing EdTech
pages. See `AEETDS_HOME_PLAN.md` and `AEETDS_HOME_REPORT.md`.

| Route                                                                            | Reference / implementation                                                                                                                  |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                                              | AEETDS homepage: explicit React sections, canonical PDF copy, local AEETDS assets                                                           |
| `/about`                                                                         | AEETDS About the Society: canonical background, seven profile entries, responsive five-milestone timeline and reused shell                  |
| `/about/vision-mission`                                                          | AEETDS Vision/Mission, nine objectives, five thrust areas and five values; shared shell                                                     |
| `/about/governance`                                                              | Governance & Executive Council: governing bodies, office-bearer confirmation states, constitutional roles, committees and Secretariat links |
| `/about/partners`                                                                | Eight listed collaborators, full locations and Secretariat contact panel                                                                    |
| `/membership`                                                                    | Six membership categories, official benefits/audiences/process and application links                                                        |
| `/membership/apply`                                                              | Five-step validated application/review; submission integration pending                                                                      |
| `/membership/acknowledgement`                                                    | Actual accepted receipt when available; explicit preview otherwise                                                                          |
| `/events`                                                                        | Conferences landing, confirmed-date calendar, archive cards and training teaser                                                             |
| `/events/crafns-2026`                                                            | Upcoming international conference, suggested themes and Secretariat enquiries                                                               |
| `/events/ncfahs-2026`                                                            | Completed national conference, sourced organisers and three-photo gallery                                                                   |
| `/events/fstat-2025`                                                             | Completed II International conference, nine supplied track labels and two-photo gallery                                                     |
| `/events/iacrsaegns-2024`                                                        | First international conference, seven supplied theme labels and two-photo gallery                                                           |
| `/events/trainings-workshops`                                                    | Nine training areas and hosting enquiry to the Secretary                                                                                    |
| `/books`                                                                         | `ready_design/catalog.html`; URL search/facets/sort over 10 supplied cards                                                                  |
| `/subjects`                                                                      | Redirect to the supplied Horticulture category                                                                                              |
| `/subjects/horticulture-pomology`                                                | `ready_design/catagory.html`; six supplied cards, filters and citations                                                                     |
| `/books/frontier-agronomy-for-climate-smart-digital-and-natural-farming-systems` | Complete `ready_design/book_detail.html` main view, tabs, citation and footer                                                               |
| `/books/[slug]`                                                                  | Other supplied catalogue/category/related records, using only their own metadata                                                            |
| `/contact`                                                                       | AEETDS Secretariat, 5:7 information/enquiry layout and neutral office-map state                                                             |
| `/publish-with-us`                                                               | Existing honest publishing enquiry page; manuscript submission remains unavailable                                                          |
| `/robots.txt`                                                                    | Disallow crawling during content validation                                                                                                 |
| Unknown routes/slugs                                                             | Native 404 and home recovery, with shared reference chrome                                                                                  |

`/index.html`, `/catalog.html`, `/catagory.html` and `/book_detail.html` redirect to
application routes. The old misspelling is preserved as an alias, not a new public
URL convention. Header Services/About/Book Chapters links use real homepage section
anchors because no separate ready-design pages were supplied. Subject tiles link to
the actual category or matching catalogue facet; all book cards link to their own
record. Footer legal policies lacking approved content are unavailable text.

The catalogue, subject and detail views render real server-side elements from
the sanitized compiled reference. The homepage now uses modular AEETDS React
components rather than ReadyTree. The original EdTech homepage renderer remains
available internally for existing shell/footer reuse and regression tests. See `READY_DESIGN_WORKFLOW.md`. Native markup/React enhancement replaces
all copied source scripts. Assets are local under `/reference-assets/` and `/fonts/`.
No database, submission API, payment, storage, transactional mail, sitemap or public
release is introduced. Supplied metadata conflicts remain launch blockers.

## Homepage migration boundaries

The AEETDS brief explicitly scopes implementation to `/` and permits planned links
for future pages. Membership, event and resource routes are now implemented (see below).
`/submit/abstract`, `/submit/award` and `/downloads` remain planned AEETDS
destinations, not implemented portals. Prefetch
is disabled on homepage links so merely reading it does not request missing pages.
No acceptance, payments or downloads are simulated.

`/contact` now serves the AEETDS Secretariat page (8 November 2026 migration),
with `/contact/faqs` and `/policies` described below. Direct homepage email/telephone
links reach the AEETDS Secretariat. Existing EdTech shell links `/#about`, `/#publishing-services` and
`/#book-chapters` no longer find their original publisher homepage sections.
This integration boundary must be resolved when migrating the remaining pages;
we do not relabel Society content as publisher content or edit generated trees.
Homepage implementation is not a complete website migration or public release.

## About the Society slice

`/about` now implements the next AEETDS page using
`references/aeetds/about/design.html` and canonical PDF page 7. It reuses the
homepage header (optional activePath), ticker and footer. The original homepage
remains unchanged. See `AEETDS_ABOUT_PLAN.md` and `AEETDS_ABOUT_REPORT.md` for
source boundaries, missing crop-field photograph and verified regressions.

## Vision, Mission and Objectives slice

`/about/vision-mission` uses `references/aeetds/vision-mission/design.html` with
canonical copy from PDF pages 8–9. It preserves the completed Home/About pages.
Closing membership/contact actions retain their established AEETDS email destinations.
Membership and AEETDS Contact routes were added in later slices; these closing email actions remain unchanged.

The route has an exact `robots.txt` crawling exception plus public render-asset
allowances. Other preview pages remain disallowed, and inherited no-index metadata
remains in force until release. No canonical origin is configured. See
`AEETDS_VISION_PLAN.md` and `AEETDS_VISION_REPORT.md` for decisions and results.

## Integrated About section

All four About routes now use `AboutLayout` and `AboutSubNavigation`, with one
shared route list in `src/content/aeetds-about-navigation.ts`. The global About
item stays active; the current secondary item is active in server markup. The
secondary track scrolls horizontally and exposes its active item on direct mobile
entry/resizing; keyboard focus remains usable. Existing Society/Vision content
components and the global shell are preserved.

Governance keeps the President's supplied details separate from the Secretary
confirmation note and five unknown positions. Partner identities derive from the
existing collaborator list with source-approved acronyms/cities; no institution
logos or added endorsements are shown. See `AEETDS_ABOUT_SECTION_PLAN.md` and
`AEETDS_ABOUT_SECTION_REPORT.md` for exact content/verification boundaries.

## Membership screens

The three membership routes follow `references/aeetds/membership/` with PDF pages
12, 30 and 34 as the content/workflow authority. They reuse the AEETDS shared shell
with active Membership navigation. Values and selected files stay in memory only.
No membership API, private file storage or mail provider exists; the service boundary
returns explicit unavailable, and acknowledgement success requires an actual validated
receipt. See `AEETDS_MEMBERSHIP_PLAN.md`, `AEETDS_MEMBERSHIP_INTEGRATION.md` and
`AEETDS_MEMBERSHIP_REPORT.md`. Fees/bank details and a real form PDF remain missing.

## Conferences & Events section

All six event routes use one event layout with active Conferences & Events
navigation and the existing shared shell. Typed content lives in
`src/content/aeetds-events.ts`; confirmed date ranges alone drive the functional
calendar. Native dialog galleries use seven actual PDF photographs with provenance.
Three additional source JPEGs were extracted without altering existing assets.
Registration/abstract APIs and event downloads remain unavailable; page actions
use explicit Secretariat enquiries. See `AEETDS_EVENTS_PLAN.md` and
`AEETDS_EVENTS_REPORT.md` for source boundaries, missing materials and validation.

## Awards, Publications and submission resources

- `/awards`: eight full award groups, nomination steps, contribution amounts pending
  confirmation, official rules and filterable empty awardee directory.
- `/publications`: conference abstract entries, edited volumes, chapter workflow,
  forthcoming magazine and planned journal. No Publications export was supplied or
  found; this page uses the established AEETDS visual patterns.
- `/submit`: redirects to `/submit/guidelines`.
- `/submit/guidelines`: exact abstract/summary/oral/poster requirements, sticky
  section navigation, illustrative poster and interactive preparation checklist.
- `/submit/registration`: current fees/sponsorship TBA, verified-instructions-pending
  payment panel, delegate form and policies. Bank coordinates are withheld.

The Submit routes share active secondary navigation; all four resources reuse the
existing header/ticker/footer. Registration validation is client-side preparation:
no API, private storage, CAPTCHA or mail adapter is configured. The default service
returns unavailable and never fabricates a receipt. See `AEETDS_RESOURCES_PLAN.md`,
`AEETDS_REGISTRATION_INTEGRATION.md` and `AEETDS_RESOURCES_REPORT.md`.

## Contact, FAQs and Policies — final informational screens

- `/contact`: replaces the earlier EdTech contact route with the AEETDS 5:7
  Secretariat/form composition, all four helplines, office hours, registration,
  neutral unavailable-address/map states and collaboration email action.
- `/contact/faqs`: all eleven exact official answers, category counts, combined
  category/question/answer search, accessible numbered accordions and filtered
  FAQPage JSON-LD. Both Contact routes keep the main Contact item active.
- `/policies`: exact five official policies, sticky 4:8 reader composition,
  mobile horizontal index, active reading-section tracking, native hashes/history,
  highlighted passages and Secretariat CTA. No unrelated main item is active.

All reuse ResourceShell and the existing header/ticker/footer. Contextual links
connect all three routes. No global shell/source changes or new dependencies.
The contact adapter returns explicit unavailable: no enquiry is sent or stored,
no CAPTCHA/mail provider exists, and input stays in page memory. Exact source and
verification: `AEETDS_SUPPORT_PLAN.md`, `AEETDS_CONTACT_INTEGRATION.md` and
`AEETDS_SUPPORT_REPORT.md`. Existing preview no-index/crawling rules remain.

## Developer Guide runtime additions

- `/admin`: configured Secretary authentication, content editing and private applications.
- `/downloads`: published, scanned Secretary assets; honest empty state before publication.
- `/api/submissions/config` and `/api/submissions/[type]`: public availability and
  validated acceptance for existing MEMBERSHIP, CONF-REG and ENQUIRY forms.
- `/api/admin/[...action]`: authenticated session, content, upload and application operations.
- `/api/site-content`: published public content only; `/media/[id]`: published managed assets only.
- `/submit/abstract` and `/submit/award`: compatibility redirects to guidelines and nomination information.

Other five guide submission types remain unavailable pending complete approved forms.
