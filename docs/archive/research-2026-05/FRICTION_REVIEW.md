# Friction Review

**Projekt:** Maloja Plana  
**Datum:** 2026-06-11  
**Grundlage:** D-1 bis D-17, Code-Analyse

---

# Die Zahlen

Bevor die Analyse beginnt, die nackten Zahlen.

| Kapitel | Felder | davon Primary | davon Secondary |
|---|---|---|---|
| Basis | 13 | 13 | 0 |
| Wohnen | 15 | 11 | 4 |
| Finanzen | 24 | 21 | 3 |
| Versicherungen | 22 | 16 | 6 |
| Ausbildung | 13 | 13 | 0 |
| Behörden | 14 | 14 | 0 |
| Notfall | 16 | 12 | 4 |
| **Gesamt** | **117** | **100** | **17** |

| Feldtyp | Anzahl | Was der Mensch tun muss |
|---|---|---|
| Text | 24 | Tippen. Freitext. |
| Select | 29 | Aus Optionen wählen. |
| Currency | 24 | Geldbetrag eintippen. |
| Date | 5 | Datum eingeben. |
| Tel | 5 | Telefonnummer eintippen. |
| Andere | 30 | Checkbox, Textarea, spezielle Widgets |

Pflichtfelder: 5 von 117.

Versteckte Felder (Secondary, hinter Toggle): 17 von 117.

Sichtbare Felder beim ersten Besuch: 100.

---

# Die erste Stunde

---

## Minute 0–1: Der Einstieg

**Was der Mensch sieht:** Den Malojapass. Drei Berglagen. Sieben Stationen. Einen Willkommenstext.

**Was der Mensch tun muss:** Verstehen, dass die Stationen Kapitel sind. Verstehen, dass er auf eine Station klicken kann. Verstehen, dass das sein Lebensordner ist.

**Was der Mensch nicht sieht:** Keine Anleitung. Kein "So funktioniert es." Kein Onboarding. Kein geführter Einstieg.

**Energieaufwand:** Gering — wenn der Mensch digital kompetent ist. Die Stationen sind klickbar. Die Struktur ist klar. Sieben Kapitel, sieben Icons.

**Energieaufwand:** Hoch — wenn der Mensch digital unsicher ist. "Was soll ich hier tun?" Es gibt keinen Button "Anfangen." Es gibt keinen Pfeil, der sagt: "Hier klicken." Es gibt die Berge und die Stationen und die Erwartung, dass der Mensch selbst beginnt.

| Dimension | Digital kompetent | Digital unsicher |
|---|---|---|
| Energieaufwand | 1 | 3 |
| Kognitive Last | 1.5 | 3.5 |
| Emotionale Last | 0.5 | 2 |
| Notwendigkeit | — | — |

**Reibung notwendig?** Teilweise. Kein Onboarding ist eine bewusste Entscheidung (D-12: "Der beste Onboarding ist kein Onboarding"). Aber die Abwesenheit jeder Orientierung ist nicht Stille — es ist Schweigen an einer Stelle, an der ein einziger Satz helfen würde.

---

## Minute 1–5: Das erste Kapitel (Basis)

**Was der Mensch sieht:** 13 Felder in 3 Sections. Person (6 Felder), Kontakt (3 Felder), Familie (4 Felder).

**Was der Mensch tun muss:**

1. Vorname eintippen (Pflicht, einziges rot markiertes Feld wenn leer)
2. Nachname eintippen
3. Geburtsdatum eingeben (Datum-Widget)
4. Geschlecht wählen (Select: 4 Optionen)
5. Nationalität eintippen (Freitext)
6. Kanton wählen (Select: 26 Kantone)
7. Telefonnummer eintippen
8. E-Mail eintippen
9. AHV-Nummer eintippen
10. Zivilstand wählen (Select: 5 Optionen)
11. Haushalt konfigurieren (Spezialwidget: Erwachsene + Kinder + Rentner)
12. Weitere Felder

**Was der Mensch wissen muss:**
- Seinen Namen (trivial)
- Sein Geburtsdatum (trivial)
- Seinen Kanton (trivial für Schweizer, nicht trivial für Zugewanderte — "Ist Kanton dasselbe wie Stadt?")
- Seine AHV-Nummer (nicht trivial — viele wissen sie nicht auswendig, müssen den Ausweis suchen)
- Seine Telefonnummer mit Landesvorwahl (Format: +41, +49, +43, +33, +39)

**Der AHV-Moment:**

Feld 9 von 13. Der Mensch tippt seinen Vornamen, seinen Nachnamen, sein Geburtsdatum. Alles fliesst. Dann: "AHV-Nummer." 756.1234.5678.97.

