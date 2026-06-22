# PRE-FLIGHT CHECK — Maloja Plana Lebensraum-Phase

> Erstellt: 2026-06-02
> Letzte technische Plausibilisierung vor der Implementierung.

---

## 1. WIEDERVERWENDBARKEIT DES PATTERNS

### Frage: Kann das bestehende MirrorCards-Pattern für alle 4 neuen Kapitel verwendet werden?

### Architektur des Patterns

```
hasMinData(chapterKey, data)        → Boolean
buildLifeSentence(chapterKey, ...)  → String | null
buildMirrorSections(chapterKey, ...)→ [{title, rows: [{label, value, bold?}]}]

MirrorCards Component:
  → if !hasMinData → return null
  → render sentence card
  → render section cards
```

### Prüfung pro neuem Kapitel

**Behörden:**
- `hasMinData`: `cantoneOfTaxation` vorhanden → einfacher Boolean ✓
- Lebenssatz: Text aus Steuerkanton + Betreibungsstatus → String-Konkatenation wie bei Basis ✓
- Sektionen: 4 Karten mit Label/Value-Paaren → identisch zum Pattern ✓
- Select-Werte lesen: Betreibungsstatus, Gerichtsverfahren, Testament sind Selects → brauchen `t()` Lookup für Optionslabels, wie `maritalLabel()` bei Basis ✓
- Cross-Chapter: Kein Cross-Chapter nötig ✓

**Notfall:**
- `hasMinData`: `emergencyContact` vorhanden → einfacher Boolean ✓
- Lebenssatz: Text aus Kontaktperson + optional Arzt/Vorsorge → String-Konkatenation ✓
- Sektionen: 4 Karten → identisch zum Pattern ✓
- Vorsorge-Status (✓/○): Noch nicht im Pattern vorhanden. Braucht eine kleine Erweiterung — statt `value: "Ja"` könnte `value: "✓ Vorhanden"` als String gerendert werden. Kein neuer Render-Typ nötig. ✓
- Gesundheitsdaten-Statuszeilen ("Allergien erfasst"): Einfache bedingte Strings ✓
- Cross-Chapter: Kein Cross-Chapter nötig ✓

**Versicherungen:**
- `hasMinData`: `kkInsurer` vorhanden → einfacher Boolean ✓
- Lebenssatz: KK-Versicherer + Franchise + Prämie → String-Konkatenation ✓
- Sektionen: 4 Karten → identisch zum Pattern ✓
- Totalsumme: Summe aus KK-Prämie + BVG + Haftpflicht + Hausrat + Auto → analog zu `sumExpenses()` bei Finanzen ✓
- Select-Werte: Franchise, KK-Modell, UVG, etc. → `t()` Lookup ✓
- Cross-Chapter: Kein Cross-Chapter nötig (alle Daten in `versicherungen`) ✓

**Ausbildung:**
- `hasMinData`: `jobTitle || employer` vorhanden → einfacher Boolean ✓
- Lebenssatz: Beruf + Arbeitgeber + Bewilligung → String-Konkatenation ✓
- Sektionen: 3 Karten → identisch zum Pattern ✓
- Select-Werte: `workPermit`, `educationLevel` → `t()` Lookup ✓
- Cross-Chapter: Kein Cross-Chapter nötig ✓

### Ergebnis

🟢 **Alle 4 neuen Spiegelungen passen vollständig in das bestehende Pattern.**

Kein neuer Render-Typ, keine neue Komponente, keine Architekturänderung nötig.

Erweiterungspunkte:
1. `hasMinData()`: 4 neue `if`-Branches
2. `buildLifeSentence()`: 4 neue Builder-Funktionen
3. `buildMirrorSections()`: 4 neue Section-Builder
4. Optionslabel-Helper: Generische Funktion `selectLabel(t, chapterKey, fieldKey, value)` analog zu `maritalLabel()` — könnte die bestehende `maritalLabel()` ersetzen und für alle Selects funktionieren

---

## 2. VOLLSTÄNDIGKEIT INNERHALB MIRROCARDS-ARCHITEKTUR

### Frage: Kann alles innerhalb MirrorCards.jsx umgesetzt werden?

