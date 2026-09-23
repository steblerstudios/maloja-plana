# Abgrenzung zur Rechtsberatung — Maloja Plana

> **Wiederhergestellt aus App-Texten, 15.09.2026.** Diese Datei enthielt seit Commit `b8925ba` (16.05.2026) den englischen Text «Life Events» — jetzt unter `docs/product/life-events.md` — und davor (Commit `995d0b3`) nichts (0 Zeilen). Eine frühere Abgrenzung zur Rechtsberatung gibt es in der git-Historie nicht: geprüft mit `git log --follow`, `git log --all -S "Rechtsberatung" -- docs/legal` und `git show b8925ba --stat`; die Schwesterdatei `docs/legal/disclaimers.md` wurde in `995d0b3` leer angelegt und in `e958902` leer gelöscht. Was unten steht, fasst zusammen, was die App selbst sagt; die Quelle steht bei jedem Satz. Nicht juristisch geprüft. DSFA-Entwurf: Abschnitt 7 Punkt 7.

---

## Was Maloja Plana ist

Ein persönliches Organisationswerkzeug, das hilft, Informationen zum eigenen Leben in der Schweiz zu ordnen (`src/i18n/de.js` Z. 1719, `legal.terms.scope1`). Ein Orientierungswerkzeug — die Rechner basieren auf öffentlich zugänglichen Rechtsgrundlagen und dienen der persönlichen Information (`impressum.md`, Haftungsausschluss).

## Was Maloja Plana nicht ist

- Keine Rechtsberatung, keine Finanzberatung, keine medizinische Beratung (Z. 1722, `legal.terms.noAdvice1`).
- Berechnungen (Budget, Sozialhilfe, Prämienverbilligung, Steuern) dienen ausschliesslich der Orientierung und können von den tatsächlichen Ansprüchen abweichen (Z. 1723, `noAdvice2`).
- Alle Angaben sind bei der zuständigen Behörde oder einer Fachstelle zu prüfen (Z. 1724, `noAdvice3`).
- Maloja Plana ersetzt keine Rechts-, Steuer-, Versicherungs- oder Finanzberatung (`impressum.md`).

## Genauigkeit

- Schweizer Regelungen (SKOS, KVG, AHV, BVG, EL) werden nach bestem Wissen abgebildet, können aber veraltet oder unvollständig sein (Z. 1726, `accuracy1`).
- Kantonale Unterschiede werden nur teilweise berücksichtigt (Z. 1727, `accuracy2`).

## Eigenverantwortung und Haftung

- Die nutzende Person ist selbst dafür verantwortlich, die Richtigkeit ihrer Angaben und die Aktualität ihrer Dokumente zu prüfen; Maloja Plana übernimmt keine Haftung für Entscheidungen auf Basis der angezeigten Informationen (Z. 1729, `responsibility1`).
- Für Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird keine Gewähr übernommen (Z. 1755, `legal.imprint.disclaimer1`).
- Massgebend sind ausschliesslich die geltenden Gesetze und die zuständigen Behörden (`impressum.md`).

## Wo die Abgrenzung in der App steht

- Tab «Nutzung» unter Rechtliches: Abschnitt «Keine Rechts- oder Finanzberatung» (`legal.terms.noAdvice*`, Z. 1721–1724), «Genauigkeit» (Z. 1725–1727), «Eigenverantwortung» (Z. 1728–1729).
- Tab «Impressum»: Haftungsausschluss (`legal.imprint.disclaimer1`, Z. 1755).
- Fusszeilen der Lebenssituationen, wiederkehrender Satz «Dies ist Orientierung, keine Rechtsberatung.» (u. a. Z. 334, 364, 383, 407, 433, 457, 482, 502, 524, 542). Ob jede Lebenssituation diesen Satz trägt, ist nicht gezählt.
- Brief-Vorlagen: «Diese Vorlage ist eine Orientierungshilfe, keine Rechtsberatung.» (Z. 2560, 2574, 2591).
- Notfallkarte: «Orientierung, kein medizinischer oder rechtlicher Rat — im Notfall zählt der Notruf (144).» (Z. 266).
- Dokumente: `docs/legal/impressum.md` (Haftungsausschluss), `docs/legal/nutzungsbedingungen.md`.

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

## Was hier nicht belegt ist

- Ob jede **Berechnung** im Bild einen Orientierungs-Hinweis zeigt — die Rechner
  verweisen alle auf Orientierung (`grep`, 10 von 10 Dateien), aber ob der Hinweis in
  jedem Zustand **sichtbar gerendert** wird, ist nicht am Bild geprüft.
- Ob diese Formulierungen als Haftungsausschluss rechtlich tragen — Frage an die
  juristische Prüfung (K48). Einordnung des Umfelds:
  `docs/security/compliance-overview.md`.

---

Stand: 15.09.2026, auf Code-Stand `main` 9e6d9b1 gebracht, nicht juristisch geprüft.
