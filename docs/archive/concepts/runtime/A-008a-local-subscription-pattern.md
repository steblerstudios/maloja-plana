# A-008a: Local Runtime UI Subscription Pattern

**Date:** 2026-05-17
**Scope:** Docs/pattern-only — no code changes
**Status:** Complete

## Current Subscription Status

| Component | Event | Purpose | Since |
|-----------|-------|---------|-------|
| `src/ZipExport.jsx` | `BACKUP_EXPORTED` | Session backup counter | A-005b |
| `src/ChapterView.jsx` | `DOCUMENT_UPLOADED` | Upload success feedback (3s fade) | A-008 |

**Unsubscribed events (by design):**
- `DOCUMENT_DELETED` — audit trail only
- `DATA_PERSISTED` — audit trail only

## Established Pattern

```
useEffect(() => {
  let timer;
  const listener = (event) => {
    if (event.eventType === 'TARGET_EVENT') {
      // update local state
      timer = setTimeout(() => /* reset */, duration);
    }
  };
  runtimeEventBus.subscribe(listener);
  return () => {
    runtimeEventBus.unsubscribe(listener);
    if (timer) clearTimeout(timer);
  };
}, []);
```

**Characteristics:**
- Import `runtimeEventBus` directly from `./runtime/singleton.ts`
- Subscribe in `useEffect`, unsubscribe in cleanup
- Filter by `event.eventType` inside listener
- Manage local component state only
- Handle timeouts with cleanup

## Why Local Subscriptions (Current Decision)

| Reason | Detail |
|--------|--------|
| Simplicity | No abstraction layer between EventBus and component |
| Isolation | Each subscriber is independent, easy to revert |
| No coordination needed | Components don't need to know about each other |
| No React overhead | No Context re-renders, no provider tree |
| Debugging | Subscription logic is visible where it's used |
| Matches POC stage | We have 2 subscribers — premature to abstract |

## What Is Deliberately NOT Done

| Omission | Why |
|----------|-----|
| No `useRuntimeEvent` hook | Premature abstraction for 2 use cases |
| No React Context provider | Would couple all consumers to provider lifecycle |
| No global notification system | Would impose UI policy on all events |
| No event-to-UI mapping config | Would add indirection without current benefit |
| No shared toast/snackbar | Would require global positioning, z-index, queue |

## Risks / Technical Debt

| Risk | Severity | When it matters |
|------|----------|-----------------|
| Duplicated subscription boilerplate | Low | Acceptable up to ~5 subscribers |
| No central visibility of active subscriptions | Low | Audit docs cover this |
| Inconsistent feedback styles across components | Low | Only 1 visual feedback so far |
| Timer cleanup pattern easy to forget | Low | Reviewable in PRs |

## Trigger Criteria for Globalization

A shared abstraction (hook, context, or notification system) becomes justified when:

| Trigger | Threshold |
|---------|-----------|
| Subscriber count | >5 components subscribing to events |
| Shared behavior | 3+ subscribers need identical feedback (toast, animation) |
| Cross-component coordination | Events need to reach components that can't import singleton |
| Testing complexity | Mocking singleton becomes painful in >3 test files |
| Consistency requirement | Design system mandates uniform notification appearance |

**Until these triggers are met: stay local.**

## Summary

The local subscription pattern works well for the current POC scale. It is simple, isolated, testable, and easily reversible. The cost of staying local is minimal boilerplate duplication. The cost of premature globalization would be unnecessary complexity, coupling, and constraints on future decisions.
