# Übergabe · Fassung 5 (seiten-v5.html) · 23.10.2026, 13:25

Die Sitzung, die Fassung 5 baute, hatte ihr Kontextfeld voll. `seiten-v5.html` lag nur in
ihrem Scratchpad (Stand 13:19) und ist hierher kopiert (byte-gleich geprüft mit `cmp`).
**Nicht committet.**

## Auftrag
Die 34 Lücken aus `VERGLEICH.md` / `vergleich-inventar.json` in Fassung 5 schliessen, in dieser
Reihenfolge: Übersicht · IPV-Rechner · Umzug · Kapitel · Merkliste und Kalender · Menü · Ablage.
Regel: die Mockups tragen die **echten Sätze aus den Sprachdateien** der App, keine gekürzten
oder erfundenen.

## Erledigt (laut Verlauf der alten Sitzung, im Browser nicht nachgeprüft)
- Übersicht: alle zehn fehlenden Teile drin. Leitsatz unter der Startbildschirm-Karte und
  Umbruch bei «Weiter ›» korrigiert.
- IPV-Rechner: gleiche Logik wie die App. CHF 6'200 netto/Monat → CHF 74'400/Jahr →
  «Nicht berechtigt». Es gibt keinen erfundenen Grenzwert.
- Umzug: alle vier Schritte. Die Erfassung hat **acht** Stellen mit Namen, nicht sechs
  (Arbeitgeber und Steueramt waren anders eingebettet).

## Nachtrag 23.10.2026, 13:48 — fertig (andere Sitzung, nach der Übergabe)
Alles, was unten unter «Offen» steht, ist erledigt und im Browser geprüft (390 px, Sie und Du,
Konsole ohne Fehler):
- Umzug: «Gemeinde» steht links unter der Kehre, «Kündigen» links vom Strassenende. Nachgemessen:
  keine Beschriftung berührt die 14 px breite Strasse. Das Band in «Was ansteht» heisst jetzt
  «Schritt 2 von 4».
- Kapitel: echter Untertitel und Einleitung, Zusammenfassungszeile, IPV-Hinweis (finanzen.*,
  contextIpv).
- Ablage: Reiter «Aktiv / Archiv» mit Zahl, «Sortieren nach» mit drei Optionen, Ordner-Satz nach
  `DocumentTresor.jsx`.
- Merkliste: Eingabe, «Verknüpfen mit» (12 Ziele aus `LINK_TARGETS`), «Hinzufügen», abhaken,
  «Zu erledigen / Erledigt», Leer-Zustand im Wortlaut.
- Kalender («Was ansteht»): Monat ‹ › über den Jahreswechsel, Monatsknöpfe, «Heute»,
  «Bevorstehend / Erledigt», abhaken, «+ Erinnerung hinzufügen», Hinweis. Platzhalter sind nur
  die Formular-Beschriftungen «Titel» und «Datum».
- Menü: «63% vollständig», «Auf den Startbildschirm legen», Gruppen Alltag / Absicherung /
  Schutz, Steuern, Finanz-Übersicht, Lebenssituationen, «Alle Werkzeuge im Gepäck ›».

Nicht gemacht: die Gegenprobe aller 34 Lücken Zeile für Zeile gegen `vergleich-inventar.json`
mit einem Skript. Geprüft wurde nur von Hand, Seite für Seite.

## Offen (Stand der Übergabe, 13:25)
1. Umzug: Das Feld «Strasse» überdeckt die Beschriftung «Gemeinde» leicht.
2. Kapitel
3. Merkliste und Kalender (Vorlage: `heute-merkliste.jpg`, `heute-kalender.jpg`)
4. Menü (Vorlage: `heute-menue.jpg`)
5. Ablage
6. Am Ende: alle 34 Lücken gegen `vergleich-inventar.json` abhaken, dann committen.
   Nicht pushen.

## Nachtrag 23.10.2026, 15:07 — Seite für Seite durchgegangen

Mit Sophie gemeinsam, heute neben Fassung 5 (`vergleich-v5.html`). Jeder Text gegen `de.js` und den
App-Code geprüft, Entscheide umgesetzt und in `VERGLEICH.md` festgehalten (je ein Block pro Seite).

**Entschieden und umgesetzt:** Ablauf Umzug · Dokumentenablage · Merkliste · Kalender («Was ansteht»)
· Menü · Rechner IPV · Kapitel Finanzen. Dazu: Merkliste und Kalender sind verknüpft (To-dos mit Tag,
Erledigtes im Kalender, Fach «Noch ohne Tag»); neue Icons für Was ansteht, Ablage, Merkliste.

**Offen — als Nächstes:** die **Übersicht** (Sophie: «machen wir später»). Befunde stehen in
`VERGLEICH.md` unter «Übersicht · Befunde beim Durchgehen»: 63 % gegen 70 %, der erfundene Satz
«Am meisten offen: …» und der Kartentitel «Ihr Lebensordner», dazu die vier «anders»-Punkte.

**Vor dem Bau festzulegen** (steht je in den Notizen unter den Mockups): Zuordnung Werkzeug → Bereich
(Merkliste) und Kategorie → Bereich (Kalender); neue Texte gehen an den Copy-Prüfer; gemeinsames
Datenfeld «Tag» am Merkpunkt; «Alle Kantone vergleichen» (heute 0 von 26 Kantonen belegt).

**Ansehen:** Vorschau-Server `stardust-mockup` (Port 5447) zeigt diesen Ordner.
