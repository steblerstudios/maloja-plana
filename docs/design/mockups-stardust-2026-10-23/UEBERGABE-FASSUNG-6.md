# Übergabe · Fassung 5 → Fassung 6 · 24.10.2026

Fassung 5 (`seiten-v5.html`) ist **durchgegangen**: alle Runden 1–9 sind entschieden und in
`VERGLEICH.md` festgehalten. Die nächste Sitzung beginnt **Fassung 6**: die ersten Dinge fixen und umsetzen.

**Stand:** Branch `docs/mockups-stardust` im Werkbank-Ordner `_werkbank/mockups-stardust`, alles lokal
committet, **nicht gepusht**. HEAD frisch messen:
`git log -1 --format="%h %ad %s" --date=format:"%Y-%m-%d %H:%M"`.

## Was entschieden ist (Quelle: `VERGLEICH.md`, Abschnitte in dieser Reihenfolge)

| Runde | Inhalt | Entwürfe in `seiten-v5.html?nur=…` |
|---|---|---|
| Nachtrag 23.10. | Umzug, Ablage, Merkliste, Kalender, Menü, Rechner IPV, Kapitel Finanzen | (siehe VERGLEICH.md) |
| Eingang | durchgegangen, entschieden | — |
| 2 | Einstellungen, Steuern, Finanz-Übersicht | I, J, K |
| 3 | Rucksack, Was steht mir zu?, Suche | L, M, N |
| 4 | «Was steht mir zu?» als eine Seite | O |
| 5 | Notfall: vier Seiten | P (entfällt, siehe AE), Q, R, S |
| 6 | Datenseiten | K, T, U, V |
| 7 | Abläufe: eine Schale | W |
| 8 | Rechner: eine Form | X |
| 9 | Kapitel einzeln: Basis, Wohnen, Versicherungen (+ Versicherungs-Übersicht), Ausbildung, Behörden, Notfall | Y, Z, AA, AB, AC, AD, AE |

**Wichtigster Entscheid vom 24.10.:** Das Kapitel Notfall ist **der eine Notfall-Ort**, P
(`#/notfalleinstieg`) fällt weg. Das ersetzt den Punkt aus Runde 5 «Kapitel bleibt der Ort zum Eintragen».

**Muster über alle Kapitel (Runde 9):** Kopf links · Zusammenfassung als ruhiger Satz statt grüner Kasten ·
oben ein Instrument mit Wert (Barometer, Vorschau, Frist) · Angaben als Liste · «Passend zu diesem Bereich» ·
«Als Nächstes» · Feinschliff `.kap-zus` / `.kap-h` / Tausender-Zeichen «’».

## Noch offen: Entscheide (Sophie)

- **Name der Karte zum Drucken** im Kapitel Notfall: zwei Dinge heissen «Notfallkarte» (Vorlesekarte Q und
  Druckkarte für die Brieftasche).
- **Übersicht:** 63 % gegen 70 %, Kartentitel (Befunde 23.10., «noch nicht entschieden»).
- **Kapitel Finanzen:** Reiter «Dokumente» (heute Formular, Fassung 5 nur Leer-Satz).
- **Budget/Datenmodell:** Gehören erfasste Prämien (Hausrat, Haftpflicht) ins Budget? Haftpflicht hat kein
  Prämienfeld. Erfassten PK-Beitrag statt Schätzung nach Alter verwenden?
- **ALV:** ein Name — «Arbeitslosenentschädigung» oder «ALV-Taggeld».
- **Kapitel Finanzen · Geldfluss (Sankey) — nochmals besprechen** (Sophie 24.10.2026 abends: «schon besser,
  aber irgendwie finde ich den Geldfluss dort komisch … für die Runde 6 bei den Seiten nochmals drüber
  reden»). Stand: am Anfang der Auswertung, nach dem Lebensbaum, vor «Wo steht Ihr Lohn?»; nur mit
  Einkommen. Gebaut auf `feat/charts-geldfluss` (Commit `e620588a`, lokal, nicht gepusht), vorher kurz
  auf der Charts-Seite (dort «der Ort ist falsch»). Zu klären: anderer Ort, andere Darstellung oder
  weglassen? Dazu gleich mitentscheiden: die Charts-Seite zeigt wieder das Kuchendiagramm — behalten oder
  streichen, seit die Finanz-Auswertung im Kapitel steht?

