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

**Erfasst:** 6 von 26 Kantonen. 5× abbildbar · 1× teilweise

## Übersicht

| Kt. | Kanton | Modell | Abbildbar? | Hauptquelle |
|---|---|---|---|---|
| ZH | Zürich | Referenzprämie (70 % der regionalen Durchschnittsprämie) minus Eigenanteil 8,4 % (Alleinstehende/Alleinerziehende) bzw. 10,5 % (Verheiratete) des massgebenden Einkommens; 3 Prämienregionen; Vermögensgrenze 150'000 / 300'000 | abbildbar | <https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html> |
| BE | Bern | *noch nicht erfasst* | — | — |
| LU | Luzern | *noch nicht erfasst* | — | — |
| UR | Uri | *noch nicht erfasst* | — | — |
| SZ | Schwyz | *noch nicht erfasst* | — | — |
| OW | Obwalden | Richtprämie − Selbstbehalt (9,5 % des anrechenbaren Einkommens bis CHF 35'000, darüber +0,01 %-Punkt je CHF 100); Anspruch nur bei anrechenbarem Einkommen < CHF 50'000 (mit Kindern +25'000 = < 75'000); Mindestanspruch Kinder 80 %, junge Erwachsene in Ausbildung 50 % | abbildbar | <https://gdb.ow.ch/app/de/texts_of_law/851.12> |
| NW | Nidwalden | Selbstbehalt 10 % der «Summe der Steuerwerte» (Reineinkommen + Aufrechnungen + 20 % Reinvermögen); IPV = Richtprämie − Selbstbehalt; Kinder 80 % (Eltern ≤ CHF 100'000), junge Erwachsene in Ausbildung 50 % | abbildbar | <https://gesetze.nw.ch/app/de/texts_of_law/742.111> |
| GL | Glarus | *noch nicht erfasst* | — | — |
| ZG | Zug | *noch nicht erfasst* | — | — |
| FR | Freiburg | *noch nicht erfasst* | — | — |
| SO | Solothurn | Richtprämie (Durchschnittsprämie −30 %) minus Eigenanteil 10–16 % des massgebenden Einkommens (linear), Grenze MGE 74'000; Kinder ≥80 %, junge Erw. ≥50 % bis 74'000 | teilweise | <https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/2026-01-27-Verfuegung-Parameter-Individuelle-Praemie.pdf> |
| BS | Basel-Stadt | *noch nicht erfasst* | — | — |
| BL | Basel-Landschaft | *noch nicht erfasst* | — | — |
| SH | Schaffhausen | *noch nicht erfasst* | — | — |
| AR | Appenzell Ausserrhoden | *noch nicht erfasst* | — | — |
| AI | Appenzell Innerrhoden | Richtprämie (Summe Haushalt) minus Selbstbehalt 7–12 % des massgebenden Gesamteinkommens (gestuft +0,125 %/Fr. 1'000 zwischen 45'000 und 85'000); Kinder/JE in Ausbildung Mindest-IPV 80 %/50 % der Richtprämie bis MGE 75'000 | abbildbar | <https://www.ai.ch/themen/gesundheit-alter-und-soziales/individuelle-praemienverbilligung/merkblatt-ipv/merkblatt-ipv-2024/@@download/file/Merkblatt%20IPV%202026.pdf> |
| SG | St. Gallen | *noch nicht erfasst* | — | — |
| GR | Graubünden | *noch nicht erfasst* | — | — |
| AG | Aargau | *noch nicht erfasst* | — | — |
| TG | Thurgau | *noch nicht erfasst* | — | — |
| TI | Tessin | *noch nicht erfasst* | — | — |
| VD | Waadt | *noch nicht erfasst* | — | — |
| VS | Wallis | *noch nicht erfasst* | — | — |
| NE | Neuenburg | 15 Klassen (S1–S15) nach revenu déterminant und Haushaltstyp/Kinderzahl; fester Monats-Höchstbetrag je Klasse und Alterskategorie (% einer Referenzprämie) | abbildbar (mit Vorbehalt: Webseite und Erlass nennen ab S3 unterschiedliche Monatsbeträge, siehe «Offen») | <https://rsn.ne.ch/DATA/program/books/rsne/pdf/821.102.pdf> |
| GE | Genf | *noch nicht erfasst* | — | — |
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
