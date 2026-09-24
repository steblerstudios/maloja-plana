// Jahreslohn aus dem Kapitel Finanzen für EO, AHV und BVG — nicht zweimal eingeben.
//
// Alle drei rechnen mit dem AHV-pflichtigen BRUTTOlohn (EOG Art. 11 Abs. 1, BVG Art. 7 Abs. 2)
// — der 13. Monatslohn gehört dazu. Darum:
// - als Netto hinterlegt → nicht vorbefüllen (falsche Basis), der Rechner zeigt einen Hinweis;
//   so macht es der ALV-Rechner seit jeher.
// - 13. Monatslohn «Ja» → ×13, sonst ×12.
// Leer, wenn kein Monatslohn erfasst ist.

export const lohnIstNetto = (finanzen) => finanzen?.incomeType === 'netto';

export function jahreslohnAusProfil(finanzen) {
  if (lohnIstNetto(finanzen)) return '';
  const m = Number(finanzen?.monthlyIncome);
  if (!Number.isFinite(m) || m <= 0) return '';
  return String(Math.round(m * (finanzen?.dreizehnter === 'yes' ? 13 : 12)));
}
