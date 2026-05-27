# A-030 — Emotional Temperature Map

> Welche Screens fühlen sich wie an? Beobachtung, nicht Lösung.
> Stand: 2026-05-26

---

## Bewertungsdimensionen

| Dimension | Warm/Gut | Neutral | Kalt/Kritisch |
|-----------|----------|---------|---------------|
| **Wärme** | Einladend, menschlich | Funktional | Technisch, abweisend |
| **Dichte** | Luftig, Atemraum | Angemessen | Gedrängt, überladen |
| **Tonalität** | Begleitend, empathisch | Sachlich | Bürokratisch, belastend |
| **Vertrauen** | Beruhigend, orientierend | Neutral | Verunsichernd, überfordernd |

---

## Screen-Analyse

### Dashboard
```
Wärme:     [====|====|==--]  warm
Dichte:    [====|====|----]  mittel
Tonalität: [====|====|====]  einladend
Vertrauen: [====|====|====]  beruhigend
```
**Stärken:** Malojapass-SVG ist emotional stark. Tier-Labels geben Orientierung. Progress-Texte sind motivierend ohne Druck.
**Schwächen:** Übergang von Pass-SVG zu Kapitelzeilen ist abrupt — die emotionale Qualität bricht ab. Kapitelzeilen selbst sind dicht und uniform.

---

### ChapterView (allgemein)
```
Wärme:     [====|====|----]  neutral
Dichte:    [====|====----|]  gedrängt
Tonalität: [====|====|----]  formular-artig
Vertrauen: [====|====|----]  neutral
```
**Stärken:** Progressive Disclosure (Sekundärfelder). Validierung inline, nicht blockierend.
**Schwächen:** Alle Kapitel sehen identisch aus — „Basis" und „Schulden" haben die gleiche visuelle Behandlung. Labels bei 12px zu klein. Input-Felder uniform und technisch.

---

### SozialhilfeView
```
Wärme:     [====|----|----|]  kühl
Dichte:    [====|====|====]  dicht
Tonalität: [====|----|----|]  administrativ
Vertrauen: [----|----|----|]  verunsichernd
```
**Emotional schwer.** Menschen, die diese View brauchen, sind in einer verletzlichen Situation. Sie sehen:
- SKOS-Berechnungen mit Defizit-Anzeige
- Betreibungsregister-Status
- „Berechtigt" / „Nicht berechtigt" als Binärentscheidung
- 12px-Schrift, ○/✕-Unicode-Marker
- Keine empathische Rahmung

**Risiko:** Die View könnte Scham oder Hilflosigkeit auslösen statt Sicherheit.

---

### SchuldenManager
```
Wärme:     [====|----|----|]  kühl
Dichte:    [====|====|====]  dicht
Tonalität: [----|----|----|]  administrativ-belastend
Vertrauen: [----|----|----|]  belastend
```
**Emotional am schwersten.** Schulden, Betreibungen, Verlustscheine — das sind existenzielle Themen. Die View behandelt sie wie Datenbankeinträge:
- Liste mit „Gläubiger / Betrag / Fällig"
- Kein Kontext, keine Beratungshinweise
- Kein „Du bist nicht allein"-Signal
- Gleiche 12px/cardStyle wie alles andere

**Risiko:** Die View verstärkt den administrativen Druck statt ihn zu mindern.

---

### TaxCalculator
```
Wärme:     [====|----|----|]  kühl
Dichte:    [====|====|====]  dicht
Tonalität: [====|----|----|]  technisch
Vertrauen: [====|====|----]  neutral
```
Schweizer Steuern sind komplex. Die View zeigt Abzugsfelder ohne Kontext. Geschätzter Steuersatz als einfache Stufen (12%/18%/22%) — faktisch zu simpel für echte Orientierung, aber als Schätzung nachvollziehbar. Fehlende Erklärungen bei „Berufsauslagen", „Schuldzinsen" etc.

---

### PremiumSubsidy (IPV)
```
Wärme:     [====|====|----]  neutral
Dichte:    [====|====|====]  dicht
Tonalität: [====|====|----]  administrativ
Vertrauen: [====|====|----]  neutral
```
Versicherungsprämien und Subventionsberechnung. Sachlich, aber emotionslos. Menschen, die IPV brauchen, haben knappe Budgets — die View zeigt Zahlen ohne empathische Einordnung.

---

### DocumentTresor
```
Wärme:     [====|====|----]  neutral
Dichte:    [====|====|----]  mittel
Tonalität: [====|====|====]  nützlich
Vertrauen: [====|====|----]  neutral
```
Funktional und klar. Dokumentenablage wirkt wie ein digitaler Aktenschrank — das passt. Könnte wärmer sein (z.B. beim Upload-Erfolg), aber ist nicht problematisch.

---

### CVGenerator
```
Wärme:     [====|====|----]  neutral-positiv
Dichte:    [====|====|----]  mittel
Tonalität: [====|====|====]  nützlich
Vertrauen: [====|====|====]  positiv
```
Ein produktiver, zukunftsgerichteter Screen. Erzeugt etwas — das gibt ein positives Gefühl. Emotional unproblematisch.

---

### OrganDonation
```
Wärme:     [====|====|----]  neutral
Dichte:    [====|====|----]  mittel
Tonalität: [====|====|----]  sachlich-emotional
Vertrauen: [====|====|----]  neutral
```
Emotional schweres Thema (Organspende, Tod, Vorsorge), aber die View behandelt es sachlich ohne zu dramatisieren. Könnte mehr Einfühlsamkeit zeigen, ist aber nicht belastend.

---

### MobileNav
```
Wärme:     [====|====|====]  warm
Dichte:    [====|====|====]  gut
Tonalität: [====|====|====]  ruhig
Vertrauen: [====|====|====]  gut
```
Gut gelöst. Dezente Slide-Animation, klare Hierarchie mit Icons, aktiver Zustand über `borderLeft`. Eines der emotional stimmigsten Elemente.

---

### Onboarding
```
Wärme:     [====|====|====]  warm
Dichte:    [====|====|====]  gut
Tonalität: [====|====|====]  einladend
Vertrauen: [====|====|====]  gut
```
Der erste Kontaktpunkt. Funktioniert emotional.

---

## Zusammenfassung: Emotionale Zonen

```
WARM / GUT          NEUTRAL           KALT / KRITISCH
─────────────       ──────────        ─────────────────
Dashboard           ChapterView       SozialhilfeView
MobileNav           DocumentTresor    SchuldenManager
Onboarding          CVGenerator       TaxCalculator
                    PremiumSubsidy
                    KKScanner
                    OrganDonation
```

### Kernproblem

Die emotional schwersten Lebenssituationen (Schulden, Sozialhilfe, Steuern) erhalten die kälteste visuelle Behandlung. Das widerspricht dem Produktversprechen von „Ruhe + Vertrauen + menschliche Wärme".

Die Lösung liegt nicht in mehr Features, sondern in:
- Grösserer Schrift für diese Screens
- Mehr Atemraum
- Empathischen Rahmentexten
- Hinweisen auf Beratungsstellen
- Visueller Differenzierung (eigene Farbtemperatur, andere Dichte)
- Weniger Unicode-Symbole, mehr SVG-Integration

---

> Dieses Dokument ist eine Bestandsaufnahme. Keine Handlungsanweisung.
> Änderungen folgen systematisch in der Design Consolidation Phase.
