# EdTech Publications — Repository Audit

Audit date: 27 October 2026 (Asia/Kolkata). Scope: supplied directory only; audit and planning, with no feature implementation, dependency installation, network verification, or deployment.

## Status and evidence boundaries

**Confirmed:** this directory is a static design/specification handoff, not an existing production application. There are 28 original files: 12 HTML files, four screenshot PNGs, six Markdown files, and six `.DS_Store` files. There is no `.git` directory, application manifest, lockfile, router, server, automated test suite, environment configuration, or deployment configuration in this tree.

**Path discrepancy:** `docs/PRD.md`, `docs/TRD.md`, and `docs/IMPLEMENTATION_PLAN.md` did not exist at audit start. The supplied equivalents are `PRD.md`, `TRD.md`, and `IMPLEMENTATION_PLAN.md` at the root; all were read along with `AGENTS.md` and both design documents. This audit creates the requested `docs/REPOSITORY_AUDIT.md` and repository-specific `docs/IMPLEMENTATION_PLAN.md`. The latter supersedes the root plan for future work; original files remain untouched. Root PRD/TRD remain the specification inputs. Decide a documentation migration separately to avoid competing sources.

**Preservation:** `git status --short` returned exit 128, “not a git repository.” Branch, history, indexed routes and uncommitted status cannot be established. An SHA-256 snapshot of every original file was taken before document writes and compared afterwards. No Git initialization, commits, renames or deletions were performed.

**Assessment method:** complete file inventory, byte-level duplicate comparisons, HTML parsing, inline-script inspection and JavaScript syntax checks, ISBN checksum analysis, source-token contrast calculation, and inspection of all four supplied screenshots. Runtime interaction, computed layout, network availability and assistive-technology behavior were not tested. Source-confirmed omissions are distinguished below from layout risks requiring browser verification. Screenshots are historical reference images, not fresh browser test results.

## Repository and engineering inventory

| Area | Confirmed state | Consequence |
| --- | --- | --- |
| Framework/runtime | Plain HTML with inline JavaScript and inline Tailwind configuration; no application framework or runtime version declared | No existing app stack to preserve or replace; a future stack proposal needs rationale and review |
| Styling | `https://cdn.tailwindcss.com` runtime script; no pinned version/build pipeline; Google Fonts for Newsreader, Manrope and Material Symbols; duplicate Material Symbols stylesheet links | Styling depends on external resources; no reproducible CSS build |
| Package manager | No `package.json`, npm/pnpm/yarn/bun lockfile or workspace manifest | Package manager and dependency versions are unspecified |
| Routes/rendering | Four unique standalone HTML screens; no `index.html`, rewrite rules, dynamic routes or route handlers | File paths exist, but clean production URLs do not |
| Components | Header, footer, cards, filters and token configurations copied into screens | No reusable component source; changes require edits in multiple places |
| Catalogue source | Literal HTML text, image URLs, citation text and `data-*` attributes | No canonical catalogue, schema, importer, validation or publication workflow |
| Backend/data | No API, database, migrations, persistence, auth, email/storage adapters or retry mechanism | Proposal/contact workflows are absent |
| Environment | No `.env*`, environment schema, secret-store integration or runtime config found | Integrations cannot be configured from this handoff; no private credential files were read outside it |
| Tests/tooling | No lint, typecheck, test, content-check, accessibility, build or dependency-audit configuration | No existing automated quality gate can run |
| CI/CD | No `.github`, pipeline YAML, Dockerfile, hosting config or deployment script | No known staging/production/release/rollback setup |
| Operations | No health check, logs, telemetry, backup/restore, retention or incident runbook | Operational ownership and requirements need confirmation |
| Local assets | Four `screen.png` reference captures only | No separately supplied production logo, covers, author portraits, samples, agreement, favicon or social images |

Host tools observed: Node `v25.8.2`, npm `11.11.1`, Python 3 available. These are audit-host tools, **not** declared project versions. `playwright`, `puppeteer` and `@playwright/test` were not locally resolvable. No packages were installed.

