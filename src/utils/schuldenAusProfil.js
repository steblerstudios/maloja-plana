// Schulden-Manager ↔ Profil — nicht zweimal eingeben.
//
// - Darlehen: «Persönliche Darlehen» (finanzen.loans) steht schon im Kapitel Finanzen. Solange die
//   Schuldenliste leer ist, schlägt das Formular diesen Betrag als Kredit vor (überschreibbar).
//   Sobald eine Schuld erfasst ist, nicht mehr — sonst stünde derselbe Kredit doppelt da.
// - Betreibung: eine erfasste Betreibung KANN im Register stehen — muss aber nicht. Dritte
//   erfahren nichts mehr, wenn sie z. B. zurückgezogen wurde (SchKG Art. 8a Abs. 3, häufig nach
//   der Zahlung) oder das Verfahren seit fünf Jahren abgeschlossen ist (Abs. 4). Darum setzt der
//   Schulden-Manager den Registerstand im Kapitel Behörden NICHT selbst, sondern weist darauf hin,
//   solange dort nichts, «Unbekannt» oder «Keine Einträge» steht. Ein eben angelegter, noch
//   leerer Eintrag (weder Gläubiger noch Betrag) zählt noch nicht.

export function darlehenVorschlag(data, schulden) {
  if (Array.isArray(schulden) && schulden.length > 0) return null;
  const n = Number(data?.finanzen?.loans);
  if (!Number.isFinite(n) || n <= 0) return null;
  return { amount: String(Math.round(n)), category: 'kredit' };
}

export function betreibungsHinweis(status, betreibung) {
  if (status === 'entries') return false;
  return (betreibung || []).some(e => e && (String(e.creditor || '').trim() !== '' || Number(e.amount) > 0));
}