Er weiss sie nicht. Er müsste seinen AHV-Ausweis suchen. Der liegt in einer Schublade. Oder im Portemonnaie. Oder im Plastikordner.

Das ist der erste Reibungsmoment. Nicht weil das Feld schlecht ist. Sondern weil der Flow unterbrochen wird. Von "Ich tippe, was ich weiss" zu "Ich muss aufstehen und etwas suchen."

Zwei Reaktionen:
- A: Er steht auf, sucht die Nummer, tippt sie ein, macht weiter.
- B: Er lässt das Feld leer und macht weiter. (Erlaubt — nicht Pflicht.)
- C: Er schliesst Maloja. (Weil der Impuls weg ist.)

Reaktion C ist die gefährlichste. Nicht wegen der AHV-Nummer. Sondern wegen des Prinzips: Ein einziges Feld, das den Mensch zwingt aufzustehen, kann den gesamten Einstieg beenden.

| Dimension | Wert |
|---|---|
| Energieaufwand | 2.5 |
| Kognitive Last | 2 |
| Emotionale Last | 1 |
| Notwendigkeit | Felder notwendig. Reihenfolge verhandelbar. |

---

## Minute 5–15: Das zweite Kapitel (Finanzen, typisch)

**Annahme:** Der Mensch hat Basis ausgefüllt und geht zu Finanzen (weil "Reicht mein Geld?" die drängendste Frage ist).

**Was der Mensch sieht:** 24 Felder in 6 Sections. Plus 3 Secondary Felder hinter dem Toggle.

**Was der Mensch tun muss:**

Section 1: Einkommen (6 Felder)
- Monatliches Einkommen (CHF-Betrag — muss man wissen)
- Arbeitgeber (Text)
- Anstellungsart (Select: 5 Optionen)
- Beschäftigungsgrad (Text/Zahl)
- Familienzulagen (CHF-Betrag)
- Alimente erhalten (CHF-Betrag)

Section 2: Budget (5 Felder)
- Steuern monatlich (CHF — muss man berechnen oder schätzen)
- Krankenkassenprämie (CHF — muss man nachschauen)
- Lebensmittel monatlich (CHF — muss man schätzen)
- Mobilität monatlich (CHF — muss man schätzen)
- Kommunikation monatlich (CHF — muss man schätzen)

Section 3: Verpflichtungen (2 Felder)
- Schuldenrate monatlich (CHF)
- Alimente bezahlt (CHF)

Section 4: Ersparnisse (3 Felder)
- Sparkonto (CHF)
- Freizügigkeitskonto (CHF)
- Notfallfonds (CHF)

Section 5: Kredit (2 Felder)
- Kreditkarte ausstehend (CHF)
- Darlehen (CHF)

Section 6 (Secondary): Vorsorge (3 Felder)
- Säule 3a (CHF)
- Säule 3b (CHF)
- Anlagefonds (Select: Ja/Nein)

**Was der Mensch wissen muss:**

- Sein monatliches Einkommen (die meisten wissen es)
- Seine monatlichen Steuern (viele wissen es nicht — "Ich zahle Steuern einmal im Jahr, wie viel ist das pro Monat?")
- Seine Krankenkassenprämie (viele wissen den ungefähren Betrag)
- Seine Lebensmittelausgaben (die wenigsten wissen es genau)
- Seine Schulden (manche wollen es nicht wissen)
- Sein Sparkonto-Saldo (muss man in der Banking-App nachschauen)

**Die drei Energiefresser:**

**1. Steuern monatlich.** Die meisten Menschen in der Schweiz zahlen Steuern als Jahresbetrag (oder in Raten). Den monatlichen Betrag kennen sie nicht. Sie müssten rechnen: Jahresbetrag ÷ 12. Oder schätzen. Oder das Feld leer lassen.

**2. Lebensmittel/Mobilität/Kommunikation.** Das sind Schätzwerte. Und der Section Intro sagt: "Ein grober Überblick genügt." Aber "grober Überblick" erfordert trotzdem eine Zahl. Und eine Zahl einzutippen, von der man weiss, dass sie falsch ist, erzeugt Unbehagen. Nicht Ruhe — Unbehagen.

**3. Schulden.** Emotional. Nicht kognitiv.

| Dimension | Wert |
|---|---|
| Energieaufwand | 4 |
| Kognitive Last | 3.5 |
| Emotionale Last | 3 |
| Notwendigkeit | Hoch — Finanzen ist der Kern. |

**Das Zeitproblem:** 24 Felder. Bei 30 Sekunden pro Feld (nachdenken, tippen, weiter): 12 Minuten. Bei 60 Sekunden pro Feld (nachschauen, rechnen, schätzen): 24 Minuten.

