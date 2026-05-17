# Maloja Plana — Product Requirements Document

**Version**: 0.2.0  
**Date**: 2026-05-17  
**Status**: Alpha (Phase 0–1)  
**License**: AGPL-3.0

---

## 1. Purpose

Maloja Plana is a governance-native, deterministic, human-governed operational runtime platform. It enables structured source ingestion, validation, and orchestration — offline-first, modular, and fully auditable.

The platform serves people and teams who need:
- Structured oversight of documents, data, and compliance artifacts
- Deterministic validation with human approval gates
- Traceable provenance for decisions and state changes
- Offline-capable operation without cloud dependency
- Calm, trustworthy UX that reduces cognitive burden

Maloja Plana is **not** an AI chatbot, autonomous agent wrapper, or SaaS growth tool.

---

## 2. Project Overview

### Identity

| Attribute | Value |
|-----------|-------|
| Product name | Maloja Plana |
| Architecture | Modular, bounded, local-first |
| Runtime model | Deterministic, event-driven, governance-gated |
| Deployment | Static SPA (Vercel), offline-capable via SW |
| Data model | localStorage + IndexedDB, no server |
| Dependencies | React 18 + Vite 4, zero runtime deps |

### Users

| Persona | Need |
|---------|------|
| Knowledge workers | Structured life/work organization, document management |
| Compliance officers | Validation evidence, audit trails, approval gates |
| Teams (future) | Shared governance workflows, role-based approval |
| Individuals (Alpha) | Personal Swiss life admin (7 chapters, documents, reminders) |

### Principles

- Human accountability first
- Determinism before intelligence
- Governance is the platform, not a module
- Local-first as trust/security/governance model
- Minimal autonomy — AI is optional and governed
- Trust is the product
- Calm technology over engagement optimization

---

## 3. Modules & Features

### Alpha (Current — Phase 0)

| Module | Description | Status |
|--------|-------------|--------|
| Chapter System | 7 life areas with structured fields (Swiss-specific) | Shipped |
| Document Tresor | Upload, expiry tracking, chapter-linked storage | Shipped |
| Calendar & Reminders | Date-driven reminders with local notifications | Shipped |
| Charts & Budget | Income/expense visualization from chapter data | Shipped |
| i18n | 4-language support (EN, DE, FR, IT), ~740 keys | Shipped |
| Dark/Light Mode | Palette-based theming, system preference detection | Shipped |
| Offline PWA | Service worker, full offline capability | Shipped |
| Auto-Backup | Rolling IndexedDB snapshots (max 3) | Shipped |
| Validation UX | On-blur field validation with touched-state tracking | Shipped |
| PDF Export | Chapter and full-document export | Shipped |

### Phase 1 — Foundation Modules (Planned)

| Module | Purpose | Runtime Role |
|--------|---------|--------------|
| Source Ingestion | Structured import of documents, data, metadata | Input boundary |
| Validation Engine | Rule-based validation with evidence registration | Quality gate |
| Data Governance | Schema enforcement, data lineage, integrity checks | Trust layer |
| Compliance Module | Policy adherence, regulatory mapping, audit evidence | Compliance gate |
| Human Approval | Explicit approval gates for state transitions | Governance core |
| Memory/State | Persistent operational state with version history | Runtime state |
| Architecture Registry | Module registry, dependency map, capability index | System map |

### Phase 2+ — Orchestration (Future)

| Module | Purpose |
|--------|---------|
| Workflow Engine | Deterministic workflow execution with approval gates |
| Agent Layer | Optional, sandboxed, governed agents (not autonomous) |
| Audit Trail | Immutable event log with provenance chain |
| Rollback System | Evidence-based state recovery |
| Role-Based Access | Team governance with explicit permission model |

---

## 4. Runtime & Execution

### Execution Model

```
Source → Ingestion → Validation → Approval Gate → State Transition → Audit Log
                         ↑                              ↓
                   Rule Engine                    Evidence Register
```

### Hard Constraints

- No hidden autonomous execution
- No opaque AI decision-making
- No uncontrolled background actions
- No cloud-first assumptions
- No breaking persistence migrations
- All state transitions are deterministic and auditable
- Every approval gate requires explicit human action

### Runtime Priorities

1. Approval gates before execution
2. Provenance before convenience
3. Validation before persistence
4. Audit trails for all state changes
5. Deterministic replay capability
6. Rollback-capable state transitions

---

## 5. Governance & Control

### Governance Model

| Layer | Mechanism |
|-------|-----------|
| Source | Ingestion rules, format validation, provenance tagging |
| Data | Schema enforcement, integrity hashes, lineage tracking |
| Workflow | State machine with explicit transitions only |
| Approval | Human-in-the-loop gates, no auto-approve |
| Audit | Immutable event schema, evidence registration |
| Rollback | Version-based recovery with evidence preservation |

