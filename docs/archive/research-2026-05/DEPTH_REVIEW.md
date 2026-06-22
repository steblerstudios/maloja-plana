# Depth Review

**Projekt:** Maloja Plana
**Datum:** 2026-06-13
**Grundlage:** D-1 bis D-22, Quellcode-Analyse (constants.js)

---

# Drei Wörter

**Ordnung** ist: "Meine Dinge stehen an einem Ort."

**Übersicht** ist: "Ich sehe, wie mein Leben aussieht."

**Tiefe** ist: "Ich verstehe, warum mein Leben so aussieht."

---

Ordnung braucht Felder. Jedes Feld, das ausgefüllt wird, legt etwas an seinen Platz.

Übersicht braucht Lebenssätze. Der Lebenssatz fasst zusammen, was da liegt.

Tiefe braucht Zusammenhänge. Die Verbindung zwischen dem, was da liegt.

---

D-22 zeigt: 18 Felder erzeugen Ordnung und Übersicht. Sieben Lebenssätze. Sechs Minuten.

Die Frage dieses Reviews ist: Was erzeugen die restlichen 99 Felder?

---

# A. Ordnung vs Tiefe

---

## Was die ersten 18 Felder erzeugen

| Kapitel | Minimum-Felder | Was entsteht |
|---|---|---|
| Basis | firstName, lastName, dateOfBirth, canton | "Wer bin ich?" |
| Wohnen | city, rentAmount, residenceType | "Wo wohne ich?" |
| Finanzen | monthlyIncome, employmentType | "Was verdiene ich?" |
| Versicherungen | kkInsurer, kkPremium | "Wo bin ich versichert?" |
| Ausbildung | jobTitle, educationLevel | "Was mache ich?" |
| Behörden | cantoneOfTaxation | "Wo bin ich steuerpflichtig?" |
| Notfall | emergencyContact, emergencyPhone, allergies | "Wer wird angerufen?" |

Das sind sieben Antworten auf sieben Fragen. Jede Antwort ist ein Satz. Zusammen ergeben sie: einen Menschen, skizziert in sieben Strichen.

Das ist Ordnung. Und es ist Übersicht.

Aber es ist nicht Tiefe.

---

## Wann wird aus Ordnung Tiefe?

Ordnung wird zu Tiefe, wenn ein Feld nicht nur einen Fakt dokumentiert, sondern einen Zusammenhang sichtbar macht.

**Beispiel — kein Zusammenhang:**
- "AHV-Nummer: 756.1234.5678.97"
- Das ist ein Fakt. Er dokumentiert eine Nummer. Er erzeugt keine Erkenntnis. Der Mensch wusste vorher, dass er eine AHV-Nummer hat. Jetzt steht sie in einem Feld. Ordnung. Keine Tiefe.

**Beispiel — Zusammenhang:**
- "Monatliches Einkommen: CHF 5'400" + "Miete: CHF 1'850" + "Krankenkasse: CHF 380" + "Steuern: CHF 450" + "Lebensmittel: CHF 650"
- Zusammen: "Dir bleiben CHF 2'070 pro Monat."
- Das ist Tiefe. Kein einzelnes Feld erzeugt diese Erkenntnis. Erst die Kombination zeigt, was der Mensch vorher nicht wusste — oder wusste, aber nie ausgerechnet hat.

---

## Die Regel

**Ein Feld erzeugt Ordnung, wenn es einen Fakt dokumentiert.**

**Ein Feld erzeugt Tiefe, wenn es zusammen mit anderen Feldern eine Erkenntnis ermöglicht, die ohne die Kombination nicht existiert.**

---

## Was das für die 99 verbleibenden Felder bedeutet

Jedes der 99 Felder fällt in eine von vier Kategorien:

1. **Tiefe-Felder:** Ermöglichen Zusammenhänge und Erkenntnisse (zusammen mit anderen Feldern)
2. **Sicherheits-Felder:** Dokumentieren Fakten, die in einer Krise lebenswichtig sind
3. **Ordnungs-Felder:** Dokumentieren Fakten, die an einem Ort stehen sollten
4. **Ballast-Felder:** Dokumentieren Fakten, die selten gebraucht werden und hohen Aufwand erfordern

