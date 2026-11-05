# Fassung 9 · Bestandsaufnahme Gestaltung, Sprache, Zitierweise, Abfolge

Erhoben am 05.11.2026 auf Frage von Stebler Studios: «Ist alles kohärent, sauber querverlinkt,
sind alle Zitierungen gleich, macht die Abfolge Sinn?» Das sind die Fragen, die bis Fassung 9
beantwortet sein sollen.

**Grundlage:** `main` @ `61c333b2` (05.11., 11:52), nur gelesen. Seither nur `#688` (Doku) dazu.
Fünf Prüfer parallel: Polygrafin (Gestaltung), Ordnungshüter (Bausteine), Copy-Prüfer (Sprache),
Zitierweise, Informationsarchitektur. Die stärksten Befunde je Thema von Claude am Code
gegengeprüft (Stichproben unten). **Nichts gerendert:** Dunkelmodus, Handybreite und
Atkinson-Modus sind nicht beurteilt. Zählungen sind Textsuchen und damit Näherungen.

**Nichts davon ist gebaut.** Jeder Punkt wartet auf den Entscheid von Stebler Studios.

## Entscheide

**05.11.2026, Stebler Studios, im Gespräch:**

- **F9-B1 Du-Schreibung: klein.** Wortlaut: «mach so wie es orthographisch stimmt beim du und
  nicht wie ich gedacht habe». Die amtliche Rechtschreibung gilt auch in der Schweiz: «du» klein
  ist der Standard, gross ist nur in Briefen erlaubt. Damit werden 177 grossgeschriebene Stellen
  in der Du-Fassung angeglichen, und ein Test hält die Form. Die frühere Notiz «Du gross ist
  Hausregel» ist damit überholt.
- **F9-C1 Zitierregel: Fussnote und Aufklappen kombiniert (Skizze C + D).** Im Satz steht eine
  kleine Ziffer. Am Ende des Blocks steht eine leise Zeile «Belegt mit N Quellen · geprüft im
  <Monat> <Jahr>». Aufgeklappt zeigt sie die nummerierten Belege in der Form aus F9-C. Die
  statischen Seiten folgen derselben Form. Die Einzelheiten (Darstellung auf dem Handy, Ansage
  für Screenreader, Druck) werden vor dem Bau als Skizze gezeigt.
- **F9-A2 Farbrollen: Gold = handeln (Variante B), entschieden.** Wortlaut: «Ja, so» (05.11.2026,
  nach Vergleich der Varianten A/B/C in Hell und Dunkel). ⟨überholt, bewusst stehengelassen⟩ Vorher
  galt am selben Tag «Hauptknopf grün, Code folgt dem Markenhandbuch» («Ja, folgen»). Die Messung
  danach zeigte, dass sich das dunkle Grün im Dunkelmodus kaum von der Fläche abhebt (1.8:1).
  Neu: Gold/Sand = handeln (Hauptknopf gefüllt, Nebenknopf und Links in `sandDeep`),
  Grün = gut/erledigt, Blau = informieren und Fristen, Rot = warnen/Gefahr. Markenhandbuch
  nachgeführt in #691. Offen als eigene Pakete: Fristen von Gold auf Blau, Links auf Gold.

## Gesamturteil in fünf Sätzen

1. Das Fundament steht: Tokens tragen die App (Schriftgrössen 1 623 über Token gegen 94 roh,
   Radien 635 gegen 38), keine Emoji, keine Ausrufezeichen, `ExternerLink` fast lückenlos.
2. Jede der 73 Seiten hat einen Rückweg, und kein interner Verweis zeigt ins Leere.
3. Das grösste Loch sitzt eine Stufe über den Tokens: **Seitentitel und Hauptknopf haben je zwei
   bis drei Rezepte.** Deshalb sehen Kapitel und Abläufe nach Fassung 7/8 aus, Steuern, IPV,
   Tresor, Suche und Einstellungen nach früher.
4. **Die Zitierungen sind nicht gleich:** neun Darstellungsarten, sechs Datumsformen, keine
   Hausregel zur Form. Nur die Abläufe sind einheitlich, weil dort ein Test die Form hält.
