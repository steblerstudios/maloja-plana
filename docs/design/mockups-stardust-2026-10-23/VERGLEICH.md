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

Stebler Studios will **nicht mit der Übersicht beginnen**. Die Punkte sind festgehalten, entschieden ist nichts:
- **63 % gegen 70 %:** beides ist richtig gerechnet. 63 % = ausgefüllte Felder über alle Bereiche
  (`gesamtVollstaendigkeit` in `utils/vollstaendigkeit.js`). 70 % = Durchschnitt der sieben
  Bereichs-Prozente (`BergDetail.jsx`). Finanzen hat viele Felder bei 38 % und drückt die erste Zahl.
- **Erfundener Text in Fassung 5:** «Am meisten offen: Finanzen & Geld.» steht nicht in `de.js`.
  Heute heisst es «Weiter mit Finanzen & Geld ›». «Ihr Lebensordner» als Kartentitel gibt es so
  auch nicht.

### Kapitel Finanzen · Befunde beim Durchgehen (23.10.2026, noch nicht entschieden)

Stebler Studios hat auf den Umzug gewechselt; offen bleiben:
- **Kopf:** heute zentriert (Münze, Titel und Satz in Gold), Fassung 5 links und ruhig.
- **Texte ohne Vorbild in `de.js`:** «Jeden Monat bleiben», «verplant», «Einkommen, netto»,
  «Passend zu diesem Bereich» mit «Lohnausweis ablegen», «Ablauf · 5 Schritte», «Als Nächstes».
- **Reiter «Dokumente»:** heute ein Formular (Dokumenttyp, Ablaufdatum, «Datei auswählen oder
  hierher ziehen», «Hochladen», «Erforderliche Dokumente», «Ihre Dokumente bleiben auf diesem
  Gerät.»). Fassung 5 zeigt nur einen erfundenen Leer-Satz und «Dokument fotografieren». Die
  Messung hatte den Reiter nicht geöffnet, darum stand das nicht in der Liste.
- Korrigiert (0cbf2487): die Zusammenfassung endet wieder mit «Es bleiben CHF 2'480.».

### Ablauf Umzug · entschieden (Stebler Studios, 23.10.2026)

- **Ein Schritt nach dem anderen** auf der Passstrasse, wie Fassung 5 (heute: alle vier Schritte
  auf einer Seite).
- **Frist als Karte mit Datum** («Anmeldung Gemeinde · bis …» + «In den Kalender»); danach die
  App-Sätze «Im Kalender notiert.» und «Zum Kalender».
- **Keine Unterzeile** beim Krankenkassen-Verweis; nur «Krankenkassen-Prämie prüfen ›» wie heute.
- Korrigiert beim Durchgehen (87bff394): Einleitung und 14-Tage-Satz wieder vollständig, der Satz
  wechselt mit der Art des Umzugs (step2Text, _gemeinde, _kanton, _extra).
- Neu und für den Copy-Prüfer: «Erledigt, weiter ›», «Ablauf abschliessen», «Der Umzug ist
  geordnet» mit Satz.

### Dokumentenablage · entschieden (Stebler Studios, 23.10.2026)

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

### Merkliste · entschieden (Stebler Studios, 23.10.2026)

- **Verknüpfung als Unterzeile** mit ›, der ganze Eintrag ist die Tippfläche (heute: kleiner Knopf rechts).
- **Bereichs-Symbol pro Eintrag** wie Fassung 5. Die Zuordnung Werkzeug → Bereich gibt es in der
  App noch nicht; der Vorschlag steht in der Notiz unter dem Mockup und muss vor dem Bau festgelegt werden.
- **Neue Einträge oben** (heute: unten).
- Korrigiert (c5243a87): kein erfundenes «ohne Verknüpfung» mehr.
- Entfernen mit «Rückgängig» war schon entschieden (Entscheid «C», §15); heute löscht die App sofort.

### Kalender · entschieden (Stebler Studios, 23.10.2026)

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

### Merkliste und Kalender verknüpft · Icons (Stebler Studios, 23.10.2026)

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

### Menü · entschieden (Stebler Studios, 23.10.2026)

- **Karten mit Satz** auf ganzem Bildschirm, wie Fassung 5 (heute: schmales Panel, Zeilen ohne Satz).
- **Die vier Anker bleiben oben** (Übersicht, Was ansteht, Rucksack, Was steht mir zu?). Ihre Sätze
  sind neu und gehen an den Copy-Prüfer.
- **Bereich-Sätze** = die Kapitel-Beschreibungen der App (chapters.*.description), korrigiert in 126a8a0f.
- **Unten:** Einstellungen, Einfache Ansicht, Datenschutz & Rechtliches, Problem melden und
  «Lokal gespeichert. Ihre Eingaben verlassen Ihr Gerät nicht.» (nav.privacyNote).
  Begründung: Vertrauen (lokal), Rechtliches muss von überall erreichbar sein, Melden während der
  Beta, Einfache Ansicht für Barrierefreiheit.
- **«Rundgang neu starten» nicht im Menü:** steht in der App schon bei den Einstellungen (MobileNav.jsx).

### Rechner IPV · teilweise entschieden (Stebler Studios, 23.10.2026)

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

### Rechner IPV · entschieden (Stebler Studios, 23.10.2026)

- **Überschriften wie die App:** «Anspruch & Aufenthaltsbewilligung», «Benötigte Dokumente»,
  «Offizielle Stelle & Antrag». «Ihre Lage» bleibt als neuer Titel (Copy-Prüfer).
- **«Frist in den Kalender» ist raus** (keine belegte Frist). Dafür **«Ihr IPV-Weg»** wie in der App:
  Automatisch / Antrag → «Ich habe beantragt» → «Verfügung erhalten» → Betrag laut Verfügung, und
  **«Jährlich erinnern»** legt «Prämienverbilligung fürs nächste Jahr prüfen» als **jährliche Aufgabe**
  in Merkliste und Kalender (↻ Jährlich). Abweichung zur App: dort erst nach der Verfügung, hier in
  jedem Schritt (Wunsch Stebler Studios: sich das als Aufgabe eintragen können).
- **Vorlesen** neben dem Untertitel (Browser-Sprachausgabe, wie `VorlesenButton`).
- **Hinweise je nach Lage** (Wochenaufenthalt, junge Erwachsene, Kanton fehlt) mit den App-Texten;
  im Mockup über einen Schalter, weil Maria Muster keinen davon sieht.
- **«Alle Kantone vergleichen» bewusst nicht im Mockup:** Die App zeigt die Tabelle nur mit amtlich
  belegten Kantonen; das sind heute **0 von 26**. Sie erscheint also heute nirgends. Vor dem Bau
  klären, ob und mit welchen Quellen sie kommen soll.
- **Förderbeträge unter der Grenze** rechnet die App mit nachgeladenen kantonalen Modellen
  (`calculateIPV`); ausserhalb des Browsers liefert die Rechnung nur «laden». Das Mockup zeigt darum
  keinen Betrag, sondern «Möglicher Betrag — nur auf Antrag».

### Kapitel Finanzen · entschieden (Stebler Studios, 23.10.2026)

- **Kopf links und ruhig** wie alle anderen neuen Seiten (heute zentriert, Münze und Satz in Gold).
- **Neue Teile bleiben** und gehen an den Copy-Prüfer: «Jeden Monat bleiben CHF 2'480» mit
  «verplant» / «Einkommen, netto», «Passend zu diesem Bereich» und «Als Nächstes».
- **Reiter «Dokumente» wie heute plus Fotografieren:** Dokumenttyp (aus den Kapitel-Dokumenten:
  Steuererklärung, Lohnzettel, Kontoauszug), Ablaufdatum, «Datei auswählen oder hierher ziehen»,
  «Hochladen», «Erforderliche Dokumente», «Ihre Dokumente bleiben auf diesem Gerät.», Fehlertexte der
  App; dazu «Dokument fotografieren» als zweiter Weg. Der erfundene Leer-Satz ist weg.

### Kapitel Finanzen · alle Felder (Stebler Studios, 23.10.2026)

Frage von Stebler Studios: fehlen da nicht noch Details? **Ja:** Die App hat 37 Felder in sieben Abschnitten,
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

### Kapitel Finanzen · die eingebauten Helfer (Stebler Studios, 23.10.2026)

Stebler Studios: «es fehlen mir die Details, die wir bei den Finanzen eingebaut haben». Aus `ChapterView.jsx`
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

### Kapitel Finanzen · Barometer und Ruhe (Stebler Studios, 23.10.2026)

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
- **«Trifft nicht zu» leiser** (Stebler Studios, 23.10.): kein eigener Knopf mehr unter dem Feld, sondern ein
  kleines graues Wort rechts neben dem Feldnamen; danach dort «Zurücknehmen». Tippfläche 32 px hoch,
  für den Bau auf 44 px prüfen (a11y-Prüfer).

### Vor dem Bau festgelegt (Stebler Studios, 23.10.2026, Auswahl-Dialog in der Bau-Sitzung)

- **Umfang:** «Möglichst alles» von Fassung 5 in den Nachzug **29.10.** (Übersicht ausgenommen, nicht entschieden).
- ~~**Merkliste · Bereichs-Symbol:** Vorschlag aus dem Mockup gilt — IPV, Prämien, Vorsorge → Versicherungen ·
  Steuern, Kalender, Offizielle Links → Behörden · Sozialhilfe → Finanzen · ALV, Stipendien → Ausbildung ·
  Asyl, Ablage, ohne Verknüpfung → Persönliche Basis.~~
- ~~**Kalender · Kategorie → Bereichsfarbe:** Vorschlag gilt — Gesundheit/Versicherung → Versicherungen,
  Verwaltung/Recht → Behörden, Arbeit/Ausbildung → Ausbildung, Familie/Persönlich → Basis; übrige → Basis.~~
  > ⟨überholt, Stebler Studios 23.10.2026 abends⟩ **Es gilt der Block «Zuordnungen Merkliste und Kalender ·
  > festgelegt» weiter unten** (aus `werkzeugRegister.js`). Die beiden Zeilen oben waren der erste
  > Mockup-Vorschlag, bevor die App geprüft war. Sie lagen bei Steuern, ALV und Asyl daneben und hätten
  > «Steuern» in der Merkliste anders eingefärbt als im Kapitel. Stebler Studios: «Ja, Liste B».
- **Kapitel Finanzen · Nebenerwerb:** die fünf Felder erscheinen **erst mit Nebenerwerb**.
- **Sprachen:** FR/IT/EN und **auch rm** entwirft Claude selbst; rm als ungeprüft markiert bis zur Gegenlese.
  Copy-Prüfer liest alle neuen Texte vorher.
- **Gemeinsames Feld «Tag»** (Merkliste ↔ Kalender): technischer Entscheid der Bau-Sitzung — optionales
  Datumsfeld am Merkpunkt, alte Einträge ohne Tag bleiben gültig (keine Migration).
- **«Alle Kantone vergleichen»:** App-Logik bleibt wie sie ist (erscheint erst mit amtlich belegten Kantonen).

### Zuordnungen Merkliste und Kalender · festgelegt (Stebler Studios, 23.10.2026)

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

Stebler Studios hat zweimal gefragt «was ist besser und warum?». Entschieden hat Claude nach der Empfehlung
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

### entschieden (Stebler Studios, 23.10.2026 abends)

- ~~**Steuern (J) und Einstellungen (I) gelten so.** Stebler Studios wörtlich: «steuern und einstellungen sind super».~~
  > ⟨korrigiert, Stebler Studios 23.10. abends⟩ «steuern sry da bin ich doch noch nicht sicher». **Es gilt nur Einstellungen (I).** Steuern (J) ist wieder offen.
- **Finanz-Übersicht (K):** keine Rückmeldung, bleibt offen.

### Steuern (J) · entschieden (Stebler Studios, 24.10.2026)

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

