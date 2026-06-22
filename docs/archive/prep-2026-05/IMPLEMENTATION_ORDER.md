# Implementation Order — Priorisiert nach Effekt/Risiko

> Agent 6 — Implementation Architect
> Stand: 2026-06-07

---

## Bewertungsmatrix

| Kriterium | Gewichtung |
|-----------|-----------|
| Visueller Effekt | 40% |
| Risiko (Regression, Seiteneffekte) | 30% |
| Aufwand (Zeilen Code, Dateien) | 20% |
| Abhängigkeiten (braucht andere Änderung vorher?) | 10% |

---

## Reihenfolge

### Sprint 1 — "Foundation Lift" (höchster Effekt, geringstes Risiko)

| # | Aufgabe | Dateien | Effekt | Risiko | Aufwand |
|---|---------|---------|--------|--------|---------|
| 1.1 | **fontWeight Default 600 → 400** | Alle .jsx (systematisch) | ★★★★★ | Gering — visuell, keine Logik | Mittel (viele Stellen) |
| 1.2 | **Body fontSize 12px → text.sm/text.body** | Alle .jsx | ★★★★★ | Gering — Layout kann sich leicht verschieben | Mittel |
| 1.3 | **shadow.sm auf Karten/Container** | ChapterView, Dashboard, MirrorCards | ★★★★ | Sehr gering | Klein |
| 1.4 | **Spacing +8px zwischen Sektionen** | ChapterView, Dashboard | ★★★★ | Sehr gering | Klein |

**Build-Check nach Sprint 1.** Visuell prüfen: sieht die Hierarchie richtig aus?

---

### Sprint 2 — "Schweizer Identität sichtbar"

| # | Aufgabe | Dateien | Effekt | Risiko | Aufwand |
|---|---------|---------|--------|--------|---------|
| 2.1 | **Kapitel-Header Block** (Icon 48px + Lebenssatz + Intro + Abstand) | ChapterView.jsx | ★★★★★ | Gering — additiver Block, keine bestehende Logik verändert | Mittel |
| 2.2 | **Dashboard Trail-Icons grösser** (14→18px, 20→24px) | Dashboard.jsx | ★★★ | Gering — nur Zahlenwerte | Klein |
| 2.3 | **Easter Eggs: Tannen ab 0%, Rest früher** | Dashboard.jsx | ★★★ | Keins | Minimal (3 Zahlen) |
| 2.4 | **Versicherungs-Icon: Kreuz → Edelweiss** | IconSystem.jsx | ★★★ | Keins — nur SVG-Pfad ändern | Klein |

**Abhängigkeit:** 2.1 profitiert von 1.1 + 1.2 (Typografie muss stimmen, bevor Header gut aussieht).

---

### Sprint 3 — "Materialität"

| # | Aufgabe | Dateien | Effekt | Risiko | Aufwand |
|---|---------|---------|--------|--------|---------|
| 3.1 | **Header Glassmorphism** | main.jsx | ★★★ | Gering — backdrop-filter gut unterstützt | Minimal (2 Zeilen) |
| 3.2 | **Orientierungssätze sichtbar** (13px, Hintergrund, ohne ○) | ChapterView.jsx | ★★★ | Gering | Klein |
| 3.3 | **Spiegelkarten shadow.md** | MirrorCards.jsx | ★★ | Keins | Minimal |
| 3.4 | **Coin-SVGs als Kapitel-Wasserzeichen** (Finanzen + Behörden) | ChapterView.jsx + neue Asset-Dateien | ★★★ | Mittel — muss subtil genug sein | Mittel |

**Abhängigkeit:** 3.4 erfordert MERGE von Coin-SVGs (Repository Cleanup zuerst).

---

### Sprint 4 — "Assets integrieren"

