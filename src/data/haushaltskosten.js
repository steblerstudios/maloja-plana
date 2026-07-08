// Geteilte Ausgaben-Summe — EINE Quelle für die monatlichen Haushaltsausgaben,
// damit Finanzübersicht und Dashboard-Instrumente (Tankanzeige) nie auseinander-
// laufen. Gleiche Felder wie die Budget-Bilanz: Wohnen + KK-Prämie + Finanzen.
export function monthlyExpenses(data = {}) {
  const n = (v) => { const x = Number(v); return Number.isFinite(x) ? x : 0; };
  const f = data.finanzen || {};
  return n(data.wohnen?.rentAmount) + n(data.wohnen?.utilities) + n(data.versicherungen?.kkPremium)
    + n(f.groceries) + n(f.communication) + n(f.mobility) + n(f.childcare)
    + n(f.otherInsurance) + n(f.monthlyTax) + n(f.debtPayments) + n(f.alimentePaid);
}