## Fix-Liste für den Bau (Befunde aus VERGLEICH.md, App heute)

**Vor allem anderen:** eine Monatsrechnung für Übersicht, Kapitel und Finanz-Übersicht
(`utils/monatsrechnung.js` gegen `haushaltsEinnahmen`, 🔴 1 im Gesamtbericht). Wohnen und Finanzen hängen daran.

Kleine Fixes, unabhängig voneinander:
1. **Wertspalte bricht mitten im Wort** («Kantonsspita / l Zürich», Steuernummer, Telefonnummern):
   `overflowWrap: anywhere` in `ChapterView.jsx:1860`, alle Kapitel.
2. **Untertitel «Bundessteuer berechnen»** (`nav.sub.taxes`, 5 Sprachen) ist veraltet, die Seite rechnet
   Bund, Kanton und Gemeinde.
3. **Suche findet nicht alles** (`WEITERE_NAMEN` in `config/ansichtenRegister.js`: Mietzins, Notfallkarte,
   Briefe, Rucksack …).
4. **«Notfallkarte drucken»** sieht wie ein Kästchen zum Abhaken aus (`hinweisZeichen('kaestchen')`,
   `ChapterView.jsx:1869`).
5. **Rucksack:** «Wieder einpacken» ist doppelt ein Knopf.
6. **ALV-Rechner:** «Kinder: ja» auch für Kinder über 25 vorbelegt (`AlvRechner.jsx:22,30`).
7. **Behörden-Dossier:** «Mögliche Unterstützung /Mt.» ohne Betrag, wenn kein Anspruch besteht.
8. **Notfall-Dossier:** «Der QR-Code liess sich nicht erzeugen.» im Beispiel (Ursache offen).

**Beispielprofil Maria (`config/demoData.js`):** Steuerfrist 30.09.2026 liegt in der Vergangenheit
(Frist im Kanton nur mit Quelle setzen, Swiss-Precision-Prüfer) · KK-Prämie 385 liegt unter jeder
Referenzprämie · Haftpflicht `liabilityAmount: '35'` ergibt keinen Sinn.

**Copy-Prüfer und fünf Sprachen:** Jeder Entscheid in VERGLEICH.md hat eine Zeile «Copy-Prüfer» mit den
neuen Texten. Neue Texte erst nach Prüfung in `de.js` und die anderen vier Sprachen.

### Stand 24.10.2026 abends: Fixes 1–8 gebaut

Zweig `fix/f6-kleine-fixes` (Worktree `_werkbank/f6-kleine-fixes`, ab `origin/main` 32284107), lokal
committet, **nicht gepusht**. Ein Commit je Fix, 6'717 Tests grün, Build sauber, im Browser geprüft (375 px):
1 `4e3564e8` Wertspalte · 2 `aed395b7` Untertitel Steuern (Wortlaut aus `taxFromBehoerdenHint`, 5 Sprachen) ·
3 war schon in `main` (`2fae91da`) · 4 `3ed6dd41` Druck-Knopf · 5 `4405e72a` Rucksack · 6 `001d9c62` ALV
unter 25 (AVIG Art. 22 Abs. 2 Bst. a) · 7 `778c9f05` Dossier-Zeilen ohne Betrag (auch IPV/Steuern; Steuer zeigt
«CHF 0», E38) · 8 `89946752` **Ursache: qrcodejs warf auf Android «aMat is not defined»** — der Notfall-QR
fehlte auf jedem Android-Telefon, nicht nur im Beispiel.
Offene Entscheide sind seit `b5215193` entschieden (VERGLEICH.md, letzter Abschnitt). Noch nicht gebaut: neue
Namen (Portemonnaie-Karte, Arbeitslosenentschädigung) — erst nach Copy-Prüfer, dann 5 Sprachen.

**Monatsrechnung gebaut** (24.10.2026, 21:03): Zweig `feat/f6-monatsrechnung`, Entwurfs-PR #564. Entscheid
«nur Partner/in trennt» (`maloja-frontend/docs/entscheide/finanzen-fusion.md` §10): eine Rechnung in
`utils/monatsrechnung.js`, Maria jetzt 2’459 in Kapitel und Budget. Fachprüfung ohne Blocker. Fixes 1–8: PR #562.
**Als Nächstes:** Kapitel-Muster aus Runde 9 im Code (`ChapterView.jsx`), Kapitel für Kapitel.

