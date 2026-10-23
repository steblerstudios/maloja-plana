# Bildschirm-Messung aller Seiten · 23.10.2026

**Auftrag (Stebler Studios, 23.10.2026):** alle Seiten verbessern, nicht nur die Übersicht —
auf Handy, Tablet und Desktop. Jeder Bildschirm ist etwas anders, und genau das führt
manchmal zu Fehlern. Anlass: Vorbild Stardust (`docs/IDEEN.md` §16), der Eingang ist als
erster Schritt gebaut (PR #537).

## Wie gemessen wurde

Im Demo-Modus («Maria Muster»), ohne Neuladen, jede Seite über `#/…` angesprungen
(92 Seiten: Übersicht, 7 Kapitel, 84 Werkzeuge und Abläufe aus `VALID_VIEWS`).
Je Seite und Fenstergrösse gezählt:

- **seitlich:** `scrollWidth` des Dokuments breiter als das Fenster
- **Rand:** sichtbare Elemente, die über den rechten/linken Rand ragen und nicht in einem
  Behälter liegen, der absichtlich seitlich scrollt oder abschneidet (nur die äussersten)
- **abgeschnitten:** Text in `overflow: hidden/clip`, der nicht hineinpasst, ohne Auslassungszeichen
- **Tippflächen:** Knöpfe/Links/Felder unter 24 × 24 px (WCAG 2.2, 2.5.8)
- **Fehler:** Fehlerschirm sichtbar

Ausgefiltert, weil Absicht: der Sprunglink «Zum Inhalt springen» (ausserhalb des Bildes, bis
er Fokus bekommt) und unsichtbare Screenreader-Texte (1 × 1 px).

## Ergebnisse

### 390 × 844 (iPhone 12–15)

3 von 92 Seiten auffällig.

| Seite | Befund |
|---|---|
| `dashboard` | ein `div` ragt bis 407 px (unsichtbar, `html { overflow-x: clip }` fängt es) |
| `alv` | **seitliches Scrollen** (419 px): Titel «Arbeitslosenentschädigung» bricht nicht um, schiebt «Gespeichert» und «Menü» hinaus |
| `behoerdendossier` | **seitliches Scrollen** (392 px): Knopf «Menü» ragt hinaus |

Tippflächen unter 24 px: **785** über alle Seiten (noch nicht nach Art aufgeschlüsselt).

### 320 × 568 (iPhone SE 1. Gen., kleinste übliche Breite)

10 von 92 Seiten auffällig.

| Seite | Befund |
|---|---|
| `dashboard` | Leitsatz im Bild abgeschnitten |
| `alv` | seitlich 419 px — Titel «Arbeitslosenentschädigung» |
| `asyl` | drei `span` ragen bis 331 px |
| `behoerdendossier` | seitlich 357 px — «Gespeichert» und «Menü» |
| `bestattung` | seitlich 333 px — Titel «Bestattungswünsche festhalten» |
| `bewilligung` | seitlich 339 px — Titel «HELVETIA Aufenthaltsbewilligung verlängern» |
| `ergaenzungsleistungen` | seitlich 325 px — Titel «Ergänzungsleistungen beantragen» |
| `lebensmappe` | seitlich 345 px — Knopf «Menü» |
| `premium` | seitlich 322 px — Titel «Prämienverbilligung (IPV)» |
| `stipendien` | seitlich 334 px — Titel «Stipendien & Ausbildungsbeiträge» |

Tippflächen unter 24 px: **752**.

### Muster

**Ein Fehler, viele Seiten:** Der Seitenkopf (Titel + «Gespeichert» + «Menü» in einer Zeile)
lässt lange Titel nicht umbrechen. Ein langes deutsches Wort («Arbeitslosenentschädigung»)
oder ein langer Titel schiebt den Menü-Knopf aus dem Bild. Vermutlich eine gemeinsame
Kopf-Komponente ohne `min-width: 0` / Umbruch — **noch nicht am Code bestätigt.**

### Zweite Runde (nach Unterbruch, Zweig auf `origin/main` 416394cf)

| Grösse | Auffällige Seiten | Tippflächen < 24 px |
|---|---|---|
| 360 × 640 (Android) | 4: `dashboard` (unsichtbar), `alv`, `behoerdendossier`, `lebensmappe` | 767 |
| 768 × 1024 (Tablet hochkant) | **0** | 826 |
| 1024 × 768 (Tablet quer) | **0** | 829 |
| 1440 × 900 (Laptop) | **0** | 829 |
| 844 × 390 (Handy quer) | **0** | 826 |

**Ab 768 px Breite ist keine Seite auffällig.** Die Fehler sitzen alle unter ~400 px Breite.

### Ursachen — am Code bestätigt

1. **Lange Seitentitel (alv, bestattung, bewilligung, ergaenzungsleistungen, premium,
   stipendien).** `PageTitle` (`components/Heading.jsx`, 50 Verwendungen) setzt mit Icon
   `display: inline-flex`. Der Titeltext wird ein Flex-Element mit `min-width: auto` =
   breitestes Wort. `hyphens: manual`, `overflow-wrap: normal` → «Arbeitslosenentschädigung»
   (28 px) misst 374 px in einer 320-px-Spalte. Weil `html { overflow-x: clip }` das seitliche
   Scrollen verhindert, wird der Titel **rechts abgeschnitten** — das ist der sichtbare Fehler.
   `PanelTitle` hat dasselbe Muster.
2. **`lebensmappe`, `behoerdendossier`:** Dokument breiter als das Fenster (363 / 377 px), aber
   kein sichtbares Element über dem Rand — unsichtbar, durch `overflow-x: clip` aufgefangen.
   Kein sichtbarer Fehler; Ursache nicht weiter verfolgt.
3. **`dashboard`:** die Station «Wanderrucksack» (`nowrap`, 120 px) ragt im Bild bis 408 px.
   Liegt in der Bühne, wird abgeschnitten; bei 320 px ist zudem der Leitsatz im Bild zu breit.

### Tippflächen — aufgeschlüsselt (Stichprobe: je Seite die ersten drei)

Nur **13** sind Textlinks im Fliesstext (nach WCAG 2.5.8 ausgenommen). Die häufigsten echten:

| Element | Grösse | Wo |
|---|---|---|
| Link «Feedback per E-Mail» | 135 × 17 | Fusszeile, **jede Seite** |
| Knopf «Datenschutz & Rechtliches» | 174 × 17 | Fusszeile, **jede Seite** |
| Knopf «IPV ⓘ» | 35 × 23 | viele Seiten |
| Quellen-Links «… (öffnet in neuem Tab)» | z. B. 43 × 17 | Quellenlisten |
| Eingabefelder | — | einzelne Seiten |

Die zwei Fusszeilen-Links allein erklären rund 180 der ~800 Treffer (2 × 92 Seiten).