---

# B. Die wertvollsten Felder nach den ersten 18

---

## Rang 1: Budget-Felder (Finanzen) — Tiefe

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| monthlyTax | "Meine Steuern sind CHF 450" | Ausgaben-Summe |
| groceries | "Lebensmittel: CHF 650" | Ausgaben-Summe |
| mobility | "Mobilität: CHF 100" | Ausgaben-Summe |
| communication | "Kommunikation: CHF 80" | Ausgaben-Summe |

**Allein:** Jedes Feld ist ein einzelner Fakt. Ordnung.

**Zusammen (+ monthlyIncome + rentAmount + kkPremium):** Die Finanzdifferenz. "Dir bleiben CHF X." Tiefe.

Diese vier Felder verwandeln den Lebenssatz "Monatliches Einkommen CHF 5'400" in die Synthese "Dir bleiben CHF 2'070." Das ist der grösste Erkenntnissprung im ganzen Produkt.

**Aufwand:** Hoch. Alle vier sind Schätzwerte. D-18 zeigt: Schätzwerte erzeugen Unbehagen ("Ich weiss nicht genau, wie viel").

**Lohnt sich der Aufwand?** Ja. Weil die Synthese die drängendste Frage beantwortet. Vier Schätzfelder für eine existenzielle Antwort.

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★★★★ | ★★★ | Sehr lohnend |

---

## Rang 2: Notfall-Medizinfelder — Sicherheit + Tiefe

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| medications | "Blutverdünner, Metformin" | Medizinisches Gesamtbild |
| chronicDiseases | "Diabetes Typ 2" | Medizinisches Gesamtbild |
| bloodType | "A+" | Notfallkarte |
| doctor | "Dr. Meier" | Anlaufstelle |
| doctorPhone | "+41 44 123 45 67" | Erreichbarkeit |

**Allein:** Einzelne medizinische Fakten.

**Zusammen (+ emergencyContact + allergies):** Ein vollständiges Notfallprofil. "Sophie Stebler, A+, Diabetes, nimmt Metformin und Blutverdünner, keine Allergien. Hausarzt: Dr. Meier, +41 44 123 45 67. Im Notfall: Maria Stebler anrufen."

Das ist nicht Ordnung. Das ist nicht Übersicht. Das ist Tiefe — die Tiefe der Vorsorge. "Wenn mir etwas passiert, weiss jemand alles, was er wissen muss."

**Aufwand:** Gering bis mittel. medications und chronicDiseases sind Kopf-Wissen. bloodType erfordert manchmal Nachschauen.

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★★★★ | ★★ | Sehr lohnend |

---

## Rang 3: Schulden- und Verpflichtungsfelder (Finanzen) — Tiefe

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| debtPayments | "Schuldenrate: CHF 450" | Belastungsbild |
| alimentePaid | "Alimente: CHF 800" | Belastungsbild |
| alimenteReceived | "Alimente erhalten: CHF 600" | Einkommensbild |
| loans | "Darlehen: CHF 12'000" | Schuldenbild |

**Allein:** Unangenehme Fakten. Emotional belastend (D-20).

**Zusammen:** Die Wahrheit über die finanzielle Belastung. "Dein Einkommen ist 5'400. Deine Fixkosten sind 4'230. Davon 450 Schuldenrate und 800 Alimente. Dir bleiben 1'170."

Das verändert das Verständnis. Von "Ich verdiene 5'400" zu "Mir bleiben 1'170." Die Schulden- und Verpflichtungsfelder verwandeln das Einkommensbild in ein Belastungsbild. Das ist unbequem. Aber es ist Tiefe.

**Aufwand:** Emotional hoch (D-20: Energiekosten 0 bis -5 pro Feld). Kognitiv gering (die Beträge kennt man).

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★★★ | ★★★★ (emotional) | Lohnend, aber schmerzhaft |

