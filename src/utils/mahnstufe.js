// Mahnstufe einer offenen Forderung — gebaut 27.09.2026 (Mahnung, Stebler Studios «1-3»).
//
// Drei Stufen, wie sie bei der Person ankommen: Rechnung → Mahnung → Zahlungsbefehl.
// Freiwillige Angabe (leer = keine Angabe); alte Einträge ohne Feld bleiben gültig.
// Die Krankenkassen-«Zahlungsaufforderung» (KVG Art. 64a Abs. 1) zählt zur Stufe Mahnung —
// sie ist noch keine Betreibung. Die Betreibung beginnt erst mit dem Zahlungsbefehl
// (SchKG Art. 38 Abs. 2); dann gilt die 10-Tage-Frist für den Rechtsvorschlag (Art. 74).

export const MAHNSTUFEN = ['rechnung', 'mahnung', 'zahlungsbefehl'];

export const leseStufe = (v) => (MAHNSTUFEN.includes(v) ? v : '');

// Wohin führt der nächste ruhige Schritt? Nur bei offenen Forderungen, nur ab Mahnung.
export function naechsterWeg(debt) {
  if (!debt || debt.status === 'paid') return null;
  const stufe = leseStufe(debt.stufe);
  if (stufe === 'mahnung') return { view: 'mahnung', key: 'schulden.stufe.linkMahnung' };
  if (stufe === 'zahlungsbefehl') return { view: 'betreibung', key: 'schulden.stufe.linkZahlungsbefehl' };
  return null;
}
