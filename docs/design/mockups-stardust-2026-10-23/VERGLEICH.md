# Heute neben neu · Seite für Seite (23.10.2026)

Auftrag (Stebler Studios): jede Seite von heute neben ihre neue Fassung halten und schauen,
was in der neuen Version noch fehlt oder anders ist. **Ansehen:** `vergleich.html` — links das
Bild von heute, rechts Fassung 4 zum Antippen, darunter die Liste mit Filter.

## Wie gemessen

Im Demo-Modus («Maria Muster»), Stand `main` 0eba0fc1 (nach #534/#537/#538), Handy 390 × 844.
Ein Skript hat jede Seite vollständig durchgezählt — Überschriften, Felder, Knöpfe, Links,
Texte —, nicht nur den sichtbaren Anfang. Rohdaten: `vergleich-inventar.json`.

| Seite | Bausteine heute | fehlt noch im Mockup | anders | drin | neu |
|---|---|---|---|---|---|
| Eingang | 12 | 0 | 0 | 4 | 0 |
| Übersicht | 98 | 10 | 4 | 2 | 0 |
| Kapitel Finanzen | 51 | 3 | 3 | 3 | 1 |
| Rechner IPV | 39 | 5 | 4 | 2 | 1 |
| Ablauf Umzug | 47 | 5 | 1 | 1 | 1 |
| Dokumentenablage | 13 | 2 | 2 | 2 | 1 |
| Merkliste | 10 | 2 | 1 | 1 | 1 |
| Kalender · Was ansteht | 57 | 4 | 2 | 0 | 1 |
| Menü | 16 | 3 | 1 | 2 | 1 |

## Was am meisten wiegt

1. **Übersicht:** Die Mockups zeigen nur Bild, Karte und Bereiche. Heute gibt es zusätzlich
   «Was steht mir zu?», «Leistungen» mit Einkommens-Eingabe, «Ihre Instrumente»
   (Franchise-Kreuz, Steuer-Säule, Reserve-Tankanzeige, Schutzschild), Obstgarten,
   Werkzeuge nach Gruppen, «Jetzt sichern», Tipps, den Beta-Hinweis und die Demo-Leiste.
2. **Rechner IPV — Fehler im Mockup:** heute rechnet er mit der kantonalen **Jahresgrenze**
   (Zürich CHF 61'090, Modell einkommensabhängig, Anspruchsjahr 2026, Prämienregion 1) und zeigt
   monatliche und jährliche Förderung. Das Mockup hatte eine erfundene Monatsgrenze.
3. **Ablauf Umzug:** heute **vier** Schritte (Mockup: drei) — mit Umzugsdatum und Hinweis bei
   verpasster Frist, Mietzinsbeiträgen, «Adresse überall nachführen» (6 Stellen, merken,
   Adressänderungs-Brief) und Quellen (RHG Art. 11, OR Art. 266c).
4. **Kapitel:** die Lohn-Einordnung (Median, BFS) fehlt im Mockup, ebenso die Reiter
   «Angaben / Dokumente»; heute sind es **sieben** Gruppen statt der vier erfundenen.
5. **Merkliste und Kalender:** das Hinzufügen fehlt im Mockup (Eingabe + «Verknüpfen mit»;
   «+ Erinnerung hinzufügen»), ebenso Monats-/Jahressprung und «Erledigt».
6. **Menü:** Steuern, Finanz-Übersicht, Lebenssituationen, «Alle Werkzeuge im Gepäck»,
   «Auf den Startbildschirm legen» und die Gliederung Alltag/Absicherung/Schutz fehlen.

**Nächster Schritt:** Fassung 5 holt die «fehlt noch»-Punkte in die Mockups, damit nichts
verloren geht, was heute funktioniert — Seite für Seite, in der Reihenfolge oben.

---

## Nachtrag 23.10.2026 · Fassung 5 neben heute

**Ansehen:** `vergleich-v5.html`. Gleiche Seite wie oben, rechts jetzt Fassung 5 (`seiten-v5.html`),
in der Spalte «Stand» steht bei jeder geänderten Zeile auch der Stand von Fassung 4.
`vergleich.html` (Fassung 4) bleibt unverändert als Beleg.

Ergebnis der Einordnung (von Hand, Zeile für Zeile gegen die Liste oben):
**0 fehlt noch · 10 anders · 59 drin · 7 neu.** Der Eingang steht weiter neben Fassung 4,
weil Fassung 5 ihn nicht neu zeichnet (er ist seit #537 live).

Die zehn «anders» sind bewusste Entscheide oder offene Fragen, kein Vergessen. Sie sind der Stoff
fürs gemeinsame Durchgehen, Seite für Seite:
- Übersicht: Ring «63 %» statt zwei Kreisen (welche Zahl gilt?), Karte «Ihr Lebensordner»,
  Bereichszeilen ohne %, die Bereiche ein Mal statt zwei Mal
- Kapitel: Kopf links statt zentriert
- Rechner: «Anspruch» als Aufklapp-Zeile
- Ablage: Reiter erst ab Inhalt (heute auch leer «0 Aktiv · 0 Archiv»), Suche erst ab Inhalt
- Kalender: Titel «Was ansteht» statt «Kalender und Erinnerungen», Tagesleiste statt Monatsraster

Die Mess-Skripte der alten Sitzung liegen jetzt unter `messung/`.

### Übersicht · Befunde beim Durchgehen (23.10.2026, noch nicht entschieden)

Sophie will **nicht mit der Übersicht beginnen**. Die Punkte sind festgehalten, entschieden ist nichts:
- **63 % gegen 70 %:** beides ist richtig gerechnet. 63 % = ausgefüllte Felder über alle Bereiche
  (`gesamtVollstaendigkeit` in `utils/vollstaendigkeit.js`). 70 % = Durchschnitt der sieben
  Bereichs-Prozente (`BergDetail.jsx`). Finanzen hat viele Felder bei 38 % und drückt die erste Zahl.
- **Erfundener Text in Fassung 5:** «Am meisten offen: Finanzen & Geld.» steht nicht in `de.js`.
  Heute heisst es «Weiter mit Finanzen & Geld ›». «Ihr Lebensordner» als Kartentitel gibt es so
  auch nicht.

### Kapitel Finanzen · Befunde beim Durchgehen (23.10.2026, noch nicht entschieden)

Sophie hat auf den Umzug gewechselt; offen bleiben:
- **Kopf:** heute zentriert (Münze, Titel und Satz in Gold), Fassung 5 links und ruhig.
- **Texte ohne Vorbild in `de.js`:** «Jeden Monat bleiben», «verplant», «Einkommen, netto»,
  «Passend zu diesem Bereich» mit «Lohnausweis ablegen», «Ablauf · 5 Schritte», «Als Nächstes».
- **Reiter «Dokumente»:** heute ein Formular (Dokumenttyp, Ablaufdatum, «Datei auswählen oder
  hierher ziehen», «Hochladen», «Erforderliche Dokumente», «Ihre Dokumente bleiben auf diesem
  Gerät.»). Fassung 5 zeigt nur einen erfundenen Leer-Satz und «Dokument fotografieren». Die
  Messung hatte den Reiter nicht geöffnet, darum stand das nicht in der Liste.
- Korrigiert (0cbf2487): die Zusammenfassung endet wieder mit «Es bleiben CHF 2'480.».

### Ablauf Umzug · entschieden (Sophie, 23.10.2026)

- **Ein Schritt nach dem anderen** auf der Passstrasse, wie Fassung 5 (heute: alle vier Schritte
  auf einer Seite).
- **Frist als Karte mit Datum** («Anmeldung Gemeinde · bis …» + «In den Kalender»); danach die
  App-Sätze «Im Kalender notiert.» und «Zum Kalender».
- **Keine Unterzeile** beim Krankenkassen-Verweis; nur «Krankenkassen-Prämie prüfen ›» wie heute.
- Korrigiert beim Durchgehen (87bff394): Einleitung und 14-Tage-Satz wieder vollständig, der Satz
  wechselt mit der Art des Umzugs (step2Text, _gemeinde, _kanton, _extra).
- Neu und für den Copy-Prüfer: «Erledigt, weiter ›», «Ablauf abschliessen», «Der Umzug ist
  geordnet» mit Satz.

### Dokumentenablage · entschieden (Sophie, 23.10.2026)

Aus dem Code (`DocumentTresor.jsx`): **Archiv = abgelaufene Dokumente**, «Bald fällig» = aktiv und
weniger als 90 Tage bis zum Ablauf. Der Archiv-Platzhalter in Fassung 5 war darum falsch (cec1bf26).
- **Drei Zähler** «Aktiv · Bald fällig · Archiv» wie heute, aber **erst mit Inhalt**.
- **Suche und Sortierung erst mit Inhalt.**
- **Zeile pro Dokument mit den App-Texten:** Typ, Dateiname, «Hochgeladen: … · Grösse»,
  «gültig / {Tage}d / Abgelaufen · Ablauf: …», Ablaufdatum direkt änderbar (OK / Abbrechen),
  dazu Herunterladen und Entfernen.
- **«Was oft zuerst hineingehört»** mit drei Vorschlägen bleibt (neu, Copy-Prüfer). Die erfundene
  Übersichtszeile ist ersetzt durch «{n} Dokumente» (tresor.docCount).
- Für den Copy-Prüfer: der Status «54d» ist knapp und wörtlich aus der App.

### Merkliste · entschieden (Sophie, 23.10.2026)

- **Verknüpfung als Unterzeile** mit ›, der ganze Eintrag ist die Tippfläche (heute: kleiner Knopf rechts).
- **Bereichs-Symbol pro Eintrag** wie Fassung 5. Die Zuordnung Werkzeug → Bereich gibt es in der
  App noch nicht; der Vorschlag steht in der Notiz unter dem Mockup und muss vor dem Bau festgelegt werden.
- **Neue Einträge oben** (heute: unten).
- Korrigiert (c5243a87): kein erfundenes «ohne Verknüpfung» mehr.
- Entfernen mit «Rückgängig» war schon entschieden (Entscheid «C», §15); heute löscht die App sofort.

### Kalender · entschieden (Sophie, 23.10.2026)

Die Messung hatte nur den leeren Kalender erfasst; im Code (`CalendarReminders.jsx`) steht mehr.
- **Titel «Was ansteht»** (heute «Kalender und Erinnerungen»).
- **Beides:** Tagesleiste mit Monatssprung, darunter aufklappbar «Ganzer Monat» als Monatsraster
  (der Name «Ganzer Monat» ist neu, Copy-Prüfer).
- **Formular wie heute, vollständig:** Text («Erinnerung hinzufügen...»), Datum, Kategorie (10),
  Wiederkehrend (Einmalig bis Jährlich), bei Gesundheit «Von der Grundversicherung gedeckt?» und
  «Letzter Besuch» (rechnet den nächsten Termin), Notiz («Optional...»), dazu «Schnell hinzufügen
  aus Vorlagen» (11 Vorlagen, tragen direkt ein, Deckungs-Hinweis als Notiz).
- **«Kalender exportieren (.ics)»** mit Satz, am Ende.
- **«Möglicherweise für Sie da»** oben. Erscheint nur mit gedecktem Anspruch (IPV, Sozialhilfe, EL);
  bei Maria Muster also nicht. Im Mockup per Schalter beide Zustände.
- Vor dem Bau festlegen: Kategorie → Bereichsfarbe (Vorschlag in der Notiz unter dem Mockup).
- Korrigiert (af59cebd): Formular-Texte aus der App statt «Titel» / «Datum».

### Merkliste und Kalender verknüpft · Icons (Sophie, 23.10.2026)

- **Eine Sache statt zwei:** Die Merkliste ist die To-do-Liste. Ein Eintrag kann einen Tag bekommen
  («Tag wählen» in der Merkliste) und erscheint dann in «Was ansteht» als **Aufgabe** an diesem Tag
  (Quadrat in der Leiste und im ganzen Monat).
- **Erledigtes im Kalender:** am Tag, an dem es erledigt wurde (leerer Kreis), im Reiter «Erledigt»
  mit «erledigt am …». Abhaken geht in der Merkliste und im Kalender, beide bleiben gleich.
- **Verteilen:** To-dos ohne Tag warten in «Was ansteht» im Fach «Noch ohne Tag». «Auf einen Tag
  legen», dann einen Tag antippen. Ersetzt die Zeile «Ohne Datum: 4 Einträge auf der Merkliste».
- **Icons:** «Was ansteht» = Kalender mit dem heutigen Datum; Dokumentenablage = Ordner (wie
  `OrdnerIcon` in der App); Merkliste = Haken (wie in der App). Vorher hatten Was ansteht und
  Merkliste das Behörden-Icon, die Ablage das Icon der Persönlichen Basis.
- Neu für den Copy-Prüfer: «Aufgabe», «aus der Merkliste», «Tag wählen», «Ohne Tag»,
  «erledigt am …», «Noch ohne Tag», «Auf einen Tag legen», «Jetzt oben einen Tag antippen.».
- Für den Bau: Die App speichert Merkliste und Kalender heute getrennt (`MerklisteView.jsx`,
  `CalendarReminders.jsx`). Die Verknüpfung braucht ein gemeinsames Datenfeld (Tag am Merkpunkt).
- Nebenbei behoben: Die Klasse `.erledigt` der Umzug-Marken hat die erledigten Merkliste-Einträge
  zerdrückt; jetzt auf `#erledigt` beschränkt.

### Menü · entschieden (Sophie, 23.10.2026)

- **Karten mit Satz** auf ganzem Bildschirm, wie Fassung 5 (heute: schmales Panel, Zeilen ohne Satz).
- **Die vier Anker bleiben oben** (Übersicht, Was ansteht, Rucksack, Was steht mir zu?). Ihre Sätze
  sind neu und gehen an den Copy-Prüfer.
- **Bereich-Sätze** = die Kapitel-Beschreibungen der App (chapters.*.description), korrigiert in 126a8a0f.
- **Unten:** Einstellungen, Einfache Ansicht, Datenschutz & Rechtliches, Problem melden und
  «Lokal gespeichert. Ihre Eingaben verlassen Ihr Gerät nicht.» (nav.privacyNote).
  Begründung: Vertrauen (lokal), Rechtliches muss von überall erreichbar sein, Melden während der
  Beta, Einfache Ansicht für Barrierefreiheit.
- **«Rundgang neu starten» nicht im Menü:** steht in der App schon bei den Einstellungen (MobileNav.jsx).

### Rechner IPV · teilweise entschieden (Sophie, 23.10.2026)

- Korrigiert (7ec07e01): Untertitel und Anspruchs-Text vollständig; unter der Grenze «Berechtigt» und
  «Möglicher Betrag — nur auf Antrag» (statt erfundenem «Wahrscheinlich berechtigt»); «Unterlagen für
  den Antrag merken» legt wie die App «IPV-Antrag: Police und Lohnabrechnungen der letzten 3 Monate
  bereitlegen» auf die Merkliste (verknüpft mit der Ablage), danach «Auf der Merkliste».
- **Regler bleibt**, mit «Ins Profil übernehmen» wie im Schnellcheck (Texte premium.schnellcheck*).
- **Glossar «IPV ⓘ» bleibt.** Die App hat Glossar-Begriffe schon (`GlossarText`), es ist also nicht neu.
- Offen: Überschriften, «Frist in den Kalender», und Teile, die nur unter Bedingungen erscheinen
  (aus `PremiumSubsidy.jsx`, nicht in der Messung): «Ihr IPV-Weg» (Automatisch / Antrag, «Ich habe
  beantragt», «Verfügung erhalten», Betrag laut Verfügung, «Jährlich erinnern»), «Alle Kantone
  vergleichen», Vorlesen, Hinweise zu Wochenaufenthalt und jungen Erwachsenen, Kanton wählen.

### Rechner IPV · entschieden (Sophie, 23.10.2026)

- **Überschriften wie die App:** «Anspruch & Aufenthaltsbewilligung», «Benötigte Dokumente»,
  «Offizielle Stelle & Antrag». «Ihre Lage» bleibt als neuer Titel (Copy-Prüfer).
- **«Frist in den Kalender» ist raus** (keine belegte Frist). Dafür **«Ihr IPV-Weg»** wie in der App:
  Automatisch / Antrag → «Ich habe beantragt» → «Verfügung erhalten» → Betrag laut Verfügung, und
  **«Jährlich erinnern»** legt «Prämienverbilligung fürs nächste Jahr prüfen» als **jährliche Aufgabe**
  in Merkliste und Kalender (↻ Jährlich). Abweichung zur App: dort erst nach der Verfügung, hier in
  jedem Schritt (Wunsch Sophie: sich das als Aufgabe eintragen können).
- **Vorlesen** neben dem Untertitel (Browser-Sprachausgabe, wie `VorlesenButton`).
- **Hinweise je nach Lage** (Wochenaufenthalt, junge Erwachsene, Kanton fehlt) mit den App-Texten;
  im Mockup über einen Schalter, weil Maria Muster keinen davon sieht.
- **«Alle Kantone vergleichen» bewusst nicht im Mockup:** Die App zeigt die Tabelle nur mit amtlich
  belegten Kantonen; das sind heute **0 von 26**. Sie erscheint also heute nirgends. Vor dem Bau
  klären, ob und mit welchen Quellen sie kommen soll.
- **Förderbeträge unter der Grenze** rechnet die App mit nachgeladenen kantonalen Modellen
  (`calculateIPV`); ausserhalb des Browsers liefert die Rechnung nur «laden». Das Mockup zeigt darum
  keinen Betrag, sondern «Möglicher Betrag — nur auf Antrag».

### Kapitel Finanzen · entschieden (Sophie, 23.10.2026)

- **Kopf links und ruhig** wie alle anderen neuen Seiten (heute zentriert, Münze und Satz in Gold).
- **Neue Teile bleiben** und gehen an den Copy-Prüfer: «Jeden Monat bleiben CHF 2'480» mit
  «verplant» / «Einkommen, netto», «Passend zu diesem Bereich» und «Als Nächstes».
- **Reiter «Dokumente» wie heute plus Fotografieren:** Dokumenttyp (aus den Kapitel-Dokumenten:
  Steuererklärung, Lohnzettel, Kontoauszug), Ablaufdatum, «Datei auswählen oder hierher ziehen»,
  «Hochladen», «Erforderliche Dokumente», «Ihre Dokumente bleiben auf diesem Gerät.», Fehlertexte der
  App; dazu «Dokument fotografieren» als zweiter Weg. Der erfundene Leer-Satz ist weg.

### Kapitel Finanzen · alle Felder (Sophie, 23.10.2026)

Frage von Sophie: fehlen da nicht noch Details? **Ja:** Die App hat 37 Felder in sieben Abschnitten,
Fassung 5 zeigte etwa 12. Jetzt im Mockup:
- **Alle 37 Felder** mit den Namen aus `de.js`, Werte aus Marias Beispieldaten (`config/demoData.js`).
  Dabei aufgefallen: Mobilität (CHF 120), Sparziel (CHF 500), Erspartes (CHF 18'500) und Hausbank (ZKB)
  sind bei Maria ausgefüllt, standen im Mockup aber nicht oder nur als «erfasst».
- **Bearbeiten** wie die App: «ändern ›» öffnet die Felder des Abschnitts mit Hinweisen und dem
  Orientierungs-Satz (Einkommen, Steuern, Schuldenraten, Säule 3a), dann «fertig».
- **Weitere Bereiche anzeigen:** steuerbares Einkommen und die ganze Vorsorge (secondary-Felder),
  mit dem App-Hinweis «Einige ausgeblendete Bereiche enthalten bereits Daten.».
- Offen für den Bau: ob die fünf Nebenerwerb-Felder immer oder erst mit einem Nebenerwerb erscheinen
  (im Mockup immer, wie in der Feldliste).

### Kapitel Finanzen · die eingebauten Helfer (Sophie, 23.10.2026)

Sophie: «es fehlen mir die Details, die wir bei den Finanzen eingebaut haben». Aus `ChapterView.jsx`
übernommen, jeweils im Bearbeiten unter dem passenden Feld, Texte aus `de.js`:
- **Monatliches Einkommen:** Mindestlohn-Check («In Ihrem Kanton gibt es keinen gesetzlichen
  Mindestlohn.» — Zürich hat keinen, `kantonHatMindestlohn('ZH')` = false) und die Wegweiser
  «IPV-Anspruch prüfen», «Bundessteuer abschätzen», «Orientierung: Was steht Ihnen gemäss SKOS zu?»,
  «Alle Berechnungen auf einen Blick».
- **Lebensmittel & Haushalt, Internet & Telefon:** «Posten hinzufügen» mit Bezeichnung und Betrag,
  die Summe wird zum Feldwert (`ItemizedAmount`).
- **Kreditkarten vorhanden? = Ja:** «Lohnt sich die Karte? Kosten und Vorteile rechnen».
- **Säule 3a:** Einzahlungen mit Datum und Betrag, «Einzahlung hinzufügen», Stand gegen das
  Maximum 2026 (CHF 7'258 mit Pensionskasse, `data/saeule3a.js`).
- **Alimente (keine Kinder):** eingeklappt und gedämpft, «betrifft Sie aktuell nicht — antippen zum
  Erkunden», mit der Orientierung zum Kindesunterhalt und dem Link der Zürcher Gerichte.
- **«Trifft nicht zu»** bei Arbeitgeber, Adresse, Arbeitsbeginn und Alimente; zählt als erledigt.
- Nicht übernommen, weil bei Maria nicht sichtbar: Lohn-Hinweis «unter dem Mindestlohn» (nur in
  Kantonen mit Mindestlohn), Hinweis zur verpassten Steuerfrist, Partnereinkommen.

### Kapitel Finanzen · Barometer und Ruhe (Sophie, 23.10.2026)

- **Barometer wie die App** (`LohnEinordnung.jsx`): vier gleich breite Abschnitte (unteres Zehntel /
  unterer Bereich / oberer Bereich / oberes Zehntel), jeder füllt sich bis zum Lohn; darüber die belegten
  Grenzen CHF 4'635 und CHF 12'526, darunter die Namen, der eigene Abschnitt hervorgehoben; Median-Punkt
  in Gold (Lohn darunter). Werte BFS LSE 2024, Skala CHF 3'000–13'000.
- **Mindestlohn-«!»** nur in Kantonen mit Mindestlohn (GE, NE, JU, BS, TI). Zürich hat keinen, darum
  sieht Maria es nie. Im Mockup über den Schalter «Kanton mit Mindestlohn (Basel-Stadt)»: «!» bei rund
  CHF 4'040 (22.20 × 182 Std.) mit der App-Zeile «Kantonaler Mindestlohn: …», und im Bearbeiten der
  App-Hinweis, dass Maria Netto erfasst hat und der Vergleich den Bruttolohn braucht.
- **Ruhiger:** die drei langen Lohn-Hinweise stecken hinter «So ist gerechnet» (Texte unverändert);
  die vier Wegweiser beim Lohn sind eine Reihe kleiner Knöpfe statt einer Liste; die fünf
  Nebenerwerb-Felder stecken hinter einer Zeile «Nebenerwerb · falls vorhanden» (offen, sobald etwas
  erfasst ist). Neu für den Copy-Prüfer: «So ist gerechnet», «falls vorhanden».
- **«Trifft nicht zu» leiser** (Sophie, 23.10.): kein eigener Knopf mehr unter dem Feld, sondern ein
  kleines graues Wort rechts neben dem Feldnamen; danach dort «Zurücknehmen». Tippfläche 32 px hoch,
  für den Bau auf 44 px prüfen (a11y-Prüfer).
