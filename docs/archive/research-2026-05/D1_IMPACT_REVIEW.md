# D-1 IMPACT REVIEW — Typografie-Lift

> Erstellt: 2026-06-08
> Basiert auf: Code-Diff-Analyse (git diff HEAD~1), Token-Werte, Kapitel-Struktur
> Keine Implementierung. Keine Commits. Nur ehrliche Bewertung.

---

## Die Zahlen zuerst

### Was sich tatsächlich in Pixeln verändert hat

| Mapping | Stellen | Pixeleffekt | Sichtbarkeit |
|---------|---------|-------------|--------------|
| 10px → 11px (text.xs) | 44 | +1px | Subtil — Disclaimers, Mini-Buttons, Meta-Info |
| 12px → 13px (text.sm) | 46 | +1px | Spürbar — Labels, Trust-Hinweise, Sekundärtext |
| 13px → 13px (text.sm) | 150 | ±0px | **Null** — nur Token-Wechsel, kein Pixelwechsel |
| 14px → 15px (text.body) | 28 | +1px | **Spürbar** — Body-Text, h3-Headings, Inputs |
| 18px → 18px (text.lg) | 6 | ±0px | Null — nur Token-Wechsel |
| 36px → 36px (text['3xl']) | 1 | ±0px | Null — nur Token-Wechsel |

**Ehrliche Zusammenfassung:** Von 275 Änderungen bewegen **118 Stellen** tatsächlich Pixel (43%). Die restlichen 157 Stellen (57%) waren bereits bei der richtigen Grösse — dort wurde nur der Wert durch einen Token ersetzt.

Der grösste sichtbare Effekt kommt von 14px → 15px (28 Stellen), weil das Body-Text und Überschriften betrifft. Der Unterschied: +1px pro Zeile × alle Zeilen = weniger Zeilen pro Bildschirm = mehr Atemraum.

---

## A. Positive Effekte

### 1. Body-Text ist lesbarer (14px → 15px)

Die 28 Stellen, an denen Body-Text von 14px auf 15px wächst, betreffen:
- h3-Überschriften in SchuldenManager, TaxCalculator, OrganDonation, CalendarReminders
- Formulareingaben in BetaGate, Onboarding
- Inhaltstext in DocumentTresor, SozialhilfeView
- Tabellen-Totalzeilen in BudgetSync

Der Effekt ist real aber subtil: +1px vergrössert keine Schrift dramatisch. Aber es addiert sich — jede Zeile ist leicht grösser, jeder Absatz braucht leicht mehr Raum, die gesamte Informationsdichte sinkt minimal.

### 2. Labels und Sekundärtext sind lesbarer (12px → 13px)

46 Stellen betroffen. Das sind:
- Trust-Hinweise ("○ Deine Daten bleiben lokal")
- Datei-Infos im DocumentTresor
- Budget-Import-Hinweise
- CV-Generator Vorschau-Labels

12px ist grenzwertig lesbar auf Mobile. 13px ist komfortabler. Der Unterschied ist für Menschen mit normaler Sicht minimal — für Menschen über 40 oder in Stresssituationen (Schulden, Sozialhilfe) relevant.

### 3. Mini-Text ist weniger mikroskopisch (10px → 11px)

44 Stellen. Das sind die allerkleinsten Elemente:
- Kalender-Button-Labels (✓, ✕)
- Template-Recurrence-Info
- MobileNav-Labels
- Encryption-Hints im ZipExport
- Steuer-Abzug-Maxima

10px war grenzwertig zu klein. 11px ist immer noch sehr klein, aber die Lesbarkeit verbessert sich messbar.

### 4. Das Token-System funktioniert jetzt durchgängig

Der grösste Gewinn ist architektonisch: Alle 26 Komponenten nutzen jetzt Token-Referenzen. Eine Änderung in `tokens.js` (z.B. `body: 16` statt `body: 15`) würde sofort überall wirken. Vorher: 275 Stellen manuell ändern. Jetzt: 1 Zeile.

---

## B. Begrenzte Effekte

