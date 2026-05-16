# Repo readiness checkpoint — 2026-05-16

## Current state

- Branch: `dev` (2 commits ahead of `main`)
- Working tree: clean
- Tests: 8 files, 14 tests — all pass
- Build: clean (462 KB gzip 125 KB)
- Deployment: Vercel config present, dist gitignored, no .env files committed
- No secrets or credentials in repo

## Completed today

1. Full i18n completeness audit across all 4 locales (EN/DE/FR/IT)
2. Confirmed structural alignment: 743 keys per locale, zero drift
3. Fixed `CalendarReminders.jsx` — wrong translation key + hardcoded English fallback
4. Fixed `KKScanner.jsx` — hardcoded option labels now use i18n
5. Dark mode QA pass (prior session) — low-contrast zero-progress labels fixed

## Remaining risks / gaps

- `dev` is 2 commits ahead of `main` — merge when ready to release
- Romansh file (`rm.js`) exists but is empty and not in SUPPORTED list — intentional placeholder
- Alpha disclaimer still shown to users (by design for this phase)
- SKOS calculations for households with children flagged as under revision
- KK scanner data not yet linked to saved chapter fields (known alpha limitation)
- No automated e2e tests — only unit/integration coverage

## Suggested next phase

**UX polish pass** — the i18n and dark mode layers are now clean. Next logical slice is tightening the interaction layer: form validation feedback, empty-state illustrations, and micro-copy refinement.

## Safest next 3 slices

1. **Form validation UX** — add inline validation hints (show errors on blur, not on mount) to reduce cognitive load during data entry
2. **Empty-state polish** — replace plain text empty states with subtle illustrations or icons to make first-run feel welcoming
3. **Merge dev to main** — once the above are in, cut a clean release from main with updated alpha version tag
