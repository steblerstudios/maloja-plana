# Field Governance Review — Alpha A-025

Status: Review · 2026-05-26
Scope: All 85 fields across 7 chapters

## Current state

- **Required fields**: 5 (firstName, lastName, dateOfBirth, emergencyContact, emergencyPhone)
- **Secondary (progressive disclosure)**: 6 in versicherungen
- **Everything else**: optional, always visible

## Review criteria

Each field is evaluated for:
1. **Required?** — Is this essential for the app to function?
2. **Visible by default?** — Should this show on first load, or hide behind disclosure?
3. **Right chapter?** — Is this in the correct life domain?
4. **Duplicate risk?** — Does this overlap with another field?

---

## Chapter-by-chapter review

### 1. basis (11 fields) — OK

| Field          | Required | Visible | Placement | Notes                    |
|----------------|----------|---------|-----------|--------------------------|
| firstName      | yes      | yes     | correct   |                          |
| lastName       | yes      | yes     | correct   |                          |
| dateOfBirth    | yes      | yes     | correct   |                          |
| gender         | no       | yes     | correct   |                          |
| nationality    | no       | yes     | correct   |                          |
| canton         | no       | yes     | correct   | Used for cantonal calcs  |
| phone          | no       | yes     | correct   |                          |
| email          | no       | yes     | correct   |                          |
| ahv            | no       | yes     | correct   | Identifier, not insurance|
| maritalStatus  | no       | yes     | correct   |                          |
| dependents     | no       | yes     | correct   |                          |

**Verdict**: Clean. 11 fields is a healthy chapter size.

### 2. wohnen (12 fields) — REVIEW NEEDED

| Field              | Required | Visible | Placement | Notes                        |
|--------------------|----------|---------|-----------|------------------------------|
| address            | no       | yes     | correct   |                              |
| postalCode         | no       | yes     | correct   |                              |
| city               | no       | yes     | correct   |                              |
| moveInDate         | no       | yes     | correct   |                              |
| rentAmount         | no       | yes     | correct   | → budgetSync                 |
| utilities          | no       | yes     | correct   | → budgetSync                 |
| landlord           | no       | yes     | correct   |                              |
| landlordPhone      | no       | yes     | correct   |                              |
| mortgageStatus     | no       | yes     | correct   |                              |
| propertyValue      | no       | yes     | correct   |                              |
| buildingsInsurance | no       | yes     | correct   | Cross: versicherungen        |
| residenceType      | no       | yes     | correct   |                              |

**Verdict**: At 12 fields, borderline. The Property section (mortgageStatus, propertyValue, buildingsInsurance, residenceType) could become secondary — most renters don't need these. **Candidate for progressive disclosure.**

### 3. finanzen (12 fields) — REVIEW NEEDED

| Field            | Required | Visible | Placement | Notes                       |
|------------------|----------|---------|-----------|------------------------------|
| monthlyIncome    | no       | yes     | correct   |                              |
| employer         | no       | yes     | correct   | Duplicated in ausbildung     |
| employmentType   | no       | yes     | correct   |                              |
| startDate        | no       | yes     | correct   |                              |
| savingsGoal      | no       | yes     | correct   |                              |
| savingsAccount   | no       | yes     | correct   |                              |
| bankName         | no       | yes     | correct   |                              |
| creditCard       | no       | yes     | correct   |                              |
| loans            | no       | yes     | correct   |                              |
| pension3a        | no       | yes     | correct   |                              |
| pension3b        | no       | yes     | correct   |                              |
| investmentFunds  | no       | yes     | correct   |                              |

**Verdict**: 12 fields is acceptable. The Provision section (pension3a, pension3b, investmentFunds) could become secondary — most users fill income/savings first.

**Duplicate**: `employer` exists in both finanzen and ausbildung. Currently separate data — consider whether one should reference the other.

### 4. versicherungen (17 fields) — ADDRESSED

| Field                     | Required | Visible | Placement | Notes            |
|---------------------------|----------|---------|-----------|------------------|
| kkInsurer                 | no       | yes     | correct   |                  |
| kkModel                   | no       | yes     | correct   |                  |
| kkPremium                 | no       | yes     | correct   | → budgetSync     |
| franchise                 | no       | yes     | correct   |                  |
| kkCardNumber              | no       | yes     | correct   |                  |
| bvgInsurer                | no       | yes     | correct   |                  |
| bvgContribution           | no       | yes     | correct   | → budgetSync     |
| uvg                       | no       | yes     | correct   |                  |
| liabilityInsurance        | no       | yes     | correct   |                  |
| liabilityAmount           | no       | yes     | correct   |                  |
| householdInsurance        | no       | secondary| correct  | A-025            |
| householdInsuranceAmount  | no       | secondary| correct  | A-025            |
| travelInsurance           | no       | secondary| correct  | A-025            |
| cyberInsurance            | no       | secondary| correct  | A-025            |
| autoInsurance             | no       | secondary| correct  | A-025            |
| autoInsuranceAmount       | no       | secondary| correct  | A-025            |
| ahvContribution           | no       | yes     | correct   | Cross: finanzen  |

