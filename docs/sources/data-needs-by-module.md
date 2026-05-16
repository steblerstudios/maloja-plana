# Data Needs by Module

Purpose:
Track which real-world Swiss data, rules, explanations, and reference sources are still needed before broader release readiness.

Important:
- Documentation only
- No scraping
- No automated syncing
- No API integration yet
- No legal certainty claims
- Prefer official Swiss sources
- Prefer stable structural data over volatile live data

---

# Priority Levels

| Priority | Meaning |
|---|---|
| P0 | Critical before broader release |
| P1 | Important trust/completeness improvement |
| P2 | Helpful later refinement |
| P3 | Long-term future enhancement |

---

# Basis / Identity Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Swiss phone formatting rules | P0 | +41 formatting behavior |
| AHV formatting structure | P0 | Validation only, not identity verification |
| Email normalization guidance | P0 | Lowercase + trim strategy |
| Address structure examples | P1 | Swiss-friendly examples |
| Canton list verification | P1 | Official canton naming consistency |
| Weekly resident scenarios | P2 | Wochenaufenthalter support later |

## Sources
- OFS/BFS canton references
- Swiss Post address conventions
- AHV official format references

---

# Insurance Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| KVG coverage explanation | P0 | Calm user-facing explanation |
| Franchise models | P0 | CHF 300–2500 |
| Deductible explanation | P0 | Selbstbehalt logic |
| Hausrat insurance basics | P1 | Structural overview |
| Liability insurance overview | P1 | Privathaftpflicht orientation |
| UVG explanation | P1 | Employer accident coverage |
| BVG structure overview | P1 | Pension orientation |
| Travel insurance overview | P2 | Structural only |
| Cyber insurance overview | P2 | Structural only |
| Insurance terminology glossary | P1 | Simple-language support |

## Sources
- BAG
- Comparis (orientation only)
- AXA education pages
- Mobiliar education pages
- AHV/BVG official pages

---

# Budget & Finance Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Realistic Swiss monthly expense ranges | P0 | Calm orientation only |
| Debt pressure scenarios | P1 | Betreibung impact later |
| Budget stress indicators | P1 | Non-judgmental UX |
| Emergency fund guidance | P1 | Soft guidance only |
| Retirement contribution examples | P2 | Long-term planning |
| Regional cost differences | P2 | Canton/city differences |

## Sources
- OFS/BFS household budget data
- Swiss consumer statistics
- Caritas budgeting references
- SKOS orientation references

---

# Housing Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Rental document checklist | P1 | Real-world support |
| Deposit / Kaution overview | P1 | Calm explanation |
| Weekly resident situations | P1 | Cross-canton life realities |
| Shared household edge cases | P2 | WG support later |
| Housing assistance orientation | P2 | Canton-dependent later |

## Sources
- Mieterverband
- Canton social support pages
- Swiss housing guidance pages

---

# Emergency Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Swiss emergency numbers | P0 | Static critical data |
| Emergency contact structures | P1 | Calm first-use support |
| Medical document checklist | P1 | Non-diagnostic |
| Crisis preparation basics | P2 | Calm preparedness only |

## Sources
- Swiss emergency services
- BAG
- Red Cross Switzerland

---

# Employment & Education Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Temporary work structures | P1 | Coople-like realities |
| Swiss CV expectations | P1 | Practical orientation |
| Certificate/document types | P1 | Real-world employment support |
| Apprenticeship pathways | P2 | Swiss-specific education |
| Continuing education references | P2 | Long-term development |

## Sources
- SECO
- Berufsberatung.ch
- Swiss CV examples
- RAV orientation material

---

# Social Support Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Premium subsidy structures | P0 | Canton differences later |
| Sozialhilfe orientation | P1 | Calm informational guidance |
| EL overview | P1 | Ergänzungsleistungen |
| AHV/IV interaction basics | P1 | Structural only |
| Family support structures | P2 | Child/family scenarios |

## Sources
- SKOS
- AHV-IV.ch
- Canton social offices
- BAG

---

# Documents Module

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Typical Swiss document categories | P0 | High trust UX |
| Expiry-sensitive document types | P1 | Reminder logic later |
| Retention guidance | P2 | Educational only |
| Sensitive document classification | P1 | Security UX |

## Sources
- Swiss admin guidance
- Privacy/security best practices
- Insurance and tax document references

---

# Security & Privacy

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Browser storage limitations | P0 | Transparency |
| Device-loss risk explanation | P1 | User trust |
| Offline-first communication | P1 | Calm privacy messaging |
| Backup safety guidance | P1 | Human-readable explanation |
| Export risk education | P2 | User awareness |

## Sources
- MDN
- OWASP
- Privacy-first application references

---

# Accessibility & UX

## Needed Data

| Need | Priority | Notes |
|---|---|---|
| Simple-language patterns | P0 | Universal design |
| Cognitive accessibility guidance | P1 | Calm interactions |
| Reduced overload patterns | P1 | Trust-first UX |
| Multi-language consistency | P1 | DE/FR/IT/RM later |
| Older-user usability testing | P2 | Real-world validation |

## Sources
- WCAG
- GOV.UK design system
- Inclusive design references

---

# Cross-Phase Architecture Concerns

## Future Derived-State Engine
Needs:
- Relationship mapping rules
- Explainable calculations
- Transparent dependencies

## Future Household Model
Needs:
- Shared ownership logic
- Multi-person document visibility
- Household budgeting relationships

## Future Canton Rule Engine
Needs:
- Canton eligibility logic
- Regional thresholds
- Explainable rule transparency

## Future Reminder Intelligence
Needs:
- Calm reminder timing
- Non-anxiety notification design
- Human-readable urgency levels

---

# Important Principle

The product should become:
- calmer
- more trustworthy
- more explainable
- more reality-aligned
- more inclusive

without becoming:
- overwhelming
- bureaucratic
- manipulative
- legally risky
- feature-bloated
