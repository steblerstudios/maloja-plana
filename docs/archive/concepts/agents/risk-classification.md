# Agent Risk Classification

## Goal

Define operational and regulatory risk classes for all AI agent actions.

The system must:
- prevent unsafe autonomous behavior
- enforce human oversight where required
- support GxP validation expectations
- maintain traceability for every critical action

---

# Risk Levels

## R0 — Informational

Low-risk, read-only operations.

### Examples
- retrieving public reference data
- generating summaries
- suggesting documentation structures
- metadata inspection

### Characteristics
- no data mutation
- no external side effects
- reversible/no impact

### Approval Requirement
- none

### Logging
- standard audit logging

---

## R1 — Operational Assistance

Moderate-risk support operations.

### Examples
- drafting configurations
- generating validation reports
- proposing mappings
- creating internal recommendations

### Characteristics
- indirect operational impact
- human review expected
- changes not automatically executed

### Approval Requirement
- human review before execution

### Logging
- enhanced trace logging
- actor attribution required

---

## R2 — Controlled Execution

High-risk operational actions.

### Examples
- modifying regulated datasets
- approving ingestion pipelines
- changing compliance configurations
- altering audit-relevant metadata

### Characteristics
- direct operational impact
- regulated data interaction
- traceability mandatory

### Approval Requirement
- explicit human approval
- dual confirmation preferred

### Logging
- immutable audit records
- full before/after state capture

---

## R3 — Critical / Restricted

Critical actions with regulatory or legal consequences.

### Examples
- deleting regulated records
- changing retention policies
- overriding validation failures
- modifying access controls
- releasing production validation states

### Characteristics
- irreversible or high-impact
- compliance-critical
- potential legal implications

### Approval Requirement
- multi-person approval
- documented justification mandatory

### Logging
- cryptographically verifiable audit trail
- long-term retention required

---

# Escalation Rules

Agents must escalate automatically when:
- confidence score falls below threshold
- validation inconsistencies appear
- source integrity cannot be verified
- regulatory ambiguity exists
- requested action exceeds assigned permissions

---

# Human Oversight Principles

## Mandatory Human Review
Required for:
- policy overrides
- validation sign-off
- production release approvals
- source trust changes
- consent-policy modifications

## Human-in-the-Loop
The system should:
- pause before critical execution
- present explainable reasoning
- expose supporting evidence
- require explicit acknowledgement

---

# Audit Requirements

Every action must record:
- agent identity
- user identity
- timestamp
- decision rationale
- confidence level
- affected entities
- approval references
- execution outcome

---

# Risk Scoring Factors

## Data Sensitivity
- public
- internal
- confidential
- regulated

## Operational Impact
- informational
- advisory
- operational
- critical

## Regulatory Exposure
- none
- indirect
- direct GxP relevance
- legal/compliance critical

## Reversibility
- reversible
- partially reversible
- irreversible

---

# Governance Principles

## Least Privilege
Agents receive minimum required permissions.

## Separation of Duties
Critical approval and execution roles should be separated.

## Explainability
High-risk decisions require transparent reasoning.

## Deterministic Validation
Critical workflows should favor deterministic checks over probabilistic outputs.

---

# Deliverables

Every agent definition should include:
- assigned risk level
- permitted actions
- forbidden actions
- approval requirements
- audit obligations
- escalation behavior
- rollback expectations