Ein ganzes Kapitel = eine halbe Stunde. Sieben Kapitel = dreieinhalb Stunden. In einer App ohne Fortschrittsbalken, ohne "Noch 3 Felder!", ohne Gamification.

Dreieinhalb Stunden freiwillige Dateneingabe.

---

## Minute 15–60: Die weiteren Kapitel

**Das Problem wird nicht kleiner. Es wird grösser.**

Versicherungen: 22 Felder. Der Mensch muss seine Krankenkassenprämie wissen, seine Franchise, seine Pensionskasse, seine Haftpflicht-Police. Vieles davon liegt in Ordnern oder E-Mails. Nicht im Kopf.

Behörden: 14 Felder. Steuerkanton (einfach). Steuernummer (muss man nachschauen). Betreibungsstatus (emotional). Testament (existenziell).

Notfall: 16 Felder. Kontaktperson (einfach). Blutgruppe (viele wissen sie nicht). Allergien (wissen die meisten). Patientenverfügung (die meisten haben keine).

**Das Muster:** Jedes Kapitel hat 2–4 Felder, die den Flow unterbrechen, weil der Mensch etwas nachschauen muss, das er nicht im Kopf hat.

---

# A. Die grössten Reibungen

---

## Reibung 1: Die Menge

117 Felder. Das ist die zentrale Reibung. Nicht das einzelne Feld — die Gesamtmenge.

Ein Mensch, der Maloja zum ersten Mal öffnet und die sieben Kapitel sieht, ahnt nicht, dass dahinter 117 Felder stehen. Er sieht sieben Stationen. Das klingt machbar. Sieben Kapitel, sieben Klicks.

Dann öffnet er das erste Kapitel. 13 Felder. Okay. Dann das zweite. 24 Felder. Hmm. Dann das dritte. 15 Felder. Dann das vierte. 22 Felder.

Die Diskrepanz zwischen Erwartung (7 Stationen) und Realität (117 Felder) ist die grösste Reibung des ganzen Produkts.

| Dimension | Wert |
|---|---|
| Energieaufwand | 5 |
| Kognitive Last | 3 |
| Emotionale Last | 3 |
| Notwendigkeit | 3 |

**Notwendigkeit: 3.** Nicht alle 117 Felder sind notwendig, um "sein Leben zu sehen." Möglicherweise reichen 40. Möglicherweise reichen 20 für einen ersten Spiegel. Aber aktuell gibt es keine Priorisierung: alle 100 Primary-Felder stehen gleichberechtigt nebeneinander.

---

## Reibung 2: Der Wissensaufwand

Von den 117 Feldern kann der durchschnittliche Mensch etwa 40–50 aus dem Kopf ausfüllen. Für den Rest muss er nachschauen:

- AHV-Nummer → Ausweis suchen
- Krankenkassenprämie → Police oder App
- Franchise → Police
- Steuernummer → Steuererklärung
- Pensionskasse → Lohnausweis
- Sparkonto-Saldo → Banking-App
- Blutgruppe → Impfausweis oder Arzt
- Policen-Details → Versicherungsordner

**Was das bedeutet:** Maloja auszufüllen erfordert nicht nur Zeit vor dem Bildschirm. Es erfordert Vorbereitungszeit. Dokumente zusammensuchen. Apps öffnen. Ordner durchblättern.

Der Gesamtaufwand ist nicht "3.5 Stunden am Bildschirm." Er ist "3.5 Stunden am Bildschirm + 1 Stunde Dokumente suchen." Das ist ein halber Arbeitstag.

| Dimension | Wert |
|---|---|
| Energieaufwand | 4.5 |
| Kognitive Last | 4 |
| Emotionale Last | 2 |
| Notwendigkeit | 4 |

---

## Reibung 3: Die Währungsfelder

24 von 117 Feldern sind Währungsfelder. Sie verlangen Geldbeträge. In CHF. Als Zahl.

Für manche sind das einfache Fakten: "Mein Einkommen ist 5'400." Für andere sind es Schätzungen: "Lebensmittel... vielleicht 600? Oder 800?" Für wieder andere sind es Konfrontationen: "Schuldenrate: 450."

Das Problem: Ein Währungsfeld verlangt Präzision. Es hat ein CHF-Symbol. Es erwartet eine Zahl. Nicht "etwa 600" — sondern "600." Und die Diskrepanz zwischen der gefühlten Ungenauigkeit ("Ich weiss es nicht genau") und der geforderten Genauigkeit ("CHF ___") erzeugt Reibung.

