# A-030 — UI Registry Drift

> Maschinenlesbare Übersicht: Wo weicht die Implementierung von der Design Language Registry ab?
> Stand: 2026-05-26

---

## Token-Nutzung

### CSS Custom Properties → JSX Referenzen

| Token-Kategorie | Definiert in tokens.css | Referenziert in JSX |
|-----------------|------------------------|-------------------|
| `--mp-space-*` | 8 Stufen | **0** |
| `--mp-text-*` | 7 Stufen | **0** |
| `--mp-leading-*` | 3 Stufen | **0** |
| `--mp-weight-*` | 4 Stufen | **0** |
| `--mp-radius-*` | 5 Stufen | **0** |
| `--mp-shadow-*` | 4 Stufen | **0** |
| `--mp-duration-*` | 3 Stufen | **0** |
| `--mp-ease-default` | 1 | **0** |

**Ergebnis:** Die gesamte Token-Schicht ist isoliert. tokens.css und die JSX-Komponenten sind zwei getrennte Welten.

---

## Font-Size Drift

| In JSX verwendet | Im Token-System | Status |
|-----------------|----------------|--------|
| 10px | — | **Wildwuchs** |
| 11px | `--mp-text-xs` (11px) | Match |
| 12px (114x) | `--mp-text-sm` (13px) | **Drift** — 12px statt 13px |
| 13px (40x) | `--mp-text-sm` (13px) | Match |
| 14px (26x) | — | **Wildwuchs** |
| 15px (3x) | `--mp-text-body` (15px) | Match, aber fast nicht genutzt |
| 16px (11x) | — | **Wildwuchs** |
| 18px (28x) | `--mp-text-lg` (18px) | Match |
| 20px (14x) | — | **Wildwuchs** |
| 22px (0x) | `--mp-text-xl` (22px) | **Definiert, nie genutzt** |
| 28px (1x) | `--mp-text-2xl` (28px) | Match |
| 36px (1x) | `--mp-text-3xl` (36px) | Match |

**Wildwuchs-Grössen:** 10px, 14px, 16px, 20px — zusammen 88 Vorkommen, keine Token-Entsprechung.

---

## Border-Radius Drift

| In JSX verwendet | Im Token-System | Status |
|-----------------|----------------|--------|
| 2px (3x) | — | **Wildwuchs** |
| 3px (6x) | — | **Wildwuchs** |
| 4px (18x) | — | **Wildwuchs** |
| 6px (116x) | `--mp-radius-sm` (6px) | Match |
| 8px (49x) | — | **Wildwuchs** |
| 10px (4x) | `--mp-radius-md` (10px) | Match |
| 12px (3x) | — | **Wildwuchs** |
| 16px (1x) | `--mp-radius-lg` (16px) | Match |
| 50% (5x) | `--mp-radius-full` (9999px) | **Semantisch gleich** |

**Dominanz:** 6px + 8px machen 165 von 205 Radius-Vorkommen aus. 8px ist der zweit häufigste Wert ohne Token-Entsprechung.

---

## Spacing / Gap Drift

### Gap-Werte
| Wert | Vorkommen | Auf 4px-Raster? |
|------|-----------|-----------------|
| 4px | 3 | Ja |
| 5px | 1 | **Nein** |
| 6px | 10 | **Nein** |
| 8px | 55 | Ja |
| 10px | 5 | **Nein** |
| 12px | 15 | Ja |
| 16px | 2 | Ja |
| 20px | 4 | Ja |

**Off-Grid:** 16 von 95 Gap-Werte (17%) sind nicht auf dem 4px-Raster.

### Padding-Werte
| Wert | Vorkommen | Auf 4px-Raster? |
|------|-----------|-----------------|
| 4px | 8 | Ja |
| 6px | 15 | **Nein** |
| 8px | 31 | Ja |
| 10px | 37 | **Nein** |
| 12px | 60 | Ja |
| 14px | 5 | **Nein** |
| 16px | 30 | Ja |
| 20px | 32 | Ja |
| 24px | 2 | Ja |
| 32px | 2 | Ja |
| 40px | 8 | Ja |

**Off-Grid:** 57 von 230 Padding-Werte (25%) sind nicht auf dem 4px-Raster.

---

## Shadow Drift

| Definiert | Wert | JSX-Vorkommen |
|-----------|------|--------------|
| `--mp-shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | 1 (hardcoded) |
| `--mp-shadow-md` | `0 2px 8px rgba(0,0,0,0.08)` | 0 |
| `--mp-shadow-lg` | `0 4px 16px rgba(0,0,0,0.10)` | 0 |
| `--mp-shadow-xl` | `0 8px 32px rgba(0,0,0,0.12)` | 0 |

**Gesamt boxShadow in JSX:** 2 Vorkommen (nur Dashboard.jsx)

---

## Palette-Farben: Akzent-Balance

| Akzent | Definierte Semantik | Tatsächliche Nutzung |
|--------|-------------------|---------------------|
| `gold` (#C9A96E) | Wert, CTAs, Highlights | Alpha-Banner, Status-Highlights — **selten als CTA** |
| `sage` (#7B9E8C) | Natur, Erfolg | Pass-SVG, Fortschritt, Status — **inkonsistent (auch generisch)** |
| `rose` (#B87070) | Wärme, sanfte Warnung | Validierungsfehler — **nur Fehler, nicht Wärme** |
| `sky` (#6E90B0) | Information, Links | **Kaum verwendet** (5 Vorkommen) |
| `sand` (#B8956A) | Navigation, Interaktion | Buttons, Focus-Ring — **am konsistentesten** |

---

## Animation Drift

| Definiert in tokens.css | JSX-Vorkommen |
|------------------------|--------------|
| `fadeIn` | 1 (MobileNav) |
| `slideIn` | 0 |
| `slideUp` | 0 |
| `mp-stamp` | 1 (Dashboard, 100% complete) |
| `mp-check-pop` | 0 |
| `mp-lock-close` | 0 |

**Transition-Referenzen in JSX:** 29 Vorkommen, alle hardcoded (keine CSS-Variable-Referenz).

---

## Drift-Schweregrad

| Kategorie | Schwere | Beschreibung |
|-----------|---------|-------------|
| Token-JSX-Brücke | **Kritisch** | Tokens existieren, werden aber nicht referenziert |
| Font-Size-Skala | **Hoch** | 40% der Vorkommen sind Off-Token |
| Body-Text-Grösse | **Hoch** | Faktisch 12px statt 15px |
| Schatten | **Kritisch** | 4 definiert, 0 systematisch genutzt |
| Spacing-Raster | **Mittel** | ~20% Off-Grid |
| Radius-Skala | **Mittel** | 8px als zweithäufigster Wert ohne Token |
| Akzentfarben | **Mittel** | Semantik nicht durchgesetzt |
| Animationen | **Gering** | Definiert, bereit — noch nicht überall eingesetzt |
| Palette (Basisfarben) | **Gering** | Korrekt implementiert und genutzt |

---

> Dieses Dokument dient als Referenz für die systematische Design Consolidation.
