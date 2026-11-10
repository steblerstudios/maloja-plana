// Abstand bis zum AHV-Referenzalter — für die Instrument-Kachel in der Kapitelzeile Basis (10.11.2026,
// Stebler Studios «alle drei»). Keine neue Rechtsregel: das Referenzalter kommt aus referenzalterMonate
// (data/lohnAbzuege.js, AHV 21 monatsgenau, Frauen JG 1961–63 in 3-Monats-Schritten), dieselbe Quelle wie
// alterUndRentenalter (utils/nettoAusProfil.js). Monatsgenau wie dort: erreicht im Monat des Geburtstags.
// Eigene Datei, damit sie nicht ins Startbündel reist.
import { referenzalterMonate } from '../data/lohnAbzuege.js';

// { monate, jahre, restMonate, referenzMonate, erreicht } oder null ohne gültiges Geburtsdatum.
export function bisReferenzalter(basis, heute = new Date()) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(basis?.dateOfBirth || ''));
  if (!m) return null;
  const jahr = Number(m[1]), monat = Number(m[2]) - 1;
  const g = new Date(jahr, monat, Number(m[3]));
  if (isNaN(g.getTime()) || g.getDate() !== Number(m[3])) return null;
  const referenzMonate = referenzalterMonate({ geschlecht: basis?.gender, geburtsjahr: jahr });
  const monatErreicht = jahr * 12 + monat + referenzMonate;
  const monate = monatErreicht - (heute.getFullYear() * 12 + heute.getMonth());
  return { monate: Math.max(0, monate), jahre: Math.floor(Math.max(0, monate) / 12), restMonate: Math.max(0, monate) % 12, referenzMonate, erreicht: monate <= 0 };
}
