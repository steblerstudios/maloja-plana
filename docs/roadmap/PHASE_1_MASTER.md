# Maloja Plana — Phase 1 Master Document

> **Governance Runtime Implementation — Complete Audit-Ready Specification**

| Meta | Value |
|------|-------|
| **Version** | 1.0.0 |
| **Date** | 2026-05-17 |
| **Author** | Sophie Stebler / Stebler Studios |
| **Baseline Commit** | `89d9f32` (branch: `dev`) |
| **Build Baseline** | 126.08 KB gzip, 14/14 tests, 75 modules |
| **Duration** | 6–8 weeks |
| **Branch Strategy** | `feature/<milestone>-<module>` → `dev` → `main` |
| **Constraint** | Zero new runtime dependencies, offline-only, < 200 KB gzip |

> Legend: ⚡ = Critical Path Blocker | 🎯 = UX/Observability/Governance | 🔗 = High Context Dependency

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Milestone Map](#3-milestone-map)
4. [Critical Path & Parallel Tracks](#4-critical-path--parallel-tracks)
5. [Dependency Matrix](#5-dependency-matrix)
6. [Complete Task Specification](#6-complete-task-specification)
7. [ISO/Audit Evidence Framework](#7-isoaudit-evidence-framework)
8. [Cross-Cutting Context](#8-cross-cutting-context)
9. [Agent Orchestration Model](#9-agent-orchestration-model)
10. [Success Criteria & Release Gate](#10-success-criteria--release-gate)
11. [Document Cross-References](#11-document-cross-references)

---

## 1. Executive Summary

Phase 1 transforms Maloja Plana from a personal life organizer into a **governance-native runtime** with:

- **Structured source ingestion** — local file import with preview and provenance (SHA-256)
- **Configurable validation** — declarative rule engine with traceable evidence output
- **Human approval gates** — explicit confirmation before all state-changing operations
- **Local audit trail** — append-only log for all state transitions, filterable and exportable
- **Module registry** — runtime self-description with health indicators

All offline. No server. No external dependencies. No autonomous automation.

---

## 2. Architecture Overview

### Runtime Stack (Phase 1)

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (React)                       │
│  Dashboard │ ChapterView │ ImportPreview │ ApprovalGate  │
│  AuditViewer │ SystemStatus │ SystemView                 │
├─────────────────────────────────────────────────────────┤
│                  Runtime Layer (new)                      │
│  Event Bus │ State Machine │ Module Registry              │
│  Validation Engine │ Ingestion Pipeline │ Approval Gates │
│  Audit Logger                                            │
├─────────────────────────────────────────────────────────┤
│                 Persistence Layer                         │
│  localStorage (or5_*) │ IndexedDB (documents, backups)   │
│  IndexedDB (maloja-plana-audit) ← NEW                    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow: Import → Validate → Approve → Persist → Audit

```
User selects file
  → READ (FileReader → string)
    → PARSE (JSON/CSV → structured data)
      → MAP (source fields → chapter fields)
        → VALIDATE (rule evaluator → evidence)
          → PREVIEW (diff: old vs new values)
            → APPROVE (human gate, Promise-based)
              → PERSIST (localStorage via storage.set())
                → AUDIT (log entry to IndexedDB)
```

### Persistence Map

| Store | Type | Purpose | Modified in Phase 1? |
|-------|------|---------|---------------------|
| `ordnung-ruhe-documents` | IndexedDB | Document blobs + metadata | ❌ No |
| `ordnung-ruhe-backups` | IndexedDB | Auto-backup snapshots | ❌ No (consumed only) |
| `maloja-plana-audit` | IndexedDB | Audit log + validation evidence | ✅ **NEW** |
| `or5_<chapter>` | localStorage | Chapter field data | ❌ Schema unchanged |
| `or5_settings` | localStorage | App settings | Extended (retention) |

---

## 3. Milestone Map

| Milestone | Name | Week | Tasks | Focus |
|-----------|------|------|-------|-------|
| **M1** | Runtime Foundation | 1–2 | 5 tasks | Event bus, state machine, audit log, registry, health dot |
| **M2** | Validation Engine | 2–3 | 4 tasks | Rule schema, evaluator, evidence, migration |
| **M3** | Source Ingestion | 3–5 | 4 tasks | File parser, schema mapper, pipeline, import UI |
| **M4** | Human Approval Gates | 5–6 | 3 tasks | Gate component, registry, wiring |
| **M5** | Audit & Observability | 6–7 | 5 tasks | Viewer, system status, export, retention, navigation |
| **M6** | Integration & Polish | 7–8 | 5 tasks | E2E tests, mobile QA, dark mode, docs, performance |

**Total**: 26 tasks, ~35 new i18n keys per locale, 5 new components, 1 new IndexedDB store

---

## 4. Critical Path & Parallel Tracks

### Critical Path (⚡ — Sequential Blockers)

```
Week 1:  M1.1 → M1.2 → M1.3 → M1.4
Week 2:  M2.1 → M2.2 → M2.3
Week 3:  M2.4 + M3.1 → M3.2
Week 4:  M3.3 + M4.1 → M4.2
Week 5:  M3.4 + M4.3
Week 6:  M5.1 → M5.5
Week 7:  M6.1 → M6.2
Week 8:  M6.5 → Release
```

### Parallel Tracks (Non-Blocking)

| Track | Tasks | Can start after | Runs parallel to |
|-------|-------|-----------------|------------------|
| **A** — UX Indicator | M1.5 | M1.4 | M2 |
| **B** — Gate UI | M4.1 | M1.1 | M2 + M3 |
| **C** — Parser | M3.1 → M3.2 | M1.1 | M2 |
| **D** — Observability | M5.1, M5.2, M5.4 | M1.3 | M4 |
| **E** — Polish | M6.2, M6.3, M6.4 | All UI done | M6.1, M6.5 |

### Gantt Overview

```
W1  ████ M1.1─M1.4 (foundation)
W2  ██── M2.1─M2.3 (validation core)    ░░ M1.5 (parallel)
W3  █─── M2.4 (migration)               ██ M3.1─M3.2 (parser)
W4  ████ M3.3 (pipeline)                 ██ M4.1─M4.2 (gate)
W5  ██── M3.4 (import UI)               ██ M4.3 (wiring)
W6  ████ M5.1─M5.5 (observability)
W7  ████ M6.1─M6.3 (integration + QA)
W8  ██── M6.4─M6.5 (docs + perf)        → RELEASE
```

---

## 5. Dependency Matrix

| Task | Blocks | Blocked By | Context Coupling |
|------|--------|------------|-----------------|
| M1.1 | M1.2, M1.3, M1.4, M2.1, M3.1, M4.1 | — | Low |
| M1.2 | — | M1.1 | Low |
| M1.3 🔗 | M2.3, M3.3, M4.3, M5.1, M5.2, M5.4 | M1.1 | **High** — shared store |
| M1.4 | M1.5, M2.1, M4.2, M5.2 | M1.1 | Medium |
| M1.5 | — | M1.4 | Low |
| M2.1 | M2.2 | M1.1, M1.4 | Medium |
| M2.2 | M2.3, M3.3 | M2.1 | Medium |
| M2.3 🔗 | M2.4 | M2.2, M1.3 | **High** — shares audit store |
| M2.4 🔗 | — | M2.1, M2.2, M2.3 | **High** — UX regression risk |
| M3.1 | M3.2 | M1.1 | Low |
| M3.2 | M3.3 | M3.1 | Low |
| M3.3 🔗 | M3.4 | M3.1, M3.2, M2.2, M1.3 | **High** — multi-module |
| M3.4 🔗 | — | M3.3, M4.1 | **High** — UI + pipeline |
| M4.1 🔗 | M3.4, M4.3 | M1.1 | **High** — consumed cross-module |
| M4.2 | M4.3, M5.3 | M1.4 | Medium |
| M4.3 🔗 | — | M4.1, M4.2, M1.3 | **High** — wires 3+ components |
| M5.1 | M5.3, M5.5 | M1.3 | Medium |
| M5.2 | M5.5 | M1.4, M1.3 | Medium |
| M5.3 | — | M5.1, M4.2 | Low |
| M5.4 | — | M1.3 | Low |
| M5.5 | — | M5.1, M5.2 | Low |
| M6.1 🔗 | — | All M1–M5 | **High** — full integration |
| M6.2 | — | All new UI | Medium |
| M6.3 | — | All new UI | Medium |
| M6.4 | — | All modules | Low |
| M6.5 | — | All modules | Medium |

---

## 6. Complete Task Specification

### M1 — Runtime Foundation (Week 1–2)

---

#### ⚡ M1.1 — Event Bus

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/events.js`, `src/runtime/index.js` |
| **Branch** | `feature/m1-event-bus` |
| **Dependencies** | None (root of dependency tree) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational** — pure function design, synchronous dispatch, observer pattern |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create runtime directory | `mkdir -p src/runtime` |
| 2 | Implement `createEventBus()` | Returns `{ emit, on, off }`. Internal: `Map<string, Set<Function>>` |
| 3 | Define event type constants | `VALIDATION_PASS`, `VALIDATION_FAIL`, `STATE_TRANSITION`, `APPROVAL_REQUESTED`, `APPROVAL_GRANTED`, `APPROVAL_REJECTED`, `INGESTION_START`, `INGESTION_COMPLETE`, `AUDIT_ENTRY`, `MODULE_REGISTERED` |
| 4 | Implement wildcard | `on('*', handler)` — handler receives `{ type, payload, timestamp }` |
| 5 | Implement cleanup | `off(type, handler)` — removes specific handler |
| 6 | Create barrel export | `src/runtime/index.js` re-exports all runtime modules |
| 7 | Write unit tests | fire/receive, unsub, wildcard, 1000x mount/unmount leak check |

**Acceptance Criteria:**
- `npm test` passes with new tests
- Events fire synchronously (no microtask/setTimeout)
- Zero DOM coupling (no `window.addEventListener`)
- Wildcard receives `{ type, payload, timestamp }` for every emission
- After `off()`, handler count decreases

**Versioning / Persistence:**
- In-memory only — no IndexedDB, no localStorage
- Bus instance is module-scoped singleton (not on `window`)
- Debug: `if (NODE_ENV === 'test') bus._debug = { listeners }` for leak detection

**Checkpoints & Evidence:**

| CP | Verification | Debug Command |
|----|-------------|---------------|
| CP-1 | After subtask 2: `emit('TEST', {x:1})` → listener receives `{x:1}` | `console.debug('[EventBus] emit:', type, payload)` |
| CP-2 | After subtask 4: wildcard gets `{ type, payload, timestamp }` | Verify timestamp is `Date.now()` |
| CP-3 | After subtask 5: mount 100 listeners → off all → Map size = 0 | `bus._debug.listeners.size` |

**Agent Memory State:** "Event bus operational, 10 event types defined, wildcard supported, leak-free"

**ISO Evidence:** Unit test results file proves deterministic behavior. Rollback via single import point.

---

#### ⚡ M1.2 — State Machine

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/stateMachine.js` |
| **Branch** | `feature/m1-state-machine` |
| **Dependencies** | M1.1 (emits `STATE_TRANSITION`) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical** — formal state machine theory, guard predicates, transition tables |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `createStateMachine({ initial, states, eventBus })` | Config: `{ [name]: { on: { [event]: { target, guard? } } } }` |
| 2 | Fire `STATE_TRANSITION` on valid transition | Payload: `{ from, to, event, timestamp, context }` |
| 3 | Return structured error on invalid | `{ success: false, reason: 'invalid_event' \| 'guard_blocked' }` |
| 4 | Implement `getState()` + `canTransition(event)` | Query without mutating |
| 5 | Define field lifecycle | `empty → draft → validated → approved` |
| 6 | Define document lifecycle | `uploaded → validated → active → expired → archived` |
| 7 | Write unit tests | Valid/invalid transitions, guards, event emission, lifecycle coverage |

**Acceptance Criteria:**
- FSM rejects invalid transitions (structured error, never throws)
- Guards block and return `reason: 'guard_blocked'`
- `getState()` always reflects truth
- Event bus receives exactly one event per valid transition
- Both lifecycle configs fully tested

**Versioning / Persistence:**
- In-memory per instance — state derived from data
- Multiple independent instances (no global singleton)
- Debug: `machine._debugHistory = []` in test mode (last 50 transitions)

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | Emit transition → event bus receives `{ from: 'empty', to: 'draft', event: 'EDIT' }` |
| CP-2 | Attempt `empty → approved` (skip) → verify rejection |
| CP-3 | Full lifecycle walk → verify correct number of events emitted |

**Gate Condition:** Guard functions must be pure (no side effects). Context passed as argument.

**Agent Memory State:** "State machine supports 2 lifecycle configs, guard predicates are pure, transitions emit events"

---

#### ⚡🔗 M1.3 — Audit Logger

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/auditLog.js` |
| **Branch** | `feature/m1-audit-log` |
| **Dependencies** | M1.1 (wildcard subscription) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural** — append-only log design, IndexedDB transactions, cursor pagination |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create IndexedDB store | DB: `maloja-plana-audit`, v1. Store: `entries` (autoIncrement). Indexes: `by-type`, `by-timestamp` |
| 2 | Implement `logEntry({ type, actor, payload, timestamp })` | Append-only, returns Promise\<entryId\> |
| 3 | Implement `getEntries({ since?, until?, type?, limit?, offset? })` | Cursor-based, newest-first |
| 4 | Implement `getEntryCount({ type? })` | For dashboard/status display |
| 5 | Implement `initAuditLog(eventBus)` | Wildcard subscription, auto-logs all events |
| 6 | Define actor convention | `'user'` / `'system'` / `'agent:<name>'` |
| 7 | Error handling | IndexedDB write fail → `console.error`, never crash |
| 8 | Unit tests with `fake-indexeddb` | Write, read, filter, count, wildcard auto-log, failure handling |

**Acceptance Criteria:**
- Every event bus emission → audit entry
- Entries filterable by type and date range
- Count accurate
- IndexedDB errors caught gracefully
- **Existing stores (`ordnung-ruhe-documents`, `ordnung-ruhe-backups`) completely untouched**

**Versioning / Persistence:**
- **NEW IndexedDB store**: `maloja-plana-audit`, version 1
- Schema: `{ id (autoIncr), type, actor, payload, timestamp }`
- Indexes: `by-type` (non-unique), `by-timestamp` (non-unique)
- Completely separate from existing stores — no migration needed
- Retention: unbounded here (policy added M5.4)

**Checkpoints & Evidence:**

| CP | Verification | Critical Check |
|----|-------------|----------------|
| CP-1 | DevTools → Application → IndexedDB → `maloja-plana-audit` exists | Store + 2 indexes visible |
| CP-2 | Emit 3 event types → 3 entries in DB with correct types | Type index works |
| CP-3 | ⚠️ **CRITICAL** — verify `ordnung-ruhe-documents` and `ordnung-ruhe-backups` still function | Upload + backup trigger → no errors |

**Agent Memory State:** "Audit store operational at maloja-plana-audit. Actor convention: user/system/agent:<name>. Wildcard active. Existing stores verified unaffected."

**ISO Evidence:** Entry count after test suite matches expected. No phantom writes. Existing store isolation verified.

---

#### ⚡ M1.4 — Module Registry

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/registry.js` |
| **Branch** | `feature/m1-registry` |
| **Dependencies** | M1.1 (emits `MODULE_REGISTERED`) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical** — registry pattern, Map-based lookup, idempotent registration |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `createRegistry(eventBus)` | Internal Map, returns API object |
| 2 | `registerModule({ id, name, version, status })` | Stores in Map, emits `MODULE_REGISTERED` |
| 3 | `getModules()` → array of all modules | Including `registeredAt` timestamp |
| 4 | `getModule(id)` → module or null | Direct Map lookup |
| 5 | `setModuleStatus(id, status)` | `'active'`/`'inactive'`/`'error'`, emits `STATE_TRANSITION` |
| 6 | Define built-in module IDs | `VALIDATION`, `INGESTION`, `APPROVAL`, `AUDIT` |
| 7 | Unit tests | Register, query, status, duplicate handling, event emission |

**Acceptance Criteria:**
- Idempotent: same ID twice → updates, no duplicate
- Events emitted for register + status change
- Built-in IDs exported as constants

**Versioning / Persistence:**
- In-memory Map only — rebuilds on each app startup
- No IndexedDB for registry

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | Register 'validation' → `getModule('validation')` returns it → event emitted |
| CP-2 | Set status 'error' → verify status updated → `STATE_TRANSITION` event |
| CP-3 | Verify MODULE_IDS match what M2–M5 will use |

**Gate Condition:** No module registers as 'active' at import time — only after successful init.

**Agent Memory State:** "Registry holds 4 built-in module slots. All start 'inactive', set 'active' after init."

---

#### 🎯 M1.5 — Dashboard System Indicator

| Field | Detail |
|-------|--------|
| **File Path** | `src/Dashboard.jsx` (modify existing) |
| **Branch** | `feature/m1-dashboard-indicator` |
| **Dependencies** | M1.4 (reads module registry) |
| **Agent** | UX Calmness (lead), Accessibility (review) |
| **Thinking Framework** | **Analytical** — aggregate status computation, visual accessibility |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Import registry | From `src/runtime` |
| 2 | Compute aggregate | `hasError → rose`, `allActive → sage`, else `gold` |
| 3 | Render 8px dot | Inline-flex, no layout shift |
| 4 | Add aria-label | `t('dashboard.system' + status)` |
| 5 | Add i18n keys (4 locales) | systemHealthy, systemDegraded, systemError |
| 6 | Verify dark mode | Dots visible against dark header |

**Acceptance Criteria:**
- Dot visible, correct color per aggregate
- No layout shift
- Accessible with aria-label in 4 languages
- If registry empty → gold (degraded)

**Versioning / Persistence:** No persistence — reads live from registry.

**ISO Evidence:** Visual regression screenshots at 1440px + 375px, light + dark.

---

### M2 — Validation Engine (Week 2–3)

---

#### ⚡ M2.1 — Rule Schema

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/validation/ruleSchema.js` |
| **Branch** | `feature/m2-rule-schema` |
| **Dependencies** | M1.1, M1.4 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical + Computational** — type system design, schema self-validation |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create directory | `mkdir -p src/runtime/validation` |
| 2 | Define rule shape | `{ id, field, type, params?, message, severity }` |
| 3 | Define RULE_TYPES | `required`, `minLength`, `maxLength`, `pattern`, `email`, `phone`, `date`, `range`, `custom` |
| 4 | Define SEVERITY_LEVELS | `error`, `warning`, `info` |
| 5 | Implement `validateRuleDefinition(rule)` | Returns `{ valid, errors[] }` |
| 6 | Export chapter rule sets | One array per chapter key (persoenlich, wohnen, finanzen, etc.) |
| 7 | Register validation module | Via M1.4 registry |
| 8 | Unit tests | Valid/invalid rules, all types, missing params |

**Acceptance Criteria:**
- Rules are JSON-serializable plain objects
- Self-validation catches all malformed rules
- Every chapter has ≥3 rules
- Bijection with existing `validateField()` checks

**Versioning / Persistence:** Static code exports — not persisted. Versioned by git.

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | Malformed rule (missing id, unknown type) → specific error |
| CP-2 | Rule count per chapter matches existing `ChapterView` field validations |
| CP-3 | Cross-reference `dataValidation.js` line by line |

**Agent Memory State:** "9 rule types. 7 chapter rule sets. Self-validation covers all constraints. Module registered."

---

#### ⚡ M2.2 — Rule Evaluator

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/validation/evaluator.js` |
| **Branch** | `feature/m2-evaluator` |
| **Dependencies** | M2.1, M1.1 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational** — pure function evaluation, deterministic output |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `evaluateRule(rule, value, eventBus?)` | Returns `{ ruleId, passed, value, message?, timestamp }` |
| 2 | Per-type evaluators | `evalRequired`, `evalMinLength`, `evalMaxLength`, `evalPattern`, `evalEmail`, `evalPhone`, `evalDate`, `evalRange`, `evalCustom` |
| 3 | Implement `evaluateRuleSet(rules, data, eventBus?)` | Batch mode, returns array |
| 4 | Event emission | `VALIDATION_PASS` / `VALIDATION_FAIL` per rule |
| 5 | Edge case handling | null, undefined, '', whitespace → defined behavior per type |
| 6 | Unit tests | Per-type pass/fail, batch, edge cases, Swiss formats |

**Acceptance Criteria:**
- **Deterministic**: same (rule, value) → same result always
- Events emitted per evaluation
- No short-circuit (all rules evaluated)
- Edge cases handled without throwing

**Versioning / Persistence:** Pure transform — no persistence. Evidence register (M2.3) handles storage.

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | Each evaluator tested with Swiss data (AHV, Swiss phone, dates) |
| CP-2 | 5 validations → exactly 5 events on bus |
| CP-3 | ⚠️ **REGRESSION** — 10 existing validated fields through new evaluator → results match current behavior |

**Agent Memory State:** "9 evaluators implemented. All pure. Edge cases handled. Events emitted per evaluation."

---

#### ⚡🔗 M2.3 — Evidence Register

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/validation/evidenceRegister.js` |
| **Branch** | `feature/m2-evidence` |
| **Dependencies** | M2.2, M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Analytical + Procedural** — evidence provenance, IndexedDB reuse, aggregation |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `registerEvidence(...)` | Writes to `maloja-plana-audit` via `logEntry()`, type='validation' |
| 2 | Input snapshot | Shallow copy of value at evaluation time |
| 3 | `getEvidenceForField(field, { limit })` | Query + filter by payload.field |
| 4 | `getEvidenceForChapter(chapterKey)` | Aggregate evidence for all chapter fields |
| 5 | `getValidationSummary(chapterKey)` | `{ total, passed, failed, warnings }` based on latest per field |
| 6 | Unit tests | Store, retrieve, filter, summary math |

**Acceptance Criteria:**
- Every evaluation produces retrievable evidence
- Input snapshot captures value at evaluation time (provenance)
- Summary based on latest result per field
- Shares `maloja-plana-audit` store (type-filtered)

**Versioning / Persistence:** Writes to `maloja-plana-audit` IndexedDB (M1.3). Type='validation' for filtering.

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | Trigger validation → entry in IndexedDB with type='validation' |
| CP-2 | Summary math: `total = passed + failed + warnings` |
| CP-3 | M1.3 `getEntries({type:'validation'})` returns same data |

**Agent Memory State:** "Evidence register writes to shared audit store. Summary aggregates latest per field."

---

#### 🎯🔗 M2.4 — Migrate Existing Validation

| Field | Detail |
|-------|--------|
| **File Path** | `src/ChapterView.jsx`, `src/utils/dataValidation.js` |
| **Branch** | `feature/m2-migrate-validation` |
| **Dependencies** | M2.1, M2.2, M2.3 (full engine) |
| **Agent** | Runtime Governance + UX Calmness |
| **Thinking Framework** | **Analytical + Procedural** — migration safety, regression testing |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Map `validateField()` to rule schema | Convert each case to declarative rule |
| 2 | Wire `handleFieldBlur` → evaluator | Replace inline checks |
| 3 | Store evidence on blur | `registerEvidence(...)` per validation |
| 4 | Maintain identical error display | Red border + message — zero visual change |
| 5 | Add dashboard badge | `getValidationSummary(chapter)` → "3/12" |
| 6 | Add i18n keys | `dashboard.validationBadge`, `dashboard.fieldsValidated` |
| 7 | Full regression test | Every validated field type → identical errors |

**Acceptance Criteria:**
- ⚠️ **ZERO UX REGRESSION** — same red borders, same messages, same timing
- Evidence produced for every blur
- Badge visible on dashboard per chapter
- i18n in all 4 languages

**Versioning / Persistence:** Reuses M2.3 evidence register. Existing `or5_` schema unchanged.

**Checkpoints & Evidence:**

| CP | Verification | Critical |
|----|-------------|----------|
| CP-1 | ⚠️ **CRITICAL REGRESSION** — every validated field type (email, phone, AHV, dates) | Character-by-character error message comparison |
| CP-2 | Screenshot before/after per field type | Visual non-regression proof |
| CP-3 | Badge counts match manual count of validated fields | Dashboard accuracy |

**ISO Evidence:** Before/after screenshots for each field type serve as migration proof.

---

### M3 — Source Ingestion (Week 3–5)

---

#### ⚡ M3.1 — File Parser

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/ingestion/parser.js` |
| **Branch** | `feature/m3-parser` |
| **Dependencies** | M1.1 |
| **Agent** | Source Governance |
| **Thinking Framework** | **Computational + Procedural** — parser design, structured error handling |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create directory | `mkdir -p src/runtime/ingestion` |
| 2 | Implement `readFile(file)` | FileReader → Promise\<string\> |
| 3 | Implement `parseJSON(content)` | Returns `{ success, data, errors }` |
| 4 | Implement `parseCSV(content, { delimiter, hasHeader })` | Supports `,` and `;` delimiters |
| 5 | Implement `detectFormat(file)` | Extension + first-char sniff |
| 6 | Error shape | `{ success: false, data: null, errors: [{ line?, column?, message }] }` — **never throw** |
| 7 | Unit tests | Valid/invalid JSON, CSV ±headers, semicolons, BOM, empty/binary files |

**Acceptance Criteria:**
- Deterministic parsing
- Structured errors (never throws)
- Handles UTF-8 BOM
- Swiss CSV (semicolons) supported

**Versioning / Persistence:** Pure transform — no persistence. Original file not stored.

---

#### M3.2 — Schema Mapper

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/ingestion/mapper.js` |
| **Branch** | `feature/m3-mapper` |
| **Dependencies** | M3.1 |
| **Agent** | Source Governance |
| **Thinking Framework** | **Logical + Analytical** — field normalization, fuzzy matching, diff computation |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Define mapping shape | `{ [sourceField]: targetChapterField }` |
| 2 | Implement `createMapping(sourceFields, targetChapter)` | Auto-match by normalized name |
| 3 | Implement `applyMapping(mapping, sourceData)` | Transform to chapter format |
| 4 | Implement `previewMapping(mapping, sourceData, currentData)` | Returns `[{ field, oldValue, newValue, changed }]` |
| 5 | Type coercion | String→number, date parsing, boolean |
| 6 | Unit tests | Auto-match, apply, preview, coercion, unmapped fields |

**Acceptance Criteria:**
- Preview shows exact changes
- Mapping configurable (user can override auto-match)
- Type coercion handles Swiss formats

---

#### ⚡🔗 M3.3 — Ingestion Pipeline

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/ingestion/pipeline.js` |
| **Branch** | `feature/m3-pipeline` |
| **Dependencies** | M3.1, M3.2, M2.2, M1.1, M1.3 |
| **Agent** | Source Governance + Runtime Governance |
| **Thinking Framework** | **Procedural + Analytical** — pipeline architecture, transaction safety, cryptographic provenance |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Define stages | `READ → PARSE → MAP → VALIDATE → PREVIEW → APPROVE → PERSIST → AUDIT` |
| 2 | Implement `createPipeline(file, chapterKey, mapping?)` | Returns instance with `run()` |
| 3 | Stage execution | Each returns `{ stage, success, result?, error? }` — halts on first failure |
| 4 | SHA-256 fingerprint | `crypto.subtle.digest('SHA-256', buffer)` → hex provenance |
| 5 | Auto-backup before persist | Triggers existing `autoBackup.createBackup()` |
| 6 | Emit events | `INGESTION_START` (file metadata), `INGESTION_COMPLETE` (summary) |
| 7 | APPROVE stage | Returns Promise — resolved by approval gate (M4) |
| 8 | PERSIST stage | Write to localStorage via existing `storage.set()` |
| 9 | Unit tests | Full pipeline, stage failures, backup trigger, rollback |

**Acceptance Criteria:**
- Stages observable via events
- Halts on any failure (no partial writes)
- SHA-256 provenance stored in audit
- Auto-backup fires before persist
- Approval gate integrated (Promise-based)

**Versioning / Persistence:**
- SHA-256 of original file → audit entry payload
- Data persists to `or5_<chapter>` localStorage
- Auto-backup → `ordnung-ruhe-backups` IndexedDB
- Pipeline progress NOT persisted (in-memory, restartable)

**Checkpoints & Evidence:**

| CP | Verification | Critical |
|----|-------------|----------|
| CP-1 | SHA-256 matches known test file hash | Provenance integrity |
| CP-2 | Backup store has new entry after pipeline | Check `ordnung-ruhe-backups` |
| CP-3 | `localStorage.getItem('or5_<chapter>')` contains new data | Persistence verified |
| CP-4 | ⚠️ Pipeline failure mid-way → localStorage unchanged | No partial writes |

---

#### 🎯🔗 M3.4 — Import UI

| Field | Detail |
|-------|--------|
| **File Path** | `src/ChapterView.jsx` (modify), `src/components/ImportPreview.jsx` (new) |
| **Branch** | `feature/m3-import-ui` |
| **Dependencies** | M3.3, M4.1 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Procedural + Analytical** — multi-step UI, state management, accessible patterns |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Add "Import" button | ChapterView header, `t('chapter.importFromFile')` |
| 2 | Hidden file input | `type="file" accept=".json,.csv"` triggered by button |
| 3 | Handle file select | Create pipeline, run PARSE+MAP, show ImportPreview |
| 4 | Create ImportPreview.jsx | Bordered card showing field diff `[field] current → new` |
| 5 | Diff styling | Changed=bold, unchanged=muted, new=highlighted |
| 6 | Confirm button | `t('import.applyChanges')` → triggers APPROVE+PERSIST |
| 7 | Cancel button | `t('common.cancel')` — clears preview, no side effects |
| 8 | Success card | `t('import.success', { count })` + audit ref |
| 9 | Error card | `palette.rose` border + `t('import.parseError')` |
| 10 | i18n (4 locales) | 6 keys: importFromFile, preview, applyChanges, success, parseError, noChanges |
| 11 | aria-labels | File input, confirm, cancel, preview region |
| 12 | Test 375px | Card stacks, buttons full-width, preview scrollable |

**Acceptance Criteria:**
- File select → preview → confirm → persist → audit
- OR cancel without side effects
- OR calm error on bad file
- Mobile-ready, accessible

---

### M4 — Human Approval Gates (Week 5–6)

---

#### 🎯🔗 M4.1 — Gate Component

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/ApprovalGate.jsx` (new) |
| **Branch** | `feature/m4-gate-component` |
| **Dependencies** | M1.1 |
| **Agent** | UX Calmness (lead) + Accessibility (review) |
| **Thinking Framework** | **Analytical + Procedural** — WAI-ARIA dialog, focus management, calm UX |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Modal overlay | `position:fixed, inset:0, z:1000, flex-center` |
| 2 | Card | `palette.surface, maxWidth:min(480px, 90vw), overflow:auto` |
| 3 | Props | `{ title, changes: [{ label, from?, to? }], onApprove, onReject }` |
| 4 | Change list | `<ul>` with `"label: from → to"` per change |
| 5 | Approve button | `palette.sage` bg, `t('approval.approve')` |
| 6 | Reject button | `palette.border` bg, `t('approval.reject')` |
| 7 | Rejection reason | Textarea on reject click → "Confirm rejection" |
| 8 | Escape key | `onReject(null)` |
| 9 | Focus trap | Tab cycles within modal only |
| 10 | ARIA | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| 11 | i18n (4 locales) | approve, reject, title, reason, confirmReject, thisWill |
| 12 | Dark mode | All colors from palette, zero hardcoded |
| 13 | 375px | Buttons stack vertically below 400px |

**Acceptance Criteria:**
- Calm, non-urgent modal
- **No auto-dismiss, no timeout**
- Fully keyboard navigable + focus trapped
- Screen reader announces dialog
- Dark mode + mobile ready

**Gate Condition:** This component **never** auto-approves. Promise resolves only on human action.

---

#### ⚡ M4.2 — Gate Registry

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/gates/registry.js` |
| **Branch** | `feature/m4-gate-registry` |
| **Dependencies** | M1.4 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical + Procedural** — fail-safe design, operation taxonomy |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create directory | `mkdir -p src/runtime/gates` |
| 2 | Define GATED operations | `import`, `bulkEdit`, `delete`, `export`, `settingsChange`, `clearData` |
| 3 | Define EXEMPT operations | `fieldEdit`, `navigation`, `viewChange`, `themeToggle`, `languageChange` |
| 4 | `requiresApproval(opType)` → boolean | Check GATED set |
| 5 | `requestApproval({ operation, changes, actor })` → Promise | Resolves on approve/reject |
| 6 | **Fail-safe**: unknown ops → require approval | Safe default |
| 7 | Register 'approval' module | Via M1.4 registry |
| 8 | Unit tests | Classification, lifecycle, unknown ops |

**Acceptance Criteria:**
- Correct classification
- Gate blocks indefinitely until human action
- Unknown ops default to requiring approval (fail-safe)
- Never auto-approves

---

#### ⚡🔗 M4.3 — Approval Wiring + Evidence

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/gates/evidence.js`, `src/DocumentTresor.jsx`, `src/ChapterView.jsx`, `src/ZipExport.jsx` |
| **Branch** | `feature/m4-wiring` |
| **Dependencies** | M4.1, M4.2, M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural + Analytical** — hook composition, Promise coordination, evidence chain |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | `logApproval(...)` | Writes `APPROVAL_GRANTED` to audit |
| 2 | `logRejection(...)` | Writes `APPROVAL_REJECTED` + reason to audit |
| 3 | Create `useApprovalGate()` hook | `(operation, changes) => { showGate, gateProps, requestAndWait }` |
| 4 | Wire DocumentTresor delete | Gate before `onDelete(doc.id)` |
| 5 | Wire import confirm | M3.4 APPROVE stage calls hook |
| 6 | Wire ZipExport | Gate before export generation |
| 7 | Handle rejection | Log + return without executing |
| 8 | Integration tests | Approve→execute→audit; Reject→no execute→audit |

**Acceptance Criteria:**
- All destructive operations gated
- Approval → action proceeds + evidence logged
- Rejection → action blocked + rejection logged with reason
- Hook reusable across components

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | Delete in Tresor → gate → approve → deleted → audit entry `APPROVAL_GRANTED` |
| CP-2 | Delete in Tresor → gate → reject → document still exists → `APPROVAL_REJECTED` |
| CP-3 | Same `useApprovalGate` works in Tresor, ChapterView, ZipExport |

---

### M5 — Audit & Observability (Week 6–7)

---

#### 🎯🔗 M5.1 — Audit Viewer

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/AuditViewer.jsx` (new) |
| **Branch** | `feature/m5-audit-viewer` |
| **Dependencies** | M1.3, M1.1 |
| **Agent** | UX Calmness (lead) + Runtime Governance |
| **Thinking Framework** | **Analytical + Procedural** — timeline UI, IndexedDB reads, pagination |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Vertical timeline | Newest first, `flex-direction:column` |
| 2 | Load entries | `getEntries({ limit: 50 })` on mount |
| 3 | Group by day | "Today" / "Yesterday" / formatted date |
| 4 | Entry card | Type badge (colored dot) + monospace timestamp + description |
| 5 | Badge colors | validation=sky, approval=sage, ingestion=gold, system=mid |
| 6 | Filter dropdown | "All" / "Validation" / "Approval" / "Ingestion" / "System" |
| 7 | "Load more" button | Next 50 entries (offset-based) |
| 8 | Empty state | Calm card: `t('audit.noEntries')` |
| 9 | i18n (4 locales) | 11 keys for viewer |
| 10 | Accessibility | `role="log"`, `aria-label`, `aria-live="polite"` |
| 11 | Test 375px + dark mode | Cards full-width, badges visible |

**Acceptance Criteria:**
- Full history viewable, filterable, paginated
- Accessible (role=log)
- Calm empty state
- No infinite load

---

#### 🎯 M5.2 — System Status Panel

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/SystemStatus.jsx` (new), `src/Dashboard.jsx` |
| **Branch** | `feature/m5-system-status` |
| **Dependencies** | M1.4, M1.3 |
| **Agent** | UX Calmness + Runtime Governance |
| **Thinking Framework** | **Analytical + Procedural** — dashboard composition, status aggregation |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Grid of module cards | `auto-fit, minmax(140px, 1fr)` |
| 2 | Card content | Module name + status dot + last event time (relative) |
| 3 | Query registry | `getModules()` for list + status |
| 4 | Query audit log | `getEntries({ type, limit: 1 })` per module |
| 5 | i18n (4 locales) | 6 keys |
| 6 | Collapsible on mobile | Starts collapsed at <768px |
| 7 | Add to Dashboard | Below chapter grid |
| 8 | Dark mode | Dots + cards use palette |

**Acceptance Criteria:**
- Module health at a glance
- Last activity time per module
- Non-intrusive on mobile (collapsed)

---

#### M5.3 — Audit Export

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/AuditViewer.jsx` (modify) |
| **Branch** | `feature/m5-audit-export` |
| **Dependencies** | M5.1, M4.2 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural + Analytical** — export pipeline, gate integration, meta-audit |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Add "Export" button | `t('audit.export')` with download icon |
| 2 | Trigger approval gate | Export is gated |
| 3 | Generate JSON | Serialize entries as array |
| 4 | Trigger download | Blob + `<a>` click, filename: `maloja-plana-audit-YYYY-MM-DD.json` |
| 5 | Log export event | Meta-audit: "audit_exported" entry |
| 6 | Exclude document blobs | Metadata only |

**Acceptance Criteria:**
- Export gated + logged
- Valid JSON
- No binary/blob data
- Offline download works

---

#### M5.4 — Retention Policy

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/auditLog.js` (modify) |
| **Branch** | `feature/m5-retention` |
| **Dependencies** | M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational + Procedural** — time-based lifecycle, cursor deletion, self-referential logging |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | `pruneEntries(olderThanDays)` | Cursor delete beyond retention |
| 2 | Default 90 days | Configurable via settings |
| 3 | Run on startup | After init, before render |
| 4 | Log prune event | `{ action: 'prune', deletedCount, olderThanDays }` |
| 5 | Settings UI | Dropdown: 30/60/90/180/365 days |
| 6 | Unit tests | Prune logic, boundary dates, empty store |

**Acceptance Criteria:**
- Store bounded
- User controls TTL
- Prune itself logged (meta-event)
- Boundary correct (day-exact)

**Versioning / Persistence:** Retention setting in `or5_settings` localStorage (extends existing).

---

#### 🎯 M5.5 — System Navigation Tab

| Field | Detail |
|-------|--------|
| **File Path** | `src/App.jsx`, `src/MobileNav.jsx`, `src/SystemView.jsx` (new) |
| **Branch** | `feature/m5-system-nav` |
| **Dependencies** | M5.1, M5.2 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Procedural** — routing, component composition, navigation consistency |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Add `'system'` to `VALID_VIEWS` | In `src/utils/hashRouter.js` |
| 2 | Create `SystemView.jsx` | Composes AuditViewer + SystemStatus |
| 3 | Route case in App.jsx | `'system'` → `<SystemView>` |
| 4 | MobileNav item | Icon + `t('nav.system')` |
| 5 | i18n (4 locales) | en: "System", de: "System", fr: "Système", it: "Sistema" |
| 6 | Position | After Calendar, before Settings |
| 7 | Active state | Consistent styling with existing items |

**Acceptance Criteria:**
- Route `#/system` works
- Nav item visible + styled consistently
- Mobile nav fits without overflow

---

### M6 — Integration & Polish (Week 7–8)

---

#### ⚡🔗 M6.1 — E2E Integration Tests

| Field | Detail |
|-------|--------|
| **File Path** | `tests/e2e/` (new dir) |
| **Branch** | `feature/m6-e2e` |
| **Dependencies** | All M1–M5 |
| **Agent** | Release Safety (lead) |
| **Thinking Framework** | **Analytical + Procedural** — integration testing, fixture-based determinism |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Import E2E | File → parse → preview → approve → persist → audit entry with SHA-256 |
| 2 | Delete E2E | Tresor doc → delete → gate → approve → removed → `APPROVAL_GRANTED` |
| 3 | Validation E2E | Field blur → eval → evidence in IndexedDB → badge updated |
| 4 | Rejection E2E | Delete → gate → reject with reason → doc exists → `APPROVAL_REJECTED` |
| 5 | Audit completeness | All transitions produce entries (no gaps) |
| 6 | Offline E2E | `navigator.onLine = false` → all flows work |

**Acceptance Criteria:**
- All 4 critical paths pass
- No silent failures
- Audit has zero gaps
- Offline identical to online
- Tests run in `npm test` (< 5s)

---

#### 🎯 M6.2 — Mobile QA (375px)

| Field | Detail |
|-------|--------|
| **File Path** | All new components |
| **Branch** | `feature/m6-mobile-qa` |
| **Dependencies** | All new UI |
| **Agent** | Accessibility + UX Calmness |
| **Thinking Framework** | **Analytical + Procedural** — responsive verification, touch compliance |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | ImportPreview 375px | Stacks, full-width buttons, scrollable |
| 2 | ApprovalGate 375px | 90vw, buttons stack, reason usable |
| 3 | AuditViewer 375px | Entries readable, filter full-width |
| 4 | SystemStatus 375px | Collapsed by default, expand works |
| 5 | System nav 375px | Fits, no overflow |
| 6 | Dashboard badge 375px | Doesn't break card layout |
| 7 | Fix horizontal scroll | `scrollWidth > innerWidth` = failure |
| 8 | Touch targets | All buttons ≥ 44px |

**Acceptance Criteria:**
- Zero horizontal overflow
- All buttons ≥ 44px tap area
- All text readable
- No layout breaks

---

#### 🎯 M6.3 — Dark Mode QA

| Field | Detail |
|-------|--------|
| **File Path** | All new components |
| **Branch** | `feature/m6-dark-mode` |
| **Dependencies** | All new UI |
| **Agent** | UX Calmness |
| **Thinking Framework** | **Analytical** — color audit, contrast verification |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | ImportPreview | Card bg/border/text via palette |
| 2 | ApprovalGate | Backdrop + card + buttons palette-aware |
| 3 | AuditViewer | Badges + timestamps readable |
| 4 | SystemStatus | Dots visible, cards contrasted |
| 5 | Dashboard dot | Visible in dark header |
| 6 | Grep for hardcoded colors | `grep -rn '#[0-9a-fA-F]' src/components/...` → **must return zero** |
| 7 | WCAG AA | 4.5:1 contrast ratio for text |

**Acceptance Criteria:**
- Zero contrast issues
- Zero hardcoded hex colors in new files
- All elements use palette exclusively

---

#### M6.4 — Architecture Decision Records

| Field | Detail |
|-------|--------|
| **File Path** | `docs/architecture/adr-001..005.md` |
| **Branch** | `feature/m6-docs` |
| **Dependencies** | All modules |
| **Agent** | Runtime Governance + Release Safety |
| **Thinking Framework** | **Logical + Analytical** — architectural reasoning, knowledge transfer |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | ADR-001 | Event bus design (why sync, why in-memory, why wildcard) |
| 2 | ADR-002 | Validation engine (why declarative, why evidence) |
| 3 | ADR-003 | Ingestion pipeline (why staged, why SHA-256, why backup-before-write) |
| 4 | ADR-004 | Approval gates (why modal, why no timeout, why fail-safe) |
| 5 | ADR-005 | Audit storage (why separate IndexedDB, why append-only, why retention) |
| 6 | Update index | `docs/context/ARCHITECTURE_INDEX.md` |
| 7 | Update status | `PROJECT_STATUS.md` |

**Acceptance Criteria:**
- Every decision documented: context, alternatives, decision, consequences
- Peer-reviewable without prior context

---

#### ⚡ M6.5 — Performance Verification

| Field | Detail |
|-------|--------|
| **File Path** | Build output, browser profiling |
| **Branch** | `feature/m6-performance` |
| **Dependencies** | All modules |
| **Agent** | Release Safety |
| **Thinking Framework** | **Computational + Analytical** — budgeting, profiling, regression detection |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Build size | `npm run build` → **< 200 KB gzip** (baseline: 126 KB) |
| 2 | Lighthouse | Performance ≥ 90, FCP < 1.5s, LCP < 2.5s |
| 3 | IndexedDB profiling | Audit store < 1 MB after typical session |
| 4 | Memory leak check | 100x mount/unmount → listener count returns to 0 |
| 5 | Dependency check | `package.json` dependencies section unchanged |

**Acceptance Criteria:**
- ⚠️ **RELEASE GATE** — if any check fails, blocks release
- Build ≤ 200 KB gzip
- No memory leaks
- Zero new runtime deps

---

## 7. ISO/Audit Evidence Framework

### Evidence Types per Milestone

| Milestone | Evidence Type | Storage | Retention |
|-----------|--------------|---------|-----------|
| M1 | Unit test results, event logs | Test output / CI | Permanent (git) |
| M2 | Validation evidence records, input snapshots | `maloja-plana-audit` IndexedDB | 90 days (configurable) |
| M3 | SHA-256 file provenance, import audit entries | `maloja-plana-audit` IndexedDB | 90 days (configurable) |
| M4 | Approval/rejection records with reasons | `maloja-plana-audit` IndexedDB | 90 days (configurable) |
| M5 | Exported audit JSON, retention logs | User download + IndexedDB | User-controlled |
| M6 | E2E test results, performance metrics, ADRs | Test output + docs (git) | Permanent (git) |

### Audit Entry Schema

```json
{
  "id": "<autoIncrement>",
  "type": "VALIDATION_PASS | VALIDATION_FAIL | STATE_TRANSITION | APPROVAL_GRANTED | APPROVAL_REJECTED | INGESTION_START | INGESTION_COMPLETE | AUDIT_ENTRY | MODULE_REGISTERED",
  "actor": "user | system | agent:<name>",
  "payload": { "...operation-specific data..." },
  "timestamp": 1716000000000
}
```

### Evidence Chain per Operation

| Operation | Evidence Produced | Traceable To |
|-----------|-------------------|--------------|
| Field validation | Rule ID + input snapshot + pass/fail | Specific rule definition in source code |
| File import | SHA-256 + mapped fields + pipeline stages | Original file (provenance hash) |
| Approval | Operation + changes list + actor + timestamp | Specific gate invocation |
| Rejection | Operation + reason + actor + timestamp | User decision with context |
| Export | Export event logged (meta-audit) | Point-in-time snapshot |
| Retention prune | Deleted count + cutoff date | System lifecycle event |

### Compliance Mapping

| Requirement | Phase 1 Coverage | Task |
|-------------|-----------------|------|
| Traceability | Every state change → audit entry | M1.3 |
| Non-repudiation | Actor field on every entry | M1.3, M4.3 |
| Data provenance | SHA-256 of source files | M3.3 |
| Access control | Human approval gates | M4.1–M4.3 |
| Data integrity | No partial writes, backup before persist | M3.3 |
| Audit trail | Append-only, exportable, retention-managed | M1.3, M5.1–M5.4 |
| System observability | Module registry + status panel | M1.4, M5.2 |
| Evidence preservation | Input snapshots, decision records | M2.3, M4.3 |

---

## 8. Cross-Cutting Context

### IndexedDB Store Map

| Store Name | Version | Object Stores | Phase 1 Role |
|------------|---------|---------------|-------------|
| `ordnung-ruhe-documents` | 1 | documents | ❌ NOT MODIFIED — existing doc storage |
| `ordnung-ruhe-backups` | 1 | backups | Read-only (backup trigger in M3.3) |
| `maloja-plana-audit` | 1 | entries (indexes: by-type, by-timestamp) | ✅ NEW — audit + validation evidence |

### localStorage Key Map

| Key Pattern | Content | Phase 1 Role |
|-------------|---------|-------------|
| `or5_persoenlich` | Chapter data (persönlich) | Write target for ingestion (M3.3) |
| `or5_wohnen` | Chapter data (wohnen) | Write target for ingestion |
| `or5_finanzen` | Chapter data (finanzen) | Write target for ingestion |
| `or5_versicherungen` | Chapter data | Write target for ingestion |
| `or5_ausbildung` | Chapter data | Write target for ingestion |
| `or5_behoerden` | Chapter data | Write target for ingestion |
| `or5_notfall` | Chapter data | Write target for ingestion |
| `or5_settings` | App settings | Extended with `auditRetention` (M5.4) |
| `or5_onboarding_*` | Onboarding state | ❌ NOT MODIFIED |

### Event Flow Diagram

```
[User Action]
     │
     ▼
[Event Bus] ─── emit(TYPE, payload) ──┐
     │                                 │
     ├──▶ [State Machine] ─── guard?   │
     │         │                       │
     │         ▼                       │
     │    emit(STATE_TRANSITION)       │
     │                                 │
     ├──▶ [Validation Engine]          │
     │         │                       │
     │         ▼                       │
     │    emit(VALIDATION_PASS/FAIL)   │
     │                                 │
     └──▶ [Audit Logger] ◀────────────┘
              │         (wildcard: captures ALL)
              ▼
         [IndexedDB: maloja-plana-audit]
```

### High Context Dependency Tasks (🔗)

These tasks require awareness of multiple modules. Flag for senior review:

| Task | Why High Context | Modules Touched |
|------|-----------------|-----------------|
| M1.3 | Shared store consumed by M2.3, M5.1, M5.4 | Events, IndexedDB |
| M2.3 | Writes to M1.3's store with type filtering | Validation, Audit |
| M2.4 | Must not regress existing UX | Validation, UI, existing dataValidation |
| M3.3 | Coordinates 5 modules + existing backup | Parser, Mapper, Validation, Audit, Backup |
| M3.4 | UI depends on pipeline + gate | Import UI, Pipeline, Approval Gate |
| M4.1 | Consumed by 3+ different operations | Gate UI, Import, Delete, Export |
| M4.3 | Wires gate into existing components | Gate, Tresor, ChapterView, ZipExport |
| M6.1 | Tests all modules end-to-end | All M1–M5 |

---

## 9. Agent Orchestration Model

### Agent Roles

| Agent | Primary Responsibility | Phase 1 Milestones |
|-------|----------------------|-------------------|
| Runtime Governance | Core primitives, deterministic behavior | M1 (lead), M2 (lead), M4.2–M4.3, M5.3–M5.4 |
| Source Governance | Data ingestion integrity | M3.1–M3.3 (lead) |
| UX Calmness | Calm, clear UI patterns | M1.5, M2.4 (review), M3.4, M4.1 (lead), M5.1–M5.2, M5.5, M6.2–M6.3 |
| Accessibility | ARIA, keyboard, mobile | M4.1 (review), M5.5, M6.2 |
| Release Safety | Integration, performance, docs | M6.1 (lead), M6.4–M6.5 |

### Agent Assignment Matrix

| Agent | M1 | M2 | M3 | M4 | M5 | M6 |
|-------|----|----|----|----|----|----|
| Runtime Governance | Lead | Lead | Support | Lead | Support | Review |
| Source Governance | — | — | Lead | Support | — | Review |
| Accessibility | — | — | — | Review | Review | QA |
| UX Calmness | — | Review | Review | Lead | Lead | QA |
| Release Safety | — | — | — | — | — | Lead |

### Orchestration Rules

1. **No agent acts without human review** — agents propose, humans approve
2. **Sequential milestones** — M1 ships before M3 (M2 can overlap M1 tail)
3. **Evidence required** — each agent output links to acceptance criteria
4. **Escalation** — governance conflict → human decides
5. **Isolation** — bounded modules, no cross-module without review
6. **Audit** — agent actions logged in same trail as user actions

### Dev Workflow per Milestone

```
1. Agent proposes implementation plan (scope, files, acceptance)
2. Human reviews and approves plan
3. Implementation on feature branch
4. Agent runs QA (tests, build, a11y, mobile)
5. Human reviews diff
6. Merge to dev
7. Smoke test on dev
8. Document decisions in ADRs
```

---

## 10. Success Criteria & Release Gate

### Phase 1 Complete When:

| # | Criterion | Verification Method | Task |
|---|-----------|--------------------|----|
| 1 | File import works for JSON and CSV | E2E test + manual QA | M3.4, M6.1 |
| 2 | Validation rules produce traceable evidence | Evidence query returns valid records | M2.3, M6.1 |
| 3 | Human approval gate blocks unapproved actions | Rejection E2E test | M4.3, M6.1 |
| 4 | Audit log captures all state transitions | Completeness E2E test | M1.3, M6.1 |
| 5 | System status visible on dashboard | Visual QA | M1.5, M5.2 |
| 6 | All operations work fully offline | Offline E2E test | M6.1 |
| 7 | Zero new runtime dependencies | `package.json` diff check | M6.5 |
| 8 | Build under 200 KB gzip | `npm run build` output | M6.5 |
| 9 | Mobile-ready (375px) all new UI | Viewport QA | M6.2 |
| 10 | Dark mode consistent all new components | Visual QA + grep | M6.3 |
| 11 | 100% new interactive elements have aria-labels | Accessibility audit | M6.2 |
| 12 | All ADRs written | Document review | M6.4 |

### Release Gate (M6.5)

```
IF build > 200 KB gzip → BLOCK (investigate growth)
IF memory leak detected → BLOCK (fix before merge)
IF any E2E test fails → BLOCK (fix regression)
IF Lighthouse < 90 → BLOCK (optimize)
IF new runtime dep found → BLOCK (remove)

ELSE → RELEASE APPROVED
```

---

## 11. Document Cross-References

| Document | Purpose | Relationship to Master |
|----------|---------|----------------------|
| [PHASE_1_ROADMAP.md](PHASE_1_ROADMAP.md) | High-level milestones + UX/workflow vision | Sections 3, 4, 9 derived from here |
| [PHASE_1_TASKS.md](PHASE_1_TASKS.md) | Detailed dev tasks with subtask tables | Section 6 incorporates and extends |
| [PHASE_1_TICKET_TABLE.md](PHASE_1_TICKET_TABLE.md) | Copy-paste tickets with dependency matrix | Sections 5, 6 incorporate |
| [PHASE_1_FULL_TICKETS.md](PHASE_1_FULL_TICKETS.md) | Enhanced with versioning, checkpoints, thinking | Section 6 incorporates all columns |
| [PHASE_1_IMPLEMENTATION_SPEC.md](PHASE_1_IMPLEMENTATION_SPEC.md) | Full spec with debug dumps, agent memory, gates | Sections 6, 7, 8 incorporate |
| [PRD.md](../product/PRD.md) | Product requirements document | Vision alignment |
| [PLATFORM_CONTEXT.md](../context/PLATFORM_CONTEXT.md) | Technical constraints + architecture | Constraints honored throughout |

---

## Appendix A: Thinking Framework Distribution

| Framework | Tasks | Application |
|-----------|-------|-------------|
| **Computational** | M1.1, M2.2, M3.1, M5.4, M6.5 | Pure functions, deterministic algorithms, performance budgets |
| **Logical** | M1.2, M1.4, M2.1, M3.2, M4.2, M6.4 | State machines, type systems, taxonomies, architectural reasoning |
| **Analytical** | M1.5, M2.3, M2.4, M3.3, M4.1, M4.3, M5.1, M5.2, M6.1, M6.2, M6.3 | Evidence aggregation, regression detection, integration analysis |
| **Procedural** | M1.3, M3.1, M3.3, M3.4, M4.1, M5.3, M5.5, M6.2 | Pipeline stages, step-by-step flows, UI state machines |

---

## Appendix B: i18n Key Summary

| Milestone | New Keys | Categories |
|-----------|----------|-----------|
| M1 | 3 | `dashboard.systemHealthy/Degraded/Error` |
| M2 | 2 | `dashboard.validationBadge`, `dashboard.fieldsValidated` |
| M3 | 6 | `chapter.importFromFile`, `import.*` |
| M4 | 6 | `approval.*` |
| M5 | 17 | `audit.*`, `system.*`, `nav.system`, `settings.auditRetention` |
| M6 | 0 | (polish only) |
| **Total** | **~34 per locale** | 4 locales × 34 = 136 key additions |

---

## Appendix C: Risk Mitigation

| Risk | Impact | Mitigation | Owner |
|------|--------|-----------|-------|
| Audit IndexedDB grows unbounded | Performance degradation | Retention policy (M5.4), default 90 days | Runtime Governance |
| Import parser fails on edge cases | User frustration | Preview step catches before persist (M3.4) | Source Governance |
| Approval fatigue | User ignores gates | Only gate destructive/bulk ops (M4.2) | UX Calmness |
| Build size growth | Budget violation | Cap at 200 KB, monitor per milestone (M6.5) | Release Safety |
| Existing UX regression | User trust loss | Full regression QA in M2.4 + M6.2 | UX Calmness |
| Cross-module coupling | Integration failures | 🔗 tasks flagged for senior review | All agents |

---

*Document generated: 2026-05-17 | Baseline: `89d9f32` | Branch: `dev`*  
*Next review: After M1 completion (Week 2)*
