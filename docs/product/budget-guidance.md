# Budget Guidance

## Philosophy

Maloja Plana provides **budget orientation, not budget surveillance**. The goal is to help users understand their financial situation — not to judge, optimize, or gamify their spending.

## Core Principles

### Orientation, not tracking
The app shows where money goes and what's available. It does not set targets, score behavior, or send spending alerts.

### Non-judgmental
No categories are labeled "good" or "bad." No red/green color coding for spending. No "you overspent" messaging. Financial data is presented neutrally.

### Household-aware
Budget calculations account for household composition: number of adults, children, employment percentage, pension status, social support. A single parent with two children has fundamentally different needs than a single adult.

### Canton-aware
Cost-of-living, rent limits, health insurance premiums, and benefit eligibility vary significantly by canton. Budget guidance uses cantonal context where available.

### Life-situation-based templates
Instead of generic budget categories, templates reflect real Swiss life situations:
- Single adult, employed full-time
- Couple with children, one income
- Retired person receiving EL
- Person receiving social assistance (SKOS-based)
- Student with part-time work

## Current Implementation (Phase 5)

- **BudgetSync**: Pulls income/expense data from Finanzen chapter
- **SchuldenManager**: Debt tracking with payoff orientation
- **ChartsAdvanced**: Visual breakdown of financial data
- **BudgetImport**: Import from bank CSV (experimental)

## Planned Enhancements

### Phase 9: Household-aware budgets
- Budget templates adjust for household size and composition
- SKOS Grundbedarf linked to actual household model
- Rent and insurance limits per canton and household type

### Phase 13: Swiss Protection Logic
- Eligibility hints for cantonal benefits (IPV, Mietbeiträge, EL)
- Decision-tree guidance: "Based on your situation, you may be eligible for..."
- Links to cantonal application forms (no auto-submission)

### Phase 14: Adaptive budgets
- Budget adapts when life situation changes (job loss, retirement, new child)
- Historical comparison: "Your situation 6 months ago vs now"
- Export budget summary for social worker or Treuhand

## Data Sources

All data comes from the user's own entries:
- Income: `or5_data.finanzen.income` fields
- Expenses: `or5_data.finanzen` and `or5_data.wohnen` fields
- Household: `or5_data.basis.dependents` (future: full household model)
- Canton: `or5_data.basis.canton`

No external data feeds. No bank API integrations. No scraping.

## Anti-patterns to Avoid

- No spending scores or grades
- No "you're doing great!" or "you need to cut back" messaging
- No comparison to other users or national averages
- No push notifications about spending
- No savings goals or streak mechanics
- No premium features behind budget insights
