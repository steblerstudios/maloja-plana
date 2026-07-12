# Maloja Plana — Design Language Registry

> Zentrales Verzeichnis der visuellen Identität, UX-Philosophie und Designsprache.
> Dieses Dokument ist Teil der Produktidentität und darf nicht verloren gehen.

Stand: 2026-07-12 · Palette + Schrift auf den echten Code-Stand korrigiert (Ent-Drift Schritt 1a, Quelle `src/config/constants.js` + `src/tokens.css`). Der tiefere Token↔JSX-Drift (Inline-Styles referenzieren die `--mp-*`-Tokens kaum) bleibt bewusst separat — siehe `docs/design/ui-registry-drift.md` (A-030).

---

## 1. Grundphilosophie

### 1.1 Leitgedanke
**"Ein Ort, kein Dashboard."**

Maloja Plana fühlt sich an wie ein ruhiger, vertrauter Ort — nicht wie ein SaaS-Tool. Die Gestaltung folgt der Metapher eines Schweizer Bergpasses: ein Weg, den man Schritt für Schritt geht, mit klaren Stationen und weiter Sicht.

### 1.2 Designprinzipien
| Prinzip | Bedeutung | Gegenbeispiel |
|---------|-----------|---------------|
| Visuelle Ruhe | Keine visuelle Überflutung, grosszügiger Weissraum | Blinkende Badges, rote Zähler |
| Materielle Ehrlichkeit | Oberflächen fühlen sich real an — Papier, Stein, Holz | Glossy Buttons, Neon-Gradienten |
| Emotionale Sicherheit | Farben und Formen beruhigen, statt zu alarmieren | Rot/Grün-Ampelsysteme, Warnbanner |
| Reduzierte Dichte | Wenige Elemente pro Bildschirm, klare Hierarchie | Dashboard-Overload, Daten-Tabellen |
| Zeitlose Ästhetik | Helvetica-Geist, Schweizer Grafik-Tradition | Trend-Designs, Mode-Animationen |
| Anti-Gamification | Keine Punkte, Streaks, Badges, Leaderboards | Duolingo-Mechaniken |

### 1.3 Was ERLAUBT ist (vs. Anti-Gamification)
- Satisfying State Changes (sanftes Füllen, Stempel-Effekt)
- Micro-Feedback (Häkchen-Pop, Schloss-Animation)
- Fortschrittsvisualisierung (wie viel ist erfasst)
- Visuelle Freude und Delight
- NICHT erlaubt: XP, Scores, Rivalen, Streaks, Completion-Druck

---

## 2. Farbsystem

### 2.1 Palette — Warm, Geerdet, Schweizerisch

#### Light Mode
| Token | Hex | Verwendung |
|-------|-----|------------|
| `bg` | `#F2F2F0` | Haupthintergrund — warmes Papier |
| `surface` | `#FAFAF8` | Karten, erhöhte Flächen |
| `up` | `#ECECEA` | Leicht erhöhte Bereiche |
| `top` | `#E4E4E2` | Höchste visuelle Ebene |
| `border` | `#DCDAD6` | Rahmen, Separatoren |
| `text` | `#24262A` | Haupttext — fast schwarz, leicht kühl |
| `mid` | `#6A6E74` | Sekundärtext, Labels |
| `soft` | `#64676E` | Deaktivierte Elemente, Hints |

#### Dark Mode
| Token | Hex | Verwendung |
|-------|-----|------------|
| `bg` | `#22211F` | Haupthintergrund — dunkler Stein |
| `surface` | `#2B2A26` | Karten, Panels |
| `up` | `#343330` | Erhöhte Flächen |
| `top` | `#3D3B35` | Höchste Ebene |
| `border` | `#423F39` | Rahmen |
| `text` | `#E6E3DC` | Haupttext — warmes Crème |
| `mid` | `#9CA0A6` | Sekundärtext |
| `soft` | `#8E929A` | Deaktiviert |

