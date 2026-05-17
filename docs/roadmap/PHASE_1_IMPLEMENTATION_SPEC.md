# Maloja Plana — Phase 1 Implementation Specification

> Vollständig nachvollziehbar, reproduzierbar, implementierbar.  
> ⚡ = Critical Path | 🎯 = UX/Observability | 🔗 = High Context Dependency  
> Baseline commit: `89d9f32` (dev branch, 2026-05-17)  
> Build baseline: 126.08 KB gzip, 14/14 tests, 75 modules

---

## M1 — Runtime Foundation (Week 1–2)

### ⚡ M1.1 — Event Bus

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/events.js`, `src/runtime/index.js` |
| **Branch** | `feature/m1-event-bus` |
| **Dependencies** | None (first primitive, root of dependency tree) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational** — pure function design, synchronous dispatch, observer pattern |

**Numbered Subtasks:**

1. `mkdir -p src/runtime` — establish module boundary
2. Implement `createEventBus()`:
   ```
   returns { emit(type, payload), on(type, handler), off(type, handler) }
   internal: Map<string, Set<Function>>
   ```
3. Define event type constants (exported):
   ```
   EVENT_TYPES = { VALIDATION_PASS, VALIDATION_FAIL, STATE_TRANSITION,
     APPROVAL_REQUESTED, APPROVAL_GRANTED, APPROVAL_REJECTED,
     INGESTION_START, INGESTION_COMPLETE, AUDIT_ENTRY, MODULE_REGISTERED }
   ```
4. Implement wildcard: `on('*', handler)` — handler receives `{ type, payload, timestamp }`
5. Implement `off(type, handler)` — removes specific handler, prevents memory leaks
6. Create barrel `src/runtime/index.js` — re-exports all runtime modules
7. Write unit tests in `tests/runtime/events.test.js`:
   - emit → listener receives exact payload
   - off → listener no longer called
   - wildcard receives all events with type metadata
   - 1000x mount/unmount cycle → listener count returns to 0

**Acceptance Criteria:**
- `npm test -- --run` passes with new tests
- Events fire synchronously (no microtask/setTimeout)
- Zero DOM coupling (no `window.addEventListener`)
- Wildcard receives `{ type, payload, timestamp }` for every emission
- After `off()`, handler count for that type decreases

**Versioning / Persistence Notes:**
- Event bus is **ephemeral in-memory only** — no IndexedDB, no localStorage
- Bus instance is module-scoped singleton (not on `window`)
- No event queue persistence — events are fire-and-forget
- **Debug dump**: during dev, add `if (process.env.NODE_ENV === 'test') bus._debug = { listeners: Map }` for leak detection in tests
- **Snapshot reference**: after merge, tag commit as `runtime-v0.1.0-event-bus`

**Context / Checkpoints:**
- **CP-1**: After subtask 2 — verify `emit('TEST', {x:1})` → listener receives `{x:1}`. Log: `console.debug('[EventBus] emit:', type, payload)`
- **CP-2**: After subtask 4 — verify wildcard handler gets `{ type: 'TEST', payload: {x:1}, timestamp }`. Timestamp must be `Date.now()`
- **CP-3**: After subtask 5 — mount 100 listeners, off all 100, verify internal Map size = 0
- **Agent Memory State**: After M1.1 merge, Runtime Governance agent records: "Event bus operational, 10 event types defined, wildcard supported, leak-free"
- **Evidence Point**: Unit test results file serves as evidence that bus is deterministic
- **Rollback**: If bus design proves wrong later, all consumers use `import { eventBus } from 'src/runtime'` — single point of replacement

---

### ⚡ M1.2 — State Machine

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/stateMachine.js` |
| **Branch** | `feature/m1-state-machine` |
| **Dependencies** | M1.1 (emits `STATE_TRANSITION` events) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical** — formal state machine theory, guard predicates, transition tables |

**Numbered Subtasks:**

1. Implement `createStateMachine({ initial, states, eventBus })`:
   ```
   states: { [name]: { on: { [event]: { target, guard? } } } }
   guard: (context) => boolean
   ```
2. On valid transition: emit `STATE_TRANSITION` via eventBus:
   ```
   { from, to, event, timestamp, context }
   ```
3. On invalid transition: return `{ success: false, reason: 'invalid_event' | 'guard_blocked' }`
4. `getState()` → current state string
5. `canTransition(event)` → boolean (checks validity + guard without executing)
6. Define field lifecycle config:
   ```
   empty → (EDIT) → draft → (VALIDATE) → validated → (APPROVE) → approved
   ```
7. Define document lifecycle config:
   ```
   uploaded → (VALIDATE) → validated → (ACTIVATE) → active → (EXPIRE) → expired → (ARCHIVE) → archived
   ```
8. Unit tests in `tests/runtime/stateMachine.test.js`:
   - Valid transition returns `{ success: true, from, to }`
   - Invalid event returns `{ success: false }`
   - Guard `() => false` blocks transition
   - Event bus receives `STATE_TRANSITION` on valid transition only
   - `canTransition` doesn't modify state

**Acceptance Criteria:**
- FSM rejects all invalid transitions (returns structured error, never throws)
- Guards block transitions and return `reason: 'guard_blocked'`
- `getState()` always reflects truth after transition
- Event bus receives exactly one event per valid transition
- Both lifecycle configs (field + doc) tested end-to-end

**Versioning / Persistence Notes:**
- FSM state is **in-memory per instance** — not persisted
- State is derived from data (e.g., if field has value → `draft`, if validated → `validated`)
- Multiple independent instances allowed (no global singleton)
- **Debug dump**: `machine._debugHistory = []` in test mode — records last 50 transitions for inspection
- **Test dump location**: `tests/runtime/stateMachine.test.js` captures transition logs as test assertions

**Context / Checkpoints:**
- **CP-1**: After subtask 2 — emit test transition → verify event bus received `{ from: 'empty', to: 'draft', event: 'EDIT' }`
- **CP-2**: After subtask 3 — attempt `empty → approved` (skipping states) → verify rejection
- **CP-3**: After subtask 6 — create field machine, walk full lifecycle `empty→draft→validated→approved` → verify 3 events emitted
- **Gate Condition**: Guard functions must be pure (no side effects). If guard reads external state (e.g., "all fields valid?"), it receives context as argument
- **Agent Memory State**: "State machine supports 2 lifecycle configs, guard predicates are pure, transitions emit events"
- **Evidence Point**: Transition history in debug mode proves deterministic replay capability

---

