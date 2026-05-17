# Maloja Plana — Phase 1 Ticket Table

> Copy-paste-ready developer tickets. Critical path marked with ⚡. UX/Observability tasks marked with 🎯.

---

## M1 — Runtime Foundation (Week 1–2)

| Task ID | Task Name | File Path / Component | Branch | Dependencies | Agent | Subtasks | Acceptance Criteria |
|---------|-----------|----------------------|--------|--------------|-------|----------|---------------------|
| ⚡ M1.1 | Event Bus | `src/runtime/events.js` | `feature/m1-event-bus` | — (none) | Runtime Governance | 1. Create `src/runtime/` dir 2. Implement `createEventBus()` → `{ emit, on, off }` 3. Define event type enum (`VALIDATION_PASS`, `VALIDATION_FAIL`, `STATE_TRANSITION`, `APPROVAL_REQUESTED`, `APPROVAL_GRANTED`, `APPROVAL_REJECTED`, `INGESTION_START`, `INGESTION_COMPLETE`, `AUDIT_ENTRY`, `MODULE_REGISTERED`) 4. Add wildcard `on('*', handler)` 5. Write unit tests (fire/receive, unsub, wildcard, no leaks) 6. Create barrel `src/runtime/index.js` | `npm test` passes; events fire synchronously; no DOM coupling; wildcard receives all events |
| ⚡ M1.2 | State Machine | `src/runtime/stateMachine.js` | `feature/m1-state-machine` | M1.1 | Runtime Governance | 1. Implement `createStateMachine(config)` with `{ initial, states: { [name]: { on: { [event]: target } } } }` 2. Add `guard: (ctx) => bool` transition guards 3. Fire `STATE_TRANSITION` via event bus on valid transition 4. Implement `getState()` + `canTransition(event)` 5. Define field lifecycle: `empty→draft→validated→approved` 6. Define doc lifecycle: `uploaded→validated→active→expired→archived` 7. Unit tests (valid/invalid, guards, events) | FSM rejects invalid transitions; emits events on valid; guards block correctly |
| ⚡ M1.3 | Audit Logger | `src/runtime/auditLog.js` | `feature/m1-audit-log` | M1.1 | Runtime Governance | 1. Create IndexedDB store `maloja-plana-audit` (new, separate store) 2. Implement `logEntry({ type, actor, payload, timestamp })` append-only 3. Implement `getEntries({ since, until, type, limit })` newest-first 4. Implement `getEntryCount()` 5. Subscribe to event bus wildcard → auto-log all events 6. Actor convention: `'user'` / `'system'` / `'agent:<name>'` 7. Unit tests (write, read, filter, count) | Every event bus emission → audit entry; entries retrievable + filterable |
| ⚡ M1.4 | Module Registry | `src/runtime/registry.js` | `feature/m1-registry` | M1.1 | Runtime Governance | 1. Implement `registerModule({ id, name, version, status })` 2. Implement `getModules()` + `getModule(id)` 3. Implement `setModuleStatus(id, status)` (`active`/`inactive`/`error`) 4. Emit `MODULE_REGISTERED` on register 5. Define built-in modules: `validation`, `ingestion`, `approval`, `audit` 6. Unit tests (register, query, status, duplicate prevention) | Modules self-register; status queryable; event emitted on registration |
| 🎯 M1.5 | Dashboard System Indicator | `src/Dashboard.jsx` | `feature/m1-dashboard-indicator` | M1.4 | UX Calmness | 1. Add health dot to dashboard header (sage=healthy, gold=degraded, rose=error) 2. Read module registry → compute aggregate status 3. Add aria-label: `t('dashboard.systemHealthy')` etc. 4. Add i18n keys (en/de/fr/it): `dashboard.systemHealthy`, `dashboard.systemDegraded`, `dashboard.systemError` 5. Verify dark mode contrast | Green dot visible; no layout shift; accessible; dark mode correct |

---

## M2 — Validation Engine (Week 2–3)

