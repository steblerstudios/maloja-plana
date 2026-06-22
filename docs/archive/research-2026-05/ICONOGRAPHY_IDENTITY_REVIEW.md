# Ikonografie & Identitäts-Review

**Projekt:** Maloja Plana  
**Datum:** 2026-06-14  
**Scope:** Symbolsprache, kulturelle Konsistenz, Identitätslücken  
**Grundlage:** Live-Build (Commit 9a3da9f), IconSystem.jsx, maloja-icons/, Dokumentation

---

# 1. Bestandsaufnahme: Was wurde definiert

---

Die Maloja-Plana-Vision definiert eine durchgängige Schweizer Symbolsprache. Die folgenden Konzepte wurden in Dokumenten, Design-Reviews und der Icon-Bibliothek festgelegt:

## 1.1 Zentrale Metapher

| Konzept | Zweck | Quelle |
|---|---|---|
| **Malojapass** | Lebensreise als Passüberquerung — 7 Kapitel als Stationen am Weg | Dashboard.jsx (Zeile 128–235) |
| **Berglandschaft (3 Schichten)** | Tiefe, Ruhe, Orientierung — die visuelle Grundsprache | Dashboard.jsx, LANDSCAPE_IDENTITY_REVIEW.md |

## 1.2 Progressive Easter Eggs (Landschaftselemente)

| Element | Erscheint bei | Status |
|---|---|---|
| Tannen (Fir Trees) | 0% (immer, 0.3 Opacity) | ✓ Implementiert |
| Edelweiss | 15% | ✓ Implementiert |
| Gipfelkreuz (Summit Cross) | 45% | ✓ Implementiert |
| Matterhorn | 55% | ✓ Implementiert |
| Kuh (Cow) | 40% | ✓ Implementiert |
| Bahnhofsuhr | 75% | ✓ Implementiert |
| Toblerone | 85% | ✓ Implementiert |
| Sonne | 95% | ✓ Implementiert |
| Schweizer Fahne | 100% | ✓ Implementiert |

## 1.3 Kapitel-Icons (Definierte Symbolsprache)

| Kapitel | Definiertes Symbol | Schweizer Bezug |
|---|---|---|
| Basis | Identitätskarte | CH-Ausweisform |
| Wohnen | Chalet mit Geranien | Berner Oberland, Lüftlmalerei |
| Finanzen | Fünfliber (5-CHF-Münze) | Numismatische Präzision, Lorbeerkranz |
| Versicherungen | Edelweiss im Schild | Alpenschutz-Symbol |
| Ausbildung | Doktorhut mit Diplom | — (generisch) |
| Behörden | Helvetia | Bundesstaatliche Personifikation |
| Notfall | Herz mit Kreuz | — (medizinisch-generisch) |

## 1.4 Werkzeug-Icons (Schweizer Bezug)

| Werkzeug | Symbol | Schweizer Bezug |
|---|---|---|
| Kalender | Bahnhofsuhr (Mondaine) | SBB-Ikone |
| Steuern | QR-Rechnung | CH-Zahlungsstandard |
| Charts | Toblerone-Balken | Schokoladen-Humor |
| Export | Sackmesser | Victorinox-Referenz |
| Tresor | Tresor mit Drehrad | — |

## 1.5 Konzepte ohne Implementierung

| Konzept | Vorgesehener Zweck | Status |
|---|---|---|
| **Kuhglocke** | Benachrichtigungen, Erinnerungen — "etwas klingt, ohne zu alarmieren" | ✗ Nicht implementiert |
| **Wegweiser** | Orientierung, Navigation zwischen Kapiteln — "Du bist hier" | ✗ Nicht implementiert |
| **Posthorn** | Export/Versand, Korrespondenz — "etwas wird zugestellt" | ✗ Nicht implementiert |
| **Edelweiss im Schild** | Versicherungs-Kapitel (256×256 Design existiert) | ✗ Design vorhanden, nicht im Code |

## 1.6 256×256 Icon-Bibliothek

17 künstlerische Vollformat-Icons existieren in `maloja-icons/`:

