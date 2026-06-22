# Spatial Design Review

**Projekt:** Maloja Plana  
**Datum:** 2026-06-09  
**Grundlage:** LANDSCAPE_QUALITIES_REVIEW.md  

---

# A. Warum die Kapitel noch wie Formulare wirken

## Der Test

Ein Mensch öffnet "Persönliche Basis".

Was erlebt er?

1. Sage-Header mit Icon und Titel
2. Lebenssatz
3. Spiegelkarten
4. Tab-Leiste: Angaben | Dokumente
5. Section: Person
6. 6 Felder
7. Section: Kontakt
8. 3 Felder
9. Section: Familie
10. 4 Felder
11. Ende

---

Was fehlt in diesem Erlebnis?

**Kein Ankommen.** Der Header ist da, aber er empfängt nicht. Er informiert. Er sagt "Du bist bei Persönliche Basis". Er sagt nicht "Willkommen. Nimm dir Zeit."

**Kein Übergang.** Vom Header zum Lebenssatz zum Formular — alles fliesst gleich. Es gibt keinen Moment, in dem sich der Raum ändert. Keinen Türrahmen, keine Schwelle.

**Keine Etappen.** Die drei Sections (Person, Kontakt, Familie) sind gleichwertig. Gleicher Abstand. Gleiche Gewichtung. Gleiche visuelle Dichte. Man scrollt, aber man erreicht nichts.

**Keine Pausen.** Zwischen den Sections gibt es eine Linie. Dann kommt die nächste Section. Es gibt keinen Moment des Innehaltens. Kein "Dieser Teil ist geschafft."

**Kein Fortschrittsgefühl.** Man füllt Felder aus. Aber man sieht nicht, dass sich etwas verändert. Der Lebenssatz oben aktualisiert sich — aber der ist längst aus dem Viewport gescrollt.

**Kein Abschluss.** Das Formular endet einfach. Kein "Du bist fertig mit diesem Bereich." Kein leiser Moment der Ankunft. Das letzte Feld sieht aus wie jedes andere Feld.

---

## Die Ursache in einem Satz

Die Kapitel haben Inhalt, aber keine Dramaturgie.

Sie beantworten "Was muss ich ausfüllen?"

Sie beantworten nicht "Wo bin ich auf meinem Weg?"

---

# B. Welche räumlichen Eigenschaften fehlen

## Die Reise durch einen Raum

Jeder Raum, der sich gut anfühlt, hat diese Momente:

| Moment | Was es bedeutet | Dashboard | Kapitel |
|---|---|---|---|
| **Eingang** | Man kommt an. Man orientiert sich. | Willkommen-Text + Landschaft | sageMist-Header |
| **Schwelle** | Man tritt ein. Der Raum beginnt. | Übergang Landschaft → Kapitelregister | Tabs (abrupt) |
| **Weg** | Man bewegt sich durch den Raum. | Wanderweg von links nach rechts | Scrollbar (unsichtbar) |
| **Etappen** | Man erreicht Zwischenziele. | 7 Stationen am Weg | Sections (ohne Markierung) |
| **Zwischenräume** | Man macht Pause. Man atmet. | Himmel, Tal, leere Flächen | Section-Divider (eine Linie) |
| **Landmarken** | Man erkennt, wo man ist. | Kapitel-Icons an spezifischen Positionen | Section-Labels (Text) |
| **Fortschritt** | Man sieht, dass sich etwas verändert. | Easter Eggs, Trail wird solid | Nichts |
| **Horizont** | Man sieht, was noch kommt. | Berggipfel, weitere Stationen | Nichts |
| **Ankunft** | Man ist angekommen. Man hat etwas erreicht. | 100%: Schweizer Fahne | Nichts |

---

## Die Lücken pro Kapitel

### Basis (13 Felder, 3 Sections)

**Eingang:** Vorhanden (sageMist-Header). Aber er informiert, er empfängt nicht.

