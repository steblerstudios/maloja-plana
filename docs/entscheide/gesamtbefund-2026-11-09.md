# Gesamtbefund Maloja · Design, Architektur, UX, SEO (09.11.2026)

*Gemessen am 09.11.2026 auf `origin/main` = `b8bdea43` (09:45) im Arbeitsbaum `_werkbank/gesamtbefund`. Live
`malojaplana.ch` mit `curl`. Fünf Prüfer liefen nur lesend: polygrafin, ordnungshueter, a11y-pruefer,
qualitaets-pruefer und eine SEO-Messung. Die wichtigsten Befunde sind zusätzlich von Hand gegengeprüft (✔ in der
Tabelle). **Gebaut und geändert ist nichts.** Entscheid: Stebler Studios, Kapitel für Kapitel.*

Baut auf diesen Blättern auf: [Seitenlandkarte 05.11.](seitenlandkarte-2026-11.md) (jede Seite öffnet ohne Fehler)
und [Seiten-Architektur 06./07.11.](../design/seiten-architektur-2026-11.md) (jede Seite hat Kapitel und Ast). Was
dort entschieden ist, wird hier nicht neu vorgeschlagen. Der Icon-Plan (Zweige `feat/icons-*`) ist bewusst
ausgeklammert.

---

## 1 · Urteil je Blickwinkel

| Blickwinkel | Urteil in einem Satz | Blocker |
|---|---|---|
| **Design** | Die Grundlage ist ruhig und begründet: Skala ×1.5, Ecken nach Rolle, kaum Hex-Werte. Die Tokens werden aber nur halb benutzt, und Milchglas ist der einzige echte SaaS-Anklang. | keiner |
| **Architektur** | Die Register stimmen untereinander und mit dem Organigramm. Das Risiko liegt bei fest verdrahteten Kapitelnummern und bei `ChapterView` mit rund 2400 Zeilen in einer Komponente. | keiner |
| **Technik** | 8590 Tests grün (Exit 0), Build sauber, CSP nur `'self'`, kein Netzzugriff im Code. Das Startbündel hat nur noch 1 kB Luft. | keiner |
| **UX / Barrierefreiheit** | Das Fundament ist gut: Fokusring, Label-Kopplung, Rechner, `AblaufSchale`. Die Lücken liegen im Frageablauf der Formulare, bei schwachen Feldrändern und bei kleinen Tippzielen. | keiner |
| **SEO** | Technisch ist alles sauber: Sitemap, canonical, robots, 0 doppelte Beschreibungen. Auffindbar sind aber nur 5 deutsche Erklärseiten. Rechner und fremdsprachige Seiten sieht keine Suchmaschine. | keiner |

## 2 · Die zehn wichtigsten Befunde quer über alles

| # | Blickwinkel | Befund | Beleg | Gewicht |
|---|---|---|---|---|
| G1 | SEO | Nur Deutsch ist indexierbar. Die Romandie und das Tessin finden nichts. Der Entscheid vom 05.11. «fr/it/en sollen frei» ist im Code noch nicht umgesetzt | ✔ `scripts/seiten-sprachen.mjs:65,74,83,92` `freigegeben: false` | hoch |
| G2 | SEO | Zu den meistgesuchten Fragen fehlen Seiten: Krankenkasse wechseln / Franchise / Kündigungsfrist (Frist 30.11., jetzt aktuell), Ergänzungsleistungen, AHV/Pensionierung, Arbeitslosigkeit/RAV, Familienzulagen, Betreibung | Volltext der 5 Seiten: RAV 0, Familienzulage 0, Betreibung 0. Die Seite `/krankenkasse/` heisst «Warum die Krankenkasse so viel kostet». Augenmass, kein Suchvolumen gemessen | hoch |
| G3 | SEO | Was schon auf `main` liegt, ist nicht live: Kantone im Vergleich, Kantonsatlas, Politsystem, 8 statt 4 Startseiten-Links, «Beispiel ansehen» ins Werkzeug. Die Sitemap auf `main` führt 10 URLs, 3 davon antworten live 404 | curl 404 auf alle drei · `public/sitemap.xml` 10 `<url>`. Gemergt ist nicht live, Deploy bleibt bei Stebler Studios | mittel |
| G4 | UX / a11y | Formular-Abläufe (Bestattung, Patientenverfügung, Vorsorgeauftrag): Beim Weiter bleibt der Fokus stehen, und es gibt keine Ansage. Wer vorgelesen bekommt, merkt nicht, dass eine neue Frage da ist | ✔ `components/FragenAblauf.jsx`: 0 × `focus()`/`aria-live`. `AblaufSchale.jsx:163-188` macht es richtig | hoch |
| G5 | UX / a11y | Die Ränder der Eingabefelder sind fast unsichtbar. Hell 1,18:1, nötig wären 3:1 | ✔ `palette.border #DCDAD6` auf `up #ECECEA` (`config/constants.js:32,36`) | hoch |
| G6 | Design | Milchglas mit Unschärfe an 5 Stellen: Kopfzeile, untere Navigation und das Landschaftsband, das dreimal kopiert ist und schon auseinanderläuft | ✔ `main.jsx:366,1286` · `AblaufSchale.jsx:109` (`B8`) · `ChapterView.jsx:2168` + `CalendarReminders.jsx:423` (`E6`) | hoch |
| G7 | Design + a11y | Zu kleine Schrift: rund 40 Stellen mit 8–12 px oder neben der Skala, obwohl der kleinste Token 13 px ist. Ein Beispiel ist die Beschriftung der unteren Navigation mit 10 px | ✔ 19 × `fontSize: '10px'`/`'11px'` in `src/*.jsx` · `main.jsx:362` | hoch |
| G8 | Technik | Das Startbündel liegt bei 63,99 von 65 kB gzip. Jede neue Kleinigkeit im Einstieg kippt die Grenze | `npm run size` Exit 0. Die Grenze wird nie angehoben, sondern nachgeladen | hoch |
| G9 | Architektur | Kapitel werden über Nummern statt Schlüssel angesprungen. Ändert sich je die Reihenfolge, führen sie still ins falsche Kapitel | ✔ 12 × `onNavigate('chapter', <Zahl>)` · `hashRouter.js:76-81` · `main.jsx:543` `Math.min(…, 6)` · 6 Kopien von `chapterIdx` | mittel |
| G10 | Design | Die öffentlichen Seiten haben zwei Schriftordnungen. Die Basis hat nur Lexend mit h1 32/h2 20, die Hintergrundseiten haben Hanken Grotesk mit h1 36/h2 24. Daneben stehen 9 Schriftgrössen ausserhalb der App-Skala | ✔ `scripts/build-seiten.mjs:102` gegen `:396` | mittel |

