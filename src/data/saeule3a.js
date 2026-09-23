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

// 🛑 NICHT NUR DAS LAUFENDE JAHR. Die Tabelle oben stand bis zum 23.09.2026 nur als
// Kommentar hier — und genau das reichte nicht: Die Prämienverbilligung rechnet nicht mit dem
// Höchstabzug des laufenden Jahres, sondern mit dem des BEMESSUNGSJAHRES. Im Kanton Bern ist
// das die definitive Veranlagung des vorletzten Steuerjahres (KKVV Art. 7 Abs. 1), für das
// Anspruchsjahr 2026 also 2024 — dort galten 7'056, nicht 7'258. Eine Aufrechnung kann nicht
// grösser sein als der Abzug, den sie rückgängig macht.
// Wer hier ein Jahr fortschreibt, ändert damit NICHT nur den Steuerrechner, sondern auch die
// Prämienverbilligung von BE — zwei Jahre später. Darum die Jahre einzeln, nicht ein Wert.
// Werte wörtlich aus der ESTV-Tabelle «Höchstabzüge Säule 3a», an der Quelle abgelesen am
// 23.09.2026 (alle sechs publizierten Jahre, nicht nur die gebrauchten).
export const SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR = Object.freeze({
  2026: Object.freeze({ mitPensionskasse: 7258, ohnePensionskasse: 36288 }),
  2025: Object.freeze({ mitPensionskasse: 7258, ohnePensionskasse: 36288 }),
  2024: Object.freeze({ mitPensionskasse: 7056, ohnePensionskasse: 35280 }),
  2023: Object.freeze({ mitPensionskasse: 7056, ohnePensionskasse: 35280 }),
  2022: Object.freeze({ mitPensionskasse: 6883, ohnePensionskasse: 34416 }),
  2021: Object.freeze({ mitPensionskasse: 6883, ohnePensionskasse: 34416 }),
});

// Höchstabzug für Angestellte mit Pensionskasse in EINEM bestimmten Steuerjahr.
// Gibt `null` zurück, wenn das Jahr nicht belegt ist — bewusst nicht den nächstbesten Wert:
// ein stiller Rückfall aufs laufende Jahr wäre genau der Fehler, den diese Tabelle verhindert.
// Wer `null` bekommt, zeigt keine Zahl (so macht es ipvBern.js), statt eine zu raten.
export function saeule3aMaximum(steuerjahr) {
  return SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR[steuerjahr]?.mitPensionskasse ?? null;
}

export const SAEULE3A_HOECHSTABZUG = {
  ...SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR[2026],
  satzOhnePensionskasse: 0.20,
  steuerjahr: 2026,
  abgerufen: '2026-09-23',
  quelle: 'ESTV, Höchstabzüge Säule 3a bei der Direkten Bundessteuer (BVV 3 Art. 7 Abs. 1)',
};

// Bequemer Kurzname für den häufigen Fall: Angestellte mit Pensionskasse, LAUFENDES Jahr.
// 🛑 Richtig für «wie viel darf ich dieses Jahr einzahlen» (Saeule3aTracker, TaxCalculator).
// FALSCH für jede Rechnung, die auf einer älteren Veranlagung beruht — dort
// `saeule3aMaximum(bemessungsjahr)` verwenden.
export const SAEULE3A_MAX = SAEULE3A_HOECHSTABZUG.mitPensionskasse;

// ─── Einzahlungen nach Kalenderjahr ───────────────────────────────────────────
//
// 🛑 WARUM DAS HIER STEHT UND NICHT IM TRACKER (Befund 23.09.2026).
// Der Höchstabzug ist ein JAHRESbetrag, das Eingabefeld heisst «3. Säule A eingezahlt
// CHF/Jahr» — der Einzahlungs-Tracker summierte aber datumsblind über alle erfassten
// Zeilen. Wer ihn über mehrere Jahre weiterführt, wofür er gebaut ist, erzeugte damit eine
// «Jahreseinzahlung» über mehrere Jahre: drei Zeilen à 7'000 ergaben 21'000. Das lief in den
// Steuerrechner, in die Budget-Synchronisation (`pension3a / 12`) und in die Berner
// Prämienverbilligung.
// Die Jahreszuordnung gehört darum an dieselbe Stelle wie die Jahrestabelle: Anzeige,
// Formular und Rechenkerne müssen sie gleich lesen, sonst driftet sie wieder auseinander.

// In welches Kalenderjahr eine Zeile zählt. `null`, wenn sie kein lesbares Datum trägt.
function jahrDerZeile(zeile) {
  const j = String(zeile?.date || '').slice(0, 4);
  return /^\d{4}$/.test(j) ? Number(j) : null;
}

const betragDerZeile = (zeile) => Math.max(0, Number(zeile?.amount) || 0);

// Summe der Einzahlungen EINES Kalenderjahres.
// 🛑 Undatierte Zeilen zählen zum `laufendenJahr` — nicht gar nicht. Das ist die treue
// Lesart der Migration in ChapterView.jsx: ein alter Einzelwert aus dem Feld «eingezahlt
// CHF/Jahr» wird dort zu genau einer Zeile OHNE Datum, und gemeint war das laufende Jahr.
// Sie stillschweigend fallen zu lassen hiesse, bei jeder migrierten Person die Einzahlung
// auf 0 zu setzen — eine zu hohe Verbilligung und ein zu tiefer Steuerabzug.
export function einzahlungenImJahr(deposits, jahr, laufendesJahr = jahr) {
  return (Array.isArray(deposits) ? deposits : []).reduce((summe, zeile) => {
    const j = jahrDerZeile(zeile) ?? laufendesJahr;
    return j === jahr ? summe + betragDerZeile(zeile) : summe;
  }, 0);
}

// Alle Kalenderjahre mit erfassten Zeilen, aufsteigend. Undatierte zählen zum laufenden Jahr.
export function jahreMitEinzahlungen(deposits, laufendesJahr) {
  const jahre = new Set((Array.isArray(deposits) ? deposits : [])
    .map((zeile) => jahrDerZeile(zeile) ?? laufendesJahr));
  return [...jahre].sort((a, b) => a - b);
}

// Die grösste Summe, die in EINEM einzelnen Jahr eingezahlt wurde.
// `null`, wenn gar keine Zeilen erfasst sind — dann lässt sich nichts darüber sagen.
// Gebraucht von der Prämienverbilligung, um zu erkennen, ob ein gespeicherter
// `pension3a`-Wert überhaupt ein Jahresbetrag sein KANN (siehe kantonsModell.js).
export function groessteJahresEinzahlung(deposits, laufendesJahr) {
  const jahre = jahreMitEinzahlungen(deposits, laufendesJahr);
  if (!jahre.length) return null;
  return Math.max(...jahre.map((j) => einzahlungenImJahr(deposits, j, laufendesJahr)));
}
