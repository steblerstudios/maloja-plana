# Next Claude Handoff

## Current branch
dev

## Current status
Working tree should be clean.

## Important
A lot of documentation has been added. Do not create more docs unless needed.

The next work must move the product toward a stronger pre-store foundation.

## Latest user feedback to prioritize

The app is not yet ready for store release. The current foundation works, but several core areas need more trust, polish, and Swiss-life completeness.

### Input trust issues
- Full name should be split into first name and last name.
- Full name should still exist as a derived/display value if needed.
- Name should ideally be prefilled after onboarding/registration where possible.
- Phone field should support country codes.
- Phone number should auto-format cleanly based on country code.
- AHV number should auto-format and validate.
- Email should normalize and validate.
- Address sync works better than expected and should be preserved.
- Date reset bug: when clearing/resetting a date field, the previous selected date remains visually visible.

### Insurance gaps
- Hausratversicherung missing or too weak.
- Privathaftpflicht missing or too weak.
- Reiseversicherung missing.
- Cyberversicherung missing.
- Auto insurance / mobility insurance missing.
- General mobility section is missing.
- Krankenkasse/KVG section is incomplete.
- KVG coverage catalogue / BAG orientation is missing.
- Deductible / Selbstbehalt / Franchise support is incomplete.
- Need clearer explanation of what basic insurance covers and what it does not.

### Budget and finance gaps
- Finance section needs careful review and refinement.
- Debt and Betreibungen should affect budget.
- Budget needs to reflect monthly pressure better.
- Existing feedback about budget from mother is not yet integrated cleanly.
- Budget must feel supportive, not judgmental.

### Education / work gaps
- Education and career section is still behind the desired direction.
- Previous Coople-inspired ideas are not yet integrated.
- Work, skills, temporary work, certificates, applications and employment readiness need future attention.

### Swiss domain gaps
- Canton-specific logic must eventually affect:
  - premium subsidy
  - rent support
  - Sozialhilfe
  - taxes
  - residence/weekly resident situations
- Wochenaufenthalter logic must be visible where relevant.
- AHV / BVG / PK contributions and social assistance interactions need more careful modeling later.

## Task

Do NOT implement everything.

First perform a pre-store foundation audit.

Read:
- NEXT_CLAUDE_HANDOFF.md
- ROADMAP_CHECKPOINT.md
- PROJECT_STATUS.md
- docs/research/live-product-feedback.md
- docs/research/pre-store-critical-issues.md if it exists
- docs/research/reality-walkthrough-notes.md
- docs/product/*
- docs/security/*
- docs/data-model/*
- docs/spinnennetz/*
- src/config/constants.js
- src/ChapterView.jsx
- src/BudgetSync.jsx
- src/budgetSync.js
- src/SchuldenManager.jsx
- src/PremiumSubsidy.jsx
- src/SozialhilfeView.jsx
- src/KKScanner.jsx
- src/i18n/en.js
- src/i18n/de.js
- src/i18n/fr.js
- src/i18n/it.js

Then produce a ranked implementation plan with slices.

Required output:
1. P0 issues before store.
2. P1 issues after P0.
3. Which items are small safe slices.
4. Which items require data migration.
5. Which items require canton/legal research.
6. Which items should not be implemented yet.
7. Recommended next single implementation slice.

Important:
- preserve local-first architecture
- no backend
- no cloud
- no AI/chatbot
- no BAG API integration yet
- no legal certainty claims
- no large refactor
- no feature explosion
- no undocumented data model changes

If implementing a slice, prefer the safest high-trust slice:
Input trust improvements.

Candidate first slice:
- date reset visual bug
- phone/email/AHV formatting and validation polish
- no schema migration if possible
- all text via i18n
- build and test

After work:
- run npm run build
- commit with a precise message
- push dev

After
- TRUST_FIRST_IMPLEMENTATION_ORDER.md
- docs/product/field-inventory.md
- docs/data-model/field-trust-matrix.md
- docs/architecture/derived-state-map.md
- docs/architecture/definition-of-done.md
- docs/ux/ux-severity-map.md
- docs/research/top-10-user-confusions.md
- docs/research/reality-coverage-audit.md

