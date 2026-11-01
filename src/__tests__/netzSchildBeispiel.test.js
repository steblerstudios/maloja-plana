import { describe, it, expect } from 'vitest';
import { netzSchildTeile } from '../data/netzSchild.js';
import { schildOptionen } from '../data/schutzschild.js';
import { DEMO_DATA } from '../config/demoData.js';

// E-4 (Stebler Studios 01.11.2026): Das Beispiel zeigt eine Lücke, und zwar eine, die keine falsche Angst macht.
describe('Netz-Schild im Beispiel Maria', () => {
  const opts = (v) => ({ ...schildOptionen({ ...DEMO_DATA, versicherungen: v }), finanzen: DEMO_DATA.finanzen, kanton: DEMO_DATA.basis?.canton });
  const v = DEMO_DATA.versicherungen;
  it('Unfall ist «noch nicht eingetragen», alles andere bleibt', () => {
    const { offen } = netzSchildTeile(v, opts(v));
    expect(offen).toEqual(['uvg']);
  });
  it('Haftpflicht und Hausrat weglassen ergäbe in Zürich keine Lücke', () => {
    const ohne = { ...v, uvg: 'employer', householdInsurance: '', liabilityInsurance: '' };
    expect(netzSchildTeile(ohne, opts(ohne)).offen).toEqual([]);
  });
});
