"""Baut besprechen.html aus besprechen-vorlage.html + den offenen Punkten von Runde 2 (RUNDE2, Stand 01.11.2026 auf Stage).
Die 31 Punkte von Runde 1 bleiben unten als Beleg stehen; Runde 1 ist in VERGLEICH.md festgehalten.
Aufruf: python3 -I besprechen.py  (im Ordner fassung-7-2026-10-27). Quelle: BEFUNDE.md, VERGLEICH «Fassung 7» Stand 2,
Baustand der acht Entwurfs-PRs #626–#633. Prototyp: _werkbank/versicherung-schild-2026-10-27/."""
import base64, json, pathlib

HIER = pathlib.Path(__file__).resolve().parent
SCHILD = HIER.parents[3] / 'versicherung-schild-2026-10-27' / 'versicherung-schild-prototyp.html'

def bild(name, alt, text):
    p = HIER / 'bilder' / name
    return {'src': 'data:image/jpeg;base64,' + base64.b64encode(p.read_bytes()).decode(), 'alt': alt, 'text': text}

def p(id, titel, stand, heute, empf, neu=''):
    return {'id': id, 'titel': titel, 'stand': stand, 'heute': heute, 'neu': neu, 'empf': empf}

THEMEN = [
  {'id': 'dashboard', 'titel': 'Dashboard',
   'bilder': [bild('dashboard-oben.jpg', 'Dashboard oben', 'Oben die Landschaft mit den Wegmarken, darunter zwölf weitere Blöcke.'),
              bild('dashboard-instrumente.jpg', 'Dashboard, Instrumente', '«Ihre Instrumente»: kleine Bilder mit einem Satz, getrennt von den Kapiteln.')],
   'intro': 'Heute 13 Blöcke. Die Pakete haben das Dashboard kaum angefasst, darum ist hier fast alles noch offen. D1, D9 und D10 hängen zusammen: Sie ergeben zusammen den neuen Aufbau der Seite.',
   'punkte': [
     p('F7-D1', 'Kapitel nur noch an einer Stelle', 'offen',
       'Die sieben Kapitel stehen dreimal: als Wegmarken in der Landschaft, als Balken unter «Ihr Fortschritt», als Zeilen unter «Ihr Alltag / Absicherung / Schutz».',
       'Die Landschaft bleibt der Einstieg. Darunter nur noch die Kapitel-Zeilen, mit Zusammenfassung und Fortschritt in einer Zeile. Der Balken-Block fällt weg.'),
     p('F7-D2', 'Eine Fortschrittszahl', 'offen',
       'Drei Zahlen aus denselben Daten: «7/7 begonnen», «63 % ausgefüllt», «70 %», dazu «Grundordnung 15/15».',
       'Eine Zahl mit einer Rechnung, überall gleich. Fällt mit D1 fast von selbst, weil der Balken-Block wegfällt.'),
     p('F7-D3', 'Tipps nur am Anfang', 'teil',
       '«Tipps für den Anfang» erscheinen, obwohl die Grundordnung steht. Der Tipp nennt «Budget-Sync».',
       'Tipps nur zeigen, solange noch nichts erfasst ist.',
       'Der Name «Budget-Sync» ist mit #627 und #632 weg. Die Bedingung, wann die Tipps erscheinen, ist noch nicht geändert.'),
     p('F7-D4', 'Sicherung nur einmal', 'teil',
       'Der Hinweis auf die fehlende Sicherung steht oben und ganz unten.',
       'Einmal, oben bei «Was ist jetzt dran?». Der Block unten fällt weg.',
       'Seit #627 heisst sie überall «Sicherung». Der doppelte Hinweis steht noch.'),
     p('F7-D5', 'Leistungs-Kompass weg vom Dashboard', 'teil',
       'Der Kompass rechnet IPV, Sozialhilfe und ALV direkt auf dem Dashboard, daneben führt «Was steht mir zu?» zu denselben Themen.',
       'Der Kompass lebt nur noch auf «Was steht mir zu?». Das Dashboard zeigt eine Zeile mit dem Ergebnis und dem Link dorthin.',
       '#630 hat «Was steht mir zu?» als eine Seite mit Pegeln gebaut. Damit gibt es jetzt den Ort, wohin der Kompass ziehen kann. Auf dem Dashboard steht er noch.'),
     p('F7-D6', '«CHF 3’431» statt «3’431.3»', 'offen',
       '«Bedarf ≈ 3’431.3»: ohne CHF und mit einer Nachkommastelle. Ursache: <code>Leistungsliste.jsx</code> formatiert mit bis zu zwei Nachkommastellen.',
       'Mit CHF und ohne Rappen, wie sonst bei Richtwerten. Kleiner Fix, kann ins Paket «sichtbare Fehler».'),
     p('F7-D7', '«CHF 540.30 / Mt.»', 'offen',
       '«CHF 540.3, Franchise 1’500»: bekannt seit dem 26.10.',
       '«CHF 540.30 / Mt. · Franchise CHF 1’500». Zusammen mit D6 bauen.'),
     p('F7-D8', 'Deko-Schrift', 'fehlbefund',
       'Der Rundgang meldete, dass Bildschirmleser «HELVETIA», «Fr» und «5 FR. 2026» vorlesen.',
       'Nichts tun. Die Deko steckt in Icons mit <code>aria-hidden</code> und wird nicht vorgelesen. Der Rundgang hatte falsch gemessen (mit <code>innerText</code>).'),
     p('F7-D9', 'Dashboard in fünf Teilen', 'offen',
       '13 Blöcke, mehrere gleich laut. Die Regel «eine Hauptaktion je Seite» ist verletzt.',
       'Fünf Teile: Landschaft · Was ist jetzt dran (mit Sicherung) · Kapitel-Zeilen · Werkzeuge · Was steht mir zu (eine Zeile). Frühe Version, Tipps, Instrumente und der Obstgarten-Block fallen weg oder ziehen in ihr Kapitel.'),
     p('F7-D10', 'Instrumente in die Kapitel-Zeilen', 'offen',
       'Franchise-Kreuz, Steuer-Säule, Tankanzeige und Schutzschild stehen als eigener Block, getrennt von ihren Kapiteln.',
       'Jedes Instrument klein in seine Kapitel-Zeile: Versicherungen mit dem Schild (siehe Thema 3), Finanzen mit der Tankanzeige. Die Steuer-Säule fällt weg (siehe K5-1).'),
   ]},
  {'id': 'fortschritt', 'titel': 'Ein Fortschrittsbild',
   'bilder': [bild('k2-finanzen-baum.jpg', 'Lebensbaum im Kapitel Finanzen', 'Der Lebensbaum mit allen sieben Kapiteln, mitten im Kapitel Finanzen.'),
              bild('r3-obstgarten.jpg', 'Obstgarten', 'Der Obstgarten: elf Bäumchen mit eigenen Bereichen, vier davon «kommt später».')],
   'intro': 'Drei Bilder zeigen denselben Fortschritt: die Berglandschaft, den Lebensbaum und den Obstgarten. Die drei Punkte hier gehören zusammen, und zu D1.',
   'punkte': [
     p('F7-L4', 'Ein Bild statt drei', 'offen',
       'Berglandschaft (Dashboard), Lebensbaum (Finanzen) und Obstgarten (eigene Seite), alle aus denselben Daten.',
       'Auf dem Dashboard nur die Landschaft. Lebensbaum und Obstgarten werden ein Bild auf einer eigenen Seite «Ihr Garten», für alle, die mehr sehen wollen.'),
     p('F7-K2-1', 'Lebensbaum raus aus Finanzen', 'offen',
       'Der Baum zeigt das ganze Leben, steht aber mitten im Kapitel Geld.',
       'Raus aus Finanzen und in den Garten (L4). Nicht aufs Dashboard, damit dort nur die Landschaft bleibt (D1).'),
     p('F7-S5', 'Garten mit denselben Bereichen wie die Kapitel', 'offen',
       'Der Obstgarten zählt eigene Bereiche (Person, Bildung, Gesundheit, Arbeit, Familie …) in «Wuchsstufen», das Dashboard zählt die Kapitel in Prozent.',
       'Ein Bäumchen je Kapitel, gleiche Zahl wie das Dashboard (D2). «Familie» hängt an L3.'),
   ]},
  {'id': 'versicherungen', 'titel': 'Versicherungen und das Netz-Schild', 'schild': True,
   'bilder': [bild('k3-netz.jpg', 'Spinnennetz bei Versicherungen', 'Heute: das Spinnennetz über den Angaben, mit dem Satz, was es <i>nicht</i> zeigt.'),
              bild('k3-versicherungen.jpg', 'Kapitel Versicherungen', 'Heute: vier Instrumente untereinander, bevor die Angaben kommen.')],
   'intro': 'Neu seit dem Rundgang: das <b>Netz-Schild</b> als Prototyp (unten links zum Ausprobieren). Ein Schild aus sechs Teilen, jedes Teil füllt sich von der Mitte nach aussen: braun angehaucht = noch nicht gedeckt, hellgrün = Grundversicherung, dunkelgrün = gedeckt. Es würde Netz und Schutzschild zu einem Bild machen. Noch nichts davon ist eingebaut.',
   'punkte': [
     p('F7-K3-6', 'Spinnennetz → Netz-Schild', 'offen',
       'Das Netz zeigt, wie viel eingetragen ist, das Schutzschild darüber zeigt, was gedeckt ist. Zwei Bilder zu zwei ähnlichen Fragen. Entschieden war «Netz nur bis M2», es steht trotzdem noch.',
       'Das Netz fällt weg. Das Netz-Schild ersetzt Netz und Schutzschild als ein Bild, zuerst in den Maloja-Tönen nachgezeichnet. Vorher klären: Welche Bereiche haben zwei Stufen (Vorsorge: BVG + 3a?), und gehört «Leben» oben in die Mitte?',
       'Prototyp gebaut, Konzept mit offenen Fragen in <code>_werkbank/versicherung-schild-2026-10-27/</code>.'),
     p('F7-K3-4', 'Das Schild als Kopf', 'offen',
       'Summe, KK-Last, Schutzschild und Franchise-Kreuz stehen untereinander, bevor die Angaben kommen.',
       'Das Netz-Schild steht oben, darunter eine Zeile mit der Summe pro Monat. KK-Last und Franchise-Kreuz sind eingeklappt oder auf der Versicherungs-Übersicht.'),
     p('F7-K3-1', 'KK-Last nur einmal', 'offen',
       'Die KK-Last (8.7 %, Richtwert 10 %) steht wortgleich in Finanzen und in Versicherungen.',
       'Sie steht nur in Versicherungen. Finanzen zeigt eine Zeile mit derselben Zahl und einem Link.'),
     p('F7-K3-2', 'Franchise-Kreuz an einem Ort', 'teil',
       'Das Kreuz steht auf dem Dashboard, im Kapitel und auf der Versicherungs-Übersicht.',
       'Das ganze Kreuz nur auf der Versicherungs-Übersicht. Im Kapitel bleibt die Empfehlung als eine Zeile mit Link, vom Dashboard verschwindet es (D10).',
       'Seit #626 zeigt das Kreuz die eigene Franchise. Die Versicherungs-Übersicht (§11) war schon gebaut, #629 sichert sie mit einem Test ab. Es ist also klar, wo das Kreuz hingehört.'),
   ]},
  {'id': 'geld', 'titel': 'Lohn, Maria, Steuern, Vorsorge',
   'bilder': [bild('k6-notfall.jpg', 'Kapitel Notfall', 'Notfall: «Bereit für den Ernstfall 18 von 20». Die Patientenverfügung steht auf dieser Seite dreimal.')],
   'intro': 'Hier geht es fast überall um dieselbe Regel: <b>je Thema ein Besitzer</b>. Die anderen Orte zeigen nur noch eine Zeile mit derselben Zahl und einem Link.',
   'punkte': [
     p('F7-K2-2', 'Ausgaben in einem Bild', 'offen',
       'Dieselbe Aufteilung der Ausgaben steht zweimal in Finanzen: oben als Balken, weiter unten als Kuchen.',
       'Den Balken oben behalten und zu den Posten aufklappbar machen. Der Kuchen fällt weg.'),
     p('F7-K4-1', 'Lohnvergleich gehört zur Arbeit', 'teil',
       '«Wo steht Ihr Lohn?» steht identisch in Finanzen und in Ausbildung & Arbeit.',
       'Nur in Ausbildung & Arbeit. Finanzen zeigt das Einkommen mit einem Link zum Vergleich.',
       'Seit #628 gibt es das Feld «Branche» in Ausbildung, und der Vergleich zeigt die eigene Branche. Das spricht zusätzlich für die Arbeit als Ort.'),
     p('F7-L9', 'Ein Lohn-Faden', 'offen',
       'Stundenlohn, Mindestlohn, Lohnvergleich (2×) und «Neuer Job» rechnen dasselbe.',
       'Alles mit Lohn hängt an Ausbildung & Arbeit (K4-1). Die Rechner bleiben, verweisen aber dorthin, und alle rechnen mit derselben Brutto-Schätzung.'),
     p('F7-K4-2', 'Maria: HF oder Bachelor', 'offen',
       'Im Beispiel steht «Höchster Abschluss Bachelor, ZHAW» und zugleich «Pflegefachfrau HF» (<code>demoData.js</code>). HF ist der Abschluss einer Höheren Fachschule, kein Bachelor.',
       'Beim Bachelor bleiben und die Berufsbezeichnung angleichen: «Pflegefachfrau FH» (BSc Pflege). Das ist die kleinste Änderung, ZHAW passt dazu.'),
     p('F7-K5-1', 'Ein Steuer-Faden', 'offen',
       'Steuern an vier Orten: Steuer-Säule auf dem Dashboard, Betrag in Finanzen, Frist in Behörden, Werkzeug «Steuern».',
       'Der Betrag steht in Finanzen, die Frist in Behörden, beide verweisen mit derselben Zahl aufeinander. Die Säule auf dem Dashboard fällt weg.'),
     p('F7-L8', 'Steuer-Bausteine bündeln', 'offen',
       'Sieben Bausteine: Rechner, Steuer-Import, Quellensteuer, Kantonssteuer (2×), Säule 3a (2×), Frist.',
       'Den Steuer-Import in den Steuer-Rechner (§2 I) und die Doppel zusammenlegen. Erst nach dem Merge, wegen der Grösse des Startbündels: Der Import wird nur bei Bedarf nachgeladen.',
       'Der <code>taxImport</code> ist immer noch nicht gebündelt.'),
     p('F7-K5-2', 'Vorsorge an einem Ort', 'teil',
       'Patientenverfügung und Vorsorgeauftrag stehen in Behörden und im Notfall.',
       'Die Vorsorge ganz in den Notfall. In Behörden bleibt das Testament mit einem Verweis.',
       '#633 hat den Ablauf «Vorsorgeauftrag und Patientenverfügung» mit dem Formular verbunden (A6), und #632 führt vom Formular zurück zum Notfall (S10). Der Doppel in Behörden steht noch.'),
     p('F7-K6-1', 'Patientenverfügung einmal im Notfall', 'offen',
       'Auf der Notfall-Seite dreimal: in «Bereit für den Ernstfall», im Block «Vorsorge» und in den Angaben.',
       'Nur im Block «Vorsorge». «Bereit» verlinkt dorthin, in den Angaben steht sie nicht mehr.'),
     p('F7-K6-2', 'Kein leeres Feld im Beispiel', 'offen',
       'Im Beispiel steht ein leeres Feld «Medikamente», darunter «Im Beispiel-Modus können keine Daten bearbeitet werden».',
       'Im Beispiel nur den Satz zeigen, ohne Feld. Oder Maria bekommt einen Eintrag, damit das Feld gefüllt ist.'),
   ]},
  {'id': 'wege', 'titel': 'Wege, Familie und der Rest',
   'bilder': [bild('r2-situationen.jpg', 'Was steht mir zu, vor #630', 'Vor #630: elf Knöpfe ohne Antwort. Jetzt eine Seite mit Pegeln.')],
   'intro': 'Bei L1 und L2 haben die Pakete schon viel erledigt. Genau zählen lässt sich der Rest erst nach dem Merge, weil die Seiten auf mehrere Zweige verteilt sind.',
   'punkte': [
     p('F7-L1', 'Seiten ohne Eingang', 'teil',
       'Vier Seiten waren aus keinem Kapitel erreichbar: «Lehre beginnen», «Selbständig werden», «18 werden», «Organspende».',
       'Nach dem Merge den Rest nachzählen. Organspende unter «Passend» bei Notfall › Vorsorge, falls sie dann noch ohne Eingang ist.',
       '#633 bringt die Gruppe «Erwachsen werden», aus Basis und Ausbildung erreichbar. Lehre, Selbständig und 18 werden sind damit verlinkt.'),
     p('F7-L2', 'Sackgassen', 'teil',
       '14 Seiten ohne nächsten Schritt.',
       'Nach dem Merge den Rest nachzählen, dann jeder verbliebenen Seite «Als Nächstes» geben, wie den Kapiteln.',
       'Mit #631 haben alle zehn Rechner einen Schluss, mit #632 führen Patientenverfügung und Bestattung zurück. Offen sind vermutlich Organspende, Flyer, Export und Benachrichtigungen.'),
     p('F7-L3', 'Familie: Kapitel oder Abschnitt?', 'offen',
       'Heirat, Kind, Trennung, Adoption, Zusammenziehen und Todesfall erreicht man nur über Abläufe und Listen.',
       'Ein Abschnitt «Familie» in Persönliche Basis, kein achtes Kapitel. So bleiben sieben Kapitel, sieben Wegmarken und sieben Bäumchen. Die Abläufe hängen dort unter «Passend».'),
     p('F7-R2', 'Sozialhilfe-Seite nur Sozialhilfe', 'teil',
       '«Soziale Sicherung» zeigt Sozialhilfe, IPV und EL auf einer Seite, dieselben Themen wie IPV-Rechner, EL-Ablauf und «Was steht mir zu?».',
       'Die Seite zeigt nur noch Sozialhilfe. IPV und EL bekommen dort je eine Zeile mit Link auf «Was steht mir zu?».',
       '#631 hat der Seite die Rechner-Form X gegeben, #630 hat «Was steht mir zu?» gebaut. Die Doppel stehen noch.'),
     p('F7-R5', 'Lebenslauf: Vorschau statt Generator', 'offen',
       'Der «Lebenslauf-Generator» ist eine Datenmaske mit «HTML Download / Vorschau / JSON (ATS)», viel schwächer als die Vorschau im Kapitel Ausbildung.',
       'Der Generator wird zur Vorschau aus dem Kapitel, plus «Als PDF drucken». «JSON (ATS)» kommt klein unter «Weitere Formate».'),
   ]},
]