### 1. Das ChapterView-Formular hat sich kaum verändert

Die Formularfelder im ChapterView (die Haupt-Arbeitsfläche der App) hatten kaum hardcodierte Font-Sizes. Die Section-Labels waren bereits bei 13px, die Section Voices nutzten bereits `text.sm`. Nur 3 Stellen im ChapterView wurden geändert:
- Progressive Disclosure Hint: 10px → text.xs (11px)
- ChapterView trust line: 10px → text.xs (11px)
- Expiry date button: 14px → text.body (15px)

**Das bedeutet:** Die Zone, in der Maloja am meisten als "Formular" statt als "Ort" wirkt, hat von D-1 am wenigsten profitiert.

### 2. Der Dashboard hat sich fast nicht verändert

Nur 1 Stelle im Dashboard wurde geändert (14px → 15px für einen Navigations-Button). Die Berge, der Trail, die Stationen, die Easter Eggs — alles unberührt. Das Dashboard war vorher schon das stärkste Element. D-1 hat das nicht verändert.

### 3. Mobile-Effekt ist minimal

Auf 375px Breite ist der Unterschied zwischen 14px und 15px kaum wahrnehmbar. Die Formularfelder sind ohnehin volle Breite. Die Mini-Labels (10px → 11px) sind auf Mobile der spürbarste Gewinn, weil 10px auf einem kleinen Screen wirklich zu klein war.

### 4. Die 150 "Token-only"-Stellen verändern nichts Sichtbares

Mehr als die Hälfte aller Änderungen waren 13px → text.sm (13px). Kein Pixeleffekt. Das ist wertvolle Architekturarbeit, aber der Nutzer sieht nichts.

---

## C. Überraschungen

### 1. Die Proportionen haben sich nicht verschoben

Vorher: 10 / 12 / 13 / 14 / 18 / 36
Nachher: 11 / 13 / 13 / 15 / 18 / 36

Die Hierarchie bleibt dieselbe. Nichts hat sich "überholt". Kein Element, das vorher kleiner war, ist jetzt gleich gross wie ein anderes. Das war nicht garantiert — es hätte passieren können, dass 12px-Labels und 13px-Labels nach der Tokenisierung kollidieren. Sie tun es nicht, weil 12px und 13px beide auf text.sm (13px) gemappt wurden — sie waren immer dasselbe Level.

### 2. Die emotionale Wirkung ist geringer als erwartet

Die DESIGN_RECOVERY_MASTERPLAN beschreibt den Typografie-Lift als: "Die App spricht endlich in normaler Lautstärke." Das stimmt für einzelne Elemente (Body-Text, Labels). Aber die gesamte App fühlt sich nicht fundamental anders an. Der Unterschied zwischen 14px und 15px ist kein Paradigmenwechsel — es ist ein Feintuning.

### 3. Der grösste Gewinn ist unsichtbar

Die Tokenisierung selbst — 275 Stellen, die jetzt zentral steuerbar sind — ist der eigentlich grösste Gewinn. Wenn wir in D-2 oder D-4 die Typografie pro Kapitel differenzieren wollen (z.B. grösserer Body in Schulden/Sozialhilfe), ist das jetzt mit einer einzigen Token-Ergänzung möglich.

---

## D. Was D-1 nicht löst

### 1. Das Landschaftsproblem — überhaupt nicht

Die 10 Landschaftsqualitäten aus der LANDSCAPE_QUALITIES_REVIEW:

| Qualität | Effekt durch D-1 |
|----------|-----------------|
| Ruhe | Minimal — leicht weniger Dichte |
| Orientierung | Null |
| Weite | Minimal — +1px pro Zeile = winzig mehr Raum |
| Tiefe | Null |
| Sicherheit | Null |
| Rhythmus | Null |
| Materialität | Null |
| Naturfarbe | Null |
| Schweizer Identität | Null |
| Reaktivität | Null |

D-1 berührt **1 von 10 Qualitäten** minimal (Weite, durch grössere Schrift). Die anderen 9 sind unverändert.

### 2. Den Farbbruch — überhaupt nicht