5. Beim Finden hakt es am meisten: **Die Suche im Menü kennt keinen einzigen Ablauf.**
   Querverweise laufen teils nur in eine Richtung.

## A · Gestaltung (Gestalt aus einem Guss)

- **F9-A1** (Muss): Drei Rezepte für den Seitentitel. Hanken 30 px in `AblaufSchale.jsx:126`,
  `ChapterView.jsx:2253` und `CalendarReminders.jsx:427`. Lexend 22–30 px in `RechnerForm.jsx:102`.
  Lexend 28 px mit Icon in `TaxCalculator`, `PremiumSubsidy`, `DocumentTresor`, `SearchView`,
  `SettingsView` und `Gepaeck`. `Heading.jsx` setzt keine `fontFamily`, die Marke verlangt Hanken
  für Headlines (`brand-guidelines.md:69`). *Vorschlag:* Schrift, Grösse und Zeilenhöhe einmal in
  `PageTitle`, die Überschreibungen fallen weg.
- **F9-A2** (Muss, Entscheid): Zwei Farben für die Hauptaktion. `PrimaryButton` ist Sand
  (`PrimaryButton.jsx:17`). Das Markenhandbuch nennt Sage als Primärfarbe für Buttons
  (`brand-guidelines.md:45`). Zehn Handbauten sind Sage-dunkel (`palette.sageBtn`, u. a.
  `main.jsx`, `MerklisteView`, `DocumentTresor`, `OrganDonation`). *Entscheid nötig:* Sage oder
  Sand. Danach folgt `PrimaryButton`, und die Handbauten rufen ihn auf.
- **F9-A3** (Sollte): Überschriften von Hand. 53–55 rohe `h1`–`h4`, ein `h3` steht in 13, 15, 16,
  19 und 23 px. Vierfach dasselbe `h2` in `Vorsorgeauftrag`, `Patientenverfuegung`, `Bestattung`
  und `AnspruchCheck`. *Vorschlag:* auf `PanelTitle`, dazu eine Unterstufe von 15 px.
- **F9-A4** (Sollte): Der Kicker in Grossbuchstaben ist 13-mal nachgebaut, obwohl es `Eyebrow`
  gibt, mit vier verschiedenen Zeichenabständen. Grossbuchstaben-Kicker sind ein SaaS-Muster.
  *Vorschlag:* auf `Eyebrow` umstellen und dabei entscheiden, ob die Grossbuchstaben bleiben.
- **F9-A5** (Sollte): Die Abstandsskala geht an der Praxis vorbei. Sie hat keinen 12er, im Code
  steht `12px` 141-mal, `6px` 96-mal, `10px` 55-mal. Insgesamt rund 1 100–1 400 rohe Abstände.
  *Vorschlag:* `space` um 12 ergänzen (oder bewusst runden), danach ein Test gegen neue Literale.
- **F9-A6** (Sollte): 32 verschiedene Alpha-Stufen für Tönungen (`palette.x + 'NN'`, 269-mal).
  *Vorschlag:* drei bis vier benannte Tönungen in `tokens.js`.
- **F9-A7** (Sollte): Mindestens drei Bauarten für Hinweiskästen. `StorageWarning` schafft sich
  14 px und `role="alert"`. *Vorschlag:* eine `Hinweis`-Komponente mit zwei Stufen.
- **F9-A8** (Sollte): Rechtlich wichtige Kleinschrift unter 13 px, 77 Stellen. Darunter die
  Rechenhinweise in `FinanzAuswertung.jsx:320/327/403` mit 10 px und die untere Navigation
  (`main.jsx:362`). *Vorschlag:* 13 px als Untergrenze für alles Lesbare, Diagrammachsen
  ausgenommen.
- **F9-A9** (Sollte): `ZipExport` (Sicherung) wirkt wie eine Verwaltungsoberfläche: Kacheln
  «Datengrösse in KB», vier geschachtelte Kästen, kein Seitentitel. *Vorschlag:* ruhige Spalte
  mit einem Satz und einem Knopf.