## 3 · Alle Befunde je Blickwinkel

### Design (polygrafin)

| # | Ort | Befund | Gewicht |
|---|---|---|---|
| D1 | `AblaufSchale.jsx:105-109`, `ChapterView.jsx:2165`, `CalendarReminders.jsx:420` | Das Landschaftsband mit Verlauf und Glaspille ist dreimal kopiert. Deckkraft `B8` gegen `E6`, die Verlaufsfarbe ist je anders. → G6 | hoch |
| D2 | `main.jsx:366,1286` | Kopfzeile und untere Navigation sind aus Milchglas, dazu Schatten. → G6 | hoch |
| D3 | `build-seiten.mjs:102-153` / `:396-420` | Die öffentlichen Seiten haben zwei Schriftordnungen. → G10 | hoch |
| D4 | `build-seiten.mjs:102-153` | Schriftgrössen 14/17/18/20/21/24/26/28/32 px statt der App-Skala 13/15/16/19/23/28/36. Abstände 11/14/22/28 px | mittel |
| D5 | App, `src/*.jsx` | Schrift von 8,5 bis 12 px. → G7 | hoch |
| D6 | `Dashboard.jsx:674,724` u. a. | `text.xs - 1` rechnet sich an der Skala vorbei (9 Treffer) | mittel |
| D7 | `AblaufSchale.jsx:179`, `CalendarReminders.jsx:277,527` | Titel mit 22/20/44/18 px ohne Token. Ablauf-, Kapitel- und Kalendertitel stammen aus verschiedenen Skalen | mittel |
| D8 | `src/*.jsx` | 1006 Abstände als Roh-px. Sie liegen meist auf der Skala, sind aber nicht an sie gebunden. Eine Änderung nach §7a erreicht sie nicht | mittel |
| D9 | `KVGLeistungen.jsx:26-28,455` | Rückfallmuster `palette.x \|\| '#…'` und zwei verschiedene Hex-Werte für dasselbe Token | mittel |
| D10 | `Dashboard.jsx:593`, `Baum3D.jsx:876`, `Schnellcheck.jsx:159` | Fest verdrahtete Verläufe und Schraffur | klein |
| D11 | `Gepaeck.jsx`, `Obstgarten.jsx`, `VorsorgeRechner.jsx:586-608` | Eigene Mini-Paletten (Ochsenblut, Stahl, Holz, Diagrammfarben). Die Farbenblind-Werte sind begründet, die übrigen nicht | klein |
| D12 | `tokens.css:190-193` | Dunkelwerte fest im Sprachlage-Block statt als Token | klein |
| D13 | `build-seiten.mjs:110` gegen `tokens.css:117` | Erklärseiten folgen nur dem System-Schema, die App dem Schalter. Wer in der App Dunkel wählt, sieht die Erklärseiten womöglich hell. Nicht im Browser geprüft | klein |
| D14 | `ChapterView.jsx:1205` | Druckblock Notfall mit eigenen Farben. Für ein Druckblatt vertretbar | klein |

### Architektur (ordnungshueter)

| # | Ort | Befund | Gewicht |
|---|---|---|---|
| A1 | `docs/design/seiten-architektur-2026-11.md:33,242` | **Das Blatt sagt «Gebaut ist nichts», das stimmt nicht mehr.** Register, `lebensbereiche.js`, Kapitelname ×5, Lebensbaum, Schnellcheck, Arztkoffer-Wege und das Dashboard «Alle Seiten nach Kapitel» stehen auf `main`. Nachtrag im Blatt gesetzt | hoch |
| A2 | `data/aufgabenBereiche.js:33` | Einziger Rest der Nachzieh-Liste: `FACH_BEREICH.gesundheit` zeigt noch auf `'versicherungen'` ✔. Praktisch tot, weil die Abläufe ihren eigenen `bereich` tragen | klein |
| A3 | `hashRouter.js:76-81`, 12 Aufrufe, `main.jsx:543` | Kapitelnummern als feste Zahlen. → G9 | mittel |
| A4 | `NotfallVorlesekarte.jsx:31` u. 5 weitere | `chapterIdx` sechsmal kopiert. Liefert -1, wenn der Schlüssel fehlt, und der Aufrufort ist nicht überall abgesichert | mittel |
| A5 | `exportVorschau.js:22`, `MobileNav.jsx:119` | Zwei weitere handgeschriebene Kapitelreihen neben `CHAPTER_KEYS` | klein |
| A6 | `components/WerkzeugGruppen.jsx:77-85` | Die Klammer steht von Hand neben dem Register, die Icon-Schlüssel weichen ab. Kein Wächter | mittel |
| A7 | `config/ansichtenRegister.js:50` | `aussteuerung` ist eine Umleitung, erscheint aber als eigene Kachel im Dashboard. Ob gewollt, ist nicht belegt | klein |
| A8 | `config/ansichtenRegister.js:~137-158` | Tote Doppeleinträge in `WEITERE_NAMEN`/`WEITERE_ZEICHEN`. Der Name für `gesundheit` greift nie | klein |
| A9 | `ArztkofferView.jsx:13`, `hashRouter.js:12,51,66` | Veraltete Kommentare («Kapitel Notfall», «all 18 views») | klein |
| A10 | `ChapterView.jsx` 2558 Z., `main.jsx` 1746 Z. | Eine Komponente mit rund 2400 Zeilen und 7 Sonderfällen `chapter.key === 'notfall'` ✔ | mittel |
| ✅ | Routing | `#/chapter/7+` landet nicht mehr still im Notfall (Test `kapitelAdresseGrenze.test.js`). Alle Register-Ansichten stehen in `VALID_VIEWS` | gut |

