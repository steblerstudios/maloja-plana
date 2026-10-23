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
