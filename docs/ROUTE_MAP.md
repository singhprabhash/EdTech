# Current routes and primary designs

`ready_design/` is the user-designated primary visual reference.

| Route                                                                            | Reference / implementation                                                         |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/`                                                                              | Complete `ready_design/index.html` main content and footer                         |
| `/books`                                                                         | `ready_design/catalog.html`; URL search/facets/sort over 10 supplied cards         |
| `/subjects`                                                                      | Redirect to the supplied Horticulture category                                     |
| `/subjects/horticulture-pomology`                                                | `ready_design/catagory.html`; six supplied cards, filters and citations            |
| `/books/frontier-agronomy-for-climate-smart-digital-and-natural-farming-systems` | Complete `ready_design/book_detail.html` main view, tabs, citation and footer      |
| `/books/[slug]`                                                                  | Other supplied catalogue/category/related records, using only their own metadata   |
| `/contact`                                                                       | Existing handoff contact page, new shared reference chrome                         |
| `/publish-with-us`                                                               | Existing honest publishing enquiry page; manuscript submission remains unavailable |
| `/robots.txt`                                                                    | Disallow crawling during content validation                                        |
| Unknown routes/slugs                                                             | Native 404 and home recovery, with shared reference chrome                         |

`/index.html`, `/catalog.html`, `/catagory.html` and `/book_detail.html` redirect to
application routes. The old misspelling is preserved as an alias, not a new public
URL convention. Header Services/About/Book Chapters links use real homepage section
anchors because no separate ready-design pages were supplied. Subject tiles link to
the actual category or matching catalogue facet; all book cards link to their own
record. Footer legal policies lacking approved content are unavailable text.

All four views render real server-side elements from the sanitized compiled
reference. See `READY_DESIGN_WORKFLOW.md`. Native markup/React enhancement replaces
all copied source scripts. Assets are local under `/reference-assets/` and `/fonts/`.
No database, submission API, payment, storage, transactional mail, sitemap or public
release is introduced. Supplied metadata conflicts remain launch blockers.
