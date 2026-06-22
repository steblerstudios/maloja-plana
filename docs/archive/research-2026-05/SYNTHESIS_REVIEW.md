# Synthesis Review

**Projekt:** Maloja Plana  
**Datum:** 2026-06-10  
**Grundlage:** ORDER_AND_COMPLETION_REVIEW.md  

---

# A. Datenebene

Was jedes Kapitel an Rohdaten erfasst.

## Basis (11 Felder)

| Feld | Typ | Beispiel |
|---|---|---|
| Vorname | Text | Sophie |
| Nachname | Text | Stebler |
| Geburtsdatum | Datum | 15.03.1990 |
| Geschlecht | Select | Weiblich |
| Nationalität | Select | Schweiz |
| Kanton | Select | ZH |
| Telefon | Tel | 079 123 45 67 |
| E-Mail | E-Mail | sophie@example.ch |
| AHV-Nummer | Text | 756.1234.5678.97 |
| Zivilstand | Select | Ledig |
| Haushalt | Widget | 1 Erwachsene, 0 Kinder |

**Charakter der Daten:** Statisch. Ändern sich selten. Sind dem Menschen bekannt.

## Wohnen (12 Felder)

| Feld | Typ | Beispiel |
|---|---|---|
| Adresse | Text | Musterstrasse 12 |
| PLZ | Text | 8000 |
| Ort | Text | Zürich |
| Einzugsdatum | Datum | 01.04.2021 |
| Miete | CHF | 1'800 |
| Nebenkosten | CHF | 280 |
| Vermieter | Text | Steiner Immobilien AG |
| Vermieter-Telefon | Tel | 044 567 89 00 |
| Hypothekenstatus | Select | — |
| Immobilienwert | CHF | — |
| Gebäudeversicherung | CHF | — |
| Wohnform | Select | Miete |

**Charakter der Daten:** Halbstatisch. Ändern sich bei Umzug. Kosten können jährlich angepasst werden. Vermieter-Daten braucht man selten, aber wenn, dann dringend.

## Finanzen (21 Felder)

| Bereich | Felder | Beispiel |
|---|---|---|
| Einkommen | Monatslohn, Arbeitgeber, Anstellungsart, Beginn, Familienzulagen, Alimente erhalten | CHF 5'400, Müller AG, Festanstellung |
| Budget | Steuern, Lebensmittel, Kommunikation, Mobilität, Versicherungen | CHF 450, CHF 600, CHF 80, CHF 120, CHF 200 |
| Verpflichtungen | Schuldenraten, Alimente bezahlt | CHF 0, CHF 0 |
| Ersparnisse | Sparziel, Sparkonto, Bank | CHF 500, CHF 12'000, Raiffeisen |
| Kredit | Kreditkarte, Darlehen | Ja, CHF 0 |
| Vorsorge | Säule 3a, 3b, Anlagefonds | CHF 200, —, — |

**Charakter der Daten:** Dynamisch. Ändern sich monatlich. Haben die höchste emotionale Ladung. Sind die unbekanntesten — viele Menschen kennen ihre genauen Ausgaben nicht.

## Versicherungen (17 Felder)

| Bereich | Felder | Beispiel |
|---|---|---|
| Grundversicherung | Kasse, Modell, Prämie, Franchise, Kartennummer | CSS, Hausarztmodell, CHF 380, CHF 2'500 |
| Pensionskasse | Kasse, Beitrag | Vita, CHF 420 |
| Zusatz | UVG, Haftpflicht, Haftpflicht-Betrag | Über Arbeitgeber, Ja, CHF 180 |
| Sach | Hausrat, Reise, Cyber | Ja, Nein, Nein |
| Mobilität | Auto, Auto-Prämie | — |
| Sozial | AHV-Beitrag | CHF 6'000/J. |

**Charakter der Daten:** Halbstatisch. Ändern sich jährlich (Prämien) oder bei Stellenwechsel (BVG, UVG). Viele Felder sind Ja/Nein-Fragen — man hat es oder man hat es nicht.

## Ausbildung (10 Felder)

