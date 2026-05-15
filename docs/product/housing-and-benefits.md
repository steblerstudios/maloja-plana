# Housing & Benefits

## Context

Housing is typically the largest expense for Swiss residents. Cantonal housing benefits (Mietbeiträge) can significantly reduce this burden but are underutilized — many eligible residents don't know they exist or find the application process opaque.

## Current Implementation (Phase 5)

- **Wohnen chapter**: Rent amount, landlord contact, lease details
- **BudgetSync**: Rent included in expense calculations
- No housing benefit calculations yet

## Mietbeiträge (Housing Subsidies)

### What they are
Cantonal subsidies that reduce housing costs for eligible residents. Not part of social assistance (Sozialhilfe) — a separate benefit system.

### Recent expansion
Mietbeiträge now apply to 1- and 2-person households under certain conditions (previously limited to families). This expansion is canton-specific.

### Eligibility factors
- Household income (gross and net)
- Household size and composition
- Rent amount relative to cantonal limits
- Canton of residence
- Residence permit type
- Asset limits

### App's role
Maloja Plana provides **orientation**, not determination:
- "Based on your entries, you may be eligible for Mietbeiträge"
- Link to cantonal application form
- Checklist of documents typically needed for application
- NOT: "You are eligible for CHF X"

## Rent Limits by Canton

Each canton sets maximum rent amounts for social support calculations. These are separate from Mietbeiträge limits.

Example (Basel-Stadt):
- Maximum net rent for social support: CHF 880

These values must be stored with canton code, year, and source reference.

## Housing-Related Documents

| Document | Purpose | Chapter |
|----------|---------|---------|
| Mietvertrag (lease) | Proof of tenancy, notice periods | wohnen |
| Wohnungsabnahmeprotokoll | Move-in/out condition report | wohnen |
| Nebenkostenabrechnung | Utilities settlement | wohnen |
| Kündigung (termination) | Lease termination letter | templates |
| Mietreduktionsbegehren | Rent reduction request | templates |

## Housing-Related Deadlines

| Deadline | Rule |
|----------|------|
| Lease termination notice | Typically 3 months, check lease for specific terms |
| Nebenkosten objection | Usually 30 days after receiving statement |
| Registration after moving | 14 days (Einwohnerkontrolle) |
| Mietbeiträge application | Varies by canton |

## Implementation Timeline

| Phase | Scope |
|-------|-------|
| Phase 5 (current) | Basic rent and landlord data in Wohnen chapter |
| Phase 10 | Lease termination template |
| Phase 13 | Mietbeiträge eligibility orientation, cantonal rent limits |
| Phase 14 | Full housing benefit guidance with household context |

## Interaction with Other Modules

| Module | Interaction |
|--------|------------|
| Budget Guidance | Rent as percentage of income, affordability orientation |
| SKOS | Rent limits for social support calculation |
| Household Model | Household size affects rent limit tiers |
| Template Engine | Kündigung, Mietreduktionsbegehren generation |
| Document Tresor | Lease and utility documents storage |
