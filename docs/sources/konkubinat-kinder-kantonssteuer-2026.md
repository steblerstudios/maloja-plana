# Konkubinat mit Kindern und Kantonssteuer — Messung 2026 (K62-Nachlauf B)

Frage: Darf die App für eine Person im Konkubinat **mit Kindern** die Stütztabelle «ledig mit
Kindern» (alleinerziehend, `kantonssteuer-tabelle-2026.md`) lesen? Die Messung aus K62.1
(`konkubinat-kantonssteuer-2026.md`) galt nur ohne Kinder; mit Kindern zeigte die App ausserhalb
BE/JU/VS eine Kantonszahl nach dieser Reihe, ohne dass es gemessen war.

## Rechtsgrundlage

- **DBG Art. 9 Abs. 1 und 1bis, StHG Art. 3 Abs. 3 und 4** — Konkubinatspaare werden einzeln
  besteuert (Belege und Fassungen: `konkubinat-kantonssteuer-2026.md`).
- **DBG Art. 36 Abs. 2bis** — der Elterntarif setzt Kinder oder unterstützungsbedürftige Personen im
  gleichen Haushalt voraus, deren Unterhalt die steuerpflichtige Person zur Hauptsache bestreitet.
  Im Konkubinat erhält ihn höchstens eine der beiden Personen. Der Wortlaut ist für diesen Nachlauf
  **nicht neu gelesen**; die Stelle ist dieselbe wie im Quellenblatt K62.1.
- **DBG Art. 35 Abs. 1 lit. a** — Kinderabzug. Wie er zwischen zwei nicht verheirateten Eltern im
  selben Haushalt aufgeteilt wird, ist hier **nicht geprüft** (siehe «Offen»).

## Wie der ESTV-Rechner Kinder im Konkubinat abbildet

Die Schnittstelle `API_calculateDetailedTaxes` nimmt Kinder als Liste `Children: [{ Age }]` — **nur
das Alter, keine Zuordnung zu einer Person**, kein Feld für Sorgerecht oder Unterhalt. Abgefragt bei
Brutto 80 000 (Abzugsposten je Kanton und Kinderzahl in der Messdatei, `abzuegeKanton`):

- Der **volle Kinderabzug** steht bei Person 1, Bund und Kanton (z. B. ZH, 1 Kind: Bund 6 800,
  Kanton 9 400 — gleich wie ledig).
- **Bundessteuer im Konkubinat = ledig mit Kindern** an allen Punkten. Die Reihe «ledig mit Kindern»
  der ESTV ist mit Elterntarif gerechnet (geprüft in `steuerband-messen.mjs` gegen
  `berechneBundessteuer({ elterntarif: kinder > 0 })`); die ESTV gibt Person 1 im Konkubinat also den
  Elterntarif und den ganzen Kinderabzug.
- Ein **Einkommen der Person 2** (Revenue2 60 000) ändert an keinem der 104 Kontrollpunkte etwas —
  der Rechner teilt nichts auf.

