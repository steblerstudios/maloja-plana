# Icon-Plan November 2026 — ein Zeichensystem aus einem Guss

**Stand:** 06.11.2026 · **E1, E2, E3 entschieden: ja, alle drei** (Stebler Studios, 06.11.2026,
Auswahl «Ja, alle drei»). Umsetzung beginnt mit Schritt 1.
**Grundlage:** Bestandsaufnahme vom 05./06.11. auf `main` `40e61e29` (live `4f37d580`).
**Baut auf:** [`brand/icon-dictionary.md`](brand/icon-dictionary.md) (die «Finale Zuordnung»
vom 23.06.2026) und [`ICON_KONVENTION.md`](ICON_KONVENTION.md). Dieser Plan erfindet
keine neue Ordnung: Die Ordnung steht seit Juni. Er setzt den letzten Satz des Wörterbuchs
um: *«bestehende Icons auf diese Tabelle ausrichten, dann überall konsistent einsetzen»*.

---

## Was die Messung ergab

| | Befund | Gegen welche Regel |
|---|---|---|
| 1 | Schicht B (Funktionen) spricht zwei Sprachen: 22 Strich-Icons neben vollen Flächen (`info`, `warning`, `success`, `error`, `delete`, `filter`, `phone`, `debt`, `csv`, `qr`, `timeline` …) | Konvention: «Funktional → ein Outline-Set, nie gefüllte Flächen» |
| 2 | Die Strichstärke bleibt bei jeder Grösse 1,8. Bei 14 px ergibt das ≈ 1,05 px optisch | Konvention: Ziel 1,1–1,4 px, `strokeWidth = ziel × 24 / px` |
| 3 | Zweiter, eigener Satz in `main.jsx` (`bottomIcon`, Strich 1,6): `home`, `check`, `ordner` doppelt; `plus`, `clock`, `gift`, `receipt`, `rucksack`, `sackmesser`, `calendarToday` fehlen im Register | «Wiederverwenden statt duplizieren», eine Quelle |
| 4 | Doppelungen: `ordner` = `mappe`; `check` ≈ `success`; Notfall als Kreuz **und** als Glocke (`emergency`); `organspende` gezeichnet, nirgends benutzt (Organspende zeigt `health`) | Wörterbuch: «Eine Funktion = ein Icon» |
| 5 | Falsche Bedeutung: `rechner` zeichnet ein Blatt (benutzt für Budget und CSV), `kaestchen` (leeres Kästchen) für Speichern und Export, `download` auf einem Knopf, der nur weiterführt (Sicherung) | Ein Zeichen muss etwas heissen |
| 6 | Gleiche Sache, verschiedene Zeichen: Drucken (1× Drucker, 3× Blatt, 6× nichts), Speichern (Haken / Kästchen / nichts), «Situationen» (3 Icons), Direktlinks und Flyer auf dem Startbildschirm (beide Tresor, im Register Globus und QR) | Konsistenz |
| 7 | Warnsätze mit gesetzlichem Gewicht (Vorsorgeauftrag Formvorschrift, Mieterstreckung, Wegzug, Prämien) tragen kein Warn-Zeichen, Geschwister im selben Stil schon | Konsistenz, Lesbarkeit |

Die einzelnen Fundstellen (Datei und Zeile) werden je Schritt im PR aufgeführt und dort
frisch gegen `main` nachgemessen. Zeilennummern veralten schneller als dieser Plan.

---

## Drei Entscheide vorweg — mit Empfehlung

**E1 · Schicht B wird ganz Strich.** *Empfehlung: ja.* Steht so in der Konvention seit Juli,
wurde nur nie durchgesetzt. Schicht A (Lebensbereiche: Chalet, Fünfliber, Edelweiss …)
bleibt reich und gefüllt, wie das Wörterbuch es will. Dazwischen liegen Themen-Zeichen wie
`insurance`, `health`, `family`, `work`, `legal`, `doctor`: Sie werden **der Schicht A
zugeschlagen** (sie stehen für Lebensbereiche, nicht für Handlungen) und bleiben Fläche.

**E2 · `mappe` geht in `ordner` auf.** *Empfehlung: ja.* Beide sind gleich gezeichnet; das
Wörterbuch kennt nur «Dokumente/Ablage = Bundesordner». Ein Name verschwindet, nichts
Sichtbares ändert sich.

**E3 · `plus` kommt ins Register.** *Empfehlung: ja.* Neunmal steht heute ein getipptes «+»
vor «Hinzufügen». Das Zeichen gibt es schon (`bottomIcon`), es zieht nur um.

Nicht in diesem Plan: die noch ungezeichneten Metaphern aus dem Wörterbuch (Setzling für
Vorsorge, Couvert für Import/Export, Sprechblase, Rettungsring, Sparschwein, Quittung).
Das ist Zeichenarbeit mit eigener Abnahme, kein Aufräumen.

---

## Die Schritte — je ein kleiner Entwurfs-PR

Reihenfolge nach Nutzen und Risiko: zuerst, was Menschen sofort hilft und keine Zeichnung
braucht, dann die Wächter, dann der Umbau.

