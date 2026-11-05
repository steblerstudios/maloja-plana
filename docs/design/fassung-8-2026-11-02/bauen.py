"""Baut fassung-8.html und den Punkteteil von BEFUNDE.md aus den Befunden unten.
Aufruf: python3 -I bauen.py  (im Ordner fassung-8-2026-11-02)."""
import base64, json, pathlib, re

HIER = pathlib.Path(__file__).resolve().parent

def bild(name):
    p = HIER / 'bilder' / name
    return 'data:image/jpeg;base64,' + base64.b64encode(p.read_bytes()).decode()

def b(id, art, was, vor='', emp='Ja'):
    return {'id': id, 'art': art, 'was': was, 'vor': vor, 'emp': emp}

SEITEN = [
  {'id': 'sozialhilfe', 'titel': 'Sozialhilfe', 'bild': bild('sozialhilfe-rechner-oben.jpg'), 'bild2': bild('sozialhilfe-block-unten.jpg'),
   'bildtext': 'Dieselbe Seite, derselbe Stand: oben CHF 2’898 aus dem Rechner, weiter unten CHF 0 und «Kein Anspruch» aus dem Profil. Beispiel Maria, Lohn auf 800 und Vermögen auf 1’000 gestellt.',
   'intro': 'Zuerst durchgegangen, weil heute dort am meisten geändert wurde. Im Browser auf Produktion, fünf Eingaben von Hand.',
   'befunde': [
     b('F8-S1', 'fehler', '<b>Zwei Ergebnisse auf einer Seite.</b> Der Rechner oben folgt den Eingaben, der Block darunter bleibt beim Profil. Mit Lohn 800 steht oben CHF 2’898, unten «Abzug: Einkommen − CHF 6’200», «CHF 0/Mt.» und «Kein Anspruch».', 'Der Block unten folgt dem Rechner.'),
     b('F8-S2', 'fusion', 'Die Bedarfsrechnung steht zweimal: als Tabelle im Rechner und als «SKOS-Bedarfsrechnung» darunter, mit denselben vier Zeilen.', 'Eine Rechnung. Die Erklärung zur Mietzins-Limite wandert zur Zeile Wohnkosten.', 'Besprechen'),
     b('F8-S3', 'fehler', '<b>«Noch eine Angabe nötig» neben «4 von 4».</b> Gemeint sind die Mehrkosten für die Arbeit (<code>sozialhilfeRechner.js:246</code>), der Zähler kennt nur vier Felder (<code>SozialhilfeRechner.jsx</code>, <code>angabenWerte</code>). Die Seite sagt nicht, welche Angabe fehlt.', 'Der Satz nennt die Angabe, und das Feld zählt mit.'),
     b('F8-S4', 'fehler', '<b>Leeres Lohnfeld ergibt den vollen Bedarf als Betrag.</b> Lohn gelöscht: «CHF 3’431 / Monat», daneben «Noch 2 Angaben nötig». Das Feld wird wie 0 gerechnet.', 'Solange das Einkommen leer ist, kein Betrag. Vor dem Bau durch den Fachprüfer.'),
     b('F8-S5', 'fehler', '«Im Rechner unten lassen sie sich eintragen» (<code>de.js:3192</code>), der Rechner steht aber oben.', '«Im Rechner oben».'),
     b('F8-S6', 'flow', '«Nächste Schritte: Sozialdienst kontaktieren, Einkommensnachweise mitbringen» steht auch bei «Kein Anspruch».', 'Nur zeigen, wenn ein Betrag oder «Anspruch möglich» steht.'),
     b('F8-S7', 'sprache', '«Haushalt: 1 Erwachsene» und «1 Person(en)» (<code>de.js:1703, 3143, 6541</code>).', 'Einzahl und Mehrzahl sauber trennen.'),
     b('F8-G1', 'offen', 'Konkubinat plus Bankguthaben: «Anspruch möglich», darunter «Kein Betrag». Aus der Einstiegsdatei, hier nicht nachgestellt.', 'Fachprüfer, dann ein Satz.'),
     b('F8-G2', 'offen', '<code>otherAssets</code> mischt Bargeld, Krypto und Fahrzeug, der Kommentar nennt es Wertgegenstände. Für die SKOS zählen sie verschieden. Aus der Einstiegsdatei.', 'Feld trennen oder Hinweis, was gemeint ist.', 'Besprechen'),
     b('F8-G3', 'offen', 'Vermögenssatz dreimal auf der Seite, bis zehn Vorbehalte als ein Absatz (<code>SozialhilfeRechner.jsx:213</code>). Aus der Einstiegsdatei.', 'Vorbehalte als Liste, Vermögenssatz einmal.'),
   ]},
  {'id': 'dossier', 'titel': 'Dossier und Druck', 'bild': '', 'bildtext': '',
   'intro': 'Vorschau von Lebensmappe, Behörden-Dossier und Notfall-Dossier im Browser gelesen. Das PDF selbst ist nicht erzeugt: Den Druckdialog kann ich hier nicht bedienen.',
   'befunde': [
     b('F8-P1', 'fehler', '<b>App-Anleitung auf dem Blatt fürs Amt.</b> «Angeben lässt sich das im Kapitel Finanzen & Geld» steht unter «Annahmen». Das Amt kann damit nichts anfangen.', 'Auf dem Blatt nur «Ohne 13. Monatslohn gerechnet».'),
     b('F8-P2', 'fehler', 'Das Notfall-Dossier druckt «Patientenverfügung vorhanden? Noch nicht», im Kapitel steht dasselbe Feld auf «nicht erfasst». Niemand hat das angegeben.', 'Unbeantwortete Felder gar nicht drucken.'),
     b('F8-P3', 'aufbau', 'Die Lebensmappe verspricht «alle wichtigen Angaben», zeigt bei Notfall aber weder Blutgruppe noch Allergien noch Medikamente. Der Arbeitgeber steht dafür zweimal.', 'Arbeitgeber einmal. Ob Gesundheitsdaten in die Mappe gehören, ist Ihr Entscheid.', 'Besprechen'),
     b('F8-P4', 'offen', 'Das PDF und die Druckansicht sind nie geprüft worden, auch heute nicht.', 'Sie drucken alle drei mit Maria als PDF, ich prüfe die Dateien.', 'Ja'),
     b('F8-G4', 'offen', 'Summe bei Rappen 1 Franken neben gerundeten Zeilen (<code>dossierGenerator.js:853</code>). Aus der Einstiegsdatei.', 'Summe aus den gerundeten Zeilen oder Rappen überall.'),
     b('F8-G5', 'offen', 'JSON <code>vermoegensfreibetragUnbestaetigt</code> ohne Grund (<code>:1093</code>), Zeile Freibetrag ohne Basis und Stand-Jahr, fehlendes Geburtsdatum lässt 3a still weg, negatives Sparkonto neben der Summe, Feld ohne <code>min</code>. Aus der Einstiegsdatei.', 'Als ein Paket bauen.'),
     b('F8-G6', 'offen', '<code>saeule3aZaehlt</code> prüft nur das Alter. SKOS D.3.3 Abs. 3 nennt auch die ganze IV-Rente, <code>finanzen.ivRente</code> trennt nicht ganz und Teilrente. Das Vermögen wird dann zu tief gerechnet. Aus der Einstiegsdatei.', 'Feld trennen, vor dem Bau Fachprüfer.'),
   ]},
  {'id': 'dashboard', 'titel': 'Dashboard und Was ansteht', 'bild': '', 'bildtext': '',
   'intro': 'Der Wegweiser «Was ist jetzt dran?» und die Fristen sind der grösste inhaltliche Fund des Rundgangs: Die App kennt das Dringende und sagt es nicht.',
   'befunde': [
     b('F8-D1', 'flow', '<b>Die nächste Frist fehlt im Wegweiser.</b> Heute steht «Nächste Frist Steuerfrist · 31. März». Die Kündigung der Krankenkasse läuft am 30.11. ab, in 28 Tagen, und das Franchise-Kreuz rät Maria zu 2’500.', 'Im Herbst zeigt der Wegweiser die Kassenfrist, wenn die Empfehlung von der eigenen Franchise abweicht.'),
     b('F8-D2', 'flow', 'Die Arztrechnung über CHF 180 ist seit dem 30.06.2026 überfällig. Das steht nur auf «Schulden & Rechnungen» und im Tracker, nicht auf dem Dashboard.', 'Überfälliges zeigt der Wegweiser zuerst, ruhig formuliert.'),
     b('F8-D3', 'flow', '«Was ansteht» führt in der Liste nur vier Erinnerungen. Steuerfrist und Kassenfrist fehlen dort, die Steuerfrist steht laut Code nur im Jahreskreis (<code>CalendarReminders.jsx:611</code>).', 'Feste Fristen in dieselbe Liste.'),
     b('F8-D4', 'aufbau', '<b>Fortschritt in fünf Massen:</b> 7/7 begonnen, 65 % ausgefüllt, 72 %, 15/15 und die Kapitelprozente, dazu die Stufen im Obstgarten. Dort heisst «voll gereift» auch 71 %, vier Bäumchen stehen auf «kommt später». Offen seit F7-L4, S5, K2-1.', 'Eine Zahl für alles. Das ist der letzte offene Dashboard-Entscheid.', 'Besprechen'),
     b('F8-D5', 'sprache', '«WERKZEUGE & FEATURES» als Titel. Sonst spricht die App nirgends von Features.', '«Werkzeuge».'),
   ]},
  {'id': 'finanzen', 'titel': 'Finanzen, IPV, Wohnen', 'bild': '', 'bildtext': '',
   'intro': 'Die Summen stimmen. Die Bezeichnungen laufen auseinander.',
   'befunde': [
     b('F8-F1', 'fehler', '<b>Das Kapitel zeigt nicht, woraus «Übriges» besteht.</b> CHF 676 enthalten CHF 21 Säule 3a, die in den sichtbaren Angaben fehlen. Das Budget gruppiert dieselben Ausgaben anders: Leben 535, Mobilität 120, Steuern & Vorsorge 871.', 'Dieselben Gruppen in Kapitel und Budget.'),
     b('F8-F2', 'fehler', '<b>Die Grenze steht ohne Einheit.</b> «Einkommen über Grenze (CHF 61’090)» neben «CHF 6’200 /Mt.». Wer das liest, vergleicht Monat mit Jahr.', '«CHF 61’090 pro Jahr». Vor dem Bau prüfen, auf welches Einkommen sich die Grenze bezieht.'),
     b('F8-F3', 'sprache', '<b>Ein Ergebnis, fünf Wörter:</b> «Nicht berechtigt» (Rechner, Dossier), «Kein Anspruch» (Finanzen), «Voraussichtlich kein Anspruch» (Übersicht), «ergibt sich keine» (Kapitel), «Über der Grenze» (Was steht mir zu). Am 01.11. war entschieden: grobe Rechnung, kein Entscheid.', 'Überall «Voraussichtlich kein Anspruch». Rechtsprüfer vor dem Bau.'),
     b('F8-F4', 'sprache', '«Miete» heisst zweierlei: CHF 1’650 auf «Was steht mir zu?», CHF 1’830 bei Mietzinsbeiträgen und im Sozialhilfe-Feld. Dort sind die Nebenkosten drin. Nicht geprüft, womit «Was steht mir zu?» rechnet.', '«Wohnkosten», wo Nebenkosten drin sind.'),
     b('F8-F5', 'sprache', '«Gesundheitskosten (KVG)» zeigt in Finanzen CHF 240, in der Versicherungs-Übersicht CHF 420. Der Untertitel erklärt es, der Titel nicht.', 'Finanzen: «Bezahlte Gesundheitskosten».'),
     b('F8-V1', 'flow', 'Der Vorsorge-Rechner bleibt für Maria leer («1 von 5»), obwohl die App ≈ CHF 6’796 brutto kennt.', 'Geschätztes Brutto als Vorschlag zum Übernehmen, klar als Schätzung bezeichnet.', 'Besprechen'),
   ]},
  {'id': 'arbeit', 'titel': 'Arbeit, Notfall, Rahmen', 'bild': '', 'bildtext': '',
   'intro': 'Kleinere Punkte aus den übrigen Seiten.',
   'befunde': [
     b('F8-A1', 'fusion', 'Arbeitgeber und Stellenbeginn werden in Finanzen und in Ausbildung & Arbeit getrennt erfasst. Der Punkt K-G8 ist seit Oktober offen.', 'Zuhause in Ausbildung & Arbeit, in Finanzen nur ein Spiegel.'),
     b('F8-A2', 'fehler', 'Der Branchenvergleich zeigt «Gesundheit ’22» neben dem Median 2024.', 'Prüfen, ob das BFS 2024 je Branche liefert, sonst den Jahresunterschied in Worten nennen.'),
     b('F8-N1', 'aufbau', 'Die Patientenverfügung steht mitten im Kapitel Notfall als eigener Block, die übrigen Vorsorge-Fragen in den Angaben, die Vorsorge-Karte zählt beide.', 'Ein Ort, die Vorsorge-Karte.', 'Besprechen'),
     b('F8-R1', 'sprache', 'Fachwörter ohne Erklärung: «Break-even», «KVG-Tracker», «Referenz».', 'Ersetzen, etwa «ab rund CHF 2’050 Kosten im Jahr lohnt sich …».'),
     b('F8-R2', 'sprache', 'Das CSV-Beispiel im Budget ist englisch und von 2024: «Rent», «Salary».', 'Deutsch, in der App-Sprache.'),
     b('F8-R3', 'aufbau', 'Dokumentenablage: «Ihr Ordner ist bereit.» steht zweimal hintereinander.', 'Einmal.'),
     b('F8-Q1', 'flow', '<b>Gemessen auf 375 px:</b> Reiter «Angaben / Dokumente» 33 px hoch auf allen 7 Kapiteln, 21-mal Knöpfe 79 × 31, Begriff-Knöpfe wie IPV 29 px hoch.', 'Auf 44 px. Inline-Quellen im Fliesstext bleiben.'),
   ]},
  {'id': 'quer', 'titel': 'Gesammelte Punkte', 'bild': '', 'bildtext': '',
   'intro': 'Aus der Einstiegsdatei, nicht neu erhoben.',
   'befunde': [
     b('F8-O1', 'offen', '#655 Sprache in Kern und Rest teilen: rund 215 auf 19 KB vor dem ersten Bild. Offen: iPhone, langsames Netz, leere Texte bei <code>import()</code> ohne <code>lazyMitTexten</code>.', 'Fertig prüfen, dann Merge durch Sie.'),
     b('F8-O2', 'offen', '#652 Wiederkehr auf dem Gerät zählen. Wartet auf Juristin, Rumantsch, iPhone.', 'Draussen lassen, bis die drei erfüllt sind.'),
     b('F8-O3', 'offen', 'Rumantsch: 1’339 Stellen <code>TODO(rm)</code> in <code>rm.js</code>, gemessen heute.', 'Fachperson für die Gegenlese suchen.', 'Besprechen'),
     b('F8-O4', 'offen', 'a11y: VorlesenButton 1,9:1, aktive Schalter (<code>main.jsx:252, :1122, :1148</code>), Obstgarten 4-6 px, <code>PraemienOrientierung.jsx:470</code>, BottomAnchor, PrimaryButton 38 px, Fokus nach Schrittwechsel (<code>AblaufSchale.jsx:191</code>).', 'Als ein Paket, mit F8-Q1.'),
     b('F8-O5', 'offen', 'Stempel «September 2026» (<code>seiten-inhalt.mjs:49</code>), alle Abläufe sagen «geprüft im September 2026». Ändern nur nach echter Gegenlese.', 'Gegenlese planen, sonst stehen lassen.', 'Besprechen'),
     b('F8-O6', 'offen', 'Version weiter 0.1.48-beta, Sprung und <code>CHANGELOG</code> offen.', 'Sprung mit dem nächsten Deploy.'),
     b('F8-O7', 'offen', '/simplify und Screenreader sind nicht gelaufen. Ob Stage und /code-review ultra liefen, ist nicht belegt.', 'Vor dem Deploy von Fassung 8 nachholen.'),
     b('F8-O8', 'offen', '<code>FEATURES.md</code> steht auf <code>deployed</code>. Heute wurden 80 Seiten auf Produktion über «Ohne Code ausprobieren» geöffnet, der Weg mit Beta-Code aber nicht.', 'Sie öffnen die App einmal mit Code, dann <code>verified-live</code>.'),
   ]},
]

