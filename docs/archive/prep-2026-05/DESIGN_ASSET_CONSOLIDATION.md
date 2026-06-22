# Design & Asset Consolidation Audit — Maloja Plana

> Stand: 2026-06-07
> Keine Implementierung. Keine Verschiebungen. Nur Inventur.
> Frage: "Wo lebt die Seele von Maloja aktuell?"

---

## 1. Asset-Inventur

### Drei Projektstände

| Projekt | Pfad | Rolle |
|---------|------|-------|
| **ordnung-ruhe** (alt) | `/Projects/ordnung-ruhe/` | Ursprung — Landing, Login, erste Kapitelstruktur |
| **ordnung-ruhe-neu** (aktiv) | `/Projects/ordnung-ruhe-neu/` | Produktivversion — alle Lebensräume, Spiegelungen, Beta |
| **maloja-icons** | `/Projects/maloja-icons/` | Externe Icon-Sammlung — 17 SVG-Dateien + Preview |

---

### A. Assets im aktiven Projekt (ordnung-ruhe-neu)

#### Icons (IconSystem.jsx — inline SVG, ~71 KB)

| Icon | viewBox | Detailgrad | Schweizer Bezug | Verwendet |
|------|---------|-----------|-----------------|-----------|
| `_basis` | 24×24 | Einfach — Person-Silhouette | Nein | **Ja** — Dashboard, MobileNav |
| `_wohnen` | 24×24 | Hoch — Chalet mit Balkon, Geranien, Lüftlmalerei | **Ja** | **Ja** — Dashboard, MobileNav |
| `_finanzen` | **48×48** | Sehr hoch — Fünfliber: Perlrand, Lorbeerkranz, Schild, "5 FR." | **Ja** — Schweizer Münze | **Ja** — Dashboard, MobileNav |
| `_versicherungen` | 24×24 | Mittel — Schild mit Kreuz | Teilweise | **Ja** — Dashboard, MobileNav |
| `_ausbildung` | 24×24 | Einfach — Buch + Stift | Nein | **Ja** — Dashboard, MobileNav |
| `_behoerden` | **48×48** | Sehr hoch — Helvetia: Krone, Speer, Schild, Toga, Chignon | **Ja** — Bundesdesign | **Ja** — Dashboard, MobileNav |
| `_notfall` | 24×24 | Einfach — Kreuz + Herz | Teilweise (CH-Kreuz) | **Ja** — Dashboard, MobileNav |
| `_dokumentTresor` | 24×24 | Mittel — Tresor | Nein | Ja — Tool-Grid |
| `_kalenderUhr` | 24×24 | Mittel — Bahnhofsuhr-inspiriert | **Ja** | Ja — Tool-Grid |
| `_budgetWallet` | 24×24 | Einfach — Portemonnaie | Nein | Ja — Tool-Grid |
| `_schulden` | 24×24 | Einfach — Dokument + Kreuz | Nein | Ja — Tool-Grid |
| `_steuern` | 24×24 | Mittel — QR-Rechnung | **Ja** — CH-Steuersystem | Ja — Tool-Grid |
| `_organspende` | 24×24 | Einfach — Herz + Kreuz | Nein | Ja — Tool-Grid |
| `_chartsSchoko` | 24×24 | Mittel — Toblerone als Balkendiagramm | **Ja** — CH-Humor | Ja — Tool-Grid |
| `_exportTool` | 24×24 | Mittel — Sackmesser-Silhouette | **Ja** — Schweizer Armee | Ja — Tool-Grid |
| `_praemienverbilligung` | 24×24 | Mittel — Schild + Pfeil runter | Teilweise | Ja — Tool-Grid |
| `_mietzinsverbilligung` | 24×24 | Mittel — Haus + Pfeil runter | Teilweise | Ja — Tool-Grid |
| `_sozialhilfe` | 24×24 | Mittel — Zwei Hände tragend | Nein | Ja — Tool-Grid |
| `_lebenslauf` | 24×24 | Mittel — Dokument + Person | Nein | Ja — Tool-Grid |
| 22 weitere Utility-Icons | 24×24 | Einfach | Nein | Teilweise |

**Total: 47 Icons inline, davon 7 mit explizit schweizerischem Charakter.**

#### Bild-Assets

| Datei | Ort | Verwendung |
|-------|-----|-----------|
| `icon-192.png` | public/ | PWA-Icon (App-Icon) |
| `icon-512.png` | public/ | PWA-Icon (Splash) |

