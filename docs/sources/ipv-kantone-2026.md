# Prämienverbilligung (IPV) 2026 — amtliche Belege je Kanton

Stand der Recherche: **16.09.2026** (alle Quellen an diesem Tag abgerufen).
Betrifft `CANTONAL_IPV` und `calculateIPV()` in `src/config/cantonalData.js`
(Bau-Liste M13, Entscheid E9; Befund «Swiss 2» in `docs/audits/voll-review-L-2026-09-15.md`).

Zweck: Grundlage, um die heute zurückgehaltenen IPV-Beträge Kanton für Kanton wieder
freizugeben — **nur** dort, wo das kantonale Rechenmodell und seine Zahlen amtlich belegt
sind. Dieses Dokument ändert keinen Code.

## Regeln dieser Erhebung

- Als Beleg zählen nur amtliche Quellen: kantonales Gesetz/Verordnung, Regierungsratsbeschluss,
  Merkblatt, Wegleitung oder Rechner der zuständigen kantonalen Stelle bzw. Ausgleichskasse/SVA.
  Keine Vergleichsportale, keine Zeitungen, keine KI-Zusammenfassungen.
- Zitate sind wörtlich und in der Originalsprache. Zahlen ohne Beleg stehen als «nicht belegt»,
  nicht als Schätzung.
- **Beurteilung:**
  - **abbildbar** — Modell und Zahlen reichen, um in der App einen Betrag nach Kantonsmodell zu rechnen.
  - **teilweise** — Modell bekannt, Zahlen unvollständig (oder nur 2025 gefunden).
  - **nicht belegt** — Modell oder Zahlen nicht amtlich auffindbar.
- «abbildbar» heisst nicht «mit dem heutigen App-Modell abbildbar»: die App rechnet heute
  einen einheitlichen linearen Abbau (voller Betrag bei Einkommen 0, null bei `maxIncome`),
  den kein Kanton so kennt. Wer einen Kanton freigibt, muss dessen Modell nachbauen.
- Werte ändern sich jährlich (Richtprämien, Prozentsätze, Grenzen). Vor jeder Freigabe den
  Stand an der Quelle erneut prüfen; ab Herbst 2026 erscheinen die Werte für 2027.

**Erfasst:** 13 von 26 Kantonen. 11× abbildbar · 2× teilweise

## Übersicht