---

## Rang 4: Franchise + KK-Modell (Versicherungen) — Tiefe

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| franchise | "Franchise: CHF 2'500" | Risikoprofil |
| kkModel | "Hausarztmodell" | Kostensituation |

**Allein:** Einzelne Versicherungsfakten.

**Zusammen (+ kkPremium):** "Grundversichert bei CSS, Hausarztmodell, CHF 380 pro Monat, Franchise CHF 2'500. Das bedeutet: Im Krankheitsfall zahlst du zuerst CHF 2'500 selbst."

Die Franchise verändert das Verständnis der Versicherungssituation. "380 pro Monat" klingt überschaubar. "380 pro Monat plus 2'500 im Krankheitsfall" verändert die Rechnung.

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★★ | ★★ | Lohnend |

---

## Rang 5: Vorsorge-Felder (Notfall/Behörden) — Tiefe

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| patientenverfuegung | "Ja / Nein / Nicht sicher" | Vorsorge-Status |
| vorsorgeauftrag | "Ja / Nein" | Vorsorge-Status |
| willMade | "Ja / Nein" | Rechtliche Vorsorge |
| bestattungswuensche | "Erdbestattung / Kremation / ..." | Letzte Wünsche |

**Allein:** Ja/Nein-Antworten. Fakten.

**Zusammen:** Ein Vorsorge-Spiegel. "Patientenverfügung: Nein. Vorsorgeauftrag: Nein. Testament: Nein. Bestattungswünsche: nicht festgelegt."

Vier Mal "Nein." Das ist Tiefe — die unangenehme Art. Der Mensch sieht: "Ich habe nichts geregelt." Und diese Erkenntnis ist unbequem, aber wertvoll. Sie ist der Anstoss, etwas zu tun.

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★★★ | ★★ (emotional ★★★★) | Lohnend. Konfrontativ. |

---

## Rang 6: Wohnkosten-Details — Ordnung + leichte Tiefe

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| utilities | "Nebenkosten: CHF 250" | Wohn-Gesamtkosten |
| address | "Musterstrasse 12" | Vollständige Adresse |
| postalCode | "8001" | Vollständige Adresse |

**Zusammen (+ rentAmount + city):** "Mietwohnung, Musterstrasse 12, 8001 Zürich. Miete CHF 1'850 plus Nebenkosten CHF 250. Gesamte Wohnkosten: CHF 2'100."

Von "Miete 1'850" zu "Wohnkosten 2'100" — ein Schritt mehr Tiefe. Die Nebenkosten verschwinden gern im Kopf. Sie sichtbar zu machen verändert die Rechnung leicht.

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★ | ★ | Lohnend (niedrige Hürde) |

---

## Rang 7: Haushalt + Zivilstand (Basis) — Ordnung + Kontext

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| maritalStatus | "Geschieden" | Lebenssituation |
| household | "1 Erwachsene, 2 Kinder" | Haushaltsstruktur |
| nationality | "Eritrea" | Migrationshintergrund |

**Zusammen (+ firstName, canton):** "Sophie Stebler, eritreische Staatsangehörigkeit, geschieden, 1 Erwachsene und 2 Kinder, wohnhaft im Kanton Zürich."

Von "Sophie Stebler, Kanton Zürich" zu "Sophie Stebler, eritreische Staatsangehörigkeit, geschieden, mit zwei Kindern, Kanton Zürich." Das ist ein anderer Mensch. Oder: derselbe Mensch, tiefer gesehen.

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★★ | ★ | Sehr lohnend |

---

## Rang 8: Arbeitsbewilligung + Sprachen (Ausbildung) — Kontext

| Feld | Was es allein erzeugt | Was es zusammen erzeugt |
|---|---|---|
| workPermit | "B-Bewilligung" | Aufenthaltsstatus |
| languages | "Tigrinya, Deutsch (A2), Englisch (B1)" | Sprachliche Realität |

