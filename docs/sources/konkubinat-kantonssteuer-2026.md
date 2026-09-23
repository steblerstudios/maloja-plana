# Konkubinat und Kantonssteuer — Messung 2026 (K62.1)

Frage: Darf die App für eine Person im Konkubinat (nicht verheiratet, keine Kinder) die Stütztabelle
«ledig» (`kantonssteuer-tabelle-2026.md`) lesen? Bis K62.1 zeigte sie in diesem Fall keine Kantonszahl,
sobald ein Partnereinkommen erfasst war, die Bundessteuer aber schon.

## Rechtsgrundlage

- **DBG Art. 9 Abs. 1 und 1bis** (SR 642.11, Fedlex, Fassung 1. Jan. 2026, gelesen 23.09.2026):
  zusammengerechnet wird das Einkommen der Ehegatten «in rechtlich und tatsächlich ungetrennter Ehe» und
  von Personen in eingetragener Partnerschaft. Konkubinatspaare sind nicht genannt, jede Person ist
  einzeln steuerpflichtig. Datei:
  <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1991/1184_1184_1184/20260101/de/html/fedlex-data-admin-ch-eli-cc-1991-1184_1184_1184-20260101-de-html.html>
- **DBG Art. 36 Abs. 2bis**: der Elterntarif setzt Kinder oder unterstützungsbedürftige Personen im
  gleichen Haushalt voraus. Ohne Kinder gilt für eine Person im Konkubinat der Grundtarif (Abs. 1).
- **StHG Art. 3 Abs. 3 und 4** (SR 642.14, Fedlex, Fassung 1. Jan. 2025, gelesen 23.09.2026) — für die
  Kantone dasselbe: Einkommen der Ehegatten wird zusammengerechnet, Abs. 3 gilt für eingetragene
  Partnerschaften sinngemäss. Datei:
  <https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1991/1256_1256_1256/20250101/de/html/fedlex-data-admin-ch-eli-cc-1991-1256_1256_1256-20250101-de-html.html>
- Hinweis zur Quelle: der Fedlex-Dateispeicher antwortet auch auf erfundene Adressen mit 200 (eine
  9 148 Byte grosse Hülle). Belegt ist eine Fassung erst durch den Inhalt; die Fassung StHG 20260101
  war eine solche Hülle, darum die Fassung 20250101.

Das Gesetz sagt, dass einzeln besteuert wird — nicht, dass die Kantone eine Person im Konkubinat wie
eine allein lebende rechnen. Das ist gemessen.

## Messung

- **ESTV-Steuerrechner**, `API_calculateDetailedTaxes` (dieselbe Schnittstelle wie
  `scripts/steuerband-messen.mjs`), Steuerjahr 2026, Kantonshauptort, unselbständig, Alter 40,
  Konfession andere/keine, ohne Kinder, ohne Vermögen.
- **Konkubinat** = `Relationship: 3` (der Rechner kennt 1 ledig, 2 verheiratet, 3 Konkubinat,
  4 eingetragene Partnerschaft), Person 2 Alter 40 ohne Einkommen; 26 Kantone × 68 Bruttolöhne
  (dieselben wie die Tabelle), abgerufen 2026-09-23T21:04Z.
- **ledig** = die Messpunkte der Tabelle vom 16.09.2026; für BE, JU, TI und VS am selben Abend neu
  abgefragt (`Relationship: 1`, 2026-09-23T21:10Z), damit die Abweichung nicht aus einem anderen Stand
  des Rechners stammt.
- **Zweites Einkommen:** Konkubinat mit Person 2 ohne Einkommen gegen Person 2 mit Brutto 60 000,
  26 Kantone × 4 Bruttolöhne (30 000, 80 000, 150 000, 250 000). Kontrolle, dass der Rechner das
  zweite Einkommen überhaupt liest: verheiratet ZH 80 000, Total 5 167 → 13 774.
- Gegenprobe: eine erfundene Operation scheitert (wie beim Tabellen-Skript).
- Rohwerte: `konkubinat-kantonssteuer-2026.messpunkte.json`.

## Ergebnis

| | Konkubinat gegen ledig |
|---|---|
| Steuerbares Einkommen Bund, Bundessteuer | an allen 1 768 Punkten gleich |
| Einkommen der zweiten Person | ändert an keinem der 104 Punkte etwas (Bund, Kanton, steuerbar) |
| Kantons- und Gemeindesteuer | gleich in 23 Kantonen, **abweichend in BE, JU, VS** |

Abweichungen der Kantons- und Gemeindesteuer (Konkubinat minus ledig, immer ≥ 0):

| Kanton | Punkte | Betrag | Beobachtung |
|---|---|---|---|
| BE | 68 von 68 | CHF 403 (Brutto 30 000) bis 683 (300 000) | steuerbares Einkommen Kanton im Konkubinat 2 400 höher (Stichprobe, 4 Bruttolöhne) |
| JU | 68 von 68 | CHF 269 bis 495 | steuerbares Einkommen Kanton 1 800 höher (Stichprobe, 4 Bruttolöhne) |
| VS | 11 von 68 | bis CHF 1 259 | nur bis Brutto 45 000 (steuerbar Bund 37 213); ab 47 500 (39 417) gleich |

Die Messung zeigt, **dass** diese drei Kantone Konkubinat anders rechnen; welcher Abzug es ist, wurde
nicht an den kantonalen Gesetzen geprüft und steht deshalb nicht in der App.

**Nebenbefund TI:** Konkubinat und ledig sind live gleich. Die Messpunkte «ledig» vom 16.09. liegen für
TI aber an 67 von 68 Punkten über dem heutigen Rechner, bis CHF 250 (z. B. Brutto 30 000: 863 → heute
806; 80 000: 8 682 → 8 568); an 9 Punkten (Brutto 22 500–47 500) ausserhalb der Grenze der Tabelle
(±3 % oder CHF 50). Der ESTV-Rechner hat die TI-Werte seit dem 16.09. geändert; die Tabelle ist für TI
neu zu messen (eigener Punkt, nicht Teil von K62). In der Messdatei stehen für TI die Werte von heute.

## Regel in der App

`src/data/kantonaleSteuerdaten.js`:

- Nicht verheiratet, ohne Kinder, Partnereinkommen > 0 oder Zivilstand «Konkubinat» → die Tabelle
  «ledig» gilt, mit der sichtbaren Annahme «gerechnet für Sie allein» (`annahmen.einzeln`).
- `KONKUBINAT_WIE_LEDIG_AB = { BE: Infinity, JU: Infinity, VS: 39417 }` — darunter keine Kantonszahl
  (`grund: 'konkubinatKanton'`), die Bundessteuer bleibt. Zwischen dem letzten abweichenden und dem
  ersten gleichen Punkt in VS wird nicht interpoliert.
- Konkubinat **mit** Kindern bleibt ohne Zahl, sobald ein Partnereinkommen erfasst ist (Aufteilung
  des Kinderabzugs, DBG Art. 35 Abs. 1 lit. a; nicht gemessen).
- Der Test `src/__tests__/k62Konkubinat.test.js` liest diese Messdatei und prüft, dass die Regel jeden
  abweichenden Punkt sperrt und die gezeigten Zahlen im Rahmen der ESTV-Werte liegen.
