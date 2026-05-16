# Data Governance Module

## Purpose

Defines governance expectations for regulated healthcare-related datasets.

Focus:
- source integrity
- lineage
- validation
- ownership
- lifecycle management

---

# Governance Principles

## Authoritative Sources First
Prefer:
- official registries
- regulator datasets
- canonical identifiers
- traceable provenance

Avoid:
- community-maintained uncontrolled datasets
- undocumented mappings
- unverifiable exports

---

# Data Lineage

Each dataset should track:
- source system
- acquisition date
- transformation history
- validation state
- refresh timestamp

---

# Identifier Strategy

## Preferred Identifiers

### Practitioners
- GLN
- ZSR (if applicable)

### Organizations
- UID

### Products
- GTIN
- Swissmedic authorization identifiers

---

# Validation Expectations

## Structural Validation
- schema validation
- required field checks
- type validation

## Semantic Validation
- duplicate detection
- normalization checks
- identifier consistency
- status verification

---

# Refresh Expectations

## Critical Registries
Preferred:
- weekly refresh

Minimum:
- monthly refresh

## Audit-related Data
- append-only where possible
- historical traceability required

---

# Data Ownership

Each dataset should define:
- source owner
- internal owner
- escalation path
- maintenance responsibility

---

# Licensing

For every source:
- redistribution rights
- attribution requirements
- commercial usage constraints
- retention constraints

must be documented.

---

# Risk Categories

## High Risk
- stale practitioner status
- duplicate entities
- identifier collisions
- missing provenance

## Medium Risk
- formatting inconsistencies
- delayed refreshes
- partial mappings

## Low Risk
- cosmetic normalization issues

---

# Non-Goals

This module does NOT define:
- infrastructure deployment
- frontend UX
- database vendor selection
- API framework selection

---

# Validation Checklist

Every governed dataset should support:
- provenance visibility
- refresh visibility
- schema validation
- rollback capability
- audit inspection
