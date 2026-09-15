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

*Zwei Bugs aus der Crosslink-Prüfung vom 15.09.2026 (Bau-Liste K10). Beide sind am Code
nachgestellt, beide brauchen vor dem Fix einen Entscheid von Stebler Studios, weil der Fix
festlegt, welche Zahl bzw. welcher Kanton gilt. Die ganze Prüf-Tabelle je Rechner steht in
`docs/legal/freigabe-register.md` §2; der Ist-Zustand ist in
`src/__tests__/crosslinkKanton.test.js` festgehalten.*

### B-1 · Zahlen aus dem Schnellcheck kommen im IPV-Rechner nicht an

- **Versprochen:** Schnellcheck und Anspruch-Check zeigen «Prämienverbilligung» mit Betrag und
  verlinken in den IPV-Rechner (`Schnellcheck.jsx:159`, `AnspruchCheck.jsx:94`, Ziel `view: 'premium'`).
- **Hält nicht:** Einkommen, Miete und Prämie, die man im Schnellcheck eintippt, leben nur im lokalen
  Zustand (`Schnellcheck.jsx:21–23`, im Anspruch-Check als `probe`, `AnspruchCheck.jsx:19`). Sie
  werden nie ins Profil geschrieben, und `handleNavigate` (`main.jsx:767`) trägt nur den Namen der
  Ansicht. Der IPV-Rechner rechnet mit dem Profil (`main.jsx:1323` → `PremiumSubsidy.jsx:45`
  `calculateIPV(data)`).
- **Nachstellen:**
  1. Neues Profil, im Onboarding Kanton Bern wählen, kein Einkommen erfassen.
  2. Schnellcheck öffnen (auch Schritt 1 im Anspruch-Check), Einkommen 3000 eintragen → die Zeile
     «Prämienverbilligung» erscheint mit Betrag.
  3. Auf die Zeile tippen → der IPV-Rechner zeigt die Aufforderung «Einkommen eingeben» statt des
     Betrags.
  4. Variante: im Profil 5000/Monat erfasst, im Schnellcheck 3000 → der Schnellcheck zeigt eine
     Verbilligung, der IPV-Rechner «keine Verbilligung» (rechnet mit 5000).
- **Kanton und Haushalt sind nicht betroffen:** beide liest der IPV-Rechner korrekt aus dem Profil.
  Die Aussage «der IPV-Rechner übernimmt Eingaben nicht» stimmt also nur für die Eingaben *aus dem
  Schnellcheck*, nicht fürs Profil.
- **Warum noch kein Fix:** zwei Wege, beide ändern Verhalten. (a) Der Schnellcheck schreibt ins
  Profil — widerspricht seinem Versprechen «hier frei anpassbar zum Ausprobieren»
  (`Schnellcheck.jsx:12–13`). (b) Die Probe-Zahlen gehen als Übergabe an den IPV-Rechner, ohne das
  Profil zu ändern — neuer Navigations-Parameter in `main.jsx`, und der IPV-Rechner muss sichtbar
  sagen, dass er mit Schnellcheck-Zahlen rechnet. **Entscheid Stebler Studios.** Der rote Test wird
  mit dem gewählten Weg geschrieben, weil er genau dessen Verhalten festschreibt.

### B-2 · Steuerrechner: der gewählte Kanton wird gespeichert, aber nie wieder gelesen

- **Versprochen:** der Knopf «Speichern» im Steuerrechner speichert die Eingaben, darunter den Kanton.
- **Hält nicht:** das Kantonsfeld startet mit `basis.canton` (`TaxCalculator.jsx:26`). Beim Speichern
  landet der Kanton aber als `canton` auf der obersten Ebene des Datensatzes (`TaxCalculator.jsx:74`
  → `main.jsx:1309–1313`). Diesen Schlüssel liest kein Code: die zwei Stellen, die `data.canton`
  lesen (`MirrorCards.jsx:89, :554`), bekommen die Kapitel-Daten (`ChapterView.jsx:1113`), meinen
  also `basis.canton`.
- **Nachstellen:**
  1. Onboarding mit Kanton Zürich.
  2. Steuerrechner öffnen → Zürich ist vorgewählt (richtig).
  3. Auf Genf stellen, «Speichern».
  4. Wegnavigieren und den Steuerrechner wieder öffnen → wieder Zürich.
- **Warum noch kein Fix:** es ist ein Entscheid, welcher Kanton für die Steuer gilt. Steuerkanton und
  Wohnkanton können verschieden sein, und das Profil hat dafür schon ein eigenes Feld
  (`behoerden.cantoneOfTaxation`, gefüllt in `main.jsx:680, :689`), das der Steuerrechner heute
  nicht liest. Möglich: (a) im Steuerrechner `cantoneOfTaxation` lesen und schreiben, (b) den Kanton
  in `taxData` speichern und beim Öffnen bevorzugen, (c) nach `basis.canton` schreiben — dann rechnen
  auch IPV und Sozialhilfe mit dem neuen Kanton. **Entscheid Stebler Studios.**

## Geprüft — kein offener Bug (2026-07-08)

Vier Punkte standen kurz hier, aus dem Gedächtnis. Beim Nachstellen zeigte sich: keiner ist ein Bug. Festgehalten, damit sie nicht als Phantome wiederkommen.

- **IK-Leerzustand (Zukunft-Reiter)** → *kein Bug.* Der IK-Leerzustand ist gebaut und funktioniert (AHV-Reiter, `EmptyState`). Der IK-Auszug wird nur im AHV-Reiter gezeigt. „IK auch im Zukunft-Reiter" ist ein **Feature-Wunsch** (nie zurück-navigieren müssen) → Backlog.
- **Zinsknick bei 20 000** → *kein Bug.* Die Projektion rechnet glatt (Zinseszins pro Jahr, keine Schwelle im Code). Die 20 000-Grenze ist nur ein Strategie-Hinweis. Reale Bank-Schwellen abzubilden wäre ein **Modell-Ausbau** → Backlog.
- **3a-Rollover** → *kein Bug.* Der Jahr-für-Jahr-Übergang stimmt. Ein echter Rollover/Drawdown in der Rentenphase ist eine **Ausbaustufe** → Backlog.
- **Rot-Grün-Falle (sage/rosé)** → *kein einzelner Bug, echtes Anliegen.* Farbenblind-Modus + Form-Marker sind schon da (opt-in, Okabe-Ito). Ob weitere Stellen Form-Marker brauchen, klärt ein **fokussierter A11y-Durchgang** — kein einzelner reproduzierbarer Fehler.

## Zuletzt behoben

*(Neueste zuoberst. Nur zum Nachschauen — schön, wenn die Liste hier wächst.)*

- 2026-07-08 · Zukunft-Graph nannte AHV/BVG-Säulen, auch wenn es sie gar nicht gab → nur vorhandene Säulen werden benannt (`9134b86`).
