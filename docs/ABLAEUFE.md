# Abläufe — Inventar & Audit

> **Zweck.** Maloja modelliert *Lebensrealität*, nicht Behördenstrukturen. Menschen leben
> Situationen, keine Formulare. Diese Datei hält fest, **welche Lebensabläufe** die App
> abdeckt, **welche Bausteine** schon da sind, **wo es hapert** und **was wo verlinkt**
> werden muss — damit jeder mögliche Ablauf *sauber und ruhig* gehbar ist.
>
> Leitfrage (aus dem Swiss-Life-Model): *„Hilft das den Menschen, ihre Schweizer
> Lebensrealität ruhiger, verständlicher und mit weniger Aufwand zu organisieren?"*

---

## Das Audit-Raster

Jeder Ablauf wird durch dieselben sieben Spalten gedacht:

| # | Spalte | Frage |
|---|--------|-------|
| 1 | **Auslöser** | Welche *Lebenssituation* startet den Ablauf? (nicht der Paragraf) |
| 2 | **Ideale Schritte** | Was sind die ruhigen, sinnvollen Schritte von Anfang bis Ende? |
| 3 | **Vorhandene Bausteine** | Welche Views/Module/Funktionen decken Teile davon? |
| 4 | **Verwendet?** | Sind die Bausteine *verkettet* — oder stehen sie isoliert nebeneinander? |
| 5 | **Lücken** | Welcher Schritt hat heute keinen Baustein? |
| 6 | **Crosslinks** | Welche Verbindung zu anderen Abläufen fehlt (`onNavigate`-Ziel)? |
| 7 | **Nächste Aktion** | Der eine kleinste sinnvolle Schritt zur Verbesserung. |

**Statuslegende:** ✅ verkettet · 🟡 Baustein da, isoliert · 🔴 Lücke · 🔗 Crosslink fehlt

---

## Bausteine-Register (Stand: Discovery)

**Views (~39):** chapter · dashboard · tresor · kk · budget · taxImport · schulden · tax ·
organ · sync · premium · praemien · vorsorge · alv · asyl · flyer · merkliste · search ·
eo · stipendien · cv · charts · finanzuebersicht · sozialhilfe · direktlinks · kvg ·
unterlagen · lebensmappe · notfalldossier · behoerdendossier · briefe · notfalleinstieg ·
export · calendar · notifications · settings · legal

**Generatoren:** `briefGenerator.js` → nur **3 Vorlagen**: `leaseTermination` (OR 266a),
`taxExtension`, `insuranceSwitch` (KVG 7) · `CVGenerator`

**Scanner/Import:** `KKScanner` · `BudgetImport` · `TaxImport`

**Klammer-Bausteine:** `CalendarReminders` (Fristen/Erinnerungen) · `MerklisteView` (To-Do) ·
`linkifyDomains` + ResLink-Muster (Crosslinks, bisher nur in ~7 Views)

**Crosslink-Hub:** `finanzuebersicht` (6× als `onNavigate`-Ziel), danach `unterlagen` (4×).

---

## Inventar der Abläufe

> Spalten 1–3 sind hier vor-skizziert. Spalten **4–7 füllt der Ablauf-Experten-Agent**
> pro Ablauf (`[Agent]`-Marker), damit das Ergebnis strukturiert statt Notizhaufen ist.

### Versicherungen

#### A1 · Krankenkasse wechseln (KVG)
- **Auslöser:** Neue Prämie kommt Ende Sept/Okt und tut weh.
- **Ideale Schritte:** (1) Prämie-Anstoss → (2) lohnt sich's? alte Prämie festhalten/vergleichen
  → (3) neue Kasse: **3a** selbst anmelden *oder* **3b** neue Kasse übernimmt Wechsel via Vollmacht
  → (4) Frist **30. Nov** sichern → (5) Absicherung: alte erst kündigen, wenn neue Aufnahme bestätigt.
  Sonderkündigungsrecht (30 Tage) bei Prämienerhöhung.
- **Bausteine:** `kk`/`KKScanner` · `briefe`/`insuranceSwitch` (fertig) · `praemien` · `kvg` ·
  `premium` · `CalendarReminders`.
- **Verwendet?** 🟡 Bausteine da, **nicht verkettet** — kein geführter Faden, kein Auto-Anstoss im Kalender.
- **Lücken:** 🔴 Klammer/Orchestrierung · 🔴 Prämien-Anstoss (Ende Sept) im Kalender · 🔴 Absicherungs-Hinweis · 🔴 Weg 3a/3b (neue KK kontaktieren / Vollmacht).
- **Crosslinks:** 🔗 von `praemien`/`premium` → KVG-Wechsel-Faden · 🔗 → `unterlagen` (Police ablegen).
- **Nächste Aktion:** Klammer „KVG wechseln" bauen, die die 3 Bausteine verkettet + Frist in `calendar` legt.

