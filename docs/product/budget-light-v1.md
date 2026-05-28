# Budget Light V1 — Produktdefinition

> Ruhige Schweizer Haushaltsübersicht.
> Orientierung, nicht Bewertung.
>
> Stand: 2026-05-27

---

## 1. Warum Budget Light existiert

Menschen, die Maloja Plana nutzen, wollen wissen:

- Was kommt rein?
- Was geht raus — und wohin?
- Bleibt etwas übrig?
- Vergesse ich etwas?

Budget Light beantwortet diese vier Fragen.
Nicht mehr. Nicht weniger.

### Was Budget Light ist

Ein ruhiger Spiegel der eigenen Lebensrealität.
Eine Übersicht, die zeigt, wohin das Geld fliesst —
ohne zu bewerten, ob das richtig oder falsch ist.

### Was Budget Light NICHT ist

- Keine Finanzsoftware
- Keine Banking-App
- Keine Buchhaltung
- Kein ERP-System
- Kein Excel-Klon
- Kein Investment-Tool
- Kein Sparcoach
- Kein Optimierer

### Emotionale Funktion

Budget Light soll das Gefühl vermitteln:

> „Ich habe einen Überblick. Ich weiss, wo ich stehe.
> Ich muss nicht alles sofort ändern — aber ich sehe es."

Das ist die Kernleistung.
Nicht Perfektion. Orientierung.

---

## 2. Produktprinzipien

### Ruhig statt alarmistisch

Budget Light zeigt Verhältnisse. Es schlägt keinen Alarm.
Ein Budget, das eng ist, wird neutral dargestellt —
nicht mit Ausrufezeichen, Rot oder Warnsymbolen.

### Orientierung statt Optimierung

Ziel ist Sichtbarkeit, nicht Verbesserung.
Budget Light sagt nicht „du solltest weniger ausgeben".
Es zeigt: „Hier geht dein Geld hin."

### Vollständigkeit statt Perfektion

Lieber 10 Kategorien grob erfasst als 3 Kategorien perfekt berechnet.
Ein Schweizer Haushalt hat 10-15 regelmässige Posten.
5 Posten (aktueller Stand) sind nicht orientierungsfähig.

### Schweizer Lebensrealität sichtbar machen

Kategorien bilden den Schweizer Alltag ab:
Krankenkasse, ÖV-Abo, Steuern, Haftpflicht, Säule 3a.
Nicht generische Finanzkategorien wie „Sonstiges" oder „Entertainment".

### Keine Schuldzuweisung

Geld ist emotional. Budget Light weiss das.
Keine Sprache, die impliziert: „Du machst etwas falsch."
Keine Sprache, die impliziert: „Du machst etwas richtig."
Neutrale Darstellung. Immer.

### Keine Gamification

Keine Scores. Keine Streaks. Keine Badges.
Kein „Du hast diesen Monat 12% gespart — weiter so!"
Budget ist kein Spiel.

### Keine KPI-Hölle

Keine Prozentzahlen als Hauptinformation.
Keine Dashboard-Karten mit 6 verschiedenen Metriken.
Budget Light zeigt Beträge und Verhältnisse. Ruhig.

### Leere Felder sind in Ordnung

Nicht jeder hat ein Auto. Nicht jeder zahlt Steuern separat.
Leere Felder werden nicht bestraft, nicht rot markiert, nicht angemahnt.
„Noch nicht erfasst" ist ein neutraler Zustand.

---

## 3. Scope V1 (Stufe A)

### Prinzip

V1 enthält nur Felder, die:
1. ohne Household Model funktionieren
2. manuell eingegeben werden (kein Cross-System-Sync)
3. für die Mehrheit der Schweizer Haushalte relevant sind
4. die Budget-Übersicht von „unbrauchbar" zu „orientierungsfähig" heben

### Einnahmen

| Feld | Quelle | Eingabe | Status |
|------|--------|---------|--------|
| **Nettoeinkommen** | `finanzen.monthlyIncome` | Bestehend | Vorhanden |

Ein Einkommensfeld reicht für V1.
Brutto/Netto-Toggle, Zweiteinkommen, Kinderzulagen, Alimente, IPV —
alles Stufe B (nach Household Model).

**Label-Klarstellung nötig:** „Monatliches Nettoeinkommen — was auf deinem Konto ankommt."

### Ausgaben — Gruppiert

#### Gruppe: Wohnen