Der Section Intro "Ein grober Überblick genügt" adressiert das sprachlich. Aber das Feld selbst widerspricht: Es sieht aus wie ein exaktes Eingabefeld. Weil es eines ist.

| Dimension | Wert |
|---|---|
| Energieaufwand | 3 |
| Kognitive Last | 3.5 |
| Emotionale Last | 2.5 |
| Notwendigkeit | 3.5 |

---

## Reibung 4: Die fehlende Belohnung

Der Mensch füllt 13 Felder aus (Basis). Was passiert? Nichts. Kein Abschlussmoment. Kein "Geschafft." Kein spürbarer Fortschritt. Er drückt "Zurück" und sieht den Malojapass — mit einer Station, die etwas grüner ist. Vielleicht. Wenn er genau hinschaut.

Der Mensch füllt 24 Felder aus (Finanzen). Was passiert? Nichts. Kein Lebenssatz, der sagt "Deine Finanzen sind erfasst." Kein Moment der Ankunft. Das letzte Feld ist "Darlehen" oder "Anlagefonds." Dann: der Rand des Containers.

**Was das für die Energie bedeutet:** Jedes Kapitel kostet Energie. Kein Kapitel gibt Energie zurück. Das ist ein Energieverlust ohne Ausgleich. Nach drei Kapiteln — Basis (13) + Finanzen (24) + Wohnen (15) = 52 Felder — hat der Mensch eine Stunde investiert und nichts zurückbekommen. Keinen Satz. Keinen Moment. Kein Gefühl.

Die Lebenssätze auf den Mirror Cards sind die einzige Belohnung. Aber man sieht sie nur auf dem Dashboard. Nicht im Kapitel. Nicht nach dem Ausfüllen. Man muss zurücknavigieren, den Tab wechseln (Spiegelkarten statt Angaben) und dann sieht man: "Sophie Stebler, geboren 1990, wohnhaft im Kanton Zürich."

Die Belohnung existiert. Aber sie liegt drei Klicks vom Ort der Arbeit entfernt.

| Dimension | Wert |
|---|---|
| Energieaufwand | 0 (es kostet nichts — es fehlt) |
| Kognitive Last | 0 |
| Emotionale Last | 3.5 (Enttäuschung, Leere) |
| Notwendigkeit | 5 (Fehlende Belohnung ist der grösste Energieverlust) |

---

## Reibung 5: Die emotionale Last bei schwierigen Themen

Schulden eintragen. Betreibungsstatus angeben. Gerichtsverfahren dokumentieren. Bestattungswünsche wählen.

Der Section Intro "Nicht mehr, nicht weniger" und "Einmal klären und dann ablegen" bereiten vor. Aber die Felder selbst sind nackt. "Schuldenrate monatlich: CHF ___." Das ist ein Feld. Ein leeres Kästchen. Und der Mensch muss eine Zahl hineinschreiben, die sein Problem in eine Ziffer verwandelt.

Für einen Menschen ohne Schulden: irrelevant (Feld leer lassen).
Für einen Menschen mit Schulden: Konfrontation.

| Dimension | Wert |
|---|---|
| Energieaufwand | 2 |
| Kognitive Last | 1 |
| Emotionale Last | 4.5 |
| Notwendigkeit | 4 |

---

## Reibung 6: Die Navigation zwischen Kapitel und Dashboard

Um den Lebenssatz zu sehen, muss man:
1. Im Kapitel "Zurück" drücken
2. Auf dem Dashboard sein
3. In den Mirror-Cards-Bereich scrollen (oder den Tab "Spiegelkarten" finden)

Um Dokumente zu einem Kapitel hinzuzufügen, muss man:
1. Das Kapitel öffnen
2. Den Tab "Dokumente" wählen (statt "Angaben")

Um den Gesamtfortschritt zu sehen, muss man:
1. Zum Dashboard zurückkehren
2. Den Malojapass betrachten

Es gibt keinen Ort, an dem man gleichzeitig seine Eingaben, seinen Lebenssatz und seinen Fortschritt sieht.

| Dimension | Wert |
|---|---|
| Energieaufwand | 2 |
| Kognitive Last | 2.5 |
| Emotionale Last | 1.5 |
| Notwendigkeit | 2 |

---

# B. Die grössten Energieverluste

Stellen, an denen Energie verbraucht wird, ohne dass etwas Sichtbares entsteht.

---

## Energieverlust 1: Felder ausfüllen, die man nicht im Kopf hat

Der Mensch sitzt am Laptop. Er füllt Felder aus. Flüssig. Name, Geburtsdatum, Kanton. Dann: AHV-Nummer. Stopp. Aufstehen. Ausweis suchen. Portemonnaie. Schublade. Ordner. Finden. Zurück zum Laptop. Eintippen.

