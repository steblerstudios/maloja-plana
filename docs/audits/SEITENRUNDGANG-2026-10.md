# Seitenrundgang 2026-10 · Befundliste

Grundlage ist main `99ab58e4` vom 26.10.2026, dazu `docs/design/mockups-stardust-2026-10-23/VERGLEICH.md` und die Befunde vom 27.09.2026 (`_maloja-archiv/arbeitspapiere-2026-09/seitenrundgang-befunde-2026-09-27.md`, ausserhalb des Repos). Die Messlatte M1–M9 steht dort.

Geprüft wurde nur der Code, nicht im Browser. Was nur live zu bestätigen ist, steht als «prüfen». Bis Stebler Studios entscheidet, ist nichts gebaut.

### Gebaut als Entwurfs-PR (Stand 26.10.2026, 23:20, nichts gemergt)

| PR | Inhalt | Befunde |
|---|---|---|
| #612 | Fehlerklassen Dashboard/Kapitel | D1, D2, D12, K-F3, K-F4, K-F6, K-F8 |
| #613 → #614 | Hausarzt aus der Liste; weitere Ärzte in Dossier/QR (QR ohne Fachrichtung) | D14 + Entscheid «weitere Ärzte» |
| #616 | Notfall-QR erst auf Klick | Entscheid nach Rechtsprüfung |
| #618 | Werte 2027: SKOS-Jahrestabelle, Mindestlöhne je Jahr, ALV nicht als 2027 | W9 + Werte-2027-Punkte 1, 3, 4 |
| #619 | fehlende i18n-Schlüssel, tote Rückfälle, Anrede/Schalter | S1, R10, R11 |
| #620 | Tippziele ≥ 44 px | R9, R12 (+ «Karte öffnen», Monatsraster, «Beispiel verlassen») |
| #621 | Kalender: Wiederholungen nach Kalender, Ankertag, .ics; Datum in App-Sprache | W10, S3; S2 nachgeprüft: kein Fehler |
| #622 | Steuerrechner key datenModus, «Abzüge (geschätzt)», Franken/Stundenansätze über geld.js | J-key, S3, W11, S5; W12 nachgeprüft: kein Fehler |

| Bereich | Stand |
|---|---|
| Dashboard, 7 Kapitel, Versicherungs-Übersicht | geprüft 26.10.2026 (unten) |
| 35 Abläufe | offen (Prüfer gestoppt) |
| Werkzeuge und Rechner | offen (Prüfer angehalten, Stand gespeichert) |
| Notfall, Anker, Datenseiten, Rahmen | offen (Prüfer angehalten, Stand gespeichert) |
| Werte 2027, Quellen | offen (Prüfer angehalten, Stand gespeichert) |
| Sprachen, Fehlerklassen | offen (Prüfer angehalten, Stand gespeichert) |

---

## Dashboard · 7 Kapitel · Versicherungs-Übersicht

### Abgleich: noch offen oder teilweise

Alle anderen Punkte aus K-F, K-G, Y, Z, AA, AB, AC, AD, AE und M1–M8 sind auf main erledigt.

| ID | Status | Beleg |
|---|---|---|
| K-F3 «1 Jahre, 1 Monate» (Wohnen, neu auch Ausbildung) | offen | `MirrorCards.jsx:117-122, 323`, `de.js:2846-2848` |
| K-F4 Nebenkosten «ca. CHF 2160/Jahr» ohne ’ | offen | `ChapterView.jsx:1471`, `de.js:1604` |
| K-F6 Beispiel-Hausarzt nur im alten Feld `doctor` | offen | `demoData.js:129-130`, `ChapterView.jsx:702-708` |
| K-F8 Datum in Browsersprache | teilweise | offen: «Zuletzt gesichert» `Dashboard.jsx:319`, Portemonnaie-Karte `ChapterView.jsx:1156` |
| K-G8 Arbeitgeber in Finanzen und Ausbildung | Entscheid fehlt | `constants.js:292, 378` |
| AA-6 Spinnennetz «bis M2» | vergessen | M2 steht seit #581, das Netz steht weiter in `ChapterView.jsx:2429-2441` |
| W5 Prämien per `toFixed` | teilweise | `PraemienOrientierung.jsx:429-431` |