### Technik (qualitaets-pruefer)

Messwerte: `vitest run` Exit 0, 8590 Tests in 528 Dateien grün · `npm run build` Exit 0, eine Warnung «Chunks > 500 kB» ·
`npm run size` 63,99 / 65 kB · CSP `default-src 'self'`, `connect-src 'self'` · Schriften selbst gehostet, `font-display: swap`.

| # | Ort | Befund | Gewicht |
|---|---|---|---|
| T1 | size-limit | 1,01 kB Luft. → G8 | hoch |
| T2 | `dist/assets/*-rest-*.js` | Je Sprache 500–743 kB roh (185–193 kB gzip). Vermutlich wird nur die aktive geladen, nicht gemessen | mittel |
| T3 | `Baum3D` 568 kB, `praemienDetail` 397 kB | Gross. Dass sie nachgeladen werden, ist plausibel, aber nicht belegt | mittel |
| T4 | `utils/autoBackup.js:87` | `localStorage.getItem` vor dem `try` ✔. Bei gesperrtem Speicher wirft die Funktion. Laut Heuristik rund 24 ähnliche Stellen, von Hand erst 3 gelesen | mittel |
| T5 | i18n | Ein grober Schlüsselvergleich meldet 1970 Lücken in en. Das liegt vermutlich an der Sie/Du-Struktur, der Paritätstest ist grün. **Nicht belegt**, erst den Test lesen | unsicher |
| T6 | `index.html:6` | `style-src 'unsafe-inline'`. Bei Inline-Stilen von React üblich | klein |

### UX und Barrierefreiheit (a11y-pruefer)

| # | Ort | Befund | WCAG | Gewicht |
|---|---|---|---|---|
| U1 | `components/FragenAblauf.jsx:101-124` | Kein Fokus und keine Ansage beim Wechsel der Frage. → G4 | 2.4.3, 4.1.3 | hoch |
| U2 | `ChapterView.jsx:618`, `FragenAblauf.jsx:29`, `AlvRechner`, `BetaGate` | Feldränder mit 1,18:1. → G5 | 1.4.11 | hoch |
| U3 | `ChapterView.jsx:614-619` | Ein Vorlese-Knopf steckt im `<label>`. Ungültiges HTML, und der Feldname lautet dann «Vorname Vorlesen» ✔ | 1.3.1, 4.1.2 | mittel |
| U4 | `components/VorlesenButton.jsx:21` | Das Vorlese-Ziel ist 24×24 px, gerade für die Menschen, die es brauchen | 2.5.8 / 44 px | mittel |
| U5 | `FragenAblauf.jsx:30,117`, `DoctorManager`, `MedicationManager`, `JobManager`, `Saeule3aTracker`, `BetaGate` u. a. | Tippziele von 24–40 px. Der Wächter `tippflaechenGate.test.js` prüft nur 4 Komponenten | 44 px | mittel |
| U6 | `FragenAblauf.jsx:81,90` | Fragearten `gruppe`/`personen` ohne `fieldset`/`legend`. Bei zwei Rollen sind die Felder nicht zu unterscheiden | 1.3.1 | mittel |
| U7 | `AlvRechner.jsx` | «Kinder» und «IV-Grad ≥ 40 %» sind mit «Nein» vorbelegt und zählen als erfasst. Das verändert das Taggeld (70/80 %) ohne Zutun. **Fachlich mit dem swiss-precision-pruefer klären** | 3.3.2 | mittel |
| U8 | `EOrechner.jsx:53`, `Obstgarten.jsx:154` | Waagrecht scrollende Bereiche sind mit der Tastatur nicht erreichbar. Für die öffentlichen Seiten gibt es einen Wächter, für die App nicht | 2.1.1 | mittel |
| U9 | `VorsorgeRechner.jsx:847`, `PraemienOrientierung.jsx:166,505,570` | Vierspaltige Tabellen ohne Scroll-Hülle. Bei 375 px droht Abschneiden. Nicht am Bild gemessen | 1.4.10 | mittel |
| U10 | `hooks/useVorlesen.js:6-11` | Rätoromanisch wird mit deutscher Stimme gelesen. Ein zweiter Klick stoppt nicht | 3.1.2 | mittel |
| U11 | `ChapterView.jsx:2143,2481` | Überschriften in umgekehrter Rangfolge (h3 über h4-Titel, h4 ohne h3) | 1.3.1 | klein |
| U12 | `BetaGate.jsx:~215` | Das Codefeld hat nur einen Platzhalter, die Anweisung verschwindet beim Tippen | 3.3.2 | klein |
| U13 | `FragenAblauf.jsx:36`, `ChapterView.jsx:742` | Kein `autoComplete` bei Name und Telefon | 1.3.5 | klein |
| ✅ | Paletten hell und dunkel AA, Fokusring 5,05:1 / 7,0:1, `LabeledField` mit `aria-invalid`/`describedby`, Brotkrume `aria-current`, Rechner als radiogroup mit `role="status"`, `AblaufSchale` | | | gut |

