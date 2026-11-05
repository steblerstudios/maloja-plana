import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { kantoneBelegtSimulieren, musterKanton } from '../config/__tests__/ipvBelegtSimulieren.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// Predeploy 05.11.2026 (Fach- und Rechtsprüfung, #684): Ist der Lohn brutto erfasst, rechnet die IPV
// mit einem geschätzten Nettolohn. Der Regler zeigt aber den Bruttobetrag. Darum muss unter dem Regler
// stehen, dass geschätzt wird, und mit welchem Netto. Bei netto erfasstem Lohn steht nichts.
// Der Regler erscheint nur bei amtlich belegtem Kanton (E9), darum GE als belegter Muster-Kanton.

let zurueckMuster;
let zurueckBeleg;
beforeAll(() => { zurueckMuster = musterKanton('GE'); zurueckBeleg = kantoneBelegtSimulieren(['GE']); });
afterAll(() => { zurueckBeleg(); zurueckMuster(); });

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);

const profil = (incomeType) => ({
  basis: { canton: 'GE', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 3000, incomeType },
  wohnen: { rentAmount: 1400 },
  versicherungen: { kkPremium: 420 },
});
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data }));

describe('IPV: geschätzter Nettolohn ist sichtbar', () => {
  it('brutto erfasst: Hinweis mit einem Netto unter dem Bruttobetrag, mit dem Regler verknüpft', () => {
    const html = render(profil('brutto'));
    expect(html).toContain('id="ipv-regler"');
    const m = html.match(/<p id="ipv-netto-geschaetzt"[^>]*>premium\.nettoGeschaetzt\(([^)]*)\)<\/p>/);
    expect(m).not.toBeNull();
    const netto = Number(m[1].replace(/[^\d]/g, ''));
    expect(netto).toBeGreaterThan(0);
    expect(netto).toBeLessThan(3000);
    expect(html).toContain('aria-describedby="ipv-netto-geschaetzt"');
  });

  it('nur der Nebenerwerb brutto: kein Hinweis, der Hauptlohn ist nicht geschätzt (Rechtsprüfung 05.11.)', () => {
    const p = profil('netto');
    p.finanzen = { ...p.finanzen, sideIncome: 800, sideIncomeType: 'brutto' };
    const html = render(p);
    expect(html).toContain('id="ipv-regler"');
    expect(html).not.toContain('premium.nettoGeschaetzt');
  });

  it('netto erfasst: kein Hinweis', () => {
    const html = render(profil('netto'));
    expect(html).toContain('id="ipv-regler"');
    expect(html).not.toContain('premium.nettoGeschaetzt');
    expect(html).not.toContain('ipv-netto-geschaetzt');
  });
});
