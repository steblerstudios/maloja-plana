// Höchstabzug Säule 3a — die EINE Quelle für diese Zahl.
//
// Warum es diese Datei gibt: Der Betrag stand an zwei Stellen im Code
// (Saeule3aTracker.jsx, TaxCalculator.jsx) und in fünf Dokumenten. Die Dokumente trugen
// 7'056 ausdrücklich als «Stand 2026» — das ist der Wert der Steuerjahre 2023/2024, also
// zwei Anpassungen alt. Ein Wert, der an sieben Stellen von Hand wiederholt wird, wird an
// der achten vergessen.
//
// Bewusst ein Blatt ohne eigene Importe: Saeule3aTracker.jsx wird lazy geladen: ein Import
// aus kantonaleSteuerdaten.js zöge die Kantonstabelle (33 KB) und den Rechenkern (14 KB)
// in dessen Chunk.
//
// Quelle (abgerufen 23.09.2026): ESTV, «Zinssätze / Höchstabzüge Säule 3a bei der Direkten
// Bundessteuer DBST», Tabelle «Höchstabzüge Säule 3a»:
//   https://www.estv.admin.ch/estv/de/home/direkte-bundessteuer/dbst-steuertarife/zinssaetze.html
//   | Steuerjahr | mit 2. Säule | ohne 2. Säule |
//   | 2026, 2025 |        7'258 |        36'288 |
//   | 2024, 2023 |        7'056 |        35'280 |
//   | 2022, 2021 |        6'883 |        34'416 |
//   «Die Höchstabzüge bilden zugleich die massgeblichen Einzahlungslimiten.»
//
// Gegenprobe (abgerufen 23.09.2026): BSV-FAQ «Welche Beiträge kann ich in die Säule 3a
// einzahlen?» — «maximal 7'258 Franken pro Jahr in die Säule 3a einzahlen (Stand 2025/26)»,
// ohne Pensionskasse 20 % des Einkommens, «maximal aber 36'288 Franken (Stand 2025/26)».
//   https://faq.bsv.admin.ch/de/berufliche-vorsorge-und-3-saeule/welche-beitraege-kann-ich-die-saeule-3a-einzahlen
//
// Rechtsgrundlage: BVV 3 (SR 831.461.3) Art. 7 Abs. 1 lit. a und b.
// Für das Steuerjahr 2026 unverändert: Medienmitteilung EFD vom 17.11.2025,
//   https://www.admin.ch/de/newnsb/xgRMirCsezICX4rtof9Lm
//
// 🛑 `ohnePensionskasse` ist der DECKEL, nicht der Abzug: Wer keiner 2. Säule angehört,
// zieht 20 % des Erwerbseinkommens ab, höchstens aber diesen Betrag. Die App deckelt
// heute alle bei `mitPensionskasse` — für Selbständige ohne PK ist das zu tief (offener
// Punkt, siehe docs/product/swiss-knowledge-registry.md).

export const SAEULE3A_HOECHSTABZUG = {
  mitPensionskasse: 7258,
  ohnePensionskasse: 36288,
  satzOhnePensionskasse: 0.20,
  steuerjahr: 2026,
  abgerufen: '2026-09-23',
  quelle: 'ESTV, Höchstabzüge Säule 3a bei der Direkten Bundessteuer (BVV 3 Art. 7 Abs. 1)',
};

// Bequemer Kurzname für den häufigen Fall (Angestellte mit Pensionskasse).
export const SAEULE3A_MAX = SAEULE3A_HOECHSTABZUG.mitPensionskasse;
