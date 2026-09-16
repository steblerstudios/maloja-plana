// ─── Steuerkanton (E23/K33) ──────────────────────────────────
// Welcher Kanton für Steuern gilt: behoerden.cantoneOfTaxation → alter Schlüssel
// canton → Wohnkanton basis.canton. Eigene kleine Datei, damit OfficialLinkBox und
// FinanzUebersicht sie nutzen können, ohne den ganzen Steuerrechner mitzuladen.
// Gleiches Verhalten wie steuerkantonVorbelegung in TaxCalculator.jsx (PR #165).
export const steuerkantonVorbelegung = (data) =>
  data?.behoerden?.cantoneOfTaxation || (typeof data?.canton === 'string' ? data.canton : '') || data?.basis?.canton || '';
