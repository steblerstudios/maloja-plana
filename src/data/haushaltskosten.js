// Geteilte Ausgaben-Summe — die monatlichen Haushaltsausgaben für die Dashboard-Tankanzeige,
// ohne die Budget-Rechnung (budgetSync.js → Kantonsdaten) ins Startbündel zu ziehen.
// MUSS dieselbe Summe liefern wie `calculateMonthlyBudget(...).totalExpenses` — der Test
// `haushaltskosten.test.js` prüft das. (Bis 28.09.2026 stand hier «Gleiche Felder wie die
// Budget-Bilanz», es fehlten aber Hypothek, Gebäudeversicherung und 3a.)
// Seit 25.10.2026 aus der einen Monatsrechnung (utils/monatsrechnung.js, klein, ohne Kantonsdaten):
// vorher eine eigene Liste, die negative Beträge mitzählte und «Hypothek/Versicherung: Nein» nicht
// kannte (Fachprüfung Prämien-Fundament).
import { sumAllExpenses } from '../utils/monatsrechnung.js';

export function monthlyExpenses(data = {}) {
  return sumAllExpenses(data.finanzen, data);
}
