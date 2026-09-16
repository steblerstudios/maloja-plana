// B-1 / Entscheid E22 (16.09.2026): Die Zahlen, die jemand im Schnellcheck (auch
// Schritt 1 des Anspruch-Checks) eintippt, gehen beim Klick auf die
// Prämienverbilligung an den IPV-Rechner mit — als Übergabe, nicht ins Profil.
// Der Schnellcheck verspricht «zum Ausprobieren»; ins Profil geschrieben wird erst
// auf den Knopf «Ins Profil übernehmen» im IPV-Rechner. Reine Logik, kein React.

// Feld der Übergabe → Ort im Profil.
const FELDER = [
  ['monthlyIncome', 'finanzen'],
  ['rentAmount', 'wohnen'],
  ['kkPremium', 'versicherungen'],
];

// Aus dem Probe-Datensatz des Schnellchecks die Übergabe bauen. Nur Zahlen > 0:
// ein leeres Feld heisst «nicht angegeben», nicht «0 ins Profil».
export function uebergabeAusProbe(probe) {
  const out = {};
  for (const [feld, kapitel] of FELDER) {
    const wert = Number(probe && probe[kapitel] && probe[kapitel][feld]) || 0;
    if (wert > 0) out[feld] = wert;
  }
  return Object.keys(out).length ? { schnellcheck: out } : undefined;
}

// Welche Übergabe-Zahlen weichen vom Profil ab? → [[kapitel, feld, wert], …]
export function abweichungen(data, zahlen) {
  if (!zahlen) return [];
  const out = [];
  for (const [feld, kapitel] of FELDER) {
    const wert = Number(zahlen[feld]) || 0;
    if (wert > 0 && wert !== (Number(data && data[kapitel] && data[kapitel][feld]) || 0)) out.push([kapitel, feld, wert]);
  }
  return out;
}

// Die Daten, mit denen der IPV-Rechner rechnet: das Profil, darüber die abweichenden
// Schnellcheck-Zahlen. Das Profil-Objekt selbst bleibt unverändert.
export function mitUebergabe(data, liste) {
  if (!liste.length) return data;
  const out = { ...data };
  for (const [kapitel, feld, wert] of liste) out[kapitel] = { ...(out[kapitel] || {}), [feld]: wert };
  return out;
}
