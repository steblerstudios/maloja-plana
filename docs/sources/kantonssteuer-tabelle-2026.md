# Kantons- und Gemeindesteuer — Stütztabelle 2026 (E38)

Diese Datei ist **generiert** von `node scripts/steuerband-messen.mjs`. Die Rohwerte liegen daneben:
`steuerfaktor-band-2026.messpunkte.json` (ohne Kinder, E37) und `kantonssteuer-kinder-2026.messpunkte.json`
(1–3 Kinder, E38). Die App liest `src/data/kantonssteuerTabelle.js`.

## Warum eine Tabelle

Bis E37 schätzte die App die Kantons- und Gemeindesteuer als *Faktor × Bundessteuer*. Am ESTV-Steuerrechner 2026
lag dieser eine Faktor bei Brutto 80 000 (ledig) in allen 26 Kantonen 44–70 % zu tief (PR #180). Die Bundessteuer
ist stärker progressiv als die meisten kantonalen Tarife; ein fester Faktor passt deshalb nur in einem schmalen
Einkommensbereich. Seit E38 liest die App die Kantons- und Gemeindesteuer direkt aus Messpunkten des amtlichen
Rechners. Der Faktor und das Band aus E37 sind entfernt.

## Quelle

- **ESTV, Steuerrechner** — <https://swisstaxcalculator.estv.admin.ch/>, Rechner «Einkommens- und Vermögenssteuer», detaillierte
  Berechnung. Abgefragt über die Schnittstelle der Web-Oberfläche: `API_calculateDetailedTaxes` (https://swisstaxcalculator.estv.admin.ch/delegate/ost-integration/v1/lg-proxy/operation/c3b67379_ESTV/).
- Abrufe (UTC): ohne Kinder 2026-09-16T17:12:04.772Z; mit Kindern 2026-09-16T17:50:43.576Z–2026-09-16T18:26:48.212Z (10608 Abrufe).
- Steuerjahr **2026**. Ort je Kanton: Kantonshauptort (TaxLocationID aus `API_searchLocation`); jede Antwort
  wurde gegen Kanton und BFS-Nummer geprüft.
- Gegenprobe bei jedem Lauf: eine erfundene Operation muss scheitern — ohne Kinder: erfundene Operation → fehlgeschlagen wie erwartet; mit Kindern: erfundene Operation → fehlgeschlagen wie erwartet.
- Abgefragt gedrosselt: ein Abruf nach dem anderen, 150 ms Pause (Lauf mit Kindern; der Lauf ohne Kinder am 16.09. noch mit 4 parallelen Abrufen).

## Messanlage

- Unselbständig erwerbend, Alter 40, Konfession «andere/keine» (ohne Kirchensteuer), kein Vermögen.
- **ledig** = Relationship 1. Mit Kindern heisst das **alleinerziehend**: Der ESTV-Rechner kennt keinen eigenen
  Zivilstand dafür; er rechnet eine ledige Person mit Kindern im gleichen Haushalt. Für die Bundessteuer wendet er
  dabei den Elterntarif an (Art. 36 Abs. 2bis DBG) — Kontrolle unten.
- **verheiratet** = Relationship 2, Alleinverdiener-Ehepaar (zweite Person ohne Einkommen, Alter 40).
- **Kinder:** 0, 1, 2, 3; je 8 Jahre (`Children: [{ Age: 8 }]`). Schulkinder: keine Abzüge für
  Kleinkinder oder Kinder in Ausbildung, keine Fremdbetreuungskosten.
- Bruttolohn 20 000–150 000 in Schritten von 2 500, danach bis 300 000 in Schritten von 10 000 (68 Werte).
- **ESTV K+G** = Kantonssteuer + Gemeindesteuer + Personal-/Kopfsteuer auf dem Einkommen, ohne Kirchensteuer.
- **x-Achse = steuerbares Einkommen Bund der ESTV** (`TaxableIncomeFed`), also nach den Standardabzügen des
  Rechners. Die App kennt dagegen den **Nettolohn** und die selbst erfassten Abzüge. Sie liest die Tabelle deshalb
  mit `steuerbarNachEstv()` (src/data/kantonaleSteuerdaten.js): Nettolohn − Berufsauslagen-Pauschale (oder erfasste
  Berufsauslagen) − Versicherungsabzug − Verheiratetenabzug − Kinderabzug − übrige erfasste Abzüge. Ein direkt
  eingetragenes steuerbares Einkommen gilt als Wert der direkten Bundessteuer und wird unverändert gelesen.
- Messpunkte gesamt: **14144** (3536 ohne Kinder, 10608 mit Kindern). 364 davon haben steuerbares Einkommen Bund 0 und gehen nicht in die Tabelle (sehr tiefe Löhne mit Kindern).

### Kontrolle der eigenen Bundessteuer

- An allen Messpunkten liegt `steuerRechner.js` höchstens CHF 1 neben der ESTV-Bundessteuer — ledig mit Kindern mit Elterntarif gerechnet. Der ESTV-Rechner wendet den Elterntarif für ledige Personen mit Kindern also an.

### Vom Nettolohn zur x-Achse (Weg der App)

- Abzugsposten der ESTV je Bruttolohn: `nettolohn-abzuege-2026.messpunkte.json` (Zürich, ledig; abgerufen 2026-09-16T18:29:32.021Z, Gegenprobe: erfundene Operation → fehlgeschlagen wie erwartet).
- Posten Bund laut Rechner: «Übrige Berufsauslagen» 3 % des Nettolohns (mind. 2 000, höchstens 4 000), «Abzug private
  Versicherungen / Sparzinsen» 1 800 bzw. 3 700 + 700 je Kind (ohne BVG-Beitrag Grundbetrag × 1,5), «Abzug verheiratete
  Steuerpflichtige» 2 800, «Kindersozialabzug» 6 800 je Kind.
- Prüfung der Formel an 14144 Messpunkten (alle Kantone, Zivilstände, Kinderzahlen): **alle höchstens CHF 1 neben dem steuerbaren Einkommen der ESTV.**
- Nicht abgebildet: Die ESTV kennt den Bruttolohn und damit, ob ein BVG-Beitrag anfällt; die App schliesst das aus
  dem Nettolohn (gemessen: Brutto 22 500 ohne, 25 000 mit BVG-Beitrag). Zwischen Nettolohn 20 969 und 23 111 kann x
  deshalb um 900 (ledig) zu hoch oder zu tief liegen. Der 13. Monatslohn und Nebeneinkommen gehen so ein, wie die
  App den Jahreslohn bildet.

## Tabelle und Randregel

- Je Kanton × Zivilstand × Kinderzahl eine Reihe von **Stützpunkten**. Jeder Stützpunkt ist ein Messpunkt.
  Zwischen zwei Stützpunkten wird **linear interpoliert**.
- Auswahl: die kleinste Menge Messpunkte (erster und letzter immer dabei), bei der die Interpolation **jeden**
  Messpunkt der Reihe trifft — zuerst mit ±0,5 % / CHF 10, dann schrittweise weiter (1 % / 20, 1,5 % / 25,
  2 % / 35, 3 % / 50), bis die Reihe mit höchstens 20 Stützpunkten auskommt. Die Messpunkte, die nicht
  Stützpunkt sind, sind damit zugleich die Kontrolle der Interpolation.
- **Randregel: keine Extrapolation.** Unter dem kleinsten und über dem grössten Stützpunkt zeigt die App keine
  Zahl. Unten beginnt die Reihe beim Brutto 20 000 (bzw. beim ersten Brutto mit steuerbarem Einkommen > 0);
  darunter kann die Steuer 0 oder eine Kopfsteuer sein — das wäre geraten. Oben endet sie bei Brutto 300 000;
  darüber ändern sich in mehreren Kantonen die Tarifstufen.
- **Keine Reihe, keine Zahl:** mehr als 3 Kinder, ledig mit Kindern ohne bestätigten Elterntarif
  (dann ist offen, ob die Kinder im gleichen Haushalt leben), unbekannter Kanton.
- **Nicht gemessen:** Doppelverdiener, Konkubinat, andere Gemeinden als der Hauptort, Kirchensteuer, Vermögen,
  Kinder in Ausbildung oder mit Betreuungskosten. Die App kennzeichnet die Zahl deshalb als «grobe Schätzung».

## Interpolationsfehler (an allen Messpunkten)

- Grenze laut Auftrag: höchstens ±3 % der ESTV K+G oder ±CHF 50 (das Grössere).
- Messpunkte in der Tabelle: **13780**, davon 11127 nicht Stützpunkt.
- Ausserhalb der Grenze: **0**.
- Abweichung Tabelle − ESTV: **Maximum CHF 391**, Median CHF 5 (nur Nicht-Stützpunkte: Median CHF 8).
- Grösste relative Abweichung bei ESTV K+G ab CHF 1 000: **1.7 %**; Median 0.1 %.
- Stützpunkte je Reihe: min 3, Median 13, max 20. Gewählte Stufe: 0.5 % / CHF 10 → 201 Reihen; 1.0 % / CHF 20 → 7 Reihen.

## Abdeckung

- Reihen mit Tabelle: **208** von 208 (26 Kantone × 2 Zivilstände × 4 Kinderzahlen = 208).
- Keine der 208 Kombinationen fehlt (geprüft gegen alle Kombinationen, nicht nur gegen die gemessenen).

| Kanton | Zivilstand | Kinder | steuerbar Bund von–bis | Stützpunkte | max. Abw. CHF | max. Abw. % (K+G ≥ 1 000) | ESTV K+G bei Brutto 50 000 / 80 000 / 120 000 |
|---|---|---:|---|---:|---:|---:|---|
| AG Aarau | ledig | 0 | 13'940–265'539 | 17 | 116 | 0.5 % | 3'130 / 7'448 / 13'901 |
| AG Aarau | ledig | 1 | 6'440–258'039 | 20 | 142 | 0.5 % | 778 / 3'304 / 8'087 |
| AG Aarau | ledig | 2 | 1'269–250'539 | 17 | 142 | 0.5 % | 223 / 2'274 / 6'637 |
| AG Aarau | ledig | 3 | 1'471–243'039 | 18 | 144 | 0.5 % | 0 / 1'409 / 5'342 |
| AG Aarau | verheiratet | 0 | 8'290–260'839 | 18 | 136 | 0.5 % | 1'234 / 3'960 / 8'963 |
| AG Aarau | verheiratet | 1 | 790–253'339 | 18 | 146 | 0.6 % | 491 / 2'850 / 7'483 |
| AG Aarau | verheiratet | 2 | 1'940–245'839 | 19 | 146 | 0.5 % | 22 / 1'897 / 6'107 |
| AG Aarau | verheiratet | 3 | 1'193–238'339 | 19 | 101 | 0.5 % | 0 / 1'026 / 4'812 |
| AI Appenzell | ledig | 0 | 13'940–265'539 | 10 | 101 | 0.5 % | 3'049 / 6'286 / 11'055 |
| AI Appenzell | ledig | 1 | 6'440–258'039 | 13 | 70 | 0.8 % | 1'110 / 3'594 / 7'981 |
| AI Appenzell | ledig | 2 | 1'269–250'539 | 13 | 49 | 0.5 % | 668 / 2'848 / 7'128 |
| AI Appenzell | ledig | 3 | 1'471–243'039 | 14 | 47 | 0.5 % | 255 / 1'957 / 6'033 |
| AI Appenzell | verheiratet | 0 | 8'290–260'839 | 12 | 45 | 0.5 % | 1'390 / 4'031 / 8'463 |
| AI Appenzell | verheiratet | 1 | 790–253'339 | 14 | 72 | 0.5 % | 891 / 3'268 / 7'611 |
| AI Appenzell | verheiratet | 2 | 1'940–245'839 | 13 | 61 | 1.0 % | 504 / 2'544 / 6'758 |
| AI Appenzell | verheiratet | 3 | 1'193–238'339 | 15 | 68 | 1.0 % | 165 / 1'696 / 5'684 |
| AR Herisau | ledig | 0 | 13'940–265'539 | 8 | 115 | 0.5 % | 4'321 / 9'170 / 16'370 |
| AR Herisau | ledig | 1 | 6'440–258'039 | 12 | 118 | 0.4 % | 1'426 / 5'209 / 11'704 |
| AR Herisau | ledig | 2 | 1'269–250'539 | 12 | 115 | 0.4 % | 450 / 3'889 / 10'068 |
| AR Herisau | ledig | 3 | 1'471–243'039 | 13 | 113 | 0.5 % | 0 / 2'709 / 8'514 |
| AR Herisau | verheiratet | 0 | 8'290–260'839 | 13 | 125 | 0.5 % | 2'160 / 6'136 / 12'843 |
| AR Herisau | verheiratet | 1 | 790–253'339 | 12 | 133 | 0.4 % | 1'087 / 4'769 / 11'165 |
| AR Herisau | verheiratet | 2 | 1'940–245'839 | 13 | 127 | 0.5 % | 211 / 3'510 / 9'569 |
| AR Herisau | verheiratet | 3 | 1'193–238'339 | 12 | 109 | 0.5 % | 0 / 2'329 / 8'015 |
| BE Bern | ledig | 0 | 13'940–265'539 | 9 | 204 | 0.6 % | 5'473 / 10'760 / 18'807 |
| BE Bern | ledig | 1 | 6'440–258'039 | 14 | 163 | 0.7 % | 2'612 / 7'256 / 13'763 |
| BE Bern | ledig | 2 | 1'269–250'539 | 14 | 144 | 0.5 % | 953 / 5'386 / 11'763 |
| BE Bern | ledig | 3 | 1'471–243'039 | 13 | 145 | 0.5 % | 0 / 3'402 / 9'763 |
| BE Bern | verheiratet | 0 | 8'290–260'839 | 15 | 192 | 0.5 % | 3'369 / 8'115 / 14'776 |
| BE Bern | verheiratet | 1 | 790–253'339 | 15 | 180 | 0.5 % | 1'700 / 6'570 / 12'967 |
| BE Bern | verheiratet | 2 | 1'940–245'839 | 14 | 136 | 0.4 % | 469 / 4'752 / 11'220 |
| BE Bern | verheiratet | 3 | 1'193–238'339 | 15 | 126 | 0.6 % | 0 / 2'958 / 9'472 |
| BL Liestal | ledig | 0 | 13'940–265'539 | 15 | 214 | 0.5 % | 4'189 / 10'408 / 19'933 |
| BL Liestal | ledig | 1 | 6'440–258'039 | 14 | 164 | 0.5 % | 0 / 3'791 / 11'348 |
| BL Liestal | ledig | 2 | 1'269–250'539 | 13 | 165 | 0.5 % | 0 / 2'472 / 10'007 |
| BL Liestal | ledig | 3 | 1'471–243'039 | 12 | 166 | 0.5 % | 0 / 1'154 / 8'666 |
| BL Liestal | verheiratet | 0 | 8'290–260'839 | 17 | 169 | 0.6 % | 939 / 4'750 / 12'228 |
| BL Liestal | verheiratet | 1 | 790–253'339 | 14 | 173 | 0.5 % | 0 / 3'433 / 10'888 |
| BL Liestal | verheiratet | 2 | 1'940–245'839 | 12 | 174 | 0.8 % | 0 / 2'116 / 9'547 |
| BL Liestal | verheiratet | 3 | 1'193–238'339 | 11 | 176 | 0.8 % | 0 / 800 / 8'207 |
| BS Basel | ledig | 0 | 13'940–265'539 | 8 | 187 | 0.7 % | 3'676 / 9'220 / 16'738 |
| BS Basel | ledig | 1 | 6'440–258'039 | 6 | 79 | 0.4 % | 0 / 4'578 / 12'096 |
| BS Basel | ledig | 2 | 1'269–250'539 | 6 | 79 | 0.6 % | 0 / 2'688 / 10'206 |
| BS Basel | ledig | 3 | 1'471–243'039 | 6 | 47 | 0.5 % | 0 / 798 / 8'316 |
| BS Basel | verheiratet | 0 | 8'290–260'839 | 6 | 79 | 0.4 % | 0 / 4'452 / 11'970 |
| BS Basel | verheiratet | 1 | 790–253'339 | 6 | 75 | 0.5 % | 0 / 2'562 / 10'080 |
| BS Basel | verheiratet | 2 | 1'940–245'839 | 6 | 47 | 0.5 % | 0 / 672 / 8'190 |
| BS Basel | verheiratet | 3 | 1'193–238'339 | 7 | 47 | 0.6 % | 0 / 0 / 6'300 |
| FR Fribourg | ledig | 0 | 13'940–265'539 | 13 | 140 | 0.8 % | 4'729 / 10'527 / 18'940 |
| FR Fribourg | ledig | 1 | 6'440–258'039 | 19 | 182 | 0.5 % | 1'456 / 5'546 / 12'498 |
| FR Fribourg | ledig | 2 | 1'269–250'539 | 20 | 155 | 0.5 % | 530 / 3'960 / 10'709 |
| FR Fribourg | ledig | 3 | 1'471–243'039 | 20 | 132 | 0.5 % | 97 / 2'526 / 8'803 |
| FR Fribourg | verheiratet | 0 | 8'290–260'839 | 14 | 391 | 1.2 % | 2'049 / 6'455 / 13'337 |
| FR Fribourg | verheiratet | 1 | 790–253'339 | 19 | 180 | 0.6 % | 891 / 4'769 / 11'490 |
| FR Fribourg | verheiratet | 2 | 1'940–245'839 | 20 | 159 | 0.5 % | 215 / 3'330 / 9'774 |
| FR Fribourg | verheiratet | 3 | 1'193–238'339 | 18 | 141 | 0.5 % | 0 / 1'888 / 7'683 |
| GE Genève | ledig | 0 | 13'940–265'539 | 14 | 195 | 0.5 % | 3'598 / 9'547 / 18'274 |
| GE Genève | ledig | 1 | 6'440–258'039 | 11 | 92 | 0.5 % | 25 / 1'830 / 8'760 |
| GE Genève | ledig | 2 | 1'269–250'539 | 11 | 43 | 0.5 % | 25 / 25 / 5'660 |
| GE Genève | ledig | 3 | 1'471–243'039 | 12 | 29 | 0.4 % | 25 / 25 / 2'819 |
| GE Genève | verheiratet | 0 | 8'290–260'839 | 12 | 82 | 0.5 % | 25 / 3'634 / 11'078 |
| GE Genève | verheiratet | 1 | 790–253'339 | 12 | 41 | 0.5 % | 25 / 1'153 / 7'771 |
| GE Genève | verheiratet | 2 | 1'940–245'839 | 11 | 107 | 0.5 % | 25 / 25 / 4'772 |
| GE Genève | verheiratet | 3 | 1'193–238'339 | 12 | 55 | 0.5 % | 25 / 25 / 2'048 |
| GL Glarus | ledig | 0 | 13'940–265'539 | 11 | 105 | 0.5 % | 3'837 / 8'326 / 14'591 |
| GL Glarus | ledig | 1 | 6'440–258'039 | 10 | 111 | 0.5 % | 1'401 / 4'931 / 10'493 |
| GL Glarus | ledig | 2 | 1'269–250'539 | 8 | 102 | 0.4 % | 610 / 3'704 / 9'072 |
| GL Glarus | ledig | 3 | 1'471–243'039 | 9 | 102 | 0.7 % | 0 / 2'616 / 7'786 |
| GL Glarus | verheiratet | 0 | 8'290–260'839 | 9 | 68 | 0.3 % | 1'969 / 5'731 / 11'415 |
| GL Glarus | verheiratet | 1 | 790–253'339 | 9 | 54 | 0.6 % | 1'104 / 4'446 / 9'922 |
| GL Glarus | verheiratet | 2 | 1'940–245'839 | 9 | 131 | 0.5 % | 313 / 3'294 / 8'587 |
| GL Glarus | verheiratet | 3 | 1'193–238'339 | 11 | 99 | 0.4 % | 0 / 2'195 / 7'303 |
| GR Chur | ledig | 0 | 13'940–265'539 | 13 | 72 | 0.7 % | 2'700 / 7'492 / 14'318 |
| GR Chur | ledig | 1 | 6'440–258'039 | 13 | 146 | 0.6 % | 0 / 1'804 / 7'441 |
| GR Chur | ledig | 2 | 1'269–250'539 | 14 | 149 | 0.5 % | 0 / 123 / 4'958 |
| GR Chur | ledig | 3 | 1'471–243'039 | 13 | 109 | 0.5 % | 0 / 0 / 2'713 |
| GR Chur | verheiratet | 0 | 8'290–260'839 | 13 | 125 | 0.5 % | 41 / 3'273 / 9'328 |
| GR Chur | verheiratet | 1 | 790–253'339 | 14 | 139 | 0.5 % | 0 / 1'176 / 6'638 |
| GR Chur | verheiratet | 2 | 1'940–245'839 | 13 | 139 | 0.8 % | 0 / 0 / 4'228 |
| GR Chur | verheiratet | 3 | 1'193–238'339 | 13 | 102 | 0.5 % | 0 / 0 / 2'051 |
| JU Delémont | ledig | 0 | 13'940–265'539 | 11 | 221 | 0.5 % | 4'128 / 9'682 / 18'202 |
| JU Delémont | ledig | 1 | 6'440–258'039 | 12 | 110 | 0.4 % | 1'323 / 5'660 / 12'650 |
| JU Delémont | ledig | 2 | 1'269–250'539 | 12 | 70 | 0.7 % | 572 / 4'357 / 11'338 |
| JU Delémont | ledig | 3 | 1'471–243'039 | 10 | 37 | 0.7 % | 13 / 3'002 / 9'615 |
| JU Delémont | verheiratet | 0 | 8'290–260'839 | 12 | 78 | 0.4 % | 1'554 / 5'954 / 13'013 |
| JU Delémont | verheiratet | 1 | 790–253'339 | 12 | 76 | 0.5 % | 744 / 4'642 / 11'632 |
| JU Delémont | verheiratet | 2 | 1'940–245'839 | 12 | 107 | 0.4 % | 163 / 3'556 / 10'320 |
| JU Delémont | verheiratet | 3 | 1'193–238'339 | 11 | 195 | 0.5 % | 0 / 2'201 / 8'597 |
| LU Luzern | ledig | 0 | 13'940–265'539 | 11 | 121 | 0.5 % | 3'322 / 7'340 / 12'356 |
| LU Luzern | ledig | 1 | 6'440–258'039 | 13 | 47 | 0.3 % | 122 / 3'694 / 8'470 |
| LU Luzern | ledig | 2 | 1'269–250'539 | 13 | 71 | 0.5 % | 50 / 2'272 / 7'060 |
| LU Luzern | ledig | 3 | 1'471–243'039 | 11 | 74 | 0.4 % | 50 / 848 / 5'652 |
| LU Luzern | verheiratet | 0 | 8'290–260'839 | 11 | 69 | 0.9 % | 818 / 4'724 / 9'540 |
| LU Luzern | verheiratet | 1 | 790–253'339 | 12 | 69 | 0.5 % | 70 / 3'302 / 8'130 |
| LU Luzern | verheiratet | 2 | 1'940–245'839 | 13 | 75 | 0.5 % | 50 / 1'880 / 6'722 |
| LU Luzern | verheiratet | 3 | 1'193–238'339 | 12 | 86 | 0.4 % | 50 / 544 / 5'312 |
| NE Neuchâtel | ledig | 0 | 13'940–265'539 | 12 | 238 | 0.5 % | 5'645 / 11'960 / 21'044 |
| NE Neuchâtel | ledig | 1 | 6'440–258'039 | 16 | 182 | 0.5 % | 1'225 / 6'555 / 14'377 |
| NE Neuchâtel | ledig | 2 | 1'269–250'539 | 15 | 181 | 0.6 % | 217 / 4'724 / 12'451 |
| NE Neuchâtel | ledig | 3 | 1'471–243'039 | 12 | 184 | 0.6 % | 42 / 2'895 / 10'525 |
| NE Neuchâtel | verheiratet | 0 | 8'290–260'839 | 16 | 226 | 0.5 % | 1'658 / 7'880 / 15'745 |
| NE Neuchâtel | verheiratet | 1 | 790–253'339 | 17 | 195 | 0.5 % | 535 / 6'020 / 13'818 |
| NE Neuchâtel | verheiratet | 2 | 1'940–245'839 | 16 | 187 | 0.8 % | 62 / 4'190 / 11'890 |
| NE Neuchâtel | verheiratet | 3 | 1'193–238'339 | 12 | 187 | 0.5 % | 0 / 2'358 / 9'979 |
| NW Stans | ledig | 0 | 13'940–265'539 | 11 | 92 | 0.5 % | 3'408 / 7'099 / 12'252 |
| NW Stans | ledig | 1 | 6'440–258'039 | 14 | 136 | 0.5 % | 442 / 3'360 / 8'231 |
| NW Stans | ledig | 2 | 1'269–250'539 | 14 | 117 | 0.7 % | 50 / 1'924 / 6'745 |
| NW Stans | ledig | 3 | 1'471–243'039 | 13 | 86 | 0.4 % | 50 / 786 / 5'259 |
| NW Stans | verheiratet | 0 | 8'290–260'839 | 14 | 124 | 0.5 % | 1'156 / 4'540 / 9'464 |
| NW Stans | verheiratet | 1 | 790–253'339 | 13 | 133 | 0.7 % | 326 / 3'085 / 7'950 |
| NW Stans | verheiratet | 2 | 1'940–245'839 | 13 | 112 | 0.5 % | 50 / 1'684 / 6'475 |
| NW Stans | verheiratet | 3 | 1'193–238'339 | 13 | 81 | 0.4 % | 50 / 632 / 4'989 |
| OW Sarnen | ledig | 0 | 13'940–265'539 | 3 | 28 | 0.5 % | 3'942 / 7'423 / 11'851 |
| OW Sarnen | ledig | 1 | 6'440–258'039 | 6 | 40 | 0.5 % | 1'369 / 4'837 / 9'688 |
| OW Sarnen | ledig | 2 | 1'269–250'539 | 7 | 39 | 0.4 % | 486 / 3'942 / 8'805 |
| OW Sarnen | ledig | 3 | 1'471–243'039 | 6 | 23 | 0.4 % | 0 / 3'059 / 7'922 |
| OW Sarnen | verheiratet | 0 | 8'290–260'839 | 8 | 27 | 0.6 % | 2'380 / 5'823 / 10'367 |
| OW Sarnen | verheiratet | 1 | 790–253'339 | 6 | 51 | 0.6 % | 1'177 / 4'620 / 9'483 |
| OW Sarnen | verheiratet | 2 | 1'940–245'839 | 6 | 37 | 0.7 % | 307 / 3'724 / 8'600 |
| OW Sarnen | verheiratet | 3 | 1'193–238'339 | 8 | 21 | 0.3 % | 0 / 2'829 / 7'705 |
| SG St. Gallen | ledig | 0 | 13'940–265'539 | 9 | 115 | 0.6 % | 4'161 / 9'459 / 17'478 |
| SG St. Gallen | ledig | 1 | 6'440–258'039 | 9 | 152 | 0.5 % | 429 / 4'090 / 10'393 |
| SG St. Gallen | ledig | 2 | 1'269–250'539 | 8 | 130 | 0.9 % | 0 / 2'362 / 8'087 |
| SG St. Gallen | ledig | 3 | 1'471–243'039 | 11 | 113 | 0.6 % | 0 / 683 / 5'841 |
| SG St. Gallen | verheiratet | 0 | 8'290–260'839 | 9 | 161 | 0.5 % | 1'488 / 5'336 / 12'053 |
| SG St. Gallen | verheiratet | 1 | 790–253'339 | 9 | 143 | 0.5 % | 97 / 3'594 / 9'731 |
| SG St. Gallen | verheiratet | 2 | 1'940–245'839 | 9 | 132 | 0.6 % | 0 / 1'866 / 7'426 |
| SG St. Gallen | verheiratet | 3 | 1'193–238'339 | 11 | 102 | 0.4 % | 0 / 351 / 5'344 |
| SH Schaffhausen | ledig | 0 | 13'940–265'539 | 11 | 73 | 0.5 % | 3'033 / 6'865 / 12'877 |
| SH Schaffhausen | ledig | 1 | 6'440–258'039 | 13 | 47 | 0.7 % | 763 / 3'523 / 7'851 |
| SH Schaffhausen | ledig | 2 | 1'269–250'539 | 14 | 48 | 0.8 % | 190 / 2'585 / 6'539 |
| SH Schaffhausen | ledig | 3 | 1'471–243'039 | 12 | 33 | 0.6 % | 60 / 1'716 / 5'347 |
| SH Schaffhausen | verheiratet | 0 | 8'290–260'839 | 15 | 33 | 0.7 % | 1'173 / 4'158 / 8'648 |
| SH Schaffhausen | verheiratet | 1 | 790–253'339 | 13 | 40 | 0.6 % | 461 / 3'112 / 7'307 |
| SH Schaffhausen | verheiratet | 2 | 1'940–245'839 | 16 | 42 | 0.5 % | 60 / 2'185 / 6'056 |
| SH Schaffhausen | verheiratet | 3 | 1'193–238'339 | 15 | 53 | 0.5 % | 60 / 1'371 / 4'874 |
| SO Solothurn | ledig | 0 | 13'940–265'539 | 10 | 77 | 0.5 % | 4'746 / 10'551 / 18'423 |
| SO Solothurn | ledig | 1 | 6'440–258'039 | 14 | 169 | 0.5 % | 756 / 4'765 / 12'040 |
| SO Solothurn | ledig | 2 | 1'269–250'539 | 13 | 173 | 0.5 % | 50 / 2'838 / 9'880 |
| SO Solothurn | ledig | 3 | 1'471–243'039 | 13 | 174 | 0.5 % | 50 / 1'431 / 7'770 |
| SO Solothurn | verheiratet | 0 | 8'290–260'839 | 13 | 66 | 0.4 % | 1'600 / 6'333 / 13'689 |
| SO Solothurn | verheiratet | 1 | 790–253'339 | 13 | 71 | 0.6 % | 553 / 4'285 / 11'529 |
| SO Solothurn | verheiratet | 2 | 1'940–245'839 | 13 | 85 | 0.4 % | 100 / 2'455 / 9'369 |
| SO Solothurn | verheiratet | 3 | 1'193–238'339 | 11 | 95 | 0.5 % | 100 / 1'201 / 7'287 |
| SZ Schwyz | ledig | 0 | 13'940–265'539 | 14 | 55 | 0.7 % | 1'879 / 4'472 / 8'415 |
| SZ Schwyz | ledig | 1 | 6'440–258'039 | 13 | 42 | 0.4 % | 52 / 2'646 / 6'381 |
| SZ Schwyz | ledig | 2 | 1'269–250'539 | 12 | 30 | 0.5 % | 0 / 1'063 / 5'213 |
| SZ Schwyz | ledig | 3 | 1'471–243'039 | 14 | 25 | 0.4 % | 0 / 18 / 3'656 |
| SZ Schwyz | verheiratet | 0 | 8'290–260'839 | 15 | 47 | 0.6 % | 168 / 2'484 / 6'120 |
| SZ Schwyz | verheiratet | 1 | 790–253'339 | 14 | 15 | 0.6 % | 0 / 1'078 / 5'011 |
| SZ Schwyz | verheiratet | 2 | 1'940–245'839 | 15 | 21 | 0.4 % | 0 / 111 / 3'347 |
| SZ Schwyz | verheiratet | 3 | 1'193–238'339 | 16 | 18 | 0.4 % | 0 / 0 / 1'842 |
| TG Frauenfeld | ledig | 0 | 13'940–265'539 | 10 | 129 | 0.5 % | 3'685 / 8'306 / 14'590 |
| TG Frauenfeld | ledig | 1 | 6'440–258'039 | 9 | 60 | 0.4 % | 408 / 3'901 / 9'584 |
| TG Frauenfeld | ledig | 2 | 1'269–250'539 | 11 | 48 | 0.7 % | 0 / 2'636 / 8'108 |
| TG Frauenfeld | ledig | 3 | 1'471–243'039 | 12 | 46 | 0.4 % | 0 / 1'396 / 6'632 |
| TG Frauenfeld | verheiratet | 0 | 8'290–260'839 | 11 | 109 | 0.5 % | 854 / 4'631 / 10'438 |
| TG Frauenfeld | verheiratet | 1 | 790–253'339 | 13 | 91 | 0.4 % | 180 / 3'364 / 8'960 |
| TG Frauenfeld | verheiratet | 2 | 1'940–245'839 | 11 | 91 | 0.7 % | 0 / 2'098 / 7'484 |
| TG Frauenfeld | verheiratet | 3 | 1'193–238'339 | 11 | 74 | 0.5 % | 0 / 956 / 6'047 |
| TI Bellinzona | ledig | 0 | 13'940–265'539 | 19 | 230 | 0.5 % | 3'318 / 8'682 / 16'987 |
| TI Bellinzona | ledig | 1 | 6'440–258'039 | 18 | 174 | 0.5 % | 427 / 2'895 / 9'604 |
| TI Bellinzona | ledig | 2 | 1'269–250'539 | 18 | 145 | 0.4 % | 20 / 1'375 / 6'987 |
| TI Bellinzona | ledig | 3 | 1'471–243'039 | 15 | 148 | 0.6 % | 20 / 520 / 4'507 |
| TI Bellinzona | verheiratet | 0 | 8'290–260'839 | 16 | 164 | 0.5 % | 972 / 4'142 / 11'504 |
| TI Bellinzona | verheiratet | 1 | 790–253'339 | 17 | 146 | 0.6 % | 105 / 2'241 / 8'640 |
| TI Bellinzona | verheiratet | 2 | 1'940–245'839 | 17 | 167 | 0.5 % | 40 / 1'047 / 6'110 |
| TI Bellinzona | verheiratet | 3 | 1'193–238'339 | 17 | 110 | 0.4 % | 40 / 181 / 3'778 |
| UR Altdorf UR | ledig | 0 | 13'940–265'539 | 3 | 1 | 0.1 % | 3'714 / 7'357 / 12'153 |
| UR Altdorf UR | ledig | 1 | 6'440–258'039 | 4 | 1 | 0.1 % | 1'624 / 5'265 / 10'062 |
| UR Altdorf UR | ledig | 2 | 1'269–250'539 | 4 | 1 | 0.0 % | 350 / 3'992 / 8'789 |
| UR Altdorf UR | ledig | 3 | 1'471–243'039 | 4 | 1 | 0.1 % | 70 / 2'718 / 7'515 |
| UR Altdorf UR | verheiratet | 0 | 8'290–260'839 | 4 | 1 | 0.1 % | 1'845 / 5'487 / 10'284 |
| UR Altdorf UR | verheiratet | 1 | 790–253'339 | 4 | 2 | 0.1 % | 571 / 4'214 / 9'011 |
| UR Altdorf UR | verheiratet | 2 | 1'940–245'839 | 4 | 1 | 0.1 % | 70 / 2'940 / 7'737 |
| UR Altdorf UR | verheiratet | 3 | 1'193–238'339 | 4 | 1 | 0.1 % | 70 / 1'665 / 6'462 |
| VD Lausanne | ledig | 0 | 13'940–265'539 | 18 | 256 | 0.5 % | 3'752 / 10'933 / 19'535 |
| VD Lausanne | ledig | 1 | 6'440–258'039 | 16 | 315 | 1.7 % | 785 / 6'566 / 14'805 |
| VD Lausanne | ledig | 2 | 1'269–250'539 | 18 | 385 | 1.0 % | 137 / 4'449 / 12'832 |
| VD Lausanne | ledig | 3 | 1'471–243'039 | 19 | 201 | 0.5 % | 0 / 2'794 / 10'941 |
| VD Lausanne | verheiratet | 0 | 8'290–260'839 | 18 | 171 | 0.5 % | 635 / 6'948 / 14'623 |
| VD Lausanne | verheiratet | 1 | 790–253'339 | 19 | 171 | 0.4 % | 75 / 4'262 / 12'972 |
| VD Lausanne | verheiratet | 2 | 1'940–245'839 | 15 | 369 | 1.0 % | 0 / 2'571 / 11'340 |
| VD Lausanne | verheiratet | 3 | 1'193–238'339 | 18 | 111 | 0.8 % | 0 / 1'486 / 8'743 |
| VS Sion | ledig | 0 | 13'940–265'539 | 20 | 226 | 0.5 % | 3'685 / 8'581 / 16'965 |
| VS Sion | ledig | 1 | 6'440–258'039 | 20 | 175 | 0.8 % | 283 / 3'549 / 8'524 |
| VS Sion | ledig | 2 | 1'269–250'539 | 19 | 128 | 0.5 % | 34 / 1'709 / 6'164 |
| VS Sion | ledig | 3 | 1'471–243'039 | 20 | 154 | 0.5 % | 34 / 201 / 3'848 |
| VS Sion | verheiratet | 0 | 8'290–260'839 | 16 | 247 | 1.1 % | 1'736 / 5'077 / 10'374 |
| VS Sion | verheiratet | 1 | 790–253'339 | 20 | 144 | 0.8 % | 67 / 3'098 / 7'930 |
| VS Sion | verheiratet | 2 | 1'940–245'839 | 18 | 233 | 1.1 % | 34 / 1'121 / 5'605 |
| VS Sion | verheiratet | 3 | 1'193–238'339 | 15 | 220 | 0.9 % | 34 / 34 / 3'349 |
| ZG Zug | ledig | 0 | 13'940–265'539 | 13 | 43 | 0.7 % | 868 / 2'433 / 5'078 |
| ZG Zug | ledig | 1 | 6'440–258'039 | 15 | 60 | 0.7 % | 0 / 152 / 1'473 |
| ZG Zug | ledig | 2 | 1'269–250'539 | 14 | 17 | 0.7 % | 0 / 0 / 353 |
| ZG Zug | ledig | 3 | 1'471–243'039 | 13 | 24 | 0.4 % | 0 / 0 / 0 |
| ZG Zug | verheiratet | 0 | 8'290–260'839 | 15 | 56 | 0.8 % | 77 / 995 / 2'643 |
| ZG Zug | verheiratet | 1 | 790–253'339 | 13 | 38 | 0.6 % | 0 / 53 / 1'265 |
| ZG Zug | verheiratet | 2 | 1'940–245'839 | 12 | 37 | 0.6 % | 0 / 0 / 188 |
| ZG Zug | verheiratet | 3 | 1'193–238'339 | 13 | 15 | 0.2 % | 0 / 0 / 0 |
| ZH Zürich | ledig | 0 | 13'940–265'539 | 11 | 119 | 0.4 % | 3'040 / 7'039 / 13'497 |
| ZH Zürich | ledig | 1 | 6'440–258'039 | 14 | 133 | 0.4 % | 921 / 3'689 / 8'701 |
| ZH Zürich | ledig | 2 | 1'269–250'539 | 15 | 139 | 0.6 % | 238 / 2'405 / 7'099 |
| ZH Zürich | ledig | 3 | 1'471–243'039 | 14 | 69 | 0.7 % | 24 / 1'340 / 5'496 |
| ZH Zürich | verheiratet | 0 | 8'290–260'839 | 17 | 147 | 0.5 % | 1'612 / 4'715 / 9'941 |
| ZH Zürich | verheiratet | 1 | 790–253'339 | 14 | 180 | 0.5 % | 733 / 3'341 / 8'291 |
| ZH Zürich | verheiratet | 2 | 1'940–245'839 | 13 | 92 | 0.5 % | 138 / 2'120 / 6'689 |
| ZH Zürich | verheiratet | 3 | 1'193–238'339 | 13 | 48 | 0.4 % | 48 / 1'116 / 5'085 |

## Stützpunkte

Je Reihe: steuerbar Bund → ESTV K+G (CHF).

<details><summary>AG — Aarau</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 19'311 → 143 · 21'640 → 237 · 23'971 → 697 · 26'187 → 883 · 28'393 → 1'202 · 30'597 → 1'437 · 32'803 → 1'831 · 35'007 → 2'094 · 37'213 → 2'517 · 43'827 → 3'439 · 50'443 → 4'490 · 61'467 → 6'321 · 74'343 → 8'595 · 102'574 → 13'901 · 165'219 → 26'283 · 265'539 → 47'109
- **ledig, 1 Kind:** 6'440 → 0 · 16'471 → 0 · 20'893 → 18 · 23'097 → 62 · 25'303 → 243 · 27'507 → 330 · 31'917 → 587 · 34'123 → 778 · 36'327 → 910 · 38'533 → 1'067 · 40'737 → 1'321 · 45'147 → 1'677 · 51'763 → 2'334 · 56'149 → 2'790 · 68'982 → 4'318 · 86'374 → 6'720 · 105'950 → 9'823 · 139'479 → 15'578 · 194'199 → 25'779 · 258'039 → 38'198
- **ledig, 2 Kinder:** 1'269 → 0 · 22'213 → 10 · 24'417 → 54 · 26'623 → 223 · 28'827 → 311 · 35'443 → 688 · 37'647 → 879 · 39'853 → 1'026 · 42'057 → 1'281 · 46'467 → 1'632 · 57'205 → 2'707 · 72'347 → 4'519 · 87'574 → 6'637 · 107'151 → 9'727 · 141'099 → 15'542 · 186'699 → 24'021 · 250'539 → 36'347
- **ledig, 3 Kinder:** 1'471 → 0 · 23'533 → 0 · 25'737 → 44 · 27'943 → 203 · 32'353 → 378 · 36'763 → 659 · 38'967 → 850 · 41'149 → 987 · 43'287 → 1'234 · 47'565 → 1'576 · 56'146 → 2'413 · 60'497 → 2'873 · 73'548 → 4'438 · 88'775 → 6'553 · 97'476 → 7'896 · 124'479 → 12'338 · 151'839 → 17'154 · 243'039 → 34'497
- **verheiratet, 0 Kinder:** 8'290 → 0 · 16'940 → 0 · 19'271 → 40 · 21'487 → 195 · 25'897 → 371 · 30'307 → 653 · 32'513 → 844 · 34'717 → 979 · 36'923 → 1'234 · 41'333 → 1'584 · 43'537 → 1'787 · 52'357 → 2'662 · 67'505 → 4'478 · 84'823 → 6'893 · 106'575 → 10'375 · 142'279 → 16'563 · 196'999 → 26'819 · 260'839 → 39'292
- **verheiratet, 1 Kind:** 790 → 0 · 18'397 → 0 · 22'807 → 75 · 25'013 → 267 · 27'217 → 354 · 31'627 → 622 · 33'833 → 814 · 36'037 → 945 · 38'243 → 1'194 · 40'447 → 1'369 · 44'857 → 1'737 · 53'587 → 2'603 · 68'622 → 4'390 · 86'024 → 6'804 · 109'951 → 10'647 · 143'899 → 16'527 · 189'499 → 25'061 · 253'339 → 37'441
- **verheiratet, 2 Kinder:** 1'940 → 0 · 19'717 → 0 · 21'923 → 22 · 24'127 → 66 · 26'333 → 247 · 28'537 → 334 · 32'947 → 593 · 35'153 → 784 · 37'357 → 916 · 39'563 → 1'074 · 41'767 → 1'329 · 46'087 → 1'677 · 56'782 → 2'755 · 71'998 → 4'589 · 87'225 → 6'720 · 100'276 → 8'772 · 127'279 → 13'269 · 163'759 → 19'862 · 245'839 → 35'592
- **verheiratet, 3 Kinder:** 1'193 → 0 · 5'603 → 0 · 23'243 → 12 · 25'447 → 56 · 27'653 → 226 · 29'857 → 315 · 36'449 → 694 · 38'587 → 879 · 40'727 → 1'026 · 42'865 → 1'273 · 47'143 → 1'616 · 49'282 → 1'816 · 57'973 → 2'682 · 73'199 → 4'505 · 86'250 → 6'330 · 94'951 → 7'641 · 119'779 → 11'695 · 156'259 → 18'104 · 238'339 → 33'741

</details>

<details><summary>AI — Appenzell</summary>

- **ledig, 0 Kinder:** 13'940 → 353 · 19'311 → 684 · 23'971 → 1'091 · 26'187 → 1'314 · 30'597 → 1'783 · 41'623 → 3'049 · 74'343 → 7'100 · 126'501 → 14'421 · 183'459 → 21'904 · 265'539 → 32'029
- **ledig, 1 Kind:** 6'440 → 9 · 11'811 → 82 · 18'687 → 269 · 25'303 → 559 · 31'917 → 945 · 34'123 → 1'110 · 38'533 → 1'441 · 45'147 → 2'011 · 53'967 → 2'891 · 62'565 → 3'838 · 77'673 → 5'692 · 139'479 → 13'813 · 258'039 → 29'963
- **ledig, 2 Kinder:** 1'269 → 0 · 6'640 → 16 · 11'187 → 79 · 17'803 → 261 · 24'417 → 540 · 31'033 → 928 · 37'647 → 1'408 · 46'467 → 2'188 · 52'927 → 2'848 · 59'343 → 3'564 · 76'698 → 5'709 · 150'219 → 15'335 · 250'539 → 29'059
- **ledig, 3 Kinder:** 1'471 → 0 · 8'097 → 13 · 12'507 → 76 · 19'123 → 255 · 25'737 → 531 · 32'353 → 912 · 38'967 → 1'390 · 43'287 → 1'769 · 47'565 → 2'161 · 51'843 → 2'608 · 62'673 → 3'844 · 77'899 → 5'757 · 142'719 → 14'210 · 243'039 → 27'883
- **verheiratet, 0 Kinder:** 8'290 → 58 · 10'619 → 92 · 16'940 → 250 · 23'693 → 531 · 30'307 → 912 · 36'923 → 1'390 · 45'743 → 2'166 · 50'153 → 2'614 · 61'087 → 3'776 · 76'122 → 5'595 · 142'279 → 14'288 · 260'839 → 30'466
- **verheiratet, 1 Kind:** 790 → 0 · 3'119 → 0 · 7'111 → 37 · 11'771 → 117 · 16'193 → 245 · 22'807 → 520 · 29'423 → 891 · 36'037 → 1'368 · 44'857 → 2'140 · 53'587 → 3'023 · 62'143 → 3'989 · 77'323 → 5'887 · 134'779 → 13'435 · 253'339 → 29'564
- **verheiratet, 2 Kinder:** 1'940 → 0 · 4'271 → 3 · 10'897 → 109 · 17'513 → 312 · 21'923 → 504 · 28'537 → 876 · 35'153 → 1'341 · 43'949 → 2'103 · 52'505 → 2'994 · 58'946 → 3'730 · 76'348 → 5'904 · 136'399 → 13'761 · 245'839 → 28'660
- **verheiratet, 3 Kinder:** 1'193 → 0 · 5'603 → 0 · 12'217 → 103 · 18'833 → 302 · 23'243 → 494 · 29'857 → 863 · 34'267 → 1'170 · 38'587 → 1'500 · 42'865 → 1'883 · 47'143 → 2'294 · 51'446 → 2'763 · 57'973 → 3'518 · 73'199 → 5'401 · 138'019 → 13'838 · 238'339 → 27'484

</details>

<details><summary>AR — Herisau</summary>

- **ledig, 0 Kinder:** 13'940 → 411 · 16'269 → 669 · 19'311 → 962 · 28'393 → 2'161 · 41'623 → 4'321 · 57'057 → 7'054 · 80'822 → 11'773 · 265'539 → 51'212
- **ledig, 1 Kind:** 6'440 → 0 · 18'687 → 0 · 20'893 → 70 · 23'097 → 211 · 25'303 → 408 · 29'713 → 873 · 38'533 → 1'980 · 53'967 → 4'142 · 68'982 → 6'657 · 88'548 → 10'364 · 157'719 → 24'687 · 258'039 → 46'066
- **ledig, 2 Kinder:** 1'269 → 0 · 20'007 → 7 · 22'213 → 98 · 24'417 → 244 · 26'623 → 450 · 31'033 → 924 · 39'853 → 2'034 · 55'065 → 4'198 · 70'173 → 6'738 · 89'749 → 10'475 · 159'339 → 24'833 · 250'539 → 44'263
- **ledig, 3 Kinder:** 1'471 → 0 · 19'123 → 0 · 21'327 → 22 · 23'533 → 124 · 25'737 → 271 · 30'147 → 720 · 32'353 → 974 · 41'149 → 2'090 · 56'146 → 4'280 · 69'198 → 6'462 · 90'950 → 10'586 · 160'959 → 24'978 · 243'039 → 42'460
- **verheiratet, 0 Kinder:** 8'290 → 0 · 14'611 → 0 · 16'940 → 33 · 19'271 → 151 · 21'487 → 305 · 25'897 → 760 · 32'513 → 1'590 · 36'923 → 2'160 · 52'357 → 4'346 · 65'365 → 6'494 · 84'823 → 10'179 · 151'399 → 23'963 · 260'839 → 47'289
- **verheiratet, 1 Kind:** 790 → 0 · 16'193 → 0 · 18'397 → 52 · 20'603 → 184 · 22'807 → 357 · 27'217 → 812 · 36'037 → 1'917 · 51'449 → 4'072 · 66'446 → 6'575 · 86'024 → 10'290 · 153'019 → 24'128 · 253'339 → 45'486
- **verheiratet, 2 Kinder:** 1'940 → 0 · 17'513 → 0 · 19'717 → 70 · 21'923 → 211 · 24'127 → 399 · 28'537 → 861 · 37'357 → 1'967 · 39'563 → 2'272 · 52'505 → 4'128 · 67'647 → 6'673 · 85'049 → 9'976 · 154'639 → 24'274 · 245'839 → 43'684
- **verheiratet, 3 Kinder:** 1'193 → 0 · 18'833 → 4 · 21'037 → 91 · 23'243 → 238 · 25'447 → 440 · 29'857 → 911 · 38'587 → 2'020 · 53'622 → 4'198 · 68'848 → 6'757 · 88'426 → 10'494 · 156'259 → 24'418 · 238'339 → 41'881

</details>

<details><summary>BE — Bern</summary>

- **ledig, 0 Kinder:** 13'940 → 408 · 16'269 → 710 · 19'311 → 1'243 · 26'187 → 2'372 · 65'787 → 10'335 · 89'523 → 15'636 · 104'749 → 19'338 · 165'219 → 35'043 · 265'539 → 62'830
- **ledig, 1 Kind:** 6'440 → 0 · 11'811 → 0 · 14'140 → 84 · 18'687 → 417 · 20'893 → 657 · 23'097 → 940 · 29'713 → 1'804 · 31'917 → 2'216 · 56'149 → 6'518 · 71'146 → 9'103 · 95'074 → 13'763 · 119'001 → 18'937 · 157'719 → 28'082 · 258'039 → 54'383
- **ledig, 2 Kinder:** 1'269 → 0 · 15'597 → 0 · 17'803 → 105 · 22'213 → 425 · 24'417 → 669 · 31'033 → 1'519 · 33'237 → 1'853 · 46'467 → 4'177 · 57'205 → 6'175 · 72'347 → 8'818 · 98'450 → 13'879 · 122'859 → 19'177 · 159'339 → 27'773 · 250'539 → 51'617
- **ledig, 3 Kinder:** 1'471 → 0 · 19'123 → 0 · 21'327 → 112 · 25'737 → 432 · 27'943 → 683 · 34'557 → 1'545 · 36'763 → 1'870 · 43'287 → 3'023 · 73'548 → 8'543 · 101'827 → 13'976 · 124'479 → 18'915 · 160'959 → 27'490 · 243'039 → 48'894
- **verheiratet, 0 Kinder:** 8'290 → 0 · 10'619 → 0 · 14'611 → 238 · 16'940 → 410 · 19'271 → 657 · 25'897 → 1'506 · 28'103 → 1'820 · 32'513 → 2'545 · 36'923 → 3'369 · 45'743 → 5'095 · 67'505 → 8'852 · 93'524 → 13'879 · 115'276 → 18'587 · 151'399 → 27'001 · 260'839 → 55'726
- **verheiratet, 1 Kind:** 790 → 0 · 11'771 → 0 · 13'987 → 42 · 18'397 → 358 · 20'603 → 567 · 29'423 → 1'700 · 33'833 → 2'413 · 42'653 → 4'061 · 44'857 → 4'529 · 51'449 → 5'815 · 68'622 → 8'783 · 94'725 → 13'821 · 125'659 → 20'566 · 153'019 → 27'052 · 253'339 → 53'309
- **verheiratet, 2 Kinder:** 1'940 → 0 · 15'307 → 0 · 21'923 → 469 · 30'743 → 1'596 · 32'947 → 1'920 · 35'153 → 2'281 · 46'087 → 4'325 · 50'365 → 5'215 · 56'782 → 6'467 · 71'998 → 9'103 · 95'926 → 13'763 · 127'279 → 20'589 · 154'639 → 27'078 · 245'839 → 50'902
- **verheiratet, 3 Kinder:** 1'193 → 0 · 16'627 → 0 · 18'833 → 91 · 23'243 → 410 · 25'447 → 644 · 34'267 → 1'788 · 36'449 → 2'150 · 47'143 → 4'160 · 53'622 → 5'421 · 62'323 → 7'171 · 73'199 → 9'045 · 97'127 → 13'704 · 119'779 → 18'587 · 156'259 → 27'104 · 238'339 → 48'524

</details>

<details><summary>BL — Liestal</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 16'269 → 277 · 19'311 → 485 · 21'640 → 749 · 23'971 → 1'048 · 26'187 → 1'361 · 28'393 → 1'701 · 30'597 → 2'063 · 35'007 → 2'855 · 39'417 → 3'726 · 48'237 → 5'655 · 61'467 → 8'772 · 76'482 → 12'659 · 102'574 → 19'933 · 265'539 → 67'888
- **ledig, 1 Kind:** 6'440 → 0 · 34'123 → 0 · 36'327 → 117 · 40'737 → 665 · 45'147 → 1'271 · 49'557 → 1'931 · 53'967 → 2'640 · 58'287 → 3'397 · 64'705 → 4'610 · 75'497 → 6'849 · 95'074 → 11'348 · 130'359 → 20'069 · 175'959 → 32'030 · 258'039 → 55'237
- **ledig, 2 Kinder:** 1'269 → 0 · 37'647 → 0 · 39'853 → 290 · 42'057 → 624 · 46'467 → 1'328 · 50'787 → 2'080 · 55'065 → 2'875 · 61'482 → 4'143 · 70'173 → 5'993 · 87'574 → 10'007 · 122'859 → 18'718 · 168'459 → 30'669 · 250'539 → 53'870
- **ledig, 3 Kinder:** 1'471 → 0 · 34'557 → 0 · 38'967 → 17 · 41'149 → 385 · 45'427 → 1'154 · 49'705 → 1'965 · 56'146 → 3'262 · 64'847 → 5'142 · 82'249 → 9'184 · 115'359 → 17'366 · 160'959 → 29'309 · 243'039 → 52'503
- **verheiratet, 0 Kinder:** 8'290 → 0 · 10'619 → 0 · 14'611 → 150 · 28'103 → 259 · 30'307 → 335 · 34'717 → 719 · 39'127 → 1'178 · 43'537 → 1'703 · 47'947 → 2'289 · 52'357 → 2'930 · 58'949 → 3'988 · 67'505 → 5'556 · 78'297 → 7'760 · 95'699 → 11'715 · 133'159 → 20'916 · 178'759 → 32'845 · 260'839 → 56'029
- **verheiratet, 1 Kind:** 790 → 0 · 31'627 → 0 · 33'833 → 142 · 38'243 → 692 · 42'653 → 1'300 · 47'063 → 1'963 · 51'449 → 2'675 · 55'727 → 3'433 · 64'282 → 5'075 · 72'973 → 6'900 · 90'374 → 10'888 · 125'659 → 19'566 · 171'259 → 31'487 · 253'339 → 54'661
- **verheiratet, 2 Kinder:** 1'940 → 0 · 35'153 → 0 · 39'563 → 655 · 43'949 → 1'363 · 48'227 → 2'116 · 52'505 → 2'913 · 58'946 → 4'189 · 67'647 → 6'044 · 85'049 → 10'063 · 118'159 → 18'216 · 163'759 → 30'127 · 245'839 → 53'295
- **verheiratet, 3 Kinder:** 1'193 → 0 · 34'267 → 0 · 36'449 → 51 · 40'727 → 800 · 47'143 → 2'003 · 53'622 → 3'310 · 62'323 → 5'196 · 79'725 → 9'240 · 119'779 → 19'170 · 156'259 → 28'768 · 238'339 → 51'927

</details>

<details><summary>BS — Basel</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 23'971 → 0 · 26'187 → 420 · 37'213 → 2'752 · 57'057 → 6'910 · 98'224 → 15'792 · 238'179 → 45'578 · 265'539 → 53'046
- **ledig, 1 Kind:** 6'440 → 0 · 38'533 → 0 · 40'737 → 420 · 53'967 → 3'192 · 105'950 → 14'448 · 258'039 → 46'474
- **ledig, 2 Kinder:** 1'269 → 0 · 39'853 → 0 · 42'057 → 378 · 46'467 → 1'302 · 98'450 → 12'558 · 250'539 → 44'584
- **ledig, 3 Kinder:** 1'471 → 0 · 41'149 → 0 · 43'287 → 336 · 60'497 → 4'074 · 97'476 → 12'076 · 243'039 → 42'694
- **verheiratet, 0 Kinder:** 8'290 → 0 · 41'333 → 0 · 43'537 → 294 · 56'767 → 3'066 · 108'750 → 14'322 · 260'839 → 46'348
- **verheiratet, 1 Kind:** 790 → 0 · 42'653 → 0 · 44'857 → 252 · 51'449 → 1'638 · 103'426 → 12'894 · 253'339 → 44'458
- **verheiratet, 2 Kinder:** 1'940 → 0 · 43'949 → 0 · 46'087 → 210 · 63'297 → 3'948 · 100'276 → 11'950 · 245'839 → 42'568
- **verheiratet, 3 Kinder:** 1'193 → 0 · 45'005 → 0 · 47'143 → 168 · 49'282 → 652 · 51'446 → 1'114 · 92'776 → 10'060 · 238'339 → 40'678

</details>

<details><summary>FR — Fribourg</summary>

- **ledig, 0 Kinder:** 13'940 → 236 · 16'269 → 420 · 19'311 → 624 · 21'640 → 893 · 28'393 → 1'973 · 30'597 → 2'369 · 32'803 → 2'799 · 41'623 → 4'729 · 63'649 → 9'521 · 100'399 → 18'387 · 126'501 → 25'161 · 210'819 → 49'421 · 265'539 → 62'418
- **ledig, 1 Kind:** 6'440 → 0 · 14'140 → 0 · 16'471 → 110 · 20'893 → 202 · 23'097 → 330 · 25'303 → 489 · 27'507 → 679 · 29'713 → 900 · 34'123 → 1'456 · 36'327 → 1'771 · 38'533 → 2'118 · 42'943 → 2'851 · 51'763 → 4'136 · 58'287 → 5'159 · 84'198 → 10'175 · 105'950 → 14'821 · 130'359 → 20'233 · 203'319 → 37'907 · 258'039 → 52'248
- **ledig, 2 Kinder:** 1'269 → 0 · 15'597 → 0 · 17'803 → 108 · 22'213 → 220 · 24'417 → 352 · 28'827 → 727 · 31'033 → 955 · 33'237 → 1'214 · 35'443 → 1'503 · 37'647 → 1'849 · 42'057 → 2'510 · 48'649 → 3'357 · 52'927 → 3'960 · 59'343 → 4'946 · 63'646 → 5'702 · 70'173 → 7'141 · 91'925 → 11'619 · 122'859 → 18'311 · 195'819 → 35'829 · 250'539 → 49'969
- **ledig, 3 Kinder:** 1'471 → 0 · 16'917 → 0 · 19'123 → 97 · 23'533 → 202 · 25'737 → 330 · 27'943 → 489 · 30'147 → 679 · 34'557 → 1'141 · 36'763 → 1'388 · 41'149 → 1'914 · 45'427 → 2'526 · 49'705 → 3'067 · 56'146 → 3'945 · 64'847 → 5'309 · 67'023 → 5'737 · 82'249 → 9'264 · 86'600 → 10'135 · 124'479 → 18'288 · 188'319 → 33'552 · 243'039 → 47'460
- **verheiratet, 0 Kinder:** 8'290 → 0 · 10'619 → 0 · 19'271 → 229 · 21'487 → 341 · 25'897 → 632 · 30'307 → 1'091 · 34'717 → 1'672 · 36'923 → 2'049 · 43'537 → 3'093 · 54'563 → 4'946 · 78'297 → 9'185 · 113'101 → 16'537 · 178'759 → 32'111 · 260'839 → 53'301
- **verheiratet, 1 Kind:** 790 → 0 · 13'987 → 0 · 16'193 → 108 · 20'603 → 185 · 22'807 → 319 · 25'013 → 475 · 27'217 → 663 · 29'423 → 891 · 33'833 → 1'445 · 36'037 → 1'760 · 38'243 → 2'105 · 42'653 → 2'838 · 53'587 → 4'424 · 60'005 → 5'478 · 70'797 → 7'594 · 88'199 → 11'022 · 125'659 → 19'180 · 198'619 → 36'749 · 253'339 → 51'007
- **verheiratet, 2 Kinder:** 1'940 → 0 · 15'307 → 0 · 17'513 → 104 · 21'923 → 215 · 24'127 → 347 · 28'537 → 719 · 30'743 → 946 · 32'947 → 1'203 · 35'153 → 1'491 · 37'357 → 1'836 · 41'767 → 2'495 · 46'087 → 3'041 · 50'365 → 3'617 · 56'782 → 4'563 · 63'297 → 5'667 · 76'348 → 8'484 · 85'049 → 10'216 · 127'279 → 19'365 · 191'119 → 34'696 · 245'839 → 48'749
- **verheiratet, 3 Kinder:** 1'193 → 0 · 16'627 → 0 · 18'833 → 95 · 23'243 → 198 · 25'447 → 324 · 27'653 → 482 · 29'857 → 671 · 34'267 → 1'131 · 38'587 → 1'610 · 55'797 → 3'916 · 64'498 → 5'275 · 66'674 → 5'702 · 75'374 → 7'683 · 79'725 → 8'765 · 88'426 → 10'543 · 128'899 → 19'319 · 183'619 → 32'445 · 238'339 → 46'264

</details>

<details><summary>GE — Genève</summary>

- **ledig, 0 Kinder:** 13'940 → 25 · 19'311 → 25 · 21'640 → 207 · 23'971 → 498 · 26'187 → 807 · 28'393 → 1'146 · 30'597 → 1'517 · 35'007 → 2'331 · 41'623 → 3'598 · 46'033 → 4'525 · 57'057 → 6'981 · 78'646 → 12'119 · 156'099 → 32'264 · 265'539 → 62'446
- **ledig, 1 Kind:** 6'440 → 25 · 47'353 → 30 · 53'967 → 873 · 56'149 → 1'175 · 60'427 → 1'830 · 64'705 → 2'552 · 68'982 → 3'343 · 84'198 → 6'394 · 92'899 → 8'273 · 157'719 → 23'429 · 258'039 → 48'441
- **ledig, 2 Kinder:** 1'269 → 25 · 52'927 → 25 · 55'065 → 91 · 61'482 → 943 · 65'822 → 1'580 · 70'173 → 2'292 · 74'523 → 3'072 · 89'749 → 6'106 · 98'450 → 7'961 · 168'459 → 24'207 · 250'539 → 44'712
- **ledig, 3 Kinder:** 1'471 → 25 · 60'497 → 25 · 62'673 → 179 · 69'198 → 1'048 · 73'548 → 1'700 · 77'899 → 2'423 · 82'249 → 3'217 · 86'600 → 4'079 · 99'651 → 6'713 · 115'359 → 10'159 · 179'199 → 25'001 · 243'039 → 40'983
- **verheiratet, 0 Kinder:** 8'290 → 25 · 39'127 → 25 · 41'333 → 259 · 47'947 → 1'094 · 52'357 → 1'719 · 56'767 → 2'431 · 61'087 → 3'210 · 65'365 → 4'058 · 78'297 → 6'667 · 86'998 → 8'570 · 151'399 → 23'712 · 260'839 → 51'111
- **verheiratet, 1 Kind:** 790 → 25 · 47'063 → 25 · 49'267 → 286 · 51'449 → 571 · 55'727 → 1'153 · 60'005 → 1'805 · 64'282 → 2'525 · 68'622 → 3'326 · 83'848 → 6'379 · 92'549 → 8'257 · 162'139 → 24'490 · 253'339 → 47'300
- **verheiratet, 2 Kinder:** 1'940 → 25 · 52'505 → 25 · 54'643 → 71 · 61'122 → 932 · 65'473 → 1'570 · 69'823 → 2'280 · 74'174 → 3'060 · 89'400 → 6'091 · 98'101 → 7'943 · 163'759 → 23'145 · 245'839 → 43'570
- **verheiratet, 3 Kinder:** 1'193 → 25 · 60'147 → 25 · 62'323 → 169 · 68'848 → 1'037 · 73'199 → 1'688 · 77'549 → 2'409 · 81'900 → 3'202 · 86'250 → 4'064 · 99'301 → 6'698 · 110'659 → 9'129 · 174'499 → 23'923 · 238'339 → 39'841

</details>

<details><summary>GL — Glarus</summary>

- **ledig, 0 Kinder:** 13'940 → 164 · 16'269 → 396 · 19'311 → 744 · 21'640 → 966 · 23'971 → 1'260 · 30'597 → 2'137 · 32'803 → 2'456 · 52'647 → 5'563 · 98'224 → 13'811 · 156'099 → 24'898 · 265'539 → 48'141
- **ledig, 1 Kind:** 6'440 → 0 · 18'687 → 0 · 20'893 → 115 · 25'303 → 558 · 36'327 → 1'615 · 38'533 → 1'878 · 53'967 → 3'929 · 88'548 → 9'339 · 166'839 → 23'489 · 258'039 → 40'972
- **ledig, 2 Kinder:** 1'269 → 0 · 20'007 → 0 · 22'213 → 182 · 37'647 → 1'676 · 55'065 → 3'979 · 89'749 → 9'418 · 168'459 → 23'651 · 250'539 → 39'390
- **ledig, 3 Kinder:** 1'471 → 0 · 19'123 → 0 · 21'327 → 33 · 34'557 → 1'304 · 38'967 → 1'743 · 56'146 → 4'042 · 90'950 → 9'497 · 170'079 → 23'818 · 243'039 → 37'807
- **verheiratet, 0 Kinder:** 8'290 → 0 · 16'940 → 0 · 19'271 → 182 · 30'307 → 1'264 · 34'717 → 1'682 · 52'357 → 4'021 · 86'998 → 9'448 · 169'639 → 24'413 · 260'839 → 41'956
- **verheiratet, 1 Kind:** 790 → 0 · 16'193 → 0 · 18'397 → 33 · 31'627 → 1'317 · 36'037 → 1'761 · 53'587 → 4'100 · 88'199 → 9'527 · 171'259 → 24'575 · 253'339 → 40'375
- **verheiratet, 2 Kinder:** 1'940 → 0 · 17'513 → 0 · 19'717 → 99 · 35'153 → 1'593 · 37'357 → 1'834 · 54'643 → 4'159 · 89'400 → 9'638 · 163'759 → 23'091 · 245'839 → 38'792
- **verheiratet, 3 Kinder:** 1'193 → 0 · 18'833 → 0 · 21'037 → 149 · 36'449 → 1'646 · 38'587 → 1'902 · 42'865 → 2'483 · 49'282 → 3'326 · 55'797 → 4'230 · 88'426 → 9'358 · 165'379 → 23'252 · 238'339 → 37'210

</details>

<details><summary>GR — Chur</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 19'311 → 0 · 21'640 → 74 · 23'971 → 255 · 26'187 → 481 · 28'393 → 732 · 32'803 → 1'353 · 37'213 → 2'007 · 41'623 → 2'700 · 48'237 → 3'812 · 61'467 → 6'265 · 91'698 → 12'158 · 265'539 → 47'320
- **ledig, 1 Kind:** 6'440 → 0 · 42'943 → 0 · 45'147 → 78 · 47'353 → 229 · 49'557 → 424 · 51'763 → 661 · 53'967 → 921 · 58'287 → 1'485 · 68'982 → 3'074 · 79'847 → 4'797 · 92'899 → 7'041 · 185'079 → 24'560 · 258'039 → 38'978
- **ledig, 2 Kinder:** 1'269 → 0 · 35'443 → 0 · 50'787 → 12 · 52'927 → 123 · 55'065 → 291 · 57'205 → 502 · 59'343 → 747 · 63'646 → 1'295 · 65'822 → 1'601 · 76'698 → 3'216 · 87'574 → 4'958 · 100'626 → 7'212 · 177'579 → 21'739 · 250'539 → 36'014
- **ledig, 3 Kinder:** 1'471 → 0 · 56'146 → 0 · 58'322 → 49 · 60'497 → 183 · 62'673 → 370 · 64'847 → 601 · 67'023 → 859 · 71'374 → 1'422 · 82'249 → 3'036 · 90'950 → 4'398 · 104'001 → 6'615 · 142'719 → 13'748 · 243'039 → 33'050
- **verheiratet, 0 Kinder:** 8'290 → 0 · 34'717 → 0 · 36'923 → 41 · 39'127 → 168 · 41'333 → 348 · 43'537 → 569 · 45'743 → 820 · 50'153 → 1'371 · 61'087 → 2'952 · 71'782 → 4'631 · 84'823 → 6'865 · 187'879 → 26'521 · 260'839 → 41'030
- **verheiratet, 1 Kind:** 790 → 0 · 42'653 → 0 · 44'857 → 70 · 47'063 → 215 · 49'267 → 407 · 51'449 → 640 · 53'587 → 898 · 57'865 → 1'458 · 66'446 → 2'732 · 75'147 → 4'075 · 83'848 → 5'505 · 94'725 → 7'419 · 189'499 → 25'431 · 253'339 → 38'050
- **verheiratet, 2 Kinder:** 1'940 → 0 · 50'365 → 4 · 52'505 → 109 · 54'643 → 274 · 56'782 → 481 · 58'946 → 728 · 61'122 → 998 · 65'473 → 1'585 · 76'348 → 3'199 · 85'049 → 4'576 · 98'101 → 6'809 · 163'759 → 19'121 · 245'839 → 35'086
- **verheiratet, 3 Kinder:** 1'193 → 0 · 55'797 → 0 · 57'973 → 43 · 60'147 → 174 · 62'323 → 360 · 64'498 → 588 · 66'674 → 845 · 71'024 → 1'407 · 84'075 → 3'351 · 94'951 → 5'101 · 110'659 → 7'822 · 138'019 → 12'895 · 238'339 → 32'123

</details>

<details><summary>JU — Delémont</summary>

- **ledig, 0 Kinder:** 13'940 → 158 · 16'269 → 309 · 19'311 → 547 · 21'640 → 827 · 30'597 → 2'158 · 35'007 → 2'865 · 48'237 → 5'391 · 57'057 → 7'117 · 93'874 → 15'931 · 174'339 → 37'343 · 265'539 → 62'043
- **ledig, 1 Kind:** 6'440 → 0 · 14'140 → 0 · 18'687 → 17 · 23'097 → 200 · 25'303 → 345 · 31'917 → 1'057 · 34'123 → 1'323 · 53'967 → 4'372 · 95'074 → 12'650 · 108'126 → 15'710 · 203'319 → 37'352 · 258'039 → 52'027
- **ledig, 2 Kinder:** 1'269 → 0 · 6'640 → 0 · 17'803 → 13 · 22'213 → 197 · 24'417 → 335 · 33'237 → 1'292 · 35'443 → 1'647 · 52'927 → 4'357 · 91'925 → 12'220 · 100'626 → 14'191 · 204'939 → 37'896 · 250'539 → 50'187
- **ledig, 3 Kinder:** 1'471 → 0 · 8'097 → 0 · 19'123 → 13 · 23'533 → 197 · 25'737 → 335 · 34'557 → 1'292 · 53'982 → 4'357 · 93'126 → 12'239 · 206'559 → 37'964 · 243'039 → 47'806
- **verheiratet, 0 Kinder:** 8'290 → 0 · 19'271 → 0 · 21'487 → 80 · 25'897 → 280 · 34'717 → 1'229 · 36'923 → 1'554 · 54'563 → 4'265 · 56'767 → 4'662 · 95'699 → 12'513 · 108'750 → 15'551 · 206'119 → 37'715 · 260'839 → 52'433
- **verheiratet, 1 Kind:** 790 → 0 · 18'397 → 0 · 20'603 → 75 · 25'013 → 270 · 33'833 → 1'218 · 36'037 → 1'538 · 53'587 → 4'249 · 55'727 → 4'642 · 92'549 → 12'082 · 101'250 → 14'033 · 207'739 → 38'280 · 253'339 → 50'620
- **verheiratet, 2 Kinder:** 1'940 → 0 · 17'513 → 0 · 19'717 → 71 · 24'127 → 255 · 32'947 → 1'208 · 35'153 → 1'523 · 39'563 → 2'201 · 52'505 → 4'233 · 54'643 → 4'623 · 93'750 → 12'513 · 209'359 → 38'930 · 245'839 → 48'807
- **verheiratet, 3 Kinder:** 1'193 → 0 · 18'833 → 0 · 21'037 → 71 · 25'447 → 255 · 34'267 → 1'208 · 36'449 → 1'523 · 51'446 → 3'895 · 55'797 → 4'642 · 92'776 → 12'102 · 201'859 → 36'808 · 238'339 → 46'399

</details>

<details><summary>LU — Luzern</summary>

- **ledig, 0 Kinder:** 13'940 → 50 · 16'269 → 64 · 19'311 → 134 · 21'640 → 248 · 23'971 → 514 · 26'187 → 818 · 30'597 → 1'510 · 50'443 → 4'788 · 102'574 → 12'356 · 174'339 → 23'296 · 265'539 → 38'492
- **ledig, 1 Kind:** 6'440 → 50 · 29'713 → 50 · 34'123 → 122 · 36'327 → 292 · 38'533 → 524 · 40'737 → 778 · 42'943 → 1'084 · 45'147 → 1'424 · 73'322 → 5'612 · 101'600 → 9'332 · 139'479 → 14'788 · 157'719 → 17'666 · 258'039 → 34'488
- **ledig, 2 Kinder:** 1'269 → 50 · 26'623 → 50 · 33'237 → 64 · 35'443 → 102 · 37'647 → 226 · 39'853 → 442 · 42'057 → 696 · 44'263 → 980 · 67'997 → 4'502 · 104'976 → 9'332 · 131'979 → 13'222 · 159'339 → 17'394 · 250'539 → 32'672
- **ledig, 3 Kinder:** 1'471 → 50 · 34'557 → 52 · 36'763 → 90 · 38'967 → 160 · 41'149 → 362 · 45'427 → 848 · 60'497 → 3'094 · 106'239 → 9'070 · 133'599 → 12'976 · 160'959 → 17'124 · 243'039 → 30'854
- **verheiratet, 0 Kinder:** 8'290 → 50 · 25'897 → 50 · 28'103 → 84 · 30'307 → 140 · 32'513 → 326 · 36'923 → 818 · 78'297 → 6'970 · 95'699 → 9'254 · 124'039 → 13'338 · 151'399 → 17'506 · 260'839 → 35'868
- **verheiratet, 1 Kind:** 790 → 50 · 27'217 → 50 · 31'627 → 106 · 33'833 → 258 · 36'037 → 484 · 38'243 → 738 · 40'447 → 1'032 · 70'797 → 5'546 · 99'075 → 9'266 · 134'779 → 14'410 · 153'019 → 17'252 · 253'339 → 34'050
- **verheiratet, 2 Kinder:** 1'940 → 50 · 30'743 → 58 · 32'947 → 94 · 35'153 → 190 · 37'357 → 396 · 39'563 → 646 · 41'767 → 928 · 43'949 → 1'240 · 65'473 → 4'450 · 100'276 → 8'992 · 127'279 → 12'844 · 154'639 → 16'980 · 245'839 → 32'234
- **verheiratet, 3 Kinder:** 1'193 → 50 · 32'063 → 50 · 36'449 → 136 · 38'587 → 318 · 40'727 → 544 · 42'865 → 798 · 45'005 → 1'096 · 57'973 → 3'028 · 110'659 → 9'960 · 138'019 → 13'932 · 156'259 → 16'710 · 238'339 → 30'418

</details>

<details><summary>NE — Neuchâtel</summary>

- **ledig, 0 Kinder:** 13'940 → 178 · 16'269 → 351 · 19'311 → 636 · 21'640 → 980 · 23'971 → 1'358 · 26'187 → 1'879 · 39'417 → 5'111 · 65'787 → 11'413 · 91'698 → 18'097 · 128'739 → 28'400 · 201'699 → 49'985 · 265'539 → 66'383
- **ledig, 1 Kind:** 6'440 → 0 · 11'811 → 0 · 18'687 → 15 · 23'097 → 89 · 25'303 → 247 · 29'713 → 620 · 31'917 → 853 · 34'123 → 1'225 · 36'327 → 1'574 · 40'737 → 2'286 · 45'147 → 3'217 · 68'982 → 8'445 · 97'249 → 14'877 · 139'479 → 25'152 · 185'079 → 37'152 · 258'039 → 57'617
- **ledig, 2 Kinder:** 1'269 → 0 · 17'803 → 12 · 22'213 → 89 · 26'623 → 217 · 28'827 → 393 · 31'033 → 595 · 33'237 → 937 · 35'443 → 1'258 · 39'853 → 1'920 · 42'057 → 2'346 · 67'997 → 8'026 · 96'275 → 14'450 · 131'979 → 23'086 · 177'579 → 34'926 · 250'539 → 55'256
- **ledig, 3 Kinder:** 1'471 → 0 · 16'917 → 10 · 21'327 → 79 · 30'147 → 308 · 32'353 → 595 · 38'967 → 1'579 · 41'149 → 1'970 · 62'673 → 6'636 · 88'775 → 12'523 · 124'479 → 21'020 · 170'079 → 32'733 · 243'039 → 52'893
- **verheiratet, 0 Kinder:** 8'290 → 0 · 16'940 → 0 · 21'487 → 160 · 23'693 → 302 · 28'103 → 634 · 32'513 → 995 · 34'717 → 1'337 · 36'923 → 1'658 · 41'333 → 2'320 · 47'947 → 4'004 · 58'949 → 6'886 · 71'782 → 9'790 · 95'699 → 15'244 · 133'159 → 24'355 · 178'759 → 36'265 · 260'839 → 59'300
- **verheiratet, 1 Kind:** 790 → 0 · 11'771 → 0 · 18'397 → 15 · 22'807 → 84 · 25'013 → 204 · 31'627 → 696 · 33'833 → 995 · 36'037 → 1'404 · 40'447 → 2'184 · 44'857 → 3'302 · 47'063 → 3'923 · 51'449 → 5'051 · 64'282 → 7'919 · 94'725 → 14'832 · 134'779 → 24'550 · 180'379 → 36'495 · 253'339 → 56'931
- **verheiratet, 2 Kinder:** 1'940 → 0 · 17'513 → 5 · 21'923 → 62 · 26'333 → 173 · 28'537 → 307 · 30'743 → 507 · 32'947 → 858 · 37'357 → 1'638 · 39'563 → 2'092 · 43'949 → 3'222 · 46'087 → 3'723 · 63'297 → 7'480 · 91'575 → 13'905 · 127'279 → 22'483 · 172'879 → 34'282 · 245'839 → 54'570
- **verheiratet, 3 Kinder:** 1'193 → 0 · 16'627 → 0 · 21'037 → 57 · 29'857 → 325 · 34'267 → 1'141 · 38'587 → 1'892 · 53'622 → 5'184 · 55'797 → 5'620 · 84'075 → 11'979 · 119'779 → 20'415 · 165'379 → 32'088 · 238'339 → 52'209

</details>

<details><summary>NW — Stans</summary>

- **ledig, 0 Kinder:** 13'940 → 159 · 16'269 → 296 · 19'311 → 536 · 21'640 → 765 · 23'971 → 1'035 · 30'597 → 1'907 · 46'033 → 4'012 · 70'065 → 7'412 · 117'801 → 14'544 · 165'219 → 22'051 · 265'539 → 35'835
- **ledig, 1 Kind:** 6'440 → 50 · 23'097 → 50 · 25'303 → 78 · 29'713 → 198 · 31'917 → 314 · 36'327 → 588 · 38'533 → 767 · 42'943 → 1'156 · 47'353 → 1'640 · 53'967 → 2'490 · 62'565 → 3'646 · 90'724 → 7'604 · 148'599 → 16'043 · 258'039 → 33'029
- **ledig, 2 Kinder:** 1'269 → 50 · 26'623 → 50 · 31'033 → 133 · 33'237 → 207 · 37'647 → 455 · 39'853 → 615 · 44'263 → 971 · 46'467 → 1'192 · 50'787 → 1'659 · 52'927 → 1'924 · 67'997 → 3'980 · 98'450 → 8'268 · 150'219 → 15'878 · 250'539 → 31'393
- **ledig, 3 Kinder:** 1'471 → 50 · 30'147 → 50 · 34'557 → 138 · 36'763 → 225 · 41'149 → 468 · 45'427 → 786 · 49'705 → 1'194 · 51'843 → 1'422 · 56'146 → 1'949 · 71'374 → 4'035 · 104'001 → 8'634 · 151'839 → 15'696 · 243'039 → 29'755
- **verheiratet, 0 Kinder:** 8'290 → 50 · 16'940 → 50 · 19'271 → 78 · 23'693 → 198 · 25'897 → 314 · 30'307 → 588 · 32'513 → 767 · 36'923 → 1'156 · 41'333 → 1'640 · 43'537 → 1'920 · 58'949 → 3'954 · 84'823 → 7'596 · 151'399 → 17'293 · 260'839 → 34'360
- **verheiratet, 1 Kind:** 790 → 50 · 20'603 → 50 · 25'013 → 133 · 27'217 → 207 · 31'627 → 455 · 33'833 → 615 · 38'243 → 971 · 40'447 → 1'192 · 44'857 → 1'663 · 55'727 → 3'085 · 88'199 → 7'633 · 143'899 → 15'762 · 253'339 → 32'723
- **verheiratet, 2 Kinder:** 1'940 → 50 · 24'127 → 50 · 28'537 → 138 · 30'743 → 225 · 35'153 → 468 · 37'357 → 630 · 41'767 → 989 · 46'087 → 1'422 · 50'365 → 1'949 · 63'297 → 3'720 · 98'101 → 8'613 · 145'519 → 15'597 · 245'839 → 31'092
- **verheiratet, 3 Kinder:** 1'193 → 50 · 27'653 → 50 · 32'063 → 143 · 34'267 → 234 · 38'587 → 480 · 42'865 → 803 · 47'143 → 1'215 · 51'446 → 1'708 · 55'797 → 2'283 · 64'498 → 3'467 · 99'301 → 8'352 · 147'139 → 15'416 · 238'339 → 29'455

</details>

<details><summary>OW — Sarnen</summary>

- **ledig, 0 Kinder:** 13'940 → 51 · 48'237 → 4'876 · 265'539 → 32'712
- **ledig, 1 Kind:** 6'440 → 0 · 20'893 → 0 · 23'097 → 90 · 42'943 → 2'380 · 90'724 → 9'099 · 258'039 → 30'549
- **ledig, 2 Kinder:** 1'269 → 0 · 22'213 → 0 · 24'417 → 243 · 35'443 → 1'510 · 37'647 → 1'792 · 83'224 → 8'217 · 250'539 → 29'665
- **ledig, 3 Kinder:** 1'471 → 0 · 21'327 → 0 · 23'533 → 128 · 30'147 → 908 · 77'899 → 7'628 · 243'039 → 28'783
- **verheiratet, 0 Kinder:** 8'290 → 0 · 14'611 → 0 · 16'940 → 39 · 19'271 → 346 · 43'537 → 3'135 · 47'947 → 3'673 · 69'643 → 6'732 · 260'839 → 31'227
- **verheiratet, 1 Kind:** 790 → 0 · 18'397 → 0 · 20'603 → 166 · 40'447 → 2'457 · 86'024 → 8'882 · 253'339 → 30'344
- **verheiratet, 2 Kinder:** 1'940 → 0 · 17'513 → 0 · 19'717 → 51 · 32'947 → 1'575 · 80'699 → 8'293 · 245'839 → 29'461
- **verheiratet, 3 Kinder:** 1'193 → 0 · 18'833 → 0 · 21'037 → 192 · 25'447 → 704 · 27'653 → 985 · 29'857 → 1'306 · 75'374 → 7'705 · 238'339 → 28'578

</details>

<details><summary>SG — St. Gallen</summary>

- **ledig, 0 Kinder:** 13'940 → 68 · 16'269 → 292 · 19'311 → 627 · 21'640 → 962 · 35'007 → 2'916 · 37'213 → 3'305 · 61'467 → 8'009 · 109'100 → 19'009 · 265'539 → 54'849
- **ledig, 1 Kind:** 6'440 → 0 · 29'713 → 0 · 34'123 → 429 · 38'533 → 877 · 51'763 → 2'805 · 73'322 → 6'036 · 77'673 → 6'892 · 130'359 → 17'545 · 258'039 → 46'378
- **ledig, 2 Kinder:** 1'269 → 0 · 33'237 → 0 · 35'443 → 136 · 42'057 → 778 · 46'467 → 1'400 · 76'698 → 5'929 · 131'979 → 16'919 · 250'539 → 43'655
- **ledig, 3 Kinder:** 1'471 → 0 · 38'967 → 0 · 41'149 → 254 · 45'427 → 683 · 47'565 → 936 · 56'146 → 2'245 · 58'322 → 2'566 · 82'249 → 6'191 · 97'476 → 9'253 · 133'599 → 16'304 · 243'039 → 40'942
- **verheiratet, 0 Kinder:** 8'290 → 0 · 23'693 → 0 · 25'897 → 176 · 32'513 → 845 · 45'743 → 2'770 · 67'505 → 5'978 · 115'276 → 15'527 · 133'159 → 19'454 · 260'839 → 48'315
- **verheiratet, 1 Kind:** 790 → 0 · 27'217 → 0 · 29'423 → 97 · 36'037 → 741 · 38'243 → 1'023 · 53'587 → 3'273 · 72'973 → 6'230 · 125'659 → 16'785 · 253'339 → 45'601
- **verheiratet, 2 Kinder:** 1'940 → 0 · 32'947 → 0 · 35'153 → 233 · 39'563 → 661 · 41'767 → 904 · 76'348 → 6'105 · 89'400 → 8'720 · 127'279 → 16'188 · 245'839 → 42'879
- **verheiratet, 3 Kinder:** 1'193 → 0 · 36'449 → 0 · 38'587 → 137 · 45'005 → 780 · 47'143 → 1'083 · 49'282 → 1'428 · 79'725 → 5'987 · 92'776 → 8'593 · 128'899 → 15'643 · 138'019 → 17'589 · 238'339 → 40'165

</details>

<details><summary>SH — Schaffhausen</summary>

- **ledig, 0 Kinder:** 13'940 → 167 · 19'311 → 461 · 23'971 → 906 · 30'597 → 1'633 · 35'007 → 2'203 · 46'033 → 3'593 · 57'057 → 5'177 · 70'065 → 7'215 · 137'859 → 19'051 · 210'819 → 32'879 · 265'539 → 41'533
- **ledig, 1 Kind:** 6'440 → 60 · 23'097 → 69 · 25'303 → 154 · 27'507 → 272 · 29'713 → 412 · 34'123 → 763 · 45'147 → 1'805 · 47'353 → 2'054 · 71'146 → 4'713 · 88'548 → 6'903 · 110'301 → 10'027 · 139'479 → 14'690 · 258'039 → 35'421
- **ledig, 2 Kinder:** 1'269 → 60 · 22'213 → 60 · 24'417 → 100 · 26'623 → 190 · 28'827 → 311 · 33'237 → 629 · 44'263 → 1'669 · 52'927 → 2'585 · 59'343 → 3'200 · 74'523 → 4'880 · 89'749 → 6'805 · 111'501 → 9'923 · 141'099 → 14'644 · 250'539 → 33'774
- **ledig, 3 Kinder:** 1'471 → 60 · 23'533 → 60 · 25'737 → 124 · 30'147 → 355 · 34'557 → 700 · 53'982 → 2'510 · 62'673 → 3'355 · 75'724 → 4'800 · 90'950 → 6'731 · 115'359 → 10'205 · 142'719 → 14'587 · 243'039 → 32'132
- **verheiratet, 0 Kinder:** 8'290 → 60 · 19'271 → 60 · 21'487 → 93 · 23'693 → 166 · 25'897 → 263 · 28'103 → 401 · 32'513 → 750 · 43'537 → 1'794 · 56'767 → 3'296 · 63'227 → 4'158 · 69'643 → 4'874 · 84'823 → 6'798 · 106'575 → 9'895 · 133'159 → 14'083 · 260'839 → 36'419
- **verheiratet, 1 Kind:** 790 → 60 · 20'603 → 60 · 22'807 → 93 · 25'013 → 182 · 27'217 → 309 · 31'627 → 619 · 40'447 → 1'445 · 44'857 → 1'878 · 72'973 → 5'039 · 86'024 → 6'706 · 107'776 → 9'792 · 134'779 → 14'031 · 253'339 → 34'770
- **verheiratet, 2 Kinder:** 1'940 → 60 · 21'923 → 60 · 24'127 → 123 · 26'333 → 227 · 28'537 → 353 · 30'743 → 508 · 32'947 → 688 · 43'949 → 1'732 · 48'227 → 2'185 · 50'365 → 2'436 · 58'946 → 3'255 · 74'174 → 4'945 · 87'225 → 6'614 · 109'039 → 9'707 · 136'399 → 13'989 · 245'839 → 33'130
- **verheiratet, 3 Kinder:** 1'193 → 60 · 23'243 → 69 · 25'447 → 154 · 29'857 → 399 · 32'063 → 570 · 34'267 → 763 · 42'865 → 1'581 · 47'143 → 1'947 · 53'622 → 2'567 · 62'323 → 3'420 · 75'374 → 4'874 · 90'601 → 6'805 · 110'659 → 9'661 · 138'019 → 13'958 · 238'339 → 31'482

</details>

<details><summary>SO — Solothurn</summary>

- **ledig, 0 Kinder:** 13'940 → 83 · 16'269 → 310 · 21'640 → 925 · 23'971 → 1'252 · 26'187 → 1'618 · 28'393 → 2'038 · 39'417 → 4'286 · 52'647 → 7'126 · 98'224 → 17'422 · 265'539 → 58'904
- **ledig, 1 Kind:** 6'440 → 50 · 25'303 → 50 · 27'507 → 113 · 34'123 → 756 · 38'533 → 1'226 · 42'943 → 1'719 · 47'353 → 2'339 · 49'557 → 2'688 · 51'763 → 3'068 · 56'149 → 3'909 · 75'497 → 7'857 · 101'600 → 13'450 · 185'079 → 32'302 · 258'039 → 50'203
- **ledig, 2 Kinder:** 1'269 → 50 · 28'827 → 50 · 31'033 → 212 · 37'647 → 860 · 44'263 → 1'575 · 46'467 → 1'863 · 50'787 → 2'470 · 55'065 → 3'213 · 59'343 → 4'044 · 78'874 → 8'038 · 104'976 → 13'639 · 186'699 → 32'103 · 250'539 → 47'719
- **ledig, 3 Kinder:** 1'471 → 50 · 30'147 → 50 · 32'353 → 98 · 38'967 → 741 · 47'565 → 1'666 · 49'705 → 1'967 · 53'982 → 2'588 · 56'146 → 2'962 · 60'497 → 3'782 · 80'074 → 7'770 · 106'239 → 13'372 · 188'319 → 31'903 · 243'039 → 45'235
- **verheiratet, 0 Kinder:** 8'290 → 100 · 21'487 → 100 · 23'693 → 239 · 30'307 → 885 · 36'923 → 1'600 · 39'127 → 1'880 · 43'537 → 2'499 · 47'947 → 3'259 · 52'357 → 4'117 · 71'782 → 8'088 · 97'874 → 13'689 · 187'879 → 34'031 · 260'839 → 52'091
- **verheiratet, 1 Kind:** 790 → 100 · 22'807 → 100 · 25'013 → 125 · 31'627 → 767 · 40'447 → 1'714 · 44'857 → 2'333 · 47'063 → 2'669 · 49'267 → 3'050 · 53'587 → 3'870 · 72'973 → 7'820 · 101'250 → 13'878 · 189'499 → 33'831 · 253'339 → 49'607
- **verheiratet, 2 Kinder:** 1'940 → 100 · 26'333 → 100 · 28'537 → 224 · 35'153 → 868 · 41'767 → 1'583 · 43'949 → 1'855 · 48'227 → 2'455 · 52'505 → 3'178 · 56'782 → 4'005 · 76'348 → 8'000 · 102'451 → 13'598 · 191'119 → 33'632 · 245'839 → 47'123
- **verheiratet, 3 Kinder:** 1'193 → 100 · 29'857 → 110 · 36'449 → 750 · 45'005 → 1'662 · 51'446 → 2'563 · 55'797 → 3'327 · 60'147 → 4'173 · 77'549 → 7'733 · 110'659 → 14'831 · 192'739 → 33'432 · 238'339 → 44'639

</details>

<details><summary>SZ — Schwyz</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 16'269 → 8 · 19'311 → 51 · 21'640 → 130 · 23'971 → 251 · 26'187 → 389 · 30'597 → 707 · 35'007 → 1'150 · 41'623 → 1'879 · 54'853 → 3'137 · 59'263 → 3'576 · 70'065 → 4'700 · 109'100 → 9'159 · 265'539 → 26'609
- **ledig, 1 Kind:** 6'440 → 0 · 31'917 → 8 · 34'123 → 52 · 36'327 → 155 · 38'533 → 308 · 40'737 → 485 · 47'353 → 1'134 · 53'967 → 1'863 · 60'427 → 2'646 · 64'705 → 3'067 · 82'023 → 4'888 · 105'950 → 7'625 · 258'039 → 24'575
- **ledig, 2 Kinder:** 1'269 → 0 · 37'647 → 0 · 39'853 → 34 · 42'057 → 114 · 44'263 → 251 · 48'649 → 621 · 55'065 → 1'290 · 61'482 → 2'035 · 67'997 → 2'850 · 76'698 → 4'005 · 131'979 → 10'226 · 250'539 → 23'409
- **ledig, 3 Kinder:** 1'471 → 0 · 41'149 → 0 · 45'427 → 18 · 47'565 → 81 · 49'705 → 204 · 51'843 → 363 · 56'146 → 765 · 60'497 → 1'221 · 64'847 → 1'717 · 73'548 → 2'785 · 82'249 → 3'945 · 93'126 → 5'480 · 97'476 → 6'036 · 243'039 → 22'242
- **verheiratet, 0 Kinder:** 8'290 → 0 · 30'307 → 8 · 34'717 → 86 · 36'923 → 168 · 39'127 → 280 · 41'333 → 416 · 43'537 → 577 · 47'947 → 938 · 52'357 → 1'349 · 61'087 → 2'237 · 67'505 → 2'971 · 76'122 → 3'992 · 91'348 → 5'443 · 124'039 → 8'855 · 260'839 → 24'015
- **verheiratet, 1 Kind:** 790 → 0 · 33'833 → 0 · 38'243 → 21 · 40'447 → 68 · 42'653 → 139 · 44'857 → 238 · 47'063 → 370 · 51'449 → 692 · 57'865 → 1'279 · 66'446 → 2'169 · 77'323 → 3'404 · 92'549 → 5'278 · 134'779 → 9'663 · 253'339 → 22'847
- **verheiratet, 2 Kinder:** 1'940 → 0 · 41'767 → 0 · 46'087 → 49 · 48'227 → 111 · 50'365 → 203 · 52'505 → 321 · 54'643 → 469 · 58'946 → 818 · 65'473 → 1'430 · 71'998 → 2'119 · 82'874 → 3'347 · 95'926 → 4'944 · 109'039 → 6'662 · 136'399 → 9'509 · 245'839 → 21'680
- **verheiratet, 3 Kinder:** 1'193 → 0 · 47'143 → 0 · 51'446 → 37 · 53'622 → 89 · 55'797 → 175 · 57'973 → 288 · 60'147 → 428 · 62'323 → 591 · 66'674 → 966 · 71'024 → 1'386 · 79'725 → 2'293 · 90'601 → 3'544 · 110'659 → 6'029 · 128'899 → 8'418 · 138'019 → 9'374 · 238'339 → 20'514

</details>

<details><summary>TG — Frauenfeld</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 16'269 → 180 · 19'311 → 366 · 21'640 → 622 · 23'971 → 942 · 28'393 → 1'604 · 39'417 → 3'298 · 82'997 → 10'941 · 146'979 → 22'949 · 265'539 → 46'598
- **ledig, 1 Kind:** 6'440 → 0 · 27'507 → 0 · 31'917 → 242 · 36'327 → 574 · 40'737 → 1'022 · 45'147 → 1'585 · 75'497 → 6'160 · 166'839 → 22'198 · 258'039 → 39'309
- **ledig, 2 Kinder:** 1'269 → 0 · 28'827 → 0 · 31'033 → 152 · 33'237 → 272 · 37'647 → 614 · 42'057 → 1'072 · 46'467 → 1'646 · 50'787 → 2'305 · 76'698 → 6'199 · 168'459 → 22'318 · 250'539 → 37'728
- **ledig, 3 Kinder:** 1'471 → 0 · 30'147 → 0 · 32'353 → 171 · 34'557 → 302 · 38'967 → 654 · 41'149 → 876 · 43'287 → 1'119 · 47'565 → 1'676 · 49'705 → 2'008 · 77'899 → 6'250 · 170'079 → 22'445 · 243'039 → 36'146
- **verheiratet, 0 Kinder:** 8'290 → 0 · 25'897 → 0 · 28'103 → 161 · 30'307 → 286 · 34'717 → 633 · 39'127 → 1'094 · 41'333 → 1'370 · 43'537 → 1'672 · 73'946 → 6'250 · 160'519 → 21'461 · 260'839 → 40'229
- **verheiratet, 1 Kind:** 790 → 0 · 27'217 → 0 · 29'423 → 180 · 31'627 → 316 · 33'833 → 482 · 36'037 → 673 · 38'243 → 894 · 40'447 → 1'145 · 42'653 → 1'421 · 44'857 → 1'732 · 75'147 → 6'289 · 162'139 → 21'579 · 253'339 → 38'647
- **verheiratet, 2 Kinder:** 1'940 → 0 · 26'333 → 0 · 30'743 → 201 · 35'153 → 512 · 39'563 → 933 · 43'949 → 1'471 · 46'087 → 1'766 · 48'227 → 2'098 · 76'348 → 6'351 · 163'759 → 21'706 · 245'839 → 37'065
- **verheiratet, 3 Kinder:** 1'193 → 0 · 27'653 → 0 · 32'063 → 221 · 36'449 → 542 · 38'587 → 735 · 40'727 → 956 · 45'005 → 1'496 · 47'143 → 1'796 · 77'549 → 6'394 · 165'379 → 21'825 · 238'339 → 35'484

</details>

<details><summary>TI — Bellinzona</summary>

- **ledig, 0 Kinder:** 13'940 → 20 · 16'269 → 140 · 19'311 → 352 · 21'640 → 588 · 23'971 → 863 · 26'187 → 1'057 · 28'393 → 1'224 · 30'597 → 1'439 · 32'803 → 1'757 · 35'007 → 2'114 · 43'827 → 3'720 · 54'853 → 5'924 · 61'467 → 7'323 · 63'649 → 7'680 · 74'343 → 10'185 · 76'482 → 10'822 · 98'224 → 15'904 · 210'819 → 44'338 · 265'539 → 58'810
- **ledig, 1 Kind:** 6'440 → 20 · 27'507 → 20 · 29'713 → 92 · 31'917 → 259 · 36'327 → 612 · 38'533 → 757 · 42'943 → 997 · 49'557 → 1'496 · 51'763 → 1'691 · 56'149 → 2'247 · 58'287 → 2'562 · 68'982 → 4'228 · 84'198 → 7'280 · 97'249 → 10'074 · 116'827 → 14'973 · 148'599 → 22'543 · 185'079 → 31'635 · 258'039 → 51'167
- **ledig, 2 Kinder:** 1'269 → 20 · 33'237 → 20 · 35'443 → 130 · 37'647 → 296 · 42'057 → 655 · 44'263 → 788 · 46'467 → 898 · 48'649 → 1'043 · 55'065 → 1'542 · 57'205 → 1'754 · 61'482 → 2'309 · 74'523 → 4'351 · 89'749 → 7'417 · 100'626 → 9'753 · 122'859 → 15'193 · 150'219 → 21'699 · 186'699 → 30'738 · 250'539 → 47'660
- **ledig, 3 Kinder:** 1'471 → 20 · 38'967 → 20 · 41'149 → 176 · 47'565 → 701 · 51'843 → 923 · 60'497 → 1'587 · 62'673 → 1'842 · 67'023 → 2'411 · 77'899 → 4'107 · 80'074 → 4'507 · 95'301 → 7'573 · 106'239 → 9'924 · 151'839 → 20'862 · 188'319 → 29'842 · 243'039 → 44'178
- **verheiratet, 0 Kinder:** 8'290 → 40 · 23'693 → 40 · 25'897 → 226 · 32'513 → 742 · 36'923 → 972 · 45'743 → 1'638 · 47'947 → 1'900 · 52'357 → 2'476 · 63'227 → 4'142 · 65'365 → 4'527 · 82'647 → 8'003 · 93'524 → 10'405 · 119'627 → 16'995 · 142'279 → 22'323 · 187'879 → 33'722 · 260'839 → 53'449
- **verheiratet, 1 Kind:** 790 → 40 · 27'217 → 40 · 29'423 → 105 · 31'627 → 271 · 36'037 → 624 · 38'243 → 772 · 42'653 → 1'009 · 51'449 → 1'686 · 55'727 → 2'241 · 57'865 → 2'551 · 68'622 → 4'232 · 86'024 → 7'710 · 96'900 → 10'094 · 112'127 → 13'895 · 143'899 → 21'486 · 189'499 → 32'776 · 253'339 → 49'944
- **verheiratet, 2 Kinder:** 1'940 → 40 · 32'947 → 40 · 35'153 → 142 · 37'357 → 309 · 41'767 → 666 · 46'087 → 908 · 48'227 → 1'047 · 54'643 → 1'547 · 56'782 → 1'748 · 61'122 → 2'317 · 63'297 → 2'642 · 74'174 → 4'371 · 91'575 → 7'866 · 102'451 → 10'244 · 172'879 → 27'346 · 181'999 → 29'613 · 245'839 → 46'439
- **verheiratet, 3 Kinder:** 1'193 → 40 · 38'587 → 40 · 40'727 → 181 · 47'143 → 708 · 51'446 → 939 · 53'622 → 1'092 · 60'147 → 1'600 · 62'323 → 1'850 · 64'498 → 2'128 · 66'674 → 2'431 · 75'374 → 3'778 · 79'725 → 4'508 · 94'951 → 7'573 · 110'659 → 11'016 · 165'379 → 24'182 · 192'739 → 31'007 · 238'339 → 43'002

</details>

<details><summary>UR — Altdorf UR</summary>

- **ledig, 0 Kinder:** 13'940 → 70 · 16'269 → 204 · 265'539 → 34'716
- **ledig, 1 Kind:** 6'440 → 70 · 20'893 → 70 · 23'097 → 97 · 258'039 → 32'625
- **ledig, 2 Kinder:** 1'269 → 70 · 24'417 → 70 · 26'623 → 350 · 250'539 → 31'352
- **ledig, 3 Kinder:** 1'471 → 70 · 25'737 → 70 · 27'943 → 298 · 243'039 → 30'077
- **verheiratet, 0 Kinder:** 8'290 → 70 · 23'693 → 70 · 25'897 → 319 · 260'839 → 32'846
- **verheiratet, 1 Kind:** 790 → 70 · 25'013 → 70 · 27'217 → 267 · 253'339 → 31'573
- **verheiratet, 2 Kinder:** 1'940 → 70 · 26'333 → 70 · 28'537 → 214 · 245'839 → 30'299
- **verheiratet, 3 Kinder:** 1'193 → 70 · 27'653 → 70 · 29'857 → 161 · 238'339 → 29'025

</details>

<details><summary>VD — Lausanne</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 21'640 → 3 · 23'971 → 131 · 26'187 → 386 · 28'393 → 713 · 30'597 → 1'104 · 32'803 → 1'567 · 37'213 → 2'562 · 39'417 → 3'120 · 41'623 → 3'752 · 48'237 → 5'777 · 52'647 → 7'301 · 54'853 → 7'971 · 74'343 → 12'378 · 96'048 → 17'746 · 137'859 → 29'373 · 192'579 → 45'769 · 265'539 → 69'303
- **ledig, 1 Kind:** 6'440 → 0 · 25'303 → 12 · 27'507 → 100 · 29'713 → 262 · 31'917 → 501 · 34'123 → 785 · 38'533 → 1'473 · 42'943 → 2'304 · 51'763 → 4'282 · 58'287 → 5'916 · 66'843 → 8'530 · 79'847 → 11'553 · 116'827 → 19'524 · 148'599 → 27'321 · 185'079 → 37'578 · 258'039 → 59'808
- **ledig, 2 Kinder:** 1'269 → 0 · 22'213 → 0 · 24'417 → 41 · 26'623 → 137 · 28'827 → 287 · 31'033 → 505 · 35'443 → 1'067 · 37'647 → 1'395 · 42'057 → 2'120 · 46'467 → 2'994 · 50'787 → 3'951 · 63'646 → 6'977 · 72'347 → 9'546 · 91'925 → 13'856 · 113'739 → 18'431 · 150'219 → 26'733 · 204'939 → 40'900 · 250'539 → 55'363
- **ledig, 3 Kinder:** 1'471 → 0 · 21'327 → 0 · 23'533 → 70 · 25'737 → 181 · 27'943 → 325 · 30'147 → 541 · 32'353 → 788 · 36'763 → 1'370 · 43'287 → 2'413 · 45'427 → 2'794 · 47'565 → 3'213 · 51'843 → 4'081 · 67'023 → 7'551 · 73'548 → 9'317 · 75'724 → 10'010 · 151'839 → 26'540 · 206'559 → 40'037 · 233'919 → 47'145 · 243'039 → 50'377
- **verheiratet, 0 Kinder:** 8'290 → 0 · 28'103 → 0 · 30'307 → 45 · 32'513 → 167 · 34'717 → 363 · 39'127 → 914 · 43'537 → 1'633 · 45'743 → 2'060 · 47'947 → 2'564 · 56'767 → 4'940 · 69'643 → 8'913 · 71'782 → 9'436 · 76'122 → 10'235 · 102'225 → 15'521 · 117'451 → 18'843 · 142'279 → 24'686 · 187'879 → 36'656 · 260'839 → 57'327
- **verheiratet, 1 Kind:** 790 → 0 · 27'217 → 0 · 29'423 → 75 · 31'627 → 210 · 33'833 → 396 · 36'037 → 639 · 40'447 → 1'213 · 44'857 → 1'939 · 47'063 → 2'333 · 51'449 → 3'204 · 53'587 → 3'687 · 62'143 → 5'981 · 75'147 → 9'924 · 81'674 → 11'348 · 90'374 → 12'972 · 125'659 → 20'131 · 143'899 → 24'340 · 198'619 → 37'705 · 253'339 → 53'607
- **verheiratet, 2 Kinder:** 1'940 → 0 · 24'127 → 0 · 28'537 → 104 · 30'743 → 248 · 35'153 → 641 · 41'767 → 1'503 · 48'227 → 2'571 · 54'643 → 3'822 · 58'946 → 4'811 · 67'647 → 7'086 · 78'524 → 10'410 · 85'049 → 11'820 · 136'399 → 22'302 · 200'239 → 36'943 · 245'839 → 49'676
- **verheiratet, 3 Kinder:** 1'193 → 0 · 23'243 → 0 · 27'653 → 141 · 32'063 → 458 · 34'267 → 670 · 36'449 → 927 · 42'865 → 1'769 · 45'005 → 2'108 · 49'282 → 2'847 · 51'446 → 3'250 · 57'973 → 4'566 · 73'199 → 8'173 · 75'374 → 8'743 · 84'075 → 11'336 · 94'951 → 13'695 · 138'019 → 22'560 · 229'219 → 42'970 · 238'339 → 45'771

</details>

<details><summary>VS — Sion</summary>

- **ledig, 0 Kinder:** 13'940 → 34 · 21'640 → 34 · 23'971 → 142 · 26'187 → 322 · 28'393 → 667 · 30'597 → 989 · 32'803 → 1'614 · 35'007 → 2'124 · 37'213 → 2'694 · 39'417 → 3'337 · 46'033 → 4'384 · 52'647 → 5'520 · 61'467 → 7'230 · 74'343 → 9'981 · 96'048 → 15'245 · 109'100 → 18'826 · 137'859 → 27'520 · 165'219 → 37'030 · 174'339 → 39'533 · 265'539 → 63'184
- **ledig, 1 Kind:** 6'440 → 34 · 29'713 → 36 · 34'123 → 283 · 36'327 → 450 · 38'533 → 737 · 42'943 → 1'347 · 47'353 → 2'025 · 49'557 → 2'330 · 56'149 → 3'041 · 62'565 → 3'809 · 77'673 → 5'848 · 92'899 → 8'179 · 108'126 → 10'718 · 130'359 → 14'948 · 139'479 → 16'894 · 148'599 → 19'429 · 157'719 → 22'301 · 166'839 → 25'654 · 185'079 → 30'836 · 258'039 → 49'692
- **ledig, 2 Kinder:** 1'269 → 34 · 35'443 → 36 · 42'057 → 421 · 46'467 → 734 · 50'787 → 1'363 · 52'927 → 1'709 · 55'065 → 2'010 · 61'482 → 2'696 · 65'822 → 3'212 · 72'347 → 4'041 · 85'399 → 5'838 · 107'151 → 9'267 · 122'859 → 12'073 · 141'099 → 15'632 · 150'219 → 17'997 · 159'339 → 20'680 · 177'579 → 26'918 · 195'819 → 31'934 · 250'539 → 45'996
- **ledig, 3 Kinder:** 1'471 → 34 · 41'149 → 34 · 43'287 → 83 · 49'705 → 467 · 56'146 → 919 · 58'322 → 1'155 · 60'497 → 1'506 · 62'673 → 1'781 · 67'023 → 2'239 · 75'724 → 3'272 · 86'600 → 4'727 · 97'476 → 6'322 · 115'359 → 9'186 · 133'599 → 12'496 · 151'839 → 16'212 · 160'959 → 18'770 · 170'079 → 21'593 · 179'199 → 24'941 · 197'439 → 30'154 · 243'039 → 41'998
- **verheiratet, 0 Kinder:** 8'290 → 34 · 16'940 → 34 · 23'693 → 62 · 25'897 → 287 · 28'103 → 554 · 34'717 → 1'417 · 41'333 → 2'423 · 52'357 → 3'668 · 67'505 → 5'655 · 84'823 → 8'261 · 106'575 → 11'933 · 133'159 → 17'275 · 151'399 → 22'673 · 160'519 → 26'067 · 169'639 → 28'728 · 260'839 → 52'426
- **verheiratet, 1 Kind:** 790 → 34 · 27'217 → 34 · 29'423 → 67 · 33'833 → 320 · 36'037 → 527 · 38'243 → 817 · 42'653 → 1'436 · 47'063 → 2'123 · 49'267 → 2'391 · 55'727 → 3'098 · 64'282 → 4'142 · 77'323 → 5'934 · 92'549 → 8'272 · 107'776 → 10'808 · 134'779 → 15'992 · 143'899 → 18'352 · 153'019 → 21'072 · 171'259 → 27'304 · 189'499 → 32'288 · 253'339 → 48'712
- **verheiratet, 2 Kinder:** 1'940 → 34 · 30'743 → 34 · 35'153 → 67 · 43'949 → 609 · 46'087 → 803 · 48'227 → 1'121 · 52'505 → 1'790 · 54'643 → 2'061 · 56'782 → 2'279 · 65'473 → 3'273 · 80'699 → 5'292 · 102'451 → 8'641 · 127'279 → 13'086 · 145'519 → 16'947 · 163'759 → 22'435 · 172'879 → 25'808 · 181'999 → 28'372 · 245'839 → 45'024
- **verheiratet, 3 Kinder:** 1'193 → 34 · 40'727 → 34 · 42'865 → 111 · 45'005 → 230 · 55'797 → 956 · 57'973 → 1'249 · 60'147 → 1'599 · 66'674 → 2'306 · 75'374 → 3'349 · 92'776 → 5'744 · 119'779 → 10'099 · 147'139 → 15'332 · 165'379 → 20'380 · 183'619 → 26'618 · 238'339 → 41'035

</details>

<details><summary>ZG — Zug</summary>

- **ledig, 0 Kinder:** 13'940 → 0 · 19'311 → 30 · 21'640 → 77 · 23'971 → 148 · 35'007 → 575 · 43'827 → 972 · 54'853 → 1'568 · 80'822 → 3'284 · 96'048 → 4'474 · 119'976 → 6'766 · 146'979 → 10'090 · 174'339 → 13'284 · 265'539 → 22'785
- **ledig, 1 Kind:** 6'440 → 0 · 49'557 → 0 · 56'149 → 61 · 60'427 → 152 · 64'705 → 275 · 77'673 → 757 · 95'074 → 1'473 · 108'126 → 2'095 · 121'239 → 2'802 · 130'359 → 3'357 · 175'959 → 6'615 · 203'319 → 8'931 · 212'439 → 9'835 · 248'919 → 13'713 · 258'039 → 14'897
- **ledig, 2 Kinder:** 1'269 → 0 · 70'173 → 0 · 76'698 → 60 · 81'048 → 152 · 85'399 → 275 · 100'626 → 846 · 113'739 → 1'387 · 122'859 → 1'813 · 131'979 → 2'310 · 141'099 → 2'842 · 150'219 → 3'450 · 195'819 → 6'734 · 223'179 → 9'050 · 250'539 → 11'873
- **ledig, 3 Kinder:** 1'471 → 0 · 90'950 → 0 · 97'476 → 60 · 104'001 → 207 · 115'359 → 618 · 124'479 → 1'005 · 133'599 → 1'419 · 142'719 → 1'881 · 151'839 → 2'386 · 160'959 → 2'918 · 197'439 → 5'502 · 215'679 → 6'852 · 243'039 → 9'169
- **verheiratet, 0 Kinder:** 8'290 → 0 · 30'307 → 5 · 36'923 → 77 · 41'333 → 183 · 45'743 → 327 · 58'949 → 825 · 73'946 → 1'447 · 86'998 → 2'063 · 104'400 → 3'000 · 133'159 → 4'887 · 142'279 → 5'538 · 160'519 → 6'886 · 187'879 → 9'221 · 224'359 → 13'017 · 260'839 → 17'692
- **verheiratet, 1 Kind:** 790 → 0 · 51'449 → 8 · 57'865 → 85 · 64'282 → 252 · 79'498 → 820 · 94'725 → 1'447 · 107'776 → 2'068 · 125'659 → 3'030 · 171'259 → 6'289 · 180'379 → 7'005 · 207'739 → 9'367 · 244'219 → 13'152 · 253'339 → 14'312
- **verheiratet, 2 Kinder:** 1'940 → 0 · 71'998 → 7 · 78'524 → 85 · 85'049 → 252 · 102'451 → 910 · 118'159 → 1'575 · 127'279 → 2'048 · 145'519 → 3'122 · 191'119 → 6'382 · 209'359 → 7'892 · 227'599 → 9'502 · 245'839 → 11'405
- **verheiratet, 3 Kinder:** 1'193 → 0 · 90'601 → 0 · 97'127 → 53 · 101'539 → 142 · 110'659 → 432 · 119'779 → 808 · 128'899 → 1'210 · 138'019 → 1'642 · 147'139 → 2'123 · 156'259 → 2'655 · 165'379 → 3'222 · 210'979 → 6'482 · 238'339 → 8'779

</details>

<details><summary>ZH — Zürich</summary>

- **ledig, 0 Kinder:** 13'940 → 251 · 16'269 → 405 · 26'187 → 1'252 · 35'007 → 2'205 · 46'033 → 3'604 · 59'263 → 5'565 · 76'482 → 8'494 · 109'100 → 14'769 · 146'979 → 22'843 · 192'579 → 33'577 · 265'539 → 52'195
- **ledig, 1 Kind:** 6'440 → 24 · 18'687 → 33 · 20'893 → 127 · 25'303 → 330 · 31'917 → 754 · 34'123 → 921 · 42'943 → 1'678 · 53'967 → 2'855 · 68'982 → 4'792 · 99'425 → 9'361 · 130'359 → 14'625 · 175'959 → 23'350 · 230'679 → 34'936 · 258'039 → 41'198
- **ledig, 2 Kinder:** 1'269 → 24 · 20'007 → 24 · 22'213 → 49 · 24'417 → 144 · 28'827 → 349 · 35'443 → 774 · 37'647 → 946 · 46'467 → 1'711 · 57'205 → 2'869 · 72'347 → 4'822 · 102'801 → 9'391 · 113'739 → 11'235 · 141'099 → 16'011 · 186'699 → 24'835 · 250'539 → 38'679
- **ledig, 3 Kinder:** 1'471 → 24 · 23'533 → 24 · 25'737 → 62 · 30'147 → 251 · 32'353 → 369 · 38'967 → 792 · 45'427 → 1'340 · 49'705 → 1'721 · 60'497 → 2'869 · 75'724 → 4'852 · 106'239 → 9'420 · 142'719 → 15'723 · 188'319 → 24'514 · 243'039 → 36'220
- **verheiratet, 0 Kinder:** 8'290 → 48 · 10'619 → 48 · 14'611 → 100 · 19'271 → 296 · 21'487 → 424 · 28'103 → 859 · 36'923 → 1'612 · 39'127 → 1'830 · 45'743 → 2'537 · 50'153 → 3'033 · 63'227 → 4'715 · 95'699 → 9'565 · 106'575 → 11'431 · 133'159 → 16'094 · 178'759 → 24'924 · 224'359 → 34'682 · 260'839 → 43'058
- **verheiratet, 1 Kind:** 790 → 48 · 16'193 → 48 · 18'397 → 120 · 22'807 → 314 · 31'627 → 884 · 40'447 → 1'638 · 49'267 → 2'569 · 53'587 → 3'059 · 66'446 → 4'715 · 99'075 → 9'599 · 134'779 → 15'785 · 180'379 → 24'581 · 216'859 → 32'392 · 253'339 → 40'539
- **verheiratet, 2 Kinder:** 1'940 → 48 · 19'717 → 48 · 26'333 → 328 · 30'743 → 611 · 35'153 → 911 · 43'949 → 1'663 · 52'505 → 2'580 · 56'782 → 3'059 · 69'823 → 4'741 · 100'276 → 9'295 · 136'399 → 15'478 · 181'999 → 24'260 · 245'839 → 38'020
- **verheiratet, 3 Kinder:** 1'193 → 48 · 23'243 → 57 · 29'857 → 348 · 34'267 → 630 · 38'587 → 927 · 47'143 → 1'663 · 57'973 → 2'815 · 73'199 → 4'756 · 97'127 → 8'351 · 110'659 → 10'489 · 138'019 → 15'188 · 183'619 → 23'971 · 238'339 → 35'624

</details>
