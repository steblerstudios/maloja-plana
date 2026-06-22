# Financial Difference Review

**Projekt:** Maloja Plana  
**Datum:** 2026-06-14  
**Grundlage:** E-14 Decision Review, D-07 Order & Completion, E-10 Enough, E-11 Transformation, E-12 Pattern  
**Scope:** E-15

---

# A. Bestandsaufnahme: Was existiert

---

## Die Felder

Maloja erfasst heute 21 Felder im Kapitel Finanzen. Davon sind für die Differenz relevant:

### Einnahmen

| Feld | Key | Typ | MVO | Kapitel |
|---|---|---|---|---|
| Monatseinkommen | `monthlyIncome` | currency | ja | Finanzen |
| Familienzulagen | `familienzulagen` | currency | nein | Finanzen |
| Erhaltene Alimente | `alimenteReceived` | currency | nein | Finanzen |

### Ausgaben (Kapitel Finanzen)

| Feld | Key | Typ |
|---|---|---|
| Steuern monatlich | `monthlyTax` | currency |
| Lebensmittel | `groceries` | currency |
| Kommunikation | `communication` | currency |
| Mobilität | `mobility` | currency |
| Weitere Versicherungen | `otherInsurance` | currency |
| Schuldenraten | `debtPayments` | currency |
| Bezahlte Alimente | `alimentePaid` | currency |

### Ausgaben (andere Kapitel)

| Feld | Key | Typ | Kapitel |
|---|---|---|---|
| Miete | `rentAmount` | currency | Wohnen |
| Nebenkosten | `utilities` | currency | Wohnen |
| Krankenkassenprämie | `kkPremium` | currency | Versicherungen |

---

## Was heute berechnet wird

Die Funktion `sumExpenses()` in [MirrorCards.jsx:180](src/MirrorCards.jsx:180) summiert bereits:

```
monthlyTax + groceries + communication + mobility + otherInsurance
+ rentAmount (Wohnen) + utilities (Wohnen)
+ kkPremium (Versicherungen)
```

**Nicht enthalten** in `sumExpenses()`:
- `debtPayments` (Schuldenraten)
- `alimentePaid` (Bezahlte Alimente)

Diese werden in `buildFinanzenSections()` separat unter "Verpflichtungen" aufgeführt.

---

## Was heute angezeigt wird

Der Lebenssatz ([MirrorCards.jsx:197](src/MirrorCards.jsx:197)) zeigt:

1. "CHF 5'400 monatlich bei [Arbeitgeber]."
2. "Erfasste Ausgaben: CHF 4'200."
3. Optional: "Offene Kredite: CHF 15'000."

**Was fehlt:** Die Differenz. Der Satz, der sagt, was übrig bleibt.

Die Daten sind da. Die Summe wird berechnet. Aber das Ergebnis — die eine Zahl, die die Lebensfrage "Reicht es?" beantwortet — wird nie gezeigt.

---

# B. Was die Differenz braucht

---

## Minimale Voraussetzung

Die Differenz braucht genau zwei Zahlen:
- **Einnahmen:** mindestens `monthlyIncome`
- **Ausgaben:** mindestens eine erfasste Ausgabe

Ohne Einkommen: keine Differenz. Das ist korrekt — ohne Einkommen gibt es keine Antwort auf "Reicht es?"

Ohne Ausgaben: Die Differenz wäre gleich dem Einkommen. Das ist mathematisch korrekt, aber inhaltlich nutzlos. "Es bleiben CHF 5'400" — wenn keine einzige Ausgabe erfasst ist — sagt nichts.

**Schwellenwert:** Die Differenz sollte erst erscheinen, wenn mindestens eine Ausgabe erfasst ist. Nicht alle. Eine.

---

## Die Berechnung

### Variante 1: Einfach (nur `monthlyIncome` minus `sumExpenses`)

```
Einnahmen:  monthlyIncome
Ausgaben:   monthlyTax + groceries + communication + mobility + otherInsurance
            + rentAmount + utilities + kkPremium
────────────────────────────────────
Differenz:  Einnahmen − Ausgaben
```

**Vorteil:** Nutzt die bestehende `sumExpenses()`-Funktion. Kein neuer Code für die Summierung.

**Nachteil:** Ignoriert Familienzulagen, erhaltene Alimente (Einnahmen) und Schuldenraten, bezahlte Alimente (Ausgaben). Die Differenz wäre für Menschen mit diesen Posten ungenau.