**Zusammen:** Für die Zielperson (D-16) sind das die Felder, die ihr Leben definieren. B-Bewilligung bedeutet: befristet. Deutsch A2 bedeutet: Formulare sind eine Qual. Die Kombination von workPermit + languages erzeugt ein Bild, das kein einzelnes Feld erzeugen kann.

| Tiefengewinn | Aufwand | Verhältnis |
|---|---|---|
| ★★★ | ★ | Lohnend |

---

# C. Die grössten Ballastfelder

---

Ballast bedeutet: hoher Aufwand, geringe Erkenntnis, kein Zusammenhang mit anderen Feldern.

---

## Kategorie 1: Nummern-Felder (reiner Nachschlagewert)

| Feld | Kapitel | Aufwand | Erkenntnis | Zusammenhang |
|---|---|---|---|---|
| ahv | Basis | ★★★★ | 0 | 0 |
| taxId | Behörden | ★★★★ | 0 | 0 |
| kkCardNumber | Versicherungen | ★★★★ | 0 | 0 |
| efzNumber | Ausbildung | ★★★ | 0 | 0 |

Diese vier Felder haben eine Gemeinsamkeit: Sie dokumentieren administrative Nummern. Der Mensch muss sie nachschlagen. Und nachdem er sie eingetippt hat, weiss er genau so viel wie vorher — nämlich, dass er eine Nummer hat.

Sie erzeugen keine Ordnung (die Nummer lag vorher auch irgendwo). Sie erzeugen keine Übersicht (eine Nummer ist kein Überblick). Sie erzeugen keine Tiefe (eine Nummer hat keinen Zusammenhang).

Was sie erzeugen: Verfügbarkeit. "Wenn ich die AHV-Nummer brauche, finde ich sie hier." Das hat Wert — aber erst in dem Moment, in dem man sie braucht. Nicht beim Ausfüllen.

**Urteil: Ballast beim ersten Besuch. Nützlich beim dritten.**

---

## Kategorie 2: Detailfelder für Nischensituationen

| Feld | Kapitel | Für wen relevant | Für alle anderen |
|---|---|---|---|
| mortgageStatus | Wohnen | Eigenheimbesitzer (~35%) | Irrelevant |
| propertyValue | Wohnen | Eigenheimbesitzer | Irrelevant |
| buildingsInsurance | Wohnen | Eigenheimbesitzer | Irrelevant |
| autoInsurance | Versicherungen | Autobesitzer (~50%) | Irrelevant |
| autoInsuranceAmount | Versicherungen | Autobesitzer | Irrelevant |
| travelInsurance | Versicherungen | Wenige | Irrelevant |
| cyberInsurance | Versicherungen | Sehr wenige | Irrelevant |
| pension3a | Finanzen | Vorsorge-Bewusste | Irrelevant |
| pension3b | Finanzen | Wenige | Irrelevant |
| investmentFunds | Finanzen | Anleger | Irrelevant |

Diese Felder betreffen Situationen, die nicht jeden betreffen. Eigenheim, Auto, Reiseversicherung, Cyber, Anlagefonds. Für den betroffenen Menschen sind sie relevant. Für alle anderen: leeres Feld, übersprungene Frage, verbrauchte Aufmerksamkeit.

**Urteil: Sinnvoll als optionale Tiefe. Belastend als sichtbares Standardfeld.**

---

## Kategorie 3: Felder, die nur bestätigen

| Feld | Kapitel | Was der Mensch lernt |
|---|---|---|
| phone | Basis | Dass er eine Telefonnummer hat |
| email | Basis | Dass er eine E-Mail hat |
| bankName | Finanzen | Bei welcher Bank er ist |
| creditCard | Finanzen | Ob er eine Kreditkarte hat |

Diese Felder bestätigen Bekanntes. Der Mensch weiss, welche Telefonnummer er hat. Er weiss, bei welcher Bank er ist. Er weiss, ob er eine Kreditkarte hat. Diese Felder erzeugen null neue Erkenntnis.

Was sie erzeugen: einen vollständigeren Datensatz. Für den Export. Für den Ordner. Für "falls ich es mal schnell nachschauen muss."