- **F9-A10** (Kann): Mattglas (`backdropFilter: blur(12px)`) an Kopf und unterer Leiste
  (`main.jsx:395`, `:1330`). *Vorschlag:* deckende Fläche.
- **F9-A11** (Kann): Der `Geldfluss`-Donut hat 21 Teile und Violett/Braun ausserhalb der Palette
  (`Geldfluss.jsx:122`). *Vorschlag:* auf fünf bis sechs Gruppen bündeln, passt zu F8-F1.
- **F9-A12** (Sollte): Eingabefelder. `LabeledField` nutzen 4 Dateien, 172 Felder sind roh
  (`SchuldenManager` 19, `ChapterView` 18, `KVGLeistungen` 9). Der Kommentar sagt noch
  «Vorschlag, nicht migriert». Die Label-Koppelung für Screenreader ist dort ungeprüft.
  *Vorschlag:* diese drei zuerst.
- **F9-A13** (Sollte): Weitere Knöpfe unter 44 px über F8-Q1 hinaus: `BergDetail.jsx:118`,
  `MerklisteView.jsx:115`, `Monatsring.jsx:67`, `MedicationManager.jsx:179` und
  `DoctorManager.jsx:81`.

## B · Sprache (ein Wort je Sache)

- **F9-B1** (Muss, Entscheid): Die Du-Schreibung ist gemischt, nicht nur einzeln, sondern Block
  gegen Block. 492 `du:`-Texte haben das Pronomen mitten im Satz klein, 177 gross, 5 beides im
  selben Satz. Die Abläufe schreiben klein, Dashboard, Finanzen und Sozialhilfe gross. Die
  Hausregel «Du gross» steht nirgends eindeutig, auch `LANGUAGE_SYSTEM_NOTE.md:15/16` ist
  gemischt. *Entscheid nötig:* welche Form gilt. Danach eine Angleichung und ein Test.
- **F9-B2** (Muss): Notfallkarte (18) / Notfallpass (18) / Notfall-Dossier (13) überlappen.
  «Notfallpass» meint an einer Stelle die Medical ID des Telefons (`de.js:5602`). *Vorschlag:*
  Notfallkarte = Blatt, Notfall-Dossier = Druck, Notfallpass nur fürs Telefon.
- **F9-B3** (Muss): Unterlagen / Dokumente / Tresor / Ordner / Papiere für denselben Ort,
  dazu «Dokumenten-Tresor» neben «Dokumententresor». *Vorschlag:* Unterlagen = Ort,
  Dokumente = Dateien, Tresor = verschlüsselter Teil.
- **F9-B4** (Sollte): Das IPV-Werkzeug hat fünf Namen («Prämienverbilligung prüfen/schätzen»,
  «IPV-Anspruch prüfen», «IPV-Prüfung», «IPV-Rechner»). Teilweise F8-F3.
- **F9-B5** (Sollte): Rechner / Check / Orientierung / Prüfen ohne Regel («Sozialhilfe-
  Orientierung» neben dem Seitentitel «Sozialhilfe-Rechner»). *Vorschlag:* «Rechner», wenn eine
  Zahl herauskommt, «Anspruch prüfen» bei Ja/Nein. «Check» und «Orientierung» fallen als Namen weg.
- **F9-B6** (Sollte): Frist / Termin / Deadline gemischt. Die Steuerfrist heisst dreimal anders.
- **F9-B7** (Sollte): Krankenkasse / Krankenversicherung / KK in Oberflächentexten.
  *Vorschlag:* Krankenkasse = Anbieterin, Grundversicherung = Pflicht, KK ausschreiben.
- **F9-B8** (Sollte): Mietbeiträge / Mietzinsbeiträge / Mietzins-Beiträge. Vorher mit der
  Glossar-Gegenlese abstimmen.