## Screen provenance and required routes

Each row below has three byte-identical HTML copies. Use `design/` as a convenient audit reference, not as an approved canonical authoring location. SHA-256 grouping confirmed four unique contents among twelve HTML files.

| Reference in `design/` | Copies under `stitch_edtech_publications_academic_portal/` | Proposed route (not implemented) |
| --- | --- | --- |
| `homepage.html` | `homepage.html`, `homepage_edtech_publications/homepage.html` | `/` |
| `catalog.html` | `catalog.html`, `book_catalogue_edtech_publications/catalog.html` | `/books` |
| `specific_category.html` | `specific_category.html`, `subject_horticulture_pomology_edtech_publications/specific_category.html` | `/subjects/[slug]`; Horticulture & Pomology is the supplied example |
| `book_detail.html` | `book_detail.html`, `book_details_edtech_publications/book_detail.html` | `/books/[slug]`; Frontier Agronomy is the supplied example |

Each nested screen directory also contains its corresponding `screen.png`. `DESIGN.md` and `stitch_edtech_publications_academic_portal/academic_editorial/DESIGN.md` are byte-identical.

| Required route/content | Reference coverage and current gap |
| --- | --- |
| `/about` | Home narrative only; no page |
| `/publish-with-us` | Home process/services teasers only; no page |
| Proposal page | `data-path="submit-a-manuscript"` appears on links, but all point to `#`; propose `/submit-a-manuscript`, subject to URL review |
| `/services` | Home teasers; no page |
| `/book-chapters` | CTA only; no requirements, calls or agreement |
| `/contact` and FAQ | `tel:`/`mailto:` links exist; no contact page, form or FAQ |
| `/order-and-payment` | Quote/order CTAs only; no approved process page |
| `/privacy`, `/terms`, `/shipping-and-returns` | Footer labels only; no policy text/routes |
| Subjects navigation | `data-path="subjects"` has no destination; choose `/subjects` index or `/books` subject-filter entry, without fabricating subject pages |
| System states | No real 404, server error, catalogue empty/error/no-results, missing-asset or accepted-submission routes/states |
| Downloads | No master catalogue PDF, author guidelines, sample chapter or agreement PDF |
| APIs | No proposal/contact endpoints or health endpoint |

These are route proposals from TRD §7 and visible navigation, not evidence of indexed URLs. Obtain any live-site URL/redirect inventory before changing a deployed site's routes.

## Functionality and defects

Counts below cover one copy of each unique screen, avoiding triple counting.

| Screen | `href="#"` | Source-supported behavior | Missing/nonfunctional behavior |
| --- | ---: | --- | --- |
| Home | 54 | Quick-filter buttons set and focus hero input | Search click/Enter have no search handler/form action; subject tiles, featured books, proposals and PDF CTAs do not navigate |
| Catalogue | 43 | Subject chip styling, reset of search/sort/chip selection, grid/list CSS switch, Ctrl/Cmd+K focus | Search does not query; sorting never reorders; subject/year/language/type controls do not filter data; pagination and per-card library enquiries lack handlers; counts are hardcoded |
| Subject | 44 | Subdiscipline styling; citation modal populated from button attributes; close buttons; clipboard success feedback after resolved promise | No filtering/year/format sorting/reset/pagination implementation; no content-area search; detail/proposal/download/related-subject links are placeholders |
| Book | 42 | Tab visibility switch, citation modal open/close, clipboard request and toast | Order/quote, inspection copy, related books and DOI link point to `#`; sample button only calls `downloadSampleToast()` |

**Total: 183 placeholder anchors** (549 across all twelve HTML copies). No ordinary internal navigation anchor links one reference file to another. `data-path` attributes do not provide routing; no resolving script was found. `tel:+917408206291` and `mailto:edtechpublications@gmail.com` are syntactically real contact links, but contact ownership, reachability and actual delivery were not verified.

Specific defects and evidence:

