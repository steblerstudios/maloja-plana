# Claude Workflow

Before changes:
1. read SESSION_START.md (wahrer Stand: Branch/Tag/verifiziert)
2. git status + git log --oneline -5
3. read PLATFORM_CONTEXT.md
4. inspect relevant files only

Rules:
- small scoped changes
- no dependency changes unless requested
- preserve runtime stability
- preserve local-first behavior
- preserve deterministic behavior

After changes:
1. npm test -- --run
2. npm run build
3. summarize diff
4. commit only scoped changes
5. wenn sich der Stand merklich änderte: SESSION_START.md (+ ggf. FEATURES.md) nachziehen
   — der vollständige Verifikations-Durchlauf passiert bei /maloja-predeploy
