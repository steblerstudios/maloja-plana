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
**Spinnennetz** (6 Achsen: Krankenkasse, Pensionskasse, Weitere, Hausrat & Reise, Auto, AHV) · Angaben mit Unterreitern · Passend.
CHF 570 = 540.30 + 20 + 10 stimmt. ⟨korrigiert 27.10. um 01:58: hier stand zuerst «Spinnennetz erscheint nicht mehr». Es ist reine
Grafik ohne Text und fehlte darum in der Textauswertung; im Bild ist es da, `ChapterView.jsx:2433-2445`.⟩

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-K3-1 | Fusion | **KK-Last** (8.7 %, WHO 10 %) steht wortgleich in Finanzen **und** Versicherungen. | Nur Versicherungen; Finanzen verweist. |
| F7-K3-2 | Fusion | **Franchise-Kreuz** an drei Orten: Dashboard-Instrument, Kapitel, Versicherungs-Übersicht («Alles zur Franchise»). | Ganz nur in der Übersicht; Kapitel zeigt die Empfehlung in einer Zeile mit Link. |
| F7-K3-3 | Logik | Kreuz vergleicht nur Franchise 300 und 2’500. Marias **eigene Franchise 1’500** kommt im Bild nicht vor. | Eigene Franchise als dritte Linie oder als Punkt. |
| F7-K3-4 | Zeigen | Drei Instrumente untereinander (Monatssumme, Last, Schild, Kreuz) vor den Angaben, die Angaben selbst kommen spät. | Schild als Kopf-Instrument, Rest einklappbar. |
| F7-K3-6 | **Umgesetzt? / Zeigen** | **Das Spinnennetz steht noch.** Entscheid AA-6 war «Netz nur bis M2»; M2 steht seit #581 (im Rundgang 26.10. als «vergessen» gemeldet). Dazu offen: «Spinnennetz Versicherungen · offene Frage» in VERGLEICH.md. Das Netz zeigt, **wie viel eingetragen** ist; das Schutzschild direkt darüber zeigt, **was gedeckt** ist. Zwei Bilder für zwei ähnliche Fragen, die Leute verwechseln werden. | Entscheiden: Netz weg (wie AA-6), oder Netz behalten und dafür Schild + Netz zu **einem** Bild verbinden (Achse = Versicherung, Füllung = gedeckt, Rand = vollständig erfasst). |
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

## Landkarte · alle Seiten (Code-Lesung 27.10.2026, Explore-Agent, geprüft wo markiert)