- `design/homepage.html:42–51,738–755`: quick-filter interaction only fills input; unused `filterButtons` variable; no results navigation.
- `design/catalog.html:780–851`: script changes CSS classes/input values only. The “Table View” control produces a one-column card grid, not a table.
- `design/catalog.html:756–776`: “Page 1 of 4” and “1–10 of 46” are literals; four pages of ten cannot represent 46 items. Only ten cards are present.
- `design/specific_category.html:640–710`: subdiscipline handler changes styles only. Citation text comes from independent attributes, separate from card metadata. Clipboard rejection has no error handler.
- `design/book_detail.html:852–862`: copy feedback appears without awaiting clipboard success; sample action announces “Downloading Chapter 1 sample PDF (34 pages, 2.4 MB)...” without a download request or asset.
- No proposal/contact forms exist in any screen (zero `<form>` elements), hence no validation, durable acceptance, consent capture, private upload handling, rate limiting or staff/author mail.
- Missing controls must be implemented or hidden/clearly disabled in production; placeholder CTAs cannot be treated as delivered features.

## Accessibility and responsive review

Confirmed from source:

- All four documents have `lang="en"`, viewport metadata, a main landmark and one `h1`. Headings still skip levels: home `h1` to `h4`, and book `h1` to `h3` (with an earlier cover `h2`).
- 31 of 35 `<img>` elements lack `alt`; most use `data-alt`, which does not supply an accessible alternative. All 35 lack HTML `width`/`height`; no lazy-loading attributes are present. CSS aspect ratios reserve some space, so layout shift remains a measurement question.
- Six inputs and three selects lack programmatic labels (`label`, `aria-label` or `aria-labelledby`). Placeholder text and adjacent “Sort:” text are insufficient.
- Book tabs have a `role="tablist"` container but no tab/tab-panel roles, selected state, relationships or arrow-key behavior. Citation overlays lack dialog semantics, Escape handling, focus trapping/restoration and background inertness.
- No live-region/status semantics for toast feedback. Numerous icon glyphs are not hidden from assistive technology. Inputs/selects use `outline-none` without a replacement focus treatment in their local markup.
- Small catalogue description text uses `text-outline-variant` (`#C5C6CE`) on white: token contrast is approximately 1.70:1 (1.54:1 on `#F0F3FF`), below AA for normal text. This is a source-token calculation, not a computed-browser audit.
- Navigation is `hidden xl:flex` on every screen with no mobile drawer, menu button or alternate navigation. Below the default Tailwind xl breakpoint, the primary navigation disappears.
- A profile/person decoration suggests an account function although accounts are excluded from v1; it is a `div`, not a working action.
- Global styles hide WebKit scrollbars and disable overscroll behavior. No skip link or reduced-motion media rule was found.

Layout risks needing fresh browser checks:

- Header has nonshrinking brand/action groups, a long manuscript CTA and, at md+, a 208/256 px search field. At narrow widths these can exceed available space. The supplied desktop screenshots already show wrapped navbar labels and a cramped header; this is not a measured mobile-overflow result.
- Fixed header height assumptions use main padding `112px`, while the utility strip wraps. Catalogue sticky filters use `top-[112px]`; subject filters use `top-20` (80px), which can overlap the header. Catalogue filters can occupy a large share of a short viewport.
- Unwrapped author/ORCID rows, long DOI and ISBN specification rows and wide pagination groups risk overflow. Several 56px headings do not apply available mobile typography tokens.
- Subject chips deliberately scroll horizontally; hidden scrollbar styling reduces discoverability. Verify keyboard access and wrapping at intermediate widths.
- Responsive grids are present, but no evidence establishes acceptance at 320, 390, 768, 1024, 1280 and 1440 px, 200% zoom, keyboard-only use, or screen readers.

All four supplied screenshots were inspected. They show the scholarly palette, card layouts and populated footer, but cannot establish runtime accessibility, console cleanliness or external-asset reliability. No WCAG conformance, responsive pass or Lighthouse score is claimed.

## Content integrity and production assets

