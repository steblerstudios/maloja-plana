# A-009: EventBus Retention Policy Audit

**Date:** 2026-05-17
**Scope:** Docs/decision-only — no code changes
**Status:** Complete

## Summary

The RuntimeEventBus is append-only with no retention policy. This audit evaluates whether unbounded growth is acceptable in the current in-memory POC and defines criteria for when a policy becomes necessary.

## Current Implementation

```
src/runtime/events/event-bus.ts
```

- `events: AuditEvent[]` — append-only array
- `publish()` — pushes to array + notifies listeners
- `getEvents()` — returns shallow copy of full array
- `clear()` — empties the array (never called in production code)
- No max length, no TTL, no eviction, no persistence

## Usage in Production Code

| Method | Location | Purpose |
|--------|----------|---------|
| `getEvents()` | `src/ZipExport.jsx:172` | Count `BACKUP_EXPORTED` events for session counter |
| `clear()` | — | Not used in production (only in tests) |

## Growth Analysis

### Event frequency per session (realistic usage)

| Event | Typical frequency | Trigger |
|-------|-------------------|---------|
| `BACKUP_EXPORTED` | 1–3 per session | Manual export |
| `DOCUMENT_UPLOADED` | 5–20 per session | User uploads |
| `DOCUMENT_DELETED` | 0–5 per session | Manual delete |
| `DATA_PERSISTED` | 10–50 per session | Auto-save cycles |

**Estimated total:** 15–80 events per typical session.

### Memory footprint

Each AuditEvent is a small object (~200–500 bytes). At 80 events per session: ~40 KB. At 1000 events (extreme): ~500 KB.

**Verdict: negligible for in-memory POC.**

### Reset behavior

The EventBus resets on page reload (no persistence). A session is bounded by the browser tab lifetime.

## Decision

**Status: Akzeptiert — keine Retention Policy nötig im aktuellen POC.**

Begründung:
1. Event-Volumen pro Session ist minimal (zweistellig)
2. Memory-Footprint ist vernachlässigbar (<100 KB worst case)
3. Session-Reset bei Page Reload ist implizite Retention
4. `clear()` existiert als Escape-Hatch, falls nötig
5. Keine Persistence = kein Disk-Wachstum

## Trigger-Kriterien für spätere Retention Policy

Eine Retention Policy wird nötig, wenn eines dieser Kriterien eintritt:

| Trigger | Warum |
|---------|-------|
| Persistence wird eingeführt | Events könnten über Sessions hinweg wachsen |
| High-frequency Events (>100/min) | z.B. keystroke-level tracking |
| EventBus wird für externe Systeme geöffnet | Unbounded external input |
| Long-lived sessions ohne Reload | SPA bleibt tagelang offen |
| Events werden für Reporting aggregiert | Alte Events müssen evicted werden |

## Mögliche spätere Strategien (nicht implementieren)

| Strategie | Eignung | Komplexität |
|-----------|---------|-------------|
| **Max events (ring buffer)** | Gut für in-memory cap | Niedrig |
| **TTL per event** | Gut für zeitbasierte Relevanz | Mittel |
| **Session-only (current)** | Bereits implizit aktiv | Keine |
| **Per-category cap** | Gut wenn ein Event-Typ dominiert | Mittel |
| **Persistence handoff** | Export vor Eviction | Hoch |

Empfehlung für spätere Implementierung: **Max events (ring buffer, z.B. 500)** — einfachste Lösung, die alle realistischen Szenarien abdeckt.

## Risks

| Risk | Severity | Status |
|------|----------|--------|
| Unbounded array growth | Negligible | Akzeptiert für POC |
| `getEvents()` returns full copy | Negligible at current scale | Monitor |
| No `clear()` in production | Non-issue (reload = reset) | By design |