#### Dashboard-SVG (inline in Dashboard.jsx)

| Element | Zeilen | Schweizer Bezug |
|---------|--------|-----------------|
| 3-Layer Bergprofil | ~30 | **Ja** — Malojapass-Topografie |
| Trail-Pfad (8 Segmente) | ~15 | **Ja** — Wanderweg |
| Easter Eggs (10 Stufen) | ~70 | **Ja** — Tannen, Edelweiss, Gipfelkreuz, Matterhorn, Kuh, Uhr, Schokolade, Sonne, Fahne |
| Maturity-System (sketch→complete) | ~40 | Metaphorisch — Weg wird begangen |

---

### B. Assets im alten Projekt (ordnung-ruhe)

| Datei | Beschreibung | Qualität | Im Neuen vorhanden? |
|-------|-------------|----------|-------------------|
| `coin-obverse.svg` | Helvetia-Münze (Vorderseite) — 400×400, mit Gradient, Perlrand, Strahlenkrone, Speer, Toga, Schild | **Sehr hoch** — illustrativ, materialreich | **Nein** — nur das 48×48 Piktogramm existiert im Neuen |
| `coin-reverse.svg` | 5-Franken-Münze (Rückseite) — 400×400, mit Gradient, Lorbeerkranz (Blattpaare + Beeren), Wappenschild, "5 FR.", "2026" | **Sehr hoch** — detailliert, münzartig | **Nein** — nur das 48×48 Piktogramm existiert im Neuen |
| `favicon.svg` | Lila Blitz (Bolt/Lightning) — Cursor-Branding | Professionell, aber **passt nicht** zu Maloja | **Nein** — Neues Projekt hat nur PNG-Icons |
| `icons.svg` | Social-Media-Icons (GitHub, Bluesky, Discord, X) | Standard | Nicht relevant für Maloja |
| `hero.png` | 343×361 PNG — vermutlich Landing-Page-Bild | Unbekannt (müsste visuell geprüft werden) | **Nein** |
| `src/main.jsx` | SoftCard-Komponente mit boxShadow + backdropFilter | Besser als Neues | **Nein** — Neues hat keine Schatten |

#### Alte Design-Elemente, die BESSER waren als im Neuen

| Element | Alt | Neu | Verlust |
|---------|-----|-----|---------|
| **Materialität** | SoftCard mit `boxShadow: '0 1px 3px rgba(0,0,0,0.1)'` | Keine Schatten (2 Vorkommen) | Tiefenwirkung verloren |
| **Glassmorphism** | Header mit `backdrop-filter: blur(8px)` + Transparenz | Keine Transparenzen | Nebel-Qualität verloren |
| **Typografie** | Cormorant Garamond als Display-Font + klare Hierarchie (44px→16px→13px→11px) | DM Sans only, 12px dominiert | Charakter verloren |
| **Coin-SVGs** | 400×400 mit Radial-Gradient, Perlrand, Sternenkranz | 48×48 monochrom | Materialität verloren |

---

### C. Assets in maloja-icons (externe Sammlung)

17 SVG-Dateien im Format 256×256, alle mit:
- Warmer Crème-Hintergrund (`#F4F0EA`)
- Abgerundeter Container (`rx="48"`)
- Konsistente Farbpalette: `#C29A63` (Gold), `#5F5A54` (Anthrazit), `#8EAD9F` (Sage), `#D9C49A` (helles Gold)