### Finanz-Übersicht (K) · entschieden (Stebler Studios, 24.10.2026)

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

### Finanz-Übersicht (K) · detaillierter, entschieden (Stebler Studios, 24.10.2026)

Stebler Studios: «wir wollen zuerst noch die Finanz-Übersicht verbessern und detaillierter machen» — und «der Tacho
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

### Finanz-Übersicht (K) · zweiter und dritter Ausbau, entschieden (Stebler Studios, 24.10.2026)

Stebler Studios: «was jetzt schon drin ist und erarbeitet wurde» bleibt, dazu alles, was die App schon kann.
Umgesetzt in `seiten-v5.html?nur=k` (ffcc25b2, 6185adae). Stebler Studios: «die Finanz-Übersicht passt jetzt».

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

### Suche (N) · entschieden (Stebler Studios, 24.10.2026)

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

### Was steht mir zu? (M) · entschieden (Stebler Studios, 24.10.2026)

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

### Rucksack (L) · entschieden (Stebler Studios, 24.10.2026)

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

### Was steht mir zu? (O) · entschieden (Stebler Studios, 24.10.2026)

Stebler Studios fragte «was ist die beste Lösung?»; Empfehlung Claude: eine Seite (gleiche Frage, Regel «eine Seite, ein
Name», ein Ort gibt eine Antwort). Stebler Studios: «Ja, eine Seite … so wie du es empfiehlst», danach «Entwurf O passt».
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

### Notfall P–S · entschieden (Stebler Studios, 24.10.2026)

Stebler Studios: «vier Seiten mit einem gemeinsamen Notfall-Ort, ein Name je Seite, Fassung-5-Form», danach «die vier
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

### Datenseiten · entschieden (Stebler Studios, 24.10.2026)

Stebler Studios wählte beide Empfehlungen («In Finanz-Übersicht aufgehen», «Drei Seiten, eine Form»), danach «die
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

### Ablauf-Schale (W) · entschieden (Stebler Studios, 24.10.2026)

Stebler Studios wählte beide Empfehlungen («In der Schale, alle auf einmal», «Passstrasse mit n Kehren»), danach
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

### Rechner-Form (X) · entschieden (Stebler Studios, 24.10.2026)

Stebler Studios wählte die Empfehlung «Eine Rechner-Form für alle», danach «Entwurf X passt für alle Rechner».
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

---

## Runde 9 · Kapitel, eines nach dem anderen (24.10.2026)

Stebler Studios: «Kapitel für Kapitel» (statt einer Form für alle). Vorlage ist Kapitel Finanzen (A, entschieden 23.10.).
Im Code gilt der Kopf links schon für alle Kapitel (`ChapterView.jsx:1955`); «Passend zu diesem Bereich» und
«Als Nächstes» gibt es heute nur bei Finanzen (`ChapterView.jsx:2435`).

### Kapitel Persönliche Basis (Y) · entschieden (Stebler Studios, 24.10.2026)

Entwurf: `seiten-v5.html?nur=y` (d0ad6655). Bild heute: `heute-kapitel-basis.jpg`.
- Kopf links wie heute; **Zusammenfassungs-Satz** («Maria Muster, geboren 1992 …») ruhig unter dem Kopf statt im
  grünen Kasten.
- Reiter «Angaben / Dokumente», Abschnitte Person, Kontakt, Familie mit «ändern ›»; «Erwachsene im Haushalt 1 ·
  Kinder 0» als eine Zeile **«Im Haushalt: 1 Erwachsene · 0 Kinder»**.
- **Passend zu diesem Bereich** (Stebler Studios wählte alle vier): Lebensmappe · Pass oder Identitätskarte (Ablauf
  `ausweis`, 5 Schritte) · Zivilstand ändert sich (→ Rucksack-Gegenstand «Familie»: Heirat, Zusammenziehen, Kind,
  Trennung) · Ausweis-Kopie ablegen (Ablage, gefiltert auf Basis).
- **Je nach Angaben** (Stebler Studios: «Ja, je nach Angaben»): Nationalität nicht Schweiz → Aufenthaltsbewilligung
  verlängern, Einbürgerung; Zuzug in den letzten 12 Monaten → Neu in der Schweiz. Stehen oben in «Passend».
- **Als Nächstes:** Wohnen & Leben mit Satz und Knopf. «Das Bild steht.» bleibt als leiser Satz.

**Copy-Prüfer:** Untertitel der Passend-Zeilen, «Im Haushalt».

### Kapitel Wohnen & Leben (Z) · entschieden (Stebler Studios, 24.10.2026)

Entwurf: `seiten-v5.html?nur=z` (f5fe7e6d). Bild heute: `heute-kapitel-wohnen.jpg`.
- Zusammenfassungs-Satz ruhig unter dem Kopf statt im grünen Kasten.
- **Hauptzahl** (Stebler Studios wählte alle drei: «Wohnkosten mit Drittel-Marke & Mit Regional-Barometer & Regler zum
  Testen … wenn man eine Wohnung sucht, quasi Sandbox»): «Wohnkosten pro Monat» gross, Balken «… % des
  Einkommens» mit Marke bei einem Drittel (über einem Drittel sand und Satz «Mehr als ein Drittel …»); darunter
  **Regional-Barometer** «Miete regional vs. Schweiz» wie in der Finanz-Übersicht; darunter aufklappbar
  **«Ausprobieren: andere Miete»** — Regler Nettomiete 800–3’500, Nebenkosten wie heute, Hauptzahl, Drittel,
  Barometer und «Frei verfügbar danach» folgen; nichts gespeichert, «Zurück auf die heutige Miete». Im Bau wie der
  Probier-Modus der App, ohne Profil zu verändern.
- Ersetzt den Kasten Wohnkosten / Einkommen / Anteil.
- **Passend** (Stebler Studios wählte alle vier): Umzug (Ablauf, 4 Schritte) · Mietzinsbeiträge · Wohnung gekündigt ·
  Mietvertrag ablegen. **Als Nächstes:** Finanzen & Geld. «Ihr Zuhause hat einen Platz.» bleibt leise.

**Copy-Prüfer:** «Wohnkosten pro Monat», «… % des Einkommens», «ein Drittel», «Mehr als ein Drittel …»,
«Ausprobieren: andere Miete», «Nettomiete einer neuen Wohnung», «Frei verfügbar danach», Durchspiel-Hinweis,
«Zurück auf die heutige Miete», Passend-Untertitel.
**Voraussetzung im Bau:** Anteil am Haushaltseinkommen aus der einen Monatsrechnung (🔴 1).

### Kapitel Versicherungen & Vorsorge (AA) · entschieden (Stebler Studios, 24.10.2026)

Entwurf: `seiten-v5.html?nur=aa` (0e2e55d7, dacd7fda). Bild heute: `heute-kapitel-versicherungen.jpg`.
- Zusammenfassungs-Satz ruhig unter dem Kopf statt im grünen Kasten.
- **Hauptzahl** (Stebler Studios: «Prämien pro Monat + Schutzschild & Franchise-Kreuz dazu»): «Versicherungen pro Monat»
  aus den erfassten Prämien (Maria: KK 385 + Hausrat 22/Jahr ≈ 2 = 387); nicht erfasste Prämien werden genannt,
  die Pensionskasse als Lohnabzug ausgewiesen. **Schutzschild** als eine Zeile «Pflicht 3/3 · Empfohlen 2/2» zum
  Aufklappen statt zwei grosser Schilde. **Franchise-Kreuz** (`FranchiseKreuz`, wie Prämien-Orientierung) mit
  dem App-Satz «Eher 2’500 (Schätzung, Prämien 2026)» und einem Erklärsatz.
- Angaben in Abschnitten; leere Abschnitte (Sozialversicherung, Mobilität) zu einer Zeile zusammengefasst.
- **Passend** (Stebler Studios wählte alle vier): Prämienverbilligung prüfen · Krankenkasse wechseln (Ablauf, Frist
  30.11.) · Vorsorge-Rechner · Policen ablegen. **Als Nächstes:** Ausbildung & Arbeit.

**Befund Beispielprofil / Datenmodell:** Haftpflicht «Versicherungssumme CHF 35» (`liabilityAmount: '35'`) ergibt
keinen Sinn; ein Feld für die Haftpflicht-*Prämie* fehlt, darum fliesst sie nicht in «pro Monat». Vor dem Bau klären.
**Copy-Prüfer:** «Versicherungen pro Monat», Hinweis zu nicht erfassten Prämien, Erklärsatz Franchise-Kreuz,
Passend-Untertitel.

### Kapitel Versicherungen (AA) · nachgebessert (Stebler Studios, 24.10.2026)

Stebler Studios: «wo ist das Schutzschild hin? achte auf die Details … vielleicht wieder ein Barometer … wie viel vom
Einkommen», danach «Feinschliff … vergiss die Details nicht», dann «alle drei passen jetzt».
Commits a0e05c1a, 7c1003d9.
- **Ihre KK-Last** als Barometer «6.2 % des Einkommens» mit Marke «WHO 10 %» (Skala wie Finanz-Übersicht) und
  dem kurzen App-Satz.
- **Schutzschild sichtbar:** zwei kleine Schilde (3/3, 2/2) mit Listen, offen — statt zugeklappter Textzeile.
- **Franchise-Kreuz** als kleine Fassung des echten (Break-even ≈ 2’050, «bisher 420», Fläche «hohe Franchise
  günstiger»), darunter Verweis-Zeile «Alles zur Franchise und zum Vergleich» → Versicherungs-Übersicht.
- Neu oben in «Passend»: «Alle Versicherungen auf einen Blick» → Versicherungs-Übersicht.

### Versicherungs-Übersicht (AB) · entschieden (Stebler Studios, 24.10.2026)

Stebler Studios wählte «Versicherungs-Übersicht» (wie beim Geld: Kapitel zum Eintragen, eine Übersicht für alles).
Entwurf: `seiten-v5.html?nur=ab` (ec77ee14, 7c1003d9). Bilder heute: `heute-praemien-1/2/3.jpg`.
- Die **Prämien-Orientierung** (`#/praemien`) wird **«Versicherungs-Übersicht»**, Brotkrume über das Kapitel.
- Aufbau wie die Finanz-Übersicht: Marken (Kasse · Modell, Franchise, Prämienregion) · **Versicherungen pro
  Monat** + KK-Last (WHO 10 %), «Was darin steckt» aufklappbar · **Zeilen mit Wert**, je zum Werkzeug: Franchise
  («Eher 2’500», Break-even, Ersparnis), Krankenkasse wechseln («Kündigung bis 30.11.2026», ohne Countdown),
  Prämienverbilligung mit Pegel, Gesundheitskosten, KVG-Leistungen, Vorsorge · **Schutzschild** sichtbar ·
  aufklappbar: das echte **Franchise-Kreuz** mit Reserve-Satz, **Prämie regional** (Regional-Barometer),
  **Prämienvergleich & Unfalldeckung** mit Referenzprämien je Franchise, **Alle Kassen** (Top 5 + «alle anzeigen»)
  · Zusatz-Wechsel und KK-Scanner als Zeilen.
- `#/praemien` leitet weiter; Titel in fünf Sprachen neu (Copy-Prüfer).

**Befund Beispielprofil:** Marias Prämie CHF 385 liegt unter jeder Referenzprämie (günstigste 535.20 bei
Franchise 1’500); die App meldet «CHF 196 unter der Referenz». Beispiel realistisch machen.

### Kapitel Ausbildung & Arbeit (AC) · entschieden (Stebler Studios, 24.10.2026)

Entwurf: `seiten-v5.html?nur=ac` (f474dbda, 7c1003d9). Bild heute: `heute-kapitel-ausbildung.jpg`.
- **Oben** (Stebler Studios: «Lohn-Barometer & Lebenslauf-Vorschau»): «Wo steht Ihr Lohn?» mit vier Abschnitten (wie
  Kapitel Finanzen) und eine Lebenslauf-Vorschau (Papierkarte aus den Angaben) mit «Lebenslauf erstellen ›».