---

### Variante 2: Vollständig (alle monetären Felder)

```
Einnahmen:  monthlyIncome + familienzulagen + alimenteReceived
Ausgaben:   monthlyTax + groceries + communication + mobility + otherInsurance
            + rentAmount + utilities + kkPremium
            + debtPayments + alimentePaid
────────────────────────────────────
Differenz:  Einnahmen − Ausgaben
```

**Vorteil:** Korrektere Zahl. Berücksichtigt die reale Situation von Alleinerziehenden (Alimente), Familien (Zulagen) und Menschen mit Schulden.

**Nachteil:** Leicht mehr Komplexität in der Berechnung. Aber: trivial — es sind drei zusätzliche Additionen.

---

### Variante 3: Gestaffelt (wächst mit den Daten)

Wie Variante 2, aber die Differenz zeigt immer die aktuelle Wahrheit. Wenn nur Einkommen und Miete erfasst sind, zeigt sie Einkommen − Miete. Wenn später Steuern dazukommen, passt sich die Differenz an.

**Vorteil:** Der Mensch sieht sofort eine Zahl, die mit ihm wächst.

**Nachteil:** Keiner. Das ist mathematisch korrekt. Die Differenz ist immer Einnahmen − (bisher erfasste Ausgaben). Sie wird genauer, je mehr der Mensch eingibt. Aber sie ist nie falsch.

---

### Empfehlung: Variante 3

Variante 3 ist Variante 2 — nur mit der richtigen Haltung. Keine Ausgabe wird erfunden. Keine Ausgabe wird geschätzt. Was erfasst ist, wird subtrahiert. Was nicht erfasst ist, wird ignoriert. Die Differenz zeigt: "Das ist, was nach den von dir erfassten Ausgaben übrig bleibt."

Das ist keine Schwäche. Das ist Ehrlichkeit. Und Ehrlichkeit ist das Grundprinzip von Maloja.

---

## Was nicht in die Differenz gehört

- **Sparziel** (`savingsGoal`): Ist eine Absicht, keine Ausgabe. Wenn man es subtrahiert, beurteilt man — "Du solltest sparen." Maloja beurteilt nicht.
- **Kontostand** (`savingsAccount`): Ist Vermögen, kein monatlicher Fluss. Gehört nicht in eine monatliche Rechnung.
- **Kredite** (`loans`): Ist eine Schuld (Bestand), keine monatliche Ausgabe. Die monatliche Rate ist `debtPayments` — die gehört dazu.
- **Vorsorge 3a** (`pension3a`): Ist ein Jahresbeitrag, kein Monatsbetrag. Die Umrechnung (÷12) wäre eine Interpretation, kein Fakt.
- **Vorsorge 3b, Investmentfonds**: Select-Felder (ja/nein), keine Beträge. Nicht rechenbar.

---

# C. Die Formulierung

---

## Was der Satz leisten muss

Aus E-12 (Pattern Review), die fünf Muster:

1. **Neues erzeugen** — nicht wiederholen, was eingegeben wurde
2. **Nicht bewerten** — keine Adjektive, keine Empfehlung
3. **Bestehende Frage beantworten** — "Reicht es?"
4. **Kurz sein** — fünf Wörter, nicht fünfzig
5. **Gestalt verändern** — das innere Bild des Menschen verändert sich

---

## Varianten

### Variante A: "Es bleiben CHF 1'200."

Vier Wörter. Subjekt ist "es" — unpersönlich, neutral. Kein "du", kein "dein", kein "dir". Die Zahl steht im Zentrum. Alles andere ist Rahmen.

**Stärke:** Maximale Kürze. Maximale Neutralität. Die Formulierung sagt nicht, ob 1'200 viel oder wenig ist. Sie sagt nur: Das ist die Zahl.

**Schwäche:** "Es bleiben" impliziert, dass die Zahl positiv ist. Was, wenn die Differenz negativ ist?

---

### Variante B: "Monatlich bleiben CHF 1'200."

Fünf Wörter. Wie A, aber mit Zeitangabe. Macht explizit, dass es um einen monatlichen Betrag geht.

**Stärke:** Keine Ambiguität. Der Mensch weiss sofort: Das ist pro Monat.

**Schwäche:** "Monatlich" ist redundant. Die gesamte Finanzübersicht handelt von monatlichen Beträgen. Der Kontext macht es klar.

