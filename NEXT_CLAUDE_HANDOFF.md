# Next Claude Handoff

## Current branch
dev

## Current status
Working tree should be clean.

## Recent documentation work
Added foundations for:
- documentation index
- architecture decision records
- life events
- legal / non-legal-advice boundary
- data model entities
- data model relationships
- migration principles
- trust boundaries
- future engines
- never-export data
- calm UX principles
- real-life test cases
- reality walkthrough audit
- Romansh preparation
- canton differences
- Spinnennetz / Life Web

## Important instruction
Do not create more documentation files now.

Next work should move the product forward.

## Recommended next implementation slice
Chapter Welcome States.

Scope:
- Add calm intro text for each main chapter.
- Add warm empty-state card when 0 fields are filled.
- Keep fields visible below card.
- Documents tab unaffected.
- No data model changes.
- No routing changes.
- No dashboard redesign.
- No progressive disclosure.

Files likely involved:
- src/ChapterView.jsx
- src/i18n/en.js
- src/i18n/de.js
- src/i18n/fr.js
- src/i18n/it.js

Before implementation:
- check git status
- inspect changed files
- run npm run build if unsure

After implementation:
- run npm run build
- manually test empty chapter, partially filled chapter, documents tab, mobile if possible
- commit:
  feat: add calm chapter welcome states
- push dev

## Do not do yet
- no household model
- no Swiss rule engine
- no backend
- no cloud sync
- no AI/chatbot
- no feature explosion
