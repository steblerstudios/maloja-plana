# Estate Generator Architecture

Datum: 15. Juni 2026

---

## Kontext

Maloja erfasst bereits Vorsorge-Informationen:
- Patientenverfügung (Status: ja/nein/in Arbeit)
- Vorsorgeauftrag (Status: ja/nein/in Arbeit)
- Testament (Status: handschriftlich/öffentlich/in Arbeit/nein)
- Bestattungswünsche (Status: ja/nein)

Frage: Wie viel könnte aus vorhandenen Stammdaten vorausgefüllt werden?

---

## Vorsorgeauftrag

### Benötigte Daten
| Feld | Quelle | Vorhanden? |
|---|---|---|
| Vorname, Nachname | `basis.firstName`, `basis.lastName` | Ja |
| Geburtsdatum | `basis.dateOfBirth` | Ja |
| Adresse | `wohnen.address`, `wohnen.postalCode`, `wohnen.city` | Ja |
| Heimatort/Nationalität | `basis.nationality` | Teilweise (kein Heimatort-Feld) |
| Beauftragte Person | Neues Feld nötig | Nein |
| Ersatzperson | Neues Feld nötig | Nein |
| Aufgabenbereiche | Standardtext + Auswahl | Nein |
| Datum, Unterschrift | Wird beim Generieren gesetzt | — |

### Vorausfüllgrad: ~40%
### Zusatzdaten: 3-4 neue Felder
### Aufwand: 2-3 Stunden (Formular + PDF-Vorlage)

---

## Patientenverfügung

### Benötigte Daten
| Feld | Quelle | Vorhanden? |
|---|---|---|
| Vorname, Nachname | `basis` | Ja |
| Geburtsdatum | `basis` | Ja |
| Adresse | `wohnen` | Ja |
| AHV-Nummer | `basis.ahv` | Ja |
| Vertrauensperson | `notfall.emergencyContact`, `notfall.emergencyPhone` | Ja |
| Hausarzt | `notfall.doctor`, `notfall.doctorPhone` | Ja |
| Blutgruppe | `notfall.bloodType` | Ja |
| Allergien | `notfall.allergies` | Ja |
| Medikamente | `notfall.medications` | Ja |
| Behandlungswünsche | Neues Feld (Checkboxen) | Nein |
| Reanimation ja/nein | Neues Feld | Nein |
| Organspende | `notfall.organDonor` | Ja |

### Vorausfüllgrad: ~70%
### Zusatzdaten: 2-3 neue Felder (Behandlungswünsche)
### Aufwand: 3-4 Stunden
### Hinweis: Patientenverfügung hat die HÖCHSTE Datenabdeckung

---

## Testament (handschriftlich)

### Benötigte Daten
| Feld | Quelle | Vorhanden? |
|---|---|---|
| Vorname, Nachname | `basis` | Ja |
| Geburtsdatum | `basis` | Ja |
| Adresse | `wohnen` | Ja |
| Zivilstand | `basis.maritalStatus` | Ja |
| Kinder | `basis.household.children` | Ja (Anzahl) |
| Erben | Neues Feld nötig | Nein |
| Vermächtnisse | Neues Feld nötig | Nein |
| Willensvollstrecker | Neues Feld nötig | Nein |

### Vorausfüllgrad: ~30%
### Zusatzdaten: 3-5 neue Felder
### Aufwand: 3-4 Stunden
### Hinweis: Schweizer Recht erfordert HANDSCHRIFTLICH und DATIERT. Generator kann nur Vorlage/Entwurf liefern, nicht das Dokument selbst.

---

## Bestattungswünsche

### Benötigte Daten
| Feld | Quelle | Vorhanden? |
|---|---|---|
| Vorname, Nachname | `basis` | Ja |
| Bestattungsart | Neues Feld (Erd-/Feuer-/Baumbestattung) | Nein |
| Ort/Friedhof | Neues Feld | Nein |
| Musik/Zeremonie | Neues Feld | Nein |
| Kontaktperson | `notfall.emergencyContact` | Ja |

### Vorausfüllgrad: ~20%
### Zusatzdaten: 3-4 neue Felder
### Aufwand: 2 Stunden

---

## Priorisierung

| Dokument | Vorausfüllgrad | Aufwand | Nutzen | Priorität |
|---|---|---|---|---|
| **Patientenverfügung** | 70% | 3-4 Std | Sehr hoch | **P1** |
| **Vorsorgeauftrag** | 40% | 2-3 Std | Hoch | **P2** |
| Bestattungswünsche | 20% | 2 Std | Mittel | P3 |
| Testament | 30% | 3-4 Std | Hoch, aber rechtlich heikel | P4 |

---

## Architektur-Empfehlung

1. **Kein PDF-Export nötig** — Browser-Druckansicht (wie Notfallkarte) reicht
2. **Formular im Notfall-Kapitel** — Neue Section "Dokumente erstellen" unter den Vorsorge-Feldern
3. **Stammdaten automatisch einfüllen** — via `allData.basis`, `allData.wohnen`, `allData.notfall`
4. **Nur Zusatzdaten abfragen** — als temporäres Formular, nicht als neue persistierte Felder
5. **Klarer Disclaimer** — "Dies ist ein Entwurf. Bitte lass ihn von einer Fachperson prüfen."

---

## Fazit

Die Patientenverfügung hat den höchsten Vorausfüllgrad (70%) und den direktesten Nutzen. Sie ist der natürliche nächste Schritt nach der Notfallkarte: Wer seine Notfalldaten erfasst hat, hat die meisten Daten für eine Patientenverfügung bereits eingegeben.
