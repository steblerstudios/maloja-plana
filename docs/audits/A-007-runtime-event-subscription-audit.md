# A-007: Runtime Event Subscription Audit

**Date:** 2026-05-17
**Scope:** Docs-only — no code changes
**Status:** Complete

## Summary

Audit of which runtime events have active subscribers vs. events that are only published (fire-and-forget for audit trail).

## Current Runtime Events

| Event | Publisher | Subscriber | Consumed? |
|-------|-----------|------------|-----------|
| `BACKUP_EXPORTED` | `src/ZipExport.jsx:57` | `src/ZipExport.jsx:181` → `sessionBackupCount` state | Yes |
| `DOCUMENT_UPLOADED` | `src/ChapterView.jsx:331` | — | No |
| `DOCUMENT_DELETED` | `src/main.jsx:230` | — | No |
| `DATA_PERSISTED` | `src/main.jsx:184` | — | No |

## Subscription Mechanism

- Single subscription point: `ZipExport.jsx` useEffect (lines 175–183)
- Pattern: subscribe in useEffect, unsubscribe in cleanup
- Filters by `event.eventType === 'BACKUP_EXPORTED'`
- Updates local component state (`sessionBackupCount`)

## Events Without Subscribers

3 of 4 events (`DOCUMENT_UPLOADED`, `DOCUMENT_DELETED`, `DATA_PERSISTED`) are published but have no active subscriber. They exist in the EventBus internal store and are retrievable via `getEvents()`.

### Is this a problem?

**No.** These events serve as audit trail entries. They are:
- Queryable via `runtimeEventBus.getEvents()`
- Available for future UI feedback or governance features
- Not causing memory pressure in typical session lengths

### Potential concern

The EventBus `events` array grows unbounded during a session. For typical usage (handful of documents per session), this is negligible. If sessions become long-lived or high-frequency, a retention policy may be needed.

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Unbounded event array in long sessions | Low | Monitor; add cap if needed |
| Unsubscribed events suggest missing UI feedback | None (by design) | Subscribers will be added per ticket |
| Shape inconsistency (`eventType` vs potential `type`) | Accepted | Per A-005e decision |

## Recommended Next Steps

1. **A-008: UI feedback for DOCUMENT_UPLOADED** — small additive subscriber (toast or status indicator)
2. **A-009: EventBus retention policy** — optional cap on stored events (low priority)
3. **A-010: UI feedback for DATA_PERSISTED** — subtle save confirmation

All future subscribers should follow the ZipExport pattern (useEffect + cleanup).
