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
- 🟡 `rm.js` verwaiste Alt-Keys (~85) gegen `de.js` bereinigen.

## B — Berechnungen (vor Fixes offizielle Quelle prüfen!)

- ✅ `estimateTaxSavings` + irreführende Kachel entfernt (IPV ist steuerfrei).
- ✅ AHV Vorbezug-Kürzung war bereits 6.8 %/Jahr (korrekt).
- ✅ Mindestlohn TI/NE 2025 aktualisiert · `CANTONAL_DATA_VERSION` ergänzt. 🟡 AHV-Rente als Schätzung labeln (offen, tolerierbar).

## C — Design / Calm-UX (aus Audit)

- 🟠 IPV-„KPI-Kacheln" → ruhige Zeilen-Liste (Muster ChapterView-Versicherungsübersicht). *(noch offen)*
- ✅ Zu viele Crosslink-Buttons gebündelt (monthlyIncome → eine „Passende Werkzeuge"-Box).
- 🟡 Hover `scale(1.12)`→`1.04`; Token-Ausreisser (`radius`, hartcodierte px/Farben). *(noch offen)*
- Prinzip: Entschlacken via Disclosure/Dropdown, **nie löschen** (Landkarte = Identität).

## D — Brand Identity (Rest der Umsetzung)

- ✅ Farben (Granit), Wortmarke (Gipfel-M), Typografie (Lexend/Hanken), Voice-Entscheid
- ✅ Icons: Übersicht=Sackmesser, Charts=Schoggi, Kalender=heutiger Tag, Schutzrecht-Fixes
- ✅ Bergketten-Karte sichtbar (Granit-Opacity nachgezogen)
- 🟠 **Export-Icon** — neue Metapher (warten auf Tester-Feedback)
- 🟠 **Benachrichtigungen → Kuhglocke** (MobileNav nutzt noch `settings`/Zahnrad)
- 🟡 **Uhr → Frist/Zeit** Verwendungsstellen finden
- 🟡 `og-image.svg` aufs Gipfel-M + Granit
- 🟡 Signet-Farben (Ordner+Berg+Pass) an Granit angleichen
- 🟡 **Voice/Anrede-Toggle (Sie/Du)** implementieren + Atkinson-Font wiren (Accessibility)
- 🟡 OFL-Lizenztexte zu den WOFF2 legen · Wortmarke für Produktion in Pfade outlinen
- 🟡 Brand Guidelines in *ein* Dokument bündeln

## E — Inhalt

- 🟠 **Herzensempfehlung Leihlager** (`heartfelt10`) — braucht Name + URL von Sophie.
- ✅ Abschiedsagentur (`heartfelt9`, alle 5 Sprachen)
- 🟡 **Quellen/Links-Check** — „alle Links müssen funktionieren" (Link-Checker), Crosslinks
  vervollständigen.

## F — Grössere Features (Sophie wählt Reihenfolge)

- ✅ **Stipendien** — Berechtigungs-Check (Inkr. 2). Offen: Antrags-Generator; präziser Betrags-Rechner bewusst nicht gebaut.
- ✅ **Arbeitslosenkassen-Rechner** (ALV-Taggeld 70/80%, Wartetage, Höchstbetrag; SECO 2025).
- 🟡 **Adressen-Autocomplete** (Nominatim/OSM, CSP-konform).
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
- **Funktionale Claim-Unterzeile:** „Verstehen, was zusteht. Ordnen, was ansteht." (Marke „Dein
  Leben. Deine Übersicht." bleibt). `appTagline` → „Alles Wichtige an einem Ort — auf deinem Gerät."

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
