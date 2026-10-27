# EdTech Publications --- Product Requirements Document (PRD)

**Status:** Draft for repository discovery and stakeholder validation\
**Product:** EdTech Publications public publishing website and
catalogue\
**Source of truth:** Approved website content blueprint, current
supplied HTML screens, and repository inspection.

## 1. Executive summary

Build a production-grade responsive website for EdTech Publications that
presents the publisher, makes books discoverable, provides detailed book
pages, explains publishing services, and converts prospective
authors/customers through reliable forms and contact pathways.

Current HTML screens are visual references and content inputs, not proof
that interactions, data, security, SEO, or deployment are
production-ready. Codex must inspect the repository first, preserve
working implementation where possible, and turn static or placeholder
interactions into tested functionality without inventing catalogue data
or business policies.

## 2. Product goals

1.  Make books discoverable by title, author, ISBN, subject, language,
    format, and publication year where data exists.
2.  Give each book a stable detail page with verified metadata,
    description, contents, available formats, approved pricing, and
    clear order/contact actions.
3.  Help authors understand publishing services and submit proposals
    with attachments safely.
4.  Make chapter submission requirements and the agreement easy to find.
5.  Keep publisher identity, contact details, FAQs, policies, and
    services accessible.
6.  Deliver accessible, fast, SEO-friendly mobile/tablet/desktop
    experiences.
7.  Make content maintainable without editing UI components for routine
    catalogue updates.

## 3. Non-goals for v1

Unless already implemented or explicitly approved, do not build customer
accounts, online checkout/payments, author dashboards, editorial
workflow management, inventory/shipping integrations, plagiarism
detection, ISBN registration, a full CMS, or microservices just for
architectural fashion. Initial ordering should use the confirmed
enquiry/request/contact process. Validate any payment workflow before
implementing payments.

## 4. Users

-   **Student/reader:** find a relevant book, understand its
    audience/contents, and learn how to order.
-   **Teacher/faculty/librarian:** assess syllabus relevance,
    ISBN/edition/contents, and request an inspection copy or quote if
    supported.
-   **Author/researcher:** understand services/process, submit a
    proposal, receive acknowledgement after server acceptance.
-   **Chapter contributor:** review requirements, download agreement,
    submit or contact the publisher.
-   **Publisher staff/site maintainer:** maintain verified catalogue
    content and receive enquiries without data loss.

## 5. Information architecture

  --------------------------------------------------------------------------------
  Page                                Requirements
  ----------------------------------- --------------------------------------------
  Home                                Publisher proposition, prominent hero
                                      catalogue search, subjects, new
                                      releases/highlights, reasons to choose
                                      publisher, author CTA, footer.

  Books catalogue                     Search, subject/year/language/format filters
                                      where data supports them, sorting, result
                                      count, responsive cards, scalable
                                      pagination, empty/error states.

  Subject page                        Subject intro, relevant catalogue, filters,
                                      breadcrumb; search in content area rather
                                      than overcrowded navbar.

  Book detail                         Cover, title, authors, subject, description,
                                      TOC, verified
                                      ISBN/edition/date/language/formats/prices,
                                      related books, order/enquiry,
                                      sample/citation actions only when real.

  About                               Verified publisher story, mission,
                                      standards.

  Publish With Us                     Scope, benefits, preparation checklist,
                                      process, proposal CTA.

  Proposal form                       Validated form, allowed file uploads,
                                      consent, reliable success/error states,
                                      staff notification.

  Services                            Confirmed publishing/editorial services and
                                      contact CTA.

  Book Chapters                       Calls/requirements, agreement download,
                                      submission instructions.

  Order & Payment / Customer Care     Approved ordering steps, payment
                                      instructions, support, shipping/returns only
                                      after validation.

  Contact & FAQ                       Verified contacts, address, form, FAQs, map
                                      only if approved.

  Legal pages                         Approved privacy, terms, shipping/returns,
                                      agreement, other policies.

  System states                       404, server error, validation error,
                                      success, no results, empty catalogue,
                                      unavailable asset.
  --------------------------------------------------------------------------------

Use clean stable URLs, canonical URLs, and preserve existing indexed
routes where possible. No `href="#"` for implemented navigation.

## 6. Functional requirements

### FR-01 Global navigation/footer

Consistent brand and navigation; responsive utility strip/header/menu;
mobile drawer supports keyboard, Escape, and accessible expanded state;
footer is populated on all breakpoints and contains approved
links/contact/legal/copyright. Use the actual approved circular EdTech
Publications seal logo from repository assets.

### FR-02 Catalogue

Search title, author, ISBN, and subject where indexed. Enter and Search
button behave identically. Filters compose and can be reset. Sorting is
deterministic. Search/filter state should be shareable in URL parameters
where practical. Show loading, no-results, and error states. Counts must
be computed from the canonical source.

### FR-03 Book detail

Data-driven stable detail pages. Omit missing optional metadata instead
of inventing it. Related books derive from verified subject/category
relationships. Sample chapter, citation, order, and institutional quote
actions must work or be hidden/clearly disabled until available.
Citation values derive from verified metadata.

### FR-04 Proposal form

Fields match the approved proposal form: author name,
designation/institution, email, mobile, proposed title, subject, book
type, target readers/course, language, manuscript status, short
description (max 300 words), consent, and approved optional
details/attachments. Validate client and server side. Current source
specifies `.doc`, `.docx`, `.pdf` up to 20 MB; confirm per-file vs total
request. Check extension, MIME and file signature where feasible.
Persist durably before success. Notify `edtechpublications@gmail.com`
and acknowledge author after acceptance. Email failures must be
observable/retryable without duplicate submissions. Add idempotency,
privacy notice, and consent.

