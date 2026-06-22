# Asset Library — Vollständiges Inventar

> Agent 3 — Asset Curator
> Stand: 2026-06-07

---

## Schweizer Symbole

### Helvetia

| Version | Speicherort | Grösse | Qualität | Verwendet? | Sollte verwendet werden? |
|---------|------------|--------|----------|-----------|------------------------|
| Münz-Illustration (Obverse) | `ordnung-ruhe/public/coin-obverse.svg` | 400×400 | **Exzellent** — Gradient, Perlrand, Sternenkranz, Toga, Speer, Schild, "HELVETIA" | Nein | **Ja** — als Wasserzeichen oder Hero |
| Piktogramm (Behörden-Icon) | `src/IconSystem.jsx` Z.259-363 | 48×48 | **Exzellent** — SNB-Qualität: Strahlenkrone (7 Strahlen), Chignon, Halskette, Toga-Falten, Profilhals | Ja — Dashboard 14-20px | **Ja** — aber grösser (40-48px) |
| Abstrakte Figur | `maloja-icons/04-behoerden-rechtliches.svg` | 256×256 | Gut — vereinfacht | Nein | Optional als Empty-State |

---

### Fünfliber (5-Franken-Münze)

| Version | Speicherort | Grösse | Qualität | Verwendet? | Sollte verwendet werden? |
|---------|------------|--------|----------|-----------|------------------------|
| Münz-Illustration (Reverse) | `ordnung-ruhe/public/coin-reverse.svg` | 400×400 | **Exzellent** — Lorbeerkranz (20 Blattpaare + Beeren), Wappenschild, "5 FR.", "2026" | Nein | **Ja** — als Wasserzeichen |
| Piktogramm (Finanzen-Icon) | `src/IconSystem.jsx` Z.113-237 | 48×48 | **Exzellent** — Perlrand (dashed), "5 FR." Text, Schild + Kreuz, 2 Lorbeerzweige (je 8 Blattpaare + Beeren) | Ja — Dashboard 14-20px | **Ja** — aber grösser |
| Einfache Münze | `maloja-icons/02-finanzen-geld.svg` | 256×256 | Gut — vereinfacht | Nein | Optional |

---

### Malojapass

| Version | Speicherort | Grösse | Qualität | Verwendet? |
|---------|------------|--------|----------|-----------|
| 3-Layer SVG (Dashboard) | `src/Dashboard.jsx` Z.128-235 | 720×200 viewBox | **Sehr gut** — 3 Bergketten, Trail, 7 Stationen | **Ja** — Dashboard |
| Easter Eggs (10 Stufen) | `src/Dashboard.jsx` Z.152-220 | Inline | **Kreativ** — Tannen, Edelweiss, Gipfelkreuz, Matterhorn, Kuh, Uhr, Schokolade, Sonne, Fahne | **Ja** — ab 20%+ Fortschritt |

---

### Edelweiss

| Version | Speicherort | Grösse | Qualität | Verwendet? | Sollte verwendet werden? |
|---------|------------|--------|----------|-----------|------------------------|
| Easter Egg (2 Kreise) | `src/Dashboard.jsx` Z.163-169 | ~6px | Minimal — nur Punkt + Kreis | Ja — ab 35% | Ergänzen mit richtigem Icon |
| Im Schild (Versicherungen) | `maloja-icons/03-versicherungen-vorsorge.svg` | 256×256 | **Gut** — 8 Blütenblätter + Kern | Nein — App hat Kreuz statt Edelweiss | **Ja** — Schild-Icon ersetzen |

---

### Kuhglocke

| Version | Speicherort | Qualität | Verwendet? | Sollte verwendet werden? |
|---------|------------|----------|-----------|------------------------|
| — | **Existiert nicht** | — | — | **Ja** — fehlendes CH-Symbol für Erinnerungen/Benachrichtigungen |

---

### Posthorn

| Version | Speicherort | Qualität | Verwendet? | Sollte verwendet werden? |
|---------|------------|----------|-----------|------------------------|
| — | **Existiert nicht** | — | — | **Ja** — fehlendes CH-Symbol für Kommunikation/Export/Briefe |

---

### Wegweiser

| Version | Speicherort | Qualität | Verwendet? | Sollte verwendet werden? |
|---------|------------|----------|-----------|------------------------|
| — | **Existiert nicht** | — | — | **Ja** — fehlendes CH-Symbol für Orientierung |

---

### Weitere Schweizer Elemente

