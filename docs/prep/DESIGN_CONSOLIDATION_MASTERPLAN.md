# Design Consolidation Masterplan — Maloja Plana

> Stand: 2026-06-07
> Keine Implementierung. Keine neuen Features. Nur Sichtbarkeit.
> Leitsatz: "Die Kunst existiert. Sie braucht Raum."

---

## A. Sofort übernehmen (aus dem Alten / aus Tokens)

### A1. Schatten aktivieren

Die Tokens existieren bereits (`shadow.sm/md/lg/xl` in tokens.js). Sie werden kaum verwendet.

| Wo einsetzen | Welcher Schatten | Warum |
|-------------|-----------------|-------|
| Kapitel-Karten in ChapterView | `shadow.sm` | Leichte Erhöhung → "Raum" statt "Formular" |
| Dashboard Guided Start (bereits) | `shadow.sm` ✓ | Schon korrekt |
| Spiegelkarten (Mirror Layer) | `shadow.md` | Die Spiegelung hebt sich vom Untergrund ab |
| Tool-Karten im Dashboard | `shadow.sm` | Leichte Materialität |
| Modale / Overlays (falls vorhanden) | `shadow.lg` | Klare Tiefentrennung |

**Aufwand:** Minimal — `boxShadow: shadow.sm` hinzufügen. Tokens existieren.

---

### A2. Transparenz / Nebel zurückholen

Aus dem alten Projekt: `backdrop-filter: blur(8px)` + Alpha-Transparenz (`palette.surface + '99'`).

| Wo einsetzen | Was |
|-------------|-----|
| Header (main.jsx) | Bereits `shadow.sm` — zusätzlich: `background: palette.surface + 'F2'` + `backdropFilter: 'blur(8px)'` |
| MobileNav Overlay | Hintergrund leicht durchscheinend statt solid |

**Aufwand:** 2–3 Zeilen ändern. Alte Implementierung als Vorlage.

---

### A3. Typografie-Lift (der grösste Einzelhebel)

**Status quo:** 291 hardcoded fontSize-Werte (davon ~114× `12px`), nur 100 nutzen die Token-Skala.

**Minimaleingriff mit maximalem Effekt:**

| Änderung | Von | Zu | Betroffene Stellen |
|----------|-----|----|--------------------|
| Body-Text | 12px | `text.sm` (13px) oder `text.body` (15px) | Labels, Beschreibungen, Hints |
| Orientierungssätze | 11px | `text.sm` (13px) | ChapterView (3 Stellen) |
| Kapitelüberschriften | 18px hardcoded | `text.lg` (18px) Token | Konsistenz |
| Sektions-Header | 13px/600 | `text.body` (15px) / `weight.medium` | ChapterView Sektionen |
| Default fontWeight | 600 überall | `weight.normal` (400) als Default, 600 nur für Titel | Global |

**Der eine Satz, der alles erklärt:**
Heute ist alles 12px/600 — nichts ist wichtig, also ist nichts unwichtig. Danach: 15px/400 als Basis, 600 nur für Überschriften → Hierarchie entsteht.

**Aufwand:** Mittel — systematisch, aber keine Architekturänderung. Datei für Datei.

---

### A4. Atemraum (Spacing-Lift)

| Wo | Von | Zu | Effekt |
|----|-----|-----|--------|
| Zwischen Kapitel-Sektionen | 16px gap | `space.lg` (24px) | Luft |
| Zwischen Feldern in ChapterView | 8–12px | `space.md` (16px) | Lesbarkeit |
| Kapitel-Header zu Inhalt | 16px margin | `space.xl` (32px) | Editorial-Gefühl |
| Dashboard: Welcome zu Pass | 0px marginBottom | `space.lg` (24px) | Atempause |

**Aufwand:** Klein — Zahlenwerte anpassen.

---

## B. Neu zeichnen (3 Icons)

### B1. Kuhglocke

**Warum:** Starkes CH-Symbol für Erinnerungen/Benachrichtigungen. Kein generischer "Bell"-Icon.

**Stil:** 24×24 Piktogramm, `currentColor`, konsistent mit bestehendem System.

