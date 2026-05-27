# A-033 — Budget Recovery Scope

> Mindestmodell für ein realistisches Schweizer Haushaltsbudget.
> Nicht implementieren — nur Scope definieren für WP-2 / A-034.
>
> Stand: 2026-05-27

---

## 1. Aktueller Stand

### Im Code (budgetSync.js)
```
Einnahmen:  1 Feld (monthlyIncome)
Ausgaben:   5 Posten (rent, utilities, mortgage, buildingsInsurance, healthInsurance)
Referenz:   BVG + AHV (als Info, nicht als Kosten)
```

### Problem
Ein Schweizer Haushalt hat 15–25 regelmässige Ausgabeposten. Das aktuelle Budget bildet davon 5 ab. Das ist **nicht orientierungsfähig** für jemanden, der sein Budget verstehen will.

---

## 2. Budget-Kategorien — Schweizer Mindestmodell

### Einnahmen

| Kategorie | Feld-Typ | Quelle | Priorität | Notizen |
|-----------|----------|--------|-----------|---------|
| **Haupteinkommen (Lohn)** | Betrag + Brutto/Netto Toggle | Manuell | Core | Brutto/Netto-Unterscheidung fehlt (MP-DAT-006) |
| **Zweites Einkommen / Partner** | Betrag | Manuell | Important | Braucht Household Model |
| **Kinderzulagen** | Betrag oder automatisch | Manuell / Abgeleitet | Important | Pro Kind, kantonal unterschiedlich (CHF 200–300/Kind) |
| **Alimente (empfangen)** | Betrag | Manuell | Important | Braucht Household Model |
| **Stipendien / Ausbildungsbeiträge** | Betrag | Manuell | Important | Kantonal unterschiedlich |
| **Sozialhilfe-Leistungen** | Betrag oder abgeleitet | Manuell / SKOS-Rechner | Important | Wenn Sozialhilfe bezogen wird |
| **EL (Ergänzungsleistungen)** | Betrag | Manuell | Experimental | Wenn AHV/IV + EL |
| **IPV (Prämienverbilligung)** | Betrag oder abgeleitet | Manuell / IPV-Rechner | Important | Bereits berechnet, nicht im Budget |
| **Rente (AHV/BVG/3a)** | Betrag | Manuell | Important | Wenn pensioniert |
| **Nebenerwerb** | Betrag | Manuell | Experimental | Optional |

### Fixkosten — Wohnen

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Miete** | Vorhanden (rentAmount) | Core | OK |
| **Nebenkosten** | Vorhanden (utilities) | Core | OK |
| **Hypothek** | Vorhanden (mortgagePayment) | Core | OK |
| **Gebäudeversicherung** | Vorhanden (buildingsInsurance /12) | Core | OK |
| **Strom / Gas / Heizung** | Fehlt | Important | Oft nicht in Nebenkosten enthalten |
| **Internet / TV** | Fehlt | Important | CHF 50–120/Monat |
| **Serafe (Radio/TV-Abgabe)** | Fehlt | Experimental | CHF 335/Jahr = ~28/Monat |

### Fixkosten — Versicherungen & Vorsorge

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Krankenkasse (KVG-Prämie)** | Vorhanden (kkPremium) | Core | OK |
| **Krankenkasse Zusatz (VVG)** | Fehlt | Important | Viele CH-Haushalte haben Zusatz |
| **Haftpflichtversicherung** | Fehlt | Important | CHF 5–15/Monat, fast alle CH |
| **Hausratversicherung** | Feld existiert, nicht im Budget | Important | — |
| **Rechtsschutzversicherung** | Fehlt | Experimental | Optional |
| **Autoversicherung** | Feld existiert, nicht im Budget | Important | Wenn Auto vorhanden |
| **Säule 3a** | Feld existiert, nicht im Budget | Important | Max. CHF 7'056/Jahr (2026) |
| **BVG (Referenz)** | Referenzwert, nicht Ausgabe | Core | Richtig so — Arbeitgeber zahlt mit |
| **AHV (Referenz)** | Referenzwert, nicht Ausgabe | Core | Richtig so |

### Fixkosten — Steuern

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Steuern (monatlich umgelegt)** | Fehlt | Core | TaxCalculator existiert, aber nicht im Budget integriert |
| **Kirchensteuer** | Fehlt | Experimental | Kantonal, optional (Austritt) |

### Variable Kosten — Lebenshaltung

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Lebensmittel / Haushalt** | Fehlt | Important | CHF 400–800/Person/Monat (SKOS: ~CHF 500 Single) |
| **Kleidung / Schuhe** | Fehlt | Experimental | CHF 50–150/Monat |
| **Körperpflege / Gesundheit** | Fehlt | Experimental | Selbstbehalt, Medikamente, Zahnarzt |

### Mobilität

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **ÖV-Abo (GA/Halbtax/Verbund)** | Fehlt | Important | CHF 0–395/Monat |
| **Auto (Leasing/Kredit)** | Fehlt | Important | Wenn Auto |
| **Auto (Betrieb: Benzin, Vignette, Parkplatz)** | Fehlt | Important | Wenn Auto |

