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

### Vor dem Bau festgelegt (Sophie, 23.10.2026, Auswahl-Dialog in der Bau-Sitzung)

- **Umfang:** «Möglichst alles» von Fassung 5 in den Nachzug **29.10.** (Übersicht ausgenommen, nicht entschieden).
- ~~**Merkliste · Bereichs-Symbol:** Vorschlag aus dem Mockup gilt — IPV, Prämien, Vorsorge → Versicherungen ·
  Steuern, Kalender, Offizielle Links → Behörden · Sozialhilfe → Finanzen · ALV, Stipendien → Ausbildung ·
  Asyl, Ablage, ohne Verknüpfung → Persönliche Basis.~~
- ~~**Kalender · Kategorie → Bereichsfarbe:** Vorschlag gilt — Gesundheit/Versicherung → Versicherungen,
  Verwaltung/Recht → Behörden, Arbeit/Ausbildung → Ausbildung, Familie/Persönlich → Basis; übrige → Basis.~~
  > ⟨überholt, Sophie 23.10.2026 abends⟩ **Es gilt der Block «Zuordnungen Merkliste und Kalender ·
  > festgelegt» weiter unten** (aus `werkzeugRegister.js`). Die beiden Zeilen oben waren der erste
  > Mockup-Vorschlag, bevor die App geprüft war. Sie lagen bei Steuern, ALV und Asyl daneben und hätten
  > «Steuern» in der Merkliste anders eingefärbt als im Kapitel. Sophie: «Ja, Liste B».
- **Kapitel Finanzen · Nebenerwerb:** die fünf Felder erscheinen **erst mit Nebenerwerb**.
- **Sprachen:** FR/IT/EN und **auch rm** entwirft Claude selbst; rm als ungeprüft markiert bis zur Gegenlese.
  Copy-Prüfer liest alle neuen Texte vorher.
- **Gemeinsames Feld «Tag»** (Merkliste ↔ Kalender): technischer Entscheid der Bau-Sitzung — optionales
  Datumsfeld am Merkpunkt, alte Einträge ohne Tag bleiben gültig (keine Migration).
- **«Alle Kantone vergleichen»:** App-Logik bleibt wie sie ist (erscheint erst mit amtlich belegten Kantonen).

### Zuordnungen Merkliste und Kalender · festgelegt (Sophie, 23.10.2026)

Abgeleitet aus der App selbst: `data/werkzeugRegister.js` gibt jedem Werkzeug ein «fach»
(geld · gesundheit · alter · Aussenfach), `config/ansichtenRegister.js` dem Asyl-Ablauf den Bereich
Behörden. Mein erster Vorschlag lag bei Steuern, ALV und Asyl daneben.

**Merkliste (Werkzeug → Bereich):** IPV, Prämien-Orientierung, Vorsorge-Rechner → Versicherungen &
Vorsorge · Steuern, Sozialhilfe, ALV-Taggeld → Finanzen & Geld · Stipendien → Ausbildung & Arbeit ·
Asyl & Schutz → Behörden & Rechtliches · Dokumentenablage, Kalender, Offizielle Links und Einträge ohne
Verknüpfung → **kein Bereich**: eigenes Symbol (Ordner, Kalender mit Datum, Globus, Haken) in neutralem
Grau-Grün, wie das «Aussenfach» der App.

**Kalender (Kategorie → Bereich):** Gesundheit, Versicherung → Versicherungen & Vorsorge · Finanzen →
Finanzen & Geld · Verwaltung, Recht → Behörden & Rechtliches · Arbeit, Ausbildung → Ausbildung &
Arbeit · Wohnen → Wohnen & Leben · Familie → Persönliche Basis · Persönlich → kein Bereich,
Kalender-Symbol neutral.

---

## Eingang · durchgegangen (23.10.2026 abends)