| Task ID | Task Name | File Path / Component | Branch | Dependencies | Agent | Subtasks | Acceptance Criteria |
|---------|-----------|----------------------|--------|--------------|-------|----------|---------------------|
| ⚡ M2.1 | Rule Schema | `src/runtime/validation/ruleSchema.js` | `feature/m2-rule-schema` | M1.1, M1.4 | Runtime Governance | 1. Create `src/runtime/validation/` dir 2. Define rule shape: `{ id, field, type, params, message, severity }` 3. Define types: `required`, `minLength`, `maxLength`, `pattern`, `email`, `phone`, `date`, `range`, `custom` 4. Define severity: `error`, `warning`, `info` 5. Implement `validateRuleDefinition(rule)` self-validation 6. Export chapter field rule sets (one per chapter) 7. Unit tests (valid/invalid defs, all types) | Rules are JSON objects; self-validation catches malformed; all chapter rules exportable |
| ⚡ M2.2 | Rule Evaluator | `src/runtime/validation/evaluator.js` | `feature/m2-evaluator` | M2.1, M1.1 | Runtime Governance | 1. Implement `evaluateRule(rule, value)` → `{ ruleId, passed, value, message, timestamp }` 2. Implement `evaluateRuleSet(rules, data)` batch mode 3. Per-type evaluator functions 4. Emit `VALIDATION_PASS`/`VALIDATION_FAIL` events 5. Handle null/undefined/empty/whitespace 6. Unit tests per type + edge cases | Deterministic: same input → same output; events emitted per evaluation |
| ⚡ M2.3 | Evidence Register | `src/runtime/validation/evidenceRegister.js` | `feature/m2-evidence` | M2.2, M1.3 | Runtime Governance | 1. Implement `registerEvidence({ ruleId, field, result, inputSnapshot, timestamp })` 2. Store in `maloja-plana-audit` IndexedDB (type=`validation`) 3. Implement `getEvidenceForField(field, { limit })` 4. Implement `getEvidenceForChapter(chapterKey)` 5. Implement `getValidationSummary(chapterKey)` → `{ total, passed, failed, warnings }` 6. Unit tests (store, retrieve, filter, summary) | Every validation produces retrievable evidence; summary computable per chapter |
| 🎯 M2.4 | Migrate Existing Validation | `src/ChapterView.jsx`, `src/utils/dataValidation.js` | `feature/m2-migrate-validation` | M2.1, M2.2, M2.3 | Runtime Governance + UX Calmness | 1. Convert inline `validateField()` to declarative rule schema 2. Wire `handleFieldBlur` → evaluator call 3. Store evidence on each blur validation 4. Maintain identical error display (red border + message) 5. Add validation badge to dashboard: `"3/12 validated"` 6. Add i18n: `dashboard.validationBadge`, `dashboard.fieldsValidated` 7. Regression test all blur behaviors | UX unchanged; evidence produced behind scenes; badge shows on dashboard |

---

## M3 — Source Ingestion (Week 3–5)

