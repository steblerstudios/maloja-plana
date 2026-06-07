# Consolidation Master Report — Maloja Plana

> Stand: 2026-06-07
> Basiert auf: 6 Einzel-Reports
> Status: ANALYSE ABGESCHLOSSEN — BEREIT FÜR IMPLEMENTIERUNG

---

## 1. Was bleibt?

### Code (unverändert)
- Alle 63 Source-Dateien in `src/`
- Hash-Routing, localStorage, IndexedDB
- i18n System (4 Sprachen + Rätoromanisch)
- Validierungslogik, Rechner, Scanner
- BetaGate, LegalView, Onboarding
- Lebensräume, Spiegelungen, Orientierungssätze

### Design (unverändert)
- Farbpalette (alle Hex-Werte bleiben)
- DM Sans als einzige Font
- Malojapass-SVG Grundstruktur
- Anti-Gamification-Prinzip
- Tier-System (Core/Supporting/Protective)
- 47 Icons im IconSystem

### Docs (behalten)
- `docs/product/` (Registries)
- `docs/design/` (Audits)
- `docs/prep/` (aktuelle Phase)
- `docs/context/`, `docs/governance/`, `docs/legal/`

---

## 2. Was wird archiviert?

| Quelle | Ziel | Dateien |
|--------|------|---------|
| `docs/agents/` (19 Dateien) | `docs/archive/concepts/agents/` | Agent-Architektur — nie gebaut |
| `docs/runtime/` (12 Dateien) | `docs/archive/concepts/runtime/` | Runtime-Planung — noch nicht aktuell |
| `docs/spinnennetz/` (4 Dateien) | `docs/archive/concepts/spinnennetz/` | Lebensnetz — entschieden: nicht bauen |
| `docs/roadmap/PHASE_1_*` (7 Dateien) | `docs/archive/phases/` | Phase 1 abgeschlossen |
| `docs/roadmap/SPRINT_PLAN.md` | `docs/archive/phases/` | Veraltet |
| `docs/roadmap/BACKLOG_MASTER.md` | `docs/archive/phases/` | Ersetzt durch backlog-registry |
| `docs/alpha/` + `docs/alpha-feedback/` | `docs/archive/phases/alpha/` | Alpha beendet |
| `ordnung-ruhe/` (ohne Assets) | `docs/archive/old-project/` | Referenz (nur main.jsx + README behalten) |

**Freigegebener Speicher:** ~84 MB (node_modules des alten Projekts).

---

## 3. Welche Assets werden übernommen?

| Asset | Von | Nach | Begründung |
|-------|-----|------|-----------|
| `coin-obverse.svg` (Helvetia 400×400) | `ordnung-ruhe/public/` | `src/assets/coin-obverse.svg` | Wasserzeichen für Behörden-Kapitel |
| `coin-reverse.svg` (Fünfliber 400×400) | `ordnung-ruhe/public/` | `src/assets/coin-reverse.svg` | Wasserzeichen für Finanzen-Kapitel |
| `coins.html` (Preview) | `ordnung-ruhe/public/` | `src/assets/coin-preview.html` | Referenz |
| 17 maloja-icons (256×256) | `/Projects/maloja-icons/` | `src/assets/icons-full/` | Empty-State-Grafiken |
| `preview.html` | `/Projects/maloja-icons/` | `src/assets/icons-full/preview.html` | Referenz |
| `Produkt__und_Architekturkonzept.pdf` | `ordnung-ruhe/PDFS/` | `docs/archive/` | Historische Referenz |

---

## 4. Welche Icons müssen neu gezeichnet werden?

| Icon | Priorität | Einsatz | Stil |
|------|-----------|---------|------|
| **Wegweiser** | Hoch | Orientierungssätze, Navigation | 24×24, gelbes Pfeilschild auf Pfosten |
| **Kuhglocke** | Mittel | Erinnerungen, Benachrichtigungen | 24×24, Trychel mit Lederband |
| **Posthorn** | Mittel | Export, Briefe, Behördenkorrespondenz | 24×24, 2-Windungs-Horn |
| **Favicon** | Mittel | Browser-Tab, PWA | 32×32, Edelweiss oder Pass-Silhouette |

### Icon-Revision (bestehende)

| Icon | Änderung | Aufwand |
|------|----------|---------|
| `_versicherungen` | Kreuz im Schild → Edelweiss-Blüte | Klein (SVG-Pfad) |

---

## 5. Welche Designwerte aus Alt werden zurückgeholt?

| Element | Original (Alt) | Übernahme | Anpassung |
|---------|---------------|-----------|-----------|
| **boxShadow** | `'0 1px 3px rgba(0,0,0,0.1)'` | `shadow.sm` Token (existiert bereits!) | Nur einsetzen |
| **backdrop-filter** | `blur(8px)` + `palette.surface + '99'` | Header | Opacity anpassen: `'F2'` statt `'99'` |
| **Transparenz** | Alpha-Suffix auf Farben | Spiegelkarten, Header | Dezent |
| **SoftCard-Prinzip** | Komponente mit shadow + border + radius | Kein Name nötig — Prinzip auf Karten anwenden | Inline |

### Was NICHT zurückgeholt wird

| Element | Begründung |
|---------|-----------|
| Cormorant Garamond | DM Sans ist richtig für Zielgruppe (Lesbarkeit) |
| Landing Page | Closed Beta braucht kein Marketing |
| Login-Flow | BetaGate ist besser |
| Social Icons | Irrelevant |
| Lila Favicon | Passt nicht zu Maloja |
| hero.png | Unbekannter Inhalt, wahrscheinlich veraltet |

