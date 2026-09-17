# Freigabe-Register je Rechner und Modul

*Angelegt 15.09.2026 auf `main` = `525300f` (Bau-Liste `docs/BAULISTE-2026-09-30.md`, Punkte K9 und
K10; Herkunft: `docs/TODO.md` §G2). Jede Zeile ist aus Code, Code-Kommentaren, `docs/` oder `git`
belegt und nennt die Datei. Was dort nicht steht, steht hier auch nicht.*

## Wie man diese Tabelle liest

- **Fachliche Prüfung (Fachperson):** eine *externe* Prüfung durch eine fachkundige Stelle
  (Sozialdienst, Treuhand, Anwaltskanzlei, Amt, Beratungsstelle). **Bei keinem der 24 Module ist eine
  solche Prüfung im Repo dokumentiert.** Die Spalte sagt deshalb überall «keine dokumentiert». Das ist
  ein Befund und kein Platzhalter: niemand wird hier nachgetragen, bevor eine Prüfung mit Stelle,
  Datum, Umfang und Beleg vorliegt.
- **Interne Prüfung:** was es gibt, sind Prüfungen durch Stebler Studios und durch KI-Prüfagenten
  (`swiss-precision-pruefer` u. a.), etwa die Predeploy-Runde 8 (Juli 2026, in Code-Kommentaren
  festgehalten) und das Voll-Review Stufe L vom 15.09.2026 (`docs/audits/voll-review-L-2026-09-15.md`).
  Sie prüfen gegen amtliche Quellen, **ersetzen aber keine Fachperson** und stehen darum in einer
  eigenen Spalte.
- **Rechtsgrundlage laut Code:** nur Artikel und Erlasse, die im Code oder in `docs/` wörtlich
  genannt sind. «im Code nicht zitiert» heisst: der Code nennt keine; es heisst nicht, dass es keine
  gibt.
- **Datenstand:** die Versions-Konstante bzw. der «Stand» im Kopfkommentar, dazu der letzte Commit
  der Datendatei (`git log -1`).
- **Freigabe:** eine formelle Freigabe je Modul gibt es nicht. Heute heisst «freigegeben»: Stebler
  Studios hat gemergt und deployt (`DEV_WORKFLOW.md`). Eine eigene Spalte dafür wäre leer.

**Kurzbilanz:** 24 Module · 0 mit dokumentierter externer Fachprüfung · 10 mit Artikel oder Erlass im
Code, dazu die Sozialhilfe mit den SKOS-Richtlinien · 1 Modul mit offenem 🔴 aus dem Voll-Review (IPV, Entscheid E9).

---

## 1 · Das Register