**Referenz:** Trychel (Appenzeller Kuhglocke) — breite Öffnung, trapezförmig, Lederband mit Schnalle oben.

---

### B2. Posthorn

**Warum:** Schweizer Post = Zuverlässigkeit. Ideal für Export/Briefe/Kommunikation.

**Stil:** 24×24, stilisiertes Posthorn (2 Windungen), erkennbar als CH-Post-Element.

**Einsatz:** Export-Funktionen, Brief-Generatoren, Behördenkorrespondenz.

---

### B3. Wegweiser

**Warum:** Gelbe Wanderwegweiser sind DAS Schweizer Orientierungssymbol. Perfekt für die Orientierungsschicht.

**Stil:** 24×24, gelbes Pfeilschild auf Pfosten (wie Wanderweg-Markierung).

**Einsatz:** Orientierungssätze, Lebensraum-Eintritt, "Du bist hier"-Momente.

---

### B4. Versicherungs-Schild ersetzen

**Aktuell:** `_versicherungen` = generisches Schild + Kreuz (24×24).

**Besser:** Schild mit Edelweiss (wie maloja-icons/03). Der Edelweiss gibt dem Schild schweizerischen Charakter.

**Aufwand:** Bestehenden `_versicherungen` SVG-Code anpassen — Kreuz → Edelweiss-Blüte.

---

## C. Sichtbarer machen (existierende Assets)

### C1. Kapitel-Icons grösser darstellen

**Aktuell:** Dashboard-Trail-Icons bei 14–20px (Maturity: 26–34px Container, 14–20px Icon).

**Neu:** Minimum 20px Icon im Trail, 28px in Kapitel-Listen.

| Kontext | Aktuell | Empfohlen |
|---------|---------|-----------|
| Trail-Stationen (sketch) | 14px | 18px |
| Trail-Stationen (complete) | 20px | 24px |
| Kapitel-Liste (Dashboard unten) | 18px | 24px |
| Kapitel-Header (ChapterView) | **0px** (kein Icon!) | **40px** |

**Der grösste Einzelgewinn:** ChapterView zeigt aktuell KEIN Kapitel-Icon. Wenn jemand "Finanzen" betritt, sieht er den Fünfliber nicht. Der teuerste Icon im System (48×48, Lorbeerkranz, Perlrand) wird nie in seinem eigenen Kapitel gezeigt.

---

### C2. Kapitel-Header mit Icon + Lebenssatz

**Aktuell:** ChapterView beginnt direkt mit Formularfeldern.

**Vision:** Beim Betreten eines Kapitels: grosses Icon (40–48px) + Lebenssatz + Intro-Text. Dann erst Felder.

```
┌─────────────────────────────────┐
│  [Fünfliber 48px]               │
│                                 │
│  "Geld ist Werkzeug,           │
│   nicht Identität."            │
│                                 │
│  Deine finanzielle Basis...    │
│                                 │
│  ─────────────────────────     │
│  [Felder beginnen hier]        │
└─────────────────────────────────┘
```

**Aufwand:** Mittel — ein neuer Block am Anfang jeder ChapterView.

---

### C3. Orientierungssätze sichtbar machen

**Aktuell:** 11px, `palette.sage`, Unicode `○` Prefix — wirkt wie ein Systemhinweis.

**Besser:**
- 13px (statt 11px)
- Eigene Zeile mit leichtem Hintergrund (`palette.up` oder `palette.sage + '12'`)
- Wegweiser-Icon (wenn erstellt) statt `○`
- Oder: Kein Prefix, dafür kursiv + etwas mehr Abstand

**Der Punkt:** Orientierung soll sich anfühlen wie ein freundlicher Hinweis am Wegrand — nicht wie eine Fussnote.

---

### C4. Coin-SVGs als Kapitel-Schmuck

Die alten 400×400 Coin-SVGs (Helvetia Obverse, Fünfliber Reverse) sind materialreiche Illustrationen mit Gradient, Perlrand, Sternenkranz.

**Option A — Hero-Element:** Bei Kapitel-Eintritt (Finanzen / Behörden) im Hintergrund, 15% Opacity, als "Wasserzeichen".

