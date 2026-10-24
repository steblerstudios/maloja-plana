# Sensitivität und Schwellenfächer · H3 Einelternfamilie — 2026-10-24

> Intern, nicht veröffentlichen. Gehört zu [`STATISTIK-SYSTEMBLICK.md`](STATISTIK-SYSTEMBLICK.md), Abschnitt «Wie Maloja
> die Hebel messen könnte» (Sensitivität, Schwellenfächer). Rohausgabe: `node scripts/systemblick-sensitivitaet.mjs`
> (liest nur den bestehenden Code; `src` unverändert seit `b6689051`). Modellrechnung mit Maloja-Annahmen. Vom
> swiss-precision-pruefer am 24.10.2026 geprüft: alle Tabellenzahlen stimmen mit der Rohausgabe, Befunde eingearbeitet.
> «Restprämie in %» = Restprämie ÷ Netto-Richtwert × 12 (wie in der Messung). **Kein Satz dieser Datei geht ohne
> Bestätigung durch die kantonale Stelle (SOVAR, OCAB …) nach aussen.**

**Haushalt:** H3, eine erwachsene Person, Kinder 3 und 5, Hauptort je Kanton. Sonst alle Annahmen der Messung.
In 10 Kantonen nennt Maloja für H3 keine Zahl; die Ergebnisse gelten für die übrigen 16.

## A · Wie stark trägt die Annahme «Vermögen 0»?

Vermögen als Sparguthaben eingesetzt, Brutto CHF 60'000. Median über dieselben 16 Kantone, damit die Mischung gleich bleibt.

| Vermögen CHF | Kantone mit Betrag | «kein Anspruch» | Median Verbilligung | Median Restprämie in % |
|---:|---:|---:|---:|---:|
| 0 | 16 | 0 | 4'313 | 7.5 % |
| 25'000 | 16 | 0 | 4'235 | 8.0 % |
| 50'000 | 16 | 0 | 4'160 | 8.2 % |
| 100'000 | 14 | 2 | 3'883 | 8.4 % |
| 150'000 | 14 | 2 | 3'568¹ | 8.5 %¹ |