| # | Modul (Ansicht → Datei) | Fachliche Prüfung (Fachperson) | Rechtsgrundlage laut Code | Datenstand / letzter Commit | Kantone | Interne Prüfung · offen |
|---|---|---|---|---|---|---|
| 1 | **AHV-Altersrente** — `VorsorgeRechner.jsx` Reiter AHV → `src/data/ahvRechner.js` | keine dokumentiert | Art. 34–40 AHVG; Art. 55ter Abs. 1 AHVV (SR 831.101), wörtlich aus Fedlex; Art. 39 Abs. 1 und 3 AHVG; Art. 29sexies/29septies AHVG (`ahvRechner.js:2, :19–27, :35, :139`) | `AHV_DATA_VERSION = '2026'`, Quelle «BSV Rententabellen 2026» (`:512–513`) · `33cd13d` 15.09.2026 | Bundesrecht, kantonsunabhängig | Voll-Review 15.09.: 🔴 Aufschub linear → Tabelle Art. 55ter AHVV (PR #136); ⚠️ 13. Rente bei Ehepaaren «am Gesetz prüfen» (`voll-review…:89`) |
| 2 | **BVG-Guthaben und -Rente** — `VorsorgeRechner.jsx` Reiter BVG → `ahvRechner.js` `BVG_PARAMS` | keine dokumentiert | Art. 16 BVG (`ahvRechner.js:247`); Mindestzins, Umwandlungssatz 6.8 % und Eintrittsschwelle ohne Artikel | «Stand 2026», Wartung Januar 2027 (`:510–511`) · `33cd13d` | Bundesrecht | Voll-Review: «AHV/BVG-Eckwerte 2026» bestätigt (`voll-review…:93`) |
| 3 | **Kapitalbezugssteuer** — `VorsorgeRechner.jsx` Reiter Kapitalbezug → `src/data/kapitalbezugSteuer.js` | keine dokumentiert | Bund: Art. 38 Abs. 2 DBG (`:6`). Kanton: kein Erlass, empirische Effektivsätze von finpension, Steuerjahr 2026 (`:25, :180`) | `'2026 (Orientierung)'` (`:179`) · `d03c686` 07.07.2026 | 26, je Hauptort, ledig, Bezug mit 65 | Kantonsanteil stammt von einem privaten Anbieter, nicht von einem Amt |
| 4 | **Steuern** — `TaxCalculator.jsx` → `src/data/steuerRechner.js`, `src/data/kantonaleSteuerdaten.js` | keine dokumentiert | Art. 36 Abs. 1, 2, 2bis DBG; VKP (SR 642.119.2) (`steuerRechner.js:1–3, :10, :26, :45`). Kanton: kein Erlass, Faktor aus «ESTV Steuerbelastung 2024» (`kantonaleSteuerdaten.js:3`) | Bund: Steuerjahr 2026 (`steuerRechner.js:206`) · `c09e304` 28.06.2026. Kanton: `'2024 (Orientierung)'` · `29c2d2f` 25.06.2026 | 26, Hauptort, ledig, rund CHF 80 000 | Bundestarif mit Prüfankern gegen die ESTV-Tabelle (`steuerRechner.js:8`). ⚠️ Alleinerziehende ohne Elterntarif; ⚠️ Faktor bei 80 000 geeicht, auf alles angewandt (`voll-review…:85–86`). Bug B-2 (`BUGS.md`) |
| 5 | **ALV-Taggeld** — `AlvRechner.jsx` → `src/data/alvRechner.js` | keine dokumentiert | im Code nicht zitiert (Quellen: SECO, arbeit.swiss, zh.ch, `:2–3`) | `version: '2025'`, «Stand 01.01.2025» · `28b8e99` 24.06.2026 | Bundesrecht; Kanton nur für den Link | ⚠️ Werte 2025 im Jahr 2026 (`voll-review…:90`) |
| 6 | **EO: Mutterschaft, Vaterschaft, Adoption, Betreuung** — `EOrechner.jsx` → `src/data/eoRechner.js` | keine dokumentiert | EOG Art. 16a–16n, «EOMV» (so im Code, `:2–4`) | «Stand 2026» (`:5, :176`) · `15ac9ba` 13.07.2026 | Bundesrecht | — |
| 7 | **Sozialhilfe (SKOS)** — `SozialhilfeView.jsx`, `SozialhilfeRechner.jsx` → `src/data/sozialhilfeRechner.js`, `src/config/cantonalData.js` `calculateSozialhilfe` | keine dokumentiert | SKOS-Richtlinien C.3–C.6 und D.3.1 (Empfehlung, kein Gesetz; `sozialhilfeRechner.js:4, :72`, `cantonalData.js:251, :289`) | `SKOS_DATA_VERSION = '2026-01'` (bis 16.09.2026 `'2025-01'`, obwohl der Vermögensfreibetrag schon auf 1.1.2026 stand), Grundbedarf «gegengeprüft 2026-07-19», für 2026 unverändert (`sozialhilfeRechner.js:1–11`) · `03e2448` 19.07.2026 | national (SKOS); Mietzins-Limite je Kanton aus Zeile 8 | Voll-Review: SKOS bestätigt (`voll-review…:93`) |
| 8 | **Wohnkosten-Limiten** (in Sozialhilfe und Mietzins) → `cantonalData.js` `CANTONAL_RENT_LIMITS` | keine dokumentiert | im Code nicht zitiert; Kommentar «SKOS-Richtlinien + kantonale Anpassungen» (`:212`), kein Einzelbeleg je Kanton | kein eigener Stand (der Datei-Stand `CANTONAL_DATA_VERSION = '2024/2025'` war nirgends angezeigt und ist seit 16.09.2026 entfernt) · `31c79e7` 28.06.2026 | 26 + `_default` | Einzelwerte je Kanton im Repo nicht belegt |
| 9 | **Prämienverbilligung (IPV)** — `PremiumSubsidy.jsx`, Schnellcheck, Prämien-Beleg, Budget → `cantonalData.js` `CANTONAL_IPV`, `calculateIPV`; Antragslinks `src/premiumCalc.js` | keine dokumentiert | im Code nicht zitiert; Kommentar «BAG, kantonale Gesundheitsdirektionen (vereinfacht, Stand 2024/2025)» (`:182`) | `'2024/2025'` · `31c79e7` 28.06.2026 | 26 (Grenzen und Beträge); Antragslink eigens für ZH, BE, GE, VD, sonst BAG | 🔴 **offen:** Tabelle mustergeneriert (Familie = 2 × Einzel, Kind = 0.5 ×), linearer Abbau erfunden, zeigt trotzdem «Berechtigt» + CHF-Betrag → **Entscheid E9 / M13** (`voll-review…:29, :83`). Bug B-1 (`BUGS.md`) |
| 10 | **EL-Hinweis** — Schnellcheck, Finanzübersicht → `cantonalData.js` `checkELEligibility` | keine dokumentiert | im Code nicht zitiert; Faustregel «nur mit AHV-/IV-Rente, Einkommen < Miete + Prämie + 2000» (`:388`) | kein Stand | kantonsunabhängig | Heuristik ohne Quelle; zeigt nur einen Hinweis, keinen Betrag |
| 11 | **KK-Prämienvergleich** — `PraemienOrientierung.jsx` → `src/data/praemienRegionen.js`, `praemienDetail.js`, `versichererListe.js` | keine dokumentiert | im Code nicht zitiert (amtliche Daten, keine Rechtsaussage) | BAG priminfo, Stand 2026 (release-2026-04-30); Gesamtbericht Prämien 2026; Versicherer Stand 01.01.2026 · `71518c8`/`60c3e40` 30.06.2026 | alle Gemeinden über die BFS-Nummer | aus BAG-Dateien generiert (`scripts/build-praemien-*.mjs`) |
| 12 | **KVG-Leistungen, Franchise, Selbstbehalt** — `KVGLeistungen.jsx`, Franchise-Tacho → `src/data/kvgLeistungen.js` | keine dokumentiert | KVG Art. 25–31, Art. 64 (Abs. 6), KLV (`:1–2, :146`); Taxpunktwerte provisorisch festgesetzt (kein KVG-Artikel regelt das Provisorische, Bau-Liste §14 K52) | `KVG_DATA_VERSION = '2026-06'` (Franchise/Katalog). Taxpunktwerte seit K27 mit eigenem `TAXPUNKTWERT_DATA_VERSION = '2026-09-16'` (`:167`): 17 Kantone amtlich belegt Stand 2026 (K22), 9 Kantone (AG, BL, SO, AI, GL, SH, JU, NE, VS) ohne Beleg 2026, zeigen weiter Stand 2025 (`:145–162`, K30). Mammografie «Stand 07.2026» (`:278`) · `0b90af1` 12.07.2026 + K26/K27-Nachtrag 16.09.2026 | Taxpunktwert je Kanton; Mammografie-Programm 18 Kantone mit, 8 ohne | ⚠️ 9 Kantone ohne 2026-Beleg (Fussnote `kvg.tpwNote` nennt sie, K26); ⚠️ Generika-Selbstbehalt nicht belegt (`voll-review…:87–88`) |
| 13 | **Mietzinsbeiträge** — `MietzinsOrientierung.jsx` → `src/data/mietzinsbeitraege.js` | keine dokumentiert | im Code nicht zitiert; Quellen je Programm: kantonale Stellen, Übersicht BWO (`:14`) | `MIETZINS_DATA_VERSION = '2025'`, Parameter als «Richtwerte» (`:11–17`) · `8e102ee` 14.07.2026 | Programm belegt: BS, BL, GE, ZG; alle anderen «bei Gemeinde/Kanton prüfen» | — |
| 14 | **Mietpreis-Vergleich** — `MietVergleich`, `RegionalBarometer` → `src/data/mietpreise.js` | keine dokumentiert | keine (Statistik) | BFS Strukturerhebung, `MIETPREIS_DATA_YEAR = 2020` · `71518c8` 30.06.2026 | 26 + national | Stand 2020 |
| 15 | **Mindestlohn-Prüfung** — Kapitel Finanzen, Finanzübersicht → `src/data/lohnCheck.js` | keine dokumentiert | JU: RSJU 822.411 Art. 5; TI: Decreto esecutivo 11.12.2025 (RL 843.620), LSM Art. 4; GE, NE, BS: nur Kantonsportal genannt (`lohnCheck.js:1–10, :20`); NE: LEmpl Art. 32a ff. (`lohnRechtsstellen.js:21`) | «Stand per 1.1.2026», an den Volltexten verifiziert 2026-07-15 (`:1, :10`) · `424fe31` 19.07.2026 | GE, NE, JU, BS, TI | Predeploy-Runde 8 (TI-Indexierung korrigiert, `:20`); Voll-Review «Mindestlöhne 2026 sauber» |
| 16 | **Lohn-Einordnung (Barometer)** → `src/data/lohnEinordnung.js`, `src/data/branchenLohn.js` | keine dokumentiert | keine (Statistik); BFS-Medienmitteilung LSE 2024 vom 25.11.2025 (`branchenLohn.js:16–17, :26`) | `BRANCHENLOHN_VERSION = '2022/2024'`, bewusst gemischt, jedes Jahr am Chip · `e6622ff` 18.07.2026 | national | Predeploy-Runde 8: drei Funde behoben (`lohnEinordnung.js:16–25`) |
| 17 | **Lohn-Brief und Anlaufstellen** — `BriefGenerator.jsx` → `src/data/lohnRechtsstellen.js`, `src/briefGenerator.js` | keine dokumentiert | je Kanton in `LOHN_KONTROLLSTELLEN`; ungeprüfte Einträge tragen `verify: true` und gehen nicht ungeprüft in einen Brief (`lohnRechtsstellen.js`, Kopf) | `664c6a4` 15.07.2026 · `briefGenerator.js` `043580a` 15.09.2026 | Mindestlohn-Kontrollstelle nur GE, NE, JU, TI, BS; Schlichtung in jedem Kanton | **wageClaim ruht:** `WAGECLAIM_BEREIT = false` (`lohnCheck.js:74`), Entscheid E1 / M7. Beleg-Bilanz im Kopf: von zwei geprüften Einträgen war einer erfunden |
| 18 | **Stipendien** — `StipendienView.jsx` → `src/data/stipendienData.js` | keine dokumentiert | Stipendien-Konkordat 2009, in Kraft seit 1.3.2013 (`:3`) | `STIPENDIEN_DATA_VERSION = '2026-06'` · `6ec38c5` 24.06.2026 | kantonal; App verlinkt nur die Stelle | keine Beträge, nur Orientierung |
| 19 | **Familien-EL und Mutterschaftsbeihilfe** — `Lebenssituationen.jsx` → `src/data/familienEL.js`, `src/data/mutterschaftsbeihilfe.js` | keine dokumentiert | im Code nicht zitiert; nur Kantonsportale | URLs «2026-07 einzeln web-verifiziert» · `a457cf8`/`3b9011a` 06.07.2026 | Familien-EL: TI, VD, SO, GE · Mutterschaftsbeihilfe: GR, SG, ZG, FR | kein Rechner, keine Beträge |
| 20 | **Budget-Richtwerte und Teuerung** — `BudgetSync.jsx` → `src/budgetSync.js` | keine dokumentiert | keine (Statistik): BFS HABE 2020/21, BFS LIK Basis Dez. 2020, Stand August 2025 (`:18–20, :62–64`) | siehe links · `e74c3e7` 30.06.2026 | national | 💡 LIK ab 2026 neu basiert → Januar-Wartung (`voll-review…:91`) |
| 21 | **Versicherungs-Schutzschild** — `components/Schutzschild.jsx` → `src/data/schutzschild.js` | keine dokumentiert | KVG Art. 3; UVG und BVG ohne Artikel (`:6`) | BVG-Schwelle aus `ahvRechner.js` (2026) | Bundesrecht | — |
| 22 | **Schulden-Tilgungsplan** — `SchuldenManager.jsx` → `src/schuldenCalc.js` | keine dokumentiert | keine (reine Tilgungsrechnung) | kein Stand · `ca4bc5a` 28.06.2026 | kantonsunabhängig | 💡 Betreibungsauszug-Funktionen ohne Aufrufer (`voll-review…:72`) |
| 23 | **Pflege-Entlöhnung** — `PflegeEntloehnung.jsx` | keine dokumentiert | keine; CHF 37.90/h ist ein Anbieter-Richtwert (pflegewegweiser.ch), «kein gesetzlicher Tarif» (`:4–9`) | kein Stand | kantonsunabhängig (Kanton beeinflusst den realen Lohn, `:8`) | — |
| 24 | **Asyl-Orientierung** — `AsylView.jsx` → `src/data/asylData.js` | keine dokumentiert | im Code nicht zitiert; SEM, SFH, humanrights.ch (`:2–3`) | «Stand 2025» · `36e4bdc` 27.06.2026 | kantonal (Migrationsämter) | `docs/TODO.md` §A: «fachliche Review vor Deploy empfohlen» — als erledigt nirgends dokumentiert |

**Nicht aufgenommen, weil sie nichts Fachliches rechnen:** Reserve-Tank (`reserveTank.js`, Ersparnis
÷ Ausgaben), Leistungs-Kompass, Obstgarten und Gepäck (Navigation), Direktlinks (Linkliste,
`DIREKTLINKS_VERSION = '2026-06'`). Die Brief-Vorlagen ausser dem Lohn-Brief zitieren Gesetzesartikel
im Text (`src/i18n/*.js`); sie sind Vorlagen, keine Rechner, und gehören in ein eigenes Register,
wenn eines gebraucht wird.

---

## 2 · Crosslink-Prüfung (K10)

**Frage:** «Der Kanton, der am Anfang gewählt wird, wird überall übernommen» und «der IPV-Rechner
übernimmt Eingaben nicht». Nachgestellt am Code 15.09.2026; der Ist-Zustand ist in
`src/__tests__/crosslinkKanton.test.js` festgehalten (11 Tests, grün).

**Woher der Kanton kommt:** das Onboarding schreibt ihn nach `basis.canton` (`Onboarding.jsx:60`,
freiwillig). Trägt man später im Kapitel Wohnen eine PLZ ein, füllt `main.jsx:679` den Kanton
**nur, wenn er noch leer ist**, dazu `behoerden.cantoneOfTaxation` (`:680`).

| Rechner | Kanton aus | Haushalt aus | Einkommen aus | eigene Eingaben statt Übernahme | Befund |
|---|---|---|---|---|---|
| IPV (`PremiumSubsidy.jsx`) | `basis.canton` (`:44`) | `getHouseholdInfo` | `monthlyIncome` + `sideIncome` + Partner (`cantonalData.js:330`) | Einkommensfeld nur, wenn keins erfasst ist; schreibt **ins Profil** (`:237–238`) | ✅ übernimmt das Profil. ❌ **B-1:** Zahlen aus dem Schnellcheck kommen nicht an |
| Schnellcheck / Anspruch-Check | `basis.canton`, kein eigenes Feld (`Schnellcheck.jsx:19`) | `getHouseholdInfo` | Einkommen, Miete, Prämie **lokal**, aus dem Profil vorbelegt (`:21–23`) | ja, bewusst «zum Ausprobieren», wird nicht gespeichert | Quelle von B-1 |
| Steuern (`TaxCalculator.jsx`) | `basis.canton` als Startwert eines eigenen Felds (`:26`) | Zivilstand, Kinder aus dem Profil (`:27–28`) | `monthlyIncome` + `sideIncome` + Partner (`:43`) | Kanton, Abzüge, steuerbares Einkommen | ✅ übernimmt. ❌ **B-2:** gespeicherter Kanton wird nie wieder gelesen; `cantoneOfTaxation` wird nicht genutzt |
| Sozialhilfe (`SozialhilfeView.jsx`, `SozialhilfeRechner.jsx`) | `basis.canton` (`:14`) | `getHouseholdInfo` bzw. `basis.household` | Profil; im Rechner nicht vorbelegt, wenn als Brutto erfasst (`SozialhilfeRechner.jsx:22–23`) | Vermögen, Einkünfte, Integration im Rechner | ✅ |
| Vorsorge / AHV / BVG / Kapitalbezug (`VorsorgeRechner.jsx`) | Kapitalbezug: `basis.canton` als Startwert (`:58`) | Zivilstand, Partner-Einkommen (`:47–48`) | `monthlyIncome` × 12 als Startwert (`:41`), ohne Nebeneinkommen | Beitragsjahre, BVG-Guthaben, Rendite u. a. (gibt es im Profil nicht) | ✅ |
| ALV (`AlvRechner.jsx`) | nur für den Link (`:44`) | Kinder aus `basis.household` (`:18`) | `monthlyIncome`, **nicht** vorbelegt bei Netto (`:23–24`, ALV rechnet brutto) | Beitragsmonate, IV-Grad | ✅, die Netto-Lücke ist Absicht |
| EO (`EOrechner.jsx`) | nicht gebraucht (Bundesrecht) | nicht gebraucht | `monthlyIncome` × 12 als Startwert (`:9`) | Ereignis, Daten | ✅ |
| Stipendien (`StipendienView.jsx`) | `basis.canton` (`:19`) | — | — | Ausbildungsstand | ✅ |
| Mietzins (`MietzinsOrientierung.jsx`) | `basis.canton`, sonst PLZ (`:18–23`) | `getHouseholdInfo` | `monthlyIncome` (`:32`) | — | ✅ |
| Finanzübersicht (`FinanzUebersicht.jsx`) | `basis.canton` (`:120`) | Zivilstand | `monthlyIncome` (`:118`) | — | ✅ |
| KK-Prämienvergleich (`PraemienOrientierung.jsx`) | aus der **PLZ** (Prämienregion braucht die Gemeinde) | Alter aus Geburtsdatum | — | PLZ; schreibt sie ins Profil zurück (`:53–54`) | ✅, eigene Logik mit Grund |
| Lebenssituationen, Budget, Umzug (`Lebenssituationen.jsx:22`, `BudgetSync.jsx:42`, `UmzugAblauf.jsx:33`) | **zuerst PLZ**, dann `basis.canton` | — | Budget-Zahlen | — | ⚠️ **D-1**, siehe unten |

**Ergebnis:**

1. **«Der Kanton am Anfang wird überall übernommen» — stimmt, mit einer Ausnahme.** Jeder Rechner
   liest `basis.canton`; keiner fragt ihn ein zweites Mal ab (Tests Block 1 und 2). Die Ausnahme
   **D-1:** Lebenssituationen, Budget und Umzug nehmen zuerst den Kanton der PLZ. Wer im Onboarding
   Zürich wählt und später eine Berner PLZ einträgt, sieht dort Berner Angebote, während IPV,
   Steuer und Sozialhilfe mit Zürich rechnen (Test Block 4). Das ist so gebaut und kommentiert
   (`BudgetSync.jsx:199–203`, `Lebenssituationen.jsx:19–20`), also kein Bug. Aber es ist ein
   **Entscheid**: welcher Kanton gilt, wenn beide verschieden sind? Nicht eingetragen in `BUGS.md`.
2. **«Der IPV-Rechner übernimmt Eingaben nicht» — stimmt nur für den Weg aus dem Schnellcheck.**
   Kanton, Haushalt und Profil-Einkommen übernimmt er (Test Block 3). Was man im Schnellcheck oder
   im Anspruch-Check eintippt, kommt nicht an → **B-1** in `BUGS.md`.
3. **Nebenbefund B-2:** der Steuerrechner speichert seinen Kanton an eine Stelle, die niemand liest.
   Eingetragen in `BUGS.md`.

**Gefixt: nichts.** Alle drei Punkte legen fest, welche Zahl oder welcher Kanton gilt. Das ist ein
Entscheid von Stebler Studios, kein Stunden-Fix ohne Fachlogik.

---

## 3 · Pflege dieses Registers

- **Wenn sich eine Versions-Konstante ändert** (`*_DATA_VERSION`, «Stand» im Kopf): die Zeile hier
  im selben PR nachziehen.
- **Eine Fachperson wird nur eingetragen**, wenn die Prüfung belegt ist: Stelle (Institution, keine
  Privatperson ohne ihr Einverständnis), Datum, geprüfter Umfang (welche Datei, welcher Stand) und
  ein Beleg im Repo (z. B. `docs/legal/pruefungen/…`). Ein mündliches «hat mal drübergeschaut» ist
  keine Prüfung.
- **Ein neues Modul, das rechnet oder eine Rechtsaussage macht,** bekommt hier eine Zeile, bevor es
  live geht.
