# Maloja Plana — Phase 1 Detailed Dev Tasks

**Reference**: [PHASE_1_ROADMAP.md](PHASE_1_ROADMAP.md)  
**Branch strategy**: `feature/<milestone>-<module>` → merge to `dev`  
**Constraint**: zero new runtime dependencies, offline-only, < 200 KB gzip

---

## M1 — Runtime Foundation (Week 1–2)

### M1.1 Event Bus

**File**: `src/runtime/events.js`  
**Branch**: `feature/m1-event-bus`  
**Dependencies**: none (first primitive)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Create `src/runtime/` directory | Empty, establishes module boundary |
| 2 | Implement typed event emitter | `createEventBus()` returns `{ emit, on, off }` |
| 3 | Define event type enum | `VALIDATION_PASS`, `VALIDATION_FAIL`, `STATE_TRANSITION`, `APPROVAL_REQUESTED`, `APPROVAL_GRANTED`, `APPROVAL_REJECTED`, `INGESTION_START`, `INGESTION_COMPLETE`, `AUDIT_ENTRY`, `MODULE_REGISTERED` |
| 4 | Add wildcard listener support | `on('*', handler)` for audit logger |
| 5 | Write unit tests | Event fire/receive, unsubscribe, wildcard, no memory leaks |
| 6 | Export from `src/runtime/index.js` | Barrel file for all runtime exports |

**Acceptance**: `npm test` passes, events fire synchronously, no DOM coupling.

---

### M1.2 State Machine

**File**: `src/runtime/stateMachine.js`  
**Branch**: `feature/m1-state-machine`  
**Dependencies**: M1.1 (emits `STATE_TRANSITION` events)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Implement `createStateMachine(config)` | Config: `{ initial, states: { [name]: { on: { [event]: target } } } }` |
| 2 | Add transition guards | `guard: (context) => boolean` — transition only if guard returns true |
| 3 | Add `onTransition` hook | Fires event bus `STATE_TRANSITION` with `{ from, to, event, timestamp }` |
| 4 | Implement `getState()` and `canTransition(event)` | Query current state, check if transition valid |
| 5 | Define chapter field lifecycle states | `empty → draft → validated → approved` |
| 6 | Define document lifecycle states | `uploaded → validated → active → expired → archived` |
| 7 | Write unit tests | Valid/invalid transitions, guards, event emission |

**Acceptance**: FSM rejects invalid transitions, emits events on valid ones, guards block correctly.

---

### M1.3 Audit Logger

**File**: `src/runtime/auditLog.js`  
**Branch**: `feature/m1-audit-log`  
**Dependencies**: M1.1 (subscribes to wildcard events)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Create IndexedDB store `maloja-plana-audit` | Separate from existing document/backup stores |
| 2 | Implement `logEntry({ type, actor, payload, timestamp })` | Append-only write to IndexedDB |
| 3 | Implement `getEntries({ since, until, type, limit })` | Query with filters, newest-first default |
| 4 | Implement `getEntryCount()` | For status display |
| 5 | Subscribe to event bus wildcard | Auto-log all emitted events |
| 6 | Add `actor` field convention | `'user'` for manual actions, `'system'` for automated, `'agent:<name>'` for agent actions |
| 7 | Write unit tests | Write, read, filter, count, IndexedDB mock |

**Acceptance**: Every event bus emission produces an audit entry. Entries are retrievable and filterable.

**Note**: IndexedDB store name `maloja-plana-audit` (new store, no migration needed).

---

### M1.4 Module Registry

**File**: `src/runtime/registry.js`  
**Branch**: `feature/m1-registry`  
**Dependencies**: M1.1 (emits `MODULE_REGISTERED`)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Implement `registerModule({ id, name, version, status })` | Stores module metadata in memory map |
| 2 | Implement `getModules()` and `getModule(id)` | Query registered modules |
| 3 | Implement `setModuleStatus(id, status)` | `'active'` / `'inactive'` / `'error'` |
| 4 | Emit `MODULE_REGISTERED` on registration | For audit trail |
| 5 | Define built-in modules | `validation`, `ingestion`, `approval`, `audit` |
| 6 | Write unit tests | Register, query, status change, duplicate prevention |