Dieser Bruch — vom digitalen Flow in die physische Welt und zurück — kostet überproportional viel Energie. Nicht 30 Sekunden. Sondern die Überwindung, den Flow zu unterbrechen.

Betroffene Felder (geschätzt 30–40 von 117):
- AHV-Nummer
- Steuernummer
- Franchise-Höhe
- Krankenkassenprämie (genauer Betrag)
- Pensionskassen-Details
- Policen-Nummern (implizit bei Dokumenten)
- Blutgruppe
- Sparkonto-Saldo
- Vermietername und Telefon
- Hypothekenstatus

---

## Energieverlust 2: Schätzwerte ohne Kontext

"Lebensmittel monatlich: CHF ___."

Der Mensch weiss nicht, wie viel er für Lebensmittel ausgibt. Wirklich nicht. Er kauft ein, bezahlt, vergisst. Am Ende des Monats ist das Geld weg. Wie viel davon Lebensmittel waren — 500? 700? 900? — weiss er nicht.

Er muss schätzen. Und Schätzen kostet Energie. Nicht weil Schätzen schwer ist. Sondern weil Schätzen das Gefühl erzeugt, etwas Falsches einzutragen. "Ich schreibe 650, aber eigentlich weiss ich es nicht." Und dann steht dort "CHF 650" und sieht aus wie eine Tatsache. Obwohl es eine Vermutung ist.

Betroffene Felder (geschätzt 8–12):
- Lebensmittel monatlich
- Mobilität monatlich
- Kommunikation monatlich
- Steuern monatlich
- Nebenkosten (wenn nicht auf der Abrechnung)
- Freizeitausgaben (falls vorhanden)

---

## Energieverlust 3: Die Stille nach dem letzten Feld

Kapitelabschluss: 0.1 / 5 (D-9). Der Mensch füllt 24 Felder aus und bekommt — nichts. Keine Benennung. Keine Stille (die bewusste). Kein Moment.

Das ist nicht neutral. Es ist energieraubend. Weil die Erwartung eines Abschlusses — unbewusst, gewöhnt aus jeder anderen App — enttäuscht wird. Die Enttäuschung ist leise. Aber sie summiert sich. Nach sieben Kapiteln ohne Abschluss hat der Mensch sieben Mal die leise Frage gestellt: "War's das jetzt?" Und sieben Mal keine Antwort bekommen.

---

## Energieverlust 4: Kapitelwechsel ohne Belohnung

Vom Dashboard ins Kapitel: Klick auf Station. Kapitel öffnet sich. Gut.

Vom Kapitel zurück zum Dashboard: Klick auf "Zurück." Dashboard zeigt den Pass. Aber: Hat sich etwas verändert? Der Trail ist etwas grüner? Die Station hat ein anderes Icon? Man muss genau hinschauen. Der Fortschritt ist subtil. Absichtlich subtil (Anti-Gamification). Aber so subtil, dass man ihn verpasst.

Der Kapitelwechsel fühlt sich an wie: "Ich war da. Ich habe gearbeitet. Und ich sehe keinen Unterschied."

---

# C. Notwendige Reibung

Reibung, die zum Wesen von Maloja gehört und nicht entfernt werden darf.

---

## 1. Das bewusste Eintippen

Maloja ist kein Datenimporter. Der Mensch tippt selbst ein. Das erzeugt Bewusstheit: "Ich habe eine Haftpflicht bei der Mobiliar für CHF 8 pro Monat." Wer das tippt, weiss es. Wer es scannen lässt, weiss es nicht.

**Warum notwendig:** Das Eintippen ist Teil des Ordnens. Ordnung entsteht nicht durch Automatisierung. Ordnung entsteht durch die bewusste Handlung, Dinge an ihren Platz zu legen. Jedes Feld ist eine bewusste Entscheidung: "Dieses Ding gehört hierher."

**Die Grenze:** Bewusstes Eintippen ≠ mühsames Eintippen. Eine AHV-Nummer einzutippen erzeugt nicht mehr Bewusstheit als eine AHV-Nummer abzutippen. Die Reibung liegt nicht im Tippen — sie liegt im Suchen.

---

## 2. Die Konfrontation mit schwierigen Themen

Schulden eintragen. Betreibungen dokumentieren. Bestattungswünsche wählen.

Das ist Reibung. Aber es ist die Reibung, die Ordnung erzeugt. Wer seine Schulden in ein Feld tippt, hat sich mit seinen Schulden auseinandergesetzt. Das ist unbequem. Aber es ist der Zweck.