| Task ID | Task Name | File Path / Component | Branch | Dependencies | Agent | Subtasks | Acceptance Criteria |
|---------|-----------|----------------------|--------|--------------|-------|----------|---------------------|
| ⚡ M3.1 | File Parser | `src/runtime/ingestion/parser.js` | `feature/m3-parser` | M1.1 | Source Governance | 1. Create `src/runtime/ingestion/` dir 2. Implement `parseJSON(fileContent)` 3. Implement `parseCSV(fileContent, { delimiter, hasHeader })` 4. Implement `detectFormat(file)` (extension + content sniff) 5. Implement `readFile(file)` → Promise\<string\> via FileReader 6. Error shape: `{ success, data, errors }` — never throw 7. Unit tests (valid/invalid JSON, CSV ±headers, edge cases) | Deterministic parsing; structured errors; never throws |
| M3.2 | Schema Mapper | `src/runtime/ingestion/mapper.js` | `feature/m3-mapper` | M3.1 | Source Governance | 1. Define mapping shape: `{ sourceField: targetChapterField }` 2. Implement `createMapping(sourceFields, targetChapter)` auto-match by name 3. Implement `applyMapping(mapping, sourceData)` → chapter format 4. Implement `previewMapping(mapping, sourceData, currentData)` → `[{ field, old, new }]` 5. Type coercion (string→number, date parsing) 6. Unit tests (create, apply, preview, coercion) | Preview shows exact changes; mapping configurable; type coercion works |
| ⚡ M3.3 | Ingestion Pipeline | `src/runtime/ingestion/pipeline.js` | `feature/m3-pipeline` | M3.1, M3.2, M2.2, M1.1, M1.3 | Source Governance + Runtime Governance | 1. Define stages: `read→parse→map→validate→preview→approve→persist→audit` 2. Implement `createPipeline(file, chapterKey, mapping)` 3. Each stage emits event + returns result or error 4. SHA-256 fingerprint via `crypto.subtle.digest` for provenance 5. Trigger `autoBackup.js` before persist 6. Emit `INGESTION_START`/`INGESTION_COMPLETE` 7. Unit tests (full pipeline, stage failure, rollback) | Stages observable + auditable; halts on failure; provenance stored |
| 🎯 M3.4 | Import UI | `src/ChapterView.jsx`, `src/components/ImportPreview.jsx` (new) | `feature/m3-import-ui` | M3.3, M4.1 | UX Calmness + Accessibility | 1. Add "Import" button in chapter header with icon + `t('chapter.importFromFile')` 2. Hidden `<input type="file" accept=".json,.csv">` triggered by button 3. Create `ImportPreview.jsx`: field diff `[field] current → new` 4. Style as bordered card (existing empty-state pattern) 5. Confirm/Cancel buttons 6. Success state: "Imported N fields. Ref: #audit-XXX" 7. Error state: calm card "Could not read file" 8. i18n (en/de/fr/it): `chapter.importFromFile`, `import.preview`, `import.applyChanges`, `import.success`, `import.parseError`, `import.noChanges` 9. aria-labels on all controls 10. Test 375px (stack, full-width buttons) | Import JSON/CSV into fields with preview; mobile-ready; accessible; calm error handling |

---

## M4 — Human Approval Gates (Week 5–6)

| Task ID | Task Name | File Path / Component | Branch | Dependencies | Agent | Subtasks | Acceptance Criteria |
|---------|-----------|----------------------|--------|--------------|-------|----------|---------------------|
| 🎯 M4.1 | Gate Component | `src/components/ApprovalGate.jsx` (new) | `feature/m4-gate-component` | M1.1 | UX Calmness + Accessibility | 1. Modal overlay: centered, semi-transparent backdrop, palette.surface card 2. Props: `{ title, changes: [{ label, from, to }], onApprove, onReject }` 3. Render change list as bullets 4. "Approve" btn (palette.sage) + "Reject" btn (palette.border) 5. Rejection reason textarea (appears on reject) 6. Escape key = reject without reason 7. Focus trap (Tab cycles approve/reject/reason) 8. `aria-modal`, `role="dialog"`, `aria-labelledby` 9. i18n: `approval.approve`, `approval.reject`, `approval.title`, `approval.reason`, `approval.confirmReject`, `approval.thisWill` 10. Dark mode: palette only, no hardcoded colors 11. 375px: max-width 90vw, buttons stack | Calm modal; no auto-dismiss; fully accessible; keyboard navigable; dark+mobile ready |
| ⚡ M4.2 | Gate Registry | `src/runtime/gates/registry.js` | `feature/m4-gate-registry` | M1.4 | Runtime Governance | 1. Create `src/runtime/gates/` dir 2. Gate-required: `import`, `bulkEdit`, `delete`, `export`, `settingsChange`, `clearData` 3. Gate-exempt: `fieldEdit`, `navigation`, `viewChange`, `themeToggle`, `languageChange` 4. Implement `requiresApproval(opType)` → bool 5. Implement `requestApproval({ operation, changes, actor })` → Promise (resolve on approve/reject) 6. Unit tests (classification, lifecycle) | Correct classification; gate blocks until resolved; never auto-approves |
| ⚡ M4.3 | Approval Wiring | `src/runtime/gates/evidence.js`, existing components | `feature/m4-wiring` | M4.1, M4.2, M1.3 | Runtime Governance | 1. Log `APPROVAL_GRANTED` to audit (operation, actor, timestamp) 2. Log `APPROVAL_REJECTED` to audit (+reason) 3. Wire DocumentTresor delete → gate 4. Wire import confirm → gate 5. Wire ZipExport → gate 6. Wire Settings clear-data → gate 7. Integration test: delete→gate→approve→deleted→audit | All destructive ops gated; evidence in audit for every decision |