**Kapitel-Muster, Schritt 1 gebaut** (24.10.2026, 21:39): Zweig `feat/f6-kapitel-muster`, Entwurfs-PR #565
(Basis #564). Ruhige Zusammenfassung, «Passend» und «Als Nächstes» in allen 7 Kapiteln, Notfall endet mit «Alle
Kapitel durchgegangen», Basis «Im Haushalt». Copy-Prüfer eingearbeitet.
**Offen, zu entscheiden:** Runde 9 AB («Versicherungs-Übersicht» als eigene Seite) widerspricht
`maloja-frontend/docs/entscheide/seiten-buendeln.md` Entscheid 3 (`praemien` + `kvg` ins Kapitel Versicherungen).
**Als Nächstes:** Instrumente je Kapitel, eins nach dem anderen — Wohnen (Drittel, Barometer, Regler) zuerst,
eine Sitzung je Kapitel.

**Finanzen: Balken, Kuchen, Sankey gebaut** (24.10.2026, 21:57): Zweig `feat/f6-finanzen-grafiken`, Entwurfs-PR
#566 (Basis #565). Entscheid in VERGLEICH.md «nachentschieden». **Steuern aufteilen** ist entschieden, aber die
Querverweise Finanzen ↔ Behörden sind noch nicht gebaut (gehört zum Kapitel Behörden, Runde 9 AD).
**Kapitel Wohnen** läuft in eigener Sitzung (Zweig von #565).

**Kapitel Wohnen: Instrumente gebaut** (24.10.2026, 22:16): Zweig `feat/f6-wohnen-instrumente` (Worktree
`_werkbank/f6-wohnen`), Entwurfs-PR #567 (Basis #565), Spitze `72d1afff`. Neues Bauteil
`components/WohnkostenInstrument.jsx` ersetzt Kasten «Wohnkosten / Einkommen / Anteil» **und** im Kapitel den
MietVergleich: Wohnkosten pro Monat, Drittel-Marke (Faustregel, nie Vorschrift), Barometer «Miete regional vs.
Schweiz», Regler 800–3’500 «Ausprobieren: andere Miete» (nur `useState`, Profil unverändert). Einkommen und «Frei
verfügbar» aus `monatsrechnung.js`; brutto → Netto-Frage. Fachprüfung eingearbeitet: Partner/in («eigenes
Einkommen»), «teils brutto», Eigentum mit Hypothek (zählt mit, kein Regler), «Es fehlen danach». 6’755 Tests grün,
Build sauber, Browser 375 px (Maria 1’830 · 29.5 % · frei 2’459; Regler 2’400 → frei 1’709).
**Offen aus der Fachprüfung (nicht gebaut):** `mietzinsView.rentShareGuide` «viele Vermieter verlangen das sogar»
unbelegt (steht noch im MietVergleich auf Mietzins-Seite/Finanz-Übersicht) · Feld «Monatsmiete» mehrdeutig →
«Nettomiete (ohne Nebenkosten)» · `data/mietpreise.js` Quelle «Mietpreiserhebung» vs. «Strukturerhebung», Stand
2020 beim BFS prüfen · Barometer-Legende bricht bei 375 px um. **Als Nächstes:** Kapitel Versicherungen (AA).

## Stand 24.10.2026, 23:20 — gemergt auf Sophies Zuruf («merge mal was du kannst»)

**In `main`** (`c9d96a50`, 23:15): #562 Fixes 1–8 · #564 eine Monatsrechnung · #565 Kapitel-Muster ·
#566 Finanzen-Grafiken (Balken, Kuchen, Sankey). Vor jedem Merge: Tests + Build lokal grün; CI auf `main`
für #564/#565 grün, für #566 lief sie noch. Ein Konflikt (`ChapterView.jsx`, Wertspalte: Fix 1 gegen
«Im Haushalt») von Hand gelöst — beides übernommen. **Nicht deployt. Gemergt ist nicht live.**

**Nicht gemergt: #567 Kapitel Wohnen** — die Sitzung «Maloja Fassung 6: Kapitel Wohnen» arbeitete um 23:15
noch daran (ungestagete Änderungen an `mietpreise.js`, `RegionalBarometer.jsx`, i18n). Sie wurde gebeten,
`main` hineinzuholen, zu prüfen, zu pushen und #567 auf `main` umzustellen — mergen nur auf Zuruf.

**Offen, zu entscheiden (Sophie):**
1. Versicherungen: «Versicherungs-Übersicht» als eigene Seite (Runde 9 AB) **oder** `praemien` + `kvg` ins
   Kapitel (`maloja-frontend/docs/entscheide/seiten-buendeln.md`, Entscheid 3) — vor dem Kapitel Versicherungen.
2. Wortlaut «1 Erwachsene» (Basis, «Im Haushalt») — holprig, aus dem Entwurf übernommen.
3. Copy-Prüfer für die neuen Namen «Portemonnaie-Karte» und «Arbeitslosenentschädigung» (entschieden, nicht gebaut).

**Offen, zu bauen (je eigene Sitzung):** Kapitel Versicherungen (KK-Last, Schutzschild, Franchise-Kreuz) ·
Ausbildung (Lohn-Barometer, Lebenslauf-Vorschau) · Behörden (Frist als Kalenderblatt, Behördengänge, Querverweis
Steuern ↔ Finanzen) · Notfall (Ernstfall-Knopf, «19 von 20»). Dazu: Hausrat-/Haftpflichtprämie ins Budget
(Haftpflicht-Prämienfeld fehlt) · Beispielprofil Maria (Steuerfrist, KK-Prämie, `liabilityAmount`).
**Fachbefunde, schon vorher so:** Quellensteuer/Familienzulagen können doppelt zählen, Miete+Hypothek ohne Prüfung,
Säule 3a ohne Plausibilität (`finanzen-fusion.md` §10) · Mietpunkte aus #567 (unbelegter Satz, «Monatsmiete» mehrdeutig,
Mietpreise Stand 2020, Barometer-Legende bricht um) · rm-Texte brauchen eine Fachperson.

