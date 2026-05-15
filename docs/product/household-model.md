# Household Model

## Current State (Phase 5)

The app currently has a single `dependents` field in `or5_data.basis` — a number representing how many dependents the user has. This is insufficient for accurate calculations.

### Known Bugs from Current Model

1. **SKOS household composition**: `calculateSozialhilfe()` uses `householdSize = 1 + dependents`, treating children as additional adults. SKOS tables have distinct rates for different compositions.

2. **BVG double deduction**: If user enters net salary, BVG is already deducted. The app may subtract BVG again if it appears as a separate field.

## Planned Model (Phase 9)

### Household Members

Each household member is a structured object:

| Field | Type | Purpose |
|-------|------|---------|
| role | enum | `primary`, `partner`, `child`, `other_adult` |
| age | number | Affects benefits, insurance, tax |
| employmentStatus | enum | `employed`, `unemployed`, `retired`, `student`, `other` |
| employmentPercentage | number | 0–100, affects income calculations |
| incomeType | enum | `gross`, `net` | Prevents double-deduction bugs |
| hasPension | boolean | Triggers retirement-specific logic |
| hasEL | boolean | Receiving Ergänzungsleistungen |
| hasSocialSupport | boolean | Receiving Sozialhilfe |

### Household-Level Properties

| Field | Type | Purpose |
|-------|------|---------|
| canton | string | Determines cantonal rules |
| housingType | enum | `rent`, `own`, `sublet` |
| monthlyRent | number | For rent limit calculations |

## Impact on Calculations

### SKOS Grundbedarf
- Current: `SKOS_TABLE[1 + dependents]`
- Required: `SKOS_TABLE[composition]` where composition distinguishes adults from children
- Canton overrides (e.g., Basel-Stadt CHF 1061 vs national CHF 1031 for 1 person)

### Tax Estimation
- Household composition affects tax class
- Number of children affects deductions
- Canton + municipality affects tax rate

### Insurance (IPV)
- Household income determines premium subsidy eligibility
- Children have different premium structures

### Budget Templates
- Household composition determines appropriate budget template
- Per-person needs differ by age and role

## Migration Path

Phase 9 must migrate from:
```
{ basis: { dependents: 2 } }
```
to:
```
{ basis: { household: [
  { role: 'primary', ... },
  { role: 'child', age: 8, ... },
  { role: 'child', age: 12, ... }
] } }
```

Migration creates household members from the `dependents` count, defaulting to children. User is prompted to review and correct.

## Privacy Considerations

- Household member data is sensitive (ages, employment, benefits)
- All data stays local — no backend, no aggregation
- Export warnings include household data in scope
- Per-profile PIN (Phase 9) protects household data on shared devices
