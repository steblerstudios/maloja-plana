# Next Claude Code Task

## Current state
- Branch: dev
- Working tree should be clean
- Build passes
- Dev server works locally
- Temporary Claude handoff files are archived in docs/archive/claude-handoffs/

## Goal
Implement the next safest product-moving slice:
Calm guided start / first-use guide.

## Scope
Add a calm guided start card for new or low-progress users.

Requirements:
- Show on dashboard only.
- Must be calm, non-gamified, non-urgent.
- Should help users understand what to do first.
- Suggest 3 gentle first actions:
  1. Complete basic information
  2. Add important documents
  3. Review emergency information
- Hide or reduce emphasis once meaningful progress exists.
- No backend.
- No cloud.
- No AI/chatbot.
- No data migration.
- No new dependencies.
- No route changes.
- All text through i18n.

## Files likely involved
- src/Dashboard.jsx
- src/i18n/en.js
- src/i18n/de.js
- src/i18n/fr.js
- src/i18n/it.js

## Do not touch
- package.json
- package-lock.json
- persistence/localStorage/IndexedDB logic
- migration/version logic
- Swiss legal/canton logic

## After implementation
- run npm run build
- manually check mobile width around 375px
- commit:
  feat: add calm guided start card
- push dev

