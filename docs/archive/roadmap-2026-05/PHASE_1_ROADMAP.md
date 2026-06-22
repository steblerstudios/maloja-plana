# Maloja Plana — Phase 1 Roadmap

**Start**: after Alpha stabilization (accessibility, mobile QA, export QA)  
**Duration**: 6–8 weeks estimated  
**Branch strategy**: feature branches off dev, merge to dev, periodic dev→main cuts

---

## Vision for Phase 1

Transform the current personal life organizer into a **governance-native runtime** with:
- Structured source ingestion (local files first)
- Configurable validation with evidence output
- Human approval gates before state transitions
- Local audit trail for all changes
- Module registry showing system capabilities

All offline. No server. No external dependencies.

---

## Milestones

### M1 — Runtime Foundation (Week 1–2)

**Goal**: Core runtime primitives that all modules build on.

| Task | Deliverable | Acceptance |
|------|-------------|------------|
| Event bus | `src/runtime/events.js` — typed local event emitter | Events fire, listeners receive, no side effects |
| State machine | `src/runtime/stateMachine.js` — generic FSM with transition guards | States transition only on valid events |
| Audit logger | `src/runtime/auditLog.js` — append-only IndexedDB log | Every state transition logged with timestamp + actor |
| Module registry | `src/runtime/registry.js` — register/query capabilities | Modules self-register, dashboard shows status |

**UX**: No visible UI changes yet. Dashboard gets a subtle "System" indicator (green dot = healthy).

**Constraints**:
- Zero new dependencies
- All primitives work synchronously where possible
- IndexedDB for audit log only (separate store)
- Event bus is in-memory only (no persistence of event queue)

---

### M2 — Validation Engine (Week 2–3)

**Goal**: Configurable rule-based validation that produces traceable evidence.

| Task | Deliverable | Acceptance |
|------|-------------|------------|
| Rule schema | `src/runtime/validation/ruleSchema.js` — rule definition format | Rules are declarative JSON objects |
| Rule evaluator | `src/runtime/validation/evaluator.js` — runs rules against data | Returns pass/fail + evidence per rule |
| Evidence register | `src/runtime/validation/evidenceRegister.js` — stores results | Each validation run produces retrievable evidence |
| Chapter field rules | Migrate existing field validation to rule engine | Existing blur-validation still works identically |

**UX**: Field validation visually unchanged. New: validation badge per chapter on dashboard ("3/12 fields validated").

**Constraints**:
- Existing UX must not regress
- Rules are data, not code (JSON-serializable)
- Evidence includes: rule ID, input snapshot, result, timestamp
- No breaking changes to existing chapter data

---

### M3 — Source Ingestion (Week 3–5)

**Goal**: Import structured local files into the system with validation.

| Task | Deliverable | Acceptance |
|------|-------------|------------|
| File parser | `src/runtime/ingestion/parser.js` — JSON/CSV file reading | Reads files dropped or selected by user |
| Schema mapper | `src/runtime/ingestion/mapper.js` — maps source fields to chapters | Mapping configurable, preview before commit |
| Ingestion pipeline | `src/runtime/ingestion/pipeline.js` — acquire→validate→store | Pipeline stages fire events, produce evidence |
| Import UI | Chapter view gets "Import from file" option | User can import structured data into chapter fields |

**UX**:
- Drag-drop zone or file picker in chapter view
- Preview screen: "These fields will be updated" with before/after
- Confirm button (human approval gate)
- Success state with audit reference

**Constraints**:
- Local files only (no network fetch)
- User must confirm before data changes
- Original file fingerprint (SHA-256) stored as provenance
- Rollback possible via auto-backup

---

### M4 — Human Approval Gates (Week 5–6)

**Goal**: Explicit confirmation UI for all state-changing operations.

| Task | Deliverable | Acceptance |
|------|-------------|------------|
| Gate component | `src/components/ApprovalGate.jsx` — modal confirmation | Shows what will change, requires explicit action |
| Gate registry | `src/runtime/gates/registry.js` — which operations require approval | Configurable per operation type |
| Approval evidence | Gate completion logs to audit trail | Every approved action has evidence entry |
| Rejection flow | User can reject with reason | Rejection logged, no state change occurs |

**UX**:
- Clean modal: "This action will…" + bullet list of changes
- Two buttons: "Approve" (green) / "Reject" (neutral)
- Optional reason field on rejection
- Calm design, no urgency pressure

**Constraints**:
- Gates block execution until resolved (no timeout auto-approve)
- Gate required for: import, bulk edit, delete, export, settings change
- Not required for: field-level typing, navigation, view changes

---

### M5 — Audit & Observability (Week 6–7)

**Goal**: User-visible audit trail and system health display.

| Task | Deliverable | Acceptance |
|------|-------------|------------|
| Audit viewer | `src/components/AuditViewer.jsx` — read-only event timeline | Shows recent events with type, timestamp, actor |
| System status | Dashboard module status panel | Each module shows: active/inactive + last event |
| Export audit | Audit log exportable as JSON | User can download full audit history |
| Retention policy | Auto-prune events older than configurable window | Default 90 days, user-adjustable |

**UX**:
- New "System" tab in navigation (alongside Dashboard, Chapters, etc.)
- Timeline view: newest first, grouped by day
- Filter by event type (validation, approval, ingestion, system)
- Status cards for each module with health indicator

**Constraints**:
- Read-only UI (no editing audit entries)
- Audit data in separate IndexedDB store
- Export does not include document blobs (privacy)
- Works offline, no external logging

---

### M6 — Integration & Polish (Week 7–8)