**Urteil: Ordnung, nicht Tiefe. Sinnvoll beim zweiten Besuch, wenn der Mensch vertiefen will.**

---

## Die Ballast-Bilanz

| Kategorie | Felder | Gesamtaufwand | Gesamterkenntnis |
|---|---|---|---|
| Nummern-Felder | 4 | 15–20 Min | 0 |
| Nischen-Felder | 10 | 10–15 Min | 0 (für Nicht-Betroffene) |
| Bestätigungs-Felder | 4 | 2–3 Min | 0 |
| **Gesamt** | **18** | **27–38 Min** | **0** |

18 Felder. 30 Minuten. Null neue Erkenntnis.

Das ist ein Sechstel aller Felder. Und es kostet ein Viertel der Gesamtzeit. Für nichts, das das Verständnis des eigenen Lebens verändert.

---

# D. Felder mit Krisenwert

---

Krisenwert bedeutet: Im Alltag braucht man sie nicht. In einer Krise sind sie lebenswichtig.

---

## Medizinische Krise

| Feld | Kapitel | Im Alltag | In der Krise |
|---|---|---|---|
| emergencyContact | Notfall | Irrelevant | Lebenswichtig |
| emergencyPhone | Notfall | Irrelevant | Lebenswichtig |
| bloodType | Notfall | Irrelevant | Lebenswichtig |
| allergies | Notfall | Irrelevant | Lebenswichtig |
| medications | Notfall | Erinnerungshilfe | Lebenswichtig |
| chronicDiseases | Notfall | Erinnerungshilfe | Lebenswichtig |
| doctor | Notfall | Erinnerungshilfe | Wichtig |
| doctorPhone | Notfall | Irrelevant | Wichtig |

**8 Felder, die im Alltag fast keinen Wert haben. Und im Ernstfall alles entscheiden.**

Das Paradox: Die Felder mit dem höchsten Krisenwert haben den niedrigsten Alltagswert. Man füllt sie aus — und vergisst sie. Bis der Tag kommt, an dem man sie braucht. Und dann ist man froh, dass sie da sind.

Und genau das ist die Tiefe von Notfall: Nicht Erkenntnis im Moment des Ausfüllens. Sondern Sicherheit für den Moment, den man sich nicht vorstellen will.

---

## Finanzielle Krise

| Feld | Kapitel | Im Alltag | In der Krise |
|---|---|---|---|
| debtPayments | Finanzen | Unangenehm, aber bekannt | Verhandlungsgrundlage |
| loans | Finanzen | Hintergrund | Dringend |
| savingsAccount | Finanzen | Hintergrund | "Wie lange reicht es?" |
| betreibungsStatus | Behörden | Irrelevant (hoffentlich) | Existenziell |

**4 Felder, die im Alltag verdrängt werden. Und in einer Finanzkrise die einzige Grundlage für einen Plan sind.**

"Ich habe CHF 8'000 auf dem Sparkonto. Meine Schuldenrate ist CHF 450. Meine monatlichen Ausgaben sind CHF 4'200. Das Geld reicht noch 2 Monate."

Diese Rechnung kann man nur machen, wenn die Felder ausgefüllt sind. Im Moment der Krise hat man nicht die Energie, Dokumente zu suchen.

---

## Rechtliche Krise

| Feld | Kapitel | Im Alltag | In der Krise |
|---|---|---|---|
| legalRepresentative | Behörden | Irrelevant | "Wen rufe ich an?" |
| representativePhone | Behörden | Irrelevant | Sofortzugriff |
| courtCases | Behörden | Irrelevant (hoffentlich) | Dokumentation |
| patientenverfuegung | Notfall | Irrelevant | Lebensbestimmend |
| vorsorgeauftrag | Notfall | Irrelevant | Lebensbestimmend |

---

## Die Krisenregel

**Krisenfelder erzeugen keine Tiefe im Moment des Ausfüllens. Sie erzeugen Tiefe im Moment der Krise.**

Ihr Wert ist latent. Er existiert — aber unsichtbar. Bis er gebraucht wird. Und dann ist er absolut.

