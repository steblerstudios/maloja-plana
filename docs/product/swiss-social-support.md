# Swiss Social Support (SKOS)

## Overview

Maloja Plana provides orientation on Swiss social assistance (Sozialhilfe) based on SKOS guidelines. The app helps users understand what support they may be entitled to — it does not determine eligibility or submit applications.

## SKOS Grundbedarf

The Swiss Conference for Social Welfare (SKOS) publishes guidelines for basic needs (Grundbedarf). These are **guidelines, not law** — cantons and municipalities may deviate.

### National SKOS Rates (Current)

| Household Size | Monthly Grundbedarf (CHF) |
|---------------|--------------------------|
| 1 person | 1,031 |
| 2 persons | 1,577 |
| 3 persons | 1,918 |
| 4 persons | 2,201 |
| 5 persons | 2,446 |
| 6 persons | 2,691 |
| 7+ persons | 2,891 |

### Canton-Specific Overrides

Cantons may set different values. Example:

**Basel-Stadt** (2026 values):
- Grundbedarf 1 person: CHF 1,061 (vs national CHF 1,031)
- Net rent maximum: CHF 880
- Health insurance support maximum: CHF 627

These are Basel-Stadt-specific values, NOT universal SKOS values. The app must model canton overrides with year and version metadata.

## Known Issues

### Household Composition Bug
**Current**: `householdSize = 1 + Number(dependents)` — treats all dependents as adults.
**Problem**: SKOS tables have different rates for different compositions (1 adult + 1 child ≠ 2 adults).
**Fix**: Requires Phase 9 household model to distinguish adults from children.
**Location**: `cantonalData.js` line 192

### Canton Modeling
**Current**: Single national SKOS table.
**Required**: Per-canton tables with year/version metadata, clear source attribution, and update workflow.

## Architecture Principles

### Canton/year-aware values
Every SKOS value must be tagged with:
- Canton code (or "national" for SKOS guidelines)
- Year of validity
- Source reference

### Basel-Stadt is an example, not universal law
User feedback from Basel-Stadt provided specific values. These must not be applied to other cantons.

### Orientation, not determination
The app shows: "Based on your entries, your situation may qualify for CHF X in Grundbedarf support."
The app does NOT show: "You are entitled to CHF X."

### Separate components
Social support calculation has distinct components:
- **Grundbedarf** (basic needs) — varies by household composition
- **Wohnkosten** (housing costs) — actual rent up to cantonal maximum
- **Gesundheitskosten** (health costs) — insurance premiums up to cantonal maximum
- **Situationsbedingte Leistungen** (situation-specific) — case-by-case

Each component should be displayed separately so users understand the breakdown.

## Interaction with Other Modules

| Module | Interaction |
|--------|------------|
| Household Model | Composition determines SKOS tier |
| Budget Guidance | SKOS Grundbedarf informs budget template |
| Tax Calculation | Social support recipients may have simplified tax obligations |
| Housing Benefits | Mietbeiträge and SKOS rent limits are separate systems |
| Insurance | IPV and SKOS health support are separate pathways |

## Hardcoded German Strings

`cantonalData.js` currently returns German strings that bypass the i18n system. These must be replaced with translation keys in Phase 6 (i18n).

## Implementation Timeline

| Phase | Scope |
|-------|-------|
| Phase 5 (current) | Basic SKOS table, national values only |
| Phase 9 | Household model enables correct composition lookup |
| Phase 13 | Canton-specific values, year metadata, source attribution |
| Phase 14 | Adaptive social support guidance with life-situation context |