| Datei | Motiv | Qualität | Im App-IconSystem? |
|-------|-------|----------|-------------------|
| 01-wohnen-leben | Chalet mit Giebeldach, Balkon, Schornstein | **Hoch** | Ja — als `_wohnen` (vereinfacht auf 24×24) |
| 02-finanzen-geld | 5-Franken-Münze | **Gut** | Ja — als `_finanzen` (aufgewertet auf 48×48) |
| 03-versicherungen-vorsorge | **Schild mit Edelweiss** | **Gut** | Teilweise — `_versicherungen` hat Schild + Kreuz, kein Edelweiss |
| 04-behoerden-rechtliches | Helvetia-Figur (abstrahiert) | **Gut** | Ja — als `_behoerden` (massiv detaillierter im 48×48 Neu) |
| 05-notfall | Gerundetes Quadrat mit Kreuz | **Einfach** | Ja — als `_notfall` |
| 06-dokument-tresor | Tresor-Tür mit Rad | **Gut** | Ja — als `_dokumentTresor` (vereinfacht) |
| 07-kalender | **Bahnhofsuhr** (Minutenstriche, Zeiger) | **Hoch** — stark schweizerisch | Ja — als `_kalenderUhr` (vereinfacht) |
| 08-budget | Portemonnaie | **Mittel** | Ja — als `_budgetWallet` |
| 09-schulden | Dokument mit Zeilen | **Mittel** | Ja — als `_schulden` |
| 10-steuern | QR-Rechnung-Dokument | **Gut** — CH-spezifisch | Ja — als `_steuern` |
| 11-organspende | Herz mit Kreuz | **Einfach** | Ja — als `_organspende` |
| 12-charts | **Toblerone als Balkendiagramm** | **Kreativ** — CH-Charakter | Ja — als `_chartsSchoko` |
| 13-export | Sackmesser-Silhouette | **Gut** — CH-Charakter | Ja — als `_exportTool` |
| 14-praemienverbilligung | Schild + heruntergerichteter Pfeil | **Mittel** | Ja — als `_praemienverbilligung` |
| 15-mietzinsverbilligung | Kleines Chalet + Prozentzeichen | **Mittel** | Ja — als `_mietzinsverbilligung` |
| 16-sozialhilfe | Zwei tragende Hände | **Gut** | Ja — als `_sozialhilfe` |
| 17-lebenslauf | Dokument mit Person | **Mittel** | Ja — als `_lebenslauf` |

**Ergebnis:** Alle 17 maloja-icons wurden ins IconSystem übernommen — aber als stark vereinfachte 24×24 Piktogramme. Die 256×256 Originale mit ihren Details und dem warmen Hintergrund existieren nur noch extern.

---

## 2. Alt-vs-Neu Vergleich

### Farben

| Aspekt | Alt (ordnung-ruhe) | Neu (ordnung-ruhe-neu) | Bewertung |
|--------|-------------------|----------------------|-----------|
| Palette | Identisch (gleiche Hex-Werte) | Identisch | Kein Drift |
| Farbverwendung | SoftCard-Grenzen, Transparenzen | `palette.mid` dominiert (156×), `palette.up` (83×) | **Neu flacher** |
| Akzente | Gold für CTAs, Sage für Bestätigungen | Inkonsistent verteilt | **Neu weniger klar** |
| Transparenzen | `99`-Suffix, backdrop-filter | Kaum vorhanden | **Materialität verloren** |

### Typografie

| Aspekt | Alt | Neu | Bewertung |
|--------|-----|-----|-----------|
| Display-Font | Cormorant Garamond (Serif) | DM Sans only | **Alt hatte mehr Charakter** |
| Hierarchie | 44px → 18px → 14px → 12px → 11px | 12px überall, 28px ganz oben | **Neu flacher** |
| Body-Text | 14px | Faktisch 12px (trotz 15px Registry) | **Neu zu klein** |
| Gewicht | Differenziert (400/500/600/700) | 600 dominiert (180/220) | **Neu monotoner** |

### Materialität

| Aspekt | Alt | Neu | Bewertung |
|--------|-----|-----|-----------|
| Schatten | SoftCard: `0 1px 3px rgba(0,0,0,0.1)` | 2 Vorkommen total | **Massiver Verlust** |
| Glassmorphism | Header: `backdrop-filter: blur(8px)` + `99` alpha | Nicht vorhanden | **Verloren** |
| Tiefe | 2 Ebenen (surface → up) klar unterscheidbar | Kaum Unterschied bg/up/surface | **Flacher** |
| Gradients | Coin-SVGs mit `radialGradient` | Nirgends | **Verloren** |

### Karten

| Aspekt | Alt | Neu |
|--------|-----|-----|
| Komponente | `SoftCard` — explizit, wiederverwendbar | Keine Karten-Abstraction |
| Erscheinung | border + shadow + radius + padding | border only, flat |
| Gefühl | Leicht erhöht, greifbar | Flach, nur Rahmen |

### Dashboard

| Aspekt | Alt | Neu |
|--------|-----|-----|
| Struktur | Landing → Login → App (linear) | Malojapass → Chapters (topografisch) |
| Emotion | Landingpage-Charme, aber SaaS-artig | Lebensraum-Gefühl, aber nur oben |
| Schweizer Identität | Nur Palette + Name | Pass, Trail, Easter Eggs, Helvetia, Fünfliber |
| **Gewinner** | — | **Neu — klar besser** |

### Icons