**Acceptance**: Modules self-register at init. Status queryable. Event emitted.

---

### M1.5 Dashboard System Indicator

**File**: `src/Dashboard.jsx` (modify existing)  
**Branch**: `feature/m1-dashboard-indicator`  
**Dependencies**: M1.4 (reads module registry)  
**Agent**: UX Calmness (review)

| # | Task | Details |
|---|------|---------|
| 1 | Add system health dot to dashboard header | Small dot: sage=all active, gold=degraded, rose=error |
| 2 | Use module registry to determine status | If all modules active → sage, any error → rose, else gold |
| 3 | Add tooltip or aria-label | `t('dashboard.systemHealthy')` / `t('dashboard.systemDegraded')` |
| 4 | Add i18n keys (en/de/fr/it) | `dashboard.systemHealthy`, `dashboard.systemDegraded`, `dashboard.systemError` |
| 5 | Verify dark mode | Dot colors readable in both themes |

**Acceptance**: Green dot visible on dashboard. No layout shift. Accessible.

---

## M2 — Validation Engine (Week 2–3)

### M2.1 Rule Schema

**File**: `src/runtime/validation/ruleSchema.js`  
**Branch**: `feature/m2-rule-schema`  
**Dependencies**: M1.1 (events), M1.4 (registers as module)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Create `src/runtime/validation/` directory | Module boundary |
| 2 | Define rule shape | `{ id, field, type, params, message, severity }` |
| 3 | Define rule types | `required`, `minLength`, `maxLength`, `pattern`, `email`, `phone`, `date`, `range`, `custom` |
| 4 | Define severity levels | `error`, `warning`, `info` |
| 5 | Implement `validateRuleDefinition(rule)` | Schema self-validation (rules about rules) |
| 6 | Export chapter field rule sets | One rule set per chapter (persönlich, wohnen, finanzen, etc.) |
| 7 | Write unit tests | Valid/invalid rule definitions, all types covered |

**Acceptance**: Rules are plain JSON objects. Self-validation catches malformed rules.

---

### M2.2 Rule Evaluator

**File**: `src/runtime/validation/evaluator.js`  
**Branch**: `feature/m2-evaluator`  
**Dependencies**: M2.1 (rule schema), M1.1 (emits events)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Implement `evaluateRule(rule, value)` | Returns `{ ruleId, passed, value, message, timestamp }` |
| 2 | Implement `evaluateRuleSet(rules, data)` | Batch evaluate, returns array of results |
| 3 | Implement per-type evaluators | One function per rule type (required, pattern, etc.) |
| 4 | Emit `VALIDATION_PASS` / `VALIDATION_FAIL` events | With rule ID and field reference |
| 5 | Handle edge cases | `null`, `undefined`, empty string, whitespace-only |
| 6 | Write unit tests | Each rule type, edge cases, batch evaluation |

**Acceptance**: Evaluator produces deterministic results. Same input → same output always.

---

### M2.3 Evidence Register

**File**: `src/runtime/validation/evidenceRegister.js`  
**Branch**: `feature/m2-evidence`  
**Dependencies**: M2.2 (receives evaluation results), M1.3 (logs to audit)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Implement `registerEvidence({ ruleId, field, result, inputSnapshot, timestamp })` | Stores validation evidence |
| 2 | Store in IndexedDB `maloja-plana-audit` (same store, type=`validation`) | Reuses audit store with type filter |
| 3 | Implement `getEvidenceForField(field, { limit })` | Query evidence history per field |
| 4 | Implement `getEvidenceForChapter(chapterKey)` | Aggregate evidence per chapter |
| 5 | Implement `getValidationSummary(chapterKey)` | Returns `{ total, passed, failed, warnings }` |
| 6 | Write unit tests | Store, retrieve, filter, summary calculation |

**Acceptance**: Every validation run produces retrievable evidence with full context.

---

### M2.4 Migrate Existing Validation

