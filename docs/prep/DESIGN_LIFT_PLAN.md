# Design Lift Plan — Sichtbarkeit, Symbolik, Materialität

> Agent 5 — Experience Designer
> Stand: 2026-06-07
> Basiert auf: DESIGN_VISION_GAP.md + DESIGN_CONSOLIDATION_MASTERPLAN.md

---

## Die zentrale Frage

Warum fühlt sich Maloja noch nicht wie Maloja an?

**Antwort in einem Satz:**

Die Identität lebt im Dashboard-SVG (Malojapass) — aber in jedem anderen Screen wird sie durch 12px/600, flache Oberflächen und zu kleine Icons unsichtbar gemacht.

---

## Die 6 Hebel

### 1. Typografie — "Die App soll sprechen, nicht flüstern"

| Eingriff | Was | Warum |
|----------|-----|-------|
| Body: 12px → 15px | Alle Labels, Beschreibungen, Formularfelder | Lesbarkeit, Ruhe, Editorial |
| Default-Weight: 600 → 400 | Fliesstext, Labels, Hints | Hierarchie: wenn alles fett ist, ist nichts fett |
| Titel: 600 bleibt | Kapitel-Überschriften, Sektions-Header | Unterscheidung |
| Orientierung: 11px → 13px | Orientierungssätze (Helvetia Layer) | Sichtbar statt Fussnote |

**Effekt:** Die gesamte App fühlt sich sofort ruhiger, erwachsener, lesbarer an. Hierarchie entsteht.

---

### 2. Kapitel-Header — "Einen Raum betreten, nicht ein Formular öffnen"

**Aktuell:** ChapterView beginnt direkt mit dem ersten Eingabefeld. Kein Icon. Kein Lebenssatz. Kein Ankommen.

**Danach:**

```
┌───────────────────────────────────────────┐
│                                           │
│       [Icon 48px — z.B. Fünfliber]        │
│                                           │
│   "Geld ist Werkzeug, nicht Identität."   │
│                                           │
│   Deine finanzielle Basis —               │
│   was hereinkommt und was hinausgeht.     │
│                                           │
│   ─────────────────────────────────────   │
│                                           │
│   [Erste Sektion / Felder]                │
│                                           │
└───────────────────────────────────────────┘
```

**Komponenten (alle existieren bereits):**
- Icons: `Icons[chapterKey]` — vorhanden
- Lebenssätze: `t('chapters.X.lifeSentence')` — vorhanden (Lebensraum-Phase)
- Intro-Text: `t('chapters.X.intro')` — vorhanden

**Was fehlt:** Nur die Anordnung. Ein `<div>` mit Icon + Text am Anfang der ChapterView.

---

### 3. Schatten & Tiefe — "Oberflächen, die man anfassen kann"

**Token existieren:** `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.xl`

| Wo | Welcher Schatten | Aktuell |
|----|-----------------|---------|
| Spiegelkarten (MirrorCards) | `shadow.md` | Flat (nur border) |
| Sektions-Container (ChapterView) | `shadow.sm` | Flat |
| Tool-Karten (Dashboard) | `shadow.sm` | Flat |
| Formular-Bereiche | `shadow.sm` | Flat |

**Effekt:** Oberflächen heben sich ab. Tiefe entsteht. "Raum" statt "Blatt Papier".

---

### 4. Icon-Grösse — "Die Kunst zeigen, die da ist"

| Kontext | Aktuell | Empfohlen | Warum |
|---------|---------|-----------|-------|
| Trail-Station (sketch) | 14px | 18px | Details sichtbar |
| Trail-Station (complete) | 20px | 24px | Helvetia erkennbar |
| Kapitel-Liste (Dashboard) | 18px | 24px | Chalet-Geranien sichtbar |
| **Kapitel-Header (ChapterView)** | **0px** | **48px** | DER grösste Gewinn |
| Tool-Grid | 16px | 20px | Bahnhofsuhr-Striche sichtbar |
| Orientierungssätze | 0px (nur ○) | 16px Wegweiser | Metapher statt Unicode |

---

### 5. Glassmorphism & Nebel — "Weiche Übergänge"

| Wo | Was | Effekt |
|----|-----|--------|
| Header | `backdrop-filter: blur(8px)` + `palette.surface + 'F2'` | Nebel-Metapher, Modernität |
| Spiegelkarten-Hintergrund | Leichte Transparenz | "Spiegel" fühlt sich reflektierend an |

**Aufwand:** 2–3 Zeilen. Alte Implementierung als Vorlage.

---

### 6. Weissraum — "Atmen lassen"

| Wo | Von | Zu |
|----|-----|-----|
| Zwischen Kapitel-Sektionen | 16px | 24px |
| Kapitel-Header zu Feldern | 0px | 32px |
| Dashboard Welcome zu Pass | 0px | 24px |
| Zwischen Formularfeldern | 8–12px | 16px |
| Vor/nach Orientierungssätzen | 4px | 12px |

**Effekt:** Die App atmet. Weniger Informationsdichte = mehr Verständnis.

---

## Die 10 wirkungsvollsten UI-Stellen

| # | Stelle | Eingriff | Effekt |
|---|--------|----------|--------|
| 1 | **ChapterView Kapitel-Anfang** | 48px Icon + Lebenssatz + 32px Abstand | Formular → Raum |
| 2 | **Globaler Body-Text** | 12px → 15px | Admin → Editorial |
| 3 | **Globales fontWeight** | 600 Default → 400 Default | Monotonie → Hierarchie |
| 4 | **Spiegelkarten** | + shadow.md + leichte Transparenz | Flat → greifbar |
| 5 | **Orientierungssätze** | 11px → 13px + Hintergrund + Icon | Fussnote → Wegweiser |
| 6 | **Dashboard Trail-Icons** | 14-20px → 18-24px | Punkte → Symbole |
| 7 | **Header** | + backdrop-filter + Transparenz | Solid → Nebel |
| 8 | **Easter Eggs Schwelle** | Tannen ab 0% statt 20% | Leerer Pass → lebender Pass |
| 9 | **Versicherungs-Icon** | Kreuz → Edelweiss | Generisch → Schweizerisch |
| 10 | **Sektions-Spacing** | +8px überall | Gedrängt → Luft |

---

## Was den "Maloja-Moment" erzeugt

Der Malojapass auf dem Dashboard ist der einzige Moment, in dem die App sich wie die Vision anfühlt. Warum?

1. **Grosses Bild** — der SVG nimmt Raum ein
2. **Metapher** — es ist kein UI-Element, es ist eine Landschaft
3. **Progression** — es verändert sich mit der Zeit
4. **Stille** — kein Text, kein CTA, nur Bild
5. **Schweizer Identität** — unverkennbar

**Das Ziel:** Dieses Gefühl in jedes Kapitel tragen. Nicht durch Kopieren des SVG, sondern durch:
- Grosses Icon (= Metapher sichtbar)
- Lebenssatz (= Stille, kein CTA)
- Weissraum (= Raum zum Ankommen)
- Schatten (= Tiefe, nicht flat)
- Typografie-Hierarchie (= Ruhe, nicht Dichte)

---

## Was NICHT getan werden soll

- Kein Serif-Font zurückholen (Lesbarkeit > Charakter)
- Keine Animationen hinzufügen (Reduced Motion respektieren)
- Keine Farbpalette ändern (stimmt bereits)
- Keine neuen Screens/Views (Konsolidierung, nicht Expansion)
- Keine Kartengitter (Editorial = offene Zeilen)
- Keine Gamification-Elemente (Anti-Gamification ist Identität)
- Kein Dark-Mode-Redesign (Light first, Dark folgt)