#### Akzentfarben
| Token | Hex (Light) | Semantik | Verwendung |
|-------|-----|----------|------------|
| `gold` | `#C4A870` | Wert, Qualität | Akzente, CTAs, Highlights |
| `sage` | `#5A7868` | Natur, Beruhigung | Erfolg, positive Zustände |
| `rose` | `#B87070` | Wärme, Aufmerksamkeit | Sanfte Warnungen |
| `sky` | `#6E90B0` | Himmel, Information | Links, Quellenangaben, Info-Hinweise, Versicherungen-Akzent |
| `sand` | `#C4A06A` | Erde, Navigation | Focus-Ringe, Navigation, Interaktion |

> **Modus-Anpassung (Kontrast/AA):** Im Dark Mode wird `sage` auf `#7E9F8C` angehoben. Für lesbaren Text/Graphik auf hellen Flächen gibt es *Deep*-Varianten: `goldDeep #7C6428`, `sandDeep #8A6D3B`, `skyDeep #4A6A88`, `roseDeep #9A4A4A`, `sageDeep #4A6657` (im Dark Mode entsprechend aufgehellt). Quelle der Wahrheit: `src/config/constants.js`.

### 2.2 Farbregeln
- **Keine gesättigten Primärfarben** — kein reines Rot, Blau, Grün
- **Keine aggressiven Signalfarben** — keine Rot/Grün-Ampeln
- **Warme, natürliche Töne** — inspiriert von Alpenlandschaft
- **Focus-Ring:** 2px solid `#C4A06A` (Sand), offset 2px
- **Selektion:** `rgba(196, 160, 106, 0.3)` (Sand, transparent)

---

## 3. Typografie

### 3.1 Schriftfamilie
Drei lokal gehostete WOFF2-Familien (kein CDN, alle OFL). Quelle: `src/tokens.css`.

| Familie | Rolle | Gewichte |
|---------|-------|----------|
| **Lexend** | Primär — Fliesstext, UI, Eingaben | 400 / 500 / 600 / 700 |
| **Hanken Grotesk** | Headlines & Wortmarke (Display) | 600 / 700 |
| **Atkinson Hyperlegible** | Lesbarkeits-Modus (a11y-Toggle, ersetzt alles) | 400 / 700 |

Warum diese Wahl:
- **Lexend** ist auf Leseflüssigkeit optimiert, ruhig und humanistisch — die tägliche Lesefläche.
- **Hanken Grotesk** gibt Titeln und der Wortmarke Schweizer-grotesken Charakter, ohne laut zu werden.
- **Atkinson Hyperlegible** (Braille Institute) für den Lesbarkeits-Modus — maximale Zeichenunterscheidung.
- Alle frei nutzbar (SIL Open Font License), Latin Extended für FR/IT/RM.

### 3.2 Gewichte
| Gewicht | CSS Variable | Verwendung |
|---------|-------------|------------|
| 400 | `--mp-weight-normal` | Fliesstext, Eingabefelder |
| 500 | `--mp-weight-medium` | Labels, Sekundär-Überschriften |
| 600 | `--mp-weight-semi` | Kapitelüberschriften, Buttons |
| 700 | `--mp-weight-bold` | Hervorhebungen (sparsam) |

### 3.3 Grössenskala
| Stufe | CSS Variable | Pixel | Verwendung |
|-------|-------------|-------|------------|
| xs | `--mp-text-xs` | 13px | Legal Disclaimer, Fussnoten |
| sm | `--mp-text-sm` | 15px | Labels, Hilfstext, Tags |
| body | `--mp-text-body` | 16px | Fliesstext, Eingabefelder |
| lg | `--mp-text-lg` | 19px | Unterüberschriften, Sektionsnamen |
| xl | `--mp-text-xl` | 23px | Kapitelüberschriften |
| 2xl | `--mp-text-2xl` | 28px | Seitenüberschriften |
| 3xl | `--mp-text-3xl` | 36px | Dashboard-Titel, Hero |

### 3.4 Zeilenhöhen
| Stufe | CSS Variable | Wert | Verwendung |
|-------|-------------|------|------------|
| tight | `--mp-leading-tight` | 1.2 | Überschriften, kompakte Labels |
| normal | `--mp-leading-normal` | 1.5 | Fliesstext, Beschreibungen |
| relaxed | `--mp-leading-relaxed` | 1.7 | Lesetext, lange Erklärungen |

---

## 4. Spacing & Layout

