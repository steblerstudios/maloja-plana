# Claude Workflow

Before changes:
1. git status
2. read PLATFORM_CONTEXT.md
3. inspect relevant files only

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
