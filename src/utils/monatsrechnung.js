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
//
// Nachtrag 25.10.2026 (Entscheid Stebler Studios 24.10.2026, gebaut Fassung 6): **erfasste
// Versicherungsprämien gehören ins Budget** — die Hausrat-Prämie (`householdInsuranceAmount`) und
// die neue Haftpflicht-Prämie (`liabilityPremium`), beide Jahresbeträge ÷ 12. Das ersetzt die Regel
// vom 21.10. für diese zwei; «Weitere Versicherungen» (`otherInsurance`) bleibt für den Rest
// (Rechtsschutz, KK-Zusatz …). Die Haftpflicht-*Versicherungssumme* (`liabilityAmount`) zählt nie.
// Doppelt erfasst (Hausrat auch in «Weitere Versicherungen») wird nicht still abgezogen — das
// Kapitel Finanzen zeigt dann einen Hinweis (Fachprüfung 25.10.2026).
// Die Fahrzeugversicherung (`autoInsuranceAmount`) zählt bewusst NICHT: «Mobilität» darf laut
// Hinweis die Autokosten schon enthalten. Das wäre ein eigener Entscheid.

import { haushaltsEinnahmen } from '../data/haushaltsEinnahmen.js';
import { istAngestellt, istLernend } from './anstellung.js';

// Nur positive Beträge zählen — wie die Einnahmen (data/haushaltsEinnahmen.js); ein negativer
// Eintrag soll die Ausgaben nicht still verkleinern (Fachprüfung Fassung 6).
const n = (v) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : 0; };

// Selbständige zahlen AHV und Pensionskasse selbst, es gibt keinen Lohnabzug (Fachprüfung 01.11.2026).
export const zahltBeitraegeSelbst = (finanzen) => finanzen?.employmentType === 'selfEmployed' || finanzen?.employmentType === 'freelance';

// «Schon vom Nettolohn abgezogen» stimmt nur für Angestellte mit netto erfasstem Lohn (dieselbe Regel wie VersicherungenInstrument).
export const beitragsNotizKey = (finanzen) => istAngestellt(finanzen) && finanzen?.incomeType === 'netto' ? 'budgetSync.bvgReferenceNote' : 'budgetSync.bvgNichtGezaehltNote';

// Alle monatlichen Ausgabenposten, wie sie die Budget-Seite als Zeilen zeigt. AHV und BVG von
// Angestellten fehlen bewusst: sie sind schon vom Nettolohn abgezogen (budgetSync.js führt sie nur
// als Referenz). Bei Selbständigen zählen sie. Ohne Anstellungstyp wird nichts angenommen. Jahresbeträge (Gebäudeversicherung, Hausrat, Haftpflicht, Unfall-Zusatz, Leben, Säule 3a) sind durch 12 geteilt.
export function monatsAusgaben(profilDaten) {
  const data = profilDaten || {};
  return {
    rent: n(data.wohnen?.rentAmount),
    utilities: n(data.wohnen?.utilities),
    // «Hypothek vorhanden? Nein»: ein stehengebliebener Betrag zählt nicht (das Feld bleibt sichtbar).
    mortgage: data.wohnen?.mortgageStatus === 'no' ? 0 : n(data.wohnen?.mortgagePayment),
    buildingsInsurance: n(data.wohnen?.buildingsInsurance) / 12,
    healthInsurance: n(data.versicherungen?.kkPremium),
    // Jahresprämien aus dem Kapitel Versicherungen (Nachtrag 25.10.2026 oben). Wie bei der Hypothek:
    // «Versicherung vorhanden? Nein» — ein stehengebliebener Betrag zählt nicht.
    householdInsurance: data.versicherungen?.householdInsurance === 'no' ? 0 : n(data.versicherungen?.householdInsuranceAmount) / 12,
    liabilityInsurance: data.versicherungen?.liabilityInsurance === 'no' ? 0 : n(data.versicherungen?.liabilityPremium) / 12,
    // Prämien aus dem Kapitel Versicherungen, seit 31.10.2026 (F7-K3-6, Stebler Studios «überall die Zahlen»): Zusatz monatlich,
    // Leben und Unfall-Zusatz als Jahresbetrag. Der Unfall-Zusatz nur, wenn selbst bezahlt — das sagt der Hinweis am
    // Feld; ein Abzug vom Lohn steckt schon im Nettolohn wie BVG und AHV.
    // Ohne Namen zählt ein stehengebliebener Betrag nicht (wie «Nein» bei Leben und Unfall-Zusatz).
    kkZusatz: data.versicherungen?.kkZusatz ? n(data.versicherungen?.kkZusatzPremium) : 0,
    uvgZusatz: data.versicherungen?.uvgZusatz === 'no' ? 0 : n(data.versicherungen?.uvgZusatzPremium) / 12,
    lifeInsurance: data.versicherungen?.lifeInsurance === 'no' ? 0 : n(data.versicherungen?.lifeInsurancePremium) / 12,
    otherInsurance: n(data.finanzen?.otherInsurance),
    groceries: n(data.finanzen?.groceries),
    communication: n(data.finanzen?.communication),
    childcare: n(data.finanzen?.childcare),
    mobility: n(data.finanzen?.mobility),
    tax: n(data.finanzen?.monthlyTax),
    pension3a: n(data.finanzen?.pension3a) / 12,
    ahvSelbst: zahltBeitraegeSelbst(data.finanzen) ? n(data.versicherungen?.ahvContribution) / 12 : 0,
    bvgSelbst: zahltBeitraegeSelbst(data.finanzen) ? n(data.versicherungen?.bvgContribution) : 0,
    debtPayments: n(data.finanzen?.debtPayments),
    alimentePaid: n(data.finanzen?.alimentePaid),
  };
}

const summe = (o) => Object.values(o).reduce((a, b) => a + b, 0);

// `allData` ist das ganze Profil; `finanzen` darf der gerade bearbeitete Stand des Kapitels sein.
const profil = (finanzen, allData) => ({ ...(allData || {}), finanzen: finanzen || allData?.finanzen || {} });

// Erfasste Lebenskosten: alles ausser Schuldenraten und bezahlten Alimenten.
// Rente oder Geschäftsgewinn: `monthlyIncome` ist dann kein Lohn, Lohn-Vergleiche und Lohn-Wörter passen nicht.
export const einkommenIstKeinLohn = (data) => !!data?.basis?.household?.isRetired
  || ['retired', 'selfEmployed', 'freelance'].includes(data?.finanzen?.employmentType);

// Der kantonale Mindestlohn gilt für Lohn aus Arbeitsverhältnissen, aber nicht für Lehrverhältnisse:
// GE LIRT Art. 39J · TI LSM Art. 3 · JU RSJU 822.41 Art. 3 al. 2 · NE RSalMin Art. 3 Abs. 2 lit. b (Stand 1.11.2025)
// · BS Regierungsrat in der Antwort an den Grossen Rat: «Lernende fallen nicht unter das kantonale Mindestlohngesetz».
export const mindestlohnNichtAnwendbar = (data) => einkommenIstKeinLohn(data) || istLernend(data?.finanzen);

// Summe der Versicherungen pro Monat, wie sie die Versicherungs-Karte zeigt. `p` = monatsAusgaben().
export const versicherungenSumme = (p) => p.healthInsurance + p.kkZusatz + p.uvgZusatz + p.lifeInsurance + p.householdInsurance + p.liabilityInsurance + p.otherInsurance;

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