**Verdict**: Progressive disclosure (A-025) reduced visible fields from 17 → 11. Healthy.

### 5. ausbildung (10 fields) — REVIEW NEEDED

| Field            | Required | Visible | Placement | Notes                       |
|------------------|----------|---------|-----------|------------------------------|
| schoolName       | no       | yes     | correct   |                              |
| educationLevel   | no       | yes     | correct   |                              |
| efzNumber        | no       | yes     | correct   |                              |
| certifications   | no       | yes     | correct   |                              |
| employer         | no       | yes     | correct   | Duplicated in finanzen       |
| jobTitle         | no       | yes     | correct   |                              |
| employmentStart  | no       | yes     | correct   |                              |
| workPermit       | no       | yes     | correct   | Swiss-specific, important    |
| workHoursPerWeek | no       | yes     | correct   |                              |
| languages        | no       | yes     | correct   |                              |

**Verdict**: 10 fields is fine. No disclosure needed. `employer` duplication with finanzen is the only concern.

### 6. behoerden (10 fields) — OK

| Field               | Required | Visible | Placement | Notes                   |
|---------------------|----------|---------|-----------|--------------------------|
| cantoneOfTaxation   | no       | yes     | correct   |                          |
| taxId               | no       | yes     | correct   |                          |
| taxFillingDeadline  | no       | yes     | correct   |                          |
| pendingTaxReturns   | no       | yes     | correct   |                          |
| registryOffice      | no       | yes     | correct   |                          |
| betreibungsStatus   | no       | yes     | correct   |                          |
| courtCases          | no       | yes     | correct   |                          |
| legalRepresentative | no       | yes     | correct   |                          |
| representativePhone | no       | yes     | correct   |                          |
| willMade            | no       | yes     | correct   | Cross: notfall           |

**Verdict**: 10 fields, clean structure.

### 7. notfall (13 fields) — REVIEW NEEDED

| Field                | Required | Visible | Placement | Notes                   |
|----------------------|----------|---------|-----------|--------------------------|
| emergencyContact     | yes      | yes     | correct   |                          |
| emergencyPhone       | yes      | yes     | correct   |                          |
| bloodType            | no       | yes     | correct   |                          |
| allergies            | no       | yes     | correct   |                          |
| medications          | no       | yes     | correct   |                          |
| chronicDiseases      | no       | yes     | correct   |                          |
| doctor               | no       | yes     | correct   |                          |
| doctorPhone          | no       | yes     | correct   |                          |
| hospital             | no       | yes     | correct   |                          |
| organDonor           | no       | yes     | correct   |                          |
| patientenverfuegung  | no       | yes     | correct   | Cross: behoerden         |
| vorsorgeauftrag      | no       | yes     | correct   |                          |
| bestattungswuensche  | no       | yes     | correct   |                          |

**Verdict**: 13 fields, slightly heavy. The Provision section (organDonor, patientenverfuegung, vorsorgeauftrag, bestattungswuensche) could become secondary — these are advance planning items that many users skip initially. **Candidate for progressive disclosure.**

---

## Recommendations

### Immediate (no code change)
- **Required fields are correct.** Only identity + emergency contact need hard validation. All other fields should stay optional per calm UX principles.

### Near-term candidates for progressive disclosure
| Chapter   | Candidate secondary fields                                          | Rationale                        |
|-----------|---------------------------------------------------------------------|----------------------------------|
| wohnen    | mortgageStatus, propertyValue, buildingsInsurance, residenceType    | Renters don't need property section |
| notfall   | organDonor, patientenverfuegung, vorsorgeauftrag, bestattungswuensche | Advance care is a later concern  |
| finanzen  | pension3a, pension3b, investmentFunds                               | Provision is a later concern     |

### Duplicate fields to monitor
| Field     | Chapter 1   | Chapter 2   | Risk                              |
|-----------|-------------|-------------|-----------------------------------|
| employer  | finanzen    | ausbildung  | Same employer, different context   |

Not a bug — finanzen.employer is "who pays you now" while ausbildung.employer is "where you work" (CV context). Keep separate but document the distinction.

### Fields that cross domain boundaries
Already documented in domain-mapping.md. No field is in the wrong chapter — the cross-references are handled by derived state (budgetSync) rather than duplication.

---

## Decision needed from product owner

1. **Apply progressive disclosure to wohnen, notfall, finanzen?** (recommended — same pattern as versicherungen A-025)
2. **Cap for visible fields per chapter?** Suggestion: 10-12 primary fields max before disclosure kicks in
3. **Should `employer` in finanzen and ausbildung remain independent or share state?**