| Kt. | Kanton | Modell | Abbildbar? | Hauptquelle |
|---|---|---|---|---|
| ZH | Zürich | Referenzprämie (70 % der regionalen Durchschnittsprämie) minus Eigenanteil 8,4 % (Alleinstehende/Alleinerziehende) bzw. 10,5 % (Verheiratete) des massgebenden Einkommens; 3 Prämienregionen; Vermögensgrenze 150'000 / 300'000 | abbildbar | <https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html> |
| BE | Bern | Stufentabelle: fester Monatsbetrag je Prämienregion (3), Altersgruppe und Einkommensstufe (bis 9'000 / 17'000 / 25'000 / 35'000; Familien bis 45'000); Kinder und junge Erwachsene in Ausbildung Pauschalbetrag | abbildbar | <https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Berechnungsschema%202026_de.pdf> |
| LU | Luzern | *noch nicht erfasst* | — | — |
| UR | Uri | *noch nicht erfasst* | — | — |
| SZ | Schwyz | *noch nicht erfasst* | — | — |
| OW | Obwalden | Richtprämie − Selbstbehalt (9,5 % des anrechenbaren Einkommens bis CHF 35'000, darüber +0,01 %-Punkt je CHF 100); Anspruch nur bei anrechenbarem Einkommen < CHF 50'000 (mit Kindern +25'000 = < 75'000); Mindestanspruch Kinder 80 %, junge Erwachsene in Ausbildung 50 % | abbildbar | <https://gdb.ow.ch/app/de/texts_of_law/851.12> |
| NW | Nidwalden | Selbstbehalt 10 % der «Summe der Steuerwerte» (Reineinkommen + Aufrechnungen + 20 % Reinvermögen); IPV = Richtprämie − Selbstbehalt; Kinder 80 % (Eltern ≤ CHF 100'000), junge Erwachsene in Ausbildung 50 % | abbildbar | <https://gesetze.nw.ch/app/de/texts_of_law/742.111> |
| GL | Glarus | Richtprämie − Selbstbehalt; Selbstbehalt in Stufen 9–14 % des ganzen anrechenbaren Einkommens (bis 40'000: 9 % … über 80'000: 14 %); Kinder mind. 80 %, junge Erwachsene in Ausbildung mind. 50 % bei Haushalts-AE ≤ CHF 85'000; Richtprämie = 85 % (Kinder 100 %) der EDI-Durchschnittsprämie | teilweise | <https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/3> |
| ZG | Zug | *noch nicht erfasst* | — | — |
| FR | Freiburg | *noch nicht erfasst* | — | — |
| SO | Solothurn | Richtprämie (Durchschnittsprämie −30 %) minus Eigenanteil 10–16 % des massgebenden Einkommens (linear), Grenze MGE 74'000; Kinder ≥80 %, junge Erw. ≥50 % bis 74'000 | teilweise | <https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/2026-01-27-Verfuegung-Parameter-Individuelle-Praemie.pdf> |
| BS | Basel-Stadt | Stufentabelle: 22 Beitragsgruppen nach massgeblichem Haushaltseinkommen und Haushaltsgrösse (1–8 Pers.), fester Monatsbeitrag je Person (Erwachsene / junge Erw. / Kinder), Zuschlag bei alternativem Versicherungsmodell (AVM) | abbildbar | <https://www.gesetzessammlung.bs.ch/api/de/versions/6727/pdf_file> |
| BL | Basel-Landschaft | *noch nicht erfasst* | — | — |
| SH | Schaffhausen | *noch nicht erfasst* | — | — |
| AR | Appenzell Ausserrhoden | *noch nicht erfasst* | — | — |
| AI | Appenzell Innerrhoden | Richtprämie (Summe Haushalt) minus Selbstbehalt 7–12 % des massgebenden Gesamteinkommens (gestuft +0,125 %/Fr. 1'000 zwischen 45'000 und 85'000); Kinder/JE in Ausbildung Mindest-IPV 80 %/50 % der Richtprämie bis MGE 75'000 | abbildbar | <https://www.ai.ch/themen/gesundheit-alter-und-soziales/individuelle-praemienverbilligung/merkblatt-ipv/merkblatt-ipv-2024/@@download/file/Merkblatt%20IPV%202026.pdf> |
| SG | St. Gallen | Regionale Referenzprämie (3 Regionen) minus Belastungsgrenze in % des massgebenden Einkommens; Satz steigt linear pro Franken über einem Sockel (z. B. Alleinstehend ohne Kinder: 12,16 % bis 18'700, +0,0002 Prozentpunkte je Franken darüber); Vermögensgrenze 100'000; Minimalgarantie Kinder 80 % / JE in Ausbildung 50 % bis Einkommens-Obergrenze | abbildbar | <https://www.gesetzessammlung.sg.ch/api/de/versions/3847/pdf_file_with_annexes> |
| GR | Graubünden | Regionale Richtprämie (3 Regionen, 90 % der BAG-Durchschnittsprämie) minus Selbstbehalt nach Einkommenskategorie (5 % / 6,5 % / 8 % / 9 % / 10 % des anrechenbaren Einkommens); Kinder und JE in Ausbildung alternativ 100/75/50/25 % Verbilligung bis 65'000/70'000/75'000/80'000, höherer Betrag gilt | abbildbar | <https://formulare.sva.gr.ch/downloads/ipv_wegleitung_d.pdf> |
| AG | Aargau | *noch nicht erfasst* | — | — |
| TG | Thurgau | *noch nicht erfasst* | — | — |
| TI | Tessin | Quadratische Formel: Normbetrag = PMR − PMR × RD²/RDM², × kantonaler Koeffizient 76,5 %; RDM = Konstante × 50 % der Laps-Bedarfsgrenze | abbildbar | <https://m3.ti.ch/CAN/RLeggi/public/index.php/index/nuovafinestra/atto/370/volume//numLegge/853.100> |
| VD | Waadt | *noch nicht erfasst* | — | — |
| VS | Wallis | *noch nicht erfasst* | — | — |
| NE | Neuenburg | 15 Klassen (S1–S15) nach revenu déterminant und Haushaltstyp/Kinderzahl; fester Monats-Höchstbetrag je Klasse und Alterskategorie (% einer Referenzprämie) | abbildbar (mit Vorbehalt: Webseite und Erlass nennen ab S3 unterschiedliche Monatsbeträge, siehe «Offen») | <https://rsn.ne.ch/DATA/program/books/rsne/pdf/821.102.pdf> |
| GE | Genf | 8 Gruppen (+ Gruppe 9 nur für Kinder/junge Erwachsene) nach RDU und Haushalt; fester Monatsbetrag je Gruppe und Person (Erw. 348 → 55, junge Erw. 231, Kind 132), Grenzen +6'000 je Unterhaltspflicht | abbildbar | <https://www.ge.ch/document/baremes-categories-2026-subsides-assurance-maladie> |
| JU | Jura | *noch nicht erfasst* | — | — |

---

## ZH — Zürich

**Beurteilung:** abbildbar
**Modell (kurz):** Referenzprämie (70 % der regionalen Durchschnittsprämie) minus Eigenanteil 8,4 % (Alleinstehende/Alleinerziehende) bzw. 10,5 % (Verheiratete) des massgebenden Einkommens; 3 Prämienregionen; Vermögensgrenze 150'000 / 300'000
**Zuständig / Weg:** SVA Zürich; Antragsformular wird automatisch zugestellt (Basis Steuerfaktoren 2023), sonst Online-Nachmeldung; Antrag 2026 bis spätestens 31. März 2027; provisorische Auszahlung von 80 %, definitive Abrechnung nach Steuerfaktoren 2026
**Gültigkeit:** 2026 festgelegt (RRB Nr. 947/2025), Auszahlung provisorisch; laut SVA können die Berechnungsgrundlagen «bis zum Herbst 2026 noch angepasst werden» (2025 wurde rückwirkend gesenkt)

### Rechenmodell
> «Die Höhe der Prämienverbilligung hängt ab vom massgebenden Einkommen, vom Eigenanteil und von der Referenzprämie.» — Quelle [1]

> «Die Referenzprämie im Kanton Zürich beträgt ab dem Jahr 2026 neu 70 Prozent der regionalen Durchschnittsprämie.» — Quelle [1]

> «Für 2026 beträgt dieser 10,5 Prozent des massgebenden Einkommens für Verheiratete und registrierte Partnerinnen und Partner sowie 8,4 Prozent für die übrigen Personen (gemäss Regierungsratsbeschluss Nr. 947/2025).» — Quelle [2]

> «Familien mit massgebendem Einkommen unterhalb dieser Grenzen zahlen für ihre minderjährigen Kinder nur 20 Prozent und für volljährige Kinder in Ausbildung 50 Prozent der massgebenden Prämien.» — Quelle [2]

Formel (aus [1]): IPV = Referenzprämie − Eigenanteil × massgebendes Einkommen. Beispiel [1]: «Referenzprämie (70 Prozent der regionalen Durchschnittsprämie, Region 1) CHF 5'776 · Abzüglich Eigenanteil (8.4 Prozent vom massgebenden Einkommen; CHF 20'000) - CHF 1'680 · Höhe der Prämienverbilligung 2026 CHF 4'096».

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Referenzprämie | 70 % der regionalen Durchschnittsprämie | [1], [2] |
| Eigenanteil Alleinstehende/Alleinerziehende | 8,4 % des massg. Einkommens | [1], [2] |
| Eigenanteil Verheiratete/eingetr. Partnerschaft | 10,5 % des massg. Einkommens | [1], [2] |
| Regionale Durchschnittsprämie 2026, Region 1 (Stadt Zürich) | Erw. 640 · junge Erw. (19–25) 459 · Kinder 154 CHF/Monat | [3] |
| Regionale Durchschnittsprämie 2026, Region 2 | Erw. 584 · junge Erw. 420 · Kinder 140 CHF/Monat | [3] |
| Regionale Durchschnittsprämie 2026, Region 3 | Erw. 544 · junge Erw. 389 · Kinder 130 CHF/Monat | [3] |
| Einkommensgrenze Einzelperson >25, keine Kinder | R1 64'000 · R2 58'400 · R3 54'400 | [4] |
| Einkommensgrenze Einzelperson 18–25, keine Kinder | R1 45'900 · R2 42'000 · R3 38'900 | [4] |
| Einkommensgrenze Einzelperson >25, 1/2/3 Kinder, R1 | 79'400 / 94'800 / 110'200 | [4] |
| Einkommensgrenze Einzelperson >25, 1/2/3 Kinder, R2 | 72'400 / 86'400 / 100'400 | [4] |
| Einkommensgrenze Einzelperson >25, 1/2/3 Kinder, R3 | 70'500 / 80'400 / 93'400 | [4] |
| Einkommensgrenze Verheiratete >25, 0/1/2/3 Kinder, R1 | 102'400 / 114'720 / 127'040 / 139'360 | [4] |
| Einkommensgrenze Verheiratete >25, 0/1/2/3 Kinder, R2 | 93'440 / 104'640 / 115'840 / 127'040 | [4] |
| Einkommensgrenze Verheiratete >25, 0/1/2/3 Kinder, R3 | 87'040 / 97'440 / 107'840 / 118'240 | [4] |
| Einkommensgrenze Verheiratete 18–25, 0 Kinder | R1 73'440 · R2 67'200 · R3 62'240 | [4] |
| Familien-Einkommensobergrenze (Kinder 20 % / junge Erw. in Ausbildung 50 %) | 70'500 (nur minderjährige Kinder) · 94'000 (mind. ein junger Erw. in Ausbildung) | [2] |
| Vermögensobergrenze | Alleinstehende 150'000 · Verheiratete und Alleinerziehende 300'000 | [1], [4] |
| Vermögensfreibetrag (10 % des Übersteigenden zählt als Einkommen) | Alleinstehende 75'000 · Verheiratete und Personen mit Kindern 150'000 | [1] |
| Provisorische Auszahlung | 80 % des IPV-Betrags | [5] |
| Eigenanteile 2027 (bereits publiziert, nur Hinweis) | 11,8 % Verheiratete · 9,4 % Alleinstehende | [1] |

Plausibilitätsprüfung (eigene Rechnung, kein Zitat): 640 × 12 × 70 % = 5'376; 64'000 × 8,4 % = 5'376 → die Einkommensgrenze [4] ist genau der Punkt, an dem Referenzprämie = Eigenanteil. Gleiches gilt für junge Erwachsene (459 × 12 × 0,7 = 3'855.60; 45'900 × 8,4 % = 3'855.60) und Verheiratete (2 × 5'376 = 10'752; 102'400 × 10,5 % = 10'752). Das Modell ist damit konsistent nachrechenbar.
⚠️ **Widerspruch in der Quelle:** Das Berechnungsbeispiel [1] nennt als Referenzprämie Region 1 «CHF 5'776»; aus [3] ergibt sich 5'376. Die Einkommensgrenzen [4] stützen 5'376. Das Beispiel auf der SVA-Seite ist vermutlich ein Tippfehler — in der App nicht übernehmen, bei SVA Zürich nachfragen.

### Massgebendes Einkommen
> «Total der Einkünfte (Ziff. 199 der Steuererklärung) abzüglich Total der Abzüge (Ziff. 299 der Steuererklärung) abzüglich Krankheits- und Unfallkosten (Ziff. 320 …) abzüglich Sozialabzüge für Kinder und unterstützte Personen (Ziff. 370, 372 und 374 …) zuzüglich Verluste aus der Nutzung von Liegenschaften und Privatvermögen (Ziff. 188 …) zuzüglich Beiträge an die gebundene Selbstvorsorge 3a (Ziff. 260 und 261 …) zuzüglich Beiträge an die AHV, IV und 2. Säule (Ziff. 280 …) zuzüglich Vermögensanteil» — Quelle [1]

> «Bei quellenbesteuerten Personen entspricht das massgebende Einkommen dem steuerbaren Einkommen unter Berücksichtigung des Kinderabzuges.» — Quelle [1]

Selbständige: «7.5 % der Einkünfte aus selbständiger Erwerbstätigkeit … Oder höchstens die Summe der Beiträge an die 2. und 3. Säule» — Quelle [1]. Basis: Steuerfaktoren des Antragsjahrs 2026 («frühestens ab Herbst 2027» bekannt) [4].

### Abweichung zur App
Der heutige App-Wert (maxIncome/subsidySingle ZH) lag dem Unteragenten nicht vor. Belegte Vergleichsgrössen: Einzelperson >25 ohne Kinder, Region 1: Einkommensgrenze 64'000, IPV bei Einkommen 0 = 5'376 CHF/Jahr (Region 2: 58'400 / 4'905.60; Region 3: 54'400 / 4'569.60, eigene Rechnung aus [3]). Der Abbau ist in ZH tatsächlich linear (8,4 % je Franken Einkommen) — das App-Modell «voll bei 0, null bei maxIncome» passt strukturell, aber nur mit regionsabhängiger Grenze und getrennter Rechnung für Kinder/junge Erwachsene.

### Offen / nicht gefunden
- Rechtstext RRB Nr. 947/2025 und EG KVG / Verordnung selbst nicht geöffnet (Zahlen aus Medienmitteilung Regierungsrat und SVA-Seiten).
- Ausdrückliche amtliche Bestätigung, dass die IPV-«regionale Durchschnittsprämie» identisch mit der EL-Tabelle [3] ist, fehlt; nur durch die Nachrechnung gestützt. Widerspruch 5'776 vs. 5'376 im SVA-Beispiel ungeklärt.
- Genaue Rechnung für Kinder (20 % bzw. 50 % der «massgebenden Prämien» unterhalb der Familiengrenze) und Zusammenspiel mit dem Eigenanteil nicht im Detail publiziert gefunden.
- Mögliche rückwirkende Anpassung 2026 im Herbst 2026 («bis zum Herbst 2026 noch angepasst») — Stand heute nicht geprüft, ob schon erfolgt.

### Quellen
1. Prämienverbilligung: Leistung, SVA Zürich, Stand ohne Datum (enthält bereits Eigenanteile 2027). https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html — abgerufen 16.09.2026
2. Medienmitteilung «Kanton legt Prämienverbilligungen 2026 fest», Kanton Zürich (Regierungsrat), 23.09.2025. https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2025/09/kanton-legt-praemienverbilligungen-2026-fest.html — abgerufen 16.09.2026
3. Regionale Durchschnittsprämie (Höhe der regionalen Durchschnittsprämie 2026), SVA Zürich, Stand ohne Datum. https://svazurich.ch/unsere-produkte/weitere-produkte/weitere-leistungen/ergaenzungsleistungen/regionale-durchschnittspraemien.html — abgerufen 16.09.2026
4. Prämienverbilligung 2026: Einkommensgrenzen 2026, SVA Zürich, Stand ohne Datum. https://svazurich.ch/ihr-anliegen/privatpersonen/praemienverbilligung/praemienverbilligung_2026/einkommensgrenzen-2026.html — abgerufen 16.09.2026
5. Kundeninformation: Prämienverbilligung 2026, SVA Zürich, V 05.2025 (PDF). https://svazurich.ch/dam/sva-dokumente/4000_ipv/4000_vl3_ipv_kundeninformation_2026.pdf — abgerufen 16.09.2026

---

## BE — Bern

**Beurteilung:** abbildbar
**Modell (kurz):** Stufentabelle: fester Monatsbetrag je Prämienregion (3), Altersgruppe und Einkommensstufe (bis 9'000 / 17'000 / 25'000 / 35'000; Familien bis 45'000); Kinder und junge Erwachsene in Ausbildung Pauschalbetrag
**Zuständig / Weg:** Amt für Sozialversicherungen (ASV), Direktion für Inneres und Justiz, Ostermundigen; in der Regel automatisch aufgrund der definitiven Steuerdaten des Vorvorjahres; sonst Antrag (online/Post) für das laufende Jahr bis spätestens 31. Dezember; Auszahlung an den Krankenversicherer
**Gültigkeit:** 2026 definitiv («Gültig ab 1. Januar 2026»)

### Rechenmodell
> «Sie haben Anrecht auf Prämienverbilligung, wenn das massgebende Einkommen nicht höher als Fr. 35'000 ist … Bei Familien mit zur Familie zählenden Kindern darf das massgebende Einkommen aller Familienmitglieder nicht höher als Fr. 45'000 sein.» — Quelle [1]

> «Wie hoch ist Ihre monatliche Prämienverbilligung?» — Tabelle nach Prämienregion, Alter und «Massgebendes Einkommen bis 9'000 / bis 17'000 / bis 25'000 / bis 35'000 / bis 45'000 Franken» (letzte Spalte «gilt für Familien mit zur Familie zählenden Kindern») — Quelle [1]

> «Das Anrecht auf Prämienverbilligung wird in der Regel aufgrund der definitiven Steuerdaten des Vorvorjahres automatisch berechnet.» — Quelle [2]

### Zahlen 2026
Beträge in CHF **pro Monat** (Jahreswert = × 12, eigene Rechnung in Klammern).

| Grösse | Wert | Quelle |
|---|---|---|
| Einkommensgrenze ohne Kinder | massg. Einkommen ≤ 35'000 | [1] |
| Einkommensgrenze Familien mit Kindern | massg. Einkommen aller Familienmitglieder ≤ 45'000 | [1] |
| Region 1, Erwachsene >25, Stufen bis 9'000/17'000/25'000/35'000/45'000 | 221.00 / 147.00 / 107.00 / 67.00 / 33.50 (Jahr: 2'652 / 1'764 / 1'284 / 804 / 402) | [1] |
| Region 2, Erwachsene >25 | 196.00 / 132.00 / 96.00 / 60.00 / 30.00 (Jahr: 2'352 / 1'584 / 1'152 / 720 / 360) | [1] |
| Region 3, Erwachsene >25 | 183.00 / 123.00 / 89.00 / 56.00 / 28.00 (Jahr: 2'196 / 1'476 / 1'068 / 672 / 336) | [1] |
| Junge Erwachsene (>18, <25) zur Familie zählend, alle Stufen | R1 239.25 · R2 214.15 · R3 200.30 | [1] |
| Kinder bis 18, alle Stufen | R1 119.30 · R2 106.00 · R3 99.35 (Jahr: 1'431.60 / 1'272 / 1'192.20) | [1] |
| Junge Erwachsene nicht mehr bei Eltern, **nicht** in Ausbildung, R1 | 206.00 / 138.00 / 100.00 / 63.00 / 31.50 | [1] |
| dito R2 | 183.00 / 124.00 / 90.00 / 56.00 / 28.00 | [1] |
| dito R3 | 170.00 / 116.00 / 84.00 / 52.00 / 26.00 | [1] |
| Junge Erwachsene nicht mehr bei Eltern, **in** Ausbildung (auf Antrag) | R1 239.25 · R2 214.15 · R3 200.30 | [1] |
| Vermögensfreibetrag | Fr. 17'000 pro Familienmitglied; 5 % des korrigierten Vermögens werden dem Einkommen zugerechnet | [1] |
| Sozialabzüge | Ehepaar 13'000 · alleinstehende Eltern 9'750 · Alleinstehende 2'200 · 1. Kind 15'000 · 2. Kind 12'500 · jedes weitere 10'000 | [1] |
| Prämienregion | Wohnsitz am 1. Januar; R1 = u. a. Bern, Biel, Köniz, Ostermundigen …; R2 = Liste; R3 = «Alle übrigen» | [1] |

### Massgebendes Einkommen
> «Als Berechnungsgrundlage für ordentlich besteuerte Personen dient das Reineinkommen sowie das Vermögen gemäss Steuerdaten.» Aufgerechnet u. a. Beiträge 2. Säule (nicht im Nettolohn II), Säule 3a, Zweiverdienerabzug, Stipendien, Mitgliederbeiträge/Zuwendungen, auswärtiger Wochenaufenthalt; abgezogen «selbst getragene Krankheitskosten» → «korrigiertes Reineinkommen»; dann «korrigiertes Reineinkommen zuzüglich 5% des korrigierten Vermögens» minus Sozialabzüge = «massgebendes Einkommen» — Quelle [1]

> «Als Berechnungsgrundlage für Personen, die an der Quelle besteuert sind, werden 75 Prozent des Bruttoeinkommens als korrigiertes Reineinkommen berücksichtigt» — Quelle [1]

Hinweis [1]: massgebendes Einkommen «entspricht nicht dem steuerbaren Einkommen».

### Abweichung zur App
Der heutige App-Wert (maxIncome/subsidySingle BE) lag dem Unteragenten nicht vor. Belegte Vergleichsgrössen: Einzelperson >25, Region 1: Grenze 35'000 massg. Einkommen, Höchstbetrag 2'652 CHF/Jahr (Stufe bis 9'000). BE rechnet **in Stufen, nicht linear** — ein linearer Abbau bis maxIncome bildet Bern falsch ab; zudem ist das massgebende Einkommen um Sozialabzüge reduziert.

### Offen / nicht gefunden
- Rechtstext KKVV (BSG) mit den Beträgen nicht geöffnet; Zahlen aus dem amtlichen Berechnungsschema des ASV.
- Informationsblatt 2026 (auf der Publikationsseite verlinkt) nicht gelesen.
- Untergrenze der Stufe «bis 9'000» (ob auch negatives/Null-Einkommen) nicht ausdrücklich geregelt gefunden.
- Ob die Beträge 2026 beim Kind/jungen Erwachsenen die KVG-Mindestquoten (80 % / 50 %) abbilden, nicht geprüft.

### Quellen
1. Berechnungsschema, «Gültig ab 1. Januar 2026», Direktion für Inneres und Justiz, Amt für Sozialversicherungen, Abteilung Prämienverbilligung und Obligatorium (PDF, 5 S.). https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Berechnungsschema%202026_de.pdf — abgerufen 16.09.2026
2. Prämienverbilligung beantragen, Amt für Sozialversicherungen Kanton Bern, Stand ohne Datum. https://www.asv.dij.be.ch/de/start/themen/pv/pv_anrecht-auf-pv-beantragen.html — abgerufen 16.09.2026
3. Publikationen (Informationsblatt 2026, Berechnungsschema 2026), Amt für Sozialversicherungen Kanton Bern. https://www.asv.dij.be.ch/de/start/themen/pv/formulare---publikationen.html — abgerufen 16.09.2026

---

## OW — Obwalden

**Beurteilung:** abbildbar
**Modell (kurz):** Richtprämie − Selbstbehalt (9,5 % des anrechenbaren Einkommens bis CHF 35'000, darüber +0,01 %-Punkt je CHF 100); Anspruch nur bei anrechenbarem Einkommen < CHF 50'000 (mit Kindern +25'000 = < 75'000); Mindestanspruch Kinder 80 %, junge Erwachsene in Ausbildung 50 %
**Zuständig / Weg:** Ausgleichskasse Obwalden (Sarnen). Antrag nötig (Einladung/Online-Formular); Frist 2026: 31. Mai 2026 (laut Merkblatt und Website abgelaufen), sonst verwirkt. EL- und Sozialhilfebeziehende ohne Antrag.
**Gültigkeit:** 2026 definitiv (Kantonsratsbeschluss vom 26.03.2026, rückwirkend in Kraft 01.01.2026; Richtprämien laut Merkblatt Stand Januar 2026)

### Rechenmodell
> «Ein Anspruch auf Prämienverbilligung besteht, soweit die kantonalen Richtprämien der obligatorischen Krankenpflegegrundversicherung den Selbstbehalt gemäss Absatz 2 übersteigen […]» — EG KVG Art. 2 Abs. 1, Quelle [2]

> «Der Selbstbehalt entspricht einem bestimmten Prozentsatz des anrechenbaren Einkommens und beträgt zwischen 9,0 und 12,0 Prozent. Der Prozentsatz verläuft linear und steigt ab einer bestimmten Grenze des anrechenbaren Einkommens an (linear-progressives System).» — EG KVG Art. 2 Abs. 2, Quelle [2]

> «Der Selbstbehalt […] beträgt für 2026 bis Fr. 35 000.– anrechenbares Einkommen 9,50 Prozent, danach steigt der Selbstbehalt pro Fr. 100.– anrechenbares Einkommen um je 0,01 Prozent.» — Kantonsratsbeschluss 2026 Ziff. 1, Quelle [1]

> «Anspruch auf Prämienverbilligung besteht, soweit die kantonale Richtprämie den gesetzlichen Selbstbehalt des anrechenbaren Einkommens übersteigt und das anrechenbare Einkommen weniger als Fr. 50 000.– beträgt.» / «Für Personen, welche Anspruch auf eine Prämienverbilligung für Kinder haben, erhöht sich das anrechenbare Einkommen um Fr. 25 000.–.» — EV KVG Art. 7 Abs. 1 und 2, Quelle [3]

Rechenweg (abgeleitet): Selbstbehalt-% = 9,5 % bei AE ≤ 35'000, sonst 9,5 % + 0,01 % × (AE − 35'000)/100; IPV = Summe der Richtprämien − Selbstbehalt-% × AE, mindestens 0, nur wenn AE < 50'000 (mit Kindern < 75'000). Kontrollwert der Quelle [4]: «Bei einem anrechenbaren Einkommen von 45'000 Franken beträgt er beispielsweise 10.5%.» Beispiel Einzelperson (abgeleitet, nicht amtlich): AE 0 → CHF 5'018.40; AE 35'000 → 5'018.40 − 3'325 = CHF 1'693.40; Anspruch endet rechnerisch bei rund AE 46'900.

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene (Merkblatt: «ab Jahrgang 2000», d. h. Jg. 2000 und älter) | CHF 5'018.40 | [4] |
| Richtprämie junge Erwachsene (Jg. 2001–2007) | CHF 3'570.00 | [4] |
| Richtprämie Kinder und Jugendliche (bis Jg. 2008) | CHF 1'380.00 | [4] |
| Festlegung Richtprämien | Erw./j. Erw. 85 % der EDI-Durchschnittsprämie; Kinder 100 % | [3] Art. 5 |
| Selbstbehalt 2026 | 9,50 % bis AE 35'000; +0,01 % je CHF 100 darüber | [1] |
| Einkommensgrenze ohne Kinder | AE < CHF 50'000 | [3] Art. 7 Abs. 1, [4] |
| Einkommensgrenze mit Kindern | + CHF 25'000 (= < 75'000) | [3] Art. 7 Abs. 2, [4] |
| Mindestanspruch Kinder | 80 % der Richtprämie bei AE < 50'000; ab 4. Kind 100 % | [3] Art. 7 Abs. 4–5, [4] |
| Mindestanspruch junge Erwachsene in Ausbildung | 50 % bei eigenem AE < CHF 25'000 | [3] Art. 7 Abs. 3, [4] |
| Abzug Ehepaar / pro Kind | je CHF 7'000 | [3] Art. 7a |
| Vermögensanrechnung | 10 % des steuerbaren Vermögens | [3] Art. 7a Bst. i |
| Quellenbesteuerte | 75 % des quellensteuerpflichtigen Bruttoerwerbseinkommens 2024 | [4] |
| Bemessung | definitive Steuerveranlagung 2024 | [4] |

### Massgebendes Einkommen
> «Total der Einkünfte (Steuererklärung 2024, Ziffer 1990) – abzüglich Berufsauslagen, Unterhaltsbeiträge und dauernde Lasten, Versicherungsabzug, Krankheits-, Unfall- und Invaliditätskosten, Kinderbetreuungskosten durch Dritte, Schuldzinsen bis maximal in der Höhe des Liegenschaftsertrags, 7'000 Franken Abzug für verheiratete Paare in ungetrennter Ehe, 7'000 Franken pro Kind […] + zuzüglich allfällige Liegenschaftsverluste, 10% vom steuerbaren Vermögen» — Quelle [4] (Aufzählung zusammengezogen; Rechtsgrundlage EV KVG Art. 7a, Quelle [3])

### Abweichung zur App
App: maxIncome 42'000, subsidySingle 2'100, modelFlat. Belegt ist für eine erwachsene Einzelperson: bis CHF 5'018.40 (bei AE 0), Abbau nicht linear bis zu einer Grenze, sondern über einen progressiven Selbstbehalt; der Anspruch endet rechnerisch bei rund AE 46'900 (harte Grenze 50'000, mit Kindern 75'000). App-Höchstbetrag und Grenze sind damit zu tief, das Modell falsch bezeichnet.

### Offen / nicht gefunden
- Ob die Selbstbehalt-Steigerung stufenweise je volle CHF 100 oder stetig gerechnet wird: Wortlaut «pro Fr. 100.–» lässt beides zu; Rechner https://www.akow.ch/ipv-rechner nicht geöffnet.
- Richtprämien 2026 nur im Merkblatt [4] gefunden, kein eigener Beschluss mit den Frankenbeträgen (Rechtsgrundlage: 85 % bzw. 100 % der EDI-Durchschnittsprämie, [3] Art. 5).
- Frist: Die heute geltende EV-Fassung (in Kraft seit 01.06.2026) nennt den 30. April; für 2026 nennen Merkblatt und Website den 31. Mai 2026. Für 2027 ist mit dem 30. April zu rechnen (nicht separat bestätigt).
- EG KVG (Fassung ab 01.04.2026) weist die Festlegung des Selbstbehalts künftig dem Regierungsrat «jeweils im Vorjahr» zu; für 2026 hat noch der Kantonsrat beschlossen.
- Merkblatt-Variante ohne Datum (IPV26_Merkblatt.pdf) antwortet mit HTTP 404; verwendet wurde die Fassung «Stand Januar 2026».

### Quellen
1. GDB 851.12 Kantonsratsbeschluss über den Selbstbehalt bei der Individuellen Prämienverbilligung in der Krankenversicherung für das Jahr 2026, Kantonsrat Obwalden, vom 26.03.2026, in Kraft seit 01.01.2026 (OGS 2026, 007). https://gdb.ow.ch/app/de/texts_of_law/851.12 (Text über https://gdb.ow.ch/api/de/texts_of_law/851.12/show_as_json) — abgerufen 16.09.2026
2. GDB 851.1 Einführungsgesetz zum Krankenversicherungsgesetz (EG KVG) vom 28.01.1999, Fassung in Kraft seit 01.04.2026. https://gdb.ow.ch/app/de/texts_of_law/851.1 — abgerufen 16.09.2026
3. GDB 851.11 Verordnung zum Einführungsgesetz zum Krankenversicherungsgesetz (EV KVG) vom 28.01.1999, Fassung in Kraft seit 01.06.2026. https://gdb.ow.ch/app/de/texts_of_law/851.11 — abgerufen 16.09.2026
4. Merkblatt «Prämienverbilligung 2026», Ausgleichskasse / IV-Stelle Obwalden, Stand Januar 2026. https://www.akow.ch/uploads/PDF-Formulare-Merkblaetter/IPV/IPV26_Merkblatt_2026-01.pdf — abgerufen 16.09.2026
5. Webseite Prämienverbilligung, Ausgleichskasse Obwalden (Frist 31.05.2026 abgelaufen). https://www.akow.ch/ipv — abgerufen 16.09.2026

---

## NW — Nidwalden

**Beurteilung:** abbildbar
**Modell (kurz):** Selbstbehalt 10 % der «Summe der Steuerwerte» (Reineinkommen + Aufrechnungen + 20 % Reinvermögen); IPV = Richtprämie − Selbstbehalt; Kinder 80 % (Eltern ≤ CHF 100'000), junge Erwachsene in Ausbildung 50 %
**Zuständig / Weg:** Ausgleichskasse Nidwalden, Stans. Antrag (Formular oder online), Frist 30. April 2026 (Poststempel); mutmasslich Berechtigte erhalten das Formular bis Ende März 2026 zugestellt. EL-Beziehende (AHV/IV) brauchen keinen Antrag.
**Gültigkeit:** 2026 definitiv (Verordnung vom 09.12.2025, in Kraft seit 01.01.2026)

### Rechenmodell
> «Die Prämien werden im Rahmen der Richtprämien verbilligt, soweit sie den Selbstbehalt übersteigen.» — kKVG NW Art. 12 Abs. 1, Quelle [2]

> «Der Selbstbehalt für das Jahr 2026 beträgt 10 Prozent.» / «Der für die Berechnung des Selbstbehalts massgebende Anteil des anrechenbaren Reinvermögens beträgt 20 Prozent.» — Verordnung 2026 § 1, Quelle [1]

> «Die Prämien werden im Rahmen der Richtprämien für Kinder zu 80 Prozent vergütet, sofern die Summe der Steuerwerte der Eltern gemäss Art. 12 Abs. 2 Fr. 100'000.– nicht übersteigt.» — kKVG NW Art. 14 Abs. 1, Quelle [2]

> «Die Prämien werden im Rahmen der Richtprämien für junge Erwachsene in Ausbildung zur Hälfte vergütet.» — kKVG NW Art. 15 Abs. 1, Quelle [2]

Rechenweg (abgeleitet aus [1]/[2]): IPV = Summe der Richtprämien des Haushalts − 10 % × Summe der Steuerwerte, mindestens 0; Kinder/junge Erwachsene in Ausbildung mindestens die Sonderanteile; Plafonierung auf die effektive Prämie; Beträge unter CHF 100 werden nicht ausbezahlt.

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene (Jg. 2000 und älter) | CHF 5'400 | [1] § 2 Abs. 2, [3] |
| Richtprämie junge Erwachsene (Jg. 2001–2007) | CHF 3'912 | [1] § 2 Abs. 2, [3] |
| Richtprämie Kinder (Jg. 2008 und jünger) | CHF 1'260 | [1] § 2 Abs. 2, [3] |
| Richtprämien EL-Beziehende (Erw. / j. Erw. / Kind) | CHF 5'928 / 4'296 / 1'380 | [1] § 2 Abs. 1 |
| Selbstbehalt | 10 % der Summe der Steuerwerte | [1] § 1 Abs. 1 |
| Anteil Reinvermögen | 20 % | [1] § 1 Abs. 2 |
| Kinder: besondere IPV | 80 % der Richtprämie, wenn Steuerwerte Eltern ≤ CHF 100'000 | [2] Art. 14, [3] |
| Junge Erwachsene in Ausbildung | 50 % der Richtprämie; entfällt bei Reineinkommen > CHF 30'240 | [2] Art. 15, [3] |
| Quellenbesteuerte | 80 % des der Quellensteuer zugrunde liegenden Einkommens, Periode 2025 | [1] § 4 |
| Mindestauszahlung | Beträge unter CHF 100 nicht ausbezahlt | [1] § 5 |
| Massgebende Steuerperiode | 2024 (ersatzweise 2023) | [1] § 3 |
| Gesetzlicher Rahmen Selbstbehalt | 7–11 %; Reinvermögensanteil 10–20 % | [2] Art. 12 Abs. 3 |

Wörtlich zum Grenzwert junge Erwachsene: «Übersteigt das Reineinkommen eines jungen Erwachsenen den Betrag von CHF 30'240, entfällt die Berechtigung ganz.» — Quelle [3] (im Gesetz: «Höchstbetrag der vollen AHV-Altersrente», [2] Art. 15 Abs. 3).

### Massgebendes Einkommen
> «Die massgebenden finanziellen Verhältnisse ergeben sich aus dem Reineinkommen (Code 330 der Veranlagungsverfügung) samt Aufrechnungen* und 20 Prozent des Reinvermögens (Code 470). Dieser Betrag wird als Summe der Steuerwerte bezeichnet.» — Quelle [3]

> «Zum Reineinkommen werden aufgerechnet: Einkommen nach dem vereinfachten Abrechnungsverfahren; Einkauf in die berufliche Vorsorge; Abzug aus dem Teileinkünfteverfahren und Abzug für Liegenschaftsunterhalt, abzüglich 15 Prozent der Erträge privater Liegenschaften.» — Quelle [3] (entspricht [2] Art. 12 Abs. 2; dort BGSA-Lohn zu 80 %)

### Abweichung zur App
App: maxIncome 45'000, subsidySingle 2'250, linearer Abbau. Belegt ist für eine erwachsene Einzelperson ohne Vermögen: CHF 5'400 bei Steuerwerten 0, Abbau um 10 Rappen je Franken, null bei Summe der Steuerwerte CHF 54'000 (Auszahlung erst ab CHF 100, also praktisch bis 53'000). Die App gibt also einen zu tiefen Höchstbetrag und eine zu tiefe Grenze an. Die Grenze gilt zudem nicht für das Einkommen allein, sondern für die Steuerwerte inkl. 20 % des Reinvermögens.

### Offen / nicht gefunden
- Online-Rechner der AK NW (https://www.aknw.ch/online-services/online-rechner/provisorische-berechnung-des-anspruchs-auf-praemienverbilligung) nicht geöffnet; für das Modell nicht nötig.
- Ob für junge Erwachsene ohne Ausbildung Besonderes gilt: nur die allgemeine Regel (Richtprämie CHF 3'912 minus Selbstbehalt) belegt.
- Wie Kinder in der allgemeinen IPV genau verrechnet werden (Reihenfolge der Sonder- und der allgemeinen IPV), ist nur allgemein belegt («wird diese zusätzlich ausgerichtet»).

### Quellen
1. NG 742.111 Verordnung zur Prämienverbilligung für das Jahr 2026, Regierungsrat Nidwalden, vom 09.12.2025, in Kraft seit 01.01.2026. https://gesetze.nw.ch/app/de/texts_of_law/742.111 (Text über https://gesetze.nw.ch/api/de/texts_of_law/742.111/show_as_json) — abgerufen 16.09.2026
2. NG 742.1 Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (kKVG) vom 25.10.2006, aktuelle Fassung. https://gesetze.nw.ch/app/de/texts_of_law/742.1 (Text über https://gesetze.nw.ch/api/de/texts_of_law/742.1/show_as_json) — abgerufen 16.09.2026
3. Merkblatt «Prämienverbilligung 2026 im Kanton Nidwalden», Ausgleichskasse Nidwalden, Stand Februar 2026. https://www.aknw.ch/uploads/PDF-Formulare-Merkbl%C3%A4tter/IPV-OKP-KVGRegress/Merkblatt-Praemienverbilligung-2026.pdf — abgerufen 16.09.2026

---

## GL — Glarus

**Beurteilung:** teilweise
**Modell (kurz):** Richtprämie − Selbstbehalt; Selbstbehalt in Stufen 9–14 % des ganzen anrechenbaren Einkommens (bis 40'000: 9 % … über 80'000: 14 %); Kinder mind. 80 %, junge Erwachsene in Ausbildung mind. 50 % bei Haushalts-AE ≤ CHF 85'000; Richtprämie = 85 % (Kinder 100 %) der EDI-Durchschnittsprämie
**Zuständig / Weg:** Kantonale Steuerverwaltung Glarus, Fachstelle IPV. Antrag jedes Jahr (Papier oder my.gl.ch), Frist 31. Januar 2026; später eingereichte Anträge gelten erst ab dem Folgemonat. EL-/Sozialhilfebeziehende ohne Antrag.
**Gültigkeit:** 2026 definitiv für Modell und Sätze (PVV Stand 01.01.2020, Merkblatt 2026); Richtprämien 2026 in Franken nicht in einer kantonalen Quelle gelesen (nur abgeleitet)

### Rechenmodell
> «Die Prämienverbilligung entspricht der Differenz zwischen Richtprämie und Selbstbehalt, höchstens aber der effektiven Jahresprämie für die obligatorische Krankenpflegeversicherung der anspruchsberechtigten Person.» — EG KVG Art. 14 Abs. 1, Quelle [2]

> «Der Selbstbehalt entspricht einem vom Landrat nach Einkommenskategorien festgelegten prozentualen Anteil des anrechenbaren Einkommens.» — EG KVG Art. 14 Abs. 3, Quelle [2]

> «a. bis 40 000 Franken anrechenbares Einkommen: 9 %; b. bis 50 000 Franken anrechenbares Einkommen: 10 %; c. bis 60 000 Franken anrechenbares Einkommen: 11 %; d. bis 70 000 Franken anrechenbares Einkommen: 12 %; e. bis 80 000 Franken anrechenbares Einkommen: 13 %; f. über 80 000 Franken anrechenbares Einkommen: 14 %.» — PVV Art. 1, Quelle [1]

> «Die Richtprämien je Personenkategorie entsprechen den folgenden Anteilen an den vom Bund jährlich festgelegten Durchschnittsprämien […]: a. für Erwachsene (über 25 Jahre): 85 %; b. für junge Erwachsene (18–25 Jahre): 85 %; c. für Kinder: 100 %.» — VV PV Art. 10 Abs. 1, Quelle [3]

> «Der Kanton verbilligt die Prämien der Kinder um 80 Prozent und die Prämien der jungen Erwachsenen in Ausbildung um 50 Prozent der jeweiligen Richtprämie, sofern die Berechnung gemäss Artikel 14 Absatz 1 einen tieferen Anspruch auf Prämienverbilligung ergibt und das anrechenbare Einkommen einen vom Landrat festgelegten Grenzbetrag nicht übersteigt.» — EG KVG Art. 16 Abs. 3, Quelle [2]; «Der Grenzbetrag im Sinne von Artikel 16 Absatz 3 EG KVG beträgt 85 000 Franken.» — PVV Art. 4, Quelle [1]

Rechenweg (abgeleitet): Der Satz der Einkommensstufe gilt nach Wortlaut von Art. 14 Abs. 3 auf das ganze anrechenbare Einkommen (kein Grenzsteuer-Prinzip) → Sprünge an den Stufengrenzen. Die massgebende Prämie ist die Summe der Richtprämien des Haushalts ([3] Art. 9 Abs. 1); IPV unter CHF 12 je Person und Jahr wird nicht ausgerichtet ([3] Art. 9 Abs. 3).

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Selbstbehalt-Stufen | 9 % (≤ 40'000) · 10 % (≤ 50'000) · 11 % (≤ 60'000) · 12 % (≤ 70'000) · 13 % (≤ 80'000) · 14 % (> 80'000) | [1] Art. 1 |
| Grenzbetrag Mindestanspruch Kinder / junge Erw. in Ausbildung | CHF 85'000 anrechenbares Einkommen | [1] Art. 4, [4] |
| Mindestanspruch | Kinder 80 %, junge Erwachsene in Ausbildung 50 % der Richtprämie | [2] Art. 16 Abs. 3 |
| Richtprämien-Regel | Erw. und junge Erw. 85 %, Kinder 100 % der EDI-Durchschnittsprämie | [3] Art. 10 |
| EDI-Durchschnittsprämie GL 2026 (Erw. / j. Erw. / Kind) | CHF 6'408 / 4'584 / 1'500 | [5] |
| Richtprämie Erwachsene 2026 (abgeleitet, 85 % von 6'408) | CHF 5'446.80 — **nicht kantonal publiziert gelesen** | [3]+[5] |
| Richtprämie junge Erwachsene 2026 (abgeleitet, 85 % von 4'584) | CHF 3'896.40 — **nicht kantonal publiziert gelesen** | [3]+[5] |
| Richtprämie Kinder 2026 (abgeleitet, 100 %) | CHF 1'500 — **nicht kantonal publiziert gelesen** | [3]+[5] |
| Vermögensanrechnung | 10 % des steuerbaren Vermögens | [1] Art. 2 |
| Kinderabzug | CHF 5'000 je minderjähriges Kind und jungen Erwachsenen in Ausbildung | [1] Art. 3 |
| Mindestauszahlung | CHF 12 je Person und Jahr | [3] Art. 9 Abs. 3 |
| Bemessung | definitive Steuerveranlagung 2024 | [4] |
| Eigenes Gesuch Kind in Ausbildung | wenn Nettoerwerbseinkommen > CHF 14'000 | [4] Ziff. 6 |

Plausibilitätsprobe der Ableitungsmethode: Für OW ergibt 85 % × 5'904 (EDI) genau die dort amtlich publizierte Richtprämie 5'018.40; für GL ist die kantonale Frankenzahl dennoch nicht gelesen.

### Massgebendes Einkommen
> «Anrechenbares Einkommen = Total der Einkünfte + zehn Prozent des steuerbaren Vermögens + Unterhaltskosten für Liegenschaften + mit der AHV direkt abgerechnete Nebenerwerbe - Mietwert von Liegenschaften oder Liegenschaftsteilen, die aufgrund von Eigentum oder eines unentgeltlichen Nutzungsrechts für den Eigengebrauch zur Verfügung stehen - 5000 Franken für jedes minderjährige Kind - Alimente für die geschiedenen oder getrennt lebenden Ehepartner und für minderjährige Kinder.» — Merkblatt 2026, Fussnote 1, Quelle [4] (Rechtsgrundlage PVV Art. 2–3, dort Kinderabzug auch für junge Erwachsene in Ausbildung)

> «Bei Personen, die einen Gesamtanspruch haben, werden die anrechenbaren Einkommen zusammengezählt.» — EG KVG Art. 15 Abs. 2, Quelle [2]

### Abweichung zur App
App: maxIncome 42'000, subsidySingle 2'100, modelFlat, Hinweis «automatisch aus Steuerdaten». Belegt ist ein Selbstbehalt-Modell mit Antrag (Frist 31. Januar), nicht automatisch. Mit der abgeleiteten Richtprämie 5'446.80 erhielte eine Einzelperson bis zu CHF 5'446.80 (AE 0), bei AE 40'000 CHF 1'846.80, bei AE 50'000 CHF 446.80, über 50'000 nichts; der App-Wert liegt damit deutlich zu tief (Richtprämie aber nur abgeleitet).

### Offen / nicht gefunden
- Kantonal publizierte Richtprämien 2026 in Franken (laut Merkblatt im Amtsblatt, im Online-Schalter und in der Zeitung «Fridolin»): Die HTML-Seiten von gl.ch antworten auf Abruf mit **HTTP 403** («Zugriff verweigert»), auch https://www.gl.ch/verwaltung/finanzen-und-gesundheit/steuern/individuelle-praemienverbilligung-ipv.html/502. Nur die PDFs waren lesbar; das Anmeldeformular 2026 enthält keine Beträge.
- Stufenlogik: Wortlaut spricht für den Satz auf das ganze Einkommen; nicht durch einen Rechner oder ein Rechenbeispiel bestätigt.
- EG KVG ist in der aktuellen Fassung «in Kraft seit: 01.01.2023 bis: 31.12.2026»; eine Umstellung auf automatische IPV (Landsgemeinde 2026) ist in Pressemitteilungen von gl.ch angekündigt, aber wegen 403 nicht gelesen. Für 2027 neu prüfen.
- Der Grenzbetrag 85'000 steht im Merkblatt nur für Kinder; das Gesetz knüpft beide Mindestansprüche (Kinder und junge Erwachsene in Ausbildung) daran.

### Quellen
1. GS VIII D/21/3 Verordnung über die Prämienverbilligung (Prämienverbilligungsverordnung; PVV), Landrat Glarus, vom 21.12.2016, Stand 01.01.2020. https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/3 (Text über die API show_as_json) — abgerufen 16.09.2026
2. GS VIII D/21/1 Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EG KVG), vom 03.05.2015, Fassung in Kraft 01.01.2023 bis 31.12.2026. https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/1 — abgerufen 16.09.2026
3. GS VIII D/21/2 Verordnung über den Vollzug der Prämienverbilligung (VV PV), vom 23.12.2013, Stand 01.01.2020. https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/2 — abgerufen 16.09.2026
4. «Individuelle Prämienverbilligung (IPV) der obligatorischen Krankenpflegeversicherung — Merkblatt für das Jahr 2026», Kantonale Steuerverwaltung Glarus, Fachstelle IPV (ohne Datum, Jahr 2026). https://www.gl.ch/public/upload/assets/63123/02%20Merkblatt%20IPV%202026.pdf?fp=1 — abgerufen 16.09.2026
5. Verordnung des EDI über die Durchschnittsprämien der Krankenpflegeversicherung für die Berechnung der EL und ÜL, Anhang (Art. 3), Inkrafttreten 1. Januar 2026, Ziff. 3 (Kantone mit einer Prämienregion). https://www.bsv.admin.ch/dam/de/sd-web/juMQ1SfoExDq/DE%20Anhang%20(Art.%203)%20Durchschnittspr%C3%A4mien%202026.pdf — abgerufen 16.09.2026
6. Anmeldeformular Prämienverbilligung IPV 2026 (Frist 31. Januar 2026, Bearbeitung bis Ende Juni 2026). https://www.gl.ch/public/upload/assets/63122/01%20Anmeldeformular%20Pr%C3%A4mienverbilligung%20IPV%202026.pdf?fp=1 — abgerufen 16.09.2026

---

## SO — Solothurn

**Beurteilung:** teilweise
**Modell (kurz):** Richtprämie (Durchschnittsprämie −30 %) minus Eigenanteil 10–16 % des massgebenden Einkommens (linear), Grenze MGE 74'000; Kinder ≥80 %, junge Erw. ≥50 % bis 74'000
**Zuständig / Weg:** Ausgleichskasse Solothurn (AKSO); Antragsformular wird ab Januar 2026 an voraussichtlich Berechtigte versandt (aus Steuerdaten), Rücksendung innert 30 Tagen, sonst verwirkt; Quellenbesteuerte: Antrag bis 31.12. des Anspruchsjahres
**Gültigkeit:** 2026 definitiv (Parameter-Verfügung Departement des Innern vom 27.01.2026)

### Rechenmodell
> «Personen, deren Aufwendungen für die Prämien der obligatorischen Krankenpflegeversicherung den vom Regierungsrat festgelegten Prozentsatz des massgebenden Einkommens übersteigen, haben Anspruch auf Beiträge zur Prämienverbilligung» — § 87 Abs. 1 SG, Quelle [3]

> «Anspruch auf Prämienverbilligung hat, wer über ein massgebendes Einkommen von 0 bis 84'000 Franken verfügt. Die prozentualen Eigenanteile werden abhängig von der Höhe des massgebenden Einkommens im Rahmen von 6 bis 12% linear festgelegt.» — § 70 Abs. 1 SV, Quelle [2] (das Departement kann Grenzwert um +/- 12'000 Fr. und Eigenanteile um +/- 4 % verändern, § 70 Abs. 2 SV)

> «Die anrechenbare Prämie entspricht für Kinder (bis zum vollendeten 18. Altersjahr), für junge Erwachsene (bis zum vollendeten 25. Altersjahr) und für ältere Versicherte (Erwachsene) je der kantonalen Durchschnittsprämie der obligatorischen Krankenversicherung minus 10%. Das Departement kann den Abschlag von 10% nach Massgabe der verfügbaren Mittel um +/- 20% verändern.» — § 68 Abs. 1 SV, Quelle [2]

> «Kindern werden die anrechenbaren Prämien bis zu einem massgebenden Einkommen von 84'000 Franken um mindestens 80% verbilligt, jungen Erwachsenen um mindestens 50%.» — § 70 Abs. 4 SV, Quelle [2]

> «Personen, die gemeinsam besteuert werden, haben einen Gesamtanspruch auf Prämienverbilligung.» — § 87 Abs. 2 SG, Quelle [3]

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Anteil des satzbestimmenden Vermögens im MGE | «50%» | [1] |
| Eigenanteile in % des massgebenden Einkommens | «10% bis 16%» | [1] |
| Einkommensgrenzwert Erwachsene | «74'000.- Franken» | [1] |
| Grenzwert 80 %-Verbilligung Kinder / 50 %-Verbilligung junge Erwachsene | «74'000.- Franken» | [1] |
| Auszahlungslimite pro erwachsene Person (darunter keine Auszahlung) | «240.- Franken» (pro Anspruchsjahr, § 70 Abs. 3 SV) | [1], [2] |
| Richtprämie Erwachsene | «422.- Franken (Durchschnittsprämie 602.- Franken)» | [1] |
| Richtprämie junge Erwachsene | «305.- Franken (Durchschnittsprämie 435.- Franken)» | [1] |
| Richtprämie Kinder | «98.- Franken (Durchschnittsprämie 139.- Franken)» | [1] |
| Stichtag Verhältnisse | «am 1. Januar des Anspruchsjahres» | [3] |
| Junge Erwachsene auf Antrag der Eltern | Jahrgänge 2001–2007, in Ausbildung am 1.1.2026, Sozialabzug Ziffer 630 | [4] |

Rechnerischer Hinweis (keine Quellenangabe, eigene Nachrechnung): 602 × 0,70 = 421,4 → 422; 435 × 0,70 = 304,5 → 305; 139 × 0,70 = 97,3 → 98. Der Abschlag 2026 beträgt demnach 30 % (10 % + 20 % nach § 68 SV). Die Beträge 422/305/98 sind der Grössenordnung nach **Monatsprämien**; die Verfügung nennt die Periode aber nicht ausdrücklich.

### Massgebendes Einkommen
> «Das massgebende Einkommen basiert auf Steuerwerten der letzten rechtskräftigen Steuerveranlagung nach kantonalem Steuergesetz und besteht aus einem korrigierten satzbestimmenden Einkommen und einem Anteil des satzbestimmenden Vermögens.» — § 89 Abs. 1 SG, Quelle [3]

> «Das für die Anspruchsberechnung massgebende Einkommen entspricht dem satzbestimmenden Einkommen der Steuerveranlagung unter Berücksichtigung der folgenden Einkommensvariablen: a) Aufrechnung der Pension zu 100%; b) Ausschluss von Kapitalabfindungen für wiederkehrende Leistungen; c) Aufrechnung von Geschäftsverlusten aus Vorjahren; d) Aufrechnung freiwilliger Zuwendungen; e) Aufrechnung der Beiträge an Einrichtungen der gebundenen Selbstvorsorge (Säule 3a) […]; f) Aufrechnung des Abzuges für Liegenschaftskosten; g) Anrechnung von 20% - 50% des satzbestimmenden Vermögens.» — § 69 Abs. 1 SV, Quelle [2] (2026: 50 %, Quelle [1])

Sonderfälle: EL-Beziehende erhalten die EDI-Durchschnittsprämie (in der EL enthalten); Sozialhilfebeziehende die effektive Grundversicherungsprämie, «maximal jedoch in der Höhe der kantonalen Richtprämie» (§ 71 Abs. 2–3 SV, Quelle [2]; erstmals für 2026, Quelle [5]). Ermessensveranlagte haben keinen Anspruch (§ 89 Abs. 3 SG, [3]).

### Abweichung zur App
Die App führt `maxIncome` 48'000 und `subsidySingle` 2'400 mit linearem Abbau; belegt ist ein Grenzwert von 74'000 (massgebendes Einkommen inkl. 50 % des satzbestimmenden Vermögens) und ein Modell «Richtprämie minus Eigenanteil 10–16 % des MGE», nicht ein linearer Abbau eines Festbetrags.

### Offen / nicht gefunden
- Ankerpunkte der linearen Eigenanteil-Skala (vermutlich 10 % bei MGE 0 bis 16 % bei 74'000) sind nicht wörtlich publiziert — nur «10% bis 16%» und «linear».
- Periode der Richtprämien (Monat/Jahr) nicht ausdrücklich genannt; Grössenordnung spricht für Monat.
- Genaue Rechenformel (Summe der Richtprämien des Haushalts × 12 minus Eigenanteil × MGE? Reihenfolge Kinder/junge Erwachsene) nicht wörtlich publiziert. Der AKSO-Online-Rechner (provisorische Berechnung) zeigt nur die Eingabemaske, keine Formel.
- Keine eigene Vermögensgrenze gefunden; Vermögen wirkt über den 50 %-Anteil im MGE.

### Quellen
1. Parameter für die Prämienverbilligung 2026, Vorgaben vom 27. Januar 2026, Departement des Innern Kanton Solothurn, Stand 27.01.2026. https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/2026-01-27-Verfuegung-Parameter-Individuelle-Praemie.pdf — abgerufen 16.09.2026
2. Sozialverordnung (SV), BGS 831.2, §§ 68–71, Kanton Solothurn, Stand 01.04.2026. https://bgs.so.ch/api/de/versions/5624/pdf_file (Eintrag: https://bgs.so.ch/app/de/texts_of_law/831.2) — abgerufen 16.09.2026
3. Sozialgesetz (SG), BGS 831.1, §§ 86–91, Kanton Solothurn, Fassung in Kraft seit 01.09.2026. https://bgs.so.ch/api/de/versions/5665/pdf_file (Eintrag: https://bgs.so.ch/app/de/texts_of_law/831.1) — abgerufen 16.09.2026
4. Merkblatt Individuelle Prämienverbilligung (IPV) 2026, Ausgleichskasse des Kantons Solothurn, ohne Datum (2026). https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/Merkblatt-IPV-2026.pdf und Seite https://www.akso.ch/dienstleistungen/praemienverbilligung-ipv — abgerufen 16.09.2026
5. Medienmitteilung «Anpassungen bei der individuellen Prämienverbilligung», Staatskanzlei Kanton Solothurn, 27.05.2025. https://so.ch/verwaltung/staatskanzlei/medien/medienmitteilung/news/anpassungen-bei-der-individuellen-praemienverbilligung/ — abgerufen 16.09.2026

---

## BS — Basel-Stadt

**Beurteilung:** abbildbar
**Modell (kurz):** Stufentabelle: 22 Beitragsgruppen nach massgeblichem Haushaltseinkommen und Haushaltsgrösse (1–8 Pers.), fester Monatsbeitrag je Person (Erwachsene / junge Erw. / Kinder), Zuschlag bei alternativem Versicherungsmodell (AVM)
**Zuständig / Weg:** Amt für Sozialbeiträge (ASB), Prämienverbilligung; **Antrag** mit Unterlagen nötig, keine Frist, Anspruch «ab dem Monat nach der Antragstellung» (Zuzug aus dem Ausland: Antrag innert 3 Monaten → ab Versicherungsbeginn)
**Gültigkeit:** 2026 definitiv (Anhang 2 KVO, Fassung RRB 21.10.2025, in Kraft 01.01.2026)

### Rechenmodell
> «Beiträge an die Krankenversicherungsprämien werden nur gewährt, wenn das massgebliche Einkommen der Haushaltseinheit gemäss § 6 Abs. 2 lit. d SoHaG die gemäss § 11 Abs. 2 SoHaV berechnete Leistungsgrenze nicht übersteigt. Bis zu einer Haushaltseinheit von acht Personen können die Leistungsgrenzen der unten stehenden Tabelle T 1 entnommen werden. Für Haushaltseinheiten von neun und mehr Personen erhöhen sich die Leistungsgrenzen […] um Fr. 4'000 pro Person.» — § 22 Abs. 1 KVO, Quelle [1]

> «Die Prämiengruppe sowie die Höhe der jeweiligen Beiträge an die Krankenversicherungsprämien ergeben sich, ausgehend vom jeweils massgeblichen Einkommen gemäss § 6 Abs. 2 lit. d SoHaG und unter Anwendung von § 21 dieser Verordnung, aus den unten stehenden Tabellen T 2, T 3 und T 4. Die maximale Höhe der Beiträge an die Krankenversicherungsprämien entspricht höchstens der im konkreten Fall tatsächlich geschuldeten Prämie» — § 22 Abs. 2 KVO, Quelle [1]

> «Anspruchsberechtigte Personen, die in einer besonderen Versicherungsform gemäss Art. 62 Abs. 1 KVG versichert sind, erhalten einen Zuschlag zum monatlichen Beitrag an die Krankenversicherungsprämien.» — § 21 Abs. 1bis KVO, Quelle [1]

Lesart der Tabelle (belegt durch das amtliche Berechnungsbeispiel [3]): Die T1-Werte sind **Obergrenzen** der jeweiligen Gruppe. Beispiel: «4-Personenhaushalt · Massgebliches Einkommen: 62'000.- · Einkommensgruppe: 5» (Gruppe 4 endet bei 61'000, Gruppe 5 bei 63'000). «Monatlicher Beitrag ohne AVM: 2 erwachsene Personen: 2 x 325.-, junge erwachsene Person: 247.-, Kind: 124.-» — Quelle [3]

### Zahlen 2026
Leistungsgrenzen (T1, massgebliches Einkommen in Fr. pro Jahr, Obergrenze der Gruppe) und Beiträge in Fr. **pro Monat** (T3 ohne AVM / T4 mit AVM) — Quelle [2] (Anhang 2 KVO, «Fassung vom 21. Oktober 2025»), abgeglichen mit [3] und [4]:

| Gr. | 1 P | 2 P | 3 P | 4 P | 5 P | 6 P | 7 P | 8 P | Kind | Junge Erw. | Erw. | Kind AVM | Junge Erw. AVM | Erw. AVM |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | 23'125 | 37'000 | 47'000 | 55'000 | 61'000 | 65'000 | 69'000 | 73'000 | 157 | 329 | 444 | 163 | 335 | 474 |
| 02 | 24'375 | 39'000 | 49'000 | 57'000 | 63'000 | 67'000 | 71'000 | 75'000 | 146 | 308 | 415 | 152 | 314 | 445 |
| 03 | 25'625 | 41'000 | 51'000 | 59'000 | 65'000 | 69'000 | 73'000 | 77'000 | 137 | 289 | 385 | 143 | 295 | 415 |
| 04 | 26'875 | 43'000 | 53'000 | 61'000 | 67'000 | 71'000 | 75'000 | 79'000 | 129 | 266 | 352 | 135 | 272 | 382 |
| 05 | 28'125 | 45'000 | 55'000 | 63'000 | 69'000 | 73'000 | 77'000 | 81'000 | 124 | 247 | 325 | 130 | 253 | 355 |
| 06 | 29'375 | 47'000 | 57'000 | 65'000 | 71'000 | 75'000 | 79'000 | 83'000 | 124 | 232 | 296 | 130 | 238 | 326 |
| 07 | 30'625 | 49'000 | 59'000 | 67'000 | 73'000 | 77'000 | 81'000 | 85'000 | 124 | 229 | 266 | 130 | 235 | 296 |
| 08 | 31'875 | 51'000 | 61'000 | 69'000 | 75'000 | 79'000 | 83'000 | 87'000 | 124 | 229 | 237 | 130 | 235 | 267 |
| 09 | 33'125 | 53'000 | 63'000 | 71'000 | 77'000 | 81'000 | 85'000 | 89'000 | 124 | 229 | 210 | 130 | 235 | **240** ⚠️ |
| 10 | 34'375 | 55'000 | 65'000 | 73'000 | 79'000 | 83'000 | 87'000 | 91'000 | 124 | 229 | 179 | 130 | 235 | 209 |
| 11 | 35'625 | 57'000 | 67'000 | 75'000 | 81'000 | 85'000 | 89'000 | 93'000 | 124 | 229 | 148 | 130 | 235 | 178 |
| 12 | 36'875 | 59'000 | 69'000 | 77'000 | 83'000 | 87'000 | 91'000 | 95'000 | 124 | 229 | 118 | 130 | 235 | 148 |
| 13 | 38'125 | 61'000 | 71'000 | 79'000 | 85'000 | 89'000 | 93'000 | 97'000 | 124 | 229 | 91 | 130 | 235 | 121 |
| 14 | 39'375 | 63'000 | 73'000 | 81'000 | 87'000 | 91'000 | 95'000 | 99'000 | 124 | 229 | 61 | 130 | 235 | 91 |
| 15 | 40'625 | 65'000 | 75'000 | 83'000 | 89'000 | 93'000 | 97'000 | 101'000 | 124 | 229 | 43 | 130 | 235 | 73 |
| 16 | 41'875 | 67'000 | 77'000 | 85'000 | 91'000 | 95'000 | 99'000 | 103'000 | 124 | 229 | 37 | 130 | 235 | 67 |
| 17 | 43'125 | 69'000 | 79'000 | 87'000 | 93'000 | 97'000 | 101'000 | 105'000 | 124 | 229 | 33 | 130 | 235 | 63 |
| 18 | 44'375 | 71'000 | 81'000 | 89'000 | 95'000 | 99'000 | 103'000 | 107'000 | 124 | 229 | 30 | 130 | 235 | 60 |
| 19 | 45'625 | 73'000 | 83'000 | 91'000 | 97'000 | 101'000 | 105'000 | 109'000 | 124 | 229 | 26 | 130 | 235 | 56 |
| 20 | 46'875 | 75'000 | 85'000 | 93'000 | 99'000 | 103'000 | 107'000 | 111'000 | 124 | 229 | 23 | 130 | 235 | 53 |
| 21 | 48'125 | 77'000 | 87'000 | 95'000 | 101'000 | 105'000 | 109'000 | 113'000 | 124 | 229 | 20 | 130 | 235 | 50 |
| 22 | 49'375 | 79'000 | 89'000 | 97'000 | 103'000 | 107'000 | 111'000 | 115'000 | 124 | 229 | 17 | 124 | 229 | 26 |

| Grösse | Wert | Quelle |
|---|---|---|
| Leistungsgrenze Einzelperson / 4-Personen-Haushalt | 49'375 / 97'000 Fr. pro Jahr | [2], [5] |
| Leistungsgrenze ab 9 Personen | «um Fr. 4'000 pro Person» über 8-Personen-Grenze | [1] |
| Richtprämie (für Mindestverbilligung Kinder 80 % / junge Erw. 50 %) | «90 % der kantonalen Durchschnittsprämie der jeweiligen Personenkategorie» | [2] |
| Kantonale Durchschnittsprämie 2026 (Beitragstabelle ASB) | Erwachsene 694.-, Junge Erw. 507.-, Kinder 172.- | [3] |
| Junge Erwachsene | «unabhängig davon ob in Ausbildung oder nicht» | [2] |
| Vermögensfreibeträge | «für Alleinstehende CHF 37'500, für Paare CHF 60'000 und für Kinder je CHF 15'000» | [6] |
| Vermögensanteil | «um einen Zehntel des überschiessenden Teils» | [6] |
| Liegenschaften | «mit 25 Prozent des Steuerwerts» | [6] |
| Anpassung 2026 | «um 2.9 Prozent für Erwachsene, um 1.5 Prozent für 18- bis 25-Jährige und um 4.6 Prozent für Kinder» | [4] |

⚠️ Abweichung zwischen zwei amtlichen Dokumenten: Gruppe 09, Erwachsene mit AVM — **Verordnung (Anhang 2 KVO) und Bericht: 240**; ASB-Beitragstabelle 2026: 230. Massgebend ist die Verordnung (240; auch rechnerisch 210 + 30 AVM-Zuschlag).

### Massgebendes Einkommen
> «für die Anspruchsermittlung auf Prämienverbilligung […] da) das anrechenbare Einkommen gemäss § 7 dieses Gesetzes; db) nach § 1 Abs. 1 lit. a bis c dieses Gesetzes bezogene Leistungen; dc) Ausbildungsbeiträge; dd) Ergänzungsleistungen und Beihilfen» — § 6 Abs. 2 lit. d SoHaG, Quelle [7]