**File**: `src/ChapterView.jsx` (modify), `src/utils/dataValidation.js` (modify)  
**Branch**: `feature/m2-migrate-validation`  
**Dependencies**: M2.1, M2.2, M2.3 (full validation engine ready)  
**Agent**: Runtime Governance + UX Calmness (review)

| # | Task | Details |
|---|------|---------|
| 1 | Map existing `validateField()` logic to rule schema | Convert inline checks to declarative rules |
| 2 | Wire `handleFieldBlur` to call evaluator | Blur triggers rule evaluation instead of inline checks |
| 3 | Store evidence on each blur validation | Evidence register captures every validation |
| 4 | Maintain identical error display | Red border + error message — no visual change |
| 5 | Add chapter validation badge to dashboard | Shows `"3/12 validated"` per chapter |
| 6 | Add i18n keys | `dashboard.validationBadge`, `dashboard.fieldsValidated` |
| 7 | Regression test | All existing blur behaviors still work identically |

**Acceptance**: User experience unchanged. Behind the scenes, validation produces evidence. Badge appears.

---

## M3 — Source Ingestion (Week 3–5)

### M3.1 File Parser

**File**: `src/runtime/ingestion/parser.js`  
**Branch**: `feature/m3-parser`  
**Dependencies**: M1.1 (events)  
**Agent**: Source Governance

| # | Task | Details |
|---|------|---------|
| 1 | Create `src/runtime/ingestion/` directory | Module boundary |
| 2 | Implement `parseJSON(fileContent)` | Parse JSON string, return structured data or error |
| 3 | Implement `parseCSV(fileContent, { delimiter, hasHeader })` | Parse CSV with configurable delimiter |
| 4 | Implement `detectFormat(file)` | Auto-detect JSON vs CSV from file extension + content sniff |
| 5 | Implement `readFile(file)` | FileReader wrapper returning Promise<string> |
| 6 | Error handling | Return `{ success, data, errors }` — never throw |
| 7 | Write unit tests | Valid/invalid JSON, CSV with/without headers, edge cases |

**Acceptance**: Parses local files deterministically. Errors are structured, not thrown.

---

### M3.2 Schema Mapper

**File**: `src/runtime/ingestion/mapper.js`  
**Branch**: `feature/m3-mapper`  
**Dependencies**: M3.1 (parsed data), chapter field definitions  
**Agent**: Source Governance

| # | Task | Details |
|---|------|---------|
| 1 | Define mapping config shape | `{ sourceField: targetChapterField }` pairs |
| 2 | Implement `createMapping(sourceFields, targetChapter)` | Generate default mapping by field name matching |
| 3 | Implement `applyMapping(mapping, sourceData)` | Transform source data to chapter field format |
| 4 | Implement `previewMapping(mapping, sourceData, currentData)` | Returns `[{ field, oldValue, newValue }]` diff |
| 5 | Handle type coercion | String→number for budget fields, date parsing |
| 6 | Write unit tests | Mapping creation, application, preview, type coercion |

**Acceptance**: User can preview exact field changes before committing. Mapping is configurable.

---

### M3.3 Ingestion Pipeline

**File**: `src/runtime/ingestion/pipeline.js`  
**Branch**: `feature/m3-pipeline`  
**Dependencies**: M3.1, M3.2, M2.2 (validation), M1.1 (events), M1.3 (audit)  
**Agent**: Source Governance + Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Define pipeline stages | `read → parse → map → validate → preview → approve → persist → audit` |
| 2 | Implement `createPipeline(file, chapterKey, mapping)` | Returns pipeline instance |
| 3 | Implement stage execution | Each stage emits event, returns result or error |
| 4 | Compute file SHA-256 fingerprint | `crypto.subtle.digest` — stored as provenance |
| 5 | Trigger auto-backup before persist | Uses existing `autoBackup.js` |
| 6 | Emit `INGESTION_START` and `INGESTION_COMPLETE` events | For audit and UI state |
| 7 | Write unit tests | Full pipeline, stage failure handling, rollback trigger |

