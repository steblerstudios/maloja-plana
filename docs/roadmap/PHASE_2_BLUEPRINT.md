# Maloja Plana — Phase 2 Blueprint

> **Workflow Engine, Agent Layer & Team Governance**

| Meta | Value |
|------|-------|
| **Version** | 0.1.0 (Draft) |
| **Date** | 2026-05-17 |
| **Author** | Sophie Stebler / Stebler Studios |
| **Prerequisite** | Phase 1 complete (all M1–M6 release gates passed) |
| **Duration** | 8–12 weeks estimated |
| **Branch Strategy** | `feature/p2-<milestone>-<module>` → `dev` → `main` |
| **Constraints** | Offline-first, < 250 KB gzip, zero mandatory server, Phase 1 primitives unchanged |

> Legend: ⚡ = Critical Path | 🎯 = UX/Observability | 🔗 = High Context | 🆕 = Net-New Capability

---

## Table of Contents

1. [Phase 1 Analysis & Transition Notes](#1-phase-1-analysis--transition-notes)
2. [Phase 2 Vision](#2-phase-2-vision)
3. [Architecture Evolution](#3-architecture-evolution)
4. [Milestone Map (P2.M1–P2.M7)](#4-milestone-map)
5. [Critical Path & Parallel Tracks](#5-critical-path--parallel-tracks)
6. [Complete Task Specification](#6-complete-task-specification)
7. [Visual Map: Modules ↔ Agents ↔ Tasks ↔ Dependencies](#7-visual-map)
8. [ISO/Audit Extensions](#8-isoaudit-extensions)
9. [Agent Orchestration Evolution](#9-agent-orchestration-evolution)
10. [Success Criteria & Release Gate](#10-success-criteria--release-gate)

---

## 1. Phase 1 Analysis & Transition Notes

### 1.1 Identified Redundancies in Phase 1

| Area | Observation | Optimization for Phase 2 |
|------|-------------|--------------------------|
| Event emission pattern | M1.1 event bus, M1.2 state machine, M1.3 audit logger each implement emit logic | Phase 2: introduce `EventMiddleware` for cross-cutting concerns (logging, metrics, throttling) |
| Evidence storage | M2.3 and M4.3 both write to `maloja-plana-audit` with type-filtering | Phase 2: unified `EvidenceService` abstracting store access, supporting structured queries |
| Gate invocation | M4.3 wires gates into 3+ components individually | Phase 2: declarative gate annotations via `@requiresApproval` decorator pattern |
| Status computation | M1.5 and M5.2 both compute module health from registry | Phase 2: reactive status store (observer pattern) eliminates redundant polling |
| i18n key management | 34 keys added across M1–M5 without namespace structure | Phase 2: namespaced i18n (`runtime.audit.*`, `runtime.gate.*`) for scalability |

### 1.2 Inconsistencies Resolved

| Inconsistency | Detail | Phase 2 Resolution |
|---------------|--------|-------------------|
| Actor naming | M1.3 defines `'agent:<name>'` but M2–M5 use module IDs inconsistently | Standardize: `actor = 'module:<MODULE_ID>'` for system, `'user'` for human, `'workflow:<id>'` for automated |
| Evidence query API | M2.3 `getEvidenceForField` queries by payload filter; M1.3 `getEntries` uses index | Unified query interface with composite indexes in Phase 2 audit store v2 |
| Lifecycle model | M1.2 defines field + document lifecycles but they're never unified into workflows | Phase 2: Workflow Engine composes state machines into multi-step governed flows |

### 1.3 Phase 1 Extension Points for Phase 2

| Phase 1 Primitive | Phase 2 Extension | Impact |
|-------------------|-------------------|--------|
| Event Bus (M1.1) | Event replay, event sourcing, metrics aggregation | Foundation for workflow state reconstruction |
| State Machine (M1.2) | Workflow DAG (multi-machine composition, parallel branches) | Deterministic workflow engine |
| Audit Log (M1.3) | Structured evidence queries, compliance reports, rollback proofs | ISO audit report generation |
| Module Registry (M1.4) | Capability-based permissions, module health history | Role-based access control foundation |
| Validation Engine (M2.*) | AI-assisted rule suggestions, anomaly detection | Optional intelligence layer |
| Ingestion Pipeline (M3.*) | Multi-source connectors (API, email, calendar), batch import | Beyond local files |
| Approval Gates (M4.*) | Delegated approval, time-boxed escalation, approval policies | Team governance |
| Audit Viewer (M5.*) | Real-time dashboard, trend charts, compliance export (PDF) | Observability 2.0 |

---

## 2. Phase 2 Vision

Transform the governance runtime into a **deterministic workflow engine** with optional, sandboxed agent assistance and team-ready governance structures.

### Core Principles (Inherited + Extended)

| Principle | Phase 1 | Phase 2 Extension |
|-----------|---------|-------------------|
| Offline-first | All operations local | Workflows execute offline; sync is opt-in |
| Human-governed | Approval gates | Multi-level approval policies + delegation |
| Deterministic | State machines | Workflow DAG with guaranteed replay |
| Auditable | Append-only log | Compliance reports + rollback proofs |
| No autonomous AI | N/A | Agents propose only; never execute without gate |

### New Capabilities

1. **Workflow Engine** — Compose state machines into multi-step governed flows with branching, parallelism, and conditional logic
2. **Agent Layer** — Optional, sandboxed AI assistance (suggestions, anomaly detection, rule proposals) — always behind gates
3. **Role-Based Access** — Capabilities mapped to roles; permissions enforced at gate level
4. **Team Governance** — Multi-user approval policies, delegation, escalation timers
5. **Rollback System** — Evidence-chain-based state restoration with full audit trail
6. **Real-Time Dashboard** — Live module health, workflow progress, trend visualization
7. **Compliance Export** — ISO-ready PDF/JSON reports generated from audit data

---

## 3. Architecture Evolution

### Phase 2 Runtime Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                       UI Layer (React)                            │
│  Dashboard 2.0 │ WorkflowDesigner │ AgentSidebar │ RoleManager  │
│  ComplianceViewer │ RollbackWizard │ TeamPanel                   │
├─────────────────────────────────────────────────────────────────┤
│                   Orchestration Layer (new)                       │
│  Workflow Engine │ Agent Sandbox │ Policy Engine │ Role Registry │
├─────────────────────────────────────────────────────────────────┤
│                    Runtime Layer (Phase 1)                        │
│  Event Bus │ State Machine │ Module Registry                     │
│  Validation Engine │ Ingestion Pipeline │ Approval Gates         │
│  Audit Logger │ ← Event Middleware (new)                         │
├─────────────────────────────────────────────────────────────────┤
│                   Persistence Layer (extended)                    │
│  localStorage (or5_*) │ IndexedDB (documents, backups)           │
│  IndexedDB (maloja-plana-audit v2) │ IndexedDB (workflows) ← NEW│
└─────────────────────────────────────────────────────────────────┘
```

### New IndexedDB Stores

| Store Name | Version | Purpose |
|------------|---------|---------|
| `maloja-plana-audit` | **v2** (migration) | Extended schema: composite indexes, rollback markers, compliance tags |
| `maloja-plana-workflows` | v1 (new) | Workflow definitions, execution state, evidence chains |

### Event Flow Evolution

```
[User/Agent Action]
     │
     ▼
[Event Middleware] ─── intercept, enrich, route ──┐
     │                                             │
     ├──▶ [Workflow Engine] ─── DAG step?          │
     │         │                                   │
     │         ├── parallel branches               │
     │         ├── conditional gates               │
     │         └── agent consultation (optional)   │
     │                                             │
     ├──▶ [Policy Engine] ─── role check?          │
     │         │                                   │
     │         ▼                                   │
     │    grant/deny/escalate                      │
     │                                             │
     ├──▶ [Agent Sandbox] ─── propose only         │
     │         │                                   │
     │         ▼                                   │
     │    suggestion → approval gate               │
     │                                             │
     └──▶ [Audit Logger v2] ◀─────────────────────┘
              │ (enriched: workflow context, role, compliance tag)
              ▼
         [IndexedDB: maloja-plana-audit v2]
```

---

## 4. Milestone Map

| Milestone | Name | Week | Tasks | Focus | Phase 1 Foundation |
|-----------|------|------|-------|-------|-------------------|
| **P2.M1** | Workflow Engine Core | 1–3 | 5 | DAG definition, step execution, branching | M1.1 Event Bus, M1.2 State Machine |
| **P2.M2** | Policy & Role Engine | 3–4 | 4 | Role definitions, capability mapping, policy evaluation | M1.4 Registry, M4.2 Gate Registry |
| **P2.M3** | Agent Sandbox | 4–6 | 5 | Agent runtime, suggestion API, sandbox isolation | M1.1 Events, M4.1 Gate Component |
| **P2.M4** | Rollback System | 6–7 | 4 | State snapshots, evidence-chain rollback, undo UI | M1.3 Audit Log, M3.3 Pipeline |
| **P2.M5** | Real-Time Dashboard | 7–8 | 4 | Live metrics, workflow progress, trend charts | M1.5 Indicator, M5.1–M5.2 |
| **P2.M6** | Compliance Export | 8–9 | 3 | ISO report templates, PDF generation, audit summaries | M5.3 Export, M1.3 Audit |
| **P2.M7** | Integration & Polish | 9–12 | 6 | E2E workflows, team QA, performance, docs | M6.* |

**Total**: 31 tasks, ~7 new components, 2 IndexedDB store changes, ~60 new i18n keys

---

## 5. Critical Path & Parallel Tracks

### Critical Path (⚡)

```
Week 1–2:  P2.M1.1 → P2.M1.2 → P2.M1.3
Week 3:    P2.M1.4 + P2.M2.1 → P2.M2.2
Week 4:    P2.M2.3 + P2.M3.1 → P2.M3.2
Week 5–6:  P2.M3.3 + P2.M4.1 → P2.M4.2
Week 7:    P2.M4.3 + P2.M5.1
Week 8:    P2.M5.2 + P2.M6.1
Week 9:    P2.M6.2 + P2.M7.1
Week 10–12: P2.M7.2 → P2.M7.6 → Release
```

### Parallel Tracks

| Track | Tasks | Starts After | Parallel To |
|-------|-------|--------------|-------------|
| **A** — Dashboard | P2.M5.1–M5.4 | P2.M1.4 | P2.M3, P2.M4 |
| **B** — Agent UI | P2.M3.4–M3.5 | P2.M3.2 | P2.M4 |
| **C** — Compliance | P2.M6.1–M6.3 | P2.M4.3 | P2.M5, P2.M7 |
| **D** — Rollback UI | P2.M4.3–M4.4 | P2.M4.2 | P2.M5 |
| **E** — Polish | P2.M7.3–M7.6 | All core done | P2.M7.1–M7.2 |

### Gantt Overview

```
W1–2  ████ P2.M1.1–M1.3 (workflow core)
W3    ██── P2.M1.4–M1.5 (workflow UI)         ██ P2.M2.1–M2.2 (roles)
W4    ████ P2.M2.3–M2.4 (policies)            ██ P2.M3.1 (agent core)
W5–6  ████ P2.M3.2–M3.5 (agent layer)         ██ P2.M4.1–M4.2 (rollback)
W7    ████ P2.M4.3–M4.4 (rollback UI)         ░░ P2.M5.1–M5.2 (dashboard)
W8    ████ P2.M5.3–M5.4 (dashboard polish)    ██ P2.M6.1 (compliance)
W9    ████ P2.M6.2–M6.3 (export)              ██ P2.M7.1 (E2E)
W10–12 ████ P2.M7.2–M7.6 (QA + docs + perf)  → RELEASE
```

---

## 6. Complete Task Specification

### P2.M1 — Workflow Engine Core (Week 1–3)

---

#### ⚡🆕 P2.M1.1 — Workflow Definition Schema

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/workflow/schema.js` |
| **Branch** | `feature/p2-m1-workflow-schema` |
| **Dependencies** | Phase 1 M1.2 State Machine (extends) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical + Computational** — DAG theory, schema design |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create `src/runtime/workflow/` directory | Module boundary |
| 2 | Define workflow schema | `{ id, name, version, steps: Step[], triggers: Trigger[], policies: PolicyRef[] }` |
| 3 | Define Step shape | `{ id, type: 'action'\|'gate'\|'branch'\|'parallel'\|'agent', config, next: string[], guard? }` |
| 4 | Define DAG validation | `validateWorkflow(def)` — no cycles, all `next` refs resolve, terminal exists |
| 5 | Define built-in workflow templates | `import-and-validate`, `bulk-update`, `compliance-check` |
| 6 | Unit tests | Valid/invalid DAG, cycle detection, orphan step detection |

**Acceptance Criteria:**
- Workflows are JSON-serializable DAGs
- Cycle detection prevents infinite loops
- Templates cover Phase 1 flows (import, delete, validate)
- Schema self-validates

**Versioning / Persistence:**
- Workflow definitions stored in `maloja-plana-workflows` IndexedDB
- Versioned: each save creates new version (immutable history)
- Templates are static code exports (versionless)

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | Define import workflow as DAG → verify 8 steps match Phase 1 pipeline stages |
| CP-2 | Introduce cycle → validator rejects with specific error |
| CP-3 | Orphan step (unreachable) → validator warns |

**Agent Memory State:** "Workflow schema supports 5 step types. DAG validation catches cycles + orphans. 3 built-in templates."

---

#### ⚡🆕 P2.M1.2 — Workflow Executor

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/workflow/executor.js` |
| **Branch** | `feature/p2-m1-workflow-executor` |
| **Dependencies** | P2.M1.1, Phase 1 M1.1 (event bus), M1.2 (state machine) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural + Computational** — step sequencing, parallel execution, Promise coordination |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `createWorkflowInstance(definition, context)` | Returns instance with `run()`, `pause()`, `getState()` |
| 2 | Step execution engine | Sequential by default, follows `next` pointers |
| 3 | Parallel step support | `type: 'parallel'` → Promise.all on child steps |
| 4 | Branch step support | `type: 'branch'` → evaluate condition, follow one path |
| 5 | Gate step integration | `type: 'gate'` → invokes Phase 1 approval gate, awaits resolution |
| 6 | Agent step integration | `type: 'agent'` → invokes sandbox (P2.M3), awaits proposal + gate |
| 7 | Emit workflow events | `WORKFLOW_START`, `WORKFLOW_STEP`, `WORKFLOW_COMPLETE`, `WORKFLOW_FAILED` |
| 8 | Persist execution state | Save step progress to IndexedDB (resumable after refresh) |
| 9 | Unit tests | Linear flow, parallel, branch, gate integration, resume after pause |

**Acceptance Criteria:**
- Workflows execute step-by-step deterministically
- Parallel branches resolve via Promise.all
- Gate steps block until human action (no timeout)
- Execution state persisted (survives page refresh)
- Events emitted per step

**Versioning / Persistence:**
- Execution state in `maloja-plana-workflows` IndexedDB: `{ instanceId, definitionId, currentSteps, completedSteps, context, startedAt }`
- Resumable: on app reload, pending workflows resume from last completed step

**Checkpoints & Evidence:**

| CP | Verification |
|----|-------------|
| CP-1 | 3-step linear workflow → all steps execute in order → WORKFLOW_COMPLETE emitted |
| CP-2 | Parallel step with 2 branches → both complete → next step fires |
| CP-3 | Gate step → blocks → approve → continues → audit shows approval |
| CP-4 | Refresh mid-workflow → resume from correct step |

**ISO Evidence:** Execution state history proves deterministic replay. Step-by-step audit trail.

---

#### ⚡🆕 P2.M1.3 — Event Middleware

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/eventMiddleware.js` |
| **Branch** | `feature/p2-m1-event-middleware` |
| **Dependencies** | Phase 1 M1.1 (event bus, wraps) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational + Analytical** — middleware chain, enrichment, routing |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement middleware chain | `use(middleware)` — each receives `(event, next)`, can transform or halt |
| 2 | Built-in: timestamp enrichment | Adds `enrichedAt`, `source` metadata |
| 3 | Built-in: workflow context injection | If workflow active, adds `workflowId`, `stepId` to event |
| 4 | Built-in: metrics collection | Counts events by type per minute (in-memory ring buffer) |
| 5 | Built-in: throttle/debounce | Rate-limit specific event types (e.g., validation during rapid typing) |
| 6 | Wrap existing event bus transparently | `createEnrichedBus(baseBus, middlewares)` — same API, enhanced behavior |
| 7 | Unit tests | Chain order, halt propagation, enrichment, throttle behavior |

**Acceptance Criteria:**
- Phase 1 consumers unchanged (same `emit/on/off` API)
- Middleware executes in order
- Workflow context automatically attached when workflow is active
- Metrics queryable for dashboard

**Versioning / Persistence:** Middleware state is in-memory (metrics ring buffer). No persistence.

---

#### 🎯🆕 P2.M1.4 — Workflow Progress UI

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/WorkflowProgress.jsx` (new) |
| **Branch** | `feature/p2-m1-workflow-ui` |
| **Dependencies** | P2.M1.2 (executor state) |
| **Agent** | UX Calmness |
| **Thinking Framework** | **Analytical + Procedural** — step visualization, progress state |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Horizontal step indicator | Dots/circles connected by lines, current step highlighted |
| 2 | Step labels | Short label per step (from definition) |
| 3 | Status per step | pending (grey), active (gold pulse), complete (sage), failed (rose) |
| 4 | Compact mode | Collapsed to single progress bar for mobile/embedded use |
| 5 | Integration with ImportPreview | Show workflow progress during import flow |
| 6 | i18n (4 locales) | `workflow.step`, `workflow.progress`, `workflow.complete`, `workflow.failed` |
| 7 | Accessibility | `role="progressbar"`, aria-valuenow, step announcements |
| 8 | 375px + dark mode | Responsive + palette-only |

**Acceptance Criteria:**
- User sees where they are in multi-step flow
- Calm, non-intrusive (no animations beyond subtle pulse)
- Accessible + mobile-ready

---

#### 🆕 P2.M1.5 — Workflow Templates & Registry

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/workflow/templates.js`, `src/runtime/workflow/registry.js` |
| **Branch** | `feature/p2-m1-workflow-registry` |
| **Dependencies** | P2.M1.1, P2.M1.2 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical** — template composition, registry pattern |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Define `import-and-validate` template | Maps Phase 1 import pipeline to workflow |
| 2 | Define `bulk-update` template | Multi-field update with validation + single gate |
| 3 | Define `compliance-check` template | Run all chapter validations + generate summary |
| 4 | Implement workflow registry | Register/query/instantiate workflows by ID |
| 5 | Register 'workflow' module in Phase 1 registry | Extends existing module system |
| 6 | Unit tests | Template instantiation, registry query |

---

### P2.M2 — Policy & Role Engine (Week 3–4)

---

#### ⚡🆕 P2.M2.1 — Role Definition Schema

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/roles/schema.js` |
| **Branch** | `feature/p2-m2-role-schema` |
| **Dependencies** | Phase 1 M1.4 (module registry) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical** — RBAC theory, capability mapping |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create `src/runtime/roles/` directory | Module boundary |
| 2 | Define role shape | `{ id, name, capabilities: string[], inherits?: string[] }` |
| 3 | Define built-in roles | `owner` (all), `editor` (data ops), `viewer` (read-only), `auditor` (audit + export) |
| 4 | Define capabilities taxonomy | `data.read`, `data.write`, `data.delete`, `data.import`, `audit.read`, `audit.export`, `workflow.execute`, `settings.modify`, `agent.invoke` |
| 5 | Implement `hasCapability(role, capability)` | Resolves inheritance chain |
| 6 | Unit tests | Direct capability, inherited, missing, role hierarchy |

**Acceptance Criteria:**
- Roles are JSON-serializable
- Inheritance chain resolves correctly
- `owner` has all capabilities implicitly
- Unknown capability → deny (fail-safe)

**Versioning / Persistence:**
- Role definitions: static code exports (Phase 2 single-user, no persistence needed)
- Future (Phase 3): roles from server for multi-user

---

#### ⚡🆕 P2.M2.2 — Policy Engine

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/roles/policyEngine.js` |
| **Branch** | `feature/p2-m2-policy-engine` |
| **Dependencies** | P2.M2.1, Phase 1 M4.2 (gate registry) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical + Procedural** — policy evaluation, gate enhancement |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Define policy shape | `{ id, operation, requiredCapability, escalation?: { after: ms, to: role } }` |
| 2 | Implement `evaluatePolicy(operation, actor, context)` | Returns `{ allowed, reason, requiresGate }` |
| 3 | Enhance gate registry | Gates now check policy before showing UI (deny early if no capability) |
| 4 | Implement escalation timer | If gate unresolved after N minutes, escalate (log, no auto-approve) |
| 5 | Emit `POLICY_EVALUATED` event | For audit trail |
| 6 | Unit tests | Allow, deny, escalation trigger, policy chain |

**Acceptance Criteria:**
- Policy denies immediately if role lacks capability
- Gate shown only if role has capability but operation requires confirmation
- Escalation logs but never auto-approves
- Backward-compatible with Phase 1 (single-user = owner role by default)

**Gate Condition:** Escalation NEVER results in automatic approval. Only produces audit entry + optional notification.

---

#### 🎯🆕 P2.M2.3 — Role Manager UI

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/RoleManager.jsx` (new) |
| **Branch** | `feature/p2-m2-role-ui` |
| **Dependencies** | P2.M2.1 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Analytical + Procedural** — capability visualization |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Role list view | Cards showing role name + capability count |
| 2 | Capability matrix | Grid: roles × capabilities with checkmarks |
| 3 | Active role selector | Current user selects active role (for testing/demo in single-user) |
| 4 | i18n (4 locales) | `roles.title`, `roles.capabilities`, `roles.active`, role names |
| 5 | Accessible | Table with proper headers, focusable cells |
| 6 | 375px + dark mode | Responsive table (horizontal scroll on mobile) |

---

#### 🆕 P2.M2.4 — Policy Audit Integration

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/roles/evidence.js` |
| **Branch** | `feature/p2-m2-policy-audit` |
| **Dependencies** | P2.M2.2, Phase 1 M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural** — evidence chain, compliance logging |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Log policy evaluations | `{ type: 'POLICY_EVALUATED', actor, operation, result, role, capabilities }` |
| 2 | Log capability denials | Separate type for denied operations |
| 3 | Log escalation events | `{ type: 'ESCALATION', operation, afterMs, toRole }` |
| 4 | Extend AuditViewer filter | Add "Policy" filter option |
| 5 | Unit tests | Policy evidence retrievable, filterable |

---

### P2.M3 — Agent Sandbox (Week 4–6)

---

#### ⚡🆕 P2.M3.1 — Agent Runtime

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/agents/runtime.js` |
| **Branch** | `feature/p2-m3-agent-runtime` |
| **Dependencies** | Phase 1 M1.1 (events), P2.M2.2 (policy check) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational + Logical** — sandbox isolation, capability restriction |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create `src/runtime/agents/` directory | Module boundary |
| 2 | Define agent shape | `{ id, name, capabilities: string[], evaluate: (context) => Suggestion }` |
| 3 | Implement `createAgentSandbox(agent, permissions)` | Returns restricted API surface |
| 4 | Sandbox restrictions | No direct write access, no DOM, no localStorage, no IndexedDB write |
| 5 | Agent output shape | `Suggestion = { type, description, changes: [], confidence, evidence }` |
| 6 | All suggestions route through approval gate | Agent proposes, human disposes |
| 7 | Emit `AGENT_SUGGESTION` event | For audit + UI display |
| 8 | Unit tests | Sandbox prevents writes, suggestion flows through gate, evidence captured |

**Acceptance Criteria:**
- Agent cannot modify state directly (sandbox enforced)
- Every agent output is a suggestion requiring human approval
- Sandbox violation attempts are logged (security audit)
- Agent capabilities checked against policy engine

**ISO Evidence:** Sandbox violation log proves agent cannot bypass governance.

---

#### ⚡🆕 P2.M3.2 — Suggestion API

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/agents/suggestions.js` |
| **Branch** | `feature/p2-m3-suggestions` |
| **Dependencies** | P2.M3.1 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Analytical + Procedural** — proposal/review pattern |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `createSuggestion(agent, context)` | Invokes agent evaluate, wraps result |
| 2 | Suggestion lifecycle | `proposed → reviewing → approved \| rejected \| expired` |
| 3 | Suggestion evidence | Links to agent input context + output changes |
| 4 | Expiration policy | Suggestions expire after configurable TTL (default 24h) |
| 5 | Implement `getSuggestions({ status?, agentId? })` | Query pending/history |
| 6 | Unit tests | Lifecycle transitions, expiration, evidence linking |

**Acceptance Criteria:**
- Suggestions have full lifecycle with audit trail
- Expired suggestions auto-reject (logged, not silent)
- Evidence shows what agent "saw" and what it proposed

---

#### 🎯🆕 P2.M3.3 — Built-in Agents

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/agents/builtins/` |
| **Branch** | `feature/p2-m3-builtin-agents` |
| **Dependencies** | P2.M3.1, P2.M3.2, Phase 1 M2.* (validation) |
| **Agent** | Runtime Governance + Source Governance |
| **Thinking Framework** | **Computational + Analytical** — heuristic design, pattern detection |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | `ValidationAdvisor` agent | Analyzes validation evidence → suggests rule adjustments |
| 2 | `ImportMapper` agent | Analyzes source file structure → suggests field mappings |
| 3 | `AnomalyDetector` agent | Compares new data against historical patterns → flags outliers |
| 4 | `ComplianceChecker` agent | Scans audit log for gaps → suggests remediation |
| 5 | All agents read-only | Only produce suggestions, never modify |
| 6 | Unit tests | Each agent produces valid suggestions, sandbox intact |

**Acceptance Criteria:**
- Each agent solves a specific problem
- All outputs are suggestions (never direct actions)
- Agents work offline (no API calls)
- Simple heuristic-based (no LLM dependency)

---

#### 🎯🆕 P2.M3.4 — Agent Sidebar UI

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/AgentSidebar.jsx` (new) |
| **Branch** | `feature/p2-m3-agent-sidebar` |
| **Dependencies** | P2.M3.2 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Analytical + Procedural** — notification pattern, non-intrusive |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Collapsible sidebar | Right-side panel, starts collapsed |
| 2 | Suggestion cards | Agent name + description + confidence badge + accept/reject |
| 3 | Confidence indicator | Low (grey) / Medium (gold) / High (sage) |
| 4 | Accept → triggers approval gate | Never bypasses governance |
| 5 | Reject → logs rejection with optional reason | Same pattern as M4.1 |
| 6 | Badge on nav | Notification dot showing pending suggestion count |
| 7 | i18n (4 locales) | `agent.suggestion`, `agent.accept`, `agent.reject`, `agent.confidence` |
| 8 | 375px | Sidebar becomes bottom sheet on mobile |
| 9 | Dark mode | Palette-only |

**Acceptance Criteria:**
- Non-intrusive: user not interrupted, can ignore suggestions
- Accept always routes through gate (no shortcut)
- Mobile-friendly bottom sheet pattern
- Accessible

---

#### 🆕 P2.M3.5 — Agent Audit Evidence

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/agents/evidence.js` |
| **Branch** | `feature/p2-m3-agent-evidence` |
| **Dependencies** | P2.M3.1, P2.M3.2, Phase 1 M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural** — traceability, provenance |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Log all agent invocations | `{ type: 'AGENT_INVOKED', agentId, context, timestamp }` |
| 2 | Log all suggestions | `{ type: 'AGENT_SUGGESTION', agentId, suggestion, confidence }` |
| 3 | Log sandbox violations | `{ type: 'AGENT_VIOLATION', agentId, attemptedAction }` |
| 4 | Link suggestion to approval/rejection | Cross-reference audit entries |
| 5 | Extend AuditViewer | Add "Agent" filter, show agent-specific badge color |

**ISO Evidence:** Complete agent activity audit proves sandbox integrity and human governance.

---

### P2.M4 — Rollback System (Week 6–7)

---

#### ⚡🆕 P2.M4.1 — State Snapshot Engine

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/rollback/snapshots.js` |
| **Branch** | `feature/p2-m4-snapshots` |
| **Dependencies** | Phase 1 M1.3 (audit), M3.3 (backup integration) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural + Computational** — snapshot strategy, delta computation |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create `src/runtime/rollback/` directory | Module boundary |
| 2 | Implement `captureSnapshot(scope)` | Reads current localStorage + IndexedDB state for scope |
| 3 | Implement delta-based snapshots | Store diff from previous snapshot (space-efficient) |
| 4 | Link snapshots to audit entries | Each snapshot has `auditEntryId` reference |
| 5 | Implement `getSnapshots({ since, scope })` | Query available rollback points |
| 6 | Store in `maloja-plana-workflows` IndexedDB | Separate store for rollback data |
| 7 | Unit tests | Capture, delta computation, retrieval, linkage |

**Acceptance Criteria:**
- Snapshots captured at every gate-approved state change
- Delta-based storage keeps size manageable
- Each snapshot links to the audit entry that triggered it
- Queryable by time + scope

---

#### ⚡🆕 P2.M4.2 — Rollback Executor

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/rollback/executor.js` |
| **Branch** | `feature/p2-m4-rollback-executor` |
| **Dependencies** | P2.M4.1, Phase 1 M4.* (approval gate) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural + Logical** — state restoration, evidence chain |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `rollbackTo(snapshotId)` | Restores state from snapshot |
| 2 | Rollback requires approval gate | `requestApproval('rollback', changes)` |
| 3 | Apply delta chain in reverse | Reconstruct target state from current + deltas |
| 4 | Log rollback event | `{ type: 'ROLLBACK', fromSnapshot, toSnapshot, actor, reason }` |
| 5 | Verify state after rollback | Compare restored state with snapshot expected state |
| 6 | Unit tests | Rollback to previous, rollback chain, verification |

**Acceptance Criteria:**
- Rollback is a gated operation (human must approve)
- State verified after restoration (integrity check)
- Full audit trail of rollback (who, when, why, from, to)
- Evidence chain: snapshot → audit entry → rollback entry → verification

---

#### 🎯🆕 P2.M4.3 — Rollback Wizard UI

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/RollbackWizard.jsx` (new) |
| **Branch** | `feature/p2-m4-rollback-ui` |
| **Dependencies** | P2.M4.1, P2.M4.2 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Analytical + Procedural** — timeline selection, diff preview |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Timeline view | Show available rollback points on timeline |
| 2 | Point selection | Click to select target state |
| 3 | Diff preview | Show what will change (current vs target) |
| 4 | Confirm via approval gate | Standard gate before execution |
| 5 | Success/failure feedback | Clear result message |
| 6 | i18n (4 locales) | `rollback.title`, `rollback.selectPoint`, `rollback.preview`, `rollback.confirm` |
| 7 | 375px + dark mode | Responsive + palette |

---

#### 🆕 P2.M4.4 — Rollback Evidence Chain

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/rollback/evidence.js` |
| **Branch** | `feature/p2-m4-evidence` |
| **Dependencies** | P2.M4.2, Phase 1 M1.3 |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Analytical** — chain integrity, proof construction |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Construct evidence chain | `[snapshot_before → action → snapshot_after → rollback → snapshot_restored]` |
| 2 | Integrity verification | Hash chain (each entry references previous hash) |
| 3 | Export evidence chain | As JSON for external audit |
| 4 | Unit tests | Chain construction, integrity check pass/fail |

**ISO Evidence:** Hash-chained rollback evidence provides tamper-proof state restoration proof.

---

### P2.M5 — Real-Time Dashboard (Week 7–8)

---

#### 🎯🆕 P2.M5.1 — Metrics Aggregator

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/metrics/aggregator.js` |
| **Branch** | `feature/p2-m5-metrics` |
| **Dependencies** | P2.M1.3 (event middleware metrics) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational** — time-series aggregation, ring buffer |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create `src/runtime/metrics/` directory | Module boundary |
| 2 | Implement ring buffer | Fixed-size (last 60 minutes, 1-minute buckets) |
| 3 | Track events per type | Count per bucket per event type |
| 4 | Track workflow metrics | Active count, completed today, average duration |
| 5 | Track validation metrics | Pass rate, most-failed fields, evidence count |
| 6 | Implement `getMetrics(timeRange)` | Returns aggregated data for dashboard |
| 7 | In-memory only | No persistence (reconstructed from audit on cold start if needed) |

---

#### 🎯🆕 P2.M5.2 — Dashboard 2.0

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/DashboardMetrics.jsx` (new), `src/Dashboard.jsx` (modify) |
| **Branch** | `feature/p2-m5-dashboard` |
| **Dependencies** | P2.M5.1, P2.M1.4 (workflow progress) |
| **Agent** | UX Calmness |
| **Thinking Framework** | **Analytical + Procedural** — data visualization, calm metrics |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Metrics cards | Validation pass rate, active workflows, recent approvals |
| 2 | Mini trend chart | SVG sparkline (last 24h, events per hour) — no chart library |
| 3 | Active workflows section | List of in-progress workflows with progress indicator |
| 4 | Agent suggestion badge | Pending suggestion count (links to sidebar) |
| 5 | Calm design | Numbers only, no alerts/red unless actual error |
| 6 | i18n (4 locales) | `metrics.passRate`, `metrics.activeWorkflows`, `metrics.approvals` |
| 7 | 375px + dark mode | Cards stack, sparkline scales |

---

#### 🆕 P2.M5.3 — Live Status Streaming

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/metrics/stream.js` |
| **Branch** | `feature/p2-m5-stream` |
| **Dependencies** | P2.M5.1, Phase 1 M1.1 (events) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Computational** — reactive updates, debounced rendering |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Implement `createMetricsStream()` | Subscribes to event bus, pushes to subscribers |
| 2 | Debounced UI updates | Dashboard re-renders at most once per second |
| 3 | Hook: `useMetrics(type)` | React hook consuming stream |
| 4 | Cleanup on unmount | No leaks |
| 5 | Unit tests | Stream pushes, debounce, cleanup |

---

#### 🆕 P2.M5.4 — Workflow History View

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/WorkflowHistory.jsx` (new) |
| **Branch** | `feature/p2-m5-workflow-history` |
| **Dependencies** | P2.M1.2 (executor state) |
| **Agent** | UX Calmness |
| **Thinking Framework** | **Analytical** — timeline visualization |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | List completed workflows | Name, duration, result, timestamp |
| 2 | Detail view | Step-by-step with timing + evidence links |
| 3 | Filter by result | All / Completed / Failed |
| 4 | Link to audit entries | Each step → relevant audit record |
| 5 | i18n + responsive + dark mode | Standard pattern |

---

### P2.M6 — Compliance Export (Week 8–9)

---

#### 🆕 P2.M6.1 — Report Template Engine

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/compliance/templates.js` |
| **Branch** | `feature/p2-m6-templates` |
| **Dependencies** | Phase 1 M1.3, M5.3 (audit data) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Logical + Procedural** — template composition, data extraction |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Create `src/runtime/compliance/` directory | Module boundary |
| 2 | Define report template shape | `{ id, title, sections: [{ title, query, format }] }` |
| 3 | Built-in: "Audit Summary" | Date range, event counts, actor distribution |
| 4 | Built-in: "Approval Register" | All approval/rejection decisions with reasons |
| 5 | Built-in: "Validation Evidence" | Per-chapter validation history with pass rates |
| 6 | Built-in: "Rollback History" | All rollback events with evidence chains |
| 7 | Implement `generateReport(template, params)` | Queries audit + formats data |

---

#### 🎯🆕 P2.M6.2 — PDF/JSON Export

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/compliance/export.js` |
| **Branch** | `feature/p2-m6-export` |
| **Dependencies** | P2.M6.1, Phase 1 M4.2 (export is gated) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural + Computational** — document generation |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | JSON export | Structured report as downloadable JSON |
| 2 | PDF generation | Using browser print API (`window.print()` on styled HTML) — no PDF library |
| 3 | Report header | Title, date range, generation timestamp, system version |
| 4 | Approval gate | Export requires confirmation |
| 5 | Meta-audit | Export event logged |
| 6 | Filename convention | `maloja-plana-<report-type>-YYYY-MM-DD.{json\|pdf}` |

**Acceptance Criteria:**
- No new dependencies (browser print for PDF)
- Gated + logged
- Human-readable format suitable for auditors

---

#### 🎯🆕 P2.M6.3 — Compliance Viewer UI

| Field | Detail |
|-------|--------|
| **File Path** | `src/components/ComplianceViewer.jsx` (new) |
| **Branch** | `feature/p2-m6-compliance-ui` |
| **Dependencies** | P2.M6.1, P2.M6.2 |
| **Agent** | UX Calmness + Accessibility |
| **Thinking Framework** | **Analytical + Procedural** — report preview, export flow |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Report type selector | Dropdown: Audit Summary, Approval Register, etc. |
| 2 | Date range picker | Start/end date inputs |
| 3 | Preview pane | Rendered report in-page |
| 4 | Export buttons | "Download JSON" / "Print PDF" |
| 5 | Route: `#/compliance` | New nav item |
| 6 | i18n + responsive + dark mode | Standard |

---

### P2.M7 — Integration & Polish (Week 9–12)

---

#### ⚡🔗 P2.M7.1 — E2E Workflow Tests

| Field | Detail |
|-------|--------|
| **File Path** | `tests/e2e/workflows/` |
| **Branch** | `feature/p2-m7-e2e` |
| **Dependencies** | All P2.M1–M6 |
| **Agent** | Release Safety |
| **Thinking Framework** | **Analytical + Procedural** — integration verification |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Workflow E2E: import template | Full import workflow with approval + audit |
| 2 | Workflow E2E: rollback flow | Execute → rollback → verify state restored |
| 3 | Agent E2E: suggestion cycle | Agent proposes → user accepts → gate → execution |
| 4 | Policy E2E: capability denial | Viewer role → attempt write → denied → logged |
| 5 | Compliance E2E: report generation | Generate audit summary → export → verify content |
| 6 | Offline E2E | All workflows work without network |

---

#### 🎯 P2.M7.2 — Mobile QA (375px)

**Same pattern as Phase 1 M6.2** — all new components verified at 375px.

---

#### 🎯 P2.M7.3 — Dark Mode QA

**Same pattern as Phase 1 M6.3** — grep for hardcoded colors, palette verification.

---

#### P2.M7.4 — Architecture Decision Records

| ADR | Topic |
|-----|-------|
| ADR-006 | Workflow engine DAG design |
| ADR-007 | Agent sandbox isolation strategy |
| ADR-008 | Role-based access (single-user preparation for multi-user) |
| ADR-009 | Rollback with hash-chained evidence |
| ADR-010 | Compliance report generation (browser print vs library) |

---

#### P2.M7.5 — IndexedDB Migration (v1 → v2)

| Field | Detail |
|-------|--------|
| **File Path** | `src/runtime/migrations/audit-v2.js` |
| **Branch** | `feature/p2-m7-migration` |
| **Dependencies** | Phase 1 M1.3 (audit store v1) |
| **Agent** | Runtime Governance |
| **Thinking Framework** | **Procedural** — data migration safety |

**Subtasks:**

| # | Task | Detail |
|---|------|--------|
| 1 | Define v2 schema | Add composite index `by-workflow`, add `complianceTag` field |
| 2 | Migration handler | `onupgradeneeded` from v1 → v2 |
| 3 | Backward-compatible | Existing entries gain null workflow/tag (valid) |
| 4 | Test with populated store | 500+ entries → migrate → all accessible |
| 5 | Rollback plan | If migration fails, keep v1 store + log error |

---

#### ⚡ P2.M7.6 — Performance Verification

| Check | Budget |
|-------|--------|
| Build size | < 250 KB gzip (up from 200 KB Phase 1) |
| Lighthouse | ≥ 85 Performance (slight budget for new features) |
| IndexedDB growth | < 2 MB typical session |
| Memory leaks | Zero (workflow cleanup, agent cleanup) |
| Runtime deps | Zero new |
| Workflow execution | < 100ms per step (excluding human gate wait) |

---

## 7. Visual Map

### Module ↔ Agent ↔ Task ↔ Dependency Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 2 MODULE MAP                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │  WORKFLOW     │     │  POLICY &    │     │  AGENT       │        │
│  │  ENGINE       │────▶│  ROLES       │────▶│  SANDBOX     │        │
│  │  (P2.M1)     │     │  (P2.M2)     │     │  (P2.M3)     │        │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘        │
│         │                     │                     │                │
│         ▼                     ▼                     ▼                │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │  ROLLBACK    │     │  REAL-TIME   │     │  COMPLIANCE  │        │
│  │  SYSTEM      │     │  DASHBOARD   │     │  EXPORT      │        │
│  │  (P2.M4)     │     │  (P2.M5)     │     │  (P2.M6)     │        │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘        │
│         │                     │                     │                │
│         └─────────────────────┼─────────────────────┘                │
│                               ▼                                      │
│                    ┌──────────────────┐                               │
│                    │  INTEGRATION     │                               │
│                    │  & POLISH        │                               │
│                    │  (P2.M7)         │                               │
│                    └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Agent Assignment Map

```
┌─────────────────────────────────────────────────────────────┐
│  Runtime Governance                                          │
│  ├── P2.M1.1 Workflow Schema (lead)                         │
│  ├── P2.M1.2 Workflow Executor (lead)                       │
│  ├── P2.M1.3 Event Middleware (lead)                        │
│  ├── P2.M2.1 Role Schema (lead)                            │
│  ├── P2.M2.2 Policy Engine (lead)                          │
│  ├── P2.M3.1 Agent Runtime (lead)                          │
│  ├── P2.M4.1 Snapshot Engine (lead)                        │
│  ├── P2.M4.2 Rollback Executor (lead)                      │
│  └── P2.M6.1 Report Templates (lead)                       │
├─────────────────────────────────────────────────────────────┤
│  Source Governance                                           │
│  └── P2.M3.3 Built-in Agents (support)                     │
├─────────────────────────────────────────────────────────────┤
│  UX Calmness                                                │
│  ├── P2.M1.4 Workflow Progress UI (lead)                    │
│  ├── P2.M2.3 Role Manager UI (lead)                        │
│  ├── P2.M3.4 Agent Sidebar (lead)                          │
│  ├── P2.M4.3 Rollback Wizard (lead)                        │
│  ├── P2.M5.2 Dashboard 2.0 (lead)                          │
│  └── P2.M6.3 Compliance Viewer (lead)                      │
├─────────────────────────────────────────────────────────────┤
│  Accessibility                                              │
│  ├── P2.M2.3 (review)                                      │
│  ├── P2.M3.4 (review)                                      │
│  └── P2.M7.2 Mobile QA (lead)                              │
├─────────────────────────────────────────────────────────────┤
│  Release Safety                                             │
│  ├── P2.M7.1 E2E Tests (lead)                              │
│  ├── P2.M7.4 ADRs (support)                                │
│  └── P2.M7.6 Performance (lead)                            │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Flow (Critical Path Highlighted)

```
Phase 1 Primitives (REQUIRED COMPLETE)
     │
     ▼
⚡ P2.M1.1 Schema ──▶ ⚡ P2.M1.2 Executor ──▶ ⚡ P2.M1.3 Middleware
     │                       │                        │
     │                       ├──▶ P2.M1.4 UI          ├──▶ P2.M5.1 Metrics
     │                       │                        │
     │                       └──▶ P2.M1.5 Templates   └──▶ P2.M5.2 Dashboard
     │
     ├──▶ ⚡ P2.M2.1 Roles ──▶ ⚡ P2.M2.2 Policy ──▶ P2.M2.3 UI
     │                              │                     │
     │                              └──▶ P2.M2.4 Audit   │
     │                                                    │
     ├──▶ ⚡ P2.M3.1 Runtime ──▶ ⚡ P2.M3.2 Suggestions
     │         │                        │
     │         │                        ├──▶ P2.M3.3 Built-ins
     │         │                        ├──▶ P2.M3.4 Sidebar
     │         └──▶ P2.M3.5 Evidence    │
     │                                  │
     └──▶ ⚡ P2.M4.1 Snapshots ──▶ ⚡ P2.M4.2 Executor
              │                        │
              └──▶ P2.M4.3 Wizard      └──▶ P2.M4.4 Evidence
                                              │
                                              ▼
                                       P2.M6.1 Templates ──▶ P2.M6.2 Export ──▶ P2.M6.3 UI
                                              │
                                              ▼
                                       ⚡ P2.M7.1 E2E ──▶ P2.M7.6 Performance
```

---

## 8. ISO/Audit Extensions

### New Evidence Types (Phase 2)

| Evidence Type | Source | Storage | ISO Relevance |
|---------------|--------|---------|--------------|
| Workflow execution trace | P2.M1.2 | `maloja-plana-workflows` | Process compliance |
| Policy evaluation record | P2.M2.2 | `maloja-plana-audit` v2 | Access control audit |
| Agent activity log | P2.M3.1 | `maloja-plana-audit` v2 | AI governance proof |
| Sandbox violation log | P2.M3.1 | `maloja-plana-audit` v2 | Security boundary proof |
| Rollback evidence chain | P2.M4.4 | `maloja-plana-workflows` | State integrity proof |
| Hash-chain integrity | P2.M4.4 | Computed on-demand | Tamper detection |
| Compliance reports | P2.M6.1 | User download | Audit deliverable |

### Audit Entry Schema v2 (Extended)

```json
{
  "id": "<autoIncrement>",
  "type": "...Phase 1 types + WORKFLOW_START | WORKFLOW_STEP | WORKFLOW_COMPLETE | WORKFLOW_FAILED | POLICY_EVALUATED | AGENT_INVOKED | AGENT_SUGGESTION | AGENT_VIOLATION | ROLLBACK | ESCALATION",
  "actor": "user | system | module:<id> | workflow:<id> | agent:<id>",
  "payload": { "...extended..." },
  "timestamp": 1716000000000,
  "workflowId": "<nullable - if within workflow context>",
  "complianceTag": "<nullable - ISO control reference>"
}
```

### Compliance Report Structure

```
┌─────────────────────────────────┐
│ MALOJA PLANA COMPLIANCE REPORT  │
├─────────────────────────────────┤
│ 1. Executive Summary            │
│    - Period, event counts       │
│ 2. Access Control               │
│    - Policy evaluations         │
│    - Capability denials         │
│ 3. Change Management            │
│    - Approval register          │
│    - Rejection log              │
│ 4. Data Integrity               │
│    - Validation evidence        │
│    - Rollback events            │
│ 5. AI Governance                │
│    - Agent invocations          │
│    - Sandbox violations (0 exp) │
│    - Suggestion outcomes        │
│ 6. System Health                │
│    - Module status history      │
│    - Workflow completion rates   │
└─────────────────────────────────┘
```

### ISO Control Mapping (Phase 2 Extensions)

| ISO Control | Phase 2 Coverage | Task |
|-------------|-----------------|------|
| ISO 27001 A.9 Access Control | Role-based capability enforcement | P2.M2.* |
| ISO 27001 A.12 Operations Security | Workflow-governed operations | P2.M1.* |
| ISO 27001 A.16 Incident Management | Rollback + evidence chains | P2.M4.* |
| ISO 27001 A.18 Compliance | Automated report generation | P2.M6.* |
| AI Act Art. 14 Human Oversight | Agent sandbox + mandatory gates | P2.M3.* |
| AI Act Art. 13 Transparency | Agent activity audit trail | P2.M3.5 |

---

## 9. Agent Orchestration Evolution

### Phase 2 Agent Roles (Extended)

| Agent | Phase 1 Role | Phase 2 Extension |
|-------|-------------|-------------------|
| Runtime Governance | Core primitives | Workflow engine, policy engine, agent sandbox |
| Source Governance | Ingestion integrity | Built-in agent development |
| UX Calmness | Calm UI patterns | Workflow UI, sidebar, wizard, dashboard 2.0 |
| Accessibility | ARIA, keyboard | New component audit (sidebar, wizard, dashboard) |
| Release Safety | Integration, perf | Workflow E2E, IndexedDB migration safety |
| **Compliance** (new) | N/A | Report templates, export verification, ISO mapping |

### Sprint Structure (Phase 2)

| Sprint | Weeks | Focus | Lead Agent |
|--------|-------|-------|-----------|
| Sprint 1 | W1–3 | Workflow engine core + middleware | Runtime Governance |
| Sprint 2 | W3–4 | Roles + policies | Runtime Governance |
| Sprint 3 | W4–6 | Agent sandbox + built-ins | Runtime Governance + Source |
| Sprint 4 | W6–7 | Rollback system | Runtime Governance |
| Sprint 5 | W7–8 | Dashboard 2.0 + metrics | UX Calmness |
| Sprint 6 | W8–9 | Compliance export | Compliance (new) |
| Sprint 7 | W9–12 | Integration + QA + docs | Release Safety |

### Orchestration Rules (Extended)

1. **No agent acts without human review** (inherited)
2. **Workflows are deterministic** — same input → same execution path
3. **Agent suggestions expire** — stale proposals auto-reject after TTL
4. **Rollbacks require evidence** — cannot rollback without snapshot proof
5. **Policies fail-safe** — unknown capability → deny
6. **Compliance export is gated** — audit data export requires approval
7. **IndexedDB migration is reversible** — v2 schema maintains v1 compatibility

---

## 10. Success Criteria & Release Gate

### Phase 2 Complete When:

| # | Criterion | Verification | Task |
|---|-----------|-------------|------|
| 1 | Workflow engine executes multi-step flows deterministically | E2E test | P2.M7.1 |
| 2 | Workflows survive page refresh (resumable) | Resume test | P2.M1.2 |
| 3 | Role-based policies deny unauthorized operations | Policy E2E | P2.M7.1 |
| 4 | Agent suggestions route through approval gates | Agent E2E | P2.M7.1 |
| 5 | Agent sandbox prevents direct state modification | Violation test | P2.M3.1 |
| 6 | Rollback restores state with evidence chain | Rollback E2E | P2.M7.1 |
| 7 | Real-time dashboard shows live metrics | Visual QA | P2.M5.2 |
| 8 | Compliance reports exportable (JSON + PDF) | Export test | P2.M6.2 |
| 9 | IndexedDB v1→v2 migration safe | Migration test | P2.M7.5 |
| 10 | Build under 250 KB gzip | Build check | P2.M7.6 |
| 11 | Zero new runtime dependencies | Dep check | P2.M7.6 |
| 12 | All operations work offline | Offline E2E | P2.M7.1 |
| 13 | Mobile-ready (375px) all new UI | QA pass | P2.M7.2 |
| 14 | Dark mode correct all new components | QA pass | P2.M7.3 |
| 15 | ADRs 006–010 written | Doc review | P2.M7.4 |

### Release Gate

```
IF build > 250 KB gzip → BLOCK
IF workflow not resumable after refresh → BLOCK
IF agent can modify state without gate → BLOCK (security)
IF IndexedDB migration fails on populated store → BLOCK
IF rollback evidence chain has gaps → BLOCK
IF any E2E test fails → BLOCK
IF Lighthouse < 85 → BLOCK

ELSE → PHASE 2 RELEASE APPROVED
```

---

## Appendix A: Phase 1 → Phase 2 Transition Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | All Phase 1 M6.5 release gates passed | ☐ |
| 2 | `maloja-plana-audit` IndexedDB stable (v1 finalized) | ☐ |
| 3 | Event bus API frozen (no breaking changes planned) | ☐ |
| 4 | Module registry accepts new modules without changes | ☐ |
| 5 | Approval gate component reusable (tested in 3+ contexts) | ☐ |
| 6 | Audit viewer filter extensible (new types addable) | ☐ |
| 7 | Build size headroom: current < 180 KB (leaves 70 KB for Phase 2) | ☐ |
| 8 | All Phase 1 ADRs written and reviewed | ☐ |
| 9 | Phase 1 test coverage ≥ 80% on runtime modules | ☐ |
| 10 | No known regressions in dev branch | ☐ |

---

## Appendix B: Debugging & Persistence Strategy

### Debug Commands (Phase 2)

| Module | Console Command | Purpose |
|--------|----------------|---------|
| Workflow | `workflowRegistry.getActive()` | List running workflows |
| Workflow | `workflowInstance.getState()` | Current step + context |
| Policy | `policyEngine.evaluate('delete', 'viewer')` | Test policy evaluation |
| Agent | `agentSandbox.getViolations()` | Check sandbox integrity |
| Rollback | `snapshotEngine.getSnapshots({limit:5})` | Recent rollback points |
| Metrics | `metricsAggregator.getMetrics('1h')` | Last hour's metrics |
| Migration | `indexedDB.open('maloja-plana-audit')` | Inspect v2 schema |

### Persistence Lifecycle

```
App Start
  │
  ├── Open maloja-plana-audit (v2, with migration if needed)
  ├── Open maloja-plana-workflows (v1)
  ├── Resume pending workflows from IndexedDB
  ├── Rebuild metrics from last 60 min of audit entries
  ├── Register all modules (validation, ingestion, approval, audit, workflow, agent, policy)
  ├── Run retention prune (audit entries)
  └── Expire stale agent suggestions
       │
       ▼
  App Running (event loop)
       │
       ▼
  App Shutdown
  ├── Persist workflow execution state
  └── Flush metrics (optional, for next cold start)
```

---

## Appendix C: Risk Mitigation (Phase 2)

| Risk | Impact | Mitigation | Owner |
|------|--------|-----------|-------|
| Workflow state corruption | Stuck workflows | Snapshot before each step + force-complete option | Runtime Governance |
| Agent sandbox escape | Uncontrolled state change | Zero-trust: no write API in sandbox, violation logging | Runtime Governance |
| IndexedDB v2 migration failure | Data loss | Backward-compatible schema, migration in try/catch, fallback to v1 | Release Safety |
| Role complexity for single user | UX overhead | Default `owner` role, role selector only in settings | UX Calmness |
| Build size growth (7 new components) | Budget exceeded | SVG sparklines (no chart lib), browser print (no PDF lib) | Release Safety |
| Workflow DAG complexity | User confusion | Pre-built templates, wizard for custom (Phase 3) | UX Calmness |
| Compliance report accuracy | Audit failure | Report hash-matches raw audit data (verifiable) | Compliance |

---

*Document generated: 2026-05-17 | Prerequisite: Phase 1 Master (ee093dc) | Branch: dev*  
*Phase 2 target start: after Phase 1 M6.5 release gate*