¹ Bei 100'000 haben NE und SG «kein Anspruch». Bei 150'000 haben **AR und NE** «kein Anspruch»; **SG** steht auf «keine
Zahl» (über der Vermögensgrenze 100'000 + 2 × 20'000 = 140'000, `ipvStGallen.js`). Dafür wird **NW** rechenbar
(CHF 2'016; bei 0 und 100'000 «keine Zahl», Grund `mindestanspruch`): Mit dem höheren massgebenden Einkommen entscheidet
die offene Lesart der Kinder-Mindestverbilligung nicht mehr. Das heisst **nicht**, dass Vermögen den Anspruch erhöht —
ohne Vermögen nennt Maloja für NW keine Zahl. Darum 14 mit Betrag = 16 − AR − NE − SG + NW. Der Median läuft über die
16 Basis-Kantone, also ohne NW und ohne SG (null): über **15** Werte, AR und NE mit 0. (Nachgerechnet 24.10.2026.)

**Im Median wirkt das Vermögen schwach** (7.5 % → 8.4 % bei CHF 100'000). **In einzelnen Kantonen stark:**

| Kanton | Verbilligung bei Vermögen 0 · 50'000 · 100'000 |
|---|---|
| SG | 3'784 · 2'340 · **0** |
| NE | 4'776 · 4'332 · **0** |
| LU | 3'798 · 3'064 · 2'300 |
| VS | 5'246 · 4'573 · 3'900 |
| OW | 4'139 · 4'071 · 3'367 |
| ZH, BE, UR | unverändert bis 150'000 |
| SH | unverändert bis 100'000, bei 150'000: 2'219 (statt 2'349) |
| AR | unverändert bis 100'000, bei 150'000: **0** |

- Die unveränderten Kantone **lesen** das Vermögen (`vermoegenSumme` in den Modulen), rechnen aber erst über einem
  Freibetrag (vom Prüfer am Code nachgerechnet): ZH 150'000 für Familien (`ipvZuerich.js`), SH 50'000 + 2 × 30'000 =
  110'000 (`ipvSchaffhausen.js`), AR 75'000 + 2 × 25'000 = 125'000 (`ipvAppenzellAusserrhoden.js`), UR Sozialabzug
  105'800 + 2 × 31'700 = 169'200 (`ipvUri.js`). **BE:** Das massgebende Einkommen steigt (17'230 → 19'680), bleibt aber in
  derselben Tabellenstufe bis 25'000 (`ipvBern.js`).
- SG und NE: Bis CHF 100'000 fällt der Anspruch im Modell auf 0. Bei NE heben 30 % des Vermögens über 8'000 das
  massgebende Einkommen über die Grenze der Stufe; dort fällt auch der Kinderbetrag weg. Ob SG zwischen 50'000 und
  100'000 ausläuft oder abbricht, zeigen die Stufen nicht. Offen am Modul: SG rechnet 20 % des **erfassten** Vermögens;
  ob St. Gallen einen Vermögensfreibetrag kennt, ist nicht geprüft — falls ja, fällt SG im Modell zu früh weg.
- **Folgerung für jede Veröffentlichung:** «Vermögen 0» darf nicht unerwähnt bleiben. Im Median verschiebt es wenig, für
  einzelne Kantone entscheidet es über alles oder nichts. Die Spanne (Grenze 6 im Konzept) lässt sich jetzt beziffern.

## B · Schwellenfächer: Was bleibt von mehr Lohn?

Brutto CHF 40'000 bis 100'000 in Schritten von 4'000, Vermögen 0.

| Brutto CHF | Netto pro Jahr | mit Betrag | «kein Anspruch» | «keine Zahl» | Median Verbilligung (nur Kantone mit Betrag) | Median Restprämie in % |
|---:|---:|---:|---:|---:|---:|---:|
| 40'000 | 36'768 | 16 | 0 | 10 | 6'158 | 6.5 % |
| 48'000 | 43'848 | 16 | 0 | 10 | 5'468 | 5.8 % |
| 60'000 | 54'480 | 16 | 0 | 10 | 4'313 | 7.5 % |
| 72'000 | 65'112 | 15 | 1 | 10 | 3'356 | 8.1 % |
| 80'000 | 72'204 | 10 | 5 | 11 | 3'002 | 7.9 % |
| 88'000 | 79'296 | 10 | 8 | 8 | 2'271 | 9.1 % |
| 100'000 | 90'384 | 7 | 14 | 5 | 2'093 | 8.7 % |

(Alle 16 Stufen in der Rohausgabe.)

- **Vorsicht beim Median über die Stufen:** Die Kantonsmischung wechselt. Bei der Restprämie steigt die Zahl der Kantone
  mit Wert (16 → 21), weil oben einige «keine Zahl» zu «kein Anspruch» werden. Bei der Verbilligung sinkt sie (16 → 7),
  weil nur Kantone mit Betrag zählen. Anders als in Teil A (dort zählt «kein Anspruch» als 0 mit) ist «Median Verbilligung»
  hier also über wenige Kantone gerechnet. Die Mediane sind nicht monoton und dürfen nicht als Kurve gelesen werden.

### Abschöpfung: Wie viel von CHF 4'000 mehr Brutto bleibt nicht beim Haushalt?

Abschöpfung = 1 − (Δ Netto − Δ Restprämie) ÷ 4'000. Darin stecken die Lohnabzüge und die kleiner werdende Verbilligung.
Nur Kantone, die auf beiden Stufen eine Restprämie haben.

- **Median über die Kantone: 17–23 %** zwischen CHF 40'000 und 76'000, danach sinkend. Drei Gründe: weniger Verbilligung
  übrig, die wegfallen kann; die Kantonsmischung wechselt (n 15 → 21); und die **Lohnabzüge** im Netto-Richtwert sinken
  oben: Bis 88'000 bleiben von 4'000 brutto rund 3'540–3'552 netto (Abzüge rund 11.5 %), ab 92'000 rund 3'744 (rund
  6.4 %), weil der Lohn über dem oberen BVG-Grenzbetrag (90'720, `lohnAbzuege.js`) liegt. Das senkt die Abschöpfung oben
  um rund 5 Prozentpunkte. Rund 6 bis 11 Prozentpunkte des Medians gehen auf die abnehmende Verbilligung.
- **Kanten im Modell — Stufen, an denen eine Lohnerhöhung von 4'000 brutto zu mehr Restprämie führt, als netto
  dazukommt (über 100 %):**
  - **AR, 60'000 → 64'000: 116 %.** Die harte Obergrenze des massgebenden Einkommens (bei zwei Kindern CHF 47'000,
    `ipvAppenzellAusserrhoden.js`; Quelle SOVAR-Merkblatt IPV 2026, erstellt 18.12.2025) schneidet auch den Kinderanteil
    ab (EG KVG AR Art. 12). Nachgerechnet: massgebend 54'480 − 10'600 Kinderabzug = 43'880 (unter 47'000); bei 64'000:
    58'032 − 10'600 = 47'432 (darüber).
  - **NE, 80'000 → 84'000: 120 %.** Netto 72'204 liegt in Stufe S15 (bis 72'824), 75'744 darüber. Weg fallen 4'332 im Jahr
    = (26 + 15) × 12 + 2 × 160 × 12 (RSN 821.102 Annexe, Décret RSN 821.104, `ipvNeuchatel.js`).
  - **Zwei Einschränkungen**, die zu jedem dieser Befunde gehören:
    - **Zeitverzug:** AR rechnet mit der Steuerveranlagung 2024, NE mit 2025. Eine Lohnerhöhung 2026 wirkt erst Jahre
      später auf die Verbilligung, nicht «nach» der Erhöhung.
    - **Lage der Kante ist eine Näherung:** Im Modell ist das massgebende Einkommen Netto-Richtwert minus Kinderabzug;
      Berufsauslagen und Versicherungsabzug fehlen. Die echte Kante liegt darum bei einem **höheren** Brutto — wie viel
      höher, ist offen. Die Mechanik selbst ist an Code und Quelle belegt und eher untertrieben, weil die Steuern noch
      dazukämen.