**Goal**: Modules work together end-to-end. Documentation complete.

| Task | Deliverable | Acceptance |
|------|-------------|------------|
| E2E flow | Import file → validate → approve → persist → audit | Full pipeline works without errors |
| Mobile QA | All new UI works at 375px | No layout breaks or inaccessible elements |
| Dark mode QA | All new components theme-aware | Consistent with existing palette system |
| Documentation | Architecture decision records for all new modules | docs/architecture/ updated |
| Performance | No regression in build size or load time | Build stays under 200 KB gzip |

---

## UX / Workflow Optimizations

### Current Pain Points → Phase 1 Solutions

| Pain Point | Current | Phase 1 Solution |
|------------|---------|-------------------|
| No import path | Manual field entry only | File import with preview + approval |
| Invisible validation | Blur-only, per-field | Chapter-level validation badges + evidence |
| No change history | User can't see what changed when | Audit timeline with event details |
| No system transparency | App state is opaque | Module status panel on dashboard |
| Destructive actions | Delete without review | Approval gate with rollback reference |
| No bulk operations | One field at a time | Import maps multiple fields at once |

### Workflow Improvements

1. **Import workflow**: File → Preview → Approve → Persist → Confirm
2. **Validation workflow**: Edit → Blur → Rule evaluation → Badge update → Evidence stored
3. **Delete workflow**: Delete request → Gate → Confirm → Execute → Audit log
4. **Export workflow**: Select scope → Gate → Generate → Download → Audit log

### Design Principles for New UI

- Same calm palette (no new colors)
- Same component patterns (bordered cards, 12px hint text)
- Approval gate: centered modal, no animation, clear escape
- Audit viewer: monospace timestamps, subtle type badges
- System status: traffic-light dots (sage/gold/rose from existing palette)

---

## Dev / Agent Orchestration Tasks

### Agent Roles in Phase 1 Development

Based on the Agent Operating Model, each milestone assigns agent responsibilities:

| Agent | M1 | M2 | M3 | M4 | M5 | M6 |
|-------|----|----|----|----|----|----|
| Runtime Governance | Lead | Support | Support | Lead | Lead | Review |
| Source Governance | — | — | Lead | Support | — | Review |
| Accessibility | — | — | — | Review | Review | QA |
| UX Calmness | — | Review | Review | Lead | Review | QA |
| Release Safety | — | — | — | — | — | Lead |

### Task Breakdown for Agent Orchestration

#### Sprint 1 (M1 + M2 start)

```
[ ] Runtime Governance Agent: define event schema
[ ] Runtime Governance Agent: define state machine transitions
[ ] Runtime Governance Agent: specify audit log format
[ ] Runtime Governance Agent: design module registry interface
[ ] UX Calmness Agent: review validation badge design
```

#### Sprint 2 (M2 + M3 start)

```
[ ] Runtime Governance Agent: validate rule schema completeness
[ ] Source Governance Agent: define ingestion pipeline stages
[ ] Source Governance Agent: specify provenance metadata
[ ] UX Calmness Agent: review import preview UX
[ ] UX Calmness Agent: ensure calm error states for parsing failures
```

#### Sprint 3 (M3 + M4)

```
[ ] Source Governance Agent: verify file parser coverage (JSON, CSV)
[ ] Runtime Governance Agent: define approval gate requirements
[ ] UX Calmness Agent: design approval modal (calm, clear, no urgency)
[ ] Accessibility Agent: audit new components for a11y
```

#### Sprint 4 (M5 + M6)

```
[ ] Runtime Governance Agent: verify audit log completeness
[ ] UX Calmness Agent: review audit viewer for readability
[ ] Accessibility Agent: full QA pass on all new UI
[ ] Release Safety Agent: pre-release checklist
[ ] Release Safety Agent: verify build size, test coverage, mobile QA
```

### Orchestration Rules

1. **No agent acts without human review** — agents propose, humans approve
2. **Sequential milestones** — M1 must ship before M3 starts (M2 can overlap M1)
3. **Evidence required** — each agent output links to specific acceptance criteria
4. **Escalation** — if agent recommendation conflicts with governance rules, human decides
5. **Isolation** — agents work on bounded modules, no cross-module changes without review
6. **Audit** — agent actions logged in same audit trail as user actions

### Dev Workflow per Milestone

```
1. Agent proposes implementation plan (scope, files, acceptance)
2. Human reviews and approves plan
3. Implementation on feature branch
4. Agent runs QA checks (tests, build, a11y, mobile)
5. Human reviews diff
6. Merge to dev
7. Smoke test on dev
8. Document decisions in architecture records
```

---

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| Audit IndexedDB store grows unbounded | Retention policy with configurable TTL |
| Import parser fails on edge cases | Preview step catches errors before persist |
| Approval fatigue (too many gates) | Only gate destructive/bulk operations |
| Build size growth | Budget cap at 200 KB gzip, monitor per milestone |
| Existing UX regression | Full regression QA in M6, blur-validation unchanged |

---

## Success Criteria (Phase 1 Complete)

- [ ] File import works for JSON and CSV into chapter fields
- [ ] Validation rules produce traceable evidence
- [ ] Human approval gate blocks unapproved destructive actions
- [ ] Audit log captures all state transitions
- [ ] System status visible on dashboard
- [ ] All operations work fully offline
- [ ] Zero new runtime dependencies
- [ ] Build under 200 KB gzip
- [ ] Mobile-ready (375px) for all new UI
- [ ] Dark mode consistent for all new components
- [ ] 100% of new interactive elements have aria-labels