- **F9-B9** (Sollte): Rund ein Dutzend «Achtung:» / «Wichtig:» (z. B. `de.js:7171`, `:4432`) und
  werbliche Zeitversprechen («In wenigen Minuten startklar», «ideal für»). *Vorschlag:* ruhiger
  Satzanfang, Zeitangaben nur, wo sie stimmen.
- **F9-B10** (Sollte): Ablauf-Titel in vier Formen. *Vorschlag:* Nomen für Ereignisse,
  «— was tun?» nur, wenn ein Brief oder eine Frist eingetroffen ist.
- **F9-B11** (Kann): Sozialdienst/Sozialamt, Selbstbehalt/Eigenanteil (zwei verschiedene
  Gegenstände unter einem Wort), Ablauf/Weg/Wegweiser.

Mit diesen Hausbegriffen liesse sich ein Blatt schreiben, das als Test gegen `de.js` läuft.

## C · Zitierweise (Form, nicht Wahrheit)

Inventar: Inline-Marker `[[Wort|URL]]` (15 Dateien) · Quellenzeile im Ablauf-Fuss (37 von 38) ·
`OfficialLinkBox` (8) · `ExternerLink` direkt (31) · Quellenzeile als Klartext ohne Link (16) ·
Zitat in Klammern ohne Link (301 Zeilen) · Datenfeld `quelle · stand` (2) · statische Seiten mit
einfacher Liste (4 × 5 Sprachen) · `/krankenkasse/` mit nummerierten Belegen (1).

- **F9-C1** (Muss): **Es gibt keine Hausregel zur Form.** Geregelt ist nur der Inhalt (Artikel +
  Amt). `renderSource.js:5` verweist auf `docs/UX_PLAYBOOK.md`, dort steht nichts dazu.
- **F9-C2** (Sollte): Das Prüfdatum steht in sechs Formen: «(geprüft im September 2026)» (36-mal),
  «gelesen im …», «abgerufen am 15.09.2026», «Stand …, geprüft im …», Mischformen und auf den
  statischen Seiten einmal je Seite.
- **F9-C3** (Sollte): Elf verlinkte Quellenzeilen ganz ohne Prüfdatum (`de.js:1071`, `:3276`,
  `:4669`, `:5246`, `:6095`, `:6260`, `:6289`, `:6328`, `:6348`, `:6363`, `:7087`).
- **F9-C4** (Sollte): «Stand» in fünf Schreibweisen (mit/ohne Doppelpunkt, Jahr, Stichtag,
  ISO-Datum in den Daten).
- **F9-C5** (Sollte): Linktext = Amt, Ziel = Startseite statt Dokument, 12-mal
  (z. B. `[[BAG|priminfo.admin.ch]]`, `de.js:6328`).
- **F9-C6** (Sollte): Fünf Links mit «Art. …» beschriftet führen aufs ganze Gesetz statt auf den
  Artikel (`de.js:6095`, `:6289`, `:6728` ×2, `:6792`). Die übrigen rund 230 Fedlex-Links springen
  zum Artikel.
- **F9-C7** (Sollte): Sieben Ansichten mit Fachaussagen nur mit Klammerzitat im Satz, ohne
  Quellenzeile (`Schnellcheck`, `Leistungsliste`, `BudgetSync`, `Patientenverfuegung`, `Pegel`,
  `SchuldenBilder`, `SteuerSaeulen`).
- **F9-C8** (Sollte): Die statischen Seiten haben zwei Quellenformen (Liste vs. nummerierte
  Belege) und öffnen extern im selben Tab, die App im neuen Tab mit Ansage.
- **F9-C9** (Kann): Ämter in der App nur als Kürzel, auf den Seiten ausgeschrieben. SR-Nummer in
  der App nie, auf den Seiten schon. «Bst.» 21-mal gegen «lit.» 6-mal. Trennzeichen Komma gegen
  Mittelpunkt.

**Vorschlag einer Zitierregel (Form):**