**No catalogue record or business claim is verified by this handoff.** There is no approved structured catalogue, provenance record or content blueprint beyond the supplied documents/screens. Omit unapproved data from public pages and structured data; do not auto-correct it into apparently authoritative metadata.

### Concrete metadata conflicts

| Title | Home | Catalogue | Detail/subject |
| --- | --- | --- | --- |
| Frontier Agronomy for Climate Smart, Digital and Natural Farming Systems | Rajesh Kumar; `978-93-94572-88-1` (`homepage.html:308–313`) | Manoj K. Verma and S. Nair; `978-93-94821-12-6` (`catalog.html:292–305`) | Rajesh Kumar; hardcover `978-93-94821-45-2`, paperback `978-93-94821-46-9` (`book_detail.html:211–244`) |
| Modern Technologies in Tropical Fruit Cultivation | Praveen Kumar Mishra and co-authors; `978-93-94572-61-4` (`homepage.html:344–349`) | A. K. Srivastava and R. P. Singh; `978-93-94821-04-1` (`catalog.html:238–251`) | Praveen Kumar Mishra, S. K. Singh, R. K. Pathak; `978-93-94801-44-1` (`specific_category.html:173–188`) |

Other repeated titles (Entomology, Bioinformatics, AMMA and Soil Biodiversity) also differ in author/ISBN/year/title wording between home and catalogue. Cover images and author portraits are remote illustrative assets with no approval or rights manifest; reconcile jacket text with approved records rather than trusting the image.

Checksum analysis used 27 distinct complete strings matching `978-XX-XXXXX-XX-X` across the four unique screens. Six pass; **21 fail**. This check excludes incomplete prefixes such as `978-93-94821`, `978-93-94572` and the modal placeholder `978-XX-XXXX`.

| Screen/source group | Complete ISBN strings | Checksum result |
| --- | --- | --- |
| Home | `978-93-94572-12-6`, `978-93-94572-35-5`, `978-93-94572-47-8`, `978-93-94572-61-4`, `978-93-94572-88-1`, `978-93-94572-92-8` | All six pass syntax/checksum only; authenticity unverified |
| Catalogue | `978-93-94821-04-1`, `978-93-94821-12-6`, `978-93-94821-23-2`, `978-93-94821-39-3`, `978-93-94821-45-4`, `978-93-94821-51-5`, `978-93-94821-68-3`, `978-93-94821-75-1`, `978-93-94821-82-9`, `978-93-94821-99-7` | All ten fail |
| Subject | `978-93-94801-18-2`, `978-93-94801-44-1`, `978-93-94801-65-6`, `978-93-94801-72-4`, `978-93-94801-89-2`, `978-93-94801-99-1` | All six fail |
| Book detail + related books | `978-93-94821-45-2`, `978-93-94821-46-9`, `978-93-94821-22-3`, `978-93-94821-39-1`, `978-93-94821-18-6` | All five fail |

Further unverified content:

- DOI `10.58245/edtp.agronomy.2024.452`, ORCID `0000-0002-8419-7231`, author employment/credentials, ICAR awards, syllabus alignment, registration/accreditation and archival deposit claims. No external resolution/authenticity checks were performed.
- All dates, editions, extent, charts, contents, scientific trial data and percentages; no manuscripts establish these facts.
- Book detail prices ₹1,895 (crossed-out ₹2,250) and ₹895; related prices ₹1,450, ₹1,620, ₹1,750; subject prices ₹1,495, ₹1,850, ₹1,250, ₹1,620, ₹750, ₹1,380. Currency symbols alone do not establish approved commercial terms, tax treatment, validity or availability.
- Counts “46+”, “46”, “140+”, “15+ disciplines”, “8 domains”, subject totals and “100%” claims are literals. Home subject tiles total 46 but catalogue subject chips total 46 with a different distribution; subject-related Agronomy says 18 while the catalogue chip says 8 and home says 4. Subject has six cards but asserts nine titles. No source supports deriving these counts.
- Discount “up to 25%”, GST/proforma invoicing, complimentary desk/author copies, 7-day assessment, royalties/contracts, peer-review process, distribution reach, teaching slides/data and bilingual service promises require owner approval.
- Address/PIN, contact details and copyright year 2025 are present but unverified. No privacy, terms, shipping/returns, consent or agreement wording exists to approve.

