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

1. **Aus der App:** der Feedback-Knopf im Menü öffnet eine Mail an `info@malojaplana.ch`
   (`src/main.jsx`, `feedbackHref`). Das ist die Tür für die Menschen, die Maloja benutzen. Sie
   funktioniert nur, wenn das Postfach existiert und jemand es liest — das ist die Verantwortung
   von Stebler Studios, nicht des Codes.
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

*Zurzeit kein offener Bug. B-1 und B-2 (Crosslink-Prüfung 15.09.2026) sind behoben und live, siehe unten; ihre ausführliche Beschreibung steht in der Git-Historie dieser Datei und in den PRs.*

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