### Familie / Kinder

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Kinderbetreuung (Kita/Tagesschule)** | Fehlt | Important | CHF 500–2'500/Monat, stark subventioniert |
| **Alimente (zahlen)** | Fehlt | Important | Braucht Household |
| **Schulmaterial / Aktivitäten** | Fehlt | Experimental | — |

### Schulden

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Schulden-Raten** | SchuldenManager existiert, nicht im Budget | Core | MP-BUD-002 — Integration nötig |
| **Betreibungen** | SchuldenManager trackt, nicht im Budget | Important | Als finanzieller Druckindikator |

### Rückstellungen & Sparen

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Notfallreserve** | Fehlt | Important | 3 Monatsausgaben empfohlen |
| **Sparziele** | Fehlt | Experimental | — |
| **Rückstellungen (Zahnarzt, Ferien, Franchise)** | Fehlt | Important | Franchise-Rückstellung besonders wichtig |

### Abos & Wiederkehrend

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Abos (Streaming, Zeitungen, Fitness, etc.)** | Fehlt | Experimental | MP-BUD-005 |
| **Vereinsbeiträge** | Fehlt | Experimental | — |

### Jahreskosten (auf Monat umgelegt)

| Kategorie | Aktuell | Priorität | Notizen |
|-----------|---------|-----------|---------|
| **Steuernachzahlung / Vorauszahlung** | Fehlt | Important | Oft vergessen, dann Schock |
| **Versicherungs-Jahresprämien** | Nur Gebäudevers. /12 | Important | Andere Jahresversicherungen fehlen |
| **Serafe** | Fehlt | Experimental | CHF 335/Jahr |
| **Ferien** | Fehlt | Experimental | — |

---

## 3. Beta-Minimum (empfohlen)

### Phase 1: Struktur (A-034)
- Brutto/Netto-Toggle für Einkommen
- Fixkosten-Kategorien: Steuern, Kommunikation (Internet/Telefon), Lebensmittel, ÖV/Mobilität
- Schulden-Raten aus SchuldenManager ins Budget verlinken
- IPV als Einkommensposten (wenn berechnet)
- Versicherungen (Haftpflicht, Hausrat) als Budget-Posten

### Phase 2: Household (nach WP-3)
- Kinderzulagen als Einnahme
- Alimente als Einnahme/Ausgabe
- Kinderbetreuung als Ausgabe
- Zweites Einkommen (Partner)
- Haushaltsgrössen-abhängige SKOS-Templates

### Phase 3: Orientierung
- Calm Budget Sprache (keine Judgment-Texte)
- SKOS-basierte Referenzwerte
- Jahresübersicht (echte, nicht nur x12)
- Rückstellungen / Notfallreserve

### Nicht Beta
- Abo-Management
- Nebenerwerb-Tracking
- Auto-Betriebskosten-Detail
- Benchmark-Vergleiche
- AI-gestützte Budgetvorschläge

---

## 4. Calm Budget Prinzipien (aus budget-guidance.md)

Diese Prinzipien sind dokumentiert, aber noch nicht im Code:

1. **Orientierung, nicht Überwachung** — zeigen wo Geld hingeht, nicht bewerten
2. **Nicht verurteilend** — keine „gut/schlecht" Kategorien, kein Rot/Grün für Ausgaben
3. **Kein „du hast zu viel ausgegeben"** — stattdessen neutrale Darstellung
4. **Household-aware** — Budget muss Haushaltszusammensetzung berücksichtigen
5. **Kantonal-aware** — Kosten variieren nach Kanton
6. **Lebenssituation-Templates** — statt generischer Kategorien, reale Situationen:
   - Single, vollzeit angestellt
   - Paar mit Kindern, ein Einkommen
   - Pensioniert mit EL
   - Sozialhilfe-Bezüger (SKOS-basiert)
   - Student mit Teilzeitjob

### Aktuelle Verstösse im Code
- `budget.rentWarning`: „Rent is over 40% of income. Consider a more affordable option." → **Judgmental**
- `budget.expensesCritical`: „Total expenses over 90%! Very little room." → **Druck**
- `budget.deficitCritical`: „Expenses exceed income! Please review your budget." → **Scham**

### Calm-Alternativen (Vorschläge für A-034)
- Miete > 40%: „Deine Wohnkosten machen einen grossen Teil aus. Das ist in der Schweiz nicht unüblich."
- Ausgaben > 90%: „Dein Budget ist eng. Hier findest du Hinweise zu möglichen Unterstützungsangeboten."
- Defizit: „Die Ausgaben übersteigen aktuell die Einnahmen. Das kann vorübergehend sein — hier findest du Anlaufstellen."

---

*Dokument: budget-recovery-scope.md v1.0.0*
*Erstellt: 2026-05-27 (A-033)*
*Nicht implementieren — Scope-Definition für WP-2 / A-034.*
