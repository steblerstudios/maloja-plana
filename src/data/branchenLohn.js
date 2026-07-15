// BFS Lohnstrukturerhebung (LSE) 2022 — Monatlicher Bruttomedianlohn
// Quelle: BFS T39 «Monatlicher Bruttolohn nach Wirtschaftsabteilungen»
// Vollzeit-Äquivalent, privater + öffentlicher Sektor
// Stand: 2022 (letzte veröffentlichte Erhebung, Publikation Nov 2024)

export const BRANCHENLOHN_VERSION = '2022';

// Gesamtwirtschaftliche Verteilungswerte für die Lohn-Einordnung (Barometer).
// Der Median 6788 ist amtlich belegt (BFS-Medienmitteilung „2022 lag der Medianlohn bei
// 6788 Franken", 19.03.2024) und steht auch unten in BRANCHENLOHN als `gesamt`.
//
// ⚠️ `durchschnitt`, `p10` und `p90` sind NICHT amtlich gegengeprüft: Das BFS publiziert
// Mittelwert und Perzentile nur in der interaktiven Datenbank STAT-TAB, nicht auf einer
// zitierbaren Seite. Sie stammen aus der ursprünglichen Bauphase (sekundär belegt).
// → Vor dem nächsten Deploy vom `swiss-precision`-Prüfer an STAT-TAB gegenlesen.
// Wahrheits-Disziplin: `verify: true` heisst hier NICHT „nicht anzeigen", sondern
// „vor Deploy belegen" — die Zahl steht unter einer BFS-Quellenangabe.
export const LSE_VERTEILUNG = {
  median: 6788,
  durchschnitt: 7996,
  p10: 4487,
  p90: 12178,
  jahr: 2022,
  verify: true,
};

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