| Bereich | Felder | Beispiel |
|---|---|---|
| Ausbildung | Schule, Abschluss, EFZ-Nummer, Zertifikate | KV Zürich, Kauffrau EFZ, 12345, Cambridge B2 |
| Arbeit | Arbeitgeber, Beruf, Beginn, Bewilligung, Pensum | Müller AG, Sachbearbeiterin, 2019, —, 80% |
| Sprachen | Sprachen | Deutsch, Französisch |

**Charakter der Daten:** Statisch bis halbstatisch. Ausbildung ändert sich kaum. Arbeit ändert sich bei Stellenwechsel. Sprachen ändern sich fast nie.

## Behörden (10 Felder)

| Bereich | Felder | Beispiel |
|---|---|---|
| Steuern | Kanton, Steuer-ID, Frist, Ausstehende | ZH, 12345678, 31.03.2027, 0 |
| Rechtsstellung | Zuständiges Amt, Betreibung, Gerichtsverfahren | Bezirksgericht Zürich, Keine Einträge, Keine |
| Vertretung | Rechtsvertreter, Telefon, Testament | —, —, Nein |

**Charakter der Daten:** Gemischt. Steuerfrist ist zeitkritisch. Betreibungsstatus ist emotional geladen. Rechtsvertreter ist situativ. Testament ist existentiell.

## Notfall (13 Felder)

| Bereich | Felder | Beispiel |
|---|---|---|
| Kontakt | Name, Telefon | Maria Stebler, 079 987 65 43 |
| Medizinisch | Blutgruppe, Allergien, Medikamente, Chronisches | A+, Penicillin, —, — |
| Ärzte | Hausarzt, Telefon, Spital | Dr. Meier, 044 111 22 33, USZ |
| Vorsorge | Organspende, Patientenverfügung, Vorsorgeauftrag, Bestattung | Ja, Vorhanden, Noch offen, Kremation |

**Charakter der Daten:** Statisch, aber existentiell. Ändern sich selten. Werden hoffentlich nie gebraucht. Aber wenn, dann sind sie lebenswichtig.

---

# B. Übersichtsebene

Was Maloja Plana heute aus den Daten macht.

Jedes Kapitel hat zwei Übersichtselemente:
- **Lebenssatz** — ein menschlich lesbarer Satz auf sageDew-Hintergrund
- **Mirror Cards** — strukturierte Datenreihen auf sageMist-Hintergrund

## Basis

**Lebenssatz:** "Sophie Stebler, geboren 1990, wohnhaft im Kanton Zürich. Ledig, lebt alleine."

**Mirror Cards:** Person (Name, Geburtsdatum, Kanton, Zivilstand, Haushalt) + Kontakt (Telefon, E-Mail)

**Was die Übersicht leistet:** Identität als Satz. Man liest, wer man ist — im amtlichen Sinne. Das funktioniert. Der Satz ist vollständig, menschlich, klar.

**Was die Übersicht nicht leistet:** Nichts Wesentliches fehlt. Basis ist das einzige Kapitel, bei dem die Übersicht fast ausreicht.

## Wohnen

**Lebenssatz:** "Musterstrasse 12, 8000 Zürich. Wohndauer 5 Jahre, 2 Monate. Monatsmiete CHF 1'800 plus CHF 280 Nebenkosten. Vermieter: Steiner Immobilien AG."

**Mirror Cards:** Zuhause (Adresse, Einzugsdatum, Wohndauer) + Kosten (Miete, Nebenkosten, Total)

**Was die Übersicht leistet:** Wohnsituation als Satz. Adresse, Dauer, Kosten — alles in einer Aussage. Die Wohndauer wird berechnet (nicht eingegeben) — das ist bereits eine kleine Synthese.

**Was die Übersicht nicht leistet:** Kein Verhältnis zum Einkommen. "CHF 2'080 Wohnkosten" ist eine Zahl. "38% des Einkommens für Wohnen" ist eine Erkenntnis.

## Finanzen

**Lebenssatz:** "Monatliches Einkommen CHF 5'400 bei Müller AG. Erfasste monatliche Ausgaben CHF 4'200."

**Mirror Cards:** Einkommen (Lohn, Arbeitgeber, Anstellungsart) + Monatliche Ausgaben (Wohnen, Krankenkasse, Steuern, Lebensmittel, Kommunikation, Mobilität, Versicherungen) + Sparen & Vorsorge (Sparziel, Säule 3a) + Kredite (offene Kredite)