### Schritt 1 · Warnsätze bekommen ihr Zeichen *(klein, sofort nützlich)*
- Alle `s.warn`-Absätze ohne Zeichen erhalten `hinweisZeichen('warning')`, als eigenes Kind.
- Wächter: jeder Absatz im Warn-Stil beginnt mit dem Warn-Zeichen.
- Kosten: ≈ 0 kB, `warning` liegt schon im Kern.

### Schritt 2 · Gleiche Handlung, gleiches Zeichen *(kein Zeichnen)*
- Drucken → überall `drucker` (10 Stellen).
- Speichern → überall `check`, nie `kaestchen`.
- Export JSON/Manifest → `sicherung` statt `kaestchen`; CSV → `csv` statt `rechner`.
- Budget-Übersicht → `budgetWallet` statt `rechner`.
- Sicherung in Einstellungen und Werkzeug-Register → `sicherung` statt `download`
  (das Herunterladen-Zeichen gehört nur `ZielHinweis`).
- Notfall → überall `notfall`; `emergency` (Glocke) wird nicht mehr für Notfall benutzt.
- Organspende → `organspende`.
- Startbildschirm: Werkzeugliste aus `werkzeugRegister.js` lesen statt eigener Icon-Angaben
  (behebt Direktlinks/Flyer und «Situationen» an der Wurzel).
- Wächter: Tabelle «Handlung → Zeichen» im Test, jede Abweichung rot.

### Schritt 3 · Eine Quelle *(Register vereinen)*
- `bottomIcon` in `main.jsx` liest aus dem Register. Die sieben fehlenden Zeichen ziehen in
  den Kern: `plus`, `uhr`, `geschenk`, `quittung`, `rucksack`, `sackmesser`, `kalenderHeute`.
- `home`, `check`, `ordner` gibt es danach einmal.
- `mappe` → `ordner` (E2). `success` bleibt nur, wo der gefüllte Kreis eine Rückmeldung ist;
  sonst `check`.
- Wächter: kein `createElement('svg'` für Icons ausserhalb des Registers (Erlaubnisliste für
  Illustrationen: Baum, Landschaft, Charts, Loader, Früchte).

### Schritt 4 · Strich passt sich der Grösse an
- `Icon` setzt bei Strich-Icons `strokeWidth = 1,25 × 24 / size` auf das Wurzel-`svg`.
  Kinder ohne eigene Strichstärke erben es.
- Wächter: bei 12, 14, 16, 22 px liegt die optische Strichstärke zwischen 1,1 und 1,4.

### Schritt 5 · Schicht B wird Strich *(E1, die eigentliche Zeichenarbeit)*
- Neu zeichnen als Strich, ruhig, runde Enden: `info`, `warning`, `success`, `error`,
  `delete`, `filter`, `phone`, `debt`, `csv`, `qr`, `barcode`, `timeline`, `document`.
- `warning` und `error` bleiben sanft (Wörterbuch: «nie alarmierend»).
- Erst als Kontaktbogen zeigen (alt neben neu, 14/22/48 px), dann bauen.
- Wächter: jedes Icon der Schicht-B-Liste hat `fill: none` an der Wurzel.

### Schritt 6 · Wörterbuch und Konvention nachführen
- In `icon-dictionary.md` die erledigten 🔄/⚠️ abhaken, in `ICON_KONVENTION.md` die
  Schichtenliste (welches Icon gehört wohin) als Tabelle, die der Wächter aus Schritt 5 liest.
  Eine Quelle für Doku und Test.

---

## Rahmen

- 🛑 **Startbündel:** zuletzt 64,97 von 65 kB (F8). Schritt 3 zieht sieben Zeichen in den
  Kern (je ≈ 50–60 B gzip) und streicht drei Doppelte und `bottomIcon`. Vor dem Bau messen;
  passt es nicht, wandern selten gezeigte Kern-Icons ins nachgeladene Register. **Grenze
  nie anheben.**
- Jeder Schritt: Wächter zuerst rot sehen, dann bauen. Tests, eslint, pii-scan, size-limit.
- Entwurfs-PRs ja (Ausnahme bis 31.12.). Mergen und Deployen bleiben bei Stebler Studios.
- Neue Texte gibt es keine; Schritt 1 und 3 ändern keine Sprachdateien ausser dem Wegfall
  von «+ » vor «Hinzufügen» (alle 5 Sprachen).

## Aufwand, grob

| Schritt | Umfang | Braucht Entscheid |
|---|---|---|
| 1 Warnsätze | klein | nein |
| 2 Gleiche Handlung | mittel | nein |
| 3 Eine Quelle | mittel | E2, E3 |
| 4 Strichstärke | klein | nein |
| 5 Schicht B Strich | gross (Zeichnen + Abnahme) | E1 |
| 6 Doku | klein | nein |

---

## Schritt 7 · Aufräumen — Ordnung vor neuen Zeichnungen