- **Steile Stufen (50–100 %), gleiche Einschränkungen:** NE 66 % und 60 % (48'000–56'000), AR 52 %, SG 70 %, SH 67 % (72'000–76'000), FR und VS
  je 84 % (76'000–80'000), BE 92 % (88'000–92'000), BS 87 % und UR 51 % (96'000–100'000).

**Was das statistisch heisst:** Die Abschöpfung liegt im Median moderat. Die Regeln mancher Kantone haben aber **Kanten**:
Im Modell gibt es Einkommensstufen, an denen eine Lohnerhöhung zu mehr Restprämie führt, als netto dazukommt. Als
Petitions-Argument nur je Kanton, mit Stufe als Näherung, Quelle der Obergrenze, dem Zeitverzug über die Steuerveranlagung
und **nach Bestätigung durch die kantonale Stelle** (SOVAR, OCAB). Nie «eine Lohnerhöhung kostet den Haushalt Geld» ohne
diese Einschränkungen, und nie als «die Schweiz».

## Grenzen dieser Auswertung

- Gleiche Annahmen wie die Messung (Grenzen 1–8 im Konzept). Familienzulagen fehlen weiter: Kein Kantonsmodul liest sie.
- Ohne Steuern. Eine echte Rechnung «Was bleibt?» braucht Steuer + IPV (+ allenfalls Sozialhilfe). Die Steuerprogression
  käme zur Abschöpfung oben dazu.
- Franchise nicht variiert: Die Musterprämie hängt im Code nicht an der Franchise. Variieren würde nur die Kantonsregel (NE),
  nicht die Prämie. Das gäbe ein schiefes Bild.
- Die Stufen sind 4'000 breit. Eine Kante liegt irgendwo innerhalb der Stufe, nicht genau an ihren Rändern (bei AR im
  Modell zwischen massgebend 43'880 und 47'432; Einschätzung des Prüfers, nicht nachgerechnet).