| Element | Innerhalb MirrorCards? | Begründung |
|---------|----------------------|------------|
| Lebenssätze (4 neue) | ✓ | Reine String-Builder, wie Basis/Wohnen/Finanzen |
| Spiegelkarten (15 neue) | ✓ | Label/Value-Paare im bestehenden Format |
| Vorsorge-Status ✓/○ | ✓ | Als String-Value, kein neuer Render-Typ |
| Gesundheits-Statuszeilen | ✓ | Bedingte Strings: "Allergien erfasst" |
| Versicherungs-Totalsumme | ✓ | Addition wie `sumExpenses()` |
| Select-Label-Auflösung | ✓ | `t()` Lookup pro Kapitel/Feld/Wert |
| Notfallkarte-Export | ✗ | Bleibt in ChapterView.jsx (handleSaveCard) |

### Ergebnis

🟢 **Alles ausser dem Notfallkarte-Export passt in MirrorCards.jsx.**

Der Export ist eine Aktion (Download), kein Darstellungselement. Er bleibt korrekt in ChapterView.jsx.

---

## 3. ZUSÄTZLICHE KOMPONENTEN

### Frage: Werden neue Komponenten benötigt?

| Prüfung | Ergebnis |
|---------|----------|
| Neue React-Komponente? | **Nein.** MirrorCards.jsx, MirrorSection, MirrorRow reichen. |
| Neuer Render-Typ? | **Nein.** Label/Value-Paare decken alles ab. |
| Neue Utility-Funktion? | **Evtl.** Ein generischer `selectLabel(t, chapter, field, value)` Helper wäre sauberer als pro Kapitel eigene Label-Funktionen. Aber: 4 einzelne Inline-Lookups funktionieren genauso. Kein Blocker. |
| Neue CSS/Styles? | **Nein.** Bestehende Token-basierte Inline-Styles reichen. |
| Neue Config? | **Nein.** Alle Felder existieren bereits in `constants.js`. |

### Ergebnis

🟢 **Keine neuen Komponenten nötig.**

---

## 4. EINFLUSS AUF EXPORTE UND DOSSIERS

### Frage: Werden bestehende Exporte, Dossiers oder Zusammenfassungen durch die neuen Spiegelungen beeinflusst?

### Betroffene Systeme

**a) NotfallDossier (dossierGenerator.js → NotfallDossier.jsx)**
- Liest Notfall-Daten direkt aus `data.notfall.*` via `dossierGenerator.js`
- Rendert in eigenständigem HTML-Fenster (Print-Preview)
- Verwendet KEINE Daten aus MirrorCards
- **Nicht betroffen.** Die Spiegelungen ändern die Datenstruktur nicht.

**b) Lebensmappe (dossierGenerator.js → Lebensmappe.jsx)**
- Liest alle Kapitel-Daten direkt aus `data.*` via `dossierGenerator.js`
- Rendert in eigenständigem HTML-Fenster (Print-Preview)
- Verwendet KEINE Daten aus MirrorCards
- **Nicht betroffen.**

**c) Notfallkarte-Export (handleSaveCard in ChapterView.jsx)**
- Liest direkt aus `data.emergencyContact`, `data.bloodType`, etc.
- Generiert TXT-Download
- Lebt in ChapterView.jsx, NICHT in MirrorCards
- **Potenziell betroffen** — wenn die Emergency-Summary durch MirrorCards ersetzt wird, muss der "Notfallkarte sichern"-Link an einer neuen Stelle stehen.

**d) ZIP-Export (zipExport.js)**
- Exportiert Rohdaten aus localStorage
- Keine Beziehung zu MirrorCards
- **Nicht betroffen.**

**e) CSV-Import (csvImport.js / BudgetImport.jsx)**
- Importiert Budget-Daten in `data.finanzen`
- Keine Beziehung zu MirrorCards
- **Nicht betroffen.**

### Detailanalyse: Notfallkarte-Export

Aktueller Standort: In ChapterView.jsx, Zeilen 410–455 (`handleSaveCard`) + Zeile 522–537 (Render als Link innerhalb der Emergency-Summary).

