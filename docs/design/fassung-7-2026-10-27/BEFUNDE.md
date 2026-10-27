# Fassung 7 · Rundgang durch alle Seiten · Befunde

Angefangen 27.10.2026, 01:50, auf Sophies Zuruf («wir wollen sauber weiter durch alle Seiten … weiter mit unserer Fassung»).
Grundlage: `main` `d9aa8e06`, im Browser (Vite dev, Beispiel Maria Muster, 1280 px). Vergleich gegen
`docs/design/mockups-stardust-2026-10-23/VERGLEICH.md` (Fassung 5/6) und `docs/audits/SEITENRUNDGANG-2026-10.md`.

Je Seite sechs Fragen: **Umgesetzt?** (Entscheid aus VERGLEICH gebaut) · **Stimmt?** (Zahlen, Quellen, Sprache) ·
**Flow** (woher, wohin, nächster Schritt) · **Aufbau/Logik** · **Fusion** (doppelt, zusammenlegen) ·
**Zeigen** (Graph, Netz, Band statt Text — oder weniger).

Nichts davon ist gebaut. Jeder Punkt wartet auf Sophies Entscheid.

## Runde 1 · Dashboard

Reihenfolge heute (von oben): Landschaft mit 8 Wegmarken + «7/7 begonnen» + «63 % ausgefüllt» · Hinweis «Frühe
Version» · «Was ist jetzt dran?» · «Ihr Fortschritt 70 %» mit 7 Balken · «Was steht mir zu?» / Rucksack ·
Leistungs-Kompass (Einkommen, IPV, Sozialhilfe, Stipendien, ALV, EO) · «Ihre Instrumente» (4) · «Ihr Alltag /
Ihre Absicherung / Ihr Schutz» (7 Kapitel-Zeilen) · Obstgarten · Werkzeuge & Features (7 Gruppen) ·
Sicherungs-Hinweis · «Tipps für den Anfang».

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-D1 | Fusion | **Die 7 Kapitel stehen dreimal** auf einer Seite: als Wegmarken in der Landschaft, als Balken unter «Ihr Fortschritt», als Zeilen unter «Ihr Alltag/Absicherung/Schutz». | Eine Stelle. Landschaft = Einstieg; darunter nur noch die Zeilen mit Zusammenfassung **und** Fortschritt in einem. |
| F7-D2 | Stimmt | **Drei verschiedene Fortschrittszahlen**: «7/7 begonnen», «63 % ausgefüllt» (Landschaft), «70 %» (Ihr Fortschritt), dazu «Grundordnung 15/15». | Eine Zahl, eine Rechnung. |
| F7-D3 | Logik | «Tipps für den Anfang: Beginnen Sie mit Persönliche Basis …» erscheint, obwohl «Ihre Grundordnung steht 15/15». Der Tipp nennt «Budget-Sync», ein Name, den es sonst nirgends gibt. | Tipps nur im Leerzustand zeigen. |
| F7-D4 | Fusion | Sicherung zweimal: «Noch keine Sicherungsdatei erstellt» (oben) und «Sie haben noch keine Sicherung erstellt … Jetzt sichern» (unten). | Einmal, oben bei «Was ist jetzt dran?». |
| F7-D5 | Fusion | Leistungs-Kompass auf dem Dashboard rechnet IPV/Sozialhilfe/ALV an, «Was steht mir zu?» daneben verweist auf denselben Inhalt als eigene Seite. | Kompass auf «Was steht mir zu?» verlegen, Dashboard zeigt nur den Einstieg. |
| F7-D6 | Stimmt | «Bedarf ≈ 3’431.3» ohne CHF, mit Nachkommastelle. | `geld.js`, «CHF 3’431». |
| F7-D7 | Stimmt | Versicherungen: «CHF 540.3, Franchise 1’500» (bekannt als W5/D4, nicht behoben). | «CHF 540.30 / Mt. · Franchise CHF 1’500». |
| F7-D8 | Sprache/a11y | Deko-Objekte in der Landschaft und den Kapitel-Karten werden als Text gelesen: «5 FR. 2026», «HELVETIA». | `aria-hidden` für Deko. |
| F7-D9 | Aufbau | Seite ist sehr lang (13 Blöcke). Regel «eine Primär-Aktion» (D5 aus Rundgang 26.10.) weiter verletzt. | Gliederung: 1 Landschaft · 2 Jetzt dran · 3 Kapitel · 4 Instrumente · 5 Werkzeuge. Rest weg oder in Kapitel. |
| F7-D10 | Zeigen | «Ihre Instrumente» (Franchise-Kreuz, Steuer-Säule, Tankanzeige, Schutzschild) sind kleine Icons mit Satz. Sie stehen getrennt von den Kapiteln, zu denen sie gehören. | Instrument direkt in die Kapitel-Zeile (Versicherungen → Schutzschild, Finanzen → Tankanzeige). |

## Runde 1 · Kapitel Persönliche Basis

