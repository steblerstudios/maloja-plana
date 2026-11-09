# Metaphern-Ansichten · Gesamtkonzept (November 2026)

> **Stand:** 09.11.2026, in Arbeit. Entscheide von Stebler Studios, Fragen einzeln gestellt.
> **Anlass:** Bevor weitere Zeichen für die Rucksack-Gegenstände entstehen, klären wir, wofür
> jede Ansicht da ist. Herkunft: [Icon-Besprechung](icon-besprechung-2026-11.md) und
> [Rucksack: Konzept und Logik](rucksack-konzept-2026-11.html) (K1–K4, R1–R7).
> **Gebaut wird hier nichts.**

## 1 · Bestand (erhoben 09.11.2026 aus dem Code und den Entscheiden)

| | Ansicht | Wo | Was sie misst |
|---|---|---|---|
| A | Übersicht (Berg, «Was ist jetzt dran?») | Startseite | Kreise: begonnen · abgeschlossen · Prozent, aus dem **Ausfüllstand** der Kapitel |
| B | Rucksack (`gepaeck`) | Leiste, Menü, Übersicht (5 Eingänge) | 4 Punkte je Gegenstand = **ausgefüllte Datenfelder** (`data/gepaeck.js`) |
| C | Lebensbaum | seit 24.10. im Kapitel Finanzen | Äste wachsen mit dem **Ausfüllstand** je Kapitel |
| D | Obstgarten | nur über einen Link auf der Übersicht | Bäumchen reifen mit dem **Ausfüllstand** je Kapitel |
| E | «Was steht mir zu?» = Leistungskompass | eigene Seite (seit 27.09. / 27.10. eine Seite) | nichts; zeigt Ansprüche und eine Richtung |
| F | Schrebergarten | nicht gebaut | geparkt seit 13.07. (Freunde sehen einander; Konflikt mit local-first und «nicht social») |
| G | Sieben Kapitel | Menü | hier trägt man Daten ein |

**Befunde**

- **Vier Ansichten zeigen dieselbe Zahl.** A, B, C und D messen alle ausgefüllte Felder.
- **Das widerspricht dem Entscheid vom 01.11.2026** («gemessen wird Erledigtes», `grundstueck-und-modi.md`).
- **C und D sind zweimal der Baum.** Die Frage «Baum oder Obstgarten» ist seit Juli offen (`IDEEN.md` §2).
- **B und E trennt eine Grenze, die nirgends steht:** B führt **Ereignisse** (passiert einmal, hat
  einen Ablauf: Umzug, Heirat, Todesfall). E führt **Zustände** (dauert an, kann Geld auslösen:
  alleinerziehend, arbeitslos).

## 2 · Entscheide

### Frage 1 · Wofür ist der Rucksack da? — ✅ 09.11.2026

**Der Rucksack ist der Weg «Was passiert mir gerade?»**: Lebensereignisse und die Werkzeuge dafür.
Die Kapitel bleiben der Weg «nach Amt». «Was steht mir zu?» ist der **Leistungskompass**, der Weg
«was dauert an, was bringt Geld?». (Stebler Studios: «ok», dazu der Hinweis, dass E der
Leistungskompass ist.)

### Frage 2 · Wie verhalten sich die Ansichten? — ✅ 09.11.2026, als Anfang

Stebler Studios: «guter anfang denke ich sicher». Der Rahmen gilt; die Einzelheiten von Hütte,
Garten und Nachbarn werden erst beim Bau der Haut ausgearbeitet (nach Fassung 7/8, wie am 01.11.).
Angestossen hat ihn Stebler Studios selbst (E ist der Leistungskompass, der Lebensbaum wird
Finanzbaum, der Schrebergarten ist das eigene Haus verbessern plus Freunde, «hässlich wird schön»):

- **Kern, immer da:** A Übersicht · G Kapitel · B Rucksack · E Leistungskompass · **C wird Finanzbaum**
  (bleibt im Kapitel Finanzen; fünf von sechs Früchten sind schon Geld; eine Tal-Strasse auf der
  Übersicht ist seit 27.09. dafür reserviert).
- **Haut zum Einschalten: F Schrebergarten** = die Gamification vom 01.11. Eine verwilderte Hütte
  wird durch echte Handlungen aufgeräumter («hässlich wird schön», Muster Reclaim City).
  **D Obstgarten wird der Garten darin.** Nachbarn (Freunde) bleiben geparkt, bis es einen Weg
  ohne Server gibt.
