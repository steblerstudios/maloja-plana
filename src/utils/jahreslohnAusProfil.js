// Jahreslohn aus dem Kapitel Finanzen für EO, AHV und BVG — nicht zweimal eingeben.
//
// Alle drei rechnen mit dem AHV-pflichtigen BRUTTOlohn, dem massgebenden Lohn nach AHVG Art. 5
// Abs. 2 — EO: EOG Art. 11 Abs. 1 (Mutter-/Vaterschaft i. V. m. Art. 16e Abs. 2 / 16l), BVG:
// Art. 7 Abs. 2. Ein vereinbarter 13. Monatslohn gehört dazu. Darum:
// - als Netto hinterlegt → nicht vorbefüllen (falsche Basis), der Rechner zeigt einen Hinweis;
//   so macht es der ALV-Rechner seit jeher.
// - 13. Monatslohn «Ja» → ×13, sonst ×12.
// Leer, wenn kein Monatslohn erfasst ist.
// - Ohne gewählte Einkommensart → nicht vorbefüllen, der Rechner sagt warum. Vorher galt der Lohn
//   hier als brutto und im Sozialhilfe-Rechner als netto — dieselbe leere Angabe, zwei Auslegungen
//   (Predeploy-Gate 25.09.2026). Eine geratene Basis liegt in einem der Rechner immer falsch.

import { hauptlohnMonate } from './dreizehnter.js';

// Die eine Stelle, an der die Basis des Hauptlohns gelesen wird — ALV, EO, AHV/BVG und
// Sozialhilfe fragen alle hier: 'brutto' | 'netto' | null (nicht gewählt).
export const lohnBasis = (finanzen) =>
  finanzen?.incomeType === 'brutto' || finanzen?.incomeType === 'netto' ? finanzen.incomeType : null;

export const lohnIstNetto = (finanzen) => lohnBasis(finanzen) === 'netto';

// Lohn erfasst, Art offen → Hinweis am Feld statt Vorbefüllung.
export const lohnBasisOffen = (finanzen) => lohnBasis(finanzen) === null && Number(finanzen?.monthlyIncome) > 0;

export function jahreslohnAusProfil(finanzen) {
  if (lohnBasis(finanzen) !== 'brutto') return '';
  const m = Number(finanzen?.monthlyIncome);
  if (!Number.isFinite(m) || m <= 0) return '';
  return String(Math.round(m * hauptlohnMonate(finanzen?.dreizehnter)));
}