### ⚡🔗 M1.3 — Audit Logger

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/auditLog.js` |
| **Branch** | `feature/m1-audit-log` |
| **Dependencies** | M1.1 (subscribes to wildcard events) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural** — append-only log design, IndexedDB transactions, cursor pagination |

**Numbered Subtasks:**

1. Create IndexedDB store:
   ```
   DB name: 'maloja-plana-audit'
   Version: 1
   Object store: 'entries' (autoIncrement key)
   Indexes: 'by-type' (on 'type'), 'by-timestamp' (on 'timestamp')
   ```
2. Implement `logEntry({ type, actor, payload, timestamp })`:
   - Append-only write (no update, no delete in normal operation)
   - Timestamp defaults to `Date.now()` if not provided
   - Returns Promise<entryId>
3. Implement `getEntries({ since?, until?, type?, limit = 50, offset = 0 })`:
   - Cursor-based query, newest-first (descending timestamp index)
   - Filters applied via index (type) or cursor skip (date range)
4. Implement `getEntryCount({ type? })` → number
5. Implement `initAuditLog(eventBus)`:
   - Subscribes to `eventBus.on('*', handler)`
   - Handler calls `logEntry` for every emission
   - Returns cleanup function for unmount
6. Define actor convention:
   - `'user'` — manual user action
   - `'system'` — automated (prune, backup, init)
   - `'agent:<name>'` — agent-proposed action (e.g., `'agent:validation'`)
7. Error handling: if IndexedDB write fails, `console.error` but never crash app
8. Unit tests with `fake-indexeddb` (devDependency):
   - logEntry creates retrievable entry
   - getEntries filters by type correctly
   - getEntries filters by date range
   - getEntryCount matches actual count
   - Wildcard subscription auto-logs events
   - Write failure doesn't throw

**Acceptance Criteria:**
- Every event bus emission → audit entry within same execution context
- Entries retrievable by type and date range
- Count accurate after writes
- IndexedDB errors caught gracefully (logged, not thrown)
- Existing stores (`ordnung-ruhe-documents`, `ordnung-ruhe-backups`) completely untouched

**Versioning / Persistence Notes:**
- **NEW IndexedDB store**: `maloja-plana-audit`, version 1
- Schema: `{ id (autoIncr), type: string, actor: string, payload: object, timestamp: number }`
- Indexes: `by-type` (non-unique), `by-timestamp` (non-unique)
- **Completely separate** from existing `ordnung-ruhe-documents` (DB_VERSION=1) and `ordnung-ruhe-backups` (BACKUP_DB_VERSION=1)
- **No migration path needed** — new store, created fresh
- **Debug inspection**: DevTools → Application → IndexedDB → `maloja-plana-audit` → `entries`
- **Test dump**: `fake-indexeddb` in tests — no real browser DB needed for CI
- **Retention**: unbounded in M1.3 (retention policy added in M5.4)
- **Snapshot**: After 100 entries accumulated in dev testing, export via console:
  ```
  const db = await indexedDB.open('maloja-plana-audit');
  // ... cursor read all → JSON.stringify → copy to clipboard
  ```

**Context / Checkpoints:**
- **CP-1**: After subtask 1 — open DevTools → Application → IndexedDB → verify `maloja-plana-audit` exists with `entries` store and 2 indexes
- **CP-2**: After subtask 5 — emit 3 different event types → verify 3 entries in DB with correct types
- **CP-3**: CRITICAL — verify `ordnung-ruhe-documents` and `ordnung-ruhe-backups` still function after M1.3 merge. Run existing document upload + backup trigger → confirm no errors
- **Agent Memory State**: "Audit store operational at maloja-plana-audit. Actor convention: user/system/agent:<name>. Wildcard subscription active. Existing stores verified unaffected."
- **Evidence Point**: Entry count after test suite = expected count (no phantom writes, no lost entries)
- **Rollback**: If IndexedDB proves problematic, store interface is abstracted — could swap to localStorage JSON array without changing consumers

---

### ⚡ M1.4 — Module Registry

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/registry.js` |
| **Branch** | `feature/m1-registry` |
| **Dependencies** | M1.1 (emits `MODULE_REGISTERED`) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical** — registry pattern, Map-based lookup, idempotent registration |

**Numbered Subtasks:**

1. Implement `createRegistry(eventBus)`:
   - Internal: `new Map()` keyed by module ID
   - Returns `{ registerModule, getModules, getModule, setModuleStatus }`
2. `registerModule({ id, name, version, status = 'inactive' })`:
   - Stores in Map; if id exists, updates (idempotent)
   - Emits `MODULE_REGISTERED` with full module info
3. `getModules()` → `[{ id, name, version, status, registeredAt }]`
4. `getModule(id)` → module object or `null`
5. `setModuleStatus(id, status)`:
   - Valid statuses: `'active'`, `'inactive'`, `'error'`
   - Emits `STATE_TRANSITION` with `{ module: id, from: oldStatus, to: newStatus }`
6. Define built-in module IDs (constants):
   ```
   MODULE_IDS = { VALIDATION: 'validation', INGESTION: 'ingestion', APPROVAL: 'approval', AUDIT: 'audit' }
   ```
7. Unit tests:
   - Register → queryable
   - Duplicate registration → updates, no duplicate
   - Status change → event emitted
   - Unknown id → returns null

**Acceptance Criteria:**
- Modules self-register on init; status queryable
- Idempotent: registering same ID twice updates, doesn't duplicate
- Events emitted for register + status change
- Built-in IDs exported as constants for type-safe references

**Versioning / Persistence Notes:**
- **In-memory Map only** — registry rebuilds on each app startup
- Modules re-register during their init phase (M2–M5 each register themselves)
- Version field: human-readable string (e.g., `'1.0.0'`), not semver-enforced
- **Debug dump**: `registry.getModules()` in console shows full state
- **No IndexedDB** — registry is runtime-only, reconstructed from module initialization order

**Context / Checkpoints:**
- **CP-1**: After subtask 2 — register 'validation' module → verify `getModule('validation')` returns it → verify event bus received `MODULE_REGISTERED`
- **CP-2**: After subtask 5 — set status to 'error' → verify `getModule('validation').status === 'error'` → verify `STATE_TRANSITION` event
- **CP-3**: Verify `MODULE_IDS` constants match what M2.1, M3.3, M4.2, M5.4 will use (forward compatibility)
- **Agent Memory State**: "Registry holds 4 built-in module slots. All start 'inactive', set to 'active' when their init completes."
- **Gate Condition**: No module should register with status='active' at import time — only after successful init
- **Evidence Point**: `getModules()` output in test serves as registry snapshot

---

### 🎯 M1.5 — Dashboard System Indicator

| Field | Detail |
|-------|--------|
| **File Path** | `src/Dashboard.jsx` (modify existing) |
| **Branch** | `feature/m1-dashboard-indicator` |
| **Dependencies** | M1.4 (reads module registry) |
| **Agent** | UX Calmness (lead), Accessibility (review) |
| **Thinking Framework** | **Analytical** — aggregate status computation, visual accessibility |

**Numbered Subtasks:**

1. Import registry from `src/runtime`
2. Compute aggregate status:
   ```
   const modules = registry.getModules();
   const hasError = modules.some(m => m.status === 'error');
   const allActive = modules.every(m => m.status === 'active');
   const status = hasError ? 'error' : allActive ? 'healthy' : 'degraded';
   ```
3. Render 8px dot in dashboard header:
   ```
   style: { width:8, height:8, borderRadius:'50%',
     background: status==='healthy' ? palette.sage : status==='error' ? palette.rose : palette.gold }
   ```
4. Add `aria-label={t('dashboard.system' + capitalize(status))}`
5. Add i18n keys (all 4 locales):
   - `dashboard.systemHealthy` — en: "System healthy", de: "System gesund", fr: "Système sain", it: "Sistema sano"
   - `dashboard.systemDegraded` — en: "System degraded", de: "System eingeschränkt", fr: "Système dégradé", it: "Sistema degradato"
   - `dashboard.systemError` — en: "System error", de: "Systemfehler", fr: "Erreur système", it: "Errore di sistema"
6. Verify: dot doesn't cause layout shift (use `position:absolute` or inline-flex)
7. Verify dark mode: sage/gold/rose dots visible against dark header bg

