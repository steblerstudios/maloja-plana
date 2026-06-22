# Maloja Plana — Design Language Registry

> Zentrales Verzeichnis der visuellen Identität, UX-Philosophie und Designsprache.
> Dieses Dokument ist Teil der Produktidentität und darf nicht verloren gehen.

Stand: 2026-06-22

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
| `bg` | `#F5F2EE` | Haupthintergrund — warmes Papier |
| `surface` | `#FFFFFF` | Karten, erhöhte Flächen |
| `up` | `#F0EDE8` | Leicht erhöhte Bereiche |
| `top` | `#EAE5DD` | Höchste visuelle Ebene |
| `border` | `#DDD8D0` | Rahmen, Separatoren |
| `text` | `#1C1A17` | Haupttext — fast schwarz, warm |
| `mid` | `#6B6560` | Sekundärtext, Labels |
| `soft` | `#B8B4AC` | Deaktivierte Elemente, Hints |

#### Dark Mode
| Token | Hex | Verwendung |
|-------|-----|------------|
| `bg` | `#0F0E0C` | Haupthintergrund — dunkler Stein |
| `surface` | `#161513` | Karten, Panels |
| `up` | `#1E1C19` | Erhöhte Flächen |
| `top` | `#252320` | Höchste Ebene |
| `border` | `#2A2824` | Rahmen |
| `text` | `#EDE8E0` | Haupttext — warmes Crème |
| `mid` | `#8A8478` | Sekundärtext |
| `soft` | `#504C46` | Deaktiviert |

#### Akzentfarben (Modus-unabhängig)
| Token | Hex | Semantik | Verwendung |
|-------|-----|----------|------------|
| `gold` | `#C9A96E` | Wert, Qualität | Akzente, CTAs, Highlights |
| `sage` | `#7B9E8C` | Natur, Beruhigung | Erfolg, positive Zustände |
| `rose` | `#B87070` | Wärme, Aufmerksamkeit | Sanfte Warnungen |
| `sky` | `#6E90B0` | Himmel, Information | Links, Quellenangaben, Info-Hinweise, Versicherungen-Akzent |
| `sand` | `#B8956A` | Erde, Navigation | Focus-Ringe, Navigation, Interaktion |

### 2.2 Farbregeln
- **Keine gesättigten Primärfarben** — kein reines Rot, Blau, Grün
- **Keine aggressiven Signalfarben** — keine Rot/Grün-Ampeln
- **Warme, natürliche Töne** — inspiriert von Alpenlandschaft
- **Focus-Ring:** 2px solid `#B8956A` (Sand), offset 2px
- **Selektion:** `rgba(184, 149, 106, 0.3)` (Gold, transparent)

---

## 3. Typografie

### 3.1 Schriftfamilie
**DM Sans** — WOFF2, lokal gehostet (kein CDN)

Warum DM Sans:
- Geometrisch, aber warm
- Exzellente Lesbarkeit
- Frei nutzbar (SIL Open Font License)
- Unterstützt Latin Extended (wichtig für FR/IT/RM)

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
- **Focus-Visible:** 2px solid #B8956A, offset 2px — auf allen interaktiven Elementen
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
  bg: '#F5F2EE', surface: '#FFFFFF', up: '#F0EDE8',
  text: '#1C1A17', mid: '#6B6560', soft: '#B8B4AC',
  gold: '#C9A96E', sage: '#7B9E8C', rose: '#B87070',
  sky: '#6E90B0', sand: '#B8956A'
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
