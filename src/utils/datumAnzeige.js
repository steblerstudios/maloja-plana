// Ein Kalenderdatum anzeigen — in der App-Sprache, nicht in der des Browsers, und lokal gelesen:
// new Date('2027-03-31') ist UTC-Mitternacht und kippt westlich von Greenwich auf den Vortag.
// Seitenrundgang 26.10.2026: drei Stellen formatierten je selbst (Dashboard-Frist, «Zuletzt gesichert»,
// Geburtsdatum auf der Portemonnaie-Karte), eine davon ohne Rückfall bei fehlender Sprache.
// rm wie im Kapitel Behörden (components/BehoerdenInstrument.jsx) mit de-CH: nicht jeder Browser kennt
// eine rätoromanische Datumsform, und auf einer Seite sollen nicht zwei Stile stehen.

const LOCALE = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en-GB', rm: 'de-CH' };

export const datumLocale = (lang) => LOCALE[lang] || 'de-CH';

const LANG = { day: 'numeric', month: 'long', year: 'numeric' };

// «2027-03-31» (auch mit Uhrzeit dahinter) → «31. März 2027». Kein ISO-Datum → Rohwert zurück.
export function kalenderdatum(iso, lang, optionen = LANG) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return iso || '';
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).toLocaleDateString(datumLocale(lang), optionen);
}

// Ein Zeitpunkt (z. B. ISO mit Uhrzeit aus toISOString) als Datum in der App-Sprache. Ungültig → null.
export function zeitpunktDatum(wert, lang, optionen = LANG) {
  const d = new Date(wert);
  if (wert == null || wert === '' || isNaN(d.getTime())) return null;
  return d.toLocaleDateString(datumLocale(lang), optionen);
}