**Warum notwendig:** Maloja verspricht Klarheit. Klarheit erfordert Ehrlichkeit. Ehrlichkeit erfordert Konfrontation. Diese Reibungskette ist das Produkt.

**Die Grenze:** Die Konfrontation muss freiwillig sein. Kein Pflichtfeld bei Schulden. Kein roter Rand bei "Betreibung: —." Die Reibung darf existieren. Aber sie darf nicht erzwungen werden.

---

## 3. Die Abwesenheit von Abkürzungen

Kein Auto-Import. Kein Scan. Kein "Daten aus Banking-App übernehmen." Kein "Versicherungspolice fotografieren."

**Warum notwendig:** Weil die Abwesenheit von Abkürzungen Teil der Identität ist. Maloja ist nicht der schnellste Weg, Daten zu erfassen. Es ist der bewussteste.

**Die Grenze:** Bewusstheit darf nicht mit Mühsal verwechselt werden. Den Arbeitgeber eintippen erzeugt Bewusstheit. Die AHV-Nummer eintippen erzeugt nicht Bewusstheit — sie erzeugt nur Arbeit.

---

# D. Unnötige Reibung

Reibung, die entfernt werden könnte, ohne die Identität zu beschädigen.

---

## 1. Kein sichtbarer Fortschritt im Kapitel

**Was fehlt:** Innerhalb eines Kapitels mit 24 Feldern (Finanzen) gibt es kein Zeichen, wie weit man ist. Keine Section-Nummer. Keine "3 von 6 Sections." Keine Orientierung.

**Warum unnötig:** Orientierung ist kein Druck. "Section 3 von 6" ist keine Gamification. Es ist Information. Und Information ist Maloja.

**Was es kosten würde, es zu entfernen:** Nichts an Identität. Alles an Desorientierung.

---

## 2. Kein Abschlussmoment

**Was fehlt:** Nach dem letzten Feld: ein Satz. "Deine Finanzen sind erfasst." Oder: "Das ist geordnet." Oder einfach: Raum. Stille. Ein bewusster Abstand.

**Warum unnötig:** Der fehlende Abschluss ist kein Prinzip. Es ist ein Versäumnis. Die Dramaturgy Review (D-9) bewertet das Abschlussgefühl mit 0.1/5. Das ist keine Anti-Gamification. Das ist ein Mangel.

**Was es kosten würde, es hinzuzufügen:** Einen Satz pro Kapitel. Sieben Sätze. 60 Zeichen. Und mehr Energie zurückgeben als jede andere Änderung.

---

## 3. Die AHV-Nummer im Flow des ersten Kapitels

**Was passiert:** Der Mensch tippt Vorname, Nachname, Geburtsdatum — alles flüssig. Dann: AHV-Nummer. Flow-Bruch.

**Warum unnötig:** Die AHV-Nummer ist wichtig. Aber sie muss nicht im Flow der ersten Section stehen. Sie könnte in einer eigenen Section stehen ("Offizielle Nummern") — zusammen mit der Steuernummer. Getrennt vom Fluss Name → Geburtsdatum → Kanton, der natürlich ist.

**Was es kosten würde, es zu ändern:** Eine Section-Umstrukturierung. Kein Identitätsverlust.

---

## 4. Die Unsichtbarkeit des Lebenssatzes nach dem Ausfüllen

**Was passiert:** Man füllt Basis aus. Man drückt "Zurück." Man sieht den Malojapass. Um den Lebenssatz zu sehen, muss man scrollen und den richtigen Tab finden.

**Warum unnötig:** Der Lebenssatz ist die Belohnung. Die Belohnung sollte dort sein, wo die Arbeit war. Nicht drei Klicks entfernt.

---

## 5. Keine Unterscheidung zwischen "weiss ich" und "muss ich nachschauen"

**Was passiert:** Alle 117 Felder sehen gleich aus. "Vorname" sieht aus wie "AHV-Nummer." "Geburtsdatum" sieht aus wie "Sparkonto-Saldo." Es gibt keinen visuellen Hinweis, welche Felder man aus dem Kopf ausfüllen kann und welche ein Nachschlagen erfordern.

**Warum unnötig:** Eine subtile Markierung — ein kleines Icon, ein Hinweistext ("Falls du es griffbereit hast") — würde die Erwartung setzen: "Dieses Feld muss ich nicht jetzt ausfüllen. Ich komme später zurück." Und damit den Flow schützen.

---

## 6. Kein "Später"-Mechanismus

**Was passiert:** Der Mensch stösst auf ein Feld, das er nicht ausfüllen kann (AHV-Nummer, Sparkonto-Saldo). Er hat zwei Optionen: leer lassen und später daran denken. Oder: jetzt nachschauen und den Flow unterbrechen.