# Runde 2: was am 01.11. noch keinen Entscheid hat, geprüft auf Stage (Commit 57785fa7). F7-D8 ist ein Fehlbefund und fällt weg.
RUNDE2 = ['F7-D1', 'F7-D2', 'F7-D3', 'F7-D4', 'F7-D5', 'F7-D6', 'F7-D7', 'F7-D9', 'F7-D10', 'F7-L4', 'F7-S5', 'F7-K2-1', 'F7-K2-2',
          'F7-K3-1', 'F7-K3-2', 'F7-K3-4']
AKTUELL = {
  'F7-D2': {'heute': 'Auf dem Dashboard stehen «7/7», «Grundordnung 15/15» und zwei Gesamtzahlen in Prozent (bei Maria 66 % und 73 %).'},
  'F7-D3': {'neu': 'Korrektur zu Runde 1: Der Name «Budget-Sync» ist nicht weg, er steht noch im dritten Tipp. Der Block «Tipps für den Anfang» erscheint bei Maria weiterhin. Mit dem Entscheid fällt beides.'},
  'F7-D4': {'neu': 'Seit #627 heisst sie überall «Sicherung». Auf Stage stehen beide Hinweise noch.'},
  'F7-D5': {'neu': '«Was steht mir zu?» ist gebaut, der Ort ist also da. Auf Stage steht der Block weiter unter dem Titel «Leistungen» auf dem Dashboard.'},
  'F7-D6': {'neu': 'Auf Stage unverändert. Maria: «Bedarf ≈ 3’431.3».'},
  'F7-D7': {'neu': 'Das Kapitel zeigt schon «CHF 540.30». Falsch ist nur noch die Zeile auf dem Dashboard.'},
  'F7-D10': {'neu': 'Die Säule bleibt und zeigt neu die ganze Steuer (dein Entscheid K5-1). Die Instrumente stehen noch als eigener Block.',
             'empf': 'Jedes Instrument klein in seine Kapitel-Zeile: Versicherungen mit dem Schild, Finanzen mit Säule und Tankanzeige. Der eigene Block fällt weg.'},
  'F7-K3-1': {'neu': 'Auf Stage steht die KK-Last weiter in beiden Kapiteln.'},
  'F7-K3-2': {'neu': 'Das Kreuz zeigt seit #626 die eigene Franchise, im Kapitel steht es unter dem Schild.'},
  'F7-K3-4': {'stand': 'teil', 'heute': 'Oben stehen Summe pro Monat und KK-Last, dann das Netz-Schild mit der langen Liste aller Versicherungen, dann das Franchise-Kreuz. Die Angaben beginnen erst weit unten.',
              'neu': 'Das Netz-Schild ersetzt Spinnennetz und zwei Schilde (#636). Es ist damit das stärkste Bild im Kapitel, die Liste darunter ist aber lang.',
              'empf': 'Schild zuerst, Liste darunter eingeklappt. Summe pro Monat bleibt eine Zeile. KK-Last und Franchise-Kreuz wie in K3-1 und K3-2.'},
  'F7-K4-1': {'neu': 'Seit #628 zeigt der Vergleich die eigene Branche. Auf Stage steht er weiter in beiden Kapiteln.'},
  'F7-K2-1': {'neu': 'Auf Stage steht der Baum unter dem Titel «Was aus Ihren Angaben wächst» noch in Finanzen.'},
}
for t in THEMEN:
    t['punkte'] = [{**x, **AKTUELL.get(x['id'], {})} for x in t['punkte'] if x['id'] in RUNDE2]
    t.pop('schild', None)
    if t['id'] == 'versicherungen':
        t['titel'] = 'Versicherungen'
        t['intro'] = 'Das Netz-Schild ist gebaut. Offen ist nur noch, was rundherum steht. Diese drei Punkte hängen zusammen.'
        t['bilder'] = [bild('k3-schild-stage.jpg', 'Netz-Schild auf Stage', 'Stand 01.11. auf Stage: das Netz-Schild bei Maria, darunter die Liste.')]
    if t['id'] == 'geld':
        t['titel'] = 'Ausgaben in Finanzen'
        t['intro'] = 'Dieselbe Aufteilung steht heute zweimal im Kapitel.'
        t['bilder'] = []
    if t['id'] == 'dashboard':
        t['intro'] = 'Fast alles ist hier noch offen, weil die Pakete das Dashboard kaum angefasst haben. D1, D9 und D10 hängen zusammen: Sie ergeben den neuen Aufbau der Seite.'
