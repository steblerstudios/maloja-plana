# Seitenrundgang 2026-10 · Befundliste

Grundlage ist main `99ab58e4` vom 26.10.2026, dazu `docs/design/mockups-stardust-2026-10-23/VERGLEICH.md` und die Befunde vom 27.09.2026 (`_maloja-archiv/arbeitspapiere-2026-09/seitenrundgang-befunde-2026-09-27.md`, ausserhalb des Repos). Die Messlatte M1–M9 steht dort.

Geprüft wurde nur der Code, nicht im Browser. Was nur live zu bestätigen ist, steht als «prüfen». Bis Stebler Studios entscheidet, ist nichts gebaut.

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

Behoben auf `fix/fehlerklassen-dashboard-kapitel`: D1, D2, D12, K-F3, K-F4, K-F6, K-F8.

### Zu entscheiden (Stebler Studios)

1. **Spinnennetz im Kapitel Versicherungen:** weg, weil M2 dasselbe leistet? (AA-6)
2. **Arbeitgeber doppelt** in Finanzen und Ausbildung: so lassen oder mit Verweis-Knopf wie bei der Adresse? (K-G8)
3. **Zwei Sand-Karten auf dem Dashboard:** eine davon leiser? (D5)

Die Fehler D1, D2, D12 und die offenen K-F3, K-F4, K-F6, K-F8 brauchen keinen Produktentscheid. Sie können in einem Zweig «Fehlerklassen Dashboard/Kapitel» gebaut werden.