- Grundsatz bleibt: **schöner heisst aufgeräumter, nie reicher**; nie Vergleich mit anderen.
- **Wer ist welcher Weg hinein:**

  | Frage der Nutzenden | Ansicht |
  |---|---|
  | Was ist als Nächstes dran? | A Übersicht |
  | Welches Amt, welches Thema? | G Kapitel |
  | Was passiert mir gerade? (Ereignis) | B Rucksack |
  | Was dauert an, was steht mir zu? (Zustand) | E Leistungskompass |
  | Wie geordnet sind meine Finanzen? | C Finanzbaum, im Kapitel Finanzen |
  | (zum Einschalten) Wie sieht mein Ort aus? | F Schrebergarten mit D Obstgarten |

- **Was wegfällt:** der Obstgarten als eigene Seite (`#/obstgarten`) und sein Link auf der
  Übersicht. Er lebt als Garten im Schrebergarten weiter. Bis die Haut gebaut ist, bleibt er,
  wie er ist; abgebaut wird erst mit dem Bau, auf Zuruf.

### Frage 3 · Was zählt als Fortschritt? — ✅ 09.11.2026

**Überall eine Zahl: die erledigten Wege.** Gilt für den Rucksack («2 von 12 Wegen fertig» statt
vier Punkten), die Kreise auf der Übersicht, den Finanzbaum (wächst mit fertigen Finanz-Wegen)
und die Hütte (aufgeräumter mit jedem fertigen Weg). Der Ausfüllstand der Daten bleibt nur im
Kapitel selbst, als «noch offen: …». Damit gilt der Entscheid vom 01.11. («gemessen wird
Erledigtes») endlich auch im Kern.

**Belegt:** der Stand je Weg ist schon gespeichert. `utils/ablaufStand.js` hält
`{ schritt, fertig }` je Ablauf unter einem `or5_`-Schlüssel; gut 40 Abläufe nutzen ihn
(Umzug, Heirat, Todesfall, Stelle verloren …). Das Konzeptbild (K3 B) nahm noch an, es brauche
einen neuen Speicher. Nicht geprüft: ob **jeder** Weg im Rucksack einen solchen Stand schreibt.
Das ist der erste Schritt beim Bau.

Leitplanken bleiben (`grundstueck-und-modi.md` §0): nie Vergleich mit anderen, keine Serien,
keine Scham bei wenig Fortschritt, «Weiter» bei reinen Info-Schritten zählt nicht als Leistung.

### Frage 4 · Passen die Fächer? — ✅ 09.11.2026

**Sieben Gegenstände bleiben, der Inhalt wird nachgeschärft.** Kein Pass-Etui.

### Frage 5 · Die drei Tal-Strassen im Bergpanorama — ✅ 09.11.2026

Vorschlag von Stebler Studios: «so wie wir den rucksack zeigen oben in den bergen auf den anderen
beiden wegen den finanz baaum als icon und der leistungs kompass».

**Die drei Zugänge, die keine Kapitel sind, stehen nebeneinander im Tal:**

| Strasse | Zeichen | führt zu | Stand |
|---|---|---|---|
| links `{ x: 822, y: 560 }` | Rucksack | B Rucksack | steht seit 27.09. |
| Mitte `{ x: 927, y: 555 }` | **Finanzbaum** | C, Kapitel Finanzen, Auswertung | neu |
| rechts `{ x: 1003, y: 580 }` | **Leistungskompass** | E «Was steht mir zu?» | neu |

Die Reihenfolge folgt dem Kommentar vom 27.09. (`BergLandschaft.jsx`: «zuerst der Wanderrucksack,
später der Finanzbaum, das dritte ist offen»); die Plätze sind dort schon ausgemessen. Damit hat
jede Kern-Ansicht ausser der Übersicht selbst ein Zeichen auf dem Berg: Kapitel auf der
Passstrasse, die drei anderen Wege im Tal.

**Für den Bau zu beachten (nicht gebaut):**
- **Nur am Computer.** Am Handy liegt das Tal ausserhalb des Ausschnitts. Dort steht der Kompass
  schon in der unteren Leiste (Platz «Anspruch»), allerdings mit dem Zeichen `gift`, nicht mit dem
  Kompass. Der Finanzbaum hat am Handy keinen Platz und bleibt dort über das Kapitel Finanzen
  erreichbar.
- **Zeichen:** `components/miniKompass.js` gibt es schon (32 px, Gegenstück zum Mini-Rucksack).
  Ein **Mini-Finanzbaum** fehlt und muss gezeichnet werden.
- **Startbündel:** Dashboard und Panorama liegen im Startbündel (Grenze 65 kB, war im November
  zeitweise auf 2 Bytes ausgeschöpft). Vor dem Bau messen; nachladen statt die Grenze anheben.
