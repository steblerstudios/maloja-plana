// Der Geldfluss rechnet wie das Kapitel Finanzen (Entscheid Stebler Studios 21.10.2026, damals für
// die Charts-Seite). Vorher: Charts zählte BVG (steckt im Nettolohn), die Haftpflicht-
// Versicherungssumme und Hausrat-/Fahrzeug-Jahresprämien als Monatsausgaben (4'197 statt 3'720).
// Seit 24.10.2026 gibt es die Charts-Seite nicht mehr (#/charts → Kapitel Finanzen, Auswertung);
// dieselben Regeln gelten jetzt für den Geldfluss dort (components/Geldfluss.jsx).
import { describe, it, expect } from 'vitest';
import { geldflussDaten } from '../components/Geldfluss.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import { sumAllExpenses, sumTotalIncome } from '../utils/monatsrechnung.js';
import de from '../i18n/de.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => {
  const w = k.split('.').reduce((o, teil) => (o && typeof o === 'object' ? o[teil] : undefined), de);
  return typeof w === 'string' ? w : (w && w.sie) || k;
};
const summe = (l) => l.reduce((a, x) => a + x.value, 0);
const rest = (ziele) => (ziele.find((z) => z.label === de.budgetSync.remaining) || { value: 0 }).value;
const ausgaben = (ziele) => summe(ziele) - rest(ziele);

describe('Geldfluss rechnet wie das Kapitel Finanzen', () => {
  it('Beispiel Maria: Ausgaben und Rest wie im Kapitel', () => {
    const aus = sumAllExpenses(DEMO_DATA.finanzen, DEMO_DATA);
    const ein = sumTotalIncome(DEMO_DATA.finanzen);
    const { ziele } = geldflussDaten(DEMO_DATA, t, palette);
    expect(ausgaben(ziele)).toBe(aus);
    expect(rest(ziele)).toBe(ein - aus);
  });

  it('BVG ist keine Ausgabe', () => {
    const { ziele } = geldflussDaten(DEMO_DATA, t, palette);
    expect(ziele.map((z) => z.label)).not.toContain('BVG');
  });

  // Bis 25.10.2026 prüfte dieser Test, dass auch die Hausrat-Prämie (240 / Jahr) NICHT zählt (Regel vom
  // 21.10.). Seit dem Entscheid vom 24.10. («erfasste Versicherungsprämien gehören ins Budget», gebaut
  // 25.10.) zählen Hausrat- und Haftpflicht-Prämie ÷ 12. Die Versicherungssumme und die Fahrzeug-
  // versicherung zählen weiter nicht (Fahrzeug: «Mobilität» kann sie enthalten, eigener Entscheid).
  it('Haftpflicht-Versicherungssumme und Fahrzeugversicherung zählen nicht; Hausrat und Haftpflicht-Prämie ÷ 12', () => {
    const data = {
      finanzen: { monthlyIncome: '5000', groceries: '400' },
      versicherungen: { liabilityAmount: '5000000', liabilityPremium: '120', householdInsuranceAmount: '240', autoInsuranceAmount: '900' },
    };
    const { ziele } = geldflussDaten(data, t, palette);
    // 400 + 240/12 + 120/12 = 430
    expect(ausgaben(ziele)).toBe(430);
    expect(rest(ziele)).toBe(4570);
  });

  it('Familienzulagen und bezahlte Alimente zählen wie im Kapitel', () => {
    const data = { finanzen: { monthlyIncome: '4000', familienzulagen: '430', alimentePaid: '600', groceries: '500' } };
    const { quellen, ziele } = geldflussDaten(data, t, palette);
    expect(summe(quellen)).toBe(4430);
    expect(ausgaben(ziele)).toBe(1100);
    expect(rest(ziele)).toBe(3330);
  });
});