### SEO (Messung live + Code)

| # | Ort | Befund | Gewicht |
|---|---|---|---|
| S1 | ganze Seite | Indexierbar sind nur 7 URLs, alle deutsch. → G1 | hoch |
| S2 | Themen | Fehlende Seiten zu Suchthemen. → G2 | hoch |
| S3 | Beta-Tor | Alle Rechner liegen hinter dem Tor auf `/#/…`. Das sind keine Adressen, also gibt es kein Suchergebnis zu einem Rechner. Das ist so gewollt, muss aber als Erwartung klar sein | hoch (Erwartung) |
| S4 | `/kantone-im-vergleich/` u. a. | Auf `main`, nicht live. Sitemap und Seiten müssen zusammen ausgeliefert werden. → G3 | mittel |
| S5 | Startseite | Der Titel nennt «Steuern & Sozialhilfe», Prämienverbilligung und Krankenkasse fehlen. Die Beschreibung sagt nur «IPV». Die H1 ist nur «Maloja Plana» | mittel |
| S6 | `/fr/`, `/it/`, `/en/`, `/rm/` | Die Sprachwurzeln antworten **403 «Access forbidden»** ✔ (Unterseiten 200). Vor der Freigabe der Sprachen lösen | mittel |
| S7 | Startseite | Live nur 4 Links auf Erklärseiten, auf `main` 8 | mittel |
| S8 | JSON-LD | Kein `dateModified`, kein `author`. Für Werte 2027 fehlt der KI-Suche das Signal, wie aktuell die Seite ist | klein |
| S9 | JSON-LD Startseite | `inLanguage` nennt 5 Sprachen, 4 davon sind noindex · `lang="de"` gegen `de-CH` | klein |
| S10 | `/krankenkasse/` | 254 KB HTML (69 KB gzip), vor allem eingebettete SVG | klein |
| S11 | `/llms.txt` | Fehlt. Freiwillig | klein |
| ✅ | Sitemap = genau die indexierbaren URLs · Titel 52–61 Zeichen, Beschreibungen 130–158 Zeichen, 0 doppelte · canonical selbst · 1 H1 · 301-Weiterleitungen · erfundene Adresse 404 · 46 interne Links ohne Fehler | | gut |

## 4 · Nicht geprüft

Gerenderte Ansicht bei 375 px und im Dunkelmodus (kein Browser-Lauf), echte Screenreader-Ausgabe, Fokus-Reihenfolge im
Browser, Lighthouse und Core Web Vitals, Search-Console-Stand (eine andere Sitzung prüft die Seitenindexierung),
Suchvolumen, fachliche Richtigkeit der Texte, Inhalt der rm-Seiten, `npm audit`, `lint`, das Organigramm-HTML Zeile
für Zeile.

## 5 · Vorschlag: so gehen wir weiter

Kapitel für Kapitel, wie abgemacht. Je Kapitel zeige ich die Befunde mit Bild und Empfehlung (A/B/C), und Stebler
Studios entscheidet. Querschnittsthemen, die jedes Kapitel betreffen, kommen **einmal vorneweg**, damit sie nicht
siebenmal neu entschieden werden:

1. **Querschnitt Gestaltung:** Milchglas weg oder bleiben (G6), Mindestschrift 13 px (G7), sichtbare Feldränder (G5).
   Das sind drei kleine Bauteile mit Wirkung auf jeder Seite.
   Bild [Querschnitt 1](../design/querschnitt-1-gestaltung.html) (09.11.). Empfehlung **A-A** Papier mit Haarlinie statt
   Glas, **B-A** Boden 13 px und Grafiken einzeln bei 375 px messen, **C-A** neuer Token `feldrand` (hell `#808286`
   3,25:1, dunkel `#80838A` 3,33:1). ✅ **09.11.: C = A** (Stebler Studios: «c finde ich gut»). A und B
   zuerst nicht verstanden («a und b verstehe ich nicht») → an der echten App neu gezeigt
   ([Bild](../design/querschnitt-1-echt.html)). ✅ **09.11.: A und B = A** (Stebler Studios: «Ja, A und B»).
   Bau im Zweig `feat/querschnitt-1-gestaltung`.
2. **Querschnitt Formulare:** Fokus und Ansage in `FragenAblauf` (G4, U6), Vorlese-Knopf aus dem Label (U3/U4).
   ✅ **09.11.: gebaut** (Stebler Studios: «Ja, Querschnitt 2»), Zweig `feat/querschnitt-2-formulare` auf #770.
   Fokus auf die neue Frage («Frage 2 von 8: Welche Art von Grab?», im Browser geprüft), `gruppe`/`personen` als
   fieldset/legend je Rolle, Auswahlzeilen und «Warum» 44 px, Vorlese-Knopf 44 × 44 neben statt im Label.
   **Bewusst nicht übernommen: U13** (`autoComplete` für Name und Telefon). Die Felder im Fragen-Ablauf gelten
   anderen Menschen (Vertrauensperson, Ersatzperson); `autocomplete="name"` würde den eigenen Namen einsetzen.
