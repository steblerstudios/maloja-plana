# Schulden & Rechnungen, zweite Runde — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Offene Arztrechnungen und Schulden in einer ruhigen Gesamtsicht verbinden (ohne Doppelzählung), und Betreibung/Verlustscheine als Lesezeilen mit belegter Zeitinformation zeigen.

**Architecture:** Drei reine Funktionen in `src/utils/offenePosten.js` tragen die ganze Logik (lesen, übernehmen, bezahlt abgleichen) und werden einzeln getestet. Die Ansichten (`SchuldenBilder.jsx`, `SchuldenManager.jsx`, `KVGLeistungen.jsx`) rufen sie nur auf; geschrieben wird über `writeData` in `main.jsx`, damit beide Ablagen in **einem** Schritt wechseln.

**Tech Stack:** React 18 ohne JSX (`React.createElement`), Vite 7, Vitest 5 (`renderToStaticMarkup` für Ansichtstests), i18n in `src/i18n/{de,en,fr,it,rm}.js`.

**Spec:** `docs/superpowers/specs/2026-10-05-schulden-rechnungen-design.md` (Entwurfs-PR #494)

## Global Constraints

- Eine Quelle je Wahrheit: kein Betrag wird kopiert, ausser beim bewussten Übernehmen (③); danach zählt er nur als Forderung.
- Nichts geschieht automatisch — jede Verbindung entsteht durch einen Klick.
- Bildsprache #422: eine Farbe (`palette.text`) in Deckkraftstufen aus `STUFEN_TON`, jede Fläche zusätzlich als Text, **kein Rot auf Beträgen**; `roseDeep` nur für Formularfehler.
- Jeder neue Knopf/Titel/Textknoten setzt `color` explizit (Dark-Mode, `src/CLAUDE.md`); empty/error-Zustände mitbauen.
- Neue Texte in de/en/fr/it; `rm` als deutscher Rückfall mit `// TODO(rm): provisorisch — Gegenlese (Schulden R2, 05.10.2026)`. Sie-Form wie `de.js`. Parität: `npx vitest run src/i18n` und `src/__tests__/i18nGapScan.test.js`.
- Fachtexte **wörtlich aus dem Spec**, Abschnitt «Ergebnis swiss-precision-pruefer» (8a Abs. 4, 149a Abs. 1, 149 Abs. 4, KVG 42 Abs. 1, KVG 64a) — keine eigene Umformulierung der Rechtslage.
- Betreibung: **kein errechnetes Enddatum**. Verlustschein: Ende = Ausstellung + 20 Jahre **nur** mit erfasstem Datum; «zinslos» nur bei `rolle === 'schulde'`.
- Kategorie `gesundheit` → Stufe 3.
- Daten-Felder: `kkBelege[].forderungId?: string` · `schulden[].ausBeleg?: string` · `betreibung[].forderungId?: number` · `verlustscheine[].rolle?: 'schulde'|'geschuldet'`. Alte Daten ohne Feld bleiben gültig.
- Startbündel ≤ 65 kB (`npx size-limit`); Schuldenmanager und KVG-Tracker sind lazy — nichts davon ins Startbündel ziehen.
- Vor jeder Mutationsprobe committen; Mutation mit `git checkout HEAD -- <datei>` zurücknehmen.
- Arbeitszweig `feat/schulden-rechnungen-2026-10-05` ab `origin/main` in `_werkbank/schulden-rechnungen-bau` (eigener Worktree, `.pii-deny.txt` + `node_modules` verlinken). Zwei Entwurfs-PRs: Teil 1 = Tasks 1–4, Teil 2 = Tasks 5–6. pii-scan einzeln laufen lassen, `rc` prüfen, dann pushen.

## Review Focus

1. **Beleg ohne Datum und/oder ohne Frist** — ① nennt keine «nächste Frist», ② zeigt «Rechnung ohne Datum», ③ ist angeboten (ohne Frist gilt als übernehmbar). → Test in Task 1 und Task 3.
2. **Zweiter Klick auf «übernehmen»** (Doppelklick, zurück und nochmal) — legt keine zweite Forderung an. → Test in Task 1.
3. **Forderung im Schuldenmanager gelöscht** — Beleg verliert `forderungId`, zählt wieder in ①/②, bleibt offen. → Test in Task 1 (`abgleichBelege`).
4. **Beispielmodus/Probe** — Übernehmen schreibt im Beispiel nichts (wie `updateData`), in der Probe nur in den Probe-Stand. → Test in Task 4.
5. **Frist genau heute** — gilt **nicht** als abgelaufen (abgelaufen = `frist < heute`, ISO-Vergleich), gleiche Regel wie `istUeberfaellig`. → Test in Task 1.

---

### Task 1: Reine Logik `offenePosten`, `belegAlsForderung`, `abgleichBelege`

**Files:**
- Create: `src/utils/offenePosten.js`
- Test: `src/__tests__/offenePosten.test.js`

**Interfaces:**
- Produces:
  - `offenePosten(data, heute: string /* ISO */) → { arzt: Array<{ id, datum, betrag, frist, abgelaufen: boolean }>, forderungen: Array<{ id, creditor, amount, stufe, ausBeleg?: string }>, summeArzt: number, summeForderungen: number, summe: number, naechsteFrist: string|null }`
    — `arzt`: `versicherungen.kkBelege` mit `status === 'offen'` **und ohne** `forderungId`; `forderungen`: `schulden` mit `status !== 'paid'`; `naechsteFrist`: kleinste Frist `>= heute` unter `arzt`, sonst `null`. Summen in Rappen genau (wie `summenJeStufe`).
  - `istBelegUebernehmbar(beleg, heute) → boolean` — `status === 'offen' && !forderungId && (!frist || frist < heute)`.
  - `belegAlsForderung(data, belegId: string, heute: string, neueId: number) → { schulden, versicherungen }` — neue Forderung `{ id: neueId, creditor: '', amount: beleg.betrag, dueDate: beleg.frist || '', interestRate: 0, category: 'gesundheit', status: 'open', stufe: 'rechnung', ausBeleg: beleg.id, belegDatum: beleg.datum || '', createdAt: heute }`; Beleg bekommt `forderungId: String(neueId)`. Ist der Beleg schon übernommen oder nicht übernehmbar: gibt `{ schulden: data.schulden, versicherungen: data.versicherungen }` unverändert zurück. `creditor` bleibt leer — die Ansicht zeigt «Arztrechnung vom {datum}» aus `belegDatum` (kein deutscher Text in den Daten).
  - `abgleichBelege(data) → data` — für jeden Beleg mit `forderungId`: Forderung fehlt → `forderungId` entfernen; Forderung `status === 'paid'` → Beleg `status: 'bezahlt'`. Gibt dasselbe Objekt zurück, wenn nichts zu tun ist.

- [ ] **Step 1: Failing tests schreiben** (`offenePosten.test.js`, `HEUTE = '2026-10-05'`):
  - `offenePosten`: 2 offene Belege (240 Frist `2026-10-20`, 400 Frist `2026-10-02`) + 1 bezahlter + Schulden 1840 (offen) und 680 (paid) → `arzt.length === 2`, `summeArzt === 640`, `summeForderungen === 1840`, `summe === 2480`, `naechsteFrist === '2026-10-20'`, Beleg 400 `abgelaufen === true`.
  - Beleg ohne `datum` und ohne `frist` → in `arzt`, `naechsteFrist === null` (Review Focus 1).
  - Frist `=== HEUTE` → `abgelaufen === false`, zählt als `naechsteFrist` (Review Focus 5).
  - Rappen: Belege 100.05 + 200.10 → `summeArzt === 300.15` (`toBe`, nicht `toBeCloseTo`).
  - Leere/fehlende Ablagen (`{}`) → alles leer, Summen 0, kein Fehler.
  - `belegAlsForderung` auf den 400er: Forderung mit `amount 400`, `category 'gesundheit'`, `stufe 'rechnung'`, `ausBeleg` = Beleg-ID; Beleg trägt `forderungId`; danach `offenePosten(...).arzt.length === 1` und `summe` unverändert (keine Doppelzählung).
  - Zweiter Aufruf auf denselben Beleg → `schulden.length` unverändert (Review Focus 2).
  - Beleg mit Frist in der Zukunft → nicht übernehmbar, unverändert.
  - `abgleichBelege`: Forderung `paid` → Beleg `bezahlt`; Forderung gelöscht → `forderungId` weg, Beleg `offen`, zählt wieder in `arzt` (Review Focus 3); nichts zu tun → `toBe(data)`.

- [ ] **Step 2:** `npx vitest run src/__tests__/offenePosten.test.js` → FAIL (Modul fehlt).
- [ ] **Step 3:** `src/utils/offenePosten.js` mit den vier Funktionen oben; Kopfkommentar mit Spec-Verweis und «eine Quelle je Wahrheit». Beträge in Rappen summieren (`Math.round(x*100)`), am Ende `/100`.
- [ ] **Step 4:** Test → PASS. Mutationsprobe nach Commit: `!b.forderungId`-Filter entfernen → Doppelzähl-Test rot; `<` zu `<=` → Review-Focus-5-Test rot.
- [ ] **Step 5:** Commit `feat(schulden): offenePosten — Arztbelege und Forderungen ohne Doppelzählung (Spec ①②③)`.

### Task 2: Kategorie `gesundheit` (Stufe 3) und klarere Hilfe zu «Krankenkasse»

**Files:**
- Modify: `src/schuldenCalc.js` (`CATEGORY_TIER`, Kommentar)
- Modify: `src/SchuldenManager.jsx` (Kategorie-`select` im Tab «Schulden», Hinweis unter der Auswahl)
- Modify: `src/i18n/{de,en,fr,it,rm}.js` (`schulden.catGesundheit`, `schulden.catHilfe.krankenkasse`, `schulden.catHilfe.gesundheit`)
- Test: `src/__tests__/schuldenCalc.test.js` (ergänzen)

**Interfaces:**
- Produces: Kategorie-Schlüssel `'gesundheit'`; `prioritizeDebts` liefert dafür `tier: 3`.

- [ ] **Step 1: Failing tests:** `prioritizeDebts([{ category: 'gesundheit', amount: 400, status: 'open' }])[0].tier === 3`; `krankenkasse` bleibt `1`.
- [ ] **Step 2:** Lauf → FAIL (fällt heute auf `|| 3` — darum zusätzlich prüfen, dass `CATEGORY_TIER` den Schlüssel **ausdrücklich** führt: `expect(Object.keys(CATEGORY_TIER)).toContain('gesundheit')`; `CATEGORY_TIER` dafür exportieren).
- [ ] **Step 3:** `CATEGORY_TIER.gesundheit = 3`, Kommentar: «Arzt-/Labor-/Spitalrechnung im Tiers garant = Forderung des Leistungserbringers (KVG Art. 42 Abs. 1), nicht KVG 64a — Prüfer 05.10.2026». Option `gesundheit` («Arzt, Labor, Spital») direkt nach `krankenkasse` im `select`. Unter dem `select` ein `fontSize: text.xs`-Hinweis, nur bei `krankenkasse` bzw. `gesundheit` — Texte wörtlich aus dem Spec (Fachfrage 4).
- [ ] **Step 4:** Tests + `npx vitest run src/i18n` → PASS.
- [ ] **Step 5:** Commit `feat(schulden): Kategorie «Arzt, Labor, Spital» — Stufe 3 (KVG 42 Abs. 1)`.

### Task 3: Übersicht — ① «Ausserdem offen» und ② «Offene Posten»

**Files:**
- Modify: `src/components/SchuldenBilder.jsx` (zwei neue Bausteine)
- Modify: `src/SchuldenManager.jsx` (Übersicht-Tab: nach `OffenBalken`, vor `MahnstufenUebersicht`)
- Modify: `src/i18n/*.js` (`schulden.posten.*`)
- Test: `src/__tests__/schuldenBilder.test.js` (ergänzen)

**Interfaces:**
- Consumes: `offenePosten(data, heute)` (Task 1); `heuteIso()` aus `utils/fristen.js`; `betrag()`, `formatDE()`.
- Produces: `AusserdemOffen({ palette, t, posten, onNavigate })`, `OffenePosten({ palette, t, posten, onNavigate })`.

Texte (de, Platzhalter fix): `schulden.posten.ausserdem` = «Ausserdem offen: {anzahl} Arztrechnungen · {betrag}» (Einzahl-Variante `ausserdemEins`), `schulden.posten.naechsteFrist` = «nächste Frist {datum}», `schulden.posten.zumTracker` = «zum KVG-Tracker», `schulden.posten.titel` = «Offene Posten», `schulden.posten.gruppeArzt` = «Arztrechnungen · im KVG-Tracker», `schulden.posten.gruppeForderungen` = «Forderungen · im Schuldenmanager», `schulden.posten.rechnungVom` = «Arztrechnung vom {datum}», `schulden.posten.ohneDatum` = «Arztrechnung ohne Datum», `schulden.posten.frist` = «Frist {datum}», `schulden.posten.fristAbgelaufen` = «Frist abgelaufen ({datum})», `schulden.posten.ausArzt` = «aus Arztrechnung».

- [ ] **Step 1: Failing tests** (`renderToStaticMarkup`, `t`-Stub wie in der Datei):
  - `AusserdemOffen` mit `posten.arzt = []` → `''` (kein «0 Rechnungen»).
  - mit 2 Belegen → enthält `schulden.posten.ausserdem` mit `"anzahl":2`, `betrag(640, { stellen: 2 })`, `naechsteFrist`; ohne Frist kein `naechsteFrist`.
  - `OffenePosten` → beide Gruppentitel, Beleg ohne Datum als `schulden.posten.ohneDatum`, übernommene Forderung mit `schulden.posten.ausArzt`, Summe `betrag(summe, { stellen: 2 })`.
  - **Kein Rot:** Markup enthält weder `palette.roseDeep` noch `palette.rose` (beide Paletten).
- [ ] **Step 2:** Lauf → FAIL.
- [ ] **Step 3:** Bausteine bauen. `OffenePosten` als `section` mit `aria-labelledby`, Zeilen als `ul`/`li`, Beträge `tabular-nums`, Weg zum Tracker über `onNavigate('kvg')` (Knopf, `color` explizit), Forderungen-Gruppe ohne Knopf (man ist schon da). In `SchuldenManager`: `const posten = offenePosten(data_mit_aktuellen_schulden, heuteIso())` — mit `{ ...data, schulden }` aus dem lokalen Zustand, damit frisch Erfasstes sofort zählt. Abschnitte nur zeigen, wenn `posten.arzt.length + posten.forderungen.length > 0`.
- [ ] **Step 4:** Tests, `src/i18n`, Gesamtlauf → PASS. Vorschau im Beispielprofil (Forderungen von Hand), hell/dunkel, 375 px: keine horizontale Scrollleiste.
- [ ] **Step 5:** Commit `feat(schulden): Übersicht — «Ausserdem offen» und «Offene Posten» aus beiden Ablagen`.

### Task 4: Übernehmen im KVG-Tracker, «als bezahlt markieren», Abgleich beim Speichern

**Files:**
- Modify: `src/KVGLeistungen.jsx` (Beleg-Zeile um Zeile 687; neue Prop `onUebernehmen`)
- Modify: `src/main.jsx:1552-1557` (SchuldenManager `onSave`) und `:1642` (KVGLeistungen-Props)
- Modify: `src/SchuldenManager.jsx` (Karte im Tab «Schulden»: Zweitknopf «Als bezahlt markieren» / «Wieder offen»; Anzeige-Name für `ausBeleg`-Forderungen)
- Modify: `src/i18n/*.js` (`kvg.alsForderung`, `kvg.wirdGefuehrt`, `kvg.zumSchuldenmanager`, `kvg.loeschenVerbunden`, `schulden.alsBezahlt`, `schulden.wiederOffen`)
- Test: `src/__tests__/kvgUebernehmen.test.js` (neu), `src/__tests__/schuldenDatenModus.test.js` (ergänzen)

**Interfaces:**
- Consumes: `istBelegUebernehmbar`, `belegAlsForderung`, `abgleichBelege` (Task 1).
- Produces: Prop `onUebernehmen?: (belegId: string) => void` an `KVGLeistungen`; in `utils/offenePosten.js` zusätzlich `uebernehmen(prev, belegId, heute, neueId) → data` und `nachSchuldenSpeichern(prev, schuldenData) → data`.

Lücke im Spec, hier geschlossen: bestehende Forderungen hatten **keinen** Weg zu «bezahlt» (nur beim Erfassen). Der Zweitknopf setzt `status` `'paid'` ↔ `'open'`; der Bezahlt-Abgleich läuft dann über `onSave`.

- [ ] **Step 1: Failing tests:**
  - Render `KVGLeistungen` (Beleg-Tab) mit offenem Beleg, Frist abgelaufen, `onUebernehmen` gesetzt → Markup enthält `kvg.alsForderung`; Beleg mit `forderungId` → enthält `kvg.wirdGefuehrt`, nicht `kvg.alsForderung`; ohne `onUebernehmen` (Beispiel) → kein Knopf.
  - Löschen-Knopf eines verbundenen Belegs ist ersetzt durch den Hinweis `kvg.loeschenVerbunden` (kein stilles Mitlöschen).
  - `schuldenDatenModus`: die `main.jsx`-Verdrahtung als reine Funktion prüfen — `uebernehmen(prev, belegId, heute, id)` ergibt `{ ...prev, ...belegAlsForderung(prev, …) }`, und `nachSchuldenSpeichern(prev, schuldenData)` ergibt `abgleichBelege({ ...prev, ...schuldenData })` (beide in `utils/offenePosten.js` exportieren, `main.jsx` ruft nur sie auf).
  - Beispielmodus (Review Focus 4): `main.jsx` übergibt `onUebernehmen` **nicht**, wenn `demoMode` — als Quelltext-Test wie die übrigen `main.jsx`-Wächter in `schuldenDatenModus.test.js` (Muster dort übernehmen).
- [ ] **Step 2:** Lauf → FAIL.
- [ ] **Step 3:** Umsetzen: KVG-Beleg-Zeile zeigt bei `istBelegUebernehmbar(b, heuteIso())` einen Zweitknopf (Stil wie `zweitKnopf`), bei `b.forderungId` die Zeile `kvg.wirdGefuehrt` + Weg `onNavigate('schulden')`. `main.jsx`: `onUebernehmen: demoMode ? undefined : (id) => writeData(prev => uebernehmen(prev, id, heuteIso(), Date.now()))`; SchuldenManager `onSave: (s) => writeData(prev => nachSchuldenSpeichern(prev, s))`. In der Schulden-Karte Name `debt.creditor || t('schulden.posten.rechnungVom', { datum: formatDE(debt.belegDatum) })` (ohne Datum `ohneDatum`).
- [ ] **Step 4:** Tests + Gesamtlauf + `npx size-limit` → PASS. Vorschau **im Probe-Modus** (nicht Beispiel): Beleg erfassen → übernehmen → im Schuldenmanager «als bezahlt» → Beleg steht auf «Bezahlt».
- [ ] **Step 5:** Commit `feat(kvg+schulden): Arztrechnung bewusst als Forderung führen, bezahlt abgleichen`.
- [ ] **Step 6 (Teil 1 abschliessen):** Prüfer `a11y-pruefer`, `copy-pruefer`, `polygrafin`, `swiss-precision-pruefer` (Hinweistexte Task 2), `qualitaets-pruefer`; Befunde einarbeiten, je Befund ein Commit. pii-scan einzeln (`rc=0`), push, Entwurfs-PR «Schulden R2 · Teil 1 — Rechnungen ↔ Schulden».

### Task 5: Verlustscheine — Rolle, Lesezeile, Zeitachse mit Verjährung

**Files:**
- Modify: `src/SchuldenManager.jsx` (Tab «Verlustscheine», Zustand `bearbeite: id|null`)
- Modify: `src/schuldenCalc.js` (`verjaehrungVerlustschein`)
- Modify: `src/components/SchuldenBilder.jsx` (`VerlustscheinZeitachse`)
- Modify: `src/i18n/*.js` (`schulden.verlustschein.rolle.*`, `.zinslos`, `.verjaehrt`, `.ohneDatum`, `.bearbeiten`, `.fertig`)
- Test: `src/__tests__/schuldenCalc.test.js`, `src/__tests__/schuldenBilder.test.js`

**Interfaces:**
- Produces: `verjaehrungVerlustschein(entry) → string|null` (ISO `YYYY-MM-DD`: Ausstellungsdatum `entry.date` + 20 Jahre; `null` ohne gültiges Datum; 29.02. → 28.02.); `VerlustscheinZeitachse({ palette, t, eintraege, heute })`.

- [ ] **Step 1: Failing tests:** `verjaehrungVerlustschein({ date: '2021-03-15' }) === '2041-03-15'`; `{ date: '2024-02-29' }` → `'2044-02-28'`; `{}` und `{ date: 'x' }` → `null`; alter Eintrag im deutschen Format (`'15.3.2021'`) über `alsIsoDatum` → `'2041-03-15'`. Ansicht: `rolle 'schulde'` → Text mit 149 Abs. 4 («keine Zinsen»); `rolle 'geschuldet'` → **kein** Zins-Satz; ohne Datum → `schulden.verlustschein.ohneDatum`, keine Linie; Eintrag ohne `rolle` → beide Namensfelder im Bearbeiten-Modus + Rollen-Auswahl.
- [ ] **Step 2:** Lauf → FAIL.
- [ ] **Step 3:** Lesezeile (Rolle · Name · Betrag · ausgestellt · «verjährt am …») mit Knopf «Bearbeiten»; im Bearbeiten-Modus die bisherigen Felder, Rollen-`select` zuerst, danach **ein** Namensfeld (`creditor` bei `schulde`, `debtor` bei `geschuldet`), ohne Rolle beide. Zeitachse: ein Ton (`STUFEN_TON[2]`), Achse von frühester Ausstellung bis spätester Verjährung, «heute»-Marke, Text daneben je Zeile. Erklärtext 149a Abs. 1 inkl. Erben-Satz **wörtlich aus dem Spec**.
- [ ] **Step 4:** Tests + Gesamtlauf → PASS; Vorschau hell/dunkel/375 px.
- [ ] **Step 5:** Commit `feat(schulden): Verlustscheine mit Rolle, Lesezeile und Verjährung (SchKG 149/149a)`.

### Task 6: Betreibung — Lesezeile, Zeitleiste der erfassten Daten, Verbindung zur Forderung

**Files:**
- Modify: `src/SchuldenManager.jsx` (Tab «Betreibung»)
- Modify: `src/components/SchuldenBilder.jsx` (`BetreibungZeitleiste`)
- Modify: `src/i18n/*.js` (`schulden.betreibung.auszugRegel`, `.verbinden`, `.verbundenMit`, `.keineVerbindung`)
- Test: `src/__tests__/schuldenBilder.test.js`

**Interfaces:**
- Produces: `BetreibungZeitleiste({ palette, t, eintraege, heute })` — Punkte an den erfassten `registerDate`, **keine** Endlinie.

- [ ] **Step 1: Failing tests:** Zeitleiste rendert für 2 Einträge 2 Punkte mit Datum als Text; Markup enthält **kein** errechnetes Jahr `registerDate + 5` (Mutationswächter gegen «Enddatum erfinden»); Eintrag ohne Datum erscheint nur in der Liste, nicht auf der Leiste; Regeltext `schulden.betreibung.auszugRegel` steht immer, sobald es Einträge gibt; Verbindung: `select` der offenen Forderungen, gewählte zeigt `verbundenMit` mit Name; gelöschte Forderung → `keineVerbindung` (kein Absturz).
- [ ] **Step 2:** Lauf → FAIL.
- [ ] **Step 3:** Lesezeile + «Bearbeiten» wie Task 5; `select` «Verbunden mit» (`''` + offene Forderungen) setzt `forderungId`; die bisherige Hinweiszeile `bild.ausForderungen` bleibt für Forderungen mit Stufe `zahlungsbefehl` **ohne** verbundene Betreibung. Regeltext 8a Abs. 4 **wörtlich aus dem Spec**.
- [ ] **Step 4:** Tests + Gesamtlauf + size-limit → PASS; Vorschau.
- [ ] **Step 5:** Commit `feat(schulden): Betreibung als Lesezeile, Zeitleiste ohne erfundenes Ende (SchKG 8a)`.
- [ ] **Step 6 (Teil 2 abschliessen):** Prüfer wie Task 4 Step 6, `swiss-precision-pruefer` für die Texte 8a/149/149a; pii-scan einzeln, push, Entwurfs-PR «Schulden R2 · Teil 2 — Betreibung und Verlustscheine».