**Was die Übersicht leistet:** Einkommen und Ausgabensumme als getrennte Aussagen. Die Ausgabensumme wird bereits berechnet — sie addiert Felder aus Finanzen plus Miete aus Wohnen plus Prämie aus Versicherungen. Das ist eine kapitelübergreifende Berechnung. Das ist mehr als reine Anzeige.

**Was die Übersicht nicht leistet:** Die Differenz. Zwei Sätze stehen nebeneinander — "Einkommen CHF 5'400" und "Ausgaben CHF 4'200" — aber die Aussage "Es bleiben CHF 1'200" wird nicht gemacht.

## Versicherungen

**Lebenssatz:** "Du bist bei CSS grundversichert. Franchise CHF 2'500. Eine Pensionskasse ist hinterlegt."

**Mirror Cards:** Grundversicherung (Kasse, Modell, Franchise, Prämie, UVG) + Sozialversicherungen (BVG, AHV-Beitrag) + Weitere Versicherungen (Haftpflicht ✓, Hausrat ✓, Reise, Cyber, Auto)

**Was die Übersicht leistet:** Die Krankenkasse als Satz. Plus eine Auflistung, welche Zusatzversicherungen vorhanden sind (mit ✓).

**Was die Übersicht nicht leistet:** Keine Aussage über Lücken. Die Mirror Cards zeigen nur, was vorhanden ist. Was fehlt, wird nicht gezeigt — ein Feld ohne Wert erscheint einfach nicht in den Mirror Cards.

## Ausbildung

**Lebenssatz:** "Kauffrau EFZ. Aktuell tätig als Sachbearbeiterin bei Müller AG."

**Mirror Cards:** Bildung (Abschluss, Schule, Zertifikate) + Beruf (Beruf, Arbeitgeber, seit, Pensum, Bewilligung) + Sprachen

**Was die Übersicht leistet:** Berufliches Profil als Satz. Kompakt, klar, menschlich. "Kauffrau EFZ. Aktuell tätig als Sachbearbeiterin." — das könnte der erste Satz eines Lebenslaufs sein.

**Was die Übersicht nicht leistet:** Nichts Wesentliches fehlt. Wie bei Basis reicht die Übersicht fast aus, weil das Kapitel beschreibend ist, nicht bewertend.

## Behörden

**Lebenssatz:** "Deine Steuerangelegenheiten laufen über den Kanton Zürich."

**Mirror Cards:** Steuersituation (Kanton, Frist, ausstehende Erklärungen) + Rechtliche Situation (Betreibung, Gericht) + Vertretung (Rechtsbeistand) + Vorsorge (Testament)

**Was die Übersicht leistet:** Steuerkanton als Satz. Datenreihen für den Rest.

**Was die Übersicht nicht leistet:** Kein Statusgefühl. "Steuererklärung fällig: 31.03.2027" ist ein Datenpunkt. "Deine Frist ist in 9 Monaten" wäre eine zeitliche Einordnung. "Keine offenen Verfahren" steht in den Mirror Cards — aber es steht dort als Datenreihe, nicht als Aussage.

## Notfall

**Lebenssatz:** "Für den Notfall ist eine Kontaktperson hinterlegt. Ein Hausarzt ist eingetragen. Vorsorgeangaben sind erfasst." (Der vollständigste Lebenssatz.)

**Mirror Cards:** Notfallkontakt (Name, Telefon) + Ärztliche Betreuung (Hausarzt, Telefon, Spital) + Vorsorge (Patientenverfügung ✓, Vorsorgeauftrag ○, Organspende) + Gesundheitsdaten (Blutgruppe, Allergien ✓, Medikamente ✓)

**Was die Übersicht leistet:** Eine gestaffelte Zusammenfassung. Der Lebenssatz wächst mit den Daten: nur Kontakt → Kontakt + Arzt → Kontakt + Arzt + Vorsorge. Das ist die klügste Lebenssatz-Logik aller Kapitel. Sie spiegelt nicht nur, was vorhanden ist, sondern wie vollständig die Vorsorge ist.

**Was die Übersicht nicht leistet:** Die Aussage fehlt. "Eine Kontaktperson ist hinterlegt" ist eine Tatsache. "Deine Liebsten werden wissen, was zu tun ist" wäre eine Bedeutung.

