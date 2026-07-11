# A-034 — Foundation Blockers

> Systeme, die zuerst stabil sein muessen, bevor andere Bereiche wachsen koennen.
> Reihenfolge-relevant. Nicht optional.
>
> Stand: 2026-05-27

---

## Uebersicht

```
Blocker-Kette:

Entscheidungen von Stebler Studios ──┐
                        ├── Household Model ──┬── SKOS-Bug-Fix
                        │                     ├── Budget-Templates
Brutto/Netto ───────────┤                     ├── Alimente
                        │                     ├── Kinderzulagen
                        │                     └── Retirement-Flag
                        │
                        ├── Budget Hardening ──┬── Schulden-Integration
                        │                     ├── IPV im Budget
                        │                     └── Calm Sprache
                        │
                        ├── Hardcoded German Fix
                        │   (entblockt i18n fuer 3 Sprachen)
                        │
                        ├── Export "Meine Unterlagen"
                        │   (braucht Daten aus Budget + Kapiteln)
                        │
                        └── Legal (Impressum, DSE, AGB)
                            (Pflicht fuer Veroeffentlichung)
```

---

## Blocker 1: Entscheidungen von Stebler Studios

**Typ:** Manuell, nicht automatisierbar

| Entscheidung | Warum blockierend | Abhaengige Bereiche |
|-------------|-------------------|---------------------|
| Mutter-Feedback rekonstruieren | Wertvolles Nutzerfeedback ist verloren. Ohne Rekonstruktion fehlt eine der wichtigsten Feedback-Quellen. | Produktpriorisierung |
| Family Expert zuordnen | F-008 bis F-013 — wer ist das? Mutter oder jemand anderes? | Feedback-Kanonisierung |
| BVG-Bug-Status klaeren | feedback-log sagt "behoben", backlog-registry sagt "offen". Widerspruch. | Bug-Tracking |
| Brutto/Netto-Entscheidung | Alle Budget-Berechnungen haengen davon ab. | Budget Hardening |

**Status:**
- Brutto/Netto: **Entschieden** — Netto als Default, Brutto als Option (2026-06-20)
- Mutter-Feedback: **Erledigt** — Vollständige Rekonstruktion 2026-06-21, siehe docs/ux/feedback-rekonstruktion.md
- Family Expert: **Geklärt** — Lynette (Mutter) ist die Hauptquelle
- BVG-Bug-Status: **Geklärt** — kein offener Bug, Vorsorge-Rechner funktioniert korrekt

---

## Blocker 2: Hardcoded German Fix

**Typ:** Technisch, kleiner Aufwand, hoher Impact

| Feld | Wert |
|------|------|
| **Was** | cantonalData.js und premiumCalc.js geben deutsche Strings statt i18n-Keys zurueck |
| **Impact** | 3 von 4 Sprachen (EN/FR/IT) zeigen deutsche Texte in kantonsabhaengigen Bereichen |
| **Aufwand** | Klein — Strings durch i18n-Keys ersetzen, Keys in en.js/fr.js/it.js nachtragen |
| **Blocker fuer** | Korrekte Mehrsprachigkeit, KK-Scanner in Fremdsprachen, IPV-Anzeige |
| **Prioritaet** | **1** — kleinster Aufwand, groesster Impact |
| **Abhaengigkeit** | Keine |
| **Status** | **Done** — cantonalData, premiumCalc, kkScanner alle über i18n. Commits `0ddb57b`, `84006d0`. |

### Betroffene Dateien
- `src/i18n/de.js` — Referenz (bereits deutsche Strings)
- `src/i18n/en.js` — muss neue Keys erhalten
- `src/i18n/fr.js` — muss neue Keys erhalten
- `src/i18n/it.js` — muss neue Keys erhalten
- `premiumCalc.js` — hardcoded German ersetzen
- cantonalData.js oder aequivalent — hardcoded German ersetzen

---

## Blocker 3: Household Model (Minimal)

**Typ:** Architektur-Entscheidung + Implementation

| Feld | Wert |
|------|------|
| **Was** | Haushaltszusammensetzung als Datenstruktur |
| **Scope** | NUR: Anzahl Erwachsene, Anzahl Kinder + Alter, Pensioniert-Flag |
| **Aufwand** | Mittel — Datenstruktur, localStorage-Schema, UI-Felder (minimal) |
| **Prioritaet** | **1** — blockiert die meisten anderen Beta-Features |
| **Abhaengigkeit** | Brutto/Netto-Entscheidung (teilweise) |
| **Status** | **Done** — Datenstruktur, Migration v2→v3, UI in ChapterView, verbunden mit SKOS-Rechner. (2026-06-20) |

