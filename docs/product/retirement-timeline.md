# Retirement Timeline

## Overview

Retirement is not a single event but a multi-year transition. Users need orientation well before their retirement date and ongoing support after. Maloja Plana should help users understand what decisions are ahead, what documents they need, and what financial changes to expect — without providing financial advice.

## Key Life-Stage Input

### Retirement age
- Standard AHV retirement age: 65 (being harmonized from previous 64/65 split)
- Early retirement possible from age 58 (BVG) or 63 (AHV, with reduction)
- Deferred retirement possible until age 70 (with increase)

### What the app should eventually ask
- Expected retirement year (or "already retired")
- Whether early or deferred retirement is planned
- This creates a timeline anchor for reminders and planning orientation

## Pre-Retirement Phase (5-10 years before)

### Key decisions ahead
| Decision | Timeframe | Impact |
|----------|-----------|--------|
| BVG: monthly pension vs. capital withdrawal | Must decide before retirement | Irreversible; affects tax, income, estate |
| 3a withdrawal timing | Up to 5 years before retirement | Tax implications; stagger across years |
| AHV gap years | Any time before retirement | Missing contribution years reduce pension |
| EL planning | 3-5 years before if relevant | Asset and income thresholds |

### Documents to gather
- AHV contribution statement (Kontoauszug) — request from Ausgleichskasse
- BVG pension certificate (Vorsorgeausweis) — annual from Pensionskasse
- 3a account statements
- Overview of all Freizügigkeitskonten

### Orientation the app can provide
- "Your expected retirement is in X years"
- "Consider requesting your AHV statement to check for contribution gaps"
- "BVG decision (monthly vs. capital) must be made before retirement"
- Checklist of documents to collect

## At Retirement

### AHV
- Application must be submitted 3-4 months before retirement date
- Monthly pension depends on contribution years and average income
- Partner splitting (Einkommenssplitting) for married couples

### BVG
- Monthly pension OR capital withdrawal (or partial mix, if fund allows)
- Monthly pension: guaranteed income for life, but lower flexibility
- Capital withdrawal: higher flexibility, investment risk, tax on withdrawal
- Coordination with AHV pension for total income picture

### Tax implications
- Capital withdrawal is taxed separately at a reduced rate
- Monthly pension is taxed as income
- Staggering 3a and BVG capital withdrawals across tax years reduces tax burden
- The app should note these considerations but NOT calculate tax impact

## Post-Retirement

### Budget changes
- Income sources shift: salary → AHV + BVG + 3a withdrawals
- Some expenses decrease (commuting, work clothes)
- Health insurance premiums typically increase with age
- EL (Ergänzungsleistungen) may become relevant

### EL Eligibility
- For residents whose pension + income doesn't cover basic needs
- Separate application at AHV branch office (Ausgleichskasse)
- Income and asset thresholds — complex, cantonal variations
- The app should indicate when EL might be worth exploring, not determine eligibility

### Ongoing document needs
- Annual tax return (may be simplified in some cantons)
- AHV pension confirmation
- BVG pension or withdrawal statements
- EL decision if applied

## Connection to Existing Modules

| Module | Retirement Relevance |
|--------|---------------------|
| Budget Guidance | Pension-based template replaces salary-based |
| Tax Calculator | Different income sources, potentially simplified obligations |
| SKOS/Sozialhilfe | Different eligibility pathway for retirees |
| Insurance | Age-based KVG premiums; UVG no longer through employer |
| BVG fields | Shift from "contribution" to "pension received" |
| Document Tresor | AHV statement, Vorsorgeausweis, EL decision storage |

## Implementation Timeline

| Phase | Scope |
|-------|-------|
| Phase 9 | Retirement flag in household model; retirement year as life-stage input |
| Phase 13 | EL eligibility orientation; pension-aware budget template |
| Phase 14 | Full retirement flow — three pillars, BVG decision orientation, AHV gap check |
| Future | Pre-retirement checklist with timeline reminders; capital vs. pension orientation tool |

## Important Limitations

- The app does not calculate pension entitlements (AHV, BVG, or EL)
- BVG monthly vs. capital is a major financial decision — the app provides orientation on considerations, not recommendations
- Tax implications of retirement are complex and canton-specific — orientation only
- All pension amounts stored are user-entered actuals, not projections