---

# C. Syntheseebene

Was fehlt. Die Aussage, die aus Daten und Übersicht Verstehen macht.

---

## Basis

### Daten

11 Felder. Name, Geburtsdatum, Kontakt, AHV, Familie.

### Übersicht

"Sophie Stebler, geboren 1990, wohnhaft im Kanton Zürich. Ledig, lebt alleine."

### Die Frage, die der Mensch beantwortet haben möchte

"Habe ich alle Grunddaten an einem Ort?"

### Die fehlende Synthese

Keine. Oder fast keine.

Basis ist das einzige Kapitel, bei dem die Übersicht fast identisch ist mit der Synthese. Wenn man den Lebenssatz liest, weiss man, was erfasst ist. Der Satz ist die Synthese.

Was minimal fehlt: Ein Signal, ob etwas Wesentliches noch nicht erfasst ist. "AHV-Nummer: noch nicht hinterlegt" wäre keine Synthese im engeren Sinne, sondern ein Vollständigkeitshinweis. Aber bei Basis ist Vollständigkeit nahe an Ordnung.

### Wann würde Klarheit entstehen?

Wenn der Lebenssatz vollständig ist, ist Klarheit da. Bei Basis genügt das.

---

## Wohnen

### Daten

12 Felder. Adresse, Kosten, Vermieter, Eigentum.

### Übersicht

"Musterstrasse 12, 8000 Zürich. Wohndauer 5 Jahre. Monatsmiete CHF 1'800 plus CHF 280 Nebenkosten."

### Die Frage, die der Mensch beantwortet haben möchte

"Was kostet mein Zuhause — und ist das tragbar?"

### Die fehlende Synthese

Die Gesamtkosten werden addiert (Miete + Nebenkosten). Aber die Einordnung fehlt.

**Aussage, die fehlt:**

"Dein Zuhause kostet CHF 2'080 im Monat. Das sind 38% deines Einkommens."

Das erfordert eine kapitelübergreifende Berechnung: Wohnkosten / Einkommen. Beide Werte sind in Maloja erfasst. Die Division fehlt.

Der Prozentsatz ist keine Bewertung. Er ist eine Einordnung. 25% ist anders als 45%. Das zu wissen, verändert das Verständnis.

### Wann würde Klarheit entstehen?

Wenn der Mensch seine Wohnkosten im Verhältnis zu seinem Einkommen sieht. Nicht als Zahl allein. Als Proportion.

---

## Finanzen

### Daten

21 Felder. Einkommen, Budget, Verpflichtungen, Ersparnisse, Kredit, Vorsorge.

### Übersicht

"Monatliches Einkommen CHF 5'400 bei Müller AG. Erfasste monatliche Ausgaben CHF 4'200."

### Die Frage, die der Mensch beantwortet haben möchte

"Reicht es?"

Das ist die Frage. Nicht "Wie hoch ist mein Einkommen?" Nicht "Wie hoch sind meine Ausgaben?" Sondern: "Reicht es?"

### Die fehlende Synthese

**Aussage, die fehlt:**

"Es bleiben monatlich CHF 1'200."

Drei Wörter und eine Zahl. Einkommen minus Ausgaben. Die mächtigste fehlende Aussage in Maloja Plana.

Denn diese eine Zeile beantwortet die Frage "Reicht es?" Nicht mit Ja oder Nein. Sondern mit einer Zahl, die der Mensch selbst einordnen kann.

CHF 1'200 übrig. Ist das viel? Ist das wenig? Das hängt ab von der Lebenssituation. Aber die Zahl zu kennen — das ist der Anfang von Ordnung.

**Zweite Aussage, die fehlt:**

"Davon gehen CHF 200 in die Säule 3a und CHF 500 ins Sparziel."

Die Ersparnisse stehen in den Mirror Cards. Aber sie stehen nicht im Kontext der Bilanz. Wer CHF 1'200 übrig hat und CHF 700 davon spart, hat CHF 500 freien Spielraum. Das zu wissen, ist ein anderes Gefühl als nur die Einzelzahlen zu kennen.

### Wann würde Klarheit entstehen?

