// BFS Lohnstrukturerhebung (LSE) — Monatlicher Bruttomedianlohn
// Quelle: BFS T39 «Monatlicher Bruttolohn nach Wirtschaftsabteilungen»
// Vollzeit-Äquivalent, privater + öffentlicher Sektor
//
// ⚠️ ZWEI JAHRGÄNGE, BEWUSST GETRENNT (Predeploy-Runde 8, Stebler-Studios-Entscheid):
//   · LSE_VERTEILUNG (Barometer)  = LSE **2024** — alle Werte amtlich belegt, siehe unten.
//   · BRANCHENLOHN   (Branchen)   = LSE **2022** — die Branchen-Werte stehen NICHT in der
//     Medienmitteilung; sie einzeln aus T39 zu belegen ist ein eigener Rechercheschritt
//     (offen, siehe `SESSION_START.md`). Überholt, aber ehrlich benannt: die Quellenzeile
//     nennt 2022. Das ist etwas anderes als eine Zahl, die dem BFS etwas zuschreibt, was
//     es nie gesagt hat — genau daran ist Runde 8 gescheitert.
export const BRANCHENLOHN_VERSION = '2022';

// Gesamtwirtschaftliche Verteilungswerte für die Lohn-Einordnung (Barometer).
// LSE 2024 — ALLE drei Werte wörtlich amtlich belegt:
//   BFS-Medienmitteilung „2024 lag der Medianlohn bei 7024 Franken brutto —
//   Schweizerische Lohnstrukturerhebung (LSE) im Jahr 2024: Erste Ergebnisse", 25.11.2025
//   → https://www.bfs.admin.ch/asset/de/36195847
//   Zitat: „Im Jahr 2024 belief sich der monatliche Bruttomedianlohn für eine Vollzeitstelle
//   (privater und öffentlicher Sektor zusammen) auf 7024 Franken pro Monat (2022: 6788
//   Franken). Die 10% der Arbeitnehmenden mit den tiefsten Löhnen verdienten weniger als
//   4635 Franken pro Monat, während die am besten bezahlten 10% der Arbeitnehmenden einen
//   Lohn von über 12 526 [Franken erhielten]."
//
// ⚠️ `durchschnitt` ist ERSATZLOS RAUS (war 7996, LSE 2022). Er stand unter einer
// BFS-Quellenangabe, die ihn namentlich nannte, war aber nie belegt: das BFS publiziert
// den Mittelwert nur in STAT-TAB (interaktive Datenbank, nicht zitierbar). Drei
// unabhängige Prüfer haben das in Runde 8 gefunden. Kein Ersatz erfunden — der Median
// trägt das Barometer, die Skala hing nie am Durchschnitt.
//
// Kein `verify`-Flag mehr: was hier steht, ist belegt. Käme je wieder ein ungeprüfter
// Wert dazu, gehörte er NICHT unter die Quellenzeile — `verify: true` hiess in Runde 8
// „vor Deploy belegen" und wurde als „darf trotzdem angezeigt werden" gelesen.
export const LSE_VERTEILUNG = {
  median: 7024,
  p10: 4635,
  p90: 12526,
  jahr: 2024,
  quelle: 'BFS LSE 2024, Medienmitteilung 25.11.2025',
};

// Nenner für die Hochrechnung auf Vollzeit, wenn mit LSE-Werten verglichen wird.
// AMTLICH BELEGT — BFS, „Definition : Lohn", Abschnitt Schweizerische Lohnstrukturerhebung:
//   „Präsentiert werden die Ergebnisse als standardisierte Bruttomonatslöhne (Umrechnung
//   auf ein Vollzeitäquivalent von 4 1/3 Wochen zu 40 Arbeitsstunden)."
//   → https://www.bfs.admin.ch/asset/de/5933418
//
// ⚠️ NICHT mit `VOLLZEIT_STUNDEN_WOCHE` (42) aus `lohnCheck.js` verwechseln — das ist die
// Mindestlohn-Welt (kantonales Recht, Stundenlohn × 182). Zwei Normen, zwei Konstanten.
// Ausgeschlossen: 41.7 — das ist die BFS-Normalarbeitszeit-Statistik, ein anderes
// Erhebungsobjekt, das in der LSE-Lohndefinition nicht vorkommt.
export const LSE_VOLLZEIT_STUNDEN_WOCHE = 40;

export const BRANCHENLOHN = [
  { key: 'gesamt', lohn: 6788 },
  { key: 'it', lohn: 9412 },
  { key: 'pharma', lohn: 10044 },
  { key: 'finanz', lohn: 9784 },
  { key: 'versicherung', lohn: 8821 },
  { key: 'beratung', lohn: 8579 },
  { key: 'telekom', lohn: 8975 },
  { key: 'energie', lohn: 8674 },
  { key: 'oeffentlich', lohn: 8234 },
  { key: 'bildung', lohn: 8012 },
  { key: 'gesundheit', lohn: 6732 },
  { key: 'bau', lohn: 6148 },
  { key: 'industrie', lohn: 6404 },
  { key: 'handel', lohn: 5849 },
  { key: 'transport', lohn: 5996 },
  { key: 'gastro', lohn: 4479 },
  { key: 'reinigung', lohn: 4549 },
  { key: 'landwirtschaft', lohn: 4962 },
  { key: 'detailhandel', lohn: 5017 },
];

export function getBranchenvergleich(monatslohn) {
  if (!monatslohn || monatslohn <= 0) return null;
  const gesamt = BRANCHENLOHN.find(b => b.key === 'gesamt');
  const sorted = [...BRANCHENLOHN].filter(b => b.key !== 'gesamt').sort((a, b) => a.lohn - b.lohn);
  const hoeher = sorted.filter(b => b.lohn <= monatslohn).length;
  const percentile = Math.round((hoeher / sorted.length) * 100);
  return {
    gesamtMedian: gesamt.lohn,
    percentile,
    hoeherAls: hoeher,
    vonGesamt: sorted.length,
    naechsteUeber: sorted.find(b => b.lohn > monatslohn) || null,
    naechsteUnter: [...sorted].reverse().find(b => b.lohn <= monatslohn) || null,
  };
}