### 4.1 Raster
**4px Basisraster** — alle Abstände sind Vielfache von 4px.

| Stufe | CSS Variable | Pixel | Verwendung |
|-------|-------------|-------|------------|
| 2xs | `--mp-space-2xs` | 2px | Micro-Abstände, Icon-Padding |
| xs | `--mp-space-xs` | 4px | Inline-Elemente, Badge-Innen |
| sm | `--mp-space-sm` | 8px | Innerhalb von Gruppen |
| md | `--mp-space-md` | 16px | Standard-Abstand, Feldgruppen |
| lg | `--mp-space-lg` | 24px | Zwischen Sektionen |
| xl | `--mp-space-xl` | 32px | Zwischen Komponenten |
| 2xl | `--mp-space-2xl` | 48px | Kapitel-Abstände |
| 3xl | `--mp-space-3xl` | 64px | Grosse Trennungen, Dashboard-Blöcke |

### 4.2 Radien
| Stufe | CSS Variable | Pixel | Verwendung |
|-------|-------------|-------|------------|
| sm | `--mp-radius-sm` | 6px | Buttons, Eingabefelder |
| md | `--mp-radius-md` | 10px | Karten, Panels |
| lg | `--mp-radius-lg` | 16px | Grosse Container, Modale |
| xl | `--mp-radius-xl` | 24px | Feature-Bereiche |
| full | `--mp-radius-full` | 9999px | Runde Elemente, Avatare |

### 4.3 Schatten & Elevation-Hierarchie
| Stufe | CSS Variable | Wert | Verwendung |
|-------|-------------|------|------------|
| sm | `--mp-shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` | Subtile Erhebung |
| md | `--mp-shadow-md` | `0 2px 8px rgba(0,0,0,0.08)` | Karten, Panels |
| lg | `--mp-shadow-lg` | `0 4px 16px rgba(0,0,0,0.10)` | Modale, Overlays |
| xl | `--mp-shadow-xl` | `0 8px 32px rgba(0,0,0,0.12)` | Reserviert (noch ungenutzt) |

Schatten sind bewusst dezent — kein Material-Design-Elevation-System.

#### Elevation-Regeln (aus Code abgeleitet)
| Ebene | Schatten | Wann verwenden | Beispiele |
|-------|----------|----------------|-----------|
| Basis | keiner | Hintergrund-Flächen, inline Elemente | Kapitelzeilen, Formularfelder |
| Ruhend | `shadow.sm` | Cards, Panels, sticky Header | Dashboard-Cards, AlphaBanner, QuickCheck, Rechner-Container, App-Header |
| Hervorgehoben | `shadow.md` | Wichtige Container, aktive Zustände | ChapterView-Header, MirrorCards (expandiert), Guided-Start-Card |
| Schwebend | `shadow.lg` | Elemente die über dem Content schweben | MobileNav-Drawer |

#### Spezial-Schatten (semantisch gefärbt)
| Kontext | Wert | Zweck |
|---------|------|-------|
| Kapitel 100% | `0 1px 6px ${palette.sage}25` | Salbei-Schimmer bei vollständigem Kapitel |
| Pass-Icon (complete) | `shadow.md` + `0 0 0 3px ${palette.sage}15` | Halo-Ring bei abgeschlossener Station |

Die semantisch gefärbten Schatten sind bewusste Ausnahmen — sie visualisieren Fortschritt als Micro-Delight (kein Gamification).

---

## 5. Animation & Bewegung

### 5.1 Easing & Dauer
| Stufe | CSS Variable | Wert | Verwendung |
|-------|-------------|------|------------|
| Easing | `--mp-ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Alle Übergänge |
| fast | `--mp-duration-fast` | 150ms | Hover-States, Toggles |
| normal | `--mp-duration-normal` | 250ms | Standard-Übergänge |
| slow | `--mp-duration-slow` | 400ms | Layout-Änderungen, Modale |
| cinematic | `--mp-duration-cinematic` | 600ms | Progress-Bars, Reveals |

### 5.2 Keyframe-Animationen
| Name | Effekt | Verwendung |
|------|--------|------------|
| `fadeIn` | Opacity 0→1 | Einfaches Einblenden |
| `slideIn` | TranslateX -100%→0 | Seitliche Navigation |
| `slideUp` | Opacity 0 + TranslateY 8px→0 | Neue Elemente, Listen |
| `mp-stamp` | Scale 1.25→0.95→1 | Stempel-Effekt bei Bestätigung |
| `mp-check-pop` | Scale 0→1.2→1 | Häkchen erscheint |
| `mp-lock-close` | TranslateY -2px→1px→0 | Schloss schliesst sich |

### 5.3 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```
Alle Animationen werden respektiert — kein Bewegung ohne Zustimmung.