Wenn die Emergency-Summary (Zeilen 476–537) durch MirrorCards ersetzt wird:
- `handleSaveCard` bleibt in ChapterView.jsx — die Funktion ist unabhängig
- Der Render-Link ("□ Notfallkarte sichern") muss entweder:
  - **Option A:** Unter den MirrorCards als eigenständiger Link bleiben (im ChapterView, nach dem `<MirrorCards>` Element)
  - **Option B:** In eine neue MirrorCards-Aktion integriert werden

**Empfehlung: Option A.** Der Link bleibt in ChapterView.jsx, wird aber nach dem MirrorCards-Block gerendert statt innerhalb der Emergency-Summary. Das ist eine Verschiebung von ~5 Zeilen, keine Neuentwicklung.

### Ergebnis

🟡 **Ein mittleres Risiko: Die Notfallkarte-Export-Verlinkung muss verschoben werden.**

Aufwand: 15 Minuten. Aber muss bewusst gemacht werden — sonst verschwindet der Export-Link.

---

## 5. TECHNISCHE RISIKEN FÜR DEN 3-TAGE-PLAN

### Risiko 1: React-Key-Kollisionen in MirrorSection

**Problem:** MirrorSection verwendet `key: row.label` für Rows und `key: section.title` für Sections. Wenn zwei Rows denselben Label haben, gibt React eine Warnung.

**Wahrscheinlichkeit:** Niedrig. Labels sind pro Sektion eindeutig. Aber: wenn Versicherungen z.B. zwei "Prämie"-Rows hätte, gäbe es ein Problem.

**Lösung:** Labels innerhalb einer Sektion eindeutig halten. Falls nötig: Key auf `label + '-' + idx` ändern.

🟢 **Kein Risiko** — durch sorgfältige Label-Benennung vermeidbar.

---

### Risiko 2: Select-Werte müssen für Spiegelung aufgelöst werden

**Problem:** Behörden, Notfall, Versicherungen, Ausbildung haben Felder vom Typ `select`. Die gespeicherten Werte sind Keys (`none`, `entries`, `yes`, `no`, `b`, `c`). Die Spiegelung muss die menschenlesbaren Labels anzeigen.

**Heute:** Nur `maritalLabel()` in MirrorCards existiert als Select-Resolver.

**Lösung:** Generische Funktion:
```
function selectLabel(t, chapterKey, fieldKey, value) {
  if (!value) return null;
  return t('chapters.' + chapterKey + '.fields.' + fieldKey + '.options.' + value) || value;
}
```

**Aufwand:** 5 Zeilen. Kann `maritalLabel()` ersetzen.

🟢 **Kein Risiko** — triviale Erweiterung.

---

### Risiko 3: Notfall Emergency-Summary-Ersatz

**Problem:** Die bestehende Emergency-Summary (Zeilen 476–537 in ChapterView.jsx) wird durch MirrorCards ersetzt. Sie enthält:
1. Notfallkontakt-Karte (→ wird MirrorCards-Sektion)
2. Blutgruppe mit Farbcodierung (→ wird MirrorCards-Row, OHNE Farbcodierung)
3. Vorsorge-Badges mit ✓/○ (→ wird MirrorCards-Sektion)
4. "Notfallkarte sichern"-Link (→ muss verschoben werden)

**Verlust:** Die Blutgruppe hat heute eine farbige Darstellung (bloodTypeColors-Map mit rose/gold/sky/sage). In MirrorCards ist alles Label/Value ohne Farbe. Das ist ein bewusster Designverlust — die Spiegelung ist ruhiger als die Emergency-Summary.

**Gewinn:** Konsistentes Erscheinungsbild mit den anderen Spiegelungen. Lebenssatz. Bessere Struktur.

🟡 **Mittleres Risiko** — bewusster Designtrade-off. Die farbige Blutgruppe geht verloren. Das muss eine bewusste Entscheidung sein.

---

### Risiko 4: MirrorCards.jsx Dateigrösse

**Problem:** MirrorCards.jsx ist aktuell 456 Zeilen. 4 neue Kapitel mit je ~60–80 Zeilen (Sentence + Sections) → ca. 700–750 Zeilen total.