---

## M5 — Audit & Observability (Week 6–7)

| Task ID | Task Name | File Path / Component | Branch | Dependencies | Agent | Subtasks | Acceptance Criteria |
|---------|-----------|----------------------|--------|--------------|-------|----------|---------------------|
| 🎯 M5.1 | Audit Viewer | `src/components/AuditViewer.jsx` (new) | `feature/m5-audit-viewer` | M1.3, M1.1 | UX Calmness + Runtime Governance | 1. Vertical timeline, newest first 2. Group by day ("Today"/"Yesterday"/date) 3. Entry card: type badge (color) + monospace timestamp + description 4. Badge colors: validation=sky, approval=sage, ingestion=gold, system=mid 5. Filter dropdown by type (default "all") 6. Pagination: 50 entries + "Load more" 7. Empty state: calm card "No activity recorded yet" 8. i18n: `audit.title`, `audit.noEntries`, `audit.loadMore`, `audit.filterAll`/`Validation`/`Approval`/`Ingestion`/`System`, `audit.today`, `audit.yesterday` 9. `role="log"` + aria-label 10. Test 375px + dark mode | Full history visible; filterable; accessible; calm design; mobile-ready |
| 🎯 M5.2 | System Status Panel | `src/components/SystemStatus.jsx` (new), `src/Dashboard.jsx` | `feature/m5-system-status` | M1.4, M1.3 | UX Calmness + Runtime Governance | 1. Status card per module (name + dot + last event time) 2. Dot: active=sage, inactive=mid, error=rose 3. Grid below dashboard content, section header "System" 4. Read from module registry + audit log last event 5. i18n: `system.title`, `system.active`, `system.inactive`, `system.error`, `system.lastEvent`, `system.noEvents` 6. Collapsible on mobile (starts collapsed) 7. Dark mode verified | Module health visible; non-intrusive on mobile; palette-only colors |
| M5.3 | Audit Export | `src/components/AuditViewer.jsx` (modify) | `feature/m5-audit-export` | M5.1, M4.2 | Runtime Governance | 1. "Export" button with `t('audit.export')` 2. Trigger approval gate before export 3. Generate JSON blob (entries array) 4. Browser download: `maloja-plana-audit-YYYY-MM-DD.json` 5. Log export event to audit trail 6. Exclude document blobs | Export gated + logged; JSON only (no blobs); download works offline |
| M5.4 | Retention Policy | `src/runtime/auditLog.js` (modify) | `feature/m5-retention` | M1.3 | Runtime Governance | 1. `pruneEntries(olderThanDays)` function 2. Default 90 days, configurable 3. Run on app startup (after init, before render) 4. Log prune event itself 5. Settings UI: `t('settings.auditRetention')` with 30/60/90/180/365 6. Unit tests (prune, boundaries, empty store) | Store bounded; user controls TTL; prune is logged |
| 🎯 M5.5 | System Navigation Tab | `src/App.jsx`, `src/MobileNav.jsx`, `src/SystemView.jsx` (new) | `feature/m5-system-nav` | M5.1, M5.2 | UX Calmness + Accessibility | 1. Add `#/system` to `VALID_VIEWS` in hash router 2. Create `SystemView.jsx` composing AuditViewer + SystemStatus 3. Nav item in MobileNav with icon + `t('nav.system')` 4. i18n: `nav.system` (en/de/fr/it) 5. Position after Calendar, before Settings 6. Active state styling consistent | Route works; nav item visible; mobile nav correct |

---

## M6 — Integration & Polish (Week 7–8)