### Neue Befunde

| # | Seite | Befund | Klasse | M | Beleg | Vorschlag |
|---|---|---|---|---|---|---|
| D1 | Dashboard, Zeile Behörden | Frist als rohes ISO-Datum «2027-03-31» | Fehler | M6 | `Dashboard.jsx:95`, `de.js:1850` | lokal formatieren wie in `:488` |
| D2 | Dashboard, Zeile Behörden | zählt «x/6», es gibt 5 Gänge; alter Haken kann mitzählen; Text zusammengesetzt statt t() mit Zahl | Fehler | M6/M9 | `Dashboard.jsx:96-100`, `BehoerdenInstrument.jsx:18-24, 44-45` | `GAENGE`/`gangErledigt` nutzen, `{n}/{total}` |
| D3 | Dashboard, Geführter Start | «Notfallkarte vorbereiten» führt ins Kapitel; entschieden: «Notfallkarte» nur für die Vorlesekarte | vergessen | M9 | `Dashboard.jsx:329`, `de.js:1631` | Text an «Bereit für den Ernstfall» angleichen |
| D4 | Dashboard, Zeile Versicherungen | «Franchise 1’500» ohne CHF, Prämie ohne «/Mt.» | Detail | M4/M6 | `Dashboard.jsx:83-84`, `de.js:1849` | «Franchise CHF {value}», Monatsangabe |
| D5 | Dashboard | zwei gleich laute Sand-Karten, Regel sagt «eine Primär-Aktion» | Gestalt | M2 | `Dashboard.jsx:557-561, 589-590` | prüfen, mit Menü-Entscheid klären |
| D6 | Kapitel, Reiter Angaben/Dokumente | keine Reiter-Semantik, `'#000'` fest, Tippziel wohl < 44 px | Detail | M4/M7 | `ChapterView.jsx:2385-2411` | `aria-selected`, Palette, `minHeight: 44px` |
| D7 | Kapitel, Reiter Dokumente | Titel mit Kästchen-Zeichen | Detail | M5 | `ChapterView.jsx:2568` | neutrales Zeichen oder keines |
| D8 | Kapitel, Reiter Dokumente | Upload-Datum fest `de-CH`, Knopf `'#fff'` | Detail | M9/M4 | `ChapterView.jsx:2530, 2556` | in App-Sprache anzeigen, Token |
| D9 | Kapitel Behörden, Kalenderblatt | «in 1 Tagen»; `new Date(iso)` liest UTC | Detail | M6 | `BehoerdenInstrument.jsx:48-54`, `de.js:2397, 2400` | Einzahl-Schlüssel, lokal lesen wie `:76` |
| D10 | Kapitel Finanzen, Druckblatt | Druckdatum fest `de-CH` | Detail | M9 | `FinanzAuswertung.jsx:230` | `lang` übergeben |
| D11 | Kapitel Finanzen, Lohn-Check | Stundenlohn per `toFixed(2)` | Detail | M6 | `ChapterView.jsx:1386, 1406, 1663-1664` | betrag()/zahl() |
| D12 | Versicherungs-Übersicht, Vergleich | «Franchise 1500» roh, Beträge per `toFixed` | Fehler | M6 | `PraemienOrientierung.jsx:465, 480, 483, 487`, `de.js:6161` | `zahl()` wie in `:190`, betrag() |
| D13 | Versicherungs-Übersicht, Kassen/Gemeinden | Tippziele 0–6 px Polster | Detail | M7 | `PraemienOrientierung.jsx:159, 169, 170` | prüfen live, `minHeight: 44px` |

### Nachtrag beim Bauen (26.10.2026)

