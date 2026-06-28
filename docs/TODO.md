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
Atkinson, hreflang) oder brauchen Sophies Entscheid (Hero-Copy, Export-Icon).

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

## C — Design / Calm-UX (aus Audit)

- ✅ **BUG (Handy): Kopfzeile lief horizontal über — GEFIXT (2026-06-28).** *Gemeldet Sophie
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
- ✅ **Datumsfelder: klares Picker-Symbol — GEFIXT (2026-06-28).** *Gemeldet Sophie: „man kann
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

## D — Brand Identity (Rest der Umsetzung)

- ✅ Farben (Granit), Wortmarke (Gipfel-M), Typografie (Lexend/Hanken), Voice-Entscheid
- ✅ Icons: Übersicht=Sackmesser, Charts=Schoggi, Kalender=heutiger Tag, Schutzrecht-Fixes
- ✅ Bergketten-Karte sichtbar (Granit-Opacity nachgezogen)
- 🟠 **Export-Icon** — neue Metapher (warten auf Tester-Feedback)
- ✅ **Benachrichtigungen → Kuhglocke** — bereits erledigt: `cowbell` konsistent in MobileNav,
  CalendarReminders, NotificationSettings, OverdueBanner; kein Zahnrad mehr dafür (per Grep 2026-06-27).
- 🟡 **Uhr → Frist/Zeit** Verwendungsstellen finden
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

- 🟠 **Herzensempfehlung Leihlager** (`heartfelt10`) — braucht Name + URL von Sophie.
- ✅ Abschiedsagentur (`heartfelt9`, alle 5 Sprachen)
- ✅ **Quellen/Links-Check** (erneut 2026-06-27): 121 externe URLs geprüft (27 neue Asyl/Stipendien
  + 94 direktLinks). **0 echte tote Links** — alle 2xx/3xx; einzig 3× `baselland.ch` 403 = bekannter
  WAF-False-Positive (im echten Browser gültig, siehe [[link-check]]). Asyl-Orgs (SEM/Caritas/HEKS/
  SFH/SRK/EPER) + Stipendien (EDK/SBFI/stipendium.ch) alle 200.

## F — Grössere Features (Sophie wählt Reihenfolge)

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
- „Stand: Juni 2026" hartcodiert (`legal.lastUpdated`) → ableiten/Pflege-Flag.
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
- **`hreflang` fehlt komplett** → pro-Sprache-Routen `/de//fr//it//en//rm/` + reziproke hreflang +
  `x-default`; pro Sprache eigener `<title>`/`<description>`; `<html lang>` korrekt. Braucht
  vorgerenderte Sprach-Landing-Seiten (kein Backend → statisch).
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

**Hinweis:** Deploy wartet bewusst (Sophie gibt frei). Detail-Kontext zu jedem Punkt in den
Memory-Notizen ([[agent-audits]], [[brand-identity]], [[braindump-4]], [[braindump-3]],
[[stebler-studios-legal]], [[stipendien]], [[asylum-direction]]).