| Task ID | Task Name | File Path / Component | Branch | Dependencies | Agent | Subtasks | Acceptance Criteria |
|---------|-----------|----------------------|--------|--------------|-------|----------|---------------------|
| ⚡ M6.1 | E2E Integration Tests | test files | `feature/m6-e2e` | All M1–M5 | Release Safety | 1. E2E: import flow (file→parse→preview→approve→persist→audit) 2. E2E: delete flow (click→gate→approve→deleted→audit) 3. E2E: validation flow (blur→eval→evidence→badge) 4. E2E: rejection flow (gate→reject+reason→no change→logged) 5. Verify audit completeness (all transitions logged) 6. Verify offline (disconnect→all flows work) | All critical paths pass E2E; no silent failures; offline verified |
| 🎯 M6.2 | Mobile QA (375px) | All new components | `feature/m6-mobile-qa` | All new UI | Accessibility + UX Calmness | 1. Import preview: stacks, full-width buttons, scrollable 2. Approval modal: 90vw, buttons stack, reason usable 3. Audit viewer: entries readable, filter accessible 4. System status: cards stack, collapsible works 5. System nav: fits, no overflow 6. Fix any horizontal scroll issues | All new UI functional at 375px; no overflow; no truncation |
| 🎯 M6.3 | Dark Mode QA | All new components | `feature/m6-dark-mode` | All new UI | UX Calmness | 1. Import preview: borders + text via palette 2. Approval modal: backdrop, card, buttons palette-aware 3. Audit viewer: badges, timestamps readable 4. System status: dots visible, cards contrasted 5. All text uses palette.text/palette.mid | No contrast issues; zero hardcoded colors in new code |
| M6.4 | Architecture Decision Records | `docs/architecture/adr-001..005.md` | `feature/m6-docs` | All modules | Runtime Governance + Release Safety | 1. ADR-001: Event bus design 2. ADR-002: Validation engine 3. ADR-003: Ingestion pipeline 4. ADR-004: Approval gates 5. ADR-005: Audit log storage 6. Update `ARCHITECTURE_INDEX.md` 7. Update `PROJECT_STATUS.md` | Every decision documented (context, decision, consequences) |
| ⚡ M6.5 | Performance Verification | build output, Lighthouse | `feature/m6-performance` | All modules | Release Safety | 1. Build size < 200 KB gzip 2. Initial load < 2s on 3G 3. IndexedDB growth profiled (typical usage) 4. Event bus: no listener leaks on unmount 5. `package.json` dependencies unchanged | No performance regression; budget maintained; zero new deps |

---

## Critical Path Summary

```
⚡ CRITICAL PATH (blocking):

W1: M1.1 → M1.2 → M1.3 → M1.4
W2: M2.1 → M2.2 → M2.3
W3: M2.4 + M3.1 → M3.2
W4: M3.3 + M4.1 → M4.2
W5: M3.4 + M4.3
W6: M5.1 → M5.5
W7: M6.1 → M6.2
W8: M6.5 → Release

PARALLEL TRACKS (non-blocking):
- M1.5 can start after M1.4 (parallel to M2)
- M4.1 can start after M1.1 (parallel to M3)
- M5.2, M5.3, M5.4 can run parallel to M5.1
- M6.2, M6.3, M6.4 run in parallel
```

---

## Dependency Matrix

| Task | Blocks | Blocked By |
|------|--------|------------|
| M1.1 | M1.2, M1.3, M1.4, M2.1, M3.1, M4.1 | — |
| M1.2 | — | M1.1 |
| M1.3 | M2.3, M3.3, M4.3, M5.1, M5.2, M5.4 | M1.1 |
| M1.4 | M1.5, M2.1, M4.2, M5.2 | M1.1 |
| M1.5 | — | M1.4 |
| M2.1 | M2.2 | M1.1, M1.4 |
| M2.2 | M2.3, M3.3 | M2.1 |
| M2.3 | M2.4 | M2.2, M1.3 |
| M2.4 | — | M2.1, M2.2, M2.3 |
| M3.1 | M3.2 | M1.1 |
| M3.2 | M3.3 | M3.1 |
| M3.3 | M3.4 | M3.1, M3.2, M2.2, M1.3 |
| M3.4 | — | M3.3, M4.1 |
| M4.1 | M3.4, M4.3 | M1.1 |
| M4.2 | M4.3, M5.3 | M1.4 |
| M4.3 | — | M4.1, M4.2, M1.3 |
| M5.1 | M5.3, M5.5 | M1.3 |
| M5.2 | M5.5 | M1.4, M1.3 |
| M5.3 | — | M5.1, M4.2 |
| M5.4 | — | M1.3 |
| M5.5 | — | M5.1, M5.2 |
| M6.1 | — | All M1–M5 |
| M6.2 | — | All new UI |
| M6.3 | — | All new UI |
| M6.4 | — | All modules |
| M6.5 | — | All modules |