Aufbau sauber: Satz-Zusammenfassung · Angaben/Dokumente · «Passend zu diesem Bereich» · «Als Nächstes». Kein Instrument
oben (Entscheid Y: Basis bleibt ruhig).

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K0-1 | Sprache/a11y | «HELVETIA» (Deko auf dem Pass-Symbol) wird in «Passend zu diesem Bereich» als Text gelesen. | wie F7-D8 |
| F7-K0-2 | Zeigen | Einzige Kapitelseite ohne Instrument. Bei 6/9 Angaben wäre ein ruhiger Vollständigkeits-Ring möglich — oder bewusst nichts. | entscheiden |

## Runde 1 · Kapitel Wohnen & Leben

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K1-1 | **Stimmt (Fehler)** | Mietbarometer: unter «Ihre Miete: CHF 1’650» steht «rund 20 % über dem Schweizer Schnitt». Die 20 % sind aber **Region gegen Schweiz** (1’732 / 1’446), nicht Marias Miete. Marias Miete liegt 5 % **unter** dem Regionsschnitt und 14 % über dem Landesschnitt. Beleg `RegionalBarometer.jsx:49, 95` (`diffPct` aus `getRegionalComparison`). | Satz auf die eigene Miete beziehen: «Ihre Miete liegt rund 5 % unter dem Schnitt Ihrer Region.» |
| F7-K1-2 | Stimmt | Beispiel Maria hat keine Zimmerzahl → Vergleich mit «angenommen 3 Zimmer». | Zimmerzahl ins Beispiel. |
| F7-K1-3 | Stimmt | «29.5 % des Einkommens (CHF 6’200)»: netto oder brutto steht nicht dabei. | «des Nettoeinkommens». |

## Runde 1 · Kapitel Finanzen & Geld

Reihenfolge heute: «Jeden Monat bleiben» mit Balken · Angaben · **Lebensbaum (alle Kapitel)** · Kuchen «Wofür geht es
weg?» · «Wo steht Ihr Lohn?» + 18 Branchen · Steuern · IPV · KK-Last · Gesundheitskosten · Vermögen/Notgroschen ·
Weitere Ansprüche · Passend · Drucken. Geldfluss erscheint erst ab zwei Einnahmequellen (Entscheid umgesetzt,
`FinanzAuswertung.jsx:598-602`); Maria sieht ihn nicht.

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K2-1 | **Aufbau/Fusion** | Der **Lebensbaum zeigt alle 7 Kapitel** (Notfall 85 %, Ausbildung 82 % …) mitten im Kapitel Finanzen. Er ist eine Sicht über das ganze Leben, nicht über Geld. | Baum aufs Dashboard (ersetzt dort die dreifache Kapitel-Liste F7-D1) oder in den Obstgarten. |
| F7-K2-2 | Fusion | Dieselbe Aufteilung zweimal: Stapelbalken oben («Wohnen · Versicherungen · Steuern · Übriges») und Kuchen «Wofür geht es weg?» weiter unten. | Ein Bild. Vorschlag: Balken oben aufklappbar zu den Posten, Kuchen weg. |
| F7-K2-3 | **Stimmt** | Zwei verschiedene Brutto-Schätzungen aus denselben CHF 6’200 netto: Dashboard «≈ brutto CHF 6’796», Lohn-Vergleich «Ihr Lohn: CHF 6’472». | prüfen, welche gilt; eine Rechnung. |
| F7-K2-4 | **Logik** | IPV: Kapitel sagt «Kein Anspruch, Einkommen über Grenze (CHF 61’090)», Dashboard-Kompass sagt «Hängt von Kanton und Einkommen ab — geben Sie im Rechner ein». Gleiche Daten, zwei Aussagen. | Dashboard übernimmt das Kapitel-Ergebnis. |
| F7-K2-5 | Aufbau | Seite ist die längste der App (14 Blöcke). Die Auswertung (Lohn, Steuern, IPV, KK-Last, Vermögen) steht **unter** den Rohangaben. | Auswertung vor die Angaben, wie bei Wohnen (Instrument oben). |
| F7-K2-6 | Zeigen | 18 Branchen als Balkenliste, Jahre gemischt ’22/’24. Für Maria zählt eine: Gesundheit. | Eigene Branche hervorheben, Rest aufklappbar. |
| F7-K2-7 | Stimmt | Steuer geschätzt CHF 703/Mt., im Budget CHF 850 erfasst. Wird genannt — gut. Kein Fehler. | – |

## Runde 1 · Kapitel Versicherungen & Vorsorge