> «Es umfasst die Einnahmen und anrechenbaren Vermögensanteile der Haushaltseinheit gemäss § 5 dieses Gesetzes bereinigt um die anerkannten Abzüge.» — § 7 Abs. 2 SoHaG, Quelle [7]

> «Massgebliches Einkommen = Nettolohn inkl. Kinder- und Ausbildungszulagen, zzgl. vorgelagerte Leistungen (Alimentenhilfe, Stipendien) und allfälliger Vermögensanteil.» — Quelle [3]

Berechnungsgrundlage ist grundsätzlich die letzte Steuerveranlagung; bei Abweichung von mindestens 20 % aktuelle Unterlagen (Quelle [8]). Hypothetisches Einkommen wird angerechnet, wenn Haushaltsmitglieder weniger arbeiten als zumutbar (Quelle [8]; Details §§ 19 ff. SoHaV [6]).

### Abweichung zur App
Die App führt `maxIncome` 54'000 und `subsidySingle` 3'000/Jahr mit linearem Abbau; belegt sind für eine Einzelperson die Grenze 49'375 Fr. und 444 Fr. **pro Monat** (5'328 Fr./Jahr) in der tiefsten Gruppe, gestuft bis 17 Fr./Monat — die App liegt bei der Grenze zu hoch und beim Maximalbetrag deutlich zu tief.

