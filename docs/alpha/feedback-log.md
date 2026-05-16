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
- **Status**: Partially fixed (2026-05-16, commit `ae1184f`) — autofill + persist done; conflict warnings pending
- **Phase**: Resolved ahead of Phase 7/14 (Slice C remaining)

### F-008: BVG Continuity and Freizügigkeitskonten
- **Date**: 2026-05-16
- **Source**: Family feedback (domain expert)
- **Category**: Pension / Social Protection
- **Feedback**: Employees must manage BVG continuity across job changes. Forgotten Freizügigkeitskonten are common. Users need orientation on where pension assets are and which documents are missing.
- **Severity**: Important
- **Status**: Documented ([social-protection-system.md](../product/social-protection-system.md))
- **Phase**: 14 (Financial Tools Hardening)

### F-009: UVG/KTG Visibility Gap
- **Date**: 2026-05-16
- **Source**: Family feedback (domain expert)
- **Category**: Employment / Insurance
- **Feedback**: Employees see UVG/KTG payslip deductions but don't know insurer or coverage terms. App should help record insurer, policy, employer-provided coverage, and questions to ask employer.
- **Severity**: Important
- **Status**: Documented ([employment-and-insurance.md](../product/employment-and-insurance.md))
- **Phase**: 13 (Swiss Protection Logic)

### F-010: Self-Employed Insurance Gaps
- **Date**: 2026-05-16
- **Source**: Family feedback (domain expert)
- **Category**: Employment / Insurance
- **Feedback**: Self-employed persons often don't know which social insurances they need. Guidance needed for AHV self-registration, accident insurance, KTG, optional BVG, liability insurance. Key question: "What if I have an accident?"
- **Severity**: Important
- **Status**: Documented ([employment-and-insurance.md](../product/employment-and-insurance.md))
- **Phase**: 13-14

### F-011: Retirement Timeline and Planning
- **Date**: 2026-05-16
- **Source**: Family feedback (domain expert)
- **Category**: Pension / Retirement
- **Feedback**: Retirement year should be a life-stage input. Connect retirement flow to AHV, BVG (monthly vs. capital), EL eligibility, tax implications, and document reminders.
- **Severity**: Important
- **Status**: Documented ([retirement-timeline.md](../product/retirement-timeline.md))
- **Phase**: 9 (retirement flag) + 14 (full retirement flow)

### F-012: Hardcoded German in Calculations
- **Date**: 2026-05
- **Source**: Internal review
- **Category**: i18n
- **Feedback**: `cantonalData.js` returns German strings that bypass i18n system.
- **Severity**: Important
- **Status**: Planned
- **Phase**: 6 (i18n)

### F-013: AHV Administration Clarity
- **Date**: 2026-05-16
- **Source**: Family feedback (domain expert)
- **Category**: Social Protection
- **Feedback**: Users need clarity on AHV administration: cantonal Ausgleichskasse, employer vs. self-registration responsibility, proof documents. Especially important for job changers and newly self-employed.
- **Severity**: Important
- **Status**: Documented ([social-protection-system.md](../product/social-protection-system.md))
- **Phase**: 13 (Swiss Protection Logic)
