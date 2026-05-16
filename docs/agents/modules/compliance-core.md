# Compliance Core Module

## Purpose

Central compliance context for Swiss healthcare-related workflows.

This module defines:
- privacy constraints
- audit expectations
- consent requirements
- regulated-data handling principles

---

# Regulatory Scope

Primary references:
- nDSG
- GDPR (where applicable)
- Swiss healthcare regulations
- GxP expectations
- auditability standards

---

# Core Principles

## Privacy First
- collect minimal data
- avoid unnecessary identifiers
- prefer pseudonymization
- explicit purpose limitation

## Auditability
All sensitive actions should be:
- traceable
- timestamped
- attributable
- reviewable

## Conservative Processing
System should:
- avoid speculative medical claims
- separate verified vs inferred data
- require provenance visibility

---

# Consent Expectations

Consent events should contain:
- actor
- timestamp
- purpose
- legal basis
- version/reference
- revocation capability

---

# Retention Principles

Retention must define:
- retention duration
- deletion strategy
- archival strategy
- recovery constraints

---

# Security Expectations

Sensitive operations should support:
- least privilege access
- immutable audit logs
- encrypted transport
- encrypted storage where applicable

---

# Non-Goals

This module does NOT define:
- UI implementation
- frontend design
- infrastructure specifics
- ingestion mechanics

Those belong in separate modules.

---

# Risks

## Major Risks
- hidden PHI leakage
- incomplete audit chains
- inconsistent consent logic
- unclear data provenance

## Operational Risks
- canton-level inconsistencies
- mixed regulatory interpretations
- undocumented overrides

---

# Validation Expectations

Every regulated workflow should support:
- traceability
- reproducibility
- source attribution
- change history visibility