Es gibt keinen dritten Weg. Keine Möglichkeit, ein Feld zu markieren ("Komme ich zurück"). Keine "Offene Felder"-Übersicht.

**Warum unnötig:** Ein "Später"-Marker wäre kein Druck. Es wäre eine Erinnerungshilfe. Für den Mensch, der am Sonntagabend 15 Minuten hat und bei den einfachen Feldern bleiben will — ohne die schwierigen zu vergessen.

**Die Identitätsfrage:** Ist ein "Später"-Marker Gamification? Nein. Er zeigt nicht "3 offene Felder!" Er zeigt nichts, bis der Mensch danach fragt. Er ist ein Lesezeichen, kein Badge.

---

# E. Die kritischsten Einstiegshürden

---

## Hürde 1: Die Kaltstart-Leere

**Was passiert:** Neuer Nutzer. Öffnet Maloja. Sieht: Berge. Sieben leere Stationen. Keine Daten. Keine Lebenssätze. Keine Spiegelkarten. Alles leer.

**Die Frage des Nutzers:** "Was soll ich hier tun?"

**Warum es eine Hürde ist:** Der Malojapass entfaltet seine Wirkung erst mit Daten. Ohne Daten ist er: ein hübsches Bild. Die Mirror Cards entfalten ihre Wirkung erst mit Lebenssätzen. Ohne Lebenssätze sind sie: leere Karten.

Maloja im Kaltzustand zeigt nicht, was es kann. Es zeigt, was es nicht hat: Daten.

**Für wen es am schlimmsten ist:** Für jeden. Aber besonders für den unsicheren Nutzer, der nicht weiss, ob seine Investition (100 Felder) sich lohnen wird.

| Dimension | Wert |
|---|---|
| Energieaufwand | 2 |
| Kognitive Last | 3 |
| Emotionale Last | 2.5 |
| Notwendigkeit | 1 (Diese Hürde ist vermeidbar.) |

---

## Hürde 2: Die erste Minute ohne Orientierung

**Was passiert:** Der Mensch sieht den Pass. Er sieht sieben Stationen. Welche soll er anklicken? In welcher Reihenfolge? Muss er bei Basis anfangen? Kann er direkt zu Finanzen? Gibt es eine richtige Reihenfolge?

**Die Antwort:** Es gibt keine richtige Reihenfolge. Man kann überall beginnen.

**Warum es eine Hürde ist:** Freiheit ohne Empfehlung ist für unsichere Menschen keine Freiheit. Es ist Überforderung. "Du kannst überall anfangen" klingt wie Flexibilität. Es fühlt sich an wie: "Wir sagen dir nicht, wo du anfangen sollst."

| Dimension | Wert |
|---|---|
| Energieaufwand | 1 |
| Kognitive Last | 3 |
| Emotionale Last | 2 |
| Notwendigkeit | 1 |

---

## Hürde 3: Der Übergang vom ersten Kapitel zum zweiten

**Was passiert:** Der Mensch hat Basis ausgefüllt. 13 Felder. 5 Minuten. Er drückt "Zurück." Er sieht den Pass. Eine Station ist leicht grüner.

Jetzt: Noch sechs Kapitel. Noch 104 Felder.

Dieser Moment — der Moment nach dem ersten Kapitel — ist der kritischste Moment des gesamten Produkts. Hier entscheidet sich, ob der Mensch weitermacht oder aufhört.

**Was für "Weitermachen" spricht:** Der Mensch hat einen Lebenssatz. Er sieht sein amtliches Ich. Er will mehr sehen.

**Was für "Aufhören" spricht:** Er hat gerade 5 Minuten investiert und 13 Felder ausgefüllt. Das nächste Kapitel hat 24 Felder. Und das danach hat 22. Die Vorstellung, "das Gleiche nochmal, nur länger" ist erschöpfend.

| Dimension | Wert |
|---|---|
| Energieaufwand | 3 |
| Kognitive Last | 2 |
| Emotionale Last | 3 |
| Notwendigkeit | 2 |

---

## Hürde 4: Die Sprachbarriere

Maloja existiert in DE, EN, FR, IT. Die Section Intros sind übersetzt. Die Felder sind übersetzt.

Aber: Die emotionale Qualität der deutschen Section Intros — "Einmal klären und dann ablegen", "Nicht mehr, nicht weniger" — ist in den anderen Sprachen möglicherweise schwächer. "Once clarified, then filed away" hat nicht dasselbe Gewicht wie "Einmal klären und dann ablegen."