3. **SEO-Weg:** Sprachfreigabe fr/it/en (G1) und 403 an den Sprachwurzeln (S6) gehören zusammen. Welche neuen
   Erklärseiten zuerst kommen (G2), ist ein Inhaltsentscheid und braucht den rechts- und swiss-precision-pruefer.
   **⟨Berichtigung 09.11., beim Start von Querschnitt 3⟩ G1 ist keine Lücke im Code, sondern eine gewollte Sperre.**
   `scripts/seiten-sprachen.mjs` gibt eine Sprache erst frei, wenn ein Mensch sie gelesen hat; der Prüfdurchgang
   durch Agenten (#692, gemergt 06.11.) ersetzt das ausdrücklich nicht. Offen laut Plan vom 05.11.: menschliche
   Lektüre (en, evtl. fr: Stebler Studios; it: Person mit Italienisch), drei Gesetzeszitate am Fedlex-Text
   (UWG Art. 3 fr/it, BV Art. 12 en), Entscheid zu den Stellen der Romandie und des Tessins. Der Satz in G1
   «im Code noch nicht umgesetzt» war zu kurz.
   **S6 · 403 an `/fr/` usw.:** Die `.htaccess` geht nicht mit dem Deploy (`deploy.sh` lädt sie nicht hoch, die
   Server-Datei pflegt Stebler Studios von Hand). Lösung, die mit dem normalen Deploy kommt: je Sprache eine kleine
   **Sprach-Startseite** `/fr/index.html` usw. mit der Liste der Erklärseiten dieser Sprache und dem Weg in die App
   (`/?lang=fr`). Solange die Sprache gesperrt ist, trägt sie wie die Unterseiten `noindex, follow`.
   ✅ **09.11.: gebaut** (Stebler Studios: «Ja, so») → Entwurfs-PR #775, Zweig `feat/seo-sprachwurzeln` (von `main`):
   Sprach-Startseiten, Startseiten-Titel «Maloja Plana — Prämienverbilligung, Steuern, Sozialhilfe» (S5), Lesebogen
   Englisch `docs/uebersetzung/lesebogen-en-2026-11.html` (133 Stellen, 56 gelb). **Offen bei Stebler Studios:** Englisch
   lesen; wer liest Französisch und Italienisch; Deploy. **Offen bei mir:** drei Gesetzeszitate am Fedlex-Text.
4. Danach die sieben Kapitel in der Ordnung des Dashboards: Basis · Wohnen · Finanzen · Versicherungen & Vorsorge ·
   Ausbildung & Arbeit · Behörden · Gesundheit.
   **Kapitel 1 · Persönliche Basis** (09.11.): Bild [kapitel-1-basis.html](../design/kapitel-1-basis.html). Gestaltung A Pfad-Pille
   bricht um · B Weg zu hoch auf dem Handy · C Knöpfe und Felder in Arial (app-weit, eine Zeile fehlt im Grundstil).
   Inhalt F1–F4 fehlende Voraussetzungen (EO, Bevorschussung, Einmischung in den Nachlass), F5–F9 klein. Sprache T1–T6
   (du/ihr gemischt, Italienisch Sie=du, Gesetzeskürzel bei «18 werden», Maskulin, Pronomen-Feld). ✅ **09.11.: alles wie
   empfohlen** (Stebler Studios: «Ja, alles»). Zwei Zweige: Gestaltung, Inhalt.
   ✅ **Gebaut:** Gestaltung → Entwurfs-PR #781 (auf #771) · Inhalt und Sprache → Entwurfs-PR #784 (von `main`), Fachsätze
   am Fedlex-Volltext geprüft (rechts-pruefer), 8625 Tests grün. Offen: menschliche Lektüre fr/it.
   **Kapitel 2 · Wohnen** (09.11.): Bild [kapitel-2-wohnen.html](../design/kapitel-2-wohnen.html). Gestaltung ohne Befund (ausser
   Überschriftenstufe). Inhalt hoch: W1 Genf «pro Zimmer» ohne «pro Jahr» · W2 Mietbeiträge-Ergebnis prüft nur Einkommen
   (Wohnsitz/Vermögen in Daten, nie verwendet) · W3 Sperrfrist OR 271a ohne Bedingung. Dazu W4–W13, Sprache S1–S7.
   ✅ **09.11.: alles wie empfohlen** (Stebler Studios: «Ja, alles»). Zweig `feat/kapitel-2-wohnen` (von `main`).
   ✅ **Gebaut** → Entwurfs-PR #792: Genf pro Jahr, Voraussetzungen im Mietbeiträge-Rechner, OR 271a, W4–W13, Sprache.
   rechts-pruefer mit Volltext, 8743 Tests grün. Offen: menschliche Lektüre fr/it.
   **Kapitel 3 · Finanzen** (09.11.): Bild [kapitel-3-finanzen.html](../design/kapitel-3-finanzen.html). Hoch: F1 Mindestlohn nach Wohn-
   statt Arbeitskanton · F2 Rechtsvorschlag «Gläubiger muss vor Gericht» (falsch bei Schuldanerkennung und Behörden) · F3
   Steuerrechner Fortbildung 10 000 statt 13 000, 3a unbegrenzt · F4 Sozialhilfe ohne Folgen für B/L/C · F5 «BVG übernommen»,
   Erbschafts-Satz. Dazu F6–F11, Gestaltung A–C + Felder < 44 px, Sprache S1–S7. ✅ **09.11.: alles wie empfohlen**
   (Stebler Studios: «Ja, alles»). Zweig `feat/kapitel-3-finanzen` (von `main`).
   **Kapitel 4 · Versicherungen & Vorsorge** (09.11.): Bild [kapitel-4-versicherungen.html](../design/kapitel-4-versicherungen.html).
   Hoch: V1 Rat «Unfalldeckung abwählen» ohne 8-Stunden-Bedingung (UVV Art. 13) · P1 IK-Auszug halbiert die AHV (B-17) ·
   P2 Zukunftsbild zahlt AHV ab 58 (B-18) · P3 früher beziehen ergibt ab 65 mehr (B-19) · P4 Zuschlag Frauen 1961–69 fehlt
   (AHVG Art. 34bis). Dazu V2–V5, P5–P9, Kleines, Gestaltung A–D, Sprache S1–S10. Vorschlag: zwei Zweige (Rechner-Logik ·
   Inhalt/Gestaltung/Sprache), Rätoromanisch offen. ✅ **09.11.: alles wie empfohlen** (Stebler Studios: «Ja, alles»).
   Zweige `feat/kapitel-4-rechner` (von `main`) und `feat/kapitel-4-versicherungen` (auf dem Befund-Zweig).
   ✅ **Gebaut (10.11.):** Rechner → Entwurfs-PR #806 (B-17–B-19, Rentenzuschlag Art. 34bis, 3a-Grenze, Hinweise;
   swiss-precision-pruefer am Volltext, Blocker behoben) · Inhalt, Gestaltung, Sprache → Entwurfs-PR #812, gestapelt auf #806
   (rechts-pruefer, fünf Sätze nachgeschärft). Zusammen 9301 Tests grün. Zwei Gestaltungs-Fehlbefunde im Blatt berichtigt.
   Offen: Lektüre fr/it/en, rm, Zuschlag in der 13. Rente (BSV), Witwen-Satz nach EGMR, Absätze teilen (S4).
