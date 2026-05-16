# Pension & Retirement

## Context

Retirement status fundamentally changes a user's financial landscape. A pensioned person has different income sources, tax obligations, benefit eligibility, and planning needs than an employed person.

## Key Questions the App Must Ask

1. **Are you retired?** (yes/no) — This flag affects all downstream calculations.
2. **Pension type**: Monthly pension payout or capital withdrawal?
3. **EL application**: Have you applied for Ergänzungsleistungen? Are you receiving them?
4. **Pension fund**: Which Pensionskasse? Monthly amount?
5. **AHV**: Receiving AHV pension? Amount?

## Impact of Retirement Flag

When `retired = true`:

| Module | Change |
|--------|--------|
| Tax calculation | Different tax rules, simplified obligations in some cantons |
| Budget guidance | Pension-based template instead of salary-based |
| SKOS | Different eligibility pathway |
| EL | Ergänzungsleistungen eligibility check becomes relevant |
| Insurance | Different premium structure (age-based) |
| Housing | Different Mietbeiträge eligibility |
| BVG | No longer deducted — prevents double-deduction bug |

## Three Pillars in Context

The Swiss pension system has three pillars:

| Pillar | Name | Relevance to App |
|--------|------|------------------|
| 1st | AHV/IV | Monthly pension amount, EL eligibility |
| 2nd | BVG (Pensionskasse) | Monthly or capital, affects tax and budget |
| 3rd | Private (3a/3b) | Withdrawal timing, tax implications |

The app does NOT calculate pension entitlements. It stores the user's actual pension amounts and uses them for budget and benefit calculations.

## EL (Ergänzungsleistungen)

Supplementary benefits for people whose pension doesn't cover basic needs. The app should:
- Ask whether EL is being received
- If not: indicate that EL might be available based on pension + expenses gap
- Link to cantonal EL application resources
- NOT calculate exact EL entitlement (complex, cantonal, individual)

## Data Model (Phase 9+)

```
household[].retirement = {
  isRetired: boolean,
  ahvMonthly: number,
  bvgType: 'monthly' | 'capital' | 'none',
  bvgMonthly: number,
  hasEL: boolean,
  elMonthly: number,
  pillar3aWithdrawn: boolean
}
```

## Related Documents

- [Social Protection System](social-protection-system.md) — AHV, BVG, UVG, KTG structural overview
- [Employment & Insurance](employment-and-insurance.md) — how employment status determines coverage
- [Retirement Timeline](retirement-timeline.md) — pre/at/post-retirement planning orientation

## Implementation Timeline

| Phase | Scope |
|-------|-------|
| Phase 9 | Retirement flag in household model; retirement year as life-stage input |
| Phase 13 | EL eligibility orientation, pension-aware budget |
| Phase 14 | Full retirement flow with all three pillars, BVG continuity, Freizügigkeitskonto tracking |