THEMEN = [t for t in THEMEN if t['punkte']]
def bloecke(*zeilen):
    return ''.join('<div class="bl %s">%s%s</div>' % (k, t, '<small>%s</small>' % u if u else '') for k, t, u in zeilen)
def vergleich(vorher, nachher):
    return '<div class="skizze"><div class="sk"><h4>Heute</h4>%s</div><div class="sk neu"><h4>So stelle ich es mir vor</h4>%s</div></div>' % (vorher, nachher)
SCHILD_SVG = lambda kern: '<svg viewBox="0 0 100 112" width="104" role="img" aria-label="%s"><path d="M50 3 L95 18 V58 C95 84 74 100 50 109 C26 100 5 84 5 58 V18 Z" fill="#8FB0A0"/>%s</svg>' % (
    'Schild mit offenem Bereich' if kern else 'Schild ganz gefüllt',
    '<path d="M50 56 L95 40 V58 C95 70 90 80 82 88 Z" fill="#C4A06A"/>' if kern else '')
BALKEN = '<div class="balken"><i style="flex:1650;background:var(--sky)"></i><i style="flex:659;background:var(--sage)"></i><i style="flex:850;background:var(--sand)"></i><i style="flex:856;background:var(--soft)"></i></div>'
SKIZZEN = {
  'dashboard': vergleich(
    bloecke(('', 'Landschaft mit sieben Wegmarken', ''), ('', 'Was ist jetzt dran?', ''), ('weg', 'Ihr Fortschritt', 'dieselben sieben Kapitel als Balken'), ('', 'Was steht mir zu?', ''),
            ('weg', 'Leistungen', 'rechnet IPV, Sozialhilfe, ALV hier nochmals'), ('weg', 'Ihre Instrumente', 'eigener Block'), ('', 'Ihr Alltag · Absicherung · Schutz', 'dieselben Kapitel, dritte Liste'),
            ('', 'Werkzeuge', ''), ('weg', 'Tipps für den Anfang', 'auch wenn alles eingetragen ist'), ('weg', 'Sicherung, zweiter Hinweis', '')),
    bloecke(('', 'Landschaft', 'der Einstieg, mit einer Zahl: 73 % eingetragen'), ('haupt', 'Was ist jetzt dran?', 'Steuerfrist 31. März · Sicherung erstellen'),
            ('', 'Basis · 79 %', ''), ('', 'Wohnen · 71 %', ''), ('', 'Finanzen · 38 %', 'mit Säule ≈ CHF 8’431 und Tankanzeige 4.6 Monate'), ('', 'Versicherungen · 70 %', 'mit Schild 5/5'),
            ('', 'Ausbildung · Behörden · Notfall', 'je eine Zeile'), ('', 'Was steht mir zu?', 'eine Zeile mit Ergebnis und Link'), ('', 'Werkzeuge', '')))
    + vergleich(bloecke(('', 'Sozialhilfe', 'Bedarf ≈ 3’431.3'), ('', 'Versicherungen', 'CSS, CHF 540.3, Franchise 1’500')),
                bloecke(('', 'Sozialhilfe', 'Bedarf ≈ CHF 3’431'), ('', 'Versicherungen', 'CSS, CHF 540.30 / Mt. · Franchise CHF 1’500'))),
  'fortschritt': vergleich(
    bloecke(('', 'Landschaft', 'auf dem Dashboard'), ('weg', 'Lebensbaum', 'mitten im Kapitel Finanzen'), ('weg', 'Obstgarten', '11 Bäumchen, andere Bereiche als die Kapitel, 4 «kommt später»')),
    bloecke(('', 'Landschaft', 'bleibt der Einstieg auf dem Dashboard'), ('haupt', 'Ihr Garten', 'eigene Seite, ein Bäumchen je Kapitel, also 7'), ('', 'Basis 79 % · Wohnen 71 % · Finanzen 38 % …', 'dieselben Zahlen wie auf dem Dashboard'))),
  'versicherungen': vergleich(
    bloecke(('', 'Versicherungen pro Monat CHF 659', 'mit allen Posten'), ('weg', 'Ihre KK-Last 8.7 %', 'steht auch in Finanzen'), ('', 'Netz-Schild', 'mit langer Liste'), ('weg', 'Franchise-Kreuz', 'ganze Grafik, auch auf dem Dashboard und der Übersicht'), ('', 'Angaben', 'kommen erst weit unten')),
    bloecke(('haupt', 'Netz-Schild', 'zuerst, Liste aufklappbar'), ('', 'Versicherungen pro Monat CHF 659', 'eine Zeile'), ('', 'KK-Last 8.7 % ›', 'eine Zeile'), ('', 'Franchise: eher 2’500 ›', 'eine Zeile, das Kreuz liegt auf der Übersicht'), ('', 'Angaben', 'gleich danach'))),
  'geld': vergleich(
    bloecke(('', 'Balken oben', 'Wohnen · Versicherungen · Steuern · Übriges'), ('weg', 'Kuchen «Wofür geht es weg?»', 'dieselben Zahlen, weiter unten nochmals')),
    '<div class="bl"><b>Wofür geht es weg?</b> CHF 4’015 im Monat' + BALKEN + '<small>Antippen klappt auf:</small></div>'
    + bloecke(('', 'Wohnen CHF 1’650', ''), ('', 'Versicherungen CHF 659', ''), ('', 'Steuern CHF 850', ''), ('', 'Übriges CHF 856', ''))),
}
for t in THEMEN:
    t['skizze'] = SKIZZEN.get(t['id'], '')
