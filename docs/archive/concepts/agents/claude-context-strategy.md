# Claude Context Strategy

## Goal

Prepare a modular context architecture for Claude-assisted development.

Objectives:
- reduce context overload
- isolate domains cleanly
- improve long-session stability
- support regulated healthcare workflows
- separate strategic vs implementation context

---

# Core Principles

## 1. Small Context Units
Contexts should stay:
- focused
- composable
- replaceable
- independently reviewable

Avoid:
- giant monolithic prompts
- mixed regulatory + UI + infra context
- duplicated instructions

---

## 2. Domain Separation

Separate contexts for:
- compliance
- registry data
- frontend UI
- infrastructure
- ingestion pipelines
- validation logic
- audit systems
- AI orchestration

---

## 3. Stable System Layer

Persistent high-level rules:
- privacy first
- Swiss-first healthcare logic
- conservative claims
- auditability
- explainability
- offline-capable where possible
- minimal data collection

This layer changes rarely.

---

# Recommended Context Modules

## P0 Modules

### compliance-core
Contains:
- nDSG constraints
- GDPR references
- audit expectations
- consent handling
- retention rules

### practitioner-registry
Contains:
- GLN logic
- ZSR mapping
- MedReg structure
- validation rules
- normalization strategy

### organization-registry
Contains:
- UID mapping
- healthcare entity structure
- duplicate handling

### product-registry
Contains:
- GTIN
- Swissmedic references
- ATC normalization
- authorization logic

### frontend-ux
Contains:
- calm UI principles
- accessibility
- offline-first UX
- error-state philosophy

### ingestion-pipelines
Contains:
- ETL flow
- validation stages
- retry logic
- schema mapping
- import cadence

### audit-security
Contains:
- audit trail logic
- immutable event strategy
- security boundaries
- local storage constraints

---

# Context Injection Strategy

## Always Loaded
Small permanent layer:
- mission
- compliance posture
- architectural principles

## Dynamically Loaded
Only load domain modules when needed.

Example:
- practitioner work → practitioner-registry
- GTIN work → product-registry
- legal work → compliance-core

---

# Claude Session Strategy

## Short Sessions Preferred
Prefer:
- focused implementation sessions
- isolated review sessions
- isolated refactor sessions

Avoid:
- massive mixed-purpose chats
- regulatory + infra + frontend together

---

# Documentation Rules

Each context module should contain:
- purpose
- boundaries
- source references
- known risks
- assumptions
- non-goals
- validation expectations

---

# Anti-Patterns

Avoid:
- hidden business rules
- implicit assumptions
- mixed terminology
- duplicated compliance logic
- untracked source data
- undocumented transformations

---

# Long-Term Goal

Create:
- deterministic development context
- auditable AI collaboration
- modular healthcare engineering workflows
- low-chaos long-session operation