---

## 6. Accessibility

### 6.1 Implementiert
- **Focus-Visible:** 2px solid #C4A06A (Sand), offset 2px — auf allen interaktiven Elementen
- **Skip-to-Content Link:** Tastatur-Navigation, unsichtbar bis fokussiert
- **ARIA-Labels:** Auf allen Buttons, Links, Formularfeldern
- **Nav-Landmark:** `<nav>` für Hauptnavigation
- **Reduced Motion:** Alle Animationen deaktivierbar
- **Smooth Scrolling:** `scroll-behavior: smooth` (nicht bei Reduced Motion)

### 6.2 Prinzipien
- Accessibility ist nicht optional
- Keyboard-Navigation überall möglich
- Screen-Reader-Unterstützung
- Grosse Touch-Targets
- Lesbare Kontraste
- Einfache Sprache

---

## 7. Schweizer Symbolik & Materialität

### 7.1 Malojapass-Metapher
- **Dashboard:** 3-Layer SVG Alpine-Profil mit Pass-Sattel
- **7 Kapitel:** Klickbare Stationen entlang des Passwegs
- **Weg-Metapher:** Das Leben als Pass — Schritt für Schritt, mit Überblick

### 7.2 Material-Referenzen
| Metapher | Visuell | Emotion |
|----------|---------|---------|
| Papier | Warme Crème-Töne, subtile Textur | Vertraut, analog |
| Stein | Dunkle Anthrazit-Töne (Dark Mode) | Solide, beständig |
| Holz | Warme Gold/Sand-Akzente | Natürlich, schweizere |
| Nebel | Transparenzen, weiche Übergänge | Ruhig, nicht alarmierend |
| Alpenwiese | Salbei-Grün | Natur, Beruhigung |

### 7.3 Icon-System
- **40 SVG-Pictogramme** (IconSystem.jsx, ~71KB)
- Linienstärke: konsistent, fein
- Stil: Piktogrammatisch (nicht illustrativ)
- Inspiration: Schweizer Grafik, SBB/CFF-Piktogramme
- Kapitel-Icons: An Malojapass-Stationen positioniert

---

## 8. Dashboard-Struktur

### 8.1 Layout-Prinzip: Editorial, nicht SaaS
- **Magazin-Charakter:** Offener Weissraum, typografische Hierarchie
- **Keine Kartengitter:** Stattdessen offene Register-Zeilen mit `borderBottom`-Separatoren
- **Malojapass-Anker:** SVG-Silhouette als topographischer Fixpunkt

### 8.2 Kapitel-Darstellung
- Offene Zeilen (nicht geschlossene Karten)
- `borderBottom`-Separatoren statt Container
- Icon + Titel + kurze Beschreibung
- Hover-State: Subtil, nicht dramatisch

### 8.3 Tier-System (geplant, A-027)

**Tier 1 — Kern-Lebensbereiche** (immer sichtbar, primäres Gewicht):
- Persönliche Basis
- Wohnen & Leben
- Finanzen & Geld

**Tier 2 — Unterstützende Bereiche** (sichtbar, leicht reduziertes Gewicht):
- Versicherungen & Vorsorge
- Ausbildung & Arbeit

**Tier 3 — Schutz-Bereiche** (sichtbar, eigene Behandlung):
- Behörden & Rechtliches
- Notfall

### 8.4 Emotionale Temperatur
| Kapitel | Gewicht | Emotion | Frequenz |
|---------|---------|---------|----------|
| Basis | Leicht | Neutral | Einmalig |
| Wohnen | Leicht-Mittel | Neutral | Selten |
| Finanzen | **Schwer** | Stressig | Monatlich |
| Versicherungen | **Schwer** | Administrativ | Jährlich |
| Ausbildung | Mittel | Neutral-Positiv | Selten |
| Behörden | **Schwer** | Ängstlich | Situativ |
| Notfall | Mittel | **Emotional schwer** | Einmalig |