| Element | Speicherort | Verwendet? |
|---------|------------|-----------|
| Kuh (Easter Egg) | Dashboard.jsx Z.185-192 | Ja — ab 65% Fortschritt |
| Matterhorn (Easter Egg) | Dashboard.jsx Z.179-183 | Ja — ab 55% |
| Gipfelkreuz (Easter Egg) | Dashboard.jsx Z.172-177 | Ja — ab 45% |
| Schweizer Fahne (Easter Egg) | Dashboard.jsx Z.214-219 | Ja — ab 100% |
| Toblerone (Schokolade) | Dashboard.jsx Z.203-207 + IconSystem | Ja — Easter Egg + chartsSchoko Icon |
| Sackmesser | IconSystem.jsx Z.501-518 | Ja — exportTool Icon |
| Bahnhofsuhr | IconSystem.jsx Z.398-426 | Ja — kalenderUhr Icon |
| QR-Rechnung | IconSystem.jsx Z.456-475 | Ja — steuern Icon |
| Chalet | IconSystem.jsx Z.37-112 | Ja — wohnen Icon (mit Geranien!) |

---

## Logos & Branding

| Asset | Speicherort | Qualität | Status |
|-------|------------|----------|--------|
| PWA Icon 192px | `public/icon-192.png` | Unbekannt (müsste visuell geprüft werden) | Verwendet |
| PWA Icon 512px | `public/icon-512.png` | Unbekannt | Verwendet |
| Favicon (alt) | `ordnung-ruhe/public/favicon.svg` | Lila Blitz — **passt nicht** zu Maloja | Nicht im Neuen |
| Hero-Bild | `ordnung-ruhe/src/assets/hero.png` (343×361) | Unbekannt — müsste angeschaut werden | Nicht im Neuen |

---

## maloja-icons Sammlung (vollständig)

| # | Datei | Motiv | Palette | Im App-Code? |
|---|-------|-------|---------|-------------|
| 01 | wohnen-leben.svg | Chalet | Gold/Crème | Ja (vereinfacht) |
| 02 | finanzen-geld.svg | Münze | Gold/Crème | Ja (aufgewertet) |
| 03 | versicherungen-vorsorge.svg | **Schild + Edelweiss** | Gold/Crème | Teilweise (ohne Edelweiss) |
| 04 | behoerden-rechtliches.svg | Helvetia-Figur | Gold/Crème | Ja (massiv detaillierter) |
| 05 | notfall.svg | Kreuz-Quadrat | Gold/Crème | Ja |
| 06 | dokument-tresor.svg | Tresor | Anthrazit/Crème | Ja (vereinfacht) |
| 07 | kalender.svg | **Bahnhofsuhr** | Anthrazit/Crème | Ja (vereinfacht) |
| 08 | budget.svg | Portemonnaie | Gold/Crème | Ja |
| 09 | schulden.svg | Dokument | Anthrazit/Crème | Ja |
| 10 | steuern.svg | QR-Rechnung | Anthrazit/Weiss | Ja |
| 11 | organspende.svg | Herz + Kreuz | Sage/Crème | Ja |
| 12 | charts.svg | **Toblerone-Chart** | Anthrazit/Crème | Ja |
| 13 | export.svg | **Sackmesser** | Anthrazit/Crème | Ja |
| 14 | praemienverbilligung.svg | Schild + Pfeil | Gold/Crème | Ja |
| 15 | mietzinsverbilligung.svg | Haus + % | Sage/Crème | Ja |
| 16 | sozialhilfe.svg | Hände | Sage/Crème | Ja |
| 17 | lebenslauf.svg | Dokument + Person | Weiss/Anthrazit | Ja |

**Status:** Alle 17 wurden ins IconSystem übernommen — aber von 256×256 auf 24×24 reduziert. Die Originale sind nirgends im App-Code referenziert.

---

## Coin-Preview-Seiten

| Datei | Speicherort | Zweck |
|-------|------------|-------|
| `coins.html` | `ordnung-ruhe/public/` | Preview beider Münzen nebeneinander |
| `coin-preview.html` | `ordnung-ruhe/public/` | Ähnliche Preview |
| `preview.html` | `/Projects/maloja-icons/` | Alle 17 Icons in Übersicht |

---

## Zusammenfassung nach Nutzungsstatus

### Aktiv verwendet (im Produkt sichtbar)
- 7 Kapitel-Icons (Dashboard + MobileNav) — aber zu klein
- Malojapass-SVG + Trail + Easter Eggs
- Maturity-System
- PWA-Icons

### Vorhanden, aber kaum sichtbar
- Helvetia-Detail (48×48 bei 14px gerendert)
- Fünfliber-Detail (48×48 bei 14px gerendert)
- Orientierungssätze (11px)
- Micro-Feedback-Animationen (2× verwendet)

### Vorhanden, aber nicht integriert
- Coin-SVGs 400×400 (im alten Projekt)
- maloja-icons 256×256 (externe Sammlung)
- Hero-Bild (unbekannt)

### Fehlen komplett
- Kuhglocke
- Posthorn
- Wegweiser
- Standalone-Edelweiss
- Passendes Favicon
