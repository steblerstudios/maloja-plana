# Voll-Review Stufe L — Maloja Plana, `main` = `4b922ac`, 15.09.2026

*Neun Prüfer, je ganze App, Judge-Prinzip (Claude Code plant und prüft, die Agenten lesen). Nur
Neues — Bekanntes aus `docs/TODO.md` und `FEATURES.md` war ausgeschlossen. Bewertung durch Claude Code in
Spalte «Urteil». Diese Datei ist der Beleg; umgesetzt wird über die Bau-Liste
(`docs/BAULISTE-2026-09-30.md`, Abschnitt 7).*

## Ergebnis in einem Blick

| Prüfer | 🔴 | ⚠️ | 💡 |
|---|---|---|---|
| Swiss Precision | 3 | 6 | 1 |
| Recht | 2 | 6 | 2 |
| Copy | 3 | 2 | 0 |
| a11y | 1 | 2 | 2 |
| Ordnungshüter | 1 | 3 | 3 |
| Sicherheit | 0 | 5 | 5 |
| Qualität | 0 | 2 | 5 |
| Polygrafin | 0 | 3 | 2 |
| Link-Checker | Lauf brach am 15.09. am Nutzungslimit ab, Neustart läuft; Ergebnis wird hier nachgetragen | | |
| **Summe (8 von 9)** | **10** | **29** | **20** |

**Wo die 10 🔴 hingehen:**

| 🔴 | Befund | Stand |
|---|---|---|
| Swiss 1 | AHV-Aufschubszuschlag linear statt Tabelle Art. 55ter AHVV (5 J: 16 % statt 31,5 %) | PR #136 |
| Swiss 3 | «Referenzalter 65» fest im Szenariotext | PR #136 |
| Swiss 2 | `CANTONAL_IPV` mustergeneriert, zeigt trotzdem «Berechtigt» + CHF-Betrag | **offen — Entscheid Stebler Studios (E9 in der Bau-Liste)** |
| Recht 1 | Datenschutzerklärung + Verzeichnis nennen Vercel/USA statt Infomaniak/CH | Rechts-Doku-PR (in Arbeit) |
| Recht 2 | Kündigungsbrief zitiert OR 266a statt 266l Abs. 1 | PR #134 |
| Copy 1–3 | Schulden-Alarm mit «!», ALV-Block nur Du, «Arbeitslosengeld» | PR #134 |
| a11y 1 | `onSand` auf `sky` 4.496:1 | PR #134 |
| Ordnung 1 | `docs/TODO.md` widerspricht sich selbst (hreflang) | PR #134 |

Die ⚠️ und 💡 sind unten je Prüfer mit Urteil; was nicht in #134/#136 steckt, steht in der
Bau-Liste als KANN oder als Oktober-Punkt.

## Polygrafin (69k Token, 21 Zugriffe)

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| ⚠️ | `src/Dashboard.jsx:589` | Baum-Label 7.5/9 px, unter kleinstem Token (13 px) | prüfen: Deko-Label im SVG? Wenn lesbar gemeint → text.xs |
| ⚠️ | `src/Dashboard.jsx:1092` | Berg-Label 9 px | dito |
| ⚠️ | `src/Dashboard.jsx:358-429` | FortschrittsKarte: acht %-Balken lesen sich wie SaaS-Checkliste | Design-Entscheid Stebler Studios, nicht bis 30.09. |
| 💡 | `src/components/Gauge.jsx:59,71-72` | SVG-Text 11 px fest | Kür |
| 💡 | `src/Dashboard.jsx:427` | Status-Label 10 px | Kür, mit den zwei oben zusammen |

Bestätigt: Heading/CalmLoader/BetaGate/PrimaryButton token-sauber; keine Konfetti-/Badge-Sprache; Granit-Metaphorik trägt.

## Copy (57k Token, 12 Zugriffe)

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| 🔴 | `de.js:2817` `debtRecommendations.critical` (+ fr 2789, it 2790, rm 2589) | «Kritische Schuldenlage. Sofortige Schuldenberatung erforderlich!» — alarmierend an schamsensibler Stelle | **fixen, S**, 4 Sprachen |
| 🔴 | `de.js:4195–4226` `alv`-Block | durchgehend Du ohne `{sie,du}`-Split; fr/rm haben den Split | **fixen, S–M**: ~10 Keys splitten |
| 🔴 | `de.js:804` `nav.alv`, `4196` `alv.title` | «Arbeitslosengeld» (DE-Begriff) statt «Arbeitslosenentschädigung»/«ALV-Taggeld» | **fixen, S** |
| ⚠️ | `de.js:3098–3099` | «Bereit, {name}!» / «Alles ist bereit!» | S, Ausrufezeichen weg |
| ⚠️ | `de.js:3616` | «Danke für Ihr Feedback!» | S |