### Offen / nicht gefunden
- Die genauen Bestandteile der «Einnahmen» und «anerkannten Abzüge» (§§ 16–17 SoHaV) sind komplex; für die App braucht es eine Vereinfachung (z. B. Nettolohn + Zulagen + Vermögensanteil, wie im ASB-Beispiel).
- Die SoHaV-Fassung in der Gesetzessammlung ist die «Aktuelle Version in Kraft seit: 01.07.2021»; Freibeträge stimmen mit der ASB-Seite überein.
- Höhe des hypothetischen Einkommens (ASB-Seite nennt 28'800 Fr./Jahr für Erwachsene) nicht in einer Rechtsquelle nachgeprüft.

### Quellen
1. Verordnung über die Krankenversicherung im Kanton Basel-Stadt (KVO), SG 834.410, §§ 21–22, Stand «in Kraft seit 01.01.2026» (Beschluss 16.12.2025). https://www.gesetzessammlung.bs.ch/api/de/versions/6727/pdf_file (Eintrag: https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/834.410) — abgerufen 16.09.2026
2. KVO Anhang 2 (Anhang zu § 22 Abs. 2), Fassung vom 21. Oktober 2025, in Kraft 01.01.2026. https://www.gesetzessammlung.bs.ch/api/de/versions/6727/annexes — abgerufen 16.09.2026
3. Einkommensgruppen, -grenzen und IPV-Beiträge ab 1. Januar 2026 (Beitragstabelle mit Berechnungsbeispiel), Amt für Sozialbeiträge Basel-Stadt, «Gemäss Beschluss des Regierungsrates vom 21. Oktober 2025». https://media.bs.ch/original_file/62d19a5c9191fdae44edc32c89b0e5090b1e1322/pv-beitragstabelle-berechnungsbeispiel-2026.pdf — abgerufen 16.09.2026
4. Bericht über die Prämienverbilligung 2026, Departement für Wirtschaft, Soziales und Umwelt, Oktober 2025. https://media.bs.ch/original_file/6728c0b091999dea9afc2a4c778dcb753b90e1d7/kvo2026-bericht-pv-0.pdf — abgerufen 16.09.2026
5. Prämienverbilligung (Themenseite), Kanton Basel-Stadt. https://www.bs.ch/themen/finanzielle-hilfe/leistungen/praemienverbilligung — abgerufen 16.09.2026
6. Verordnung über die Harmonisierung und Koordination von bedarfsabhängigen Sozialleistungen (SoHaV), SG 890.710, §§ 11, 28, 29, in Kraft seit 01.07.2021. https://www.gesetzessammlung.bs.ch/api/de/versions/5476/pdf_file — abgerufen 16.09.2026
7. Gesetz über die Harmonisierung und Koordination von bedarfsabhängigen Sozialleistungen (SoHaG), SG 890.700, §§ 6–7, in Kraft seit 01.07.2025. https://www.gesetzessammlung.bs.ch/api/de/versions/6622/pdf_file — abgerufen 16.09.2026
8. Merkblatt Prämienverbilligung (Ausgabe 01.2026), Amt für Sozialbeiträge. https://media.bs.ch/original_file/5fe6904e84baed32e2ffd98bb846fa9144cd536a/pv-merkblatt-2026.pdf — abgerufen 16.09.2026

---

## AI — Appenzell Innerrhoden

**Beurteilung:** abbildbar
**Modell (kurz):** Richtprämie (Summe Haushalt) minus Selbstbehalt 7–12 % des massgebenden Gesamteinkommens (gestuft +0,125 %/Fr. 1'000 zwischen 45'000 und 85'000); Kinder/JE in Ausbildung Mindest-IPV 80 %/50 % der Richtprämie bis MGE 75'000
**Zuständig / Weg:** Gesundheitsamt AI; automatisch ermittelt, kein Antrag («Es muss kein Antrag gestellt werden»); provisorische IPV auf Gesuch mit Formular; EL-Beziehende über Kantonale Ausgleichskasse
**Gültigkeit:** 2026 definitiv (Merkblatt IPV 2026, PDF erstellt 09.12.2025)

### Rechenmodell
> «Die IPV berechnet sich aus der Differenz zwischen der Richtprämie und dem Selbstbehalt. Bei Personen, die einen Gesamtanspruch auf Prämienverbilligung haben, werden die Richtprämien zusammengezählt.» — Quelle [1], Ziff. 3

> «Bei einem Gesamteinkommen von bis und mit Fr. 45'000.– liegt der Selbstbehalt bei 7.00%, des massgebenden Gesamteinkommens; Bei einem Gesamteinkommen von Fr. 85'000.– und darüber liegt der Selbstbehalt bei 12.00%, […] dazwischen steigt der Selbstbehalt pro Fr. 1'000.– Gesamteinkommen schrittweise um 0.125%.» — Quelle [1], Ziff. 3.2

> «Die IPV für Kinder wird auf 80 % und für junge Erwachsene in Ausbildung auf 50 % der Richtprämien angehoben, sofern das massgebende Gesamteinkommen Fr. 75'000.- nicht übersteigt. Die IPV einer über 25-jährigen Person wird nie angehoben.» — Quelle [1], Ziff. 3.3

Rechenbeispiel im Merkblatt (Stufenlogik): «Selbstbehalt (7% + 15 x 0.125% = 8.875% von Fr. 60‘000.–)» — Quelle [1], Ziff. 3.4

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene (Jg. 2000 und älter) | Fr. 4'640 / Jahr | [1] Ziff. 3.1 |
| Richtprämie junge Erwachsene (Jg. 2001–2007) | Fr. 3'446 / Jahr | [1] Ziff. 3.1 |
| Richtprämie Kinder (Jg. 2008 und jünger) | Fr. 1'034 / Jahr | [1] Ziff. 3.1 |
| Selbstbehalt bis MGE Fr. 45'000 | 7,00 % des MGE | [1] Ziff. 3.2 |
| Selbstbehalt ab MGE Fr. 85'000 | 12,00 % des MGE | [1] Ziff. 3.2 |
| Stufe dazwischen | +0,125 % pro Fr. 1'000 MGE | [1] Ziff. 3.2 |
| Mindest-IPV Kind (bis MGE 75'000) | 80 % Richtprämie = Fr. 827.20 («Erhöhung … auf Fr. 827.20 pro Kind») | [1] Ziff. 3.3/3.4 |
| Mindest-IPV junge Erwachsene in Ausbildung (bis MGE 75'000) | 50 % Richtprämie = Fr. 1'723 | [1] Ziff. 3.3/3.4 |
| Vermögensanrechnung | 10 % des steuerpflichtigen Gesamtvermögens (kein fester Vermögens-Grenzwert genannt) | [1] Ziff. 2 |
| Mindestanspruch für Auszahlung | Fr. 100 («ab einem Anspruch oder Gesamtanspruch von Fr. 100.–») | [1] Ziff. 4 |
| Schwelle Alleinanspruch junge Erwachsene | MGE über Fr. 12'000 | [1] Ziff. 2.2 |
| Sozialhilfebeziehende (Stichtag 1.1.2026) | volle Richtprämie ohne Selbstbehalt, max. tatsächliche Prämie | [1] Ziff. 3.5 |
| Einkommensgrenze | **keine publizierte Grenze** — ergibt sich rechnerisch aus Richtprämie = Selbstbehalt (abgeleitet, nicht amtlich: Einzelperson ohne Kinder ca. MGE Fr. 55'000–56'000; bei 55'000 Selbstbehalt 8,25 % = 4'537.50 < 4'640, bei 56'000 8,375 % = 4'690 > 4'640) | abgeleitet aus [1] |

Kontrolle mit amtlichem Beispiel: Alleinstehend, MGE 20'000 → 4'640 − 7 % × 20'000 = 3'240; Merkblatt: «Total IPV = Richtprämie minus Selbstbehalt Fr. 3'240.00» [1].

### Massgebendes Einkommen
> «steuerpflichtiges Gesamteinkommen; 10% des steuerpflichtigen Gesamtvermögens; Unterhalts- und Verwaltungskosten für Grundstücke des Privatvermögens, soweit sie den Pauschalabzug von 20% der entsprechenden Erträge übersteigen; Beiträge an anerkannte Formen der gebundenen Selbstvorsorge (Säule 3a); Einkaufsbeiträge an Einrichtungen der beruflichen Vorsorge; sämtliche Einkommen, die über das [BGSA] abgerechnet werden.» — Quelle [1], Ziff. 2

> «Das massgebende Gesamteinkommen wird in der Regel auf der Grundlage der definitiven Steuerveranlagung 2024 berechnet.» — Quelle [1], Ziff. 2

Quellensteuerpflichtige ohne ordentliche Veranlagung: «Bruttoeinkommen reduziert um einen Pauschalabzug von 20%» [1]. Einkünfte nach Art. 22ter und 23 Abs. 1bis StG werden auf 100 % aufgerechnet [1].

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben; belegter Vergleichswert: Einzelperson erhält bei MGE 0 die volle Richtprämie Fr. 4'640 und nicht linear abnehmend, sondern 4'640 − gestufter Selbstbehalt; eine feste Einkommensgrenze gibt es in AI nicht (Nullpunkt Einzelperson rechnerisch ca. Fr. 55'000–56'000 MGE). Der lineare App-Abbau bildet die Stufenlogik nicht ab.

### Offen / nicht gefunden
- Standeskommissionsbeschluss GS 832.501 (Rechtsgrundlage, Art. 5 Abs. 5 StKB) nicht selbst geöffnet; Werte stammen aus dem amtlichen Merkblatt, das auf den StKB verweist.
- Ob die 0,125-%-Stufe auf angefangene oder volle Fr. 1'000 wirkt, ist im Merkblatt nur über die Beispiele (60'000 → 15 Stufen, 75'000 → 30 Stufen) erkennbar; für Zwischenwerte (z. B. 60'500) nicht wörtlich geregelt.
- Keine separate Vermögensgrenze publiziert (nur 10 %-Anrechnung).

### Quellen
1. Merkblatt zur individuellen Prämienverbilligung (IPV) 2026 (AI 511.2-34.5-1358131), Kanton Appenzell Innerrhoden, Gesundheitsamt, Stand PDF 09.12.2025. https://www.ai.ch/themen/gesundheit-alter-und-soziales/individuelle-praemienverbilligung/merkblatt-ipv/merkblatt-ipv-2024/@@download/file/Merkblatt%20IPV%202026.pdf — abgerufen 16.09.2026 (HTTP 200, per curl + pdftotext gelesen)

---

## SG — St. Gallen

**Beurteilung:** abbildbar
**Modell (kurz):** Regionale Referenzprämie (3 Regionen) minus Belastungsgrenze in % des massgebenden Einkommens; Satz steigt linear pro Franken über einem Sockel (z. B. Alleinstehend ohne Kinder: 12,16 % bis 18'700, +0,0002 Prozentpunkte je Franken darüber); Vermögensgrenze 100'000; Minimalgarantie Kinder 80 % / JE in Ausbildung 50 % bis Einkommens-Obergrenze
**Zuständig / Weg:** SVA St.Gallen; Antrag nötig (vorausgefülltes elektronisches Anmeldeformular, Anschreiben voraussichtlich Berechtigter), Frist für ganzjährigen Anspruch 31. März 2026; EL-Beziehende ohne Anmeldung
**Gültigkeit:** 2026 definitiv (Regierungsbeschluss sGS 331.538 vom 9.12.2025, in Vollzug seit 1.1.2026)

### Rechenmodell
> «Die Verbilligung der Referenzprämien … beträgt 80 Prozent für Kinder und 50 Prozent für junge Erwachsene in Ausbildung.» — Quelle [2], Art. 19 Abs. 2

> «Für Alleinstehende ohne Kinder mit einem massgebenden Einkommen bis Fr. 18'700.– beträgt die Belastungsgrenze: 12,16 Prozent. Diese erhöht sich für das gesamte massgebende Einkommen um je 0,0002 Prozentpunkte für jeden Franken, um den es Fr. 18'700.– übersteigt.» — Quelle [1], Art. 5 Abs. 1

> «Für Verheiratete ohne Kinder mit einem massgebenden Einkommen bis Fr. 28'050.– beträgt die Belastungsgrenze: 12,16 Prozent. Diese erhöht sich … um je 0,0003 Prozentpunkte für jeden Franken, um den es Fr. 28'050.– übersteigt.» — Quelle [1], Art. 5 Abs. 2

Alleinstehende mit Kindern (Art. 5 Abs. 3): Sockel «Fr. 18'700.–, zuzüglich Fr. 9'350.– für jede weitere erwachsene Person bis zum vollendeten 25. Altersjahr und zuzüglich Fr. 5'610.– für jedes Kind», Satz «10,96 Prozent»; Zuwachs «0,0002 Prozentpunkte für die alleinstehende Person, zuzüglich 0,00005 … für jede weitere erwachsene Person bis zum vollendeten 25. Altersjahr und zuzüglich 0,00003 … für jedes Kind. Die maximale Erhöhung der Belastungsgrenze beträgt 0,0003 Prozentpunkte.» [1]

Verheiratete mit Kindern (Art. 5 Abs. 4): Sockel Fr. 28'050 (+9'350 je JE, +5'610 je Kind), Satz «12,41 Prozent»; Zuwachs «0,00025 Prozentpunkte für die Verheirateten, zuzüglich 0,00005 … je JE … und zuzüglich 0,00003 … für jedes Kind», maximal «0,00035 Prozentpunkte». [1]

Amtliches Beispiel: «Erwachsene, Region I, Referenzprämie CHF 6 285.60 / Abzüglich Selbstbehalt (Annahme: 12,16 Prozent von CHF 10 000.00) CHF 1 216.00 / Summe der Prämienverbilligung CHF 5 069.60» — Quelle [3], Ziff. 6

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Referenzprämie Erwachsene ab 26 — Region 1 / 2 / 3 | Fr. 6'285.60 / 5'879.40 / 5'681.40 | [1] Art. 3 |
| Referenzprämie Erwachsene bis 25 — Region 1 / 2 / 3 | Fr. 4'492.80 / 4'218.00 / 4'063.20 | [1] Art. 3 |
| Referenzprämie Kind — Region 1 / 2 / 3 | Fr. 1'462.80 / 1'351.20 / 1'306.80 | [1] Art. 3 |
| Belastungsgrenze Alleinstehend ohne Kinder | 12,16 % bis 18'700; +0,0002 Pp./Fr. darüber (auf gesamtes Einkommen) | [1] Art. 5 Abs. 1 |
| Belastungsgrenze Verheiratet ohne Kinder | 12,16 % bis 28'050; +0,0003 Pp./Fr. darüber | [1] Art. 5 Abs. 2 |
| Belastungsgrenze Alleinstehend mit Kindern | 10,96 % bis 18'700 (+9'350/JE, +5'610/Kind); Zuwachs 0,0002 (+0,00005/JE, +0,00003/Kind), max. 0,0003 Pp./Fr. | [1] Art. 5 Abs. 3 |
| Belastungsgrenze Verheiratet mit Kindern | 12,41 % bis 28'050 (+9'350/JE, +5'610/Kind); Zuwachs 0,00025 (+0,00005/JE, +0,00003/Kind), max. 0,00035 Pp./Fr. | [1] Art. 5 Abs. 4 |
| Obergrenze Einkommen für Minimalgarantie Kinder/JE (ordentlich besteuert) | Alleinst. 0 K. 41'700 · 1 K. 65'700 · 2 K. 65'700 · 3 K. 70'700 · 4 K. 75'700 · 5+ K. 80'700; Verh. 0 K. 62'600 · 1 K. 86'500 · 2 K. 86'500 · 3 K. 91'500 · 4 K. 96'500 · 5+ K. 101'500 | [1] Art. 6 |
| Obergrenze Bruttoeinkommen (quellenbesteuert) | Alleinst. 0 K. 55'600 … 5+ K. 107'500; Verh. 0 K. 83'500 … 5+ K. 135'400 (vollständig in [1] Art. 7) | [1] Art. 7 |
| Minimalgarantie Beträge R1/R2/R3 | JE in Ausbildung 2'246.40 / 2'109.20 / 2'031.60; Kinder 1'170.25 / 1'080.95 / 1'045.45 | [4] |
| Minimalgarantie Satz | Kinder 80 %, JE in Ausbildung 50 % | [2] Art. 19 Abs. 2 |
| Vermögensgrenze | steuerbares Vermögen über Fr. 100'000 → kein Anspruch; +20'000 je Kind bis 18, +40'000 je JE bis 25, höchstens 150'000 | [2] Art. 12 Abs. 3 |
| Kinderabzug vom massgebenden Einkommen | Fr. 4'000 je Kind/JE mit Familienzulage | [2] Art. 14 Abs. 1 |
| Mindestbetrag | «weniger als Fr. 100.– je Person und Jahr wird nicht ausgerichtet» | [2] Art. 20 |
| Einkommensgrenze allgemein | **keine publizierte feste Grenze** — ergibt sich aus Referenzprämie = Belastungsgrenze. Abgeleitet (nicht amtlich, eigene Rechnung mit 0,0002 Pp. = 0,000002 als Anteil), Alleinstehend ohne Kinder: IPV = 0 ab MGE ca. R1 38'833 / R2 37'112 / R3 36'255; unter Fr. 100 (keine Auszahlung) ab ca. R1 38'414 / R2 36'681 / R3 35'817 | abgeleitet aus [1], [2] |

### Massgebendes Einkommen
> «Grundlage für die Berechnung des massgebenden Einkommens bildet das nach kantonalem Steuerrecht ermittelte Reineinkommen der Steuerperiode des vorletzten Jahres vor dem Bezugsjahr» — Quelle [2], Art. 12 Abs. 1

> «Das massgebende Einkommen entspricht dem Reineinkommen: 1. zuzüglich 20 Prozent des steuerbaren Vermögens; 2. zuzüglich die Beiträge an die Gebundene Selbstvorsorge Säule 3a; 3. zuzüglich die Leistungen und Einkaufsbeiträge an Einrichtungen der beruflichen Vorsorge; 4. zuzüglich den Liegenschaftsaufwand, soweit dieser den Pauschalabzug von 20 Prozent der Mieteinnahmen übersteigt; 5. zuzüglich den Vorjahresverlusten …; 5bis. zuzüglich 75 Prozent des im vereinfachten Verfahren … abgerechneten Bruttolohns; … 6. abzüglich den Kinderabzug» (dazu 5ter freiwillige Zuwendungen/Parteispenden, 5quinquies–5septies je 30 % Eigenmietwert-/Beteiligungsabzug) — Quelle [2], Art. 12 Abs. 2

Für 2026 = Reineinkommen (Code 248) Steuerperiode 2024 [3]. Quellenbesteuerte: «Das massgebende Einkommen … wird zu 75 Prozent angerechnet.» [2] Art. 12bis Abs. 3

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben. Belegt: Einzelperson erhält bei Einkommen 0 die regionale Referenzprämie (Fr. 5'681.40–6'285.60) und der Abbau ist nicht linear, sondern quadratisch (Satz steigt mit dem Einkommen); Nullpunkt Alleinstehend rechnerisch ca. Fr. 36'000–39'000 MGE je Region. Die Werte 41'700 usw. sind **keine** allgemeine Einkommensgrenze, sondern nur die Obergrenze für die Minimalgarantie Kinder/JE.

### Offen / nicht gefunden
- Online-Rechner SVA (svasg.ch/ipv-berechnung) für eine Gegenprobe der abgeleiteten Nullpunkte per GET abgefragt: HTTP 500 — Gegenprobe nicht möglich.
- Wörtliche Auslegung «0,0002 Prozentpunkte für jeden Franken» als Anteil 0,000002 ist meine Umrechnung; amtliches Beispiel nur für Einkommen unter dem Sockel (12,16 % von 10'000) vorhanden.
- Zuordnung Gemeinde → Prämienregion (Formular 4050) nicht erfasst.
- Satz «Die Selbstbehalte beginnen … ab 10,96 Prozent» [3] bezieht sich auf Alleinstehende mit Kindern (Art. 5 Abs. 3 [1]).

### Quellen
1. Regierungsbeschluss über die Prämienverbilligung 2026 für Personen im Kanton St.Gallen (sGS 331.538, nGS 2025-071), Regierung des Kantons St.Gallen, vom 9.12.2025, Stand 1.1.2026. https://www.gesetzessammlung.sg.ch/api/de/versions/3847/pdf_file_with_annexes (kanonisch: https://www.gesetzessammlung.sg.ch/app/de/texts_of_law/331.538) — abgerufen 16.09.2026
2. Verordnung zum Einführungsgesetz zur Bundesgesetzgebung über die Krankenversicherung (sGS 331.111), Fassung in Vollzug seit 1.8.2026 (Erlassdatum 11.11.2025). https://www.gesetzessammlung.sg.ch/api/de/versions/3828/pdf_file_with_annexes — abgerufen 16.09.2026
3. Merkblatt Individuelle Prämienverbilligung (IPV) 2026, Form. 4100 01.26, SVA St.Gallen, PDF vom 22.12.2025. https://www.svasg.ch/online-schalter/pdf/form_4100.pdf — abgerufen 16.09.2026
4. Individuelle Prämienverbilligung (IPV) 2026 – Erläuterungen zur Verfügung, Form. 4200 01.26, SVA St.Gallen, PDF vom 03.12.2025. https://www.svasg.ch/online-schalter/pdf/form_4200.pdf — abgerufen 16.09.2026
5. Individuelle Prämienverbilligungen (IPV), SVA St.Gallen (Frist «jeweils bis 31. März»). https://www.svasg.ch/produkte/ipv/ — abgerufen 16.09.2026

---

## GR — Graubünden

**Beurteilung:** abbildbar
**Modell (kurz):** Regionale Richtprämie (3 Regionen, 90 % der BAG-Durchschnittsprämie) minus Selbstbehalt nach Einkommenskategorie (5 % / 6,5 % / 8 % / 9 % / 10 % des anrechenbaren Einkommens); Kinder und JE in Ausbildung alternativ 100/75/50/25 % Verbilligung bis 65'000/70'000/75'000/80'000, höherer Betrag gilt
**Zuständig / Weg:** SVA Graubünden (AHV-Ausgleichskasse); Antrag (online oder bei SVA/AHV-Zweigstelle der Wohngemeinde), Frist 31.12.2026 (Posteingang); Vorschussleistung 65 % bei fehlender definitiver Veranlagung 2025; bisherige Beziehende erhalten von Amtes wegen Mitteilung über Vorschusszahlung und gelten als angemeldet
**Gültigkeit:** 2026 definitiv (Wegleitung IPV 2026, PDF vom 05.01.2026; Selbstbehalt-Stufen im Gesetz KPVG, Stand 1.1.2025)

### Rechenmodell
> «Die massgebenden Prämien werden verbilligt, soweit sie einen nach Einkommenskategorien abgestuften Selbstbehalt übersteigen.» — Quelle [2], Art. 8 Abs. 1

> «Der Selbstbehalt beträgt für anrechenbare Einkommen bis 10 000 Franken 5 Prozent, bis 20 000 Franken 6,5 Prozent und bis 30 000 Franken 8 Prozent. Er erhöht sich für jede weitere Einkommenskategorie von 10 000 Franken um je 1 Prozentpunkt bis 10 Prozent.» — Quelle [2], Art. 8 Abs. 2

> «Die massgebenden Prämien für Kinder und junge Erwachsene in Ausbildung werden wie folgt verbilligt: a) bis zu einem anrechenbaren Einkommen von 65 000 Franken um 100 Prozent; b) bis … 70 000 Franken um 75 Prozent; c) bis … 75 000 Franken um 50 Prozent; d) bis … 80 000 Franken um 25 Prozent. Als junge Erwachsene in Ausbildung gelten Personen bis zum erfüllten 25. Altersjahr.» — Quelle [2], Art. 8 Abs. 3

> «Zur Auszahlung gelangt der höhere der gemäss den Absätzen 2 und 3 berechneten Beträge.» — Quelle [2], Art. 8 Abs. 4

> «… werden die vom Bund pro Personenkategorie und Region festgelegten monatlichen Durchschnittsprämien für die obligatorische Krankenpflegeversicherung um 10 Prozent reduziert. Diese sind auf den nächsten Franken aufzurunden.» — Quelle [3], Art. 17 Abs. 1

Gesamtanspruch: «Bei Personen im Gesamtanspruch werden die anrechenbaren Einkommen sowie die Richtprämien aller Personen zusammengezählt.» — Quelle [1]

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Richtprämie Erwachsene ab 26 — Region 1 / 2 / 3 | Fr. 5'916 / 5'532 / 5'232 | [1] |
| Richtprämie junge Erwachsene 19–25 — Region 1 / 2 / 3 | Fr. 4'368 / 4'092 / 3'912 | [1] |
| Richtprämie Kinder bis 18 — Region 1 / 2 / 3 | Fr. 1'404 / 1'320 / 1'248 | [1] |
| Selbstbehalt anrechenbares Einkommen bis und mit 10'000 | 5,0 % | [1], [2] |
| … bis und mit 20'000 | 6,5 % | [1], [2] |
| … bis und mit 30'000 | 8,0 % | [1], [2] |
| … bis und mit 40'000 | 9,0 % | [1] |
| … ab 40'001 | 10,0 % | [1] |
| Kinder/JE in Ausbildung: Selbstbehalt bis 65'000 / 70'000 / 75'000 / 80'000 / ab 80'001 | 0 % / 25 % / 50 % / 75 % / 100 % (der Richtprämie) | [1], [2] Art. 8 Abs. 3 |
| Vermögen | 10 % des Reinvermögens wird angerechnet; keine separate Vermögensgrenze gefunden | [2] Art. 8a |
| Vorschussleistung | 65 % des provisorisch berechneten Werts | [1] |
| Volle Verbilligung | EL-, Sozialhilfe-, Mutterschaftsbeitrags-Beziehende | [2] Art. 9 |
| Einkommensgrenze allgemein | **keine publizierte feste Grenze**. Abgeleitet (nicht amtlich), Einzelperson ab 26 ohne Kinder: Selbstbehalt 10 % → IPV = 0 ab anrechenbarem Einkommen R1 59'160 / R2 55'320 / R3 52'320 | abgeleitet aus [1], [2] |
| Mindestbetrag für Auszahlung | nicht gefunden | — |

### Massgebendes Einkommen
> «Das anrechenbare Einkommen entspricht dem satzbestimmenden steuerbaren Einkommen gemäss den definitiven kantonalen Steuerdaten des Vorjahres zuzüglich: a) 10 Prozent des Reinvermögens gemäss der Steuerveranlagung, soweit der Wert nicht negativ ist; b) der nicht versteuerten Erträge aus massgeblichen Beteiligungen …; c) des absoluten Nettoertrags der Liegenschaften …, soweit der Wert negativ ist; d) der Beiträge einschliesslich der Einkaufsbeiträge an die berufliche Vorsorge …; e) der Beiträge an die gebundene Selbstvorsorge …; f) der gemeinnützigen Zuwendungen …; g) der Mitgliederbeiträge und Zuwendungen an politische Parteien …» — Quelle [2], Art. 8a Abs. 1

