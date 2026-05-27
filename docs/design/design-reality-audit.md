# A-030 — Design Reality Audit

> Registry vs. Realität. Beobachtung, nicht Redesign.
> Stand: 2026-05-26

---

## 1. Farbsystem Audit

### Registry definiert
| Token | Hex | Semantik |
|-------|-----|----------|
| `bg` | `#F5F2EE` | Warmes Papier |
| `surface` | `#FFFFFF` | Karten |
| `up` | `#F0EDE8` | Erhöhte Flächen |
| `top` | `#EAE5DD` | Höchste Ebene |
| `gold` | `#C9A96E` | Wert, CTAs |
| `sage` | `#7B9E8C` | Erfolg, Natur |
| `rose` | `#B87070` | Wärme, Warnung |
| `sky` | `#6E90B0` | Information |
| `sand` | `#B8956A` | Navigation, Interaktion |

### Tatsächliche Nutzung (gemessen)
| Palette-Token | Vorkommen als `color:` | Vorkommen als `background:` |
|---------------|----------------------|---------------------------|
| `palette.mid` | **156** | — |
| `palette.text` | 41 | — |
| `palette.sage` | 23 | 9 |
| `palette.rose` | 20 | 7 |
| `palette.gold` | 13 | 9 |
| `palette.sand` | 8 | 10 |
| `palette.sky` | 5 | 2 |
| `palette.soft` | 5 | — |
| `palette.up` | 14 | **83** |
| `palette.surface` | 8 | 42 |
| `palette.border` | 18 | 3 |
| `palette.bg` | 1 | 4 |

### Befunde

