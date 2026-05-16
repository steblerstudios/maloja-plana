# Deviation & CAPA Framework

## Objective

Define how deviations, incidents,
non-conformities, and corrective actions
are managed across the platform.

The framework must support:
- GxP expectations
- operational governance
- audit readiness
- traceability
- remediation tracking
- continuous improvement

---

# Core Principles

## Deviations Must Be Traceable

Every deviation must be:
- identifiable
- timestamped
- attributable
- classified
- reviewable
- auditable

No critical deviation should remain undocumented.

---

## Human Accountability

Humans remain accountable for:
- deviation assessment
- severity classification
- approval decisions
- CAPA closure
- remediation oversight

---

## Continuous Improvement

Deviations are treated as:
- learning signals
- validation maturity indicators
- operational risk indicators

---

# Definitions

# Deviation

Any event where:
- expected behavior
- validated behavior
- policy requirements
- regulatory controls
- workflow expectations

are not met.

---

# CAPA

Corrective and Preventive Actions (CAPA)
define how issues are:
- corrected
- investigated
- prevented from recurring

---

# Deviation Categories

## 1. Validation Deviations

Examples:
- failed validation
- missing evidence
- invalid schema
- policy violations

---

## 2. Operational Deviations

Examples:
- orchestration failure
- retry exhaustion
- approval bypass attempt
- incomplete execution

---

## 3. Data Deviations

Examples:
- lineage gaps
- corrupted datasets
- duplicate records
- source inconsistencies

---

## 4. AI Deviations

Examples:
- hallucinations
- confidence threshold failures
- inconsistent outputs
- unsafe recommendations

---

## 5. Security Deviations

Examples:
- unauthorized access
- credential misuse
- boundary violations
- audit integrity failures

---

# Severity Classification

## Critical

Potential impact on:
- patient safety
- regulatory compliance
- audit integrity
- system trustworthiness

Requires immediate escalation.

---

## Major

Significant operational or compliance impact.

Requires remediation tracking.

---

## Minor

Limited operational impact.

May allow simplified remediation.

---

# Deviation Lifecycle

# Step 1 — Detection

Deviation detected by:
- validation layer
- monitoring systems
- human reviewer
- audit review
- runtime monitoring

---

# Step 2 — Classification

Deviation classified by:
- severity
- impact scope
- affected workflows
- regulatory relevance
- recurrence risk

---

# Step 3 — Containment

System may:
- halt execution
- isolate outputs
- trigger approval gates
- disable workflows
- revoke automation privileges

---

# Step 4 — Investigation

Investigation should determine:
- root cause
- contributing factors
- impacted systems
- affected datasets
- affected approvals

---

# Step 5 — CAPA Definition

CAPA should define:
- corrective action
- preventive action
- owner
- due date
- verification requirements

---

# Step 6 — Verification

Verification confirms:
- issue resolved
- controls effective
- recurrence prevented
- validation restored

---

# Step 7 — Closure

Closure requires:
- documented evidence
- reviewer approval
- audit traceability
- remediation verification

---

# CAPA Metadata

## Required Fields

Every CAPA should contain:
- CAPA ID
- deviation reference
- severity level
- owner
- due date
- remediation actions
- verification result
- closure status

---

# Escalation Framework

## Escalation Triggers

Escalation required for:
- critical deviations
- repeated failures
- audit integrity risks
- unresolved CAPAs
- approval failures
- systemic validation drift

---

# AI-Specific Controls

## AI Deviation Controls

AI workflows should monitor:
- hallucination frequency
- confidence degradation
- drift indicators
- inconsistent recommendations
- unsafe outputs

---

## AI Containment

System may:
- disable agent autonomy
- require mandatory review
- reduce execution scope
- increase validation depth

---

# Audit Requirements

## Audit Readiness

The framework must support:
- deviation reconstruction
- CAPA traceability
- reviewer accountability
- remediation history
- chronological replay

---

# Monitoring Requirements

## Continuous Monitoring

System should monitor:
- recurring deviations
- unresolved CAPAs
- remediation delays
- severity trends
- drift patterns

---

# Reporting Requirements

## Required Reports

The framework should support:
- open deviations
- CAPA status
- severity distribution
- recurrence trends
- remediation effectiveness

---

# High-Risk Workflow Requirements

## Enhanced Controls

High-risk workflows require:
- stricter escalation
- mandatory approvals
- enhanced investigation depth
- increased remediation oversight

---

# Deliverables

Each subsystem should define:
- deviation triggers
- escalation criteria
- CAPA ownership
- remediation workflows
- verification requirements
- closure authority
- audit obligations
