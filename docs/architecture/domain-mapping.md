# Domain Mapping — Maloja Plana Alpha

Status: A-025 · 2026-05-26

## Life Domains → Chapters

Maloja Plana organises personal data into 7 chapters.
Each chapter maps to one or more **life domains** — the real-world contexts
where a person actually needs this information.

| # | Chapter key       | Life domains                          | Fields | Docs |
|---|-------------------|---------------------------------------|--------|------|
| 1 | `basis`           | Identity, Contact, Family             | 11     | 2    |
| 2 | `wohnen`          | Housing, Property                     | 12     | 3    |
| 3 | `finanzen`        | Income, Savings, Credit, Provision    | 12     | 3    |
| 4 | `versicherungen`  | Health, Occupational, Liability, Property, Mobility, Social | 17 | 5 |
| 5 | `ausbildung`      | Education, Work, Languages            | 10     | 3    |
| 6 | `behoerden`       | Tax, Legal, Representation            | 10     | 4    |
| 7 | `notfall`         | Emergency, Medical, Advance care      | 13     | 3    |

**Total: 85 fields, 23 document slots**

## Section breakdown per chapter

### basis (11 fields)
- **Person**: firstName*, lastName*, dateOfBirth*, gender, nationality, canton
- **Contact**: phone, email, ahv
- **Family**: maritalStatus, dependents

### wohnen (12 fields)
- **Address**: address, postalCode, city, moveInDate
- **Costs**: rentAmount, utilities
- **Landlord**: landlord, landlordPhone
- **Property**: mortgageStatus, propertyValue, buildingsInsurance, residenceType

### finanzen (12 fields)
- **Income**: monthlyIncome, employer, employmentType, startDate
- **Savings**: savingsGoal, savingsAccount, bankName
- **Credit**: creditCard, loans
- **Provision**: pension3a, pension3b, investmentFunds

### versicherungen (17 fields)
- **Basic health**: kkInsurer, kkModel, kkPremium, franchise, kkCardNumber
- **Occupational**: bvgInsurer, bvgContribution
- **Additional**: uvg, liabilityInsurance, liabilityAmount
- **Property** _(secondary)_: householdInsurance, householdInsuranceAmount, travelInsurance, cyberInsurance
- **Mobility** _(secondary)_: autoInsurance, autoInsuranceAmount
- **Social**: ahvContribution

### ausbildung (10 fields)
- **Education**: schoolName, educationLevel, efzNumber, certifications
- **Work**: employer, jobTitle, employmentStart, workPermit, workHoursPerWeek
- **Languages**: languages

### behoerden (10 fields)
- **Taxes**: cantoneOfTaxation, taxId, taxFillingDeadline, pendingTaxReturns
- **Legal**: registryOffice, betreibungsStatus, courtCases
- **Representation**: legalRepresentative, representativePhone, willMade

### notfall (13 fields)
- **Contact**: emergencyContact*, emergencyPhone*
- **Medical**: bloodType, allergies, medications, chronicDiseases
- **Care**: doctor, doctorPhone, hospital
- **Provision**: organDonor, patientenverfuegung, vorsorgeauftrag, bestattungswuensche

## Cross-domain overlaps

These fields touch concerns that span more than one chapter:

| Field               | Lives in        | Also relevant to    | Notes                         |
|---------------------|-----------------|---------------------|-------------------------------|
| ahv                 | basis           | versicherungen      | Identifier, not insurance     |
| ahvContribution     | versicherungen  | finanzen             | Annual cost → budget          |
| bvgContribution     | versicherungen  | finanzen             | Monthly cost → budget         |
| kkPremium           | versicherungen  | finanzen             | Monthly cost → budget         |
| employer            | ausbildung      | finanzen             | Duplicated key in both        |
| buildingsInsurance  | wohnen          | versicherungen       | Property insurance            |
| willMade            | behoerden       | notfall              | Advance planning overlap      |
| patientenverfuegung | notfall         | behoerden            | Legal + medical overlap       |

## Progressive disclosure status

| Chapter          | Primary fields | Secondary fields | Toggle implemented |
|------------------|---------------|------------------|--------------------|
| versicherungen   | 11            | 6                | A-025              |
| All others       | all           | 0                | n/a                |

## Design principles

1. **One canonical location** — each field lives in exactly one chapter, even if relevant elsewhere
2. **Derived connections, not duplication** — cross-domain references use budgetSync / derived state, not field copies
3. **Progressive disclosure** — chapters with >12 primary fields should consider secondary grouping
4. **Sections are visual** — they group fields in the UI but carry no data-model weight
5. **New chapters require governance** — adding a chapter is a structural decision, not a feature request