Bestätigt: Sozialhilfe/EL-Texte würdevoll; Sie/Du-Zähler 428/428; kein ß.

## Qualität (75k Token, 38 Zugriffe)

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| ⚠️ | `src/main.jsx:580` | `localStorage.setItem('or5_theme')` ohne try/catch, einziger ungeschützter von 21 | **fixen, S** (eine Zeile) |
| ⚠️ | `package.json` size-limit | Reserve 1.51 kB | beobachten; M8-Icons müssen das einhalten |
| 💡 | `src/kkScanner.js` `performOCR`, `extractKKDataFromText` | exportiert, 0 Referenzen | Ordnungshüter-Frage: tot oder geplant? nicht bis 30.09. |
| 💡 | `src/csvImport.js` `parseCSV/parseExcel/parseEBill` | 0 Referenzen | dito |
| 💡 | `src/schuldenCalc.js` Betreibungsauszug-Funktionen | 0 Referenzen | dito |
| 💡 | `src/cvGenerator.js:202` `generateJSONResume` | 0 Referenzen | dito |
| 💡 | `src/utils/secureStore.js:142-272` | Tresor-Funktionen ohne try/catch, dormant | beim 2b-UI-Bau |

Bestätigt: CSP self-only intakt, keine Inline-Scripts, keine externen fetches; keine Tests ohne Aussage; keine neuen Dependencies. i18n-Lücken FR 9 / IT 2 / RM 217 sind dokumentiert (`RUMANTSCH_GAP_NOTE.md`), kein neuer Befund.

## Swiss Precision (153k Token, 50 Zugriffe) — die schwersten Funde

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| 🔴 | `src/data/ahvRechner.js:20`, `VorsorgeRechner.jsx:446,761` | Aufschubszuschlag linear 3.2 %/J; AHVV Art. 55ter: 5.2 / 10.8 / 17.1 / 24.0 / 31.5 % — bei 5 J zeigt die App 16 % statt 31.5 % | **fixen mit amtlicher Tabelle + Test** (Agent, Quelle fedlex) |
| 🔴 | `src/config/cantonalData.js:182-208, :351` | `CANTONAL_IPV` mustergeneriert (family = 2×single, child = 0.5×, Grenzen auf 3000 gerundet) + erfundener linearer Abbau; Ausgabe «✓ Berechtigt» + CHF-Betrag, fliesst ins Budget (`budgetSync.js:94`) | **neuer MUSS M13**: Betrag zurückhalten oder je Kanton belegen — Entscheid Stebler Studios (E9) |
| 🔴 | `de.js:3926,3928` | «Referenzalter 65» fest im Text, Code rechnet AHV-21 (64 J … ) | **fixen** (Platzhalter) — Agent zusammen mit AHV |
| ⚠️ | `TaxCalculator.jsx:26`, `steuerRechner.js:137` | Alleinerziehende: Grundtarif + Kinderabzug statt Elterntarif (DBG 36 Abs. 2bis) | M: eigener PR mit Test, Quelle ESTV |
| ⚠️ | `kantonaleSteuerdaten.js:3,43` | Faktor bei 80k/ledig geeicht, auf alles multipliziert | Entscheid: Band begrenzen oder «grob» kennzeichnen |
| ⚠️ | `kvgLeistungen.js:39` | Taxpunktwerte Stand 2025 (Tarmed), App nennt Tardoc 2026 | Datenquellen-Sprint |
| ⚠️ | `de.js:3482` | Generika-Selbstbehalt «10 % statt 20 %» — KVV 38a seit 1.1.2024 geändert, nicht belegt | am Verordnungstext prüfen |
| ⚠️ | `ahvRechner.js:159` | 13. Rente ×13 auf plafonierte Rente; Ehepaare (Art. 34bis AHVG) evtl. ohne Plafond | am Gesetz prüfen |
| ⚠️ | `alvRechner.js:2,70` | Werte Stand 01.01.2025 im Laufjahr 2026 | SECO 2026 nachziehen |
| 💡 | `budgetSync.js:64-73` | LIK-Basis 2020, ab 2026 neu basiert | Januar-Wartung |

Bestätigt: Bundessteuer-Tarif 2026, AHV/BVG-Eckwerte 2026, 3a, Vorbezug 6.8 %, SKOS, Franchise; wageClaim-Sperre wirkt; Mindestlöhne 2026 sauber.