**Annahme, die daraus folgt:** Die gemessene Zahl gilt für die Lage «Person 2 ohne Einkommen, die
Kinder und der Unterhalt ganz bei Person 1». Die App zeigt im Konkubinat mit Kindern darum nur dann
eine Zahl, wenn das Partnereinkommen ausdrücklich 0 ist: bei Partnereinkommen > 0 `grund: 'partner'`
(seit K62.1), bei nie beantworteter Angabe `grund: 'konkubinatKinderOffen'` (K117, #312). Die
Kantonszahl mit Kindern zudem nur mit bestätigtem Elterntarif (wie für ledige Eltern).

## Messung

- **ESTV-Steuerrechner**, `API_calculateDetailedTaxes`, Steuerjahr 2026, Kantonshauptort,
  unselbständig, Alter 40, Konfession andere/keine, ohne Vermögen, Kinder je 8 Jahre.
- **Konkubinat** = `Relationship: 3`, Person 2 Alter 40 ohne Einkommen. **ledig** = `Relationship: 1`
  (alleinerziehend) — **im selben Lauf** Punkt für Punkt neben dem Konkubinat abgefragt, damit eine
  Abweichung nicht aus einem anderen Stand des Rechners stammt.
- 26 Kantone × **1, 2 und 3 Kinder** × 68 Bruttolöhne (dasselbe Raster wie die Tabelle) = 5 304 Punkte.
  Die App liest die Tabelle mit bis zu 3 Kindern; darum auch 3 gemessen, nicht nur 1 und 2.
- Seriell, 150 ms Pause zwischen zwei Abrufen (`PAUSE_MS`), nur lesend. Zwei Läufe:
  2026-09-24T00:21Z–00:45Z (1 und 2 Kinder, 7 280 Abrufe) und 2026-09-24T11:17Z–11:30Z (3 Kinder,
  3 536 Abrufe). Je Lauf eine Gegenprobe: eine erfundene Operation scheitert.
- Skript: `scripts/konkubinat-kinder-messen.mjs` (gemeinsame Anbindung `scripts/estv-schnittstelle.mjs`).
  Rohwerte: `konkubinat-kinder-kantonssteuer-2026.messpunkte.json`.
- Kontrolle Tabelle: die im selben Lauf gemessenen Werte «ledig mit Kindern» stimmen an allen 5 304
  Punkten mit `kantonssteuer-kinder-2026.messpunkte.json` überein (±1) — die Tabelle der App ist aktuell.

## Ergebnis

| | Konkubinat mit Kindern gegen ledig mit Kindern |
|---|---|
| Steuerbares Einkommen Bund, Bundessteuer | an allen 5 304 Punkten gleich |
| Einkommen der Person 2 | ändert an keinem der 104 Punkte etwas |
| Kantons- und Gemeindesteuer | gleich in 20 Kantonen, **abweichend in BE, BS, JU, OW, UR, VD** |

Abweichungen der Kantons- und Gemeindesteuer (Konkubinat minus ledig, immer > 0). Unterhalb des
ersten abweichenden Punkts zahlen beide keine Kantons- und Gemeindesteuer (UR: nur die gleiche
Personalsteuer CHF 70); ab dort weicht **jeder** Punkt bis Brutto 300 000 ab.

| Kanton | 1 Kind | 2 Kinder | 3 Kinder |
|---|---|---|---|
| BE | 66/68, ab Brutto 25 000, CHF 182–994 (80 000: 7 256 → 7 892) | 62/68, ab 35 000, CHF 147–1 343 (5 386 → 6 295) | 58/68, ab 45 000, CHF 91–1 665 (3 402 → 4 545) |
| BS | 59/68, ab 42 500, CHF 400–2 752 (4 578 → 7 330) | 55/68, ab 52 500, CHF 358–2 752 (2 688 → 5 440) | 51/68, ab 62 500, CHF 316–2 752 (798 → 3 550) |
| JU | 66/68, ab 25 000, CHF 150–8 669 (5 660 → 8 540) | 63/68, ab 32 500, CHF 167–8 639 (4 357 → 6 977) | 59/68, ab 42 500, CHF 167–8 600 (3 002 → 5 276) |
| OW | 63/68, ab 32 500, CHF 243–1 280 (4 837 → 6 117) | 60/68, ab 40 000, CHF 282–1 280 (3 942 → 5 222) | 58/68, ab 45 000, CHF 13–1 280 (3 059 → 4 338) |
| UR | 63/68, ab 32 500, CHF 234–817 (5 265 → 6 082) | 59/68, ab 42 500, CHF 181–817 (3 992 → 4 809) | 55/68, ab 52 500, CHF 129–817 (2 718 → 3 535) |
| VD | 60/68, ab 40 000, CHF 83–3 684 (6 566 → 8 012) | 58/68, ab 45 000, CHF 32–3 093 (4 449 → 5 199) | 55/68, ab 52 500, CHF 61–2 524 (2 794 → 3 379) |

Klammer: Kantons- und Gemeindesteuer bei Brutto 80 000, ledig → Konkubinat.

**Welche Posten abweichen** (Abzugsposten Kanton der ESTV, Brutto 80 000, 1 Kind; Bezeichnungen wie
von der ESTV geliefert):

| Kanton | ledig (alleinerziehend) | Konkubinat |
|---|---|---|
| BE | «Abzug für Alleinstehende» 2 400, «Kinderabzug für Alleinstehende» 1 300 | — |
| BS | «Abzug Alleinstehende mit Kindern» 32 600 | «Abzug für in Konkubinat Lebende oder Alleinstehende ohne Kinder» 19 500 |
| JU | «Abzug Alleinstehende mit Kindern» 2 700 | — |
| OW | «Abzug Alleinstehende mit Kindern» 10 000 | — |
| UR | «Abzug Alleinstehende mit Kindern» 21 200 | «Abzug ledige Personen» 15 300 |
| VD | «Abzug Verheiratete oder Alleinerzieher» 3 800, «Mieterabzug» 4 606 | 1 000, 2 006 |

Die Posten zeigen, **was** die ESTV anders rechnet — nicht, ob das kantonale Gesetz es so verlangt.
Die kantonalen Gesetze sind dafür nicht gelesen worden, darum steht in der App nur «rechnet anders».

**VS:** mit Kindern an allen 204 Punkten gleich wie ledig (ohne Kinder bis Brutto 45 000 nicht).

## Regel in der App

`src/data/kantonaleSteuerdaten.js`:

- `KONKUBINAT_MIT_KINDERN_WIE_LEDIG_AB = { BE, BS, JU, OW, UR, VD: Infinity }` — im Konkubinat mit
  Kindern dort **keine Kantonszahl** (`grund: 'konkubinatKanton'`, derselbe Text wie ohne Kinder),
  die Bundessteuer bleibt. Infinity statt einer Schwelle: unterhalb des ersten abweichenden Punkts
  ist die Steuer in beiden Fällen 0, darüber weicht jeder Punkt ab.
- `konkubinatWieLedigAb(kanton, kinder)` wählt: ohne Kinder `KONKUBINAT_WIE_LEDIG_AB` (K62.1), mit
  Kindern die Tabelle oben. Folge für VS: mit Kindern jetzt eine Kantonszahl auch unter Brutto 45 000
  (gemessen gleich); vorher griff dort die Schwelle von ohne Kinder.
- Vorher → jetzt, Konkubinat mit Kindern, Partnereinkommen ausdrücklich 0:
  BS, OW, UR, VD zeigten eine Kantonszahl nach «ledig mit Kindern», die ESTV rechnet höher → jetzt
  keine. BE, JU waren schon gesperrt (Tabelle ohne Kinder, Infinity). Die übrigen 20 Kantone: Zahl
  bleibt, jetzt gemessen belegt.
- Test: `src/__tests__/k62KonkubinatKinder.test.js` liest diese Messdatei — jeder abweichende Punkt
  muss gesperrt sein, genau diese sechs Kantone, und die gezeigten Zahlen liegen im Rahmen der
  ESTV-Werte «Konkubinat» (±3 % oder CHF 50) bei 1 und 2 Kindern, Brutto 80 000.

## Offen

- ~~Konkubinat mit Kindern, Partnereinkommen nie beantwortet~~ — geregelt mit K117 (#312, parallel
  gemergt): dann keine Kantonszahl (`konkubinatKinderOffen`).
- ~~Die Aufteilung von Kinderabzug und Elterntarif unter nicht verheirateten Eltern ist nicht gelesen~~ —
  gelesen 24.09.2026 (Deploy-Gate 0.1.40-beta), siehe unten. Die App rechnet weiter den ganzen Abzug
  und sagt es als Annahme (`annahmen.kinderabzugGanz`, Text `tax.annahmeKinderabzugKonkubinat`).
- Offen bleibt: wie die **Kantone** (StHG, kantonale Gesetze) teilen — nicht gelesen. Der Annahme-Text
  sagt «Wie der Kanton den Abzug aufteilt, ist nicht geprüft».

## ESTV-Kreisschreiben Nr. 30 — Kinderabzug und Elterntarif im Konkubinat

- Quelle: ESTV, Kreisschreiben Nr. 30 «Ehepaar- und Familienbesteuerung nach dem Bundesgesetz über die
  direkte Bundessteuer (DBG)», Bern, 21. Dezember 2010. Abgerufen 24.09.2026 als PDF (58 Seiten,
  1 624 573 Bytes, PDF-Änderungsdatum 21.06.2017) unter
  `https://www.estv2.admin.ch/dvs/kreisschreiben/dbst-ks-2010-1-030-d-de.pdf`.
  Gegenprobe: dieselbe Adresse mit erfundener Nummer (`…-1-099-d-de.pdf`) → HTTP 404; die alte
  `www.estv.admin.ch/dam/…`-Adresse → HTTP 502. Es ist also keine Hülle, die jede Adresse bedient.
- Ziff. 14.8 «Unverheiratete Eltern (gemeinsamer Haushalt), mit gemeinsamem minderjährigem Kind, mit
  gemeinsamer elterlicher Sorge, keine Unterhaltszahlungen», 14.8.1 Abzüge, wörtlich:
  «Jeder Elternteil kann je den halben Kinderabzug sowie den halben Versicherungs- und
  Sparzinsenabzug für das Kind geltend machen.»
- 14.8.2 Tarife, wörtlich: «Der Elternteil, der zur Hauptsache für den Unterhalt des Kindes aufkommt,
  erhält den Elterntarif. Hierbei ist davon auszugehen das dies in der Regel derjenige Elternteil mit
  dem höheren Einkommen ist.» — Die App rechnet eine Zahl im Konkubinat mit Kindern nur mit
  Partnereinkommen 0 (sonst `grund 'partner'`); dann hat die Person das höhere Einkommen, der
  Elterntarif bei ihr entspricht der Regel. Darum nennt die Annahme nur den Kinderabzug.
- 14.6 (ohne gemeinsame elterliche Sorge, keine Unterhaltszahlungen): der Elternteil mit der
  elterlichen Sorge erhält Kinderabzug und Elterntarif — dort stimmt die Rechnung der App, wenn die
  Sorge bei der Person liegt.
- Ziff. 10.2: «Nicht massgebend für die hälftige Aufteilung des Kinderabzuges ist der Umfang der
  alternierenden Obhut.»
- Die Beträge im PDF (z. B. Drittbetreuung 5 050 / 10 100 Franken) sind veraltet; das Kreisschreiben
  ist hier nur für die Aufteilungsregel gelesen, nicht für Beträge.
- Wirkung: halber statt ganzer Kinderabzug heisst ein höheres oder gleiches steuerbares Einkommen,
  also eine gleich hohe oder höhere Bundessteuer. Die Zahl der App ist in diesem Fall eine Untergrenze.
