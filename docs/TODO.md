# Maloja Plana — Master-TODO

*Konsolidierte Arbeitsliste (Stand 2026-06-24). Quelle: Experten-Audits + Brand-Identity +
Braindumps. Schnellste Wins zuerst. ✅ = erledigt · 🔴 hoch · 🟠 mittel · 🟡 grösser/später.*

> ⏳ **In Arbeit (Hintergrund-Agenten):** Website/UX-Experte + Marketing-Review — Feedback
> wird hier ergänzt, sobald sie liefern.

## ✅ Erledigt 2026-06-24 (diese Session)

**Von mir (committet):** Domain-Fix (SEO) · README neu (on-brand, „Menschen in der Schweiz") ·
BetaGate-Intro (Gesicht vor dem Passwort + Kontrast-Fix) · Lizenz MIT→AGPL (5 Sprachen) ·
Benachrichtigungen→Kuhglocke · og-image (Granit + Gipfel-M) · OFL-Lizenzhinweis ·
Abschiedsagentur-Empfehlung · Bergketten-Karte (Granit-Opacity).
**Von Agenten (committet):** Autocomplete-A11y (Combobox) · palette.soft-Kontrast (AA) ·
Service-Worker-Offline-Fix · doctors.label · Fortschrittskarte-Icons · IPV-Crosslinks.

**Noch offen → siehe unten.** Die meisten verbleibenden Punkte sind grösser (Voice-Toggle,
Atkinson, hreflang) oder brauchen einen Entscheid von Stebler Studios (Hero-Copy, Export-Icon).

## ✅ Erledigt 2026-06-25 (Fortsetzungs-Session)

- **Heading-Hierarchie** app-weit gefixt (genau ein h1/View) · **Crosslinks gebündelt**
  (monthlyIncome → eine „Passende Werkzeuge"-Box) — `50a56b0`
- **Arbeitslosenkassen-Rechner** (ALV-Taggeld, verifizierte SECO-Werte 2025, +15 Tests) — `21ceab9`
- **Freiwilligenarbeit/Integrationszulage** im Sozialhilfe-Rechner sichtbar (CHF 100, SKOS) — `f03fb26`
- **Architektur-Check:** Kantonsdaten bereits sauber; verwaistes `name`-Feld entfernt — `a2e0c7f`
- **Bedingte Sektion** (Alimente klappt ohne Kinder ein, bleibt erkundbar; ehrliche
  Orientierung statt Zahlen-Rechner) — `fe333b2`
- **Stipendien Inkr. 2** (interaktiver Berechtigungs-Check statt 26 Einkommensgrenzen) — `efe7174`
- A11y-Audit-Wins bereits zuvor erledigt: Autocomplete-Combobox, ✕-Button-`aria-label`,
  Feld-Labels, `doctors.label` (5 Sprachen).

---

## A — Schnelle Wins (Accessibility & i18n, aus Experten-Audit)

- ✅ **Autocomplete tastaturbedienbar** (Medication/Disease → WCAG-Combobox, Pfeiltasten/Enter).
- ✅ **✕-Buttons `aria-label`** (DoctorManager, MedicationManager, DiseaseManager).
- ✅ **Feld-Labels** verknüpft (per `aria-label` an allen Manager-Feldern + Onboarding/Sozialhilfe).
- ✅ **`doctors.label`** in allen 5 i18n vorhanden.
- 🟡 `rm.js` verwaiste Alt-Keys bereinigen — **analysiert 2026-06-27**, Bulk-Löschung
  zurückgestellt (siehe Begründung):
  - Referenz ist **en.js** (`DEFAULT_LANG = 'en'`, nicht de). Vergleich rm↔en + Code-Referenz-Check
    (Wortgrenze): **129 Pfade sind nachweislich tot** (in en abwesend + 0 Code-Referenzen) — alte
    Alt-Keys aus früherer Struktur (`sections`/`sectionIntros`/`chapterStatus`/`guidedStart`/
    `progress`/alte `onboarding.*`/`trust.*`/`error.*`/`storage`/`backup` + viele `chapters.*.fields/docs/options`).
  - **Kein „ganzer Block"-Shortcut:** alle 129 sind verstreute Einzel-Keys in gemischten Blöcken.
  - **Skript-Pass als nicht praktikabel erwiesen (2026-06-27):** viele Orphans liegen als
    inline-Mehrfach-Key-Objekte auf *einer* Zeile (`finanzen: { income:…, expenses:…, budget:… }`)
    → zeilenweises Löschen unzuverlässig (Scanner-Test: 294 verfehlt/81 falsch); sauber ginge nur
    ein AST-Parser + Reprint, der aber die ganze Datei neu formatiert (riesiger Diff, Kollision mit
    Agenten). **0 sichtbarer Nutzen** (~10 kB) → Bulk-Löschung bewusst gelassen, Analyse dokumentiert.
  - ✅ **Nebenbefund behoben:** 2 der Kandidaten (`kkModel.options.basic`/`.comfort`) waren NICHT
    tot — KKScanner nutzt sie, aber sie fehlten in en/de/fr/it → Dropdown zeigte rohen Key-String.
    Keys ergänzt (Commit zu kkModel basic/comfort).
  - ✅ **Nebenbefund behoben:** `de.js` fehlten `asyl` (de) + `flyer` (de+it) komplett → deutsche/
    italienische Nutzer sahen den **englischen** Fallback. Beide Blöcke übersetzt & ergänzt
    (Commits `feccf55` asyl-de, flyer-de+it), Key-Parität mit en verifiziert, im Preview bestätigt.
    asyl ⚠️ rechtlich sensibel → fachliche Review vor Deploy empfohlen.

## B — Berechnungen (vor Fixes offizielle Quelle prüfen!)

- ✅ `estimateTaxSavings` + irreführende Kachel entfernt (IPV ist steuerfrei).
- ✅ AHV Vorbezug-Kürzung war bereits 6.8 %/Jahr (korrekt).
- ✅ Mindestlohn TI/NE 2025 aktualisiert · `CANTONAL_DATA_VERSION` ergänzt.
- ✅ AHV-Rente als Schätzung labeln — bereits erledigt: Label „Geschätzte AHV-Altersrente"/
  „Geschätzte BVG-Rente" + gerenderte Source-Zeile „Schätzung nach AHVG/BVG … Keine
  rechtsverbindliche Auskunft." (`VorsorgeRechner.jsx:309`).
- 🟡 **AHV-21-Referenzalter der Frauen (Übergangsgeneration) — Scoped Task, zur Prüfung.**
  `berechneAltersrente` rechnet mit pauschalem Referenzalter 65; für Frauen JG 1961–1964 ist es
  gestaffelt tiefer (AHV 21), zudem fehlt `geschlecht` als Input. Aufgeworfen beim Lint-Cleanup
  2026-07 (ungenutztes `geburtsjahr`). Voller Plan + Tabelle + Testfälle + Quellen:
  `docs/roadmap/TASK_ahv21-referenzalter-frauen.md`. Vor Umsetzung `swiss-precision-pruefer`.

## C — Design / Calm-UX (aus Audit)

- ✅ **BUG (Handy): Kopfzeile lief horizontal über — GEFIXT (2026-06-28).** *Gemeldet Stebler Studios
  (iPhone, Screenshots Basis/Wohnen/Steuern/Ausbildung + Dashboard-Kachel „Dokumentenablage"
  abgeschnitten).* Ursache: Header-Controls-Reihe (Vorlesen + Aa + Sie/Du + Sprach-Dropdown +
  Dunkel + ☰) war ~373 px breit, nicht umbrechend → Dokument 460 px > 390 px Viewport (70 px
  Überhang) → seitlich scrollbar, rechts toter Streifen, rechte Spalte/Kacheltext abgeschnitten.
  **Fix:** `flexWrap: 'wrap'` auf `<header>` UND auf der Controls-`div` (+ `justifyContent:
  flex-end`) in `main.jsx` → Controls brechen auf schmalen Screens um statt überzulaufen.
  **Verifiziert @390 px:** overflow 0 px (war 70), 0 Offender, „Dokumentenablage" vollständig &
  nicht geclippt; @1280 px Header weiterhin einreihig (kein Desktop-Regress). Build grün, 354
  Tests grün. ✅ **Polish-Follow-up erledigt (Commit `774befc`):** Sekundär-Controls auf Mobile
  (<560px) ins ☰-Menü ("Ansicht & Sprache") eingeklappt → Kopfzeile nur Logo + ☰. Desktop
  unverändert, keine Dopplung im Drawer.
- ✅ **Service-Worker-Auto-Update — GEFIXT (2026-06-28, Commit `57f9f6b`).** Registrierung jetzt mit
  `updateViaCache:'none'`, `controllerchange`→einmaliges Reload, `registration.update()` beim Laden
  + bei `visibilitychange` (PWA aus Hintergrund). Cache `v8→v9`. HTML war schon network-first.
  → Deploys kommen ohne Hard-Refresh an. (Einmalig muss ein Altgerät noch raus aus dem alten SW:
  PWA/Tab ganz schliessen + neu öffnen.)
- ✅ **Datumsfelder: klares Picker-Symbol — GEFIXT (2026-06-28).** *Gemeldet Stebler Studios: „man kann
  kein Datum auswählen".* Felder waren seit Anfang `<input type=date>` (nativ pickbar), aber iOS
  rendert ein leeres Datumsfeld als blanke Box ohne sichtbares Symbol → wirkt nicht auswählbar.
  **Fix:** eigenes, immer sichtbares Kalender-Symbol in jedem ChapterView-Datumsfeld (ruft
  `showPicker()` mit `focus()`-Fallback), natives Indikator-Icon via `.mp-date-input` (tokens.css)
  ausgeblendet → einheitlich auf allen Geräten. Betrifft alle 5 Datumsfelder (Geburtsdatum,
  Einzugsdatum, Finanz-Startdatum, Anstellung seit, Steuererklärung fällig). Neuer i18n-Key
  `common.pickDate` (5 Sprachen). Verifiziert: Symbol sichtbar, Datum setzt/löscht sauber, 0
  Konsolen-Fehler, 354 Tests grün.
- ✅ IPV-„KPI-Kacheln" → ruhige Zeilen-Liste (Muster ChapterView-Versicherungsübersicht).
  `PremiumSubsidy.jsx` rendert das Ergebnis als umrandete Box mit gestapelten Label/Wert-Zeilen
  (`text.body`, dezente Trenner) — keine grossen KPI-Zahlen mehr. Kantons-Vergleich liegt im
  eingeklappten `<details>`. (Per Code-Inspektion 2026-06-27 verifiziert.)
- ✅ Zu viele Crosslink-Buttons gebündelt (monthlyIncome → eine „Passende Werkzeuge"-Box).
- ✅ Hover `scale(1.12)`→`1.04` — bereits erledigt (Dashboard nutzt 1.04; keine 1.12-Hover mehr;
  die einzigen grösseren Scales sind legitime One-Shot-Keyframes `mp-stamp`/`mp-check-pop`).
- ⏭️ Token-Ausreisser (px/Farben) — **untersucht (2026-06-27), grösstenteils False-Positive,
  nicht weiterverfolgt:** die häufigen borderRadius 2/3/4px haben kein Token-Äquivalent (kleinstes
  = sm=6); die meisten „hartcodierten" Hex stecken in Print-/Export-HTML-Strings (können die
  JS-Palette nicht nutzen) oder sind Kontrast-/Verlaufsfarben. 155-Stellen-Sweep = Regressionsrisiko
  bei ~null sichtbarem Nutzen. Bei Bedarf gezielt einzelne echte Fälle, nicht als Sweep.
- Prinzip: Entschlacken via Disclosure/Dropdown, **nie löschen** (Landkarte = Identität).

## C2 — 🎨 Design-Vision: Skeuomorphismus als Metaphern-Sammlung (Stebler Studios, BD 2026-06-29)

> **Status: Inspiration / „bis wir dahin kommen" — NICHT jetzt bauen, eigene Design-Phase, schritt-für-schritt gemeinsam.**

**Kern-Prinzip (wichtiger als der Stil):** NICHT „Papiertexturen draufklatschen / alles wie altes Papier". Sondern: *jede Funktion bekommt die Metapher des realen Gegenstands, den unser Gehirn damit verbindet.* Maloja = kein Stil, sondern eine **Sammlung von Metaphern** → eine „sorgfältig zusammengestellte Lebenswerkzeugkiste". Hochwertig, nicht cartoonhaft. (Evolviert die bisherige Papier-Pendant-Optik: Papier ist nur EINE Metapher unter vielen.)

Metaphern-Map pro Bereich:
- 🏥 **Gesundheit** = Leder-Arztkoffer; KK/Hausarzt/Medikamente/Impfungen/Notfall/KVG „wie Instrumente" darin.
- 🗂 **KVG-Katalog** = KEIN Papier → **Karteikartenbox / med. Nachschlagewerk** (Register, Trenner, Laschen, Indexkarten, Checkbox-Liste) „wie eine Praxis". ← künftiger Skin für den Katalog, den wir gerade inhaltlich bauen (Faden 3-II).
- 📂 **Dokumente** = Aktenschrank (Ordner, Mappen, farbige Tabs, herausziehen).
- 💰 **Budget** = Thermobeleg/Quittung (Coop-Stil) für den **Monatsabschluss** (nicht jede Seite).
- 💳 **Konto** = schlichtes Banking, KEINE Metapher.
- 💸 **Schulden** = echter Betreibungs-/Verlustschein-Look (Siegel, Stempel, Aktenzeichen, Wasserzeichen) — offiziell, real, NICHT vergilbt, nicht negativ.
- 📅 **Kalender** = hochwertiger Planer (Moleskine/Leuchtturm/Apple-Mix), KEIN Papier.
- 🏠 **Wohnen** = kleines Haus, Zimmer = Themen (Wohnzimmer→Haftpflicht, Küche→Hausrat, Schlafzimmer→Mietvertrag, Bad→Nebenkosten). Subtil.
- 🚗 **Mobilität** = Fahrzeugmappe (Führerschein→Versicherung→Service→Vignette→Motorfahrzeugsteuer).
- 👶 **Familie** = elegantes Fotoalbum / Familienordner.
- ⚖ **Behörden** = grauer Schweizer Verwaltungs-/Bundesordner (Laschen, Register).
- 💼 **Arbeit** = Bewerbungsmappe (Leder): CV, Zeugnisse, Bewerbungen, Verträge, Lohnabrechnungen.
- 💡 **Ideen** = Notizbuch (Field Notes / Moleskine).
- 🌱 **Ziele** = **Lebensbaum als Navigation** (Alleinstellungsmerkmal): Stamm + Äste = Lebensbereiche, hineinzoomen, Äste wachsen, Früchte = erledigte Ziele, Knospen = neue Aufgaben.
- 🔍 **Schnellchecks** = KEIN Papier → **Instrumente**: Bonität→Tachometer, Versicherung→Schutzschild, Budget→Tankanzeige, Stress→Pulsmesser, Organisation→Kompass.
- 📈 **Analysen** = modern/„Apple" (Glas, Charts), keine Metapher.

Designprinzip-Satz: *„Jeder Bereich verwendet die reale Metapher, die Menschen intuitiv mit diesem Lebensbereich verbinden."* Gehört bei Umsetzung ins UX-Playbook.

**Erweiterung 2 — „Lebenswerkstatt" (ganze Welt):** übergeordnetes Prinzip *„Jeder Bildschirm erzählt eine Geschichte und jedes Objekt hat einen Zweck."* Maloja = **digitale Schweizer Lebenszentrale**, kein Finanz-Tool.
- **Zwei Leit-Symbole:** 🌳 Baum bleibt zentral („Wo stehe ich im Leben?"); 🌊 **Leuchtturm = Guide** (Fristen/Risiken/Lücken/neue Gesetze/Erinnerungen → sendet *Licht* statt roter Warnung, Orientierung statt Angst); 🧭 Kompass = Entscheidungen.
- **Weitere Modul-Metaphern:** Wanderkarte=Lebensweg · Rucksack=Mitnehmen · Werkzeugkiste=Generatoren · Bibliothek=Wissen (≠ Dokumente) · Bankschalter=Finanzen (modern) · Amtsschalter=Behörden · Briefkasten=Posteingang · Karteikasten=Kontakte · Agenda=Kalender · echte Registerkarten (nicht Tabs) · Labor=Gesundheitswerte · Whiteboard=Analysen · Kartenetui/Ausweismappe=Karten/Ausweise · Tresor=Sicherheit · Wetterstation=Lebensstatus (☀️🌤🌧⛈) · Gewächshaus=langfristige Ziele · Umzugskarton=Umzug · Chronik=Lebensereignisse.
- **🇨🇭 Schweizer DNA, NIE kitschig** (keine Edelweiss/Kühe), nur Materialien/Details/Easter Eggs; Holz sparsam.
- **Natur/Berge subtil (Apple-Niveau):** Jahreszeiten, Nebel, Schnee, Tiere (Eichhörnchen/Fuchs/Murmeltier/Steinbock/Bartgeier); Himmel klart auf je organisierter (Nebel→Berge→Panorama).
- **Lebensbaum mit Jahreszeiten:** Knospen/grün/Früchte/Ruhe; neues Ziel→Ast, neues Kapitel→Stammabschnitt; Früchte je Bereich (Finanzen🍏/Gesundheit🌿/Familie🌸/Beruf🍇).
- **Achievements OHNE Gamification-Optik:** Schweizer Steine (Bergkristall/Granit/Schiefer), Gipfel=große Ziele, Wanderabzeichen; statt Coins → Kompetenz/Vertrauen/Ordnung. **Stempel als Feedback** (EINGEREICHT/AKZEPTIERT/…). Lagerfeuer=Tagesabschluss, Alphütte=Safe Space, Füllfederhalter=Unterschrift.
- **Seltene Überraschungen:** 1. August Feuerwerk, Weihnachten Schnee+Lichter, Geburtstag Wimpel, 100% → Eule im Baum für einen Tag.
- **Kern-These:** *Gamification darf NIE wie Gamification aussehen* — kein XP/Diamanten/Level. Sondern: „das Leben fühlt sich jedes Mal ein bisschen schöner, ruhiger, vollständiger an." Vertrauter Begleiter durchs Leben = Identität. (Volle Map im Gedächtnis-File project_skeuomorphism_metaphors.)

## D — Brand Identity (Rest der Umsetzung)

- ✅ Farben (Granit), Wortmarke (Gipfel-M), Typografie (Lexend/Hanken), Voice-Entscheid
- ✅ Icons: Übersicht=Sackmesser, Charts=Schoggi, Kalender=heutiger Tag, Schutzrecht-Fixes
- ✅ Bergketten-Karte sichtbar (Granit-Opacity nachgezogen)
- 🟠 **Export-Icon** — neue Metapher (warten auf Tester-Feedback)
- ✅ **Benachrichtigungen → Kuhglocke** — bereits erledigt: `cowbell` konsistent in MobileNav,
  CalendarReminders, NotificationSettings, OverdueBanner; kein Zahnrad mehr dafür (per Grep 2026-06-27).
- ⏭️ **Uhr → Frist/Zeit** — **reproduce-first 2026-07-18: kein Bau-Punkt.** Der `kalenderUhr`-Icon
  (Bahnhofsuhr, `IconSystem.jsx`) existiert, wird aber **nirgends verwendet** (0 Referenzen ausserhalb
  der Registry). Es gibt keine aktive „Uhr"-Stelle zum Umdeuten; ihn irgendwo als Frist/Zeit zu
  verdrahten wäre ein Design-Entscheid (gehört in IDEEN.md), keine mechanische Umstellung.
- ✅ `og-image.svg` aufs Gipfel-M + Granit — bereits erledigt: SVG hat Maloja-Pass-Polyline +
  Goldpunkt, Granit-Palette, Hanken-Wortmarke; PNG regeneriert (`public/og-image.{svg,png}`).
- ⏭️ Signet-Farben (Ordner+Berg+Pass) an Granit — **gegenstandslos (2026-06-27):** das
  illustrative Ordner+Berg+Pass-Signet existiert nur als Brief (`logo-brief.md`), nicht als
  Asset. Aktiv genutzt wird das Gipfel-M (Wortmarke/App-Icon), bereits Granit. `src/assets/logo.svg`
  ist ein ungenutztes (kein Import), farb-neutrales Bergketten-Linien-Icon → nichts umzufärben.
  Erst relevant, falls das Signet wirklich gebaut wird.
- 🟡 **Voice/Anrede-Toggle (Sie/Du)** implementieren + Atkinson-Font wiren (Accessibility)
- ✅ OFL-Lizenztexte zu den WOFF2 legen — `public/fonts/OFL.txt` (exakte Upstream-Header + voller
  OFL-1.1-Text) + `README.md`; wird nach `dist/fonts/` ausgeliefert (Commit `5f1c40d`).
- 🟡 Wortmarke für Produktion in Pfade outlinen *(Design-Asset, offen)*
- ✅ Brand Guidelines in *ein* Dokument bündeln → `docs/brand/brand-guidelines.md`

## E — Inhalt

- 🟠 **Herzensempfehlung Leihlager** (`heartfelt10`) — braucht Name + URL von Stebler Studios.
- ✅ Abschiedsagentur (`heartfelt9`, alle 5 Sprachen)
- ✅ **Quellen/Links-Check** (erneut 2026-06-27): 121 externe URLs geprüft (27 neue Asyl/Stipendien
  + 94 direktLinks). **0 echte tote Links** — alle 2xx/3xx; einzig 3× `baselland.ch` 403 = bekannter
  WAF-False-Positive (im echten Browser gültig, siehe [[link-check]]). Asyl-Orgs (SEM/Caritas/HEKS/
  SFH/SRK/EPER) + Stipendien (EDK/SBFI/stipendium.ch) alle 200.

## F — Grössere Features (Stebler Studios wählt Reihenfolge)

- ✅ **Stipendien** — Berechtigungs-Check (Inkr. 2). Offen: Antrags-Generator; präziser Betrags-Rechner bewusst nicht gebaut.
- ✅ **Arbeitslosenkassen-Rechner** (ALV-Taggeld 70/80%, Wartetage, Höchstbetrag; SECO 2025).
- ✅ **Adressen-Autocomplete (lokal)** — PLZ→Gemeinde/Kanton offline aus der geb. PLZ-DB
  (`searchPLZ`/`gemeindeFromPLZ`); PLZ-Eingabe füllt jetzt Stadt **und** Kanton automatisch.
  Kein externer Call, CSP bleibt strikt. Privacy-konform — passt zur Marke. (Commit `e7c104e`)
  - 🔵 **Backlog (Erweiterung):** Strassen-Level via Nominatim/OSM — nur falls gewünscht;
    bräuchte externe Calls + CSP-Lockerung + Adress-PII verlässt das Gerät (bricht
    Offline-/Privacy-Versprechen, heikel für Asyl-Zielgruppe).
  - ✅ **Lokales Vorschlags-Dropdown gebaut** (`PLZAutocomplete.jsx`, Commit `7dcc7f3`): PLZ tippen →
    „PLZ — Gemeinde (Kanton)"-Vorschläge, Auswahl füllt PLZ + Stadt (löst Mehrdeutigkeit), Kanton via
    Sync. ARIA-Combobox, Pfeiltasten/Enter/Escape. Im Wohnen-Feld aktiv. Offline, CSP strikt.
- 🟡 **SEO** verbessern (mehrsprachig, hreflang, CH-Keywords).
- ✅ **Architektur aufräumen** (Kantonsdaten-Check: bereits sauber; verwaistes name-Feld entfernt).
- 🔵 **Asylwesen** + Sprach-Dropdown (mehr Sprachen) — eigenes grosses strategisches Thema.

## G — Legal / Stebler Studios

- 🟡 Handelsregister prüfen · **Markenschutz „Maloja Plana"/Gipfel-M beim IGE** (~CHF 550)
- 🟡 Rechnungsvorlage · info@malojaplana.ch Postfach einrichten

## H — Website/UX-Audit (Agenten-Feedback ✅ eingegangen)

*WebFetch war für den Agenten gesperrt → „verlinkte Seiten"-Teil aus Allgemeinwissen, nicht live.*

**🔴 Sofort:**
- **BetaGate = nackte Passwort-Wand** (`BetaGate.jsx`, wrappt App in `main.jsx:662`) → ruhige
  Intro + Lokal-Badge + Impressum/Datenschutz-Link + „von Stebler Studios, Basel" davor. Idee:
  Legal-Seiten ohne Code erreichbar machen, nur die App gaten.
- **Lizenz-Widerspruch** → `legal.terms.ip1` sagt MIT, Projekt ist AGPL-3.0 → in allen 5 i18n fixen.

**🟠 Mittel:**
- BetaGate-Button Kontrast: weiss auf `palette.sand` → `#000` (wie Onboarding).
- ✅ **„Stand: Juni 2026" hartcodiert (`legal.lastUpdated`) → Pflege-Flag (2026-07-18, `e586acf`).**
  War in allen 5 i18n-Dateien einzeln → jetzt EIN Pflege-Ort `LEGAL_LAST_UPDATED` in `LegalView.jsx`,
  via `{date}` eingesetzt. Bewusst NICHT aus dem Build abgeleitet (falsche Aktualitäts-Aussage). Output
  byte-identisch (DE+RM live verifiziert). Branch `feat/polish-legal-datum` ab main.
- A11y in Onboarding/BetaGate: Focus-Ring auf Sprach-Buttons, `aria-live` für Beta-Fehler, Landmark.
- „Wert zeigen bevor man fragt" → Demo-Modus (existiert in `main.jsx`) schon am Einstieg anbieten.

**Vorbilder (übernehmen):** konkrete prüfbare Claims aufs Entry (Infomaniak), Privatsphäre in
Alltagssprache + „in plain terms" (Posteo), „Warum gratis / wer steckt dahinter" (Ecosia),
Sprachumschalter-Prominenz + Leichte Sprache (ch.ch/admin.ch), benannter Mensch + Basel
(kleine CH-Studios), Ressourcen-Verzeichnis als erstklassiges Feature (tbb.ch).
**Behalten (gelobt):** ruhiges Privacy-Messaging, gründliche Rechtstexte (nDSG/EDÖB/Fedlex),
strikte CSP, Meta/PWA, respektvolles Onboarding.

## I — Marketing/Positionierung (Agenten-Feedback ✅ eingegangen)

**🔴 Sofort (Copy):**
- **„für Schweizerinnen und Schweizer" → „für Menschen in der Schweiz"** (README + überall extern)
  — schliesst sonst die echte Zielgruppe aus. Werte-relevant.
- **README neu schreiben** — aktuell „0.1.0-alpha", emoji-lastig, „später Open Source",
  „B2B-Versionen (Behörden/Banken)" → ruhige, öffentliche, on-brand Front-Tür (widerspricht sonst
  der Live-Beta).
- ✅ **Funktionale Claim-Unterzeile:** „Verstehen, was zusteht. Ordnen, was ansteht." ist jetzt
  das Hero-H2 (`dashboard.welcome`) in allen 5 Sprachen — infinitiv-neutral, keine Sie/Du-Variante.
  Ersetzt das wortgleiche „Prüfen Sie Ihre Ansprüche…". Marke „Dein Leben. Deine Übersicht." bleibt.
  🟡 Offen: toter `appTagline`-Key („— auf deinem Gerät." anhängen; wird nirgends gerendert).

**🟠 Positionierung & Trust:**
- Orientierung vor Organisation kommunizieren (nicht „Lebensordner" als Lead-Wort).
- Privacy als „Erlaubnis anzufangen" framen; Tech-Claims in menschliche Garantien übersetzen
  (Tabelle im Agenten-Output). **Offline-Beweis** als bestes Trust-Mittel: „komplett offline
  nutzbar — probier es aus".
- „Warum du uns vertrauen kannst"-Panel (4 Zeilen) auf Landing/erste Sicht (existiert als
  `onboarding.privacyNote` — hochziehen).
- Sie/formal als Erstkontakt-Default (Landing/NGO), Du im App-Innern → Kanal entscheidet.

**🟡 SEO (strukturell):**
- ✅ **hreflang + Head-Meta — WEITGEHEND ERLEDIGT (2026-07-08 Grundlage, 2026-07-09 Lücken).**
  hreflang (5 Spr. via `?lang=`), og-Locale-Alternates, canonical, robots.txt, sitemap.xml,
  JSON-LD existierten seit 08.07. Drei Lücken am 09.07. geschlossen (`4e62b2a`): (1) `<title>`/
  `<meta description>`/og je Sprache dynamisch (i18n `seo.*` + lang-Effekt in main.jsx; vorher nur
  `<html lang>`), (2) canonical selbstreferenziell `?lang=<lang>` statt statisch `/` (löste den
  canonical↔hreflang-Widerspruch), (3) sitemap.xml mit allen 5 Sprach-URLs + `xhtml:link`-
  Alternates inkl. x-default. ⏭ Offene Eskalation (später): vorgerenderte statische Sprach-Landing-
  Seiten für JS-lose Crawler (Google rendert JS, daher nicht dringend).
- CH-Keywords: Prämienverbilligung berechnen, Sozialhilfe Anspruch, Steuererklärung [Kanton],
  Aufenthaltsbewilligung verlängern, Ergänzungsleistungen … + EN für Expats. `sitemap.xml`, FAQ-Schema.

**🟢 Akquise (Asset bauen):**
- **Mehrsprachige QR-Flyer-PDF** „Was steht mir zu? — kostenlos, privat" → für NGO/Gemeinde-Verteilung.
- Pilot-Outreach: 1× Caritas/HEKS, 1× Gemeinde-Sozialdienst, 1× Integrationsfachstelle.
- Grosse Wette: ruhige Erklär-Seiten pro Thema (Prämienverbilligung/Sozialhilfe/Steuern/Bewilligung)
  → löst SEO + ist NGO-teilbarer Service-Content zugleich.

## ⭐ Konvergenz beider Agenten (= höchste Priorität)
1. **Vertrauen/Wert VOR der Hürde zeigen** — BetaGate-Intro + Landing-Trust-Panel + benannter Mensch.
2. **Mehrsprachigkeit ernst nehmen** — Domain-Fix (index.html) + hreflang + pro-Sprache-Seiten.
3. **Konsistenz/Korrektheit** — MIT→AGPL, „Menschen in der Schweiz", aktueller README.

---

**Hinweis:** Deploy wartet bewusst (Stebler Studios gibt frei). Detail-Kontext zu jedem Punkt in den
Memory-Notizen ([[agent-audits]], [[brand-identity]], [[braindump-4]], [[braindump-3]],
[[stebler-studios-legal]], [[stipendien]], [[asylum-direction]]).

---

# 🔍 AUDIT 2026-06-28 — 6-Domänen-Flotte (read-only)

6 Subagenten parallel, je mit den passenden `maloja-*` Skills: **Architektur/Local-First · CH-Berechnungen ·
Design/Calm-UX · A11y/Dichte · i18n/Sprache · Governance/Nutzbarkeit.** Kernsysteme laut allen solide.
Alle Punkte unten sind NEU (nicht aus früheren Audits). `file:line` zum Zeitpunkt v0.1.3-beta (`43593d7`).

## 🔴 Kritisch (Datenverlust / Korrektheit / Vertrauen)

> ✅ **NACHGEPRÜFT 2026-07-08 (reproduce-first) — alle 6 erledigt:**
> 1. Dokument-Blobs → IndexedDB: gelöst (`main.jsx:647` „Metadaten → kein localStorage-Quota-Risiko mehr", idb-Pfad aktiv).
> 2. QuickCheck-IPV: nutzt jetzt `calculateIPV` (`Dashboard.jsx:98`), `KVG_BRACKETS_2024` nicht mehr referenziert.
> 3. SchuldenManager-A11y: behoben (`3fc0fb5` + a11y-Audit 2026-07-08).
> 4. Vorlesen-Lücke: `SozialhilfeView.jsx:34/48` liest Intro vor (mit `vorlesen.label`); Vorlesen auch in Schulden/Finanz/Asyl/Stipendien/Prämien vorhanden. VorlesenButton nimmt übersetzbaren `label`-Prop. (Rest-Politur: eingebetteter `SozialhilfeRechner`-Zweitrechner ohne eigenen Knopf — nicht kritisch.)
> 5. `kvg.generikaNote`: in allen 5 Sprachen vorhanden.
> 6. `kkScanner.ahv`: in allen 5 Sprachen vorhanden.

1. **Dokument-Blobs als base64 in localStorage** (`ChapterView.jsx:1802` → Autosave `main.jsx:355`).
   1 PDF ≈ sprengt 5-MB-Budget; `setItem` ohne try/catch → QuotaExceeded wirft, Datei NIE gespeichert,
   aber Upload-Toast meldete Erfolg → stiller Datenverlust. Fix: Blobs in IndexedDB (der `idb`-Helper in
   `storage.js:102` ist gebaut, aber UNGENUTZT) + Grössen-Guard + try/catch.
2. **Dashboard-QuickCheck IPV widerspricht dem echten Tool** (`Dashboard.jsx:82`, `premiumCalc.js:6`).
   QuickCheck nutzt nationale `KVG_BRACKETS_2024` (ignoriert Kanton) und zeigt konkrete CHF-Zahl; die
   `PremiumSubsidy`-View nutzt kantonales `calculateIPV` → gleicher Nutzer, zwei Zahlen. Fix: QuickCheck
   über `calculateIPV` oder qualitativ ohne harte CHF; `KVG_BRACKETS_2024` ausmustern.
3. **SchuldenManager — schwächste neue Komponente (3 Agenten unabhängig).** Inputs/Selects nur
   `placeholder` als Name, `status`/Betreibung-Selects ohne Namen (`:220-237,274-305`); Tabs ohne
   `role=tab`/`aria-selected` (`:122-143`); kein `h2` (h1→h3-Sprung); Status nur über Farbe (`:245`);
   roher Status-Key im Text (`:248`). WCAG 1.3.1/4.1.2/1.4.1/2.4.6. Fix: aria-labels, h2, Tab-Semantik,
   Status-Text statt nur Farbe, Status via `t()`.
4. **Vorlesen-Lücke** — `VorlesenButton` nur in ChapterView/Settings/Onboarding/BetaGate; FEHLT in
   Schulden/Finanzübersicht/Sozialhilfe/Asyl/Stipendien/Prämien/Flyer — genau die jargon-/stress-lastigen
   Screens für die Low-Literacy/Asyl-Zielgruppe. Zudem `VorlesenButton.jsx:9` aria-label `'Vorlesen'`
   hartcodiert DE. Fix: Vorlesen in diese Views; aria-label übersetzen.
5. **Raw-Key-Leak `kvg.generikaNote`** — fehlt in ALLEN 5 Sprachen (`KVGLeistungen.jsx:94`). Generika-Zeile
   zeigt rohen Key. Fix: in alle 5 ergänzen.
6. **Raw-Key-Leak `kkScanner.ahv`** — fehlt in ALLEN 5 (`KKScanner.jsx:157`); `|| field`-Fallback schützt
   NICHT (t() liefert truthy Key). KK-Karten-Konflikttabelle zeigt rohen Key. Fix: in alle 5 ergänzen.

## 🟠 Hoch

> ✅ **NACHGEPRÜFT 2026-07-08 (reproduce-first) — 11 von 13 erledigt, 2 sind Design-Entscheide:**
> - SKOS-Freibetrag: *ein* geteilter Helper `vermoegensfreibetragSKOS` (6000/12000 +3000/Kind, Cap 15000) ✓
> - 13. AHV-Rente: `jahresrente = rente × 13` (`ahvRechner.js:128`) ✓
> - Bundessteuer-Label: `federalOnly: 'nur Bundessteuer'` vorhanden ✓
> - IPV-Kinderalter: `<18`-Filter + junge Erwachsene separat (`cantonalData.js:294/334`) ✓
> - @capacitor: cli in devDeps + Zero-Dep-Test `zeroDeps.test.js` bewacht src/ ✓
> - radius.md: JS=10 (`tokens.js:53`) = CSS=10 (`tokens.css:67`) ✓
> - Router-Allow-Liste: `settings/taxImport/legal` in VALID_VIEWS (`hashRouter.js:25`) ✓
> - validation.invalid*: „… bitte prüfen" statt „Ungültig" ✓
> - Export-Domain: kein `maloja-plana.ch` (Bindestrich) mehr ✓
> - Autosave: try/catch + `saveError`-State (`main.jsx:562-583`) ✓
> - **GEFIXT diese Session (`role=status`-Live-Regionen ohne Buttons):** Sandbox-/Demo-/DB-Banner (`main.jsx`) + AlphaBanner (`Dashboard.jsx`) — role auf den Text verschoben, browserverif (0 Buttons in Live-Regionen). ✓
> - ⏳ **OFFEN, Design-Entscheid (Stebler Studios, „nichts wegnehmen"):** Finanz-Alarm-Flächen detunen (Schulden-KPI-Grid / Armutsbalken / OverdueBanner) + Schulden-Formular Progressive Disclosure. Kein Bug — bewusste Gestaltung.

- **SKOS-Vermögensfreibetrag veraltet UND doppelt/widersprüchlich.** `cantonalData.js:293`
  (8000/4000 +2000, Cap 10000) vs `sozialhilfeRechner.js:101` (4000 +2000, kein Cap) → Paar bekommt
  8000 vs 6000. Aktuelle SKOS-Empfehlung: **6000 ledig / 12000 Paar / +3000 pro Kind.** Fix: 1 Helper,
  Werte aktualisieren, als Empfehlung labeln. ⚠️ Tests `cantonalData.test.js:48` + `sozialhilfeRechner.test.js:119` zementieren Altwerte → mit anpassen.
- **13. AHV-Rente (ab 2026) nicht modelliert** (`ahvRechner.js:122` `×12`). Jahresrente ~8% zu tief.
  Fix: ×13 bzw. eigene „13. Rente"-Zeile; `monatsrente` bleibt.
- **Gemeinde-Steuerfuss-Lücke bestätigt** — Rechner modellieren nur direkte Bundessteuer
  (`berechneBundessteuer`). Jeder Konsument muss explizit „nur direkte Bundessteuer" labeln + Hinweis
  Kantons-/Gemeindesteuer. (= bekannter P13-Punkt, Impact = systemisch.)
- **IPV ignoriert Kinderalter** (`cantonalData.js:336`) — junge Erwachsene 19–25 in Ausbildung haben
  eigene (höhere) Kategorie. `children[].age` ist vorhanden. Min.: „Kinder bis 18" labeln.
- **`@capacitor/*` Runtime-Deps** (`package.json:24`) gegen Zero-Dep-Constraint. Kein Import in `src/`
  (nur iOS-Shell). Fix: `@capacitor/cli` → devDeps; CI-Guard gegen `@capacitor`-Import in `src/`.
- **`radius.md` JS↔CSS desync** (`tokens.js:54`=6 vs `tokens.css:67`=10px) — Single-Source-Bruch,
  betrifft alle `radius.md`-Flächen. Fix: auf einen Wert einigen.
- **Finanz-Alarm-Flächen detunen** — Schulden-KPI-Grid (`SchuldenManager.jsx:147`), Finanzübersicht
  Armuts-Prozentbalken (`FinanzUebersicht.jsx:207`), OverdueBanner-Gradients+rote Bold-Zahl
  (`OverdueBanner.jsx:37`). Schamsensibelste Stellen + lauteste UI. Fix: Zeilenlisten/`<details>` statt löschen.
- **Router-Allow-Liste-Drift** (`hashRouter.js:19`) — `settings`, `taxImport`, `legal` fehlen in
  `VALID_VIEWS` → funktionieren beim Klick, gehen aber bei Reload/PWA-Neustart/geteiltem Link verloren
  (zurück aufs Dashboard). Gleiche Klasse wie früherer kvg/flyer-Fix. Fix: 3 Strings ergänzen + Guard-Test.
- **`validation.invalid*` „Ungültig"** (`de.js:1697-1704`) — laut writing-language-Skill verbotenes
  Fehlerwort. Fix: ruhig umformulieren („… bitte prüfen") in allen 5.
- **Falsche Domain im Export** (`FinanzUebersicht.jsx:95`) — Print/PDF-Footer `maloja-plana.ch`
  (Bindestrich) statt live `malojaplana.ch`. Fix: korrigieren.
- **Schulden-Formular**: 6 Felder ohne Disclosure, nur creditor+amount Pflicht aber nichts markiert;
  leere Eingabe → `handleAddDebt` returnt still (kein Feedback). Fix: Progressive Disclosure + ruhige Validierung.
- **Autosave-Block ungeschützt** (`main.jsx:350-370`) — Throw killt Save-Loop, `isSaving` bleibt true.
  Fix: jedes `setItem` in try/catch + ruhige „Speichern fehlgeschlagen"-Meldung.
- **Sandbox-Banner** (`main.jsx:618-658`) `role=status` umschliesst 3 Buttons (Live-Region). Fix: Buttons
  aus der Live-Region nehmen.

## 🟡 Mittel

> ✅ **NACHGEPRÜFT 2026-07-08 (reproduce-first):**
> - Backup zieht IndexedDB-Docs mit: `backupCrypto.js` (getDocBlob/saveDocBlob) + `autoBackup.js` (hydrateDocs/idb) ✓
> - EventBus Ring-Buffer + try/catch pro Listener: `event-bus.ts:14-20` ✓
> - Registry-Drift: dedizierte `SEARCH_VIEWS`-Registry (27 Einträge) in `SearchView.jsx` ✓ (harte 3-Registry-Vereinheitlichung nicht erzwungen — kein sichtbarer Fehler mehr)
> - AsylView/StipendienView-Titel: nutzen jetzt `PanelTitle` (echte Überschriften) ✓
> - **GEFIXT diese Session:** „recheck Jan 2027"-Wartungsnotiz an `AHV_DATA_VERSION` (`ahvRechner.js`) ✓
> - ⏳ **Offen, klein:** Backup-Passphrase erlaubt weiter 4 Zeichen ohne ruhigen Längen-Hinweis (`backupCrypto.js:93`) — UI-Nicety.
> - ⏳ **Offen, Design (Stebler Studios):** Unicode-Glyphen (□◰●◇↧✕) in Onboarding/Schulden statt `IconSystem` — Materialitäts-Konsistenz, kein Bug.

- Backup/Export liest Dokumente nur aus localStorage (`autoBackup.js`, `backupCrypto.js:42`) → bei
  IndexedDB-Migration (s. 🔴 #1) Backups mitziehen, sonst stoppen Datei-Backups still.
- EventBus wächst unbegrenzt (`event-bus.ts:9`), kein Error-Isolation der Listener → langsames Leck +
  Throw bricht Bus. Fix: Ring-Buffer + try/catch pro Listener.
- 3 parallele Tool-Registries driften (`Dashboard.jsx:1196`, `MobileNav.jsx:136`, `SearchView.jsx:8`) —
  SearchView findet ~10 Tools nicht. Fix: eine geteilte Registry.
- AsylView/StipendienView Section-Titel sind `<div>` statt `<h3>` → keine In-Page-Heading-Navigation (SR).
- Backup-Passphrase akzeptiert 4 Zeichen ohne Hinweis (`backupCrypto.js:73`) — ruhige Längen-Empfehlung.
- Onboarding/Schulden nutzen Unicode-Glyphen (□◰●◇↧✕) statt `IconSystem` → Materialitäts-Inkonsistenz.
- AHV/ALV-Konstanten 2026 korrekt, aber „recheck Jan 2027"-Wartungsnotiz neben Versions-Tags setzen.

## ✅ Bestätigt solide (nicht anfassen)
- Migration (`dataMigration.js`): Snapshot, sequenziell v0→v4, restore-on-failure, löscht nie Felder.
- Service Worker v9: cache-first hashed, network-first sonst, `allSettled`-Precache, Alt-Cache-Cleanup.
- BVG 2026, EO 220, ALV, DBG-2026-Tarif (auf Rappen), SKOS-GBL 1061 — alle korrekt verifiziert.
- `backupCrypto` (AES-256-GCM, PBKDF2 100k) korrekt & dependency-free. i18n-Parität 32 Tests grün,
  `doctors.label`-Leak ist gefixt. Keine verwaiste Komponente, kein toter Generator, kein sichtbarer Stub.

**Meta-Antwort „mehr/andere Experten?":** Nein — keine neuen Agent-Typen nötig. Die ~25 `maloja-*` Skills
sind die Experten; richtig ist die 6-Domänen→Skill-Kopplung (oben). **„Alles nutzbar wie gedacht?"** →
Fast vollständig ja; einzige echte Regression = Router-Allow-Liste (settings/taxImport/legal, 🟠 oben).

---

## 🟡 Braindump-Fäden (BD18/19) — geplant, später bauen

*Session 2026-06-29: Faden 1 (Briefe) komplett, Faden 2 (Kalender) komplett + vertieft, Faden 3-I (KK-Last %) gebaut & committet auf `dev` (nicht gepusht). Stebler Studios: Folgendes bewusst zurückgestellt — „erst wenn wir soweit sind".*

- **Petitionsvorlagen-Generator** (BD19, Idee von Stebler Studios) — Menschen die Werkzeuge geben, *selbst* zu petitionieren (analog Brief-Generator). Löst den Petitions-Teil von Faden 3 governance-konform: Maloja kampagnisiert nicht, sondern befähigt. Beispiel-Vorlage „max 10% des Einkommens für die KK".
- **Faden 4 — Haushalts-Budget-Benchmarks** (BD18) — Bund/BFS-Haushaltsbudget-Erhebung als Richtwerte pro Ausgabenkategorie. WICHTIG: belegbar, KEINE erfundenen Einzelpreise („eine WC-Rolle kostet X"). Braucht Daten-Erkundung zuerst.
- **Faden 3-II** — Stebler Studios: „alle 4, aber alles zu seiner Zeit". Faktenprüfung 2026-06-29: das politische „KVG deckt weniger als WHO"-Framing ist für die Screenings NICHT belegbar (WHO empfiehlt beim Zervix-Screening sogar seltener → Pap-Mythos). Stattdessen 4 belegbare Richtungen, schritt-für-schritt:
  - ✅ **3-II/1 (gebaut, `7cdfbed`)** — internationale Empfehlung als ruhige Orientierung neben KVG-Deckung im Leistungskatalog (Gyn/Mammo/Darm), mit Quelle. Botschaft beruhigend, kein Alarm. Datenanker `VORSORGE_EMPFEHLUNG_KEYS`.
  - ✅ **3-II/2 (GEBAUT — reproduce-first bestätigt 2026-07-11)** — persönlicher Intervall-Abgleich im KVG-Leistungskatalog (`KVGLeistungen.jsx`): opt-in „Letzte Untersuchung"-Feld → „Nächste empfohlene ~MM.JJJJ" aus `VORSORGE_INTERVAL_MONATE` (gynaeko 36 / mammografie 24 / darmkrebs 120 Mt., WHO/EU-belegt) → bei Überfälligkeit ruhiger Hinweis + 1-Klick-Kalendereintrag. Schwellen-Entscheid elegant gelöst: Abgleich nur für Screenings mit belegbarem Monats-Intervall. Browser-live-verifiziert.
  - **3-II/3** — geografische Mammografie-Realität: LU/NW/OW/UR ohne organisiertes Programm (nur opportunistisch nach Überweisung). Reine Orientierung, belegt.
  - **3-II/4** — Idee von Stebler Studios: per *evidenz-graduierten* Studien prüfen, ob z.B. ein jährlicher Frauenarzt-Besuch belegbar sinnvoll ist (Evidenzqualität mitzeigen, nicht behaupten).
- **Führerschein-Thema** (BD19) — Führerausweis ganzheitlich: Erneuerung/Fristen, ärztliche Kontrolluntersuchung ab 75 (alle 2 J.), Ausweis im Dokumenten-Tresor, evtl. Kalender-Vorlage. Orientierung über Pflichten/Fristen. Erst Umfang klären (Swiss-precision: Fakten prüfen).

## A11y-Formular-Audit 2026-07-08 (a11y-pruefer)

*Alle Formular-Inputs auf programmatische Beschriftung geprüft. 63 echte Kandidaten (nach Bereinigung der Mehrzeilen-Props-Fehlalarme), zwei Muster.*

- ✅ **SchuldenManager** (`3fc0fb5`) — 8 Listen-Inputs aria-label + fehlende i18n-Keys (debtor/court/registerDate/date, 5 Spr.) nachgezogen (behob auch Platzhalter-Bug „schulden.debtor").
- ✅ **Pattern A — 13 Felder in 9 Formularen** (`a148817`) — placeholder-only/unbeschriftete Inputs bekamen aria-label (Backup-Passphrasen, Beta-Code, Kalender-Titel, Doku-Suche, Franchise/Kanton-Select, EO-Einkommen, PLZ, mobile Suche, Dashboard-QuickCheck/Feedback).
- ✅ **Pattern B — ABGESCHLOSSEN (2026-07-09).** Baustein `LabeledField.jsx` (useId-Kopplung)
  von TaxCalculator schon genutzt. Beim Durchzählen zeigte sich: der „~36-Felder-Sweep" ist
  bewusst NICHT nötig — überall sonst sitzt bereits ein aria-label (Pattern A erledigt), dort wäre
  echte Kopplung reine Kosmetik mit Regressionsrisiko (deckt sich mit dem „gezielt statt Sweep"-
  Grundsatz). Übrig waren nur **3 Views mit echten Lücken** (weder aria-label noch Kopplung):
  **KKScanner (6 Felder), OrganDonation (1), BudgetImport (1)** → auf `LabeledField` migriert
  (Wrapper `marginBottom:0`, Optik 1:1). Browserverifiziert (alle 6 KKScanner-Labels via for/id),
  592 Tests grün. Commit `5fe8851` (dev).
- ✅ **Rest Pattern A — reproduce-first 2026-07-18: schon beschriftet.** DocumentTresor-Inline-Datum
  (`aria-label` `chapterView.expiryDate`, `DocumentTresor.jsx:174`) + Sortier-Select (`tresor.sortBy`,
  `:309`) + Kalender-Notizen-Textarea (`calendar.noteLabel`, `CalendarReminders.jsx:468`) tragen alle
  bereits ein `aria-label`; die Keys existieren in allen 5 Sprachen. Nichts offen.
- ✅ **rm-Notfall-Icon — reproduce-first 2026-07-18: schon da.** `chapters.notfall.icon: '⚠'` ist in
  ALLEN 5 Sprachen vorhanden, rm inkl. (`rm.js:1409`). Parität bereits gegeben.

## Runde 2026-07-11 (Feature-Branches, noch nicht gemergt — 10-Commit-Gate)

reproduce-first ergab: mehrere „offene" Fäden waren längst gebaut.
- ✅ **a11y #2-Rest** — rohes `rose` als Text → `roseDeep` (WCAG AA), 11 Stellen (`feat/a11y-rose-text`). Bewusst roh: Daten-Viz-Balken, grosse fette Akzent-Zahlen, PremiumSubsidy (Leitplanke, im Flow nachziehen).
- ✅ **a11y #6** — Haushalt-Gruppen (Erwachsene/Kinder) von verwaistem `<label>` → `role="group"`+`aria-labelledby` (`feat/a11y-labels`). Doc-Upload/übrige Felder waren schon gekoppelt.
- ✅ **Faden 3-II/2** — schon gebaut (s. o.).
- ✅ **Faden 4 „Trust-/Korrektheits-Fixes"** — alle vier schon erledigt: Router-Allow-Liste (settings/taxImport/legal in `hashRouter.js`), Export-Domain (kein Bindestrich), „Ungültig"→„… bitte prüfen", Backup-Passphrasen-Hinweis (empfiehlt bereits 12+ Zeichen).
- ✅ **Führerausweis-Ablauf** (BD19-Faden 1) GEBAUT (`feat/fuehrerausweis`), Fakten ch.ch/ASTRA, 5 Spr. (rm Best-Effort → Gegenlese).
- ✅ **PWA-Härtung** (Cache an Bundle-Hash, Home-Screen-Name/Icon), **Wartungsseite** (statt Apache-404), **Beta-Code als SHA-256-Hash** (raus aus Public-Repo).
- ⏳ OFFEN a11y: #3 `soft`-auf-Karten (braucht Token-Entscheid mid vs. soft-abdunkeln, 87 Stellen), #4 Fokusring-Farbe (Kür).