### Asset and theme gaps

All 35 image elements reference `lh3.googleusercontent.com`; the subject decorative figure also uses a remote CSS background. No local production seal image exists. The common remote image is labelled “EdTech Publications Logo,” but the screenshot does not establish an approved circular seal. Obtain the authentic seal and confirm ownership/licensing and intended sizing.

Required supplied/approved assets: seal variants, accurate edition-specific covers, authorized portraits if used, sample PDFs, master catalogue PDF if retained, author guidelines, signed-off agreement PDF, favicon/social images and approved policy copy. Remote URL availability, caching, access rights and image correctness remain untested; no broken-network claim is made.

Conflict: `DESIGN.md` frontmatter and HTML use navy `#011633`, blue `#1F58C4`, cool pale surfaces, Newsreader and Manrope, matching PRD/TRD tokens. Its prose instead names `#182B49`, `#3568D4`, warm `#FAFAF7`, and different radii. HTML also overrides radii differently from frontmatter. All four footer implementations use `bg-surface-container-low` and their screenshots show pale footers; `AGENTS.md` explicitly requires dark navy. Record the intended reconciliation; the proposed plan follows the explicit navy-footer requirement while preserving populated links and approved core tokens. Do not silently blend the prose palette into the product.

## Baseline checks and exact outcomes

No existing project quality command was available to execute. Missing tooling is **not a pass**. Audit probes were read-only except temporary scripts/hash evidence in `/tmp`.

| Command/check executed | Result |
| --- | --- |
| `pwd` and `git status --short` | Correct supplied directory; Git exit 128, not a repository |
| `ls -la`; `rg --files --hidden` | Inventory found 28 original files and no project infrastructure |
| `rg --files --hidden -g '*package*' -g '*lock*' -g '*test*' -g '*spec*' -g '*config*' -g '*env*' -g '*README*' -g '*Docker*' -g '*Makefile*' -g '*yml' -g '*yaml' -g '*toml' -g '*json'` | Only the three `specific_category.html` paths matched via `*spec*`; no manifests/check configuration |
| Python `pathlib` + SHA-256 grouping | Twelve HTML files form four groups of three identical copies; design docs identical |
| Python `html.parser.HTMLParser` scan of `design/*.html` | 183 `#` anchors; zero forms; 35 images, 31 missing `alt`; nine unlabelled input/select controls; one h1/main per screen. Parser is not an HTML conformance validator |
| Extract inline script bodies to `/tmp/edtech-<screen>-<index>.js`, then `node --check` each | Eight scripts (configuration + interaction script per screen), all exit 0. Syntax only; no DOM/network/clipboard correctness implied |
| Python ISBN-13 weighted sum (alternating 1,3, including check digit; divisible by 10) | 27 distinct complete strings; six checksum passes, 21 failures |
| Source sRGB relative-luminance contrast calculation | `#C5C6CE` on white ≈1.70:1; on `#F0F3FF` ≈1.54:1 |
| `node --version`; `npm --version`; `require.resolve` probes | Host versions above; no locally resolvable Playwright/Puppeteer/test runner |
| Lint / typecheck / unit / integration / E2E / content / production build / dependency audit | **Unavailable, not run:** no scripts/configuration/lockfile; did not invent commands or install a stack |
| Fresh browser layout / accessibility / Lighthouse / console / external links / deployment/mail/upload | **Not run:** no configured harness or production environment. Supplied screenshots reviewed only |

To reproduce core source findings without installing packages:

