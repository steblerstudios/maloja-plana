# Design Migration Report — Was ging verloren?

> Agent 2 — Design Historian
> Stand: 2026-06-07

---

## Vergleichsbasis

| Aspekt | Ordnung & Ruhe Alt (`ordnung-ruhe/src/main.jsx`) | Maloja Plana (`ordnung-ruhe-neu/src/`) |
|--------|------------------------------------------------|--------------------------------------|
| Zeilen | 949 (1 Datei) | ~8'500 (63 Dateien) |
| Views | 3 (Landing, Login, App) | 17+ |
| Font | Cormorant Garamond (Serif) + System | DM Sans (lokal gehostet) |
| Palette | Identische Hex-Werte | Identische Hex-Werte |

---

## 1. Farben

### Identisch geblieben
- Alle Hex-Werte: `#F5F2EE`, `#C9A96E`, `#7B9E8C`, `#B87070`, `#6E90B0`, `#B8956A`
- Light/Dark Mode Palette-Struktur
- Akzentfarben (Gold, Sage, Rose, Sky, Sand)

### Verändert / Verloren
| Alt | Neu | Verlust |
|-----|-----|---------|
| Alpha-Transparenzen: `palette.surface + '99'` | Solid colors only | Nebel-Qualität |
| Farbe als Feedback: `palette.sage` für ✓-Checkmarks | `palette.mid` für fast alles (156×) | Semantische Differenzierung |
| `palette.sand` als primäre CTA-Farbe | Sand nur 8× als Farbe | Klarheit der Interaktion |

---

## 2. Typografie

### Alt — Cormorant Garamond + System
```
Hero:           44px / 700 / Cormorant Garamond (Serif)
Section Title:  16px / 600 / Cormorant Garamond
App Name:       14px / 600 / Cormorant Garamond
Body:           14px / normal / system
Labels:         13px / 600
Small:          12px / 500
Legal:          11px
Buttons:        13px / 600
```

### Neu — DM Sans only
```
Dashboard H1:   28px / 700 / DM Sans
Tagline:        15px / 400
Kapitel-Titel:  18px hardcoded
Labels:         12px / 600 (dominiert: 114×)
Body:           12px (faktisch) — 15px (Token, 3× verwendet)
Hints:          11px / 600
Everything:     12px / 600
```

### Was verloren ging
| Eigenschaft | Alt | Neu |
|-------------|-----|-----|
| **Serif als Kontrapunkt** | Cormorant Garamond gab Eleganz, Zeitlosigkeit | Nur Sans → alles gleich |
| **Grössenhierarchie** | 44 → 16 → 14 → 13 → 12 → 11 (6 Stufen nutzbar) | 28 → 18 → 12 → 11 (de facto 4 Stufen) |
| **Gewichtsvariation** | 400/500/600/700 differenziert | 600 dominiert (180/220) |
| **Lesbarkeit** | 14px Body | 12px Body = Admin-Panel |

**Bewertung:** Die Entscheidung für DM Sans war korrekt (Zielgruppe: Lesbarkeit). Aber die Implementierung nutzt die Font-Skala nicht. Die Tokens definieren 7 Stufen — verwendet werden 2.

---

## 3. Karten

### Alt — SoftCard
```javascript
function SoftCard({ children, style = {}, palette }) {
  return createElement('div', {
    style: {
      borderRadius: '10px',
      border: `1px solid ${palette.border}`,
      background: palette.surface,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '20px',
      ...style
    }
  }, children);
}
```
- Klar definierte Komponente
- Konsistenter Schatten
- Erkennbare Erhöhung
- 15× verwendet im alten Projekt

### Neu — Keine Karten-Abstraktion
- `border: '1px solid ' + palette.border` → flat
- `boxShadow: shadow.sm` nur an 5 Stellen (SozialhilfeView, ChapterView, Dashboard, Header, MobileNav)
- Keine wiederverwendbare Karten-Komponente
- Oberflächen sind flach und uniform

### Was verloren ging
- **Greifbarkeit** — SoftCard lag "auf" dem Hintergrund
- **Konsistenz** — eine Komponente = ein Gefühl
- **Materialität** — Schatten = Licht = Raum

---

## 4. Materialität

### Alt
| Element | Implementierung |
|---------|----------------|
| **Glassmorphism-Header** | `background: ${palette.surface}99` + `backdropFilter: 'blur(8px)'` |
| **Coin-Gradients** | `radialGradient` in SVGs — simuliert Metalloberfläche |
| **Soft Shadow** | `0 1px 3px rgba(0,0,0,0.1)` auf allen Karten |
| **Opacity-Stufen** | `opacity: 0.5` für disabled, Übergänge |

