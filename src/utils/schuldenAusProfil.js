import { calculateMonthlyBudget } from '../budgetSync.js';

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

// - Monatsrate für den Abbau-Plan (27.09.2026, Auftrag Stebler Studios: «soll automatisch aus
//   unserem Budget errechnet werden»). Gleiche Zahlen wie die Budget-Ansicht (calculateMonthlyBudget).
//   Vorschlag = Einnahmen − Ausgaben OHNE die heutigen Schuldenraten (die fliessen ja schon in
//   Schulden), abgerundet auf 10 Franken. Nur auf GLEICHER BASIS: Das Budget rechnet mit dem Lohn
//   als netto — steht er als brutto oder ohne Angabe da, kein Vorschlag (wie FinanzUebersicht bei
//   der Armutsgrenze). Ohne Miete/Hypothek, Krankenkasse und Lebensmittel wäre fast alles «frei»
//   → kein Vorschlag, sondern der Hinweis, was fehlt. Der 13. Monatslohn zählt nicht mit (das
//   Budget ist ×12). Keine Reserve eingerechnet — darum rät der Text, die Rate tiefer anzusetzen.
export function rateAusBudget(data) {
  const f = data?.finanzen || {};
  const n = (v) => { const x = Number(v); return Number.isFinite(x) ? x : 0; };
  const lohn = n(f.monthlyIncome);
  if (!(lohn > 0)) return { grund: 'keinEinkommen' };
  if (f.incomeType !== 'netto') return { grund: 'keinNetto' };
  const b = calculateMonthlyBudget(data, (k) => k);
  const e = b.expenses || {};
  const fehlend = [];
  if (!(n(e.rent) > 0 || n(e.mortgage) > 0)) fehlend.push('wohnen');
  if (!(n(e.healthInsurance) > 0)) fehlend.push('krankenkasse');
  if (!(n(e.groceries) > 0)) fehlend.push('lebensmittel');
  if (fehlend.length) return { grund: 'unvollstaendig', fehlend };
  const ausgabenOhneRaten = n(b.totalExpenses) - n(e.debtPayments);
  const frei = n(b.income) - ausgabenOhneRaten;
  if (!(frei >= 10)) return { grund: 'nichtsUebrig', einnahmen: n(b.income), ausgaben: ausgabenOhneRaten };
  // Rechts-Prüfer 27.09.: eher zu hoch als vorsichtig — ohne Reserve, Steuern fehlen oft, und die
  // heutigen Schuldenraten können Raten für Schulden ausserhalb der Liste enthalten. Kein Abzug
  // erfunden, sondern offen gesagt: steuerFehlt / heutigeRaten steuern zusätzliche Hinweise.
  return {
    grund: 'ok', vorschlag: Math.floor(frei / 10) * 10, einnahmen: n(b.income), ausgaben: ausgabenOhneRaten,
    steuerFehlt: !(n(e.tax) > 0), heutigeRaten: n(e.debtPayments),
  };
}