Wenn drei Zeilen nebeneinanderstehen:

Einkommen: CHF 5'400  
Ausgaben: CHF 4'200  
**Differenz: CHF 1'200**

Nicht mehr. Nicht weniger. Die dritte Zeile ist die Synthese.

---

## Versicherungen

### Daten

17 Felder. 6 Versicherungstypen. Mischung aus Pflichtversicherungen und freiwilligen.

### Übersicht

"Du bist bei CSS grundversichert. Franchise CHF 2'500. Eine Pensionskasse ist hinterlegt."

Mirror Cards zeigen vorhandene Versicherungen mit ✓.

### Die Frage, die der Mensch beantwortet haben möchte

"Bin ich genug abgesichert?"

### Die fehlende Synthese

Zwei Aussagen fehlen:

**1. Was vorhanden ist — als Gesamtbild:**

"Grundversicherung, Pensionskasse, Haftpflicht und Hausrat sind vorhanden."

Das sagen die Mirror Cards bereits — aber als Einzelzeilen, nicht als Satz. Die Zusammenfassung als Aufzählung fehlt.

**2. Was nicht vorhanden ist:**

"Reiseversicherung, Cyberversicherung und Rechtsschutz: nicht vorhanden."

Das ist die eigentliche Synthese. Nicht was man hat. Sondern was man nicht hat. Die Mirror Cards zeigen nur Felder mit Werten. Leere Felder verschwinden. Damit verschwinden auch die Lücken.

Das ist keine Empfehlung. Keine Bewertung. Es ist eine Feststellung: "Diese Versicherungen hast du nicht."

Der Mensch entscheidet dann selbst, ob er sie braucht. Der Section Intro sagt bereits: "Versicherungen, die Du haben kannst, aber nicht musst." Das Produkt muss nicht bewerten. Es muss nur zeigen.

### Wann würde Klarheit entstehen?

Wenn der Mensch in einem Blick sieht: Was habe ich? Was habe ich nicht?

Nicht als 17 einzelne Felder. Als zwei Listen.

---

## Ausbildung

### Daten

10 Felder. Ausbildung, Arbeit, Sprachen.

### Übersicht

"Kauffrau EFZ. Aktuell tätig als Sachbearbeiterin bei Müller AG."

### Die Frage, die der Mensch beantwortet haben möchte

"Wie sieht mein berufliches Profil aus?"

### Die fehlende Synthese

Kaum etwas.

Der Lebenssatz ist bereits nahe an einer Synthese. "Kauffrau EFZ. Aktuell tätig als Sachbearbeiterin bei Müller AG." — das ist ein berufliches Profil in einem Satz.

Was minimal fehlt: Die Dauer. "Seit 2019" steht in den Mirror Cards. "Seit 5 Jahren" wäre eine Einordnung. Maloja berechnet die Wohndauer bereits — die Berufsdauer nicht.

### Wann würde Klarheit entstehen?

Klarheit ist bereits weitgehend da. Ausbildung ist — zusammen mit Basis — das Kapitel, bei dem die Übersicht fast ausreicht.

---

## Behörden

### Daten

10 Felder. Steuern, Rechtsstellung, Vertretung.

### Übersicht

"Deine Steuerangelegenheiten laufen über den Kanton Zürich."

Mirror Cards: Steuerfrist, Betreibungsstatus, Gerichtsverfahren, Testament.

### Die Frage, die der Mensch beantwortet haben möchte

"Ist etwas offen? Habe ich etwas vergessen? Drängt etwas?"

### Die fehlende Synthese

**Aussage, die fehlt:**

"Nächste Frist: Steuererklärung bis 31. März 2027 (in 9 Monaten). Keine offenen Betreibungen. Keine laufenden Verfahren."

Das ist eine Statusaussage. Sie kombiniert drei Informationen zu einem Bild:

1. Zeitlich: Was steht als Nächstes an?
2. Rechtlich: Gibt es ein Problem?
3. Administrativ: Ist etwas offen?

Jede dieser drei Informationen ist in den Daten vorhanden. Aber sie stehen in drei verschiedenen Mirror-Card-Sections. Die Zusammenführung zu einer Statusaussage — "Es drängt nichts" oder "Frist in 47 Tagen" — fehlt.