## Stand 25.10.2026, 00:25 — #567 Kapitel Wohnen: `main` drin, Mietpunkte nachgezogen

#567 hat `main` drin (Merge `024f55be`), Basis auf **`main`** umgestellt, weiter **Entwurf, nicht gemergt**. Spitze
`cecf22d2`, gepusht. 6’760 Tests grün, Build sauber, Browser 375 px ohne Konsolenfehler. Nachgezogen (Sophie: «magst
du das noch machen?»): unbelegter Vermieter-Satz weg (`rentShareGuide`, 5 Sprachen) · Feld heisst «Nettomiete
CHF/Monat (ohne Nebenkosten)» (Abdruck `kapitelAbdruck.txt` erneuert, nur diese Zeile) · Quellenzeile
«Mietpreis-Strukturerhebung» wie beim BFS (je-d-09.03.03.01) · Barometer-Legende bricht nicht mehr in sich um.
**Noch offen: Mietpreis-Werte 2024.** Das BFS hat am 05.03.2026 die Ausgabe 2010–2024 veröffentlicht (asset
36398431); die App zeigt Werte 2020. Nachziehen heisst XLSX laden und alle Kantonswerte neu übertragen —
eigener Schritt, auf Zuruf. Hinweis für Worktrees: zeigt die App beim Start «Etwas ist schiefgelaufen» mit
«Invalid hook call», ist der Vite-Cache alt (`node_modules/.vite` wegräumen, neu starten).

**Nachtrag 25.10.2026, 01:00 — Mietpreise 2024 nachgezogen** (Sophie: «Ja, lade die BFS-Tabelle …»): #567
Spitze `5933c91d`, gepusht, weiter Entwurf. Werte aus BFS je-d-09.03.03.01, Blatt «2024» (Gegenprobe Blatt «2020»
= bisherige Werte, 0 Abweichungen; Swiss-Precision las «2024» unabhängig nach, identisch). Neu: 26 BFS-Zellen
«weniger als 50 Beobachtungen» (`RENT_LOW_N`, Kennzeichen steht nur im Zahlenformat — beim nächsten Nachzug
Werte **und** Zahlenformate lesen) mit Hinweis im Barometer; Barometer nennt die Vergleichsgrösse und ob sie
angenommen ist. Maria ZH 3 Zi.: 1’732 / 1’446 (vorher 1’538 / 1’327). 6’771 Tests grün, Build sauber, Browser 375 px.
Offen («kann»): Quellenzeile «bestehende Mietverhältnisse inkl. Genossenschaften, keine Angebotsmieten».

