# Current conference-focused routes

20 November 2026: the user retired the initial book-buying/publishing storefront.
Original exports remain archived; the active site is the AEETDS conference/Society UI.

| Route | Purpose |
| --- | --- |
| `/` | Society homepage, news and CRAFNS registration announcement |
| `/about` | Society background and milestones |
| `/about/vision-mission` | Vision, mission, objectives and thrust areas |
| `/about/governance` | Governance and committees |
| `/about/partners` | Partners and collaborators |
| `/events` | Featured upcoming conference, archives and calendar |
| `/events/crafns-2026` | Current international conference, participation and brochure |
| `/events/ncfahs-2026` | National conference archive |
| `/events/fstat-2025` | Second international conference archive |
| `/events/iacrsaegns-2024` | First international conference archive |
| `/events/trainings-workshops` | Training and workshops |
| `/membership`, `/membership/apply`, `/membership/acknowledgement` | Membership information, application and receipt |
| `/awards` | Awards, nomination instructions and contributions |
| `/publications` | Conference abstracts/volumes, magazine and journal list |
| `/submit/guidelines` | Scientific submission/presentation instructions |
| `/submit/registration` | Conference fees, deadlines, bank/UPI, policies and registration links |
| `/downloads` | Approved Society documents and conference PDFs |
| `/contact`, `/contact/faqs`, `/policies` | Secretariat, enquiry, FAQ and policies |
| `/admin` | Configured Secretary administration; private/no-index |
| `/api/submissions/config`, `/api/submissions/[type]` | Configured local form availability/acceptance |
| `/api/admin/[...action]`, `/api/site-content` | Private admin and published public content |
| `/media/[id]` | Published managed assets only |
| `/sitemap.xml`, `/robots.txt` | Release-gated Society sitemap and crawler rules |
| `/favicon.ico`, `/icon.png`, `/apple-icon.png` | Global seal-based browser metadata assets |

`/submit` and `/submit/abstract` redirect to guidelines; `/submit/award` redirects to
nomination information. `/index.html` continues to the current Society homepage.

## Retired pages

`/books`, `/books/[slug]`, `/subjects`, `/subjects/[slug]`, `/publish-with-us`,
`/catalog.html`, `/catagory.html` and `/book_detail.html` are removed and return
actual 404 responses with Society navigation and conference recovery. Unimplemented
old shopping/author plans such as `/cart`, `/checkout` and `/authors` also remain 404.
No unrelated homepage redirects hide the removal. Removed URLs are absent from
navigation and sitemap; released robots no longer blocks their 404 responses.

The old ReadyTree runtime/catalogue engine and their feature-specific tests were
retired. Reference HTML, fonts/artwork, generated archival trees/metadata and theme
remain reproducible and preserved, without active application imports. The default
preview remains no-index; the release sitemap lists only `publicSocietyRoutes`.