**Option B — Onboarding-Moment:** Beim allerersten Betreten eines Kapitels als Fullscreen-Einblendung (1 Sekunde), dann fade-out.

**Option C — Nicht verwenden.** Der Stilbruch (illustrativ vs. piktografisch) ist zu gross.

**Empfehlung:** Option A mit sehr niedriger Opacity — die Münze als Wasserzeichen gibt dem Raum Materialität, ohne zu dominieren.

---

### C5. maloja-icons Originale (256×256) nutzen

**Wo:** Als Kapitel-Intro-Grafik beim ersten Betreten (Empty State) oder als Hintergrund-Element.

**Nicht als:** Ersatz für die 24×24 Piktogramme im laufenden UI. Die Inline-Icons bleiben klein und funktional.

**Die 256er sind Schmuck. Die 24er sind Werkzeuge. Beide haben ihren Platz.**

---

### C6. Easter Eggs früher zeigen

**Aktuell:** Tannen ab 20%, Edelweiss ab 35%, Gipfelkreuz ab 45%, Kuh ab 65%...

**Problem:** Neue Nutzer (0%) sehen einen leeren Pass. Die emotionalsten Elemente sind für die meisten unsichtbar.

**Empfehlung:**
- Tannen ab 0% (immer sichtbar, mit 0.3 Opacity) — der Pass ist nie leer
- Edelweiss ab 15% (statt 35%)
- Kuh ab 40% (statt 65%)
- Rest kann bleiben

**Der Pass soll leben, nicht verdient werden.**

---

## D. Nicht anfassen

| Element | Warum nicht |
|---------|------------|
| **Malojapass-SVG Grundstruktur** | Funktioniert. Das Beste am Dashboard. |
| **Farbpalette (Hex-Werte)** | Stimmt. Warm, geerdet, schweizerisch. |
| **DM Sans als Font** | Richtige Entscheidung für Zielgruppe. Kein Serif zurückholen. |
| **Hash-Routing** | Architektur, nicht Design. |
| **localStorage/IndexedDB** | Datenschicht, nicht UI. |
| **Tier-System (Core/Supporting/Protective)** | Gut strukturiert, sichtbar genug. |
| **BetaGate** | Funktional, schlicht, korrekt. |
| **Spiegelungs-Logik** | Inhalt stimmt — nur die Darstellung braucht Schatten/Grösse. |
| **i18n System** | Infrastruktur, kein Design. |
| **Anti-Gamification-Prinzip** | Identitätsstiftend. Nicht aufweichen. |

---

## E. Reihenfolge

### Phase 1 — "Luft und Licht" (grösster Effekt, kleinstes Risiko)

| # | Was | Aufwand | Effekt |
|---|-----|---------|--------|
| 1.1 | Typografie-Lift: 12px → 13/15px, 600 → 400 als Default | Mittel | ★★★★★ |
| 1.2 | Schatten aktivieren (shadow.sm auf Karten) | Klein | ★★★★ |
| 1.3 | Atemraum (Spacing zwischen Sektionen +8px) | Klein | ★★★★ |
| 1.4 | Orientierungssätze: 11px → 13px, Hintergrund | Klein | ★★★ |

**Ergebnis Phase 1:** Die App atmet. Text ist lesbar. Hierarchie sichtbar. Oberflächen haben Tiefe.

---

### Phase 2 — "Schweizer Identität zeigen"

| # | Was | Aufwand | Effekt |
|---|-----|---------|--------|
| 2.1 | Kapitel-Header mit grossem Icon (40–48px) + Lebenssatz | Mittel | ★★★★★ |
| 2.2 | Icons im Dashboard-Trail grösser (14→18px, 20→24px) | Klein | ★★★ |
| 2.3 | Versicherungs-Icon: Kreuz → Edelweiss | Klein | ★★★ |
| 2.4 | Easter Eggs früher zeigen (Tannen ab 0%) | Klein | ★★★ |

**Ergebnis Phase 2:** Schweizer Symbole werden sichtbar. Jedes Kapitel hat eine visuelle Identität. Der Pass lebt von Anfang an.

---

### Phase 3 — "Materialität und Nebel"