**Besonderheit:** Behörden ist das einzige Kapitel, bei dem sich die Synthese mit der Zeit verändert. Die Steuerfrist rückt näher. "In 9 Monaten" wird zu "In 3 Monaten" wird zu "In 2 Wochen". Die Synthese muss zeitlich sein, nicht statisch.

### Wann würde Klarheit entstehen?

Wenn der Mensch auf einen Blick sieht: Was drängt? Was ist erledigt? Was steht noch an?

---

## Notfall

### Daten

13 Felder. Kontakt, Medizinisches, Ärzte, Vorsorge.

### Übersicht

"Für den Notfall ist eine Kontaktperson hinterlegt. Ein Hausarzt ist eingetragen. Vorsorgeangaben sind erfasst."

Mirror Cards: Kontakt + Ärzte + Vorsorge-Status (✓ / ○) + Gesundheitsdaten

### Die Frage, die der Mensch beantwortet haben möchte

"Sind meine Liebsten vorbereitet?"

### Die fehlende Synthese

Der Lebenssatz ist der beste aller Kapitel. Er wächst mit den Daten. Er sagt, was hinterlegt ist.

Aber er beantwortet die eigentliche Frage nicht.

"Kontaktperson hinterlegt. Hausarzt eingetragen. Vorsorgeangaben erfasst."

Das ist eine Aufzählung von Tatsachen.

**Aussage, die fehlt:**

Nicht eine einzelne Zeile. Sondern ein Stimmungswechsel. Von "Was ist vorhanden" zu "Was bedeutet das."

Der Lebenssatz beschreibt: "Drei Dinge sind hinterlegt."

Die Synthese wäre: "Wenn etwas passiert, werden die wichtigsten Informationen auffindbar sein."

Oder kürzer: "Es ist geregelt."

Das ist keine Berechnung. Keine Addition. Kein Prozentsatz. Es ist die Übersetzung von Datenpunkten in Bedeutung.

Bei Finanzen ist die Synthese eine Zahl: CHF 1'200.

Bei Notfall ist die Synthese ein Satz: "Es ist geregelt."

Beides sind Synthesen. Aber sie haben einen fundamental anderen Charakter. Die eine ist mathematisch. Die andere ist menschlich.

---

# D. Kapitel mit grösster Syntheselücke

## Rang 1: Finanzen

**Die Lücke:** Die Differenz zwischen Einkommen und Ausgaben.

**Warum sie die grösste ist:**

- Beide Werte sind bereits berechnet und angezeigt
- Die Subtraktion ist trivial
- Die resultierende Zahl beantwortet die drängendste Frage des ganzen Produkts
- Kein anderes fehlendes Stück Information würde das Verständnis so stark verändern

**Was der Mensch heute sieht:**

"Monatliches Einkommen CHF 5'400."  
"Erfasste monatliche Ausgaben CHF 4'200."

**Was der Mensch verstehen würde:**

"Es bleiben CHF 1'200."

**Distanz von Übersicht zu Synthese:** Ein Minus-Zeichen.

---

## Rang 2: Versicherungen

**Die Lücke:** Was nicht vorhanden ist.

**Warum sie gross ist:**

- Die Mirror Cards zeigen nur vorhandene Versicherungen
- Fehlende Versicherungen sind unsichtbar
- Ein Mensch sieht 5 Zeilen mit ✓ und denkt "Alles vorhanden"
- Dabei fehlen 3 Versicherungen — sie werden nur nicht gezeigt

**Was der Mensch heute sieht:**

"Haftpflicht: ✓"  
"Hausrat: ✓"

**Was der Mensch verstehen würde:**

"Haftpflicht ✓, Hausrat ✓. Reise, Cyber: nicht vorhanden."

**Distanz von Übersicht zu Synthese:** Die Lücken sichtbar machen.

---

## Rang 3: Behörden

**Die Lücke:** Zeitliche Einordnung.

**Warum sie relevant ist:**

- Die Steuerfrist ist ein Datenpunkt. "In 47 Tagen" ist eine Einordnung.
- Behörden ist das einzige Kapitel mit zeitkritischen Daten
- Ohne zeitliche Synthese ist die Frist nur eine Zahl im Kalender

**Was der Mensch heute sieht:**