## Recht (120k Token, 42 Zugriffe)

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| 🔴 | `docs/legal/datenschutzerklaerung-ndsg.md:66,89`, `bearbeitungsverzeichnis-ndsg.md:124-127,152` | Vercel/USA/DPF statt Infomaniak (CH) — Art. 19, 16–18, 12 nDSG | **Rechts-Doku-PR** (Agent), Stebler Studios liest |
| 🔴 | `de.js:2516` (+ en 2494, fr 2493, it 2494, rm 2891) | «OR Art. 266a» für Schriftform — richtig ist **OR Art. 266l Abs. 1** (amtlich geprüft) | **fixen, S, 5 Sprachen** (Fix-Branch) |
| ⚠️ | `de.js:1796` `ethics.sustain4` | «null Netzwerkverkehr» — SW ist network-first | **fixen, S, 5 Sprachen** |
| ⚠️ | `de.js:2536` (+4) | «KVG Art. 7 bis 30. November» — Abs. 1 erlaubt auch Semesterende | **fixen**: «Art. 7 Abs. 2 (bei Prämienänderung)» |
| ⚠️ | `de.js:1699` `privacy.hosting1` | Aufbewahrungsdauer + monatliche Statistik-Auswertung fehlen | Rechts-PR; Dauer ist nicht belegt (Infomaniak) |
| ⚠️ | `docs/legal/impressum.md:3` | VDSG aufgehoben, DSV gilt | Rechts-Doku-PR |
| ⚠️ | `impressum.md:9-12`, `de.js:1746` | nur «Basel, Schweiz», keine Strasse — UWG 3 Abs. 1 lit. s | **Stebler Studios: Postadresse/c/o** (Studio-Website hat dieselbe Frage) |
| ⚠️ | `rm.js:2891, :2911` | rm lässt «Kündigungsfristen beachten»/«Einschreiben empfohlen» weg | fixen, TODO(rm) |
| 💡 | `README.md:88` | Link `LICENSE` → Datei heisst `LICENSE.txt` | fixen, S |
| 💡 | `LegalView.jsx:38` | `LEGAL_LINKS` Term `'Art. 7'` zu generisch | fixen, S |

Bestätigt: null Netzaufrufe, «100 % lokal» hält; Brief-Disclaimer korrekt platziert; OR 322/323, ATSG 52, ZGB 169 korrekt; AGPL konsistent; Gerichtsstand BS in 5 Sprachen.

## Sicherheit (151k Token, 57 Zugriffe) — 🔴 keine

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| ⚠️ | `.github/workflows/deploy.yml:64` | SFTP-Passwort im Befehlstext (`open -u user,pass`), Host/Dir roh interpoliert; `deploy.sh` nutzt längst `--env-password` | **fixen, S** (Workflow ist dormant, Infomaniak blockt CI-IPs) |
| ⚠️ | `ci.yml:21`, `deploy.yml:46` | `npm install` statt `npm ci` — Lockfile bindet nicht | **fixen, S** |
| ⚠️ | `ci.yml`, `deploy.yml` | kein `permissions:`-Block | **fixen, S** (`contents: read`) |
| ⚠️ | `public/icon-preview.html` | Dev-Werkzeug liegt live (200 gemessen), Inline-Script, kein noindex | **fixen, S** → `docs/design/` |
| ⚠️ | `backupCrypto.js:84`, `ZipExport.jsx:73` | Passphrase-Minimum 4 Zeichen (Hinweis sagt 12) | Entscheid Stebler Studios: Boden auf 12? (bestehende 4er-Backups müssen weiter entschlüsselbar bleiben) |
| 💡 | `briefGenerator.js:271` vs `:367` | `objectAddress` doppelt escaped → «Meier &amp;amp; Co» im Kündigungsbrief | **fixen mit rotem Test** (sichtbarer Bug in einem Brief) |
| 💡 | `main.jsx:580` | wie Qualität | erledigt im Fix-Branch |
| 💡 | `public/sw.js:129` | `openWindow(url)` aus Push-Payload; dormant (kein subscribe) | K: auf origin begrenzen |
| 💡 | `SECURITY.md:34`, `docs/security/CHECKLISTE.md:38` | behaupten `frame-ancestors` per meta (wirkungslos); live: `x-frame-options: SAMEORIGIN`, HSTS ohne includeSubDomains | Doku korrigieren (Rechts-/Security-PR) |
| 💡 | `ChapterView.jsx:2176` | `FileReader` ohne `onerror` → stiller Knopf | **fixen, S** |

Bestätigt: null Netzpfade in src/, XSS-Fläche dicht, Vendor-Pins stimmen, Passwort nie in Dateien.