**Weg:** Fehlt komplett. Person → Kontakt → Familie könnten eine klare Reise sein: "Wer bin ich" → "Wie bin ich erreichbar" → "Wer gehört zu mir". Aber diese Dramaturgie ist unsichtbar.

**Etappen:** 3 Sections existieren, aber sind visuell identisch. Kein Gefühl von "Teil 1 geschafft, jetzt Teil 2".

**Zwischenräume:** D-2 hat den Abstand erhöht (48px). Besser. Aber ein Zwischenraum ist mehr als Abstand — er ist ein Moment.

**Ankunft:** Fehlt. Das Kapitel endet nach dem letzten Feld. Kein "Du hast deine Grunddaten erfasst."

---

### Wohnen (15 Felder, 4 Sections)

**Eingang:** Header vorhanden.

**Weg:** Adresse → Kosten → Vermieter → Eigentum. Das ist eine natürliche Reise: "Wo wohnst du" → "Was kostet es" → "Wer vermietet" → "Besitzt du?". Aber man erlebt sie nicht als Reise.

**Besonderes Problem:** Section 4 (Eigentum, 7 Felder) ist Secondary — sie erscheint nur auf Klick. Das ist ein ganzer Raum, der unsichtbar ist. Kein Hinweis, dass es ihn gibt, bevor man den Disclosure-Button findet.

**Ankunft:** Fehlt.

---

### Finanzen (24 Felder, 6 Sections)

**Eingang:** Header + Fünfliber-Icon (stärkster Kapitel-Header nach Malojapass).

**Weg:** Einkommen → Budget → Verpflichtungen → Ersparnisse → Kredit → Vorsorge. Das ist die klarste Reise aller Kapitel. Von "Was kommt rein" über "Was geht raus" bis "Was bleibt übrig". Aber man erlebt sie als Scrollwand, nicht als Reise.

**Besonderes Problem:** 24 Felder. 6 Sections. Das ist das längste Kapitel. Ohne Orientierung wird es zur Mühsal. Man verliert sich.

**Zwischenräume:** Am dringendsten hier. Zwischen "Einkommen" und "Budget" sollte ein Moment sein. Zwischen "Verpflichtungen" und "Ersparnisse" ein grösserer. Die emotionale Bedeutung wechselt: von Pflicht zu Hoffnung.

**Ankunft:** Fehlt. Bei einem 24-Felder-Kapitel wiegt das besonders schwer.

---

### Versicherungen (22 Felder, 6 Sections)

**Eingang:** Header vorhanden.

**Weg:** Grundversicherung → Pensionskasse → Zusatzversicherung → Sachversicherung → Mobilität → Sozialversicherung. Das ist keine Reise. Das ist ein Inventar. Eine Aufzählung von Versicherungstypen.

**Besonderes Problem:** Das Kapitel hat keinen narrativen Bogen. Es gibt keinen Grund, warum Grundversicherung vor Pensionskasse kommt, ausser Konvention. Es gibt keinen emotionalen Unterschied zwischen Section 3 und Section 5.

**Landmarken:** Fehlen komplett. Man weiss nicht, ob man bei der dritten oder fünften Versicherung ist.

**Ankunft:** Fehlt.

---

### Ausbildung (13 Felder, 3 Sections)

**Eingang:** Header vorhanden.

**Weg:** Ausbildung → Arbeit → Sprachen. Das könnte eine Lebensgeschichte sein: "Was habe ich gelernt" → "Was mache ich jetzt" → "Womit kommuniziere ich". Aber es fühlt sich an wie drei separate Listen.

**Besonderes Problem:** Das Kapitel hat keine emotionale Temperatur. Es ist rein funktional. Kein Section Intro sagt "Das ist dein beruflicher Weg." Es sagt "Deine schulische und berufliche Ausbildung. Nützlich für Bewerbungen."

**Ankunft:** Fehlt.

---

### Behörden (14 Felder, 3 Sections)