- Zusammenfassung ruhig unter dem Kopf, ergänzt um Arbeitgeber, Dauer (aus «Anstellung seit») und Wochenstunden.
- **Passend** (Stebler Studios, alle): Lebenslauf erstellen · Neue Stelle · Stelle verloren · Stundenlohn & Mindestlohn ·
  Diplome ablegen. **Als Nächstes:** Behörden & Rechtliches.

**Befund App:** Werte in der schmalen Spalte brechen mitten im Wort («Kantonsspita / l Zürich»,
`overflowWrap: anywhere`, `ChapterView.jsx:1860`) — vermutlich alle Kapitel. Umbruch nur zwischen Wörtern.

### Kapitel Behörden & Rechtliches (AD) · entschieden (Stebler Studios, 24.10.2026)

Entwurf: `seiten-v5.html?nur=ad` (8bc8662e). Bild heute: `heute-kapitel-behoerden.jpg`.
- **Weg** (Stebler Studios: «Weg»): der Kasten «Folgende Stände und Fristen sind erfasst» (`ChapterView.jsx:1884`), er
  wiederholt die Angaben rechts.
- **Oben** (Stebler Studios wählte alle drei): **Steuerfrist** als Kalenderblatt mit dem App-Satz zur Frist und «Alles zu
  Ihren Steuern ›» → Steuern (J) · **Behördengänge** offen statt zugeklappter Checkliste, mit Weg zum Werkzeug
  (Steuern, Betreibungsauszug, Ausweis); «Steuererklärung eingereicht» als Vorschlag automatisch, wenn «Offene
  Steuererklärungen 0» · **Für den Fall der Fälle**: Testament, Vorsorgeauftrag, Patientenverfügung als drei Felder
  mit Weg zu «Vorsorgeauftrag & Patientenverfügung»; «Patientenverfügung hinterlegt» fällt aus den Behördengängen.
- Zusammenfassung ruhig unter dem Kopf, ergänzt um Steuererklärung und Betreibungsregister. Vertretung leer →
  «Rechtliche Vertretung: nicht erfasst».
- **Passend** (Stebler Studios, alle): Steuern · Betreibungsauszug bestellen · Betreibung erhalten · Vorsorgeauftrag &
  Patientenverfügung · Briefvorlagen · Dokumente ablegen. Je nach Angaben: Betreibungsregister «Einträge» →
  Betreibung erhalten und Schulden-Hilfe nach oben. **Als Nächstes:** Notfall. «Der Stand ist dokumentiert.» bleibt.

**Befund Beispielprofil:** Steuerfrist 30.09.2026 liegt in der Vergangenheit (App: «vor 24 Tagen»). Auf eine
kommende Frist setzen; welche Frist im Kanton gilt, mit Quelle prüfen (Swiss-Precision-Prüfer), nicht raten.
**Befund App:** «ZH-2024-123456» bricht in der Wertspalte um (wie AC).
**Copy-Prüfer:** Zusammenfassung, «Steuererklärung fällig am …», «Alles zu Ihren Steuern», «Behördengänge»,
«1 von 5 erledigt», «Für den Fall der Fälle» mit Satz, «Rechtliche Vertretung: nicht erfasst», Passend-Untertitel.

### Kapitel Notfall (AE) · entschieden (Stebler Studios, 24.10.2026) ⟨überholt am selben Tag, siehe «ein Ort» unten⟩

Entwurf: `seiten-v5.html?nur=ae` (ef0f5474). Bild heute: `heute-kapitel-notfall.jpg`.
- **Oben** (Stebler Studios wählte alle drei): **Vorschau der Karte zum Drucken** (Papierkarte aus `notfallkarteAbschnitte`,
  `ChapterView.jsx:1103`) mit echtem Knopf «Notfallkarte drucken» statt Link mit Kästchen-Zeichen
  (`ChapterView.jsx:1869`) · **«Alles für den Ernstfall»** als eine Zeile zum Notfall-Ort (P) · **Vorsorge** als
  vier Felder (Organspende, Patientenverfügung, Vorsorgeauftrag, Bestattungswünsche) mit ✓/○ und «1 von 4 geregelt».
  Patientenverfügung und Vorsorgeauftrag werden hier eingetragen; AD «Für den Fall der Fälle» zeigt sie nur an.
- Zusammenfassung ruhig unter dem Kopf, ergänzt um Blutgruppe und Allergie. Medikamente und Vorerkrankungen leer →
  «nicht erfasst».
- **Passend** (Stebler Studios, alle): Notfall · Notfallpass · Patientenverfügung erstellen · Bestattungswünsche · Dokumente
  ablegen.
- **Ende** (Stebler Studios: «Zurück zur Übersicht»): «Alle Kapitel durchgegangen · Zur Übersicht ›». «Die Informationen
  sind hinterlegt.» bleibt leise.

**Offen (Stebler Studios: «später klären»):** Zwei Dinge heissen «Notfallkarte» — die Notruf-Vorlesekarte (Q, Runde 5) und
die Karte zum Drucken für die Brieftasche. Vor dem Bau einen eigenen Namen für die Druckkarte finden.
**Befund App:** Telefonnummern und «Zustimmung — alle Organe und Gewebe» brechen in der Wertspalte über mehrere
Zeilen (wie AC, AD).
**Copy-Prüfer:** Zusammenfassung, «Ihre Notfallkarte — Vorschau», Satz zur Brieftasche, «Alles für den Ernstfall»,
Vorsorge-Satz, «1 von 4 geregelt», «Medikamente und Vorerkrankungen: nicht erfasst», «Alle Kapitel durchgegangen»,
Passend-Untertitel (u. a. «Festhalten, was Ihnen wichtig ist» ist neu).

### Kapitel Notfall (AE) · ein Ort, entschieden (Stebler Studios, 24.10.2026)

Stebler Studios: «hatten wir nicht besprochen, dass wir die Notfall-Sachen zusammenbringen, ergänzen?» — in den Dateien
stand das nicht (Runde 5: «Das Kapitel Notfall bleibt der Ort zum Eintragen»). Auf Claudes Empfehlung: «bau AE so
um, dass das Kapitel Notfall der eine Ort ist und P wegfällt». Danach zweimal «geht noch besser», dann «Jetzt passt
es» mit allen vier Neuerungen der dritten Fassung. Commits 6eb70507, 758824d5, 54edd269.
**Ersetzt** in Runde 5 den Punkt «P Notfall … Das Kapitel Notfall bleibt der Ort zum Eintragen».

- **P entfällt:** `#/notfalleinstieg` leitet ins Kapitel; die Übersichtskarte führt ins Kapitel. Q, R, S behalten
  Brotkrume «Übersicht › Notfall › …» und die Zeile der Schwesterseiten (erster Eintrag: das Kapitel).
- **Im Ernstfall** zuoberst: roter Knopf «Notfallkarte öffnen» mit 144 · 117 · 118 (aus Q), **bleibt beim Scrollen
  stehen**; darunter **«Peter Muster anrufen»** (Telefon-Link der Notfall-Kontaktperson).
- **Bereit für den Ernstfall:** «19 von 20» (die verschiedenen Angaben der drei Szenarien aus P) mit Balken, darunter
  **nur das Fehlende, gleich hier ausfüllbar** (Feld, «Speichern», «Ich nehme keine» zählt als erledigt wie
  `naOk`). Angaben aus anderen Kapiteln führen in jenes Kapitel. Die drei Szenarien zugeklappt zum Nachsehen.
- **Ihre Notfall-Unterlagen:** vier Kacheln Notfallkarte · Notfallpass · Notfall-Dossier · Karte zum Drucken, mit
  «Alle entstehen aus den Angaben unten»; Druckvorschau zugeklappt mit Knopf «Drucken».
- **Vorsorge:** vier Felder ✓/○, «1 von 4 geregelt»; offene Felder führen selbst zum Werkzeug («erstellen ›»,
  «festhalten ›»).
- Angaben wie zuvor, fehlende Medikamente markiert. **Passend:** nur noch Dokumente ablegen. **Ende:** «Alle
  Kapitel durchgegangen · Zur Übersicht ›», «Die Informationen sind hinterlegt.», «Ihre Daten bleiben auf diesem Gerät.»

**Weiter offen:** eigener Name für die Karte zum Drucken (zwei Dinge heissen «Notfallkarte»).
**Zu prüfen vor dem Bau:** die Zahl 20 aus den Szenario-Listen nachzählen; Telefon-Link nur bei erfasster Nummer;
Ernstfall-Knopf darf beim Stehenbleiben nichts verdecken (Tastatur, Anker unten).
**Copy-Prüfer:** «Im Ernstfall: Notfallkarte öffnen» mit Nummern-Zeile, «… anrufen», «Bereit für den Ernstfall»,
«Angaben, die im Notfall gebraucht werden», «fehlt für «Unfall»», «z. B. Name und Dosis», «Ich nehme keine»,
«Ihre Notfall-Unterlagen» mit Satz, Kachel-Untertitel, «erstellen ›», «festhalten ›».

### Feinschliff, gilt für alle Kapitel (24.10.2026)

Zusammenfassungs-Satz mit Abstand und normaler Schrift (`.kap-zus`); Zwischentitel im Kapitel einheitlich
(`.kap-h`: «Ihre KK-Last», «Schutzschild», «Franchise-Kreuz», «Wo steht Ihr Lohn?», «Miete regional vs. Schweiz» …);
Barometer-Beschriftungen kurz (kein Umbruch); Tausender-Zeichen «’».

### Offene Entscheide aus der Übergabe · entschieden (Stebler Studios, 24.10.2026, Start Fassung 6)

- **Karte zum Drucken heisst «Portemonnaie-Karte».** Damit heisst nur noch die Vorlesekarte (Q) «Notfallkarte».
  Gewählt statt «Notfallausweis» (zu nah an «Notfallpass») und «Brieftaschenkarte» (weniger schweizerisch).
- **Übersicht zeigt 70 %** (Durchschnitt der sieben Bereiche, `BergDetail.jsx`), nicht 63 %
  (`gesamtVollstaendigkeit`). Grund: Die grosse Zahl passt zu den Bereichszeilen darunter; jeder Bereich zählt
  gleich, Finanzen mit vielen Feldern drückt nicht alles. Kartentitel und Bereichszeilen bleiben offen.
- **ALV heisst überall «Arbeitslosenentschädigung»** (Titel, Suche, Register, Merkliste); «ALV-Taggeld» fällt weg.
- **Erfasste Versicherungsprämien gehören ins Budget** (Hausrat, Haftpflicht). Dafür braucht die Haftpflicht ein
  eigenes Prämienfeld; `liabilityAmount` im Beispielprofil klären.
- **Reiter «Dokumente»** war schon am 23.10. entschieden (siehe «Kapitel Finanzen · entschieden»).
- **Geldfluss im Kapitel Finanzen: vorerst ein ruhiger Balken** (Einkommen aufgeteilt in Wohnen · Versicherungen ·
  Steuern · übrige Ausgaben · bleibt) statt Sankey. Stebler Studios mag den Sankey als Idee, aber an einem anderen Ort,
  und will kreativere Darstellungen sehen (offen).
- **Kuchendiagramm auf der Charts-Seite wird gestrichen**: Die Finanz-Auswertung hat einen Ort, das Kapitel.

### Geldfluss, Kuchen, Balken und Steuern · nachentschieden (Stebler Studios, 24.10.2026 abends)