## a11y (143k Token, 70 Zugriffe)

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| 🔴 | `DocumentTresor.jsx:201`, `ZipExport.jsx:257`, `PremiumSubsidy.jsx:324` | Text `onSand` auf Fläche `sky` ≈ 4.50:1 | **prüfen + fixen** (Werte nachrechnen) |
| ⚠️ | `PremiumSubsidy.jsx:198→306` | h2 → h4 ohne h3 | **fixen, S** |
| ⚠️ | `KVGLeistungen.jsx:398, :717`, `VorsorgeRechner.jsx:338` | Textknoten mit rohem `sage` statt `sageDeep` | **fixen, S** |
| 💡 | `SozialhilfeView.jsx:211` | «Nächste Schritte» h4 statt h3 | M8-Agent arbeitet in dieser Datei → danach |
| 💡 | `CalendarReminders.jsx:425-444` | Button-Gruppe ohne role=group | K |

Bestätigt: Tour-Fokusfalle sauber; Deep-Tokens AA-geprüft; Farbenblind-Modus korrekt.

## Ordnungshüter (87k Token, 36 Zugriffe)

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| 🔴 | `docs/TODO.md:19` vs. `:337` | hreflang «offen» und «erledigt+live» im selben Dokument | **fixen, S** — Zeile 19 korrigieren (im Fix-PR) |
| ⚠️ | `src/assets/icons-full/` (18 Dateien) | komplett unreferenziert; `IconSystem.jsx` ist das System | Archiv-Konvention: nach `_archiv` oder `_WAS-IST-DAS` — Stebler Studios |
| ⚠️ | `docs/TODO.md:188` | «Atkinson-Font wiren» offen, ist in `main.jsx:821` verdrahtet; Rest = Sie/Du-Toggle | **fixen, S** (Zeile präzisieren) |
| ⚠️ | `architektur.html` (Wurzel, gitignored) | 42 kB Karte nirgends gesichert | Stebler Studios: einchecken oder wegwerfen (die Karte wird vom Cockpit über `/karte/maloja` gelesen!) |
| 💡 | `src/assets/coin-*.svg`, `coin-preview.html` | unreferenziert | Archiv |
| 💡 | `public/og-image.svg` | nur PNG referenziert | behalten (Quelle) |
| 💡 | `master-roadmap.md` | 3 Monate Drift, gesperrt | E3 |

Bestätigt: `SESSION_START`, `FEATURES`, `RELEASE_CRITERIA` stimmen mit Live überein; `docs/status/current-state.md` korrekt archiviert; Datenmodell-Exporte alle verdrahtet.

## Nebenbefunde aus der DSFA (M12, Abschnitt 7)

*Gemessen: «Vercel» steht NICHT im In-App-Text (`src/i18n/*.js`, `LegalView.jsx`), nur in sieben internen Docs (`docs/legal/…`, `docs/security/…`). Damit ⚠️ Doku-Drift, kein 🔴 für Nutzer.*

| Sym | Stelle | Befund | Urteil |
|---|---|---|---|
| 🔴/⚠️ | `docs/legal/datenschutzerklaerung-ndsg.md` §5.1/§6, `bearbeitungsverzeichnis-ndsg.md` T6 | nennen Vercel (USA, DPF); Hosting ist Infomaniak (CH) | Schwere hängt davon ab, ob der In-App-Text (`de.js` legal.*) dasselbe sagt — gemessen unten |
| ⚠️ | dieselben Dokumente §3 | Speichernamen `ordnung-ruhe-*` veraltet; `or5_docs/contacts/merkliste/beta_access`, `_prerestore` fehlen | Rechts-PR, docs-only |
| ⚠️ | `docs/security/threat-model.md`, `data-classification.md` | versprechen Session-Lock/Auto-Lock/«kein Klartext-Export»/AES bei Export — nicht gebaut | Rechts-PR: ehrlich machen |
| ⚠️ | `docs/legal/non-legal-advice-boundary.md` | enthält «Life Events»-Text statt der Abgrenzung | Datei korrigieren |
| ⚠️ | Datenschutzerklärung §7.2 | verspricht «alle Daten zurücksetzen»; `storage.clear()` ohne Aufrufer, SettingsView ohne removeItem | nachstellen: gibt es den Knopf? sonst Bug oder Text |
| 💡 | `backupCrypto.js:193-205` | `_prerestore`-Klartextkopien im Live-Pfad nie gelöscht | K-Punkt |
| 💡 | `ZipExport.jsx:73` | Backup-Passphrase-Minimum 4 Zeichen | K-Punkt (TODO sagt «empfiehlt 12+», prüfen) |
