# Swiss Social Protection System

## Overview

Switzerland's social protection system is built around mandatory insurances and pension pillars. Most residents — especially immigrants, refugees, and those changing jobs — find the system difficult to navigate. Maloja Plana helps users understand what protections they have, what documents they need, and where gaps may exist.

This document covers the structural framework. For employment-specific details, see [employment-and-insurance.md](employment-and-insurance.md). For retirement, see [retirement-timeline.md](retirement-timeline.md).

## The Five Pillars of Swiss Social Protection

| Abbreviation | Full Name | What It Covers | Mandatory? |
|-------------|-----------|----------------|------------|
| AHV/IV | Alters- und Hinterlassenenversicherung / Invalidenversicherung | Old-age pension, survivors' benefits, disability | Yes (all residents) |
| BVG | Berufliche Vorsorge (Pensionskasse) | Occupational pension (2nd pillar) | Yes (employees earning > threshold) |
| UVG | Unfallversicherung | Accident insurance (workplace + non-workplace) | Yes (employees) |
| KTG | Krankentaggeldversicherung | Daily sickness allowance | Optional (employer-provided or private) |
| KVG | Krankenversicherung | Basic health insurance | Yes (all residents) |

## AHV: How It Works

### Administration
AHV contributions are administered through **cantonal compensation offices** (Ausgleichskassen). The relevant Ausgleichskasse depends on the employer (for employed persons) or canton of residence (for self-employed).

### For employed persons
- The employer registers the employee with the Ausgleichskasse
- Contributions are split: employee pays ~5.3%, employer pays ~5.3%
- The employer deducts and forwards both shares
- The employee should receive an annual statement (Lohnausweis) showing AHV deductions

### For self-employed persons
- The individual must register themselves with the cantonal Ausgleichskasse
- Contribution rates vary (5.371% to 10.6% depending on income)
- Quarterly or annual payment directly to the Ausgleichskasse

### What users need
- Confirmation of registration (especially after job changes or becoming self-employed)
- Annual AHV statement or Lohnausweis showing deductions
- AHV number (756.XXXX.XXXX.XX) — stored in one place only (`basis.ahv`)
- Knowledge of which Ausgleichskasse handles their contributions

## BVG: Pension Fund Continuity

### The continuity problem
When changing jobs, employees must manage their pension fund (Pensionskasse) assets. If the gap between jobs exceeds a certain period, the assets are transferred to a Freizügigkeitskonto (vested benefits account). Many people lose track of these accounts over time.

### Freizügigkeitskonten (Vested Benefits Accounts)
- Created when pension assets cannot be transferred directly to a new employer's fund
- Maximum two accounts allowed
- Assets remain locked until retirement (with limited exceptions)
- The Zentralstelle 2. Säule can help locate forgotten accounts

### What users need
- Record of current pension fund (insurer, contact, contribution amount)
- Record of any Freizügigkeitskonten from previous employment
- Pension fund certificate (Vorsorgeausweis) — issued annually
- Understanding of what happens to assets during job changes

## UVG: Accident Insurance

### For employed persons
- Employer must provide UVG coverage
- Covers workplace accidents (Berufsunfall) and non-workplace accidents (Nichtberufsunfall) for employees working 8+ hours/week
- Many employees do not know which insurer provides their UVG coverage

### For self-employed persons
- UVG is not mandatory but strongly recommended
- Must be arranged privately (Suva or private insurer)

### What users need
- Name of UVG insurer
- Policy number or employer contact for claims
- Understanding of coverage scope (workplace vs. non-workplace)
- Awareness of coverage gaps (e.g., between jobs)

## KTG: Daily Sickness Allowance

### What it is
KTG covers income loss during illness (not accident — that's UVG). It is optional in Switzerland, but many employers provide it.

### Common confusion
- Employees see KTG deductions on payslips but don't know the insurer
- Coverage terms vary widely (waiting period, duration, percentage of salary)
- KTG is separate from KVG (health insurance)

### What users need
- Whether KTG is provided through employer
- Insurer and policy details
- Coverage terms (waiting period, duration, salary percentage)
- What happens if coverage ends (job change, self-employment)

## App's Role: Orientation Only

Maloja Plana provides:
- A place to record insurance details (insurer, policy, contact)
- Checklists of documents typically needed
- Questions to ask the employer about coverage
- Links to official resources (Ausgleichskasse, Zentralstelle 2. Säule)

Maloja Plana does NOT:
- Calculate pension entitlements
- Determine insurance eligibility
- Provide legal or financial advice
- Submit applications on behalf of users

## Implementation Timeline

| Phase | Scope |
|-------|-------|
| Phase 5 (current) | BVG/AHV contribution fields, basic insurance chapter |
| Phase 7 | Contact layer — link employers, insurers, Ausgleichskasse as contacts |
| Phase 13 | Swiss protection logic — coverage gap detection, employer-provided insurance tracking |
| Phase 14 | Financial tools hardening — pension continuity orientation, Freizügigkeitskonto tracking |
| Future | Self-employed insurance checklist, KTG/UVG detail fields, document checklists per insurance type |

## Sources (for future reference, not linked in app)

- AHV/IV: www.ahv-iv.ch
- Zentralstelle 2. Säule: www.zentralstelle.ch
- Suva (UVG): www.suva.ch
- SECO (employment law): www.seco.admin.ch
