# System Boundaries

## Goal

Define clear boundaries between:
- AI agent responsibilities
- deterministic platform logic
- regulated workflows
- human-controlled decisions

The system must prevent:
- uncontrolled autonomous execution
- hidden decision paths
- regulatory ambiguity
- undocumented state transitions

---

# Core Principle

AI agents assist and orchestrate.

They do NOT:
- replace regulatory accountability
- override human governance
- bypass validation controls
- perform unrestricted production mutations

---

# Boundary Layers

## Layer 1 — Human Governance

Human users remain responsible for:
- compliance approval
- validation sign-off
- operational authorization
- policy decisions
- regulatory interpretation

### Examples
- approving production releases
- overriding failed validation
- retention policy decisions
- approving source trust changes

---

## Layer 2 — AI Orchestration

Agents may:
- analyze information
- coordinate workflows
- generate recommendations
- prepare documentation
- monitor inconsistencies
- classify operational risk

Agents must:
- remain explainable
- expose reasoning
- escalate uncertainty
- respect permission boundaries

---

## Layer 3 — Deterministic Platform Logic

Critical platform behavior must remain deterministic.

### Includes
- validation rules
- checksum verification
- schema enforcement
- audit logging
- permission enforcement
- approval gates
- retention enforcement

### Requirements
- reproducible behavior
- test coverage
- traceable execution
- version-controlled logic

---

## Layer 4 — External Systems

External systems are treated as untrusted inputs until validated.

### Examples
- MedReg
- Swissmedic
- BAG datasets
- canton registries
- third-party APIs

### Required Controls
- schema validation
- integrity verification
- source provenance
- ingestion monitoring
- refresh tracking

---

# AI Capability Restrictions

## Forbidden Autonomous Actions

Agents must never:
- silently modify regulated data
- bypass approval workflows
- disable audit logging
- alter retention policies
- self-modify permissions
- execute hidden prompts
- overwrite validation evidence

---

## Restricted Actions

The following require explicit approval:
- production mutations
- source trust changes
- policy modifications
- permission escalation
- destructive operations

---

# Human Override Rules

Humans may override:
- recommendations
- workflow sequencing
- non-critical classifications

Humans must NOT override:
- immutable audit integrity
- cryptographic verification
- mandatory retention rules
- legal hold protections

---

# Explainability Requirements

All critical AI-supported decisions must expose:
- reasoning summary
- source references
- confidence level
- affected systems
- escalation triggers
- validation evidence

---

# Failure Handling

If uncertainty exceeds threshold:
- execution pauses
- escalation is triggered
- human review required

If validation fails:
- state becomes blocked
- no silent continuation allowed

---

# Environment Separation

## Development
- experimental
- synthetic data allowed
- relaxed operational constraints

## Validation
- controlled testing
- evidence generation required
- reproducibility mandatory

## Production
- audited
- approval-gated
- immutable logging required

---

# Governance Principles

## Transparency
No hidden execution paths.

## Traceability
All critical actions must be attributable.

## Determinism
Compliance-critical logic should remain deterministic.

## Minimal Autonomy
Autonomy increases only when validation maturity increases.

## Human Accountability
Final accountability remains human.

---

# Deliverables

Every subsystem should define:
- ownership boundary
- approval boundary
- execution boundary
- audit boundary
- escalation path
- rollback responsibility