```sh
python3 - <<'PY'
from pathlib import Path
from html.parser import HTMLParser
import re, subprocess, tempfile
class Audit(HTMLParser):
    def __init__(self):
        super().__init__(); self.tags=[]; self.scripts=[]; self.script=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); self.tags.append((tag,a))
        if tag=='script' and 'src' not in a: self.script=''
    def handle_data(self, data):
        if self.script is not None: self.script+=data
    def handle_endtag(self, tag):
        if tag=='script' and self.script is not None:
            self.scripts.append(self.script); self.script=None
isbns=set()
with tempfile.TemporaryDirectory() as temp:
    for path in sorted(Path('design').glob('*.html')):
        source=path.read_text(); p=Audit(); p.feed(source)
        print(path, 'hash anchors', sum(t=='a' and a.get('href')=='#' for t,a in p.tags),
              'missing alt', sum(t=='img' and 'alt' not in a for t,a in p.tags))
        for i, body in enumerate(p.scripts):
            script=Path(temp)/f'{path.stem}-{i}.js'; script.write_text(body)
            subprocess.run(['node','--check',str(script)],check=True)
        isbns.update(re.findall(r'978-\d{2}-\d{5}-\d{2}-\d', source))
for isbn in sorted(isbns):
    digits=[int(c) for c in isbn.replace('-','')]
    valid=sum(n*(1 if i%2==0 else 3) for i,n in enumerate(digits))%10==0
    print(isbn, 'checksum pass' if valid else 'CHECKSUM FAIL')
PY
```

## Assumptions, blockers and approval decisions

**Planning assumptions (not approved facts):** supplied HTML is visual reference only; launch is English UI with Hindi/bilingual metadata; initial catalogue could fit version-controlled structured files; a single application with native server endpoints may satisfy forms. Catalogue size/editor workflow and hosting capabilities must validate those assumptions. No provider, framework, database or CMS has been selected.

| Decision/blocker | Required input/approval | Blocks |
| --- | --- | --- |
| Actual application/repository | Confirm this is the full handoff or supply existing app/Git/deployment location | Stack-specific implementation and preservation of deployed behavior |
| Framework, package manager, runtime, host/CI | Written options/rationale for this static-only starting point; approve before scaffolding | Foundation and exact framework file paths |
| Catalogue authority | Owner-approved edition-level records, descriptions/TOC, relationships, provenance and staff update workflow | Public book content, counts, search facets, citations, SEO schema |
| Identity/assets/design conflict | Approved seal/covers and asset rights; confirm token/radius reconciliation; navy footer follows AGENTS | Final production visual approval |
| Ordering | Confirm enquiry/quote contact and copy, supported discounts/tax/availability | Working commercial CTAs; no online payments without explicit approval |
| Legal/privacy | Approved policies, agreement/consent versions, retention, deletion and staff access rules | Forms, downloads and legal publication |
| Persistence/uploads/mail | Approved durable store, private storage, mail provider/sender domain, SPF/DKIM/DMARC, malware policy, 20 MB per-file vs total, limits and retries | Secure accepted-submission workflow |
| Operations | Staging/production ownership, secrets, backups/restore, RPO/RTO, incident owner, release/rollback | Production release |
| Product scope | Full UI localization? analytics/consent? supported browser matrix? subject-index URL? | Related scope only; do not add analytics/CMS/accounts by assumption |

No consequential product, privacy, payment or security decision was made. Existing specification requirements remain binding; decisions above resolve absent inputs rather than waive them.

## Recommended sequence and audit exit

1. Review this audit; resolve repository location, documentation authority and architecture prerequisites.
2. Approve content/asset sources and an edition-level schema; quarantine illustrative data.
3. Establish the chosen reproducible application/tooling and shared accessible shell.
4. Deliver a tested catalogue vertical slice: verified content → search/filter domain → home/catalogue/subject/detail routes → citations/downloads and SEO.
5. Add approved informational/legal pages and enquiry paths.
6. Implement contact, then secure proposal acceptance/uploads/notification retries after policy/provider prerequisites are approved.
7. Complete browser/accessibility/performance/security/operations gates, staging and release review.

See `IMPLEMENTATION_PLAN.md` beside this audit for file responsibilities, dependencies and acceptance checks. Audit complete at the source-review level; live-browser and external-verification gaps remain explicitly open. Stop here for review; implementation is not authorized by this document.