"Steuererklärung fällig: 31.03.2027"

**Was der Mensch verstehen würde:**

"Nächste Frist in 9 Monaten. Nichts drängt."

**Distanz von Übersicht zu Synthese:** Datum in Zeitspanne umrechnen und mit einem Statuswort verbinden.

---

## Rang 4: Wohnen

**Die Lücke:** Wohnkostenanteil am Einkommen.

**Warum sie relevant ist:**

- "CHF 2'080 Wohnkosten" ist eine Zahl
- "38% des Einkommens" ist ein Verhältnis
- Das Verhältnis ist die Information, die Ordnung erzeugt — nicht die absolute Zahl
- Erfordert kapitelübergreifende Daten (Wohnen + Finanzen)

**Distanz von Übersicht zu Synthese:** Eine Division.

---

## Rang 5: Notfall

**Die Lücke:** Bedeutung statt Aufzählung.

**Warum sie anders ist:**

- Bei Finanzen fehlt eine Zahl
- Bei Versicherungen fehlt eine Liste
- Bei Behörden fehlt eine Zeitrechnung
- Bei Notfall fehlt eine Aussage

Die Notfall-Übersicht ist bereits die beste aller Kapitel. Sie zählt auf, was vorhanden ist. Sie wächst mit den Daten. Aber sie übersetzt nicht. "Kontaktperson hinterlegt" → "Deine Liebsten wissen, wen sie rufen sollen." Das ist keine Berechnung. Das ist Sprache.

**Distanz von Übersicht zu Synthese:** Nicht mathematisch. Sprachlich.

---

# E. Kapitel mit stärkster vorhandener Synthese

## Rang 1: Ausbildung

Der Lebenssatz "Kauffrau EFZ. Aktuell tätig als Sachbearbeiterin bei Müller AG." ist bereits eine Synthese. Er fasst zwei Datenquellen (Ausbildung + Beruf) in einer Aussage zusammen. Man liest ihn und versteht sein berufliches Profil.

Die Distanz zwischen Übersicht und Synthese ist bei Ausbildung fast null.

## Rang 2: Basis

"Sophie Stebler, geboren 1990, wohnhaft im Kanton Zürich. Ledig, lebt alleine."

Das ist Identität als Satz. Der Lebenssatz fasst 6 Datenpunkte in zwei Sätzen zusammen. Man liest ihn und weiss, wer man ist — im amtlichen Sinne.

## Rang 3: Wohnen

"Musterstrasse 12, 8000 Zürich. Wohndauer 5 Jahre. Monatsmiete CHF 1'800 plus CHF 280 Nebenkosten."

Die Wohndauer wird berechnet (Einzugsdatum → "5 Jahre"). Das ist eine echte Synthese — eine Information, die nicht eingegeben wurde, sondern aus den Daten entsteht. Und die Kosten werden addiert. Das sind zwei Berechnungen, die Maloja bereits macht.

## Rang 4: Notfall

Der gestaffelte Lebenssatz ist die klügste Lebenssatz-Logik. Er wächst: nur Kontakt → Kontakt + Arzt → Kontakt + Arzt + Vorsorge → Kontakt + Arzt + Vorsorge + Gesundheit. Er zeigt nicht nur Daten, sondern Fortschritt in der Vorsorge.

## Rang 5: Finanzen

Trotz der grössten Syntheselücke hat Finanzen eine beachtliche Vorleistung: Die Ausgabensumme ist eine kapitelübergreifende Berechnung. Sie addiert Felder aus Finanzen, Miete aus Wohnen und Prämie aus Versicherungen. Das ist die komplexeste bestehende Synthese.

Nur der letzte Schritt — die Subtraktion — fehlt.

---

# F. Empfehlung

## Die zentrale Frage

> Welche Aussage müsste ein Mensch lesen, damit er denkt: "Jetzt verstehe ich diesen Bereich meines Lebens"?

## Die Antworten

