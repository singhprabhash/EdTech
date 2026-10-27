# Routes and screen map

## Implemented routes

| URL                | File                                               | Status                                                                        |
| ------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| `/`                | `src/app/page.tsx`, `src/components/home-hero.tsx` | Hero narrative, CTAs and GET search; book artwork pending approval            |
| `/books?q=…`       | `src/app/books/page.tsx`                           | Query-preserving catalogue entry with honest empty state; no approved records |
| `/publish-with-us` | `src/app/publish-with-us/page.tsx`                 | Publishing enquiry contact; no online proposal submission                     |
| `/contact`         | `src/app/contact/page.tsx`                         | Email/telephone contacts from handoff                                         |
| `/robots.txt`      | `src/app/robots.ts`                                | Disallow crawling during development                                          |
| Unknown URLs       | `src/app/not-found.tsx`                            | Native 404 with home recovery link                                            |
| Shared document    | `src/app/layout.tsx`, `src/app/globals.css`        | Header, footer, local fonts, language, no-index metadata and tokens           |

`src/config/site.ts` is the canonical site identity/navigation configuration.
Only implemented routes appear in navigation. Contacts reflect the supplied
handoff, not independently verified business ownership/delivery. No APIs, forms,
catalogue records, database or provider adapters exist. Search does not invent
matches from the reference HTML. No redirects are invented; any live indexed
URL inventory is still needed.

## Supplied references and future routes

| Reference                       | Intended route     | Remaining implementation                             |
| ------------------------------- | ------------------ | ---------------------------------------------------- |
| `design/homepage.html`          | `/`                | Approved seal/artwork and remaining content sections |
| `design/catalog.html`           | `/books`           | Verified records, search/filter/sort/pagination      |
| `design/specific_category.html` | `/subjects/[slug]` | Approved subjects and content                        |
| `design/book_detail.html`       | `/books/[slug]`    | Edition-level metadata, covers, actions and SEO      |

`/about`, `/services`, `/book-chapters`, legal and ordering pages remain
unimplemented. Subjects index and proposal URLs remain open. No links expose
these unresolved destinations. The rectangular logo linked in the reference does
not satisfy the requirement for the actual circular seal; plain brand typography
is used while that asset remains unavailable.

Original exports remain unchanged and outside `public/`. Local fonts and their
licenses are served under `public/fonts`; external book artwork has not been added.
See `SHARED_SHELL_PLAN.md` and `MILESTONE_2.md` for scope and verification.