**Eingang:** Header mit Helvetia-Icon (eigener Charakter).

**Weg:** Steuern → Rechtsstellung → Vertretung. Das ist eine Hierarchie der Autorität: "Was schulde ich" → "Was bin ich rechtlich" → "Wer vertritt mich". Aber diese Hierarchie ist nicht erlebbar.

**Besonderes Problem:** Emotional das belastendste Kapitel. Steuern, Aufenthaltsstatus, Rechtsvertreter — das sind Themen, die Angst erzeugen können. Die Section Intros sind sachlich und beruhigend ("Die Steuererklärung gehört zum Schweizer Alltag"). Aber der Raum selbst bietet keine Wärme.

**Zwischenräume:** Besonders wichtig hier. Zwischen "Steuern" und "Rechtsstellung" sollte ein Moment der Pause sein. Ein stiller Raum, der sagt: "Das war der schwere Teil. Jetzt kommt etwas anderes."

**Ankunft:** Fehlt.

---

### Notfall (16 Felder, 4 Sections)

**Eingang:** Header mit Herz-Kreuz-Icon (emotional stärkstes Icon).

**Weg:** Kontaktperson → Medizinisches → Ärzte → Vorsorge. Das ist eine Reise vom Unmittelbaren zum Langfristigen: "Wer wird gerufen" → "Was müssen sie wissen" → "Wer behandelt mich" → "Was habe ich geregelt". Das ist tatsächlich eine Dramaturgie.

**Besonderes Problem:** Section 4 (Vorsorge, 7 Felder) behandelt Patientenverfügung, Vorsorgeauftrag, Bestattungswünsche. Das sind existentielle Themen. Sie erscheinen als Secondary — versteckt hinter einem Disclosure-Button. Der Raum schützt nicht, er versteckt.

**Ankunft:** Die Notfallkarte-Export-Funktion existiert. Das ist der einzige Moment in allen Kapiteln, in dem es eine Art Abschluss gibt. Aber er ist als kleiner Textlink gestaltet, nicht als Ankunftsmoment.

---

# C. Welche räumlichen Eigenschaften bereits vorhanden sind

## Was D-2 gebracht hat

| Eigenschaft | Vorhanden? | Wo? |
|---|---|---|
| Eingang | **Teilweise** | sageMist-Header mit Icon, Titel, Intro-Text |
| Materialwechsel | **Ja** | sageMist → sageDew → weiss (drei Oberflächen) |
| Orientierungshilfe | **Teilweise** | IPV-Hint, Familienzulagen-Hint (nur 2 Kapitel) |
| Section Voices | **Ja** | Kursive Intro-Texte mit borderLeft (alle Sections) |
| Lebenssatz | **Ja** | sageDew-Karte mit persönlichem Satz |
| Spiegelkarten | **Ja** | sageMist-Karten mit Datenreflexion |

## Was die bestehende Architektur bietet

| Eigenschaft | Vorhanden? | Wo? |
|---|---|---|
| Section-Struktur | **Ja** | 3–6 Sections pro Kapitel |
| Section-Labels | **Ja** | sageDeep-Text über jedem Abschnitt |
| Section-Intros | **Ja** | Kursive Sätze, die den Kontext geben |
| Progressive Disclosure | **Ja** | Secondary Fields versteckt hinter Toggle |
| Tab-Navigation | **Ja** | Angaben | Dokumente |
| Empty States | **Ja** | sageMist-Hintergrund bei leeren Kapiteln |

## Was daraus folgt

Die Architektur ist vorhanden.

Es fehlt nicht Struktur.

Es fehlt Dramaturgie.

Die Sections existieren. Aber sie erzählen keine Geschichte.

Die Intros existieren. Aber sie markieren keinen Übergang.

Die Abstände existieren. Aber sie erzeugen keinen Rhythmus.

---

# D. Die 5 stärksten räumlichen Hebel

