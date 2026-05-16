# Field Trust Matrix

## Legend

Trust Levels:
- Critical
- High
- Medium
- Low

Sensitivity:
- Sensitive
- Private
- Normal

Migration Risk:
- High
- Medium
- Low

---

| Field | Trust | Sensitivity | Migration Risk | Notes |
|---|---|---|---|---|
| firstName | High | Private | Low | should exist after onboarding |
| lastName | High | Private | Low | separate from first name |
| phone | High | Private | Low | normalize international format |
| email | High | Private | Low | validation required |
| AHV number | Critical | Sensitive | High | formatting + encryption sensitive |
| address | High | Private | Medium | canton relevance |
| birthDate | High | Sensitive | Medium | retirement calculations later |
| insurance provider | Medium | Private | Low | informational |
| debt amount | Critical | Sensitive | High | impacts budget + stress |
| premium subsidy status | High | Sensitive | Medium | canton-dependent |
| documents | Critical | Sensitive | High | encryption + export concerns |
| budget categories | Medium | Private | Medium | derived-state relevance |
| mobility vehicle data | Medium | Private | Medium | future mobility module |
