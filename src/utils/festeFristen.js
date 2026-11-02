// Fristen, die die App kennt, ohne dass jemand eine Erinnerung angelegt hat (F8-D1 bis D3, 02.11.2026).
// Wegweiser und «Was ansteht» lesen dieselbe Liste. Rein, damit testbar; `heute` ist ISO-Text.
import { offenePosten } from './offenePosten.js';
import { werktagAmOderDavor } from './fristen.js';

// KVG Art. 7 Abs. 2: Eingang bei der Kasse bis 30. November, auf dem Werktag davor nach BAG (fristen.js).
// Das Fenster beginnt mit dem spätesten Versand der Prämienmitteilung, dem 31. Oktober (BAG, priminfo).
export const kvgFristImFenster = (data, heute) => {
  const v = data?.versicherungen;
  if (!v?.kkInsurer && !(Number(v?.kkPremium) > 0)) return null;
  const jahr = heute.slice(0, 4);
  const frist = werktagAmOderDavor(jahr + '-11-30');
  return heute >= jahr + '-10-31' && heute <= frist ? frist : null;
};

export const festeFristen = (data, heute) => {
  const kvg = kvgFristImFenster(data, heute);
  const steuer = data?.behoerden?.taxFilingDeadline;
  return [
    kvg && { key: 'kvg', iso: kvg, kategorie: 'insurance' },
    steuer && steuer >= heute && { key: 'steuer', iso: steuer, kategorie: 'finance' },
  ].filter(Boolean);
};

// Arztrechnungen mit abgelaufener Zahlungsfrist. Null, wenn nichts offen ist.
export const ueberfaelligeRechnungen = (data, heute) => {
  const faellig = offenePosten(data, heute).arzt.filter((b) => b.abgelaufen);
  if (faellig.length === 0) return null;
  return { anzahl: faellig.length, summe: faellig.reduce((a, b) => a + Math.round(b.betrag * 100), 0) / 100 };
};
