# Claude One-Screen Start

Read only:
- IMPLEMENT_NOW_SCOPE.md
- SUCCESS_CRITERIA.md
- SAFE_IMPLEMENTATION_RULES.md
- DATE_RESET_REPRO.md

Then inspect:
- src/ChapterView.jsx
- src/config/constants.js
- src/i18n/en.js
- src/i18n/de.js
- src/i18n/fr.js
- src/i18n/it.js

Implement only:
- date reset visual fix
- email normalization
- phone formatting
- AHV formatting/validation

Do not read broad docs.
Do not refactor.
Do not migrate data.
Do not add dependencies.

After:
npm run build

Commit:
feat: improve trust and validation for core inputs
