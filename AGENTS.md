# AGENTS.md --- EdTech Publications

## Mission

Build the production website incrementally. `PRD.md` defines
behavior; `TRD.md` defines engineering constraints. `ready_design/` is the user-designated primary visual reference. HTML screens
are references, not proof that every interaction or datum is correct.

The working plan is `docs/IMPLEMENTATION_PLAN.md`; the current kickoff foundation
plan is `docs/FOUNDATION_PLAN.md`; the shell slice is `docs/SHARED_SHELL_PLAN.md`. Root `IMPLEMENTATION_PLAN.md` is the original
phase outline. Use Node from `.nvmrc`, npm and `package-lock.json`.

## First actions

1.  Read PRD, TRD, implementation plan and existing project
    instructions.
2.  Inspect repo, lockfile, framework, routes, assets, tests,
    environment config, deployment and `git status`.
3.  Run baseline checks before modifying code; preserve uncommitted
    work.
4.  Map current screens/routes and make a file-level plan.
5.  If repository reality conflicts with docs, document it; ask before
    consequential product, privacy, payment or security decisions.

## Non-negotiable rules

- Do not replace stack/add major dependencies without evidence and
  written rationale.
- Do not invent book titles, ISBNs, DOIs, authors, prices, statistics,
  awards, availability, testimonials, policies or claims.
- Maintain one source of truth for book metadata and validate content.
- Preserve approved EdTech theme: navy `#011633`, blue `#1F58C4`,
  pale-blue/white surfaces, Newsreader headings, Manrope UI
  typography, actual circular seal logo.
- Preserve responsive behavior, functional navigation, populated dark
  navy footer and working interactions.
- Avoid `href="#"`, fake controls, placeholder success messages, dead
  buttons and console errors.
- Never expose secrets, upload paths, private submissions or PII in
  client code/logs.
- Never claim a check, deployment, email or upload succeeded unless
  verified.

## Architecture

Follow existing framework conventions. Separate UI, domain rules, data
access and external adapters. Prefer existing infrastructure and the
simplest architecture that satisfies requirements. No microservices,
queue, CMS, search engine, payment provider or database migration
without justification. Validate all trust boundaries.

## Security

Server-side validation; safe private file storage; upload
size/type/signature checks; rate limits; secrets only in
environment/managed store; redact PII; persist proposal before success;
observable/retryable email failures. No online payments unless
explicitly approved.

## Quality gates

Run relevant existing lint, typecheck, tests, content checks and build.
Add regression tests. Check responsive and accessibility behavior for UI
changes. State exact results and explain any checks that could not run.

Run `npm run reference:compile` after reference changes; generated ready trees/theme
must never be hand-edited. Read `docs/READY_DESIGN_WORKFLOW.md` for preview content
and sanitization boundaries.

Run `npm run check`, then `npm run test:e2e` after installing Chromium. Run
`npm audit --audit-level=high` with registry access. Preserve archived designs;
checks for production content must not imply their sample data is approved.

## Completion report

List files changed, behavior delivered, commands/tests and outcomes,
residual risks and next step. Update docs when routes, architecture,
contracts, setup or operations change.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
