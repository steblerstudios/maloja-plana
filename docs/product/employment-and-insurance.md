# Employment & Insurance

## Overview

Employment status is the single biggest determinant of which social insurances a person has, how they're administered, and what gaps may exist. Maloja Plana must eventually distinguish between employed, self-employed, and unemployed users to provide meaningful orientation.

## Employed Persons

### What the employer handles
| Insurance | Employer's Role |
|-----------|----------------|
| AHV/IV | Registers employee, deducts and forwards contributions |
| BVG | Enrolls employee in pension fund (Pensionskasse) |
| UVG | Provides accident insurance (mandatory) |
| KTG | May provide daily sickness allowance (optional) |
| ALV | Deducts unemployment insurance contributions |

### What the employee should know
- Which Ausgleichskasse handles their AHV
- Which Pensionskasse manages their BVG
- Which insurer provides UVG coverage
- Whether KTG is included and under what terms
- What documents prove these coverages (Lohnausweis, Vorsorgeausweis, UVG policy)

### Common blind spots
- UVG insurer: employees often don't know who covers them
- KTG terms: waiting period and duration vary widely
- BVG during notice period: coverage continues until last day of employment
- Coverage gaps between jobs

## Self-Employed ("Selber eigene Cheffe")

### Mandatory obligations
| Insurance | Requirement |
|-----------|-------------|
| AHV/IV | Must register with cantonal Ausgleichskasse within 12 months |
| KVG | Basic health insurance (same as everyone) |

### Strongly recommended
| Insurance | Why |
|-----------|-----|
| UVG | No employer coverage — workplace accidents are uninsured |
| KTG | No employer coverage — illness means zero income |
| BVG (voluntary) | No mandatory 2nd pillar — retirement savings gap |
| Haftpflicht (liability) | Business liability for damages to clients or third parties |
| Betriebsversicherung | Property, equipment, business interruption |

### What users need to know
- AHV registration is the user's responsibility (not automatic)
- Without UVG, a workplace accident has no insurance coverage
- Without KTG, illness means no income (KVG covers medical costs, not lost wages)
- Without voluntary BVG, retirement savings are limited to AHV + private 3a/3b
- If the self-employed person has employees, employer obligations apply for those employees

### Key question: "What if I have an accident?"
For a self-employed person without UVG:
- Medical costs: covered by KVG (with franchise and co-payment)
- Lost income: not covered unless KTG is in place
- Disability: only AHV/IV disability pension (often insufficient)

## Unemployed Persons

### During unemployment
- ALV (unemployment insurance) provides income replacement
- AHV contributions continue through ALV
- UVG coverage continues through ALV for 31 days after last payment
- BVG: only mandatory coverage continues; extra-mandatory coverage may lapse

### After ALV ends
- AHV: must register as non-employed if no new job
- BVG: assets transfer to Freizügigkeitskonto
- UVG: coverage ends — private accident insurance needed

## Questions to Ask the Employer

The app should eventually provide a checklist of questions for employees:

1. Which Ausgleichskasse handles my AHV contributions?
2. Which Pensionskasse manages my BVG?
3. Who is my UVG insurer and what is the policy number?
4. Do I have KTG coverage? What are the terms?
5. Can I get a copy of my Vorsorgeausweis (pension certificate)?
6. What happens to my insurance if I leave?

## App Implementation Approach

### Near-term (current app)
- Record employer name, employment type (employed/self-employed/retired)
- Record BVG insurer and contribution in Versicherungen chapter
- Record UVG status (through employer / private / none)

### Phase 13: Swiss Protection Logic
- Employment-status-aware insurance checklist
- Coverage gap detection ("You selected self-employed but have no UVG — consider arranging private accident insurance")
- Questions-to-ask-employer orientation list

### Phase 14: Financial Tools Hardening
- Self-employed insurance guidance flow
- Freizügigkeitskonto tracking
- AHV self-registration reminder

### Future
- Employer-linked document management (Lohnausweis, Vorsorgeausweis per employer)
- Job-change transition checklist
- UVG/KTG detail fields (insurer, policy, coverage terms)

## Important Limitations

- The app does not verify insurance status
- The app does not contact insurers or employers
- Self-employed obligations vary by canton and business type
- All guidance is orientation only — users should verify with their Ausgleichskasse or insurer