⟨Ersetzt die zwei Punkte «Geldfluss … vorerst ein ruhiger Balken» und «Kuchendiagramm … gestrichen» oben.⟩
Stebler Studios: «das charts kuchen diagramm soll vorkommen aber halt bei den finanzen», auf die Frage Kuchen/Balken/Sankey:
«alle drei irgendwie logisch und helfend eingebaut». Befund: Die Charts-Seite gibt es seit #556 nicht mehr
(`#/charts` → Kapitel Finanzen), der Kuchen war damit nirgends mehr sichtbar.
Alle drei im Kapitel Finanzen, je eine eigene Frage:
- **Balken** — «Wie viel ist verplant, was bleibt?»: der bestehende Balken unter «Jeden Monat bleiben», neu
  unterteilt (Wohnen · Versicherungen · Steuern · Übriges · bleibt). Immer.
- **Kuchen** — «Wofür geht es weg?»: alle Ausgabenposten in der Auswertung. Sobald Ausgaben erfasst sind.
- **Sankey** — «Woher kommt es, wohin fliesst es?»: nach dem Kuchen, **nur mit zwei oder mehr Einnahmequellen**
  (Lohn, Nebenerwerb, Familienzulagen, Alimente). Mit einem Lohn ist er ein Strom, der sich auffächert — darum
  «komisch». Alle drei rechnen aus `utils/monatsrechnung.js`; bei brutto erfasstem Lohn kein «bleibt».

**Steuern: aufteilen, klar benannt** (Stebler Studios, Auswahl-Dialog, empfohlene Option). Geld (Betrag «Steuern
monatlich», Belastung, Steuerrechner, Karte in der Auswertung) bei **Finanzen & Geld**; Behördengang (Kanton,
Steuernummer, Frist als Kalenderblatt, offene Erklärungen) bei **Behörden & Rechtliches** (Runde 9, AD, gilt
weiter). Beide verweisen aufeinander.

---

## Abnahme Fassung 6 · App von heute gegen Fassung 5 (25.10.2026)

Stebler Studios: «Geh die gebauten Seiten Seite für Seite durch: App von heute gegen den Entwurf aus Fassung 5, mit
Vergleich wie vorher.» Gemessen auf `main` `97c476f3` (Worktree `_werkbank/abnahme-f6`, Port 5495), Beispiel
Maria, 375 px. Entwurf: `seiten-v5.html?nur=<id>` (Port 5490). **Nicht live** (live 0.1.48-beta).

### Kapitel Wohnen & Leben (Z) · Befunde (25.10.2026, noch nicht entschieden)