Für 2026 = definitive Steuerveranlagung 2025 [1]. «Zudem werden die Einkommen berücksichtigt, welche dem vereinfachten Abrechnungsverfahren unterliegen.» [1] Gesamtanspruch: anrechenbare Einkommen werden zusammengezählt [2] Art. 8a Abs. 2.

### Abweichung zur App
Der App-Wert (maxIncome/subsidySingle) wurde mir nicht übergeben. Belegt: Einzelperson erhält bei Einkommen 0 die volle regionale Richtprämie (Fr. 5'232–5'916), der Abbau ist stufig (5 %→10 % des Einkommens), nicht linear; Nullpunkt rechnerisch bei Fr. 52'320–59'160 je Region.

### Offen / nicht gefunden
- Ob der Stufen-Satz auf das **gesamte** anrechenbare Einkommen angewendet wird (dann Sprünge an den Stufengrenzen, z. B. 40'000 × 9 % = 3'600 vs. 40'001 × 10 % = 4'000) oder progressiv je Tranche, ist im Wortlaut nicht ausdrücklich geregelt; Leseart «gesamtes Einkommen» ist naheliegend, aber nicht durch ein amtliches Rechenbeispiel belegt. Gegenprobe mit dem SVA-Online-Rechner (formulare.sva.gr.ch/ipv.php, POST-Formular) nicht durchgeführt.
- Regierungsbeschluss mit den Richtprämien 2026 nicht selbst gefunden; Werte stammen aus der amtlichen SVA-Wegleitung 2026.
- Ob der Grosse Rat nach Art. 8 Abs. 5 KPVG für 2026 den Selbstbehalt erhöht hat: nicht gefunden; die Wegleitung 2026 nennt die gesetzlichen Stufen unverändert.
- Mindestbetrag (Bagatellgrenze) nicht gefunden.
- Gemeinde → Prämienregion: https://www.sva.gr.ch/files/sva/dienstleistungen/07_ipv/ipv_praemienregion_d.pdf (nicht geöffnet).