GUT = ['80 Seiten auf Produktion geöffnet: keine Konsolenfehler, kein rohes undefined oder NaN im Text.',
       'Auf 375 px läuft keine Seite seitlich über.',
       'Nachgerechnet und stimmig: Versicherungen 609, Ausgaben 3’965, frei 2’235, Steuer 8’431 und netto 65’969, Reserve 4.7 Monate, Wohndauer, Anstellungsdauer.',
       'Die Fehler aus Fassung 7 zu Mietbarometer, Zimmerzahl, Nettoeinkommen, Dossier-Beschriftung und HF/Bachelor sind live behoben.']

alle = [x for s in SEITEN for x in s['befunde']]
assert len({x['id'] for x in alle}) == len(alle)

html = (HIER / 'vorlage.html').read_text(encoding='utf-8')
html = html.replace('{{SEITEN}}', json.dumps(SEITEN, ensure_ascii=False)).replace('{{GUT}}', json.dumps(GUT, ensure_ascii=False)).replace('{{ANZAHL}}', str(len(alle)))
(HIER / 'fassung-8.html').write_text(html, encoding='utf-8')

text = lambda s: re.sub(r'<[^>]+>', '', s).replace('<code>', '`')
zeilen = []
for s in SEITEN:
    zeilen += ['', '## ' + s['titel'], '', s['intro'], '']
    for x in s['befunde']:
        zeilen.append(f"- **{x['id']}** ({x['art']}, Empfehlung {x['emp']}): {text(x['was'])} *Vorschlag:* {text(x['vor'])}")
zeilen += ['', '## Gut so', ''] + ['- ' + g for g in GUT] + ['']
kopf = (HIER / 'BEFUNDE.md').read_text(encoding='utf-8').split('\n<!-- PUNKTE -->')[0].rstrip()
(HIER / 'BEFUNDE.md').write_text(kopf + '\n\n<!-- PUNKTE -->' + '\n'.join(zeilen), encoding='utf-8')
print('fassung-8.html', len(html) // 1024, 'kB,', len(alle), 'Punkte')