**Acceptance**: Pipeline stages are observable, auditable, and halt on failure.

---

### M3.4 Import UI

**Files**: `src/ChapterView.jsx` (modify), `src/components/ImportPreview.jsx` (new)  
**Branch**: `feature/m3-import-ui`  
**Dependencies**: M3.3 (pipeline), M4.1 (approval gate — or implement inline confirm first)  
**Agent**: UX Calmness + Accessibility

| # | Task | Details |
|---|------|---------|
| 1 | Add "Import" button to chapter view header | Icon + `t('chapter.importFromFile')` label |
| 2 | Implement file picker trigger | `<input type="file" accept=".json,.csv">` hidden, button triggers click |
| 3 | Create `ImportPreview.jsx` component | Shows field diff: `[field] current → new` |
| 4 | Style preview as bordered card | Same pattern as existing empty states |
| 5 | Add confirm/cancel buttons | "Apply changes" / "Cancel" |
| 6 | Show success state with audit reference | "Imported 5 fields. Ref: #audit-123" |
| 7 | Show error state for parse failures | Calm red card: "Could not read file. Check format." |
| 8 | Add i18n keys (en/de/fr/it) | `chapter.importFromFile`, `import.preview`, `import.applyChanges`, `import.success`, `import.parseError`, `import.noChanges` |
| 9 | Add aria-labels | File input, confirm button, cancel button, preview region |
| 10 | Test at 375px | Preview card stacks vertically, buttons full-width |

**Acceptance**: User can import JSON/CSV into chapter fields with full preview. Works on mobile. Accessible.

---

## M4 — Human Approval Gates (Week 5–6)

### M4.1 Gate Component

**File**: `src/components/ApprovalGate.jsx` (new)  
**Branch**: `feature/m4-gate-component`  
**Dependencies**: M1.1 (events)  
**Agent**: UX Calmness (lead) + Accessibility (review)

| # | Task | Details |
|---|------|---------|
| 1 | Create modal overlay component | Centered, semi-transparent backdrop, palette.surface card |
| 2 | Implement props interface | `{ title, changes: [{ label, from, to }], onApprove, onReject }` |
| 3 | Render change list | Bullet list of proposed changes |
| 4 | "Approve" button | `palette.sage` background, `t('approval.approve')` |
| 5 | "Reject" button | `palette.border` background, `t('approval.reject')` |
| 6 | Optional rejection reason textarea | Appears on reject click, then "Confirm rejection" |
| 7 | Escape key closes (= reject without reason) | `onKeyDown` handler |
| 8 | Focus trap inside modal | Tab cycles through approve/reject/reason only |
| 9 | aria-modal, role="dialog", aria-labelledby | Full a11y |
| 10 | Add i18n keys (en/de/fr/it) | `approval.approve`, `approval.reject`, `approval.title`, `approval.reason`, `approval.confirmReject`, `approval.thisWill` |
| 11 | Test dark mode | Modal card uses palette, no hardcoded colors |
| 12 | Test 375px | Modal is max-width 90vw, buttons stack vertically on narrow |

**Acceptance**: Clean, calm modal. Fully accessible. No auto-dismiss. Keyboard navigable.

---

### M4.2 Gate Registry

**File**: `src/runtime/gates/registry.js`  
**Branch**: `feature/m4-gate-registry`  
**Dependencies**: M1.4 (module registry)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Create `src/runtime/gates/` directory | Module boundary |
| 2 | Define gate-required operations | `import`, `bulkEdit`, `delete`, `export`, `settingsChange`, `clearData` |
| 3 | Define gate-exempt operations | `fieldEdit`, `navigation`, `viewChange`, `themeToggle`, `languageChange` |
| 4 | Implement `requiresApproval(operationType)` | Returns boolean |
| 5 | Implement `requestApproval({ operation, changes, actor })` | Returns Promise that resolves on approve/reject |
| 6 | Write unit tests | Gate/exempt classification, request lifecycle |

**Acceptance**: Operations correctly classified. Gate blocks execution until resolved.

---

### M4.3 Approval Evidence + Wiring