### Quellen
1. Wegleitung Individuelle Prämienverbilligung 2026, SVA Graubünden, PDF vom 05.01.2026. https://formulare.sva.gr.ch/downloads/ipv_wegleitung_d.pdf — abgerufen 16.09.2026 (unter https://www.sva.gr.ch/downloads/ipv_wegleitung_d.pdf: HTTP 404)
2. Gesetz über die Krankenversicherung und die Prämienverbilligung (KPVG, BR 542.100), Kanton Graubünden, aktuelle Version in Kraft seit 01.01.2025. https://www.gr-lex.gr.ch/api/de/versions/3445/pdf_file_with_annexes (kanonisch https://www.gr-lex.gr.ch/app/de/texts_of_law/542.100) — abgerufen 16.09.2026
3. Verordnung zum Gesetz über die Krankenversicherung und die Prämienverbilligung (VOzKPVG, BR 542.120), Stand 1.1.2026. https://www.gr-lex.gr.ch/api/de/versions/3606/pdf_file_with_annexes — abgerufen 16.09.2026

---

## TI — Ticino

**Beurteilung:** abbildbar
**Modell (kurz):** Quadratische Formel: Normbetrag = PMR − PMR × RD²/RDM², × kantonaler Koeffizient 76,5 %; RDM = Konstante × 50 % der Laps-Bedarfsgrenze
**Zuständig / Weg:** Istituto delle assicurazioni sociali (IAS), Servizio sussidi assicurazione malattia · Antrag (Erneuerungs- oder Antragsformular, auch online); EL-/Laps-Beziehende von Amtes wegen · Anspruch ab Folgemonat der Einreichung, ab Januar 2026 nur bei Einreichung bis 31.12.2025
**Gültigkeit:** 2026 definitiv (Decreto esecutivo 19.11.2025, gültig 1.1.–31.12.2026; LCAMal Stand 1.1.2026)

