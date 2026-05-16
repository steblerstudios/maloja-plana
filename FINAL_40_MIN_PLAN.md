# Final 40-Minute Plan Before Claude

## Goal
Prepare Claude to implement the safest first product slice without confusion.

## Current repo state
- Branch: dev
- Working tree should be clean
- Build passes
- No backend
- No cloud
- No large refactor
- Local-first must stay intact

## First implementation slice
Input trust improvements.

Order:
1. Fix date reset visual bug.
2. Add/verify email normalization and validation.
3. Add/verify phone formatting with country code support.
4. Add/verify AHV formatting and validation.
5. Keep all user-facing text in i18n.
6. Avoid schema migration unless absolutely necessary.

## Files to inspect first
- src/ChapterView.jsx
- src/config/constants.js
- src/i18n/en.js
- src/i18n/de.js
- src/i18n/fr.js
- src/i18n/it.js
- INPUT_TRUST_TEST_CASES.md
- MANUAL_QA_CORE_INPUTS.md
- CURRENT_IMPLEMENTATION_PRIORITY.md
- RELEASE_BLOCKERS.md

## Must not do
- no household model
- no Swiss rule engine
- no backend
- no cloud sync
- no BAG API
- no legal certainty claims
- no major UI redesign
- no undocumented data model changes

## After implementation
- run npm run build
- manually test core input cases
- commit:
  feat: improve trust and validation for core inputs
- push dev
