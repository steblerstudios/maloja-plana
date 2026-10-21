# Voll-Audit Stufe L — Maloja Plana, vor dem Deploy Do 29.10.2026

*Geprüfter Stand: `origin/main` `36199039` (19.10.2026 17:32, #510) **plus** Entwurf #508
`fix/mindestlohn-jahresriegel` @ `37ee2069` — also genau das, was am 29.10. live gehen soll.
Lauf vom 19.10.2026 abends bis 20.10.2026, nach `stebler-studios/bibliothek/sops/review-umfang.md` Stufe L (alle acht Linsen) und
dem Judge-Prinzip: elf günstige Prüfer (Sonnet) lesen, Claude Code (Opus) plant, prüft nach,
dedupliziert und stuft ein. Keine Fixes in diesem Durchgang.*

*Schwere: **🔴 blockiert Deploy** (falsche Angabe an einer Stelle, wo Menschen handeln, oder
Datenverlust mit plausiblem Auslöser) · **🟠 vor 1.1.2027** · **🔵 später**. «✔ selbst geprüft»
heisst: der Judge hat den Beleg selbst nachgemessen (Befehl in der Zeile), nicht nur gelesen.
Bekanntes aus `docs/audits/voll-review-L-2026-09-15.md`, `docs/TODO.md`, `BUGS.md` ist nicht
neu gezählt.*

## Ergebnis in einem Blick

| Prüfer (Token, Zugriffe) | 🔴 nach Judge | Judge-Anmerkung |
|---|---|---|
| Swiss Precision (371k, 120) | 4 (B8-B10, B12) | 5 gemeldet; leeres BVG-Feld → 🟠 D8 |
| Code-Korrektheit (368k, 53) | 2 (B4, B5) | 5 gemeldet; 3 → 🟠 C1-C3 (Auslöser selten / kein Verlust) |
| Link-Checker (88k, 24) | 3 (B1-B3) | alle 3 selbst nachgemessen |
| Copy (255k, 83) | 1 (B7) | |
| Ordnungshüter (173k, 71) | 1 (B6) | 0 gemeldet; Version-Bump vom Judge hochgestuft |
| Recht (614k, 184) | 0 | keine falsche Artikelnummer |
| Halluzinations-Sweep (360k, 61) | 0 | 3 gemeldet → in Swiss-Precision bewertet, 🟠 |
| Sicherheit (146k, 48) | 0 | |
| a11y (194k, 83) | 0 | |
| Polygrafin (160k, 59) | 0 | |
| Qualität (85k, 21) | 0 | 6196/6196 Tests, Lint 0 |
| **Summe, dedupliziert** | **11** | 🟠 und 🔵 unten je Bereich, nicht über Prüfer summiert |

**Die 11 🔴 in einem Satz je:** drei falsche Behörden-Links (B1-B3) · zwei Datenverlust-Wege
(B4 Auto-Save beim Schliessen, B5 «Leer starten» → «Übernehmen») · Version nicht angehoben (B6) ·
«Arbeitslosengeld» (B7) · AHV-Rente linear statt Skala 44, bis −8 % (B8) · Vorsorge-Total mischt
heutige AHV mit hochgerechneter BVG (B9) · ALV 520 Taggelder für IV-Rentner ohne 22-Monats-Bedingung
(B10) · Bildungsabzug «bis 10'000» statt 13'000 (B12).

---

## 1 · 🔴 Blockiert Deploy (vor dem 29.10. beheben oder bewusst freigeben)

| # | Stelle | Befund | Beleg | Prüfer |
|---|---|---|---|---|
| B1 | `src/data/direktLinks.js:88` | «Vaterschaftsentschädigung» verlinkt auf AHV-Merkblatt **6.03 Corona-Erwerbsersatz (Stand 3. Juli 2020)**. Passend wäre 6.04 «Entschädigung des andern Elternteils EAE», Stand 1.1.2024. | ✔ `curl -sL ahv-iv.ch/p/6.03.d \| pdftotext` → «6.03 Corona-Erwerbsersatz … Stand 3. Juli 2020»; 6.04.d → «Entschädigung des andern Elternteils EAE … Stand am 1. Januar 2024» | Link |
| B2 | `src/data/direktLinks.js:72` | «Familienzulagen» verlinkt auf Merkblatt **6.01 Leistungen der EO** (Dienstleistende). Richtiges Ziel nicht gemessen — bei der Stelle klären (Familienzulagen-Merkblätter 6.08 ff. sind kantonal geführt). | ✔ `pdftotext 6.01.d` → «6.01 Leistungen der EO, Erwerbsausfallentschädigungen, Stand am 1. Januar 2023 … Wer Dienst leistet …» | Link |
| B3 | `src/data/direktLinks.js:327` | Uri «Steuererklärung» → Seite **«Organisation von Anlässen»**. Richtige Uri-Steuerseite nicht belegt. | ✔ `curl -sL ur.ch/dienstleistungen/3040 \| grep title` → «Kanton Uri - Organisation von Anlässen» | Link |
| B4 | `src/main.jsx:812-842` | **Auto-Save ohne Speichern beim Verlassen.** Geschrieben wird nur im 5-s-Intervall; das Intervall startet bei jeder Datenänderung neu (`[data, documents, fremdGeaendert]`). Tab schliessen / iOS-App wegwischen / SW-Neuladen innert 5 s → Eingabe weg; Dauertippen ohne 5 s Pause speichert nie. Dokument-Blob liegt sofort in IndexedDB, die Metadaten nicht → verwaiste Datei. | ✔ Code gelesen; `git grep -n "pagehide\|beforeunload\|visibilitychange" -- src` → nur `utils/notifications.js:55` (nicht Speichern) | Code |
| B5 | `src/main.jsx:627-630` | **«Leer starten» + «In den Stand übernehmen» löscht alle Kapitel.** `blankSandbox` setzt `{}`; der Schutz in `applySandbox` greift nur für das ganz leere Objekt. Ein einziges Feld eingetippt → `setData(sandboxData)` ersetzt den ganzen Stand, 5 s später persistiert. | ✔ `applySandbox = () => { if (sandboxData && Object.keys(sandboxData).length > 0) setData(sandboxData); …}`; der Knopf `sandbox.apply` steht im selben Banner wie `sandbox.startBlank` (`main.jsx:1385-1408`) | Code |
| B6 | `package.json:3`, `CHANGELOG.md` `[Unreleased]` | **Version nicht angehoben.** 0.1.46-beta ist seit 19.10. 15:41 live (`650908a2`); seither #510 und #508. Am 29.10. trügen zwei verschiedene Builds dieselbe Nummer — widerspricht `RELEASE.md:21-23` (Bump im selben PR). Deploy-Tor-Punkt, kein Code-Fehler. | `git rev-list --count 650908a2..37ee2069` → 7; `[Unreleased]` leer | Ordnung (vom Judge hochgestuft) |
| B7 | `src/i18n/de.js:552`, `:5966`; `src/data/direktLinks.js:52` | **«Arbeitslosengeld»** (DE-Begriff) an drei Reststellen; das Vor-Audit hat `nav.alv`/`alv.title` korrigiert und den Begriff als 🔴 gewertet. Wortwahl, kein Faktenfehler — S-Fix; Stebler kann ihn auch auf 🟠 setzen. | ✔ `git grep -n Arbeitslosengeld -- src` → genau diese 3 | Copy |

| B8 | `src/data/ahvRechner.js:76-82` | **AHV-Rente linear interpoliert statt Skala 44.** Die amtliche Skala ist stückweise linear; im Mittelfeld zeigt die App zu wenig: 30'240 → 1512 statt **1588**, 45'360 → 1764 statt **1915** (−7,9 %), 60'480 → 2016 statt **2117**. Trifft jede AHV-Schätzung (Vorsorge, Pensionierung, EL-Heuristik). Nicht im Vor-Audit. | ✔ `curl ahv-iv.ch/p/3.01.d \| pdftotext -layout` (Stand 1.1.2026), Skala 44: «30 240 · 1 588», «45 360 · 1 915», «60 480 · 2 117»; Code: `// Vereinfacht: lineare Interpolation` | Swiss |
| B9 | `src/VorsorgeRechner.jsx:104`, Anzeige `:942-947, 966` | **Beitragsjahre leer → «Jahre bis heute».** 40-Jährige/r, Ø 80'000: «Geschätzte AHV-Altersrente» 1064 statt ≈ 2341 bei 44 Jahren; das «Total 1. + 2. Säule» addiert diese abgeschnittene AHV zur **bis 65 hochgerechneten** BVG. | ✔ `Number(beitragsjahre) \|\| (alter && alter > 20 ? Math.min(alter - 20, 44) : 44)`; Rechnung 2341 × 20/44 = 1064 | Swiss |
| B10 | `src/data/alvRechner.js:55` | **ALV: IV-Rentner/innen bekommen immer 520 Taggelder**, auch mit 12 Beitragsmonaten. Das Gesetz verlangt 22 Monate (sonst 260 bzw. 400). Zu langer Anspruch angezeigt. | ✔ Fedlex AVIG (SR 837.0, Fassung 1.1.2026) Art. 27 Abs. 2 lit. c: «höchstens 520 Taggelder, wenn sie eine Beitragszeit von mindestens 22 Monaten nachweisen kann und: 1. das 55. Altersjahr zurückgelegt hat, oder 2. eine Invalidenrente bezieht …»; Code `if ((alter >= 55 && beitragsmonate >= 22) \|\| ivGrad40) return 520;` | Swiss |
| B12 | `src/i18n/de.js:1524` (+ `en.js:1521`, `fr.js:1521`, `it.js:1521`, `rm.js:1766`) | «Fortbildungskosten? **Bis CHF 10'000** steuerlich absetzbar» — Bund: 13'000; Kantone eigene Höchstbeträge. Trivialer Fix, 5 Sprachen. | ✔ Fedlex DBG (SR 642.11, Fassung 1.1.2026) Art. 33 Abs. 1 lit. j: «bis zum Gesamtbetrag von 13 000 Franken» | Swiss |

*(B11 bewusst nicht vergeben — siehe die herabgestufte Zeile «leeres BVG-Guthaben» in 2b.)*

**Bewusst NICHT 🔴, obwohl ein Prüfer es so meldete** (Judge-Urteil, Begründung):

- *Sicherung liest `or5_data` aus localStorage statt aus dem Speicherstand* (`utils/backupCrypto.js:42-61`) — trifft nur bei `saveError`, fremdem Tab oder < 5 s nach der letzten Eingabe; mit B4 behoben sinkt das Fenster. → 🟠 C1.
- *Sicherung über 50 MB nicht mehr einspielbar* (`backupCrypto.js:30` vs. `ChapterView.jsx:2196`) — braucht ≈ 37 MB Originaldateien. → 🟠 C2.
- *Leeres Ablaufdatum lässt ein Dokument aus beiden Listen fallen* (`DocumentTresor.jsx:9-14, 74-75`) — ✔ bestätigt (`new Date('')` → NaN), aber Daten bleiben erhalten und der Auslöser ist ein bewusstes Leeren. → 🟠 C3.
- *EL-Schwelle «+2000» ohne Quelle* (`config/cantonalData.js:486`) — Swiss-Precision: als «möglicher Anspruch … prüfen» ehrlich genug formuliert, für Alleinstehende grob vertretbar (Lebensbedarf 20'670/12 ≈ 1722, Merkblatt 5.01 Stand 1.1.2025). → 🟠 D5-D7.
- *Leeres BVG-Guthaben = 0 ohne Warnung* (`VorsorgeRechner.jsx:149`) — die Rechnung ist für die Eingabe richtig; es fehlt der Hinweis, dass das Altguthaben fehlt. → 🟠 D8.

---

## 2 · 🟠 Vor dem 1.1.2027

### 2a · Daten & Speicher (Linse 1)

| # | Stelle | Befund | Beleg |
|---|---|---|---|
| C1 | `utils/backupCrypto.js:42-61, 79-91` | Sicherung (JSON/.maloja) liest den **persistierten** Stand, nicht den aktuellen; meldet trotzdem «Sicherung erstellt». | Code-Prüfer, Code gelesen |
| C2 | `backupCrypto.js:30-36`; `ChapterView.jsx:2196` | Export ohne Grössenprüfung, Import-Limit 50 MB, Dokumente bis 20 MB × 1,37 base64 → die einzige Sicherung kann unbrauchbar sein. | ✔ `MAX_BACKUP_FILE_BYTES = 50*1024*1024`; `MAX_DOC_BYTES = 20*1024*1024` |
| C3 | `DocumentTresor.jsx:9-14, 74-75, 110-113` | Leeres/fehlendes Ablaufdatum → NaN → Dokument weder aktiv noch archiviert; Zähler stimmt nicht mehr. | ✔ Code gelesen |
| C4 | `zipExport.js:138-155, 201` | JSON-Export im Probier-Modus heisst `backup_<Name>_<Datum>.json` und enthält die Probe-Zahlen — als Backup einspielbar. | Code |
| C5 | `utils/storage.js:142-191`; `docBlobs.js:46-66` | IndexedDB-Fehler werden geschluckt → Sicherung ohne Dateien meldet Erfolg. | Code |
| C6 | `backupCrypto.js:51-72` | Sicherung enthält `or5_behoerden_checklist`, `or5_lebenszustaende`, `or5_ankunft_*` nicht. | Code |
| C7 | `backupCrypto.js:224-290`; `utils/autoBackup.js:215, 242, 294, 348`; `utils/prerestore.js:26` | Restore nicht atomar; Auto-Schnappschüsse (alle 12 h) und Pre-Restore-Kopien werden geschrieben, aber **kein UI-Rückweg** (`listBackups`/`restoreBackup(id)` ohne Aufrufer; `or5_prerestore_date` write-only). Die Klartext-Kopien liegen dauerhaft — Datenschutz-Frage. | Code + Ordnung (`git grep` 0 Aufrufer) |
| C8 | `utils/merkliste.js:12-35` | «Merken» meldet ✓ auch wenn das Schreiben scheitert. | Code |
| C9 | `utils/cryptoCore.js:18` | Backup-Datei mit PBKDF2 **100 000** Iterationen (Tresor 600 000); Format `BACKUP_V1` trägt die Zahl nicht → Erhöhung braucht V2. | Code |
| C10 | `utils/storage.js:67-92`; `autoBackup.js:32-57` | Alt-DB-Migration löscht `ordnung-ruhe-*`, ohne den Erfolg des Schreibens abzuwarten. | Code (nur Alt-Bestand) |
| C11 | `DocumentTresor.jsx:88`; `ChapterView.jsx:2209` | `uploadDate` als `de-CH`-String gespeichert → «nach Upload sortieren» sortiert nicht. | Code, `node -e` |

### 2b · Fachwerte & Riegel (Linse 3, Halluzinations-Frage)

| # | Stelle | Befund | Beleg |
|---|---|---|---|
| D1 | `data/lohnAbzuege.js:6,36,43-44,89-90`; `ahvRechner.js:14-19,57,225,229`; `saeule3a.js:46-53,75`; `alvRechner.js:16-25`; `eoRechner.js:13`; `steuerRechner.js:12-46`; `kantonssteuerTabelle.js:11-13`; `kapitalbezugSteuer.js:26`; `sozialhilfeRechner.js:6,19-29`; `kvgLeistungen.js:166-183`; `praemienRegionen.js`, `praemienDetail.js`, `versichererListe.js`; `vermoegensfreibetragKanton.js:12-18` | **Kein Laufzeit-Riegel zum 1.1.2027.** Nur IPV (`kantonsModell.js:576`) und Mindestlohn (#508) schalten ab 2027 auf «nicht belegt»; alle anderen rechnen still mit 2026 weiter. Entweder Jänner-Update fest einplanen oder Riegel nach #508-Muster. | Sweep + Recht + Qualität übereinstimmend; `*_DATA_VERSION`-Konstanten werden nirgends gelesen (Ordnung: 11 × 0 Importeure) |
| D2 | `data/lohnCheck.js:14-25` (#508) | Mindestlohn-Sätze alle `jahr: 2026` → ab 1.1.2027 überall «nicht belegt», bis geprüfte 2027-Werte drin sind. Gewollt, aber Termin. | Qualität |
| D3 | `data/lohnRechtsstellen.js:46-55` | Tessin: RLSM RL 843.610 wird am 1.1.2027 aufgehoben (Merker im File); **Nachfolger existiert** (siehe D12). | Recht, präzisiert durch Swiss |
| D4 | `data/branchenLohn.js:66-84` | 15 Branchenmediane `jahr: 2022`, laut eigenem Kommentar «einzeln (noch) nicht belegt»; Chip zeigt das Jahr, Urheber BFS. | ✔ Kommentar Z. 63-64 gelesen |

| D5 | `config/cantonalData.js:484-492` | EL-Heuristik `totalIncome < totalExpenses + 2000`: prüft die Vermögensschwelle (100'000 / 200'000) nie, gleiche +2000 für jeden Haushalt (Ehepaar 31'005/12 ≈ 2584), Miete/Prämie ungedeckelt, Erwerb zu 100 %. `SozialhilfeView.jsx:200-201` zeigt «Gesamteinkommen / Gesamtausgaben» nebeneinander, als wäre es die EL-Rechnung. | Swiss; BSV Merkblatt 5.01 (Stand 1.1.2025, 2026 nicht verifiziert) |
| D6 | `config/cantonalData.js:490` → `SozialhilfeView.jsx:198` | `noteKey` ist bei jeder Rente `elCalc.possible`, auch wenn `eligible:false` → «Möglicher Anspruch auf EL» bei 5500 CHF Renten; die Finanzübersicht sagt im selben Fall «nicht anwendbar». | Swiss, eigener Lauf |
| D7 | `FinanzUebersicht.jsx:521`, Export `:110` | EL-Karte liest `el.deficit`, das nie geliefert wird → «– pro Monat» (auch im Export). | Swiss |
| D8 | `VorsorgeRechner.jsx:149, 525, 945` | Leeres «Aktuelles BVG-Guthaben» → 0 ohne Hinweis; Beispiel 45 J., 85'000: Rente 1228/Mt. ohne Altguthaben. Parameter selbst richtig (Art. 16 BVG, 6,8 %). | Swiss (vom Judge herabgestuft) |
| D9 | `data/ahvRechner.js:154-165` | Ehepaar-Plafond fix 3780 auch bei Teilrenten (Merkblatt 3.01 Ziff. 23: tiefer); Partner/in mit denselben Beitragsjahren; Plafond auch, wenn nur eine Person bezieht. | Swiss |
| D10 | `VorsorgeRechner.jsx:428`; `ahvRechner.js:128-134` | Frauen Übergangsgeneration 1961-1969: Rentenzuschlag fehlt, eigene günstigere Vorbezugssätze fehlen, Vorbezug ab 62 nicht wählbar (min 63). | Swiss; Merkblätter 3.01 Ziff. 22, 3.04 Ziff. 1/4 |
| D11 | `config/cantonalData.js:447`; ungeschützt `budgetSync.js:98`, `SozialhilfeView`, `BehoerdenDossier`, `pegel.js` | IPV bei Einkommen leer/0/negativ → Maximalbetrag (ZH/AG 400, SG 524 > Prämie 400). Hauptansichten sperren mit `income > 0`, diese vier nicht. | Swiss, eigener Lauf |
| D12 | `lohnRechtsstellen.js:50-52`; `lohnCheck.js:62-70`; `utils/stundenlohn.js:63` | **Tessin 2027 (zu #508):** Der Riegel selbst ist richtig. Aber: neues RLSM vom 8.7.2026 (in Kraft 1.1.2027) benennt weiter das UIL — Kommentar «kein Nachfolger» überholt (korrigiert D3); LSM-Änderung vom 20.4.2026 macht den Mindestlohn ab 2027 vorrangig vor GAV → Ausnahmen-Texte in 5 Sprachen prüfen; TI 2027 20.50-21.00 (Decreto 7.10.2026) — `TI_MINDESTLOHN_OBERGRENZE = 20.5` ist eine zweite Konstante neben `MINDESTLOHN`. | Swiss; BU TI 2026 Nr. 24 S. 242, Nr. 22 S. 186; ti.ch/salario-minimo |
| D13 | `de.js:2352` (5 Sprachen) | «Medianlohn rund 6800» = LSE 2022 (6788); die App führt selbst 7024 (2024). | Swiss + Recht; BFS-Mitteilung 25.11.2025 |
| D14 | `branchenLohn.js:66-84` | `gastro` 4479 (2022) vs. BFS 2024 Gastronomie 4744; `getBranchenvergleich` sortiert 2022- und 2024-Werte in ein Ranking. Übrige 2022-Werte nicht verifizierbar (STAT-TAB). | Swiss (präzisiert D4) |

### 2c · Recht & Wahrheit (Linse 3)

| # | Stelle | Befund | Beleg |
|---|---|---|---|
| R1 | `MedicationManager.jsx:121-123` | Kompendium-Link hängt den **Medikamentennamen** (Gesundheitsdatum, Art. 5 lit. c DSG) als Suchbegriff an `compendium.ch`; Datenschutzerklärung und `/rechtliches` sagen «keine Empfänger». Klick-Abfluss, kein `fetch`. | ✔ `'https://compendium.ch/search?q=' + encodeURIComponent(med.name)` |
| R2 | `de.js:1494, 1559, 2685, 6516` | «sicher ablegen / sicher aufbewahren» für Dokumente, die **unverschlüsselt** in IndexedDB liegen (Tresor nur DEV) — heikel bei Pass/Asyl (Art. 3 Abs. 1 lit. b UWG). | Recht; `main.jsx:1590-1591` |
| R3 | `de.js:2416, 2442` | In-App-Haftungsausschluss absolut; der Entwurf `docs/legal/nutzungsbedingungen.md:68` hat den Vorbehalt Art. 100 Abs. 1 OR, der verbindliche Text nicht. | Recht |
| R4 | `de.js:3339, 3343` | KK-Kündigungsbrief fest «per 31. Dezember»; ab 1.12. nicht mehr fristgerecht (Art. 7 Abs. 2 KVG), kein Datumsgate. | Recht |
| R5 | `LegalView.jsx`; `fr/it/en/rm.js` `legal.privacy.*` | In-App-Rechtstexte fr/it/en/rm ohne «deutsche Fassung massgebend» (die öffentlichen Seiten haben ihn); RM ungegengelesen. | Recht |
| R6 | `CONTRIBUTING.md:39` | Beiträge nur «unter AGPL-3.0», keine CLA — kollidiert mit dem angebotenen Dual Licensing. Juristisch zu prüfen. | Recht |
| R7 | `de.js:2432-2433`; `public/rechtliches/index.html:157` | Impressum ohne Postanschrift; die offene Abklärung steht im öffentlichen Text. *Bekannt (Bau-Liste E12)*, hier nur vermerkt. | Recht |

### 2d · Sicherheit (Linse 2)

| # | Stelle | Befund | Beleg |
|---|---|---|---|
| S1 | Git-Historie (`d021a8da`, `313c499b`, `cdb51082` u. a.) | Das Repo ist **öffentlich**; die Historie enthält SFTP-Host, SFTP-User und den Serverpfad `/home/clients/<32 hex>/…` (kein Passwort; IP-Filter laut `deploy.sh`). Bewerten: Zugang rotieren / Pfad ist kein Geheimnis? | ✔ `gh repo view` → PUBLIC; `git log --all -G"home/clients/[a-f0-9]{8,}"` → 9 Commits |
| S2 | `deploy.sh:245, 305, 322`; `scripts/aufraeumen-trockenlauf.sh:41` | `set sftp:auto-confirm yes` — Host-Key ungeprüft, Passwort-Login. | Sicherheit |
| S3 | `VENDOR.md:33` | SHA-256-Pin von `src/vendor/qrcodejs.js` veraltet (Datei seit `8912c461`/`1ab78b75` geändert). | ✔ `shasum -a 256` → `7fc4c4f79d72…` ≠ Pin `e36ad102…` |

### 2e · Zugänglichkeit & Gestaltung (Linsen 4, 5)

| # | Stelle | Befund | Beleg |
|---|---|---|---|
| A1 | `components/VorlesenButton.jsx:21-23` | Vorlesen-Knopf (Zielgruppe Low-Literacy) `opacity 0.45`, 24 px → 1.96:1 hell / 2.24:1 dunkel. | a11y, gerechnet |
| A2 | `Dashboard.jsx:249-250` | Beta-Feedback-Knopf: weiss auf `sage` im Dark Mode 2.91:1 (`sageBtn` hätte 8.17:1). | Polygrafin, gerechnet |
| A3 | `Dashboard.jsx:694` | Leere Kapitel `opacity 0.72` → `mid`-Text ≈ 3.1:1 — beim Erststart alle sieben. | Polygrafin, gerechnet |
| A4 | `main.jsx:354, 381` | Untere Hauptnavigation 10 px (kleinster Token 13 px). | ✔ Zeile gelesen |
| A5 | `ChartsAdvanced.jsx:100-119` | Kuchen: feste Hex, Wohnen = Schuldenraten (`rose`), KK = Kommunikation, BVG ≈ Lebensmittel (1.016:1); folgt weder Dark- noch Farbenblind-Modus. | a11y + Polygrafin |
| A6 | `CalendarReminders.jsx:318-371` | Fälligkeit nur als 5-px-Farbpunkt, `aria-label` ohne Status; gold 1.93:1. | a11y |
| A7 | `AlvRechner.jsx:129`, `MietzinsOrientierung.jsx:161`, `PflegeEntloehnung.jsx:54`, `PraemienOrientierung.jsx`, `Schnellcheck.jsx` | Ergebnis ändert beim Tippen, kein `aria-live`. | a11y, `grep -c` |
| A8 | `Baum3D.jsx:609, 760` | In-App-Schalter «Reduzierte Bewegung» wird ignoriert (nur Systemeinstellung). | a11y |
| A9 | `GlossarBegriff.jsx:144` | Tooltip ohne Escape / `aria-describedby`; Marker offen 2.19:1. | a11y |
| A10 | `NotificationSettings.jsx:72` | Schalter ohne `role="switch"`/`aria-checked`, Zustand im festen englischen Label «on/off». | a11y |
| A11 | Touch-Ziele < 44 px | `BergLandschaft.jsx:500,581` (26/30), `Lebensbaum.jsx:256` (~30), `MerklisteView.jsx:74` (20), Lösch-/Schliessknöpfe 24 px ohne Eintragsname (`StorageWarning.jsx:86`, `DoctorManager.jsx:81-83`, `MedicationManager.jsx:143`, `JobManager.jsx:37`, `DiseaseManager.jsx:124`, `Saeule3aTracker.jsx:117`), Kalender 30, `EinkommenFeld.jsx:54` 28, Tresor 36, `Kreditkarte.jsx` 32. | a11y |
| A12 | `main.jsx:1177` | Skip-Link `href="#mp-main"` überschreibt die Hash-Route (`hashRouter.js`). Nicht im Browser bestätigt. | a11y |
| A13 | `DirektLinks.jsx:85` | **Code-Fehler:** `ease.out` ist `undefined` (`ease` ist ein String) → `'transform 140ms undefined'`, Übergang springt. | ✔ `config/tokens.js:71 export const ease = 'cubic-bezier(…)'` |
| A14 | `VorsorgeRechner.jsx:610, 685, 699-745` | SVG-Beschriftung 8.5–11 px bei viewBox 680 → ≈ 4.5–5.7 px am Handy, auch der CHF-Betrag. | Polygrafin, gerechnet |
| A15 | `FinanzUebersicht.jsx:371-425`; Druck-HTML `FinanzUebersicht.jsx:83-154`, `ChapterView.jsx:1111-1164` | 10-px-Quellentext auf `soft`; Druck 11 px `#aaa` (≈ 2.3:1) / `#888` (3.54:1) — Ausdrucke gehen an Ämter. | Polygrafin + a11y |
| A16 | `config/constants.js:7, 20, 27, 36` | `mid`/`soft` praktisch gleich (1.05/1.06), hell `soft` dunkler als `mid`; dunkel `goldDeep = gold`, `sandDeep = sand`. | Polygrafin |
| A17 | `text.xs - 1` an 11 Stellen (u. a. `Leistungsliste.jsx:128`); `text.md`/`weight.regular` existieren nicht (`CalendarReminders.jsx:315,327`, `LohnEinordnung.jsx:254,259`) | Token-Skala unterlaufen bzw. undefinierte Tokens. | Polygrafin |

### 2f · Sprache (Copy)

| # | Stelle | Befund | Beleg |
|---|---|---|---|
| T1 | `de.js:5752` | `po.insurerNotFoundHint` «Prüfe die Schreibweise» ohne `{sie,du}`-Split. | ✔ Zeile gelesen |
| T2 | `it.js:264` | Notfall-Schritt «chiama subito» nur Du. | Copy |
| T3 | `rm.js` (24 Keys, u. a. `notfallkarte.loc_denied`, `kkErst.step3Text`) | Flach mit Du, wo de gesplittet ist; nicht in `RUMANTSCH_GAP_NOTE.md`. | Copy |
| T4 | `rm.js:2231` | `chapters.behoerden.emptyState` hat Steuer-Inhalt statt Behörden. | Copy |
| T5 | `rm.js:2267, 2140, 4181, 4185` | Ton/Inhalt weicht ab: Notfall «kann Leben retten»; Familienzulagen ohne CHF 268; Testament ohne Art. 499 / 505 Abs. 2. | Copy + Recht |
| T6 | `main.jsx:1007` | Sie/Du-Schalter nicht für fr, obwohl fr 929 Splits pflegt. | Copy |
| T7 | `public/404.html:56`, `public/wartung.html:65` | duzen fest. | Copy |
| T8 | `de.js` Feldnamen (`landlord`, `doctorPhone`, `schulden.debtor`, `employmentType`) | generisches Maskulinum neben «Ärztin / Arzt». | Copy |
| T9 | `RUMANTSCH_GAP_NOTE.md` | nennt 217 Lücken (08.07.), `i18n-gap-scan.mjs` misst heute **1086** — Notiz überholt (Lücke bekannt). | Qualität + Copy |

### 2g · Ordnung & Doku (Linse 8)

| # | Stelle | Befund | Beleg |
|---|---|---|---|
| O1 | `README.md:5, 73, ~52, ~58` | Version 0.1.0-beta; «ohne Runtime-Abhängigkeiten» (react, react-dom, three); «Node 18+» (engines `^20.19 \|\| >=22.12`). | Ordnung |
| O2 | `src/data/orientationRegistry.js` | ganze Datei ohne Importeur; zwei Docs beschreiben sie als aktives Register. Folge: `orientation.bewilligung_c` (fachlich unvollständig, Recht) wird latent nicht gezeigt. | Ordnung + Recht |
| O3 | `kkScanner.js:65-67` | `performOCR` wirft immer → OCR-Rückfall toter Pfad. | Ordnung |
| O4 | `docs/DEV_WORKFLOW.md:161`, `docs/context/ARCHITECTURE_INDEX.md:1-8`, `docs/context/LEGACY_NAMING_AUDIT.txt` | Doku-Drift: TODO.md als Arbeitsliste (seit 15.09. nicht mehr), drei nicht existierende Dateien, veralteter Namens-Schnappschuss. | Ordnung |
| O5 | `src/tokens.css:49-110` | 21 von 40 CSS-Variablen ungenutzt (teils bewusst reserviert). | Ordnung |

---

## 3 · 🔵 Später

*Kurz, je eine Zeile; Belege in den Prüfer-Abschnitten der Roh-Notiz.*

- **Fachwerte:** BS-Feiertagszuschlag 0,39 % fehlt (`lohnCheck.js:85`; bs.ch: Total 24.14) — sichere Richtung · ALV-Zuschlag in Höhe der Familienzulagen (AVIG Art. 22 Abs. 1) nicht abgebildet, Kopf sagt «keine Abweichung» · `ahvRechner.js:123` Division durch 0 bei `beitragsjahre = 0` + Erziehungsjahren → `Infinity` · Kapitalbezug-Kantonssätze aus privater Quelle (finpension), als Orientierung markiert · nicht verifizierbar in diesem Lauf: SKOS-Grundbedarf 2026 (skos.ch nicht abrufbar), EL-Werte 2026, BFS-Armutsgrenze 2024, Mindestlohn GE/NE amtlich, BVG-Mindestzins 2027.
- **Sicherheit:** `BriefGenerator.jsx:568` iframe ohne `sandbox` · `cvGenerator.js:152` `references.note` ungeescaped (Quelle i18n) · `utils/icsExport.js:36` UID ohne Escape · `taxImport.js:139`/`csvImport.js:24,102` kein Grössenlimit · `csvImport.js:13,37` `1e999` → Infinity · `kkScanner.js:23-59` kein `img.onerror` · `SearchView.jsx:17-18` `mp_suche` ohne `or5_` überlebt «Alle Daten löschen» · `ios/App/App/Info.plist:31-33` armv7, keine Kamera-/Foto-UsageDescription · `utils/secureStore.js:244,263,271` ohne try/catch (dormant) · CSP `style-src 'unsafe-inline'` (bewusst).
- **Code:** Passphrase ohne `normalize('NFC')` · `revokeObjectURL` sofort nach `click()` (`helpers.js:85-91`, `BudgetSync.jsx:55-62`, `icsExport.js:57-66`) · `crypto.randomUUID()` ungeschützt im Auto-Save · kaputtes `or5_data` ohne Rohkopie (`main.jsx:496-513`) · `docReminders.js:61-63` RangeError bei `expiryDate '31.12.2026'` → Fehlerschirm bei jedem Start · Ablauftag gilt bis 02:00 (UTC-Parse).
- **Recht:** Standort-Funktion `NotfallVorlesekarte.jsx:49-64` nicht in DSE/Verzeichnis · `de.js:2352` Medianlohn «rund 6800» vs. eigene 7024 (BFS 2024) · «geschützt» für nicht eingetragene Marke (`de.js:2419`) · «Kein Server» absolut (`de.js:2317`, `index.html:245`) · Infomaniak als Auftragsbearbeiterin ohne geprüften AVV · `de.js:2041` «Prämie bestimmt IPV-Anspruch» (Art. 65 KVG: wirtschaftliche Verhältnisse) · Lizenzangaben uneinheitlich (`package.json` SPDX, NOTICE 3 vs. 8 Lizenzen) · DSE-Entwurf «nicht unter 16» vs. Lehre-/Volljährig-Abläufe.
- **Link:** `direktLinks.js:250` `ge.ch/tax/` → Startseite · ch.ch-Links (SPA) per curl nicht verifizierbar — einmal im Browser öffnen · `stipendienData.js:14,15` edk.ch 403 (vermutlich Bot-Sperre) · `sbb.ch/begleitabo` 403 · `de.js:606` bger https→http · Wallis-IPV landet französisch · `heks_ost`-Slug · `taxme.ch` → `sv.fin.be.ch`.
- **Copy:** `main.jsx:1014` aria-label deutsch · `DiseaseManager.jsx:185` «z.B. E11» · `manifest.json:4` de/en gemischt · `index.html:74` Kleinschreibung nach Punkt · Du/du 177/695 gemischt · «Selbstständig» 4 / «Selbständig» 14 · rm `onboarding.getStarted` «Dai!» (einziges «!») · `{kanton}` als Kürzel in `ChapterView.jsx:1343,1589` vs. Name in `Stundenlohn.jsx:117` (#508, Wirkung gering) · «Achtung» an IPV-Fristen.
- **Gestaltung:** drei Primärknopf-Sprachen · Abstände neben der Skala (12 px × 177) · `backdrop-filter: blur` im Kopf (Glas) · `tokens.css:305` Text-Nebel per `[style*="background"]` · `theme-color` fest hell · `print.css:90-101` tote/übergreifende Regeln, `[aria-live]` beim Drucken ausgeblendet (= Rechner-Ergebnisse) · Zeilenlänge ≈ 80-85 Zeichen · Roh-Schatten, `'999px'` · Kicker in Versalien.
- **Ordnung:** 7 tote Exporte + 4 in `validationUtils.js` · ≈ 43 überflüssige `export` · ≈ 308 nur von Tests importierte Exporte (*nicht belegt tot* — Registry-Auflösung nicht verfolgt) · 67 tote i18n-Keys × 5 · `icons-full/`, `coin-*` (E11) · `docs/security/architecture.md` und `public/sw.js:175` alter Name `ordnung-ruhe` · `docs/context/MY_FILE.md` Platzhalter · `REPO_MAP.txt` veraltet.
- **SaaS-Geruch (Polygrafin, Entscheid Stebler):** Fortschritts-Pillen + sieben %-Balken (`BergLandschaft.jsx:425-470`, `BergDetail.jsx:81,162`) · Feder-Stempel bei 100 % (`Dashboard.jsx:727-729`) · Rundgang mit Spotlight (`Tour.jsx:116-150`).

---

## 4 · Abdeckung — die acht Linsen

| Linse | Ergebnis | Wer / Messung |
|---|---|---|
| 1 Code & Korrektheit | **Befund** (B4, B5, C1-C11) | Code-Prüfer (Kernlogik, Speicher, Krypto); Qualität: `npx vitest run` **6196/6196** grün (340 Dateien), `npx eslint src` 0, Build sauber. `/code-review ultra` **nicht** gelaufen (nur von Stebler auslösbar, kostenpflichtig). |
| 2 Sicherheit | Befund (S1-S3, 🔵) — **nichts blockierend** | Sicherheits-Prüfer; `npm audit --omit=dev` → 0; kein `fetch`/XHR/Beacon in `src`; CSP self-only |
| 3 Recht & Wahrheit | Befund (B8-B10, B12, R1-R7, D1-D14) — keine falsche Artikelnummer | Rechts-Prüfer (≈ 150 Artikel gegen Fedlex-Wortlaut), Halluzinations-Sweep (94 Zahlenblöcke + 104 IPV-Blöcke gezählt), Swiss-Precision (Werte gegen BSV-Merkblätter 3.01/3.04/6.01/6.06/2.01, Fedlex AVIG/AVIV/DBG/KVV/BVG, ESTV 58c-2026, bs.ch/jura.ch/ti.ch — Bestätigt-Liste unten) |
| 4 Design & UI-Zustände | Befund (A2-A5, A13-A17) — nichts blockierend | Polygrafin |
| 5 Zugänglichkeit | Befund (A1, A5-A12) — nichts blockierend | a11y-Prüfer (Kontraste gerechnet, nicht im Browser gemessen) |
| 6 SEO & GEO | geprüft, ohne Befund | ✔ `bash scripts/check-seo.sh <audit-dist>` → «0 Pflicht-Fehler · 0 Warnung(en)» |
| 7 Betrieb & Rückweg | geprüft; B6 (Version) | ✔ `deploy.sh` hat das Rollback-Backup als Gate (seit 14.09.) und `check-seo.sh` als Tor; live `curl https://malojaplana.ch/` → 200, Bundle `index-DonLTkj4.js` |
| 8 Aufräumen | Befund (O1-O5, 🔵) | Ordnungshüter; Bundle-Reserve 3.46 KiB (1024 B) bzw. 1.98 kB (1000 B) gegen 65 KB |

**Links:** 1121 URLs roh, 1085 geprüft → 1052 2xx; Fedlex 626 Links auf 51 Erlasse, alle ELI gültig, 0 Artikel/Anker-Abweichungen (Fedlex liefert für jeden Pfad 200 — Anker-Existenz nicht messbar).

**Gegen amtliche Quelle bestätigt (Swiss-Precision, Auszug):** AHV 1260/2520/3780, 15'120/90'720, Aufschubtabelle 5.2-31.5 % (PR #136 jetzt richtig), Vorbezug 6.8 %/J. (Merkblätter 3.01/3.04, Stand 1.1.2026) · BVG 22'680/26'460/90'720/3780/64'260, Gutschriften 7/10/15/18 %, Mindestzins 1.25 %, UWS 6.8 % · 3a 7258/36'288 · ALV 148'200, 2.2 %, 70/80 %, Schwelle 140 CHF/Tag, Wartetage, 200 Taggelder < 25 · EO 220, 80 %, Teiler 360 · Bundessteuer-Tarif 2026 an 44 Prüfstellen (max. 4 Rp. Rundungsdifferenz, dokumentiert) und DBG-Abzüge · Franchisen/Selbstbehalt (KVV Art. 103) · Mindestlohn BS 22.20, JU 21.40, TI 20.00-20.50 · IPV ZH 2026/2027 · 11 IPV-Kantone mit je 6 Profilen ohne NaN/negativ · #508-Riegel-Logik.

**Erledigt seit dem L-Review 15.09.** (am Code bestätigt): OR 266l im Kündigungsbrief, Vercel→Infomaniak in der DSE, `petition.ch`, AHVV Art. 55ter-Tabelle, Schulden-Alarm, ALV-Block gesplittet, `nav.alv`/`alv.title`, `onSand`-Kontrast, `csvImport`/`schuldenCalc`/`cvGenerator`-Exporte.

## 5 · Was dieses Audit nicht ist

- Kein Beweis für Fehlerfreiheit; Kontraste gerechnet, nicht im Browser gemessen; nichts auf dem iPhone geprüft.
- Keine juristische Prüfung (R3, R6, R7 brauchen einen Menschen mit Zulassung).
- Keine Fixes. Umsetzung nur auf ausdrücklichen Zuruf; Vorschlag: B1-B3, B6, B7, B10, B12 als ein S-PR vor dem 29.10.; B4, B5, B8, B9 je mit Test (B8 braucht die Skala-44-Tabelle — eher M).

*Prüfer-Aufwand (Sonnet-Executor): Qualität 85k · Link 88k · Sicherheit 146k · Polygrafin 160k · a11y 194k · Ordnung 173k · Copy 255k · Code 368k · Sweep 360k · Recht 614k · Swiss Precision 371k (der erste Swiss-Lauf wurde versehentlich abgebrochen und neu gestartet). Judge: Claude Code (Opus).*
