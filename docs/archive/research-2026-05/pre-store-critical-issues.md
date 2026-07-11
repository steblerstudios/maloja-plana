# Pre-Store Critical Issues

## Purpose

This file captures issues that must be reviewed before any store release.

The goal is not feature expansion.

The goal is trust, safety, clarity and product maturity.

---

# P0 — Must Review Before Store

## Input Trust

### Full Name

Current concern:
The app asks for full name as one field.

Desired direction:
- first name
- last name
- optional full display name as derived value

Reason:
Many official Swiss systems separate first and last name.

Risk:
Changing this may require data migration.

---

### Phone Number

Current concern:
Phone number input is too simple.

Desired direction:
- allow country code
- normalize spacing
- support Swiss and international formats
- avoid rejecting valid foreign numbers too aggressively

Important:
Do not over-validate.

---

### AHV Number

Current concern:
AHV number needs stronger formatting and validation.

Desired direction:
- format as 756.XXXX.XXXX.XX
- validate length and basic structure
- avoid exposing AHV unnecessarily

Important:
AHV is sensitive personal data.

---

### Email

Current concern:
Email should be normalized and validated calmly.

Desired direction:
- trim whitespace
- lowercase domain
- validate basic structure
- avoid aggressive error tone

---

### Date Reset

Current concern:
When a date is reset, the previous selected date remains visually visible.

Desired direction:
- reset must visually clear the field
- placeholder should return
- no ghost state remains

Source:
Testperson B feedback.

---

# Insurance Foundation

## Missing or Weak Insurance Areas

Needs review:
- Hausratversicherung
- Privathaftpflicht
- Reiseversicherung
- Cyberversicherung
- Autoversicherung
- Mobility-related insurance
- UVG
- KTG
- Franchise
- Selbstbehalt

Important:
Insurance must be understandable without pretending to give broker advice.

---

## KVG / Krankenkasse

Current concern:
KVG basic insurance information is not deep enough.

Needs future review:
- what basic insurance covers
- what basic insurance does not cover
- Franchise
- Selbstbehalt
- BAG catalogue orientation
- canton/IPV differences

Important:
Do not invent official coverage rules.
Use verified sources later.

---

# Budget Foundation

## Debt and Betreibungen

Current concern:
Debt and Betreibungen do not clearly affect budget.

Desired direction:
- monthly debt payments should appear in budget pressure
- Betreibungen should be visible as financial stress indicators
- avoid shame language

---

## Budget UX

Current concern:
Budget still needs more patience and finesse.

Needs review:
- does it feel supportive?
- does it reflect real monthly pressure?
- does it explain synced values clearly?
- does it avoid judgment?

Source:
User feedback and mother feedback.

---

# Education and Work

Current concern:
Education/career area is behind the intended product direction.

Needs future review:
- skills
- certificates
- applications
- temporary work
- Coople-inspired work readiness
- employment documents
- course tracking

Important:
Do not turn this into a job platform.

---

# Swiss Domain Logic

## Canton Logic

Future direction:
Canton should influence:
- taxes
- IPV
- Sozialhilfe orientation
- rent support
- mobility
- school / family systems

Important:
Canton logic must be explainable and reviewed.

---

## Wochenaufenthalter

Current concern:
Weekly residence logic should be visible where relevant.

Future direction:
- distinguish main residence from weekly residence
- explain tax and insurance uncertainty carefully
- avoid legal certainty

---

## Social Protection

Needs future review:
- AHV
- BVG / PK
- Freizügigkeit
- UVG
- KTG
- IV
- EL
- Sozialhilfe interaction

Important:
This belongs to Swiss protection logic and financial hardening phases.

---

# P1 — Important After P0

- Mobility module
- retirement readiness
- relationship layer
- life-event guidance
- document intelligence
- Romansh
- additional languages
- QR sharing

---

# Do Not Implement Immediately

Do not rush:
- full canton rule engine
- full household model
- BAG catalogue integration
- automated legal eligibility
- backend/cloud sync
- insurance recommendation engine
- store release

---

# Recommended Next Implementation Slice

Input Trust Improvements.

Scope:
- date reset visual bug
- phone field formatting
- AHV formatting
- email normalization
- calm validation messages

Avoid:
- schema migration if possible
- full name split until migration is planned
- canton rule engine
- insurance expansion

Reason:
This improves trust immediately with low risk.