```
01-wohnen-leben.svg          → Chalet (Gold/Crème)
02-finanzen-geld.svg         → Münze
03-versicherungen-vorsorge.svg → Edelweiss im Schild ← NICHT IM CODE
04-behoerden-rechtliches.svg → Helvetia
05-notfall.svg               → Kreuz
06-dokument-tresor.svg       → Tresor
07-kalender.svg              → Bahnhofsuhr
08-budget.svg                → Portemonnaie
09-schulden.svg              → Dokument
10-steuern.svg               → QR-Rechnung
11-organspende.svg           → Herz
12-charts.svg                → Toblerone
13-export.svg                → Sackmesser
14-praemienverbilligung.svg  → Schild + Pfeil
15-mietzinsverbilligung.svg  → Haus + %
16-sozialhilfe.svg           → Hände
17-lebenslauf.svg            → Dokument + Person
```

Diese Bibliothek wird **nirgends im Code referenziert**. Sie war als Leerzustand-Illustrationen oder Kapitel-Eingangsbilder vorgesehen.

---

# 2. Was aktuell in der Live-Version umgesetzt ist

---

## 2.1 IconSystem.jsx — 54 Icons

Das Icon-System enthält **54 prozedurale React-SVG-Icons** in 4 Kategorien:

| Kategorie | Anzahl | Beispiele |
|---|---|---|
| Kapitel-Icons | 7 | basis, wohnen, finanzen, versicherungen, ausbildung, behoerden, notfall |
| Erweiterte Kapitel-Icons | 13 | dokumentTresor, kalenderUhr, budgetWallet, schulden, steuern, organspende, chartsSchoko, exportTool, praemienverbilligung, mietzinsverbilligung, sozialhilfe, lebenslauf |
| Feature-Icons | 19 | upload, barcode, document, download, delete, check, warning, dashboard, settings, csv, money, health, debt, calendar, search, filter, success, error, qr |
| Semantische Icons | 15 | dentist, doctor, home, insurance, documents, budget, timeline, emergency, mobility, work, selfEmployment, contacts, family, legal, edit, phone, info, external, recurring, lock |

**Davon kulturell distinktiv (Schweizer Bezug):** 9 von 54 (17%)
- Chalet, Fünfliber, Helvetia, Bahnhofsuhr, QR-Rechnung, Toblerone-Chart, Sackmesser, Prämienverbilligung, Mietzinsverbilligung

**Davon generisch (austauschbar):** 45 von 54 (83%)

## 2.2 Unicode-Symbole im Code

| Symbol | Verwendung | Anzahl |
|---|---|---|
| `○` | Aufzählung, Leer-Status, Info-Marker | ~48× |
| `✓` | Bestätigung, Erfolg | ~13× |
| `◎` | Grosses Akzent-Symbol (Onboarding, Error, Notfall) | 5× |
| `◈` | Kritischer Alert (StorageWarning) | 1× |
| `→` `←` | Navigation | 5× |
| `●` | Theme-Toggle | 1× |
| `□` | Export/Datei | 2× |

## 2.3 Logo

- **Header:** Abstrakte topografische Linien (2 Kurven), `palette.sand`, im 24×24 viewBox
- **Onboarding/Error:** `◎` als Platzhalter-Logo

---

# 3. Wo generische Icons verwendet werden

---

| Stelle | Aktuell | Generisch? | Maloja-Alternative möglich? |
|---|---|---|---|
| Versicherungen-Icon | Schild + Kreuz + Hand | Teilweise | Edelweiss im Schild (Design existiert) |
| Ausbildung-Icon | Doktorhut | Ja | Lehrbuch, Schulranzen, Lernpass |
| Notfall-Icon | Herz + Kreuz | Ja | Rettungsschlitten, Bergjacke, Heli? |
| Benachrichtigungen | `_emergency` (generische Glocke) | Ja | **Kuhglocke** (definiert, nicht gebaut) |
| Navigation/Orientierung | Kein dediziertes Symbol | — | **Wegweiser** (definiert, nicht gebaut) |
| Export/Versand | Sackmesser (vorhanden) | Nein | Posthorn als Ergänzung |
| Onboarding-Logo | `◎` Unicode | Ja | Topografisches Logo oder Mini-Edelweiss |
| Error-Screen Logo | `◎` Unicode | Ja | Dasselbe |
| Feature-Icons (19) | Generische UI-Icons | Ja | Nicht nötig — funktionale Icons brauchen keinen CH-Bezug |
| Semantische Icons (15) | Generische Domänen-Icons | Ja | Selektiv möglich (z.B. _mobility → Postauto statt Bus) |

