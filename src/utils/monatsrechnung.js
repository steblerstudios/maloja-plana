// Monatliche Einnahmen und Ausgaben — EINE Rechnung für das Kapitel Finanzen
// («Jeden Monat bleiben», Spiegel-Satz «Es bleiben CHF …»), den Geldfluss und die Budget-Seite.
//
// Bis 21.10.2026 rechnete Charts eigen: es zählte den BVG-Beitrag (steckt schon im
// Nettolohn), die Haftpflicht-*Versicherungssumme* und die Hausrat-/Fahrzeug-*Jahres*prämien
// als monatliche Ausgaben. Im Beispiel: Charts «Ausgaben 4'197», Kapitel «3'720».
// Entscheid Stebler Studios 21.10.2026: Charts rechnet wie das Kapitel. Monatsprämien
// weiterer Versicherungen gehören ins Finanzen-Feld «Weitere Versicherungen».
//
// Bis 24.10.2026 (Fassung 6, Gesamtbericht 🔴 1) fehlten hier der eigene Nebenerwerb und die
// Ausgaben Kinderbetreuung, Hypothek, Gebäudeversicherung und Säule 3a, die das Budget zählte:
// 3'000 Lohn + 1'500 Nebenerwerb, 3'600 Ausgaben ergab im Kapitel «Es fehlen CHF 600», im Budget
// «+900». Entscheid Stebler Studios 24.10.2026: beide Zeilen bleiben (finanzen-fusion.md,
// Entscheid 1), aber nur das Einkommen von Partner/in trennt sie. Darum stehen die Ausgabenposten
// jetzt hier, und budgetSync.js liest sie von hier.

import { haushaltsEinnahmen } from '../data/haushaltsEinnahmen.js';

const n = (v) => Number(v) || 0;

// Alle monatlichen Ausgabenposten, wie sie die Budget-Seite als Zeilen zeigt. AHV und BVG
// fehlen bewusst: sie sind schon vom Nettolohn abgezogen (budgetSync.js führt sie nur als
// Referenz). Jahresbeträge (Gebäudeversicherung, Säule 3a) sind durch 12 geteilt.
export function monatsAusgaben(profilDaten) {
  const data = profilDaten || {};
  return {
    rent: n(data.wohnen?.rentAmount),
    utilities: n(data.wohnen?.utilities),
    mortgage: n(data.wohnen?.mortgagePayment),
    buildingsInsurance: n(data.wohnen?.buildingsInsurance) / 12,
    healthInsurance: n(data.versicherungen?.kkPremium),
    otherInsurance: n(data.finanzen?.otherInsurance),
    groceries: n(data.finanzen?.groceries),
    communication: n(data.finanzen?.communication),
    childcare: n(data.finanzen?.childcare),
    mobility: n(data.finanzen?.mobility),
    tax: n(data.finanzen?.monthlyTax),
    pension3a: n(data.finanzen?.pension3a) / 12,
    debtPayments: n(data.finanzen?.debtPayments),
    alimentePaid: n(data.finanzen?.alimentePaid),
  };
}

const summe = (o) => Object.values(o).reduce((a, b) => a + b, 0);

// `allData` ist das ganze Profil; `finanzen` darf der gerade bearbeitete Stand des Kapitels sein.
const profil = (finanzen, allData) => ({ ...(allData || {}), finanzen: finanzen || allData?.finanzen || {} });

// Erfasste Lebenskosten: alles ausser Schuldenraten und bezahlten Alimenten.
export function sumExpenses(finanzen, allData) {
  const { debtPayments, alimentePaid, ...leben } = monatsAusgaben(profil(finanzen, allData));
  return summe(leben);
}

// Alles, was monatlich abgeht: die Lebenskosten plus Schuldenraten und bezahlte Alimente.
export function sumAllExpenses(finanzen, allData) {
  return summe(monatsAusgaben(profil(finanzen, allData)));
}

// Eigene Einnahmen: Lohn, Nebenerwerb, Familienzulagen, erhaltene Alimente — dieselbe Summe wie
// data/haushaltsEinnahmen.js, nur ohne Partner/in (das trennt die Haushalts-Zeile).
// `brutto`: ein eigener Lohn ist ausdrücklich brutto erfasst; der Rest liegt dann so nicht auf dem Konto.
export function eigeneEinnahmen(finanzen) {
  const e = haushaltsEinnahmen({ finanzen: finanzen || {} });
  return { total: e.total, brutto: e.bruttoDabei };
}

export function sumTotalIncome(finanzen) {
  return eigeneEinnahmen(finanzen).total;
}