**File**: `src/runtime/gates/evidence.js`, modify existing components  
**Branch**: `feature/m4-wiring`  
**Dependencies**: M4.1, M4.2, M1.3 (audit log)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Log approval events to audit | `{ type: 'APPROVAL_GRANTED', operation, actor: 'user', timestamp }` |
| 2 | Log rejection events to audit | `{ type: 'APPROVAL_REJECTED', operation, reason, actor: 'user', timestamp }` |
| 3 | Wire delete buttons in DocumentTresor | Delete triggers gate before `onDelete(doc.id)` |
| 4 | Wire import confirm in M3.4 | Import preview confirm triggers gate |
| 5 | Wire ZipExport | Export triggers gate before generation |
| 6 | Wire Settings clear-data button (if exists) | Destructive settings gated |
| 7 | Integration test | Delete → gate appears → approve → deleted → audit logged |

**Acceptance**: All destructive operations gated. Evidence in audit trail for every decision.

---

## M5 — Audit & Observability (Week 6–7)

### M5.1 Audit Viewer

**File**: `src/components/AuditViewer.jsx` (new)  
**Branch**: `feature/m5-audit-viewer`  
**Dependencies**: M1.3 (audit log data), M1.1 (events)  
**Agent**: UX Calmness (lead) + Runtime Governance (review)

| # | Task | Details |
|---|------|---------|
| 1 | Create timeline component | Vertical list, newest first |
| 2 | Group entries by day | Date header: "Today", "Yesterday", or formatted date |
| 3 | Render entry card | Type badge (color-coded) + timestamp (monospace) + description |
| 4 | Type badge colors | validation=sky, approval=sage, ingestion=gold, system=mid |
| 5 | Implement filter dropdown | Filter by event type, default "all" |
| 6 | Implement pagination/scroll | Load 50 entries, "Load more" button at bottom |
| 7 | Empty state | If no entries: calm card "No activity recorded yet" |
| 8 | Add i18n keys (en/de/fr/it) | `audit.title`, `audit.noEntries`, `audit.loadMore`, `audit.filterAll`, `audit.filterValidation`, `audit.filterApproval`, `audit.filterIngestion`, `audit.filterSystem`, `audit.today`, `audit.yesterday` |
| 9 | aria-labels + landmark | `role="log"`, `aria-label=t('audit.title')` |
| 10 | Test 375px + dark mode | Cards stack, colors correct |

**Acceptance**: User sees full audit history. Filterable. Accessible. Calm visual design.

---

### M5.2 System Status Panel

**File**: `src/components/SystemStatus.jsx` (new), `src/Dashboard.jsx` (modify)  
**Branch**: `feature/m5-system-status`  
**Dependencies**: M1.4 (module registry), M1.3 (audit log for "last event")  
**Agent**: UX Calmness + Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Create status card per module | Module name + status dot + last event timestamp |
| 2 | Status dot colors | active=sage, inactive=mid, error=rose |
| 3 | Add to dashboard below existing content | New section: "System" with module cards grid |
| 4 | Query module registry for status | Real-time status from registry |
| 5 | Query audit log for last event per module | Most recent entry of each type |
| 6 | Add i18n keys | `system.title`, `system.active`, `system.inactive`, `system.error`, `system.lastEvent`, `system.noEvents` |
| 7 | Collapsible on mobile | Section starts collapsed, "Show system status" toggle |
| 8 | Test dark mode | All dots/cards use palette |

**Acceptance**: User sees module health at a glance. Non-intrusive on mobile.

---

### M5.3 Audit Export

**File**: modify `src/components/AuditViewer.jsx`  
**Branch**: `feature/m5-audit-export`  
**Dependencies**: M5.1, M4.2 (export requires gate)  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Add "Export" button to audit viewer | `t('audit.export')` label |
| 2 | Trigger approval gate | Export is a gated operation |
| 3 | Generate JSON blob | All entries (or filtered subset) as JSON array |
| 4 | Trigger browser download | `application/json`, filename `maloja-plana-audit-YYYY-MM-DD.json` |
| 5 | Log export event to audit | Meta: "audit exported" entry |
| 6 | Exclude document blobs from export | Only metadata, never file content |