---

# 4. Wo die Symbolsprache verloren gegangen ist

---

## 4.1 Der Bruch zwischen Dashboard und Kapiteln

Das Dashboard ist **identitätsstark**: Malojapass, 3 Bergschichten, 9 Easter Eggs, Sage-Grün, kulturell distinkte Kapitel-Icons.

Die Kapitelansichten (ChapterView) sind **identitätsarm**: Das Kapitel-Icon erscheint einmal im Header (32px), dann folgen generische Formularfelder. Kein Bergbezug, kein landschaftliches Element, keine Orientierungssymbolik.

**Der Pass lebt auf dem Dashboard. In den Kapiteln verschwindet er.**

## 4.2 Versicherungen: Edelweiss verworfen

Das 256×256-Design `03-versicherungen-vorsorge.svg` zeigt ein Edelweiss im Schild — das stärkste Alpine Schutzsymbol. Im Code wurde es durch ein generisches Schild mit Kreuz und Hand ersetzt. Die Edelweiss-Identität ging bei der Vereinfachung auf 24×24 verloren.

## 4.3 Benachrichtigungen: Kuhglocke nie gebaut

Die Kuhglocke war als zentrales Benachrichtigungssymbol vorgesehen — "etwas klingt im Tal, ruhig, natürlich, nicht digital." Stattdessen:
- OverdueBanner: Farbiger Kreis mit Zahl
- CalendarReminders: Generische Kategorie-Icons
- NotificationSettings: Zahnrad-Icon
- Emergency-Icon: Generische Kirchenglocke (`_emergency`)

Die `_emergency`-Glocke ist eine klassische Alarmglocke (symmetrisch, Kupel-Form). Eine Kuhglocke hat eine andere Form: trapezoid, Lederband oben, sichtbarer Klöppel, asymmetrisch.

## 4.4 Wegweiser: Orientierungsschicht fehlt

Der gelbe Wanderweg-Wegweiser — das universellste Schweizer Orientierungssymbol — existiert nirgends im Code. Die "Du bist hier"-Metapher, die den Pass mit den Kapiteln verbinden sollte, wurde nie visuell umgesetzt.

## 4.5 Rätoromanisch: Technisch vorbereitet, inhaltlich leer

- `rm.js` existiert als **leere Datei** (0 Bytes)
- `index.js` importiert Rätoromanisch **nicht** und listet es nicht in `SUPPORTED`
- Der Sprachschalter im Header zeigt **EN/DE/FR/IT** — kein RM
- Keine einzige rätoromanische Übersetzung existiert

Für ein Projekt, das den Malojapass im Namen trägt — ein Pass in Graubünden, wo Rätoromanisch Amtssprache ist — ist dies eine kulturelle Lücke.

---

# 5. Benachrichtigungen und die Kuhglocken-Idee

---

| Benachrichtigungs-Typ | Aktuelles Symbol | Kuhglocke vorhanden? |
|---|---|---|
| Fällige Dokumente | Farbkreis (Gold/Rose) + Zahl | Nein |
| Kalender-Erinnerungen | Kategorie-Icons (health, admin etc.) | Nein |
| Benachrichtigungs-Einstellungen | Zahnrad | Nein |
| Speicher-Warnung | `◈` (Diamant-Unicode) | Nein |
| Error-Screen | `◎` (Bullseye-Unicode) | Nein |

**Fazit:** Die Kuhglocken-Idee wurde **nirgends umgesetzt**. Das Benachrichtigungssystem nutzt generische UI-Muster (farbige Badges, Unicode-Zeichen).

---

# 6. Rätoromanisch: Status

---

