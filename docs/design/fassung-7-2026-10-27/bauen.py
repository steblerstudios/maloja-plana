"""Baut fassung-7.html aus vorlage.html + den Befunden unten + den Bildern in bilder/.
Aufruf: python3 -I bauen.py  (im Ordner fassung-7-2026-10-27). Quelle der Befunde: BEFUNDE.md."""
import base64, json, pathlib

HIER = pathlib.Path(__file__).resolve().parent

def bild(name):
    p = HIER / 'bilder' / name
    return 'data:image/jpeg;base64,' + base64.b64encode(p.read_bytes()).decode()

def b(id, art, was, vor=''):
    return {'id': id, 'art': art, 'was': was, 'vor': vor}

SEITEN = [
  {'id': 'dashboard', 'titel': 'Dashboard', 'bild': bild('dashboard-oben.jpg'),
   'bildtext': 'Oben die Landschaft mit acht Wegmarken; darunter folgen zwölf weitere Blöcke.',
   'intro': 'Heute 13 Blöcke: Landschaft · Frühe Version · Was ist jetzt dran? · Ihr Fortschritt · Was steht mir zu? · Leistungs-Kompass · Ihre Instrumente · Ihr Alltag/Absicherung/Schutz · Obstgarten · Werkzeuge · Sicherung · Tipps.',
   'befunde': [
     b('F7-D1', 'fusion', 'Die sieben Kapitel stehen <b>dreimal</b> auf derselben Seite: als Wegmarken in der Landschaft, als Balken unter «Ihr Fortschritt» und als Zeilen unter «Ihr Alltag».', 'eine Stelle: Landschaft als Einstieg, darunter nur noch die Kapitel-Zeilen, mit Fortschritt und Instrument in derselben Zeile.'),
     b('F7-D2', 'fehler', 'Drei verschiedene Fortschrittszahlen: «7/7 begonnen», «63 % ausgefüllt», «70 %», dazu «Grundordnung 15/15».', 'eine Zahl, eine Rechnung.'),
     b('F7-D3', 'aufbau', '«Tipps für den Anfang» erscheinen, obwohl die Grundordnung steht. Der Tipp nennt «Budget-Sync», einen Namen, den es sonst nirgends gibt.', 'Tipps nur zeigen, solange noch nichts erfasst ist.'),
     b('F7-D4', 'fusion', 'Der Hinweis auf die fehlende Sicherung steht zweimal, oben und ganz unten.', 'einmal, oben bei «Was ist jetzt dran?».'),
     b('F7-D5', 'fusion', 'Der Leistungs-Kompass rechnet IPV, Sozialhilfe und ALV direkt auf dem Dashboard. Gleich daneben führt «Was steht mir zu?» zu denselben Themen auf eine eigene Seite.', 'Kompass auf die Seite «Was steht mir zu?», das Dashboard zeigt nur den Einstieg.'),
     b('F7-D6', 'fehler', '«Bedarf ≈ 3’431.3»: ohne CHF und mit einer Nachkommastelle.', '«CHF 3’431».'),
     b('F7-D7', 'fehler', '«CHF 540.3, Franchise 1’500» (bekannt seit dem 26.10., noch offen).', '«CHF 540.30 / Mt. · Franchise CHF 1’500».'),
     b('F7-D8', 'sprache', 'Bildschirmleser lesen Deko-Schrift mit: «5 FR. 2026», «HELVETIA», «Fr». Das kommt auf allen Kapitelseiten vor.', 'Deko für Bildschirmleser ausblenden.'),
     b('F7-D9', 'aufbau', 'Die Seite ist sehr lang, und mehrere Karten sind gleich laut. Die Regel «eine Hauptaktion je Seite» ist verletzt.', 'fünf Teile: Landschaft · Jetzt dran · Kapitel · Werkzeuge · Sicherung.'),
     b('F7-D10', 'zeigen', '«Ihre Instrumente» (Franchise-Kreuz, Steuer-Säule, Tankanzeige, Schutzschild) stehen getrennt von den Kapiteln, zu denen sie gehören.', 'jedes Instrument klein direkt in seine Kapitel-Zeile, zum Beispiel das Schutzschild bei Versicherungen.'),
   ]},
  {'id': 'basis', 'titel': 'Persönliche Basis', 'bild': bild('k0-basis.jpg'),
   'bildtext': 'Ruhig, ohne Instrument, wie in Runde 9 (Y) entschieden.',
   'intro': 'Aufbau sauber: Satz · Angaben/Dokumente · Passend · Als Nächstes. Das Kapitel-Muster aus Fassung 6 hält.',
   'befunde': [
     b('F7-K0-2', 'zeigen', 'Die einzige Kapitelseite ohne Instrument. Möglich wäre ein ruhiger Ring «6 von 9 Angaben», oder es bleibt bewusst ohne.', 'bewusst ohne lassen.'),
   ]},
  {'id': 'wohnen', 'titel': 'Wohnen & Leben', 'bild': bild('k1-wohnen.jpg'),
   'bildtext': 'Mietbarometer oben, darunter die Angaben.',
   'intro': 'Instrumente: Wohnkosten in % des Einkommens und Mietbarometer gegen Region und Schweiz.',
   'befunde': [
     b('F7-K1-1', 'fehler', 'Unter «Ihre Miete: CHF 1’650» steht «rund 20 % über dem Schweizer Schnitt». Die 20 % beschreiben aber die <b>Region gegen die Schweiz</b> (1’732 zu 1’446). Marias eigene Miete liegt 5 % <b>unter</b> dem Schnitt ihrer Region. Beleg: <code>RegionalBarometer.jsx:49</code>.', 'den Satz auf die eigene Miete beziehen: «Ihre Miete liegt rund 5 % unter dem Schnitt Ihrer Region.»'),
     b('F7-K1-2', 'fehler', 'Im Beispiel Maria fehlt die Zimmerzahl. Der Vergleich rechnet darum mit «angenommen 3 Zimmer».', 'Zimmerzahl ins Beispiel aufnehmen.'),
     b('F7-K1-3', 'fehler', '«29.5 % des Einkommens (CHF 6’200)»: Es steht nicht da, ob netto oder brutto gemeint ist.', '«des Nettoeinkommens».'),
   ]},
  {'id': 'finanzen', 'titel': 'Finanzen & Geld', 'bild': bild('k2-finanzen-baum.jpg'),
   'bildtext': 'Mitten im Kapitel steht der Lebensbaum mit allen sieben Kapiteln, darunter der Kuchen.',
   'intro': 'Die längste Seite der App (14 Blöcke). Der Geldfluss erscheint wie entschieden erst ab zwei Einnahmequellen, deshalb sieht Maria ihn nicht.',
   'befunde': [
     b('F7-K2-1', 'fusion', 'Der <b>Lebensbaum zeigt alle sieben Kapitel</b> (Notfall 85 %, Ausbildung 82 % …), mitten im Kapitel Finanzen. Er zeigt das ganze Leben, nicht das Geld.', 'Baum aufs Dashboard: Er ersetzt dort die dreifache Kapitel-Liste (F7-D1).'),
     b('F7-K2-2', 'fusion', 'Dieselbe Aufteilung der Ausgaben steht zweimal: oben als Balken, weiter unten als Kuchen «Wofür geht es weg?».', 'ein Bild: Der Balken oben lässt sich zu den Posten aufklappen, der Kuchen fällt weg.'),
     b('F7-K2-3', 'fehler', 'Aus denselben CHF 6’200 netto entstehen zwei Bruttowerte: CHF 6’796 auf dem Dashboard und CHF 6’472 im Lohnvergleich.', 'nachrechnen, welcher stimmt, und dann eine Rechnung für beide.'),
     b('F7-K2-4', 'fehler', 'IPV: Das Kapitel sagt «Kein Anspruch, Einkommen über Grenze». Das Dashboard sagt zu denselben Daten «Hängt von Kanton und Einkommen ab — im Rechner eingeben».', 'Das Dashboard übernimmt das Ergebnis aus dem Kapitel.'),
     b('F7-K2-5', 'aufbau', 'Die Auswertung (Lohn, Steuern, IPV, KK-Last, Vermögen) steht unter den Rohangaben, ganz unten.', 'Auswertung vor die Angaben, wie bei Wohnen.'),
     b('F7-K2-6', 'zeigen', 'Der Branchenvergleich zeigt 18 Balken, die Jahre gemischt (’22 und ’24). Für Maria zählt eine Branche: Gesundheit.', 'die eigene Branche hervorheben, die übrigen aufklappbar.'),
   ]},
  {'id': 'versicherungen', 'titel': 'Versicherungen & Vorsorge', 'bild': bild('k3-versicherungen.jpg'),
   'bildtext': 'Angaben mit Unterreitern, darunter «Passend zu diesem Bereich».',
   'intro': 'Oben stehen vier Instrumente: Summe pro Monat (CHF 570 stimmt), KK-Last, Schutzschild, Franchise-Kreuz. Darunter, über den Angaben, steht weiterhin das Spinnennetz.',
   'befunde': [
     b('F7-K3-6', 'zeigen', '<b>Das Spinnennetz steht noch.</b> Entschieden war «Netz nur bis M2». M2 steht seit #581, das Netz blieb trotzdem. Es zeigt, <b>wie viel eingetragen</b> ist. Das Schutzschild direkt darüber zeigt, <b>was gedeckt</b> ist. Zwei Bilder zu zwei ähnlichen Fragen, die man leicht verwechselt.', 'ein Bild statt zwei: Jede Achse ist eine Versicherung, die Füllung zeigt «gedeckt», der Rand «vollständig erfasst». Oder das Netz fällt weg, wie entschieden.'),
     b('F7-K3-1', 'fusion', 'Die <b>KK-Last</b> (8.7 %, WHO-Richtwert 10 %) steht wortgleich in Finanzen und in Versicherungen.', 'nur hier, Finanzen verweist darauf.'),
     b('F7-K3-2', 'fusion', 'Das <b>Franchise-Kreuz</b> steht an drei Orten: Dashboard, Kapitel und Versicherungs-Übersicht.', 'ganz nur in der Übersicht, im Kapitel bleibt die Empfehlung als eine Zeile mit Link.'),
     b('F7-K3-3', 'fehler', 'Das Kreuz vergleicht nur Franchise 300 und 2’500. Marias eigene Franchise von 1’500 kommt im Bild nicht vor.', 'die eigene Franchise als Punkt im Bild.'),
     b('F7-K3-4', 'aufbau', 'Vier Instrumente stehen untereinander, bevor die Angaben kommen.', 'das Schutzschild als Kopf, den Rest einklappen.'),
   ]},
  {'id': 'netz', 'titel': 'Versicherungen · das Netz', 'bild': bild('k3-netz.jpg'),
   'bildtext': 'Das Spinnennetz über den Angaben. Darunter steht der Satz «Zeigt, wie viel eingetragen ist, nicht, ob Sie gut versichert sind».',
   'intro': 'Das Netz braucht einen eigenen Satz, der erklärt, was es <i>nicht</i> zeigt. Das spricht dafür, dass es die falsche Frage beantwortet.',
   'befunde': []},
  {'id': 'ausbildung', 'titel': 'Ausbildung & Arbeit', 'bild': '',
   'bildtext': '',
   'intro': 'Oben der Lohnvergleich, darunter die Vorschau auf den Lebenslauf. Die Vorschau ist der stärkste nächste Schritt der ganzen App.',
   'befunde': [
     b('F7-K4-1', 'fusion', '<b>«Wo steht Ihr Lohn?» steht zweimal</b>, identisch in Finanzen und hier. Das gehört zu K-G8: Der Arbeitgeber ist in beiden Kapiteln erfasst, der Entscheid dazu ist offen.', 'Der Lohnvergleich gehört zur Arbeit: nur hier, Finanzen zeigt das Einkommen. Zusammen mit K-G8 entscheiden.'),
     b('F7-K4-2', 'fehler', 'Beispiel Maria: «Höchster Abschluss Bachelor, ZHAW» und zugleich «Pflegefachfrau <b>HF</b>». HF ist ein Abschluss der Höheren Fachschule, kein Bachelor. An der ZHAW heisst der Abschluss «Pflegefachfrau FH / BSc».', 'das Beispiel angleichen, entweder HF mit Höherer Fachschule oder BSc Pflege mit FH.'),
     b('F7-K4-3', 'gut', 'Die Lebenslauf-Vorschau direkt im Kapitel ist so gebaut, wie es in AC entschieden wurde.'),
   ]},
  {'id': 'behoerden', 'titel': 'Behörden & Rechtliches', 'bild': '',
   'bildtext': '',
   'intro': 'Steuerfrist als Kalenderblatt, Behördengänge (1 von 5), «Für den Fall der Fälle», Angaben.',
   'befunde': [
     b('F7-K5-1', 'fusion', '<b>Steuern stehen an vier Orten</b>: Steuer-Säule auf dem Dashboard, Betrag in Finanzen, Frist hier, dazu das Werkzeug «Steuern».', 'ein Faden: Betrag in Finanzen, Frist hier, beide verweisen mit derselben Zahl aufeinander. Die Säule auf dem Dashboard fällt weg.'),
     b('F7-K5-2', 'fusion', '<b>Vorsorge doppelt</b>: Patientenverfügung und Vorsorgeauftrag stehen hier unter «Für den Fall der Fälle» und im Notfall unter «Vorsorge».', 'Vorsorge ganz in den Notfall («an einem Ort», so steht es schon auf dem Dashboard). Hier bleibt das Testament mit einem Verweis.'),
   ]},
  {'id': 'notfall', 'titel': 'Notfall', 'bild': bild('k6-notfall.jpg'),
   'bildtext': 'Oben der Knopf «Notfallkarte öffnen», darunter «Bereit für den Ernstfall 18 von 20».',
   'intro': '«Ein Ort» aus AE ist gebaut: Notfallkarte, Kontakt anrufen, drei Szenarien, vier Unterlagen, Vorsorge. Am Ende schliesst sich der Kreis mit «Alle Kapitel durchgegangen».',
   'befunde': [
     b('F7-K6-1', 'fusion', '<b>Die Patientenverfügung steht dreimal auf derselben Seite</b>: in «Bereit für den Ernstfall», im Block «Vorsorge» und in den Angaben.', 'nur im Block Vorsorge, «Bereit» verlinkt dorthin.'),
     b('F7-K6-2', 'flow', 'Im Beispiel steht ein leeres Eingabefeld «Medikamente», darunter: «Im Beispiel-Modus können keine Daten bearbeitet werden».', 'im Beispiel nur den Satz zeigen, ohne Feld.'),
   ]},
  {'id': 'landkarte', 'titel': 'Landkarte · alle rund 90 Seiten', 'bild': '',
   'bildtext': '',
   'intro': 'Aus dem Code gelesen: welche Seite führt wohin. Es gibt schon ein Blatt zum Bündeln (<code>docs/entscheide/seiten-buendeln.md</code>, Gruppen A–I). E, F und H sind gebaut. A (Ansprüche) ist zurückgestellt, B (Versicherungs-Übersicht) entschieden, aber nicht gebaut, I ist offen.',
   'befunde': [
     b('F7-L1', 'flow', '<b>Vier Seiten ohne Eingang</b> aus einem Kapitel: «Lehre beginnen», «Selbständig werden», «18 werden», «Organspende». Man findet sie nur über Rucksack oder Suche. Weitere 13 Seiten haben genau einen Eingang.', 'Lehre und Selbständigkeit unter «Passend» bei Ausbildung, «18 werden» bei Basis, Organspende bei Notfall/Vorsorge.'),
     b('F7-L2', 'flow', '<b>14 Sackgassen</b>, ohne nächsten Schritt, nur «Übersicht»: KK-Scanner, Budget-Import, Organspende, Monatsbudget, Kreditkarte, Stundenlohn, Patientenverfügung, Bestattung, Flyer, EO, Lebenslauf, Offizielle Links, Export, Benachrichtigungen.', 'jede Seite bekommt «Als Nächstes» wie die Kapitel.'),
     b('F7-L3', 'aufbau', '<b>Familie hat kein Kapitel.</b> Heirat, Kind, Trennung, Adoption, Zusammenziehen und Todesfall erreicht man nur über Abläufe und Listen.', 'entscheiden: ein achtes Kapitel «Familie» oder ein Abschnitt Familie in Persönliche Basis.'),
     b('F7-L4', 'fusion', '<b>Drei Fortschritts-Bilder</b> aus denselben Daten: Berglandschaft (Dashboard), Lebensbaum (im Kapitel Finanzen), Obstgarten (eigene Seite).', 'Die Berglandschaft bleibt der Einstieg. Baum und Obstgarten werden zu einem Bild und ersetzen auf dem Dashboard die Fortschrittsbalken (zusammen mit F7-D1 und F7-K2-1).'),
     b('F7-L5', 'fusion', '<b>Ansprüche an fünf Orten</b>, dieselben Rechnungen sechsmal aufgerufen. Gruppe A ist zurückgestellt.', 'Gruppe A jetzt wieder aufnehmen. Das löst auch F7-D5 und F7-K2-4.'),
     b('F7-L6', 'fusion', '<b>Krankenkasse an sechs Orten.</b> Die Versicherungs-Übersicht als eigene Seite (§11) ist entschieden, aber nicht gebaut.', '§11 bauen. Das löst auch F7-K3-1 und F7-K3-2.'),
     b('F7-L7', 'fusion', 'Zwei Budget-Seiten: «Monatsbudget» und «Budget-Import» (CSV).', 'den Import ins Monatsbudget (§2 I).'),
     b('F7-L8', 'fusion', 'Steuern auf sieben Bausteine verteilt: Rechner, Steuer-Import, Quellensteuer, Kantonssteuer zweimal, Säule-3a zweimal, Frist.', 'Steuer-Import in den Rechner (§2 I), zusammen mit F7-K5-1 ein Faden.'),
     b('F7-L9', 'fusion', 'Lohn: Stundenlohn, Mindestlohn, Lohnvergleich (2×) und «Neuer Job» rechnen dasselbe.', 'Der Lohn-Faden kommt in Ausbildung & Arbeit (F7-K4-1).'),
     b('F7-L10', 'fusion', 'Die Merkliste gehört laut §2 H zu «Was ansteht», hat aber noch eine eigene Seite.', 'Merkliste als Reiter in «Was ansteht».'),
     b('F7-L11', 'aufbau', 'Aufräumen: Im Rucksack stehen Doppel-Einträge mit demselben Ziel. Neun Links zeigen auf eine alte Adresse. <code>FinanzUebersicht.jsx</code> wird nirgends mehr verwendet.', 'aufräumen lassen (ordnungshueter).'),
     b('F7-L12', 'flow', '«Anspruch-Check» hat keinen Titel. Notfall-Dossier und Behörden-Dossier zeigen kein «Zurück zu …».', 'Titel und Brotkrume ergänzen.'),
   ]},
]

html = (HIER / 'vorlage.html').read_text(encoding='utf-8')
html = html.replace('{{SEITEN}}', json.dumps(SEITEN, ensure_ascii=False))
(HIER / 'fassung-7.html').write_text(html, encoding='utf-8')
print('fassung-7.html', len(html) // 1024, 'kB')