| Kapitel | Die Synthese-Aussage | Typ |
|---|---|---|
| **Basis** | "Sophie Stebler, geboren 1990, wohnhaft im Kanton Zürich." | Bereits vorhanden |
| **Wohnen** | "Dein Zuhause kostet CHF 2'080 im Monat — 38% deines Einkommens." | Division |
| **Finanzen** | "Es bleiben monatlich CHF 1'200." | Subtraktion |
| **Versicherungen** | "Grundversicherung, Haftpflicht, Hausrat: vorhanden. Reise, Cyber: nicht vorhanden." | Lücken sichtbar |
| **Ausbildung** | "Kauffrau EFZ. Sachbearbeiterin bei Müller AG." | Bereits vorhanden |
| **Behörden** | "Nächste Frist in 9 Monaten. Keine offenen Verfahren." | Zeitrechnung |
| **Notfall** | "Kontaktperson, Hausarzt und Patientenverfügung sind hinterlegt." | Bereits vorhanden (fast) |

## Die Synthesetypen

Drei verschiedene Arten von Synthese fehlen:

### 1. Mathematisch (Finanzen, Wohnen)

Eine Berechnung, die aus vorhandenen Zahlen eine neue Zahl erzeugt.

- Finanzen: Einkommen − Ausgaben = Differenz
- Wohnen: Wohnkosten / Einkommen = Prozentsatz

Die Daten liegen vor. Die Operationen sind trivial. Das Ergebnis verändert das Verständnis fundamental.

### 2. Komplementär (Versicherungen)

Nicht nur zeigen, was vorhanden ist, sondern auch, was fehlt.

Die Mirror Cards zeigen Zeilen mit Werten. Zeilen ohne Werte verschwinden. Die Synthese wäre: Auch die leeren Zeilen zeigen — als bewusste Lücke, nicht als Fehler.

### 3. Zeitlich (Behörden)

Ein Datum in eine Zeitspanne umrechnen.

"31.03.2027" → "In 9 Monaten." Das ist dieselbe Logik wie die Wohndauer-Berechnung, die Maloja bei Wohnen bereits macht. Nur in die Zukunft statt in die Vergangenheit.

### 4. Sprachlich (Notfall)

Von Aufzählung zu Bedeutung. Kein neuer Datenpunkt. Kein neues Feld. Nur ein anderer Satz.

"Kontaktperson hinterlegt" → "Wenn etwas passiert, ist eine Kontaktperson hinterlegt."

Die Verschiebung ist minimal. Ein Nebensatz. Aber er verschiebt den Fokus von "Was ist erfasst" zu "Wozu es gut ist."

## Die Reihenfolge

| Priorität | Kapitel | Warum |
|---|---|---|
| 1 | **Finanzen** | Grösste Lücke. Trivialste Berechnung. Stärkstes Ergebnis. |
| 2 | **Versicherungen** | Lücken sichtbar machen verändert das Verständnis von "alles gut" zu "etwas fehlt noch". |
| 3 | **Behörden** | Zeitliche Synthese nach dem Muster der existierenden Wohndauer-Berechnung. |
| 4 | **Wohnen** | Kapitelübergreifende Division. Nützlich, aber weniger dringend. |
| 5 | **Notfall** | Sprachliche Verschiebung. Die Übersicht ist bereits nahe an der Synthese. |

Basis und Ausbildung brauchen keine zusätzliche Synthese. Ihre Lebenssätze sind bereits Synthesen.

## Was sich NICHT ändern sollte

- Die Lebenssätze bleiben (sie sind die Grundlage)
- Die Mirror Cards bleiben (sie sind die Datenreihen)
- Keine Bewertungen ("gut" / "schlecht" / "Achtung")
- Keine Ratschläge ("Du solltest...")
- Keine Prognosen ("In 3 Jahren wirst du...")
- Keine Vergleiche ("Der Schweizer Durchschnitt ist...")
- Keine Gamification

## Der Massstab

Eine Synthese ist nicht eine Bewertung.

Eine Synthese ist eine Aussage, die aus vorhandenen Daten eine neue Erkenntnis erzeugt.

"CHF 5'400 Einkommen" ist ein Datenpunkt.  
"CHF 4'200 Ausgaben" ist ein Datenpunkt.  
"Es bleiben CHF 1'200" ist eine Synthese.

Der Mensch könnte die Subtraktion selbst machen. Aber dass er sie nicht machen muss — das ist der Dienst, den Ordnung leistet.

---

*Analyse erstellt am 2026-06-10. Keine Implementierung. Kein Commit.*