| # | Seite | Befund | Klasse | Beleg | Vorschlag |
|---|---|---|---|---|---|
| D14 | Notfall-Dossier, Notfallkarte, Rucksack, Kapitel-Satz | Lesen nur das alte Feld `notfall.doctor`. Wer den Hausarzt über die Liste im Kapitel einträgt (`doctorsList`, DoctorManager), fehlt dort | Fehler | `dossierGenerator.js:171, 473`, `MirrorCards.jsx:257`, `data/gepaeck.js:113`, `components/NotfallImKapitel.jsx:30`; Druck der Portemonnaie-Karte liest beide (`ChapterView.jsx:1187-1196`) | eine Lesestelle «Hausarzt» (Liste vor altem Feld), überall verwenden; eigener Zweig |
| D15 | Versicherungs-Übersicht | «Durchschnittsprämie 2026», obwohl die Prämien 2027 seit 29.09. veröffentlicht sind und der Kassenvergleich in der Wechselzeit schon 2027 nimmt (#597) | prüfen | `PraemienOrientierung.jsx:426` (Stichtag heute) | entscheiden, ob der Durchschnitt in der Wechselzeit auch das Folgejahr zeigt |

Behoben auf `fix/fehlerklassen-dashboard-kapitel` (#612): D1, D2, D12, K-F3, K-F4, K-F6, K-F8.
Behoben auf `fix/hausarzt-aus-liste` (#613): D14, dazu die Vollständigkeit, die die Liste unter `doctorList` suchte. Offen als Produktentscheid: Fachärzte in Dossier/QR («weitere Ärzte»)?

---

## Sprachen, Fehlerklassen, Hygiene (geprüft 26.10.2026, qualitaets-pruefer, Code auf main `99ab58e4`)

Bereits behoben in #612: `PraemienOrientierung.jsx` toFixed, `Dashboard.jsx:319` und `ChapterView.jsx:1156` (Datum in Browsersprache).

| # | Befund | Klasse | Beleg | Vorschlag |
|---|---|---|---|---|
| S1 | drei Schlüssel fehlen in de (und allen Sprachen), harter Rückfall: `budgetImport.importFailed` («Import fehlgeschlagen»), `calendar.nicelyDone` («Erledigt»), `common.clear` («Clear», englisch, im aria-label) | Fehler | `BudgetImport.jsx:33`, `CalendarReminders.jsx:256`, `MobileNav.jsx:321` | Schlüssel in 5 Sprachen, Rückfälle weg |
| S2 | Datum per `toISOString().split('T')[0]` = UTC, nachts der Vortag | Fehler | `CalendarReminders.jsx:48, 140`, `utils/docReminders.js:63` | lokaler Datumshelfer (`zuerichTag.js`) |
| S3 | Datum in Gerätesprache bzw. ohne Locale | Detail | `components/DatenLoeschen.jsx:49`, `premiumCalc.js:29` | `utils/datumAnzeige.js` (aus #612) |
| S4 | Datum fest `de-CH` in fr/it/en | Detail | `zipExport.js:69`, `ZipExport.jsx:261`, `cvGenerator.js:157`, `ChapterView.jsx:2530`, `FinanzAuswertung.jsx:230`, `helpers.js:7` (CSV-Import/Export darf fest bleiben) | App-Sprache, wo angezeigt |
| S5 | Franken per `toFixed` ohne ’ | Detail | `config/cantonalData.js:376` (Sozialhilfe-Defizit, kann > 1000), `PflegeEntloehnung.jsx:71`, Stundenlöhne `briefGenerator.js:614-615`, `LohnEinordnung.jsx:289` | `zahl()` |
| S6 | Einheit «Hübe» und «Anrede: » ohne t() | Detail | `MedicationManager.jsx:235`, `main.jsx:1092` | in i18n |
| S7 | fr/rm: Schlüssel `dashboard.detailProgress` ohne Nutzer; rm 125 Schlüssel, die in de fehlen | Hygiene | `fr.js:1906`, `rm.js:2058` | aufräumen |
| S8 | `orientationRegistry.js` ohne Importeur, zwei Docs nennen ihn aktiv | Doku-Drift | `docs/AUDIT-VOLL-2026-10.md:168` (O2) | Entscheid: anbinden oder löschen |
| S9 | 38 Exporte ohne jeden Nutzer (z. B. `autoBackup.listBackups`, `validationUtils.*`) | Hygiene | s. Prüferbericht | prüfen, löschen |
| S10 | **Startbündel 64.53 / 65 kB** auf main (nach #609), 0.47 kB Reserve | Risiko | `package.json` size-limit | Kandidaten zum Auslagern: IconSystem (12.6 kB), MobileNav, BetaGate |
| S11 | Fehlerschirm englisch («Your data is safe…»), wohl bewusst (ohne Sprachdatei) | prüfen | `ErrorBoundary.jsx:128, 168` | Entscheid festhalten |

---

## Werkzeuge und Rechner (geprüft 26.10.2026, Code-Lesung, Stand `2ad97fe0`)

Erledigt seit 27.09.: W1, W8, N1, R1, IPV-Entscheide, 3a-Feld am Höchstbetrag, ALV «Kinder über 25». Jahreswechsel ohne Befund: AHV, ALV, EO, Lohnabzüge, Hilflosenentschädigung (über `data/jahrestabelle.js`), Mindestlohn (eigener Wächter).

### Abgleich: offen oder teilweise

| ID | Status | Beleg |
|---|---|---|
| **X Rechner-Form für alle (Runde 8)** | **offen, nirgends gebaut** (auch nicht ALV) | `AlvRechner.jsx:58-130` |
| **J Steuern: Ergebnis zuerst** | offen | `TaxCalculator.jsx:209` vs. `:312` |
| J «Max»-Grenzen nur mit Gesetzesgrundlage | offen | `TaxCalculator.jsx:86-89` (50’000 / 50’000 / 10’000 / 10’000) |
| J `key: datenModus` am Steuerrechner | offen; Folge (Beispieldaten im echten Profil?) **prüfen** | `main.jsx:1682` (Schulden `:1676` hat ihn) |
| W2 Zeichen aus `ansichtIkon` | teilweise (9 ja, 16 fest, Schulden ohne) | `TaxCalculator.jsx:200`, `SchuldenManager.jsx:271` |
| W3 Hauptknopf | teilweise (7 Werkzeuge; kein Rechner) | – |
| W4 Sackgassen | teilweise; offen: budget, organ, sync, flyer, eo, cv, direktlinks, kreditkarte, stundenlohn | `main.jsx:1664–1749` |
| W5 Geld über `betrag()` | teilweise (’ stimmt, Form uneinheitlich) | `EOrechner.jsx:50-74`, `VorsorgeRechner.jsx:562…` |
| W6 `'#fff'` / `'#000'` | offen (15 Dateien) | `CalendarReminders.jsx:278…`, `KVGLeistungen.jsx:56-59` |
| W7 Kalender-Knöpfe ~28 px, Löschen laut rot | offen | `CalendarReminders.jsx:276-289`; Tresor-Rest `DocumentTresor.jsx:325` |
| S2 IPV-Grenze «CHF 64000» ohne ’ | teilweise (nur Genf über `zahl()`) | `ipvBern.js:255`, `ipvZuerich.js:286`, `ipvFreiburg.js:275`, `cantonalData.js:463`, `FinanzAuswertung.jsx:446` |
| S3 Steuer «Total (-) – CHF» | offen | `TaxCalculator.jsx:319-320, 340` |
| ALV-Name einheitlich | teilweise | `de.js:1439` «ALV-Taggeld», `de.js:147` |

### Neue Befunde

| # | Werkzeug | Befund | Klasse | Beleg | Vorschlag |
|---|---|---|---|---|---|
| W9 | **Sozialhilfe** | SKOS-Grundbedarf 1061 als feste Konstante ohne Jahrestabelle; ab 1.1.2027 still Stand 2026, als «Stand 1.1.2026» beschriftet. Wert 2027: **prüfen** | Fach | `data/sozialhilfeRechner.js:1-16`, `config/cantonalData.js:282-290` | über `werteFuerStichtag` wie AHV/ALV; Wert 2027 belegen |
| W10 | **Kalender** | «monatlich» = alle 30 Tage, «jährlich» = alle 365 Tage; Termine wandern | Fehler | `CalendarReminders.jsx:32-40, 47-48, 137-140` | nach Kalendermonat/-jahr fortschreiben |
| W11 | Steuern | Abzug mit `'- ' + betrag()` statt echtem Minus | Detail | `TaxCalculator.jsx:320, 340` | `betrag(-x)` oder «Abzüge» ohne Vorzeichen |
| W12 | KVG-Leistungen | Taxpunkt «= CHF {betrag}» roh | Detail | `de.js:5912`, `KVGLeistungen.jsx:584` | `zahl()` |
| W13 | EO | kein Weg zur Ausgleichskasse/Antrag, Seite endet nach der Quelle | vergessen | `EOrechner.jsx`, `main.jsx:1749` | Schritt «Offizielle Stelle & Antrag» |
| W14 | Kreditkarte, Stundenlohn | kein `onNavigate`, kein nächster Schritt | vergessen | `main.jsx:1699-1700` | Weg zu Schulden bzw. Lohn |
| W15 | Register | «Charts», «Finanz-Übersicht», «Unterlagen» stehen als eigene Werkzeuge, sind aber Umleitungen. **prüfen** in der Oberfläche | Gestalt | `werkzeugRegister.js:42, 73, 77`, `hashRouter.js:51-55` | als Suchwort des Ziels führen |

---

## Notfall, Anker, Datenseiten, Rahmen (geprüft 26.10.2026, Code-Lesung, Stand `2ad97fe0`)

Erledigt: R1, R5 Tour, R7 (Auge prüfen), Dokumentenablage, Merkliste, Menü, Eingang, P (Notfall-Einstieg entfällt).

**Wichtig zu S1:** `t()` gibt bei fehlendem Schlüssel den **Schlüssel selbst** zurück (`i18n/index.js`), die Rückfälle `t('x') || 'Text'` greifen nie. Im Kalender steht nach dem Abhaken wörtlich «calendar.nicelyDone», das Menü liest «common.clear» vor. Weitere solche Rückfälle: `MobileNav.jsx:61, 254, 317`, `LanguageManager.jsx:56`.

### Entschieden, nicht (ganz) gebaut

| ID | Status | Beleg |
|---|---|---|
| **N Suche** | offen (keine Bereichs-Kacheln, keine Gruppe Lebensereignisse; nicht auffindbar: «Was steht mir zu?», Rucksack, Obstgarten, Rechtliches, Dossiers) | `SearchView.jsx:51-75`, `werkzeugRegister.js:80` |
| **O «Was steht mir zu?» als eine Seite** | offen (`#/schnellcheck`, `#/ansprueche` leiten nicht um) | `main.jsx:1753`, `hashRouter.js:50-57` |
| **K Budget in der Finanz-Übersicht** | offen (`#/sync` lebt weiter) | `main.jsx:1695`, `werkzeugRegister.js:36` |
| **Q Notfallkarte: 56-px-Nummernknöpfe in zwei Spalten**, Schwesterseiten-Zeile auf Q/R/S | offen | `NotfallVorlesekarte.jsx:63-67` |
| I Einstellungen (Schublade und Seite eins, Knopf zeigt Zustand, keine Versalien, «Rundgang neu starten») | offen | `main.jsx:1284-1288`, `ThemeToggle.jsx:30`, `Heading.jsx:47` |
| M Pillen-Seite (Geschenk-Symbol, goldene Auswahl, Bereichssymbol) | teilweise | `Lebenssituationen.jsx:111-195` |
| L Rucksack «Wieder einpacken» als ruhiger Rahmen-Knopf | teilweise (goldene Pille, ~30 px) | `Gepaeck.jsx:141-148` |
| R Notfallpass (Versalien, Anleitungen zuklappen, Kopieren 36 px) | teilweise | `NotfallpassBlatt.jsx:46, 56, 114-127` |
| S/U/V Kopf ohne Karte; V zwei gleich laute Knöpfe | teilweise/offen | `NotfallDossier.jsx:120-139`, `Lebensmappe.jsx:82`, `BehoerdenDossier.jsx:140-170` |
| T Meine Unterlagen (zwei Gruppen, ohne «… öffnen») | teilweise | `UnterlagenWege.jsx:42-53` |
| R2/R3/R6/R8/S4 Rahmen-Altbefunde | offen | s. Prüferbericht: `NotificationSettings.jsx:72`, `LegalView.jsx:114-121`, Dossier-Leerzustände, zwei Suchen, `SettingsView.jsx:61` |
| Druck-HTML `lang` fest «de» | teilweise | `dossierGenerator.js:247, 581, 1092` |

### Neue Befunde

| # | Seite | Befund | Klasse | Beleg | Vorschlag |
|---|---|---|---|---|---|
| R9 | **Notfallkarte** | Notruf-Links und Standort-Knopf ~30 px, im Ernstfall | Fehler | `NotfallVorlesekarte.jsx:63-67, 79-83` | 44 px (Q: 56 px) |
| R10 | Kopfzeile | aria-label «Anrede: Sie» fest deutsch | vergessen | `main.jsx:1088, 1092` | t() |
| R11 | Benachrichtigungen | aria ' on'/' off' englisch | Fehler | `NotificationSettings.jsx:72` | t() |
| R12 | Tippziele < 44 px | Einstellungs-Schublade schliessen 24 px, Merkliste 32 px, Ablage-Filter 36 px, Kalender 32 px, Notfallpass Kopieren 36 px, Arztkoffer/Rechtliches Zurück ~31 px | Detail | `MobileNav.jsx:61`, `MerklisteView.jsx:112`, `DocumentTresor.jsx:325`, `CalendarReminders.jsx:392, 502`, `NotfallpassBlatt.jsx:56`, `ArztkofferView.jsx:150-156`, `LegalView.jsx:114-121` | 44 px |
| R13 | Was steht mir zu? | rohes `h1`, Zeichen «health» statt Geschenk | Gestalt | `Lebenssituationen.jsx:111-113`, `werkzeugRegister.js:80` | `PageTitle`, ein Zeichen |
| R14 | Suche, Kalender | ganze Seite in einer Karte, Versalien | Gestalt | `SearchView.jsx:28, 33`, `CalendarReminders.jsx:395` | mit N bzw. Kalender-Umbau |
| R15 | Einstellungen | «Persönliche Basis bearbeiten» per `setView` statt `handleNavigate` | prüfen | `main.jsx:1782` | `handleNavigate('chapter', 0)` |

---

## Werte 2027 (geprüft 26.10.2026, swiss-precision-pruefer)

Volle Tabelle: [`WERTE-2027-STAND-2026-10.md`](WERTE-2027-STAND-2026-10.md). Bundeswerte (AHV, BVG-Grenzbeträge, 3a, Lohnabzüge, EO, ALV-Höchstverdienst, Hilflosenentschädigung, BAG-Prämien) schalten am 1.1.2027 selbst um.

Dringend bis 31.12.2026: **SKOS-Grundbedarf** ohne Jahrestabelle (still 2026, = W9) · **BVG-Mindestzins** 2027 · **ALV-Schwelle 3’797** zeigt «2027» ohne Beleg · **Mindestlöhne**: Tabelle je Jahr vor dem Nachtrag, sonst sperrt ein Eintrag 2027 sofort 2026 · IPV-Kantone 2027 und kleinere Werte auf die Dezember-Liste · Kapitalbezugssteuer mit nicht amtlicher Quelle (finpension).

### Zu entscheiden (Stebler Studios)

1. **Spinnennetz im Kapitel Versicherungen:** weg, weil M2 dasselbe leistet? (AA-6)
2. **Arbeitgeber doppelt** in Finanzen und Ausbildung: so lassen oder mit Verweis-Knopf wie bei der Adresse? (K-G8)
3. **Zwei Sand-Karten auf dem Dashboard:** eine davon leiser? (D5)

Die Fehler D1, D2, D12 und die offenen K-F3, K-F4, K-F6, K-F8 brauchen keinen Produktentscheid. Sie können in einem Zweig «Fehlerklassen Dashboard/Kapitel» gebaut werden.
