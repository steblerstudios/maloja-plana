# Real-Life Problems & User Feedback

Structured log of real-world feedback from potential users and domain experts. Each entry includes the raw feedback, analysis, and roadmap implications.

---

## Feedback 2026-05: Basel-Stadt Social Assistance User

### SKOS / Household Composition

**Feedback**: Entering 1 child currently calculates social support as if there were 2 adults. If no children are selected, only 1-person support is calculated.

**Analysis**: The current `calculateSozialhilfe()` uses `householdSize = 1 + dependents`, treating each dependent as an additional full adult in the SKOS table. But the SKOS Grundbedarf table is based on household composition, not just headcount. A household of 1 adult + 1 child has different needs than 2 adults.

**Root cause**: `cantonalData.js` line 192

**Required fix**: Separate adults and children in household model. SKOS tables have distinct rates for different compositions. Phase 14 task, blocked by Phase 9 (Household model).

**Canton-specific values referenced**:
- Basel-Stadt Grundbedarf: CHF 1061 (1 person)
- Basel-Stadt net rent max: CHF 880
- Basel-Stadt health insurance support: max CHF 627

**Important**: These are Basel-Stadt-specific values, NOT universal SKOS values. The current SKOS table uses CHF 1031 for 1 person (national SKOS guideline). Canton overrides must be modeled separately with year/version metadata.

### BVG Double Deduction

**Feedback**: BVG should not be deducted twice. Employer already deducts BVG from salary. Net salary already includes this deduction.

**Analysis**: If the user enters net salary (after BVG deduction) and the app also subtracts a BVG contribution field, BVG is counted twice. The app needs to clearly ask whether salary is gross or net and adjust calculations accordingly.

**Required fix**: Add gross/net salary distinction to the income model. Phase 14.

### Vorsorge Documents

**Feedback**: Ask whether these documents exist:
- Patientenverfuegung (advance healthcare directive)
- Vorsorgeauftrag (lasting power of attorney)
- Bestattungsverordnung (burial instructions)

If yes: allow upload and store reference.
If no: explain what they are, why they matter, how to create them.
Future: reminder/workflow for municipality registration of Vorsorgeauftrag.

**Analysis**: High-trust, emotionally sensitive documents. UX must be calm, non-pressuring, informative. Maps to Phase 7 (Contact layer) and Phase 12 (Inventory).

### Mietbeitraege (Housing Subsidies)

**Feedback**: Mietbeitraege support should be included. Now applies also to 1- and 2-person households under certain conditions.

**Analysis**: Cantonal benefit with varying eligibility rules. Maps to Phase 13 (Swiss Protection Logic) as an eligibility hint with link to cantonal office.

### Insurance System Links

**Feedback**: Include link system for Praemienverbilligung and KVG catalog reference.

**Analysis**: Premium subsidy calculator exists. Adding direct links to cantonal IPV application forms and official KVG service catalog. Low complexity, Phase 13.

### Retirement Flow

**Feedback**: Ask: pensioned yes/no, EL application needed, pension fund monthly payout or capital withdrawal.

**Analysis**: Retirement status fundamentally changes relevant calculations, benefits, and workflows. A pensioned flag should influence tax guidance, EL eligibility, social support, budget guidance. Phase 14 + Household Model (Phase 9).

---

## Feedback 2026-05: Tax Guidance for Social Support

**Feedback**: People receiving social assistance often have simplified or reduced tax obligations depending on canton and support structure.

**Analysis**: Must NOT be modeled as universal rule. Cantonal variability is extreme. Model as contextual guidance with decision-tree logic. Phase 14 adaptive workflows.

---

## Data Duplication: AHV / Franchise / Health Insurance

**Feedback**: KK Scanner manual entry asks for AHV number, franchise, and insurer, but these already exist in Basis and Versicherungen chapters.

**Current storage locations**:
- AHV number: `or5_data.basis.ahv` (persisted) AND KKScanner form (component state, lost on navigation)
- Franchise: `or5_data.versicherungen.franchise` (persisted) AND KKScanner form (lost)
- KK insurer: `or5_data.versicherungen.kkInsurer` (persisted) AND KKScanner form (only insurer is written back)

**Required fix**: KKScanner should auto-fill from existing data. Conflict resolution UI for differing values. AHV must have single source of truth at `basis.ahv`. Phase 7 or Phase 14.

**Privacy note**: AHV number is sensitive PII. Must not be duplicated unnecessarily.