**Wie entschieden gebaut:** Zusammenfassung als ruhiger Satz · «Wohnkosten pro Monat» CHF 1’830, 29.5 % von 6’200,
Drittel-Marke · Barometer «Miete regional vs. Schweiz» · «Ausprobieren: andere Miete» mit Regler, «Frei verfügbar
danach» und «Zurück auf die heutige Miete» (erscheint nach dem Verschieben; 2’400 → 2’580 · 41.6 % · Satz «Mehr als
ein Drittel …») · Reiter Angaben/Dokumente · Passend (4) · Als Nächstes Finanzen · «Ihr Zuhause hat einen Platz.»
**Bewusst anders (Fachprüfung #567):** Faustregel-Satz ohne «viele Vermieter verlangen das sogar» · BFS 2024
(1’732 / 1’446 statt 1’538 / 1’327) · Feld «Nettomiete CHF/Monat (ohne Nebenkosten)».

**Abweichungen:**
1. Zusammenfassung sagt «Monatsmiete CHF 1’650», das Feld heisst jetzt «Nettomiete» — zwei Wörter für eins.
2. Barometer-Zahlen ohne Tausender-Zeichen («CHF 1446 / 1732 / 1650»), Feinschliff verlangt «’».
3. Barometer hat drei Sätze mehr als der Entwurf: «rund 20 % über dem Schweizer Schnitt», Erklärung «strukturell …»,
   Zimmer-Satz. Entwurf: nur die Quellenzeile.
4. Zimmer-Satz «mit Ihrer Zimmerzahl im Kapitel Wohnen wird der Vergleich genauer» steht **im** Kapitel Wohnen; das
   Feld `rooms` gibt es, ist bei Maria leer und darum in den Angaben unsichtbar (nur über «ändern»).
5. Angaben je Abschnitt in einer eigenen Karte (Entwurf: ruhige Liste). Lange Feldnamen brechen um
   («Nettomiete CHF/Monat (ohne Nebenkosten)», «Name Vermieter», «Telefon Vermieter», «Strasse & Hausnummer»);
   PLZ und Ort zwei Zeilen statt «PLZ · Ort».
6. Kopf: Entwurf mit Landschaftsband, Brotkrume «Übersicht › Wohnen & Leben» und Symbol-Kachel; App «← Übersicht»,
   Emoji, Kopf in einer Karte.
7. Zeile «Ausprobieren: andere Miete · Wohnungssuche» ohne «›» — wirkt nicht aufklappbar.
8. Passend: Untertitel anders als im Entwurf («Adresse, Gemeinde, Kündigung» statt «Ablauf · 4 Schritte» usw.),
   kleine Symbole ohne Kachel.
9. «Als Nächstes» als gefüllte Karte mit Goldknopf und Grossbuchstaben; Entwurf zentriert, leiser Umrissknopf.
10. Anker unten: App 5 Punkte («Was steht mir zu?», ohne Kalender und Suche), Entwurf 6 («Anspruch», Kalender,
    Suche) — gilt für alle Seiten, gehört zum Menü-Entscheid, nicht zu diesem Kapitel.

**Entschieden (Stebler Studios, 25.10.2026):** «Behebe 1, 2, 3 (Barometer ruhiger), 4 und 7. Den Rest (5, 6, 8, 9) nehmen wir
als Muster für alle Kapitel am Schluss.» Gebaut: Zweig `fix/f6-abnahme-wohnen`, Entwurfs-PR #571 (`bad9b708`) —
«Nettomiete» im Satz · Tausender-Zeichen im Barometer (überall) · im Kapitel ohne strukturelle Erklärung, Zimmer-Hinweis
«unten bei den Angaben» (rm ungeprüft) · «›» an «Ausprobieren». 6’784 Tests grün, Build sauber, Browser 375 px.
Punkt 10 (Anker unten) gehört zum Menü-Entscheid.

### Kapitel Finanzen & Geld (A + nachentschieden 24.10.) · Befunde (25.10.2026, noch nicht entschieden)

Gemessen auf `main` `97c476f3`, `#/chapter/2`, Maria. Entwurf: `seiten-v5.html?nur=a`. Die Auswertung (Lebensbaum,
Kuchen, Lohn, «Was sich daraus ergibt») stand im Entwurf A nicht; sie wird gegen die Entscheide vom 24.10. gelesen.

**Wie entschieden gebaut:** Kopf links (Münze, ruhig) · «Jeden Monat bleiben» CHF 2’459 aus der einen Monatsrechnung,
Balken **unterteilt** Wohnen · Versicherungen · Steuern · Übriges · «3’741 verplant von 6’200 Einkommen, netto» ·
Zusammenfassung «Es bleiben CHF 2’459.» · Nebenerwerb erst mit Nebenerwerb · Kuchen in der Auswertung · **kein Sankey**
(Maria hat eine Einnahmequelle — richtig so) · «Wo steht Ihr Lohn?» als Barometer mit vier Abschnitten · Passend ·
Als Nächstes Versicherungen · Tausender-Zeichen «’».

**Abweichungen:**
1. **Lohn-Hinweise offen statt hinter «So ist gerechnet»** (entschieden 23.10., «Barometer und Ruhe»): drei lange
   Absätze (Netto→Brutto, 42 Std., 13. Monatslohn) plus Quelle und «Orientierung» stehen offen.
2. **Passend weicht ab:** Entwurf «Alle Berechnungen auf einen Blick» (Finanz-Übersicht) · «Prämienverbilligung
   prüfen» · «Neue Stelle» · «Lohnausweis ablegen». App: «Neuer Job» · «Lohnausweis ablegen», danach Monatsbudget,
   Behörden-Dossier, «Übersicht drucken». Der Weg zur Finanz-Übersicht fehlt.
3. **Kuchen «Ausgaben-Übersicht»:** zählt «Rest/Sparen» (40 %) als Stück mit — die Frage war «Wofür geht es weg?».
   Farben doppelt (Lebensmittel = Rest/Sparen grün, Krankenkasse = Internet blau). «Säule 3a CHF 21 · 0 %».
   Titel ist nicht die Frage.
4. **Lebensbaum:** Beschriftungen überdecken sich bei 375 px («Ausbildung 82 %» unter «Notfall», «Finanzen» unter
   «Versicherung»), «Notfall» steht zweimal.
5. **Steuer-Karte** sagt «Angeben lässt sich das im Kapitel «Finanzen & Geld»» — man ist schon dort (wie Wohnen 4).
   Die Karte ist ein langer Absatz. Querverweis Steuern ↔ Behörden fehlt noch (gehört zu AD).
6. **Lohn-Legende bricht** «Ihr Lohn: CHF / 6’472», «Median: CHF / 7’024».
7. **Balken-Farbe Wohnen** rose hier, im Kapitel Wohnen Birne/grün — eine Bereichsfarbe, zwei Farben.
8. Angaben: Entwurf zeigt je Abschnitt «5 von 14 erfasst» und leere Felder mit «ergänzen»; App nur die erfassten.
   Werte brechen um («Netto (was ich / erhalte)», «Kantonsspital / Zürich»). Feldname «Ersparte» (statt «Erspartes»).
9. Wie Wohnen 5, 6, 8, 9 (Karten, Kopf, Passend-Symbole, Als-Nächstes-Karte) → Muster am Schluss.

**Entschieden (Stebler Studios, 25.10.2026):** «Behebe bei Finanzen 1 bis 6. 7 und 8 nehmen wir ins Muster für alle Kapitel am
Schluss.» Gebaut: Zweig `fix/f6-abnahme-finanzen`, Entwurfs-PR #572 (`04765604`) — Lohn-Hinweise hinter «So ist
gerechnet» · Kuchen «Wofür geht es weg?» nur Ausgaben, «< 1 %», eigene Farbe Internet & Telefon · Lebensbaum entzerrt,
Werkzeug-Frucht «Notfallkarte» · Steuer-Karte im Kapitel eine Zeile, 13. Monatslohn «oben bei Einkommen» · Lohn-Legende
ganz. 6’783 Tests grün, Build sauber, Browser 375 px. rm ungeprüft, Copy-Prüfer steht aus.
**Punkt 2 war ein Fehlbefund:** «Alle Berechnungen» und «Prämienverbilligung» wurden mit der Finanzen-Fusion bewusst aus
«Passend» genommen (`finanzen-fusion.md`, Test «keine Doppelungen mehr») — Übersicht und IPV stehen im Kapitel. Nicht geändert.

### Kapitel Persönliche Basis (Y) · Befunde (25.10.2026, noch nicht entschieden)

Gemessen auf `main` `97c476f3`, `#/chapter/0`, Maria. Entwurf: `seiten-v5.html?nur=y`.

**Wie entschieden gebaut:** Zusammenfassung ruhig («Maria Muster, geboren 1992, wohnhaft im Kanton Zürich. Ledig, lebt
alleine.») · Reiter Angaben/Dokumente · Person, Kontakt, Familie mit «ändern ›» · «Im Haushalt» als eine Zeile ·
Passend: Lebensmappe, Pass oder Identitätskarte, Zivilstand ändert sich, Ausweis-Kopie ablegen · Als Nächstes Wohnen ·
«Das Bild steht.» Text Wort für Wort wie im Entwurf.

**Abweichungen:**
1. **«1 Erwachsene · 0 Kinder»** — holprig (schon in der Übergabe offen). Vorschlag: «allein, keine Kinder» bzw.
   «2 Erwachsene · 1 Kind»; Singular/Plural und «keine» statt «0».
2. **«Neu in der Schweiz» je nach Angaben:** Entschieden war «Zuzug in den letzten 12 Monaten». Ein Zuzugsdatum gibt es
   im Profil nicht, darum zeigt die App die Zeile bei **jeder** Nationalität ausser Schweiz — auch nach 20 Jahren hier
   (`ChapterView.jsx` passendZiele, Kommentar dort). Entweder ein Feld «in der Schweiz seit» oder die Zeile weglassen.
3. Untertitel «Pass oder Identitätskarte»: App «Erneuern, Kosten, Verlust», Entwurf «Ablauf · 5 Schritte · Erneuern,
   Kosten, Verlust» (App nimmt den Register-Untertitel).
4. Feldnamen brechen, weil die Werte die Spalte füllen: «AHV- / Nummer», «Im / Haushalt» → gehört zum Muster (wie Wohnen 5).
5. Wie Wohnen 5, 6, 8, 9 → Muster am Schluss.

**Entschieden (Stebler Studios, 25.10.2026):** «Basis: 1 mit «allein, keine Kinder» usw. beheben, bei 2 die Zeile «Neu in der
Schweiz» weglassen, bis es ein Datum gibt. 3 so lassen.» Gebaut: Zweig `fix/f6-abnahme-basis`, Entwurfs-PR #573
(`735f3b66`) — «allein, keine Kinder» / «2 Erwachsene, 1 Kind» (5 Sprachen, rm ungeprüft) · «Neu in der Schweiz» aus
«Passend», bis es ein Feld «in der Schweiz seit» gibt. 6’782 Tests grün, Build sauber.

### Kapitel Versicherungen & Vorsorge (AA, nachgebessert) · Befunde (25.10.2026, noch nicht entschieden)

Gemessen auf `main` `97c476f3`, `#/chapter/3`, Maria. Entwurf: `seiten-v5.html?nur=aa`. Für dieses Kapitel ist bisher
nur das Kapitel-Muster gebaut (#565); die Instrumente stehen in der Übergabe als «offen, zu bauen».

**Wie entschieden gebaut:** Zusammenfassung ruhig («Sie sind bei CSS grundversichert. Franchise CHF 1’500. Eine
Pensionskasse ist hinterlegt.») · Schutzschild offen mit Listen (Pflicht 3/3, Empfohlen 2/2) · Passend: IPV prüfen,
Krankenkasse wechseln, Vorsorge-Rechner, Policen ablegen · Als Nächstes Ausbildung · «Der Schutz ist erfasst.»

**Noch nicht gebaut (Entwurf AA):**
1. **«Versicherungen pro Monat» CHF 387** mit Aufschlüsselung (KK 385, Hausrat 22/Jahr ≈ 2), Satz zu nicht erfassten
   Prämien und «Pensionskasse ist schon vom Lohn abgezogen».
2. **«Ihre KK-Last»** als Barometer 6.2 % mit Marke WHO 10 %.
3. **Franchise-Kreuz** (klein, Break-even ≈ 2’050, «bisher 420», «Eher 2’500») mit Zeile «Alles zur Franchise».
4. **Passend zuoberst «Alle Versicherungen auf einen Blick»** → Versicherungs-Übersicht. App hat stattdessen
   «Prämien-Orientierung · Modelle vergleichen». Hängt am **offenen Entscheid AB gegen `seiten-buendeln.md` Entscheid 3**.

**Abweichungen im Gebauten:**
5. **Schutzschild gross** (zwei grosse Schilde, zentriert, fast ein Bildschirm); entschieden «zwei kleine Schilde mit Listen».
6. **Spinnennetz** in den Angaben (Krankenkasse · Pensionskasse · Weitere · Hausrat & Reise · Auto · AHV, mit Satz «Zeigt,
   wie viel … eingetragen ist …») — steht nicht im Entwurf. Behalten oder weg?
7. **«Hausrat-Prämie CHF 22»** ohne «/ Jahr» — es ist eine Jahresprämie, liest sich als Monat (Entwurf: «CHF 22 / Jahr»).
8. **«Franchise 1’500»** ohne «CHF» (Entwurf «CHF 1’500»). Feldname «BVG/Pensionskasse» (Entwurf «Pensionskasse»).
9. Leere Abschnitte einzeln («Sozialversicherung · noch leer»); Entwurf fasst sie zu «Sozialversicherung · Mobilität» zusammen.
10. Beispielprofil: Haftpflicht «Versicherungssumme CHF 35» (bekannt, `liabilityAmount`), KK-Prämie 385 unter jeder Referenz.
11. Wie Wohnen 5, 6, 8, 9 → Muster am Schluss.

**Entschieden (Stebler Studios, 25.10.2026):** «Versicherungs-Übersicht als eigene Seite, wie in Runde 9 AB entschieden.
seiten-buendeln.md Entscheid 3 entsprechend nachführen.» Nachgeführt: `maloja-frontend/docs/entscheide/seiten-buendeln.md`
§4 Entscheid 3 gestrichen, neu §11 — Zweig `docs/f6-versicherungs-uebersicht`, Entwurfs-PR #574 (`b7c12dde`). Damit ist
der Widerspruch AB ↔ Entscheid 3 aufgelöst: `praemien` → Versicherungs-Übersicht, `kvg` bleibt eigene Seite (Zeile in der
Übersicht), IPV unverändert. Befunde 1–11 oben sind damit nicht entschieden, nur der Rahmen.

**Versicherungen · Schritt 1 gebaut (Stebler Studios, 25.10.2026: «bau Schritt 1: Prämien-Fundament … mit Fachprüfung»):**
Zweig `feat/f6-praemien-fundament`, Entwurfs-PR #575 (`94b88b12`). Neues Feld Haftpflicht-Prämie (CHF/Jahr) · Hausrat
und Haftpflicht zählen pro Monat zu einem Zwölftel in Kapitel, Budget, Geldfluss/Kuchen, Tankanzeige und Dashboard-Zeile ·
«Nein» → zählt nicht · Fahrzeug bewusst nicht (eigener Entscheid) · Hinweis bei Überschneidung mit «Weitere
Versicherungen», nichts still abgezogen · Jahresfelder «/ Jahr» (Befund 7 erledigt) · Maria: KK 540.30 (BAG 2026),
Hausrat 240, Haftpflicht 120, Summe 5 Mio. (Befund 10 erledigt) → bleibt neu **2’274** statt 2’459.
Fachprüfung vor und nach dem Bau: swiss-precision und copy-pruefer je 0 Blocker, Muss eingearbeitet. 6’793 Tests grün.
Offen: rm ungeprüft · KK-Prämie mit 2027 nachziehen · Befunde 5, 6, 8, 9 · Schritt 2 (Instrumente) und 3 (Übersicht).
**Beim Mergen:** #571–#575 sind unabhängig von main abgezweigt; nach jedem Merge die Tests auf `main` laufen lassen (#575 ändert Marias Zahlen, die anderen Zweige rechnen noch mit 2’459).

**Versicherungen · Schritt 2 gebaut (Stebler Studios, 25.10.2026: «Bau Schritt 2 … Versicherungen pro Monat, KK-Last, kleine
Schilde, kleines Franchise-Kreuz, Passend-Zeile zur Übersicht»):** Zweig `feat/f6-versicherungen-instrumente`, Entwurfs-PR
#576 (`558c699b`, Basis #575). Neues `VersicherungenInstrument.jsx`: Versicherungen pro Monat CHF 570 · KK-Last 8.7 % mit
WHO 10 %, IPV-Entlastung, Quelle wie KKLastCard · Schutzschild klein «Pflicht · 3/3» (Befund 5 erledigt) · Franchise-Kreuz
klein mit «Eher 2’500» und «Alles zur Franchise» · Passend zuoberst «Alle Versicherungen auf einen Blick» (Punkt 4 erledigt,
führt bis Schritt 3 auf `praemien`). swiss-precision, copy, a11y je 0 Blocker, Muss eingearbeitet. 6’810 Tests grün.
Offen: Befunde 6 (Spinnennetz), 8 (Franchise ohne CHF, «BVG/Pensionskasse»), 9 (leere Abschnitte) · Schritt 3 · rm · Prämien 2027.

### Kapitel Ausbildung & Arbeit (AC) · Befunde (25.10.2026, noch nicht entschieden)

Gemessen auf `main` `97c476f3`, `#/chapter/4`, Maria, 375 px. Entwurf: `seiten-v5.html?nur=ac`. Gebaut ist bisher nur das
Kapitel-Muster (#565); die Instrumente stehen in der Übergabe als «offen, zu bauen».

**Wie entschieden gebaut:** Kopf links · Zusammenfassung als ruhiger Satz · Reiter Angaben/Dokumente · Bildung, Arbeit,
Sprachen · Passend mit fünf Zeilen · Als Nächstes Behörden · «Der Weg ist festgehalten.»

**Noch nicht gebaut (Entwurf AC):**
1. **Zusammenfassung ergänzt** um Arbeitgeber, Dauer und Wochenstunden («… bei Kantonsspital Zürich seit 01.04.2019 (7 Jahre,
   6 Monate), 42 Std./Woche»). App: «Bachelor. Aktuell tätig als Pflegefachfrau HF.»
2. **«Wo steht Ihr Lohn?»** oben im Kapitel, wie in Finanzen (vier Abschnitte, «So ist gerechnet»). Das Bauteil gibt es
   (`LohnEinordnung`, mit #572 ruhiger); es steht heute nur in der Finanz-Auswertung.
3. **Lebenslauf-Vorschau** (Papierkarte aus den Angaben: Name, Beruf, Ort, Mail, Berufserfahrung, Ausbildung, Sprachen) mit
   «Lebenslauf erstellen ›».

**Abweichungen im Gebauten:**
4. **Werte laufen über den Kartenrand** (Abschnitt «Arbeit», 375 px): «Kantonsspital», «01.04.2019», «Schweizer/in», «42»
   ragen rechts aus der Karte. Ursache: Spalten `minmax(min-content, …)` — das lange Wort «Aufenthaltsbewilligung» plus
   «Kantonsspital» sind breiter als die Karte. Betrifft vermutlich jedes Kapitel mit langen Einzelwörtern → mit dem Muster lösen.
5. **«Aufenthaltsbewilligung: Schweizer/in»** — eine Schweizerin hat keine Aufenthaltsbewilligung; der Wert ist die
   Nationalität. Steht so auch im Entwurf. Besser: Zeile bei Schweizer Nationalität weglassen oder «nicht nötig (Schweizer/in)».
6. **Passend-Titel aus dem Register** statt Entwurf: «Lebenslauf / Lebenslauf erstellen» (Entwurf «Lebenslauf erstellen · Aus
   Ihren Angaben · als PDF»), «Neuer Job» (Entwurf «Neue Stelle»), «Stundenlohn: was steht mir zu?» (Entwurf «Stundenlohn &
   Mindestlohn»). Untertitel anders.
7. «Arbeitsstunden pro Woche 42» ohne Einheit; Entwurf in der Zusammenfassung «42 Std./Woche».
8. Wie Wohnen 5, 6, 8, 9 → Muster am Schluss.

**Entschieden und gebaut (Stebler Studios, 25.10.2026: «Bau Ausbildung 1 bis 5 … 6 bis 8 ins Muster am Schluss»):** Zweig
`feat/f6-ausbildung-instrumente`, Entwurfs-PR #577 (`2f964360`, Basis #572). Zusammenfassung mit Arbeitgeber, Dauer
(tagesgenau), Stunden · «Wo steht Ihr Lohn?» oben · Lebenslauf-Vorschau · Angaben-Spalten 3 : 2, nichts ragt mehr über den
Rand (alle 7 Kapitel, 375 px) · «nicht nötig (Schweizer Bürgerrecht)» im Kapitel und im Dossier. swiss-precision und copy je
0 Blocker, eingearbeitet. 6’795 Tests grün. Punkte 6–8 → Muster am Schluss.

### Kapitel Behörden & Rechtliches (AD) · Befunde (25.10.2026, noch nicht entschieden)

Gemessen auf `main` `97c476f3`, `#/chapter/5`, Maria, 375 px. Entwurf: `seiten-v5.html?nur=ad`. Gebaut ist bisher nur das
Kapitel-Muster (#565); die Instrumente stehen in der Übergabe als «offen, zu bauen».

**Wie entschieden gebaut:** Kopf links · Zusammenfassung als ruhiger Satz · Reiter Angaben/Dokumente · Steuern, Recht,
Vertretung · Passend mit allen sechs Zeilen (Steuern, Betreibungsauszug, Betreibung erhalten, Vorsorgeauftrag &
Patientenverfügung, Briefvorlagen, Dokumente ablegen) · Als Nächstes Notfall · «Der Stand ist dokumentiert.»

**Noch nicht gebaut (Entwurf AD):**
1. **Kasten «Folgende Stände und Fristen sind erfasst» steht noch** (Steuerfrist, Ausstehende Steuererklärungen,
   Betreibungsregister, Gerichtsverfahren, Testament) — entschieden war «Weg», er wiederholt die Angaben.
2. **Zusammenfassung ergänzt** um Steuererklärung und Betreibungsregister («… Keine offene Steuererklärung, das
   Betreibungsregister ist ohne Einträge.»). App: nur der Kanton.
3. **Steuerfrist als Kalenderblatt** (SEP · 30 · 2026) mit «Steuererklärung fällig am …», «vor … Tagen · Offene
   Steuererklärungen: 0» und «Alles zu Ihren Steuern ›».
4. **Behördengänge offen** statt der zugeklappten «Behörden-Checkliste» (▶ und ein Kästchen-Zeichen davor — dasselbe
   Kästchen-Problem wie Fix 4), mit «1 von 5 erledigt», Wegen zu Steuern / Betreibungsauszug / Ausweis und
   «Steuererklärung eingereicht» als Vorschlag, wenn «Offene Steuererklärungen 0».
5. **«Für den Fall der Fälle»:** Testament, Vorsorgeauftrag, Patientenverfügung als drei Felder mit Weg zu «Vorsorgeauftrag &
   Patientenverfügung»; «Patientenverfügung hinterlegt» fällt dann aus den Behördengängen.
6. **«Rechtliche Vertretung: nicht erfasst.»** bei leerer Vertretung.
7. **Querverweis Steuern ↔ Finanzen** (Entscheid «Steuern aufteilen», 24.10.) fehlt noch hier und bei Finanzen.

**Abweichungen im Gebauten:**
8. Passend-Untertitel aus dem Register: «Steuern · Steuerbelastung abschätzen» (Entwurf «Steuerbetrag, Abzüge, Frist
   verlängern»), «Briefvorlagen · Musterbriefe, mit den eigenen Angaben vorausgefüllt» (Entwurf «Fristverlängerung,
   Kündigung, Krankenkassenwechsel»), «Dokumente ablegen · Unterlagen · Dokumentenablage» (Entwurf nennt die Unterlagen).
9. **Beispielprofil:** Steuerfrist 30.09.2026 liegt in der Vergangenheit («vor 26 Tagen») — bekannt; Frist für Zürich mit
   Quelle setzen (Swiss-Precision-Prüfer), nicht raten.
10. «ZH-2024-123456» bricht am Bindestrich («ZH-2024- / 123456»); mit #577 (Spalten 3 : 2) nachmessen.
11. Wie Wohnen 5, 6, 8, 9 → Muster am Schluss.

**Entschieden und gebaut (Stebler Studios, 25.10.2026: «Bau Behörden 1 bis 7 und 9 (Steuerfrist für Maria mit Quelle). 8, 10,
11 ins Muster am Schluss.»):** Zweig `feat/f6-behoerden-instrumente`, Entwurfs-PR #578 (`a2089b81`, Basis main). Kasten weg ·
Zusammenfassung mit Steuererklärung und «laut Ihren Angaben» Betreibungsregister · Kalenderblatt 31.03.2027 · Behördengänge
offen, «Steuererklärung 2025 eingereicht» als gekennzeichneter Vorschlag · «Für den Fall der Fälle» · «Rechtsbeistand: nicht
erfasst.» · Querverweis Steuern ↔ Finanzen · Maria-Frist 31.03.2027 nach ZStB Nr. 133.1 (Aufforderung 2027). swiss-precision und
copy je 0 Blocker, eingearbeitet. 6’798 Tests grün. Offen: Wortlaut des ZStB-PDF vor dem Deploy nachlesen · rm.

### Kapitel Notfall (AE, ein Ort) · Befunde (25.10.2026, noch nicht entschieden)

Gemessen auf `main` `97c476f3`, `#/chapter/6`, Maria, 375 px, dazu `#/notfalleinstieg`, `#/notfallkarte`,
`#/notfallpass`, `#/notfalldossier`. Entwurf: `seiten-v5.html?nur=ae`. Gebaut ist das Kapitel-Muster (#565) und die
Weiterleitung; von den Instrumenten des Entscheids «ein Ort» noch nichts.

**Wie entschieden gebaut:** P entfällt — `#/notfalleinstieg` führt ins Kapitel (`hashRouter.js:51`, Anker
`mp-notfall-ernstfall`), die Übersichtskarte und der Lebensbaum ebenso · Kopf links mit Untertitel · Zusammenfassung als
ruhiger Satz · Reiter Angaben/Dokumente · Notfallpass mit Brotkrume über «Notfall» · Ende «Alle Kapitel durchgegangen».

**Noch nicht gebaut (Entwurf AE):**
1. **Im Ernstfall:** roter Knopf «Notfallkarte öffnen» mit «144 Sanität · 117 Polizei · 118 Feuerwehr», bleibt beim Scrollen
   stehen. App: zwei Textkarten «Im Ernstfall: was Sie am Telefon sagen» und «Notfallpass im Telefon vorbereiten».
2. **«Peter Muster anrufen»** (Telefon-Link der Notfall-Kontaktperson) fehlt.
3. **«Bereit für den Ernstfall · 19 von 20»** mit Balken, darunter nur das Fehlende zum Ausfüllen (Feld, «Speichern»,
   «Ich nehme keine»); die drei Szenarien zugeklappt. App: die drei Szenarien offen am Schluss, mit allen 28 Feldnamen.
   **Nachgezählt:** 20 stimmt (Unfall 9, Spital +6, Behördengang +5 verschiedene); bei Maria fehlt nur «Regelmässige
   Medikamente» → 19 von 20. «Ich nehme keine» braucht `naOk` am Feld `medications` (`constants.js:413`, heute ohne).
4. **«Ihre Notfall-Unterlagen»:** vier Kacheln Notfallkarte · Notfallpass · Notfall-Dossier · Karte zum Drucken mit «Alle
   entstehen aus den Angaben unten …», Druckvorschau zugeklappt. App: das Notfall-Dossier ist vom Kapitel aus nicht
   erreichbar, die Karte zum Drucken ist der Link «Notfallkarte drucken» (Kästchen-Zeichen, Übergabe-Fix 4).
5. **Vorsorge:** vier Kacheln ✓/○, «1 von 4 geregelt», offene führen zum Werkzeug («erstellen ›», «festhalten ›»). App: nur
   «Noch nicht» in den Angaben, die Wege stehen unter «Passend».
6. **Zusammenfassung** um «Blutgruppe A+, Allergie gegen Penicillin.» ergänzt. App: nur Kontaktperson und Hausarzt.
7. **Angaben zeigen das Fehlende:** «○ Regelmässige Medikamente · ergänzen ›» und «Vorerkrankungen: nicht erfasst.» App
   lässt leere Felder weg.
8. **Passend: nur «Dokumente ablegen»** mit «Patientenverfügung, Organspendekarte, Blutgruppenausweis». App: drei Zeilen
   (Patientenverfügung erstellen, Bestattungswünsche, Dokumente ablegen · «Unterlagen · Dokumentenablage»).

**Namen und Wege (Runde 5 und Start Fassung 6):**
9. **Vorlesekarte heisst noch «Notruf-Vorlesekarte»** (entschieden: «Notfallkarte»), Brotkrume nur «Übersicht» —
   `notfallkarte` fehlt in `brotkrumePfade.js`. **Notfallpass** heisst noch «Notfallpass vorbereiten». **Notfall-Dossier**
   hängt unter «Meine Unterlagen» statt unter «Notfall».
10. **Karte zum Drucken heisst noch nicht «Portemonnaie-Karte»** (Entscheid 24.10.) — weder in der App noch im Entwurf.
    Achtung: «Portemonnaie» ist im Rucksack schon der Gegenstand mit den Geld-Werkzeugen (`data/gepaeck.js:78`).
11. **Übersichtskarte** heisst noch «Notfallkarte vorbereiten · In 2 Minuten bereit», führt aber ins Kapitel. Die Suche
    nach «Notfallkarte» trifft weiterhin das Kapitel (Alias in `ansichtenRegister.js:80`) — entschieden war «nur noch Q».
12. Wie Wohnen 5, 6, 8, 9 → Muster am Schluss (Brotkrume «Übersicht › Notfall» im Kopf, «Ihre Daten bleiben auf diesem
    Gerät.» am Ende u. a.).

**Vor dem Bau prüfen (aus dem Entscheid):** Der stehende Ernstfall-Knopf darf weder Tastatur noch Anker unten verdecken ·
Telefon-Link nur bei erfasster Nummer.

**Entschieden und gebaut (Stebler Studios, 25.10.2026: «Baue Notfall 1 bis 11 … 12 kommt ins Muster am Schluss. Den Namen
Portemonnaie-Karte behalten wir.»):** Zweig `feat/f6-notfall-ein-ort`, Entwurfs-PR #579 (`31bfc004`, Basis main). Ernstfall-Knopf
direkt in der Kapitelkarte, steht (nicht beim Tippen; scroll-padding hält Fokus frei) · «… anrufen» · «Bereit 19 von 20» mit
Fehlendem zum Ausfüllen, «Ich nehme keine» (`naOk`) · vier Kacheln mit Portemonnaie-Karte · Vorsorge 1 von 4 · Zusammenfassung
mit Blutgruppe und Allergien · Fehlendes in den Angaben · Passend nur Ablage · Namen Notfallkarte/Notfallpass, Brotkrumen über
Notfall · Übersichtskarte «Bereit für den Ernstfall», Suche «Notfallkarte» nur Q. Nebenbei: Medikamente aus der Liste zählten nie
(`feldHatWert`). swiss-precision, copy, a11y je 0 Blocker, eingearbeitet. 6’801 Tests grün, Bündel 62.47 / 65 kB.
**Nachentschieden (Stebler Studios, 25.10.2026):** Die Patientenverfügung zählt in «Bereit» erst bei «Ja» → Maria 18 von 20, Spital 9 von 10
(`e3776767`). **Offen:** Fachbegriffe Patientenverfügung/Vorsorgeauftrag it/en app-weit uneinheitlich (fedlex prüfen) · «Ich nehme
keine» erscheint nicht im Dossier/QR · rm ungeprüft.

### Muster für alle Kapitel · Befunde (25.10.2026, noch nicht entschieden)

Zusammengeführt aus den sieben Abnahmen (Stebler Studios: «am Schluss für alle Kapitel»): Wohnen 5, 6, 8, 9 · Finanzen 7, 8 · Basis 3, 4 ·
Versicherungen 8, 9 · Ausbildung 6, 7 · Behörden 8, 10 · Notfall 12. Doppelte zusammengelegt; gilt jeweils für alle sieben Kapitel.

**Angaben**
M1. **Angaben als ruhige Liste statt einer Karte je Abschnitt** (Wohnen 5). Feldnamen brechen heute, weil die Werte die Spalte
    füllen («AHV- / Nummer», «Im / Haushalt», «Name Vermieter», Basis 4); «PLZ · Ort» in einer Zeile statt zwei.
M2. **Je Abschnitt «x von n erfasst» und leere Felder mit «ergänzen»** (Finanzen 8). Notfall zeigt das Fehlende seit #579
    schon (Muster dafür); die anderen Kapitel nennen nur Erfasstes.
M3. **Leere Abschnitte zusammenfassen** («Sozialversicherung · Mobilität · noch leer» statt je eine Zeile, Versicherungen 9).
M4. **Einheiten und Namen im Wert:** «CHF 1’500» statt «Franchise 1’500», «42 Std./Woche», «Pensionskasse» statt
    «BVG/Pensionskasse» (Versicherungen 8, Ausbildung 7); Kennnummern brechen nicht am Bindestrich («ZH-2024- / 123456»,
    Behörden 10).

**Kopf und Ende**
M5. **Kopf wie im Entwurf:** Landschaftsband, Brotkrume «Übersicht › Kapitel» statt «← Übersicht», Symbol in einer Kachel,
    Kopf nicht in einer eigenen Karte (Wohnen 6, Notfall 12).
M6. **«Als Nächstes» ruhig:** zentriert, leiser Umrissknopf statt gefüllter Karte mit Goldknopf und Versalien (Wohnen 9); gleich
    für «Alle Kapitel durchgegangen» (Notfall), dort zusätzlich «Ihre Daten bleiben auf diesem Gerät.» (Notfall 12).

**Passend und Farbe**
M7. **Passend-Untertitel wie im Entwurf** statt aus dem Register («Ablauf · 4 Schritte · …», «Lebenslauf erstellen · Aus Ihren
    Angaben», «Steuerbetrag, Abzüge, Frist verlängern» …; Wohnen 8, Basis 3, Ausbildung 6, Behörden 8) und die Symbole in
    einer Kachel statt klein ohne Kachel.
M8. **Eine Bereichsfarbe je Kapitel überall** — der Wohnen-Balken ist in Finanzen rose, im Kapitel Wohnen grün (Finanzen 7).

**Nicht im Muster (eigener Entscheid):** Anker unten mit Kalender und Suche (Wohnen 10 → Menü-Entscheid) · Spinnennetz
Versicherungen (Versicherungen 6 → Versicherungen Schritt 3).

**Bau-Frage:** M1–M7 ändern vor allem `ChapterView.jsx` (Abschnittsliste, Kopf, Passend, Als Nächstes) — dieselbe Datei wie die
neun offenen Entwurfs-PRs #571–#579. Auf `main` gebaut, gäbe jeder Merge danach Konflikte in allen neun.

**Entschieden (Stebler Studios, 25.10.2026):** «Bau M1 bis M8, aber erst wenn ich #571 bis #579 gemergt habe. Bis dahin: mach mit
Versicherungen Schritt 3 weiter.»

**Gebaut (25.10.2026, nach allen Merges; Stebler Studios: «Ja, bau jetzt das Muster M1–M8 auf main»):** Zweig `feat/f6-muster-m1-m8`,
Entwurfs-PR #581 (`f21a866f`, Basis main `a1c516e9`). Eine Angabenliste mit «x von n», Wichtiges «ergänzen ›», Rest «Nicht erfasst: …»,
leere Abschnitte in einer Zeile · CHF/Std./Woche/«Pensionskasse», Nummern am Stück (CSS) · Kopf mit Band, Brotkrume, Kachel, **keine
Karte, Seite nicht mehr getönt** (löst 27.09.2026 ab) · Als Nächstes ruhig · Passend wie im Entwurf (auch Basis — M7 nennt Basis 3) ·
Wohnen/Versicherungen in Balken, Kuchen, Geldfluss in der Bereichsfarbe. Spalten 3 : 2 (#572) ersetzt: Telefonnummern brachen.
Fachprüfung: swiss-precision 0 Blocker / 3 Muss (Aufenthaltstyp zur Adresse, Mietzins «nur in einzelnen Kantonen und Gemeinden»,
IPV «je nach Einkommen und Kanton»), copy 0/1, a11y 0 — alles eingearbeitet. 6’915 Tests grün, Bündel 63.28 / 65 kB.
**Offen:** rm · `naOk` für oft unzutreffende Felder · `ahvContribution` ohne `jahr` · `PremiumSubsidy.jsx:88` Wochenaufenthalt-Werte.

### Versicherungs-Übersicht (AB) · Abgleich für Schritt 3 (25.10.2026, noch nicht entschieden)

Gemessen auf dem Stand von #576 (`558c699b`, enthält Schritt 1 und 2), `#/praemien`, Maria, 375 px. Entwurf: `seiten-v5.html?nur=ab`.
Die Seite ist heute die «Prämien-Orientierung» (`PraemienOrientierung.jsx`, 470 Zeilen): alles offen untereinander, rund
neun Bildschirme. Zahlen im Entwurf sind vor #575 (CHF 387, 6.2 %); heute rechnet die App CHF 570 und 8.7 %.

**Noch nicht gebaut (Entwurf AB):**
1. **Name und Weg:** «Versicherungs-Übersicht» mit Satz «Ihre Versicherungen auf einen Blick — basierend auf Ihren Eingaben.»,
   Brotkrume «Übersicht › Versicherungen & Vorsorge › Versicherungs-Übersicht» (heute «← Übersicht»); Titel in Menü, Suche,
   Register in fünf Sprachen; `#/praemien` bleibt als Adresse.
2. **Marken oben:** «CSS · Standard» · «Franchise 1’500» · «Prämienregion Zürich 1». Heute: PLZ-Feld und Prämienregion-Kasten.
3. **«Versicherungen pro Monat» mit KK-Last** (wie im Kapitel, #576) und «Was darin steckt» aufklappbar. Heute: grosse
   KK-Last-Karte mit drei Absätzen.
4. **Zeilen mit Wert, je zum Werkzeug** — fehlen heute ganz:
   Franchise «Eher 2’500» (Break-even, Ersparnis) · Krankenkasse wechseln «Kündigung bis 30.11.2026» · Prämienverbilligung
   «Kein Anspruch» mit Pegel · Gesundheitskosten (KVG) mit Betrag · KVG-Leistungen · Vorsorge «PK-Guthaben».
5. **Schutzschild sichtbar** (Pflicht 3/3, Empfohlen 2/2) — heute nicht auf der Seite.
6. **Aufklappbar statt offen:** Franchise-Kreuz (ganz, mit Reserve-Satz) · Prämie regional · Prämienvergleich und Unfalldeckung
   (mit Referenz je Franchise) · Alle Kassen (Entwurf: Top 5 + «alle anzeigen»; heute alle 28 offen).
7. **Zusatzversicherung wechseln und KK-Scanner als Zeilen** — heute nicht da.
8. **Unfalldeckung-Hinweis** («als Angestellte sparen») steht heute als eigene Karte oben; im Entwurf in «Prämienvergleich und
   Unfalldeckung».
9. **Schlusssatz** «Alle Werte sind Orientierungshilfen. Für verbindliche Auskünfte …» fehlt.

**Zu entscheiden mit:**
10. **Spinnennetz im Kapitel** (Versicherungen 6, offen): behalten, weg, oder hierher in die Übersicht?

**Bau-Frage:** Schritt 3 braucht «Versicherungen pro Monat» und die Prämien aus #575/#576 — Zweig darum auf #576 gestapelt
(`feat/f6-versicherungs-uebersicht`, Basis `feat/f6-versicherungen-instrumente`), wie #576 auf #575.

**Entschieden und gebaut (Stebler Studios, 25.10.2026: «Baue Versicherungs-Übersicht 1 bis 9, gestapelt auf #576 … Das Spinnennetz
bleibt im Kapitel.»):** Zweig `feat/f6-versicherungs-uebersicht`, Entwurfs-PR #580 (`ea8ad89f`, Basis #576). Name und Brotkrume
über das Kapitel · Marken · Versicherungen pro Monat + KK-Last, Posten zugeklappt · Zeilen mit Wert (Franchise mit
Polster-Vorbehalt, «Eingang bei der Kasse bis 30.11.2026», IPV über `ipvAbzug`, Gesundheitskosten wie das Kreuz, KVG-Leistungen,
Guthaben laut PK-Ausweis) · Schutzschild · vier Teile aufklappbar (Kassen: 5, dann alle) · Zusatz-Wechsel, KK-Scanner ·
Schlusssatz. Pegel bewusst nicht (misst anderes Einkommen als ZH/BE). swiss-precision 1 Blocker (IPV-Betrag trotz Frist/Gesuch),
copy und a11y 0 — alles eingearbeitet. 6’824 Tests grün, Bündel 63.32 / 65 kB.
**Offen:** ordentliche Kündigung 30.6. (Kann) · Fristen-Wortlaut KVG Art. 7 / KVV Art. 94 gegen fedlex · rm.

### Spinnennetz Versicherungen · offene Frage (25.10.2026)

Stebler Studios zu #580: «Das Spinnennetz bleibt im Kapitel.» — danach: «wohin wollen wir mit dem Netz ist die Frage oder nicht?» Ja:
«bleibt» gilt vorläufig, beantwortet aber nicht, **wofür** es da ist. Stand: steht in den Angaben des Kapitels Versicherungen
(Krankenkasse · Pensionskasse · Weitere · Hausrat & Reise · Auto · AHV, «Zeigt, wie viel … eingetragen ist»), in keinem Entwurf
(weder AA noch AB), nicht in der Übersicht. Es zeigt Vollständigkeit — dasselbe, was Muster M2 («x von n erfasst» je Abschnitt)
leisten wird. **Zu entscheiden:** behalten (wo, wozu), in die Übersicht, oder weg, sobald M2 gebaut ist.

---

## Fassung 7 · Rundgang 27.10.2026 · erste Entscheide (Sophie, 27.10.2026, 02:42)

Grundlage: `docs/design/fassung-7-2026-10-27/BEFUNDE.md` und die Vergleichsseite (Artifact «Fassung 7 Rundgang»).
Sophie hat 25 von 71 Punkten gewählt und die Liste aus der Seite in den Chat gelegt. Die übrigen 46 sind **noch offen**,
nicht abgelehnt.

**Ja (10):**
- F7-K2-3 — eine Brutto-Schätzung statt zwei (6’796 / 6’472): nachrechnen, welche gilt.
- F7-K2-4 — Dashboard übernimmt das IPV-Ergebnis aus dem Kapitel Finanzen.
- F7-K2-6 — Branchenvergleich: eigene Branche hervorheben, Rest aufklappbar.
- F7-K3-3 — Franchise-Kreuz zeigt die eigene Franchise als Punkt.
- F7-L5 — Gruppe A (Ansprüche) wieder aufnehmen.
- F7-L6 — §11 Versicherungs-Übersicht als eigene Seite bauen.
- F7-L7 — Budget-Import ins Monatsbudget (§2 I).
- F7-L10 — Merkliste als Reiter in «Was ansteht».
- F7-L11 — Aufräumen: Rucksack-Doppel, Links auf umgeleitete Adressen, tote `FinanzUebersicht.jsx`.
- F7-L12 — Titel für den Anspruch-Check, Brotkrume für Notfall- und Behörden-Dossier.

**Besprechen (15):** F7-K3-1 · F7-K3-2 · F7-K3-4 · F7-K4-1 · F7-K4-2 · F7-K5-1 · F7-K5-2 · F7-K6-1 · F7-K6-2 ·
F7-L1 · F7-L2 · F7-L3 · F7-L4 · F7-L8 · F7-L9

**Noch nicht gewählt:** alle F7-D (Dashboard), F7-K0, F7-K1 (u. a. Mietbarometer-Fehler), F7-K2-1/-2/-5, F7-K3-6
(Spinnennetz), alle F7-A (Abläufe, u. a. W bauen), alle F7-R (Rechner, u. a. X bauen), alle F7-S (u. a. Lebensmappe
ohne Behörden).

**Nichts gebaut.**

### Stand 2 der Entscheide (Sophie, 27.10.2026, 02:54)

Zweite Liste aus der Vergleichsseite, ersetzt die Zählung von Stand 1 (Stand 1 bleibt als Beleg oben stehen).
61 von 71 Punkten gewählt: **39 Ja · 1 Nein · 21 Besprechen**.
Besprechen erst, wenn alle Punkte gewählt sind (Sophie: «wir wollen warten mit dem besprechen bis wir alle ja und nein s haben»).

**Ja:** F7-K1-1 · F7-K1-2 · F7-K1-3 · F7-K2-3 · F7-K2-4 · F7-K2-5 · F7-K2-6 · F7-K3-3 · F7-L5 · F7-L6 · F7-L7 · F7-L10 · F7-L11 · F7-L12 · F7-A1 · F7-A2 · F7-A3 · F7-A4 · F7-A5 · F7-A6 · F7-A7 · F7-A9 · F7-A10 · F7-A11 · F7-A12 · F7-R1 · F7-R3 · F7-R4 · F7-R6 · F7-S1 · F7-S2 · F7-S3 · F7-S4 · F7-S6 · F7-S7 · F7-S8 · F7-S9 · F7-S10 · F7-S12

**Nein:** F7-K0-2 (Basis bleibt ohne Instrument)

**Besprechen:** F7-K2-1 · F7-K2-2 · F7-K3-6 · F7-K3-1 · F7-K3-2 · F7-K3-4 · F7-K4-1 · F7-K4-2 · F7-K5-1 · F7-K5-2 · F7-K6-1 · F7-K6-2 · F7-L1 · F7-L2 · F7-L3 · F7-L4 · F7-L8 · F7-L9 · F7-R2 · F7-R5 · F7-S5

**Noch nicht gewählt:** F7-D1 · F7-D2 · F7-D3 · F7-D4 · F7-D5 · F7-D6 · F7-D7 · F7-D8 · F7-D9 · F7-D10

**Nichts gebaut.**

### Baustand der «Ja» (27.10.2026, 03:51)

Sophie: «alle ja darfst du gerne mal erledigen». Je Paket ein Zweig und ein **Entwurfs-PR**, nichts gemergt.
Zusammen geprüft (Probe aus main + #626 + #627 + #628): 7’248 Tests grün, `size-limit` 64.54 kB von 65 kB.

| Paket | PR | Punkte |
|---|---|---|
| 1 · sichtbare Fehler | #626 | F7-K1-1, K1-2, K1-3, K2-3, K2-4, K3-3, S1, S6, S7, S8, L12, S12 |
| 2 · Namen und Aufräumen | #627 | F7-R1, S3, S4, S9, L11 |
| 3 · Kapitel Finanzen | #628 | F7-K2-5, K2-6 |
| 4 · Ablauf-Schale W | – | F7-A1, A4, A5, A6, A7, A9, A10, A11 — offen |
| 5 · Rechner-Form X | – | F7-A2, R3, R4, R6 — offen |
| 6 · «Was steht mir zu?» O | – | F7-A3, L5 — offen |
| 7 · Versicherungs-Übersicht §11 | – | F7-L6 — offen |
| 8 · Budget, Merkliste, Dossiers | – | F7-L7, L10, S2, S10 — offen |

**Fehlbefunde, nichts gebaut:** F7-A12 und F7-D8 — die Deko-Schrift («HELVETIA», «Fr», «5 FR. 2026») steckt in
Icons mit `aria-hidden`; ein Bildschirmleser liest sie nicht. Der Rundgang hatte mit `innerText` gemessen.
Im Browser nachgeprüft (Pensionierung, Einbürgerung, Betreibungsauszug).

**Teilweise anders als im Befund:** F7-K2-3 war kein Rechenfehler (CHF 6’472 = Brutto 6’796 auf 40 Std.) — gebaut
ist die sichtbare Beschriftung. F7-L12: die Dossiers hatten schon Brotkrumen; ergänzt ist «Zurück zu …».
F7-L11: `FinanzUebersicht.jsx` bleibt (sechs Tests prüfen über sie), Links auf `finanzuebersicht` bleiben (Umleitung).
F7-S12: nur «kostenlos, auch mit leerem Guthaben» belegt (FDV Art. 27 Abs. 2); die SIM-Aussage ist raus.

### Baustand der «Ja», alle acht Pakete (27.10.2026, 12:07)

| Paket | PR | Stand |
|---|---|---|
| 1 · sichtbare Fehler | #626 | Entwurf |
| 2 · Namen und Aufräumen | #627 | Entwurf |
| 3 · Kapitel Finanzen | #628 | Entwurf |
| 4 · Ablauf-Schale W (A1, A4–A7, A9–A11) | #633 | Entwurf |
| 5 · Rechner-Form X, alle zehn (A2, R3, R4, R6) | #631 | Entwurf |
| 6 · «Was steht mir zu?» O + Gruppe A (A3, L5) | #630 | Entwurf |
| 7 · Versicherungs-Übersicht §11 (L6) | #629 | Entwurf — war schon gebaut (#580, #601), nur Wächter-Test + Doku |
| 8 · Budget, Merkliste, Dossiers, Rückweg (L7, L10, S2, S10) | #632 | Entwurf |

**Probe aller Zweige auf main:** 1, 2, 3, 7, 6, 5 führen sich konfliktfrei zusammen (7’370 Tests grün, `size-limit`
**64.67 kB von 65 kB**). 8 und 4 haben dann Konflikte in den Sprachdateien, `main.jsx`, `hashRouter.js`, Registern und
Wächter-Tests — alle erweitern dieselben Listen. Vorschlag: in dieser Reihenfolge mergen und 8 und 4 vor ihrem Merge
auf das neue main nachziehen. **Grösse:** 0.33 kB Luft vor 8 und 4 — vor dem Merge der letzten zwei prüfen, ggf. Teile
aus dem Startbündel nachladen.

**Weitere Fehlbefunde aus dem Rundgang:** F7-L6 (§11 war gebaut, das Entscheidungsblatt sagte «Noch nichts gebaut»),
F7-A7 (Verweise an der Gabelung bestanden schon).

**Für die Fachprüfung (#630):** Sozialhilfe-Pegel sagt bei Maria «Vermögen über dem Freibetrag», obwohl das Einkommen den
Bedarf deckt — Reihenfolge in `src/data/pegel.js` (alt, schon im Schnellcheck).

### Besprechen, Runde 1 (Sophie, 27.10.2026, Seite «Fassung 7 Besprechen»)

Quelle: `docs/design/fassung-7-2026-10-27/besprechen.html` (Artifact «Fassung 7 Besprechen»), je Punkt «wie empfohlen»,
«anders» oder «später». 11 von 31 Punkten gewählt. **Nichts gebaut.**

**Wie empfohlen (9):**
- F7-K3-6 — Das Spinnennetz fällt weg. Das Netz-Schild (Prototyp `_werkbank/versicherung-schild-2026-10-27/`) ersetzt
  Netz und Schutzschild als ein Bild, vorher in Maloja-Tönen nachgezeichnet. Vor dem Bau offen: welche Bereiche zwei
  Stufen haben (Vorsorge: BVG + 3a?), ob «Leben» oben in die Mitte gehört.
- F7-K4-2 — Maria bleibt beim Bachelor (ZHAW); Berufsbezeichnung «Pflegefachfrau HF» → «Pflegefachfrau FH» (`demoData.js`).
- F7-K5-2 — Vorsorge ganz in den Notfall; in Behörden bleibt das Testament mit Verweis.
- F7-K6-1 — Patientenverfügung im Notfall nur im Block «Vorsorge»; «Bereit» verlinkt dorthin, nicht mehr in den Angaben.
- F7-L1 — Nach dem Merge Seiten ohne Eingang nachzählen; Organspende unter «Passend» bei Notfall › Vorsorge, falls nötig.
- F7-L2 — Nach dem Merge Sackgassen nachzählen; jede verbliebene Seite bekommt «Als Nächstes».
- F7-L3 — Familie als Abschnitt in Persönliche Basis, kein achtes Kapitel. Abläufe hängen dort unter «Passend».
- F7-R2 — Sozialhilfe-Seite zeigt nur Sozialhilfe; IPV und EL je eine Zeile mit Link auf «Was steht mir zu?».
- F7-R5 — Lebenslauf-Generator wird die Vorschau aus dem Kapitel plus «Als PDF drucken»; «JSON (ATS)» klein unter
  «Weitere Formate».

**Anders (2):**
- F7-L8 — Ja zum Bündeln: Steuer-Import in den Steuer-Rechner (§2 I), Doppel (Kantonssteuer, Säule 3a) zusammenlegen.
  **Nicht** wie vorgeschlagen beim Import: Sophie: «das müssen wir geschickter lösen». Offen: wie der Import ins
  Rechner-Bild kommt, ohne das Startbündel zu belasten — Vorschlag von Claude ausstehend.
- F7-K6-2 — Maria bekommt einen Medikamenten-Eintrag, damit das Feld im Beispiel gefüllt ist. Gezeigt werden soll, dass
  die App zu einem Medikament weiterführende Information zeigt; Sophie nennt PubMed, TARDOC und «vielleicht der Preis».
  **Offen, vor dem Bau klären:** Die App verlinkt heute schon auf compendium.ch (`MedicationManager.jsx`).
  PubMed ist Fachliteratur, keine Patienteninformation; TARDOC ist der Arzttarif und enthält keine Medikamentenpreise —
  die stehen in der Spezialitätenliste des BAG. Ein Preis in der App wäre ein Datenbestand, der gepflegt werden muss.

**Noch nicht gewählt (20):** F7-D1–D10 · F7-L4 · F7-K2-1 · F7-S5 · F7-K3-4 · F7-K3-1 · F7-K3-2 · F7-K2-2 · F7-K4-1 ·
F7-L9 · F7-K5-1

**F7-K6-2 geklärt (Sophie, 27.10.2026):** Compendium-Link wie heute, dazu der Preis aus der BAG-Spezialitätenliste.
Zuerst zeigen, wie der Preis aktuell bleibt. Vorschlag von Claude (noch nicht entschieden), Belege BAG-Seite «Elektronische
Plattform Leistungen (ePL)», gelesen 27.10.2026: SL unter sl.bag.admin.ch, ohne Login; Excel- und FHIR-Dateien «jeweils am
ersten eines Monats»; alte Liste leitet seit 01.06.2026 um; API für Software-Anbieter angekündigt, noch nicht offen.
1. Von Hand wie bei den Prämien: Excel-Datei ablegen in `src/data/raw/`, Skript `scripts/build-sl-preise.mjs` holt nur die
   rund 100 Medikamente aus `medicationData.js` heraus → `src/data/medikamentPreise.js` mit Stand und Quelle.
2. Nachgeladen nur im Medikamenten-Teil, nicht im Startbündel. Die App holt zur Laufzeit nichts aus dem Netz.
3. Takt: vierteljährlich und beim Werte-Wechsel im Dezember; `/maloja-predeploy` warnt, wenn der Stand älter als 4 Monate ist.
4. Anzeige: «Publikumspreis laut Spezialitätenliste, Stand …», nicht «Sie zahlen»; ohne Treffer kein Preis, nur Compendium.
5. Vor dem Bau: swiss-precision-pruefer zu Publikumspreis vs. Selbstbehalt und zum Satz bei Medikamenten ausserhalb der SL.

**F7-K6-2 entschieden (Sophie, 27.10.2026):** «Ja, Preis so nachführen wie vorgeschlagen — von Hand je Quartal, Skript,
Stand sichtbar, Warnung im Predeploy.» Punkte 1–5 oben gelten. Zusammen mit: Maria bekommt einen Medikamenten-Eintrag.