```
1. Jede Fachaussage mit Zahl, Frist oder Recht hat eine sichtbare Quellenzeile am Ende ihres
   Blocks. «(DBG Art. 83)» im Satz darf zusätzlich stehen, ersetzt sie aber nicht.
2. «Quelle: » / «Quellen: », Einträge mit «, », Schluss «(geprüft im <Monat> <JJJJ>).»
3. Gesetz: [[<Kürzel> Art. <N>[ Abs. <n>][ Bst. <x>]|fedlex…#art_…]], Gesetz zuerst, Bst. statt lit.
4. Andere Quelle: [[<Amt>, <Titel> (<Jahr>)|<URL zum Dokument>]], nie nackte Domain.
5. Stand eines Werts: «Stand <JJJJ>» oder «Stand <T.M.JJJJ>», ohne Doppelpunkt.
6. Extern immer über ExternerLink, statische Seiten in derselben Form.
   Ausnahme: Briefvorlagen dürfen «Art. N Gesetz» schreiben.
```

Ein Test liegt nahe: `src/__tests__/ablaufQuellen.test.js` von den Abläufen auf alle
`*quelle`/`*Quelle`/`*source`-Schlüssel ausweiten. Er prüft Präfix, Linkform, `#art_` und die
Schlussklammer. Für die statischen Seiten gibt es denselben Check im Lauf
`build-seiten.mjs --pruefen`.

## D · Abfolge und Querverweise

Struktur: Ebene 1 Kopf, untere Leiste und Menü (4 Anker, 7 Kapitel, Werkzeuge). Ebene 2
Übersicht, 7 Kapitel, Rucksack, «Was steht mir zu?», «Was ansteht». Ebene 3 hat 73 Seiten: 35
Abläufe in der Ablauf-Schale, 10 Rechner in Form X, 8 mit Brotkrume, 19 nur mit «← Übersicht».

- **F9-D1** (Muss): **Zwei Suchen, verschiedene Treffer.** Die Menü-Suche
  (`MobileNav.jsx:159`, `:243`) liest nur `WERKZEUGE` und die Kapitel. «heirat», «todesfall»,
  «bestattung», «notfallkarte» ergeben dort keine Treffer. Die Lupe findet dafür «Was steht mir
  zu?» und «Arztkoffer» nicht. *Vorschlag:* beide Suchen lesen dieselbe Liste.
- **F9-D2** (Sollte): IPV (`premium`) und Steuern (`tax`) haben nur «← Übersicht», ohne Kapitel
  in der Brotkrume, anders als ihre Nachbarn (kvg, vorsorge, praemien).
- **F9-D3** (Sollte): Querverweise nur in eine Richtung oder ganz fehlend:
  IPV ↔ Krankenkasse wechseln (keine Richtung) · Franchise → Kassenwechsel (gleiche Frist,
  hängt an F8-D1) · Todesfall → EL (Schritt «Hinterbliebenenrente & EL» ohne Verweis) ·
  ALV-Rechner → Stelle verloren · Sozialhilfe → Stelle verloren · Patientenverfügung/Bestattung →
  Vorsorgeauftrag.
- **F9-D4** (Sollte, Fachprüfer): «Stelle verloren» und «Ausgesteuert» nennen EL als verwandt
  (`ablaufVerwandte.js:12`, `:31`). Der EL-Ablauf selbst sagt aber, EL setze AHV oder IV voraus
  (ELG Art. 4). *Vorschlag:* streichen, vorher den swiss-precision-pruefer fragen.
- **F9-D5** (Sollte): Das Dringende steht hinten. Beim Ausweis ist «Verloren oder gestohlen»
  Schritt 5 von 5 (`Ausweis.jsx:38`), ebenso beim Führerausweis (`Fuehrerausweis.jsx:51`). Beim
  Asyl ist «Die Fristen sind kurz» Schritt 4 von 6. Die Schale blendet spätere Schritte aus.
  *Vorschlag:* Verlust als Weiche oder Schritt 1, Fristen bei Asyl nach vorn.
- **F9-D6** (Sollte): Name im Register ≠ Seitentitel, obwohl die Regel «ein Name je Seite» gilt:
  Schulden / «Schulden & Rechnungen», Kreditkarte / «Lohnt sich meine Karte?», Mahnung und
  Betreibung (zwei Kacheln, eine Seite). Die Lupe nennt die Abläufe «Werkzeuge», die Übersicht
  «Lebensereignisse».
