# Claude Final Start Here

This overrides older broad handoff docs.

Current task:
Implement input trust improvements only.

Read first:
1. CLAUDE_ONE_SCREEN_START.md
2. CLAUDE_INPUT_FIELD_LOCATIONS.txt
3. CLAUDE_CHAPTERVIEW_INPUT_FLOW.txt
4. DATE_RESET_REPRO.md
5. SUCCESS_CRITERIA.md
6. SAFE_IMPLEMENTATION_RULES.md

Then inspect code:
1. src/ChapterView.jsx
2. src/validationUtils.js
3. src/config/constants.js
4. src/i18n/en.js
5. src/i18n/de.js
6. src/i18n/fr.js
7. src/i18n/it.js

Do not read:
- docs/research/*
- docs/architecture/*
- docs/spinnennetz/*
- ROADMAP_CHECKPOINT.md
- old broad handoff files

Implement only:
- date reset visual bug
- email normalization/validation
- phone formatting/validation
- AHV formatting/validation

Do not:
- add dependencies
- migrate data
- change localStorage keys
- redesign UI
- change routes
- add backend/cloud/AI

After:
- npm run build
- manual spot check
- git commit -m "feat: improve trust and validation for core inputs"
- git push
