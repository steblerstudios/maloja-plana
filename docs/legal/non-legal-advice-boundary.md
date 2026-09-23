# Abgrenzung zur Rechtsberatung — Maloja Plana

> **Wiederhergestellt aus App-Texten, 15.09.2026.** Diese Datei enthielt seit Commit `b8925ba` (16.05.2026) den englischen Text «Life Events» — jetzt unter `docs/product/life-events.md` — und davor (Commit `995d0b3`) nichts (0 Zeilen). Eine frühere Abgrenzung zur Rechtsberatung gibt es in der git-Historie nicht: geprüft mit `git log --follow`, `git log --all -S "Rechtsberatung" -- docs/legal` und `git show b8925ba --stat`; die Schwesterdatei `docs/legal/disclaimers.md` wurde in `995d0b3` leer angelegt und in `e958902` leer gelöscht. Was unten steht, fasst zusammen, was die App selbst sagt; die Quelle steht bei jedem Satz. Nicht juristisch geprüft. DSFA-Entwurf: Abschnitt 7 Punkt 7.

---

## Was Maloja Plana ist

Ein persönliches Organisationswerkzeug, das hilft, Informationen zum eigenen Leben in der Schweiz zu ordnen (`legal.terms.scope1`). Ein Orientierungswerkzeug — die Rechner basieren auf öffentlich zugänglichen Rechtsgrundlagen und dienen der persönlichen Information (`impressum.md`, Haftungsausschluss).

## Was Maloja Plana nicht ist

- Keine Rechtsberatung, keine Finanzberatung, keine medizinische Beratung (`legal.terms.noAdvice1`).
- Berechnungen (Budget, Sozialhilfe, Prämienverbilligung, Steuern) dienen ausschliesslich der Orientierung und können von den tatsächlichen Ansprüchen abweichen (`legal.terms.noAdvice2`).
- Alle Angaben sind bei der zuständigen Behörde oder einer Fachstelle zu prüfen (`legal.terms.noAdvice3`).
- Maloja Plana ersetzt keine Rechts-, Steuer-, Versicherungs- oder Finanzberatung (`impressum.md`).

## Genauigkeit

- Schweizer Regelungen (SKOS, KVG, AHV, BVG, EL) werden nach bestem Wissen abgebildet, können aber veraltet oder unvollständig sein (`legal.terms.accuracy1`).
- Kantonale Unterschiede werden nur teilweise berücksichtigt (`legal.terms.accuracy2`).

## Eigenverantwortung und Haftung

- Die nutzende Person ist selbst dafür verantwortlich, die Richtigkeit ihrer Angaben und die Aktualität ihrer Dokumente zu prüfen; Maloja Plana übernimmt keine Haftung für Entscheidungen auf Basis der angezeigten Informationen (`legal.terms.responsibility1`).
- Für Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird keine Gewähr übernommen (`legal.imprint.disclaimer1`).
- Massgebend sind ausschliesslich die geltenden Gesetze und die zuständigen Behörden (`impressum.md`).

## Wo die Abgrenzung in der App steht

- Tab «Nutzung» unter Rechtliches: Abschnitt «Keine Rechts- oder Finanzberatung» (`legal.terms.noAdvice*`), «Genauigkeit» (`accuracy*`), «Eigenverantwortung» (`responsibility*`).
- Tab «Impressum»: Haftungsausschluss (`legal.imprint.disclaimer1`).
- Fusszeilen der Lebenssituationen, wiederkehrender Satz «Dies ist Orientierung, keine Rechtsberatung.» (die zehn `…​.footerNote`-Schlüssel). Ob jede Lebenssituation diesen Satz trägt, ist nicht gezählt.
- Brief-Vorlagen: «Diese Vorlage ist eine Orientierungshilfe, keine Rechtsberatung.» (`briefe.*.legalNote`).
- Notfallkarte: «Orientierung, kein medizinischer oder rechtlicher Rat — im Notfall zählt der Notruf (144).» (`notfallkarte`-Block).
- Dokumente: `docs/legal/impressum.md` (Haftungsausschluss), `docs/legal/nutzungsbedingungen.md`.