**Nachtrag 25.10.2026, 10:26 — #567 gemergt** (Sophie: «merge was geht»): vorher `main` (#566, #570) hineingeholt,
ohne Konflikt; 6’780 Tests grün, Build sauber, CI grün; Squash-Merge `97c476f3` auf `main`. **Nicht deployt —
gemergt ist nicht live.** Andere offene Entwurfs-PRs (#561, #563, #568, #569) gehören anderen Sitzungen, nicht angefasst.

## Vorschlag für den Einstieg in Fassung 6

Sophie wählt. Zwei sinnvolle Wege:
- **Klein anfangen:** Fixes 1–8 oben, je ein eigener Commit, in `maloja-frontend` auf einem Arbeitszweig.
  Sichtbar, wenig Risiko.
- **Gross anfangen:** die eine Monatsrechnung, dann das Kapitel-Muster aus Runde 9 im Code
  (`ChapterView.jsx`), Kapitel für Kapitel.

Gebaut wird in `maloja plana/maloja-frontend` (bzw. eigener Werkbank-Worktree), **nicht** in diesem
Mockup-Ordner. Push nur nach Regel in `~/Claude/Projects/CLAUDE.md` (Maloja: Arbeitszweige und
Entwurfs-PRs erlaubt bis 31.12.2026, mergen und deployen nur Sophie).

## Wie hier gearbeitet wurde (für die nächste Sitzung)

- **Bild von heute:** App im Beispiel («Ohne Code ausprobieren»), Ansicht 375 px breit und so hoch wie die
  Seite, Screenshot, mit `sips --resampleHeight 1500` als `heute-*.jpg` gespeichert. Kapitel:
  `#/chapter/0` … `#/chapter/6` (Basis … Notfall). Die App lief auf Port 5480 aus dem Worktree
  `gesamtbericht-2026-10`.
- **Entwurf ansehen:** `python3 -m http.server 5490` im Mockup-Ordner, dann
  `seiten-v5.html?nur=<id>` und `vergleich-v5.html#<id>`.
- **Sitzungen kurz halten:** Die Sitzung «Maloja Seiten durchgehen» hatte über 3'000 Nachrichten und lief
  voll. Eine Sitzung je zwei bis drei Seiten; alles Entschiedene steht in VERGLEICH.md.

## Stand 25.10.2026 abends — Abnahme Fassung 6 (Sitzung «Maloja Plana Fassung 6: Seite für Seite»)

Sophie: «wir wollen maloja plana seite für seite durchgehen … wieder mit vergleich und allem». Gemacht: die **gebaute App
(main `97c476f3`) Seite für Seite gegen die Entwürfe aus Fassung 5** abgeglichen (Beispiel Maria, 375 px; App auf Port 5495
aus Worktree `_werkbank/abnahme-f6`, Entwürfe auf Port 5490), Befunde je Kapitel in `VERGLEICH.md` → Abschnitt **«Abnahme
Fassung 6»**, Entscheide dort direkt darunter. Danach auf Zuruf gebaut, je Kapitel ein Zweig + Entwurfs-PR, je mit
Fachprüfung (swiss-precision, copy, bei Instrumenten a11y — überall 0 Blocker, Muss eingearbeitet).

**main frisch gemessen 25.10.2026 abends: `97c476f3` — nichts davon gemergt, nichts live (live 0.1.48-beta).**

| PR | Inhalt | Basis | Tests |
|---|---|---|---|
| #571 | Wohnen: «Nettomiete» im Satz, Barometer ruhiger + Tausender-Zeichen, Zimmer-Hinweis, «›» | main | 6’784 grün, CI grün |
| #572 | Finanzen: Lohn «So ist gerechnet», Kuchen nur Ausgaben, Lebensbaum entzerrt, Steuer-Karte kurz | main | 6’783, CI grün |
| #573 | Basis: «allein, keine Kinder», «Neu in der Schweiz» vorerst weg | main | 6’782, CI grün |
| #574 | Doku: Versicherungs-Übersicht eigene Seite (seiten-buendeln §4 Entscheid 3 → §11) | main | — |
| #575 | Prämien-Fundament: Haftpflicht-Prämie, «/ Jahr», Prämien ins Budget, Dashboard rechnet mit, Maria KK 540.30 | main | 6’793, CI grün |
| #576 | Versicherungen Schritt 2: Versicherungen pro Monat, KK-Last, kleine Schilde, kleines Franchise-Kreuz | #575 | 6’810 (CI nie gelaufen) |
| #577 | Ausbildung: Zusammenfassung, Lohn-Barometer, Lebenslauf-Vorschau, Werte im Kartenrand, Bürgerrecht | #572 | 6’795 (CI nie gelaufen) |
| #578 | Behörden: Kasten weg, Kalenderblatt, Behördengänge offen, Fall der Fälle, Steuerfrist Maria 31.03.2027 | main | 6’798, CI grün |

**Empfohlene Merge-Reihenfolge:** #574 → #571 → #573 → #572 → #575 (danach Tests auf main: Maria bleibt **2’274** statt
2’459) → #576 (auf main umstellen und neu aufsetzen) → #577 (ebenso) → #578. Ab #573 harmlose Konflikte: fast alle fügen
Texte in den 5 Sprachdateien an denselben Ankern ein (vor `wohnenInstrument: {`, nach `imHaushalt:`) und #576/#577/#578
hängen ihr Instrument in `ChapterView.jsx` gleich nach dem Wohnkosten-Instrument ein — jeweils beide Teile behalten.
Angebot an Sophie: Claude holt nach jedem ihrer Merges main in den nächsten Zweig, löst die Konflikte, testet, pusht.
**Mergen und deployen nur Sophie.**