Vollständig mit Fundstellen in der Agenten-Antwort dieser Sitzung; hier das, was für Fassung 7 zählt. **Vorhandenes
Entscheidungsblatt beachten: `docs/entscheide/seiten-buendeln.md`** (Gruppen A–I). Stand dort: A Ansprüche
zurückgestellt · B Versicherungs-Übersicht neu entschieden (§11), **nicht gebaut** · D Notfall Schritt 1 gebaut, Pass und
Dossier offen · E, F, H gebaut · I (Reste Finanzen: budget, taxImport) offen.

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-L1 | Flow | **Waisen**: «Lehre beginnen», «Selbständig werden», «18 werden» und «Organspende» haben **keinen** Eingang aus einem Kapitel oder Ablauf, nur über Listen (Rucksack, Suche). Weitere mit nur einem Eingang: Merkliste, Obstgarten, Gesundheit/Arztkoffer, Kreditkarte, Stundenlohn, Quellensteuer, Zusammenziehen, Adoption, Zuzug, Wegzug, Dienst, Betreibungsauszug, Flyer. | Lehre und Selbständigkeit ins «Passend» von Ausbildung; 18 werden in Basis; Organspende in Notfall-Vorsorge. |
| F7-L2 | Flow | **14 Sackgassen**: kk, budget, organ, sync, kreditkarte, stundenlohn, patientenverfuegung, bestattung, flyer, eo, cv, direktlinks, export, notifications bekommen in `main.jsx` kein `onNavigate` → kein nächster Schritt, nur «Übersicht». | Jede Seite bekommt «Als Nächstes» wie die Kapitel. |
| F7-L3 | Aufbau | **Familie hat kein Kapitel.** Heirat, Kind, Trennung, Adoption, Zusammenziehen, Todesfall sind nur über Abläufe/Listen erreichbar; in Basis führt ein Rucksack-Sprung hin. | Entscheiden: achtes Kapitel «Familie» oder Familie als Abschnitt in Basis mit diesen Abläufen. |
| F7-L4 | Fusion | **Drei Fortschritts-Bilder**: Berglandschaft (Dashboard), Lebensbaum (im Kapitel Finanzen), Obstgarten (eigene Seite). Alle zeigen Vollständigkeit aus denselben Daten. | Eines als Hauptbild. Vorschlag: Berglandschaft bleibt Einstieg; Baum und Obstgarten werden eins («Mein Garten») und ersetzen auf dem Dashboard die Fortschrittsbalken. |
| F7-L5 | Fusion | **Ansprüche an fünf Orten** (situationen, schnellcheck, anspruchcheck, Dashboard-Kompass, Baum-Signale), dieselben Rechnungen sechsmal aufgerufen. Gruppe A ist **zurückgestellt**. | Gruppe A jetzt wieder aufnehmen — deckt F7-D5 und F7-K2-4 mit ab. |
| F7-L6 | Fusion | **Krankenkasse an sechs Orten** (praemien, premium, kvg, kk, Arztkoffer, Kapitel). §11 (Versicherungs-Übersicht als eigene Seite) ist entschieden, **nicht gebaut**. | §11 bauen; deckt F7-K3-1/2 mit ab. |
| F7-L7 | Fusion | Budget zweimal als Seite: `sync` («Monatsbudget») und `budget` (CSV-Import). Gruppe I offen. Der Dashboard-Tipp nennt «Budget-Sync» (F7-D3). | budget in sync (§2 I). |
| F7-L8 | Fusion | Steuern: tax, taxImport, Quellensteuer, Kantonssteuer-Orientierung (2×), Säule-3a-Tracker (2×), Frist in Behörden. | taxImport in tax (§2 I); mit F7-K5-1 ein Faden. |
| F7-L9 | Fusion | Lohn: stundenlohn, Mindestlohn (im Kapitel Finanzen), LohnEinordnung (2×), NeuerJob teilen dieselbe Rechnung. | Lohn-Faden in Ausbildung & Arbeit (F7-K4-1), Stundenlohn als Werkzeug dort verlinkt. |
| F7-L10 | Fusion | Merkliste ist laut §2 H Teil von «Was ansteht», hat aber noch eine eigene Seite. | Merkliste als Reiter in «Was ansteht». |
| F7-L11 | Hygiene | Rucksack zeigt Doppel-Einträge mit demselben Ziel (tresor/unterlagen; finanzuebersicht/charts/mindestlohn; stelleverloren/aussteuerung). 9 Links zielen noch auf die umgeleitete Adresse `finanzuebersicht`. `FinanzUebersicht.jsx` ist tot (nirgends importiert). | aufräumen (ordnungshueter). |
| F7-L12 | Zeigen | Seite `anspruchcheck` hat keinen eigenen Titel; `notfalldossier`, `behoerdendossier` zeigen kein «Zurück zu …». | Titel und Brotkrume. |

## Nachtrag zu Runde 1 (beim Lesen von VERGLEICH.md, 27.10. um 02:00)

- **F7-D2** (63 % gegen 70 %) ist schon seit 23.10. als offene Frage «Übersicht» notiert (UEBERGABE-FASSUNG-6, «Noch
  offen»). Nicht neu, aber weiter offen.
- **F7-K2-4** (IPV: Kapitel «kein Anspruch», Dashboard «hängt ab») ist in Entscheid O als «beobachtet, unbestätigt»
  notiert (Schnellcheck zeigte einmal «prüfenswert»). Heute wiederholbar auf dem Dashboard.

## Runde 2 · Abläufe (33) und Rechner/Werkzeuge (24)

Struktur aller Seiten per Skript im Browser erfasst (Titel, Schritte, Länge, Quellen, «Als Nächstes»), dann Stichproben
im Bild: Krankenkasse wechseln, Umzug, ALV, Steuern, Was steht mir zu?, Lebenslauf.