> **Zeilennummern entfernt, 23.09.2026.** Die Verweise zeigten auf Zeilen in
> `src/i18n/de.js`, die es so nicht mehr gibt — sie stammten vom 15.09. und die Datei
> ist seither gewachsen. Stichprobe: «Z. 1719 `legal.terms.scope1`» traf
> `ansichtFlach: 'Flache Ansicht'`. Für ein Dokument, dessen Methode «die Quelle steht
> bei jedem Satz» ist, war das der teuerste Fehler: **die Belege zeigten ins Leere, und
> ein leeres Ergebnis sieht aus wie ein Befund.** Jetzt stehen Schlüsselnamen —
> die altern nicht mit der Zeilenzahl.

## Nachgemessen am 23.09.2026

Die ersten zwei Punkte unten waren offen («nicht geprüft», «nicht gezählt»). Sie sind
jetzt gezählt — und seither hält ein Test das Ergebnis fest
(`src/__tests__/regulierungsgrenzen.test.js`, Teil A):

- **Alle fünf Sprachfassungen tragen die Sätze.** In `de`, `fr`, `it`, `rm` und `en`
  trägt **jede** der 10 `footerNote`-Fusszeilen einen Orientierungs- bzw.
  Keine-Beratung-Hinweis — 0 ohne.
- **Zwei Ansichten trugen ihn nicht:** `KVGWechsel.jsx` und `ZusatzWechsel.jsx` waren
  die einzigen Ablauf-Ansichten ohne solchen Hinweis im Fuss — ausgerechnet die zwei,
  die an eine Versicherung heranführen. Ergänzt am 23.09.2026 mit dem bestehenden
  Schlüssel `alpha.noAdviceHint` («Maloja Plana dient der Orientierung und ersetzt
  keine Rechts-, Steuer- oder Versicherungsberatung»), der schon in `SchuldenManager`,
  `EOrechner`, `Saeule3aTracker` und `BudgetSync` steht.
- **Nebenbefund, ebenfalls behoben:** Der Platzhalter im Feld «Wunsch-Kasse» nannte in
  allen fünf Sprachen «Helsana» — der einzige Kassenname im ganzen Wechselpfad. Jetzt
  neutral («Name der Kasse»), damit der Pfad keine Kasse bevorzugt.

- **Am Bild geprüft, 23.09.2026:** In der laufenden App (Beispiel-Modus, `#`-Ansichten)
  zeigen **15 von 15** gerechneten Ansichten einen Hinweis im gerenderten Text —
  `sozialhilfe`, `tax`, `alv`, `eo`, `vorsorge`, `praemien`, `mietzins`, `schulden`,
  `premium`, `pflege`, `stipendien`, `kvg`, `anspruchcheck`, `schnellcheck`,
  `finanzuebersicht`. Keine verlässt sich allein auf das Wort «Schätzung»: es steht
  überall «Orientierung», «Unverbindlich» oder «Keine rechtsverbindliche Auskunft».
  Beim Vorsorge-Rechner wurden alle fünf Reiter einzeln angeklickt.
  *Erste Messung sagte «Vorsorge-Rechner: fehlt» — sie war falsch: das Suchmuster
  kannte «Keine rechtsverbindliche Auskunft» nicht. Gemessen wurde das Messgerät.*
- **Seit 23.09.2026 hält ein Test diese Zusage**, nicht mehr die Handmessung:
  `src/__tests__/hinweisImBild.test.js` rendert alle 15 Ansichten mit den echten
  deutschen Texten und prüft, ob die Aussage «Orientierung / unverbindlich / keine
  rechtsverbindliche Auskunft» im Bild steht. Dass er beisst, ist mit einer
  Mutationsprobe belegt: den Hinweis im KVG-Wechselpfad entfernt → rot, zurückgebaut
  → grün. Er rendert den Anfangszustand; eine Ansicht, die ihren Hinweis erst nach
  einer Eingabe zeigte, fiele durch.
- `budget` (CSV-Import) trägt keinen solchen Hinweis und braucht keinen — dort wird
  nichts gerechnet, nur eine Datei eingelesen.

## Was hier nicht belegt ist
- Ob diese Formulierungen als Haftungsausschluss rechtlich tragen — Frage an die
  juristische Prüfung (K48). Einordnung des Umfelds:
  `docs/security/compliance-overview.md`.

---

Stand: 15.09.2026, auf Code-Stand `main` 9e6d9b1 gebracht, nicht juristisch geprüft.