**Acceptance**: User can export audit history. Export itself is gated and logged.

---

### M5.4 Retention Policy

**File**: `src/runtime/auditLog.js` (modify)  
**Branch**: `feature/m5-retention`  
**Dependencies**: M1.3  
**Agent**: Runtime Governance

| # | Task | Details |
|---|------|---------|
| 1 | Add `pruneEntries(olderThanDays)` function | Deletes entries beyond retention window |
| 2 | Default retention: 90 days | Configurable via settings |
| 3 | Run prune on app startup | After audit log init, before UI render |
| 4 | Log prune event | "Pruned N entries older than X days" |
| 5 | Add settings UI toggle | `t('settings.auditRetention')` with 30/60/90/180/365 options |
| 6 | Write unit tests | Prune logic, boundary dates, empty-store case |

**Acceptance**: Audit store stays bounded. User controls retention. Prune is itself logged.

---

### M5.5 Navigation: System Tab

**File**: `src/App.jsx` (modify), `src/MobileNav.jsx` (modify)  
**Branch**: `feature/m5-system-nav`  
**Dependencies**: M5.1, M5.2 (components to route to)  
**Agent**: UX Calmness + Accessibility

| # | Task | Details |
|---|------|---------|
| 1 | Add `#/system` route to hash router | New valid view in `VALID_VIEWS` set |
| 2 | Create `src/SystemView.jsx` | Composes AuditViewer + SystemStatus |
| 3 | Add nav item to MobileNav | Icon + `t('nav.system')` label |
| 4 | Add i18n keys | `nav.system` (en: "System", de: "System", fr: "Système", it: "Sistema") |
| 5 | Position in nav order | After Calendar, before Settings (if settings exists) |
| 6 | Verify active state styling | Consistent with other nav items |

**Acceptance**: System view accessible via navigation. Route works. Mobile nav shows item.

---

## M6 — Integration & Polish (Week 7–8)

### M6.1 E2E Integration Flow

**Branch**: `feature/m6-e2e`  
**Dependencies**: All M1–M5 modules  
**Agent**: Release Safety (lead)

| # | Task | Details |
|---|------|---------|
| 1 | Write E2E test: import flow | File select → parse → preview → approve → persist → audit entry |
| 2 | Write E2E test: delete flow | Delete click → gate → approve → deleted → audit entry |
| 3 | Write E2E test: validation flow | Field blur → rule eval → evidence stored → badge updated |
| 4 | Write E2E test: rejection flow | Gate → reject with reason → no state change → rejection logged |
| 5 | Verify audit completeness | All state transitions in tests produce audit entries |
| 6 | Verify offline behavior | Disconnect network → all flows still work |

**Acceptance**: All critical paths work end-to-end. No silent failures.

---

### M6.2 Mobile QA (375px)

**Branch**: `feature/m6-mobile-qa`  
**Dependencies**: All new UI components  
**Agent**: Accessibility + UX Calmness

| # | Task | Details |
|---|------|---------|
| 1 | Test import preview at 375px | Card stacks, buttons full-width, scrollable |
| 2 | Test approval gate modal at 375px | Max-width 90vw, buttons stack, reason field usable |
| 3 | Test audit viewer at 375px | Entries readable, filter accessible |
| 4 | Test system status at 375px | Cards stack, collapsible section works |
| 5 | Test system nav item | Fits in mobile nav, no overflow |
| 6 | Fix any overflow/truncation issues | No horizontal scroll on any new component |

**Acceptance**: All new UI fully functional at 375px viewport.

---

### M6.3 Dark Mode QA

**Branch**: `feature/m6-dark-mode`  
**Dependencies**: All new UI components  
**Agent**: UX Calmness

| # | Task | Details |
|---|------|---------|
| 1 | Verify import preview | Card borders, text colors use palette correctly |
| 2 | Verify approval gate modal | Backdrop, card, buttons all palette-aware |
| 3 | Verify audit viewer | Badges, timestamps, cards readable in dark mode |
| 4 | Verify system status | Dots visible, cards contrasted |
| 5 | Verify all new i18n text | No hardcoded colors anywhere |