**B1 — `palette.mid` Dominanz:** 156 `color: palette.mid` Vorkommen. Der Grossteil aller UI-Texte (Labels, Hints, Beschreibungen, Timestamps, Buttons) ist `mid` (#6B6560). Die Plattform wirkt dadurch monoton grau — es fehlt Farbtemperatur und emotionale Abstufung.

**B2 — `palette.up` Flächendominanz:** 83 `background: palette.up` Vorkommen. Fast alle Hintergrundfl fächen nutzen `up` (#F0EDE8) — ein warmer, aber sehr ähnlicher Ton zu `bg` (#F5F2EE). Das erzeugt den „alles ist beige"-Effekt. Die Farbhierarchie `bg → up → surface` ist subtil bis unsichtbar.

**B3 — `top` nicht verwendet:** `palette.top` (#EAE5DD) ist definiert aber taucht in keiner Komponente auf. Die vierte Tiefenebene fehlt komplett.

**B4 — Akzentfarben zu selten:** `sky` (5 Vorkommen), `gold` (13), `sand` (8 als Farbe) sind zu zurückhaltend eingesetzt. Die UI nutzt kaum die Alpine Farbwelt für Akzentuierung und Orientierung.

**B5 — Keine semantische Farbverwendung:** Akzentfarben werden nicht konsistent semantisch eingesetzt. `sage` erscheint manchmal für Erfolg, manchmal als generische Akzentfarbe. `rose` für Fehler und als generischer Akzent. Es fehlt eine klare „Sage = Erfolg/Bestätigung, Rose = sanfte Warnung, Gold = Wert/CTA, Sky = Information"-Systematik in der Praxis.

**B6 — Keine Farbverläufe/Transparenzen:** Die Registry beschreibt „Nebel — Transparenzen, weiche Übergänge" als Material-Referenz. In der Implementierung gibt es keine Transparenzen, Gradients oder weiche Farbübergänge — alles sind flache, solide Farben (ausser einige `+ '22'` Hex-Suffix-Transparenzen).

### Bewertung
| Aspekt | Status |
|--------|--------|
| Palette definiert und implementiert | Ja |
| Palette konsistent verwendet | **Nein** — mid-Dominanz, up-Monotonie |
| Akzentfarben semantisch zugeordnet | **Teilweise** — inkonsistent |
| Emotionale Temperatur | **Zu neutral** — fehlt Wärme und Tiefe |
| Schweizer Materialität | **Kaum spürbar** — keine Nebel/Holz/Stein-Qualität |
| Visuelle Orientierung durch Farbe | **Schwach** — keine Farbcodierung der Kapitel/Tiers |

---

## 2. Typografie Audit

### Registry definiert
- DM Sans, 400/500/600/700
- 7-stufige Skala: 11/13/15/18/22/28/36px
- 3 Zeilenhöhen: 1.2/1.5/1.7
- CSS-Tokens: `--mp-text-*`, `--mp-weight-*`, `--mp-leading-*`

### Tatsächliche Nutzung (gemessen)
| Grösse | Registry-Name | Vorkommen | Soll-Verwendung |
|--------|--------------|-----------|-----------------|
| 10px | — | **37** | Nicht definiert |
| 11px | `xs` | 86 | Legal, Fussnoten |
| 12px | `sm` | **114** | Labels, Tags |
| 13px | `sm`+ | 40 | — |
| 14px | — | **26** | Nicht definiert |
| 15px | `body` | **3** | Fliesstext (!) |
| 16px | — | 11 | Nicht definiert |
| 18px | `lg` | 28 | Unterüberschriften |
| 20px | — | 14 | Nicht definiert |
| 22px | `xl` | 0 | Kapitelüberschriften |
| 24px | — | 1 | Nicht definiert |
| 28px | `2xl` | 1 | Seitenüberschriften |
| 32px | — | 2 | Nicht definiert |
| 36px | `3xl` | 1 | Dashboard Hero |

| Gewicht | Vorkommen |
|---------|-----------|
| 600 | **180** |
| 500 | 26 |
| 700 | 11 |
| bold | 4 |
| 400 | 0 (nur implizit) |

### Befunde

**B7 — Skala wird ignoriert:** Die definierte 7-Stufen-Skala ist in der Praxis nicht im Einsatz. `10px`, `14px`, `16px`, `20px` werden häufig verwendet, existieren aber nicht im Token-System. Die Typografie driftet frei.

**B8 — Body-Grösse fast nicht genutzt:** `15px` (der definierte Body-Text) wird nur **3 Mal** verwendet. Der faktische „Body" der App ist `12px` (114 Vorkommen). Das ist zu klein für angenehmes Lesen und widerspricht dem Calm-UX-Prinzip.

**B9 — fontWeight 600 Überdominanz:** 180 von ~220 Gewichtszuweisungen sind `600`. Alles fühlt sich gleich wichtig an — es fehlt typografische Hierarchie. Normal (400) wird gar nicht explizit gesetzt, Medium (500) kaum.

**B10 — CSS-Tokens nicht in JSX:** Die CSS Custom Properties (`var(--mp-text-*)`) werden in **0** JSX-Dateien genutzt. Alle Grössen sind hardcoded in Inline-Styles. Die Tokens existieren nur in `tokens.css`, werden aber von keiner Komponente referenziert.

**B11 — Zeilenhöhen inkonsistent:** Die definierten Zeilenhöhen (`1.2`, `1.5`, `1.7`) tauchen vereinzelt auf, aber viele Elemente haben gar keine `lineHeight`. Gemischte Werte (`1.4`, `1.6`) sind ebenfalls im Einsatz.

**B12 — Kein Editorial-Feeling:** Die Typografie-Registry beschreibt ein „Magazin-Charakter" mit klarer Hierarchie. In der Praxis dominiert `12px/600` — das wirkt eher wie ein kompaktes Admin-Panel als ein Editorial-Layout.

### Bewertung
| Aspekt | Status |
|--------|--------|
| DM Sans geladen und aktiv | Ja |
| Token-Skala implementiert | Ja (in CSS) |
| Token-Skala genutzt | **Nein** — 0 Referenzen in JSX |
| Grössenverteilung balanciert | **Nein** — 12px dominiert |
| Gewichte hierarchisch | **Nein** — 600 dominiert |
| Editorial-Feeling | **Nein** — zu dicht, zu klein, zu gleichförmig |

---

## 3. Materialität & Atmosphäre Audit

### Registry definiert
- Papier, Stein, Holz, Nebel, Alpenwiese als Material-Referenzen
- Schatten: 4 Stufen (sm/md/lg/xl), bewusst dezent
- Radien: 6/10/16/24/9999px
- Spacing: 4px Basisraster, 8 Stufen

### Tatsächliche Nutzung

**Schatten:**
| Typ | Vorkommen in JSX |
|-----|-----------------|
| `boxShadow` | **2** (nur Dashboard, maturity-basiert) |
| CSS `--mp-shadow-*` | 0 Referenzen in JSX |

**Radien (gemessen):**
| Radius | Vorkommen | Registry-Äquivalent |
|--------|-----------|-------------------|
| 6px | **116** | `sm` |
| 8px | 49 | — (nicht definiert) |
| 4px | 18 | — (nicht definiert) |
| 3px | 6 | — (nicht definiert) |
| 10px | 4 | `md` |
| 12px | 3 | — (nicht definiert) |
| 16px | 1 | `lg` |

**Spacing:**
- `gap`: 8px (55x), 12px (15x), 6px (10x), 10px (5x), 5px (1x)
- `padding`: 12px (60x), 10px (37x), 20px (32x), 8px (31x), 16px (30x)
- Viele Off-Grid-Werte: 5px, 6px, 10px, 14px — nicht auf 4px-Raster

### Befunde

**B13 — Schatten fehlen fast komplett:** Nur 2 `boxShadow`-Verwendungen im gesamten Projekt. Die Registry definiert 4 sorgfältig abgestufte Schatten — sie werden nicht eingesetzt. Alle Karten, Panels, Modale sind flat. Es fehlt jede Tiefenwirkung.

**B14 — Radien driften:** `6px` dominiert (116x), aber `8px` (49x) und `4px` (18x) sind ebenfalls häufig — keines davon ist im Token-System. Die Registry-Werte `md` (10px), `lg` (16px), `xl` (24px) werden kaum genutzt.

**B15 — Spacing nicht auf Raster:** Viele Werte (5px, 6px, 10px, 14px) fallen nicht auf das definierte 4px-Raster. Das erzeugt subtile visuelle Unruhe.

**B16 — Kein Atemraum:** Die Registry definiert `--mp-space-2xl` (48px) und `--mp-space-3xl` (64px) für grosse Trennungen. In der Praxis werden max `40px` verwendet. Es fehlt der grosszügige Weissraum, der ein Editorial-Layout ausmacht.

**B17 — Keine Materialität spürbar:** Es gibt keine Texturen, keine subtilen Gradients, keine Transparenzen, keine Hintergrundmuster — nichts, was an Papier, Stein oder Holz erinnert. Die Oberflächen sind rein flach und uniform.

### Bewertung
| Aspekt | Status |
|--------|--------|
| Fühlt sich an wie ein Raum | **Nein** — flach und dicht |
| Tiefenwirkung | **Fehlt** — keine Schatten |
| Atemraum | **Zu wenig** — Spacing zu kompakt |
| Materialreferenzen | **Nicht spürbar** |
| Kanten/Radien konsistent | **Nein** — 6/8/4px gemischt |
| Weich und warm | **Teilweise** — Farben warm, aber Oberflächen technisch |

---

## 4. Icon & Symbolik Audit

### Registry definiert
- 40 SVG Pictogramme in `IconSystem.jsx`
- Konsistente Linienstärke, fein
- Stil: Piktogrammatisch, Schweizer Grafik
- `currentColor` für Theme-Kompatibilität
- `aria-hidden="true"` automatisch

### Befunde

**B18 — Icons hochwertig implementiert:** Die SVG-Icons (z.B. `_wohnen` mit Chalet-Detail: Balkon, Geranien, Lüftlmalerei-Andeutung) sind sorgfältig gestaltet und tragen Schweizer Charakter. Die `Icon`-Komponente mit `aria-hidden` und `focusable="false"` ist korrekt.

**B19 — Icons oft zu klein dargestellt:** In Listen und Sub-Views werden Icons bei `16px`-`18px` gerendert. Die aufwendigen Details (Balkongeländer, Rauchfaden, Blumenkästen) verschwinden bei dieser Grösse. Die Handwerksqualität geht visuell verloren.

**B20 — Unicode-Prefixe neben SVGs:** ~80 Buttons verwenden noch Unicode-Zeichen (✓, ✕, □, ○, ◰) als visuelle Marker neben dem SVG-System. Das erzeugt eine stilistische Inkonsistenz — die Unicode-Zeichen wirken systemisch anders als die handgezeichneten Pictogramme.

**B21 — Kapitel-Icons im Dashboard gut integriert:** Die 7 Kapitel-Icons auf dem Malojapass-Trail sind mit Maturity-Stufen (sketch → emerging → maturing → complete) gut durchdacht. Die Grössenänderung (26→34px) und die Übergangseffekte sind stimmig.

### Bewertung
| Aspekt | Status |
|--------|--------|
| Qualität der Icons | **Hoch** — Schweizer Charakter |
| Konsistenz der Verwendung | **Gemischt** — SVGs + Unicode parallel |
| Angemessene Grösse | **Oft zu klein** |
| Calm UX Unterstützung | **Ja** — dezent, nicht dominant |
| Emotionale Kohärenz | **Ja** — bei ausreichender Grösse |

---

## 5. Dashboard Atmosphere Audit

### Registry definiert
- Editorial, nicht SaaS
- Offene Register-Zeilen, keine Kartengitter
- Malojapass-Anker als topographischer Fixpunkt
- Tier-System: Core / Supporting / Protective
- Keine Badges, keine Zähler

### Befunde

**B22 — Malojapass-Visualisierung ist der stärkste emotionale Anker:** Der 3-Layer-SVG mit progressiven Easter Eggs (Tannen → Edelweiss → Gipfelkreuz → Matterhorn → Kuh → Uhr → Schokolade → Sonne → Fahne) ist emotional überzeugend und einzigartig. Das ist das Herzstück der visuellen Identität.

**B23 — Tier-System implementiert:** Die 3 Tiers (Core/Supporting/Protective) sind umgesetzt mit subtilen Label-Separatoren. Die offenen Register-Zeilen mit `borderBottom` folgen dem Editorial-Prinzip.

**B24 — Zu kompakte Kapitelzeilen:** Trotz Editorial-Anspruch sind die Kapitelzeilen mit `padding: '20px 4px'` relativ dicht. Der Schriftblock (15px Titel + 12px Beschreibung) hat wenig Luft. Es fehlt der „Magazin-Atemraum".

**B25 — Welcome-Bereich zu klein:** Die Willkommenszeile (`28px/700` Titel + `15px` Tagline) ist angemessen dimensioniert, hat aber mit `marginBottom: '0'` zu wenig Trennung zum Pass-SVG. Der emotionale Einstieg wirkt etwas gedrängt.

**B26 — Guided Start wirkt formelhaft:** Die „Guided Start"-Karte für neue Nutzer nutzt 13px/600 für den Titel und 13px für den Text — das fühlt sich wie ein Systemhinweis an, nicht wie eine einladende Begrüssung.

**B27 — Progress-Section ist calm:** Die dünne Progress-Bar (3px) mit den weichen Übergangstexten ist gut gelöst. Die kontextabhängigen Motivationstexte (Start → Early → Mid → Late → Complete) sind ein Pluspunkt.

### Bewertung
| Aspekt | Status |
|--------|--------|
| Lebensraum-Gefühl | **Ansatzweise** — Pass-SVG ja, Rest noch zu dicht |
| Editorial Feeling | **Teilweise** — offene Zeilen ja, aber zu kompakt |
| Emotionale Temperatur | **Warm bei Pass, neutral beim Rest** |
| Scrollgefühl | **Okay** — könnte luftiger sein |
| Visuelle Dichte | **Etwas zu hoch** |
| Mentale Orientierung | **Gut** — Tiers helfen |

---

## 6. Emotional Temperature Map

### Methodik
Jeder Screen wird bewertet nach:
- **Wärme** (warm ↔ kalt)
- **Dichte** (luftig ↔ gedrängt)
- **Tonalität** (einladend ↔ administrativ)
- **Vertrauen** (beruhigend ↔ verunsichernd)

### Screen-Bewertungen

| Screen | Wärme | Dichte | Tonalität | Vertrauen | Gesamt |
|--------|-------|--------|-----------|-----------|--------|
| **Dashboard** | warm | mittel | einladend | beruhigend | **Gut** |
| **ChapterView** (Basis) | neutral | gedrängt | formular-artig | neutral | Mittel |
| **ChapterView** (Finanzen) | neutral | gedrängt | administrativ | neutral | **Kritisch** |
| **SozialhilfeView** | kühl | dicht | administrativ | **verunsichernd** | **Kritisch** |
| **SchuldenManager** | kühl | dicht | administrativ | **belastend** | **Kritisch** |
| **TaxCalculator** | kühl | dicht | technisch | neutral | **Kritisch** |
| **PremiumSubsidy** | neutral | dicht | administrativ | neutral | Mittel |
| **DocumentTresor** | neutral | mittel | nützlich | neutral | Mittel |
| **CVGenerator** | neutral | mittel | nützlich | positiv | Okay |
| **KKScanner** | neutral | dicht | technisch | neutral | Mittel |
| **OrganDonation** | neutral | mittel | **emotional schwer** | neutral | Mittel |
| **MobileNav** | warm | gut | ruhig | gut | **Gut** |
| **Onboarding** | warm | gut | einladend | gut | **Gut** |

### Kritische Emotionale Befunde

**B28 — SozialhilfeView wirkt bürokratisch:** Die View zeigt SKOS-Berechnungen, Defizite, Betreibungsregister in 12px-Zeilen mit `borderBottom`-Separatoren. Für Menschen in finanzieller Not ist das emotional belastend. Die Unicode-Symbole (○, ◰, ✓, ✕) verstärken den Formulardruck.

**B29 — SchuldenManager fehlt Empathie:** Schulden, Betreibungen, Verlustscheine — alles in gleicher technischer Darstellung. Kein empathischer Kontext, kein Hinweis auf Beratungsstellen, kein „Du bist nicht allein"-Gefühl. Die 12px-Schrift und die dichten Listenzeilen wirken wie ein Inkassosystem.

**B30 — TaxCalculator zu technisch:** Input-Labels in 12px, keine Erklärungen, keine Kontextualisierung. Schweizer Steuerlogik ohne Orientierungshilfe.

**B31 — Alle „schweren" Kapitel (Finanzen, Versicherungen, Behörden) haben die gleiche visuelle Behandlung wie leichte Kapitel.** Es fehlt die in der Registry definierte emotionale Differenzierung nach Gewicht und Frequenz.

---

## 7. Zusammenfassung — Registry ↔ Realität Drift

### Drift-Übersicht

| Registry-Versprechen | Realität | Drift |
|---------------------|----------|-------|
| 7-stufige Typoskala | Freie Grössen, 12px dominiert | **Hoch** |
| CSS-Tokens in Komponenten | 0 Referenzen in JSX | **Kritisch** |
| 4px Spacing-Raster | Viele Off-Grid-Werte | **Mittel** |
| 4 Schatten-Stufen | 2 Vorkommen total | **Kritisch** |
| 5 Radius-Stufen | 6px dominiert, Off-Token-Werte | **Mittel** |
| Materialität (Papier/Stein/Nebel) | Flache, solide Oberflächen | **Hoch** |
| Editorial Layout | Kompaktes Admin-Panel-Feeling | **Hoch** |
| Emotionale Differenzierung | Gleichförmige Behandlung | **Hoch** |
| Akzentfarben semantisch | Inkonsistente Verwendung | **Mittel** |
| Malojapass-Erlebnis | Stark umgesetzt | **Kein Drift** |
| Icon-Qualität | Hoch, aber oft zu klein | **Gering** |
| Anti-Gamification | Korrekt, keine Badges/Scores | **Kein Drift** |
| Accessibility | Focus-Ring, Skip-Link, ARIA | **Kein Drift** |
| DM Sans, lokal gehostet | Korrekt implementiert | **Kein Drift** |

### Top-5-Handlungsfelder (priorisiert)

1. **Typografische Hierarchie herstellen** — von 12px-Monotonie zu klarer Skala (Body 15px, bessere Gewichtung)
2. **Schatten und Tiefenwirkung einführen** — die definierten 4 Stufen in Karten/Panels nutzen
3. **Farbhierarchie differenzieren** — weg von up-Beige-Monotonie, Akzentfarben semantisch einsetzen
4. **Atemraum schaffen** — mehr Weissraum, grössere Abstände zwischen Sektionen
5. **Emotionale Temperatur differenzieren** — schwere Kapitel (Schulden, Sozialhilfe, Behörden) brauchen eigene, empathische Behandlung

### Was bereits gut funktioniert

- Malojapass-SVG mit Easter Eggs
- Tier-System im Dashboard
- Icon-Design (Schweizer Charakter)
- Mobile Navigation
- DM Sans + Focus-Ring
- Anti-Gamification-Prinzip
- Progress-Kommunikation
- Palette-Farbauswahl (warm, geerdet)

---

> Nächster Schritt: Gezielte Consolidation auf Basis dieser Befunde.
> Kein impulsives Redesign. Systematisches Alignment von Registry und Realität.
