# Data Reuse Review

Datum: 15. Juni 2026

---

## Doppelungen

| Datum | Kapitel A | Kapitel B | Feld |
|---|---|---|---|
| Arbeitgeber | `finanzen.employer` | `ausbildung.employer` | Name des Arbeitgebers |
| Kanton | `basis.canton` | `behoerden.cantoneOfTaxation` | Wohn-/Steuerkanton |

### Arbeitgeber
- `finanzen.employer` (im Abschnitt "Einkommen") — wer zahlt das Gehalt
- `ausbildung.employer` (im Abschnitt "Arbeit") — wer ist der Arbeitgeber
- Das ist dieselbe Person/Firma. Nutzer müssen es zweimal eingeben.
- **Empfehlung**: `ausbildung.employer` automatisch aus `finanzen.employer` vorbelegen, wenn vorhanden. Feld bleibt editierbar (verschiedene Arbeitgeber bei Jobwechsel denkbar).
- **Aufwand**: Klein. Im ChapterView beim Rendern prüfen, ob `allData.finanzen.employer` existiert und `data.employer` leer ist → als Placeholder/Default setzen.

### Kanton
- `basis.canton` — Wohnkanton, im Onboarding erfasst
- `behoerden.cantoneOfTaxation` — Steuerkanton
- Meistens identisch. Bei Umzug oder Grenzgänger-Situationen unterschiedlich.
- **Empfehlung**: `behoerden.cantoneOfTaxation` automatisch aus `basis.canton` vorbelegen. Feld bleibt editierbar.
- **Aufwand**: Klein. Gleiche Logik wie oben.

---

## Keine Doppelungen (richtig gelöst)

| Feld | Erfassung | Wiederverwendung |
|---|---|---|
| Vorname / Nachname | `basis` | Notfallkarte, CV-Generator, Backup-Export, Mirror Cards, Onboarding |
| Geburtsdatum | `basis` | Notfallkarte, CV-Generator |
| Telefon | `basis` | Wird nicht dupliziert |
| E-Mail | `basis` | Wird nicht dupliziert |
| AHV-Nummer | `basis` | Wird nicht dupliziert |
| Adresse | `wohnen` | Wird nicht dupliziert |
| Einkommen | `finanzen` | Wohnkostenanteil (cross-chapter via `allData`) |

Die zentrale Architektur (`allData`-Prop) ermöglicht cross-chapter Zugriff ohne Duplizierung. Synthesen wie Wohnkostenanteil nutzen das bereits korrekt.

---

## Mögliche automatische Übernahmen (noch nicht implementiert)

| Von | Nach | Bedingung |
|---|---|---|
| `finanzen.employer` | `ausbildung.employer` | Wenn Zielfeld leer |
| `basis.canton` | `behoerden.cantoneOfTaxation` | Wenn Zielfeld leer |
| `basis.phone` | Notfallkarte Rückrufnummer | Automatisch (kein separates Feld nötig) |

---

## Risiken

- Automatische Vorbelegung darf gespeicherte manuelle Eingaben NICHT überschreiben
- Placeholder-Ansatz (grau, kursiv) ist sicherer als Auto-Fill
- Cross-chapter Abhängigkeiten müssen bei Datenänderung nicht synchronisiert werden — jedes Kapitel speichert seinen eigenen Wert

---

## Aufwand

| Massnahme | Aufwand | Priorität |
|---|---|---|
| Arbeitgeber vorbelegen | 30 Min | P2 |
| Steuerkanton vorbelegen | 30 Min | P2 |
| Zweiter Vorname | 1 Std | P1 (umgesetzt) |

---

## Fazit

Das System hat wenig echte Doppelungen. Die Architektur mit `allData` ist solide. Zwei kleine Vorbelegungen (Arbeitgeber, Kanton) würden den Eindruck "Daten nur einmal eingeben" verstärken, ohne das Datenmodell zu ändern.