**Acceptance**: No contrast issues. No hardcoded colors in new components.

---

### M6.4 Documentation

**Branch**: `feature/m6-docs`  
**Dependencies**: All modules implemented  
**Agent**: Runtime Governance + Release Safety

| # | Task | Details |
|---|------|---------|
| 1 | ADR: Event bus design | `docs/architecture/adr-001-event-bus.md` |
| 2 | ADR: Validation engine | `docs/architecture/adr-002-validation-engine.md` |
| 3 | ADR: Ingestion pipeline | `docs/architecture/adr-003-ingestion-pipeline.md` |
| 4 | ADR: Approval gates | `docs/architecture/adr-004-approval-gates.md` |
| 5 | ADR: Audit log storage | `docs/architecture/adr-005-audit-storage.md` |
| 6 | Update ARCHITECTURE_INDEX.md | Link all new ADRs |
| 7 | Update PROJECT_STATUS.md | Reflect Phase 1 completion |

**Acceptance**: Every architectural decision documented with context, decision, and consequences.

---

### M6.5 Performance Verification

**Branch**: `feature/m6-performance`  
**Dependencies**: All modules  
**Agent**: Release Safety

| # | Task | Details |
|---|------|---------|
| 1 | Measure build size | Must be < 200 KB gzip |
| 2 | Measure initial load time | Lighthouse or manual (< 2s on 3G) |
| 3 | Profile IndexedDB usage | Audit store growth under typical usage |
| 4 | Check for memory leaks | Event bus listeners cleaned up on unmount |
| 5 | Verify no new runtime deps | `package.json` dependencies unchanged |

**Acceptance**: No performance regression. Build budget maintained.

---

## Dependency Graph

```
M1.1 Event Bus (no deps)
  ├── M1.2 State Machine
  ├── M1.3 Audit Logger
  ├── M1.4 Module Registry
  │     └── M1.5 Dashboard Indicator
  └── M2.1 Rule Schema
        └── M2.2 Evaluator
              └── M2.3 Evidence Register
                    └── M2.4 Migrate Validation
                          
M3.1 File Parser (depends: M1.1)
  └── M3.2 Schema Mapper
        └── M3.3 Ingestion Pipeline (depends: M2.2, M1.3)
              └── M3.4 Import UI (depends: M4.1)

M4.1 Gate Component (depends: M1.1)
  └── M4.2 Gate Registry
        └── M4.3 Wiring (depends: M4.1, M4.2, M1.3)

M5.1 Audit Viewer (depends: M1.3)
M5.2 System Status (depends: M1.4, M1.3)
M5.3 Audit Export (depends: M5.1, M4.2)
M5.4 Retention Policy (depends: M1.3)
M5.5 System Nav (depends: M5.1, M5.2)

M6.* (depends: all above)
```

---

## Execution Order (Critical Path)

```
Week 1:  M1.1 → M1.2 → M1.3 → M1.4
Week 2:  M1.5 + M2.1 → M2.2 → M2.3
Week 3:  M2.4 + M3.1 → M3.2
Week 4:  M3.3 + M4.1 → M4.2
Week 5:  M3.4 + M4.3
Week 6:  M5.1 → M5.2 → M5.3 → M5.4 → M5.5
Week 7:  M6.1 → M6.2 → M6.3
Week 8:  M6.4 → M6.5 → Release prep
```

---

## i18n Keys Required (All Milestones)

Total new keys estimated: ~35 per language

| Milestone | Keys |
|-----------|------|
| M1 | 3 (system health) |
| M2 | 2 (validation badge) |
| M3 | 6 (import workflow) |
| M4 | 6 (approval gate) |
| M5 | 12 (audit viewer + system status + nav) |
| M6 | 0 (polish only) |

All keys must be added to `src/i18n/en.js`, `de.js`, `fr.js`, `it.js` simultaneously.
