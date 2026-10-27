// Publikumspreis eines erfassten Medikaments aus der Spezialitätenliste (SL) — Entscheid F7-K6-2, 27.10.2026.
// Die Preise kommen aus src/data/medikamentPreise.js (generiert, siehe scripts/build-sl-preise.mjs);
// diese Datei rechnet nur und kennt die Daten nicht, damit sie ohne den grossen Datensatz testbar bleibt.
//
// Passt die erfasste Dosis zu einer Packung (z. B. «50 µg» zu «Tabl 0.05 mg»), zählen nur diese Packungen.
// Ist eine Dosis erfasst, die in der SL nicht vorkommt: kein Preis (Fachprüfung 27.10.2026 — sonst stünde ohne
// Kennzeichnung der Preis einer anderen Stärke da). Ohne erfasste Dosis: alle Packungen des Namens, als Spanne.
// Ohne Treffer in der SL: null — dann zeigt die App keinen Preis.

const FAKTOR = { mg: 1, g: 1000, µg: 0.001, mcg: 0.001, ug: 0.001 };

// «Tabl 0.05 mg» → 0.05 · «Filmtabl 1 g» → 1000 · «50», «µg» → 0.05. Kein Massgewicht (IE, ml, Spanne) → null.
export function dosisInMg(wert, einheit) {
  const zahl = Number(String(wert ?? '').trim().replace(',', '.'));
  const f = FAKTOR[String(einheit || '').toLowerCase()];
  if (!String(wert ?? '').trim() || !Number.isFinite(zahl) || f === undefined) return null;
  return Math.round(zahl * f * 1e6) / 1e6;
}

export function dosisAusForm(form) {
  const m = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|ug|g)\b/i.exec(String(form || ''));
  return m ? dosisInMg(m[1], m[2]) : null;
}

// → { packungen: [[form, packung, chf, selbstbehalt%], …], min, max, selbstbehalt40: 'keine' | 'einige' | 'alle' } | null
export function preisFuer(med, preise) {
  const alle = med && med.name ? preise[med.name] : null;
  if (!alle || !alle.length) return null;
  const soll = dosisInMg(med.dose, med.unit);
  const packungen = soll === null ? alle : alle.filter(([form]) => dosisAusForm(form) === soll);
  if (!packungen.length) return null;
  const chf = packungen.map((p) => p[2]);
  const mit40 = packungen.filter((p) => p[3] === 40).length;
  return {
    packungen,
    min: Math.min(...chf),
    max: Math.max(...chf),
    selbstbehalt40: mit40 === 0 ? 'keine' : mit40 === packungen.length ? 'alle' : 'einige',
  };
}