### Umgesetzt? — drei entschiedene Formen sind nicht gebaut

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-A1 | **Umgesetzt?** | **Entscheid W (Ablauf-Schale) ist nicht gebaut.** 32 von 33 Abläufen zeigen alle Schritte untereinander; nur Umzug geht Schritt für Schritt. Die Passstrasse ist weiter fest auf 4 Stationen (`AblaufSchale.jsx:275-277`), nicht «n Kehren». Kein «Ablauf abschliessen». | W bauen — eine Änderung an der Schale wirkt auf alle. Grösster Hebel der Runde. |
| F7-A2 | **Umgesetzt?** | **Entscheid X (Rechner-Form) ist nicht gebaut.** ALV, EO, Vorsorge, Sozialhilfe usw.: Eingaben zuerst, Kartenwand, Ergebnis unten. Offen dazu: Name «Arbeitslosenentschädigung» oder «ALV-Taggeld». | X bauen (Gilt-für-Liste in VERGLEICH Runde 8). |
| F7-A3 | **Umgesetzt?** | **Entscheid O («Was steht mir zu?» als eine Seite) ist nicht gebaut.** Die Anker-Seite zeigt nur die elf Lebenslagen als Knöpfe, kein «Mit Ihren Angaben», keine Pegel. Für Maria steht dort nichts über IPV oder Sozialhilfe, obwohl die App beides rechnet. Hängt an Gruppe A (zurückgestellt). | O bauen; löst F7-D5, F7-K2-4, F7-L5 zusammen. |

### Abläufe

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-A4 | Flow | **Kein Ablauf hat «Als Nächstes».** Nur 6 von 33 haben «Verwandte Ereignisse» (Heirat, Kind, Bewilligung, Führerausweis, Zuzug, Krankenkasse zum ersten Mal), obwohl W «immer unten» sagt. Die Seiten enden mit Quelle und Hinweis. | Mit W: «Verwandte Ereignisse» in allen, dazu das Kapitel, zu dem der Ablauf gehört. |
| F7-A5 | **Fusion** | **Krankenkasse wechseln** und **Zusatzversicherung wechseln**: Schritt 3 «Kündigung schreiben» und 4 «Frist sichern» gleich; die Zusatz-Seite ist in KVG-Wechsel schon verlinkt. | Ein Ablauf «Krankenkasse wechseln» mit Weiche in Schritt 1 (Grund- / Zusatzversicherung). |
| F7-A6 | **Fusion** | **Vorsorge an drei Orten**: Ablauf «Vorsorgeauftrag und Patientenverfügung» (7 Schritte, inkl. Testament), Formular «Patientenverfügung erstellen», Block «Vorsorge» im Kapitel Notfall (+ Behörden, F7-K5-2). | Der Ablauf wird der Ort; Notfall zeigt den Stand und führt hin; Formular als Schritt im Ablauf. |
| F7-A7 | Fusion | **Krank sein zweimal**: «Unfall oder Krankheit» (4 Schritte) und «Krankheit & IV» (5) — beide mit Lohnfortzahlung/Taggeld. | prüfen: ein Ablauf mit zwei Wegen (kurz krank / länger krank → IV). |
| F7-A8 | Fusion | **Ins Alter**: «Pensionierung» Schritt 4 heisst «Ergänzungsleistungen prüfen», daneben steht der eigene Ablauf «Ergänzungsleistungen beantragen». | Pensionierung verlinkt nur; EL bleibt eigener Ablauf (auch für IV-Rente). Kein Zusammenlegen. |
| F7-A9 | Aufbau | **Junge Leute verteilt**: «18 werden» (Schritt 5 = Dienst), «Militär- oder Zivildienst — der Weg ab 18», «Lehre beginnen». Alle drei ohne Eingang aus einem Kapitel (F7-L1). | Zusammen als Gruppe «Erwachsen werden» im Rucksack und im Kapitel Basis/Ausbildung. |
| F7-A10 | Aufbau | **Länge sehr ungleich**: Umzug 940 Zeichen, Mahnung/Zahlungsbefehl 10’890 (7 Schritte, darunter «Umgekehrt: Ihnen schuldet jemand Geld»). | Mahnung teilen: «Ich habe eine Mahnung» / «Mir schuldet jemand Geld». |
| F7-A11 | Umgesetzt? | «Asyl & Schutz» steht ausserhalb der Schale (eigene Gliederung, keine Nummern). W sagte «eigener Entscheid» — noch nicht getroffen. | entscheiden. |
| F7-A12 | Sprache/a11y | Deko-Schrift steht **im Seitentitel** von 11 Abläufen: «Fr Pensionierung», «HELVETIA Betreibungsauszug bestellen», «HELVETIA Einbürgerung» … Bildschirmleser lesen den Titel so vor. | wie F7-D8, hier dringender (Titel). |