### Neu
| Element | Implementierung |
|---------|----------------|
| **Header** | Solid `palette.surface` + `shadow.sm` |
| **Icons** | Monochrom `currentColor` — keine Gradients |
| **Karten** | Flat mit Border |
| **Übergänge** | `transition` auf hover — aber keine visuellen Ebenen |

### Was verloren ging
- **backdrop-filter** (Nebel-Metapher)
- **Radial-Gradients** (Münz-Materialität)
- **Multi-Ebenen-Tiefe** (Schatten-Abstufung)
- **"Greifbar"-Gefühl** — alles ist flach

---

## 5. Transparenzen

### Alt
- Header: `palette.surface + '99'` (≈60% opaque)
- Buttons disabled: `opacity: 0.5`
- Coin-Sterne: `fill="#E0D8C8"` auf Gradient → schimmert

### Neu
- **Keine Transparenzen** in der UI (ausser einige `+ '22'` Hex-Suffixe für Icon-Hintergründe)
- Kein backdrop-filter
- Keine layered-opacity Effekte

### Verlust
Die Registry beschreibt "Nebel — Transparenzen, weiche Übergänge". Die Implementierung hat: null.

---

## 6. Schatten

### Alt
- `boxShadow: '0 1px 3px rgba(0,0,0,0.1)'` — auf jeder SoftCard (15×)
- Klar und konsistent

### Neu
- Token definiert: `shadow.sm/md/lg/xl`
- Tatsächlich verwendet: 5 Stellen (von ~50 möglichen Karten/Panels)
- 90% der Oberflächen sind flat

### Verlust-Ausmass
Von "jede Karte hat Schatten" zu "fast nichts hat Schatten". Die Tokens existieren — sie werden ignoriert.

---

## 7. Dashboard

### Alt
- Landing Page → Login → App (3-Screen-Flow)
- Marketing-artig mit Feature-Grid, Bullets, CTAs
- `44px` Hero-Titel, Cormorant Garamond
- 7 Kapitel als einfache Liste mit Unicode-Emojis
- Kein Schweizer Symbolik (ausser Palette)

### Neu
- BetaGate → Dashboard mit Malojapass → Kapitel
- Topografischer SVG mit Trail und Stationen
- 7 Maturity-Stufen mit Icon-Grösse + Schatten + Farbe
- Easter Eggs (Tannen, Edelweiss, Kuh, Matterhorn...)
- Tier-System (Core/Supporting/Protective)
- Guided Start für neue Nutzer
- Progress-Kommunikation

### Was das Neue BESSER macht
- **Malojapass** = emotional, einzigartig, metaphorisch
- **Trail** = Lebensweg sichtbar
- **Maturity** = sanftes Feedback ohne Gamification
- **Easter Eggs** = Belohnung und Freude
- **Tier-System** = Orientierung

### Was das Alte BESSER machte
- **Grössere Typografie** = mehr Charakter
- **SoftCards** = greifbare Oberflächen
- **Glassmorphism** = modern, luftig
- **Klare CTA-Hierarchie** = Sand-Button = primäre Aktion

---

## Zusammenfassung — Migrationsverluste

| Kategorie | Verloren? | Schwere |
|-----------|-----------|---------|
| Palette | Nein — identisch | — |
| Typografie-Charakter | **Ja** — Serif + Hierarchie | ★★★★★ |
| Karten-Materialität | **Ja** — Schatten, Greifbarkeit | ★★★★ |
| Transparenzen | **Ja** — Glassmorphism, Nebel | ★★★ |
| Coin-Illustrationen | **Ja** — 400×400 Kunstwerke nie migriert | ★★★ |
| Dashboard-Konzept | **Nein** — Neu ist besser | — |
| Schweizer Identität | **Nein** — Neu hat mehr | — |
| Icons | **Nein** — Neu hat 47 statt 0 | — |
| Accessibility | **Nein** — Neu hat Focus, ARIA, Skip-Link | — |
| Responsive | **Nein** — Neu ist 375px+ ready | — |

**Fazit:** Das Neue ist in Struktur, Inhalt und Identität überlegen. Aber es hat bei der Migration die **Oberflächen-Qualität** (Schatten, Tiefe, Typografie-Hierarchie, Glassmorphism) fallen lassen. Die Vision wurde architektonisch umgesetzt, aber visuell nicht zu Ende gebracht.