### Rechenmodell
> «RD = [RL + qSOST] - [PMR + CS + ALIM + SPPROF + SPINT].» — LCAMal art. 31 cpv. 2, Quelle [1]

> «Per le unità di riferimento senza figli, il reddito disponibile massimo è definito come segue: RDM = costante del 3.8 x 50% del limite di fabbisogno, senza computo della pigione, ai sensi della Laps applicabile all’unità di riferimento.» — LCAMal art. 32a cpv. 2, Quelle [1]

> «Per le UR con figli, il reddito disponibile massimo è definito come segue: RDM = [costante del 4.7 + (1 - (n. figli) / 10)] x 50% del limite di fabbisogno, senza computo della pigione, ai sensi della Laps applicabile all’unità di riferimento.» — LCAMal art. 32a cpv. 3 (in Kraft seit 1.1.2025), Quelle [1]

> «L’importo normativo di riduzione dei premi è determinato come segue: [ PMR - ( PMR x RD2 ) / RDM2 ].» — LCAMal art. 35, Quelle [1] (im Original als Bruch gesetzt: PMR × RD² / RDM²)

> «L’importo effettivo di riduzione dei premi si ottiene moltiplicando l’importo normativo per il coefficiente cantonale di finanziamento.» / «Il coefficiente cantonale di finanziamento è pari al 76.5%.» — LCAMal art. 37 cpv. 1–2, Quelle [1]

> «L’importo massimo normativo di riduzione dei premi corrisponde alla somma dei premi medi di riferimento, per categoria di assicurato, dell’unità di riferimento.» — LCAMal art. 34, Quelle [1]

Aufteilung: Berechnung je Einheit (UR), dann Verteilung «proporzionalmente al premio di riferimento di ciascun membro»; Kinder/junge Erwachsene in Ausbildung vorab (mind. 80 % bzw. 50 % des PMR) — Quelle [3] Ziff. 1.4.

Besitzstand (Untergrenze) für Einheiten mit RD ≤ Laps-Bedarfsgrenze: PMR 2014 (fr. 4’965 / 4’594 / 1’156) × 73,5 % (RD ≤ 50 %) bzw. × 70 % (50–100 %) — LCAMal art. 43a, Quelle [1].

### Zahlen 2026
| Grösse | Wert | Quelle |
|---|---|---|
| Premio medio di riferimento (PMR) Erwachsene | «fr. 8'016 per gli adulti» | [2] art. 2 |
| PMR junge Erwachsene | «fr. 6'143 per i giovani adulti» | [2] art. 2 |
| PMR Minderjährige | «fr. 1'827 per i minorenni» | [2] art. 2 |
| Altersgrenzen der Kategorien | «adulto: dall’anno seguente al compimento dei 25 anni; giovane adulto: dall’anno seguente al compimento dei 18 anni; minorenne: fino alla fine dell’anno di compimento dei 18 anni» | [3] Ziff. 1.2 |
| Konstante ohne Kinder | 3.8 | [1] art. 32a cpv. 2 (Decreto 2026 [2] ändert sie nicht) |
| Konstante mit Kindern | 4.7 + (1 − Anzahl Kinder/10) | [1] art. 32a cpv. 3 |
| Kantonaler Finanzierungskoeffizient | 76.5 % | [1] art. 37 cpv. 2 |
| Laps-Schwelle («soglia d’intervento») 2025 und 2026: Titular | «18'709 franchi» | [4] art. 1 lett. a |
| … 1. zusätzliche Person | «9'215 franchi» | [4] art. 1 lett. b |
| … 2. zusätzliche Person | «6'869 franchi» | [4] art. 1 lett. c |
| … 3. zusätzliche Person | «5'253 franchi» | [4] art. 1 lett. d |
| … 4. und jede weitere Person | «5'233 franchi» | [4] art. 1 lett. e |
| Bestätigung: Laps-Bedarfsgrenze 2026 Einzelperson | «per il 2026 corrisponde a CHF 18'709 annui» | [3] Ziff. 1.1 |
| Vermögen | «1/15 della sostanza netta» wird zum Einkommen gezählt (keine separate Vermögensgrenze gefunden) | [1] art. 31, [3] |
| Pauschalabzug Berufsauslagen | max. CHF 4'000/Jahr pro UR | [1] art. 31, [3] |
| Abzug Schuldzinsen | max. CHF 3'000/Jahr pro UR | [1] art. 31, [3] |
| Mindestbetrag | «CHF 120 per ogni singolo membro dell'UR» | [3] Ziff. 1.4 |
| Steuerperiode | «classificazioni dell’imposta cantonale per l’anno 2023» | [2] art. 1 |

Abgeleitet (eigene Rechnung aus [1]+[4], nicht amtlich publiziert, nur zur Plausibilisierung):
- RDM Einzelperson ohne Kinder = 3.8 × 50 % × 18'709 = CHF 35'547.10 (verfügbares Einkommen RD, nicht Bruttoeinkommen).
- RDM Paar ohne Kinder = 3.8 × 50 % × (18'709 + 9'215) = CHF 53'055.60.
- Höchstbetrag Einzelperson Erwachsen bei RD = 0: 8'016 × 76.5 % = CHF 6'132.24/Jahr (begrenzt auf die effektive Prämie, art. 37 cpv. 3).

⚠️ Annahme: Dass «limite di fabbisogno … ai sensi della Laps» in art. 32a der «soglia d’intervento» nach Laps art. 10 / Decreto 870.130 entspricht, schliesse ich aus dem identischen Betrag 18'709 in [3]. Der Zusatz «senza computo della pigione» ist in [4] nicht ausdrücklich erwähnt. Vor Umsetzung mit dem IAS-Simulator (www.iasticino.ch) gegenprüfen.

### Massgebendes Einkommen
> «Per principio, il RD è determinato a partire dai dati accertati del calcolo dell’imponibile per l’imposta cantonale IC 2023 (notifica di tassazione).» — Quelle [3] Ziff. 1.2