Das macht sie schwer zu motivieren: "Füll deine Blutgruppe aus." "Warum?" "Falls du einen Unfall hast." "Hab ich nicht." "Aber falls."

Die Motivation für Krisenfelder ist immer hypothetisch. Und hypothetische Motivation ist die schwächste aller Motivationen.

**Was trotzdem funktioniert:** Die Notfallkarte. Weil sie die Krisenfelder in ein konkretes Ergebnis verwandelt: eine exportierbare Karte. "Hier ist, was ein Rettungssanitäter über dich wissen muss." Das macht das Hypothetische greifbar.

---

# E. Felder mit Alltagswert

---

Alltagswert bedeutet: Der Mensch braucht die Information regelmässig. Nicht in einer Krise. Sondern am Dienstag um 14 Uhr, wenn er bei einer Behörde anruft.

---

## Regelmässig gebraucht

| Feld | Kapitel | Wann gebraucht | Wie oft |
|---|---|---|---|
| ahv | Basis | Arzt, Arbeitgeber, Behörde | 5–10× pro Jahr |
| kkInsurer | Versicherungen | Arztbesuch | 5–10× pro Jahr |
| kkCardNumber | Versicherungen | Arztbesuch (wenn Karte vergessen) | 2–3× pro Jahr |
| phone | Basis | Formulare | Ständig |
| email | Basis | Formulare | Ständig |
| address + PLZ + city | Wohnen | Formulare, Bestellungen | Ständig |
| canton | Basis | Behörden, Formulare | Oft |
| employer | Finanzen/Ausbildung | Formulare, Referenzen | Gelegentlich |

**Das Muster:** Die Felder mit dem höchsten Alltagswert sind die langweiligsten. Telefonnummer. E-Mail. Adresse. AHV-Nummer. Krankenkassen-Karte.

Sie erzeugen null Erkenntnis, null Zusammenhang, null Tiefe. Aber sie erzeugen Zugriff. "Wo ist meine AHV-Nummer? In Maloja." Das ist kein Spiegel-Moment. Das ist ein Nachschlage-Moment. Und Nachschlage-Momente haben Wert — einen anderen Wert als Tiefe.

---

## Die Alltagsregel

**Alltagsfelder erzeugen keinen Tiefengewinn. Sie erzeugen Nutzungsgewinn.**

Und Nutzungsgewinn ist wichtig — weil er den Mensch zurückbringt. Wer Maloja einmal benutzt, um seine AHV-Nummer nachzuschlagen, öffnet es wieder. Und wer es wieder öffnet, sieht seinen Malojapass. Und wer seinen Malojapass sieht, erinnert sich: "Ich wollte noch Finanzen ausfüllen."

Die langweiligsten Felder sind die besten Rückkehrer-Generatoren.

---

# Die Gesamtkarte: Alle 99 Felder, klassifiziert

---