### Rechner und Werkzeuge

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-R1 | Sprache | **Namen weichen ab** zwischen Menü/Rucksack und Seitentitel: Steuern ↔ «Steuer-Orientierung», Sozialhilfe ↔ «Soziale Sicherung», Budget ↔ «CSV Budget Import», Lebenslauf ↔ «Lebenslauf-Generator», Gesundheit ↔ «Arztkoffer», KK-Scanner ↔ «KK-Karte scannen», Anspruch-Check ↔ «Leistungs-Schnellcheck». Regel «eine Seite, ein Name» (O). | je Seite ein Name, Copy-Prüfer. |
| F7-R2 | Fusion | **«Soziale Sicherung»** (sozialhilfe) enthält SKOS-Bedarf, IPV und EL in einem — dieselben Themen wie IPV-Rechner, EL-Ablauf und «Was steht mir zu?». | Mit O/Gruppe A klären: Sozialhilfe-Seite nur Sozialhilfe. |
| F7-R3 | Zeigen | Rechner zeigen ihr Ergebnis als Text; Bilder gibt es nur in der Versicherungs-Übersicht. Die Kapitel haben Instrumente (Barometer, Pegel, Tank). | X umsetzen und je Rechner **das Instrument aus seinem Kapitel** wiederverwenden (ALV → Pegel Taggeld 70/80 %, Vorsorge → Zukunftsgrafik, Stundenlohn → Mindestlohn-Barometer). |
| F7-R4 | Logik | ALV im Beispiel: «Das hinterlegte Einkommen ist als Netto markiert — bitte Bruttolohn eintragen», Feld leer. Die App schätzt Brutto aber überall sonst selbst (Dashboard «≈ brutto CHF 6’796»). | Geschätztes Brutto vorbelegen, als «geschätzt» markiert (wie im Entwurf X mit 6’796). |
| F7-R5 | Flow | **Lebenslauf-Generator** ist eine Datenmaske mit «HTML Download / Vorschau / JSON (ATS)», viel schwächer als die Lebenslauf-Vorschau im Kapitel Ausbildung (F7-K4-3). | Generator = Vorschau aus dem Kapitel + PDF; «JSON (ATS)» weg oder klein. |
| F7-R6 | Stimmt | Quellen sind da, aber jede Seite zeigt sie anders: Steuern als Fliesstext («ESTV (Steuerjahr 2026)») und Link, Vorsorge als «Stand 2026.» und sechs Links, Abläufe als «Quelle: … (geprüft im September 2026)». Nachgeprüft 27.10. um 02:05 für Steuern und Vorsorge. | Mit X eine feste Zeile «Quelle · Stand» an derselben Stelle. |

## Runde 3 · Notfall-Seiten, Ablage, Dossiers, Einstellungen, Rahmen (27.10.2026)

20 Seiten per Skript im Browser erfasst (Beispiel Maria), dazu im Bild: Obstgarten, Dokumentenablage; Lebensmappe und
Dossiers im Text; Handy-Breite 375 px über 28 Seiten geprüft.