| Prüfpunkt | Status |
|---|---|
| Datei `rm.js` | ✓ Existiert (0 Bytes, leer) |
| Import in `index.js` | ✗ Nicht importiert |
| `SUPPORTED`-Array | ✗ Nicht enthalten (`['en', 'de', 'fr', 'it']`) |
| Sprachschalter UI | ✗ Nicht sichtbar |
| Übersetzungen | ✗ Keine einzige |
| Dokumentation | ✓ `docs/translations/rm.md` beschreibt Strategie |
| Empfohlene Variante | Rumantsch Grischun (Standardsprache) |
| Empfohlener Scope | Navigation, Kapitelnamen, Grundfelder, Notfall |
| Professionelle Übersetzung | Empfohlen (nicht Crowdsource) |

**Technisch:** Die Infrastruktur ist bereit (Datei, Import-Muster, Sprachschalter-Logik). Es fehlt nur Inhalt und Aktivierung.

**Visuell:** Der Sprachschalter zeigt 4 Buttons (EN/DE/FR/IT). Ein 5. Button (RM) passt in das bestehende Layout.

---

# 7. Die 10 wichtigsten Identitätslücken

---

| # | Lücke | Kategorie | Aufwand | Identitätswirkung | Priorität |
|---|---|---|---|---|---|
| **1** | **Kuhglocke fehlt** | Icon + Konzept | Mittel (SVG zeichnen, in Benachrichtigungssystem einbauen) | **Hoch** — definierendes Symbol für "Maloja meldet sich" | ★★★★★ |
| **2** | **Edelweiss-Versicherungsicon nicht im Code** | Icon-Austausch | Klein (SVG von 256→24 vereinfachen, `_versicherungen` ersetzen) | **Hoch** — stärkstes Alpenschutz-Symbol zurückholen | ★★★★★ |
| **3** | **Wegweiser fehlt** | Icon + Konzept | Mittel (SVG zeichnen, Platzierung definieren) | **Hoch** — fehlendes Orientierungs-Symbol | ★★★★☆ |
| **4** | **Rätoromanisch leer** | Inhalt + Integration | Gross (professionelle Übersetzung, min. Navigation + Kapitel + Notfall) | **Hoch** — kulturelle Glaubwürdigkeit eines Graubünden-Projekts | ★★★★☆ |
| **5** | **Kapitelansichten identitätslos** | Visuelles Konzept | Gross (landschaftliche Elemente in ChapterView integrieren) | **Mittel** — der Bruch zwischen Dashboard und Kapiteln | ★★★☆☆ |
| **6** | **Onboarding/Error nutzen ◎ statt Logo** | Icon-Austausch | Klein (topografisches Logo oder Mini-Edelweiss einsetzen) | **Mittel** — erste und letzte Berührungspunkte mit der Marke | ★★★☆☆ |
| **7** | **Ausbildung-Icon generisch (Doktorhut)** | Icon-Redesign | Klein (neues SVG mit CH-Bezug) | **Gering** — Doktorhut ist international verständlich | ★★☆☆☆ |
| **8** | **256×256 Bibliothek ungenutzt** | Asset-Integration | Mittel (als Leerzustand- oder Kapitel-Eingangsgrafiken einbauen) | **Mittel** — 17 künstlerische Illustrationen verstauben | ★★☆☆☆ |
| **9** | **`_emergency`-Glocke ist keine Kuhglocke** | Icon-Redesign | Klein (Form ändern: trapezoid, Lederband, Klöppel) | **Gering** — semantischer Icon, selten sichtbar | ★★☆☆☆ |
| **10** | **Posthorn fehlt** | Icon + Konzept | Klein (SVG zeichnen) | **Gering** — ergänzend, nicht tragend | ★☆☆☆☆ |

---

# 8. Empfehlungen

---

## Sofort umsetzbar (Klein, hohe Wirkung)

### E.1 — Edelweiss-Versicherungsicon aktivieren
- 256×256-Design `03-versicherungen-vorsorge.svg` existiert
- Auf 24×24 vereinfachen: Schildform beibehalten, 6–8 Blütenblätter, Kern
- `_versicherungen` in IconSystem.jsx ersetzen
- **Aufwand:** 1–2 Stunden
- **Wirkung:** Das Alpine Schutzsymbol kehrt zurück

### E.2 — Onboarding/Error-Logo ersetzen
- `◎` durch das topografische Header-Logo (2 Kurven) ersetzen
- Konsistenz: Dasselbe Symbol an allen Marken-Berührungspunkten
- **Aufwand:** 30 Minuten
- **Wirkung:** Markenidentität am Einstiegspunkt