- **F9-D7** (Sollte): Die Vorsorge-Formulare haben drei Zuhause (Notfall, Rucksack, Versicherungen).
  Doppelt mit **F8-N1**.
- **F9-D8** (Kann): Vier Abläufe weichen vom Muster ab: Asyl ohne Nummern,
  «Krankenkasse zum ersten Mal» mit einem Schritt ohne Nummer, zwei Abläufe mit nur einem Schritt,
  EL mit Doppelungen zwischen Schritten und Verwandten.
- **F9-D9** (Kann): 43 Verweise zielen auf eine Umleitung statt aufs Ziel (`finanzuebersicht` 12×
  u. a.). *Vorschlag:* aufs echte Ziel schreiben und mit einem Test absichern.
- **F9-D10** (Kann): `FinanzUebersicht.jsx` hängt nur noch an Tests (3), `ScrollFadeStrip.jsx`
  ist nirgends importiert. Archivieren mit `_WAS-IST-DAS.md`, nur auf Zuruf.

## E · Doku, die nicht mehr stimmt

- **F9-E1** (Muss): `docs/design/ui-registry-drift.md` (Stand 26.05.2026) sagt «Token-Schicht
  isoliert, 0 JSX-Referenzen». Heute importieren 135 Dateien `config/tokens`. Wer der Datei
  glaubt, plant eine Migration, die längst gelaufen ist. *Vorschlag:* neu messen oder als überholt
  kennzeichnen.
- **F9-E2** (Sollte): `docs/design/design-backlog.md` (Stand 06.07.) führt `tabular-nums` als
  offen, es ist in 11 Dateien eingebaut.
- **F9-E3** (Sollte): F8-O4 nennt «PrimaryButton 38 px», `PrimaryButton.jsx:16` hat 44 px. Vor
  dem Bau am Pixel nachmessen.

## Vorschlag für den Zuschnitt von Fassung 9

Drei Entscheide zuerst, weil der Rest davon abhängt:

1. **F9-A2** Hauptknopf Sage oder Sand.
2. **F9-B1** Du klein oder gross.
3. **F9-C1** Zitierregel wie oben, ja/anders.

Danach in dieser Reihenfolge, je ein PR mit Test:

- Titel und Knopf vereinheitlichen (A1, A2, A3, A4)
- Suchen zusammenlegen (D1)
- Zitierregel als Test (C1–C6)
- Hausbegriffe als Test (B1–B8)
- Querverweise und Abfolge (D3–D6)

Tönungen und Abstände (A5, A6) kommen als eigenes Aufräum-PR ohne sichtbare Änderung.

## Gegenproben durch Claude (05.11.)

- **Heading und Knopf:** `Heading.jsx` hat keine `fontFamily` (grep leer). `PrimaryButton.jsx:17`
  hat `palette.sand`, das Markenhandbuch auf Zeile 45 nennt Sage für Buttons. `palette.sageBtn`
  steht in 8 Dateien.
- **LabeledField:** Der Status-Kommentar sagt «Noch NICHT migriert». 5 Dateien inkl. der
  Komponente selbst. `config/tokens` wird in 135 Dateien importiert.
- **Du-Schreibung:** 177 gross, 492 klein, mit dem Befehl aus B1 nachgezählt.
- **Zitierweise:** «(geprüft im …)» 36-mal, «abgerufen am» 3-mal, `[[BAG|priminfo.admin.ch]]`
  auf `de.js:6328`.
- **Suche:** Die Menü-Suche liest `WERKZEUGE` (`src/data/werkzeugRegister.js`), dort kommen
  heirat, todesfall und bestattung nicht vor.
- **EL-Verwandte:** «Stelle verloren» → `ergaenzungsleistungen` (`ablaufVerwandte.js:12`).
- **Abweichung von einem Prüferbericht:** `FinanzUebersicht.jsx` hängt an 3 Tests, nicht an einem.
