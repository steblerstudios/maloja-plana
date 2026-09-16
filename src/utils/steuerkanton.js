// ─── Steuerkanton (E23/K33) ──────────────────────────────────
// Welcher Kanton für Steuern gilt: behoerden.cantoneOfTaxation → alter Schlüssel
// canton → Wohnkanton basis.canton. Eigene kleine Datei, damit OfficialLinkBox und
// FinanzUebersicht sie nutzen können, ohne den ganzen Steuerrechner mitzuladen.
// TaxCalculator.jsx importiert sie von hier und exportiert sie weiter (E38, vorher eigene Fassung aus PR #165).
export const steuerkantonVorbelegung = (data) =>
  data?.behoerden?.cantoneOfTaxation || (typeof data?.canton === 'string' ? data.canton : '') || data?.basis?.canton || '';