---

### Variante C: "Einkommen CHF 5'400, Ausgaben CHF 4'200. Es bleiben CHF 1'200."

Zeigt die Rechnung. Nicht nur das Ergebnis.

**Stärke:** Nachvollziehbar. Der Mensch sieht, woher die Zahl kommt. Kein Verdacht auf Magie oder Fehler.

**Schwäche:** Lang. Wiederholt, was bereits in den Sektionen steht. Widerspricht Muster 1 (Neues erzeugen) — die Einnahmen und Ausgaben sind bereits sichtbar.

---

### Variante D: "Differenz: CHF 1'200"

Drei Wörter. Technisch. Wie ein Kontoauszug.

**Stärke:** Maximal nüchtern.

**Schwäche:** "Differenz" ist ein mathematischer Begriff. Nicht die Sprache, in der ein Mensch über sein Geld denkt. Man denkt: "Was bleibt?" — nicht: "Was ist die Differenz?"

---

### Der negative Fall

Wenn Ausgaben > Einnahmen:

| Variante | Negativ |
|---|---|
| A | "Es fehlen CHF 300." |
| B | "Monatlich fehlen CHF 300." |
| C | "Einkommen CHF 5'400, Ausgaben CHF 5'700. Es fehlen CHF 300." |
| D | "Differenz: −CHF 300" |

"Es fehlen" ist korrekt und nicht wertend. Es ist eine Feststellung. Kein "Du hast ein Problem." Kein "Das reicht nicht." Nur: "CHF 300 fehlen."

---

### Der Nullfall

Wenn Einnahmen = Ausgaben:

| Variante | Null |
|---|---|
| A | "Es bleibt nichts übrig." |
| B | "Monatlich bleibt nichts übrig." |
| C | "Einkommen CHF 5'400, Ausgaben CHF 5'400. Es bleibt nichts übrig." |
| D | "Differenz: CHF 0" |

---

### Empfehlung: Variante A

"Es bleiben CHF 1'200."

Vier Wörter. Beantwortet "Reicht es?" Die Bewertung bleibt beim Menschen. Der negative Fall ("Es fehlen CHF 300") folgt derselben Logik — neutral, kurz, ohne Urteil.

Variante C (mit Rechnung) wäre die zweitbeste — aber die Rechnung steht bereits in den Mirror-Card-Sektionen. Sie im Lebenssatz zu wiederholen, wäre ein Echo, keine Synthese.

---

# D. Wo die Differenz erscheinen soll

---

## Drei mögliche Orte

### Ort 1: Im Lebenssatz (buildFinanzenSentence)

Der Lebenssatz wird auf dem Dashboard und in der Mirror Card angezeigt. Er ist der prominenteste Ort.

**Aktuell:**
> "CHF 5'400 monatlich bei Müller AG. Erfasste Ausgaben: CHF 4'200."

**Mit Differenz:**
> "CHF 5'400 monatlich bei Müller AG. Erfasste Ausgaben: CHF 4'200. Es bleiben CHF 1'200."

**Bewertung:** Der natürlichste Ort. Der Lebenssatz ist bereits die Synthese des Kapitels. Die Differenz ist die fehlende Schlussfolgerung dieses Satzes. Alles andere — Einkommen, Ausgaben — ist Vorbereitung. Die Differenz ist das, worauf der Satz hinarbeitet.

---

### Ort 2: Als eigene Zeile in den Mirror-Card-Sektionen (buildFinanzenSections)

Die Mirror Card hat heute drei Sektionen: Einkommen, Ausgaben, Verpflichtungen. Die Differenz wäre eine vierte — oder eine Schlusszeile nach den Ausgaben.

**Bewertung:** Sinnvoll als Ergänzung. Aber nicht als einziger Ort. Die Mirror Card ist Detail. Der Lebenssatz ist Essenz. Die Differenz gehört in die Essenz.

---

### Ort 3: Auf dem Dashboard als eigenständige Synthese

Eine separate Zeile auf dem Dashboard, ausserhalb des Lebenssatzes.

**Bewertung:** Zu prominent. Eine einzelne Zahl auf dem Dashboard — ohne den Kontext der anderen Finanzdaten — wirkt wie ein KPI. Maloja ist kein Dashboard. Maloja ist ein Spiegel.

---

### Empfehlung: Ort 1 + Ort 2