| # | Was | Aufwand | Effekt |
|---|-----|---------|--------|
| 3.1 | Header: backdrop-filter + Transparenz | Klein | ★★★ |
| 3.2 | Coin-SVG als Wasserzeichen (Finanzen + Behörden) | Mittel | ★★★ |
| 3.3 | Spiegelkarten mit shadow.md | Klein | ★★ |
| 3.4 | maloja-icons 256px als Empty-State-Grafik | Mittel | ★★★ |

**Ergebnis Phase 3:** Die App fühlt sich materiell an. Nicht mehr flat. Münz-Wasserzeichen gibt Finanzen Gewicht.

---

### Phase 4 — "Neue Symbole" (optional, nur bei Bedarf)

| # | Was | Aufwand | Effekt |
|---|-----|---------|--------|
| 4.1 | Kuhglocke zeichnen | Mittel | ★★ |
| 4.2 | Posthorn zeichnen | Mittel | ★★ |
| 4.3 | Wegweiser zeichnen | Mittel | ★★★ |
| 4.4 | Favicon ersetzen (weg vom lila Blitz) | Klein | ★★ |

**Ergebnis Phase 4:** Das Symbol-Vokabular ist komplett. Jedes Schweizer Konzept hat ein Bild.

---

## Die 10 UI-Stellen mit dem grössten visuellen Effekt

| # | Stelle | Warum | Phase |
|---|--------|-------|-------|
| 1 | **ChapterView Kapitel-Header** | 0px Icon → 48px Icon + Lebenssatz = sofort "Ort" statt "Formular" | 2 |
| 2 | **Body-Text global** | 12px → 15px = gesamte App fühlt sich ruhiger an | 1 |
| 3 | **fontWeight Default** | 600 → 400 = Hierarchie entsteht, Überschriften werden sichtbar | 1 |
| 4 | **Formular-Karten (ChapterView)** | Flat → shadow.sm = Tiefe, Raum, Materialität | 1 |
| 5 | **Orientierungssätze** | 11px Sage → 13px mit Hintergrund = Orientierung wird lesbar | 1 |
| 6 | **Dashboard Trail-Icons** | 14px → 18–24px = Fünfliber und Helvetia werden erkennbar | 2 |
| 7 | **Header** | Solid → Glassmorphism = Nebel-Metapher, Modernität | 3 |
| 8 | **Easter Eggs Schwelle** | 20% → 0% für Tannen = Pass lebt sofort | 2 |
| 9 | **Spiegelkarten** | Flat → shadow.md = "Das bist du" hebt sich ab | 3 |
| 10 | **Finanzen/Behörden Hintergrund** | Leer → Coin-Wasserzeichen = Schweizer Identität im Raum | 3 |

---

## Der kleinste Eingriff mit dem grössten Effekt

**Wenn nur EINE Sache geändert werden dürfte:**

→ **Kapitel-Header mit 48px Icon + Lebenssatz**

Warum:
- Macht Helvetia, Fünfliber, Chalet sofort sichtbar
- Gibt jedem Kapitel eine Identität
- Verwandelt "Formular betreten" in "Raum betreten"
- Nutzt existierende Assets (Icons + Lebenssätze sind da)
- Kein neues Design nötig — nur Anordnung

**Wenn ZWEI Dinge erlaubt wären:**

→ Kapitel-Header + Typografie-Lift (12px → 15px Body)

Diese zwei Änderungen würden die App fundamental anders anfühlen lassen — ohne ein einziges neues Feature, ohne neue Assets, ohne Architekturarbeit.

---

## Zusammenfassung

Die Konsolidierung ist kein Redesign.

Sie ist: **den existierenden Elementen den Platz geben, der ihnen gebührt.**

- Die Typografie-Tokens existieren → sie müssen benutzt werden
- Die Schatten-Tokens existieren → sie müssen eingesetzt werden
- Die Icons existieren → sie müssen gross genug gezeigt werden
- Die Lebenssätze existieren → sie müssen lesbar sein
- Die Coin-SVGs existieren → sie müssen sichtbar werden

Nichts muss erfunden werden.
Alles muss nur an seinen richtigen Platz.
