// Schulden-Manager ↔ Profil — nicht zweimal eingeben.
//
// - Darlehen: «Persönliche Darlehen» (finanzen.loans) steht schon im Kapitel Finanzen. Solange die
//   Schuldenliste leer ist, schlägt das Formular diesen Betrag als Kredit vor (überschreibbar).
//   Sobald eine Schuld erfasst ist, nicht mehr — sonst stünde derselbe Kredit doppelt da.
// - Betreibung: wer hier eine Betreibung erfasst, hat Einträge im Register — auch eine bezahlte
//   bleibt fünf Jahre einsehbar (SchKG Art. 8a Abs. 4), darum zählt der Status nicht. Ein eben
//   angelegter, noch leerer Eintrag (weder Gläubiger noch Betrag) zählt noch nicht. Das Kapitel
//   Behörden bekommt «Einträge vorhanden» — aber nur, wo dort noch nichts oder «Unbekannt» steht.
//   Wie die Querbefüllung in main.jsx überschreibt das nie eine eigene Angabe.

export function darlehenVorschlag(data, schulden) {
  if (Array.isArray(schulden) && schulden.length > 0) return null;
  const n = Number(data?.finanzen?.loans);
  if (!Number.isFinite(n) || n <= 0) return null;
  return { amount: String(Math.round(n)), category: 'kredit' };
}

export function betreibungsStatusNachEintrag(status, betreibung) {
  if (status && status !== 'unknown') return null;
  const erfasst = (betreibung || []).some(e => e && (String(e.creditor || '').trim() !== '' || Number(e.amount) > 0));
  return erfasst ? 'entries' : null;
}