95% beige/weiss/grau vor D-1. 95% beige/weiss/grau nach D-1. Kein einziger Sage-Wert wurde hinzugefügt.

### 3. Den Identitätsbruch — überhaupt nicht

Die Maloja-Identität endet weiterhin nach dem Kapitelheader. D-1 hat die Formularzone nicht in einen Ort verwandelt. Sie ist jetzt eine Formularzone mit leicht grösserem Text.

### 4. Die emotionale Gleichförmigkeit — überhaupt nicht

Alle 7 Kapitel sehen weiterhin identisch aus. Schulden hat die gleiche Typografie wie Basis. Notfall wie Ausbildung.

### 5. Die Tiefe — überhaupt nicht

Keine Schatten hinzugefügt. Keine Transparenzen. Die App ist weiterhin flach.

---

## E. Bewertung

### Einfluss auf die 6 Dimensionen

| Dimension | Effekt (0-5) | Begründung |
|-----------|-------------|------------|
| **Lesbarkeit** | **3** | Real, aber subtil. +1px ist kein Paradigmenwechsel, verbessert aber 118 Stellen messbar. |
| **Ruhe** | **1** | Minimal — weniger Dichte durch grössere Schrift. Aber die eigentlichen Unruhequellen (Feldlisten, fehlender Atemraum) sind unverändert. |
| **Orientierung** | **0** | Null. Keine Orientierungselemente hinzugefügt. |
| **Landschaftsgefühl** | **0** | Null. Keine Landschaftsqualität berührt. |
| **Schweizer Identität** | **0** | Null. Schriftgrösse hat keinen Einfluss auf Identität. |
| **Maloja-Gefühl** | **0.5** | Marginal. Die App wirkt leicht "erwachsener" durch grösseren Text. Aber sie wirkt nicht mehr nach Maloja. |

**Gesamteffekt: 4.5 / 30 (15%)**

### Pro Kapitel

| Kapitel | Profitiert? | Warum |
|---------|-------------|-------|
| Dashboard | ★☆☆☆☆ | War schon stark. 1 Stelle geändert. |
| Basis | ★★☆☆☆ | Formular-Labels leicht grösser. |
| Wohnen | ★★☆☆☆ | Formular-Labels leicht grösser. |
| Finanzen | ★★☆☆☆ | TaxCalculator deutlich lesbarer (viele 10px→11px, 14px→15px). |
| Versicherungen | ★☆☆☆☆ | Formularzone im ChapterView kaum betroffen. |
| Ausbildung | ★☆☆☆☆ | Wenige Felder, wenig Effekt. |
| Behörden | ★☆☆☆☆ | Formularzone kaum betroffen. |
| Notfall | ★★☆☆☆ | NotfallDossier lesbarer. |

**Am meisten profitieren:** Finanzen (TaxCalculator), DocumentTresor, CalendarReminders — die Tool-Views mit vielen kleinen Texten.

**Am wenigsten profitieren:** Dashboard, Versicherungen, Ausbildung, Behörden — die Views, die entweder schon gut waren oder deren Kernproblem nicht Typografie ist.

---

## F. Fazit

### Hat D-1 das Landschaftsproblem gelöst?

**Nein.**

D-1 hat das Typografieproblem gelöst. Hardcodierte Werte sind weg. Die Schriftskala ist durchgängig. Die Lesbarkeit ist besser. Das Token-System funktioniert.

Aber D-1 hat bestätigt — so klar wie möglich — dass das eigentliche Problem **nicht Typografie** ist.

Die App sieht nach D-1 nicht mehr nach Maloja aus als vorher. Sie sieht leicht lesbarer aus. Das ist wertvoll, aber es ist nicht das, was fehlt.

### Was fehlt, in Reihenfolge der Dringlichkeit

1. **Naturfarbe** — Sage-Flächen, die den Farbbruch heilen (95% beige → 70% beige + 20% sage)
2. **Tiefe** — Schatten, die Ebenen erzeugen (alles flat → Papier auf Tisch)
3. **Atemraum** — Grössere Sektionsabstände, nicht nur grössere Schrift
4. **Orientierung** — Pass-Referenz in Kapiteln ("Du bist bei Station 3")
5. **Rhythmus** — Sektionen, die sich unterscheiden (nicht alle gleich)

