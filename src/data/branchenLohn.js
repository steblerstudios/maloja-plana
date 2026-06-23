// BFS Lohnstrukturerhebung (LSE) 2022 — Monatlicher Bruttomedianlohn
// Quelle: BFS T39 «Monatlicher Bruttolohn nach Wirtschaftsabteilungen»
// Vollzeit-Äquivalent, privater + öffentlicher Sektor
// Stand: 2022 (letzte veröffentlichte Erhebung, Publikation Nov 2024)

export const BRANCHENLOHN_VERSION = '2022';

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