## Hebel 1: Etappengefühl

**Was fehlt:** Man scrollt durch ein Kapitel und weiss nicht, ob man am Anfang, in der Mitte oder am Ende ist.

**Was es bräuchte:** Jede Section sollte sich wie eine eigene Etappe anfühlen. Nicht durch neue Features, sondern durch:
- Unterschiedliche Abstände (erste Section: grosszügig. Letzte: verdichtet)
- Unterschiedliche Dichte (wichtige Sections atmen mehr)
- Ein leises Signal beim Übergang (nicht Animation — Raum)

**Welche Kapitel profitieren am meisten:** Finanzen (6 Etappen), Versicherungen (6 Etappen), Notfall (4 Etappen mit existentieller Steigerung)

---

## Hebel 2: Ankunft

**Was fehlt:** Kein Kapitel hat einen Abschluss. Das letzte Feld ist wie jedes andere Feld.

**Was es bräuchte:** Ein leiser Moment am Ende, der sagt "Dieser Bereich ist erfasst." Nicht Gamification. Nicht Konfetti. Sondern: Stille. Ein Atemraum. Vielleicht der Lebenssatz, der sich aktualisiert hat. Vielleicht nur ein Satz: "Deine Grunddaten sind gespeichert."

**Welche Kapitel profitieren am meisten:** Finanzen (24 Felder — man braucht ein "Geschafft"), Notfall (existentielle Themen — man braucht ein "Das ist geregelt"), Behörden (belastende Themen — man braucht ein "Das hast du erledigt")

---

## Hebel 3: Rhythmuswechsel

**Was fehlt:** Alle Sections haben denselben Abstand (48px). Alle Felder haben dieselbe Dichte. Es gibt keine Variation.

**Was es bräuchte:** Unterschiedliche Abstände je nach emotionaler Bedeutung des Übergangs.

Beispiel Finanzen:
- Einkommen → Budget: kleiner Übergang (gleiche Welt: Geld rein, Geld raus)
- Budget → Verpflichtungen: grösserer Übergang (emotionaler Wechsel: Überblick → Pflicht)
- Verpflichtungen → Ersparnisse: der grösste Übergang (Stimmungswechsel: Belastung → Hoffnung)
- Ersparnisse → Kredit: kleiner Übergang (verwandte Themen)
- Kredit → Vorsorge: grosser Übergang (Zeitwechsel: Gegenwart → Zukunft)

Das wäre Topographie. Nicht weil die Abstände unterschiedlich programmiert sind. Sondern weil sie der emotionalen Landschaft folgen.

**Welche Kapitel profitieren am meisten:** Finanzen, Notfall, Behörden

---

## Hebel 4: Schwelle

**Was fehlt:** Der Übergang vom Header zum Formular ist abrupt. Man ist im sageMist-Header, dann sofort im Lebenssatz, dann sofort im Formular. Es gibt keinen Moment des Eintretens.

**Was es bräuchte:** Ein Übergangsmoment zwischen "Ankommen" (Header) und "Arbeiten" (Formular). Nicht ein neues Element. Sondern ein Raumwechsel: die Dichte ändert sich, die Stimmung ändert sich, die Oberfläche ändert sich.

Der Lebenssatz und die Spiegelkarten sind bereits diese Schwelle. Sie sagen "Das bist du" bevor "Das musst du ausfüllen" beginnt. Aber sie sind visuell nicht als Schwelle gestaltet — sie sind als zusätzliche Karten gestaltet.

**Welche Kapitel profitieren am meisten:** Alle — besonders Behörden und Notfall, wo der emotionale Unterschied zwischen "Ankommen" und "Arbeiten" am grössten ist.

---

## Hebel 5: Horizont innerhalb des Kapitels

**Was fehlt:** Man sieht nur das aktuelle Scrollfenster. Man weiss nicht, was noch kommt. Man weiss nicht, wie lang das Kapitel ist.

