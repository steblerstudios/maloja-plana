# P0 Source Checklist

## Goal

For every P0 module:
- identify authoritative Swiss/GxP sources
- document required datasets
- note licensing/access constraints
- define update cadence
- define validation strategy

---

# 1. Practitioner Registry

## Primary Sources
- MedReg
- BAG physician datasets
- Canton registries (if needed)

## Required Data
- GLN
- ZSR (if available)
- specialty
- canton
- practice address
- status
- license validity

## Validation
- cross-check GLN uniqueness
- active/inactive verification
- specialty normalization

## Update Cadence
- weekly preferred
- monthly minimum

## Risks
- inconsistent canton formats
- missing specialty mappings

---

# 2. Organization Registry

## Primary Sources
- UID Register
- MedReg organizations
- Commercial registry

## Required Data
- UID
- organization name
- address
- legal form
- healthcare classification

## Validation
- duplicate detection
- address normalization
- UID checksum validation

## Update Cadence
- monthly

## Risks
- subsidiaries vs parent entities
- duplicate legal names

---

# 3. Product / GTIN Registry

## Primary Sources
- Swissmedic
- GS1
- EMA reference data (if needed)

## Required Data
- GTIN
- product name
- dosage form
- ATC code
- manufacturer
- authorization status

## Validation
- GTIN checksum
- authorization consistency
- ATC normalization

## Update Cadence
- weekly preferred

## Risks
- packaging variants
- GTIN reuse edge cases

---

# 4. Consent & Audit

## Primary Sources
- nDSG requirements
- GDPR reference controls
- GxP audit expectations

## Required Data
- consent event
- timestamp
- actor
- purpose
- legal basis
- audit trail integrity

## Validation
- immutable log verification
- retention policy checks
- access traceability

## Update Cadence
- continuous

## Risks
- incomplete audit chain
- retention conflicts

---

# 5. Healthcare Facility Registry

## Primary Sources
- Hospital lists
- Canton facility datasets
- BAG datasets

## Required Data
- facility identifier
- type
- canton
- address
- operational status

## Validation
- duplicate detection
- canton normalization

## Update Cadence
- monthly

## Risks
- facility mergers
- naming inconsistencies

---

# Cross-Module Tasks

## Licensing Review
For each source:
- public/open?
- redistribution allowed?
- commercial usage allowed?
- attribution required?

## Technical Pipeline
For each source:
- API available?
- CSV/XML dump?
- scraping required?
- authentication needed?

## Governance
- source owner
- SLA expectations
- fallback strategy
- archival strategy

---

# Deliverables

Each P0 source should end with:
- source owner
- acquisition method
- schema mapping
- validation rules
- refresh schedule
- risk assessment
