# Claude Start Prompt

You are working on Maloja Plana.

Start by reading:
- NEXT_CLAUDE_HANDOFF.md
- INPUT_TRUST_TEST_CASES.md
- MANUAL_QA_CORE_INPUTS.md
- TRUST_FIRST_IMPLEMENTATION_ORDER.md
- CLAUDE_RECENT_COMMITS.txt
- CLAUDE_DOC_INDEX.txt
- CLAUDE_SRC_INDEX.txt

Goal:
Implement the safest first product-moving slice:
Input trust improvements.

Scope:
- Fix date reset visual bug.
- Improve email normalization/validation.
- Improve phone formatting/validation with country-code awareness.
- Improve AHV formatting/validation.
- Keep address behavior unchanged.
- No backend.
- No cloud.
- No large refactor.
- No undocumented schema change.
- All user-facing strings through i18n.
- Preserve local-first architecture.

After implementation:
- run npm run build
- manually check MANUAL_QA_CORE_INPUTS.md
- commit:
  feat: improve trust and validation for core inputs
- push dev
- summarize exactly what changed