---

## 9. Navigations-Philosophie

### 9.1 Prinzipien
- **Ruhige Navigation** — kein Hamburger-Menü, keine versteckten Ebenen
- **Progressive Disclosure** — Sekundärfelder erst bei Bedarf zeigen
- **Emotionaler Bogen** — Alltag → Vorbereitung → Sicherheitsnetz
- **Keine Badges/Zähler** — keine visuellen Schulden

### 9.2 Mobile Navigation
- Eigene MobileNav.jsx-Komponente
- Ab 375px Viewport vollständig nutzbar
- auto-fit/minmax Grids, flexWrap

### 9.3 Responsive Breakpoints
- **375px:** Minimum (iPhone SE)
- **768px:** Tablet
- **1024px+:** Desktop (volle Editorial-Breite)

---

## 10. Branding-Identität

### 10.1 Name
**Maloja Plana**
- Keine generische App-Bezeichnung
- Eigenname mit schweizerischer Verankerung
- Schreibweise: immer "Maloja Plana" (zwei Wörter, Grossbuchstaben)

### 10.2 Name-Semantik
| Element | Bedeutung 1 | Bedeutung 2 |
|---------|-------------|-------------|
| Maloja | Malojapass (GR) | Verbindung, Weg |
| Pass | Schweizer Pass | Bergpass, Übergang |
| Plana | Planen, Ordnung | Silvaplana (Engadin) |

### 10.3 Tonalität
| Eigenschaft | Maloja Plana | NICHT Maloja Plana |
|-------------|-------------|-------------------|
| Stimme | Ruhig, klar, sachlich | Laut, dringlich, verkäuferisch |
| Haltung | Begleitend, unterstützend | Bevormundend, belehrend |
| Sprache | Einfach, respektvoll | Jargon, Buzzwords |
| Emotion | Sicherheit, Vertrauen | Angst, Druck, Scham |

### 10.4 Markenregistrierung
- **Status:** Noch nicht angemeldet
- **Empfehlung:** CH-Markenanmeldung Klasse 9 + 42 (CHF 550, 6–8 Monate)
- **Domains:** malojaplana.ch (sichern empfohlen)

---

## 11. Inline-Styling-System

### 11.1 Architektur
- **100% Inline-Styles** via `palette` Prop-Objekte
- **CSS Custom Properties** in `tokens.css` für Spacing, Typografie, Transitions
- **Kein CSS-Framework** — kein Tailwind, Bootstrap, Styled Components
- **Kein CSS-Preprocessor** — kein Sass, Less, PostCSS

### 11.2 Palette-Props
```javascript
const LIGHT_PALETTE = {
  bg: '#F2F2F0', surface: '#FAFAF8', up: '#ECECEA', top: '#E4E4E2',
  border: '#DCDAD6', text: '#24262A', mid: '#6A6E74', soft: '#64676E',
  gold: '#C4A870', sage: '#5A7868', rose: '#B87070',
  sky: '#6E90B0', sand: '#C4A06A'
  // + Deep-Varianten (goldDeep/sandDeep/skyDeep/roseDeep/sageDeep) für lesbaren Text
};
```
Jede Komponente erhält `palette` als Prop und baut daraus Inline-Styles.

### 11.3 Print-Styles
- Dediziertes `print.css`
- Optimiert für Dokument-Exports und Notfallblätter
- Kein Farbdruck erforderlich

---

## 12. Zusammenfassung — Design-DNA

```
Maloja Plana Design = 
  Schweizer Grafik-Tradition
  + Warme Alpine Materialität
  + Calm Technology Prinzipien
  + Editorial Layout (Magazin > Dashboard)
  + Anti-Gamification (aber: Micro-Delight)
  + Accessibility First
  + Privacy by Design
  + Zeitlose Ästhetik
```

Das Design ist kein kosmetisches Layer — es ist integraler Bestandteil der Produktidentität und des Vertrauensversprechens.