**Primär:** Im Lebenssatz. Dort hat die Differenz die grösste Wirkung — als Abschluss der Finanzgeschichte, die der Lebenssatz erzählt.

**Sekundär:** Als Schlusszeile in den Mirror-Card-Sektionen. Dort ist sie nachprüfbar — der Mensch sieht die Posten darüber und kann die Rechnung nachvollziehen.

---

# E. Die vollständige Berechnung

---

## Formel

```
totalIncome   = monthlyIncome
              + familienzulagen          (falls erfasst)
              + alimenteReceived         (falls erfasst)

totalExpenses = monthlyTax               (falls erfasst)
              + groceries                (falls erfasst)
              + communication            (falls erfasst)
              + mobility                 (falls erfasst)
              + otherInsurance           (falls erfasst)
              + debtPayments             (falls erfasst)
              + alimentePaid             (falls erfasst)
              + wohnen.rentAmount        (falls erfasst)
              + wohnen.utilities         (falls erfasst)
              + versicherungen.kkPremium (falls erfasst)

difference    = totalIncome − totalExpenses
```

## Bedingungen

- Differenz erscheint nur, wenn `monthlyIncome > 0` UND `totalExpenses > 0`
- Kein Minimum an Ausgabeposten. Eine einzige reicht. Denn: Wenn jemand nur Miete und Einkommen erfasst hat, ist "Es bleiben CHF 3'900" bereits eine Antwort — eine unvollständige, aber ehrliche.

## Formatierung

- Positiv: "Es bleiben CHF 1'200."
- Negativ: "Es fehlen CHF 300."
- Null: "Es bleibt nichts übrig."
- Immer gerundet auf ganze Franken (kein Rappen-Betrag bei geschätzten Werten).

---

# F. Was sich ändert im Code

---

Drei Stellen:

## 1. `sumExpenses()` erweitern

Bestehende Funktion in [MirrorCards.jsx:180](src/MirrorCards.jsx:180). Muss `debtPayments` und `alimentePaid` einschliessen.

Alternativ: Neue Funktion `sumAllExpenses()`, die `sumExpenses()` plus Verpflichtungen zusammenfasst. Damit bleibt `sumExpenses()` für den bestehenden "Erfasste Ausgaben"-Satz unverändert.

**Empfehlung:** Neue Funktion. Die bestehende nicht anfassen — sie wird vom "Erfasste Ausgaben"-Text verwendet, der Verpflichtungen bewusst separat zeigt.

## 2. `buildFinanzenSentence()` ergänzen

Bestehende Funktion in [MirrorCards.jsx:197](src/MirrorCards.jsx:197). Nach dem Ausgaben-Satz: Differenz-Satz anfügen.

## 3. `buildFinanzenSections()` ergänzen

Bestehende Funktion in [MirrorCards.jsx:568](src/MirrorCards.jsx:568). Schlusszeile nach der letzten Sektion: Differenz als eigene Zeile, visuell abgesetzt (fett oder mit leichtem Abstand).

## Nicht anfassen

- Keine neuen Felder
- Keine neuen Kapitel
- Keine neue i18n-Struktur (nur neue Keys in bestehender Struktur)
- Keine Änderung am Dashboard-Layout
- Keine Änderung an der Kapitelansicht
- Kein neuer State

---

# G. Zusammenfassung

---

| Frage | Antwort |
|---|---|
| Welche Felder? | 3 Einnahmen + 10 Ausgaben (davon 3 aus anderen Kapiteln) |
| Welche Formel? | totalIncome − totalExpenses |
| Welche Bedingung? | monthlyIncome > 0 UND mindestens eine Ausgabe > 0 |
| Welche Formulierung? | "Es bleiben CHF X." / "Es fehlen CHF X." |
| Wo anzeigen? | Lebenssatz (primär) + Mirror-Card-Schlusszeile (sekundär) |
| Was ändert sich im Code? | 3 Stellen in MirrorCards.jsx |
| Was ändert sich nicht? | Alles andere |
| Neues Risiko? | Keines. Nachvollziehbare Mathematik. Keine Bewertung. |

---

Die Finanzdifferenz ist die einfachste bedeutsame Änderung, die Maloja machen kann.

Nicht weil Subtrahieren einfach ist. Sondern weil die Daten, die Frage und die Antwort bereits existieren — nur die Brücke zwischen ihnen fehlt.
