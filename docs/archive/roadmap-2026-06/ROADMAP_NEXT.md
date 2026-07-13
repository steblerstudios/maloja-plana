# Maloja Plana – Next Phase

## Already strong (Alpha)
- onboarding
- dashboard
- i18n (4 languages, ~740 keys)
- dark mode
- validation UX (on-blur)
- empty states (warm, consistent)
- deployment (Vercel, auto-deploy)
- offline-first architecture (SW + IndexedDB)
- accessibility (aria-labels, landmarks, focus-visible)

## Alpha stabilization (before Phase 1)
1. responsive QA (375px full pass)
2. print/export polish
3. storage corruption testing
4. onboarding polish

## Phase 1 — Governance Runtime (6–8 weeks)
See: [docs/roadmap/PHASE_1_ROADMAP.md](docs/roadmap/PHASE_1_ROADMAP.md)

Milestones:
1. **M1** — Runtime foundation (event bus, state machine, audit log, module registry)
2. **M2** — Validation engine (rule schema, evaluator, evidence register)
3. **M3** — Source ingestion (file parser, schema mapper, import UI)
4. **M4** — Human approval gates (gate component, registry, evidence)
5. **M5** — Audit & observability (viewer, system status, export)
6. **M6** — Integration & polish (E2E flow, mobile QA, docs)

## Explicitly NOT now
- backend / server
- accounts / login
- sync server
- autonomous AI agents
- push infrastructure
- payment system
- cloud-first features
- large dependency additions

## Phase 2+ (Future)
- Workflow engine (deterministic, gated)
- Agent layer (optional, sandboxed, governed)
- Role-based access
- Team governance
- Rollback system with evidence chains