### Was es entblockt

| Feature | ID | Wie es entblockt wird |
|---------|-----|----------------------|
| SKOS-Bug-Fix | MP-BUG-001 | Kinder koennen als Kinder (nicht Erwachsene) berechnet werden |
| Kinderzulagen | MP-HH-005 | Pro Kind berechenbar (kantonal CHF 200-300/Kind) |
| Alimente | MP-HH-004 | Als Einnahme/Ausgabe abhaengig von Haushaltssituation |
| Budget-Templates | MP-BUD-003 | Haushaltsgrossenabhaengige Vorschlaege (Single vs. Familie vs. Paar) |
| Retirement-Flag | — | Budget/Steuer-Logik unterscheidet Erwerbstaetige/Pensionierte |
| Sozialhilfe korrekt | MP-SOZ-011 | SKOS-Grundbedarf ist haushaltsgrossenabhaengig |
| Export: Familien-Dossier | — | Erst post-beta, aber Household ist Voraussetzung |

### Minimale Datenstruktur

```javascript
// In localStorage unter or5_ prefix
household: {
  adults: 1,            // Anzahl Erwachsene (1-4)
  children: [],         // Array: [{ age: 8 }, { age: 3 }]
  isRetired: false,     // Pensioniert ja/nein
  // NICHT in Beta:
  // partnerName, childNames, custody, multipleHouseholds, guardians
}
```

### Was NICHT in Beta
- Partner/Ehepartner-Verknuepfung (MP-HH-002)
- Kinder-Detail-Modell mit Einkommen/Versicherung (MP-HH-003)
- Volljährigkeits-Uebergabe (MP-HH-006)
- Eltern-Kind Sichtbarkeit (MP-HH-007)
- Getrennte Eltern / mehrere Wohnsitze (MP-HH-008)
- WG / Mehrgenerationen (MP-HH-009)

---

## Blocker 4: Brutto/Netto-Entscheidung

**Typ:** Produktentscheidung (Stebler Studios)

| Feld | Wert |
|------|------|
| **Was** | Meint das Feld "monthlyIncome" Brutto oder Netto? |
| **Impact** | Alle Budget-Berechnungen, Steuer-Integration, SKOS-Referenzwerte, IPV |
| **Aufwand** | Entscheidung: Minimal. Implementation: Klein (Toggle + Label) |
| **Prioritaet** | **1** (Entscheidung), **2** (Implementation) |
| **Abhaengigkeit** | Keine fuer Entscheidung |
| **Status** | **Done** — Netto als Default, Brutto als Option. `incomeType` Feld in Finanzen-Kapitel, 3 Sprachen. (2026-06-20) |

### Empfehlung

**Netto als Default.** Begruendung:
- Die meisten Menschen kennen ihr Netto (was auf dem Konto ankommt)
- SKOS-Grundbedarfssaetze basieren auf Nettoeinkommen
- Budget-Vergleich ist sinnvoller mit Netto
- Brutto ist optional fuer Steuerberechnung

**Implementation:**
```
Monatliches Einkommen: [________] CHF
                       ○ Netto (was ich erhalte)  ← Default
                       ○ Brutto (vor Abzuegen)
```

---

## Blocker 5: Budget Hardening

**Typ:** Implementation (nach Household + Brutto/Netto)

| Feld | Wert |
|------|------|
| **Was** | Budget von 1+5 auf 1+12 Posten erweitern |
| **Aufwand** | Mittel-Hoch |
| **Prioritaet** | **2** — nach Household |
| **Abhaengigkeit** | Household Model, Brutto/Netto-Entscheidung |
| **Status** | **Done** — Phase 1: 6 Gruppen, 14 Felder, IPV-Relief, Calm Sprache. Phase 2: SKOS-Grundbedarf nach Haushaltsgrösse, Kinderbetreuung, emotionale Temperatur. (2026-06-20) |

### Abhaengige Bereiche

| Bereich | Wie abhaengig |
|---------|---------------|
| Schulden-Integration | SchuldenManager-Raten muessen im Budget sichtbar sein |
| IPV im Budget | IPV-Rechner-Ergebnis als Entlastung/Einnahme anzeigen |
| Steuern im Budget | TaxCalculator-Ergebnis als monatliche Ausgabe |
| Lebensmappe-Export | Budget-Uebersicht ist Teil der Lebensmappe |
| Calm Sprache | Judgment-Texte muessen ersetzt werden (rentWarning, expensesCritical, deficitCritical) |

### Budget-Hardening Beta-Scope (aus budget-recovery-scope.md)

