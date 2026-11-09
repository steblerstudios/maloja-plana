# Bugs — die eine Liste

Kein Fachchinesisch. Ein Ort, an dem alles steht, was **kaputt** ist.
Nicht was fehlt — das ist etwas anderes (siehe unten).

## Das Bild im Kopf

- **Ein Bug** = etwas ist versprochen und funktioniert **nicht** (falsche Zahl, Knopf tut nichts, Absturz).
- **Ein Backlog-Punkt** = etwas **fehlt** noch (ein neues Feature, ein Ausbau). Das gehört *nicht* hierher, sondern in `docs/TODO.md` / die Roadmap.

Wenn du unsicher bist: *Habe ich es versprochen und es hält nicht?* → Bug. *Gibt es das noch gar nicht?* → Backlog.

## Die einzige Regel

Ein Bug ist erst **weg**, wenn ein Test ihn festhält. So kommt derselbe Fehler nie ein zweites Mal.

1. **Nachstellen** — wie genau geht es kaputt? (Schritte aufschreiben.)
2. **Test schreiben, der rot ist** — er beweist den Fehler.
3. **Fixen**, bis der Test grün ist.
4. **Zeile hier streichen** (nach unten zu „Zuletzt behoben" verschieben).

Und die wichtigste Vorregel: **erst nachstellen, dann eintragen.** Kein Bug wandert hierher, ohne dass jemand ihn gesehen hat. Was sich beim Nachstellen als *schon erledigt* oder als *fehlendes Feature* entpuppt, gehört nicht in diese Liste.

## Wie ein Bug hierher kommt (der Eingang)

Zwei Türen, beide führen in dieselbe Liste:

1. **Aus der App:** der Feedback-Link in der **Fusszeile** öffnet eine Mail an
   `info@malojaplana.ch` (`src/main.jsx`, `feedbackHref`), mit Version, Ansicht und Sprache in
   einem abgetrennten, löschbaren Block. **Und seit 23.09.2026 auch der Fehlerschirm** selbst
   (`src/ErrorBoundary.jsx`, `meldeHref`) — dort zusätzlich mit der Fehlermeldung des Browsers,
   auf 200 Zeichen gekürzt. Dieselbe Tür, zwei Stellen. Gesendet wird nie etwas von selbst: die
   Person sieht den Entwurf im Mailprogramm. Das ist die Tür für die Menschen, die Maloja
   benutzen. Sie funktioniert nur, wenn das Postfach existiert und jemand es liest — das ist die
   Verantwortung von Stebler Studios, nicht des Codes.

   🛑 **Beide Stellen liegen hinter dem Beta-Gate.** Ohne Code sieht man nur die Code-Wand; dort
   führt allein der Rechtliches-Link zur Adresse im Impressum. Ein Melde-Weg **vor** dem Gate
   fehlt (auch auf den öffentlichen Erklärseiten: Kontakt ja, Meldeweg nein).
2. **Aus GitHub:** die Issue-Vorlage `.github/ISSUE_TEMPLATE/bug_report.md`. Die Tür für alle,
   die das Repo kennen.

Der Weg danach ist immer derselbe: Meldung lesen → **nachstellen** (Schritte notieren, gerne mit
Sprache, Gerät, Kanton) → Zeile unter «Offen» → roter Test → Fix im Feature-Branch → PR → nach dem
Deploy die Zeile nach «Zuletzt behoben». Wer eine Adresse hinterlassen hat, bekommt eine kurze
Antwort, was daraus wurde. Ein Punkt, der beim Nachstellen zum Feature-Wunsch wird, wandert nach
`docs/IDEEN.md` oder in die Bau-Liste, nicht hierher.

Meldungen zu **anderen** Projekten von Stebler Studios (Kunden-Websites) gehören nicht in diese
Datei; dafür hat das Studio einen eigenen Weg.

---

## Offen

- 2026-09-23 · **B-5** · **Der Fehlerschirm sprach immer Englisch.** `ErrorBoundary` wird in
  `main.jsx` ohne Props gerendert (`React.createElement(ErrorBoundary, null, …)`), also war `t`
  nie da und jede Person sah den Rückfalltext «Something went wrong» — unabhängig von der
  gewählten Sprache. Die Ansichts-Fehlergrenze eine Ebene tiefer (`ViewErrorBoundary`) bekommt
  `palette, t` und war nie betroffen; deshalb fiel es nicht auf. Nachstellen: eine Sprache ≠ EN
  wählen, einen Absturz im Baum auslösen. Festgehalten in
  `src/__tests__/fehlerschirmMelden.test.js`, Fix: `t` aus dem I18n-Kontext, sonst `tMitRueckfall`
  (K64/K71) — PR #273, **gemergt 23.09.2026** (`main` = `20342d4`).
  Die zweite Hälfte, die **Farben**: `palette` wird nicht übergeben, also standen dort dunkle
  Rückfallwerte (`#1a1a18` — nicht einmal ein Wert aus der Marken-Tafel) und der Absturz-Schirm
  war im Hellmodus dunkel → er liest das Thema jetzt aus derselben Quelle wie die App
  (`or5_theme` über `paletteAusSpeicher` in `config/constants.js`), Test
  `src/__tests__/fehlerschirmFarben.test.js` — PR #274, **gemergt 23.09.2026**
  (`main` = `2cb981c`). Der Test hält Schlüssel und Default über **alle drei** Stellen, an denen
  die Thema-Logik steht (`constants.js`, `main.jsx`, `public/theme-init.js` — die dritte ist
  unvermeidlich: Script im `<head>`, kann nichts importieren).
  🛑 **Beides gemergt, nichts davon live** — gemessen 23.09.2026, 22:39: live läuft weiter
  `index-8FolD38L.js` vom 22.09. Erst nach dem Deploy wandert die Zeile nach «Zuletzt behoben»,
  mit Bundle-Name und Uhrzeit wie bei B-1 bis B-4.

- 2026-09-25 · **B-6** · **Rumantsch zeigt beim Gepäck einen französischen Einleitungstext.**
  `src/i18n/rm.js`, Schlüssel `gepaeck.intro`, beginnt mit «Chaque domaine de la vie est un
  équipement dans le sac à dos …» — also Französisch statt Rumantsch. Gefunden am 24.09.2026
  von der K124-Sitzung (#335), dort **bewusst nicht angefasst**, weil K124 nur die Anrede
  nachzog. Am 25.09.2026, 13:45, auf `main` (`cbb6447`) nachgesehen: steht noch so da, wortgleich mit
  `fr.js`, und wird in `src/Gepaeck.jsx:201` angezeigt. **Im Code belegt, im Browser nicht
  angesehen.**
  Nachstellen: Sprache Rumantsch wählen, «Gepäck» öffnen. Fix braucht einen echten
  rätoromanischen Satz (Gegenlese durch einen Menschen, wie K124) — nicht aus dem Französischen
  ableiten. Test-Vorschlag: kein rm-Wert darf wörtlich gleich dem fr-Wert sein, ausser auf einer
  begründeten Ausnahmeliste.

### Bugsuche 2026-11-09 (Lesedurchgänge über `main` `dff64ec7`, jeder Fund im Code gegengeprüft)

**Alle unten: im Code belegt, im Browser nicht nachgestellt** (wie B-6). B-7 bis B-10 sind auf
Zweig `fix/bugsuche-top4` behoben, je mit Test, der vor dem Fix rot war — **nicht gemergt, nicht
live**. Am selben Abend auf demselben Zweig dazu **B-12 bis B-15** behoben, ebenso mit rotem Test
zuerst. Danach auch **B-11, B-16 und B-18** behoben (siehe je dort). **Offen bleiben B-17 und
B-19** sowie die Text-Punkte aus der Fachprüfung zu B-18. Rechner/Fachlogik: siehe Nachtrag unten.

- 2026-11-09 · **B-7** · **Dokument-Datei galt als gespeichert, bevor sie es war.**
  `idb.save` (`src/utils/storage.js`) löste bei `req.onsuccess` auf. Bei vollem Speicher bricht
  die Transaktion oft erst danach ab (QuotaExceededError) → «gespeichert», Eintrag in der Liste,
  Datei fehlt. Trifft auch die Einmal-Verschiebung alter Inline-Dateien (`main.jsx`), danach
  überschreibt `setDocuments(metaDocs)` die einzige Kopie. Fix: Erfolg erst bei `tx.oncomplete`.
  Test `dokumentSpeichernAbschluss.test.js`.
- 2026-11-09 · **B-8** · **Zwei Tabs überschrieben sich bei Merkliste und Kalender.** K116 schützt
  nur `or5_data`/`or5_docs`; beide Listen schrieben bei jeder Änderung den Stand vom Öffnen.
  Nachstellen: Tab A Merkliste offen, Tab B «merken», in Tab A abhaken → Punkt aus B weg.
  Fix: `hooks/useFremdeListe.js` lädt die Liste neu, wenn ein anderer Tab sie ändert.
  Test `fremdeListeTabs.test.js`.
- 2026-11-09 · **B-9** · **Vorlage «Krankenkasse wechseln» ab 30.11. auf falschem Datum.** Gezählt
  wurde bis zum 30.11. des laufenden Jahres: am 30.11. → 30.12. (`0 || 30`), ab 1.12. ein
  vergangenes Datum. Fix: `tageBisNaechstem(heute, '11-30')`, `?? 30`. Test `kkWechselStichtag.test.js`.
- 2026-11-09 · **B-10** · **Angefangener Upload rutschte ins nächste Kapitel.** `ChapterView` wird
  beim Wechsel nicht neu aufgebaut; Datei, Typ und Datum blieben stehen, das Dokument landete mit
  dem Typ des alten Kapitels im neuen. Fix: Effekt auf `chapter.key` leert das Formular.
  Test `kapitelwechselUpload.test.js`.
- 2026-11-09 · **B-11** · **Wiederherstellen kann halb gelingen.** `applyBackup`
  (`utils/backupCrypto.js`) schreibt `or5_data` zuerst; scheitert danach eine Datei am Speicher,
  sind die Angaben ersetzt, die Dokumente alt — die Meldung sagt nur «fehlgeschlagen».
  Fix: ganz oder gar nicht — zuerst die Dateien, dann alle Listen; scheitert eines, werden die in
  diesem Lauf geschriebenen Schlüssel zurückgesetzt (wie `createPreRestoreSnapshot`). Tests in
  `utils/__tests__/backupRestore.test.js` («scheitert mitten im Schreiben»). *Behoben (Zweig).*
  Schon geschriebene Dateien bleiben in IndexedDB liegen (ohne Eintrag unsichtbar).
- 2026-11-09 · **B-12** · **Merkliste meldete «gespeichert» auch bei vollem Speicher.**
  `addTodo` (`utils/merkliste.js`) wertete die Rückgabe von `saveTodos` nicht aus. Fix: Rückgabe
  `null` bei Fehlschlag, wie `addReminder`. Test `merklisteSpeicherVoll.test.js`. *Behoben (Zweig).*
  Eine eigene Fehlermeldung am Knopf fehlt weiter (bräuchte Texte in 5 Sprachen) — der Knopf
  bleibt dann einfach ohne Häkchen, wie beim Kalender.
- 2026-11-09 · **B-13** · **Ankunfts-Satz blieb stehen.** `ChapterView.jsx`, Effekt um
  `prevFilledRef`: zweites Feld innerhalb von 6 s → Timer gelöscht, Satz blieb, wanderte beim
  Kapitelwechsel mit. Fix: `ankunftZeigen()`, Timer an `showAnkunft`, Kapitelwechsel blendet aus.
  Test `ankunftSatz.test.js`. *Behoben (Zweig).*
- 2026-11-09 · **B-14** · **Ort fehlte vor dem Datum** in Fristerstreckung Steuern, Kassenwechsel
  und KK-Reklamation (`briefGenerator.js`). Fix: `city` aus «Wohnen». Test
  `briefOrtVorDatum.test.js`. *Behoben (Zweig).*
- 2026-11-09 · **B-15** · **«Weitere Bereiche» übernahm den Zustand des vorigen Kapitels**
  (`ChapterView.jsx`, `showSecondary` nur beim ersten Aufbau gelesen). Fix: Effekt auf
  `chapter.key` mit `weitereBereicheAnfang()`. Test `weitereBereicheJeKapitel.test.js`.
  *Behoben (Zweig).*
- 2026-11-09 · **B-16** · Klein: `.ics` faltet Zeilen über 75 Byte nicht (`utils/icsExport.js`),
  gedruckte Briefe und Dossiers tragen immer `lang="de"`. Fix: Faltung nach UTF-8-Bytes + CRLF
  am Ende (Test `icsZeilenFalten.test.js`); `utils/htmlSprache.js` liest die Sprache aus dem
  Übersetzer des Dokuments (Test `dokumentSprache.test.js`). *Behoben (Zweig).*

**Nachtrag Rechner/Fachlogik (09.11.2026 abends, auf `fix/bugsuche-top4` gelesen, im Code
gegengeprüft, im Browser nicht nachgestellt).** Geprüft wurde nur die innere Logik, nicht ob
gesetzliche Werte stimmen. Ein Fix hier ist Fachlogik → vorher `swiss-precision-pruefer`.

- 2026-11-09 · **B-17** · **Mit IK-Auszug zählt die AHV nur die Beitragsjahre bis heute.**
  `VorsorgeRechner.jsx` (`ahvResult`): mit IK geht `ikResult.beitragsjahre` als Beitragsjahre ein,
  `beitragsjahreReferenzalter` wird `undefined`. Ohne IK werden die Jahre bis zum Bezug angenommen
  (Kommentar Audit B9). Widerspruch im selben Rechner: beim Vorbezug schlägt
  `berechneAltersrente` (`data/ahvRechner.js`) dann `floor(vorbezugMonate/12)` Jahre drauf, beim
  Bezug im Referenzalter keine. Gemeldetes Beispiel (vom Lesedurchgang mit Node gerechnet): Mann,
  40, IK 20 Jahre à 80 000 → Bezug 65 «fehlend 24», Bezug 63 «fehlend 22». Dazu liest
  `projektionAhv` den IK gar nicht, obwohl der Zukunft-Reiter `vr.zukunftIkAktiv` sagt, die
  Projektion nutze die IK-Historie. **Offen ist auch der Fachentscheid**, ob der IK-Weg künftige
  Jahre hochrechnen soll.
- 2026-11-09 · **B-18** · **Zukunftsbild rechnet AHV ab dem Rücktritt, auch vor 63.**
  `VorsorgeRechner.jsx` (Zukunftsgrafik): der Regler geht ab 58, `ahvVorbezugM =
  (Referenzalter − Rücktritt) × 12` → bei 58 rund 84 Monate AHV-Vorbezugsrente ab 58. Der
  Kommentar daneben sagt «auf frühestens 63 gedeckelt» — gedeckelt ist nur der Kürzungssatz, nicht
  die Bezugsdauer. Folge: früher aufhören zeigt ein grösseres AHV-Fundament. Erwartet: AHV erst
  ab `max(Rücktritt, 63)`.
  **Behoben (Zweig):** `utils/ahvZukunftsbild.js` — AHV-Bezug im Bild = max(Rücktritt, Referenzalter
  − 24 Monate, 63), Beitragsjahre bis dahin; Text-Grenze aus derselben Quelle. Test
  `zukunftsbildAhvAb63.test.js` (Mann 58 = 63; Frau JG 1964/1962). Fachprüfung
  `swiss-precision-pruefer` 09.11.: erster Stand nahm für Frauen JG 1961–1969 62 (36 Monate Rente,
  Kürzung für 24) → korrigiert. **Offen aus der Fachprüfung:** (a) Annahmen im Text nennen —
  «AHV am frühesten Termin bezogen» und «Beiträge als Nichterwerbstätige bezahlt» (AHVG Art. 3,
  AHVV Art. 28; das Bild rechnet für die Jahre nach dem Rücktritt weiter mit dem Erwerbseinkommen,
  die Rente ist dann eher zu hoch) — braucht Texte in 5 Sprachen; (b) Vorbezug ab 62 für Frauen
  der Übergangsgeneration erst mit ihren Kürzungssätzen (D10). Quellen vom Prüfer aus dem Code
  und Wissen, Wortlaut nicht nachgeschlagen.
- 2026-11-09 · **B-19** · Klein: Das Feld «Bezugsalter» sagt `min 63`, der Regler im Zukunftsbild
  setzt denselben Wert ab 58. Bei 60 rechnet die AHV wie 63, angezeigt bleibt 60. Eher
  Klarheitsfrage (Rücktritt ≠ AHV-Bezug) als Rechenfehler.

Nicht als Bug geführt: die automatischen Sicherungen (`autoBackup.js`) werden angelegt, lassen
sich in der App aber nicht zurückholen — fehlende Funktion, gehört in die Bau-Liste.

## Geprüft — kein offener Bug (2026-07-08)

Vier Punkte standen kurz hier, aus dem Gedächtnis. Beim Nachstellen zeigte sich: keiner ist ein Bug. Festgehalten, damit sie nicht als Phantome wiederkommen.

- **IK-Leerzustand (Zukunft-Reiter)** → *kein Bug.* Der IK-Leerzustand ist gebaut und funktioniert (AHV-Reiter, `EmptyState`). Der IK-Auszug wird nur im AHV-Reiter gezeigt. „IK auch im Zukunft-Reiter" ist ein **Feature-Wunsch** (nie zurück-navigieren müssen) → Backlog.
- **Zinsknick bei 20 000** → *kein Bug.* Die Projektion rechnet glatt (Zinseszins pro Jahr, keine Schwelle im Code). Die 20 000-Grenze ist nur ein Strategie-Hinweis. Reale Bank-Schwellen abzubilden wäre ein **Modell-Ausbau** → Backlog.
- **3a-Rollover** → *kein Bug.* Der Jahr-für-Jahr-Übergang stimmt. Ein echter Rollover/Drawdown in der Rentenphase ist eine **Ausbaustufe** → Backlog.
- **Rot-Grün-Falle (sage/rosé)** → *kein einzelner Bug, echtes Anliegen.* Farbenblind-Modus + Form-Marker sind schon da (opt-in, Okabe-Ito). Ob weitere Stellen Form-Marker brauchen, klärt ein **fokussierter A11y-Durchgang** — kein einzelner reproduzierbarer Fehler.

## Zuletzt behoben

*(Neueste zuoberst. Nur zum Nachschauen — schön, wenn die Liste hier wächst.)*

- 2026-09-17 · **B-4** · QR-Codes mit Umlauten (Notfall-Dossier, Organspende, Krankenkassen-Karte) blieben leer oder enthielten verfälschten Text: die eingebettete QR-Bibliothek legte das UTF-8-Byte-Feld einmal vor der Schleife an, nach dem ersten Umlaut hängte jedes Zeichen Reste an (Bau-Liste K80). Nachgestellt in Node, festgehalten in `src/__tests__/qrSicher.test.js` (rot gegen die alte Bibliothek), Fix PR #226 und #227; **live seit 17.09.2026, 16:32** (`index-c80eed98.js`, Tag `v0.1.36-beta` = `6546358`), im Browser mit jsQR zurückgelesen.
- 2026-09-16 · **B-2** · Der Steuerrechner speicherte den gewählten Kanton, las ihn aber nie wieder → er liest und schreibt `behoerden.cantoneOfTaxation` (vorbelegt mit dem Wohnkanton) und fragt bei Abweichung, ob der Kanton auch als Wohnkanton gelten soll (Entscheid E23). Test `src/__tests__/steuerkanton.test.js`, Fix PR #165, seit #181 auch in Finanzübersicht und Steuererklärungs-Link; **live seit 17.09.2026, 01:46** (`index-91c30770.js`, 0.1.29-beta, Tag `v0.1.29-beta` = `2fcf409`).
- 2026-09-16 · **B-1** · Zahlen aus dem Schnellcheck kamen im IPV-Rechner nicht an → sie gehen als Übergabe mit, der Rechner sagt «Gerechnet mit den Zahlen aus dem Schnellcheck» und schreibt erst auf «Ins Profil übernehmen» ins Profil (Entscheid E22). Test `src/__tests__/b1SchnellcheckUebergabe.test.js`, Fix PR #167; **live seit 17.09.2026, 01:46** (`index-91c30770.js`, 0.1.29-beta, Tag `v0.1.29-beta` = `2fcf409`).
- 2026-09-16 · **B-3** · Im Beispiel-Modus innerhalb der App wirkten Dokument-Upload, -Löschen und Ablaufdatum auf die echten Dokumente samt Datei in IndexedDB (Bau-Liste K24) → im Beispiel laufen alle drei über eine eigene Liste im Arbeitsspeicher, die beim Betreten und Verlassen geleert wird; die Demo von der Code-Wand war nie betroffen. Nachgestellt und festgehalten in `src/__tests__/beispielDokumente.test.js`, Fix PR #156, **live seit 16.09.2026, 12:23** (`index-2301b4b1.js`, 0.1.28-beta). Die ausführliche Beschreibung mit Nachstell-Schritten steht in PR #156 und in der Git-Historie dieser Datei.
- 2026-07-08 · Zukunft-Graph nannte AHV/BVG-Säulen, auch wenn es sie gar nicht gab → nur vorhandene Säulen werden benannt (`9134b86`).