| Feld | Quelle | Status | Notiz |
|------|--------|--------|-------|
| **Miete** | `wohnen.rentAmount` | Vorhanden | — |
| **Nebenkosten** | `wohnen.utilities` | Vorhanden | — |
| **Hypothek** | `wohnen.mortgagePayment` | Vorhanden | Nur wenn Eigentum |

Bestehende Felder. Keine Änderung nötig.

#### Gruppe: Versicherung & Gesundheit

| Feld | Quelle | Status | Notiz |
|------|--------|--------|-------|
| **Krankenkasse (KVG)** | `versicherungen.kkPremium` | Vorhanden | — |
| **Weitere Versicherungen** | `finanzen.otherInsurance` | **Neu** | Haftpflicht, Hausrat, Rechtsschutz, KK-Zusatz — ein Sammelfeld |

Ein Sammelfeld für alle weiteren Versicherungen. Nicht 4 Einzelfelder.
Wer es genauer wissen will, nutzt das Versicherungskapitel.

#### Gruppe: Leben

| Feld | Quelle | Status | Notiz |
|------|--------|--------|-------|
| **Lebensmittel & Haushalt** | `finanzen.groceries` | **Neu** | Grösster variabler Posten |
| **Internet & Telefon** | `finanzen.communication` | **Neu** | Fast jeder Haushalt |

Zwei Felder. Nicht mehr. Keine Unterkategorien für Kleidung, Körperpflege, Freizeit.
Das wäre Tabellenhölle.

#### Gruppe: Mobilität

| Feld | Quelle | Status | Notiz |
|------|--------|--------|-------|
| **Mobilität** | `finanzen.mobility` | **Neu** | ÖV-Abo, Halbtax, GA, oder Autokosten — ein Feld |

Ein Feld. Hint-Text: „GA, Halbtax, Verbundabo oder Autokosten pro Monat."

#### Gruppe: Steuern & Vorsorge

| Feld | Quelle | Status | Notiz |
|------|--------|--------|-------|
| **Steuern (monatlich)** | `finanzen.monthlyTax` | **Neu** | Manuell, eigene Schätzung |
| **Säule 3a** | Abgeleitet: `finanzen.pension3a / 12` | Ableitung | Bestehendes Feld, nur Budgetintegration |

Steuern als manuelles Feld: „Deine monatliche Steuerlast — geschätzt oder laut Steuerrechnung."
Kein TaxCalculator-Sync in V1.

### Zusammenfassung V1

| Gruppe | Posten | Davon neu |
|--------|--------|-----------|
| Einnahmen | 1 | 0 |
| Wohnen | 3 | 0 |
| Versicherung & Gesundheit | 2 | 1 |
| Leben | 2 | 2 |
| Mobilität | 1 | 1 |
| Steuern & Vorsorge | 2 | 1 |
| **Total** | **11** | **5** |

**Von 5 Posten auf 11.** Das ist die minimale Schwelle zur Orientierung.

### Bewusste Entscheidungen

**Warum kein Brutto/Netto-Toggle?**
Erfordert entweder manuelle Doppeleingabe oder eine Steuer-/Sozialabzugs-Engine.
Beides ist V1-Scope-Killer. Label-Klarstellung reicht.

**Warum nur ein Versicherungs-Sammelfeld?**
Haftpflicht (CHF 10), Hausrat (CHF 15), Rechtsschutz (CHF 20), KK-Zusatz (CHF 40) —
einzeln sind das Kleinstbeträge. Ein Sammelfeld genügt.
Das Versicherungs-Kapitel hat die Details.

**Warum kein Schulden-Feld in V1?**
SchuldenManager-Verknüpfung ist Stufe C (Cross-System-Sync).
Wer Schuldenraten hat, kann sie manuell unter einem allgemeinen Feld erfassen.
Automatische Verknüpfung kommt post-V1.

**Warum keine Kinderbetreuung?**
Braucht Household Model (gibt es Kinder? Wie alt?). Stufe B.

---

## 4. Rückstellungen & Reserven

### Evaluation

