// Lebensbereich Finanzen · die Rechnungen (Bauplan Lebensbereich, Entwurf Stebler Studios 20.11.2026).
// Nur Zahlen, keine Bilder. Jede Funktion ruft eine bestehende Rechnung auf — hier wird nichts neu gerechnet.
//   lohnMuenzen    Frage «Wo steht mein Lohn?»       → lohnBandState (data/lohnEinordnung.js)
//   steuerFranken  Frage «Wie viel Steuer?»          → steuernFuerProfil (data/kantonaleSteuerdaten.js)
//   notgroschen    Frage «Wie lange reicht er?»      → reserveTankState (data/reserveTank.js)
//   steuerfrist    Spiegel Behörden (Kalenderblatt)  → behoerden.taxFilingDeadline, wie InstrumentePanel
import { lohnBandState, lohnSpiegel, LOHN_REFERENZ, SCALE_MIN, SCALE_MAX } from '../../data/lohnEinordnung.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../../data/kantonaleSteuerdaten.js';
import { reserveTankState } from '../../data/reserveTank.js';
import { monthlyExpenses } from '../../data/haushaltskosten.js';
import { alterUndRentenalter } from '../../utils/nettoAusProfil.js';
import { steuerfristVorbei } from '../../utils/steuerfrist.js';
import { heuteIso } from '../../utils/fristen.js';

// Die vier Zonen des Lohn-Barometers (LohnEinordnung): unteres Zehntel · unterer · oberer Bereich · oberes Zehntel.
export const LOHN_GRENZEN = [SCALE_MIN, LOHN_REFERENZ.p10, LOHN_REFERENZ.median, LOHN_REFERENZ.p90, SCALE_MAX];

export function lohnMuenzen(data) {
  const f = data?.finanzen || {};
  const netto = Number(f.monthlyIncome) || 0;
  if (!(netto > 0)) return { show: false };
  const { bvgAlter, rentenalter, beitragsfrei } = alterUndRentenalter(data?.basis);
  const st = lohnBandState({
    income: f.monthlyIncome, canton: data?.basis?.canton, hoursPerWeek: data?.ausbildung?.workHoursPerWeek,
    incomeType: f.incomeType, dreizehnter: f.dreizehnter, alter: bvgAlter, rentenalter, beitragsfrei,
  });
  const spiegel = lohnSpiegel(st, data, { alter: bvgAlter, rentenalter, beitragsfrei });
  const v = st.show && st.comparable ? st.incomeVergleich : 0;
  // Je Zone, wie weit sie gefüllt ist (0–1). Ohne vergleichbaren Lohn bleibt alles leer: dann nur die Zahl.
  const fuell = [0, 1, 2, 3].map((i) => (v > 0 ? Math.max(0, Math.min(1, (v - LOHN_GRENZEN[i]) / (LOHN_GRENZEN[i + 1] - LOHN_GRENZEN[i]))) : 0));
  return { show: true, netto, brutto: spiegel ? spiegel.brutto : null, fuell, vergleichbar: v > 0, median: LOHN_REFERENZ.median };
}

export function steuerFranken(data) {
  const f = data?.finanzen || {};
  if (!((Number(f.monthlyIncome) || 0) > 0)) return null;
  try {
    const st = steuernFuerProfil(steuerEingabenAusDaten(data));
    if (!st?.bund || !st.kanton?.kantonal) return null;
    const total = st.kanton.kantonal.total;
    const bund = Math.round(st.bund.steuer);
    // Gemessen am erfassten Monatslohn × 12 (ohne 13., wie der Monatsring; netto oder brutto, wie erfasst), für die Münzen: eine Münze = 1 %.
    const jahr = (Number(f.monthlyIncome) || 0) * 12;
    return { total, bund, monat: Math.round(total / 12), bundAnteil: total > 0 ? bund / total : 0,
      anteilEinkommen: jahr > 0 ? total / jahr : 0, bundAnteilEinkommen: jahr > 0 ? bund / jahr : 0 };
  } catch { return null; }
}

export function notgroschen(data) {
  return reserveTankState({ savings: Number(data?.finanzen?.savingsAccount) || 0, monthlyExpenses: monthlyExpenses(data) });
}

export function steuerfrist(data, heute = heuteIso()) {
  const frist = data?.behoerden?.taxFilingDeadline;
  if (!frist) return null;
  return frist >= heute || steuerfristVorbei(data.behoerden, heute) ? { iso: frist, vorbei: frist < heute } : null;
}