5. **Die übrigen Seiten** (11.11.), im selben Verfahren wie die Kapitel. Inventar aus `ansichtenRegister.js`,
   `werkzeugRegister.js`, den `view === '…'`-Zweigen in `main.jsx`, den Umleitungen in `hashRouter.js` und `public/`;
   abgezogen, was die Blätter zu Kapitel 1–7 abdecken. Fünf Gruppen, Reihenfolge A → E. ✅ **11.11.: so** (Stebler
   Studios: «Ja, mit A anfangen»).
   A Einstieg & Orientierung (Übersicht, Menü, Suche, «Was steht mir zu?», Schnellcheck, Rucksack, Obstgarten,
   Onboarding, Rundgang, Hinweis fällige Erinnerungen) · B Ordnen & Unterlagen (Ablage, Was ansteht, Merkliste,
   Unterlagen drucken mit drei Dossiers, Briefe, Behördenlinks) · C Einstellungen & Vertrauen (Einstellungen mit
   Benachrichtigungen, Datensicherung, Rechtliches in der App, Beta-Tor, Sperrbildschirm, App installieren, Teilen/Flyer)
   · D Fachseiten ausserhalb der Kapitel (Stipendien in der App; Erklärseiten Was steht mir zu, Sozialhilfe, Steuern,
   Prämienverbilligung-Übersicht, Kantone im Vergleich, Krankenkasse «bewegt»; Nachprüfung Kantonsatlas, Politsystem)
   · E Website & Rahmen (Startseite, Sprach-Startseiten, Rechtliches statisch, 404, Wartung). Nicht dabei: die
   übersetzten Erklärseiten (Übersetzungs-Prüfung #692) und die 26 IPV-Kantonsseiten (separat geprüft).
   **Gruppe A · Einstieg & Orientierung** (11.11.): Bild [gruppe-a-einstieg.html](../design/gruppe-a-einstieg.html).
   Gut: Datenschutz-Aussagen stimmen am Code, drei klare Hinweise auf «Was steht mir zu?». Hoch: L1 Sozialhilfe-Karten
   und -Weg «ein Recht, kein Entgegenkommen» ohne Hinweis auf die Folgen für die Bewilligung B/L/C (AIG Art. 62 Abs. 1
   Bst. e, 63 Abs. 1 Bst. c, Fassung 1.11.2026). Mittel: L2 IPV ruht für F/N/S bei Sozialhilfe (AsylG Art. 82a Abs. 7)
   nur im Schnellcheck Schritt 1 gesagt, L3 Familien-EL ohne Wohnsitzdauer, L4 EL ohne Karenzfrist und Vermögen, L5 Reka
   (Alleinerziehende, keine Anreise), L6 «was Ihnen zusteht» im Onboarding, L7 Schnellcheck Schritt 3 ohne Hinweis, L8
   «sicher ablegen», L9 AHV-Mindestbeitrag nur bis 25. Gestaltung A fünf Eingänge zu «Was steht mir zu?» und drei
   IPV-Sätze, B vier Ordnungen (Kapitel, Werkzeug-Gruppen, Rucksack, Obstgarten) mit verschiedenen Zahlen, C zwei
   Fortschrittszahlen (62 % / 72 %), D drei Ebenen auf dem ersten Bildschirm. Sprache S1–S7. Onboarding nur am Code
   (Beta-Tor). Zweig `befund/gruppe-a-einstieg` (von `main`), nur Befund, gebaut ist nichts.
   ✅ **11.11.: Inhalt und Sprache, dazu D** (Stebler Studios: «Nur Inhalt und Sprache», dann «d aus gestaltung darfst
   du auch gerne noch dazu machen bitte (a, b & c mal notieren bitte damit wirs nochmals anschauen aber weiter machen
   können)»). Gebaut im selben Zweig: L1 Satz zur Bewilligung an allen Sozialhilfe-Karten und -Wegen (ohne Schweizer
   Pass), L2 «IPV ruht» für F/N/S, L3–L9, das Kleine, S1–S7, D (Startbildschirm-Karte erst nach dem Rundgang,
   «Frühe Version» als Zeile). Test `gruppeAEinstieg.test.js`, Startbündel 64 979 / 65 000 Bytes.
   rechts-pruefer nach dem Bau eingearbeitet. **Blocker:** der Satz zur Bewilligung erschien auch bei N und S, für die
   AIG Art. 62/63 nicht gilt (keine AIG-Bewilligung; Widerruf S nach AsylG Art. 78 ohne Sozialhilfe), und bei F in
   falscher Form → N, S, G ohne Satz, F mit eigenem Satz (Familiennachzug AIG Art. 85c Abs. 1 Bst. c, Bewilligung
   Art. 84 Abs. 5), Nationalität «Schweiz» schliesst aus. Nachgeschärft: SERAFE en, AHV «bis Ende des Jahres»,
   Familienzulagen ATSG Art. 24 (fünf Jahre) und ohne EL, Mutterschaftsbeihilfe «teils» und Kind unter zwei Jahren,
   EL bei Beeinträchtigung mit IV-Rente oder Hilflosenentschädigung, Reka 200 Franken nur Familienferien,
   `kompassIdle`. Vorgemerkt: S-Ausweise mit Anspruch auf Bewilligung ab März 2027 (AsylG Art. 74 Abs. 2).
   Entwurfs-PR #845.
   **Gruppe B · Ordnen & Unterlagen** (11.11.): Bild [gruppe-b-unterlagen.html](../design/gruppe-b-unterlagen.html).
   Ablage, Was ansteht, Merkliste, Unterlagen drucken (Lebensmappe, Behörden-, Notfall-Dossier), 13 Briefvorlagen,
   Offizielle Links. Gut: Rechtsvorschlag, Einsprache gegen die Kündigung, Mahnung, Todesfall wörtlich am Gesetz; keine
   erfundenen Aufbewahrungsfristen; 127 Links, keiner tot. Hoch: L1 Mietkündigung ohne Zustimmung des Ehegatten bzw. der
   eingetragenen Partnerin oder des Partners bei der Familienwohnung — ohne sie nichtig (OR Art. 266m, 266o); der Hinweis
   wird beim Drucken ausgeblendet. Mittel: L2 Kassenwechsel-Brief kündigt ab 1.12. auf einen unmöglichen Termin
   (KVG Art. 7 Abs. 2) — vor dem 1. Dezember bauen, L3 Ausstände und Art. 7 Abs. 5 fehlen, L4 Kalender-Vorlage
   «Steuererklärung Frist» auf heute + 120 Tage, L5 Kassen-Vorlage ohne Werktag, L6 «Rechnung beanstanden» ohne
   Verfügung (ATSG Art. 49, 51), L7 «sicher» in der Ablage, L8 Organspende-Register gibt es noch nicht. Gestaltung A
   Brief antippen: nichts geschieht (Formular 3700 px tiefer), B Bücherregal mit senkrechter Schrift, Kantonslinks erst
   bei 1250 px, C Was ansteht 4 px zu breit, Löschen über den Tagesstreifen, D Ablage-Titel bricht falsch. Sprache S1–S7
   (it-Links deutsch). Frage zu den Herzensempfehlungen. Zweig `befund/gruppe-b-unterlagen`, gestapelt auf #845, nur
   Befund, gebaut ist nichts.
   ✅ **11.11.: alles ausser dem Bücherregal** (Stebler Studios: «alles so bauen bis aufs bücherregal das müssen wir
   nochbesprechen»). Gebaut im selben Zweig: L1 zweite Unterschrift «Zustimmung … (OR Art. 266m)» je nach Zivilstand,
   L2 Kassenwechsel nennt das Jahr und springt nach der Frist aufs nächste, L3–L8, Kleines, Gestaltung A (Brief antippen
   springt zum Formular), C (375 px, Löschen am Eintrag mit Rückgängig — ändert Entwurf G vom 27.10., Reiter «Termine»),
   D («Dokumenten-ablage»), Sprache S1–S7 (it-Links, Grussformeln, «so früh wie möglich»). rechts-pruefer nach dem Bau:
   **Blocker** — der Ablage-Satz versprach eine Tresor-Sperre, die nicht eingebaut ist → «im Browser-Speicher
   unverschlüsselt»; dazu sieben Nachschärfungen. Test `gruppeBUnterlagen.test.js`. **Zum Besprechen:** Bücherregal (B).
   Nebenbefund: Landschaftsband der Kapitelseiten −24 px, vermutlich 4 px Überbreite.
   **Notiert, nicht gebaut — gemeinsam ansehen:** A ein Eingang zu «Was steht mir zu?» und ein IPV-Satz · B vier
   Ordnungen (angleichen oder den 7 Kapiteln folgen) · C eine Fortschrittszahl · Suchwörter (Register im Startbündel).
   **Restrunde 11.11. abends** (Entscheidblatt mit Handy-Bildern 375 px vom gebauten Stand `c7bffc56`:
   `stebler-studios/analysen/maloja-gruppen-rest-2026-11-11/`). ⏸️ **Gruppen A, B, C, D, E: nach dem nächsten
   Deploy** (Stebler Studios: «halte diese situation zu erst mal so fest … und dann kommen wir nach dem nächsten deploy
   wieder auf dieses dokument zurück und können entscheiden»). Empfohlen und dort wieder aufzunehmen — A: ein Eingang zu
   «Was steht mir zu?» und ein IPV-Satz aus `ipvAnzeige`; vier Ordnungen nur angleichen (Neuordnung nach Kapiteln
   später, eigener Entscheid); eine Fortschrittszahl aus `gesamtVollstaendigkeit`; Suchwörter erst nach dem einen
   Eingang, wenn das Startbündel Platz hat. B: Bücherregal mit «Ihr Kanton» zuerst und liegender Schrift; Löschen am
   Eintrag (Änderung von Entwurf G) bestätigen; «Nexter» ohne Link, bis die richtige Adresse da ist —
   `crewz.io/de/nexter/` heisst heute (gemessen 11.11.) «Roved – das Trinkspiel für unvergessliche Abende».
   ✅ **Quer: «Alle drei wie empfohlen».** Q1 Landschaftsband der Kapitelseiten `margin: '0 -20px'` wie main
   (gemessen vorher 379 px, nachher alle sieben Kapitel 375 px). Q2 Wächter: `activateTresor` wird nirgends
   aufgerufen, und kein Satz zur Ablage sagt in einer der fünf Sprachen Verschlüsselung zu (Erlaubnisliste der
   gelesenen Sätze). Test `querBandTresor.test.js`, Mutationsprobe beider Teile rot aus dem richtigen Grund. Q3 Test
   «Stand der Lebenslagen» (`gruppeAEinstieg.test.js`) bleibt: er wird am 1.1.2027 rot, das ist der Wecker; Nachprüfung 16.12.2026.
   **Gruppe C · Einstellungen & Vertrauen** (11.11.): Bild [gruppe-c-vertrauen.html](../design/gruppe-c-vertrauen.html).
   Gut: Datenschutz-Aussagen stimmen am Code (kein `fetch`/`sendBeacon`, CSP nur `'self'`, Beispiel speichert nichts),
   Sicherung standardmässig AES-256-GCM, Import geprüft und ganz oder gar nicht, «Alle Daten löschen» vorbildlich,
   App-Text und statische Rechtsseite gleich. Hoch: L1 vier Benachrichtigungs-Schalter, drei davon («30 Tage vor
   Ablauf», Gesundheit, Bewilligung/Steuer/RAV) tut kein Code, der vierte prüft nur beim Öffnen und ignoriert den
   Schalter · L2 die goldenen Knöpfe JSON/CSV/Manifest ganz oben sind keine Sicherung (ohne Dokumente, Erinnerungen,
   Kontakte, Merkliste, unverschlüsselt), lassen sich aber einspielen. Mittel: L3 Installieren zeigt auf
   `malojaplana.ch` statt `/app/` (Website ohne Manifest, live gemessen), L4 iCloud/OneDrive-Download, L5 was in der
   unverschlüsselten Datei steht, L6 Weg «Werkzeuge → Export» gibt es nicht, L7 «Exportieren, um Platz zu schaffen»,
   L8 «sicher» in der Ablage. Sicherheit: T1 Teilen-Empfang nimmt POST von fremden Seiten an (erst am echten
   Android-Teilen messen), T2 Beta-Code im Klartext in einer Doku des öffentlichen Repos (Entscheid K105 offen), T3
   PBKDF2 100 000 statt 600 000, T4 Kleines. Gestaltung A Schalter zeigen ihren Zustand nicht («Hell» = Handlung),
   B Benachrichtigungen lang und Schalter kaum sichtbar, C auf der Sicherungsseite ist der unsichere Weg am lautesten,
   D Beta-Tor hell im Dunkelmodus und ohne Weg zum Code. Sprache S1–S10. Rechtsartikel (nDSG Art. 25, 28; UWG Art. 3
   Abs. 1 Bst. s) nicht am Fedlex-Volltext geprüft; Impressum-Anschrift bleibt offen und unverändert. Zweig
   `befund/gruppe-c-vertrauen` (von `main`), Entwurfs-PR #846.
   ✅ **11.11.: Sprache, Inhalt und Gestaltung** (Stebler Studios: «hier sprache inhalt und gestaltung»), dazu beim
   Beta-Tor «Zeile raus, Code wechseln». Gebaut im selben Zweig: L1–L8 und das Kleine, S1–S10, Gestaltung A–D, die
   Doku-Zeile mit dem alten Code entfernt. Den neuen Code wählt Stebler Studios; im Repo steht nur sein Fingerabdruck.
   **Notiert, nicht gebaut:** T1 Teilen-Empfang (erst am echten Android-Teilen messen), T3 Runden der Ableitung
   (neues Dateiformat), T4 Kleines; Impressum-Anschrift bleibt offen.
   Wächter `gruppeCVertrauen.test.js`, rechts-pruefer mit DSG-Volltext (Art. 25, Fassung 1.9.2023). Nicht im Browser
   angesehen (alle Server-Plätze belegt). **Offen bei Stebler Studios:** neuen Beta-Code wählen (der alte steht in
   der git-Historie), Deploy.
   ⏸️ **Restrunde 11.11. abends: nach dem nächsten Deploy** (Stebler Studios: «halte diese situation zu erst mal so
   fest … nach dem nächsten deploy wieder auf dieses dokument zurück»; Entscheidblatt
   `stebler-studios/analysen/maloja-gruppen-rest-2026-11-11/`). Empfohlen und dort wieder aufzunehmen: den neuen
   Beta-Code setzt Stebler Studios selbst (nur der Fingerabdruck ins Repo, der Code nie in einen Chat); T1
   Teilen-Empfang am echten Android-Teilen messen und T3 Ableitung (neues Dateiformat, alte Sicherungen lesbar)
   später; Impressum-Anschrift — Postfach eintragen oder bis zur Antwort auf F2a warten (gleich wie Gruppe E, L1).

Was technisch nur aufräumt (G9, A2–A9, T4), kann gebündelt in einem eigenen Zweig laufen, ohne Gestaltungsentscheid.