**Phase 1 (Struktur):**
- Brutto/Netto-Toggle
- Fixkosten: Steuern, Internet/Telefon, Lebensmittel, OeV/Mobilitaet
- Schulden-Raten aus SchuldenManager
- IPV als Einkommensposten
- Versicherungen (Haftpflicht, Hausrat)

**Phase 2 (nach Household):**
- Kinderzulagen als Einnahme
- Alimente als Einnahme/Ausgabe
- Kinderbetreuung als Ausgabe
- Haushaltsgroessen-Templates

**Phase 3 (Orientierung):**
- Calm Budget Sprache
- SKOS-Referenzwerte
- Rueckstellungen / Notfallreserve

---

## Blocker 6: Export-Architektur

**Typ:** Implementation (parallel moeglich)

| Feld | Wert |
|------|------|
| **Was** | Neuer Bereich "Meine Unterlagen" (#/unterlagen) mit 2 Dossier-Typen |
| **Aufwand** | Mittel |
| **Prioritaet** | **3** — nach Budget, parallel zu Legal |
| **Abhaengigkeit** | Budget Hardening (fuer Lebensmappe-Inhalt) |
| **Status** | **Done** — Hub (#/unterlagen), Lebensmappe (6 Kapitel + Dokumente), Notfalldossier (6 Sektionen), browser-native Print/PDF, A4 Styling. `dossierGenerator.js` + `Lebensmappe.jsx` + `NotfallDossier.jsx`. (2026-06-20) |

### Abhaengige Bereiche

| Bereich | Wie abhaengig |
|---------|---------------|
| Lebensmappe | Braucht Kapitel-Zusammenfassungen + Budget-Uebersicht |
| Notfalldossier | Braucht Notfall-Kapitel-Daten + medizinische Felder |
| Behoerden-Dossier (post-beta) | Braucht Export-Architektur als Basis |
| Steuer-Dossier (post-beta) | Braucht Export-Architektur als Basis |

---

## Blocker 7: Backlog Canonicalization

**Typ:** Prozess-Hygiene (nicht user-facing)

| Feld | Wert |
|------|------|
| **Was** | backlog-registry.json von 48 auf 260+ Eintraege erweitern |
| **Aufwand** | 2-3 Stunden |
| **Prioritaet** | **Niedrig** fuer Beta-Release, **Hoch** fuer Projektsteuerung |
| **Abhaengigkeit** | Keine |

Kann jederzeit parallel gemacht werden. Blockiert keinen Code, aber blockiert saubere Fortschrittsmessung.

---

## Reihenfolge-Zusammenfassung

```
Ebene 0 (sofort, manuell):
  Stebler Studios: Feedback-Recovery + Brutto/Netto + BVG-Status

Ebene 1 (keine Abhaengigkeiten):
  → Hardcoded German Fix
  → QR-Code CDN Fix
  → Backlog Canonicalization (parallel)

Ebene 2 (nach Entscheidungen von Stebler Studios):
  → Household Model (Minimal)
  → SKOS-Bug-Fix (nach Household)

Ebene 3 (nach Household + Brutto/Netto):
  → Budget Hardening Phase 1 (Struktur)
  → Budget Hardening Phase 2 (Household-abhaengig)
  → Calm Budget Sprache

Ebene 4 (nach Budget):
  → Export "Meine Unterlagen" Bereich
  → Lebensmappe PDF
  → Notfalldossier PDF

Ebene 5 (parallel, keine Code-Abhaengigkeit):
  → Impressum
  → Datenschutzerklaerung
  → Nutzungsbedingungen

Ebene 6 (wenn Zeit):
  → Template Engine + Briefgenerator
  → AHV/BVG/ALV Info-Sektionen
  → Emotionale Temperatur
  → PWA / Service Worker
```

---

## Kritischer Pfad

Der kuerzeste Weg zur Beta:

```
Entscheidungen von Stebler Studios (Ebene 0)
        ↓
Hardcoded German Fix (Ebene 1, ~1 Tag)
        ↓
Household Model Minimal (Ebene 2, ~2-3 Tage)
        ↓
SKOS-Bug-Fix (Ebene 2, ~1 Tag)
        ↓
Budget Hardening (Ebene 3, ~3-5 Tage)
        ↓
Export Meine Unterlagen (Ebene 4, ~3-4 Tage)
        ↓
Legal (Ebene 5, ~1-2 Tage, parallel moeglich)
        ↓
= Beta-Ready
```

**Geschaetzter kritischer Pfad: ~12-16 Arbeitstage** (nach Entscheidungen von Stebler Studios)

---

*Dokument: foundation-blockers.md v1.0.0*
*Erstellt: 2026-05-27 (A-034)*
*Keine Implementation — nur Blocker-Analyse.*
