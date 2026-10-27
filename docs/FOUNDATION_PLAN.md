# Milestone 1 — Repository audit and development foundation

**Goal:** A reproducible, tested development app without importing unverified business content.
**Authority:** Current kickoff, root PRD/TRD and AGENTS; decision 0001.
**Execution:** Inline in the current directory; preserve the supplied handoff.

## File-level plan

- [x] Inspect files, source routes, runtime, Git, specs and earlier audit. Record absent baseline tooling.
- [x] Add `package.json`, npm lockfile, `.nvmrc`, strict `tsconfig.json`,
      `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, ESLint/Prettier configs
      and ignore files. Pin compatible dependencies; use no remote fonts at build time.
- [x] Add `src/app/{layout,page,not-found,globals}` as an explicitly unfinished
      development entry, with robots metadata preventing indexing.
- [x] Test the development entry and 404 with Vitest/Testing Library and Playwright.
      Prove regression rejection before considering the checks established.
- [x] Add a scoped content guard for production app files (never gate on archived
      references); reject dead hash links and placeholder copy. Test rejected fixtures.
- [x] Add `.github/workflows/ci.yml`: locked install, lint, typecheck, unit,
      content, format, build, browser smoke and dependency audit. No deployment.
- [x] Fix AGENTS specification paths; add README, environment example, route map,
      setup/architecture decisions, and current verification/remaining risks report.
- [x] Run locked installation and all available checks; compare original reference hashes.

## Routes

`src/app/page.tsx` maps `/` to the development entry only. `not-found.tsx`
handles unknown routes. No catalogue/subject/book/public editorial/API routes
are implemented. The four reference-to-target mappings remain in the audit.

## Verification focus

Reject dead production links and example placeholder content while permitting
archived designs; test empty/nonexistent scan roots; verify 404 HTTP behavior,
no-index metadata, visible entry/keyboard link and overflow at all six PRD widths.
No external integration success or production readiness is implied by these checks.