Reihenfolge: «Versicherungen pro Monat CHF 570» · KK-Last · Schutzschild (Pflicht 3/3, Empfohlen 2/2) · Franchise-Kreuz ·
Angaben mit Unterreitern (Krankenkasse, Pensionskasse, Weitere, Hausrat & Reise, Auto, AHV) · Passend. Das Spinnennetz
(AA-6) erscheint nicht mehr. CHF 570 = 540.30 + 20 + 10 stimmt.

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K3-1 | Fusion | **KK-Last** (8.7 %, WHO 10 %) steht wortgleich in Finanzen **und** Versicherungen. | Nur Versicherungen; Finanzen verweist. |
| F7-K3-2 | Fusion | **Franchise-Kreuz** an drei Orten: Dashboard-Instrument, Kapitel, Versicherungs-Übersicht («Alles zur Franchise»). | Ganz nur in der Übersicht; Kapitel zeigt die Empfehlung in einer Zeile mit Link. |
| F7-K3-3 | Logik | Kreuz vergleicht nur Franchise 300 und 2’500. Marias **eigene Franchise 1’500** kommt im Bild nicht vor. | Eigene Franchise als dritte Linie oder als Punkt. |
| F7-K3-4 | Zeigen | Drei Instrumente untereinander (Monatssumme, Last, Schild, Kreuz) vor den Angaben, die Angaben selbst kommen spät. | Schild als Kopf-Instrument, Rest einklappbar. |
| F7-K3-5 | Sprache/a11y | «Fr» (Deko auf Münz-Symbol) vor «Vorsorge-Rechner» als Text gelesen. | wie F7-D8 |

## Runde 1 · Kapitel Ausbildung & Arbeit

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K4-1 | **Fusion** | **«Wo steht Ihr Lohn?» steht zweimal**, identisch, in Finanzen und in Ausbildung. Hängt mit K-G8 zusammen (Arbeitgeber in beiden Kapiteln, Entscheid offen). | Lohn gehört zu Arbeit: nur hier, Finanzen zeigt Einkommen. Mit K-G8 zusammen entscheiden. |
| F7-K4-2 | **Stimmt (Fachlich)** | Beispiel Maria: «Höchster Abschluss Bachelor, ZHAW» und zugleich «Pflegefachfrau **HF**». HF ist ein Abschluss der Höheren Fachschule, kein Bachelor; ZHAW-Absolventinnen heissen «Pflegefachfrau FH / BSc». | Beispiel angleichen: entweder HF + Höhere Fachschule oder BSc Pflege + FH. |
| F7-K4-3 | Gut | Lebenslauf-Vorschau direkt im Kapitel (Entscheid AC) — gut, das ist der stärkste nächste Schritt der App. | – |

## Runde 1 · Kapitel Behörden & Rechtliches

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K5-1 | **Fusion** | **Steuern sind auf vier Orte verteilt**: Dashboard «Steuer-Säule», Finanzen «Steuern ~ CHF 8’431/J.», Behörden «Steuerfrist» + «Steuerbetrag und Belastung → Kapitel Finanzen», Werkzeug «Steuern». | Ein Faden «Steuern»: Betrag in Finanzen, Frist in Behörden, beide verweisen gegenseitig mit derselben Zahl. Dashboard-Säule weg (F7-D10). |
| F7-K5-2 | **Fusion** | **Vorsorge doppelt**: Behörden «Für den Fall der Fälle» (Testament, Vorsorgeauftrag, Patientenverfügung) und Notfall «Vorsorge» (Organspende, Patientenverfügung, Vorsorgeauftrag, Bestattung). | Vorsorge ganz in Notfall («an einem Ort», so steht es schon auf dem Dashboard). Behörden behält nur das Testament und verweist. |
| F7-K5-3 | Sprache/a11y | «HELVETIA» dreimal als Text gelesen. | wie F7-D8 |

## Runde 1 · Kapitel Notfall

Entscheid AE «ein Ort» ist gebaut: Notfallkarte-Knopf oben, Kontakt anrufen, «Bereit für den Ernstfall 18 von 20»,
drei Szenarien, vier Unterlagen (Karte, Pass, Dossier, Portemonnaie-Karte), Vorsorge, Angaben.

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K6-1 | Fusion | **Patientenverfügung dreimal auf derselben Seite**: «Bereit für den Ernstfall» (fehlt für Spitalaufenthalt), Block «Vorsorge» («Noch nicht · erstellen»), Angaben «Vorsorge». | Nur im Block Vorsorge; «Bereit» verlinkt dorthin. |
| F7-K6-2 | Flow | Im Beispiel steht unter «Regelmässige Medikamente» ein leeres Eingabefeld und darunter «Im Beispiel-Modus können keine Daten bearbeitet werden». | Im Beispiel Feld nicht zeigen, nur den Satz. |
| F7-K6-3 | Gut | Ende «Alle Kapitel durchgegangen · Zur Übersicht» schliesst den Kreis. | – |

## Runde 1 · quer über alle Kapitel

| # | Befund | Vorschlag |
|---|---|---|
| F7-Q1 | Muster ist einheitlich gebaut (Satz · Instrument · Angaben/Dokumente · Passend · Als Nächstes · Schlusssatz). Fassung 6 «Muster M1–M8» hält. | – |
| F7-Q2 | Die grossen Wiederholungen sind **inhaltlich**, nicht gestalterisch: Lohn (2×), KK-Last (2×), Franchise-Kreuz (3×), Steuern (4×), Vorsorge (2×), Kapitel-Liste auf dem Dashboard (3×), Brutto-Schätzung (2 Werte). | Je Thema **ein Besitzer-Kapitel**, alle anderen Stellen zeigen eine Zeile mit derselben Zahl und Link. Das ist der Kern von Fassung 7. |
| F7-Q3 | Lebensbaum (alle Kapitel) steht im Kapitel Finanzen. | aufs Dashboard, siehe F7-K2-1 |