THEMEN.append({'id': 'begriffe', 'titel': 'Zwei letzte Fragen, verständlicher', 'bilder': [],
  'intro': 'Das waren E-4 und E-5, einfacher erklärt.',
  'skizze': '<div class="skizze"><div class="sk"><h4>Heute bei Maria: alles eingetragen</h4>' + SCHILD_SVG(False) + '</div><div class="sk"><h4>Wenn etwas fehlt, zum Beispiel Hausrat</h4>' + SCHILD_SVG(True) + '</div></div>',
  'punkte': [
    p('E-4', 'Soll man im Beispiel sehen, wie eine Lücke aussieht?', 'offen',
      'Im Schild wird ein Bereich sandfarben, solange dort etwas fehlt. Maria hat inzwischen alles eingetragen. Im Beispiel sieht man den sandfarbenen Bereich deshalb nie, siehe die zwei Bilder oben.',
      'So lassen. Maria ist das Beispiel für einen geordneten Stand. Wer selbst etwas auslässt, sieht die Lücke bei den eigenen Angaben. «Anders» heisst: Ich entferne bei Maria die Hausrat-Versicherung, dann sieht man die Lücke auch im Beispiel.'),
    p('E-5', 'Deutscher Absatz in der Sprache Rumantsch', 'offen',
      'Wer die App auf Rumantsch stellt, sieht im Kapitel Notfall einen Absatz, der noch auf Deutsch ist: die Erklärung, was eine Patientenverfügung ist.',
      'Ich übersetze ihn jetzt und markiere ihn als ungeprüft, wie die übrigen Texte in «Rumantsch (provisoric)». Eine Person, die Rumantsch kann, liest ihn später gegen. «Später» heisst: Er bleibt vorerst Deutsch.'),
  ]})

html = (HIER / 'besprechen-vorlage.html').read_text(encoding='utf-8')
# «</» maskieren: der Prototyp enthält selbst </script>, das würde den Skript-Block der Seite beenden.
js = lambda v: json.dumps(v, ensure_ascii=False).replace('</', '<\\/')
html = html.replace('{{THEMEN}}', js(THEMEN))
html = html.replace('{{SCHILD}}', js(SCHILD.read_text(encoding='utf-8')))
(HIER / 'besprechen.html').write_text(html, encoding='utf-8')
n = sum(len(t['punkte']) for t in THEMEN)
print('besprechen.html', len(html) // 1024, 'kB,', n, 'Punkte')