| Aspekt | Alt | Neu |
|--------|-----|-----|
| System | Keine (nur Unicode + coin-SVGs extern) | 47 inline-SVGs, konsistent |
| Schweizer Qualität | coin-obverse.svg (Helvetia): **herausragend**, 400×400, materiell | `_behoerden` (Helvetia): **herausragend**, 48×48, piktografisch |
| Stil | Illustrativ, materialreich (Gradient, Schatten) | Piktografisch, monochrom (currentColor) |
| **Erkenntnis** | Die alten Coins sind **Kunstwerke** | Die neuen Icons sind **Werkzeuge** |

---

## 3. Ungenutzte / kaum sichtbare Design-Elemente

### Im Neuen Projekt vorhanden, aber kaum sichtbar

| Element | Wo definiert | Wo gerendert | Grösse | Sichtbarkeit |
|---------|-------------|-------------|--------|--------------|
| **Helvetia** (vollständig: Krone, Speer, Toga, Chignon, Gesicht) | IconSystem.jsx Z.259-363 | Dashboard: 14–20px | **Zu klein** — Details verschwinden |
| **Fünfliber** (Perlrand, Lorbeerkranz, Schild, "5 FR.") | IconSystem.jsx Z.113-237 | Dashboard: 14–20px | **Zu klein** — Lorbeerkranz unsichtbar |
| **Bahnhofsuhr** | IconSystem.jsx Z.398-426 | Tool-Grid: 16px | **Zu klein** |
| **Toblerone-Chart** | IconSystem.jsx Z.483-500 | Tool-Grid: 16px | **Zu klein** — Schokolade nicht erkennbar |
| **Sackmesser** | IconSystem.jsx Z.501-518 | Tool-Grid: 16px | **Zu klein** |
| **Easter Eggs** (Kuh, Matterhorn, Edelweiss, Uhr, Schokolade) | Dashboard.jsx Z.152-220 | Nur ab 20%+ Fortschritt | Meiste Nutzer sehen sie **nie** (Start = 0%) |
| **Stempel-Animation** (mp-stamp) | tokens.css Z.189 | 1× bei 100% Dashboard | Fast niemand erreicht 100% |
| **Check-Pop** / **Lock-Close** | tokens.css Z.194/199 | 1× in ZipExport | Nur nach Export-Aktion |
| **Maturity-System** (sketch → emerging → maturing → complete) | Dashboard.jsx Z.254-270 | 26–34px Differenz | Subtil — Nutzer bemerken es kaum |
| **Orientierungssätze** (Helvetia Layer) | ChapterView Z.492-513, constants.js | 11px sage mit ○-Prefix | **Fast unlesbar** — wirkt wie Systemhinweis |

### Nie ins Neue übernommen

| Element | Wo es lebt | Was es ist | Warum es fehlt |
|---------|-----------|-----------|---------------|
| **Helvetia-Münze (Obverse)** | ordnung-ruhe/src/assets/coin-obverse.svg | 400×400 Helvetia mit Gradient, Perlrand, Sternenkranz, Toga-Falten | War Landing-Page-Element, keine Funktion im Neuen |
| **Fünfliber (Reverse)** | ordnung-ruhe/src/assets/coin-reverse.svg | 400×400 mit Lorbeerkranz (Blattpaare, Beeren), Wappenschild, Jahrzahl | Dito |
| **Cormorant Garamond** | ordnung-ruhe/src/main.jsx | Serif-Display-Font — gab dem Alten edlen Charakter | Bewusst entfernt zugunsten DM Sans (bessere Lesbarkeit) |
| **SoftCard + backdrop-filter** | ordnung-ruhe/src/main.jsx | Glassmorphism-Header, materielle Karten | Nie migriert |
| **maloja-icons 256×256 Originale** | /Projects/maloja-icons/ | 17 Icons in voller Grösse mit warmem Hintergrund | Nur als vereinfachte 24×24 übernommen |
| **Kuhglocke** | Nur als Konzept-Name | Nie als Icon oder Sound implementiert | Fehlt komplett |
| **Posthorn / Schweizer Post** | Nur als Idee | Nie visuell umgesetzt | Fehlt komplett |
| **Wegweiser (gelbe Schilder)** | Nur als Metapher in Docs | Nie als UI-Element | Fehlt komplett |

---

## 4. Icon-Qualitätsbewertung

### Schweizer Kapitel-Icons (verwendet im Dashboard)