---

## 6. Die 10 wichtigsten visuellen Änderungen

| # | Änderung | Effekt | Sprint |
|---|---------|--------|--------|
| 1 | **fontWeight 600 → 400 als Default** | Hierarchie entsteht — Überschriften heben sich ab | 1 |
| 2 | **Body fontSize 12px → 15px** | Ruhiger, lesbarer, Editorial statt Admin | 1 |
| 3 | **Kapitel-Header mit 48px Icon + Lebenssatz** | Formular → Raum — Schweizer Identität sichtbar | 2 |
| 4 | **shadow.sm auf alle Karten/Container** | Flat → greifbar — Materialität entsteht | 1 |
| 5 | **Spacing +8px zwischen Sektionen** | Gedrängt → Luft — Editorial-Feeling | 1 |
| 6 | **Orientierungssätze: 13px + Hintergrund** | Fussnote → Wegweiser — Orientierung wird lesbar | 3 |
| 7 | **Trail-Icons: 14-20px → 18-24px** | Graue Punkte → erkennbare Symbole | 2 |
| 8 | **Header: backdrop-filter + Transparenz** | Solid → Nebel — Modernität + Metapher | 3 |
| 9 | **Easter Eggs ab 0% (Tannen immer sichtbar)** | Leerer Pass → lebender Pass | 2 |
| 10 | **Versicherungs-Icon: Kreuz → Edelweiss** | Generisch → Schweizerisch | 2 |

---

## 7. Priorisierte Umsetzungsreihenfolge

### Sprint 1 — "Luft und Licht" (Foundation)

```
Aufwand: ~2-3 Stunden
Risiko: Gering (visuell, keine Logik)
Effekt: ★★★★★
```

1. fontWeight: 600 → 400 (Default), 600 nur für Titel
2. fontSize: 12px hardcoded → text.sm (13) / text.body (15)
3. shadow.sm auf Karten und Container
4. Spacing zwischen Sektionen: +8px

**Prüfpunkt:** Build grün? Layout-Verschiebungen? Mobile OK?

---

### Sprint 2 — "Schweizer Identität" (Symbolik)

```
Aufwand: ~1-2 Stunden
Risiko: Gering
Effekt: ★★★★
```

1. Kapitel-Header Block (Icon 48px + Lebenssatz + Abstand)
2. Trail-Icons grösser (14→18px, 20→24px)
3. Easter Eggs: Tannen ab 0%, Edelweiss ab 15%, Kuh ab 40%
4. Versicherungs-Icon: Kreuz → Edelweiss

**Prüfpunkt:** Sieht Kapitel-Eintritt wie "Raum betreten" aus?

---

### Sprint 3 — "Materialität" (Tiefe)

```
Aufwand: ~1-2 Stunden
Risiko: Gering-Mittel
Effekt: ★★★
```

1. Header: backdrop-filter + Transparenz
2. Orientierungssätze: 13px + Hintergrund + ohne ○-Prefix
3. Spiegelkarten: shadow.md
4. Coin-SVGs als Wasserzeichen (Finanzen + Behörden, 10-15% Opacity)

**Prüfpunkt:** Fühlt sich die App materiell an? Zu viel Effekt?

---

### Sprint 4 — "Repository Hygiene"

```
Aufwand: ~30 Minuten
Risiko: Keins
Effekt: Ordnung
```

1. Coin-SVGs + maloja-icons ins Repo kopieren
2. ordnung-ruhe/node_modules löschen
3. docs/agents + docs/runtime + docs/spinnennetz → archive/concepts/
4. Phase-1-Roadmap-Dateien → archive/phases/

---

### Sprint 5 — "Neue Symbole" (optional)

```
Aufwand: ~2-3 Stunden
Risiko: Keins
Effekt: ★★
```

1. Wegweiser-Icon zeichnen
2. Kuhglocke-Icon zeichnen
3. Posthorn-Icon zeichnen
4. Favicon ersetzen

---

## Gesamt-Timeline

| Sprint | Geschätzt | Kumulierter Effekt |
|--------|-----------|-------------------|
| Sprint 1 | 2-3h | App atmet. Hierarchie sichtbar. Oberflächen haben Tiefe. |
| Sprint 2 | 1-2h | Schweizer Symbole sichtbar. Kapitel = Räume. Pass lebt. |
| Sprint 3 | 1-2h | Materialität spürbar. Orientierung lesbar. |
| Sprint 4 | 0.5h | Repo sauber. Assets verfügbar. |
| Sprint 5 | 2-3h | Symbol-Vokabular komplett. |
| **Total** | **7-11h** | **Maloja fühlt sich wie Maloja an.** |

---

## Abschluss

Die Konsolidierung erfordert:

- **0 neue Features**
- **0 neue Screens**
- **0 neue Datenstrukturen**
- **0 Architekturänderungen**

Sie erfordert nur:

- Zahlen ändern (12→15, 600→400, 14→24, 20%→0%)
- Tokens benutzen, die schon existieren (shadow.sm)
- Assets zeigen, die schon da sind (Icons grösser)
- Einen Block hinzufügen, der existierende Daten nutzt (Kapitel-Header)
- Dateien an den richtigen Ort verschieben

**Die Seele von Maloja ist da. Sie braucht nur Platz.**