| Kategorie | Felder | Tiefengewinn | Aufwand | Zeitpunkt |
|---|---|---|---|---|
| **Synthese-Felder** (Budget) | monthlyTax, groceries, mobility, communication, otherInsurance | ★★★★★ | ★★★ | Nach dem Minimum, wenn Finanzen vertiefen |
| **Notfall-Medizin** | medications, chronicDiseases, bloodType, doctor, doctorPhone | ★★★★★ | ★★ | Beim Minimum oder kurz danach |
| **Belastungs-Felder** | debtPayments, alimentePaid, alimenteReceived, loans | ★★★★ | ★★★★ | Wenn bereit zur Konfrontation |
| **Vorsorge-Felder** | patientenverfuegung, vorsorgeauftrag, willMade, bestattungswuensche | ★★★★ | ★★ | Wenn der Mensch sich traut |
| **Kontext-Felder** | maritalStatus, household, nationality, workPermit, languages | ★★★ | ★ | Direkt nach dem Minimum (leicht) |
| **Versicherungs-Tiefe** | franchise, kkModel, bvgInsurer, bvgContribution, uvg, liabilityInsurance | ★★★ | ★★★ | Wenn Versicherungen vertiefen |
| **Wohn-Details** | address, postalCode, utilities, moveInDate, landlord, landlordPhone | ★★ | ★ | Wenn Wohnen vertiefen |
| **Arbeit-Details** | employer, schoolName, certifications, employmentStart, workHoursPerWeek | ★★ | ★ | Wenn Ausbildung vertiefen |
| **Behörden-Details** | taxFillingDeadline, pendingTaxReturns, registryOffice, betreibungsStatus, courtCases | ★★ | ★★ | Wenn Behörden vertiefen |
| **Alltagszugriff** | phone, email, address, ahv, kkCardNumber | ★ | ★–★★★★ | Wenn der Mensch nachschlagen will |
| **Rechtsvertretung** | legalRepresentative, representativePhone | ★ | ★ | Wenn relevant |
| **Krisensicherheit** | savingsAccount, savingsGoal, bankName | ★ | ★★ | Wenn Finanzen vertiefen |
| **Nischen-Versicherungen** | householdIns., travelIns., cyberIns., autoIns. (+Beträge) | ★ | ★★ | Wenn Versicherungen vollständig machen |
| **Vorsorge-Finanzen** | pension3a, pension3b, investmentFunds | ★ | ★★★ | Wenn Finanzen vollständig machen |
| **Nummern** | ahv, taxId, kkCardNumber, efzNumber | 0 | ★★★★ | Beim zweiten/dritten Besuch |

---

# F. Empfehlung

---

## Wann hört Maloja auf, Ordnung zu schaffen, und beginnt lediglich, Information zu sammeln?

Die Antwort ist eine Zahl.

---

### Felder 1–18: Ordnung

Die ersten 18 Felder erzeugen sieben Lebenssätze. Jedes Feld trägt direkt zum Verständnis des eigenen Lebens bei. Jedes Feld beantwortet eine Frage, die der Mensch hat. Kein Feld erfordert Nachschlagen. Kein Feld bestätigt nur Bekanntes.

18 Felder = Ordnung.

---

### Felder 19–40: Tiefe

Die nächsten ~22 Felder erzeugen Zusammenhänge, die über die Lebenssätze hinausgehen.

- Budget-Felder (monthlyTax, groceries, mobility, communication): Finanzsynthese
- Notfall-Medizin (medications, chronicDiseases, bloodType, doctor, doctorPhone): Notfallprofil
- Kontext (maritalStatus, household, nationality, workPermit, languages): Den Menschen sichtbarer machen
- Verpflichtungen (debtPayments, alimentePaid/Received): Belastungsbild
- Vorsorge (patientenverfuegung, vorsorgeauftrag, willMade): Vorsorge-Spiegel
- Versicherungstiefe (franchise, kkModel): Risikoprofil

40 Felder = Ordnung + Tiefe.

Die Synthese funktioniert. "Dir bleiben CHF 2'070." Der Notfall ist vollständig. Die Vorsorge-Lücken sind sichtbar. Der Mensch sieht nicht nur sein Leben — er versteht es.

---

### Felder 41–70: Vollständigkeit

Die nächsten ~30 Felder füllen die Kapitel auf. Wohn-Details (Adresse, Vermieter). Arbeits-Details (Arbeitgeber, Zertifikate). Behörden-Details (Steuertermine, Zivilstandsamt). Versicherungs-Details (Haftpflicht-Betrag, BVG-Beitrag).

Das ist keine Tiefe mehr. Das ist Vollständigkeit. Der Mensch lernt nichts Neues über sein Leben. Er dokumentiert, was er bereits weiss. Das hat Wert — den Wert der Vollständigkeit. Aber es verändert nicht das Verständnis.

70 Felder = Ordnung + Tiefe + Vollständigkeit.

---

### Felder 71–117: Information

Die letzten ~47 Felder sind Information. Nummern (AHV, Steuernummer, KK-Kartennummer). Nischen (Cyberversicherung, Reiseversicherung, Gebäudeversicherung). Bestätigung (Telefon, E-Mail, Bankname). Vorsorge-Finanzen (3a, 3b, Fonds).

