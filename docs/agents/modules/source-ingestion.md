# Source Ingestion Module

## Purpose

Defines ingestion expectations for regulated healthcare datasets.

Focus:
- acquisition
- parsing
- normalization
- validation
- refresh orchestration

---

# Ingestion Principles

## Prefer Official Sources
Priority order:
1. official APIs
2. official bulk exports
3. authenticated partner feeds
4. controlled scraping (last resort)

---

# Supported Acquisition Types

## API
Examples:
- REST
- GraphQL
- SOAP

Requirements:
- authentication handling
- rate limiting
- retry strategy
- version tracking

---

## File-Based Sources

Supported:
- CSV
- XML
- JSON
- XLSX

Requirements:
- schema validation
- encoding validation
- checksum verification where possible

---

## Scraping

Allowed ONLY if:
- no official access exists
- licensing permits usage
- source stability is monitored

Scraping must support:
- selector versioning
- failure detection
- structure change alerts

---

# Ingestion Pipeline Stages

## 1. Acquisition
Retrieve raw source data.

Store:
- acquisition timestamp
- source version
- retrieval metadata

---

## 2. Raw Storage
Keep immutable raw snapshots where feasible.

Goals:
- reproducibility
- auditability
- rollback support

---

## 3. Parsing
Convert raw data into normalized internal structures.

Requirements:
- strict schema handling
- explicit error reporting
- malformed row isolation

---

## 4. Validation

### Structural Validation
- required fields
- schema conformity
- identifier formats

### Semantic Validation
- duplicate detection
- reference consistency
- status verification

---

## 5. Normalization

Examples:
- canton normalization
- address formatting
- specialty normalization
- identifier standardization

Normalization rules must be versioned.

---

## 6. Publication
Only validated datasets should become active.

Support:
- staged rollout
- rollback capability
- publication timestamps

---

# Refresh Strategy

## Critical Sources
Preferred:
- weekly refresh

## Stable Sources
Allowed:
- monthly refresh

Refresh jobs should support:
- retry logic
- partial failure handling
- alerting

---

# Observability

Ingestion systems should expose:
- job status
- validation failures
- refresh age
- source availability
- processing duration

---

# Audit Expectations

Every ingestion run should track:
- source
- timestamp
- version
- validation outcome
- operator/system identity

---

# Risk Categories

## High Risk
- silent schema drift
- corrupted identifiers
- stale source data
- unnoticed ingestion failure

## Medium Risk
- partial refresh failure
- normalization mismatches
- source latency

## Low Risk
- formatting inconsistencies

---

# Non-Goals

This module does NOT define:
- frontend display logic
- UI workflows
- analytics dashboards
- infrastructure vendors

---

# Validation Checklist

Every ingestion pipeline should support:
- reproducibility
- validation visibility
- rollback capability
- immutable source snapshots
- alerting
- provenance tracking
