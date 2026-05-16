# FIELD INVENTORY

## PERSON

| Field | Status | UX | Notes |
|---|---|---|---|
| firstName | missing | — | currently only fullName |
| lastName | missing | — | important for Swiss forms |
| birthDate | exists | ok | date reset visual bug |
| phone | exists | weak | no country normalization |
| email | exists | weak | validation weak |
| AHVNumber | exists | weak | formatting missing |

## ADDRESS

| Field | Status | UX | Notes |
|---|---|---|---|
| street | exists | good | |
| houseNumber | exists | good | |
| postalCode | exists | good | |
| city | exists | good | |
| canton | partial | medium | canton logic future |
| country | exists | ok | |

## HEALTH / INSURANCE

| Field | Status | UX | Notes |
|---|---|---|---|
| KVGProvider | exists | medium | BAG context missing |
| franchise | partial | weak | no self-retention clarity |
| selfRetention | missing | — | important Swiss concept |
| supplementaryInsurance | partial | weak | unclear structure |
| householdInsurance | missing | — | requested |
| liabilityInsurance | missing | — | requested |
| travelInsurance | missing | — | requested |
| cyberInsurance | missing | — | requested |

## FINANCE

| Field | Status | UX | Notes |
|---|---|---|---|
| income | exists | medium | |
| expenses | exists | weak | categories unclear |
| debts | partial | weak | not affecting budget |
| enforcement | missing | — | future risk topic |
| savings | exists | ok | |

## MOBILITY

| Field | Status | UX | Notes |
|---|---|---|---|
| carOwnership | missing | — | mobility section absent |
| publicTransport | missing | — | |
| vehicleInsurance | missing | — | |

## DOCUMENTS

| Field | Status | UX | Notes |
|---|---|---|---|
| uploads | exists | good | |
| categories | partial | medium | |
| expiryTracking | partial | medium | |

## RELATIONSHIPS

| Field | Status | UX | Notes |
|---|---|---|---|
| partner | future | — | phase 9 |
| children | future | — | |
| emergencyContact | partial | medium | |

## EDUCATION / WORK

| Field | Status | UX | Notes |
|---|---|---|---|
| employmentStatus | exists | medium | |
| apprenticeship | partial | weak | Coople inspiration not integrated |
| educationHistory | partial | weak | |
