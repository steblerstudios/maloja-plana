// Monatliche Einnahmen und Ausgaben — eine Rechnung für das Kapitel Finanzen
// (Spiegel-Satz «Es bleiben CHF …») und Charts.
//
// Bis 21.10.2026 rechnete Charts eigen: es zählte den BVG-Beitrag (steckt schon im
// Nettolohn), die Haftpflicht-*Versicherungssumme* und die Hausrat-/Fahrzeug-*Jahres*prämien
// als monatliche Ausgaben. Im Beispiel: Charts «Ausgaben 4'197», Kapitel «3'720».
// Entscheid Stebler Studios 21.10.2026: Charts rechnet wie das Kapitel. Monatsprämien
// weiterer Versicherungen gehören ins Finanzen-Feld «Weitere Versicherungen».
//
// Diese zwei Funktionen standen vorher unverändert in MirrorCards.jsx.

const n = (v) => Number(v) || 0;

// Erfasste Lebenskosten: Steuern, Lebensmittel, Telefon, Mobilität, weitere Versicherungen,
// dazu Miete + Nebenkosten (Wohnen) und KK-Prämie (Versicherungen).
export function sumExpenses(finanzen, allData) {
  const f = finanzen || {};
  let sum = 0;
  ['monthlyTax', 'groceries', 'communication', 'mobility', 'otherInsurance'].forEach((k) => { sum += n(f[k]); });
  sum += n(allData?.wohnen?.rentAmount);
  sum += n(allData?.wohnen?.utilities);
  sum += n(allData?.versicherungen?.kkPremium);
  return sum;
}

// Alles, was monatlich abgeht: die Lebenskosten plus Schuldenraten und bezahlte Alimente.
export function sumAllExpenses(finanzen, allData) {
  const f = finanzen || {};
  return sumExpenses(f, allData) + n(f.debtPayments) + n(f.alimentePaid);
}

// Einnahmen: Lohn, Familienzulagen, erhaltene Alimente.
export function sumTotalIncome(finanzen) {
  const f = finanzen || {};
  return n(f.monthlyIncome) + n(f.familienzulagen) + n(f.alimenteReceived);
}
