# Alpha Feedback Log

## Purpose

Structured log of feedback received during the alpha testing phase. Each entry is actionable and linked to a roadmap phase.

## Format

| Field | Description |
|-------|-------------|
| Date | When feedback was received |
| Source | Who provided feedback (anonymized role) |
| Category | Feature area |
| Feedback | What was reported |
| Severity | Critical / Important / Nice-to-have |
| Status | Open / Planned / Fixed |
| Phase | Which roadmap phase addresses this |

## Feedback Entries

### F-001: SKOS Household Composition Bug
- **Date**: 2026-05
- **Source**: Basel-Stadt social assistance user
- **Category**: Social Support Calculation
- **Feedback**: Entering 1 child calculates as if 2 adults. Without children, only 1-person rate shown.
- **Severity**: Critical
- **Status**: Planned
- **Phase**: 9 (Household Model) + 14 (Adaptive Calculations)
- **Details**: See [real-life-problems.md](../product/real-life-problems.md)

### F-002: BVG Double Deduction
- **Date**: 2026-05
- **Source**: Basel-Stadt social assistance user
- **Category**: Income Calculation
- **Feedback**: BVG deducted twice if user enters net salary.
- **Severity**: Critical
- **Status**: Fixed (2026-05-16, commit `4cb226f`)
- **Phase**: Resolved ahead of Phase 14

### F-003: Missing Vorsorge Documents
- **Date**: 2026-05
- **Source**: Basel-Stadt social assistance user
- **Category**: Emergency Planning
- **Feedback**: App should ask about Patientenverfügung, Vorsorgeauftrag, Bestattungsverordnung.
- **Severity**: Important
- **Status**: Planned
- **Phase**: 7 (Contact Layer) + 12 (Inventory)

### F-004: Mietbeiträge Support Missing
- **Date**: 2026-05
- **Source**: Basel-Stadt social assistance user
- **Category**: Housing Benefits
- **Feedback**: Mietbeiträge now applies to 1-2 person households.
- **Severity**: Important
- **Status**: Planned
- **Phase**: 13 (Swiss Protection Logic)

### F-005: Insurance Links Missing
- **Date**: 2026-05
- **Source**: Basel-Stadt social assistance user
- **Category**: Insurance
- **Feedback**: Need links for Prämienverbilligung and KVG catalog.
- **Severity**: Nice-to-have
- **Status**: Planned
- **Phase**: 13

### F-006: Retirement Flow Missing
- **Date**: 2026-05
- **Source**: Basel-Stadt social assistance user
- **Category**: Pension
- **Feedback**: Need pensioned yes/no flag, EL application status, pension payout type.
- **Severity**: Important
- **Status**: Planned
- **Phase**: 9 + 14

### F-007: AHV Number Duplication
- **Date**: 2026-05
- **Source**: Internal review
- **Category**: Data Architecture
- **Feedback**: AHV number entered in Basis chapter and KK Scanner separately. Scanner form data lost on navigation.
- **Severity**: Important
- **Status**: Planned
- **Phase**: 7 or 14

### F-008: Hardcoded German in Calculations
- **Date**: 2026-05
- **Source**: Internal review
- **Category**: i18n
- **Feedback**: `cantonalData.js` returns German strings that bypass i18n system.
- **Severity**: Important
- **Status**: Planned
- **Phase**: 6 (i18n)