| # | Aufgabe | Dateien | Effekt | Risiko | Aufwand |
|---|---------|---------|--------|--------|---------|
| 4.1 | **Coin-SVGs ins Repo kopieren** | Dateisystem | ★ (Vorbereitung) | Keins | Minimal |
| 4.2 | **maloja-icons 256px ins Repo** | Dateisystem | ★ (Vorbereitung) | Keins | Minimal |
| 4.3 | **maloja-icons als Empty-State-Grafik** | ChapterView.jsx | ★★★ | Gering | Mittel |
| 4.4 | **ordnung-ruhe/ node_modules löschen** | Dateisystem | ★ (Hygiene) | Keins | Minimal |

---

### Sprint 5 — "Neue Symbole" (optional)

| # | Aufgabe | Dateien | Effekt | Risiko | Aufwand |
|---|---------|---------|--------|--------|---------|
| 5.1 | **Wegweiser-Icon zeichnen** | IconSystem.jsx | ★★★ | Keins | Mittel (Design-Arbeit) |
| 5.2 | **Kuhglocke-Icon zeichnen** | IconSystem.jsx | ★★ | Keins | Mittel |
| 5.3 | **Posthorn-Icon zeichnen** | IconSystem.jsx | ★★ | Keins | Mittel |
| 5.4 | **Favicon ersetzen** | public/ | ★★ | Keins | Klein |

---

## Risiko-Einschätzung

### Niedrigstes Risiko (kann jederzeit)
- Shadow hinzufügen (additiv)
- Spacing erhöhen (additiv)
- Easter-Egg-Schwellen senken (Zahlenwert)
- Icons grösser rendern (Zahlenwert)
- Neue Icons zeichnen (additiv)
- Dateien kopieren/verschieben

### Mittleres Risiko (Build + visueller Check nötig)
- **Typografie-Lift** — kann Layout-Verschiebungen erzeugen (Zeilenumbrüche an anderen Stellen, Buttons breiter, etc.)
- **fontWeight-Änderung** — verändert das Gewicht aller Elemente gleichzeitig
- **Coin-Wasserzeichen** — muss genau richtig dosiert sein (zu stark = kitschig, zu schwach = unsichtbar)

### Höheres Risiko (sorgfältig testen)
- **Kapitel-Header Block** — schiebt alle Felder nach unten, Mobile-Breakpoints prüfen
- **Glassmorphism** — auf älteren Browsers testen

---

## Vorbedingungen

| Aufgabe | Erfordert vorher |
|---------|-----------------|
| Kapitel-Header (2.1) | Typografie-Lift (1.1 + 1.2) — sonst sieht der Header falsch aus |
| Coin-Wasserzeichen (3.4) | Asset-Integration (4.1) |
| maloja-icons als Empty-State (4.3) | Asset-Integration (4.2) |
| Wegweiser in Orientierung (5.1→Einsatz) | Icon muss erst gezeichnet werden |

---

## Geschätzte Zeitbudgets

| Sprint | Geschätzt | Dateien betroffen |
|--------|-----------|-------------------|
| Sprint 1 | 2–3 Stunden | ~15 .jsx-Dateien |
| Sprint 2 | 1–2 Stunden | 3 Dateien |
| Sprint 3 | 1–2 Stunden | 3–4 Dateien |
| Sprint 4 | 30 Minuten + 1 Stunde | Dateisystem + 1 .jsx |
| Sprint 5 | 2–3 Stunden (Design-Arbeit) | 1–2 Dateien |

**Gesamtschätzung:** 7–11 Stunden für die komplette Design-Konsolidierung.

---

## Der eine Commit, der am meisten verändert

Wenn alles in einen einzigen Commit müsste:

**Sprint 1.1 + 1.2 + 2.1** zusammen:
- fontWeight Default → 400
- fontSize 12px → 13/15px
- Kapitel-Header mit 48px Icon + Lebenssatz

Diese drei Änderungen würden die App fundamental anders anfühlen lassen.
Ohne ein Feature hinzuzufügen. Ohne die Architektur zu berühren.
