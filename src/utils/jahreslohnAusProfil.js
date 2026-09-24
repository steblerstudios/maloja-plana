// Jahreslohn aus dem Kapitel Finanzen für EO, AHV und BVG — nicht zweimal eingeben.
//
// Alle drei rechnen mit dem AHV-pflichtigen BRUTTOlohn, dem massgebenden Lohn nach AHVG Art. 5
// Abs. 2 — EO: EOG Art. 11 Abs. 1 (Mutter-/Vaterschaft i. V. m. Art. 16e Abs. 2 / 16l), BVG:
// Art. 7 Abs. 2. Ein vereinbarter 13. Monatslohn gehört dazu. Darum:
// - als Netto hinterlegt → nicht vorbefüllen (falsche Basis), der Rechner zeigt einen Hinweis;
//   so macht es der ALV-Rechner seit jeher.
// - 13. Monatslohn «Ja» → ×13, sonst ×12.
// Leer, wenn kein Monatslohn erfasst ist. Ohne gewählte Einkommensart gilt der Lohn als brutto —
// wie im ALV-Rechner; der Rechner nennt die Basis im Feld-Hinweis.

export const lohnIstNetto = (finanzen) => finanzen?.incomeType === 'netto';

export function jahreslohnAusProfil(finanzen) {
  if (lohnIstNetto(finanzen)) return '';
  const m = Number(finanzen?.monthlyIncome);
  if (!Number.isFinite(m) || m <= 0) return '';
  return String(Math.round(m * (finanzen?.dreizehnter === 'yes' ? 13 : 12)));
}
