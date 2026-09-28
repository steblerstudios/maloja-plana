// Geteilte Ausgaben-Summe — die monatlichen Haushaltsausgaben für die Dashboard-Tankanzeige,
// ohne die Budget-Rechnung (budgetSync.js → Kantonsdaten) ins Startbündel zu ziehen.
// MUSS dieselbe Summe liefern wie `calculateMonthlyBudget(...).totalExpenses` — der Test
// `haushaltskosten.test.js` prüft das. (Bis 28.09.2026 stand hier «Gleiche Felder wie die
// Budget-Bilanz», es fehlten aber Hypothek, Gebäudeversicherung und 3a.)
// Jahresbeträge (Gebäudeversicherung, 3a-Einzahlung) wie im Budget ÷ 12.
export function monthlyExpenses(data = {}) {
  const n = (v) => { const x = Number(v); return Number.isFinite(x) ? x : 0; };
  const f = data.finanzen || {};
  const w = data.wohnen || {};
  return n(w.rentAmount) + n(w.utilities) + n(w.mortgagePayment) + n(w.buildingsInsurance) / 12
    + n(data.versicherungen?.kkPremium)
    + n(f.groceries) + n(f.communication) + n(f.mobility) + n(f.childcare)
    + n(f.otherInsurance) + n(f.monthlyTax) + n(f.pension3a) / 12 + n(f.debtPayments) + n(f.alimentePaid);
}
