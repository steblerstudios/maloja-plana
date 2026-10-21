// Ist die Steuerfrist aus dem Kapitel Behörden vorbei, während noch etwas offen sein kann?
//
// Bis 21.10.2026 verschwand eine vergangene Frist still aus «Nächste Frist» auf dem
// Dashboard («keine offene»), und das Kapitel zeigte sie nur grau «(vor 22 Tagen)».
// Eine verpasste Frist ist aber das Dringendste, nicht das Unsichtbarste.
//
// «Ausstehende Steuererklärungen: 0» heisst: eingereicht — dann ist das Datum nur noch
// Geschichte und wird nicht gemeldet. Leer oder > 0 heisst: es kann noch etwas offen sein.
// Daten als ISO-Text (JJJJ-MM-TT), Vergleich als Text wie in Dashboard.jsx.
export const steuerfristVorbei = (behoerden, heute) => {
  const frist = behoerden && behoerden.taxFilingDeadline;
  if (!frist || typeof frist !== 'string' || !heute) return false;
  if (!(frist < heute)) return false;
  const offen = behoerden.pendingTaxReturns;
  const zahl = offen === undefined || offen === null ? NaN : Number(String(offen).trim());
  return !(String(offen ?? '').trim() !== '' && zahl === 0);
};