Das ist keine Ordnung. Keine Tiefe. Keine Vollständigkeit im Sinne von "mein Leben verstehen." Es ist Information-Sammlung. "Falls ich es einmal brauche."

117 Felder = Ordnung + Tiefe + Vollständigkeit + Information.

---

### Die Grenze

| Felder | Was entsteht | Was sich verändert |
|---|---|---|
| 1–18 | Ordnung | Alles. Von Chaos zu Struktur. |
| 19–40 | Tiefe | Viel. Von Struktur zu Verständnis. |
| 41–70 | Vollständigkeit | Etwas. Von Verständnis zu Dokumentation. |
| 71–117 | Information | Wenig. Von Dokumentation zu Archiv. |

**Die Grenze zwischen Ordnung und Information-Sammlung liegt bei etwa 40 Feldern.**

Nach Feld 40 erzeugt jedes weitere Feld weniger Erkenntnis als das vorherige. Der Grenznutzen fällt. Nicht auf Null — Vollständigkeit hat Wert. Aber auf "angenehm, nicht notwendig."

---

## Was das für das Produkt bedeutet

Maloja hat vier Schichten:

**Schicht 1 — Der Spiegel (18 Felder):** "Hier ist dein Leben, in sieben Sätzen."

**Schicht 2 — Das Verständnis (22 Felder):** "Hier ist, was dein Leben bedeutet." Synthesen, Zusammenhänge, Konfrontationen.

**Schicht 3 — Der Ordner (30 Felder):** "Hier ist alles an seinem Platz." Vollständige Adressen, Vermieter, Arbeitgeber, Termine.

**Schicht 4 — Das Archiv (47 Felder):** "Hier ist alles, was du jemals nachschlagen könntest." Nummern, Nischen, Details.

Aktuell zeigt Maloja alle vier Schichten gleichzeitig. 117 Felder, nebeneinander, gleichwertig. Kein Feld sagt: "Ich bin Schicht 1." Kein Feld sagt: "Ich bin Schicht 4."

Der Mensch sieht nicht, wo Ordnung aufhört und Information-Sammlung beginnt. Er sieht nur: viele Felder.

---

## Die drei Wahrheiten

**1. Die meisten Menschen brauchen Schicht 1 und 2.** 40 Felder. Ordnung und Tiefe. Das reicht, um "sein Leben zu sehen."

**2. Manche Menschen wollen Schicht 3.** 70 Felder. Vollständigkeit. Der Ordnungsmensch (D-16, Mensch 6), der Sonntagabend-Ordner. Er will alles an seinem Platz. Nicht weil er es braucht — weil es ihm guttut.

**3. Wenige Menschen brauchen Schicht 4.** 117 Felder. Das vollständige Archiv. Der Mensch, der seine AHV-Nummer, seine Steuernummer, seine KK-Kartennummer, seine EFZ-Nummer an einem Ort haben will. Weil er einmal zu oft danach gesucht hat.

Alle drei sind legitim. Aber alle drei gleichzeitig zu zeigen — bei jedem Feld, von Anfang an — verwandelt den Spiegel in ein Archiv. Und ein Archiv hat man. Einen Spiegel benutzt man.

---

> **Wann hört Maloja auf, Ordnung zu schaffen, und beginnt lediglich, Information zu sammeln?**
>
> Bei Feld 41.
>
> Die ersten 18 Felder erzeugen Ordnung.
> Die Felder 19–40 erzeugen Tiefe.
> Ab Feld 41 sammelt Maloja Information.
>
> Das ist nicht schlecht. Information hat Wert.
> Aber es ist nicht mehr dasselbe.
>
> Ordnung verändert, wie ein Mensch sein Leben sieht.
> Information verändert, wo ein Mensch seine Daten findet.
>
> Beides ist nützlich.
> Nur eines davon ist Maloja.

---

*Analyse erstellt am 2026-06-13. Keine Implementierung. Kein Commit.*
