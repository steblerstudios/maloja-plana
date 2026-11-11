// Arbeitsverhältnis aus dem Stellenantritt (Kapitel Ausbildung & Arbeit, `employmentStart`) — für die
// Instrument-Kachel «Dienstjahre» (10.11.2026, Stebler Studios «Dienstjahre + Kündigungsfrist»).
//
// Gesetzliche Regel, nur wenn Vertrag oder GAV nichts anderes vorsehen:
//   • Probezeit: ohne andere Abrede der erste Monat, Kündigungsfrist 7 Tage (OR Art. 335b Abs. 1).
//   • Danach Kündigungsfrist je auf Ende eines Monats (OR Art. 335c Abs. 1):
//     im 1. Dienstjahr 1 Monat, im 2. bis und mit 9. Dienstjahr 2 Monate, danach 3 Monate.
// Wie in NeuerJob.jsx: der Vertrag kann eine längere Probezeit (bis 3 Monate) und andere Fristen vorsehen.
//
// Eigene Datei, damit nichts davon ins Startbündel reist (nur die nachgeladene Kachel braucht sie).

import { LSE_VOLLZEIT_STUNDEN_WOCHE } from '../data/branchenLohn.js';
import { wochenstundenUnplausibel } from '../data/lohnCheck.js';

const datum = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
  return isNaN(d.getTime()) || d.getDate() !== Number(m[3]) ? null : d;
};

// Volle Monate zwischen zwei Daten (ein angefangener Monat zählt nicht).
const volleMonate = (von, bis) => {
  let n = (bis.getFullYear() - von.getFullYear()) * 12 + (bis.getMonth() - von.getMonth());
  if (bis.getDate() < von.getDate()) n -= 1;
  return Math.max(0, n);
};

// { monate, jahre, dienstjahr, inProbezeit, kuendigungsfristMonate } oder null (ohne gültiges Datum
// oder mit Stellenantritt in der Zukunft).
export function dienstLage(employmentStart, heute = new Date()) {
  const start = datum(employmentStart);
  if (!start) return null;
  const jetzt = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate(), 12);
  if (start > jetzt) return null;
  const monate = volleMonate(start, jetzt);
  const jahre = Math.floor(monate / 12);
  const dienstjahr = jahre + 1;
  const inProbezeit = monate < 1;
  const kuendigungsfristMonate = dienstjahr <= 1 ? 1 : dienstjahr <= 9 ? 2 : 3;
  return { monate, jahre, dienstjahr, inProbezeit, kuendigungsfristMonate };
}

// Eine Rechnung je Wahrheit (Matrix 10.11.2026 §6 Regel 3; Formenlehre §7f): Ferien und Pensum standen bis
// 11.11.2026 inline in InstrumentePanel.jsx. Kachel, Kapitel und Werkzeug rufen ab jetzt diese Funktionen.

// Zahl aus einem Textfeld («22,5» wie «22.5»); leer, ungültig oder negativ → null.
const tageZahl = (v) => {
  const s = String(v ?? '').replace(',', '.').trim();
  const n = Number(s);
  return s !== '' && Number.isFinite(n) && n >= 0 ? n : null;
};

// Ferien (Felder `ferienTageJahr`, `ferienTageBezogen`). «Offen» nur, wenn der Bezug erfasst ist — sonst wird
// kein Stand erfunden. Mehr bezogen als Anspruch: offen 0, das Bild bleibt bei voll.
// { jahr, bezogen, offen, anteilBezogen, anteilOffen } oder null (ohne Anspruch über 0).
export function ferienLage(ferienTageJahr, ferienTageBezogen) {
  const jahr = tageZahl(ferienTageJahr);
  if (!(jahr > 0)) return null;
  const bezogen = tageZahl(ferienTageBezogen);
  if (bezogen == null) return { jahr, bezogen: null, offen: null, anteilBezogen: null, anteilOffen: null };
  const offen = Math.max(0, jahr - bezogen);
  return { jahr, bezogen, offen, anteilBezogen: Math.min(1, bezogen / jahr), anteilOffen: offen / jahr };
}

// Pensum aus den Wochenstunden, gemessen an der Rechenbasis des Lohnvergleichs (LSE 40 Std., BFS) — nicht «die»
// Vollzeit (Fachprüfung 10.11.2026). Ab der Basis «Vollzeit», Anteil nie über 1. Unplausible Stunden (über der
// Obergrenze des Lohn-Checks) zählen nicht. { stunden, basis, anteil, prozent, vollzeit } oder null.
export function pensumLage(workHoursPerWeek) {
  const stunden = Number(String(workHoursPerWeek ?? '').replace(',', '.'));
  if (!(stunden > 0) || wochenstundenUnplausibel(stunden)) return null;
  const basis = LSE_VOLLZEIT_STUNDEN_WOCHE;
  const vollzeit = stunden >= basis;
  const anteil = Math.min(1, stunden / basis);
  return { stunden, basis, anteil, prozent: Math.round(anteil * 100), vollzeit };
}
