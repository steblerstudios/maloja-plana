# Derived State Map

Purpose:
Document relationships between fields, modules, and future logic.

Important:
This is NOT automation logic yet.
This is only a mapping document.

---

## Budget Relationships

| Source | Affects | Notes |
|---|---|---|
| debt | monthly budget | reduced available money |
| rent | monthly budget | fixed recurring cost |
| insurance premiums | monthly budget | recurring obligations |
| mobility costs | monthly budget | fuel / transport / leasing |
| taxes | monthly budget | canton-dependent later |

---

## Insurance Relationships

| Source | Affects | Notes |
|---|---|---|
| employment status | UVG coverage | employed vs self-employed |
| salary level | BVG relevance | pension relevance |
| canton | premium subsidy | future canton logic |
| household size | subsidy eligibility | future household model |

---

## Retirement Relationships

| Source | Affects | Notes |
|---|---|---|
| birth date | retirement timeline | AHV age calculations later |
| employment history | pension continuity | future BVG logic |
| gaps in work | retirement planning | informational only |

---

## Mobility Relationships

| Source | Affects | Notes |
|---|---|---|
| car ownership | insurance needs | liability / casco |
| mobility costs | budget | recurring cost impact |
| canton | vehicle taxes | future rule engine |

---

## Document Relationships

| Source | Affects | Notes |
|---|---|---|
| insurance document | reminder system | expiry tracking |
| ID/passport | renewal reminders | timeline relevance |
| employment contracts | social protection context | future parsing later |

---

## Important Principles

Derived state must:
- remain explainable
- never become manipulative
- avoid hidden calculations
- preserve user trust
- work offline
- remain reversible where possible
- never simulate legal certainty