#### A2 · Prämienverbilligung (IPV) beantragen
- **Auslöser:** Einkommen knapp / Anspruch unklar.
- **Bausteine:** `premium` (`PremiumSubsidy`) · `praemien`.
- **Verwendet?** 🟡 `PremiumSubsidy.jsx` rechnet Anspruch, ist aber **Sackgasse**: einziger Crosslink raus ist `onNavigate('finanzuebersicht')` (`PremiumSubsidy.jsx:189`). Kein Faden zum Antrag, kein Frist-Hinweis. Erreichbar vom Hub (`FinanzUebersicht.jsx` → `premium`) und Dashboard (`Dashboard.jsx` → `premium`).
- **Lücken:** 🔴 kein Antrags-Schritt (IPV läuft kantonal/automatisch je Kanton — Orientierung „wo beantragen" fehlt) · 🔴 keine Frist im Kalender (Anträge meist mit Steuerveranlagung gekoppelt) · 🔴 Amanda-Befund „IPV unklar" → kein erklärender Einstieg.
- **Crosslinks:** 🔗 → `direktlinks` (kantonale IPV-Stelle) fehlt · 🔗 ← von `tax`/`taxImport` (Einkommen → Anspruch-Hinweis) fehlt · 🔗 → `calendar`.
- **Nächste Aktion:** In `PremiumSubsidy.jsx` nach dem Anspruchs-Ergebnis einen `onNavigate('direktlinks')`-Knopf „IPV bei meinem Kanton beantragen" ergänzen (kleinster Schritt, nutzt vorhandenes Muster aus `AlvRechner.jsx:148`).

#### A3 · KK-Rechnung prüfen / Rückerstattung
- **Auslöser:** Rechnung/Abrechnung kommt — stimmt Franchise? Fehler?
- **Bausteine:** `kk`/`KKScanner` (`extractKKDataFromText`, `validateKKData`) · `kvg` (`KVGLeistungen`).
- **Verwendet?** 🟡 `KKScanner.jsx` scannt Police/Karte und schreibt via `onSave` Versicherungsdaten zurück (`main.jsx:807`), validiert mit `validateKKData` (`KKScanner.jsx:66,77`). Aber: KKScanner hat **0 onNavigate** — totale Sackgasse, keinerlei Verkettung zu Folge-Schritten.
- **Lücken:** 🔴 Scanner liest *Police*, nicht *Rechnung/Abrechnung* — der eigentliche Auslöser (Franchise-Prüfung einer konkreten Rechnung) hat keinen Baustein · 🔴 kein Brief „Rechnung beanstanden / Rückerstattung verlangen" in `briefGenerator.js` (nur 3 Vorlagen, `briefGenerator.js:43,50,57`).
- **Crosslinks:** 🔗 `KKScanner.jsx` → `kvg` (Leistungen prüfen) fehlt · 🔗 → `briefe` (Beanstandung) fehlt · 🔗 → `unterlagen`/`tresor` (Police ablegen) fehlt.
- **Nächste Aktion:** In `KKScanner.jsx` nach erfolgreichem `onSave` einen Crosslink-Knopf → `kvg` ergänzen; mittelfristig Brief-Vorlage „Rückerstattung/Beanstandung".

#### A4 · Zusatzversicherung wechseln/kündigen
- **Auslöser:** Zusatz zu teuer / nicht mehr nötig.
- **Bausteine:** keiner spezifisch. `insuranceSwitch` (`briefGenerator.js:57`) ist **KVG-spezifisch** (Grundversicherung, Art. 7) und passt nicht für VVG-Zusatz.
- **Verwendet?** 🔴 kein Baustein für den VVG-Zusatz-Ablauf.
- **Lücken:** 🔴 keine Kündigungs-Vorlage für VVG-Zusatz (andere Fristen: meist 3 Mt. auf Jahresende) · 🔴 **kritischer Orientierungs-Hinweis fehlt: keine Aufnahmepflicht** beim Zusatz → erst kündigen, wenn neuer Zusatz bestätigt (Gesundheitsprüfung).
- **Crosslinks:** 🔗 → `calendar` (Kündigungsfrist) · 🔗 → `unterlagen`.
- **Nächste Aktion:** Kleinste sinnvolle Stufe = Orientierungs-Hinweis „Zusatz: keine Aufnahmepflicht" + generische VVG-Kündigungs-Vorlage in `briefGenerator.js`.

### Wohnen & Haushalt

#### B1 · Wohnung kündigen / umziehen
- **Auslöser:** Umzug steht an.
- **Bausteine:** `briefe`/`leaseTermination` (OR 266a, fertig) · `unterlagen` · `CalendarReminders`.
- **Verwendet?** 🟡 `leaseTermination` ist eine saubere Vorlage (`briefGenerator.js:43`), aber isoliert: `BriefGenerator.jsx` verlinkt nur zurück → `unterlagen` (`BriefGenerator.jsx:26`). Kein Umzugs-Faden, keine Frist-Automatik, kein Adress-Update-Anstoss.
- **Lücken:** 🔴 keine Klammer „Umzug" die Kündigung→Frist→Adress-Updates verkettet · 🔴 Kündigungsfrist landet **nicht** automatisch im `calendar` (kein `addReminder`-API existiert, s. Q1) · 🔴 kein Adress-Update-Ablauf (→ B2).
- **Crosslinks:** 🔗 `BriefGenerator.jsx` (nach leaseTermination) → `calendar` (Auszugstermin) fehlt · 🔗 → B2 (Adress-Crosslink) fehlt komplett.
- **Nächste Aktion:** Eine Umzugs-Klammer, die nach erzeugter Kündigung den Auszugstermin als Kalender-Erinnerung anbietet und auf die B2-Adressliste verweist.

#### B2 · Umzug bei Stellen melden (Adress-Crosslink)
- **Auslöser:** Adresse hat sich geändert.
- **Bausteine:** keiner. Grep „adresswechsel/umzug" trifft nur `ChapterView.jsx` (Kapitel-Anzeige, kein Ablauf).
- **Verwendet?** 🔴 **echte Lücke** — kein zentraler Adress-Ablauf, keine Melde-Checkliste.
- **Lücken:** 🔴 keine Liste „wer braucht meine neue Adresse" (Einwohnerkontrolle/Gemeinde, KK, Steuern, AHV, Arbeitgeber, Banken, Abos, Post-Nachsendung) · 🔴 kein Abhaken (→ `merkliste`).
- **Crosslinks:** 🔗 → `kk`, `tax`, `behoerdendossier`, `direktlinks` (Gemeinde) — alle fehlen · 🔗 ← von B1 (Wohnung kündigen).
- **Nächste Aktion:** Eine ruhige Adress-Checkliste (statische kuratierte Liste der typischen Stellen) als kleinste Insel, die offene Punkte in `merkliste` ablegt — das ist der grösste Hebel für Amandas „Adresse-Crosslink".

### Arbeit & Einkommen

#### C1 · Arbeitslos werden / ALV
- **Auslöser:** Kündigung erhalten / Stelle endet.
- **Bausteine:** `alv`/`AlvRechner` · `direktlinks` (RAV-Link) · `briefe`?
- **Verwendet?** 🟡 `AlvRechner.jsx` rechnet Taggeld und verlinkt — vorbildlich — kantonsabhängig → `onNavigate('direktlinks')` (`AlvRechner.jsx:146-148`). Aber der *zeitkritische* Teil (sofort beim RAV melden, sonst Taggeld-Verlust) ist nur ein Link, kein geführter Faden.
- **Lücken:** 🔴 **kritische Frist „sofort/spätestens am 1. Tag der Arbeitslosigkeit beim RAV anmelden"** kommt nicht in `calendar` · 🔴 kein Hinweis „Kündigungsfrist/Sperrzeit bei Eigenkündigung" · 🔴 keine Abmelde-/Vorgehens-Checkliste.
- **Crosslinks:** 🔗 `AlvRechner.jsx` → `calendar` (RAV-Anmeldung) fehlt · 🔗 → `budget`/`finanzuebersicht` (Einkommenswegfall) fehlt · 🔗 → `premium`/`sozialhilfe` (wenn Taggeld nicht reicht).
- **Nächste Aktion:** In `AlvRechner.jsx` einen Frist-Hinweis „heute beim RAV melden" + Kalender-Anstoss ergänzen (sobald Q1-API existiert).

#### C2 · Mehrere Jobs / Stellenwechsel
- **Bausteine:** `JobManager` (`JobManager.jsx`, 96 Z.).
- **Verwendet?** 🟡 reine Insel: `JobManager.jsx` hat **0 onNavigate** und wird in `main.jsx` nicht einmal als eigener `view` geroutet (kein `view === 'job…'`) — vermutlich nur in ein Kapitel eingebettet. Erfasst Jobs/Lohn, verkettet aber nichts.
- **Lücken:** 🔴 kein Hinweis BVG-Koordinationsabzug bei mehreren Anstellungen (sonst keine Pensionskasse) · 🔴 Stellenwechsel-Schritte (Austrittsabrechnung, Freizügigkeitsleistung) fehlen.
- **Crosslinks:** 🔗 → `vorsorge` (BVG/Freizügigkeit) · 🔗 → `tax` (mehrere Lohnausweise) · 🔗 → `budget`.
- **Nächste Aktion:** `JobManager` an `vorsorge` koppeln (BVG-Hinweis bei >1 Job) — kleinster sinnvoller Crosslink.

#### C3 · Stipendien beantragen
- **Auslöser:** Ausbildung + knappe Mittel.
- **Bausteine:** `stipendien`/`StipendienView` (Kanton-Rechner offen).
- **Verwendet?** 🟡 `StipendienView.jsx` bekommt `onNavigate` als Prop (`StipendienView.jsx:10`), **nutzt es aber nirgends** — Sackgasse. Zeigt Orientierung/Verzeichnis, kein Antrags-Faden, kein Kanton-Rechner.
- **Lücken:** 🔴 Antrags-Frist (kantonal verschieden, oft Frühling/Studienbeginn) nicht im `calendar` · 🔴 kein Brief/Antrags-Hilfe · 🔴 Kanton-Rechner laut Memory offen.
- **Crosslinks:** 🔗 → `direktlinks` (kantonale Stipendienstelle) · 🔗 → `sozialhilfe`/`budget` (Gesamtbild knappe Mittel).
- **Nächste Aktion:** Vorhandenes `onNavigate` nutzen: Knopf → `direktlinks` zur kantonalen Stelle (1-Zeilen-Verkettung).

#### C4 · Selbständigkeit
- **Bausteine:** keiner spezifisch.
- **Verwendet?** 🔴 **echte Lücke** — kein Selbständigkeits-Ablauf.
- **Lücken:** 🔴 AHV-Anschluss als Selbständige(r) (Ausgleichskasse) · 🔴 **keine UVG-Pflicht → Unfall selbst versichern** (Orientierung) · 🔴 **kein BVG/keine 2. Säule → 3a wird wichtiger** · 🔴 KTG freiwillig · 🔴 Mehrwertsteuer-Schwelle.
- **Crosslinks:** 🔗 → `vorsorge`/`Saeule3aTracker` (Vorsorgelücke) · 🔗 → `direktlinks` (Ausgleichskasse).
- **Nächste Aktion:** Eine knappe Orientierungs-Karte „Als Selbständige(r): das müssen Sie selbst absichern (AHV/Unfall/Vorsorge)" mit Crosslink → `vorsorge`. Keine Rechner-Insel.

### Vorsorge

#### D1 · Pensionierung vorbereiten
- **Bausteine:** `vorsorge`/`VorsorgeRechner` · `Saeule3aTracker` (eingebettet).
- **Verwendet?** 🟡 `VorsorgeRechner.jsx` ist inhaltlich stark: AHV-Rente, Vorbezug/Aufschub, BVG-Guthaben, Auslandbezug-Orientierung (`VorsorgeRechner.jsx:152,181,199`). Crosslink raus aber nur → `finanzuebersicht` (`VorsorgeRechner.jsx:339`). Kein geführter „Pensionierung in X Schritten"-Faden.
- **Lücken:** 🔴 **Anmelde-Fristen fehlen** (AHV ~3–6 Mt. vor Pensionierung anmelden; Kapitalbezug PK oft 3 J. Voranmeldung) → nichts im `calendar` · 🔴 **EL-Orientierung fehlt** (D4) trotz Erwähnung in Aufgabe · 🔴 Kapitalbezug-vs-Rente-Entscheid nur als Vorbezug/Aufschub, nicht als Bezugsform.
- **Crosslinks:** 🔗 → `calendar` (Anmeldefristen) · 🔗 → D4 `EL` · 🔗 → `direktlinks` (Ausgleichskasse/AHV-Anmeldung).
- **Nächste Aktion:** Fristen-Hinweis „AHV rechtzeitig anmelden" mit Kalender-Anstoss im `vorsorge`-View.

#### D2 · 3. Säule führen
- **Bausteine:** `Saeule3aTracker` (`Saeule3aTracker.jsx`).
- **Verwendet?** 🟡 Tracker zeigt Einzahlung vs. Maximum 2026 (`Saeule3aTracker.jsx:9,14`), korrekt mit Selbständigen-Variante. Reine Anzeige-Komponente: **0 onNavigate**, nur eingebettet (in `vorsorge`/Finanzen), kein eigener `view`.
- **Lücken:** 🔴 **jährliche Einzahlungs-Frist (31.12.)** kommt nicht in `calendar` — der eine echte wiederkehrende Termin · 🔴 Steuerersparnis-Hinweis nicht mit `tax` verknüpft.
- **Crosslinks:** 🔗 → `calendar` (jährliche Frist 31.12.) · 🔗 → `tax` (Abzug).
- **Nächste Aktion:** Wiederkehrende Kalender-Erinnerung „3a-Einzahlung bis 31.12." anbieten (passt zu vorhandenen `TEMPLATES` in `CalendarReminders.jsx:36`).

### Finanzen & Steuern

#### E1 · Steuererklärung / Fristverlängerung
- **Auslöser:** Steuerformular / Frist droht.
- **Bausteine:** `tax`/`TaxCalculator` · `taxImport` · `briefe`/`taxExtension` · `unterlagen`.
- **Verwendet?** 🟡 Stärkste Teilkette der App: `TaxImport.jsx` und `TaxCalculator.jsx` verlinken beide → `finanzuebersicht` (`TaxImport.jsx:39`, `TaxCalculator.jsx:247`), und es gibt eine echte Brief-Vorlage `taxExtension` (`briefGenerator.js:50`). Trotzdem nicht *verkettet*: `TaxCalculator` zeigt keinen Weg zur Fristverlängerung, `briefe` ist getrennt erreichbar.
- **Lücken:** 🔴 Einreichefrist (31.03., kantonal) und Verlängerungsfrist kommen **nicht** automatisch in `calendar` · 🔴 keine Belege-Checkliste (Lohnausweis, 3a, Abzüge) in `merkliste`.
- **Crosslinks:** 🔗 `TaxCalculator.jsx` → `briefe` (taxExtension) fehlt — der naheliegendste Crosslink · 🔗 → `calendar` (Frist) · 🔗 ← `Saeule3aTracker`/`premium` (Abzüge).
- **Nächste Aktion:** In `TaxCalculator.jsx` Knopf „Fristverlängerung beantragen" → `onNavigate('briefe')` (vorhandene Vorlage, 1-Zeilen-Verkettung).

#### E2 · Budget aufstellen & pflegen
- **Bausteine:** `budget`/`BudgetImport` · `sync`/`BudgetSync` · `finanzuebersicht` (Hub) · `charts`.
- **Verwendet?** 🟡 `BudgetImport.jsx` und `BudgetSync.jsx` haben **beide 0 onNavigate** — Sackgassen. `finanzuebersicht` ist zwar der Hub (verlinkt zu `tax`/`premium`/`sozialhilfe`/`sync` — `FinanzUebersicht.jsx`), aber die Budget-Werkzeuge selbst führen nicht zurück oder weiter.
- **Lücken:** 🔴 kein Rückweg `sync`/`budget` → `finanzuebersicht` (asymmetrische Verkettung) · 🔴 Budget speist keine Erinnerung (z.B. monatlicher Check) in `calendar`.
- **Crosslinks:** 🔗 `BudgetSync.jsx`/`BudgetImport.jsx` → `finanzuebersicht` (Rückweg).
- **Nächste Aktion:** Rückweg-Knopf → `finanzuebersicht` in `BudgetSync.jsx` ergänzen, damit der Hub beidseitig wird.

#### E3 · Schulden / Betreibung
- **Bausteine:** `schulden`/`SchuldenManager` (+ `schuldenCalc.js`: `createDebtPlan`, `calculateBetreibungsRegisterImpact`, `createBetreibungsAuszugTemplate`).
- **Verwendet?** 🟡 fachlich reich (Schuldenplan, Betreibungsregister-Wirkung, Verlustschein), aber `SchuldenManager.jsx` hat **0 onNavigate** — komplette Insel.
- **Lücken:** 🔴 Sanierungs-/Abzahlungsplan erzeugt keine wiederkehrenden Zahlungs-Erinnerungen in `calendar` · 🔴 keine Verkettung zur Schuldenberatung (Orientierung) · 🔴 G3 (Betreibungsauszug bestellen) nicht angebunden obwohl `createBetreibungsAuszugTemplate` existiert.
- **Crosslinks:** 🔗 → `budget`/`finanzuebersicht` (Tragbarkeit) · 🔗 → `direktlinks` (Betreibungsamt/Schuldenberatung) · 🔗 → `sozialhilfe`.
- **Nächste Aktion:** Crosslink `SchuldenManager` → `budget`/`finanzuebersicht` (Schulden im Gesamtbudget verankern).

#### E4 · Sozialhilfe beantragen
- **Bausteine:** `sozialhilfe`/`SozialhilfeView` · `SozialhilfeRechner` (SKOS).
- **Verwendet?** 🟡 `SozialhilfeView.jsx` verlinkt → `finanzuebersicht` (`SozialhilfeView.jsx:197`); der Rechner `SozialhilfeRechner.jsx` selbst hat **0 onNavigate**. Orientierung da, Antrags-Faden fehlt.
- **Lücken:** 🔴 **Rückzahlungspflicht-Hinweis** (Sozialhilfe ist je Kanton rückzahlbar — Braindump 6) fehlt als ruhiger Hinweis · 🔴 kein Weg zum Antrag (Gemeinde/Sozialdienst) · 🔴 Unterlagen-Checkliste → `merkliste`.
- **Crosslinks:** 🔗 → `direktlinks`/`behoerdendossier` (Sozialdienst Gemeinde) · 🔗 ← `alv`/`schulden` (wenn Mittel nicht reichen).
- **Nächste Aktion:** Orientierungs-Hinweis „Antrag bei der Wohngemeinde" + Crosslink → `direktlinks` in `SozialhilfeView.jsx`.

### Gesundheit

#### F1 · Ärzte/Spezialisten & Medikamente organisieren
- **Bausteine:** `DoctorManager` · `MedicationManager` · `DiseaseManager`.
- **Verwendet?** 🟡 Alle drei haben **0 onNavigate** — isolierte Daten-Manager. Sie speisen zwar das Notfalldossier (über `data`/`chapters`), aber als bedienbare Views verketten sie nichts.
- **Lücken:** 🔴 jährliche Kontroll-Termine (Hausarzt/Zahnarzt/Gyn) werden nicht aus F1 in `calendar` gelegt — obwohl `CalendarReminders.jsx:37-39` genau dafür Templates hätte (nur manuell auswählbar) · 🔴 Medikamenten-Nachbestellung / Rezept-Erneuerung als Erinnerung fehlt.
- **Crosslinks:** 🔗 `DoctorManager`/`MedicationManager` → `calendar` (Kontroll-/Nachbestell-Termine) · 🔗 → `notfalldossier` (sichtbar machen, dass diese Daten dort landen).
- **Nächste Aktion:** In `DoctorManager.jsx` „jährliche Kontrolle als Erinnerung" anbieten — verbindet F1 mit den schon existierenden Health-Templates in Q1.

#### F2 · Notfall vorbereiten
- **Bausteine:** `notfalleinstieg`/`NotfallEinstieg` · `notfalldossier` · `OrganDonation` (`organ`).
- **Verwendet?** 🟡→✅ am besten verkettete Gesundheits-Strecke: `NotfallEinstieg.jsx` führt per `onNavigate('chapter', idx)` gezielt in die Notfall-Kapitel inkl. Patientenverfügung (`NotfallEinstieg.jsx:32,69`); `NotfallDossier.jsx` → `unterlagen` (`:85`). Aber `OrganDonation.jsx` hängt daneben (**0 onNavigate**) und ist nicht in den Einstieg eingebunden.
- **Lücken:** 🔴 `OrganDonation` (`organ`) nicht aus dem Notfall-Faden verlinkt · 🔴 Patientenverfügung/Vorsorgeauftrag (I5) nur als Kapitel-Feld, kein geführter Erstell-Schritt.
- **Crosslinks:** 🔗 `NotfallEinstieg.jsx` → `organ` (Organspende) fehlt · 🔗 → I5 (Vorsorgeauftrag/Patientenverfügung).
- **Nächste Aktion:** `organ` in `NotfallEinstieg.jsx` als eigenen Einstiegs-Punkt aufnehmen (er listet schon Kapitel-Schritte auf — einer mehr).

### Behörden & Dokumente

#### G1 · Dokumente ablegen / archivieren
- **Bausteine:** `tresor`/`DocumentTresor` · `unterlagen`/`MeineUnterlagen` · `lebensmappe`.
- **Verwendet?** 🟡 **Klärung (kein echtes Overlap, aber Bruchstelle):** die drei haben *verschiedene* Rollen — `DocumentTresor.jsx` = echter Datei-/Dokument-Speicher mit Ablauf-Tracking (`documents`, `getDaysUntilExpiry`, `:61-62`); `MeineUnterlagen.jsx` = **Hub/Landing**, das auf die 4 Dossier-Generatoren verteilt (`→ lebensmappe/notfalldossier/behoerdendossier/briefe`, `:84-111`); `Lebensmappe.jsx` = read-only **Druck-Dossier** (`generateLebensmappe`, `:17`). Bruchstelle: **`tresor` (der Speicher) ist NICHT vom `unterlagen`-Hub verlinkt** — der zentrale Ablageort fehlt im Dokumenten-Menü.
- **Lücken:** 🔴 Ablauf-Daten aus `tresor` (`expiryDate`, `DocumentTresor.jsx:61`) speisen **nicht** den `calendar` — abgelaufene Ausweise/Pässe (vgl. G4) bleiben unbemerkt, obwohl `OverdueBanner.jsx` das Muster kennt.
- **Crosslinks:** 🔗 `MeineUnterlagen.jsx` → `tresor` fehlt (Hub kennt seinen eigenen Speicher nicht) · 🔗 `DocumentTresor.jsx` → `calendar` (Ablauf-Frist) fehlt.
- **Nächste Aktion:** Im `unterlagen`-Hub eine Karte → `tresor` ergänzen (nutzt vorhandenes `DossierCard`-Muster `MeineUnterlagen.jsx:6`).

#### G2 · Behördengang vorbereiten / Brief an Behörde
- **Bausteine:** `behoerdendossier`/`BehoerdenDossier` · `direktlinks`/`DirektLinks` · `briefe`.
- **Verwendet?** 🟡 `BehoerdenDossier.jsx` sammelt Daten und verlinkt zurück → `unterlagen` (`:114`). `DirektLinks.jsx` ist reines Blatt (bekommt nicht mal `onNavigate`, `:8`) — als Crosslink-*Ziel* ok. Aber Dossier, Links und Briefe sind nicht zu einem Behördengang-Faden verkettet.
- **Lücken:** 🔴 `BehoerdenDossier` → `direktlinks` fehlt (Dossier vorbereiten, dann zur richtigen Behörde) · 🔴 → `briefe` (Schreiben an Behörde) fehlt · 🔴 Termin-Erinnerung → `calendar`.
- **Crosslinks:** 🔗 `BehoerdenDossier.jsx` → `direktlinks` · 🔗 → `briefe`.
- **Nächste Aktion:** Crosslink `BehoerdenDossier` → `direktlinks` (vom vorbereiteten Dossier direkt zur zuständigen Stelle).

### Migration / Asyl

#### H1 · Asylverfahren orientieren
- **Bausteine:** `asyl`/`AsylView` · `LanguageManager` (mehr Sprachen).
- **Verwendet?** ✅ **bestes Beispiel für Verkettung** in der App: `AsylView.jsx` bietet einen Folge-Schritte-Block mit 4 gezielten Crosslinks → `direktlinks` (kantonal), `tresor`, `notfalleinstieg`, `vorsorge` (`AsylView.jsx:152,160,164,168`). So sollte jeder Ablauf aussehen.
- **Lücken:** 🔴 keine Verfahrens-Fristen/Termine (Anhörung, Entscheid-Beschwerdefrist) im `calendar` · 🔴 mehr Sprachen via `LanguageManager` (Albanisch/Tigrinya, Memory „Asyl-Vision") noch offen.
- **Crosslinks:** 🔗 → `calendar` (Termine/Fristen) — der einzige fehlende Quertyp; sonst gut vernetzt.
- **Nächste Aktion:** Kalender-Anstoss für Verfahrens-Termine ergänzen (sobald Q1-API existiert); Muster aus dem vorhandenen Folge-Schritte-Block übernehmen.

### Querschnitt (Klammern für alle Abläufe)

#### Q1 · Fristen & Termine — `calendar`/`CalendarReminders`
- **Befund:** 🔴 **systemische Kern-Lücke.** `CalendarReminders.jsx` exportiert **keine** programmatische `addReminder`-Funktion — `loadReminders`/`saveReminders` sind modul-intern (`:9-16`), Reminder entstehen nur manuell im Formular oder aus den `TEMPLATES` (`:36`). Grep „or5_reminders/CalendarReminders" trifft **nur 3 Dateien**: die Komponente selbst, `OverdueBanner.jsx`, `main.jsx`. Das heisst: **kein einziger Ablauf kann eine Frist in den Kalender schreiben.** Alle Frist-🔴 oben hängen an dieser einen fehlenden API.
- **Nächste Aktion (Hebel #1):** Eine kleine exportierte Helper-Funktion `addReminder({title, dueDate, category, recurrence})` (schreibt `or5_reminders`), die Abläufe aufrufen können. Danach werden ~12 Frist-Lücken mit je 1 Zeile schliessbar.

#### Q2 · To-Do / Merkliste — `merkliste`/`MerklisteView`
- **Befund:** 🔴 gleiches Muster. `MerklisteView.jsx` lädt/speichert `or5_merkliste` nur intern (`:8,25,35`); `LINK_TARGETS` (`:11`) erlaubt Deeplinks *aus* der Merkliste heraus, aber es gibt **keine** API, um *von einem Ablauf aus* einen Punkt hineinzulegen. Referenziert nur in `Dashboard.jsx`, `SearchView.jsx`, `main.jsx` — **kein Ablauf speist Q2.**
- **Nächste Aktion:** Exportierter Helper `addMerklisteItem({text, link})`, parallel zu Q1.

#### Q3 · Suche — `search`/`SearchView`
- **Befund:** 🟡 `SearchView.jsx` indexiert Kapitel und kuratierte Views inkl. `merkliste` (`:9,47`), aber **nicht** die Inhalte von Reminders/Merkliste/Dokumenten — Suche bleibt strukturell, nicht inhaltlich.
- **Nächste Aktion:** niedrige Priorität; erst Q1/Q2-Speisung, dann Suchindex erweitern.

#### Q4 · Export / Backup — `export`/`ZipExport`
- **Befund:** 🟡 `ZipExport.jsx` exportiert `data` + `documents` (`:34,62`). Ob `or5_reminders`/`or5_merkliste` mitgesichert werden, hängt an `prepareDownloadFiles`/`exportPlaintext` — **prüfen**, sonst gehen Fristen/To-Dos beim Backup verloren.
- **Nächste Aktion:** Verifizieren, dass `or5_reminders` und `or5_merkliste` im Backup enthalten sind (Klärungsbedarf).

> **Querschnitt-Audit — Antwort:** **Nein.** Kein Ablauf speist Q1 oder Q2 automatisch,
> weil beide Klammern **keine öffentliche Schreib-API** haben. Das ist die grösste
> systematische Lücke der App — ein einziger Helper pro Klammer hebt das ganze System.

---

## Inventar — Runde 2 (Lebensereignisse & Ergänzungen)

> Discovery-Befund: Diese Themen sind in der App meist nur als **Feld/Textstelle erwähnt**,
> haben aber **keinen geführten Ablauf**. Flag = grobe Ersteinschätzung aus dem Discovery-Grep;
> `[Agent]` verfeinert. (0 Treffer = vermutlich echte Lücke.)

### Familie & Lebensereignisse *(neue Kategorie — fehlte ganz)*

#### I1 · Kind bekommen / Geburt
- **Auslöser:** Schwangerschaft / Geburt steht an.
- **Berührt:** Mutterschafts-/Vaterschaftsentschädigung (EO) · Familienzulagen · Kind bei KK anmelden · Budget · Vorsorge.
- **Bausteine:** `eo`/`EOrechner` (`EOrechner.jsx`, mit Mutterschafts-/Vaterschafts-Hinweis `:93-94`) · `familienzulage` (14 Dateien erwähnen es, aber kein Antrags-Ablauf).
- **Verwendet?** 🟡 EO-Rechner ist eine Insel (**0 onNavigate**, `EOrechner.jsx:6`); kein Geburts-Faden, der die ~5 berührten Stellen verkettet.
- **Lücken:** 🔴 keine Geburts-Checkliste (Kind bei KK anmelden ← Frist! · Familienzulage beantragen · EO geltend machen · Budget anpassen) · 🔴 nichts davon in `merkliste`/`calendar`.
- **Crosslinks:** 🔗 `EOrechner.jsx` → `kk` (Kind anmelden), → `budget`, → C8 Familienzulagen — alle fehlen.
- **Nächste Aktion:** Eine ruhige Geburts-Checkliste (kuratierte Liste der Schritte) als kleinste Klammer, die EO/KK/Familienzulage verbindet und Punkte in `merkliste` legt.

#### I2 · Heiraten / Partnerschaft eintragen
- **Berührt:** Zivilstand · gemeinsame Steuern · KK · AHV-Splitting · Name.
- **Bausteine:** Zivilstand-Feld vorhanden (`ehe`), aber 🔴 **kein Ablauf**.
- **Verwendet?** 🔴 echte Lücke — kein geführter Schritt.
- **Lücken:** 🔴 Steuer-Wechsel (gemeinsame Veranlagung, evtl. Heiratsstrafe) nicht erklärt · 🔴 Adress-/Namensänderung (→ B2) · 🔴 AHV-Splitting-Orientierung.
- **Crosslinks:** 🔗 → `tax` (gemeinsame Veranlagung) · 🔗 → B2 (Namens-/Adressänderung).
- **Nächste Aktion:** Orientierungs-Karte „Heirat: was ändert sich (Steuern/Name/AHV)" mit Crosslink → `tax`.

#### I3 · Trennung / Scheidung
- **Berührt:** Alimente · Vorsorgeausgleich (BVG) · Wohnen · Steuern · KK trennen.
- **Bausteine:** `alimente` (🟡 bedingte Budget-Sektion); „trennung" = **0 Treffer** (verifiziert) → 🔴 kein Ablauf.
- **Verwendet?** 🔴 echte Lücke — nur die Alimente-Budget-Sektion existiert, sonst nichts.
- **Lücken:** 🔴 Vorsorgeausgleich (BVG-Teilung) nicht erklärt · 🔴 KK/Steuern wieder trennen · 🔴 Wohnsituation/Adresse (→ B2) · sensibles Thema → ruhige Orientierung statt Rechner.
- **Crosslinks:** 🔗 → `vorsorge` (BVG-Ausgleich) · 🔗 → `tax` (getrennte Veranlagung) · 🔗 → `budget` (neue Lebenshaltung).
- **Nächste Aktion:** Zurückhaltende Orientierungs-Karte „Trennung: was zu klären ist" mit Crosslink → `vorsorge`/`budget`. Würde-zuerst (Skill maloja-household-logic).

#### I4 · Todesfall eines Angehörigen / Nachlass
- **Berührt:** Witwen-/Waisenrente · Abmeldungen · Erbschaft · laufende Verträge kündigen.
- **Bausteine:** „nachlass" = **0** (verifiziert), „todesfall" 1× → 🔴 weitgehend Lücke.
- **Verwendet?** 🔴 echte Lücke.
- **Lücken:** 🔴 Abmelde-/Kündigungs-Checkliste (KK, Abos, Verträge, Behörden) fehlt · 🔴 Witwen-/Waisenrente-Orientierung (AHV) fehlt · 🔴 Erbschaft/Erbschein-Schritte fehlen.
- **Crosslinks:** 🔗 → `behoerdendossier`/`direktlinks` (Zivilstandsamt) · 🔗 → A1/A4 (Verträge kündigen) · 🔗 → `vorsorge` (Hinterlassenenrente).
- **Nächste Aktion:** Ruhige „Im Todesfall: erste Schritte"-Checkliste (Abmeldungen) → speist `merkliste`. Sehr sensibel — Sprache mit maloja-writing-language abstimmen.

#### I5 · Vorsorgeauftrag / Patientenverfügung
- **Berührt:** Handlungsfähigkeit · medizinische Wünsche · Notfall.
- **Bausteine:** `notfalldossier` / `OrganDonation` (🟡 angrenzend; „vorsorgeauftrag" 10×, „patientenverf" 12× — als Kapitel-Felder vorhanden).
- **Verwendet?** 🟡 existiert als Notfall-Kapitel-Feld (s. `NotfallEinstieg.jsx:32`), aber kein geführter Erstell-Ablauf.
- **Lücken:** 🔴 keine Schritt-für-Schritt-Hilfe zum Erstellen/Hinterlegen · 🔴 keine Erinnerung „aktuell halten/hinterlegt?".
- **Crosslinks:** 🔗 ← F2 `notfalleinstieg` (sollte I5 als Schritt führen) · 🔗 → `tresor` (Dokument ablegen).
- **Nächste Aktion:** I5 als expliziten Schritt in den F2-Notfall-Einstieg aufnehmen (er listet schon Kapitel-Schritte).

### Versicherungen — Ergänzungen

#### A5 · Unfall melden (UVG)
- **Bausteine:** „UVG" erwähnt → 🟡 Wissen da, 🔴 kein Melde-Ablauf.
- **Lücken:** 🔴 kein Schritt „Unfall dem Arbeitgeber/UVG-Versicherer melden" · 🔴 Hinweis Arbeitslose: bei >8h/Woche via ALV unfallversichert, sonst Lücke.
- **Crosslinks:** 🔗 → `direktlinks` (SUVA/Versicherer) · 🔗 ← C1 `alv` (Unfalldeckung als Arbeitslose(r)).
- **Nächste Aktion:** Knappe Orientierungs-Karte „Unfall: sofort melden" — niedrige Priorität.

#### A6 · Längere Krankheit / Krankentaggeld (KTG)
- **Bausteine:** „KTG/taggeld" erwähnt → 🔴 kein Ablauf.
- **Lücken:** 🔴 keine Orientierung Lohnfortzahlung (Berner/Basler Skala) → KTG → IV-Anmeldung-Kette · 🔴 Übergang zu D3 (IV) nicht abgebildet.
- **Crosslinks:** 🔗 → D3 `IV` · 🔗 → `budget` (Einkommensausfall).
- **Nächste Aktion:** mit D3 (IV) zu einer „längere Arbeitsunfähigkeit"-Orientierung bündeln.

#### A7 · Hausrat / Haftpflicht abschliessen
- **Bausteine:** in Versicherungsliste erwähnt → 🟡, kein Ablauf.
- **Lücken:** 🔴 kein Abschluss-/Vergleichs-Schritt (bewusst kein Verkauf — Maloja = Orientierung).
- **Crosslinks:** 🔗 → `unterlagen`/`tresor` (Police ablegen).
- **Nächste Aktion:** niedrige Priorität; ggf. nur Ablage-Hinweis. Kein neuer Rechner (Feature-Governance).

### Arbeit & Einkommen — Ergänzungen

#### C5 · Erste Stelle / Lehre beginnen
- **Berührt:** AHV-Pflicht · BVG ab Schwelle · Quellensteuer · erste Steuererklärung.
- **Bausteine:** keiner spezifisch → 🔴.
- **Lücken:** 🔴 Orientierung „was passiert mit meinem ersten Lohn" (AHV-Abzug, BVG ab Schwelle, evtl. Quellensteuer) · 🔴 erste Steuererklärung (→ E1).
- **Crosslinks:** 🔗 → `vorsorge` (BVG-Schwelle), → `tax`, → C7 (Quellensteuer).
- **Nächste Aktion:** Orientierungs-Karte „Erster Lohn: das wird abgezogen" mit Crosslink → `vorsorge`/`tax`. Für junge Nutzer:innen relevant.

#### C6 · Mutterschafts-/Vaterschaftsurlaub (EO)
- **Bausteine:** `eo`/`EOrechner` (`EOrechner.jsx`, Hinweise `:93-94`).
- **Verwendet?** 🟡 identisch zu I1: Rechner-Insel ohne `onNavigate`. Inhaltlich = Teilmenge von I1.
- **Lücken:** 🔴 nicht mit I1-Geburts-Faden verknüpft.
- **Crosslinks:** 🔗 ← I1 (Geburt). **Nächste Aktion:** C6 als Schritt in die I1-Checkliste integrieren statt separat führen (Anti-Insel).

#### C7 · Quellensteuer → Tarifkorrektur / ordentliche Veranlagung
- **Bausteine:** „quellensteuer" = **0 Treffer** (verifiziert) → 🔴 Lücke.
- **Verwendet?** 🔴 echte Lücke, **migrations-/Amanda-relevant** (B-Bewilligung, Grenzgänger).
- **Lücken:** 🔴 keine Orientierung „wann lohnt sich Tarifkorrektur / wann ordentliche Veranlagung (NOV)" · 🔴 Frist (i.d.R. 31.03. Folgejahr) nicht im `calendar`.
- **Crosslinks:** 🔗 → `tax` · 🔗 → `direktlinks` (kant. Steuerverwaltung) · 🔗 ← H3 (Aufenthalt B).
- **Nächste Aktion:** Orientierungs-Karte Quellensteuer im `tax`-Umfeld — hoher Migrations-Nutzen, mission-aligned.

#### C8 · Familienzulagen beantragen
- **Bausteine:** „familienzulage" 14 Dateien (verifiziert) → 🟡 breit erwähnt, kein Antrags-Ablauf.
- **Verwendet?** 🟡 nur als Budget-Posten/Erwähnung, kein geführter Antrag.
- **Lücken:** 🔴 Antrag läuft über Arbeitgeber/Ausgleichskasse — Orientierung „wo beantragen" fehlt.
- **Crosslinks:** 🔗 ← I1 (Geburt) · 🔗 → `direktlinks` (Familienausgleichskasse).
- **Nächste Aktion:** als Schritt in die I1-Checkliste mit Crosslink → `direktlinks`.

### Vorsorge — Ergänzungen

#### D3 · IV-Antrag (Invalidität)
- **Bausteine:** „invalid/IV" 21 Dateien (meist BVG-Invaliditäts-Parameter) → 🟡 als Begriff/Parameter vorhanden, 🔴 kein Antrags-Ablauf.
- **Lücken:** 🔴 IV-Anmeldung (Früherfassung → Anmeldung) nicht abgebildet · 🔴 Übergang KTG (A6) → IV → EL (D4) nicht als Kette.
- **Crosslinks:** 🔗 → A6 (KTG), → D4 (EL), → `direktlinks` (IV-Stelle).
- **Nächste Aktion:** mit A6/D4 zur „längere Arbeitsunfähigkeit"-Orientierung bündeln (eine Strecke statt drei Inseln).

#### D4 · Ergänzungsleistungen (EL) beantragen
- **Bausteine:** EL-Orientierung angrenzend zu `vorsorge`/`sozialhilfe`, aber kein eigener Ablauf → 🔴.
- **Lücken:** 🔴 EL-Anspruchs-Orientierung (wenn AHV/IV-Rente nicht reicht) fehlt im D1-Pensionierungs-Faden · 🔴 Antrag bei der AHV-Zweigstelle/Gemeinde.
- **Crosslinks:** 🔗 ← D1 (Pensionierung), ← D3 (IV) · 🔗 → `direktlinks`.
- **Nächste Aktion:** EL-Hinweis in den D1/`vorsorge`-Faden einhängen (Memory „EL-Orientierung").

#### D5 · PK-Vorbezug für Wohneigentum
- **Bausteine:** keiner → 🔴 Lücke.
- **Lücken:** 🔴 Orientierung WEF-Vorbezug/Verpfändung (Mindestbetrag, Steuerfolgen, Vorsorgelücke) fehlt.
- **Crosslinks:** 🔗 → `vorsorge` (BVG-Guthaben, schon in `VorsorgeRechner.jsx:199` berechnet) · 🔗 → `tax`.
- **Nächste Aktion:** niedrige Priorität; ggf. Orientierungs-Hinweis im `vorsorge`-BVG-Tab. Kein Rechner.

### Migration — Ergänzungen

#### H2 · Einbürgerung
- **Bausteine:** „einbürgerung/einbürger" = **0 Treffer** (verifiziert) → 🔴 Lücke.
- **Verwendet?** 🔴 echte Lücke, mission-relevant (Migration).
- **Lücken:** 🔴 Orientierung Voraussetzungen (Aufenthaltsdauer, Integration, Sprache) · 🔴 Schritte ordentliche Einbürgerung (Kanton/Gemeinde) fehlen ganz.
- **Crosslinks:** 🔗 → `direktlinks` (Kanton/Gemeinde), → H1 `asyl`, → `behoerdendossier`.
- **Nächste Aktion:** Orientierungs-Karte „Einbürgerung: Schritte & Voraussetzungen" mit Crosslink → `direktlinks`. Passt zur Asyl/Migration-Vision.

#### H3 · Aufenthaltsbewilligung verlängern (B/C/L)
- **Bausteine:** „aufenthalt" 4 Dateien → 🟡 erwähnt, kein Ablauf.
- **Lücken:** 🔴 **Ablauf-Frist der Bewilligung** kommt nicht in `calendar` (rechtzeitig vor Ablauf verlängern!) · 🔴 Verlängerungs-Schritte (Migrationsamt).
- **Crosslinks:** 🔗 → `calendar` (Ablaufdatum), → `direktlinks` (kant. Migrationsamt), → G1 `tresor` (Ausweis-Ablaufdatum schon erfassbar).
- **Nächste Aktion:** Ablaufdatum der Bewilligung als Kalender-Erinnerung anbieten — verbindet mit G4/Tresor-Ablauflogik.

#### H4 · Wegzug ins Ausland / internationale AHV (ZAS/SAK Genf)
- **Bausteine:** App deckt nur Inland → 🔴 Orientierungs-Lücke (Memory „intl AHV"). `VorsorgeRechner.jsx:181` hat immerhin einen einklappbaren „AHV mit Auslandbezug"-Hinweis.
- **Lücken:** 🔴 freiwillige AHV/Wegzug-Abmeldung/ZAS-Genf-Orientierung fehlt als Faden.
- **Crosslinks:** 🔗 → `direktlinks` (ZAS/SAK Genf), → `vorsorge` (Auslandbezug-Hinweis ausbauen).
- **Nächste Aktion:** vorhandenen Auslandbezug-Block in `VorsorgeRechner.jsx` um einen Wegzug-Hinweis + Link → ZAS ergänzen. Orientierung, kein Rechner.

### Behörden & Dokumente — Ergänzungen

#### G3 · Betreibungsauszug bestellen
- **Bausteine:** `schulden`/`SchuldenManager` mit `createBetreibungsAuszugTemplate`/`parseBetreibungsAuszugFile` (`schuldenCalc.js`, importiert in `SchuldenManager.jsx:2`).
- **Verwendet?** 🟡 Funktionen existieren, aber `SchuldenManager.jsx` hat **0 onNavigate** und der „Auszug bestellen"-Schritt (oft für Wohnungsbewerbung gebraucht) ist nicht als eigener ruhiger Ablauf sichtbar.
- **Lücken:** 🔴 kein Schritt „beim Betreibungsamt bestellen" (CHF ~17, online/Gemeinde) · Vorlage da, Weg fehlt.
- **Crosslinks:** 🔗 → `direktlinks` (Betreibungsamt) · 🔗 ← B1 (Wohnungssuche braucht Auszug).
- **Nächste Aktion:** „Betreibungsauszug bestellen"-Hinweis in `SchuldenManager` mit Crosslink → `direktlinks`.

#### G4 · Ausweis / Pass / Führerausweis erneuern
- **Bausteine:** `DocumentTresor` mit `expiryDate`/`getDaysUntilExpiry` (`DocumentTresor.jsx:61`) erfasst Ablaufdaten — Grundlage vorhanden.
- **Verwendet?** 🟡 Ablaufdaten werden im Tresor erfasst und angezeigt (aktiv/archiviert), aber **nicht** in `calendar` als Erinnerung gespiegelt — `OverdueBanner.jsx` zeigt Überfälligkeit, doch keine Vorwarnung „Pass läuft in 6 Monaten ab".
- **Lücken:** 🔴 Ablauf-Fristen aus `tresor` speisen nicht `calendar` (gleiche Wurzel wie Q1).
- **Crosslinks:** 🔗 `DocumentTresor.jsx` → `calendar` (Ablauf-Vorwarnung) · 🔗 → `direktlinks` (Pass-/Ausweisstelle).
- **Nächste Aktion:** Beim Erfassen eines Ablaufdatums im Tresor automatisch eine Kalender-Vorwarnung anbieten (sobald Q1-`addReminder` existiert) — schliesst G4 + H3 + A4 gemeinsam.

> **Stand nach Runde 2:** ~43 Abläufe. Liste bewusst offen — weitere ergänzen wir laufend.

---

## Priorisierte Funde

> **Zähl-Stand (Audit 2026-06-29):** Von 43 Abläufen: **~16 isoliert (🟡)** — Baustein da,
> aber Sackgasse · **~16 echte Lücken (🔴)** — kein Ablauf (Trennung, Nachlass, Quellensteuer,
> Einbürgerung, Selbständigkeit, Heirat, Adress-Update u.a.) · **~9 verkettet-genug**
> (Asyl, Notfall-Einstieg, Steuer-Teilkette, Finanzhub-Anbindung). **Fehlende Crosslinks: ~30+**,
> davon allein **~12 fehlende `→ calendar`-Anbindungen** (alle scheitern an derselben fehlenden API).

### Hebel #1 — Die zwei fehlenden Schreib-APIs (löst das meiste auf einen Schlag)
- 🔴 **`calendar` hat keine `addReminder`-API.** `CalendarReminders.jsx:9-16` hält `load/saveReminders`
  modul-intern; nur 3 Dateien berühren `or5_reminders` (Komponente, `OverdueBanner.jsx`, `main.jsx`).
  **Kein Ablauf kann eine Frist schreiben.** → Ein exportierter Helper `addReminder(...)` schliesst
  ~12 Frist-Lücken (KVG 30.11., RAV-Anmeldung, 3a 31.12., Steuerfrist, Aufenthalts-/Ausweis-Ablauf,
  Arzt-Kontrollen, Pensionierungs-Anmeldung …) mit je 1 Zeile.
- 🔴 **`merkliste` hat keine `addMerklisteItem`-API** (`MerklisteView.jsx:8,35`). Gleicher Fix.
- **Das ist die grösste systematische Lücke** und sollte vor allem Einzel-Crosslinks kommen.

### Quick Wins (kleiner Crosslink, grosse Wirkung — je ~1 Zeile)
- 🔗 `TaxCalculator.jsx` → `briefe` (Fristverlängerung; Vorlage `taxExtension` existiert schon).
- 🔗 `PremiumSubsidy.jsx` → `direktlinks` (IPV beim Kanton beantragen; Muster aus `AlvRechner.jsx:148`).
- 🔗 `MeineUnterlagen.jsx` → `tresor` (der Dokument-Hub kennt seinen eigenen Speicher nicht).
- 🔗 `BudgetSync.jsx`/`BudgetImport.jsx` → `finanzuebersicht` (Hub-Rückweg; macht Hub beidseitig).
- 🔗 `SchuldenManager.jsx` → `budget`/`finanzuebersicht` (Schulden ins Gesamtbild).
- 🔗 `BehoerdenDossier.jsx` → `direktlinks` (vom Dossier direkt zur Stelle).
- 🔗 `StipendienView.jsx` → `direktlinks` (Prop `onNavigate` ist da, ungenutzt, `:10`).
- 🔗 `NotfallEinstieg.jsx` → `organ` (Organspende in den Notfall-Faden einreihen).
- 🔗 `SozialhilfeView.jsx` → `direktlinks` + Rückzahlungs-Hinweis.

### Systemische Muster
- **Rechner-Inseln ohne `onNavigate` (12):** `KKScanner`, `JobManager`, `BudgetImport`, `BudgetSync`,
  `SchuldenManager`, `SozialhilfeRechner`, `Saeule3aTracker`, `EOrechner`, `DoctorManager`,
  `MedicationManager`, `DiseaseManager`, `OrganDonation`, `DocumentTresor` — sie rechnen/erfassen,
  führen aber nirgendwohin.
- **Asymmetrischer Hub:** `finanzuebersicht` verlinkt 6× *hinaus*, aber mehrere Werkzeuge führen
  nicht *zurück* → Hub wird nur halb genutzt.
- **Ablauf-/Fristdaten verfallen ungenutzt:** `tresor` kennt `expiryDate` (`:61`), aber spiegelt
  nichts in `calendar` → Pass/Bewilligung/Police-Abläufe bleiben unbemerkt bis `OverdueBanner` zu spät warnt.
- **Vorbild zum Kopieren:** `AsylView.jsx:152-168` (4 gezielte Folge-Schritt-Crosslinks) ist das
  Muster, das alle Sackgassen-Views übernehmen sollten.

### Echte Lücken (Ablauf ohne jeden Baustein — grep-verifiziert)
- 🔴 **Trennung/Scheidung** (I3, „trennung" 0 Treffer) — nur Alimente-Budget-Sektion.
- 🔴 **Todesfall/Nachlass** (I4, „nachlass" 0 Treffer).
- 🔴 **Quellensteuer** (C7, 0 Treffer) — migrations-/Amanda-relevant.
- 🔴 **Einbürgerung** (H2, 0 Treffer) — mission-relevant.
- 🔴 **Selbständigkeit** (C4) — UVG/BVG/AHV-Selbstabsicherung.
- 🔴 **Heirat** (I2), **Adress-Update/Umzug-Crosslink** (B2), **VVG-Zusatz kündigen** (A4),
  **Geburts-Checkliste** (I1), **IV/KTG-Kette** (A6/D3), **EL** (D4).
- *Produkt-Linie:* alle als **ruhige Orientierungs-Karten/Checklisten** lösen, nicht als neue Rechner-Inseln
  (Feature-Governance) — bevorzugt mit Speisung in `merkliste`/`calendar`.

### Klärungsbedarf
- ✅ **`tresor`/`unterlagen`/`lebensmappe` überlappen NICHT** (Klärung erledigt): `tresor` = Datei-Speicher,
  `unterlagen` = Hub auf die 4 Dossier-Generatoren, `lebensmappe` = read-only Druck-Dossier.
  *Aber:* `unterlagen` verlinkt seinen eigenen Speicher `tresor` nicht → Quick-Win oben.
- ❓ **Backup-Vollständigkeit (Q4):** Prüfen, ob `ZipExport.jsx`/`prepareDownloadFiles` die Keys
  `or5_reminders` und `or5_merkliste` mitsichert — sonst gehen Fristen/To-Dos beim Backup verloren.

---

## Agent-Auftrag (nächster Schritt)

Der Ablauf-Experten-Agent geht **jeden** Ablauf oben durch und füllt Spalten 4–7 (`[Agent]`),
mit Fokus auf:
1. **Isolierte Bausteine** (🟡) → wo fehlt die Verkettung?
2. **Echte Lücken** (🔴) → welcher Schritt hat gar keinen Baustein?
3. **Fehlende Crosslinks** (🔗) → welcher `onNavigate` müsste existieren?
4. **Querschnitt:** speist der Ablauf `calendar` (Q1) und `merkliste` (Q2)?

Ergebnis: priorisierte Fund-Liste, die wir dann Stück für Stück abarbeiten.