**Entscheide dieser Sitzung** (Wortlaut in VERGLEICH.md): Muster-Punkte (Karten je Abschnitt, Kopf, Passend-Symbole und
-Untertitel, «Als Nächstes»-Karte, Anker unten) **am Schluss für alle Kapitel** · Finanzen-Befund «Passend ohne Übersicht/IPV»
war ein Fehlbefund (Finanzen-Fusion) · Versicherungs-Übersicht = eigene Seite (AB) · Versicherungen in drei Schritten
(1 Fundament ✓ #575, 2 Instrumente ✓ #576, 3 Übersicht offen).

**Noch abzugleichen:** Kapitel **Notfall (AE)** — dann das **Muster für alle Kapitel** (Befunde Wohnen 5, 6, 8, 9;
Finanzen 7, 8; Basis 3, 4; Versicherungen 6, 8, 9; Ausbildung 6–8; Behörden 8, 10, 11).

**Offen, nicht vergessen:**
- Wortlaut ZStB Nr. 133.1 «Aufforderung 2027» (Kanton Zürich) vor dem Deploy nachlesen — Websuche nennt 31.03.2027, der
  Prüfer konnte das PDF offline nicht öffnen.
- Prämien 2027 (BAG, Ende September veröffentlicht) fehlen in der App: Franchise-Vorschlag und Marias KK-Prämie rechnen mit 2026.
- Fahrzeugversicherung im Budget: eigener Entscheid (heute bewusst nicht, «Mobilität» kann sie enthalten).
- Versicherungen Schritt 3 (Prämien-Orientierung → Versicherungs-Übersicht) · Befunde Versicherungen 6 (Spinnennetz), 8, 9.
- Alle neuen rm-Texte sind ungeprüft (Fachperson Rumantsch).
- Nebenbefunde: Startbündel nach #576 bei 63.3 / 65 kB (Puffer schrumpft) · bei hoher Last (load ~20) fallen im vollen
  Testlauf wechselnde i18n-Tests aus Zeitgründen — einzeln grün; `--testTimeout=30000` hilft · nach jeder Änderung an
  `ChapterView.jsx` lädt der Dev-Server ganz neu und das Beispiel ist weg («Ohne Code ausprobieren» neu klicken) ·
  Screenshots im Browser-Pane springen nach `scrollIntoView` nicht mit — mit Scroll-Rad scrollen.
- Worktree `_werkbank/abnahme-f6` (detached auf `97c476f3`) kann bleiben oder weg; die Zweige liegen alle auf origin.

## Nachtrag 25.10.2026 nachmittags · Kapitel Notfall gebaut

Abgleich Notfall (AE): 12 Befunde (`VERGLEICH.md`). Sophie: 1–11 bauen, 12 ins Muster am Schluss, Name «Portemonnaie-Karte» bleibt.
**Entwurfs-PR #579** `feat/f6-notfall-ein-ort` (Basis main, Worktree `_werkbank/f6-notfall`), 0 Blocker, 6’801 Tests grün.
Merge-Reihenfolge ergänzt: … → #578 → **#579**. Offen zum Entscheiden: siehe VERGLEICH.md «Kapitel Notfall … Offen zum Entscheiden».

## Nachtrag 25.10.2026 abends · Versicherungen Schritt 3 gebaut

Sophie: Muster M1–M8 erst nach den Merges #571–#579. Bis dahin Versicherungen Schritt 3: **Entwurfs-PR #580**
`feat/f6-versicherungs-uebersicht` (Worktree `_werkbank/f6-versicherungs-uebersicht`), **gestapelt auf #576** → nach #575 und
#576 mergen, dann auf main umstellen. Merge-Reihenfolge: #574 → #571 → #573 → #572 → #575 → #576 → **#580** → #577 → #578 → #579.
Danach: Muster M1–M8 (VERGLEICH.md «Muster für alle Kapitel»).

## Stand 25.10.2026, 17:05 (Sitzungsende «Seite für Seite», Teil 2)

| Wo | Stand |
|---|---|
| `main` (origin) | `97c476f3` (#567, 25.10. 10:26) — unverändert, nichts gemergt |
| live | 0.1.48-beta (`4299bfb9`) |
| Entwurfs-PRs Fassung 6 | #571 · #572 · #573 · #574 · #575 · #576 · #577 · #578 · **#579** Notfall · **#580** Versicherungs-Übersicht |
| #579 | `feat/f6-notfall-ein-ort` `e3776767`, Basis main, Worktree `_werkbank/f6-notfall` |
| #580 | `feat/f6-versicherungs-uebersicht` `ea8ad89f`, **Basis #576**, Worktree `_werkbank/f6-versicherungs-uebersicht` |
| Zweig `docs/mockups-stardust` | lokal, nicht gepusht (wie bisher) |

**Merge-Reihenfolge (Sophie):** #574 → #571 → #573 → #572 → #575 (Tests: Maria 2’274) → #576 → #580 → #577 → #578 → #579.
#576/#577/#580 nach dem Merge ihrer Basis auf main umstellen; Konflikte (i18n-Einfügestellen, ChapterView) löst Claude auf Zuruf.

**Danach (entschieden):** Muster M1–M8 für alle Kapitel (VERGLEICH.md «Muster für alle Kapitel») — erst nach allen Merges.

**Offen zum Entscheiden:** Spinnennetz (wofür, wo — siehe VERGLEICH.md) · Fachbegriffe Patientenverfügung/Vorsorgeauftrag
it/en app-weit uneinheitlich (fedlex) · «Ich nehme keine» erscheint nicht im Dossier/QR · ordentliche KK-Kündigung 30.6. in der
Übersicht · Fristen-Wortlaut KVG Art. 7 / KVV Art. 94 · ZStB Nr. 133.1 · BAG-Prämien 2027 · rm.

**Nebensätze, die sonst nirgends stehen:**
- Unter hoher Last (load 66 gemessen) bricht der volle Testlauf ab (Exit 137) — `npx vitest run --testTimeout=60000 --maxWorkers=3`.
- Wird die App beendet, sind die Dev-Server weg (Ports 5490 Entwürfe, 5495–5497 App) — neu starten. Der Browser-Bereich findet
  `.claude/launch.json` nicht immer; `navigate` mit URL geht.
- `feldHatWert` zählte Listen-Felder (`medicationsList`, `chronicDiseasesList`) nie — in #579 behoben; wer auf #579 nicht baut, hat den Fehler noch.
- IPV-Beträge nur über `ipvAbzug` zeigen (Frist vorbei, Gesuch, Verfügung); `pegel.js` bleibt unverdrahtet (misst rohes Einkommen,
  ZH/BE rechnen anders). Kantonsmodule laden nach → `ladeIPVModelle()` und neu zeichnen, sonst steht beim ersten Aufruf «prüfen».
- Ein `position: sticky` im Kapitel bleibt nur stehen, wenn es direktes Kind der Kapitelkarte ist (#579, Ernstfall-Knopf).
- Der Brotkrumen-Test verlangt wörtlich `React.createElement(Brotkrume, { palette, t, view: '…', onNavigate })`.

## Stand 25.10.2026, 18:05 · alle zehn Entwurfs-PRs gemergt (nicht live)

Sophie 25.10. ~17:10: «merge wenn möglich» — Claude hat die Kette in der vereinbarten Reihenfolge gemergt (squash, wie bisher),
jeden Zweig vorher mit main nachgezogen, voll getestet, gebaut, gepusht und die CI abgewartet. **Nicht deployt.**

| PR | main danach | Tests lokal | Konflikt |
|---|---|---|---|
| #574 Doku Vers.-Übersicht | `1ab40daa` | – (nur Doku) | keiner |
| #571 Wohnen | `adaf7715` | 6’784 | keiner |
| #573 Basis | `a82251e8` | 6’786 | keiner |
| #572 Finanzen | `2d59e96e` | 6’789 | keiner |
| #575 Prämien-Fundament | `34703b6f` | 6’802 | i18n: `proJahr` neben die neuen `haushalt*`-Schlüssel aus #573 |
| #576 Versicherungen Schritt 2 | `eb3b5a5d` | 6’819 | i18n wie #575; Basis auf main umgestellt |
| #580 Versicherungs-Übersicht | `0bf9fbf6` | 6’833 | erst nachgezogenen #576-Zweig, dann main; `VersicherungenInstrument.jsx` = Fassung #580 |
| #577 Ausbildung | `8a0b8e43` | 6’845 | erst nachgezogenen #572-Zweig, dann main; i18n + ChapterView: beide Teile behalten |
| #578 Behörden | `0a66f51c` | 6’863 | i18n + ChapterView: beide Teile behalten |
| #579 Notfall | **`a1c516e9`** (18:02) | 6’885 | ChapterView-Angabenliste: Fragment (#579) + Spalten 3:2 (#572) + «Vertretung nicht erfasst» (#578); Brotkrumen: beide Pfade, Test «sieben Ansichten» |

- CI auf main `a1c516e9`: grün. Live weiter 0.1.48-beta (`4299bfb9`).
- `haushaltWert`/`haushaltWertEinKind` sind mit #573 überall weg (kein Aufrufer mehr) — bei Konflikten nicht wiederbeleben.
- Jeder PR-Diff nach dem Nachziehen = dieselben Dateien wie vorher (gegengeprüft).
- **Nicht im Browser angeschaut:** die zusammengeführte Angabenliste (Notfall + Behörden in derselben Karte). Tests decken sie ab, Auge noch nicht.
- Hilfs-Worktree `_werkbank/f6-merge-kette` (node_modules als Symlink auf f6-notfall) — kann weg.
- Weiter offen: #569 (PII-Kommentare), #568, #563, #561 — nicht Teil der Kette.

**Als Nächstes (entschieden):** Muster M1–M8 auf main bauen (ein Zweig, Fachprüfung, Entwurfs-PR). Spinnennetz-Frage bleibt offen.

## Stand 25.10.2026 abends · Muster M1–M8 gebaut (#581, Entwurf)

- Angabenliste in Notfall und Behörden nach der Zusammenführung im Browser angeschaut: das Fehlende und «nicht erfasst» stehen da;
  Befund: Telefonnummern brachen mit den Spalten 3 : 2 → mit M1 behoben.
- **#581** `feat/f6-muster-m1-m8` `f21a866f`, Basis main `a1c516e9`, Worktree `_werkbank/f6-muster` (node_modules Symlink auf
  f6-notfall). Inhalt und Fachprüfung: VERGLEICH.md «Muster für alle Kapitel» → «Gebaut». **Nicht gemergt, nicht live.**
- Dev-Server dieser Sitzung: App 5498 (f6-muster), Entwürfe 5490.
- Hilfs-Worktree `_werkbank/f6-merge-kette` kann weg.
- Weiter offen: Spinnennetz · Fachbegriffe it/en · «Ich nehme keine» im Dossier · ZStB 133.1 · Prämien 2027 · rm · KVG Art. 7 Wortlaut ·
  `naOk`/`ahvContribution jahr`/PremiumSubsidy Wochenaufenthalt (aus der Fachprüfung #581).