| Icon | Professionell? | Schweizer Charakter | Problem |
|------|---------------|--------------------:|---------|
| **`_behoerden` (Helvetia)** | **Exzellent** — SNB-Noten-Qualität, anatomisch korrekt | ★★★★★ | Wird bei 14–20px gerendert → unsichtbar |
| **`_finanzen` (Fünfliber)** | **Exzellent** — numismatische Genauigkeit | ★★★★★ | Wird bei 14–20px gerendert → grauer Kreis |
| **`_wohnen` (Chalet)** | **Sehr gut** — Balkon, Geranien, Lüftlmalerei | ★★★★ | Bei 24px noch erkennbar |
| **`_notfall` (Kreuz + Herz)** | Solide | ★★★ | Generisch — könnte überall sein |
| **`_versicherungen` (Schild)** | Solide | ★★★ | Generisch — kein CH-spezifisches Detail |
| **`_ausbildung` (Buch)** | Okay | ★★ | Kein Schweizer Bezug |
| **`_basis` (Person)** | Okay | ★ | Komplett generisch |

### Schweizer Tool-Icons

| Icon | Professionell? | Schweizer Charakter | Problem |
|------|---------------|--------------------:|---------|
| **`_kalenderUhr` (Bahnhofsuhr)** | **Gut** — Minutenstriche, Sekundenzeiger | ★★★★ | Bei 16px nicht erkennbar als Bahnhofsuhr |
| **`_chartsSchoko` (Toblerone)** | **Kreativ** — Balkendiagramm als Schokolade | ★★★★ | Bei 16px nur Dreiecke |
| **`_exportTool` (Sackmesser)** | **Gut** — erkennbare Silhouette | ★★★★ | Bei 16px generisch |
| **`_steuern` (QR-Rechnung)** | **Gut** — CH-spezifisch | ★★★ | Detail reicht bei 24px |
| **`_praemienverbilligung`** | Mittel | ★★ | Schild + Pfeil — zu abstrakt |
| **`_mietzinsverbilligung`** | Mittel | ★★ | Haus + Pfeil — generisch |
| **`_sozialhilfe`** | Mittel | ★★ | Hände — kein CH-Bezug |

### Externe Icon-Versionen (maloja-icons 256×256)

| Icon | Professionell? | Verglichen mit App-Version |
|------|---------------|--------------------------|
| **03-versicherungen (Schild + Edelweiss)** | **Besser als App** — Edelweiss gibt CH-Charakter | App-Version hat nur Kreuz, kein Edelweiss |
| **07-kalender (Bahnhofsuhr)** | **Besser als App** — Details sichtbar bei 256px | App-Version bei 24px verliert Minutenstriche |
| **04-behoerden (Helvetia)** | Schwächer als App — abstrahierter | App-Version (48×48) ist detaillierter und besser |
| **01-wohnen (Chalet)** | Ähnlich wie App | Beide gut |

### Alte Coin-SVGs (400×400)

| Datei | Professionell? | Vergleich zum Neuen |
|-------|---------------|-------------------|
| **coin-obverse.svg (Helvetia)** | **Herausragend** — numismatisch, materiell, Gradient | **Anderer Stil** — illustrativ vs. piktografisch |
| **coin-reverse.svg (5 FR.)** | **Herausragend** — Lorbeerkranz mit individuellen Blättern + Beeren | **Anderer Stil** — illustrativ vs. piktografisch |

### Icons, die fehlen oder ersetzt werden sollten

| Bedarf | Aktuell | Empfehlung |
|--------|---------|-----------|
| **Kuhglocke** | Existiert nicht | Fehlt — wäre starkes CH-Symbol für Benachrichtigungen/Erinnerungen |
| **Posthorn** | Existiert nicht | Fehlt — wäre starkes CH-Symbol für Kommunikation/Briefe/Export |
| **Edelweiss** (standalone) | Nur als Easter Egg (2 Kreise) im Dashboard-SVG | Zu simpel — bräuchte eigenständiges Icon |
| **Versicherungs-Schild** | `_versicherungen`: Schild + Kreuz | Schwach — maloja-icons/03 hat Edelweiss im Schild, das ist besser |
| **Wegweiser** | Existiert nicht | Fehlt — wäre ideal für Orientierungsschicht |

---

## 5. Empfehlungen

### Wo die Seele von Maloja aktuell lebt