### FR-05 Contact form

Validate required fields/lengths, support approved topics (Books,
Publishing, Chapters, Order), persist or reliably deliver messages,
rate-limit and mitigate spam, and show success only after acceptance. Do
not log full message bodies by default.

### FR-06 Agreement/downloads

Serve approved agreement PDF from a stable URL. Do not invent or modify
legal terms. Keep submission instructions accurate.

### FR-07 Content management

Identify current content source. Establish one canonical validated
content source (database or typed files). Use schema validation and
documented workflows. CMS/admin UI is out of scope unless already
present or approved.

### FR-08 SEO

Unique title/description, canonical URLs, sitemap, robots, social
metadata, and valid Organization/Book/BreadcrumbList structured data
where appropriate. No structured data for unverified information. Render
important catalogue/book content server-side where supported. Preserve
meaningful alt text and handle redirects/404s correctly.

### FR-09 Accessibility/localization

Target WCAG 2.2 AA. Keyboard operation for navigation, tabs, dialogs,
filters, forms, visible focus, semantic headings, labels, error
summaries, status announcements, reduced-motion support. English
interface initially; represent Hindi/bilingual book metadata. Confirm
whether full UI localization is in scope.

## 7. Design requirements

The active approved HTML screen theme is authoritative unless the
repository/stakeholder confirms otherwise: - Navy `#011633`, blue
`#1F58C4`, background `#F9F9FF`, white `#FFFFFF`, pale-blue surfaces
`#F0F3FF`, `#E6EEFF`. - Newsreader for editorial/book headings; Manrope
for UI/body/metadata. - Scholarly editorial aesthetic, restrained
borders/shadows, consistent spacing and book-cover ratios. - Preserve
approved tokens, responsive header, sticky filters where appropriate,
and dark navy footer. - Use actual approved circular seal logo. - Do not
mix conflicting palette from older source assets silently. Record
conflicts and ask for a decision.

## 8. Non-functional requirements

-   Performance: baseline first; target Lighthouse Performance ≥90 on
    representative pages under a documented profile. Aim for good Core
    Web Vitals at the 75th percentile when real-user data exists.
-   Reliability: no silent loss of submissions; durable persistence and
    observable operations.
-   Security: server-side validation, safe uploads, CSRF protections
    where relevant, rate limits, secure headers, least-privilege
    secrets, dependency scanning.
-   Maintainability: typed domain models, isolated data access, small
    components, docs, automated tests.
-   Compatibility: current stable major browsers; confirm matrix during
    discovery.
-   Observability: structured logs, request IDs, redacted PII/secrets,
    health checks as appropriate.
-   Backup/restore documented and tested for persistent data.

## 9. Acceptance criteria

A feature is done when behavior matches requirements and approved
content; it works at 320, 390, 768, 1024, 1280, and 1440 px without
unintended horizontal overflow; risk-appropriate tests exist;
accessibility and error/success states work;
lint/typecheck/tests/build/security checks pass; no fake data/dead
links/console errors/broken assets remain; docs are updated; and the
completion report states verification and residual risks.

## 10. Delivery phases

1.  **Repository/content audit:** inspect
    stack/routes/assets/tests/deployment; map screens; flag placeholder
    links, unverified metadata, missing assets, and broken interactions.
2.  **Foundation:** shared layout, design tokens, accessible
    navigation/footer, content schema, errors, lint/type/test/build/CI.
3.  **Public pages/catalogue:** home, books, subjects, details, about,
    services, publishing process, chapters, contact/FAQ/legal;
    search/filter/sort/SEO.
4.  **Forms:** secure proposal/contact persistence, file handling, mail,
    anti-abuse and monitoring.
5.  **Hardening:** accessibility, browser/device QA, performance,
    security, backup/restore, deployment runbook, smoke tests, rollback.

## 11. Open decisions --- do not guess

-   Existing framework, hosting, database, deployment pipeline?
-   Who updates content; is CMS/admin needed?
-   Is supplied catalogue authoritative for ISBN, price, availability,
    and dates?
-   Approved order flow: enquiry/email, pro forma invoice, or checkout?
-   Mail provider/sender domain and SPF/DKIM/DMARC status?
-   Upload storage, retention, access, malware scanning?
-   Are covers, sample PDFs, agreement, policies, and real seal logo
    available/approved?
-   Approved legal/privacy/shipping/returns copy?
-   Are author credentials, DOIs, prices, statistics in sample HTML
    verified or illustrative?
-   English-only UI or full Hindi localization?
-   Analytics/consent approach?
-   Required availability, RPO/RTO and incident owner?

## 12. Risks

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Sample HTML contains unverified     Reconcile with authoritative
  ISBNs, DOI, credentials, prices or  catalogue before publishing.
  statistics                          

  False success when                  Persist first; separate acceptance
  persistence/email fails             from notification delivery.

  Upload malware/privacy exposure     Restrict/inspect uploads, private
                                      storage, least privilege, retention
                                      policy.

  Search/filter inconsistency         One canonical filter model and URL
                                      state; test combinations.

  Responsive breakage                 Test intermediate widths, not only
                                      desktop/mobile.

  Conflicting design references       Record approved tokens in decision
                                      log; do not blend themes.

  Overengineering                     Require repository audit and
                                      incremental verification before new
                                      infrastructure.
  -----------------------------------------------------------------------

## 13. Source discipline

The supplied content blueprint defines intended pages, form fields,
catalogue shape, and business contacts. Current approved HTML defines
active visual direction and screen-specific behavior, subject to
verification. Neither proves a business fact, price, DOI, credential, or
legal statement. If sources conflict, document the conflict and request
a decision rather than inventing a resolution.