### Decision Matrix

| Decision Type | Authority | Evidence Required |
|---------------|-----------|-------------------|
| Field validation | Automatic (rule-based) | Validation rule reference |
| Document acceptance | Human approval | Source provenance + validation pass |
| State transition | Human-triggered | Approval event + prior state hash |
| Schema change | Human approval + review | Migration plan + rollback path |
| Module activation | Human approval | Capability assessment |

---

## 6. UX & Workflow

### Design Principles

- Calm technology: no notifications unless opted in
- Orientation over productivity pressure
- Emotionally safe interactions
- Clear system state at all times
- No dark patterns, no engagement tricks
- Accessible (WCAG 2.1 AA target)

### Workflow Pattern

1. User initiates action (never system-initiated without opt-in)
2. System validates input against rules
3. System presents validation result clearly
4. User confirms/approves if gate requires it
5. System executes deterministically
6. System logs audit event
7. User sees confirmation of new state

### Current UX Features

- Hash-based SPA routing
- Mobile-first responsive design (375px+)
- Keyboard-navigable with focus-visible
- Screen reader accessible (aria-labels, landmarks)
- Print-optimized export
- Calm empty states with orientation hints

---

## 7. Data & Metadata

### Storage Architecture (Alpha)

| Store | Type | Purpose |
|-------|------|---------|
| localStorage | JSON | Chapter fields, settings, preferences (`or5_` prefix) |
| IndexedDB `ordnung-ruhe-documents` | Binary/JSON | Uploaded document files |
| IndexedDB `ordnung-ruhe-backups` | JSON | Rolling auto-backup snapshots |

### Data Integrity

- SHA-256 password hash (local only)
- Version-tagged data migrations
- Auto-backup before destructive operations
- JSON export/import for portability

### Metadata Model (Phase 1)

| Field | Purpose |
|-------|---------|
| `source_id` | Unique provenance identifier |
| `ingested_at` | Timestamp of structured import |
| `validated_at` | Timestamp of last validation pass |
| `approved_by` | Human approval reference |
| `state_hash` | Integrity hash of current state |
| `version` | Monotonic version counter |
| `audit_ref` | Link to audit event log entry |

---

## 8. MVP Scope

### Alpha MVP (Current — Shipped)

- 7 Swiss life chapters with structured fields
- Document upload with expiry tracking
- Calendar reminders with local notifications
- Budget visualization from chapter data
- 4-language i18n (EN, DE, FR, IT)
- Offline-first PWA with service worker
- Auto-backup to IndexedDB
- PDF export
- Dark/light theme
- On-blur validation

### Phase 1 MVP (Next)

- Source ingestion: structured document import with format validation
- Validation engine: configurable rule sets with evidence output
- Human approval UI: explicit gate before state transitions
- Audit event log: local, immutable, viewable
- Module registry: discoverable capabilities with status

### Success Criteria for Phase 1

- [ ] At least one source type can be ingested and validated
- [ ] Validation rules produce traceable evidence
- [ ] Human approval gate blocks unapproved transitions
- [ ] Audit log captures all state changes
- [ ] All operations work fully offline
- [ ] Zero new runtime dependencies added

---

## 9. Success Metrics

### Alpha (Current)

| Metric | Target | Status |
|--------|--------|--------|
| Build size | < 150 KB gzip | 126 KB |
| Runtime dependencies | 0 | 0 |
| Test coverage | All critical paths | 14/14 |
| Offline capability | Full app usable offline | Shipped |
| i18n completeness | 4 languages, 0 missing keys | Shipped |
| Accessibility | Basic WCAG 2.1 AA | In progress |
| Data safety | No data loss on update | Shipped (migrations) |

### Phase 1 Targets

| Metric | Target |
|--------|--------|
| Validation rules | Configurable, evidence-producing |
| Approval gates | Human-only, no auto-approve |
| Audit completeness | 100% state transitions logged |
| Offline operation | All Phase 1 modules work offline |
| Determinism | Same input → same output, always |
| Rollback capability | Any state recoverable from evidence |

### Anti-Metrics (Explicitly Not Optimized)

- User engagement time
- Daily active users
- Feature velocity
- AI automation coverage
- Cloud integration count

---

## Appendix: Architecture Constraints

- No server-side execution in Alpha
- No external API calls without explicit user action
- No telemetry, analytics, or tracking
- No hidden background processes
- No dependency on third-party AI services
- All code paths auditable and deterministic
- Module boundaries must be explicit and documented