## Mittelfristig (Mittel, hohe Wirkung)

### E.3 — Kuhglocke zeichnen und einbauen
- SVG-Design: Trapezoid-Form, Lederband mit Schnalle, sichtbarer Klöppel
- Referenz: Appenzeller Trychel, nicht Kirchenglocke
- Einsetzen in: OverdueBanner, CalendarReminders-Header, NotificationSettings
- `_emergency` optional durch Kuhglocken-Variante ergänzen
- **Aufwand:** 3–4 Stunden (Design + Integration)
- **Wirkung:** Das Benachrichtigungssystem bekommt eine Seele

### E.4 — Wegweiser zeichnen
- SVG-Design: Gelber Pfeil auf Holzpfosten (Schweizer Wanderweg-Standard)
- Verwendung: Noch zu definieren (Orientierungssätze, Kapitelübergänge, Leerzustände)
- **Aufwand:** 2 Stunden (Design), Platzierung variabel
- **Wirkung:** Das "Du bist hier"-Gefühl

## Langfristig (Gross, hohe Wirkung)

### E.5 — Rätoromanisch aktivieren
- Phase 1: Navigation, 7 Kapitelnamen, Grundfelder, Notfall-Kontaktformular
- Phase 2: Lebenssätze, Mirror-Card-Titel
- Professionelle Übersetzung empfohlen (Rumantsch Grischun)
- Technisch: `rm.js` füllen, in `index.js` importieren, `SUPPORTED` erweitern
- **Aufwand:** 2–4 Wochen (abhängig von Übersetzer)
- **Wirkung:** Kulturelle Verankerung in Graubünden — der Malojapass spricht seine Sprache

### E.6 — 256×256 Bibliothek einsetzen
- Als Kapitel-Eingangsgrafiken (beim ersten Besuch eines leeren Kapitels)
- Oder als Leerzustand-Illustrationen in der Mirror Card
- **Aufwand:** 4–6 Stunden
- **Wirkung:** Die 17 künstlerischen Illustrationen werden sichtbar

---

# 9. Aufwand/Nutzen-Matrix

---

```
                    NUTZEN (Identitätswirkung)
                    Gering          Hoch
                ┌─────────────┬─────────────┐
         Klein  │ E.9 Glocke  │ E.1 Edelweiss│
                │ E.10 Post-  │ E.2 Logo     │
   AUFWAND      │     horn    │              │
                ├─────────────┼─────────────┤
         Mittel │ E.7 Ausbild.│ E.3 Kuhglocke│
                │ E.8 Biblio. │ E.4 Wegweiser│
                ├─────────────┼─────────────┤
         Gross  │             │ E.5 Rätorom. │
                │             │ E.6 Biblioth.│
                └─────────────┴─────────────┘
```

**Empfohlene Reihenfolge:** E.1 → E.2 → E.3 → E.4 → E.5 → E.6

Die ersten beiden (Edelweiss, Logo) sind in einem Nachmittag machbar und schliessen die sichtbarsten Identitätslücken.

---

# Zusammenfassung

---

Maloja Plana hat ein **starkes ikonografisches Fundament** — 9 kulturell distinkte Icons (Fünfliber, Helvetia, Chalet, Bahnhofsuhr, QR-Rechnung, Toblerone, Sackmesser, Prämienverbilligung, Mietzinsverbilligung) und einen visuell reichen Dashboard-Pass mit 9 Easter Eggs.

Die Identität konzentriert sich aber auf das **Dashboard**. In den Kapitelansichten, im Benachrichtigungssystem und an den Marken-Berührungspunkten (Onboarding, Error) wird sie dünn. Drei definierte Symbole (Kuhglocke, Edelweiss-Schild, Wegweiser) wurden nie gebaut. Rätoromanisch — die Sprache des Malojapasses — ist technisch vorbereitet, aber inhaltlich leer.

**Von 54 Icons im System sind 9 kulturell distinktiv (17%).** Das reicht für die Kapitel-Headers. Es reicht nicht für eine durchgängige Symbolsprache.