| # | Frage | Befund | Vorschlag |
|---|---|---|---|
| F7-S1 | **Stimmt (Fehler)** | **Die Lebensmappe lässt das Kapitel Behörden & Rechtliches ganz weg** (Steuerkanton, Steuernummer, Frist, Betreibungsregister, Testament), obwohl sie «Alle Kapitel auf einen Blick» verspricht und Maria das Kapitel zu 80 % ausgefüllt hat. Ursache: `getSections` in `dossierGenerator.js` kennt nur basis, wohnen, finanzen, versicherungen, ausbildung, notfall. Darum steht dort «6 Bereiche mit Angaben». | Abschnitt Behörden in `getSections` ergänzen (betrifft Vorschau **und** Druck). Kleiner, klarer Fix. |
| F7-S2 | **Fusion** | **Drei Dossiers aus demselben Generator**: Lebensmappe (alles), Behörden-Dossier (Person + Finanzen + SKOS/IPV/EL + Steuern), Notfall-Dossier (Person + Notfall + QR). Dazu Notfallkarte, Notfallpass, Portemonnaie-Karte. Gruppe D (Pass/Dossier ins Kapitel) offen. | Eine Seite «Unterlagen drucken» mit drei Auswahlen (Alles · Für ein Amt · Für den Notfall), gleiche Vorschau. Notfall-Ausgaben bleiben im Kapitel Notfall gebündelt. |
| F7-S3 | Sprache | **Vier Namen für dieselbe Sicherung**: Dashboard «Jetzt sichern», Ablage «Datensicherung» / «Sicherung & Wiederherstellung», Einstellungen «Export», Seite `export` (im Beispiel: «Export ist im Beispiel-Modus nicht verfügbar»). | Ein Name: «Sicherung». |
| F7-S4 | Sprache | **«Meine Unterlagen»** ist in der Brotkrume der Dossiers eine Stufe («Übersicht › Meine Unterlagen › Lebensmappe»), auf der Ablage-Seite nur ein Abschnitt unter «Dokumentenablage»; im Rucksack stehen «Dokumentenablage» und «Meine Unterlagen» nebeneinander (F7-L11). | Ein Ort, ein Name. |
| F7-S5 | Logik | **Obstgarten hat andere Bereiche als die App**: 11 Bäumchen (Person, Bildung, Gesundheit, Arbeit, Familie, Vorsorge …), davon 4 «kommt später»; die Kapitel heissen Basis, Ausbildung & Arbeit usw. Er zählt «Wuchsstufe statt Prozent», das Dashboard zeigt Prozent. | Mit F7-L4 entscheiden: ein Fortschrittsbild, gleiche Bereiche wie die Kapitel. «Familie» hängt an F7-L3. |
| F7-S6 | Stimmt | **Behörden-Dossier** zeigt rohe Feldnamen mit doppelter Währung: «Monatliches Einkommen CHF · CHF 6’200», «KK-Prämie monatlich CHF · CHF 540», «Franchise CHF · 1’500». Das Dossier geht an ein Amt. | Labels ohne «CHF», Wert immer mit «CHF». |
| F7-S7 | Handy | **Behörden-Dossier ist auf 375 px 10 px zu breit** (Seite scrollt seitwärts; die untere Leiste reicht bis 385 px). Alle anderen 27 geprüften Seiten passen. | Ursache suchen (Vorschau-Tabelle), `min-width: 0`. |
| F7-S8 | Handy | **Wegmarken in der Landschaft** (Dashboard) sind auf 375 px 26 × 26 px gross; Regel ≥ 44 px (R9/R12, #620). | prüfen, ob die Trefferfläche grösser ist als das Bild; sonst vergrössern. |
| F7-S9 | Sprache | Die **Suche ohne Eingabe** listet interne Namen: «CSV Budget», «Budget-Sync CSV-Import», «KK-Scanner». | mit F7-R1 und F7-L7. |
| F7-S10 | Flow | **Patientenverfügung, Bestattung, Organspende, Export, Benachrichtigungen, Flyer** sind Sackgassen (F7-L2); Patientenverfügung und Bestattung sind Formulare mit «Weiter», danach kein Rückweg ins Kapitel Notfall. | Nach dem Speichern zurück zu Notfall › Vorsorge. |
| F7-S11 | Gut | Notfallkarte: Nummern, «Was Sie sagen» mit Marias Adresse, «Bleiben Sie am Telefon» — ruhig und klar. Einstellungen: Barrierefreiheit vollständig (Vorlesen, Lesbarkeit, Einfache Ansicht, Schwarzweiss, Farbenblind, Reduzierte Bewegung). | – |
| F7-S12 | Stimmt | Notfallkarte: «Die 112 erreichen Sie … nicht aber ohne SIM-Karte.» Fachaussage ohne sichtbare Quelle auf der Karte. | swiss-precision-pruefer (BAKOM). |