**Auftrag Stebler Studios, 06.11.2026:** «lass uns zu erst aufräumen». Grundlage:
[`design/icon-inventar-2026-11-06.html`](design/icon-inventar-2026-11-06.html).

### Zwei Klärungen vorweg (06.11.2026)

- **Behörden = Helvetia.** Gezeichnet ist sie längst (Münze mit Krone, Speer, Schild,
  `IconMuenzen.jsx`). Das Wörterbuch sagt «Bundeshaus, war Helvetia» — es widerspricht dem
  Bestand. Stebler Studios: «sind Behörden nicht Helvetia» → das Wörterbuch wird nachgeführt.
  Das Inventar führte «Bundeshaus» fälschlich als fehlend; korrigiert.
- **Wilhelm Tell** ist erarbeitet, aber nie gezeichnet. Gesucht in allen 391 Zweigen samt
  Verlauf, im Gedächtnis und in den Projektordnern. Er steht an drei Stellen, mit zwei
  verschiedenen Rollen:
  - Braindump 29 (Juli): als Bild für «Persönliche Basis» (Apfel). Damals geparkt, die
    Empfehlung war: beim Apfel bleiben, das Bild vom Schuss auf den Apfel über dem Kind meiden.
  - `docs/IDEEN.md`: «Wilhelm-Tell-Apfel» bei den Auszeichnungen, ebenfalls geparkt.
  - Icon-Wörterbuch: Bürgerrecht und Einbürgerung = Tell (generisch, ohne Armbrust-Marke).
  → Wird in Schritt 8 (Zeichnen) entschieden, nicht hier.

### Was Aufräumen heisst

| | was | braucht Zuruf? |
|---|---|---|
| 7a | **Eine Liste als Quelle**: jedes Icon mit Gruppe (A · A2 · B · N · Z · E · C) und Bedeutung, im Code. Ein Test verlangt für jedes Icon einen Eintrag — keines ohne Platz | nein |
| 7b | **Lebensereignisse ins Register**: die 39 Strich-Zeichen aus dem Rucksack (`data/gepaeck.js`) werden Register-Icons (Gruppe E). Suche, Übersicht und Seitentitel zeigen dann dasselbe Zeichen wie der Rucksack — nicht mehr 9× Helvetia, 5× Haus, 3× Herz | nein — die Zeichen gibt es schon in der App |
| 7c | **`emergency` (zweite Glocke) entfernen.** Seit #711 nirgends benutzt; die Kuhglocke bleibt «Erinnerungen» | Zuruf mit dieser Antwort |
| 7d | **Wörterbuch nachführen**: Behörden = Helvetia; Schichten wie im Inventar | nein |

### Doppelte — Empfehlung, Entscheid bei Stebler Studios

| Gruppe | Empfehlung |
|---|---|
| Sackmesser `sackmesser` · `dashboard` · `exportTool` | `dashboard` → `sackmesser` (eine Übersicht). `exportTool` bleibt (Entscheid 24.09.: «behalten, nur auf Zuruf») |
| Haken `check` · `success` | beide, mit Rolle: `check` = erledigt, `success` = Rückmeldung «hat geklappt» (Kreis) |
| Haus `wohnen` · `home` | `wohnen` (Chalet) = Lebensbereich, `home` = nur Navigation «Startseite». Umzug, Mietzins & Co. bekommen ihre Rucksack-Zeichen (7b) |
| Blätter `document` · `documents` · `rechner` · `dokumentTresor` | `rechner` → `document` (zeichnet ohnehin ein Blatt); ein echter Rechner erst in Schritt 8 |
| Geld `finanzen` · `money` · `budget` · `budgetWallet` | Wörterbuch G: Fünfliber = Finanzen, Portemonnaie = Budget. `money`/`budget` in Schritt 8 zusammen mit Quittung und Sparschwein |
| Versicherung `versicherungen` · `insurance` | `versicherungen` = Lebensbereich (reich), `insurance` = kleines Themenzeichen — bleibt, Rolle festhalten |
| Kreuz-Familie `notfall` · `health` · `organspende` · `doctor` | Rollen festhalten; Organspende klar von Notfall trennen erst beim Zeichnen |
| Kalender `calendar` · `kalenderUhr` | bleibt (Uhr = Frist, «behalten» 24.09.); generisch zeichnen in Schritt 8 (kein SBB-Zeiger) |
| Telefon `phone` · `handy` | beide bewusst: Hörer = anrufen (Notfallnummern), Handy = App aufs Telefon |
| Schulden `schulden` · `debt` | `debt` → `schulden`? Offen — `debt` ist Strich (Werkzeug), `schulden` Fläche (Kapitel) |

### Reihenfolge

Das Aufräumen berührt dieselben Dateien wie die fünf offenen Code-PRs (#709 #711 #713 #714
#715). Sauberster Weg: diese zuerst mergen (sie sind zusammen getestet: konfliktfrei, 8192
Tests grün), dann baut Schritt 7 auf dem neuen `main`. Bis dahin entsteht er auf einem Zweig
über den fünf und wird nach deren Merge neu aufgesetzt.