Für die Zielperson aus D-16 — die alleinerziehende Pflegerin mit B-Bewilligung — könnte die englische Version funktional korrekt, aber emotional leer sein.

| Dimension | Wert |
|---|---|
| Energieaufwand | 1 |
| Kognitive Last | 2 |
| Emotionale Last | 2.5 |
| Notwendigkeit | 1 |

---

# F. Die wichtigste offene Frage

---

> **Wenn Maloja perfekt wäre — würde die Zielperson es tatsächlich benutzen?**

---

Nehmen wir an, alles wäre gelöst:

- Abschlussmomente in jedem Kapitel. ✓
- Sichtbare Orientierung innerhalb der Kapitel. ✓
- Lebenssatz direkt nach dem Ausfüllen. ✓
- Landschaftsqualität in den Kapiteln. ✓
- Synthesen (Finanzdifferenz, Versicherungslücken). ✓
- Section Intros in vier Sprachen mit gleicher emotionaler Qualität. ✓
- "Später"-Marker für nachschlageintensive Felder. ✓
- Quellenangaben bei Berechnungen. ✓
- Menschliches Impressum. ✓
- QR-CDN gefixt. ✓

Alles perfekt. Kein Mangel. Keine unnötige Reibung.

**117 Felder bleiben.**

Die perfekte Version von Maloja verlangt immer noch, dass ein Mensch 117 Felder ausfüllt. Freiwillig. Ohne Druck. Ohne Belohnung ausser Ruhe.

---

### Die Antwort ist nicht Ja oder Nein. Sie ist: Für wen?

---

**Für den Ordnungsmenschen (D-16, Mensch 6):** Ja. Er füllt 117 Felder an einem Sonntag aus. Mit Freude. Weil Ordnung für ihn Selbstfürsorge ist.

**Für den Menschen nach dem Umzug (D-16, Mensch 1):** Ja, über Wochen. Nicht an einem Tag. Kapitel für Kapitel. Wenn sie Zeit hat. Wenn sie Energie hat. Wenn sie einen konkreten Anlass hat ("Ich muss meine Steuererklärung machen — wo sind meine Daten?").

**Für den Menschen mit chronischer Krankheit (D-16, Mensch 5):** Ja, aber nur das Notfall-Kapitel. 16 Felder. 10 Minuten. Konkreter Nutzen: Notfallkarte. Er füllt vielleicht nie ein zweites Kapitel aus. Und das ist in Ordnung.

**Für die alleinerziehende Pflegerin (D-16, die Zielperson):** Unsicher. Sie hat wenig Zeit. Wenig Energie. Viel Angst. 117 Felder — auch perfekt gestaltete — sind eine Überforderung, die kein Design lösen kann.

Was helfen könnte: Ein minimaler Einstieg. Nicht 117 Felder. Sondern 5. Name, Einkommen, Miete, Krankenkasse, Notfallkontakt. Fünf Felder. Fünf Minuten. Ein erster Spiegel: "Du heisst X, verdienst Y, zahlst Z Miete. Deine Krankenkasse ist bei W. Im Notfall wird A angerufen."

Fünf Sätze. Die auf fünf Feldern basieren. Und die zum ersten Mal in ihrem Leben an einem Ort stehen.

Das wäre kein vollständiger Lebensordner. Aber es wäre ein Anfang. Und ein Anfang, der fünf Minuten kostet, ist unendlich mehr als ein Lebensordner, der nie begonnen wird.

---

### Die eigentliche Erkenntnis

Die perfekte Version von Maloja ist nicht die mit den besten Abschlüssen, den schönsten Synthesen und den tiefsten Landschaftsqualitäten.

Die perfekte Version von Maloja ist die, die in fünf Minuten einen Unterschied macht.

Nicht in dreieinhalb Stunden. Nicht in einer Stunde. In fünf Minuten.

Weil die Zielperson keine dreieinhalb Stunden hat. Sie hat fünf Minuten. Zwischen dem Abendessen und dem Schlafengehen des Kindes. Zwischen zwei Schichten. Zwischen der Angst und der Erschöpfung.

Fünf Minuten.

Und in diesen fünf Minuten muss Maloja zeigen: "Hier ist ein Ort für dich. Und er lohnt sich."

Ob sie danach zurückkommt — für das zweite Kapitel, für das dritte, für die Synthese, für die Ruhe — hängt davon ab, ob die ersten fünf Minuten sie beruhigt haben oder überfordert.

Und das ist keine Designfrage. Keine Identitätsfrage. Keine Philosophiefrage.

Das ist die Frage, die über alles entscheidet.

---

*Analyse erstellt am 2026-06-11. Keine Implementierung. Kein Commit.*