Rückstellungen sind eine Schweizer Realität, die häufig vergessen wird:
- Franchise-Selbstbehalt (CHF 300-2'500/Jahr)
- Zahnarzt (nicht in KVG enthalten)
- Nebenkostenabrechnung
- Serafe (CHF 335/Jahr)
- Steuernachzahlung
- Ferien
- Unerwartetes (Reparaturen, Umzug, Geräte)

### Nutzen

**Hoch.** Rückstellungen sind der Grund, warum viele Schweizer Haushalte
Ende Jahr „überrascht" werden. Eine ruhige Erinnerung daran,
dass es Jahreskosten gibt, ist echte Orientierung.

### Risiko

**Mittel.** Rückstellungen können schnell in Finanzplanung abdriften:
Wie viel pro Monat? Automatisch berechnen? Zielbeträge?
Das wäre Scope-Killer.

### Scope-Aufwand

**Klein — wenn richtig geschnitten.**

### UX-Wirkung

**Beruhigend — wenn richtig formuliert.**

### Entscheidung: Ja, aber als Info — nicht als Feld

Budget Light V1 zeigt Rückstellungen **nicht als Eingabefeld**,
sondern als **ruhigen Hinweis** unterhalb der Ausgabenübersicht:

> **Dran denken**
>
> Manche Kosten fallen nicht monatlich an, aber regelmässig:
> Zahnarzt, Franchise, Serafe, Nebenkostenabrechnung, Ferien.
>
> Wenn du monatlich etwas zur Seite legst, kommen diese
> Rechnungen nicht überraschend.

**Kein Eingabefeld.** Kein Rechner. Kein Sparziel.
Nur: ein ruhiger Absatz, der an die Realität erinnert.

**Warum kein Feld?**
Ein Feld „Rückstellungen CHF" erzeugt die Frage: Wofür? Wie viel?
Das führt in Finanzplanung. Budget Light zeigt den Ist-Zustand,
nicht den Soll-Zustand.

**Post-V1-Option:**
Ein optionales Feld „Monatliche Rücklagen" für Menschen,
die bereits bewusst zur Seite legen. Aber nicht V1.

---

## 5. Calm Language Guidelines

### Problematische Sprache (aktuell im Code)

#### `budget.rentWarning`

> **DE:** „Miete ist über 40% des Einkommens. Erwäge eine günstigere Wohnung."
> **EN:** „Rent is over 40% of income. Consider a more affordable option."

**Problem:** Urteil + unrealistischer Rat. Umziehen ist in der Schweiz teuer,
komplex und oft unmöglich (Wohnungsmarkt). Der Text impliziert:
Du wohnst falsch.

#### `budget.expensesCritical`

> **DE:** „Gesamtausgaben über 90%! Sehr wenig Spielraum."
> **EN:** „Total expenses over 90%! Very little room."

**Problem:** Ausrufezeichen = Alarm. „Sehr wenig Spielraum" impliziert
Versagen. Kein Ausweg gezeigt.

#### `budget.deficitCritical`

> **DE:** „Ausgaben übersteigen Einkommen! Budget überprüfen."
> **EN:** „Expenses exceed income! Please review your budget."

**Problem:** „Budget überprüfen" impliziert: Du hast einen Fehler gemacht.
Ein Defizit kann viele Gründe haben (Jobverlust, Krankheit, Scheidung).
Scham ist die falsche Reaktion.

#### `budget.goodSituation`

> **DE:** „Gute finanzielle Situation. Nutze überschüssiges Geld zum Sparen."
> **EN:** „Good financial situation. Consider saving the surplus."

**Problem:** Ungebetener Rat. „Gute Situation" ist ein Urteil —
auch positiv. Budget Light urteilt nicht. Auch nicht positiv.

### Neue Maloja-konforme Sprache

#### Ersatz: `budget.rentInfo`

> **DE:** „Deine Wohnkosten machen einen grossen Teil deines Budgets aus. In vielen Schweizer Städten ist das nicht ungewöhnlich."
> **EN:** „Your housing costs make up a large part of your budget. This is not uncommon in many Swiss cities."

#### Ersatz: `budget.budgetTight`

> **DE:** „Dein Budget ist eng. Es gibt kostenlose Budgetberatungsstellen — zum Beispiel bei der Caritas oder deiner Gemeinde."
> **EN:** „Your budget is tight. Free budget counselling is available — for example through Caritas or your local municipality."

#### Ersatz: `budget.deficitInfo`

> **DE:** „Die Ausgaben sind aktuell höher als die Einnahmen. Das kann vorübergehend sein — bei der Schuldenberatung deines Kantons findest du Unterstützung."
> **EN:** „Expenses currently exceed income. This can be temporary — your canton's debt counselling service can help."

#### Ersatz: `budget.goodSituation`

**Entfällt.** Budget Light bewertet nicht — auch nicht positiv.
Wenn die Zahlen stimmen, spricht die Übersicht für sich.

### Prinzipien der Budget-Kommunikation

1. **Neutral beschreiben, nicht bewerten.** „Deine Wohnkosten machen 42% aus" — ohne „das ist zu viel".
2. **Kontext geben, nicht urteilen.** „In vielen Schweizer Städten ist das nicht ungewöhnlich."
3. **Auswege zeigen, nicht Fehler benennen.** „Es gibt Beratungsstellen" statt „Überprüfe dein Budget".
4. **Keine Ausrufezeichen.** Nie. Budget ist kein Notfall.
5. **Keine Farbcodierung als Bewertung.** Kein Rot für „schlecht", kein Grün für „gut".
6. **Keine Imperative.** Nicht „Erwäge", „Überprüfe", „Nutze". Sondern: „Es gibt", „Das ist", „Du kannst".
7. **Auch positive Bewertung weglassen.** „Gute Situation" ist auch ein Urteil.
8. **Schwellen senken.** Bei Hinweisen auf Beratung: konkrete Anlaufstellen nennen (Caritas, Gemeinde, kantonale Schuldenberatung), nicht abstrakt „such dir Hilfe".

### i18n-Keys: Mapping alt → neu

| Alter Key | Neuer Key | Aktion |
|-----------|-----------|--------|
| `budget.rentWarning` | `budget.rentInfo` | Ersetzen |
| `budget.expensesCritical` | `budget.budgetTight` | Ersetzen |
| `budget.deficitCritical` | `budget.deficitInfo` | Ersetzen |
| `budget.goodSituation` | — | Entfernen |

In `budgetSync.js`: `getBudgetRecommendations()` entsprechend anpassen.
Die Funktion soll `level: 'info'` statt `level: 'warning'` / `level: 'critical'` verwenden.
Icons: keine Warnsymbole. Neutral.

---

## 6. UI-Richtung

### Gefühl

Budget Light fühlt sich an wie eine ruhige Buchseite.
Nicht wie ein Dashboard. Nicht wie eine Tabelle.

Ein Blick genügt, um zu verstehen:
Was kommt rein, was geht raus, was bleibt.

### Gruppierung

Ausgaben werden in Gruppen gezeigt, nicht als flache Liste.
Jede Gruppe hat einen ruhigen Titel und eine Summe.

```
Einkommen                              CHF 5'200

Wohnen                                 CHF 1'650
  Miete .......................... 1'400
  Nebenkosten ..................... 250

Versicherung & Gesundheit               CHF 435
  Krankenkasse .................... 380
  Weitere Versicherungen ........... 55

Leben                                    CHF 750
  Lebensmittel & Haushalt ......... 650
  Internet & Telefon .............. 100

Mobilität                                CHF 120
  ÖV / Auto ...................... 120

Steuern & Vorsorge                      CHF 1'038
  Steuern (monatlich) ............. 450
  Säule 3a ....................... 588

───────────────────────────────────────
Verfügbar                              CHF 1'207
```

### Rhythmus

- Zuerst Einkommen (oben, ruhig, eine Zahl)
- Dann Gruppen (offen, mit Einzelposten darunter)
- Am Ende: Verfügbar (nicht „Rest", nicht „Sparquote")
- Darunter: Rückstellungen-Hinweis (ruhiger Absatz)
- Ganz unten: Jahresansicht (aufklappbar)

### Informationsdichte

**Wenig.** Budget Light zeigt pro Bildschirm:
- 5 Gruppen mit je 1-3 Posten
- 1 Gesamtzahl
- 1 Hinweistext

Keine Prozentzahlen als Hauptinformation.
Keine Kreisdiagramme. Keine Fortschrittsbalken.

Prozente sind optional — z.B. als dezente Angabe
neben dem Gruppenname: „Wohnen — 32%".
Aber nie als Score, nie farbcodiert.

### Jahres- / Monatsbezug

- **Default: Monatsansicht.** Das ist, was Menschen kennen.
- **Aufklappbar: Jahresansicht.** „Das sind CHF 62'400 im Jahr."
- Jahresansicht ist nicht einfach ×12, sondern zeigt die Gruppen nochmals — weil sich die Proportionen anders anfühlen im Jahreskontext.

### Leere Felder

Leere Felder werden als leise Zeile dargestellt:

```
  Steuern (monatlich) ............. —
```

Kein Warnsymbol. Kein „Bitte ausfüllen". Kein Rot.

Optional, einmal am Ende der Übersicht:

> „3 Kategorien sind noch nicht erfasst.
> Du kannst sie jederzeit im Kapitel Finanzen ergänzen."

### Verhältnisse statt KPIs

Statt einer Zahl „Sparquote: 23.2%" —
ein stiller horizontaler Balken, der zeigt:

```
[████████ Wohnen ████|███ Vers. ██|██ Leben █|█ Mob |█ Steuer/Vors. █| Verfügbar ████]
```

Proportionen, nicht Prozente. Visuell, nicht numerisch.
Der Balken hat keine Farbbewertung — alle Segmente
haben die gleiche neutrale Farbe (Palette: Sand/Salbei-Töne).

---

## 7. Was explizit NICHT Teil von V1 ist

### Technische Ausschlüsse

| Ausschluss | Begründung |
|-----------|------------|
| Open Banking / Konto-Sync | Braucht Backend, bricht Offline-Versprechen |
| Transaktionsimport (automatisch) | CSV-Import existiert bereits als experimentell |
| Automatische Kategorisierung | AI-Feature, Maloja ist deterministisch-first |
| Brutto/Netto-Umrechnung | Erfordert Steuer-Engine oder doppelte Eingabe |
| SchuldenManager-Verknüpfung | Cross-System-Sync, Stufe C |
| TaxCalculator-Integration | Cross-System-Sync, Stufe C |
| IPV als Budget-Entlastung | Braucht Household Model, Stufe B |

### Produktionelle Ausschlüsse

| Ausschluss | Begründung |
|-----------|------------|
| Investment-Tracking | Anderes Produkt |
| Crypto / Trading | Anderes Produkt |
| Buchhaltung / MWST | Unternehmensfinanzen, nicht Haushalt |
| AI-Finanzberater | Post-beta, AI-Infrastruktur nötig |
| Budget-Scores / Noten | Gamification, Anti-Maloja |
| Benchmark-Vergleiche | Vergleich = Urteil |
| Spar-Optimierung | „Du solltest weniger ausgeben" = Anti-Maloja |
| Abo-Management | Nice-to-have, nicht orientierungskritisch |
| Nebenerwerb-Detail | Zu granular |
| Auto-Betriebskosten-Detail | Ein Feld „Mobilität" reicht |
| Kirchensteuer (einzeln) | Kann in Steuern-Feld integriert werden |
| Rückstellungs-Rechner | Budget zeigt Ist-Zustand, nicht Soll |
| Sparziele mit Tracking | Gamification-Gefahr |
| Mehrere Einkommensquellen | Stufe B (Household/Partner) |
| Kinderzulagen als Einnahme | Stufe B (Household) |
| Alimente als Einnahme/Ausgabe | Stufe B (Household) |
| Kinderbetreuung als Ausgabe | Stufe B (Household) |

---

## 8. Erweiterungspfade (Post-V1)

Kurze Übersicht, was nach V1 kommen kann.
Alles klar als post-V1 markiert.

### Stufe B — Nach Household Model

| Erweiterung | Was nötig |
|------------|----------|
| Kinderzulagen als Einnahme | Household: Kinder + Alter + Kanton |
| Alimente (Einnahme oder Ausgabe) | Household + neues Feld |
| Kinderbetreuung | Household: Kinder |
| IPV als Entlastung im Budget | IPV-Rechner-Ergebnis einlesen |
| Zweites Einkommen (Partner) | Household: adults > 1 |
| Budget-Templates nach Lebenssituation | Household + Lebenssituation-Mapping |

### Stufe C — Systemverknüpfungen

| Erweiterung | Was nötig |
|------------|----------|
| SchuldenManager-Raten im Budget | Cross-System-Sync budgetSync ← schuldenCalc |
| Steuerreferenz aus TaxCalculator | Cross-System-Sync budgetSync ← TaxCalculator |
| Versicherungskosten aus Versicherungskapitel | Einzelne Versicherungen statt Sammelfeld |

### Post-Beta — Langfristig

| Erweiterung | Wann sinnvoll |
|------------|--------------|
| Jahreskosten-Kalender | Wenn Rückstellungen als Felder existieren |
| Brutto/Netto-Toggle | Wenn Steuerlogik stabil |
| SKOS-basierte Referenzwerte | Wenn Household + SKOS-Verfeinerung |
| Historischer Vergleich | Wenn Versionierung der Budget-Daten existiert |
| Export: Budget-Zusammenfassung für Sozialarbeiter | Wenn Export-Dossier-System steht |
| Familienbudget-Ansicht | Wenn Household Model vollständig |

---

## 9. Datenstruktur

### Neue Felder (in `or5_data.finanzen`)

```javascript
{
  monthlyIncome: 5200,        // bestehend
  monthlyTax: 450,            // NEU — monatliche Steuerlast, manuell
  groceries: 600,             // NEU — Lebensmittel & Haushalt
  communication: 85,          // NEU — Internet, Telefon
  mobility: 120,              // NEU — ÖV oder Auto
  otherInsurance: 45,         // NEU — Haftpflicht, Hausrat, etc.
  pension3a: 7056,            // bestehend — Ableitung /12 im Budget
}
```

### Keine Migration nötig

Neue Felder werden in `finanzen` hinzugefügt.
`syncBudgetFromChapters()` liest sie mit Fallback `|| 0`.
Bestehende Daten bleiben unverändert.
Keine Datenmigration. Kein Versionssprung.

### budgetSync.js — Erweiterung

```javascript
// Neue Ausgabenposten:
budget.expenses.tax = Number(data.finanzen?.monthlyTax || 0);
budget.expenses.groceries = Number(data.finanzen?.groceries || 0);
budget.expenses.communication = Number(data.finanzen?.communication || 0);
budget.expenses.mobility = Number(data.finanzen?.mobility || 0);
budget.expenses.otherInsurance = Number(data.finanzen?.otherInsurance || 0);
budget.expenses.pension3a = Number(data.finanzen?.pension3a || 0) / 12;
```

### Gruppierung (für UI)

```javascript
const BUDGET_GROUPS = [
  {
    key: 'housing',
    fields: ['rent', 'utilities', 'mortgage', 'buildingsInsurance']
  },
  {
    key: 'insuranceHealth',
    fields: ['healthInsurance', 'otherInsurance']
  },
  {
    key: 'living',
    fields: ['groceries', 'communication']
  },
  {
    key: 'mobility',
    fields: ['mobility']
  },
  {
    key: 'taxProvision',
    fields: ['tax', 'pension3a']
  }
];
```

---

## 10. Implementierungsreihenfolge

```
Schritt 1 — Daten (budgetSync.js):
  5 neue Felder einlesen
  pension3a /12 ableiten
  Gruppierungs-Struktur definieren
  Calm Language: getBudgetRecommendations() umschreiben
  Build grün

Schritt 2 — Eingabefelder (constants.js + i18n):
  5 neue Felder im Finanzen-Kapitel
  i18n-Keys in 4 Sprachen (DE/EN/FR/IT)
  Hint-Texte für neue Felder
  Build grün

Schritt 3 — Anzeige (BudgetSync.jsx):
  Gruppierte Darstellung
  Rückstellungen-Hinweis
  Leere-Felder-Behandlung
  Proportionsbalken (optional)
  Jahresansicht anpassen
  Build grün

Schritt 4 — Bereinigung:
  Alte Judgment-Keys aus i18n entfernen
  savingsRate-KPI entfernen oder dezent machen
  Recommendation-Levels auf 'info' umstellen
  Build grün
```

Jeder Schritt ist ein eigener Commit.
Jeder Schritt lässt den Build grün.

---

## 11. Risiken

| Risiko | Schwere | Mitigation |
|--------|---------|------------|
| Scope Creep: „nur noch ein Feld" | Hoch | V1 = exakt 11 Posten. Alles andere ist Stufe B/C. |
| Calm Language wird inkonsequent | Mittel | Alle 4 Texte in einem Schritt ersetzen, nicht einzeln |
| UI wird trotzdem Dashboard-artig | Mittel | Keine Karten-Grid. Register-Stil. Editorial. |
| Nutzer füllen neue Felder nicht aus | Niedrig | Leere Felder sind ok. Kein Zwang. |
| pension3a /12 ist unpräzise | Niedrig | Ist eine Näherung, kein Steuerbeleg |
| Steuern-Feld wird missverstanden | Mittel | Guter Hint-Text: „Geschätzt oder laut Steuerrechnung" |

---

*Dokument: budget-light-v1.md v1.0.0*
*Erstellt: 2026-05-27*
*Keine Implementation — Produktdefinition.*