- Wie beim Rucksack: kein Fortschrittsring an diesen drei Zeichen. Es sind Zugänge, keine Stationen.

**Zeichen, ✅ 09.11.2026** (Skizze im Gespräch, drei Varianten A Baum + Aprikose · B Baum + Münze ·
C Baum mit Ästen): Stebler Studios wählt **C · Baum mit Ästen**, wie im Lebensbaum. Empfohlen war A;
B fiel weg, weil eine Münze am Baum «Geld wächst» heisst (Grundsatz «nie reicher»).
Form wie die Tal-Zeichen heute (`rucksackZeichen`): Linie auf 24 × 24, Strich 1,9, `currentColor`,
17 px im Kreis. Skizze: Stamm `M12 21V8`, Äste `M12 13l-4.5-4` · `M12 10.5l4-3.5` · `M12 16l3.5-2.5`,
Boden `M8 21h8`, an jedem Astende ein Blattpunkt r 1,5.
Der **Kompass** bekommt fürs Tal eine Linienfassung im selben Stil (Kreis r 8, Nadel als Raute,
Mittelpunkt); `miniKompass.js` bleibt an seinem Ort. 🛑 **Nicht am Pixel geprüft:** beim Bau C in
echter Grösse im Panorama ansehen (hell und dunkel, 3:1); wirkt er unruhig, Äste ausdünnen, nicht
die Variante wechseln.

## 3 · Was daraus für die Rucksack-Gegenstände folgt

| Gegenstand | Fach (neu) | Änderung am Inhalt | Zeichen |
|---|---|---|---|
| Schlüsselbund | **Ankommen, Wohnen & Papiere** | Name nachgeführt (passt zur Gruppe «Ankommen in der Schweiz»), 12 Wege bleiben | bleibt |
| Werkzeugrolle | Ausbildung & Arbeit | **Stundenlohn, ALV, Lebenslauf** ziehen hierher (vorher Portemonnaie bzw. Aussenfach); damit nicht mehr ohne Werkzeuge | mit Maturahut, Variante D empfohlen, **noch offen** |
| Erinnerungskiste | Familie & Beziehung | bleibt | von Portemonnaie unterscheidbar machen (K4) |
| Arztkoffer | Gesundheit | das **Werkzeug** «Arztkoffer» bekommt einen eigenen Namen (Doppelname, bemerkt 25.09.) | gesetzt, Leitform |
| Feldflasche | **Versicherungen & Vorsorge** | wie entschieden; welche der Versicherungs-Wege aus dem Arztkoffer hierher ziehen, ist beim Bau zu klären | bleibt |
| Versiegelter Brief | Abschied | zählt nur noch seine **eigenen 3 Wege**; das Problem «zählt fremde Seiten» entfällt mit Frage 3 | bleibt |
| Portemonnaie | Geld & Steuern | gibt Stundenlohn und ALV ab | helleres Leder (K4) |
| Aussenfach | Ablegen und ordnen | gibt den Lebenslauf ab | kein Gegenstand |

**Regel für den Bau:** jeder Weg liegt in **genau einem** Gegenstand, sonst zählt er doppelt.
Ein Test sollte das festhalten.

**Für die Zeichen heisst das:** es braucht **keine neue Zeichnung** (kein Pass-Etui). Offen bleiben
nur die schon bekannten Punkte aus K4: Werkzeugrolle (Variante D), Kiste gegen Portemonnaie
unterscheidbar, Material-Töne für 3:1 hell und dunkel. Die vier Punkte im Gegenstand werden
durch einen Satz ersetzt; ein Punkt-Zeichen muss also nicht gestaltet werden.

## 4 · Noch offen (nicht in dieser Sitzung entschieden)

- **Fünf Eingänge in den Rucksack** (Leiste, zwei im Menü, zwei auf der Übersicht) und die eigene
  Werkzeug-Liste der Übersicht (Entscheid «5 Hervorhebungen», offen seit 25.09.).
- **Die Zeile «Was steht mir zu?» im Rucksack:** nach Frage 1 nur noch ein Verweis auf den
  Leistungskompass, kein Inhalt. Wie der Verweis aussieht, ist offen.
- **Finanzbaum:** welche Wege genau «Finanz-Wege» sind, und dass er nie Einkommen, Vermögen oder
  Schulden zeigt (Grundsatz 01.11.). Braucht beim Bau den `swiss-precision-pruefer` nicht, aber
  die Grundsatz-Prüfung.
- **Nachbarn im Schrebergarten:** bleiben geparkt; nur denkbar ohne Server (z. B. freiwillig
  exportierte Schau-Ansicht), eigenes Governance-Kapitel.
