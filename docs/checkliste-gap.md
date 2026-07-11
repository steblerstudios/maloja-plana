# Checklisten-Abgleich — Swiss Life Select „notwendige Informationen"

Abgleich der Finanzberatungs-Checkliste (Swiss Life Select) gegen Malojas erfasste Felder
(`src/config/constants.js` → `FIELD_KEYS`) und Dokumentenablage (`DocumentTresor`).
Ziel: was fehlt uns noch.

Legende: ✅ Feld vorhanden · 🟡 nur teilweise / nur als Dokument · 🔴 Lücke

## Vorsorgepolicen
| Checklisten-Punkt | Maloja | Status |
|---|---|---|
| Kontoauszüge 3a | `finanzen.pension3a`, `pension3aBalance`; Saeule3aTracker | ✅ |
| Lebensversicherungspolicen | `finanzen.pension3b` (≈ Säule 3b) — kein explizites Lebensvers.-Feld | 🟡 |
| Pensionskassenleistungsblatt + Reglement | `versicherungen.bvgInsurer/bvgContribution/bvgBalance` (Daten); Doku = Tresor | 🟡 (Doku-Slot) |
| Freizügigkeitskonto/-police | — | 🔴 |

## Arbeitgeberinformationen
| Punkt | Maloja | Status |
|---|---|---|
| Arbeitsvertrag | `finanzen.employer/employmentType`, `ausbildung.employer/jobTitle` (Daten); Doku = Tresor | 🟡 |
| Personalreglement | — | 🔴 (nur Doku) |
| Lohnfortzahlung Krankheit | `versicherungen.ktg` | ✅ |
| Lohnfortzahlung Unfall | `versicherungen.uvg` | ✅ |
| IK-Auszug (AHV) | `basis.ahv`, `versicherungen.ahvContribution` | ✅ |

## Krankenkassenpolicen
| Punkt | Maloja | Status |
|---|---|---|
| Grundversicherung | `kkInsurer/kkModel/kkPremium/franchise/kkCardNumber` | ✅ |
| **Zusatzversicherung** | — kein KK-Zusatz-Feld | 🔴 **(deckt sich mit der Inhaberin Zusatz-Wunsch)** |
| Taggeldversicherung | `versicherungen.ktg` | ✅ |

## Sachversicherungspolicen
| Punkt | Maloja | Status |
|---|---|---|
| Hausrat / Privathaftpflicht | `householdInsurance(+Amount)`, `liabilityInsurance(+Amount)` | ✅ |
| Gebäudeversicherung | `wohnen.buildingsInsurance` | ✅ |
| **Rechtsschutz** | — kein Feld | 🔴 |
| Auto-/Motorradversicherung | `autoInsurance(+Amount)` | ✅ |

## Bankunterlagen
| Punkt | Maloja | Status |
|---|---|---|
| Kontoauszüge / Sparpläne | `finanzen.bankName/savingsAccount` | 🟡 |
| Depotauszüge | `finanzen.investmentFunds` | 🟡 |
| Hypothekarvertrag | `wohnen.mortgageStatus` (nur Status) | 🟡 |
| Darlehensvertrag | `finanzen.loans` | 🟡 |

## Weitere Unterlagen
| Punkt | Maloja | Status |
|---|---|---|
| Steuererklärung | `behoerden`-Steuerfelder + TaxImport | ✅ |
| **Kinderversicherungen** | — | 🔴 |
| Grundbuchauszug | `wohnen.propertyValue` (kein Grundbuch) | 🔴 (Doku) |
| Testamente | `behoerden.willMade` (Boolean) | 🟡 → [[project_digital_legacy]] |
| Ehe-/Konkubinatsvertrag | `basis.maritalStatus` (kein Vertrag) | 🔴 |
| Scheidungsurteil | — | 🔴 → Ablauf I3 Trennung |

## Empfehlung — was zuerst schliessen
**Versicherungsfelder (passen ins Kapitel `versicherungen`, hoher Nutzen):**
1. **KK-Zusatzversicherung** (deckt sich mit dem Zusatz-Ablauf)
2. **Rechtsschutzversicherung**
3. **Lebensversicherung** (explizit, neben Säule 3b)
4. **Freizügigkeitskonto/-police**
5. **Kinderversicherungen**

**Eher Dokumenten-Slots / an bestehende Abläufe knüpfen:**
- Personalreglement, Grundbuchauszug → `DocumentTresor`-Kategorien
- Ehe-/Konkubinatsvertrag, Scheidungsurteil → Abläufe I2 Heirat / I3 Trennung
- Testament → [[project_digital_legacy]] / Nachlass (I4)

Jedes neue Feld braucht Definition in `constants.js` + Label-i18n in 5 Sprachen.