**Verglichen:** App heute (Werkbank `eingang-als-ort`, Stand #537, live in `main`), Code `src/BetaGate.jsx`,
gegen den Entwurf `index.html?nur=eingang` (Fassung 4, Fassung 5 zeichnet den Eingang nicht neu).

**Befund:** Der Eingang von heute *ist* der umgesetzte Entwurf. #537 hat nur Anordnung und Gewicht
übernommen, die Texte blieben die der App («Texte unverändert», Kommentar in `BetaGate.jsx`).
Dadurch hat die App drei Fehler des Entwurfs gar nicht erst übernommen:
- Entwurf **ohne** den Satz «Diese App befindet sich in der geschlossenen Beta. Bitte geben Sie den
  Zugangscode ein.» (`beta.gateMessage`): die App zeigt ihn
- Entwurf **ohne** «Stebler Studios · Basel»: die App zeigt es
- Entwurf kürzt das Versprechen auf «Ihre Daten bleiben auf diesem Gerät.»: die App zeigt den
  vollen Text «Lokal gespeichert — Ihre Daten bleiben auf diesem Gerät» (`trust.localBadge`)

Dunkel gegen hell ist **kein** Unterschied in der Sache: die Fassung-5-Entwürfe zeigen den Dunkelmodus,
den die App auch hat (`data-theme`).

### entschieden (23.10.2026)

- **Eingang bleibt, wie er heute live ist.** Fassung 5 ändert dort nichts.
- **«Einfache Ansicht» bleibt ein Knopf** (Entwurf: kleiner Link unten). Grund: Wer die einfache Ansicht
  braucht, sieht schlecht oder ist am Handy unsicher und muss sie sofort finden. Ein kleines Wort
  unten übersieht man am ehesten.
- **«Lokal gespeichert» darf zweimal stehen** (Text oben und neben dem Schloss). Das ist das wichtigste
  Versprechen der App. Eine Kürzung bräuchte neue Texte in 5 Sprachen und den Rechts-Prüfer, für wenig
  Gewinn.

Sophie hat zweimal gefragt «was ist besser und warum?». Entschieden hat Claude nach der Empfehlung
oben. Ein Widerspruch kann das jederzeit wieder öffnen.

---

## Runde 2 · Steuern, Finanz-Übersicht, Einstellungen (23.10.2026 abends)

**Gemessen:** Demo «Maria Muster», Werkbank `eingang-als-ort` (= `main` 0eba0fc1), 375 × 812, Dunkelmodus.
Bilder: `heute-steuern.jpg`, `heute-finanzuebersicht.jpg`, `heute-einstellungen.jpg`.
Inventar: `vergleich-inventar-runde2.json` (Skript `messung/inventar-messung.js`).

| Seite | Bausteine heute |
|---|---|
| Steuern (`#/tax`) | 84 |
| Finanz-Übersicht (`#/finanzuebersicht`) | 79 |
| Einstellungen (`#/settings`) | 33, dazu die Zahnrad-Schublade «Ansicht & Sprache» |

### Befund, der die App heute betrifft (nicht nur die Entwürfe)

- **«Bundessteuer berechnen»** (`nav.sub.taxes`, in allen 5 Sprachen) steht unter «Steuern» auf der
  Übersicht und im Menü. Die Seite rechnet aber Bund **und** Kanton und Gemeinde (ESTV-Messpunkte,
  Steuerjahr 2026). Der Untertitel ist veraltet. Korrektur gehört in den Bau, mit dem Copy-Prüfer.

### Einstellungen · Entwurf I (`seiten-v5.html?nur=i`)

**Heute:** zwei fast gleiche Orte. Die Seite `#/settings` hat Anzeige & Sprache, Barrierefreiheit,
Daten & Sicherung (Persönliche Basis bearbeiten, Export, Benachrichtigungen) und «Alle Daten auf diesem
Gerät löschen». Die Schublade hinter dem Zahnrad («Ansicht & Sprache») hat dieselben Schalter, dazu
«Rundgang neu starten», «Konto & Daten» und «Backup & Export», aber kein Löschen und keine Persönliche Basis.

**Gefunden:**
- Neben «Erscheinungsbild» steht im Dunkelmodus ein Knopf **«Hell»**. Gemeint ist «auf Hell umschalten»
  (`ThemeToggle.jsx`), man liest es als «ist gerade hell». Gleich bei «Anrede: Sie».
- Die Barrierefreiheits-Knöpfe zeigen nur ein Symbol. Ob etwas an ist, sieht man kaum.
- Gruppentitel in Versalien («ANZEIGE & SPRACHE»), entgegen der Fassung-5-Regel.

**Entwurf:** alles auf einer Seite; «Hell | Dunkel» und «Sie | Du» als Wahl mit hervorgehobener
Auswahl; Schalter, die ihren Zustand zeigen; «Rundgang neu starten» auch hier; keine neuen Sätze.
Noch nicht entschieden.

### Steuern · Entwurf J (`seiten-v5.html?nur=j`)

**Heute:** Eingaben → sechs Abzüge → Berechnung → drei Ergebnis-Kästen → Zivilstand-Säulen → Quellen.
Das Ergebnis steht erst nach dem dritten Bildschirm. «Veranlagung ⓘ» steht zweimal hintereinander.

**Entwurf:** zuerst die geschätzte Gesamtsteuer (gross), ein Balken Bund/Kanton-Gemeinde und die zwei
Teile, dann die Eingaben (aufgeklappt), Berechnung (zugeklappt), Zivilstand, Quellen, offizielle Stelle.
Zustand «Kanton fehlt» per Schalter. Alle 84 Bausteine drin.

**Bedingte Teile** (aus dem Code, Maria sieht sie nicht; bleiben im Bau wie heute): Wohnkanton-Frage,
Elterntarif (ledig mit Kindern), «steuerbares Einkommen als Basis», Kinderabzug, Hinweise ohne Zahl
(Bruttolohn, Rente, selbständig, Partner offen, Konkubinat), Einkommen ausserhalb der Tabelle
(`tax.bandOutside`), «Nur die Bundessteuer ist abgezogen» ohne Kanton.

### Finanz-Übersicht · Entwurf K (`seiten-v5.html?nur=k`)

**Heute:** der erste Bildschirm ist nur der 3D-Lebensbaum. Dann Nettoeinkommen, Lohn, Branchen, Miete,
sechs Kästen (Steuern, IPV, Sozialhilfe, EL, Vermögen, Gesundheitskosten), KK-Last, ganz unten Budget
und Notgroschen.

**Entwurf:** zuerst Monatsbudget, frei verfügbar, Notgroschen. Dann die sechs Zeilen (je zum Werkzeug),
dann Lohn (Barometer mit vier Abschnitten wie im Kapitel), Miete und KK-Last zugeklappt. Der Baum bleibt
ganz, weiter unten (Leitplanke 06.07.). Zustand «Noch kein Einkommen» per Schalter. Alle 79 Bausteine drin.

**Bedingte Teile** (bleiben im Bau wie heute): Haushalt-Zeile, «Unter Armutsgrenze», Mindestlohn-«!»
(GE, NE, JU, BS, TI), KK-Last über 10 % mit IPV-Knopf, mehrere Einnahmequellen, Bruttolohn-Hinweis.
Die Gesundheitskosten-Karte zeigt nur das laufende Jahr.

**Copy-Prüfer:** Du-Form schreibt `finanzUebersicht.*` «Deine/Dich» gross, `tax.*` «deine/dir» klein.

### Textprüfung I/J/K gegen `de.js` und die laufende App (23.10. abends)

Skript in der App (`fetch('/src/i18n/de.js')` + Seitentexte). Fünf Texte waren nicht belegt und sind
ersetzt oder gestrichen: Erklärsatz zu «Bundessteuer ⓘ» (jetzt `glossar.bundessteuer`), «Begriffe:»,
«0 Kinder», «Kein Kanton» (Marke wird ausgeblendet). Bleibt bewusst: der Platzhalter für den Baum
(Mockup, kein App-Text) und der Abschnittsname «Datenstand · Offizielle Stelle & Antrag» (zwei App-Wörter).
Neu für den Copy-Prüfer: «Vorlesen» statt «Vorlesen ein/aus» und «Backup & Export» auch auf der Seite.

**Bilder neben heute:** `neu-steuern.jpg`, `neu-finanzuebersicht.jpg`, `neu-einstellungen.jpg`;
`vergleich-v5.html` hat jetzt 12 Seiten.

**Noch nicht entschieden:** die drei Entwürfe I, J, K. Empfehlung Claude: so übernehmen.

### entschieden (Sophie, 23.10.2026 abends)

- ~~**Steuern (J) und Einstellungen (I) gelten so.** Sophie wörtlich: «steuern und einstellungen sind super».~~
  > ⟨korrigiert, Sophie 23.10. abends⟩ «steuern sry da bin ich doch noch nicht sicher». **Es gilt nur Einstellungen (I).** Steuern (J) ist wieder offen.
- **Finanz-Übersicht (K):** keine Rückmeldung, bleibt offen.

### Steuern (J) · entschieden (Sophie, 24.10.2026)

- **Entwurf J passt: Ergebnis zuerst** — geschätzte Gesamtsteuer gross, Balken Bund / Kanton-Gemeinde, die
  zwei Teile, Nettoeinkommen; darunter die Eingaben (aufgeklappt), Berechnung (zugeklappt), Zivilstand im
  Vergleich, Datenstand, offizielle Stelle, Querlinks. «Veranlagung ⓘ» nur einmal. Alle 84 Bausteine bleiben.
- **«Max» nur, wo das Gesetz eine Grenze setzt.** Grund: Fachprüfung 24.10. (`_werkbank/gesamtbericht-2026-10/
  _bericht/GESAMTBERICHT.md`) — `TaxCalculator.jsx:83-89` nennt Grenzen ohne Grundlage: Unterhaltsbeiträge
  unbegrenzt abziehbar, Schuldzinsen = Vermögensertrag + 50'000 (DBG 33 Abs. 1 lit. a), «übrige» 10'000 ohne
  Quelle; Fortbildung «Max 10'000» widerspricht `de.js:1543` «bis 13'000» (DBG 33 Abs. 1 lit. j). Vor dem Bau
  jede verbleibende Grenze mit dem `swiss-precision-pruefer` belegen; 3a-Feld an den Höchstbetrag binden
  (heute ohne Obergrenze → zu tiefes Ergebnis).
- **Untertitel nicht mehr «Bundessteuer berechnen»** (`nav.sub.taxes`, 5 Sprachen) — die Seite rechnet Bund,
  Kanton und Gemeinde. Neuer Text geht an den Copy-Prüfer; gilt auch in Menü, Übersicht und Suche.
- Beim Bau mitnehmen (Code-Review 24.10.): `TaxCalculator` braucht `key: datenModus` (`main.jsx:1633`), sonst
  landen Beispieldaten nach «Beispiel verlassen» + «Speichern» im echten Profil.
- Bedingte Teile (Wohnkanton-Frage, Elterntarif, Hinweise ohne Zahl, `tax.bandOutside` …) bleiben wie heute.

### Finanz-Übersicht (K) · entschieden (Sophie, 24.10.2026)

- **Entwurf K passt: Budget zuerst** — Monatsbudget, frei verfügbar, Notgroschen-Tank oben; Nettoeinkommen
  und Kanton als zwei Marken darüber.
- **Sechs ruhige Zeilen** statt sechs Kästen: Steuern, IPV, Sozialhilfe, EL, Vermögen, Gesundheitskosten,
  je mit Wert, je zum Werkzeug.
- **Lebensbaum ganz erhalten, weiter unten** (Leitplanke 06.07.) statt den ganzen ersten Bildschirm.
- Lohn als **Barometer mit vier Abschnitten** wie im Kapitel Finanzen (ersetzt die 10-px-Chips, «erreicht»
  nicht mehr nur durch Tönung); Miete und KK-Last zugeklappt; Budget-Übersicht, Dossier, Drucken unten.
  Alle 79 Bausteine bleiben; bedingte Teile wie heute.
- Beim Bau mitnehmen (Gesamtbericht 24.10.): **eine** Monatsrechnung für Übersicht und Kapitel
  (`utils/monatsrechnung.js` vs. `haushaltsEinnahmen`, 🔴 1); Kopf links statt Kopf in Karte
  (`FinanzUebersicht.jsx:278`); Baum hört auch auf den In-App-Schalter «Bewegung reduzieren»
  (`Baum3D.jsx:609`); Du-Form `finanzUebersicht.*` klein schreiben (Copy-Prüfer).

### Finanz-Übersicht (K) · detaillierter, entschieden (Sophie, 24.10.2026)

Sophie: «wir wollen zuerst noch die Finanz-Übersicht verbessern und detaillierter machen» — und «der Tacho
und all das, was wir schon gebaut haben». Umgesetzt in `seiten-v5.html?nur=k` (320aba69). **Summe sichtbar,
Details aufklappbar.** Alle Zahlen aus `budgetSync.js` (`calculateMonthlyBudget`), Bezeichnungen aus
`de.js` (`budgetSync.group.*`, `.field.*`), Werte aus `config/demoData.js`.

- **Kopf:** Marken Nettoeinkommen · Kanton · **Haushalt** (neu); «Frei verfügbar» gross, Notgroschen-Tank.
- **Total Einnahmen** aufklappbar nach Quelle: Lohn, Nebenerwerb, Partner/in, Familienzulagen, Alimente
  (`haushaltsEinnahmen`); nicht Erfasstes als eine leise Zeile.
- **Monatliche Ausgaben** aufklappbar nach den sechs Gruppen von `BUDGET_GROUPS` (Wohnen, Versicherung &
  Gesundheit, Leben, Mobilität, Steuern & Vorsorge, Verpflichtungen) mit ihren Posten, dazu ein Anteils-Balken
  in Bereichsfarben. Maria: 1'830 + 385 + 535 + 120 + 871 = **3'741** (= App; 3a ist ein Jahresfeld, 250/12).
- **Sparen & Vorsorge** aufklappbar: Sparziel, 3a eingezahlt mit Rest bis zum Höchstbetrag, 3b, PK-Beitrag
  (mit Hinweis «schon vom Lohn abgezogen»).
- **Vermögen & Schulden** aufklappbar: frei verfügbar (Sparkonto, Wertschriften) · gebunden (PK-, 3a-Guthaben,
  getrennt, nicht frei verfügbar) · Schulden (Darlehen, Kreditkarte, Schuldenmanager). Ersetzt die Zeile
  «Vermögen» in den Statuszeilen — es bleiben **fünf** Zeilen: Steuern, IPV, Sozialhilfe, EL, Gesundheitskosten.
- **Ihre Instrumente** auch hier: Franchise-Kreuz, Steuer-Säule, Reserve-Tankanzeige, Schutzschild
  (`InstrumentePanel`, gleiche Werte wie auf der Übersicht), je zum Werkzeug.
- Danach unverändert: Lohn-Barometer, Miete, KK-Last (zugeklappt), Lebensbaum, Budget-Übersicht, Dossier, Drucken.

**Neue Texte für den Copy-Prüfer:** «… nicht erfasst», «Frei verfügbar / Gebunden (Vorsorge)», «Höchstbetrag …
noch CHF … möglich», «Der PK-Beitrag ist schon vom Lohn abgezogen …», «Haushalt: n Person(en)».
**Befund App:** Hausrat-Prämie (`householdInsuranceAmount`, CHF/Jahr) ist erfasst, fliesst aber nicht ins
Budget (nur `otherInsurance`). Vor dem Bau entscheiden, ob erfasste Versicherungsprämien ins Budget gehören.
**Voraussetzung im Bau:** eine Monatsrechnung (🔴 1 im Gesamtbericht), sonst zeigen Kapitel und Übersicht
verschiedene Summen.

### Finanz-Übersicht (K) · zweiter und dritter Ausbau, entschieden (Sophie, 24.10.2026)

Sophie: «was jetzt schon drin ist und erarbeitet wurde» bleibt, dazu alles, was die App schon kann.
Umgesetzt in `seiten-v5.html?nur=k` (ffcc25b2, 6185adae). Sophie: «die Finanz-Übersicht passt jetzt».

**Zweiter Ausbau — Inhalte, die die App schon rechnet**
- **Budget-Hinweis** unter «Frei verfügbar» aus `getBudgetRecommendations` (Maria: `budget.budgetCalm`).
- **Vom Brutto zum Netto (Richtwert)** im Einnahmen-Block: `nettoZuBruttoRichtwert` (Alter 34 → ≈ 6'796),
  AHV/IV/EO 5.3 %, ALV 1.1 %, PK nach Alter (−161), mit dem Vorbehalt aus dem Code (ohne NBU, KTG,
  überobligatorische PK).
- **Richtwerte und Teuerung je Posten** als kurze Zeilen («vergleichbarer Haushalt rund CHF …», «Preise seit
  2020 +… % (allgemein +8 %)») aus `BUDGET_BENCHMARKS` (Haushaltstyp nach `resolveHouseholdType`) und
  `BUDGET_PRICE_TREND`; die Erklärung (BFS HABE 2020/21, LIK Dez. 2020 – Aug. 2025) **einmal** als Fussnote
  statt der vollen Sätze unter jedem Posten (die App zeigt sie heute je Posten hinter ⓘ).
- **Aufs Jahr gerechnet:** Einnahmen, Ausgaben, frei, davon geplant zu sparen; Hinweis, wenn der 13. Monatslohn
  nicht erfasst ist (die Budget-Seite hat schon den Schalter Monat/Jahr, `showAnnual`).
- **Schutzschild ausgeklappt:** Pflicht (KK, UVG, BVG) und Empfohlen (Haftpflicht, Hausrat) mit gedeckt/offen,
  Texte `schutzschild.*`.

**Dritter Ausbau — die gebauten Instrumente** (Geometrie und Texte aus den Bausteinen)
- **Notgroschen als Tacho** (`ReserveTank` über `Gauge`): 0–6 Monate, sand bis «empfohlen» (3), danach salbei,
  Zeiger auf den Monaten, Ablesung `finanzUebersicht.tankReadout` darunter. Ersetzt den kleinen Balken.
- **Pegel** (`Pegel`) unter den Zeilen IPV (Variante «luft», Linie = Grenze) und Sozialhilfe (Variante
  «aufstockung», Linie = Bedarf), Ablesung `pegel.*`.
- **Miete als Regional-Barometer** (`RegionalBarometer`, kind «rent», Füllung in Wohnen-Farbe): Füllung = eigene
  Miete, Punkt = Region, Strich = Schweizer Schnitt, Legende, Abweichung, «strukturell», Quelle. Ersetzt die drei
  Balken. Drittel-Schwelle «!» nur, wenn sie in der Skala liegt (bei Maria nicht).
- Die vier Instrument-Kacheln (Franchise-Kreuz, Steuer-Säule, Reserve-Tank, Schutzschild) bleiben als Reihe.

**Im Mockup angenähert:** die Deep-Farben der App (`sandDeep`, `skyDeep`, `goldDeep`) gibt es im Mockup nicht —
im Bau gelten die App-Farben und ihre Kontrast-Regeln.

**Befunde App (vor dem Bau klären):**
- Die Brutto-Schätzung nimmt einen PK-Abzug nach Alter an (Maria −161), obwohl ein PK-Beitrag erfasst ist
  (`bvgContribution` 420). Entscheid: erfassten Beitrag verwenden, wenn vorhanden?
- Hausrat-Prämie erfasst, nicht im Budget (siehe oben).

**Neue Texte für den Copy-Prüfer** (zusätzlich zu oben): «Vom Brutto zum Netto (Richtwert)», «Bruttolohn,
geschätzt», «Pensionskasse, geschätzt nach Alter», der PK-Vorbehalt, die Kurzzeilen Richtwert/Teuerung und ihre
Fussnote, «Aufs Jahr gerechnet», «Davon geplant zu sparen», der 13.-Monatslohn-Satz («rund CHF 6'200 mehr» ist
eine Näherung — vor dem Bau an den swiss-precision-pruefer).

---

## Runde 3 · Anker unten: Rucksack, Anspruch, Suche (23.10.2026 abends, L, M und N entschieden 24.10.)

Der Anker «Anspruch» öffnet die Seite **Lebenssituationen** (`situationen`, `main.jsx` BottomAnchor).
Bilder: `heute-rucksack.jpg`, `heute-situationen.jpg`, `heute-suche.jpg`. Inventar: `vergleich-inventar-runde3.json`
(Rucksack 26, Situationen 14, Suche 78 Bausteine). Entwürfe: L Rucksack, M Lebenssituationen, N Suche.
Alle sichtbaren Texte gegen `de.js` und die laufende App geprüft: **0 unbelegt**.

**Befunde App:**
- **Suche findet nicht alles:** `WEITERE_NAMEN` in `config/ansichtenRegister.js` («nicht in der Suche»)
  enthält u. a. Mietzinsbeiträge, Notfallkarte, Briefe, Obstgarten, Rucksack, Rechtliches. «miete» findet
  heute nur «Wohnung gekündigt» und «Zusammenziehen», «Notfallkarte» nichts.
- **Suche ordnet Lebensereignisse unter «Werkzeuge»** (Heirat, Umzug …); die Kapitel stehen nach 70 Einträgen.
- **Drei Namen für eine Seite:** Anker «Anspruch», Zeile «Was steht mir zu?», Titel «Lebenssituationen».
- **Rucksack:** «Wieder einpacken» ist zweimal ein Knopf (Zeichnung und Knopf darunter).
- Kein Befund: Symbol-Text in Knopfnamen («HELVETIA», «23») ist `aria-hidden`; nur das Mess-Skript las ihn mit.

**Runde 3 vollständig entschieden** (L, M, N am 24.10.).

### Suche (N) · entschieden (Sophie, 24.10.2026)

- **Entwurf N passt**, so wie gezeichnet: Suchfeld oben, bleibt beim Scrollen stehen; ohne Suchwort zuerst
  die **sieben Bereiche als Kacheln** in ihren Farben (heute ganz unten nach 70 Einträgen), dann
  **Werkzeuge** und **Lebensereignisse** als getrennte Gruppen (heute alles unter «Werkzeuge»); Treffer
  markiert, «Keine Treffer …» im Wortlaut der App.
- **Alle Seiten auffindbar:** Mietzins, Notfallkarte, Briefe, Obstgarten, Rucksack, Rechtliches u. a. aus
  `WEITERE_NAMEN` in die Suche. Schon gebaut in `2fae91da` (Zweig `fix/suche-notfallkarte-mietzins`, andere
  Sitzung, noch nicht auf main) — beim Bau darauf aufsetzen statt neu.
- Namen in der Suche nach der Regel «eine Seite, ein Name» («Was steht mir zu?», «Was ansteht», «Rucksack»);
  «Kalender» bleibt als Suchwort für «Was ansteht».
- «Steuern · Bundessteuer berechnen» bleibt offen bis zum Entscheid J (Befund `nav.sub.taxes` veraltet).

### Was steht mir zu? (M) · entschieden (Sophie, 24.10.2026)

- **Entwurf M passt**, so wie gezeichnet: Geschenk-Symbol wie der Anker, die elf Situationen als
  Auswahl-Pillen (gewählte in Gold), nach dem Antippen Zeilen mit Bereichssymbol, die direkt ins
  Werkzeug führen (IPV, Sozialhilfe, Stipendien …), Bereichsfarbe nach dem Werkzeug.
- **Titel «Was steht mir zu?», nicht «Lebenssituationen»** — Anker, Titel, Brotkrume und Suche lesen
  `dashboard.anspruchTitle` (Regel «eine Seite, ein Name» vom 23.10., Zweig `fix/ein-name-pro-seite`,
  noch nicht auf main). Damit ist der Befund «Drei Namen für eine Seite» erledigt. Im Mockup steht noch
  «Lebenssituationen»; beim Bau gilt der neue Titel.
- **Bleibt wie heute:** Einleitungssatz, «Quelle · Stand» in jeder Zeile, «Angebote in Ihrer Region»,
  «Ihre Daten bleiben auf diesem Gerät». Externe Angebote (KulturLegi, Reka) mit Globus und ↗, wie die
  Aussenfach-Regel.
- Die Karten der übrigen zehn Situationen kommen unverändert aus der App (im Mockup nur «Wenn das Geld
  knapp ist» gefüllt).

### Rucksack (L) · entschieden (Sophie, 24.10.2026)

- **Entwurf L passt**, so wie gezeichnet: Karten mit runden Ecken, aufgeklappt eine ruhige Liste mit ›,
  Wege mit Salbei-Strich, Werkzeuge mit Messing-Strich.
- **Name «Rucksack», nicht «Wanderrucksack»** — Titel, Brotkrume und Panorama lesen `nav.rucksack`
  (Regel «eine Seite, ein Name» vom 23.10., Zweig `fix/ein-name-pro-seite`, noch nicht auf main).
  Im Mockup steht noch «Wanderrucksack»; beim Bau gilt der neue Name.
- **«Wieder einpacken» nur einmal:** die Zeichnung bleibt zum Antippen, aber ohne eigenen Namen
  (`aria-hidden`); der Name steht am ruhigen Rahmen-Knopf darunter (statt goldener Pille).
- **Bleibt wie heute:** die Zeichnungen aus `Gepaeck.jsx`, Auspacken beim Öffnen (aus bei «Bewegung
  reduzieren»), ein Gegenstand offen auf einmal, «x von 4 erfasst», «Was steht mir zu?» oben, das
  Aussenfach oben offen und unten noch einmal als Karte (Wunsch 27.09.), der Satz unten.
- Die Zahlen in den Untertiteln («11 Wege», «6 Werkzeuge») rechnet die App aus den Listen.

---

## Runde 4 · Einstieg: «Was steht mir zu?» als eine Seite (24.10.2026)

**Gefunden beim Ansehen (Demo Maria, App `origin/main` aa94f3d6):** dieselbe Frage hat heute vier Orte und
vier Namen — «Lebenssituationen» (`#/situationen`, ab Zweig `fix/ein-name-pro-seite` «Was steht mir zu?»),
«Ansprüche im Überblick» (`#/schnellcheck` **und** `#/ansprueche`, beides `Schnellcheck.jsx`), Schritt 1 des
geführten Checks «Leistungs-Schnellcheck» (`#/anspruchcheck`, nochmals dieselbe Rechnung) und der Block
«Leistungen» auf der Übersicht. Bilder: `heute-situationen.jpg`, `heute-schnellcheck.jpg`,
`heute-anspruchcheck.jpg`. Vergleich: Reiter «Was steht mir zu? · eine Seite» in `vergleich-v5.html`.

### Was steht mir zu? (O) · entschieden (Sophie, 24.10.2026)

Sophie fragte «was ist die beste Lösung?»; Empfehlung Claude: eine Seite (gleiche Frage, Regel «eine Seite, ein
Name», ein Ort gibt eine Antwort). Sophie: «Ja, eine Seite … so wie du es empfiehlst», danach «Entwurf O passt».
Entwurf: `seiten-v5.html?nur=o` (00c5d5c4).

- **Ein Ort, ein Name «Was steht mir zu?»** (`dashboard.anspruchTitle`), Anker unten wie heute.
- **Reihenfolge:** (1) **Mit Ihren Angaben** — Einkommen, Miete, KK, Kanton/Haushalt als Marken, «Angaben
  anpassen, um durchzuspielen» aufklappbar (netto/brutto wie heute); Ergebnis als **zwei Pegel** (IPV «luft»,
  Sozialhilfe «aufstockung», wie Finanz-Übersicht) mit den App-Sätzen, als Live-Region; Ergebnis-Satz.
  (2) **Nach Ihrer Lebenslage** — die elf Situationen mit ihren Karten (Entwurf M). (3) **Weitere Wege**
  zugeklappt, die 15 Einträge der Landkarte (Nach Einkommen / Lebenslage / Ereignis).
- **Geführter Anspruch-Check bleibt** als eigener Ablauf, nur von hier erreichbar («Lieber Schritt für
  Schritt?»); sein Schritt 1 nutzt dieselbe Rechnung, ohne den Titel «Leistungs-Schnellcheck».
- **Leistungs-Kompass fällt weg** auf dieser Seite (die Pegel tragen die Aussage); der Prämien-Beleg (Papier)
  wird durch den IPV-Pegel ersetzt — gleiche Instrumente wie auf der Finanz-Übersicht.
- **Weiterleitungen:** `#/schnellcheck` und `#/ansprueche` → diese Seite (Sprungmarke «Mit Ihren Angaben»).
- **Übersicht:** der Block «Leistungen» wird eine Zeile hierher — gehört zum noch offenen Entscheid Übersicht.
- **Fassung-5-Form:** Kopf links, keine Kartenwand (Design-Befund), Ergebnis mit `role="status"`
  (a11y-Befund M3), Hinweise «bewertet nichts», «Grobe Orientierung», «Daten bleiben auf dem Gerät» unten.

**Neue Texte für den Copy-Prüfer:** Einleitung (ein Satz für beides), «Mit Ihren Angaben», «Angaben anpassen,
um durchzuspielen», «Nach Ihrer Lebenslage», «Mit diesen Angaben zeigt sich …» (statt «zeigt der Schnellcheck»),
«Lieber Schritt für Schritt?» mit Untertitel.

**Beobachtet, unbestätigt:** beim ersten Öffnen zeigte der Schnellcheck für Maria «IPV prüfenswert, ohne
Betrag», nach erneutem Laden «über der Grenze» wie die Finanz-Übersicht. Nicht wiederholbar; vermutlich vor
fertig geladenem Profil. Im Bau prüfen.

**Noch offen (unverändert):** Übersicht (4 Fragen: Zahl 63/70 %, Kartentitel, Bereichszeilen, Bereiche einmal).

---

## Runde 5 · Notfall: vier Seiten, ein Ort (24.10.2026)

**Gefunden beim Ansehen (Demo Maria):** vier verschiedene Aufgaben ohne gemeinsamen Ort und mit wechselnden
Namen — `#/notfalleinstieg` «Was brauchen Sie im Notfall?» (auf der Übersicht «Notfallkarte vorbereiten», im
Register «Notfall»), `#/notfallkarte` «Notruf-Vorlesekarte», `#/notfallpass` «Notfallpass vorbereiten»
(Brotkrume über «Notfall»), `#/notfalldossier` «Notfall-Dossier» (Brotkrume über «Meine Unterlagen»). Das
Suchwort «Notfallkarte» trifft zwei Seiten. Bilder: `heute-notfalleinstieg.jpg`, `heute-notfallkarte.jpg`,
`heute-notfallpass.jpg`, `heute-notfalldossier.jpg`. Vergleich: vier Reiter «Notfall · …» in `vergleich-v5.html`.

### Notfall P–S · entschieden (Sophie, 24.10.2026)

Sophie: «vier Seiten mit einem gemeinsamen Notfall-Ort, ein Name je Seite, Fassung-5-Form», danach «die vier
Notfall-Entwürfe passen». Entwürfe: `seiten-v5.html?nur=p|q|r|s` (d1758b61).

- **Ein Ort «Notfall» (P)** = heutiger Einstieg. Alle vier Seiten: Brotkrume «Übersicht › Notfall › …» und eine
  Zeile mit den vier Seiten. Die Karte auf der Übersicht führt hierher und heisst wie der Ort.
- **Ein Name je Seite:** «Notfall», «Notfallkarte» (statt «Notruf-Vorlesekarte», `notfallkarte.title`),
  «Notfallpass» (statt «Notfallpass vorbereiten»), «Notfall-Dossier». Suche: «Notfallkarte» trifft nur noch Q.
- **P Notfall:** Kopf links (statt zentriert mit 3-px-Balken); oben drei Zeilen Notfallkarte, Notfallpass,
  Dossier; darunter die drei Szenarien (Unfall, Spitalaufenthalt, Behördengang) aufklappbar mit «x von n» und
  ○ für offene Angaben (nicht nur Farbe), 56 px, Enter und Leertaste (heute `div role="button"`, ~28 px, nur
  Enter). Fehlt etwas: Zeile «Fehlende Angabe im Kapitel Notfall ergänzen» (heute Knopf «Notfall»).
  Das Kapitel Notfall bleibt der Ort zum Eintragen.
- **Q Notfallkarte:** Aufbau und alle Sätze bleiben; nur neuer Name, Brotkrume über Notfall, Nummern als
  Knöpfe mit grosser Zahl (56 px, zwei Spalten) statt Pillen. Im Ernstfall weiter mit einem Tipp erreichbar.
- **R Notfallpass:** Zwischentitel ohne Versalien, Anleitungen iPhone und Android zugeklappt («4 Schritte»),
  Kopieren-Knöpfe 44 px.
- **S Notfall-Dossier:** Brotkrume über Notfall (unter «Meine Unterlagen» bleibt ein Verweis), Kopf links statt
  in Karte, Drucken als Hauptknopf, QR als eigener Abschnitt mit dem vollständigen Hinweis (inkl.
  «Adressbuch», #403), Vorschau als Liste in den sechs Bereichen.

**Neue Texte für den Copy-Prüfer:** die drei Kurzsätze unter Notfallkarte/Notfallpass/Dossier auf P,
«x von n», «Fehlende Angabe im Kapitel Notfall ergänzen», «4 Schritte», neue Seitentitel in fünf Sprachen.

**Befund App:** im Beispiel (Maria) zeigt das Notfall-Dossier «Der QR-Code liess sich nicht erzeugen.» —
Ursache nicht geprüft (Länge der Angaben? nur Demo?). Vor dem Bau klären. Druck-HTML ohne `lang` (a11y M11).

---

## Runde 6 · Datenseiten (24.10.2026)

**Gefunden beim Ansehen (Demo Maria):** Die Budget-Seite (`#/sync`, «Monatsbudget») zeigt nach dem Ausbau von K
dasselbe wie die Finanz-Übersicht. Lebensmappe, Behörden-Dossier und Notfall-Dossier haben dieselbe Form
(Vorschau + Drucken) unter «Meine Unterlagen». Export ist im Beispiel gesperrt (nicht angesehen).
Bilder: `heute-budget.jpg`, `heute-unterlagen.jpg`, `heute-lebensmappe.jpg`, `heute-behoerdendossier.jpg`.
Vergleich: Reiter «Budget → Finanz-Übersicht», «Meine Unterlagen», «Lebensmappe», «Behörden-Dossier».

### Datenseiten · entschieden (Sophie, 24.10.2026)

Sophie wählte beide Empfehlungen («In Finanz-Übersicht aufgehen», «Drei Seiten, eine Form»), danach «die
Datenseiten passen». Entwürfe: `seiten-v5.html?nur=k|t|u|v` (4701df97).

- **Budget geht in der Finanz-Übersicht (K) auf.** Dazu in K ergänzt: Anteil am Einkommen je Gruppe (leise
  hinter dem Gruppennamen), «6 Kategorien können Sie noch ergänzen …», «SKOS-Grundbedarf (Orientierung)»
  aufklappbar, «Budget exportieren», «Wird automatisch aktualisiert …». `#/sync` leitet auf die
  Finanz-Übersicht. Die Finanz-Übersicht ist damit der eine Ort fürs Geld.
- **T Meine Unterlagen** bleibt der Ort für Ablage, Dossiers, Briefe und Sicherung: Kopf links statt in Karte,
  Liste statt sechs Kästen, zwei Gruppen «Zum Ausdrucken» und «Schreiben und sichern», die ganze Zeile ist der
  Knopf (die Texte «… öffnen» fallen weg), Notfall-Dossier als Verweis «unter Notfall».
- **Drei Dossiers, eine Form** (wie S): **U Lebensmappe** und **V Behörden-Dossier** — Kopf links, Drucken als
  Hauptknopf (V zusätzlich «Dossier-Datei exportieren» ruhig), Vorschau als Liste mit Gruppen. In V stehen die
  langen Hinweise (Steuer, Annahmen, Mehrkosten) als Satz unter der Gruppe statt fett in der Wertspalte, der
  Status der Orientierung rechts in der Gruppenzeile.

**Neue Texte für den Copy-Prüfer:** «Zum Ausdrucken», «Schreiben und sichern», «keine» (Mögliche
Unterstützung), SKOS-Satz «Zur Einordnung, keine Berechnung eines Anspruchs — mehr dazu bei «Was steht mir
zu?»», Feldnamen ohne «CHF» im Namen.

**Befund App:** Behörden-Dossier zeigt «Mögliche Unterstützung /Mt.» ohne Betrag, wenn kein Anspruch besteht.

---

## Runde 7 · Abläufe: eine Schale, alle auf einmal (24.10.2026)

**Gefunden:** 43 Dateien nutzen `AblaufSchale.jsx`; ~33 Abläufe zeigen alle Schritte untereinander
(`AblaufContainer` + `AblaufStep`), nur der Umzug geht Schritt für Schritt (`AblaufPass`, `ablaufStand`,
`EreignisFrist` mit `karte:`). Die Passstrasse ist fest für 4 Stationen (`PASS_PFAD`, `PASS_STATIONEN`).
17 Abläufe haben eine `EreignisFrist`, drei zwei (Dienst, Wegzug, Zuzug). Bild: `heute-heirat.jpg`.
Vergleich: Reiter «Abläufe · Schale (Beispiel Heirat)».

### Ablauf-Schale (W) · entschieden (Sophie, 24.10.2026)

Sophie wählte beide Empfehlungen («In der Schale, alle auf einmal», «Passstrasse mit n Kehren»), danach
«Entwurf W passt für alle Abläufe». Entwurf: `seiten-v5.html?nur=w` (4f2169fe), Beispiel «Heirat».

- **Eine Änderung an der Schale, alle Abläufe:** `AblaufContainer` zeigt seine `AblaufStep` einen nach dem
  anderen — «Schritt n von N», «Erledigt, weiter ›», «‹ zurück», zuletzt «Ablauf abschliessen»; erledigte
  Schritte als Marken; Stand gespeichert je Ablauf (wie `ablaufStand`). Abschluss: «Alle N Schritte sind
  erledigt» + «Zur Übersicht» + «Ablauf nochmals ansehen».
- **Passstrasse mit n Kehren:** aus N gerechnet (Serpentine, eine Station je Kehre, Höhe wächst mit N, Kehren
  leicht unterschiedlich weit), Farbe = Bereich des Ablaufs. Ersetzt die feste 4-Stationen-Strasse.
- **Frist als Karte** in jedem Ablauf (`FristButton`, `EreignisFrist`): «… · bis Datum» mit «In den Kalender»;
  zwei Fristen = zwei Karten im selben Schritt.
- **Immer unten, keine Station:** «Verwandte Ereignisse», `AblaufFooter` (Hinweis, Quellen).
- **Kopf links** mit Bereichssymbol und Brotkrume; Bereich, Farbe und Brotkrume je Ablauf aus dem Register.
- **a11y mitlösen:** Fokus bleibt nach «In den Kalender» auf der Bestätigung (Live-Region); Schrittfläche nicht
  zugleich `aria-live` und fokussiert.

**Noch je Ablauf zu prüfen:** reine Info-Schritte tragen «Weiter ›» statt «Erledigt, weiter ›»; Bereich von
Heirat (heute rosa Band, Herz, kein Bereich). Abläufe ausserhalb der Schale (z. B. `AsylView`) — eigener Entscheid.
**Neue Texte für den Copy-Prüfer:** «Weiter ›», «Alle N Schritte sind erledigt», Frist-Karten-Untertitel
«Orientierung · bis …» (Heirat: Frist ist Orientierung, keine gesetzliche).

---

## Runde 8 · Rechner: eine Form für alle (24.10.2026)

**Gefunden:** 11 Rechner tragen eine Kartenwand (Design-Befund), mehrere zeigen das Ergebnis erst unter den
Eingaben und ohne Live-Ansage (a11y M3), Einzelwahl als `aria-pressed` ohne Gruppe (M2), Reiter ohne Pfeiltasten
(M4). Steuern (J) und IPV sind schon Fassung 5. Bild: `heute-alv.jpg` (Beispiel mit 6'796 brutto, 24 Monaten).
Vergleich: Reiter «Rechner · Form (Beispiel ALV)».

### Rechner-Form (X) · entschieden (Sophie, 24.10.2026)

Sophie wählte die Empfehlung «Eine Rechner-Form für alle», danach «Entwurf X passt für alle Rechner».
Entwurf: `seiten-v5.html?nur=x` (4a654f3c, 7ac16da1), Beispiel «Arbeitslosenentschädigung».

- **Aufbau für jeden Rechner:** (1) Kopf links mit Bereichssymbol, Brotkrume, Satz; lange Titel mit
  Silbentrennung · (2) **Ergebnis zuerst** — eine grosse Zahl, wenige Zeilen, Vorbehalt direkt darunter,
  `role="status"` · (3) «Ihre Angaben» aufgeklappt mit «x von n», Einzelwahl als `radiogroup` · (4) was zu tun ist /
  wo man sich meldet · (5) «Offizielle Stelle & Antrag» als Zeilen mit ↗, ohne Versalien und ohne ausgeschriebene
  Adressen · (6) Quelle. Keine Kartenwand, kein Kopf in Karte.
- **Ohne Ergebnis:** an der Stelle des Ergebnisses der App-Satz («Geben Sie … ein …», «Noch n Angaben nötig»),
  die Angaben darunter offen.
- **Gilt für:** EO, Vorsorge, Sozialhilfe, Prämien-Orientierung, Mietzinsbeiträge, Stundenlohn, Kreditkarte,
  Stipendien, KVG-Leistungen, Schulden, ALV. Reiter/Tabs (Schulden, KVG, Vorsorge) werden eine `Tabs`-Komponente
  mit Pfeiltasten.

**Befunde:** Name ALV — Titel «Arbeitslosenentschädigung», Suche/Register «ALV-Taggeld» (einen wählen, Copy-Prüfer).
Code: «Kinder: ja» auch für Kinder über 25 vorbelegt (`AlvRechner.jsx:22,30`) — beim Bau mitbeheben.