**Acceptance Criteria:**
- Dot visible in dashboard header, correct color per aggregate
- No layout shift (existing content doesn't move)
- Accessible via aria-label in all 4 languages
- Dark mode contrast verified (dots visible)
- If registry empty (no modules registered yet) → show gold (degraded)

**Versioning / Persistence Notes:**
- No persistence — dot reads live from registry on each render
- Status recalculates on every Dashboard render (no caching)
- **Debug**: `registry.getModules()` in console shows what dot reads
- **Screenshot baseline**: capture at 1440px+375px, light+dark, for regression comparison in M6.2

**Context / Checkpoints:**
- **CP-1**: Mock registry with all active → verify sage dot
- **CP-2**: Mock one module error → verify rose dot
- **CP-3**: Mock empty registry (pre-init) → verify gold dot
- **Visual regression**: screenshot before/after at both widths + both themes
- **Agent Memory State**: "Dashboard shows runtime health. Dot is reactive to registry state. No persistence dependency."

---

## M2 — Validation Engine (Week 2–3)

### ⚡ M2.1 — Rule Schema

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/validation/ruleSchema.js` |
| **Branch** | `feature/m2-rule-schema` |
| **Dependencies** | M1.1, M1.4 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical + Computational** — type system design, schema self-validation, declarative rule definition |

**Numbered Subtasks:**

1. `mkdir -p src/runtime/validation`
2. Define rule shape (TypeScript-like doc comment):
   ```
   { id: string, field: string, type: RuleType, params?: object, message: string, severity: Severity }
   ```
3. Define `RULE_TYPES`:
   ```
   required, minLength, maxLength, pattern, email, phone, date, range, custom
   ```
4. Define `SEVERITY_LEVELS`: `error`, `warning`, `info`
5. Implement `validateRuleDefinition(rule)`:
   - Returns `{ valid: boolean, errors: string[] }`
   - Checks: id present, field present, type in RULE_TYPES, severity in SEVERITY_LEVELS, message is string
   - If type has required params (e.g., `minLength` needs `params.min`), validate those too
6. Export chapter rule sets — map existing `dataValidation.js` checks to rules:
   ```
   RULES_BASIS = [ { id:'basis-email', field:'email', type:'email', message:t('validation.invalidEmail'), severity:'error' }, ... ]
   ```
7. Register module: `registry.registerModule({ id: MODULE_IDS.VALIDATION, name: 'Validation Engine', version: '1.0.0' })`
8. Unit tests:
   - Valid rule passes `validateRuleDefinition`
   - Missing id → error
   - Unknown type → error
   - Missing required params → error
   - All chapter rule sets pass self-validation

**Acceptance Criteria:**
- Rules are JSON-serializable plain objects (no functions except `custom` type)
- Self-validation catches all malformed rules with specific error messages
- Every chapter has exported rule set with ≥3 rules
- Module registers in registry on import
- Bijection: every existing `validateField()` check in `dataValidation.js` has a corresponding rule

**Versioning / Persistence Notes:**
- Rules are **static code exports** — not persisted to IndexedDB/localStorage
- Rule sets versioned by source control (git diff shows any rule changes)
- **Mapping reference**: create `docs/architecture/validation-mapping.md` documenting which existing check maps to which rule
- **Debug dump**: `import { RULES_BASIS } from '...'` → `console.table(RULES_BASIS)` for inspection
- **Test fixture**: `tests/fixtures/sample-rules.json` — known valid + known invalid rules for regression

**Context / Checkpoints:**
- **CP-1**: After subtask 5 — pass deliberately malformed rule (missing id, unknown type, wrong severity) → verify each produces specific error string
- **CP-2**: After subtask 6 — count rules per chapter → must match count of validated fields in current `ChapterView.jsx`
- **CP-3**: Cross-reference `src/utils/dataValidation.js` line by line → every check has rule equivalent
- **Agent Memory State**: "9 rule types defined. 7 chapter rule sets exported. Self-validation covers all constraint combinations. Module registered as 'validation'."
- **Evidence Point**: `validateRuleDefinition` passing for all exported rules = proof that rule sets are well-formed
- **Gate Condition**: If `custom` type used, `params.evaluate` must be a function reference — document which customs exist and why

---

### ⚡ M2.2 — Rule Evaluator

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/validation/evaluator.js` |
| **Branch** | `feature/m2-evaluator` |
| **Dependencies** | M2.1, M1.1 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational** — pure function evaluation, deterministic output, edge case coverage |

**Numbered Subtasks:**

1. Implement `evaluateRule(rule, value, eventBus?)`:
   ```
   Returns: { ruleId, passed: boolean, value, message?: string, timestamp: number }
   ```
2. Per-type evaluator functions (all pure, no side effects):
   ```
   evalRequired(value) → value != null && value !== '' && value.trim() !== ''
   evalMinLength(value, { min }) → value.length >= min
   evalMaxLength(value, { max }) → value.length <= max
   evalPattern(value, { regex, flags? }) → new RegExp(regex, flags).test(value)
   evalEmail(value) → /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
   evalPhone(value) → /^\+?[\d\s\-()]{7,}$/.test(value)
   evalDate(value, { min?, max? }) → valid date within range
   evalRange(value, { min?, max? }) → number within range
   evalCustom(value, { evaluate }) → evaluate(value)
   ```
3. Implement `evaluateRuleSet(rules, data, eventBus?)`:
   - `data` is object: `{ [field]: value }`
   - For each rule: `evaluateRule(rule, data[rule.field])`
   - Returns array of all results
4. Event emission (if eventBus provided):
   - `passed: true` → emit `VALIDATION_PASS` with `{ ruleId, field, value }`
   - `passed: false` → emit `VALIDATION_FAIL` with `{ ruleId, field, value, message }`
5. Edge case handling:
   - `null` → fails `required`, skips others (not applicable)
   - `undefined` → same as null
   - `''` (empty string) → fails `required`, passes `pattern` (pattern tests non-empty)
   - `'   '` (whitespace) → fails `required`
   - Non-string to string rules → coerce via `String(value)` first
6. Unit tests — one test per evaluator type with pass + fail + edge cases:
   - required: '', null, undefined, '  ' → fail; 'x' → pass
   - minLength: 'ab' with min:3 → fail; 'abc' → pass
   - email: 'a@b.c' → pass; 'notanemail' → fail
   - phone: '+41 79 123 45 67' → pass; 'abc' → fail
   - pattern: with Swiss AHV regex → known valid/invalid numbers
   - batch: 5 rules over data object → verify result array length + individual results

**Acceptance Criteria:**
- **Deterministic**: same `(rule, value)` → same result, always, no randomness
- Events emitted per evaluation (when eventBus provided)
- Edge cases handled without throwing
- `evaluateRuleSet` processes all rules (no short-circuit on first fail)
- Results include timestamp for evidence

**Versioning / Persistence Notes:**
- Evaluator is **pure transform** — no persistence
- Results are ephemeral (evidence register M2.3 handles storage)
- **Debug**: `evaluateRuleSet(RULES_BASIS, testData)` in console → inspect results array
- **Regression fixture**: `tests/fixtures/validation-cases.json` — known input/output pairs from existing app behavior
- **Determinism proof**: run same evaluation 100x in test → all results identical (no timestamp variance beyond ms)

**Context / Checkpoints:**
- **CP-1**: After subtask 2 — test each evaluator individually with known Swiss data (AHV format, Swiss phone, Swiss date)
- **CP-2**: After subtask 4 — emit 5 validations → verify event bus received exactly 5 events (mix of PASS/FAIL)
- **CP-3**: **REGRESSION** — take 10 fields from current `ChapterView.jsx` that validate on blur → run through new evaluator → results must match current behavior exactly
- **Agent Memory State**: "9 evaluator functions implemented. All pure. Edge cases: null/undefined/empty/whitespace handled. Events emitted per evaluation."
- **Evidence Point**: Test fixture with 50+ input/output pairs proves bijection with existing validation
- **Gate Condition**: `evalCustom` must validate that `params.evaluate` is a function before calling

---

### ⚡🔗 M2.3 — Evidence Register

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/validation/evidenceRegister.js` |
| **Branch** | `feature/m2-evidence` |
| **Dependencies** | M2.2 (evaluation results), M1.3 (audit log store) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Analytical + Procedural** — evidence-based provenance, IndexedDB reuse, aggregation queries |

**Numbered Subtasks:**

1. Implement `registerEvidence({ ruleId, field, result, inputSnapshot, timestamp })`:
   - Writes to `maloja-plana-audit` via `logEntry()` from M1.3
   - Entry type: `'validation'`
   - Payload: `{ ruleId, field, passed: result.passed, inputSnapshot, message: result.message }`
2. `inputSnapshot`: shallow copy of value at evaluation time
   ```
   typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value
   ```
3. Implement `getEvidenceForField(field, { limit = 10 })`:
   - Query `getEntries({ type: 'validation' })` then filter by `payload.field === field`
   - Return newest-first, limited
4. Implement `getEvidenceForChapter(chapterKey)`:
   - Get all field keys for chapter (from chapter config)
   - Query evidence for each field
   - Return aggregated array
5. Implement `getValidationSummary(chapterKey)`:
   ```
   Returns: { total: number, passed: number, failed: number, warnings: number }
   ```
   - Count latest evidence per field (most recent result per unique field)
   - total = unique fields with evidence, passed = latest passed, etc.
6. Unit tests:
   - Register evidence → retrieve by field → matches
   - Multiple validations for same field → getEvidence returns newest first
   - Summary counts latest result per field (not all history)
   - Empty chapter → summary all zeros

**Acceptance Criteria:**
- Every evaluation can produce retrievable evidence
- Evidence includes input snapshot for provenance (what was the value when validated?)
- Summary counts are based on **latest** result per field (not cumulative history)
- Shares IndexedDB store with M1.3 (type-filtered, not separate store)

**Versioning / Persistence Notes:**
- Writes to **existing** `maloja-plana-audit` IndexedDB (created by M1.3)
- Uses `type='validation'` to distinguish from other audit entries
- Payload includes `inputSnapshot` — shallow copy frozen at validation time
- **Debug inspection**: DevTools → IndexedDB → `maloja-plana-audit` → filter entries where type='validation'
- **Growth concern**: each blur creates one entry. Estimated: 50 validations/session × 90 days = ~4500 entries. Well within IndexedDB limits. Pruned by M5.4 retention.
- **Cross-module dependency**: shares store with M1.3, M5.1 reads this data, M5.4 prunes it

**Context / Checkpoints:**
- **CP-1**: After subtask 1 — validate field → check IndexedDB entry has `type:'validation'` and `payload.inputSnapshot`
- **CP-2**: After subtask 5 — validate 3 fields (2 pass, 1 fail) → `getValidationSummary` returns `{ total:3, passed:2, failed:1, warnings:0 }`
- **CP-3**: Validate same field twice (first fail, then pass) → summary shows passed (uses latest)
- **CP-4**: Cross-module — verify `M1.3.getEntries({type:'validation'})` returns same data as `getEvidenceForField`
- **Agent Memory State**: "Evidence register operational. Shares maloja-plana-audit store. Summary logic uses latest-per-field. ~50 entries/session expected."
- **Evidence Point**: Summary output for test chapter = proof that aggregation logic is correct
- **Rollback**: Evidence entries are independent — deleting evidence doesn't affect other audit entries (type-separated)

---

### 🎯🔗 M2.4 — Migrate Existing Validation

| Field | Detail |
|-------|--------|
| **File Path** | `src/ChapterView.jsx`, `src/utils/dataValidation.js` |
| **Branch** | `feature/m2-migrate-validation` |
| **Dependencies** | M2.1, M2.2, M2.3 (full validation engine) |
| **Agent** | Runtime Governance + UX Calmness |
| **Thinking Framework** | **Analytical + Procedural** — migration safety, regression proof, visual non-regression |

**Numbered Subtasks:**

1. **Mapping**: Document each `validateField(key, value)` case → corresponding rule in M2.1:
   ```
   email check → rule type:'email'
   phone check → rule type:'phone'
   required check → rule type:'required'
   AHV format → rule type:'pattern' with AHV regex
   ```
2. In `ChapterView.jsx` `handleFieldBlur`:
   - Import evaluator + evidence register
   - Replace `validateField(key, value)` with `evaluateRule(ruleForField(key), value, eventBus)`
   - Call `registerEvidence(...)` with result
3. **Maintain identical error display**:
   - Same red border CSS (existing style)
   - Same error message text (from rule.message, mapped to i18n keys)
   - Same timing (on blur only, not on keystroke)
4. Add validation badge to Dashboard:
   ```
   const summary = getValidationSummary(chapter.key);
   render: "{summary.passed}/{summary.total}"
   ```
5. Style badge: small text below chapter card, `palette.mid` color, `fontSize: '10px'`
6. i18n (all 4 locales):
   - `dashboard.validationBadge` — en: "{passed}/{total} validated"
   - `dashboard.fieldsValidated` — en: "fields validated"
7. **Full regression test**: for every field type that currently validates:
   - Type known-invalid value → blur → verify same error message appears
   - Type valid value → blur → verify error clears
   - Compare behavior character-by-character with pre-migration

**Acceptance Criteria:**
- **Zero UX regression**: user sees identical behavior (same messages, same timing, same visuals)
- Evidence produced for every blur validation (verifiable in IndexedDB)
- Badge shows on dashboard per chapter
- Existing `dataValidation.js` shape-validation still works (it's separate from field validation)
- No new visual elements beyond badge

**Versioning / Persistence Notes:**
- **No new persistence** — evidence uses M2.3 (which uses `maloja-plana-audit`)
- Existing `or5_data` localStorage schema **completely unchanged**
- `dataValidation.js` shape-validation (for storage integrity) stays as-is — only field-level blur validation migrates
- **Pre-migration snapshot**: before starting M2.4, record current behavior:
  ```
  Screenshot every validated field's error state → save to tests/fixtures/validation-screenshots/
  ```
- **Regression proof file**: `tests/regression/validation-migration.test.js` — tests all previously-validating fields

**Context / Checkpoints:**
- **CP-1**: CRITICAL — before any code change, enumerate all fields that currently validate on blur. Record: field key, validation type, expected error message
- **CP-2**: After subtask 2 — blur email field with invalid value → verify same red border + same message text
- **CP-3**: After subtask 4 — fill 3 of 7 fields in basis chapter → verify badge shows "3/7 validated"
- **CP-4**: After merge — run full app, navigate all chapters, blur all fields that previously validated → zero differences
- **Agent Memory State**: "Migration complete. N fields migrated to rule engine. Zero UX regression. Evidence production verified. Badge shows per-chapter counts."
- **Evidence Point**: Before/after screenshot comparison (no visual diff) = migration proof
- **Gate Condition**: If any field shows different error text post-migration → BLOCK merge, fix mapping

---

## M3 — Source Ingestion (Week 3–5)

### ⚡ M3.1 — File Parser

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/ingestion/parser.js` |
| **Branch** | `feature/m3-parser` |
| **Dependencies** | M1.1 |
| **Agent** | Source Governance |
| **Thinking Framework** | **Computational + Procedural** — parsing algorithms, format detection, structured error handling |

**Numbered Subtasks:**

1. `mkdir -p src/runtime/ingestion`
2. `readFile(file: File)` → `Promise<string>`:
   - Uses FileReader API (`readAsText` with UTF-8)
   - Returns Promise; rejects on read error with structured error
3. `parseJSON(content: string)`:
   ```
   try { data = JSON.parse(content); return { success:true, data, errors:[] } }
   catch(e) { return { success:false, data:null, errors:[{ message: e.message, line: extractLine(e) }] } }
   ```
4. `parseCSV(content: string, { delimiter = ',', hasHeader = true })`:
   - Split by `\n`, handle `\r\n`
   - If hasHeader: first row = keys, subsequent rows = objects
   - Handle quoted fields (CSV RFC 4180)
   - Return `{ success:true, data: object[], errors:[] }`
   - On malformed row: `errors.push({ line, message })` but continue parsing valid rows
5. `detectFormat(file: File)`:
   - `.json` extension → 'json'
   - `.csv` extension → 'csv'
   - No extension: sniff first char (`{` or `[` → json, else → csv)
   - Returns `'json'` | `'csv'` | `'unknown'`
6. Handle Swiss-specific edge cases:
   - BOM character (U+FEFF) at start → strip silently
   - Semicolon delimiter (Swiss Excel exports use `;`)
   - Date formats: `DD.MM.YYYY` in CSV (Swiss convention)
7. **Never throw** — all errors as structured `{ success:false, errors:[] }`
8. Unit tests:
   - Valid JSON object → success
   - Valid JSON array → success
   - Invalid JSON → structured error with message
   - CSV with headers → array of objects
   - CSV without headers → array of arrays
   - CSV with semicolons → correct parsing with `{ delimiter: ';' }`
   - Empty file → `{ success:false, errors:[{message:'Empty file'}] }`
   - Binary/garbled → `{ success:false, errors:[{message:'...'}] }`
   - BOM → stripped, parsed correctly

**Acceptance Criteria:**
- Deterministic parsing (same file → same output)
- Structured errors with line numbers where possible
- Never throws (always returns result object)
- Swiss CSV conventions supported (`;` delimiter, BOM)
- FileReader API used correctly (async, with error handling)

**Versioning / Persistence Notes:**
- Parser is **pure transform** — no persistence, no side effects
- Input file read once into memory string, discarded after parsing
- Original file not stored (provenance hash computed in M3.3, not here)
- **Test fixtures**: `tests/fixtures/ingestion/valid.json`, `invalid.json`, `swiss-export.csv`, `bom-file.csv`, `empty.csv`
- **Debug**: `parseCSV(content, {delimiter:';'})` in console with pasted CSV content

**Context / Checkpoints:**
- **CP-1**: After subtask 3 — parse malformed JSON `{"a":}` → verify error has meaningful message (not just "Unexpected token")
- **CP-2**: After subtask 4 — parse 100-row Swiss CSV with `;` delimiter → verify all 100 objects parsed with correct keys
- **CP-3**: After subtask 6 — file starting with `﻿` → verify BOM stripped, content parsed normally
- **Agent Memory State**: "Parser handles JSON + CSV. Swiss conventions: semicolons, BOM, DD.MM.YYYY dates. Never throws. ~8 test fixtures cover edge cases."
- **Evidence Point**: Test fixture files are canonical reference for parser behavior
- **Gate Condition**: If parser encounters encoding it can't handle → return structured error, never crash

---

### M3.2 — Schema Mapper

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/ingestion/mapper.js` |
| **Branch** | `feature/m3-mapper` |
| **Dependencies** | M3.1, chapter field definitions |
| **Agent** | Source Governance |
| **Thinking Framework** | **Logical + Analytical** — field name normalization, fuzzy matching, diff computation |

**Numbered Subtasks:**

1. Define mapping shape: `{ [sourceField: string]: string (targetChapterField) }`
2. `createMapping(sourceFields: string[], targetChapter: string)`:
   - Normalize source field names: lowercase, strip `-_. `, collapse whitespace
   - Match against known chapter fields (from chapter config)
   - Auto-match by: exact match → prefix match → contains match
   - Return `{ matched: { src→target }, unmatched: string[] }`
3. `applyMapping(mapping, sourceData: object)`:
   - Transform: `{ sourceField: value }` → `{ targetField: value }`
   - Apply type coercion per target field type
4. `previewMapping(mapping, sourceData, currentData)`:
   ```
   Returns: [{ field, oldValue, newValue, changed: boolean }]
   ```
   - `changed = oldValue !== newValue`
   - Include unmapped fields as `{ field: sourceName, unmapped: true }`
5. Type coercion rules:
   - Target is number → `parseFloat(value)` (NaN → keep as string, flag warning)
   - Target is date → attempt `new Date(value)`, accept ISO + `DD.MM.YYYY` Swiss format
   - Target is boolean → `'true'/'1'/'ja'/'yes'` → true, `'false'/'0'/'nein'/'no'` → false
6. Unit tests:
   - `createMapping(['Vorname','Nachname','E-Mail'], 'basis')` → matches firstName, lastName, email
   - `applyMapping` with type coercion → numbers parsed, dates formatted
   - `previewMapping` shows only changed values as `changed: true`
   - Unmapped fields appear in preview

**Acceptance Criteria:**
- Auto-matching works for typical Swiss export field names
- Preview shows exact before/after with `changed` flag
- Type coercion handles Swiss formats (dates, boolean words)
- Unmapped fields visible (user awareness)
- Mapping is configurable (user can override auto-match in future)

**Versioning / Persistence Notes:**
- Mapper is **pure transform** — no persistence
- Mapping config is ephemeral (generated per import session)
- **Debug**: `createMapping(Object.keys(parsedData[0]), 'basis')` → inspect `matched` and `unmatched`
- **Test fixture**: `tests/fixtures/ingestion/swiss-export-fields.json` — known field names from typical Swiss exports (bank, insurance, government forms)

**Context / Checkpoints:**
- **CP-1**: After subtask 2 — test with real Swiss insurance export field names → verify reasonable auto-matching
- **CP-2**: After subtask 4 — compare preview output with actual `localStorage.getItem('or5_basis')` values → diff is accurate
- **CP-3**: Edge case — source has field `'Geburtsdatum'` → should match `'dateOfBirth'` in basis chapter
- **Agent Memory State**: "Mapper auto-matches by normalized name. Swiss coercion: DD.MM.YYYY dates, ja/nein booleans. Preview diff is accurate."
- **Evidence Point**: Preview output = exact representation of what import would change

---

### ⚡🔗 M3.3 — Ingestion Pipeline

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/ingestion/pipeline.js` |
| **Branch** | `feature/m3-pipeline` |
| **Dependencies** | M3.1, M3.2, M2.2, M1.1, M1.3 |
| **Agent** | Source Governance + Runtime Governance |
| **Thinking Framework** | **Procedural + Analytical** — staged pipeline, transaction safety, cryptographic provenance |

**Numbered Subtasks:**

1. Define pipeline stages (enum):
   ```
   STAGES = ['READ', 'PARSE', 'MAP', 'VALIDATE', 'PREVIEW', 'APPROVE', 'PERSIST', 'AUDIT']
   ```
2. Implement `createPipeline(file, chapterKey, mapping?, eventBus)`:
   - Returns `{ run(), getStatus(), abort() }`
   - Internal state: `{ currentStage, results: {}, error: null }`
3. Stage execution — sequential, halts on first error:
   ```
   READ → readFile(file) → content
   PARSE → parseJSON/parseCSV(content) → data
   MAP → applyMapping(mapping || autoMapping, data) → mappedData
   VALIDATE → evaluateRuleSet(chapterRules, mappedData) → validationResults
   PREVIEW → previewMapping(mapping, mappedData, currentData) → diff
   APPROVE → await external approval (Promise from gate)
   PERSIST → storage.set(chapterKey, mergedData)
   AUDIT → logEntry({ type:'INGESTION_COMPLETE', payload: summary })
   ```
4. SHA-256 fingerprint (computed during READ stage):
   ```
   const buffer = new TextEncoder().encode(content);
   const hash = await crypto.subtle.digest('SHA-256', buffer);
   const fingerprint = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
   ```
5. Before PERSIST: call `autoBackup.createBackup()` (existing module)
6. Events emitted:
   - `INGESTION_START` at pipeline start: `{ file: { name, size, type }, chapterKey, fingerprint }`
   - `INGESTION_COMPLETE` after AUDIT: `{ chapterKey, fieldsUpdated, fingerprint, duration }`
7. Error handling: if any stage fails, emit `INGESTION_COMPLETE` with `{ success:false, failedStage, error }`
8. Unit tests:
   - Full pipeline with valid JSON → all stages pass → data persisted
   - Parse failure → halts at PARSE, no persist
   - Validation failure → halts at VALIDATE (or continues with warnings — configurable)
   - Backup triggered before persist (mock `autoBackup.createBackup`)
   - SHA-256 matches known hash for test file

**Acceptance Criteria:**
- Pipeline halts on stage failure (no partial writes to localStorage)
- SHA-256 provenance stored in audit (fingerprint verifiable)
- Auto-backup fires before any data change
- Events emitted at start + end (success or failure)
- APPROVE stage blocks until external resolution (Promise)
- All stages observable in audit log

**Versioning / Persistence Notes:**
- **Provenance**: SHA-256 of file content stored in audit entry `payload.fingerprint`
- **Backup trigger**: calls existing `autoBackup.createBackup()` which writes to `ordnung-ruhe-backups` IndexedDB
- **Data write**: uses existing `storage.set('or5_' + chapterKey, data)` to localStorage
- **No partial writes**: if PERSIST fails, localStorage is unchanged (atomic from user perspective)
- **Pipeline state not persisted** — if user navigates away during APPROVE, pipeline is lost (must restart)
- **Debug dump during stages**:
  ```
  console.debug(`[Pipeline] Stage ${stage} ${success ? 'OK' : 'FAIL'}`, result);
  ```
- **Fingerprint verification**: `sha256sum tests/fixtures/ingestion/valid.json` in terminal should match `crypto.subtle` result

**Context / Checkpoints:**
- **CP-1**: After subtask 4 — hash known test file → compare with shell `shasum -a 256 tests/fixtures/ingestion/valid.json` → must match
- **CP-2**: After subtask 5 — trigger pipeline → verify `ordnung-ruhe-backups` has new snapshot BEFORE localStorage changes
- **CP-3**: CRITICAL — simulate PERSIST failure (mock storage.set to throw) → verify localStorage unchanged → verify error logged
- **CP-4**: After subtask 3 — halt at PARSE stage → verify no events beyond `INGESTION_START` emitted
- **Agent Memory State**: "Pipeline: 8 stages. Halts on failure. SHA-256 provenance. Backup before persist. Approval gate at stage 6. ~200ms total for typical file."
- **Evidence Point**: Audit entry with `type:'INGESTION_COMPLETE'` + `payload.fingerprint` = cryptographic proof of what was imported
- **Gate Condition**: APPROVE stage MUST receive gate resolution before proceeding. No timeout. No auto-approve.
- **Rollback**: Auto-backup snapshot created pre-persist. If import is wrong, user can restore from backup (existing restore functionality).

---

### 🎯🔗 M3.4 — Import UI

| Field | Detail |
|-------|--------|
| **File Path** | `src/ChapterView.jsx` (modify), `src/components/ImportPreview.jsx` (new) |
| **Branch** | `feature/m3-import-ui` |
| **Dependencies** | M3.3, M4.1 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Procedural + Analytical** — multi-step user flow, state management, error boundaries |

**Numbered Subtasks:**

1. Add "Import" button in ChapterView header area (after title, before fields):
   ```
   React.createElement('button', {
     onClick: () => fileInputRef.current.click(),
     'aria-label': t('chapter.importFromFile'),
     style: { padding:'6px 12px', background:palette.sky, color:'#fff', border:'none', borderRadius:'4px', fontSize:'11px' }
   }, '↗ ' + t('chapter.importFromFile'))
   ```
2. Hidden file input:
   ```
   React.createElement('input', { type:'file', accept:'.json,.csv', ref:fileInputRef, onChange:handleFile, style:{display:'none'} })
   ```
3. `handleFile(e)`: create pipeline → run READ+PARSE+MAP stages → set preview state
4. Create `ImportPreview.jsx`:
   - Props: `{ changes: [{ field, oldValue, newValue, changed }], onConfirm, onCancel, palette, t }`
   - Render bordered card (same pattern as empty states)
   - Each change row: field label + `old → new` (highlight if changed)
   - If no changes detected: show `t('import.noChanges')`
5. Confirm button triggers APPROVE+PERSIST+AUDIT stages
6. Cancel clears preview state (no side effects)
7. Success state: bordered sage card with `"✓ " + t('import.success', { count })` + monospace audit ref
8. Error state: bordered rose card with `t('import.parseError')` + first error message
9. i18n keys (all 4 locales):
   - `chapter.importFromFile` — en:"Import from file", de:"Aus Datei importieren", fr:"Importer depuis fichier", it:"Importa da file"
   - `import.preview` — en:"Preview changes", de:"Änderungen prüfen", fr:"Aperçu des changements", it:"Anteprima modifiche"
   - `import.applyChanges` — en:"Apply changes", de:"Änderungen übernehmen", fr:"Appliquer", it:"Applica modifiche"
   - `import.success` — en:"{count} fields updated", de:"{count} Felder aktualisiert", fr:"{count} champs mis à jour", it:"{count} campi aggiornati"
   - `import.parseError` — en:"Could not read file", de:"Datei konnte nicht gelesen werden", fr:"Impossible de lire le fichier", it:"Impossibile leggere il file"
   - `import.noChanges` — en:"No changes detected", de:"Keine Änderungen erkannt", fr:"Aucun changement détecté", it:"Nessuna modifica rilevata"
10. Accessibility: `role="region"` on preview, `aria-live="polite"` for success/error states
11. Mobile 375px: card full-width, buttons stack, preview scrollable within max-height

**Acceptance Criteria:**
- User can: select file → see preview → confirm → data updated → audit logged
- User can: select file → see preview → cancel → no data change
- User can: select bad file → see calm error → no data change
- Mobile-ready at 375px (no overflow)
- Accessible (keyboard navigable, screen reader announces states)
- All text through i18n

**Versioning / Persistence Notes:**
- Preview state is component-local (`useState`) — not persisted
- If user navigates away during preview → state lost (must re-select file)
- On confirm: pipeline persists to `or5_<chapter>` localStorage (via M3.3 PERSIST stage)
- **Debug**: during preview state, `console.log('[ImportPreview] changes:', changes)` to verify diff
- **Screenshot**: capture preview state for design QA baseline

**Context / Checkpoints:**
- **CP-1**: Select valid JSON → verify preview shows correct field diffs (compare with manual inspection of file)
- **CP-2**: Click confirm → verify localStorage actually updated → verify audit entry exists
- **CP-3**: Select invalid file → verify error card shows → verify localStorage UNCHANGED
- **CP-4**: Cancel → verify no side effects (no audit entry, no localStorage change)
- **CP-5**: 375px screenshot — verify no overflow, buttons stacked, preview scrollable
- **Agent Memory State**: "Import UI: 4 states (idle, preview, success, error). File picker → pipeline → preview. Confirm triggers gate (M4.1) then persist."
- **Evidence Point**: Audit entry with `INGESTION_COMPLETE` + field count = proof of successful import
- **Gate Condition**: Confirm button triggers M4.1 ApprovalGate before persist

---

## M4 — Human Approval Gates (Week 5–6)

### 🎯🔗 M4.1 — Gate Component

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/ApprovalGate.jsx` (new) |
| **Branch** | `feature/m4-gate-component` |
| **Dependencies** | M1.1 |
| **Agent** | UX Calmness (lead) + Accessibility (review) |
| **Thinking Framework** | **Procedural + Analytical** — WAI-ARIA dialog, focus management, calm UX |

**Numbered Subtasks:**

1. Modal overlay (full viewport):
   ```
   position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
   display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
   ```
2. Card inner:
   ```
   background: palette.surface, padding:'24px', borderRadius:'12px',
   maxWidth:'min(480px, 90vw)', maxHeight:'80vh', overflowY:'auto',
   border: '1px solid ' + palette.border
   ```
3. Props: `{ title, changes: [{ label, from?, to? }], onApprove: fn, onReject: fn(reason?) }`
4. Title: `<h2 id="gate-title">`  with `t('approval.thisWill')` prefix
5. Changes list: `<ul>` with each change as `<li>`: `"label: from → to"`
6. Approve button: `background: palette.sage, color:'#000', fontWeight:'600'`
7. Reject button: `background: palette.border, color: palette.text`
8. Rejection flow: on reject click → show textarea + "Confirm rejection" button
9. Escape key handler: `document.addEventListener('keydown', e => e.key==='Escape' && onReject(null))`
10. Focus trap: on mount focus approve button; Tab cycles within modal only (use `tabIndex` management)
11. ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="gate-title"`
12. i18n (4 locales):
    - `approval.thisWill` — en:"This action will:", de:"Diese Aktion wird:", fr:"Cette action va:", it:"Questa azione:"
    - `approval.approve` — en:"Approve", de:"Genehmigen", fr:"Approuver", it:"Approva"
    - `approval.reject` — en:"Reject", de:"Ablehnen", fr:"Rejeter", it:"Rifiuta"
    - `approval.reason` — en:"Reason (optional)", de:"Begründung (optional)", fr:"Raison (optionnel)", it:"Motivo (opzionale)"
    - `approval.confirmReject` — en:"Confirm rejection", de:"Ablehnung bestätigen", fr:"Confirmer le rejet", it:"Conferma rifiuto"
13. Dark mode: zero hardcoded colors (all from palette prop)
14. 375px: buttons `flex-direction:column` when viewport < 400px

**Acceptance Criteria:**
- Modal blocks all interaction with background (no click-through)
- No auto-dismiss, no timeout, no auto-approve
- Keyboard: Escape=reject, Tab cycles within modal, Enter on focused button=action
- Screen reader announces dialog title
- Dark mode: all colors from palette
- Mobile: buttons stack, modal max 90vw

**Versioning / Persistence Notes:**
- Gate is **ephemeral UI** — no persistence of gate state
- Approval/rejection result communicated via callbacks (not stored by component)
- Evidence logging happens in M4.3 (consumer layer), not in gate component
- **Debug**: add `console.debug('[ApprovalGate] mounted with', changes.length, 'changes')` and `'[ApprovalGate] result:', approved ? 'approved' : 'rejected'`

**Context / Checkpoints:**
- **CP-1**: Mount gate → verify focus lands on approve button (not background)
- **CP-2**: Press Tab 3x → verify focus cycles through (approve → reject → approve) — never reaches background
- **CP-3**: Press Escape → verify `onReject(null)` called
- **CP-4**: Click reject → textarea appears → type reason → confirm → verify `onReject('reason text')` called
- **CP-5**: Screenshot at 375px dark mode with 5 changes → verify readability
- **Agent Memory State**: "Gate component: modal with focus trap. No persistence. Callbacks: onApprove/onReject. No auto-behavior."
- **Evidence Point**: Accessibility audit (axe-core or manual Tab test) = proof of a11y compliance
- **Gate Condition**: Component itself has no gate (it IS the gate). Must never auto-resolve.

---

### ⚡ M4.2 — Gate Registry

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/gates/registry.js` |
| **Branch** | `feature/m4-gate-registry` |
| **Dependencies** | M1.4 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical** — operation classification, fail-safe defaults, Promise lifecycle |

**Numbered Subtasks:**

1. `mkdir -p src/runtime/gates`
2. Define gated operations (Set):
   ```
   GATED = new Set(['import', 'bulkEdit', 'delete', 'export', 'settingsChange', 'clearData'])
   ```
3. Define exempt operations (Set):
   ```
   EXEMPT = new Set(['fieldEdit', 'navigation', 'viewChange', 'themeToggle', 'languageChange'])
   ```
4. `requiresApproval(operationType: string)`:
   - If in GATED → true
   - If in EXEMPT → false
   - If in neither (unknown) → **true** (fail-safe: unknown operations require approval)
5. `requestApproval({ operation, changes, actor })`:
   - Returns `Promise<{ approved: boolean, reason?: string }>`
   - Promise resolves ONLY when UI gate calls resolve/reject
   - No timeout, no auto-resolve, no fallback
6. Register module: `registry.registerModule({ id: MODULE_IDS.APPROVAL, ... })`
7. Unit tests:
   - Each gated operation → `requiresApproval` true
   - Each exempt operation → `requiresApproval` false
   - Unknown `'mysteryOp'` → true (fail-safe)
   - `requestApproval` returns pending Promise (doesn't resolve immediately)
   - Resolve Promise externally → returns correct result

**Acceptance Criteria:**
- All 6 gated operations correctly identified
- All 5 exempt operations correctly identified
- Unknown operations default to gated (fail-safe)
- Promise never auto-resolves
- Module registered in registry

**Versioning / Persistence Notes:**
- In-memory only — no persistence of gate decisions (that's M4.3)
- Operation lists are hardcoded (source-controlled)
- **Debug**: `requiresApproval('delete')` in console → `true`
- Future: operation lists could be configurable (not in Phase 1)

**Context / Checkpoints:**
- **CP-1**: Test every defined gated operation → all return true
- **CP-2**: Test `'unknownAction'` → returns true (fail-safe verified)
- **CP-3**: Create `requestApproval` → verify Promise is pending after 5 seconds (no auto-resolve)
- **Agent Memory State**: "Gate registry: 6 gated ops, 5 exempt ops. Unknown = gated (fail-safe). Promise-based async flow."
- **Gate Condition**: The registry itself is the gate condition definition. If a new feature adds destructive actions, they must be added to GATED set.

---

### ⚡🔗 M4.3 — Approval Wiring + Evidence

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/gates/evidence.js`, `src/DocumentTresor.jsx`, `src/ChapterView.jsx`, `src/ZipExport.jsx` |
| **Branch** | `feature/m4-wiring` |
| **Dependencies** | M4.1, M4.2, M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural + Analytical** — hook composition, evidence chains, integration across modules |

**Numbered Subtasks:**

1. Implement `logApprovalEvidence({ operation, approved, reason?, actor, timestamp })`:
   - If approved: `logEntry({ type:'APPROVAL_GRANTED', actor, payload: { operation } })`
   - If rejected: `logEntry({ type:'APPROVAL_REJECTED', actor, payload: { operation, reason } })`
2. Create React hook `useApprovalGate(eventBus)`:
   ```
   Returns: { showGate, gateProps, requestAndWait(operation, changes) }
   requestAndWait: shows gate component, returns Promise<{approved, reason?}>
   After resolution: logs evidence automatically
   ```
3. Wire DocumentTresor delete:
   - Before `onDelete(doc.id)`: `const { approved } = await requestAndWait('delete', [{label: doc.fileName, from:'exists', to:'deleted'}])`
   - If rejected: return (no delete)
4. Wire import confirm (in ImportPreview from M3.4):
   - APPROVE stage calls `requestAndWait('import', previewChanges)`
5. Wire ZipExport:
   - Before export generation: `requestAndWait('export', [{label:'Full backup export'}])`
6. Wire any "clear data" settings button (if exists):
   - `requestAndWait('clearData', [{label:'All user data', from:'exists', to:'deleted'}])`
7. Integration tests:
   - Delete → gate → approve → doc deleted → audit has `APPROVAL_GRANTED`
   - Delete → gate → reject("test reason") → doc exists → audit has `APPROVAL_REJECTED` with reason
   - Import → gate → approve → data persisted
   - Export → gate → approve → download triggered

**Acceptance Criteria:**
- ALL destructive operations gated (no bypass path)
- Every approval → evidence in audit trail
- Every rejection → evidence in audit trail with reason
- Hook reusable across all gated components
- No UX regression for existing non-gated operations (fieldEdit, navigation, etc.)

**Versioning / Persistence Notes:**
- Evidence written to `maloja-plana-audit` IndexedDB (via M1.3)
- Entry types: `'APPROVAL_GRANTED'` and `'APPROVAL_REJECTED'`
- Payload includes `operation` type + `reason` (if rejection)
- **Debug**: After gated action, check DevTools → IndexedDB → `maloja-plana-audit` for new entry
- **Evidence chain**: Import = `INGESTION_START` → `APPROVAL_GRANTED` → `INGESTION_COMPLETE` (3 entries form chain)

**Context / Checkpoints:**
- **CP-1**: Click delete in Tresor → gate appears → approve → verify doc gone + audit entry
- **CP-2**: Click delete → gate → reject with "not sure" → verify doc still exists + audit has rejection with "not sure"
- **CP-3**: Verify hook works identically in DocumentTresor, ImportPreview, ZipExport (no component-specific logic in hook)
- **CP-4**: Verify non-gated actions (field edit, theme toggle) do NOT show gate
- **CP-5**: Evidence chain for import: verify 3 sequential audit entries with timestamps forming clear chronological chain
- **Agent Memory State**: "All destructive ops gated. Hook reusable. Evidence: GRANTED/REJECTED logged with full context. Evidence chain verifiable for multi-step operations."
- **Evidence Point**: Audit entries form provenance chain: operation requested → approval decision → operation outcome
- **Rollback**: If gate incorrectly blocks something, update GATED/EXEMPT sets in M4.2 (single point of control)

---

## M5 — Audit & Observability (Week 6–7)

### 🎯🔗 M5.1 — Audit Viewer

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/AuditViewer.jsx` (new) |
| **Branch** | `feature/m5-audit-viewer` |
| **Dependencies** | M1.3, M1.1 |
| **Agent** | UX Calmness (lead) + Runtime Governance |
| **Thinking Framework** | **Analytical + Procedural** — timeline UI, IndexedDB pagination, accessible live region |

**Numbered Subtasks:**

1. Load initial entries: `getEntries({ limit: 50 })` on mount via `useEffect`
2. Group by day: compute relative labels ("Today", "Yesterday", formatted date)
3. Entry card component:
   - Type badge: colored dot (8px) + label (validation/approval/ingestion/system)
   - Timestamp: monospace font, `HH:MM:SS` format
   - Description: human-readable summary from payload
4. Badge color mapping (using palette):
   - validation → `palette.sky`
   - approval → `palette.sage`
   - ingestion → `palette.gold`
   - system → `palette.mid`
5. Filter: `<select>` with "All", "Validation", "Approval", "Ingestion", "System"
   - onChange: re-query with type filter
6. "Load more" button at bottom:
   - Loads next 50 (offset-based)
   - Disabled when no more entries
7. Empty state: calm bordered card + icon + `t('audit.noEntries')` + hint
8. `role="log"`, `aria-label={t('audit.title')}`, `aria-live="polite"` on container
9. i18n (4 locales): `audit.title`, `audit.noEntries`, `audit.noEntriesHint`, `audit.loadMore`, `audit.filterAll`, `audit.filterValidation`, `audit.filterApproval`, `audit.filterIngestion`, `audit.filterSystem`, `audit.today`, `audit.yesterday`
10. Test 375px + dark mode: cards full-width, no overflow, colors correct

**Acceptance Criteria:**
- Shows all audit history with proper day grouping
- Filterable by type
- Paginated (50/batch) — no memory issues with large logs
- Accessible: role=log, aria-live for new entries
- Empty state matches existing warm pattern
- Dark mode correct, mobile-ready

**Versioning / Persistence Notes:**
- **Read-only** — viewer never writes to IndexedDB
- Reads from `maloja-plana-audit` via M1.3 `getEntries()` API
- Filter/pagination state: component-local useState (not persisted)
- **Debug**: `getEntries({limit:5})` in console to verify what viewer will show
- **Performance**: with 1000+ entries, cursor-based pagination prevents loading all at once

**Context / Checkpoints:**
- **CP-1**: After loading — verify day grouping correct (entries from today under "Today" header)
- **CP-2**: Filter to "Approval" → verify only approval entries shown → count matches
- **CP-3**: "Load more" → verify next batch appends (no duplicates, no missing entries)
- **CP-4**: With 200+ entries → verify no jank (smooth scroll)
- **CP-5**: Empty IndexedDB → verify empty state with hint text
- **Agent Memory State**: "Audit viewer: read-only timeline. Paginated by 50. Grouped by day. Filterable. No write operations."
- **Evidence Point**: Viewer accurately represents audit log = visual proof of all system activity

---

### 🎯 M5.2 — System Status Panel

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/SystemStatus.jsx` (new), `src/Dashboard.jsx` (modify) |
| **Branch** | `feature/m5-system-status` |
| **Dependencies** | M1.4, M1.3 |
| **Agent** | UX Calmness + Runtime Governance |
| **Thinking Framework** | **Analytical** — real-time aggregation, responsive collapse, relative time |

**Subtasks, Acceptance, Versioning, Checkpoints:** See PHASE_1_FULL_TICKETS.md M5.2 for detail. Key additions:

- **Debug**: `registry.getModules().map(m => m.id + ':' + m.status)` shows live state
- **Agent Memory State**: "4 modules displayed. Status reflects real registry. Last event from audit queries."
- **Checkpoint**: Mock module error state → verify rose dot + "Error" text

---

### M5.3 — Audit Export

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/AuditViewer.jsx` (modify) |
| **Branch** | `feature/m5-audit-export` |
| **Dependencies** | M5.1, M4.2 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural** — gated export flow, blob generation, meta-audit |

**Key additions:**
- **Meta-audit**: Export itself creates an audit entry (`type:'SYSTEM', payload:{action:'audit_exported', entryCount}`)
- **Debug**: After export, verify JSON file opens in editor + verify `maloja-plana-audit` has new "exported" entry
- **Checkpoint**: Export with gate → reject → verify no file downloaded + rejection logged

---

### M5.4 — Retention Policy

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/auditLog.js` (modify) |
| **Branch** | `feature/m5-retention` |
| **Dependencies** | M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational** — time-based lifecycle, boundary math, self-referential logging |

**Key additions:**
- **Boundary test**: entry at exactly 90 days → KEEP (inclusive boundary)
- **Debug**: `pruneEntries(1)` → should delete everything older than 24h (useful for testing)
- **Settings storage**: `or5_settings.auditRetention` in existing localStorage object (no new key pattern)
- **Checkpoint**: Insert entries at 89, 90, 91 days ago → prune(90) → verify 91 deleted, 89+90 kept

---

### 🎯 M5.5 — System Navigation Tab

| Field | Detail |
|-------|--------|
| **File Path** | `src/App.jsx`, `src/MobileNav.jsx`, `src/SystemView.jsx` (new), `src/utils/hashRouter.js` |
| **Branch** | `feature/m5-system-nav` |
| **Dependencies** | M5.1, M5.2 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Procedural** — routing integration, component composition |

**Key additions:**
- **hashRouter.js modification**: add `'system'` to `VALID_VIEWS` Set
- **Nav order**: Dashboard → Chapters → Calendar → **System** → (Settings if exists)
- **Debug**: navigate to `#/system` manually in URL bar → verify view renders
- **Checkpoint**: Back button from `#/system` → returns to previous view

---

## M6 — Integration & Polish (Week 7–8)

### ⚡🔗 M6.1 — E2E Integration Tests

| Field | Detail |
|-------|--------|
| **File Path** | `tests/e2e/` (new directory) |
| **Branch** | `feature/m6-e2e` |
| **Dependencies** | All M1–M5 |
| **Agent** | Release Safety |
| **Thinking Framework** | **Analytical + Procedural** — integration verification, deterministic fixtures, offline simulation |

**Key additions:**
- **Test fixtures**: static JSON/CSV files in `tests/fixtures/` with known SHA-256 hashes
- **IndexedDB mock**: `fake-indexeddb` devDependency for CI (no real browser DB)
- **Determinism proof**: each test produces identical audit trail on every run
- **Checkpoint**: Run all E2E → green → then manually verify one flow in browser DevTools for confidence

---

### 🎯 M6.2 — Mobile QA (375px)

**Thinking Framework**: **Analytical** — systematic viewport testing, touch target verification

**Key additions:**
- **44px minimum touch targets**: all buttons must meet this
- **Screenshot baseline**: save 375px screenshots of every new component → `docs/qa/mobile-screenshots/`
- **Checkpoint**: `document.documentElement.scrollWidth > window.innerWidth` at each view → must be false

---

### 🎯 M6.3 — Dark Mode QA

**Thinking Framework**: **Analytical** — color audit, contrast verification

**Key additions:**
- **Automated check**: `grep -rn '#[0-9a-fA-F]' src/components/Approval* src/components/Audit* src/components/System* src/components/Import*` → must return empty
- **Contrast target**: WCAG AA (4.5:1 for text, 3:1 for large text/UI)
- **Checkpoint**: Toggle dark mode → navigate every new component → no invisible/unreadable text

---

### M6.4 — Architecture Decision Records

**Thinking Framework**: **Logical** — decision justification, alternative evaluation

**Key additions:**
- Each ADR must answer: "Why not the obvious alternative?"
  - Event bus: why not Redux? (overkill, dependency, not governance-native)
  - Validation: why not Zod? (dependency, not JSON-serializable rules)
  - Audit: why not localStorage? (size limits, no indexing, no cursor pagination)
  - Gates: why not browser `confirm()`? (not accessible, not customizable, no evidence)
  - Pipeline: why not single function? (not observable, not auditable, no stage halt)

---

### ⚡ M6.5 — Performance Verification

**Thinking Framework**: **Computational** — budget enforcement, regression detection

**Key additions:**
- **Build budget**: 200 KB gzip (current: 126 KB, budget allows +74 KB for all Phase 1)
- **Listener leak test**: mount/unmount 100 cycles → `eventBus._debug.listeners.size === 0`
- **IndexedDB growth**: 50 validations/session × 90 days = ~4500 entries × ~200 bytes = ~900 KB (within limits)
- **Checkpoint**: THIS IS RELEASE GATE. If any metric fails → fix before merge to main.
- **Baseline record**: save to `docs/architecture/performance-baseline.md`:
  ```
  Phase 1 post-merge:
  - Build: XXX KB gzip
  - Lighthouse: XX/100
  - IndexedDB: ~XXX entries after test suite
  - Listener count after unmount: 0
  ```

---

## Cross-Cutting Context

### IndexedDB Store Map (Phase 1 complete state)

| Store Name | Created By | Purpose | Retention |
|------------|-----------|---------|-----------|
| `ordnung-ruhe-documents` | Existing (pre-Phase 1) | Document file blobs | Permanent |
| `ordnung-ruhe-backups` | Existing (pre-Phase 1) | Auto-backup snapshots (max 3) | Rolling 3 |
| `maloja-plana-audit` | M1.3 (new) | Audit trail + validation evidence | 90 days default (M5.4) |

### localStorage Key Map

| Key Pattern | Purpose | Modified By Phase 1? |
|-------------|---------|---------------------|
| `or5_data` | Chapter field data | Yes (M3.3 PERSIST writes here) |
| `or5_settings` | User preferences | Yes (M5.4 adds `auditRetention`) |
| `or5_last_backup` | Backup timestamp | No (existing) |
| `or5_docs` | Document metadata | No (existing) |

### Event Flow Diagram (Phase 1 complete)

```
User Action → Event Bus → Audit Logger (wildcard)
                ↓                    ↓
         [Module Handler]    [IndexedDB write]
                ↓
         State Machine
                ↓
         [Gate check] → ApprovalGate UI → [approve/reject]
                ↓                              ↓
         [Execute action]              [Log evidence]
                ↓
         [Persist to localStorage]
                ↓
         [Emit completion event]
                ↓
         [Audit log: operation complete]
```

### Agent Memory State Summary (after Phase 1)

```
Runtime Governance: "Event bus + state machine + audit log + module registry operational.
  All state transitions audited. All destructive operations gated."

Source Governance: "File parser (JSON/CSV) + schema mapper + ingestion pipeline.
  SHA-256 provenance. Swiss formats handled. Pipeline halts on failure."

UX Calmness: "Approval gate is calm (no urgency). Audit viewer is readable.
  System status is non-intrusive. All new UI uses palette. Mobile-ready."

Accessibility: "All new buttons have aria-labels. Gate has focus trap.
  Audit viewer has role=log. System nav is keyboard accessible."

Release Safety: "Build < 200KB. No new deps. No memory leaks. All E2E pass.
  Offline works. Dark mode correct. Mobile 375px verified."
```