### Hat D-1 bestätigt, dass das eigentliche Problem "Landschaft statt Farbe" ist?

**Ja.**

D-1 hat bewiesen: Man kann die gesamte Typografie der App verbessern — und das Maloja-Gefühl ändert sich nicht. Weil Maloja-Gefühl nicht aus Schriftgrössen entsteht. Es entsteht aus Farbe, Tiefe, Rhythmus, Orientierung. Aus Landschaft.

---

## Empfehlung: Nächster Sprint

### Nicht: "Green Sprint"

### Sondern: "Landscape Continuity Sprint" (D-2)

**Begründung:**

"Green Sprint" würde bedeuten: Sage-Werte an möglichst vielen Stellen einsetzen. Das Ergebnis wäre eine grünere Verwaltungs-App.

"Landscape Continuity Sprint" bedeutet: Die Qualitäten des Malojapass in die Kapitel tragen — **gleichzeitig** Farbe (sage-mist Flächen), Tiefe (Schatten auf Karten), und Atemraum (grössere Sektionsabstände).

### Was D-2 "Landscape Continuity" enthalten sollte

| Änderung | Qualitäten | Risiko |
|----------|-----------|--------|
| Sage-Familie in LIGHT_PALETTE + DARK_PALETTE definieren (mist, dew, deep, dark) | Architektur-Grundlage | Niedrig |
| Kapitelheader Background: sage-mist statt palette.up | Naturfarbe ★★★★★ | Niedrig |
| MirrorCards: sage-dew Tint | Naturfarbe ★★★, Tiefe ★★ | Niedrig |
| Sektions-Trennungen: sage-mist Band statt border-top | Naturfarbe ★★★, Rhythmus ★★★ | Niedrig |
| shadow.md auf MirrorCards + Sektionsheader | Tiefe ★★★★★, Materialität ★★★★ | Niedrig |
| Sektions-Abstände vergrössern (36px → 48px) | Weite ★★★★, Rhythmus ★★★ | Niedrig |
| Empty States in sage-mist | Naturfarbe ★★★ | Niedrig |

### Was D-2 NICHT enthalten sollte

- Keine neuen Features
- Keine Datenänderungen
- Keine Pass-Referenz in Kapiteln (das ist D-5 — braucht mehr Design-Arbeit)
- Keine emotionale Differenzierung (das ist D-4)
- Keine Micro-Feedback-Animationen (das ist D-5)

### Erwarteter Effekt von D-2

| Dimension | D-1 Effekt | D-2 Erwartung |
|-----------|-----------|---------------|
| Lesbarkeit | 3 | 3 (unverändert) |
| Ruhe | 1 | 3 (Atemraum + weichere Farben) |
| Orientierung | 0 | 1 (Sage-mist gibt Kapitelidentität) |
| Landschaftsgefühl | 0 | **4** (Sage-Flächen + Schatten = Ort) |
| Schweizer Identität | 0 | 2 (Sage = Alp-Farbe) |
| Maloja-Gefühl | 0.5 | **3.5** (erstmals Farb-Echo der Berge in Kapiteln) |

**Erwarteter Gesamteffekt: 16.5 / 30 (55%)** — mehr als dreimal so viel wie D-1.

---

### Schlusswort

D-1 war richtig und notwendig. Die Tokenisierung ist eine Voraussetzung für alles Weitere. Die Lesbarkeit hat sich verbessert. Das Token-System funktioniert.

Aber D-1 hat bewiesen, was die Analyse vorhergesagt hat:

**Typografie allein macht keine Landschaft.**

Die App spricht jetzt in normaler Lautstärke. Aber sie spricht immer noch in einem leeren Raum. Der Raum braucht Wände (Sage-Flächen), Boden (Schatten), und Aussicht (Atemraum).

Das ist D-2.