> «somma di tutti i redditi dell’UR (al lordo delle eventuali spese di gestione e manutenzione immobili) [punto 8 (+ ev. punto 5.5)] + 1/15 della sostanza netta [punto 34] - premio medio di riferimento (PMR) dell'anno 2026 - contributi sociali obbligatori (AVS, AI, IPG, AD, AINP, LPP) - pensioni alimentari pagate (per figli ed ex-coniuge) - spese professionali per salariati (massimo 4'000 CHF/anno per UR) - spese per interessi passivi privati e aziendali (max. 3'000 CHF/anno per UR)» — Quelle [3] Ziff. 1.2 (Tabellenform, Zeilen zusammengezogen)

Neuberechnung ausserhalb der Steuerveranlagung u. a. bei Quellensteuer, Tod, Scheidung/Trennung, Aufgabe der Erwerbstätigkeit; auf Antrag bei Einkommens-/Vermögensänderung (Vermögen ± CHF 10'000) — Quelle [3] Ziff. 1.2 lett. a–l.

### Abweichung zur App
App: `maxIncome` 45'000, `subsidySingle` 2'400, linearer Abbau. Belegt ist ein quadratischer Abbau auf das *verfügbare* Einkommen (RDM Einzelperson abgeleitet CHF 35'547) mit einem Höchstbetrag von 76,5 % × 8'016 = CHF 6'132 für eine erwachsene Einzelperson. Der App-Betrag ist also rund 2,5-mal zu tief, und Grenze und Kurvenform stimmen nicht.

### Offen / nicht gefunden
- Ob der Zusatz «senza computo della pigione» die Laps-Schwelle 18'709 weiter verändert: im Decreto 870.130 nicht erwähnt (siehe Annahme oben). Gegenprobe mit dem IAS-Simulator steht aus.
- Regolamento RLCAMal (853.110) nicht im Wortlaut geprüft (Verteilung, Mindestbetrag). Die Angaben dazu stammen aus dem IAS-Merkblatt [3].
- Keine amtliche Tabelle mit ausgerechneten Einkommensgrenzen je Haushaltsgrösse gefunden. Das IAS verweist auf den Simulator.

### Quellen
1. Legge di applicazione della legge federale sull’assicurazione malattie (LCAMal), RL 853.100, Gran Consiglio del Cantone Ticino, Stand 1° gennaio 2026 (ultimo aggiornamento RL 04.09.2026). https://m3.ti.ch/CAN/RLeggi/public/index.php/index/nuovafinestra/atto/370/volume//numLegge/853.100 — abgerufen 16.09.2026
2. Decreto esecutivo concernente le basi di calcolo per l’applicazione delle riduzioni di premio LAMal per l’anno 2026, RL 853.310, Consiglio di Stato, 19.11.2025 (Stand 1.1.2026, BU 2025, 315). https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge-piatta/num/863 — abgerufen 16.09.2026
3. Istruzioni per la richiesta di riduzione di premio (sussidio) nell'assicurazione malattie (RIPAM) per l’anno 2026, IAS, Dicembre 2025 (inhaltsgleich: Informazioni periodiche RIPAM 2026, «Informazioni valide dal 1° gennaio 2026»). https://www4.ti.ch/fileadmin/DSS/IAS/pdf/approfondimenti/Istruzioni_per_la_richiesta_di_RIPAM_2026.pdf · https://www4.ti.ch/fileadmin/DSS/IAS/pdf/informazioni_periodiche/2026_Info_periodiche_RIPAM.pdf — abgerufen 16.09.2026
4. Decreto esecutivo sull’armonizzazione e il coordinamento delle prestazioni sociali, RL 870.130, Consiglio di Stato, 25.09.2024 (Stand 1.1.2025, «Per gli anni 2025 e 2026»). https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge-piatta/num/829 — abgerufen 16.09.2026
5. Scheda RIPAM, IAS (Frist «Entro il 31 dicembre dell'anno che precede quello di richiesta»). https://www4.ti.ch/dss/ias/prestazioni-e-contributi/scheda/p/s/dettaglio/riduzione-dei-premi-dellassicurazione-malattia-ripam-1/riduzione-dei-premi-dellassicurazione-malattia-ripam — abgerufen 16.09.2026

---

## NE — Neuchâtel

**Beurteilung:** abbildbar (mit Vorbehalt: Webseite und Erlass nennen ab S3 unterschiedliche Monatsbeträge, siehe «Offen»)
**Modell (kurz):** 15 Klassen (S1–S15) nach revenu déterminant und Haushaltstyp/Kinderzahl; fester Monats-Höchstbetrag je Klasse und Alterskategorie (% einer Referenzprämie)
**Zuständig / Weg:** OCAB (Office cantonal de l'assurance-maladie et des bourses d'études) aufgrund der Steuerveranlagung 2025; Bisherige automatisch, Neuberechtigte erhalten nach Veranlagung einen Coupon-réponse (Rücksendung innert 30 Tagen, sonst Verlust des Anspruchs); 19–25-Jährige ledig, Quellenbesteuerte, amtlich Veranlagte, Neuzuzüger: Antrag beim Guichet social régional (GSR)
**Gültigkeit:** 2026 definitiv (Arrêté vom 12.11.2025, in Kraft 1.1.2026)

### Rechenmodell
> «les bénéficiaires de subsides sont répartis en fonction de leur revenu déterminant dans l'une des classifications prévues dans l'annexe.» / «La classification détermine le montant maximum des subsides» — Art. 2 Arrêté 821.102 [1]

> «Les montants maximums des subsides, par classification, pour la franchise annuelle […] sont les suivants : Subsides mensuels LAMal 2026» — Art. 11 al. 1 [1]

> «Les montants prévus à l'alinéa 1 sont diminués dans la même mesure que les réductions accordées par les assureurs en cas de formes particulières d'assurances» — Art. 11 al. 2 [1]

> «Les limites de revenu déterminant varient en fonction du nombre d'enfants mineurs à charge conformément à l'annexe.» — Art. 3 al. 2 [1]

Hinweis: Kinder (S1–S15) und junge Erwachsene/Erwachsene in Ausbildung erhalten in S1–S11 bzw. S1–S15 100 % der Referenzprämie resp. abgestufte Prozente; übrige Erwachsene/junge Erwachsene 95 % (S1) bis 4 % (S15). Für Alleinstehende ohne Kind endet die Skala bei S10.

### Zahlen 2026
Monatsbeträge CHF gemäss Arrêté Art. 11 (verbindlich) [1]; identisch im PDF «Subsides mensuels assurance-maladie 2026» vom 28.11.2025 [3]:

| Klasse | Kinder 0–18 | Junge Erw. in Ausbildung 19–25 | Junge Erw. 19–25 | Erw. in Ausbildung ab 26 | Erwachsene ab 26 | Quelle |
|---|---|---|---|---|---|---|
| PC-AVS/AI (PMC) | 157 | 502 | 502 | 687 | 687 | [1] |
| Aide sociale (PARC) | 133 | 420 | 420 | 590 | 590 | [1] |
| Referenzprämie (ordentl. Klassen) | 160 | 484 | 484 | 643 | 643 | [1] |
| S1 | 160 | 484 | 460 (95%) | 643 | 611 (95%) | [1] |
| S2 | 160 | 484 | 436 (90%) | 643 | 579 (90%) | [1] |
| S3 | 160 | 484 | 387 (80%) | 643 | 514 (80%) | [1] |
| S4 | 160 | 484 | 339 (70%) | 643 | 450 (70%) | [1] |
| S5 | 160 | 484 | 290 (60%) | 643 | 386 (60%) | [1] |
| S6 | 160 | 484 | 242 (50%) | 643 | 322 (50%) | [1] |
| S7 | 160 | 484 | 198 (41%) | 643 | 264 (41%) | [1] |
| S8 | 160 | 484 | 155 (32%) | 643 | 206 (32%) | [1] |
| S9 | 160 | 484 | 116 (24%) | 643 | 154 (24%) | [1] |
| S10 | 160 | 484 | 73 (15%) | 643 | 96 (15%) | [1] |
| S11 | 160 | 484 | 58 (12%) | 643 | 77 (12%) | [1] |
| S12 | 160 | 387 (80%) | 48 (10%) | 514 (80%) | 64 (10%) | [1] |
| S13 | 160 | 290 (60%) | 39 (8%) | 386 (60%) | 51 (8%) | [1] |
| S14 | 160 | 198 (41%) | 29 (6%) | 264 (41%) | 39 (6%) | [1] |
| S15 | 160 | 116 (24%) | 19 (4%) | 154 (24%) | 26 (4%) | [1] |

Einkommensgrenzen (revenu déterminant, CHF/Jahr, Obergrenze der Klasse) — Annexe [1], deckungsgleich mit [2]:

| Haushalt | S1 bis | S10 bis | S15 bis (= höchste Grenze) | Quelle |
|---|---|---|---|---|
| Erwachsene/r allein, kein Kind | 22'800 | 50'600 | – (Skala endet bei S10) | [1] |
| Erwachsene/r allein, 1 Kind | 33'000 | 44'400 | 65'089 | [1] |
| Erwachsene/r allein, 2 Kinder | 40'800 | 52'200 | 72'824 | [1] |
| Erwachsene/r allein, 3 Kinder | 46'800 | 58'200 | 80'560 | [1] |
| Paar Erwachsene, kein Kind | 30'000 | 67'551 | – (endet bei S10) | [1] |
| Paar Erwachsene, 1 Kind | 37'500 | 60'300 | 100'939 | [1] |
| Paar Erwachsene, 2 Kinder | 44'400 | 67'200 | 104'317 | [1] |
| Paar Erwachsene, 3 Kinder | 50'400 | 73'200 | 104'755 | [1] |
| Junge/r Erwachsene/r allein, kein Kind | 22'800 | 34'348 | – (endet bei S10) | [1] |
| Paar junge Erwachsene, kein Kind | 30'000 | 52'955 | – (endet bei S10) | [1] |
| Paar Erwachsene/r + junge/r Erw., kein Kind | 30'000 | 63'602 | – (endet bei S10) | [1] |

Klassenbreite Erwachsene/r allein ohne Kind S1–S9: je 1'140 (z. B. «22'800 à 23'940»); Paar ohne Kind: je 2'280. Die Annexe enthält vollständige Tabellen für 0–10 Kinder und alle fünf Haushaltstypen [1].

| Weitere Grösse | Wert | Quelle |
|---|---|---|
| Vermögensanrechnung | 30 % der fortune effective nach Abzug 4'000 (allein) / 8'000 (Paar) / 2'000 je minderjähriges Kind, Abzug max. 10'000 je UER | [1] Art. 12 |
| Vermutete Nichtberechtigung | revenu effectif < 15'000 (allein) / < 20'000 (Paar), +3'000 je Kind; ebenso Ledige < 25 J. ohne Kind (Revision auf Gesuch möglich) | [1] Art. 16 |
| Budget 2026 | 160,9 Mio. CHF | [4] |

### Massgebendes Einkommen
> «Le revenu déterminant se fonde sur les données disponibles résultant de la taxation fiscale 2025 et se compose : a) du revenu effectif tel qu'il ressort du chiffre 5.5 (colonne revenu) de la déclaration fiscale, à l'exclusion de la valeur locative privée (chiffre 4.1), et sous seules déductions des cotisations AVS/AI/APG/AC versées par des personnes assurées sans activité lucrative (chiffre 6.7), des dépenses professionnelles liées au revenu d'une activité dépendante principale (chiffre 6.4), des frais pour activité dépendante accessoire (chiffre 6.5) et des pensions alimentaires […] (chiffre 6.10). […] b) du trente pourcent de la fortune effective selon le chiffre 6.16 (colonne fortune) après déduction de 4'000 francs pour une personne seule, 8'000 francs pour un couple et 2'000 francs par enfant mineur à charge, mais, par UER, au maximum 10'000 francs.» — Art. 12 al. 1 [1]

Zusätzlich: Abzüge 6.4 max. 10'000, 6.5 max. 2'400 (Art. 12 al. 5); Geschäftsverluste nicht abziehbar (al. 4); Renten voll angerechnet (al. 2) [1].

### Abweichung zur App
App-Wert (maxIncome/subsidySingle) wurde mit dem Auftrag nicht mitgegeben. Belegte Vergleichswerte: Erwachsene/r allein ohne Kind max. revenu déterminant 50'600, Höchstbetrag S1 611 CHF/Monat (= 7'332 CHF/Jahr), in 15 Stufen und nicht linear abnehmend — ein linearer Abbau bildet NE nicht ab.

### Offen / nicht gefunden
- **Widerspruch Webseite ↔ Erlass:** Die Seite «Classifications et montants» [2] (Drupal-Metadatum «Modified: 08/09/2026») nennt für Junge Erwachsene / Erwachsene ab S3 andere Beträge als der Erlass und das PDF vom 28.11.2025, z. B. Erwachsene S3 **515** (Erlass 514), S4 453 (450), S10 110 (96), S15 **41** (26); Junge Erw. S15 30 (19); Junge Erw. in Ausbildung S15 124 (116); Erw. in Ausbildung S12 515 (514), S15 166 (154). S1, S2 und Referenzprämien stimmen überein. Kein Änderungsbeschluss gefunden (CE-Kurzinformation 6.7.2026 [5] erwähnt nur Nachtragskredite und «prorogation des mesures transitoires» ohne Zahlen). Die Seite sagt selbst, sie basiere auf dem Arrêté. → Verbindlich ist bis auf Weiteres RSN 821.102; beim OCAB nachfragen, ob eine Änderung (z. B. Erhöhung per Mitte 2026) beschlossen ist.
- Merkblatt «Subsides à l'assurance-maladie, informations détaillées (20251202)» nicht geöffnet.
- Die Klassen gelten als Höchstbetrag; der Subside ist auf die effektive Prämie begrenzt (Art. 11 al. 2 für besondere Versicherungsformen) — genaue Kappungsregel (RALILAMal) nicht separat geprüft.

### Quellen
1. Arrêté fixant les normes de classification et le montant des subsides en matière d'assurance-maladie obligatoire des soins pour l'année 2026 (RSN 821.102), Conseil d'État NE, vom 12.11.2025, État au 1er janvier 2026, FO 2025 No 47. https://rsn.ne.ch/DATA/program/books/rsne/pdf/821.102.pdf — abgerufen 16.09.2026
2. Subsides assurance-maladie (LAMal) 2026 : Classifications et montants selon le revenu déterminant, État de Neuchâtel, publiziert 14.07.2025, geändert 08.09.2026. https://www.ne.ch/themes/social/assurance-maladie/subsides-assurance-maladie-lamal-classifications-et-montants-selon-le-revenu-determinant — abgerufen 16.09.2026
3. Subsides mensuels assurance-maladie 2026 (PDF), État de Neuchâtel, Stand 28.11.2025. https://www.ne.ch/medias/Documents/25/12/20251128_montants%20mensuels_subsides%20LAMal%202026.pdf — abgerufen 16.09.2026
4. Communiqué «Subsides à l'assurance-maladie 2026 : maintien des mesures et introduction d'un nouveau modèle d'octroi», État de Neuchâtel, 28.11.2025. https://www.ne.ch/communiques-de-presse/subsides-lassurance-maladie-2026-maintien-des-mesures-et-introduction-dun-nouveau-modele-doctroi — abgerufen 16.09.2026
5. Informations brèves de la séance du Conseil d'État du 6 juillet 2026, État de Neuchâtel. https://www.ne.ch/communiques-de-presse/informations-breves-de-la-seance-du-conseil-detat-du-6-juillet-2026 — abgerufen 16.09.2026
6. Subsides assurance-maladie (LAMal) — Verfahren/Coupon-réponse/FAQ, État de Neuchâtel. https://www.ne.ch/themes/social/assurance-maladie/subsides-assurance-maladie-lamal — abgerufen 16.09.2026

---

## GE — Genève

**Beurteilung:** abbildbar
**Modell (kurz):** 8 Gruppen (+ Gruppe 9 nur für Kinder/junge Erwachsene) nach RDU und Haushalt; fester Monatsbetrag je Gruppe und Person (Erw. 348 → 55, junge Erw. 231, Kind 132), Grenzen +6'000 je Unterhaltspflicht
**Zuständig / Weg:** Service de l'assurance-maladie (SAM); grundsätzlich automatisch aufgrund der Steuerveranlagung von vor zwei Jahren (2024); Antrag nötig u. a. für junge Erwachsene (Jg. 2001–2007), Quellenbesteuerte, Zuzüger 2025/2026, sehr tiefe RDU (< 15'000 allein / < 20'000 Paar), Brutto-Einkommen > 200'000 oder Brutto-Vermögen > 250'000; Frist: vor dem 30. November des Anspruchsjahres
**Gültigkeit:** 2026 definitiv (Barème 2026 des Kantons; Gesetzesbeträge 2024 indexiert)

### Rechenmodell
> «le droit aux subsides est ouvert lorsque le revenu déterminant ne dépasse pas les montants suivants : a) Groupe 1 : 1° assuré seul, sans charge légale : 30 000 francs, 2° couple, sans charge légale : 45 000 francs; […] h) Groupe 8 : 1° assuré seul, sans charge légale : 50 000 francs, 2° couple, sans charge légale : 115 000 francs.» / «Ces limites sont majorées de 6 000 francs par charge légale.» — Art. 21 al. 1–2 LaLAMal [2]

> «Le montant des subsides est de : Groupe 1 : 320 francs par mois; […] Groupe 8 : 50 francs par mois.» (Gesetzesbasis, indexiert) — Art. 22 al. 1 LaLAMal [2]; Indexierung: «indexés chaque année par le Conseil d'Etat par voie d'arrêté pour le 1er janvier de l'année suivante» — Art. 9B RaLAMal [3]

> «Une personne assumant une charge légale est assimilée à un couple.» — Art. 21 al. 4 LaLAMal [2]; «Le montant des subsides accordés ne peut dépasser le montant de la prime effective de l'assuré.» — Art. 22 al. 4 [2]

> «Dans le calcul des charges, une majoration de CHF 6'000.- par charge est consentie.» — Barème subsides 2026 [1]

Gruppe 9 (Art. 21 al. 5–7 [2]): nur Subsidien für Kinder / junge Erwachsene, wenn die Eltern über Gruppe 8 liegen, bis «151 000 francs» (allein oder Paar mit einer Unterhaltspflicht), +6'000 je weitere.

### Zahlen 2026
Aus «BAREME SUBSIDES 2026» [1] (CHF pro Monat):

| Grösse | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | Quelle |
|---|---|---|---|---|---|---|---|---|---|---|
| Subside adulte | 348 | 294 | 240 | 196 | 164 | 120 | 87 | 55 | – | [1] |
| Subside jeune adulte | 231 | 231 | 231 | 231 | 231 | 231 | 231 | 231 | 106 | [1] |
| Subside enfant | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 67 | [1] |
| RDU Person allein ohne Kind | 0–30'000 | –35'000 | –37'500 | –40'000 | –42'500 | –45'000 | –47'500 | –50'000 | – | [1] |
| RDU Paar ohne Kind | 0–45'000 | –55'000 | –65'000 | –75'000 | –85'000 | –95'000 | –105'000 | –115'000 | – | [1] |
| RDU allein/Paar + 1 Kind | 0–51'000 | –61'000 | –71'000 | –81'000 | –91'000 | –101'000 | –111'000 | –121'000 | –151'000 | [1] |
| RDU allein/Paar + 2 Kinder | 0–57'000 | –67'000 | –77'000 | –87'000 | –97'000 | –107'000 | –117'000 | –127'000 | –157'000 | [1] |
| RDU allein/Paar + 3 Kinder | 0–63'000 | –73'000 | –83'000 | –93'000 | –103'000 | –113'000 | –123'000 | –133'000 | –163'000 | [1] |
| RDU allein/Paar + 4 Kinder | 0–69'000 | –79'000 | –89'000 | –99'000 | –109'000 | –119'000 | –129'000 | –139'000 | –169'000 | [1] |
| Haushaltstotal Person allein ohne Kind | 348 | 294 | 240 | 196 | 164 | 120 | 87 | 55 | – | [1] |
| Haushaltstotal Paar ohne Kind | 696 | 588 | 480 | 392 | 328 | 240 | 174 | 110 | – | [1] |
| Haushaltstotal allein + 1 Kind | 480 | 426 | 372 | 328 | 296 | 252 | 219 | 187 | 67 | [1] |
| Haushaltstotal Paar + 1 Kind | 828 | 720 | 612 | 524 | 460 | 372 | 306 | 242 | 67 | [1] |

(Gruppengrenzen jeweils «x'001 à y'000»; Einelternfamilien und Paare mit Kindern haben dieselben Grenzen, weil eine Person mit Unterhaltspflicht als Paar gilt.)

| Weitere Grösse | Wert | Quelle |
|---|---|---|
| Vermutung «nicht bescheiden»: Brutto-Vermögen | > 250'000 | [3] Art. 10 al. 1 |
| Vermutung «nicht bescheiden»: Brutto-Einkommen | > 200'000 | [3] Art. 10 al. 2 |
| Ersatz-Einkommen in diesen Fällen | Bruttoeinkommen × 0,95 + 1/15 Brutto-Vermögen | [3] Art. 10 al. 3 |
| Untergrenze (Antrag mit Nachweis nötig) | RDU < 15'000 allein / < 20'000 Paar, +3'000 je Unterhaltspflicht | [3] Art. 10 al. 4–5 |
| Junge Erwachsene | gelten als zusätzliche Unterhaltspflicht der Eltern (RDU Eltern + RDU junge Person) | [3] Art. 10 al. 7 |
| Antragsfrist (Antragsfälle) | vor dem 30. November des Anspruchsjahres | [3] Art. 10A |

### Massgebendes Einkommen
> «Le revenu déterminant est celui résultant de la loi sur le revenu déterminant unifié, du 19 mai 2005.» — Art. 21 al. 3 LaLAMal [2]

> «Le socle du revenu déterminant unifié est égal au revenu calculé en application des articles 4 et 5, augmenté d'un quinzième de la fortune calculée en application des articles 6 et 7.» — Art. 8 al. 2 LRDU [4]; «calculé automatiquement sur la base de la dernière taxation fiscale définitive» — Art. 9 al. 1 LRDU [4]

Abzüge nach Art. 5 LRDU u. a. Säule-3a/2.-Säule-Beiträge, NBU-Prämien, Berufskosten, Kinderbetreuungskosten, Unterhaltsbeiträge, behinderungsbedingte Kosten, Krankheitskosten über 5 % [4]. Ehegatten/eingetragene Partner und Konkubinatspaare mit gemeinsamem Kind: RDU werden addiert (Art. 9 RaLAMal [3]).

### Abweichung zur App
App-Wert (maxIncome/subsidySingle) wurde mit dem Auftrag nicht mitgegeben. Belegte Vergleichswerte: Person allein ohne Kind max. RDU 50'000, Höchstbetrag 348 CHF/Monat (= 4'176 CHF/Jahr) in 8 festen Stufen (nicht linear); Kinderbetrag in G1–G8 konstant 132 CHF/Monat, junge Erwachsene 231 CHF/Monat.

### Offen / nicht gefunden
- Der Indexierungs-Arrêté des Conseil d'État für 2026 (Art. 9B RaLAMal) wurde nicht separat gefunden; die Beträge stammen aus dem amtlichen Barème-PDF des Kantons [1]. Silgeneve-Stände: LaLAMal «Dernières modifications au 2 novembre 2024», RaLAMal «au 1er janvier 2025» — Gesetzestext enthält die unindexierten Beträge (320/270/…/50).
- Die Seite «Barèmes» (ge.ch/informations-generales-subside-assurance-maladie/baremes) lieferte per curl HTTP 403 («Zone sécurisée»); das verlinkte Dokument war frei abrufbar.
- Beträge für PC-AVS/AI-, PCFam- und Sozialhilfe-Beziehende (Durchschnittsprämie) nicht erfasst.

### Quellen
1. BAREME SUBSIDES 2026 (PDF, Dokumentseite «Barèmes et catégories 2026 pour les subsides d'assurance-maladie»), République et canton de Genève, Date de publication 21 avril 2026. https://www.ge.ch/document/baremes-categories-2026-subsides-assurance-maladie → https://www.ge.ch/document/43271/telecharger — abgerufen 16.09.2026
2. Loi d'application de la loi fédérale sur l'assurance-maladie (LaLAMal), rsGE J 3 05, Dernières modifications au 2 novembre 2024. https://silgeneve.ch/legis/data/rsg_j3_05.htm — abgerufen 16.09.2026
3. Règlement d'exécution de la LaLAMal (RaLAMal), rsGE J 3 05.01, Dernières modifications au 1er janvier 2025. https://silgeneve.ch/legis/data/rsg_j3_05p01.htm — abgerufen 16.09.2026
4. Loi sur le revenu déterminant unifié (LRDU), rsGE J 4 06, Dernières modifications au 1er janvier 2025. https://silgeneve.ch/legis/data/rsg_j4_06.htm — abgerufen 16.09.2026
5. Demander un subside d'assurance-maladie 2026, ge.ch (SAM), Dernière mise à jour 9 juillet 2026. https://www.ge.ch/demander-subside-assurance-maladie-2026 — abgerufen 16.09.2026
6. Informations générales sur le subside de l'assurance-maladie, ge.ch, Dernière mise à jour 28 mai 2026. https://www.ge.ch/informations-generales-subside-assurance-maladie — abgerufen 16.09.2026