| Seelenelement | Wo? |
|--------------|-----|
| **Topografische Identität** | Dashboard.jsx — Malojapass-SVG |
| **Schweizer Handwerkskunst** | IconSystem.jsx — Helvetia + Fünfliber (bei 48×48) |
| **Emotionaler Fortschritt** | Dashboard.jsx — Easter Eggs + Maturity |
| **Farbseele** | config/constants.js — Palette warm und korrekt |
| **Ungenutzte Schätze** | ordnung-ruhe/coin-*.svg — materialreiche Illustrationen |
| **Originale Grösse** | maloja-icons/ — 17 Icons in voller Pracht |

### Was verloren ging beim Übergang alt → neu

1. **Materialität** — SoftCard, Schatten, backdrop-filter
2. **Typografischer Charakter** — Cormorant Garamond als Kontrapunkt
3. **Coin-Illustrationen** — 400×400 Meisterwerke, nirgends eingesetzt
4. **Icon-Grösse** — 256×256 → 24×24 (90% Detailverlust)
5. **Transparenz/Nebel** — `99`-Alpha, blur → komplett weg

### Was das Neue besser macht

1. **Malojapass** — emotional, einzigartig, funktional
2. **Systematische Icons** — konsistent, a11y-korrekt, 47 Stück
3. **Tier-System** — klare Lebensraum-Hierarchie
4. **Orientierungsschicht** — existiert (wenn auch zu klein)
5. **Beta-Infrastruktur** — Gate, Feedback, Legal

### Konsolidierungs-Empfehlungen (keine Priorisierung)

| # | Empfehlung | Was | Risiko |
|---|-----------|-----|--------|
| 1 | **Coin-SVGs als Hero-Elemente nutzen** | Die 400×400 Helvetia/Fünfliber könnten Kapitel-Header zieren | Stilbruch (illustrativ vs. piktografisch) |
| 2 | **maloja-icons als Kapitel-Intros** | 256×256 Originale bei Kapitel-Eintritt zeigen (statt nur 24px) | Ladezeit (+17 SVGs) |
| 3 | **Edelweiss-Schild für Versicherungen** | maloja-icons/03 statt aktuellem Kreuz-Schild | Kleiner Aufwand |
| 4 | **SoftCard zurückholen** | Schatten + border aus altem Projekt übernehmen | Minimales Risiko |
| 5 | **backdrop-filter für Header** | Glassmorphism-Effekt (Nebel-Metapher) | Performance (gering) |
| 6 | **Kuhglocke + Posthorn erstellen** | Fehlende CH-Symbole ergänzen | Design-Aufwand |
| 7 | **Wegweiser-Icon für Orientierung** | Gelbes CH-Wanderschild als Orientierungs-Symbol | Design-Aufwand |
| 8 | **Icons grösser darstellen** | Mindestens 32px für Kapitel-Icons, 24px für Tools | Layout-Anpassung |
| 9 | **Altes Favicon ersetzen** | Lila Blitz → etwas Schweizerisches (Edelweiss? Mini-Pass?) | Branding-Entscheidung |
| 10 | **maloja-icons/ ins Repo integrieren** | Externe Sammlung als `/assets/icons-full/` einbinden | Ordnung |

### Was NICHT konsolidiert werden sollte

- **Cormorant Garamond** nicht zurückholen — DM Sans ist die richtige Entscheidung für die Zielgruppe (Lesbarkeit > Charakter)
- **Altes Routing/Login** nicht übernehmen — neues System ist besser
- **Landing Page** nicht zurückholen — Maloja braucht keine Marketing-Seite (geschlossene Beta)
- **Social Icons** (GitHub, Bluesky) nicht übernehmen — irrelevant

---

## Zusammenfassung

Die Seele von Maloja lebt an **drei Orten gleichzeitig**:

1. **Im Dashboard** des neuen Projekts — Malojapass, Trail, Easter Eggs
2. **Im IconSystem** des neuen Projekts — Helvetia und Fünfliber (aber zu klein gerendert)
3. **In den alten Coin-SVGs** und den **maloja-icons Originalen** — materialreich, gross, ungenutzt

Das grösste Problem ist nicht, dass Assets fehlen.
Das Problem ist: **Die besten Assets werden zu klein gezeigt.**

Die Helvetia ist 104 Zeilen Code — gerendert bei 14px.
Der Fünfliber hat einen Lorbeerkranz mit individuellen Blättern und Beeren — gerendert als grauer Punkt.
Die maloja-icons sind 256×256 Kunstwerke — reduziert auf 24×24 Strichzeichnungen.

Die Konsolidierung muss nicht neue Assets schaffen.
Sie muss den existierenden Assets **Raum geben**.