**Was es bräuchte:** Nicht einen Scrollbalken. Nicht eine Fortschrittsanzeige mit Prozent. Sondern: ein leises Raumsignal. Etwas, das sagt "Es gibt noch zwei Bereiche nach diesem." Nicht als Zahl. Als Gefühl.

Das könnte so einfach sein wie: die Section-Labels am Rand, die als Orientierungspunkte dienen. Oder: ein dezenter Hinweis auf die Sections, die noch kommen.

**Welche Kapitel profitieren am meisten:** Finanzen (6 Sections, man verliert sich), Versicherungen (6 Sections, kein narrativer Bogen)

---

# E. Welche Hebel den grössten Effekt hätten

| Hebel | Effekt | Aufwand | Risiko |
|---|---|---|---|
| **Etappengefühl** | Sehr hoch | Mittel | Gering — ändert nur Abstände und Gewichtungen |
| **Ankunft** | Hoch | Gering | Sehr gering — ein Element am Ende |
| **Rhythmuswechsel** | Hoch | Mittel | Gering — erfordert kapitelspezifische Abstandslogik |
| **Schwelle** | Mittel | Gering | Gering — nutzt bestehende Elemente |
| **Horizont** | Mittel | Mittel | Mittel — könnte die Ruhe stören, wenn zu prominent |

---

## Die Reihenfolge

1. **Ankunft** zuerst — geringstes Risiko, höchster emotionaler Impact
2. **Etappengefühl** als nächstes — macht die bestehende Struktur erlebbar
3. **Rhythmuswechsel** parallel dazu — gibt den Etappen unterschiedliche Gewichtung
4. **Schwelle** als Verfeinerung — stärkt den Übergang Header → Formular
5. **Horizont** zuletzt — nur wenn die anderen vier funktionieren

---

# F. Empfehlung

## Die eigentliche Frage

"Wie wird aus Section → Felder → Section → Felder ein Raum?"

## Die Antwort

Nicht durch neue Elemente.

Sondern durch drei Veränderungen an dem, was bereits da ist:

### 1. Unterschiedliche Abstände

Nicht jeder Section-Übergang ist gleich wichtig. Die Abstände sollten der emotionalen Bedeutung folgen. Ein Kapitel wird zur Topographie, wenn seine Sections nicht takten, sondern atmen.

### 2. Ein Ende, das ankommt

Jedes Kapitel braucht einen letzten Moment. Nicht als Feature. Als Stille. Ein Raum nach dem letzten Feld, der sagt: "Du bist angekommen."

### 3. Etappen, die man spürt

Die Sections existieren. Aber sie sind unsichtbar im Sinne der Erfahrung. Der Section-Übergang sollte ein Moment sein, nicht eine Linie. Nicht durch neue Elemente — durch Raum, Abstand, Dichte.

---

## Was sich NICHT ändern sollte

- Die Architektur (Section → Felder bleibt)
- Die Reihenfolge der Felder
- Die Section-Struktur
- Die Tab-Navigation
- Die Sage-Farben von D-2
- Die Mirror Cards / Life Sentence

---

## Der Massstab

Wenn ein Mensch ein Kapitel betritt:

**Wo kommt er an?** → Im Header. Das funktioniert bereits.

**Wo geht er entlang?** → Durch die Sections. Das existiert, aber man erlebt es nicht als Weg.

**Wo orientiert er sich?** → Nirgends ausser am Section-Label.

**Wo macht er Pause?** → Nirgends.

**Wo merkt er Fortschritt?** → Nirgends.

**Wo verlässt er den Raum?** → Er scrollt bis das Formular aufhört.

---

Drei der sechs Fragen werden mit "Nirgends" beantwortet.

Das ist die Aufgabe von D-3:

Nicht neue Räume bauen.

Sondern den bestehenden Raum erlebbar machen.

---

*Analyse erstellt am 2026-06-09. Keine Implementierung. Kein Commit.*