**Bewertung:** 750 Zeilen für eine einzelne Render-Datei ohne State ist akzeptabel. Die Datei hat eine klare interne Struktur (Helpers → Sentence Builders → Section Builders → Render). Kein Refactoring nötig.

🟢 **Kein Risiko.**

---

### Risiko 5: i18n-Vollständigkeit

**Problem:** Neue Mirror-Keys müssen in allen 4 Sprachen (DE, EN, FR, IT) existieren. Die App fällt auf den Key-String zurück wenn ein Key fehlt (z.B. `mirror.behoerden.taxSituation`).

**Bewertung:** Das Fallback-Verhalten ist unschön (Raw-Keys sichtbar), aber nicht crashend. DE zuerst, andere Sprachen nachliefern ist machbar.

**Zusatz:** `rm.js` (Rätoromanisch) hat keine Mirror-Keys. Auch die bestehenden 3 Sprachen (Basis, Wohnen, Finanzen) sind nicht in rm.js. Das ist ein bestehendes Problem, kein neues.

🟢 **Kein Risiko** — graceful degradation funktioniert.

---

### Risiko 6: Build/Bundle

**Problem:** Keine neuen Imports, keine neuen Dateien, keine neuen Dependencies. Nur Erweiterung bestehender Dateien.

🟢 **Kein Risiko.**

---

### Risiko 7: `allData` Parameter-Propagation

**Problem:** MirrorCards erhält `allData` für Cross-Chapter-Daten (z.B. Miete in Finanzen-Spiegelung). Behörden, Notfall, Versicherungen, Ausbildung brauchen kein Cross-Chapter.

**Prüfung:** `allData` wird bereits von ChapterView an MirrorCards übergeben (Zeile 473: `allData: allData`). Es ist verfügbar, wird aber für die 4 neuen Kapitel nicht benötigt.

🟢 **Kein Risiko.**

---

## ZUSAMMENFASSUNG

| # | Prüfpunkt | Ampel | Detail |
|---|-----------|-------|--------|
| 1 | Pattern wiederverwendbar? | 🟢 | Alle 4 Kapitel passen vollständig ins Pattern |
| 2 | Alles in MirrorCards lösbar? | 🟢 | Ja, ausser Export-Link (bleibt in ChapterView) |
| 3 | Neue Komponenten nötig? | 🟢 | Nein |
| 4a | NotfallDossier betroffen? | 🟢 | Nein — liest Rohdaten, nicht Spiegelungen |
| 4b | Lebensmappe betroffen? | 🟢 | Nein — liest Rohdaten, nicht Spiegelungen |
| 4c | Notfallkarte-Export betroffen? | 🟡 | Export-Link muss verschoben werden (15 Min) |
| 4d | ZIP-Export betroffen? | 🟢 | Nein |
| 5a | React-Key-Kollisionen? | 🟢 | Vermeidbar durch eindeutige Labels |
| 5b | Select-Werte auflösen? | 🟢 | 5-Zeilen Generic Helper |
| 5c | Emergency-Summary-Ersatz? | 🟡 | Farbige Blutgruppe geht verloren — bewusste Entscheidung |
| 5d | Dateigrösse MirrorCards? | 🟢 | ~750 Zeilen — akzeptabel |
| 5e | i18n-Fallback? | 🟢 | Graceful degradation |
| 5f | Build/Bundle? | 🟢 | Keine neuen Dependencies |
| 5g | allData propagation? | 🟢 | Bereits verfügbar |

### Gesamtbewertung

**🟢 Grünes Licht.** 2 gelbe Punkte, keine Blocker.

Die zwei gelben Punkte sind:
1. **Notfallkarte-Export-Link verschieben** — 15 Minuten, muss nur nicht vergessen werden
2. **Farbige Blutgruppe geht verloren** — bewusste Designentscheidung, kein technisches Problem

Der 3-Tage-Plan ist technisch realistisch. Keine versteckten Abhängigkeiten, keine Architekturrisiken, keine neuen Komponenten nötig.

---

*PRE_FLIGHT_CHECK.md — Letzte technische Prüfung.*
*Ergebnis: 🟢 Grünes Licht mit 2 gelben Hinweisen.*
