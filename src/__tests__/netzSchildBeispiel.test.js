import { describe, it, expect } from 'vitest';
import { netzSchildTeile } from '../data/netzSchild.js';
import { schildOptionen } from '../data/schutzschild.js';
import { DEMO_DATA } from '../config/demoData.js';

// E-4 (Stebler Studios 01.11.2026): Das Beispiel zeigt einen leeren Teil, ohne eine Lücke zu behaupten.
describe('Netz-Schild im Beispiel Maria', () => {
  const opts = (v) => ({ ...schildOptionen({ ...DEMO_DATA, versicherungen: v }), finanzen: DEMO_DATA.finanzen, kanton: DEMO_DATA.basis?.canton });
  const v = DEMO_DATA.versicherungen;
  it('Leben ist leer und zählt nicht als Lücke, alle Pflicht ist eingetragen', () => {
    const { teile, offen } = netzSchildTeile(v, opts(v));
    expect(offen).toEqual([]);
    expect(teile.find((t) => t.key === 'leben')).toMatchObject({ n: 0, erreicht: 0 });
  });
});
